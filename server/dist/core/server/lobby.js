"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("~/core/config");
const constants_1 = require("~/core/constants");
const logger_1 = require("~/core/logger");
const utils_1 = require("~/utils");
const clients_1 = require("../clients");
const game_1 = require("../game");
const updater_1 = require("../updater");
const lobby_room_serial_1 = require("./lobby-room-serial");
const lobby_room_threaded_1 = require("./lobby-room-threaded");
// external imports
const larkWebsocket = require("lark-websocket");
const lodash_1 = require("lodash");
const net = require("net");
const path_1 = require("path");
const querystring = require("querystring");
const readline = require("readline");
const sanitize_1 = require("~/core/sanitize");
const ws = larkWebsocket;
const GAMES_DIR = path_1.join(__dirname, "../../games/");
const RoomClass = config_1.Config.SINGLE_THREADED
    ? lobby_room_serial_1.SerialRoom
    : lobby_room_threaded_1.ThreadedRoom;
/*
    Clients connect like this:
    Lobby -> Room -> [new thread] -> Session
*/
/**
 * The server that clients initially connect to before being moved to their
 * game lobby.
 *
 * Basically creates and manages game sessions.
 */
class Lobby {
    /**
     * Initializes the Lobby that listens for new clients.
     * There should only be 1 Lobby per program running at a time.
     */
    constructor() {
        /** All the namespaces for games we can play, indexed by gameName. */
        this.gameNamespaces = new Map();
        /** The logger instance that manages game logs. */
        this.gamelogManager = new game_1.GamelogManager();
        /** Next number to use for wildcard game sessions. */
        this.nextRoomNumber = 1;
        /** If we are shutting down, to prevent new games from connecting. */
        this.isShuttingDown = false;
        /** All the clients connected, but not yet in a Room. */
        this.clients = new Set();
        /** All the Rooms we currently have with clients in them. */
        this.rooms = new Map();
        /** All the Rooms that are actually running a game at the moment. */
        this.roomsPlaying = new Map();
        /** A mapping of a client to the room they are in.  */
        this.clientsRoom = new Map();
        /** A mapping of game aliases to their name (id). */
        this.gameAliasToName = new Map();
        /** The Node.js listener servers that accept new clients. */
        this.listenerServers = [];
        this.gamesInitializedPromise = new Promise(async (resolve) => {
            // Purposely wait for games to initialize before listeners
            await this.initializeGames();
            await Promise.all([
                this.initializeListener(config_1.Config.TCP_PORT, net.createServer, clients_1.TCPClient),
                this.initializeListener(config_1.Config.WS_PORT, ws.createServer, clients_1.WSClient),
            ]);
            logger_1.logger.info("🎉 Everything is ready! 🎉");
            resolve();
        }).catch((err) => {
            logger_1.logger.error("Fatal exception initializing games!");
            logger_1.logger.error(String(err));
            process.exit(1); // kills the entire game server
        });
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        // ReadLine: listens for CTRL+C to kill off child threads gracefully
        // (letting their games complete)
        rl.setPrompt("");
        rl.on("SIGINT", () => this.shutDown());
        if (config_1.Config.UPDATER_ENABLED) {
            this.updater = new updater_1.Updater();
            this.updater.events.updateFound.on(() => {
                this.shutDown();
            });
        }
    }
    /**
     * Gets, and starts up the lobby singleton, if it has not started already.
     *
     * @returns The Lobby singleton.
     */
    static getInstance() {
        if (!Lobby.instance) {
            Lobby.instance = new Lobby();
        }
        return Lobby.instance;
    }
    /**
     * Gets the session for gameAlias and session id, if it exists
     *
     * @param gameAlias - The name alias of the game for this session
     * @param id - the session id of the gameName
     * @returns the session, if found
     */
    getRoom(gameAlias, id) {
        const gameName = this.getGameNameForAlias(gameAlias);
        if (gameName) {
            const rooms = this.rooms.get(gameName);
            if (rooms) {
                return rooms.get(id);
            }
        }
        else {
            return new Error(`Game name '${gameAlias}' is not a valid game alias.`);
        }
    }
    /**
     * Gets the actual name of an alias for a game, e.g. "checkers" -> "Checkers"
     *
     * @param gameAlias - an alias for the game, not case sensitive
     * @returns the actual game name of the aliased game, or undefined if not valid
     */
    getGameNameForAlias(gameAlias) {
        return this.gameAliasToName.get(gameAlias.toLowerCase());
    }
    /**
     * Gets the game class (constructor) for a given game alias
     *
     * @param gameAlias - an alias for the game you want
     * @returns the game class constructor, if found
     */
    getGameNamespace(gameAlias) {
        const gameName = this.getGameNameForAlias(gameAlias);
        if (gameName) {
            return this.gameNamespaces.get(gameName);
        }
    }
    /**
     * Tries to set up a Room for private arena play with clients.
     *
     * @param data - Data about the Room to setup with.
     * @returns An error string if it could not be validated, otherwise
     * undefined if no error and the Room was successfully created.
     */
    setup(data) {
        const namespace = this.getGameNamespace(data.gameAlias);
        if (!namespace) {
            return `gameName ${data.gameAlias} is valid for any games`;
        }
        const settings = namespace.gameSettingsManager.invalidateSettings(data.gameSettings);
        if (settings instanceof Error) {
            return `gameSettings invalid: ${settings.message}`;
        }
        // Now get the room
        const existingRoom = this.getRoom(namespace.gameName, data.session);
        if (existingRoom instanceof Error) {
            return existingRoom.message;
        }
        if (existingRoom) {
            return `session ${data.session} is already taken.`;
        }
        // We now know the Room can be created safely.
        const room = this.getOrCreateRoom(data.gameAlias, data.session);
        if (typeof room === "string") {
            // error string, this should not happen but did, pass it upstream
            return room;
        }
        const rooms = this.rooms.get(namespace.gameName);
        if (!rooms) {
            throw new Error(`Could not find rooms for ${namespace.gameName}.`);
        }
        rooms.set(data.session, room);
        // if we got here the setup data looks valid, so let's setup the Room.
        room.addGameSettings(settings);
        if (data.password) {
            room.password = data.password;
        }
    }
    /**
     * Gets all the Rooms in this lobby with active connections.
     *
     * @returns A list of rooms, in order of game name, then by room id, with active connections.
     */
    getActiveRooms() {
        const rooms = new Array();
        for (const gameName of Array.from(this.rooms.keys()).sort()) {
            const roomForGameName = this.rooms.get(gameName);
            if (!roomForGameName) {
                throw new Error(`Cannot get rooms for game name '${gameName}'.`);
            }
            for (const id of Array.from(roomForGameName.keys()).sort()) {
                const room = roomForGameName.get(id);
                if (!room) {
                    throw new Error(`Cannot get room for game name '${gameName}' of id '${id}'.`);
                }
                if (!room.isOver()) {
                    rooms.push(room);
                }
            }
        }
        return rooms;
    }
    /**
     * Invoked when a client disconnects from the lobby
     *
     * @param client - the client that disconnected
     * @param reason the reason the client disconnected, if we know why
     *               (e.g. timed out)
     */
    clientDisconnected(client, reason) {
        this.clients.delete(client);
        const room = this.clientsRoom.get(client);
        if (room) {
            // we need to remove the client from this room
            room.removeClient(client);
            if (room.clients.length === 0) {
                // then that room is empty, no need to keep it around
                const rooms = this.rooms.get(room.gameNamespace.gameName);
                if (!rooms) {
                    throw new Error("Could not find rooms client was in");
                }
                rooms.delete(room.id);
                if (Number(room.id) + 1 === this.nextRoomNumber) {
                    // then the next game number was never used, so reuse it
                    this.nextRoomNumber--;
                }
            }
            this.clientsRoom.delete(client);
        }
    }
    /**
     * Adds a socket of some client class as a proper Client type
     * @param socket the socket to bind the Client around
     * @param clientClass the class constructor of the Client class
     */
    addSocket(socket, clientClass) {
        const client = new clientClass(socket);
        this.clients.add(client);
        client.sent.alias.on((data) => this.clientSentAlias(client, data));
        client.sent.play.on((data) => this.clientSentPlay(client, data));
        client.events.disconnected.on(() => this.clientDisconnected(client, "Disconnected unexpectedly"));
        client.events.timedOut.on(() => this.clientDisconnected(client, "Timed out"));
    }
    /**
     * Creates and initializes a server that uses a listener pattern identical
     * to net.Server.
     *
     * @param port - The port to listen on for this server.
     * @param createServer - The required module's createServer method.
     * @param clientClass - The class constructor for clients of this listener.
     * @returns Once the listener is listening.
     */
    initializeListener(port, createServer, clientClass) {
        const listener = createServer((socket) => {
            this.addSocket(socket, clientClass);
        });
        // Place a ' ' (space) before the 'Client' part of the class name.
        const clientName = clientClass.name.replace(/(Client)/g, " $1");
        this.listenerServers.push(listener);
        listener.on("error", (err) => {
            logger_1.logger.error(err.code !== "EADDRINUSE" // Very common error for devs
                ? String(err)
                : `Lobby cannot listen on port ${port} for game connections.
Address is already in use.

There's probably another Cerveau server running on this same computer.`);
            process.exit(1);
        });
        return new Promise((resolve) => {
            listener.listen(port, "0.0.0.0", () => {
                logger_1.logger.info(`📞 Listening on port ${port} for ${clientName}s 📞`);
                resolve();
            });
        });
    }
    /**
     * Initializes all the games in the games/ folder.
     *
     * @returns The promise resolves when all games are initialized,
     * if an error occurs loading a game this is never resolved and the
     * process exits with code 1.
     */
    async initializeGames() {
        let dirs = await utils_1.getDirs(GAMES_DIR);
        if (config_1.Config.GAME_NAMES_TO_LOAD.length > 0) {
            const gameDirs = config_1.Config.GAME_NAMES_TO_LOAD.map(lodash_1.lowerFirst);
            const unknownGameNames = lodash_1.difference(gameDirs, dirs);
            if (unknownGameNames.length > 0) {
                throw new Error(`Cannot find directories to load for the selected games: ${unknownGameNames.map((name) => `"${lodash_1.capitalize(name)}"`).join(", ")}`);
            }
            // The selected game directories look fine! load them instead.
            dirs = gameDirs;
        }
        for (const dir of dirs) {
            let gameNamespace;
            try {
                const data = await Promise.resolve().then(() => require(GAMES_DIR + dir));
                gameNamespace = data.Namespace;
            }
            catch (err) {
                const errorGameName = lodash_1.capitalize(dir);
                throw new Error(`⚠️ Could not load game ${errorGameName} ⚠️
---
${err}`);
            }
            const gameName = gameNamespace.gameName;
            logger_1.logger.info(`🕹️ ${gameName} game loaded 🕹️`);
            // hook up all the ways to get the game class via an index
            this.gameAliasToName.set(gameName.toLowerCase(), gameName);
            for (const alias of gameNamespace.GameManager.aliases) {
                this.gameAliasToName.set(alias.toLowerCase(), gameName);
            }
            this.gameNamespaces.set(gameName, gameNamespace);
            this.rooms.set(gameName, new Map());
            this.roomsPlaying.set(gameName, new Map());
        }
        Object.freeze(this.gameNamespaces); // No more games can be added;
        // and it's public so we don't want people fucking with this object.
    }
    /**
     * Retrieves, or creates a new, session. For clients when saying what they
     * want to play.
     *
     * @param gameName - The key identifying the name of the game you want.
     * Should exist in games/
     * @param requestedId - Basically a room id. Specifying an id can be used
     * to join other players on purpose. "*" will join you to any open session
     * or a new one, and "new" will always give you a brand new room even if
     * there are open ones.
     * @returns The Room of gameName and id. If one does not exists a new
     * instance will be created
     */
    getOrCreateRoom(gameName, requestedId = "*") {
        const rooms = this.rooms.get(gameName);
        if (!rooms) {
            return `Game name ${gameName} is not known to us.`;
        }
        let room;
        let id = requestedId;
        if (id !== "new") {
            if (id === "*" || id === undefined) {
                // Then they want to join any open game,
                // so try to find an open session.
                for (const [, theRoom] of rooms) {
                    const theGame = theRoom.gameNamespace.gameName;
                    if (theRoom.isOpen() && theGame === gameName) {
                        room = theRoom;
                        break;
                    }
                }
                if (!room) {
                    // Then there was no open room to join,
                    // so they get a new room.
                    id = "new";
                }
            }
            else {
                // They requested to join a specific room.
                // An Error cannot be returned as gameName is checked above
                room = this.getRoom(gameName, id);
            }
        }
        if (room) {
            if (room.isRunning()) {
                // We can't put them in this game, so they get a new room.
                return `Room ${id} for game ${gameName} is full! Sorry.`;
            }
            else if (room.isOver()) {
                // We need to clear out this Room as it's over and available
                // to re-use.
                this.rooms.delete(id);
                room = undefined;
            }
        }
        if (!room) {
            // Then we couldn't find a room from the requested gameName + id,
            // so they get a new one.
            if (!id || id === "new") {
                id = String(this.nextRoomNumber++);
            }
            const namespace = this.getGameNamespace(gameName);
            if (!namespace) {
                throw new Error(`Could not find a namespace for ${gameName}.`);
            }
            room = new RoomClass(id, namespace, this.gamelogManager, this.updater);
            rooms.set(id, room);
        }
        return room;
    }
    /**
     * When a client sends the 'play' event, which tells the server what it
     * wants to play and as who.
     *
     * @param client - The client that send the 'play' event
     * @param data - The information about what this client wants to play.
     */
    async clientSentPlay(client, data) {
        const playData = this.validatePlayData(data);
        if (typeof playData === "string") {
            // It did not validate, so playData is the invalid message
            client.disconnect(playData);
            return;
        }
        let authenticationError;
        try {
            authenticationError = await this.authenticate(playData.gameName, playData.playerName || "", playData.password || "");
        }
        catch (error) {
            authenticationError = error.message;
        }
        if (authenticationError) {
            client.disconnect(`Authentication Error: '${authenticationError}'`);
            return;
        }
        const room = this.getOrCreateRoom(data.gameName, data.requestedSession || undefined);
        if (typeof room === "string") {
            client.disconnect(room);
            return;
        }
        if (room.password && room.password !== playData.password) {
            client.disconnect(`Incorrect password for private room session`);
            return;
        }
        // We need to check to make sure they did not request an already
        // requested player index.
        if (!utils_1.isNil(playData.playerIndex)) {
            if (room.clients.find((c) => c.playerIndex === playData.playerIndex)) {
                // Then there is already a client in this room that requested
                // this player index so the existing client gets the index,
                // and this client gets rejected
                client.disconnect(`Player index ${playData.playerIndex} is already taken`);
                return;
            }
        }
        client.setInfo({
            name: playData.playerName || undefined,
            type: playData.clientType,
            index: utils_1.isNil(playData.playerIndex)
                ? undefined
                : playData.playerIndex,
            metaDeltas: playData.metaDeltas || false,
        });
        room.addClient(client);
        this.clientsRoom.set(client, room);
        if (config_1.Config.GAME_SETTINGS_ENABLED && data.gameSettings) {
            room.addGameSettings(playData.validGameSettings);
        }
        const gameNamespace = this.getGameNamespace(playData.gameName);
        client.send({
            event: "lobbied",
            data: {
                gameName: data.gameName,
                gameVersion: gameNamespace && gameNamespace.gameVersion || "",
                gameSession: room.id,
                constants: constants_1.SHARED_CONSTANTS,
            },
        });
        if (room.canStart()) {
            this.unTrackClients(...room.clients);
            const roomsPlayingThisGame = this.roomsPlaying.get(playData.gameName);
            const roomsForThisGame = this.rooms.get(playData.gameName);
            if (!roomsPlayingThisGame || !roomsForThisGame) {
                throw new Error(`Could not find rooms for ${data.gameName} to start`);
            }
            roomsPlayingThisGame.set(room.id, room);
            room.events.over.on(() => {
                roomsPlayingThisGame.delete(room.id);
                if (this.isShuttingDown && this.roomsPlaying.size === 0) {
                    logger_1.logger.info("Final game session exited. Shutdown complete.");
                    process.exit(0);
                }
            });
            room.start();
        }
    }
    /**
     * Authenticates player information. If a string is resolved that is an
     * error message string. Otherwise they authenticated and can play!
     *
     * @param gameName - The name of the game they want to play.
     * @param playerName - The name of the player wanting to play.
     * @param password - The password they are trying to use. Not encrypted or
     * anything fancy like that. Plaintext.
     * @returns A promise that resolves to either error text is they
     */
    async authenticate(gameName, playerName, password) {
        if (!config_1.Config.AUTH_PASSWORD) {
            return undefined; // we do not need to authenticate them
        }
        // tslint:disable-next-line:possible-timing-attack - passwords are in no way crypto-safe in Cerveau
        if (config_1.Config.AUTH_PASSWORD !== password) {
            return `Could not authenticate.
'${password} is not a valid password to play on this server'`;
        }
        return undefined; // password was valid!
    }
    /**
     * Validates that the data sent in a 'play' event from a client is valid.
     *
     * @param data - The play event data to validate.
     * @returns - Human readable text why the data is not valid.
     */
    validatePlayData(data) {
        if (!data) {
            return "Sent 'play' event with no data.";
        }
        const { gameSettings, ...noGameSettings } = data;
        const validatedData = {
            validGameSettings: {},
            gameSettings,
            ...noGameSettings,
        };
        if (this.isShuttingDown) {
            return "Game server is shutting down and not accepting new clients.";
        }
        // Clients can send aliases of what they want to play as the game name;
        // so we need to verify it is a valid game name
        const gameAlias = String(data.gameName);
        const gameNamespace = this.getGameNamespace(gameAlias);
        if (!gameNamespace) {
            return `Game alias '${data.gameName}' is not a known game.`;
        }
        else {
            validatedData.gameName = gameNamespace.gameName;
        }
        // Special case for backwards compatibility.
        // -1 is treated as if they didn't care about their playerIndex
        if (validatedData.playerIndex === -1 || utils_1.isNil(validatedData.playerIndex)) {
            validatedData.playerIndex = undefined;
        }
        else {
            const asNumber = sanitize_1.sanitizeNumber(validatedData.playerIndex, true);
            if (asNumber instanceof Error) {
                return `playerIndex is not valid: ${asNumber.message}`;
            }
            validatedData.playerIndex = asNumber;
        }
        const n = gameNamespace.GameManager.requiredNumberOfPlayers;
        if (validatedData.playerIndex !== undefined
            && (validatedData.playerIndex < 0 || validatedData.playerIndex >= n)) {
            return `playerIndex '${validatedData.playerIndex}' is out of range (max ${n} players).
Please use zero-based indexing, where '0' is the first player.`;
        }
        // else it is valid as undefined or a number in the range for max players.
        if (data && data.gameSettings && config_1.Config.GAME_SETTINGS_ENABLED) {
            const footer = `
---
Available game settings:
${gameNamespace.gameSettingsManager.getHelp()}`;
            let settings = {};
            try {
                settings = querystring.parse(data.gameSettings);
            }
            catch (err) {
                return `Game settings incorrectly formatted.
Must be one string in the url parameters format.${footer}`;
            }
            // remove [] from keys for array setting names
            settings = lodash_1.mapKeys(settings, (value, key) => key.endsWith("[]")
                ? key.substr(0, key.length - 2)
                : key);
            const validated = gameNamespace.gameSettingsManager.invalidateSettings(settings);
            if (validated instanceof Error) {
                return validated.message + footer;
            }
            validatedData.validGameSettings = validated;
        }
        return validatedData;
    }
    /**
     * When a client sends the 'alias' event, which tells use they want to
     * know what this game alias really is.
     *
     * @param client - The client that send the 'play'.
     * @param alias - The alias they want named.
     * @returns A promise that is resolved once we've sent the client their
     * 'named' gameName.
     */
    async clientSentAlias(client, alias) {
        const gameName = this.getGameNameForAlias(alias);
        if (!gameName) {
            client.disconnect(`${alias} is not a known game alias for any game.`);
            return;
        }
        client.send({ event: "named", data: gameName });
    }
    /**
     * Stops tracking clients
     *
     * @param clients the clients to stop tracking events for
     */
    unTrackClients(...clients) {
        for (const client of clients) {
            client.events.disconnected.offAll();
            client.events.timedOut.offAll();
        }
        for (const client of clients) {
            this.clients.delete(client);
        }
    }
    /**
     * Attempts to gracefully shut down this Lobby and all its Rooms.
     * If this is called a second time while waiting for games to exit,
     * then this will force shut down.
     *
     * @returns A promise that _might_ resolve. Otherwise process.exit is
     * called so it never resolves. Really just ignore this.
     */
    async shutDown() {
        if (!this.isShuttingDown) {
            this.isShuttingDown = true;
            logger_1.logger.info("🔚 Shutting down gracefully 🔚");
            const n = Array
                .from(this.roomsPlaying)
                .reduce((sum, [, rooms]) => sum + rooms.size, 0);
            logger_1.logger.info(`   ${n} game${n !== 1 ? "s" : ""} currently running`);
            if (n === 0) {
                logger_1.logger.info("     ↳ No one here, see you later!");
            }
            try {
                // Tell all clients we are shutting down, and asynchronously
                // wait for the socket to confirm the data was sent before
                // proceeding.
                await Promise.all([...this.clients].map((client) => (client.disconnect("Sorry, the server is shutting down."))));
            }
            catch (rejection) {
                // We don't care.
            }
            if (n > 0) {
                logger_1.logger.info("     Waiting for them to exit before shutting down.");
                logger_1.logger.info("     ^C again to force shutdown, which force disconnects clients.");
            }
            else {
                process.exit(0);
            }
        }
        else {
            logger_1.logger.info("╘ Force shutting down.");
            process.exit(0);
        }
    }
}
exports.Lobby = Lobby;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9zZXJ2ZXIvbG9iYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwwQ0FBdUM7QUFDdkMsZ0RBQW9EO0FBQ3BELDBDQUF1QztBQUN2QyxtQ0FBbUU7QUFDbkUsd0NBQTZEO0FBQzdELGtDQUE2RDtBQUM3RCx3Q0FBcUM7QUFFckMsMkRBQWlEO0FBQ2pELCtEQUFxRDtBQUVyRCxtQkFBbUI7QUFDbkIsZ0RBQWdEO0FBQ2hELG1DQUFxRTtBQUNyRSwyQkFBMkI7QUFDM0IsK0JBQTRCO0FBQzVCLDJDQUEyQztBQUMzQyxxQ0FBcUM7QUFDckMsOENBQWlEO0FBR2pELE1BQU0sRUFBRSxHQUFHLGFBQTJCLENBQUM7QUFFdkMsTUFBTSxTQUFTLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUVsRCxNQUFNLFNBQVMsR0FBRyxlQUFNLENBQUMsZUFBZTtJQUNwQyxDQUFDLENBQUMsOEJBQVU7SUFDWixDQUFDLENBQUMsa0NBQVksQ0FBQztBQVFuQjs7O0VBR0U7QUFFRjs7Ozs7R0FLRztBQUNILE1BQWEsS0FBSztJQXFEZDs7O09BR0c7SUFDSDtRQXJDQSxxRUFBcUU7UUFDckQsbUJBQWMsR0FBRyxJQUFJLEdBQUcsRUFBeUMsQ0FBQztRQUVsRixrREFBa0Q7UUFDbEMsbUJBQWMsR0FBRyxJQUFJLHFCQUFjLEVBQUUsQ0FBQztRQUV0RCxxREFBcUQ7UUFDN0MsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFFM0IscUVBQXFFO1FBQzdELG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRS9CLHdEQUF3RDtRQUN2QyxZQUFPLEdBQW9CLElBQUksR0FBRyxFQUFFLENBQUM7UUFFdEQsNERBQTREO1FBQzNDLFVBQUssR0FBRyxJQUFJLEdBQUcsRUFBNkIsQ0FBQztRQUU5RCxvRUFBb0U7UUFDbkQsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBNkIs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SUFBSSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7YUFDcEY7aUJBQ0k7Z0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQjtTQUNKO2FBQ0k7WUFDRCxlQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7WUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQjtJQUNMLENBQUM7Q0FDSjtBQWh5QkQsc0JBZ3lCQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGludGVybmFsIGltcG9ydHNcbmltcG9ydCB7IFBsYXlFdmVudCB9IGZyb20gXCJAY2FkcmUvdHMtdXRpbHMvY2FkcmVcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCJ+L2NvcmUvY29uZmlnXCI7XG5pbXBvcnQgeyBTSEFSRURfQ09OU1RBTlRTIH0gZnJvbSBcIn4vY29yZS9jb25zdGFudHNcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCJ+L2NvcmUvbG9nZ2VyXCI7XG5pbXBvcnQgeyBnZXREaXJzLCBJbW11dGFibGUsIGlzTmlsLCBVbmtub3duT2JqZWN0IH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IEJhc2VDbGllbnQsIFRDUENsaWVudCwgV1NDbGllbnQgfSBmcm9tIFwiLi4vY2xpZW50c1wiO1xuaW1wb3J0IHsgR2FtZWxvZ01hbmFnZXIsIElCYXNlR2FtZU5hbWVzcGFjZSB9IGZyb20gXCIuLi9nYW1lXCI7XG5pbXBvcnQgeyBVcGRhdGVyIH0gZnJvbSBcIi4uL3VwZGF0ZXJcIjtcbmltcG9ydCB7IFJvb20gfSBmcm9tIFwiLi9sb2JieS1yb29tXCI7XG5pbXBvcnQgeyBTZXJpYWxSb29tIH0gZnJvbSBcIi4vbG9iYnktcm9vbS1zZXJpYWxcIjtcbmltcG9ydCB7IFRocmVhZGVkUm9vbSB9IGZyb20gXCIuL2xvYmJ5LXJvb20tdGhyZWFkZWRcIjtcblxuLy8gZXh0ZXJuYWwgaW1wb3J0c1xuaW1wb3J0ICogYXMgbGFya1dlYnNvY2tldCBmcm9tIFwibGFyay13ZWJzb2NrZXRcIjtcbmltcG9ydCB7IGNhcGl0YWxpemUsIGRpZmZlcmVuY2UsIGxvd2VyRmlyc3QsIG1hcEtleXMgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSBcIm5ldFwiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBxdWVyeXN0cmluZyBmcm9tIFwicXVlcnlzdHJpbmdcIjtcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gXCJyZWFkbGluZVwiO1xuaW1wb3J0IHsgc2FuaXRpemVOdW1iZXIgfSBmcm9tIFwifi9jb3JlL3Nhbml0aXplXCI7XG5pbXBvcnQgeyBJR2FtZXNFeHBvcnQgfSBmcm9tIFwifi9jb3JlL3NlcnZlci9nYW1lcy1leHBvcnRcIjtcblxuY29uc3Qgd3MgPSBsYXJrV2Vic29ja2V0IGFzIHR5cGVvZiBuZXQ7XG5cbmNvbnN0IEdBTUVTX0RJUiA9IGpvaW4oX19kaXJuYW1lLCBcIi4uLy4uL2dhbWVzL1wiKTtcblxuY29uc3QgUm9vbUNsYXNzID0gQ29uZmlnLlNJTkdMRV9USFJFQURFRFxuICAgID8gU2VyaWFsUm9vbVxuICAgIDogVGhyZWFkZWRSb29tO1xuXG4vKiogUGxheSBkYXRhIGZyb20gYSBwbGF5IGV2ZW50IHZhbGlkYXRlZCAqL1xudHlwZSBWYWxpZGF0ZWRQbGF5RGF0YSA9IFBsYXlFdmVudFtcImRhdGFcIl0gJiB7XG4gICAgLyoqIFRoZSBnYW1lIHNldHRpbmdzIGZvciB0aGUgcGxheSBldmVudCB2YWxpZGF0ZWQgYW5kIHRodXMgcG9zc2libHkgY2hhbmdlZC4gKi9cbiAgICB2YWxpZEdhbWVTZXR0aW5nczogVW5rbm93bk9iamVjdDtcbn07XG5cbi8qXG4gICAgQ2xpZW50cyBjb25uZWN0IGxpa2UgdGhpczpcbiAgICBMb2JieSAtPiBSb29tIC0+IFtuZXcgdGhyZWFkXSAtPiBTZXNzaW9uXG4qL1xuXG4vKipcbiAqIFRoZSBzZXJ2ZXIgdGhhdCBjbGllbnRzIGluaXRpYWxseSBjb25uZWN0IHRvIGJlZm9yZSBiZWluZyBtb3ZlZCB0byB0aGVpclxuICogZ2FtZSBsb2JieS5cbiAqXG4gKiBCYXNpY2FsbHkgY3JlYXRlcyBhbmQgbWFuYWdlcyBnYW1lIHNlc3Npb25zLlxuICovXG5leHBvcnQgY2xhc3MgTG9iYnkge1xuICAgIC8qKlxuICAgICAqIEdldHMsIGFuZCBzdGFydHMgdXAgdGhlIGxvYmJ5IHNpbmdsZXRvbiwgaWYgaXQgaGFzIG5vdCBzdGFydGVkIGFscmVhZHkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgTG9iYnkgc2luZ2xldG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogTG9iYnkgeyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOmZ1bmN0aW9uLW5hbWVcbiAgICAgICAgaWYgKCFMb2JieS5pbnN0YW5jZSkge1xuICAgICAgICAgICAgTG9iYnkuaW5zdGFuY2UgPSBuZXcgTG9iYnkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBMb2JieS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKiogVGhlIHNpbmdsZXRvbiBpbnN0YW5jZS4gKi9cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZT86IExvYmJ5O1xuXG4gICAgLyoqIEEgcHVibGljIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCBvbmNlIGFsbCB0aGUgZ2FtZXMgYXJlIHJlYWR5LiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lc0luaXRpYWxpemVkUHJvbWlzZTogUHJvbWlzZTx2b2lkPjtcblxuICAgIC8qKiBBbGwgdGhlIG5hbWVzcGFjZXMgZm9yIGdhbWVzIHdlIGNhbiBwbGF5LCBpbmRleGVkIGJ5IGdhbWVOYW1lLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lTmFtZXNwYWNlcyA9IG5ldyBNYXA8c3RyaW5nLCBJbW11dGFibGU8SUJhc2VHYW1lTmFtZXNwYWNlPj4oKTtcblxuICAgIC8qKiBUaGUgbG9nZ2VyIGluc3RhbmNlIHRoYXQgbWFuYWdlcyBnYW1lIGxvZ3MuICovXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVsb2dNYW5hZ2VyID0gbmV3IEdhbWVsb2dNYW5hZ2VyKCk7XG5cbiAgICAvKiogTmV4dCBudW1iZXIgdG8gdXNlIGZvciB3aWxkY2FyZCBnYW1lIHNlc3Npb25zLiAqL1xuICAgIHByaXZhdGUgbmV4dFJvb21OdW1iZXIgPSAxO1xuXG4gICAgLyoqIElmIHdlIGFyZSBzaHV0dGluZyBkb3duLCB0byBwcmV2ZW50IG5ldyBnYW1lcyBmcm9tIGNvbm5lY3RpbmcuICovXG4gICAgcHJpdmF0ZSBpc1NodXR0aW5nRG93biA9IGZhbHNlO1xuXG4gICAgLyoqIEFsbCB0aGUgY2xpZW50cyBjb25uZWN0ZWQsIGJ1dCBub3QgeWV0IGluIGEgUm9vbS4gKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGNsaWVudHM6IFNldDxCYXNlQ2xpZW50PiA9IG5ldyBTZXQoKTtcblxuICAgIC8qKiBBbGwgdGhlIFJvb21zIHdlIGN1cnJlbnRseSBoYXZlIHdpdGggY2xpZW50cyBpbiB0aGVtLiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcm9vbXMgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgUm9vbT4+KCk7XG5cbiAgICAvKiogQWxsIHRoZSBSb29tcyB0aGF0IGFyZSBhY3R1YWxseSBydW5uaW5nIGEgZ2FtZSBhdCB0aGUgbW9tZW50LiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcm9vbXNQbGF5aW5nID0gbmV3IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsIFJvb20+PigpO1xuXG4gICAgLyoqIEEgbWFwcGluZyBvZiBhIGNsaWVudCB0byB0aGUgcm9vbSB0aGV5IGFyZSBpbi4gICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBjbGllbnRzUm9vbSA9IG5ldyBNYXA8QmFzZUNsaWVudCwgUm9vbT4oKTtcblxuICAgIC8qKiBBIG1hcHBpbmcgb2YgZ2FtZSBhbGlhc2VzIHRvIHRoZWlyIG5hbWUgKGlkKS4gKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IGdhbWVBbGlhc1RvTmFtZSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG5cbiAgICAvKiogVGhlIFVwZGF0ZXIgaW5zdGFuY2UgdGhhdCBjaGVja3MgZm9yIHVwZGF0ZXMuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSB1cGRhdGVyPzogVXBkYXRlcjtcblxuICAgIC8qKiBUaGUgTm9kZS5qcyBsaXN0ZW5lciBzZXJ2ZXJzIHRoYXQgYWNjZXB0IG5ldyBjbGllbnRzLiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXJTZXJ2ZXJzOiBuZXQuU2VydmVyW10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBMb2JieSB0aGF0IGxpc3RlbnMgZm9yIG5ldyBjbGllbnRzLlxuICAgICAqIFRoZXJlIHNob3VsZCBvbmx5IGJlIDEgTG9iYnkgcGVyIHByb2dyYW0gcnVubmluZyBhdCBhIHRpbWUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5nYW1lc0luaXRpYWxpemVkUHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAvLyBQdXJwb3NlbHkgd2FpdCBmb3IgZ2FtZXMgdG8gaW5pdGlhbGl6ZSBiZWZvcmUgbGlzdGVuZXJzXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVHYW1lcygpO1xuXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbIC8vIHNvIHRoZXkgY2FuIGluaXRpYWxpemUgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlnLlRDUF9QT1JULFxuICAgICAgICAgICAgICAgICAgICBuZXQuY3JlYXRlU2VydmVyLFxuICAgICAgICAgICAgICAgICAgICBUQ1BDbGllbnQsXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgQ29uZmlnLldTX1BPUlQsXG4gICAgICAgICAgICAgICAgICAgIHdzLmNyZWF0ZVNlcnZlcixcbiAgICAgICAgICAgICAgICAgICAgV1NDbGllbnQsXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIvCfjokgRXZlcnl0aGluZyBpcyByZWFkeSEg8J+OiVwiKTtcblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXCJGYXRhbCBleGNlcHRpb24gaW5pdGlhbGl6aW5nIGdhbWVzIVwiKTtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihTdHJpbmcoZXJyKSk7XG4gICAgICAgICAgICBwcm9jZXNzLmV4aXQoMSk7IC8vIGtpbGxzIHRoZSBlbnRpcmUgZ2FtZSBzZXJ2ZXJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcmwgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xuICAgICAgICAgICAgaW5wdXQ6IHByb2Nlc3Muc3RkaW4sXG4gICAgICAgICAgICBvdXRwdXQ6IHByb2Nlc3Muc3Rkb3V0LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWFkTGluZTogbGlzdGVucyBmb3IgQ1RSTCtDIHRvIGtpbGwgb2ZmIGNoaWxkIHRocmVhZHMgZ3JhY2VmdWxseVxuICAgICAgICAvLyAobGV0dGluZyB0aGVpciBnYW1lcyBjb21wbGV0ZSlcbiAgICAgICAgcmwuc2V0UHJvbXB0KFwiXCIpO1xuICAgICAgICBybC5vbihcIlNJR0lOVFwiLCAoKSA9PiB0aGlzLnNodXREb3duKCkpO1xuXG4gICAgICAgIGlmIChDb25maWcuVVBEQVRFUl9FTkFCTEVEKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZXIgPSBuZXcgVXBkYXRlcigpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZXIuZXZlbnRzLnVwZGF0ZUZvdW5kLm9uKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNodXREb3duKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHNlc3Npb24gZm9yIGdhbWVBbGlhcyBhbmQgc2Vzc2lvbiBpZCwgaWYgaXQgZXhpc3RzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ2FtZUFsaWFzIC0gVGhlIG5hbWUgYWxpYXMgb2YgdGhlIGdhbWUgZm9yIHRoaXMgc2Vzc2lvblxuICAgICAqIEBwYXJhbSBpZCAtIHRoZSBzZXNzaW9uIGlkIG9mIHRoZSBnYW1lTmFtZVxuICAgICAqIEByZXR1cm5zIHRoZSBzZXNzaW9uLCBpZiBmb3VuZFxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRSb29tKGdhbWVBbGlhczogc3RyaW5nLCBpZDogc3RyaW5nKTogUm9vbSB8IEVycm9yIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgZ2FtZU5hbWUgPSB0aGlzLmdldEdhbWVOYW1lRm9yQWxpYXMoZ2FtZUFsaWFzKTtcbiAgICAgICAgaWYgKGdhbWVOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCByb29tcyA9IHRoaXMucm9vbXMuZ2V0KGdhbWVOYW1lKTtcbiAgICAgICAgICAgIGlmIChyb29tcykge1xuICAgICAgICAgICAgICAgIHJldHVybiByb29tcy5nZXQoaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgR2FtZSBuYW1lICcke2dhbWVBbGlhc30nIGlzIG5vdCBhIHZhbGlkIGdhbWUgYWxpYXMuYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBhY3R1YWwgbmFtZSBvZiBhbiBhbGlhcyBmb3IgYSBnYW1lLCBlLmcuIFwiY2hlY2tlcnNcIiAtPiBcIkNoZWNrZXJzXCJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBnYW1lQWxpYXMgLSBhbiBhbGlhcyBmb3IgdGhlIGdhbWUsIG5vdCBjYXNlIHNlbnNpdGl2ZVxuICAgICAqIEByZXR1cm5zIHRoZSBhY3R1YWwgZ2FtZSBuYW1lIG9mIHRoZSBhbGlhc2VkIGdhbWUsIG9yIHVuZGVmaW5lZCBpZiBub3QgdmFsaWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0R2FtZU5hbWVGb3JBbGlhcyhnYW1lQWxpYXM6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWVBbGlhc1RvTmFtZS5nZXQoZ2FtZUFsaWFzLnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGdhbWUgY2xhc3MgKGNvbnN0cnVjdG9yKSBmb3IgYSBnaXZlbiBnYW1lIGFsaWFzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ2FtZUFsaWFzIC0gYW4gYWxpYXMgZm9yIHRoZSBnYW1lIHlvdSB3YW50XG4gICAgICogQHJldHVybnMgdGhlIGdhbWUgY2xhc3MgY29uc3RydWN0b3IsIGlmIGZvdW5kXG4gICAgICovXG4gICAgcHVibGljIGdldEdhbWVOYW1lc3BhY2UoZ2FtZUFsaWFzOiBzdHJpbmcpOiBJbW11dGFibGU8SUJhc2VHYW1lTmFtZXNwYWNlPiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGdhbWVOYW1lID0gdGhpcy5nZXRHYW1lTmFtZUZvckFsaWFzKGdhbWVBbGlhcyk7XG4gICAgICAgIGlmIChnYW1lTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZU5hbWVzcGFjZXMuZ2V0KGdhbWVOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWVzIHRvIHNldCB1cCBhIFJvb20gZm9yIHByaXZhdGUgYXJlbmEgcGxheSB3aXRoIGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSAtIERhdGEgYWJvdXQgdGhlIFJvb20gdG8gc2V0dXAgd2l0aC5cbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBzdHJpbmcgaWYgaXQgY291bGQgbm90IGJlIHZhbGlkYXRlZCwgb3RoZXJ3aXNlXG4gICAgICogdW5kZWZpbmVkIGlmIG5vIGVycm9yIGFuZCB0aGUgUm9vbSB3YXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQuXG4gICAgICovXG4gICAgcHVibGljIHNldHVwKGRhdGE6IHtcbiAgICAgICAgLyoqIFRoZSBnYW1lIGFsaWFzIHRvIHNldHVwLCBkb2VzIG5vdCBuZWVkIHRvIGJlIHRoZSB1bmlxdWUgbmFtZSAqL1xuICAgICAgICBnYW1lQWxpYXM6IHN0cmluZztcbiAgICAgICAgLyoqIEtleS92YWx1ZSBwYWlycyBvZiB0aGUgZ2FtZSBzZXR0aW5ncyBmb3Igc2FpZCBnYW1lICovXG4gICAgICAgIGdhbWVTZXR0aW5nczogSW1tdXRhYmxlPFVua25vd25PYmplY3Q+O1xuICAgICAgICAvKiogT3B0aW9uYWwgcGFzc3dvcmQgdG8gcGFzc3dvcmQgcHJvdGVjdCB0aGUgc2V0dXAgcm9vbSAqL1xuICAgICAgICBwYXNzd29yZD86IHN0cmluZztcbiAgICAgICAgLyoqIFNlc3Npb24gaWQgc3RyaW5nIHRvIHJlc2VydmUgKi9cbiAgICAgICAgc2Vzc2lvbjogc3RyaW5nO1xuICAgIH0pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSB0aGlzLmdldEdhbWVOYW1lc3BhY2UoZGF0YS5nYW1lQWxpYXMpO1xuICAgICAgICBpZiAoIW5hbWVzcGFjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBnYW1lTmFtZSAke2RhdGEuZ2FtZUFsaWFzfSBpcyB2YWxpZCBmb3IgYW55IGdhbWVzYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gbmFtZXNwYWNlLmdhbWVTZXR0aW5nc01hbmFnZXIuaW52YWxpZGF0ZVNldHRpbmdzKFxuICAgICAgICAgICAgZGF0YS5nYW1lU2V0dGluZ3MsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBgZ2FtZVNldHRpbmdzIGludmFsaWQ6ICR7c2V0dGluZ3MubWVzc2FnZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IGdldCB0aGUgcm9vbVxuICAgICAgICBjb25zdCBleGlzdGluZ1Jvb20gPSB0aGlzLmdldFJvb20oXG4gICAgICAgICAgICBuYW1lc3BhY2UuZ2FtZU5hbWUsXG4gICAgICAgICAgICBkYXRhLnNlc3Npb24sXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGV4aXN0aW5nUm9vbSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdSb29tLm1lc3NhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXhpc3RpbmdSb29tKSB7XG4gICAgICAgICAgICByZXR1cm4gYHNlc3Npb24gJHtkYXRhLnNlc3Npb259IGlzIGFscmVhZHkgdGFrZW4uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIG5vdyBrbm93IHRoZSBSb29tIGNhbiBiZSBjcmVhdGVkIHNhZmVseS5cbiAgICAgICAgY29uc3Qgcm9vbSA9IHRoaXMuZ2V0T3JDcmVhdGVSb29tKFxuICAgICAgICAgICAgZGF0YS5nYW1lQWxpYXMsXG4gICAgICAgICAgICBkYXRhLnNlc3Npb24sXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiByb29tID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAvLyBlcnJvciBzdHJpbmcsIHRoaXMgc2hvdWxkIG5vdCBoYXBwZW4gYnV0IGRpZCwgcGFzcyBpdCB1cHN0cmVhbVxuICAgICAgICAgICAgcmV0dXJuIHJvb207XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByb29tcyA9IHRoaXMucm9vbXMuZ2V0KG5hbWVzcGFjZS5nYW1lTmFtZSk7XG5cbiAgICAgICAgaWYgKCFyb29tcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCByb29tcyBmb3IgJHtuYW1lc3BhY2UuZ2FtZU5hbWV9LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgcm9vbXMuc2V0KGRhdGEuc2Vzc2lvbiwgcm9vbSk7XG5cbiAgICAgICAgLy8gaWYgd2UgZ290IGhlcmUgdGhlIHNldHVwIGRhdGEgbG9va3MgdmFsaWQsIHNvIGxldCdzIHNldHVwIHRoZSBSb29tLlxuXG4gICAgICAgIHJvb20uYWRkR2FtZVNldHRpbmdzKHNldHRpbmdzKTtcbiAgICAgICAgaWYgKGRhdGEucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIHJvb20ucGFzc3dvcmQgPSBkYXRhLnBhc3N3b3JkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhbGwgdGhlIFJvb21zIGluIHRoaXMgbG9iYnkgd2l0aCBhY3RpdmUgY29ubmVjdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIGxpc3Qgb2Ygcm9vbXMsIGluIG9yZGVyIG9mIGdhbWUgbmFtZSwgdGhlbiBieSByb29tIGlkLCB3aXRoIGFjdGl2ZSBjb25uZWN0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QWN0aXZlUm9vbXMoKTogUm9vbVtdIHtcbiAgICAgICAgY29uc3Qgcm9vbXMgPSBuZXcgQXJyYXk8Um9vbT4oKTtcbiAgICAgICAgZm9yIChjb25zdCBnYW1lTmFtZSBvZiBBcnJheS5mcm9tKHRoaXMucm9vbXMua2V5cygpKS5zb3J0KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJvb21Gb3JHYW1lTmFtZSA9IHRoaXMucm9vbXMuZ2V0KGdhbWVOYW1lKTtcbiAgICAgICAgICAgIGlmICghcm9vbUZvckdhbWVOYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZ2V0IHJvb21zIGZvciBnYW1lIG5hbWUgJyR7Z2FtZU5hbWV9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgaWQgb2YgQXJyYXkuZnJvbShyb29tRm9yR2FtZU5hbWUua2V5cygpKS5zb3J0KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByb29tID0gcm9vbUZvckdhbWVOYW1lLmdldChpZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyb29tKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGdldCByb29tIGZvciBnYW1lIG5hbWUgJyR7Z2FtZU5hbWV9JyBvZiBpZCAnJHtpZH0nLmApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghcm9vbS5pc092ZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICByb29tcy5wdXNoKHJvb20pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb29tcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgbG9iYnlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbGllbnQgLSB0aGUgY2xpZW50IHRoYXQgZGlzY29ubmVjdGVkXG4gICAgICogQHBhcmFtIHJlYXNvbiB0aGUgcmVhc29uIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkLCBpZiB3ZSBrbm93IHdoeVxuICAgICAqICAgICAgICAgICAgICAgKGUuZy4gdGltZWQgb3V0KVxuICAgICAqL1xuICAgIHByaXZhdGUgY2xpZW50RGlzY29ubmVjdGVkKGNsaWVudDogQmFzZUNsaWVudCwgcmVhc29uPzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2xpZW50cy5kZWxldGUoY2xpZW50KTtcblxuICAgICAgICBjb25zdCByb29tID0gdGhpcy5jbGllbnRzUm9vbS5nZXQoY2xpZW50KTtcbiAgICAgICAgaWYgKHJvb20pIHtcbiAgICAgICAgICAgIC8vIHdlIG5lZWQgdG8gcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGlzIHJvb21cbiAgICAgICAgICAgIHJvb20ucmVtb3ZlQ2xpZW50KGNsaWVudCk7XG5cbiAgICAgICAgICAgIGlmIChyb29tLmNsaWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiB0aGF0IHJvb20gaXMgZW1wdHksIG5vIG5lZWQgdG8ga2VlcCBpdCBhcm91bmRcbiAgICAgICAgICAgICAgICBjb25zdCByb29tcyA9IHRoaXMucm9vbXMuZ2V0KHJvb20uZ2FtZU5hbWVzcGFjZS5nYW1lTmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyb29tcykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZmluZCByb29tcyBjbGllbnQgd2FzIGluXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb29tcy5kZWxldGUocm9vbS5pZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoTnVtYmVyKHJvb20uaWQpICsgMSA9PT0gdGhpcy5uZXh0Um9vbU51bWJlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZSBuZXh0IGdhbWUgbnVtYmVyIHdhcyBuZXZlciB1c2VkLCBzbyByZXVzZSBpdFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHRSb29tTnVtYmVyLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNsaWVudHNSb29tLmRlbGV0ZShjbGllbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIHNvY2tldCBvZiBzb21lIGNsaWVudCBjbGFzcyBhcyBhIHByb3BlciBDbGllbnQgdHlwZVxuICAgICAqIEBwYXJhbSBzb2NrZXQgdGhlIHNvY2tldCB0byBiaW5kIHRoZSBDbGllbnQgYXJvdW5kXG4gICAgICogQHBhcmFtIGNsaWVudENsYXNzIHRoZSBjbGFzcyBjb25zdHJ1Y3RvciBvZiB0aGUgQ2xpZW50IGNsYXNzXG4gICAgICovXG4gICAgcHJpdmF0ZSBhZGRTb2NrZXQoc29ja2V0OiBuZXQuU29ja2V0LCBjbGllbnRDbGFzczogdHlwZW9mIEJhc2VDbGllbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gbmV3IGNsaWVudENsYXNzKHNvY2tldCk7XG4gICAgICAgIHRoaXMuY2xpZW50cy5hZGQoY2xpZW50KTtcblxuICAgICAgICBjbGllbnQuc2VudC5hbGlhcy5vbigoZGF0YSkgPT4gdGhpcy5jbGllbnRTZW50QWxpYXMoY2xpZW50LCBkYXRhKSk7XG4gICAgICAgIGNsaWVudC5zZW50LnBsYXkub24oKGRhdGEpID0+IHRoaXMuY2xpZW50U2VudFBsYXkoY2xpZW50LCBkYXRhKSk7XG4gICAgICAgIGNsaWVudC5ldmVudHMuZGlzY29ubmVjdGVkLm9uKCgpID0+IHRoaXMuY2xpZW50RGlzY29ubmVjdGVkKGNsaWVudCwgXCJEaXNjb25uZWN0ZWQgdW5leHBlY3RlZGx5XCIpKTtcbiAgICAgICAgY2xpZW50LmV2ZW50cy50aW1lZE91dC5vbigoKSA9PiB0aGlzLmNsaWVudERpc2Nvbm5lY3RlZChjbGllbnQsIFwiVGltZWQgb3V0XCIpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuZCBpbml0aWFsaXplcyBhIHNlcnZlciB0aGF0IHVzZXMgYSBsaXN0ZW5lciBwYXR0ZXJuIGlkZW50aWNhbFxuICAgICAqIHRvIG5ldC5TZXJ2ZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9ydCAtIFRoZSBwb3J0IHRvIGxpc3RlbiBvbiBmb3IgdGhpcyBzZXJ2ZXIuXG4gICAgICogQHBhcmFtIGNyZWF0ZVNlcnZlciAtIFRoZSByZXF1aXJlZCBtb2R1bGUncyBjcmVhdGVTZXJ2ZXIgbWV0aG9kLlxuICAgICAqIEBwYXJhbSBjbGllbnRDbGFzcyAtIFRoZSBjbGFzcyBjb25zdHJ1Y3RvciBmb3IgY2xpZW50cyBvZiB0aGlzIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm5zIE9uY2UgdGhlIGxpc3RlbmVyIGlzIGxpc3RlbmluZy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGluaXRpYWxpemVMaXN0ZW5lcihcbiAgICAgICAgcG9ydDogbnVtYmVyLFxuICAgICAgICBjcmVhdGVTZXJ2ZXI6IChjYWxsYmFjazogKHNvY2tldDogbmV0LlNvY2tldCkgPT4gdm9pZCkgPT4gbmV0LlNlcnZlcixcbiAgICAgICAgY2xpZW50Q2xhc3M6IHR5cGVvZiBCYXNlQ2xpZW50LFxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBsaXN0ZW5lciA9IGNyZWF0ZVNlcnZlcigoc29ja2V0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZFNvY2tldChzb2NrZXQsIGNsaWVudENsYXNzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUGxhY2UgYSAnICcgKHNwYWNlKSBiZWZvcmUgdGhlICdDbGllbnQnIHBhcnQgb2YgdGhlIGNsYXNzIG5hbWUuXG4gICAgICAgIGNvbnN0IGNsaWVudE5hbWUgPSBjbGllbnRDbGFzcy5uYW1lLnJlcGxhY2UoLyhDbGllbnQpL2csIFwiICQxXCIpO1xuXG4gICAgICAgIHRoaXMubGlzdGVuZXJTZXJ2ZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgIGxpc3RlbmVyLm9uKFwiZXJyb3JcIiwgKGVycjogRXJyb3IgJiB7XG4gICAgICAgICAgICAvKiogT3B0aW9uYWwgZXJyb3IgY29kZSBOb2RlIGFkZHMgdG8gc29tZSBlcnJvciBldmVudHMgKi9cbiAgICAgICAgICAgIGNvZGU/OiBzdHJpbmc7XG4gICAgICAgIH0pID0+IHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIuY29kZSAhPT0gXCJFQUREUklOVVNFXCIgLy8gVmVyeSBjb21tb24gZXJyb3IgZm9yIGRldnNcbiAgICAgICAgICAgICAgICA/IFN0cmluZyhlcnIpXG4gICAgICAgICAgICAgICAgOiBgTG9iYnkgY2Fubm90IGxpc3RlbiBvbiBwb3J0ICR7cG9ydH0gZm9yIGdhbWUgY29ubmVjdGlvbnMuXG5BZGRyZXNzIGlzIGFscmVhZHkgaW4gdXNlLlxuXG5UaGVyZSdzIHByb2JhYmx5IGFub3RoZXIgQ2VydmVhdSBzZXJ2ZXIgcnVubmluZyBvbiB0aGlzIHNhbWUgY29tcHV0ZXIuYCk7XG5cbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW4ocG9ydCwgXCIwLjAuMC4wXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhg8J+TniBMaXN0ZW5pbmcgb24gcG9ydCAke3BvcnR9IGZvciAke2NsaWVudE5hbWV9cyDwn5OeYCk7XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgYWxsIHRoZSBnYW1lcyBpbiB0aGUgZ2FtZXMvIGZvbGRlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRoZSBwcm9taXNlIHJlc29sdmVzIHdoZW4gYWxsIGdhbWVzIGFyZSBpbml0aWFsaXplZCxcbiAgICAgKiBpZiBhbiBlcnJvciBvY2N1cnMgbG9hZGluZyBhIGdhbWUgdGhpcyBpcyBuZXZlciByZXNvbHZlZCBhbmQgdGhlXG4gICAgICogcHJvY2VzcyBleGl0cyB3aXRoIGNvZGUgMS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVHYW1lcygpOiBQcm9taXNlPHZvaWQgfCBuZXZlcj4ge1xuICAgICAgICBsZXQgZGlycyA9IGF3YWl0IGdldERpcnMoR0FNRVNfRElSKTtcblxuICAgICAgICBpZiAoQ29uZmlnLkdBTUVfTkFNRVNfVE9fTE9BRC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBnYW1lRGlycyA9IENvbmZpZy5HQU1FX05BTUVTX1RPX0xPQUQubWFwKGxvd2VyRmlyc3QpO1xuXG4gICAgICAgICAgICBjb25zdCB1bmtub3duR2FtZU5hbWVzID0gZGlmZmVyZW5jZShnYW1lRGlycywgZGlycyk7XG4gICAgICAgICAgICBpZiAodW5rbm93bkdhbWVOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBkaXJlY3RvcmllcyB0byBsb2FkIGZvciB0aGUgc2VsZWN0ZWQgZ2FtZXM6ICR7XG4gICAgICAgICAgICAgICAgICAgIHVua25vd25HYW1lTmFtZXMubWFwKChuYW1lKSA9PiBgXCIke2NhcGl0YWxpemUobmFtZSl9XCJgKS5qb2luKFwiLCBcIilcbiAgICAgICAgICAgICAgICB9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBzZWxlY3RlZCBnYW1lIGRpcmVjdG9yaWVzIGxvb2sgZmluZSEgbG9hZCB0aGVtIGluc3RlYWQuXG4gICAgICAgICAgICBkaXJzID0gZ2FtZURpcnM7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGRpciBvZiBkaXJzKSB7XG4gICAgICAgICAgICBsZXQgZ2FtZU5hbWVzcGFjZTogSW1tdXRhYmxlPElCYXNlR2FtZU5hbWVzcGFjZT4gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBpbXBvcnQoR0FNRVNfRElSICsgZGlyKSBhcyBJR2FtZXNFeHBvcnQ7XG4gICAgICAgICAgICAgICAgZ2FtZU5hbWVzcGFjZSA9IGRhdGEuTmFtZXNwYWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yR2FtZU5hbWUgPSBjYXBpdGFsaXplKGRpcik7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDimqDvuI8gQ291bGQgbm90IGxvYWQgZ2FtZSAke2Vycm9yR2FtZU5hbWV9IOKaoO+4j1xuLS0tXG4ke2Vycn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGdhbWVOYW1lID0gZ2FtZU5hbWVzcGFjZS5nYW1lTmFtZTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKGDwn5W577iPICR7Z2FtZU5hbWV9IGdhbWUgbG9hZGVkIPCflbnvuI9gKTtcblxuICAgICAgICAgICAgLy8gaG9vayB1cCBhbGwgdGhlIHdheXMgdG8gZ2V0IHRoZSBnYW1lIGNsYXNzIHZpYSBhbiBpbmRleFxuICAgICAgICAgICAgdGhpcy5nYW1lQWxpYXNUb05hbWUuc2V0KGdhbWVOYW1lLnRvTG93ZXJDYXNlKCksIGdhbWVOYW1lKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWxpYXMgb2YgZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlci5hbGlhc2VzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lQWxpYXNUb05hbWUuc2V0KGFsaWFzLnRvTG93ZXJDYXNlKCksIGdhbWVOYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5nYW1lTmFtZXNwYWNlcy5zZXQoZ2FtZU5hbWUsIGdhbWVOYW1lc3BhY2UpO1xuXG4gICAgICAgICAgICB0aGlzLnJvb21zLnNldChnYW1lTmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIHRoaXMucm9vbXNQbGF5aW5nLnNldChnYW1lTmFtZSwgbmV3IE1hcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5nYW1lTmFtZXNwYWNlcyk7IC8vIE5vIG1vcmUgZ2FtZXMgY2FuIGJlIGFkZGVkO1xuICAgICAgICAvLyBhbmQgaXQncyBwdWJsaWMgc28gd2UgZG9uJ3Qgd2FudCBwZW9wbGUgZnVja2luZyB3aXRoIHRoaXMgb2JqZWN0LlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcywgb3IgY3JlYXRlcyBhIG5ldywgc2Vzc2lvbi4gRm9yIGNsaWVudHMgd2hlbiBzYXlpbmcgd2hhdCB0aGV5XG4gICAgICogd2FudCB0byBwbGF5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGdhbWVOYW1lIC0gVGhlIGtleSBpZGVudGlmeWluZyB0aGUgbmFtZSBvZiB0aGUgZ2FtZSB5b3Ugd2FudC5cbiAgICAgKiBTaG91bGQgZXhpc3QgaW4gZ2FtZXMvXG4gICAgICogQHBhcmFtIHJlcXVlc3RlZElkIC0gQmFzaWNhbGx5IGEgcm9vbSBpZC4gU3BlY2lmeWluZyBhbiBpZCBjYW4gYmUgdXNlZFxuICAgICAqIHRvIGpvaW4gb3RoZXIgcGxheWVycyBvbiBwdXJwb3NlLiBcIipcIiB3aWxsIGpvaW4geW91IHRvIGFueSBvcGVuIHNlc3Npb25cbiAgICAgKiBvciBhIG5ldyBvbmUsIGFuZCBcIm5ld1wiIHdpbGwgYWx3YXlzIGdpdmUgeW91IGEgYnJhbmQgbmV3IHJvb20gZXZlbiBpZlxuICAgICAqIHRoZXJlIGFyZSBvcGVuIG9uZXMuXG4gICAgICogQHJldHVybnMgVGhlIFJvb20gb2YgZ2FtZU5hbWUgYW5kIGlkLiBJZiBvbmUgZG9lcyBub3QgZXhpc3RzIGEgbmV3XG4gICAgICogaW5zdGFuY2Ugd2lsbCBiZSBjcmVhdGVkXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRPckNyZWF0ZVJvb20oXG4gICAgICAgIGdhbWVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHJlcXVlc3RlZElkOiBzdHJpbmcgPSBcIipcIixcbiAgICApOiBSb29tIHxzdHJpbmcge1xuICAgICAgICBjb25zdCByb29tcyA9IHRoaXMucm9vbXMuZ2V0KGdhbWVOYW1lKTtcblxuICAgICAgICBpZiAoIXJvb21zKSB7XG4gICAgICAgICAgICByZXR1cm4gYEdhbWUgbmFtZSAke2dhbWVOYW1lfSBpcyBub3Qga25vd24gdG8gdXMuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByb29tOiBSb29tIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgaWQgPSByZXF1ZXN0ZWRJZDtcblxuICAgICAgICBpZiAoaWQgIT09IFwibmV3XCIpIHtcbiAgICAgICAgICAgIGlmIChpZCA9PT0gXCIqXCIgfHwgaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZW4gdGhleSB3YW50IHRvIGpvaW4gYW55IG9wZW4gZ2FtZSxcbiAgICAgICAgICAgICAgICAvLyBzbyB0cnkgdG8gZmluZCBhbiBvcGVuIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBbLCB0aGVSb29tXSBvZiByb29tcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aGVHYW1lID0gdGhlUm9vbS5nYW1lTmFtZXNwYWNlLmdhbWVOYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhlUm9vbS5pc09wZW4oKSAmJiB0aGVHYW1lID09PSBnYW1lTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9vbSA9IHRoZVJvb207XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghcm9vbSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGVuIHRoZXJlIHdhcyBubyBvcGVuIHJvb20gdG8gam9pbixcbiAgICAgICAgICAgICAgICAgICAgLy8gc28gdGhleSBnZXQgYSBuZXcgcm9vbS5cbiAgICAgICAgICAgICAgICAgICAgaWQgPSBcIm5ld1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoZXkgcmVxdWVzdGVkIHRvIGpvaW4gYSBzcGVjaWZpYyByb29tLlxuICAgICAgICAgICAgICAgIC8vIEFuIEVycm9yIGNhbm5vdCBiZSByZXR1cm5lZCBhcyBnYW1lTmFtZSBpcyBjaGVja2VkIGFib3ZlXG4gICAgICAgICAgICAgICAgcm9vbSA9IHRoaXMuZ2V0Um9vbShnYW1lTmFtZSwgaWQpIGFzIFJvb20gfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocm9vbSkge1xuICAgICAgICAgICAgaWYgKHJvb20uaXNSdW5uaW5nKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBjYW4ndCBwdXQgdGhlbSBpbiB0aGlzIGdhbWUsIHNvIHRoZXkgZ2V0IGEgbmV3IHJvb20uXG4gICAgICAgICAgICAgICAgcmV0dXJuIGBSb29tICR7aWR9IGZvciBnYW1lICR7Z2FtZU5hbWV9IGlzIGZ1bGwhIFNvcnJ5LmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChyb29tLmlzT3ZlcigpKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgbmVlZCB0byBjbGVhciBvdXQgdGhpcyBSb29tIGFzIGl0J3Mgb3ZlciBhbmQgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgLy8gdG8gcmUtdXNlLlxuICAgICAgICAgICAgICAgIHRoaXMucm9vbXMuZGVsZXRlKGlkKTtcbiAgICAgICAgICAgICAgICByb29tID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyb29tKSB7XG4gICAgICAgICAgICAvLyBUaGVuIHdlIGNvdWxkbid0IGZpbmQgYSByb29tIGZyb20gdGhlIHJlcXVlc3RlZCBnYW1lTmFtZSArIGlkLFxuICAgICAgICAgICAgLy8gc28gdGhleSBnZXQgYSBuZXcgb25lLlxuICAgICAgICAgICAgaWYgKCFpZCB8fCBpZCA9PT0gXCJuZXdcIikge1xuICAgICAgICAgICAgICAgIGlkID0gU3RyaW5nKHRoaXMubmV4dFJvb21OdW1iZXIrKyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IHRoaXMuZ2V0R2FtZU5hbWVzcGFjZShnYW1lTmFtZSk7XG4gICAgICAgICAgICBpZiAoIW5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgYSBuYW1lc3BhY2UgZm9yICR7Z2FtZU5hbWV9LmApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByb29tID0gbmV3IFJvb21DbGFzcyhcbiAgICAgICAgICAgICAgICBpZCxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2UsXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lbG9nTWFuYWdlcixcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZXIsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByb29tcy5zZXQoaWQsIHJvb20pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvb207XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiBhIGNsaWVudCBzZW5kcyB0aGUgJ3BsYXknIGV2ZW50LCB3aGljaCB0ZWxscyB0aGUgc2VydmVyIHdoYXQgaXRcbiAgICAgKiB3YW50cyB0byBwbGF5IGFuZCBhcyB3aG8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IHNlbmQgdGhlICdwbGF5JyBldmVudFxuICAgICAqIEBwYXJhbSBkYXRhIC0gVGhlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgdGhpcyBjbGllbnQgd2FudHMgdG8gcGxheS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFNlbnRQbGF5KFxuICAgICAgICBjbGllbnQ6IEJhc2VDbGllbnQsXG4gICAgICAgIGRhdGE6IEltbXV0YWJsZTxQbGF5RXZlbnRbXCJkYXRhXCJdPixcbiAgICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcGxheURhdGEgPSB0aGlzLnZhbGlkYXRlUGxheURhdGEoZGF0YSk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBwbGF5RGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgLy8gSXQgZGlkIG5vdCB2YWxpZGF0ZSwgc28gcGxheURhdGEgaXMgdGhlIGludmFsaWQgbWVzc2FnZVxuICAgICAgICAgICAgY2xpZW50LmRpc2Nvbm5lY3QocGxheURhdGEpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYXV0aGVudGljYXRpb25FcnJvcjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXV0aGVudGljYXRpb25FcnJvciA9IGF3YWl0IHRoaXMuYXV0aGVudGljYXRlKFxuICAgICAgICAgICAgICAgIHBsYXlEYXRhLmdhbWVOYW1lLFxuICAgICAgICAgICAgICAgIHBsYXlEYXRhLnBsYXllck5hbWUgfHwgXCJcIixcbiAgICAgICAgICAgICAgICBwbGF5RGF0YS5wYXNzd29yZCB8fCBcIlwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uRXJyb3IgPSAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXV0aGVudGljYXRpb25FcnJvcikge1xuICAgICAgICAgICAgY2xpZW50LmRpc2Nvbm5lY3QoYEF1dGhlbnRpY2F0aW9uIEVycm9yOiAnJHthdXRoZW50aWNhdGlvbkVycm9yfSdgKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm9vbSA9IHRoaXMuZ2V0T3JDcmVhdGVSb29tKGRhdGEuZ2FtZU5hbWUsIGRhdGEucmVxdWVzdGVkU2Vzc2lvbiB8fCB1bmRlZmluZWQpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygcm9vbSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY2xpZW50LmRpc2Nvbm5lY3Qocm9vbSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyb29tLnBhc3N3b3JkICYmIHJvb20ucGFzc3dvcmQgIT09IHBsYXlEYXRhLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICBjbGllbnQuZGlzY29ubmVjdChgSW5jb3JyZWN0IHBhc3N3b3JkIGZvciBwcml2YXRlIHJvb20gc2Vzc2lvbmApO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIHRvIG1ha2Ugc3VyZSB0aGV5IGRpZCBub3QgcmVxdWVzdCBhbiBhbHJlYWR5XG4gICAgICAgIC8vIHJlcXVlc3RlZCBwbGF5ZXIgaW5kZXguXG4gICAgICAgIGlmICghaXNOaWwocGxheURhdGEucGxheWVySW5kZXgpKSB7XG4gICAgICAgICAgICBpZiAocm9vbS5jbGllbnRzLmZpbmQoKGMpID0+IGMucGxheWVySW5kZXggPT09IHBsYXlEYXRhLnBsYXllckluZGV4KSkge1xuICAgICAgICAgICAgICAgIC8vIFRoZW4gdGhlcmUgaXMgYWxyZWFkeSBhIGNsaWVudCBpbiB0aGlzIHJvb20gdGhhdCByZXF1ZXN0ZWRcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHBsYXllciBpbmRleCBzbyB0aGUgZXhpc3RpbmcgY2xpZW50IGdldHMgdGhlIGluZGV4LFxuICAgICAgICAgICAgICAgIC8vIGFuZCB0aGlzIGNsaWVudCBnZXRzIHJlamVjdGVkXG4gICAgICAgICAgICAgICAgY2xpZW50LmRpc2Nvbm5lY3QoYFBsYXllciBpbmRleCAke3BsYXlEYXRhLnBsYXllckluZGV4fSBpcyBhbHJlYWR5IHRha2VuYCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnQuc2V0SW5mbyh7XG4gICAgICAgICAgICBuYW1lOiBwbGF5RGF0YS5wbGF5ZXJOYW1lIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IHBsYXlEYXRhLmNsaWVudFR5cGUsXG4gICAgICAgICAgICBpbmRleDogaXNOaWwocGxheURhdGEucGxheWVySW5kZXgpXG4gICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICA6IHBsYXlEYXRhLnBsYXllckluZGV4LFxuICAgICAgICAgICAgbWV0YURlbHRhczogcGxheURhdGEubWV0YURlbHRhcyB8fCBmYWxzZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcm9vbS5hZGRDbGllbnQoY2xpZW50KTtcbiAgICAgICAgdGhpcy5jbGllbnRzUm9vbS5zZXQoY2xpZW50LCByb29tKTtcblxuICAgICAgICBpZiAoQ29uZmlnLkdBTUVfU0VUVElOR1NfRU5BQkxFRCAmJiBkYXRhLmdhbWVTZXR0aW5ncykge1xuICAgICAgICAgICAgcm9vbS5hZGRHYW1lU2V0dGluZ3MocGxheURhdGEudmFsaWRHYW1lU2V0dGluZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2FtZU5hbWVzcGFjZSA9IHRoaXMuZ2V0R2FtZU5hbWVzcGFjZShwbGF5RGF0YS5nYW1lTmFtZSk7XG4gICAgICAgIGNsaWVudC5zZW5kKHtcbiAgICAgICAgICAgIGV2ZW50OiBcImxvYmJpZWRcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBnYW1lTmFtZTogZGF0YS5nYW1lTmFtZSxcbiAgICAgICAgICAgICAgICBnYW1lVmVyc2lvbjogZ2FtZU5hbWVzcGFjZSAmJiBnYW1lTmFtZXNwYWNlLmdhbWVWZXJzaW9uIHx8IFwiXCIsXG4gICAgICAgICAgICAgICAgZ2FtZVNlc3Npb246IHJvb20uaWQsXG4gICAgICAgICAgICAgICAgY29uc3RhbnRzOiBTSEFSRURfQ09OU1RBTlRTLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJvb20uY2FuU3RhcnQoKSkge1xuICAgICAgICAgICAgdGhpcy51blRyYWNrQ2xpZW50cyguLi5yb29tLmNsaWVudHMpO1xuXG4gICAgICAgICAgICBjb25zdCByb29tc1BsYXlpbmdUaGlzR2FtZSA9IHRoaXMucm9vbXNQbGF5aW5nLmdldChwbGF5RGF0YS5nYW1lTmFtZSk7XG4gICAgICAgICAgICBjb25zdCByb29tc0ZvclRoaXNHYW1lID0gdGhpcy5yb29tcy5nZXQocGxheURhdGEuZ2FtZU5hbWUpO1xuICAgICAgICAgICAgaWYgKCFyb29tc1BsYXlpbmdUaGlzR2FtZSB8fCAhcm9vbXNGb3JUaGlzR2FtZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgcm9vbXMgZm9yICR7ZGF0YS5nYW1lTmFtZX0gdG8gc3RhcnRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvb21zUGxheWluZ1RoaXNHYW1lLnNldChyb29tLmlkLCByb29tKTtcblxuICAgICAgICAgICAgcm9vbS5ldmVudHMub3Zlci5vbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgcm9vbXNQbGF5aW5nVGhpc0dhbWUuZGVsZXRlKHJvb20uaWQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTaHV0dGluZ0Rvd24gJiYgdGhpcy5yb29tc1BsYXlpbmcuc2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIkZpbmFsIGdhbWUgc2Vzc2lvbiBleGl0ZWQuIFNodXRkb3duIGNvbXBsZXRlLlwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByb29tLnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdXRoZW50aWNhdGVzIHBsYXllciBpbmZvcm1hdGlvbi4gSWYgYSBzdHJpbmcgaXMgcmVzb2x2ZWQgdGhhdCBpcyBhblxuICAgICAqIGVycm9yIG1lc3NhZ2Ugc3RyaW5nLiBPdGhlcndpc2UgdGhleSBhdXRoZW50aWNhdGVkIGFuZCBjYW4gcGxheSFcbiAgICAgKlxuICAgICAqIEBwYXJhbSBnYW1lTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBnYW1lIHRoZXkgd2FudCB0byBwbGF5LlxuICAgICAqIEBwYXJhbSBwbGF5ZXJOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHBsYXllciB3YW50aW5nIHRvIHBsYXkuXG4gICAgICogQHBhcmFtIHBhc3N3b3JkIC0gVGhlIHBhc3N3b3JkIHRoZXkgYXJlIHRyeWluZyB0byB1c2UuIE5vdCBlbmNyeXB0ZWQgb3JcbiAgICAgKiBhbnl0aGluZyBmYW5jeSBsaWtlIHRoYXQuIFBsYWludGV4dC5cbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBlaXRoZXIgZXJyb3IgdGV4dCBpcyB0aGV5XG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBhdXRoZW50aWNhdGUoXG4gICAgICAgIGdhbWVOYW1lOiBzdHJpbmcsXG4gICAgICAgIHBsYXllck5hbWU6IHN0cmluZyxcbiAgICAgICAgcGFzc3dvcmQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICApOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICAgICAgICBpZiAoIUNvbmZpZy5BVVRIX1BBU1NXT1JEKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyB3ZSBkbyBub3QgbmVlZCB0byBhdXRoZW50aWNhdGUgdGhlbVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnBvc3NpYmxlLXRpbWluZy1hdHRhY2sgLSBwYXNzd29yZHMgYXJlIGluIG5vIHdheSBjcnlwdG8tc2FmZSBpbiBDZXJ2ZWF1XG4gICAgICAgIGlmIChDb25maWcuQVVUSF9QQVNTV09SRCAhPT0gcGFzc3dvcmQpIHtcbiAgICAgICAgICAgIHJldHVybiBgQ291bGQgbm90IGF1dGhlbnRpY2F0ZS5cbicke3Bhc3N3b3JkfSBpcyBub3QgYSB2YWxpZCBwYXNzd29yZCB0byBwbGF5IG9uIHRoaXMgc2VydmVyJ2A7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBwYXNzd29yZCB3YXMgdmFsaWQhXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIHRoYXQgdGhlIGRhdGEgc2VudCBpbiBhICdwbGF5JyBldmVudCBmcm9tIGEgY2xpZW50IGlzIHZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGRhdGEgLSBUaGUgcGxheSBldmVudCBkYXRhIHRvIHZhbGlkYXRlLlxuICAgICAqIEByZXR1cm5zIC0gSHVtYW4gcmVhZGFibGUgdGV4dCB3aHkgdGhlIGRhdGEgaXMgbm90IHZhbGlkLlxuICAgICAqL1xuICAgIHByaXZhdGUgdmFsaWRhdGVQbGF5RGF0YShcbiAgICAgICAgZGF0YT86IFJlYWRvbmx5PFBsYXlFdmVudFtcImRhdGFcIl0+LFxuICAgICk6IHN0cmluZyB8IFZhbGlkYXRlZFBsYXlEYXRhIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJTZW50ICdwbGF5JyBldmVudCB3aXRoIG5vIGRhdGEuXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGdhbWVTZXR0aW5ncywgLi4ubm9HYW1lU2V0dGluZ3MgfSA9IGRhdGE7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlZERhdGEgPSB7XG4gICAgICAgICAgICB2YWxpZEdhbWVTZXR0aW5nczoge30sIC8vIHdpbGwgYmUgb3ZlcndyaXR0ZW4gYmVsb3dcbiAgICAgICAgICAgIGdhbWVTZXR0aW5ncyxcbiAgICAgICAgICAgIC4uLm5vR2FtZVNldHRpbmdzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLmlzU2h1dHRpbmdEb3duKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJHYW1lIHNlcnZlciBpcyBzaHV0dGluZyBkb3duIGFuZCBub3QgYWNjZXB0aW5nIG5ldyBjbGllbnRzLlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xpZW50cyBjYW4gc2VuZCBhbGlhc2VzIG9mIHdoYXQgdGhleSB3YW50IHRvIHBsYXkgYXMgdGhlIGdhbWUgbmFtZTtcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byB2ZXJpZnkgaXQgaXMgYSB2YWxpZCBnYW1lIG5hbWVcbiAgICAgICAgY29uc3QgZ2FtZUFsaWFzID0gU3RyaW5nKGRhdGEuZ2FtZU5hbWUpO1xuICAgICAgICBjb25zdCBnYW1lTmFtZXNwYWNlID0gdGhpcy5nZXRHYW1lTmFtZXNwYWNlKGdhbWVBbGlhcyk7XG4gICAgICAgIGlmICghZ2FtZU5hbWVzcGFjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBHYW1lIGFsaWFzICcke2RhdGEuZ2FtZU5hbWV9JyBpcyBub3QgYSBrbm93biBnYW1lLmA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWxpZGF0ZWREYXRhLmdhbWVOYW1lID0gZ2FtZU5hbWVzcGFjZS5nYW1lTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIC8vIC0xIGlzIHRyZWF0ZWQgYXMgaWYgdGhleSBkaWRuJ3QgY2FyZSBhYm91dCB0aGVpciBwbGF5ZXJJbmRleFxuICAgICAgICBpZiAodmFsaWRhdGVkRGF0YS5wbGF5ZXJJbmRleCA9PT0gLTEgfHwgaXNOaWwodmFsaWRhdGVkRGF0YS5wbGF5ZXJJbmRleCkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlZERhdGEucGxheWVySW5kZXggPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhc051bWJlciA9IHNhbml0aXplTnVtYmVyKHZhbGlkYXRlZERhdGEucGxheWVySW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGFzTnVtYmVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYHBsYXllckluZGV4IGlzIG5vdCB2YWxpZDogJHthc051bWJlci5tZXNzYWdlfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWxpZGF0ZWREYXRhLnBsYXllckluZGV4ID0gYXNOdW1iZXI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuID0gZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlci5yZXF1aXJlZE51bWJlck9mUGxheWVycztcbiAgICAgICAgaWYgKHZhbGlkYXRlZERhdGEucGxheWVySW5kZXggIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgJiYgKHZhbGlkYXRlZERhdGEucGxheWVySW5kZXggPCAwIHx8IHZhbGlkYXRlZERhdGEucGxheWVySW5kZXggPj0gbilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gYHBsYXllckluZGV4ICcke3ZhbGlkYXRlZERhdGEucGxheWVySW5kZXh9JyBpcyBvdXQgb2YgcmFuZ2UgKG1heCAke259IHBsYXllcnMpLlxuUGxlYXNlIHVzZSB6ZXJvLWJhc2VkIGluZGV4aW5nLCB3aGVyZSAnMCcgaXMgdGhlIGZpcnN0IHBsYXllci5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVsc2UgaXQgaXMgdmFsaWQgYXMgdW5kZWZpbmVkIG9yIGEgbnVtYmVyIGluIHRoZSByYW5nZSBmb3IgbWF4IHBsYXllcnMuXG5cbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5nYW1lU2V0dGluZ3MgJiYgQ29uZmlnLkdBTUVfU0VUVElOR1NfRU5BQkxFRCkge1xuICAgICAgICAgICAgY29uc3QgZm9vdGVyID0gYFxuLS0tXG5BdmFpbGFibGUgZ2FtZSBzZXR0aW5nczpcbiR7Z2FtZU5hbWVzcGFjZS5nYW1lU2V0dGluZ3NNYW5hZ2VyLmdldEhlbHAoKX1gO1xuXG4gICAgICAgICAgICBsZXQgc2V0dGluZ3M6IFVua25vd25PYmplY3QgPSB7fTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MgPSBxdWVyeXN0cmluZy5wYXJzZShkYXRhLmdhbWVTZXR0aW5ncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBHYW1lIHNldHRpbmdzIGluY29ycmVjdGx5IGZvcm1hdHRlZC5cbk11c3QgYmUgb25lIHN0cmluZyBpbiB0aGUgdXJsIHBhcmFtZXRlcnMgZm9ybWF0LiR7Zm9vdGVyfWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBbXSBmcm9tIGtleXMgZm9yIGFycmF5IHNldHRpbmcgbmFtZXNcbiAgICAgICAgICAgIHNldHRpbmdzID0gbWFwS2V5cyhzZXR0aW5ncywgKHZhbHVlLCBrZXkpID0+IGtleS5lbmRzV2l0aChcIltdXCIpXG4gICAgICAgICAgICAgICAgPyBrZXkuc3Vic3RyKDAsIGtleS5sZW5ndGggLSAyKVxuICAgICAgICAgICAgICAgIDoga2V5KTtcblxuICAgICAgICAgICAgY29uc3QgdmFsaWRhdGVkID0gZ2FtZU5hbWVzcGFjZS5nYW1lU2V0dGluZ3NNYW5hZ2VyLmludmFsaWRhdGVTZXR0aW5ncyhzZXR0aW5ncyk7XG4gICAgICAgICAgICBpZiAodmFsaWRhdGVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVkLm1lc3NhZ2UgKyBmb290ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbGlkYXRlZERhdGEudmFsaWRHYW1lU2V0dGluZ3MgPSB2YWxpZGF0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmFsaWRhdGVkRGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGEgY2xpZW50IHNlbmRzIHRoZSAnYWxpYXMnIGV2ZW50LCB3aGljaCB0ZWxscyB1c2UgdGhleSB3YW50IHRvXG4gICAgICoga25vdyB3aGF0IHRoaXMgZ2FtZSBhbGlhcyByZWFsbHkgaXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IHNlbmQgdGhlICdwbGF5Jy5cbiAgICAgKiBAcGFyYW0gYWxpYXMgLSBUaGUgYWxpYXMgdGhleSB3YW50IG5hbWVkLlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIG9uY2Ugd2UndmUgc2VudCB0aGUgY2xpZW50IHRoZWlyXG4gICAgICogJ25hbWVkJyBnYW1lTmFtZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIGNsaWVudFNlbnRBbGlhcyhcbiAgICAgICAgY2xpZW50OiBCYXNlQ2xpZW50LFxuICAgICAgICBhbGlhczogc3RyaW5nLFxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBnYW1lTmFtZSA9IHRoaXMuZ2V0R2FtZU5hbWVGb3JBbGlhcyhhbGlhcyk7XG5cbiAgICAgICAgaWYgKCFnYW1lTmFtZSkge1xuICAgICAgICAgICAgY2xpZW50LmRpc2Nvbm5lY3QoYCR7YWxpYXN9IGlzIG5vdCBhIGtub3duIGdhbWUgYWxpYXMgZm9yIGFueSBnYW1lLmApO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnQuc2VuZCh7IGV2ZW50OiBcIm5hbWVkXCIsIGRhdGE6IGdhbWVOYW1lIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHRyYWNraW5nIGNsaWVudHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbGllbnRzIHRoZSBjbGllbnRzIHRvIHN0b3AgdHJhY2tpbmcgZXZlbnRzIGZvclxuICAgICAqL1xuICAgIHByaXZhdGUgdW5UcmFja0NsaWVudHMoLi4uY2xpZW50czogQmFzZUNsaWVudFtdKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIGNsaWVudHMpIHtcbiAgICAgICAgICAgIGNsaWVudC5ldmVudHMuZGlzY29ubmVjdGVkLm9mZkFsbCgpO1xuICAgICAgICAgICAgY2xpZW50LmV2ZW50cy50aW1lZE91dC5vZmZBbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIGNsaWVudHMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50cy5kZWxldGUoY2xpZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIGdyYWNlZnVsbHkgc2h1dCBkb3duIHRoaXMgTG9iYnkgYW5kIGFsbCBpdHMgUm9vbXMuXG4gICAgICogSWYgdGhpcyBpcyBjYWxsZWQgYSBzZWNvbmQgdGltZSB3aGlsZSB3YWl0aW5nIGZvciBnYW1lcyB0byBleGl0LFxuICAgICAqIHRoZW4gdGhpcyB3aWxsIGZvcmNlIHNodXQgZG93bi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IF9taWdodF8gcmVzb2x2ZS4gT3RoZXJ3aXNlIHByb2Nlc3MuZXhpdCBpc1xuICAgICAqIGNhbGxlZCBzbyBpdCBuZXZlciByZXNvbHZlcy4gUmVhbGx5IGp1c3QgaWdub3JlIHRoaXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBzaHV0RG93bigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU2h1dHRpbmdEb3duKSB7XG4gICAgICAgICAgICB0aGlzLmlzU2h1dHRpbmdEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwi8J+UmiBTaHV0dGluZyBkb3duIGdyYWNlZnVsbHkg8J+UmlwiKTtcblxuICAgICAgICAgICAgY29uc3QgbiA9IEFycmF5XG4gICAgICAgICAgICAgICAgLmZyb20odGhpcy5yb29tc1BsYXlpbmcpXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoc3VtLCBbLCByb29tc10pID0+IHN1bSArIHJvb21zLnNpemUsIDApO1xuXG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhgICAgJHtufSBnYW1lJHtuICE9PSAxID8gXCJzXCIgOiBcIlwifSBjdXJyZW50bHkgcnVubmluZ2ApO1xuICAgICAgICAgICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuaW5mbyhcIiAgICAg4oazIE5vIG9uZSBoZXJlLCBzZWUgeW91IGxhdGVyIVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBUZWxsIGFsbCBjbGllbnRzIHdlIGFyZSBzaHV0dGluZyBkb3duLCBhbmQgYXN5bmNocm9ub3VzbHlcbiAgICAgICAgICAgICAgICAvLyB3YWl0IGZvciB0aGUgc29ja2V0IHRvIGNvbmZpcm0gdGhlIGRhdGEgd2FzIHNlbnQgYmVmb3JlXG4gICAgICAgICAgICAgICAgLy8gcHJvY2VlZGluZy5cbiAgICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbLi4udGhpcy5jbGllbnRzXS5tYXAoKGNsaWVudCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICBjbGllbnQuZGlzY29ubmVjdChcIlNvcnJ5LCB0aGUgc2VydmVyIGlzIHNodXR0aW5nIGRvd24uXCIpXG4gICAgICAgICAgICAgICAgKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKHJlamVjdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IGNhcmUuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiICAgICBXYWl0aW5nIGZvciB0aGVtIHRvIGV4aXQgYmVmb3JlIHNodXR0aW5nIGRvd24uXCIpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5pbmZvKFwiICAgICBeQyBhZ2FpbiB0byBmb3JjZSBzaHV0ZG93biwgd2hpY2ggZm9yY2UgZGlzY29ubmVjdHMgY2xpZW50cy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhcIuKVmCBGb3JjZSBzaHV0dGluZyBkb3duLlwiKTtcbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==