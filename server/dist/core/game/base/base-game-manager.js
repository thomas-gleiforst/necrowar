"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_typed_events_1 = require("ts-typed-events");
const random_number_generator_1 = require("~/core/game/random-number-generator");
/**
 * the base game plugin new games should inherit from.
 */
class BaseGameManager {
    /**
     * Creates a new game manager, and in turn it's game. Should be done by
     * the Session.
     *
     * @param namespace - The namespace this manager is a part of.
     * @param settingsManager - The current settings to use.
     * @param playingClients - The clients in this game, including spectators.
     * @param rootDeltaMergeable - The root delta mergeable to subscribe to.
     * @param sessionID - The id of the session we are in.
     * @param gameStarted - A signal to emit once the game is created.
     * @param gameOverCallback - A callback to invoke once the game is over.
     */
    constructor(namespace, settingsManager, playingClients, rootDeltaMergeable, sessionID, gameStarted, gameOverCallback) {
        this.namespace = namespace;
        this.gameOverCallback = gameOverCallback;
        /** If the game this managers is over. */
        this.isOver = false;
        /** The next game object id to use for new game objects. */
        this.nextGameObjectID = 0;
        /** Mapping of a player to their client. */
        this.playerToClient = new Map();
        /**
         * Generates a new id string for a new game object.
         *
         * @returns A string for the new id. **Must be unique**
         */
        this.generateNextGameObjectID = () => {
            // returns this.nextGameObjectID then increments by 1
            return String(this.nextGameObjectID++);
        };
        const settings = settingsManager.values;
        if (!settings.randomSeed) {
            // This is the only place we use old random
            // tslint:disable-next-line:no-math-random insecure-random
            settings.randomSeed = Math.random().toString(36).substring(2);
        }
        this.random = new random_number_generator_1.RandomNumberGenerator(settings.randomSeed);
        const invalidateRun = (player, gameObject, functionName, args) => {
            return this.invalidateRun(player, gameObject, functionName, args);
        };
        for (const client of playingClients) {
            if (client.aiManager) {
                client.aiManager.invalidateRun = invalidateRun;
            }
        }
        const gameCreated = new ts_typed_events_1.Event();
        // This will happen synchronously, but TS can't know that.
        gameCreated.once(({ game }) => {
            this.game = game;
        });
        this.create = new this.namespace.GameObjectFactory(this.namespace, this.generateNextGameObjectID, gameCreated);
        this.game = new this.namespace.Game(settingsManager, {
            namespace,
            playingClients,
            rootDeltaMergeable,
            manager: this,
            playerIDs: playingClients.map(() => this.generateNextGameObjectID()),
            schema: this.namespace.gameObjectsSchema.Game,
            gameCreated,
            sessionID,
        });
        for (const client of playingClients) {
            if (client.player) {
                client.events.disconnected.once(() => {
                    if (!client.player) {
                        throw new Error("Client disconnected without player!");
                    }
                    this.playerDisconnected(client.player);
                });
                this.playerToClient.set(client.player, client);
            }
        }
        gameStarted.once(() => this.start());
    }
    /** A list of aliases (case insensitive) that map to this game name. */
    static get aliases() {
        return [];
    }
    /** The number of players required for this game to play. */
    static get requiredNumberOfPlayers() {
        return 0;
    }
    /**
     * Declares some player as having lost, and assumes when a player looses
     * the rest could still be competing to win.
     *
     * @param reason - The reason they lost.
     * @param loser - The player that lost the game.
     */
    declareLoser(reason, loser) {
        this.declareLosers(reason, loser);
    }
    /**
     * Declares some player(s) as having lost, and assumes when a player looses
     * the rest could still be competing to win.
     *
     * @param reason - The reason they lost.
     * @param losers - The player(s) that lost the game.
     */
    declareLosers(reason, ...losers) {
        for (const player of losers) {
            this.setPlayerLost(player, reason);
        }
    }
    /**
     * Declares some player(s) as having won, and assumes when a player wins
     * the rest have lost if they have not won already.
     *
     * @param reason - The reason they won.
     * @param winner - The player that won the game.
     */
    declareWinner(reason, winner) {
        this.declareWinners(reason, winner);
    }
    /**
     * Declares some player(s) as having won, and assumes when a player wins
     * the rest have lost if they have not won already.
     *
     * @param reason - The reason they won.
     * @param winners - The player(s) that won the game.
     */
    declareWinners(reason, ...winners) {
        for (const player of winners) {
            player.lost = false;
            player.reasonLost = "";
            player.won = true;
            player.reasonWon = reason;
        }
        this.checkForGameOver();
    }
    /**
     * End the game via coin flip (1 random winner, the rest lose).
     *
     * @param reason - An optional reason why win via coin flip is happening.
     */
    makePlayerWinViaCoinFlip(reason = "Draw") {
        // Win via coin flip - if we got here no player won via game rules.
        // They probably played identically to each other.
        const players = this.game.players.filter((p) => !p.won && !p.lost);
        if (players.length > 0) {
            if (players.length === this.game.players.length) {
                // no winners yet, so a random one wins
                const winnerIndex = this.random.int(players.length);
                // this has the side effect of removing it from players
                const winner = players.splice(winnerIndex, 1)[0];
                this.declareWinner(`${reason} - Won via coin flip.`, winner);
            }
            // the rest of the players lose
            this.declareLosers(`${reason} - Lost via coin flip.`, ...players);
        }
        this.endGame();
    }
    /**
     * You **MUST** call this to let everything know the game is over and
     * all the clients should be notified
     *
     * @param reason - The reason the game is over to set for any players that
     * have not already won or lost the game.
     */
    endGame(reason = "Draw") {
        if (!this.isOver) {
            const playingPlayers = this.game.players.filter((p) => !p.won && !p.lost);
            if (playingPlayers.length > 0) {
                this.declareLosers(reason, ...playingPlayers);
            }
            this.isOver = true;
            this.gameOverCallback();
        }
    }
    /**
     * Checks if the game is over.
     *
     * @returns True if the game is over, false otherwise.
     */
    isGameOver() {
        return this.isOver;
    }
    /**
     * Invoked when the game starts and we should send orders.
     * The Game and this GameManager will have already been constructed
     */
    start() {
        // pass, intended to be overridden
    }
    /**
     * Invoked any time an AI wants to run some game object function.
     * If a string is returned that is the reason why it is invalid.
     *
     * @param player - The player invoking the function.
     * @param gameObject - The game object being invoked on.
     * @param functionName - The string name of the function.
     * @param args - The key/value pair args to the function.
     * @returns A string if the run is invalid, nothing if valid.
     */
    invalidateRun(player, gameObject, functionName, args) {
        // all runs are valid by default
        return undefined;
    }
    /**
     * Called when a client disconnected to remove the client from the game and
     * checks if they have a player and if removing them alters the game.
     *
     * @param player - The player whose client disconnected.
     */
    playerDisconnected(player) {
        if (player && !this.isOver) {
            this.declareLoser("Disconnected during gameplay.", player);
            const losers = this.game.players.filter((p) => p.lost);
            if (losers.length === this.game.players.length - 1) {
                // then only one player is left in the game, he wins!
                // and this is them!
                const winner = this.game.players.find((p) => !p.lost);
                if (!winner) {
                    throw new Error("No winner found when one should exist!");
                }
                const allLosersDisconnected = losers
                    .filter((p) => this.unsafeGetClient(p).hasDisconnected())
                    .length === losers.length;
                const allLosersTimedOut = losers
                    .filter((p) => this.unsafeGetClient(p).hasTimedOut())
                    .length === losers.length;
                let reasonWon = "All other players lost.";
                if (allLosersDisconnected) {
                    reasonWon = "All other players disconnected.";
                }
                if (allLosersTimedOut) {
                    reasonWon = "All other players timed out.";
                }
                this.declareWinner(reasonWon, winner);
                this.endGame();
            }
        }
    }
    /**
     * The player that lost the game
     * @param loser the loser
     * @param reason the reason they lost
     */
    setPlayerLost(loser, reason) {
        loser.lost = true;
        loser.reasonLost = reason;
        loser.won = false;
        loser.reasonWon = "";
    }
    /**
     * Does a basic check if this game is over because there is a winner (all
     * other players have lost). For game logic related winner checking you
     * should write your own checkForWinner() function on the sub class.
     */
    checkForGameOver() {
        if (this.game.players.find((p) => p.won)) {
            for (const player of this.game.players) {
                if (!player.won && !player.lost) {
                    // then they are going to loose because the game is over
                    this.setPlayerLost(player, "Other player won");
                }
            }
        }
    }
    /**
     * Gets a client for a given player, or throws an Error if non exists.
     * @param player - The player to get the client for.
     * @returns A client, always.
     */
    unsafeGetClient(player) {
        const client = this.playerToClient.get(player);
        if (!client) {
            throw new Error(`No client for player ${player}`);
        }
        return client;
    }
}
exports.BaseGameManager = BaseGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1nYW1lLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9nYW1lL2Jhc2UvYmFzZS1nYW1lLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBZ0Q7QUFHaEQsaUZBQTRFO0FBYTVFOztHQUVHO0FBQ0gsTUFBYSxlQUFlO0lBcUN4Qjs7Ozs7Ozs7Ozs7T0FXRztJQUNILFlBQ3FCLFNBQXdDLEVBQ3pELGVBQXdDLEVBQ3hDLGNBQW1DLEVBQ25DLGtCQUFrQyxFQUNsQyxTQUFpQixFQUNqQixXQUFtQixFQUNGLGdCQUE0QjtRQU41QixjQUFTLEdBQVQsU0FBUyxDQUErQjtRQU14QyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVk7UUE1QmpELHlDQUF5QztRQUNqQyxXQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXZCLDJEQUEyRDtRQUNuRCxxQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFFN0IsMkNBQTJDO1FBQ25DLG1CQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWlDLENBQUM7UUE4TmxFOzs7O1dBSUc7UUFDTyw2QkFBd0IsR0FBRyxHQUFHLEVBQUU7WUFDdEMscURBQXFEO1lBQ3JELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFBO1FBL01HLE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUM7UUFFeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDdEIsMkNBQTJDO1lBQzNDLDBEQUEwRDtZQUN6RCxRQUEwQixDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSwrQ0FBcUIsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFD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dHlwZWQtZXZlbnRzXCI7XG5pbXBvcnQgeyBCYXNlUGxheWluZ0NsaWVudCB9IGZyb20gXCJ+L2NvcmUvY2xpZW50cy9cIjtcbmltcG9ydCB7IEJhc2VHYW1lU2V0dGluZ3NNYW5hZ2VyLCBEZWx0YU1lcmdlYWJsZSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgUmFuZG9tTnVtYmVyR2VuZXJhdG9yIH0gZnJvbSBcIn4vY29yZS9nYW1lL3JhbmRvbS1udW1iZXItZ2VuZXJhdG9yXCI7XG5pbXBvcnQgeyBJbW11dGFibGUsIE11dGFibGUsIFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUdhbWUgfSBmcm9tIFwiLi9iYXNlLWdhbWVcIjtcbmltcG9ydCB7IElCYXNlR2FtZU5hbWVzcGFjZSB9IGZyb20gXCIuL2Jhc2UtZ2FtZS1uYW1lc3BhY2VcIjtcbmltcG9ydCB7IEJhc2VHYW1lT2JqZWN0IH0gZnJvbSBcIi4vYmFzZS1nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgQmFzZUdhbWVPYmplY3RGYWN0b3J5IH0gZnJvbSBcIi4vYmFzZS1nYW1lLW9iamVjdC1mYWN0b3J5XCI7XG5pbXBvcnQgeyBCYXNlUGxheWVyIH0gZnJvbSBcIi4vYmFzZS1wbGF5ZXJcIjtcblxuLyoqXG4gKiBBIGdhbWUgd2hlcmUgd2UgY2FuIG11dGF0ZSByZWFkb25seSBwcm9wZXJ0aWVzIGluIGl0LCBhcyB3ZSBhcmUgVEhFIE1BTkFHRVIuXG4gKi9cbnR5cGUgTXV0YWJsZUdhbWUgPSBNdXRhYmxlPEJhc2VHYW1lPjtcblxuLyoqXG4gKiB0aGUgYmFzZSBnYW1lIHBsdWdpbiBuZXcgZ2FtZXMgc2hvdWxkIGluaGVyaXQgZnJvbS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VHYW1lTWFuYWdlciB7XG4gICAgLyoqIEEgbGlzdCBvZiBhbGlhc2VzIChjYXNlIGluc2Vuc2l0aXZlKSB0aGF0IG1hcCB0byB0aGlzIGdhbWUgbmFtZS4gKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIC8qKiBUaGUgbnVtYmVyIG9mIHBsYXllcnMgcmVxdWlyZWQgZm9yIHRoaXMgZ2FtZSB0byBwbGF5LiAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IHJlcXVpcmVkTnVtYmVyT2ZQbGF5ZXJzKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgZmFjdG9yeSB0aGF0IGNhbiBjcmVhdGUgZ2FtZSBvYmplY3RzIGZvciB0aGlzIG1hbmFnZXIncyBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmVhdGU6IEJhc2VHYW1lT2JqZWN0RmFjdG9yeTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZTogQmFzZUdhbWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFhIFBzZXVkby1SYW5kb20gTnVtYmVyIEdlbmVyYXRvciB0aGF0IGlzIHN5bmNlZCB3aXRoIHRoZSBnYW1lXG4gICAgICogY2xpZW50cyBhbmQgZ2FtZSBsb2cgdG8gcGVyZm9ybSByYW5kb20gYnV0IHRyYWNrZWQgZXZlbnRzIGZyb20gYSBzdG9yZWRcbiAgICAgKiBzZWVkLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSByYW5kb206IFJhbmRvbU51bWJlckdlbmVyYXRvcjtcblxuICAgIC8qKiBJZiB0aGUgZ2FtZSB0aGlzIG1hbmFnZXJzIGlzIG92ZXIuICovXG4gICAgcHJpdmF0ZSBpc092ZXIgPSBmYWxzZTtcblxuICAgIC8qKiBUaGUgbmV4dCBnYW1lIG9iamVjdCBpZCB0byB1c2UgZm9yIG5ldyBnYW1lIG9iamVjdHMuICovXG4gICAgcHJpdmF0ZSBuZXh0R2FtZU9iamVjdElEID0gMDtcblxuICAgIC8qKiBNYXBwaW5nIG9mIGEgcGxheWVyIHRvIHRoZWlyIGNsaWVudC4gKi9cbiAgICBwcml2YXRlIHBsYXllclRvQ2xpZW50ID0gbmV3IE1hcDxCYXNlUGxheWVyLCBCYXNlUGxheWluZ0NsaWVudD4oKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgZ2FtZSBtYW5hZ2VyLCBhbmQgaW4gdHVybiBpdCdzIGdhbWUuIFNob3VsZCBiZSBkb25lIGJ5XG4gICAgICogdGhlIFNlc3Npb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZXNwYWNlIC0gVGhlIG5hbWVzcGFjZSB0aGlzIG1hbmFnZXIgaXMgYSBwYXJ0IG9mLlxuICAgICAqIEBwYXJhbSBzZXR0aW5nc01hbmFnZXIgLSBUaGUgY3VycmVudCBzZXR0aW5ncyB0byB1c2UuXG4gICAgICogQHBhcmFtIHBsYXlpbmdDbGllbnRzIC0gVGhlIGNsaWVudHMgaW4gdGhpcyBnYW1lLCBpbmNsdWRpbmcgc3BlY3RhdG9ycy5cbiAgICAgKiBAcGFyYW0gcm9vdERlbHRhTWVyZ2VhYmxlIC0gVGhlIHJvb3QgZGVsdGEgbWVyZ2VhYmxlIHRvIHN1YnNjcmliZSB0by5cbiAgICAgKiBAcGFyYW0gc2Vzc2lvbklEIC0gVGhlIGlkIG9mIHRoZSBzZXNzaW9uIHdlIGFyZSBpbi5cbiAgICAgKiBAcGFyYW0gZ2FtZVN0YXJ0ZWQgLSBBIHNpZ25hbCB0byBlbWl0IG9uY2UgdGhlIGdhbWUgaXMgY3JlYXRlZC5cbiAgICAgKiBAcGFyYW0gZ2FtZU92ZXJDYWxsYmFjayAtIEEgY2FsbGJhY2sgdG8gaW52b2tlIG9uY2UgdGhlIGdhbWUgaXMgb3Zlci5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSByZWFkb25seSBuYW1lc3BhY2U6IEltbXV0YWJsZTxJQmFzZUdhbWVOYW1lc3BhY2U+LFxuICAgICAgICBzZXR0aW5nc01hbmFnZXI6IEJhc2VHYW1lU2V0dGluZ3NNYW5hZ2VyLFxuICAgICAgICBwbGF5aW5nQ2xpZW50czogQmFzZVBsYXlpbmdDbGllbnRbXSxcbiAgICAgICAgcm9vdERlbHRhTWVyZ2VhYmxlOiBEZWx0YU1lcmdlYWJsZSxcbiAgICAgICAgc2Vzc2lvbklEOiBzdHJpbmcsXG4gICAgICAgIGdhbWVTdGFydGVkOiBTaWduYWwsXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZU92ZXJDYWxsYmFjazogKCkgPT4gdm9pZCxcbiAgICApIHtcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSBzZXR0aW5nc01hbmFnZXIudmFsdWVzO1xuXG4gICAgICAgIGlmICghc2V0dGluZ3MucmFuZG9tU2VlZCkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgb25seSBwbGFjZSB3ZSB1c2Ugb2xkIHJhbmRvbVxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW1hdGgtcmFuZG9tIGluc2VjdXJlLXJhbmRvbVxuICAgICAgICAgICAgKHNldHRpbmdzIGFzIFVua25vd25PYmplY3QpLnJhbmRvbVNlZWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoMik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yYW5kb20gPSBuZXcgUmFuZG9tTnVtYmVyR2VuZXJhdG9yKHNldHRpbmdzLnJhbmRvbVNlZWQpO1xuXG4gICAgICAgIGNvbnN0IGludmFsaWRhdGVSdW4gPSAoXG4gICAgICAgICAgICBwbGF5ZXI6IEJhc2VQbGF5ZXIsXG4gICAgICAgICAgICBnYW1lT2JqZWN0OiBCYXNlR2FtZU9iamVjdCxcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgYXJnczogTWFwPHN0cmluZywgdW5rbm93bj4sXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZVJ1bihwbGF5ZXIsIGdhbWVPYmplY3QsIGZ1bmN0aW9uTmFtZSwgYXJncyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChjb25zdCBjbGllbnQgb2YgcGxheWluZ0NsaWVudHMpIHtcbiAgICAgICAgICAgIGlmIChjbGllbnQuYWlNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgY2xpZW50LmFpTWFuYWdlci5pbnZhbGlkYXRlUnVuID0gaW52YWxpZGF0ZVJ1bjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGdhbWVDcmVhdGVkID0gbmV3IEV2ZW50PHtcbiAgICAgICAgICAgIC8qKiBUaGUgZ2FtZSB0aGF0IHdhcyBjcmVhdGVkLiAqL1xuICAgICAgICAgICAgZ2FtZTogQmFzZUdhbWU7XG5cbiAgICAgICAgICAgIC8qKiBUaGUgYmFzZSBkZWx0YSBtZXJnZWFibGUgdG8gdGhlIGdhbWUgb2JqZWN0cyBmb3Igc2VyaWFsaXphdGlvbiAqL1xuICAgICAgICAgICAgZ2FtZU9iamVjdHNEZWx0YU1lcmdlYWJsZTogRGVsdGFNZXJnZWFibGU7XG4gICAgICAgIH0+KCk7XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGhhcHBlbiBzeW5jaHJvbm91c2x5LCBidXQgVFMgY2FuJ3Qga25vdyB0aGF0LlxuICAgICAgICBnYW1lQ3JlYXRlZC5vbmNlKCh7IGdhbWUgfSkgPT4ge1xuICAgICAgICAgICAgKHRoaXMuZ2FtZSBhcyBNdXRhYmxlR2FtZSkgPSBnYW1lO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNyZWF0ZSA9IG5ldyB0aGlzLm5hbWVzcGFjZS5HYW1lT2JqZWN0RmFjdG9yeShcbiAgICAgICAgICAgIHRoaXMubmFtZXNwYWNlLFxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5leHRHYW1lT2JqZWN0SUQsXG4gICAgICAgICAgICBnYW1lQ3JlYXRlZCxcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLmdhbWUgPSBuZXcgdGhpcy5uYW1lc3BhY2UuR2FtZShzZXR0aW5nc01hbmFnZXIsIHtcbiAgICAgICAgICAgIG5hbWVzcGFjZSxcbiAgICAgICAgICAgIHBsYXlpbmdDbGllbnRzLFxuICAgICAgICAgICAgcm9vdERlbHRhTWVyZ2VhYmxlLFxuICAgICAgICAgICAgbWFuYWdlcjogdGhpcyxcbiAgICAgICAgICAgIHBsYXllcklEczogcGxheWluZ0NsaWVudHMubWFwKCgpID0+IHRoaXMuZ2VuZXJhdGVOZXh0R2FtZU9iamVjdElEKCkpLFxuICAgICAgICAgICAgc2NoZW1hOiB0aGlzLm5hbWVzcGFjZS5nYW1lT2JqZWN0c1NjaGVtYS5HYW1lLFxuICAgICAgICAgICAgZ2FtZUNyZWF0ZWQsXG4gICAgICAgICAgICBzZXNzaW9uSUQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIHBsYXlpbmdDbGllbnRzKSB7XG4gICAgICAgICAgICBpZiAoY2xpZW50LnBsYXllcikge1xuICAgICAgICAgICAgICAgIGNsaWVudC5ldmVudHMuZGlzY29ubmVjdGVkLm9uY2UoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNsaWVudC5wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNsaWVudCBkaXNjb25uZWN0ZWQgd2l0aG91dCBwbGF5ZXIhXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJEaXNjb25uZWN0ZWQoY2xpZW50LnBsYXllcik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllclRvQ2xpZW50LnNldChjbGllbnQucGxheWVyLCBjbGllbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZ2FtZVN0YXJ0ZWQub25jZSgoKSA9PiB0aGlzLnN0YXJ0KCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlY2xhcmVzIHNvbWUgcGxheWVyIGFzIGhhdmluZyBsb3N0LCBhbmQgYXNzdW1lcyB3aGVuIGEgcGxheWVyIGxvb3Nlc1xuICAgICAqIHRoZSByZXN0IGNvdWxkIHN0aWxsIGJlIGNvbXBldGluZyB0byB3aW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVhc29uIC0gVGhlIHJlYXNvbiB0aGV5IGxvc3QuXG4gICAgICogQHBhcmFtIGxvc2VyIC0gVGhlIHBsYXllciB0aGF0IGxvc3QgdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIGRlY2xhcmVMb3NlcihcbiAgICAgICAgcmVhc29uOiBzdHJpbmcsXG4gICAgICAgIGxvc2VyOiBCYXNlUGxheWVyLFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMocmVhc29uLCBsb3Nlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVjbGFyZXMgc29tZSBwbGF5ZXIocykgYXMgaGF2aW5nIGxvc3QsIGFuZCBhc3N1bWVzIHdoZW4gYSBwbGF5ZXIgbG9vc2VzXG4gICAgICogdGhlIHJlc3QgY291bGQgc3RpbGwgYmUgY29tcGV0aW5nIHRvIHdpbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWFzb24gLSBUaGUgcmVhc29uIHRoZXkgbG9zdC5cbiAgICAgKiBAcGFyYW0gbG9zZXJzIC0gVGhlIHBsYXllcihzKSB0aGF0IGxvc3QgdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIGRlY2xhcmVMb3NlcnMoXG4gICAgICAgIHJlYXNvbjogc3RyaW5nLFxuICAgICAgICAuLi5sb3NlcnM6IEJhc2VQbGF5ZXJbXVxuICAgICk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiBsb3NlcnMpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0UGxheWVyTG9zdChwbGF5ZXIsIHJlYXNvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWNsYXJlcyBzb21lIHBsYXllcihzKSBhcyBoYXZpbmcgd29uLCBhbmQgYXNzdW1lcyB3aGVuIGEgcGxheWVyIHdpbnNcbiAgICAgKiB0aGUgcmVzdCBoYXZlIGxvc3QgaWYgdGhleSBoYXZlIG5vdCB3b24gYWxyZWFkeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWFzb24gLSBUaGUgcmVhc29uIHRoZXkgd29uLlxuICAgICAqIEBwYXJhbSB3aW5uZXIgLSBUaGUgcGxheWVyIHRoYXQgd29uIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBkZWNsYXJlV2lubmVyKFxuICAgICAgICByZWFzb246IHN0cmluZyxcbiAgICAgICAgd2lubmVyOiBCYXNlUGxheWVyLFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXJzKHJlYXNvbiwgd2lubmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWNsYXJlcyBzb21lIHBsYXllcihzKSBhcyBoYXZpbmcgd29uLCBhbmQgYXNzdW1lcyB3aGVuIGEgcGxheWVyIHdpbnNcbiAgICAgKiB0aGUgcmVzdCBoYXZlIGxvc3QgaWYgdGhleSBoYXZlIG5vdCB3b24gYWxyZWFkeS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWFzb24gLSBUaGUgcmVhc29uIHRoZXkgd29uLlxuICAgICAqIEBwYXJhbSB3aW5uZXJzIC0gVGhlIHBsYXllcihzKSB0aGF0IHdvbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZGVjbGFyZVdpbm5lcnMoXG4gICAgICAgIHJlYXNvbjogc3RyaW5nLFxuICAgICAgICAuLi53aW5uZXJzOiBCYXNlUGxheWVyW11cbiAgICApOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2Ygd2lubmVycykge1xuICAgICAgICAgICAgcGxheWVyLmxvc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHBsYXllci5yZWFzb25Mb3N0ID0gXCJcIjtcbiAgICAgICAgICAgIHBsYXllci53b24gPSB0cnVlO1xuICAgICAgICAgICAgcGxheWVyLnJlYXNvbldvbiA9IHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hlY2tGb3JHYW1lT3ZlcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVuZCB0aGUgZ2FtZSB2aWEgY29pbiBmbGlwICgxIHJhbmRvbSB3aW5uZXIsIHRoZSByZXN0IGxvc2UpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlYXNvbiAtIEFuIG9wdGlvbmFsIHJlYXNvbiB3aHkgd2luIHZpYSBjb2luIGZsaXAgaXMgaGFwcGVuaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBtYWtlUGxheWVyV2luVmlhQ29pbkZsaXAocmVhc29uOiBzdHJpbmcgPSBcIkRyYXdcIik6IHZvaWQge1xuICAgICAgICAvLyBXaW4gdmlhIGNvaW4gZmxpcCAtIGlmIHdlIGdvdCBoZXJlIG5vIHBsYXllciB3b24gdmlhIGdhbWUgcnVsZXMuXG4gICAgICAgIC8vIFRoZXkgcHJvYmFibHkgcGxheWVkIGlkZW50aWNhbGx5IHRvIGVhY2ggb3RoZXIuXG4gICAgICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLmdhbWUucGxheWVycy5maWx0ZXIoKHApID0+ICFwLndvbiAmJiAhcC5sb3N0KTtcblxuICAgICAgICBpZiAocGxheWVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAocGxheWVycy5sZW5ndGggPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIG5vIHdpbm5lcnMgeWV0LCBzbyBhIHJhbmRvbSBvbmUgd2luc1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpbm5lckluZGV4ID0gdGhpcy5yYW5kb20uaW50KHBsYXllcnMubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGhhcyB0aGUgc2lkZSBlZmZlY3Qgb2YgcmVtb3ZpbmcgaXQgZnJvbSBwbGF5ZXJzXG4gICAgICAgICAgICAgICAgY29uc3Qgd2lubmVyID0gcGxheWVycy5zcGxpY2Uod2lubmVySW5kZXgsIDEpWzBdO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn0gLSBXb24gdmlhIGNvaW4gZmxpcC5gLCB3aW5uZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0aGUgcmVzdCBvZiB0aGUgcGxheWVycyBsb3NlXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoYCR7cmVhc29ufSAtIExvc3QgdmlhIGNvaW4gZmxpcC5gLCAuLi5wbGF5ZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW5kR2FtZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFlvdSAqKk1VU1QqKiBjYWxsIHRoaXMgdG8gbGV0IGV2ZXJ5dGhpbmcga25vdyB0aGUgZ2FtZSBpcyBvdmVyIGFuZFxuICAgICAqIGFsbCB0aGUgY2xpZW50cyBzaG91bGQgYmUgbm90aWZpZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWFzb24gLSBUaGUgcmVhc29uIHRoZSBnYW1lIGlzIG92ZXIgdG8gc2V0IGZvciBhbnkgcGxheWVycyB0aGF0XG4gICAgICogaGF2ZSBub3QgYWxyZWFkeSB3b24gb3IgbG9zdCB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZW5kR2FtZShyZWFzb246IHN0cmluZyA9IFwiRHJhd1wiKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc092ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXlpbmdQbGF5ZXJzID0gdGhpcy5nYW1lLnBsYXllcnMuZmlsdGVyKChwKSA9PiAhcC53b24gJiYgIXAubG9zdCk7XG4gICAgICAgICAgICBpZiAocGxheWluZ1BsYXllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VycyhyZWFzb24sIC4uLnBsYXlpbmdQbGF5ZXJzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pc092ZXIgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5nYW1lT3ZlckNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3Zlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGdhbWUgaXMgb3ZlciwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0dhbWVPdmVyKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pc092ZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlZCB3aGVuIHRoZSBnYW1lIHN0YXJ0cyBhbmQgd2Ugc2hvdWxkIHNlbmQgb3JkZXJzLlxuICAgICAqIFRoZSBHYW1lIGFuZCB0aGlzIEdhbWVNYW5hZ2VyIHdpbGwgaGF2ZSBhbHJlYWR5IGJlZW4gY29uc3RydWN0ZWRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIC8vIHBhc3MsIGludGVuZGVkIHRvIGJlIG92ZXJyaWRkZW5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgYSBuZXcgaWQgc3RyaW5nIGZvciBhIG5ldyBnYW1lIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgc3RyaW5nIGZvciB0aGUgbmV3IGlkLiAqKk11c3QgYmUgdW5pcXVlKipcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2VuZXJhdGVOZXh0R2FtZU9iamVjdElEID0gKCkgPT4ge1xuICAgICAgICAvLyByZXR1cm5zIHRoaXMubmV4dEdhbWVPYmplY3RJRCB0aGVuIGluY3JlbWVudHMgYnkgMVxuICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMubmV4dEdhbWVPYmplY3RJRCsrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIGFueSB0aW1lIGFuIEFJIHdhbnRzIHRvIHJ1biBzb21lIGdhbWUgb2JqZWN0IGZ1bmN0aW9uLlxuICAgICAqIElmIGEgc3RyaW5nIGlzIHJldHVybmVkIHRoYXQgaXMgdGhlIHJlYXNvbiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIGludm9raW5nIHRoZSBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCBiZWluZyBpbnZva2VkIG9uLlxuICAgICAqIEBwYXJhbSBmdW5jdGlvbk5hbWUgLSBUaGUgc3RyaW5nIG5hbWUgb2YgdGhlIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSBhcmdzIC0gVGhlIGtleS92YWx1ZSBwYWlyIGFyZ3MgdG8gdGhlIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIEEgc3RyaW5nIGlmIHRoZSBydW4gaXMgaW52YWxpZCwgbm90aGluZyBpZiB2YWxpZC5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVJ1bihcbiAgICAgICAgcGxheWVyOiBCYXNlUGxheWVyLFxuICAgICAgICBnYW1lT2JqZWN0OiBCYXNlR2FtZU9iamVjdCxcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgICAgIGFyZ3M6IE1hcDxzdHJpbmcsIHVua25vd24+LFxuICAgICk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIGFsbCBydW5zIGFyZSB2YWxpZCBieSBkZWZhdWx0XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdGVkIHRvIHJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGdhbWUgYW5kXG4gICAgICogY2hlY2tzIGlmIHRoZXkgaGF2ZSBhIHBsYXllciBhbmQgaWYgcmVtb3ZpbmcgdGhlbSBhbHRlcnMgdGhlIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB3aG9zZSBjbGllbnQgZGlzY29ubmVjdGVkLlxuICAgICAqL1xuICAgIHByaXZhdGUgcGxheWVyRGlzY29ubmVjdGVkKHBsYXllcjogQmFzZVBsYXllcik6IHZvaWQge1xuICAgICAgICBpZiAocGxheWVyICYmICF0aGlzLmlzT3Zlcikge1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoXCJEaXNjb25uZWN0ZWQgZHVyaW5nIGdhbWVwbGF5LlwiLCBwbGF5ZXIpO1xuXG4gICAgICAgICAgICBjb25zdCBsb3NlcnMgPSB0aGlzLmdhbWUucGxheWVycy5maWx0ZXIoKHApID0+IHAubG9zdCk7XG4gICAgICAgICAgICBpZiAobG9zZXJzLmxlbmd0aCA9PT0gdGhpcy5nYW1lLnBsYXllcnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIC8vIHRoZW4gb25seSBvbmUgcGxheWVyIGlzIGxlZnQgaW4gdGhlIGdhbWUsIGhlIHdpbnMhXG5cbiAgICAgICAgICAgICAgICAvLyBhbmQgdGhpcyBpcyB0aGVtIVxuICAgICAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmZpbmQoKHApID0+ICFwLmxvc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF3aW5uZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gd2lubmVyIGZvdW5kIHdoZW4gb25lIHNob3VsZCBleGlzdCFcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgYWxsTG9zZXJzRGlzY29ubmVjdGVkID0gbG9zZXJzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAocCkgPT4gdGhpcy51bnNhZmVHZXRDbGllbnQocCkuaGFzRGlzY29ubmVjdGVkKCksXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLmxlbmd0aCA9PT0gbG9zZXJzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGFsbExvc2Vyc1RpbWVkT3V0ID0gbG9zZXJzXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAgICAgICAgICAgICAocCkgPT4gdGhpcy51bnNhZmVHZXRDbGllbnQocCkuaGFzVGltZWRPdXQoKSxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAubGVuZ3RoID09PSBsb3NlcnMubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgbGV0IHJlYXNvbldvbiA9IFwiQWxsIG90aGVyIHBsYXllcnMgbG9zdC5cIjtcbiAgICAgICAgICAgICAgICBpZiAoYWxsTG9zZXJzRGlzY29ubmVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYXNvbldvbiA9IFwiQWxsIG90aGVyIHBsYXllcnMgZGlzY29ubmVjdGVkLlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWxsTG9zZXJzVGltZWRPdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhc29uV29uID0gXCJBbGwgb3RoZXIgcGxheWVycyB0aW1lZCBvdXQuXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKHJlYXNvbldvbiwgd2lubmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZEdhbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgdGhhdCBsb3N0IHRoZSBnYW1lXG4gICAgICogQHBhcmFtIGxvc2VyIHRoZSBsb3NlclxuICAgICAqIEBwYXJhbSByZWFzb24gdGhlIHJlYXNvbiB0aGV5IGxvc3RcbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFBsYXllckxvc3QobG9zZXI6IEJhc2VQbGF5ZXIsIHJlYXNvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGxvc2VyLmxvc3QgPSB0cnVlO1xuICAgICAgICBsb3Nlci5yZWFzb25Mb3N0ID0gcmVhc29uO1xuICAgICAgICBsb3Nlci53b24gPSBmYWxzZTtcbiAgICAgICAgbG9zZXIucmVhc29uV29uID0gXCJcIjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb2VzIGEgYmFzaWMgY2hlY2sgaWYgdGhpcyBnYW1lIGlzIG92ZXIgYmVjYXVzZSB0aGVyZSBpcyBhIHdpbm5lciAoYWxsXG4gICAgICogb3RoZXIgcGxheWVycyBoYXZlIGxvc3QpLiBGb3IgZ2FtZSBsb2dpYyByZWxhdGVkIHdpbm5lciBjaGVja2luZyB5b3VcbiAgICAgKiBzaG91bGQgd3JpdGUgeW91ciBvd24gY2hlY2tGb3JXaW5uZXIoKSBmdW5jdGlvbiBvbiB0aGUgc3ViIGNsYXNzLlxuICAgICAqL1xuICAgIHByaXZhdGUgY2hlY2tGb3JHYW1lT3ZlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzLmZpbmQoKHApID0+IHAud29uKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5nYW1lLnBsYXllcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXBsYXllci53b24gJiYgIXBsYXllci5sb3N0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZW4gdGhleSBhcmUgZ29pbmcgdG8gbG9vc2UgYmVjYXVzZSB0aGUgZ2FtZSBpcyBvdmVyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UGxheWVyTG9zdChwbGF5ZXIsIFwiT3RoZXIgcGxheWVyIHdvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgY2xpZW50IGZvciBhIGdpdmVuIHBsYXllciwgb3IgdGhyb3dzIGFuIEVycm9yIGlmIG5vbiBleGlzdHMuXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdG8gZ2V0IHRoZSBjbGllbnQgZm9yLlxuICAgICAqIEByZXR1cm5zIEEgY2xpZW50LCBhbHdheXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1bnNhZmVHZXRDbGllbnQocGxheWVyOiBCYXNlUGxheWVyKTogQmFzZVBsYXlpbmdDbGllbnQge1xuICAgICAgICBjb25zdCBjbGllbnQgPSB0aGlzLnBsYXllclRvQ2xpZW50LmdldChwbGF5ZXIpO1xuXG4gICAgICAgIGlmICghY2xpZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGNsaWVudCBmb3IgcGxheWVyICR7cGxheWVyfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsaWVudDtcbiAgICB9XG59XG4iXX0=