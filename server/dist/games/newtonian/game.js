"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
/*interface IConveyor {
    x: number; y: number;
    direction: Tile["direction"];
}*/
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * Combine elements and be the first scientists to create fusion.
 */
class NewtonianGame extends _1.BaseClasses.Game {
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Game is created.
     *
     * @param settingsManager - The manager that holds initial settings.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(settingsManager, required) {
        super(settingsManager, required);
        this.settingsManager = settingsManager;
        /** The settings used to initialize the game, as set by players */
        this.settings = Object.freeze(this.settingsManager.values);
        // <<-- Creer-Merge: attributes -->>
        /**
         * This is a const used to modify the amount of walls that receive the decoration value of 1/2.
         */
        this.cubeConst = 20;
        // <<-- Creer-Merge: constructor -->>
        this.createJobs();
        this.createMap();
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Gets the tile at (x, y), or undefined if the co-ordinates are off-map.
     *
     * @param x - The x position of the desired tile.
     * @param y - The y position of the desired tile.
     * @returns The Tile at (x, y) if valid, undefined otherwise.
     */
    getTile(x, y) {
        // tslint:disable-next-line:no-unsafe-any
        return super.getTile(x, y);
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /** Creates all the Jobs in the game */
    createJobs() {
        // push all three jobs.
        this.jobs.push(this.manager.create.job({
            title: "intern",
            carryLimit: 4,
            damage: 4,
            health: 12,
            moves: 5,
        }), this.manager.create.job({
            title: "physicist",
            carryLimit: 1,
            damage: 4,
            health: 12,
            moves: 5,
        }), this.manager.create.job({
            title: "manager",
            carryLimit: 3,
            damage: 4,
            health: 16,
            moves: 5,
        }));
    }
    /**
     * Generates the map by modifying Tiles in the game.
     */
    createMap() {
        /**
         * Utility function to get a mutable tile at a given (x, y).
         *
         * NOTE: This is a closure function. It is a function we create while
         * running createMap(), and it wraps the current scope, so that `this`
         * refers to the Game running `createMap()`, even though the game was
         * not passed.
         * @param x - The x coordinate. If off map throws an Error.
         * @param y - The y coordinate. If off map throws an Error.
         * @returns A Tile that is mutable JUST for this function scope.
         */
        const getMutableTile = (x, y) => {
            const tile = this.getTile(x, y);
            if (!tile) {
                throw new Error(`Cannot get a tile for map generation at (${x}, ${y})`);
            }
            return tile;
        };
        // marks where the spawn area ends and the rooms begin.
        const RMstart = Math.floor(this.mapWidth * 0.105);
        // marks where the middle area of the map begins.
        const MMstart = Math.floor(this.mapWidth * 0.363);
        // marks where the spawn room in the spawn area ends.
        const spawnEnd = Math.floor(this.mapHeight * 0.304);
        // marks where the generator room in the spawn area ends.
        const genEnd = Math.floor(this.mapHeight * 0.653);
        // marks how many tiles wide the spawn and generator are, as well as conveyors.
        const startEnd = Math.ceil(this.mapWidth * 0.073);
        // used to track the maps mid-point.
        const mid = Math.floor(this.mapHeight / 2);
        // iterates over the map and adds basic structure.
        for (let x = 0; x < (this.mapWidth / 2 + 1); x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (y === 0 // bottom edge of map
                    || y === (this.mapHeight - 1) // top edge of map
                    || x === 0 // left edge of map
                    || x === RMstart
                    || x === MMstart
                    // || x === Math.floor(this.mapWidth / 2) - 1
                    || (x < startEnd && (y === spawnEnd || y === genEnd))) {
                    getMutableTile(x, y).isWall = true;
                }
            }
        }
        // --- Set spawn area --- \\
        for (let y = 1; y < spawnEnd; y++) {
            for (let x = 1; x <= startEnd - 1; x++) {
                const tile = getMutableTile(x, y);
                tile.owner = this.players[0];
                tile.type = "spawn";
                this.players[0].spawnTiles.push(tile);
            }
        }
        // --- Set generator area --- \\
        for (let y = spawnEnd + 1; y < genEnd; y++) {
            for (let x = 1; x <= startEnd - 1; x++) {
                const tile = getMutableTile(x, y);
                tile.owner = this.players[0];
                tile.type = "generator";
                this.players[0].generatorTiles.push(tile);
            }
        }
        // --- Set resource spawn --- \\
        const conveyors = [];
        for (let x = 1; x < startEnd - 1; x++) {
            conveyors.push({ x, y: this.mapHeight - 3, direction: "east" });
        }
        for (let y = this.mapHeight - 3; y > genEnd + 2; y--) {
            conveyors.push({ x: startEnd - 1, y, direction: "north" });
        }
        for (let x = startEnd - 1; x > 1; x--) {
            conveyors.push({ x, y: genEnd + 2, direction: "west" });
        }
        conveyors.push({ x: 1, y: genEnd + 2, direction: "blank" });
        for (const { x, y, direction } of conveyors) {
            let tile = getMutableTile(x, y);
            tile.type = "conveyor";
            tile.direction = direction;
            this.players[0].conveyors.push(tile);
            tile = getMutableTile((this.mapWidth - 1 - x), y);
            tile.type = "conveyor";
            let dir = direction;
            if (dir === "east") {
                dir = "west";
            }
            else if (dir === "west") {
                dir = "east";
            }
            tile.direction = dir;
            this.players[1].conveyors.push(tile);
        }
        // spawns one of each unit for the first player.
        for (let i = 0; i < 3; i++) {
            this.spawnUnit(this.players[0], this.jobs[i % 3]);
        }
        // sets up spawn times.
        for (let i = 0; i < 2; i++) {
            this.players[i].internSpawn = this.spawnTime;
            this.players[i].physicistSpawn = this.spawnTime;
            this.players[i].managerSpawn = this.spawnTime;
        }
        // --- Generate center --- \\
        // Determine the size of the center room
        const midSize = this.manager.random.int(6, 3);
        // Determine the rooms offset
        let shift = this.manager.random.int(Math.floor(this.mapHeight / 2) - midSize);
        // let shift = Math.floor(this.mapHeight / 2) - midSize - 3; // for testing
        // Edge case handling to make sure walls don't touch.
        if (shift === Math.floor(this.mapHeight / 2) - midSize - 1) {
            shift++;
        }
        // Decides if the rooms shifts upwards or downwards
        /** used to determine random shifts and doorways */
        let shiftDir = this.manager.random.int(2, 0); // 0 = small south, 1 = small north
        // shiftDir = 0; // used for testing.
        /** Determines the ship of the middle room */
        if (shiftDir === 1) {
            shift = -shift;
        }
        /** Determines machines shift */
        shiftDir = this.manager.random.int(2, 0);
        let mShift = this.manager.random.int(midSize);
        if (shiftDir === 1) {
            mShift = -mShift;
        }
        // Generate the run time for the machines
        const time = this.manager.random.int(2, 9);
        // determines the tile that machine will be on.
        const loc = getMutableTile(MMstart + 1, mid + shift + mShift);
        // makes the machine
        const machine = this.manager.create.machine({
            oreType: "redium",
            refineTime: time,
            refineInput: (Math.floor(time / 2) + 1),
            refineOutput: Math.floor(time / 2),
            tile: loc,
        });
        // Assigned the tile it's machine.
        loc.machine = machine;
        // Adds the machine to the list
        this.machines.push(machine);
        // generates structures that fill in the rest of the center area
        // top area
        // makes sure there is a top area.
        if (shift !== -(Math.floor(this.mapHeight / 2) - midSize)) {
            // if it has the smallest possible space and still exist, hallway time.
            if (shift === -(Math.floor(this.mapHeight / 2) - midSize - 2)) {
                this.drawDoor(MMstart, 1, 2, getMutableTile);
            }
            // if there are 2 spaces.
            else if (shift === -(Math.floor(this.mapHeight / 2) - midSize - 5)) {
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2), 1, mid - midSize + shift - 3, getMutableTile, false, true, true, false);
            }
            // if the room is bigger.
            else {
                // generates the rooms.
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2), 1, mid - midSize + shift - 1, getMutableTile, false, true, true, false);
            }
        }
        // bottom area
        if (shift !== Math.floor(this.mapHeight / 2) + midSize) {
            // generate for smallest leftover area - make a hallway
            if (shift === Math.floor(this.mapHeight / 2) + midSize - 2) {
                this.drawDoor(MMstart, 21, 2, getMutableTile);
            }
            // generate 2 tall area.
            else if (shift === Math.floor(this.mapHeight / 2) - midSize - 5) {
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2), mid + midSize + shift + 3, this.mapHeight - 2, getMutableTile, true, true, false, false);
            }
            else {
                // generates the rooms.
                this.roomCalc(MMstart + 1, Math.floor((this.mapWidth - 2) / 2), mid + midSize + shift + 1, this.mapHeight - 2, getMutableTile, true, true, false, false);
            }
        }
        // generate Side area
        this.roomCalc(RMstart + 1, MMstart - 1, 1, this.mapHeight - 2, getMutableTile, false, true, false, true, Math.min((this.mapHeight * this.mapWidth) / 700));
        // mirror map
        // iterate over every tile from the created half.
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth / 2; x++) {
                // copies walls.
                getMutableTile((this.mapWidth - 1 - x), y).isWall = getMutableTile(x, y).isWall;
                // copies decoration values.
                getMutableTile((this.mapWidth - 1 - x), y).decoration = getMutableTile(x, y).decoration;
                // check for a machine.
                if (getMutableTile(x, y).machine) {
                    // grab the machine.
                    const mach = getMutableTile(x, y).machine;
                    // doubly make sure it exists, because typescript.
                    if (mach === undefined) {
                        throw new Error(`The machine you are copying: ${mach}, doesn't exist!`);
                    }
                    // make a new machine.
                    const machine2 = this.manager.create.machine({
                        oreType: "blueium",
                        refineTime: mach.refineTime,
                        refineInput: mach.refineInput,
                        refineOutput: mach.refineOutput,
                        tile: getMutableTile((this.mapWidth - 1 - x), y),
                    });
                    // add te machine to the data.
                    getMutableTile((this.mapWidth - 1 - x), y).machine = machine2;
                    this.machines.push(machine2);
                }
                // if the tile is a spawn tile, copy it.
                else if (getMutableTile(x, y).type === "spawn") {
                    // grab the mirror tile.
                    const tile = getMutableTile((this.mapWidth - 1 - x), y);
                    // add the information.
                    tile.type = "spawn";
                    tile.owner = this.players[1];
                    // push it to the list.
                    this.players[1].spawnTiles.push(tile);
                }
                // if the tile is a generator tile, copy it.
                else if (getMutableTile(x, y).type === "generator") {
                    // grab the mirror tile.
                    const tile = getMutableTile((this.mapWidth - 1 - x), y);
                    // add the information.
                    tile.type = "generator";
                    tile.owner = this.players[1];
                    // push it to the list.
                    this.players[1].generatorTiles.push(tile);
                }
            }
        }
        // spawns one of each unit for the first player.
        for (let i = 0; i < 3; i++) {
            this.spawnUnit(this.players[1], this.jobs[i % 3]);
        }
    }
    /**
     * This creates a room struct and returns it. Saves a lot of space.
     *
     * All of these parameters are for the INSIDE of the room, walls not included!
     * @param x1 - lowest x value of the room.
     * @param x2 - highest x value of a 2 by 2 room.
     * @param y1 - lowest y value of the room.
     * @param y2 - highest y value of a 2 by 2 room.
     * @param y3 - If the room is 3 tall, this is actually the highest value.
     * @param x3 - If the room is 3 wide, this is actually the highest value.
     * @returns - the room object.
     */
    makeRoom(x1, x2, y1, y2, y3 = -1, x3 = -1) {
        return {
            x1, y1,
            x2, y2,
            x3, y3,
            WNorth: true, WEast: true, WSouth: true, WWest: true,
            DNorth: false, DEast: false, DSouth: false, DWest: false,
        };
    }
    /**
     * takes a area and starts the process of filling it with rooms.
     *
     * All of these parameters are for the INSIDE of the room, walls not included!
     * @param x1 - lowest x value of the area.
     * @param x2 - highest x value of the area.
     * @param y1 - lowest y value of the area.
     * @param y2 - highest y value of the area.
     * @param getMutableTile - A function that gets a mutable tile given an (x, y)
     * @param DNorth - If there should be doors to the north.
     * @param DEast - If there should be doors to the East.
     * @param DSouth - If there should be doors to the south.
     * @param DWest - If there should be doors to the west.
     * @param machines - The number of machines you want added to the map.
     * @returns - nothing, calls the next stage
     */
    roomCalc(x1, x2, y1, y2, getMutableTile, DNorth = false, DEast = false, DSouth = false, DWest = false, machines = 0) {
        // determines the number of rooms on the x axis
        const mapW = Math.floor((x2 - x1 + 2) / 3); // MUST be a whole number
        // determines the number of rooms on the y axis
        const mapH = Math.floor((y2 - y1 + 2) / 3);
        if (mapH === 0) {
            return;
        }
        // map used for mapgen.
        const map = [];
        // sets sets up the rest of the map.
        for (let i = 0; i < mapW; i++) {
            map[i] = new Array(mapH);
        }
        // counts the extra y tiles.
        const extraY = (y2 - y1 + 2) % 3;
        // counts extra x tiles.
        const extraX = (x2 - x1 + 2) % 3;
        // make a list of the Y values that will have the 3 tall rooms.
        const yLarge = [];
        for (let y = 0; y < mapH && extraY !== 0; y++) {
            yLarge.push(y);
        }
        // make a list of the X values that will have the 3 wide rooms.
        const xLarge = [];
        for (let x = 0; x < mapW && extraX !== 0; x++) {
            xLarge.push(x);
        }
        // Reduce yLarge until it is has the number of needed 3 tall rooms selected.
        while (yLarge.length > extraY) {
            yLarge.splice(this.manager.random.int(yLarge.length, 0), 1);
        }
        // Reduce xLarge until it is has the number of needed 3 tall rooms selected.
        while (xLarge.length > extraX) {
            xLarge.splice(this.manager.random.int(xLarge.length, 0), 1);
        }
        // variables that account for size 3 rooms.
        let shiftX = 0;
        let shiftY = 0;
        // create the rest of the rooms by iterating over the rest of the map.
        for (let x = 0; x < mapW; x++) {
            for (let y = 0; y < mapH; y++) {
                // create and add the room.
                // if the room is 3 wide.
                if (x === xLarge[shiftX]) {
                    // if the room is a 3 tall.
                    if (y === yLarge[shiftY]) {
                        // create the room.
                        const room = this.makeRoom(x1 + (x * 3) + shiftX, x1 + 1 + (x * 3) + shiftX, y1 + (y * 3) + shiftY, y1 + 1 + (y * 3) + shiftY, y1 + 2 + (y * 3) + shiftY, x1 + 2 + (x * 3) + shiftX);
                        // add the room.
                        map[x][y] = room;
                        // mark the shift so future rooms are place correctly.
                        shiftY++;
                    }
                    // if the room is a 2 tall.
                    else {
                        // create the room.
                        const room = this.makeRoom(x1 + (x * 3) + shiftX, x1 + 1 + (x * 3) + shiftX, y1 + (y * 3) + shiftY, y1 + 1 + (y * 3) + shiftY, -1, x1 + 2 + (x * 3) + shiftX);
                        // add the room.
                        map[x][y] = room;
                    }
                }
                // if the room is 2 wide.
                else {
                    // if the room is a 3 tall.
                    if (y === yLarge[shiftY]) {
                        // create the room.
                        const room = this.makeRoom(x1 + (x * 3) + shiftX, x1 + 1 + (x * 3) + shiftX, y1 + (y * 3) + shiftY, y1 + 1 + (y * 3) + shiftY, y1 + 2 + (y * 3) + shiftY);
                        // add the room.
                        map[x][y] = room;
                        // mark the shift so future rooms are place correctly.
                        shiftY++;
                    }
                    // if the room is a 2 tall.
                    else {
                        // create the room.
                        const room = this.makeRoom(x1 + (x * 3) + shiftX, x1 + 1 + (x * 3) + shiftX, y1 + (y * 3) + shiftY, y1 + 1 + (y * 3) + shiftY);
                        // add the room.
                        map[x][y] = room;
                    }
                }
            }
            shiftY = 0;
            if (x === xLarge[shiftX]) {
                shiftX++;
            }
        }
        // variables to decide random things.
        let shift = 0;
        // if it should add doors to the north.
        if (DNorth) {
            // add doors into the North
            shift = this.manager.random.int(mapW, 0);
            for (let x = 0; x < mapW; x++) {
                if (shift !== x || mapW === 1) {
                    map[x][0].DNorth = true;
                }
            }
        }
        // if it should add doors to the south.
        if (DSouth) {
            // add doors to the south
            shift = this.manager.random.int(mapW, 0);
            for (let x = 0; x < mapW; x++) {
                if (shift !== x || mapW === 1) {
                    map[x][mapH - 1].DSouth = true;
                }
            }
        }
        // if there should be doors to the east.
        if (DEast) {
            // add doors to the east.
            shift = this.manager.random.int(mapH, 0);
            for (let y = 0; y < mapH; y++) {
                if (shift !== y || mapH === 1) {
                    map[mapW - 1][y].DEast = true;
                }
            }
        }
        // if there should be doors to the west
        if (DWest) {
            // add doors ito the west.
            shift = this.manager.random.int(mapH, 0);
            for (let y = 0; y < mapH; y++) {
                if (shift !== y || mapH === 1) {
                    map[0][y].DWest = true;
                }
            }
        }
        // go about filling out the details of the map.
        this.roomFill(map, machines, getMutableTile);
    }
    /**
     * Generates the room connections and doorway connections.
     *
     * @param map - a 2D array that contains room structs that contain map information.
     * @param machines - the number of machines to be added to the map.
     * @param getMutableTile - A function that gets a mutable tile given an (x, y)
     */
    roomFill(map, machines, getMutableTile) {
        // tracks every room in the map list that is unconnected.
        const unconnected = [];
        // master list of random rooms in a easy to grab fashion.
        const roomList = [];
        // tracks all rooms that are eligible to get machines.
        const machRooms = [];
        // tracks the number of connections that need to be made.
        let connect = Math.floor((map.length * map[0].length) / 2);
        // used to track if a direction has been chosen.
        let done = false;
        // adds all the points to the two lists
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                unconnected.push({ x, y });
                roomList.push({ x, y });
                machRooms.push({ x, y });
            }
        }
        // add machines to the map
        if (machines > 0) {
            // place the machines
            for (let i = 0; i < machines - 1; i++) {
                // grabs a random room's location.
                const index = this.manager.random.int(machRooms.length, 0);
                // grabs the room.
                const find = machRooms[index];
                // marks it being chosen
                machRooms.splice(index, 1);
                // removes it's neighbors
                let check = this.has(machRooms, find.x, find.y - 1);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                check = this.has(machRooms, find.x + 1, find.y);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                check = this.has(machRooms, find.x, find.y + 1);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                check = this.has(machRooms, find.x - 1, find.y);
                // if the rooms is in the list.
                if (check !== -1) {
                    // removes the room
                    machRooms.splice(check, 1);
                }
                // adds the machine.
                const room = map[find.x][find.y];
                // sets up a location to be set.
                let loc = getMutableTile(0, 0);
                // if the rooms is 2 tall.
                if (room.y3 === -1) {
                    // if the room is 2 wide.
                    if (room.x3 === -1) {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(2, 0) :
                            this.manager.random.int(4, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 2), room.y1 + (place % 2));
                    }
                    // if the room is 3 wide.
                    else {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(4, 0) :
                            this.manager.random.int(6, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 2), room.y1 + (place % 2));
                    }
                }
                // if the room is 3 tall.
                else {
                    // if the room is 2 wide.
                    if (room.x3 === -1) {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(3, 0) :
                            this.manager.random.int(6, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 3), room.y1 + (place % 3));
                    }
                    // if the room is 3 wide.
                    else {
                        // gets a random location.
                        // check to protect against machine blocked doorways.
                        const place = (find.x === map.length - 1) ? this.manager.random.int(6, 0) :
                            this.manager.random.int(9, 0);
                        // grab the room location
                        loc = getMutableTile(room.x1 + Math.floor(place / 3), room.y1 + (place % 3));
                    }
                }
                // Generate the run time for the machines
                const time = this.manager.random.int(2, 9);
                // makes the machine
                const machine = this.manager.create.machine({
                    oreType: "redium",
                    refineTime: time,
                    refineInput: (Math.floor(time / 2) + 1),
                    refineOutput: Math.floor(time / 2),
                    tile: loc,
                });
                // Assigned the tile it's machine.
                loc.machine = machine;
                // Adds the machine to the list
                this.machines.push(machine);
            }
        }
        // adds extra connects for more rooms connections.
        connect += Math.floor(connect * this.manager.random.float(0.5, 0.25));
        if (roomList.length <= 4) {
            connect = this.manager.random.int(1, -1);
        }
        for (let i = 0; i <= connect; i++) {
            // used to make the map-gen favor connecting unconnected rooms.
            if (unconnected.length > 0) {
                // grabs a random room. Also used to remove it from the list.
                const index = this.manager.random.int(unconnected.length, 0);
                // grabs the room.
                const find = unconnected[index];
                // resets done.
                done = false;
                // picks a random direction.
                let rot = this.manager.random.int(4, 0);
                // makes sure it picks something if no options are optimal.
                let num = 0;
                // a while loop that forces it to pick something.
                while (!done) {
                    // if the direction is north.
                    if (rot === 0) {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x][find.y - 1] && (this.has(unconnected, find.x, find.y - 1) >= 0 || num >= 4)) {
                            // makes the connection.
                            map[find.x][find.y].WNorth = false;
                            map[find.x][find.y - 1].WSouth = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x, find.y - 1) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x, find.y - 1), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot++;
                        }
                    }
                    // if the direction is east
                    else if (rot === 1) {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x + 1] && (this.has(unconnected, find.x + 1, find.y) >= 0 || num >= 5)) {
                            // makes the connection.
                            map[find.x][find.y].WEast = false;
                            map[find.x + 1][find.y].WWest = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x + 1, find.y) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x + 1, find.y), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot++;
                        }
                    }
                    // if the direction is south.
                    else if (rot === 2) {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x][find.y + 1] && (this.has(unconnected, find.x, find.y + 1) >= 0 || num >= 5)) {
                            // makes the connection.
                            map[find.x][find.y].WSouth = false;
                            map[find.x][find.y + 1].WNorth = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x, find.y + 1) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x + 1, find.y), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot++;
                        }
                    }
                    // if the direction is west.
                    else {
                        // checks if the choice is optimal or at least legal
                        if (map[find.x - 1] && (this.has(unconnected, find.x - 1, find.y) >= 0 || num >= 5)) {
                            // makes the connection.
                            map[find.x][find.y].WWest = false;
                            map[find.x - 1][find.y].WEast = false;
                            // the room is connected, so it is removed from unconnected.
                            unconnected.splice(index, 1);
                            // if the other room is in the unconnected list, remove it as well.
                            if (this.has(unconnected, find.x - 1, find.y) >= 0) {
                                unconnected.splice(this.has(unconnected, find.x - 1, find.y), 1);
                            }
                            // it has picked something, let the loop end.
                            done = true;
                        }
                        // otherwise, go to the next and note the failure.
                        else {
                            num++;
                            rot = 0;
                        }
                    }
                }
            }
            // every room as been connected, do a simpler random connection.
            else {
                // grabs a random room.
                const find = roomList[this.manager.random.int(roomList.length, 0)];
                // makes sure it picks a valid direction
                done = false;
                // picks a random direction/
                let rot = this.manager.random.int(4, 0);
                while (!done) {
                    // if it picked north.
                    if (rot === 0) {
                        // make sure the direction is valid.
                        if (map[find.x][find.y - 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WNorth = false;
                            map[find.x][find.y - 1].WSouth = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot++;
                        }
                    }
                    else if (rot === 1) {
                        // make sure the direction is valid.
                        if (map[find.x + 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WEast = false;
                            map[find.x + 1][find.y].WWest = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot++;
                        }
                    }
                    else if (rot === 2) {
                        // make sure the direction is valid.
                        if (map[find.x][find.y + 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WSouth = false;
                            map[find.x][find.y + 1].WNorth = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot++;
                        }
                    }
                    else {
                        // make sure the direction is valid.
                        if (map[find.x - 1]) {
                            // do the connection and end the loop.
                            map[find.x][find.y].WWest = false;
                            map[find.x - 1][find.y].WEast = false;
                            done = true;
                        }
                        // otherwise go to the next direction.
                        else {
                            rot = 0;
                        }
                    }
                }
            }
        }
        // cleanup List to reduce memory usage
        unconnected.length = 0;
        // Que of rooms to be connected
        const toConnectQue = [];
        // used to track rooms that are connected.
        const connected = [];
        // find a starting room.
        const start = roomList[this.manager.random.int(roomList.length, 0)];
        // add starting room.
        connected.push(start);
        // add existing neighbors to the que
        if (map[start.x - 1]) {
            toConnectQue.push({ x: start.x - 1, y: start.y });
        }
        if (map[start.x + 1]) {
            toConnectQue.push({ x: start.x + 1, y: start.y });
        }
        if (map[start.x][start.y - 1]) {
            toConnectQue.push({ x: start.x, y: start.y - 1 });
        }
        if (map[start.x][start.y + 1]) {
            toConnectQue.push({ x: start.x, y: start.y + 1 });
        }
        // making each room make a unique connection.
        while (toConnectQue.length !== 0) {
            // grab the index of the room to be worked with.
            const index = this.manager.random.int(toConnectQue.length, 0);
            // grab the room info.
            const find = toConnectQue[index];
            // mark that the room hasn't been found.
            let found = false;
            // pick a random direction.
            let rot = this.manager.random.int(4, 0);
            // until a room is found.
            while (!found) {
                // check if the north exists and is connected.
                if (rot === 0 && map[find.x][find.y - 1] && this.has(connected, find.x, find.y - 1) >= 0) {
                    // connect it.
                    map[find.x][find.y].DNorth = true;
                    map[find.x][find.y - 1].DSouth = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot++;
                }
                if (rot === 1 && map[find.x + 1] && this.has(connected, find.x + 1, find.y) >= 0) {
                    // connect it.
                    map[find.x][find.y].DEast = true;
                    map[find.x + 1][find.y].DWest = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot++;
                }
                if (rot === 2 && map[find.x][find.y + 1] && this.has(connected, find.x, find.y + 1) >= 0) {
                    // connect it.
                    map[find.x][find.y].DSouth = true;
                    map[find.x][find.y + 1].DNorth = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot++;
                }
                if (map[find.x - 1] && this.has(connected, find.x - 1, find.y) >= 0) {
                    // connect it.
                    map[find.x][find.y].DWest = true;
                    map[find.x - 1][find.y].DEast = true;
                    // remove it from the connection queue.
                    toConnectQue.splice(index, 1);
                    // add the room to the connected list.
                    connected.push(find);
                    // mark that a connection was found.
                    found = true;
                }
                else {
                    // if this direction is invalid, move onto the next one.
                    rot = 0;
                }
                // if a connection was found.
                if (found) {
                    // if the room to the left isn't in either list and exists, add it to the queue
                    if (map[find.x - 1] && this.has(connected, find.x - 1, find.y) === -1 &&
                        this.has(toConnectQue, find.x - 1, find.y) === -1) {
                        toConnectQue.push({ x: find.x - 1, y: find.y });
                    }
                    // if the room to the right isn't in either list and exists, add it to the queue
                    if (map[find.x + 1] && this.has(connected, find.x + 1, find.y) === -1 &&
                        this.has(toConnectQue, find.x + 1, find.y) === -1) {
                        toConnectQue.push({ x: find.x + 1, y: find.y });
                    }
                    // if the room above isn't in either list and exists, add it to the queue
                    if (map[find.x][find.y - 1] && this.has(connected, find.x, find.y - 1) === -1 &&
                        this.has(toConnectQue, find.x, find.y - 1) === -1) {
                        toConnectQue.push({ x: find.x, y: find.y - 1 });
                    }
                    // if the room below isn't in either list and exists, add it to the queue
                    if (map[find.x][find.y + 1] && this.has(connected, find.x, find.y + 1) === -1 &&
                        this.has(toConnectQue, find.x, find.y + 1) === -1) {
                        toConnectQue.push({ x: find.x, y: find.y + 1 });
                    }
                }
            }
        }
        // actually draws all the walls and doors.
        this.draw(map, getMutableTile);
    }
    /**
     * This draws the rooms. only handles simple room clusters, 3 tall, not 3 wide.
     *
     * @param map - a 2D array of rooms for it to draw using.
     * @param getMutableTile - the function for it to grab tiles.
     */
    draw(map, getMutableTile) {
        // Test code to help visualize where it actually places rooms.
        /*for (const x of map) {
            for (const y of x) {
                getMutableTile(y.x1, y.y1).owner = this.players[0];
                getMutableTile(y.x1, y.y1).type = "generator";
                getMutableTile(y.x1, y.y2).owner = this.players[0];
                getMutableTile(y.x1, y.y2).type = "generator";
                getMutableTile(y.x2, y.y1).owner = this.players[0];
                getMutableTile(y.x2, y.y1).type = "generator";
                getMutableTile(y.x2, y.y2).owner = this.players[0];
                getMutableTile(y.x2, y.y2).type = "generator";
                if (y.y3 !== -1) {
                    if (y.x3 !== -1) {
                        getMutableTile(y.x3, y.y1).owner = this.players[0];
                        getMutableTile(y.x3, y.y1).type = "generator";
                        getMutableTile(y.x3, y.y2).owner = this.players[0];
                        getMutableTile(y.x3, y.y2).type = "generator";
                        getMutableTile(y.x1, y.y3).owner = this.players[0];
                        getMutableTile(y.x1, y.y3).type = "generator";
                        getMutableTile(y.x2, y.y3).owner = this.players[0];
                        getMutableTile(y.x2, y.y3).type = "generator";
                        getMutableTile(y.x3, y.y3).owner = this.players[0];
                        getMutableTile(y.x3, y.y3).type = "generator";
                    }
                    else {
                        getMutableTile(y.x1, y.y3).owner = this.players[0];
                        getMutableTile(y.x1, y.y3).type = "generator";
                        getMutableTile(y.x2, y.y3).owner = this.players[0];
                        getMutableTile(y.x2, y.y3).type = "generator";
                    }
                }
                else if (y.x3 !== -1) {
                    getMutableTile(y.x3, y.y1).owner = this.players[0];
                    getMutableTile(y.x3, y.y1).type = "generator";
                    getMutableTile(y.x3, y.y2).owner = this.players[0];
                    getMutableTile(y.x3, y.y2).type = "generator";
                }
            }
        }*/
        // iterate through the rooms of the map.
        let v = 0;
        let w = 0;
        for (const rooms of map) {
            for (const room of rooms) {
                // corners.
                // draw the northern corners
                this.drawCorner(room.x1 - 1, room.y1 - 1, room.WNorth, room.WWest, getMutableTile);
                // if the room is 2 wide.
                if (room.x3 === -1) {
                    this.drawCorner(room.x2 + 1, room.y1 - 1, room.WNorth, room.WEast, getMutableTile);
                    // draw the southern corners, account for different heights
                    // if the room is 2 tall.
                    if (room.y3 === -1) {
                        this.drawCorner(room.x1 - 1, room.y2 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x2 + 1, room.y2 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                    // if the room is 3 tall.
                    else {
                        this.drawCorner(room.x1 - 1, room.y3 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x2 + 1, room.y3 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                }
                // if the room is 3 wide.
                else {
                    this.drawCorner(room.x3 + 1, room.y1 - 1, room.WNorth, room.WEast, getMutableTile);
                    // draw the southern corners, account for different heights
                    // if the room is 2 tall.
                    if (room.y3 === -1) {
                        this.drawCorner(room.x1 - 1, room.y2 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x3 + 1, room.y2 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                    // if the room is 3 tall.
                    else {
                        this.drawCorner(room.x1 - 1, room.y3 + 1, room.WSouth, room.WWest, getMutableTile);
                        this.drawCorner(room.x3 + 1, room.y3 + 1, room.WSouth, room.WEast, getMutableTile);
                    }
                }
                // if there is a wall to the north, draw it.
                if (room.WNorth) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube = map[v][w - 1] && rand <= 8 && ((!map[v][w - 1].WEast && !room.WEast) ||
                        (!map[v][w - 1].WWest && !room.WWest)) ? true : false;
                    // if the room is 3 wide.
                    this.drawWall(room.x1, room.y1 - 1, getMutableTile);
                    getMutableTile(room.x1, room.y1 - 1).decoration = cube ? 1 : 0;
                    this.drawWall(room.x2, room.y1 - 1, getMutableTile);
                    getMutableTile(room.x2, room.y1 - 1).decoration = cube ? 1 : 0;
                    // if the room is 3 wide.
                    if (room.x3 !== -1) {
                        this.drawWall(room.x3, room.y1 - 1, getMutableTile);
                        getMutableTile(room.x3, room.y1 - 1).decoration = cube ? 1 : 0;
                    }
                }
                // if there is a wall to the east, draw it.
                if (room.WEast) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube = map[v + 1] && rand <= 8 && ((!map[v + 1][w].WNorth && !room.WNorth) ||
                        (!map[v + 1][w].WSouth && !room.WSouth)) ? true : false;
                    // if the room is 3 wide.
                    if (room.x3 !== -1) {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x3 + 1, room.y1, getMutableTile);
                        getMutableTile(room.x3 + 1, room.y1).decoration = cube ? 2 : 0;
                        this.drawWall(room.x3 + 1, room.y2, getMutableTile);
                        getMutableTile(room.x3 + 1, room.y2).decoration = cube ? 2 : 0;
                        // if the room is 3 tall.
                        if (room.y3 !== -1) {
                            // place the wall as long as it doesn't cover up a door.
                            this.drawWall(room.x3 + 1, room.y3, getMutableTile);
                            getMutableTile(room.x3 + 1, room.y3).decoration = cube ? 2 : 0;
                        }
                    }
                    // if the room is 2 wide.
                    else {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x2 + 1, room.y1, getMutableTile);
                        getMutableTile(room.x2 + 1, room.y1).decoration = cube ? 2 : 0;
                        this.drawWall(room.x2 + 1, room.y2, getMutableTile);
                        getMutableTile(room.x2 + 1, room.y2).decoration = cube ? 2 : 0;
                        // if the room is 3 tall.
                        if (room.y3 !== -1) {
                            // place the wall as long as it doesn't cover up a door.
                            this.drawWall(room.x2 + 1, room.y3, getMutableTile);
                            getMutableTile(room.x2 + 1, room.y3).decoration = cube ? 2 : 0;
                        }
                    }
                }
                // if there is a wall to the south, drawn it.
                if (room.WSouth) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube = map[v][w + 1] && rand <= 8 && ((!map[v][w + 1].WEast && !room.WEast) ||
                        (!map[v][w + 1].WWest && !room.WWest)) ? true : false;
                    // if the room is 3 tall.
                    if (room.y3 !== -1) {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x1, room.y3 + 1, getMutableTile);
                        getMutableTile(room.x1, room.y3 + 1).decoration = cube ? 1 : 0;
                        this.drawWall(room.x2, room.y3 + 1, getMutableTile);
                        getMutableTile(room.x2, room.y3 + 1).decoration = cube ? 1 : 0;
                        // if the room is 3 wide.
                        if (room.x3 !== -1) {
                            this.drawWall(room.x3, room.y3 + 1, getMutableTile);
                            getMutableTile(room.x3, room.y3 + 1).decoration = cube ? 1 : 0;
                        }
                        // if the room is 2 tall.
                    }
                    else {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x1, room.y2 + 1, getMutableTile);
                        getMutableTile(room.x1, room.y2 + 1).decoration = cube ? 1 : 0;
                        this.drawWall(room.x2, room.y2 + 1, getMutableTile);
                        getMutableTile(room.x2, room.y2 + 1).decoration = cube ? 1 : 0;
                        // if the room is 3 wide.
                        if (room.x3 !== -1) {
                            this.drawWall(room.x3, room.y2 + 1, getMutableTile);
                            getMutableTile(room.x3, room.y2 + 1).decoration = cube ? 1 : 0;
                        }
                    }
                }
                // if there is a wall to the west, draw it.
                if (room.WWest) {
                    const rand = this.manager.random.int(this.cubeConst);
                    const cube = map[v - 1] && rand <= 8 && ((!map[v - 1][w].WNorth && !room.WNorth) ||
                        (!map[v - 1][w].WSouth && !room.WSouth)) ? true : false;
                    // place the wall as long as it doesn't cover up a door.
                    this.drawWall(room.x1 - 1, room.y1, getMutableTile);
                    getMutableTile(room.x1 - 1, room.y1).decoration = cube ? 2 : 0;
                    this.drawWall(room.x1 - 1, room.y2, getMutableTile);
                    getMutableTile(room.x1 - 1, room.y2).decoration = cube ? 2 : 0;
                    // if the room is 3 tall.
                    if (room.y3 !== -1) {
                        // place the wall as long as it doesn't cover up a door.
                        this.drawWall(room.x1 - 1, room.y3, getMutableTile);
                        getMutableTile(room.x1 - 1, room.y3).decoration = cube ? 2 : 0;
                    }
                }
                w++;
            }
            v++;
            w = 0;
        }
        // iterate over the map in order to draw rooms.
        for (let x = 0; x < map.length; x++) {
            for (let y = 0; y < map[0].length; y++) {
                const room = map[x][y];
                // start drawing walls
                let shift = 0;
                // if there is door to the north, draw it.
                if (room.DNorth === true) {
                    // make sure it is drawn only once.
                    if (map[x][y - 1]) {
                        map[x][y - 1].DSouth = false;
                    }
                    // figure out which part of the wall to make the door.
                    if (room.WNorth === true) {
                        // determines possible placements depending on room size.
                        const size = room.x3 === -1 ? 2 : 3;
                        // pick a random spot.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        //  decide which spot the door should be on.
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(room.x1 + i, room.y1 - 2).machine !== undefined ||
                                    getMutableTile(room.x1 + i, room.y1).machine !== undefined) && temp < size) ||
                                    getMutableTile(room.x1 + i, room.y1 - 2).isWall ||
                                    getMutableTile(room.x1 + i, room.y1 - 2).decoration === 1 ||
                                    getMutableTile(room.x1 + i, room.y1 - 2).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(room.x1, room.y1 - 1, 1, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(room.x2, room.y1 - 1, 1, getMutableTile);
                        }
                        else {
                            this.drawDoor(room.x3, room.y1 - 1, 1, getMutableTile);
                        }
                    }
                }
                // if there is a door to the east.
                if (room.DEast === true) {
                    // make sure it is drawn only once.
                    if (map[x + 1]) {
                        map[x + 1][y].DWest = false;
                    }
                    if (room.WEast === true) {
                        // determines possible placements depending on room size.
                        const size = room.y3 === -1 ? 2 : 3;
                        // determines which x value will be used
                        const roomX = room.x3 === -1 ? room.x2 : room.x3;
                        // figure out which part of the wall to make the door.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(roomX + 2, room.y1 + i).machine !== undefined ||
                                    getMutableTile(roomX, room.y1 + i).machine !== undefined) && temp < size) ||
                                    getMutableTile(roomX + 2, room.y1 + i).isWall ||
                                    getMutableTile(roomX + 2, room.y1 + i).decoration === 1 ||
                                    getMutableTile(roomX + 2, room.y1 + i).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(roomX + 1, room.y1, 2, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(roomX + 1, room.y2, 2, getMutableTile);
                        }
                        else {
                            this.drawDoor(roomX + 1, room.y3, 2, getMutableTile);
                        }
                    }
                }
                if (room.DSouth === true) {
                    // make sure it is drawn only once.
                    if (map[x][y + 1]) {
                        map[x][y + 1].DNorth = false;
                    }
                    if (room.WSouth === true) {
                        // determines possible placements depending on room size.
                        const size = room.x3 === -1 ? 2 : 3;
                        // determines which y value will be used
                        const roomY = room.y3 === -1 ? room.y2 : room.y3;
                        // figure out which part of the wall to make the door.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(room.x1 + i, roomY + 2).machine !== undefined ||
                                    getMutableTile(room.x1 + i, roomY).machine !== undefined) && temp < size) ||
                                    getMutableTile(room.x1 + i, roomY + 2).isWall ||
                                    getMutableTile(room.x1 + i, roomY + 2).decoration === 1 ||
                                    getMutableTile(room.x1 + i, roomY + 2).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(room.x1, roomY + 1, 1, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(room.x2, roomY + 1, 1, getMutableTile);
                        }
                        else {
                            this.drawDoor(room.x3, roomY + 1, 1, getMutableTile);
                        }
                    }
                }
                if (room.DWest === true) {
                    // make sure it is drawn only once.
                    if (map[x - 1]) {
                        map[x - 1][y].DEast = false;
                    }
                    if (room.WWest === true) {
                        // determines possible placements depending on room size.
                        const size = room.y3 === -1 ? 2 : 3;
                        // figure out which part of the wall to make the door.
                        shift = this.manager.random.int(size, 0);
                        // used to count attempts to make sure the best outcome is reached.
                        let temp = 0;
                        for (let i = 0; i < size; i++) {
                            // if the loop is at the current shift.
                            if (shift === i) {
                                // check if it would create a path-able doorway.
                                if (((getMutableTile(room.x1 - 2, room.y1 + i).machine !== undefined ||
                                    getMutableTile(room.x1, room.y1 + i).machine !== undefined) && temp < size) ||
                                    getMutableTile(room.x1 - 2, room.y1 + i).isWall ||
                                    getMutableTile(room.x1 - 2, room.y1 + i).decoration === 1 ||
                                    getMutableTile(room.x1 - 2, room.y1 + i).decoration === 2) {
                                    // try a different spot.
                                    shift++;
                                    // if the current shift is invalid, make it valid. Restart the loop.
                                    if (shift >= size) {
                                        shift = 0;
                                        i = 0;
                                    }
                                    // note the attempt.
                                    temp++;
                                }
                            }
                        }
                        // depending on the spot chosen, add the door.
                        if (shift === 0) {
                            this.drawDoor(room.x1 - 1, room.y1, 2, getMutableTile);
                        }
                        else if (shift === 1) {
                            this.drawDoor(room.x1 - 1, room.y2, 2, getMutableTile);
                        }
                        else {
                            this.drawDoor(room.x1 - 1, room.y3, 2, getMutableTile);
                        }
                    }
                }
            }
        }
    }
    /**
     * this draws a corner if there aren't room connections in that direction.
     *
     * @param x - the x point the corner will be placed at.
     * @param y - the y point the corner will be placed at.
     * @param dir1 - direction one to check to see if the corner should be placed.
     * @param dir2 - direction two to check to see if the corner should be placed.
     * @param getMutableTile - the function for it to grab tiles.
     * @returns nothing.
     */
    drawCorner(x, y, dir1, dir2, getMutableTile) {
        if (dir1 === true || dir2 === true) {
            getMutableTile(x, y).isWall = true;
        }
    }
    /**
     * this draws walls and makes sure that there isn't a door there.
     *
     * @param x - the x point the corner will be placed at.
     * @param y - the y point the corner will be placed at.
     * @param getMutableTile - the function for it to grab tiles.
     * @returns nothing.
     */
    drawWall(x, y, getMutableTile) {
        if (getMutableTile(x, y).decoration !== 1) {
            getMutableTile(x, y).isWall = true;
        }
    }
    /**
     * this draws walls and makes sure that there isn't a door there.
     *
     * @param x - the x point the corner will be placed at.
     * @param y - the y point the corner will be placed at.
     * @param d - decoration value of the door. Default of 1
     * @param getMutableTile - the function for it to grab tiles.
     * @returns nothing.
     */
    drawDoor(x, y, d = 1, getMutableTile) {
        getMutableTile(x, y).isWall = false;
        getMutableTile(x, y).decoration = d;
    }
    /**
     * this makes sure the room is in the list. I was uncreative with the name.
     *
     * @param uncon - a list of x and y points.
     * @param x - the x point you are checking for.
     * @param y - the y point you are checking for.
     * @returns returns it's index or -1 if it doesn't exist.
     */
    has(uncon, x, y) {
        for (let w = 0; w < uncon.length; w++) {
            if (uncon[w].x === x && uncon[w].y === y) {
                return w;
            }
        }
        return -1;
    }
    /**
     * Attempts to spawn in a unit for a given player.
     * @param player - The player that will own the unit.
     * @param job - The job of the unit.
     */
    spawnUnit(player, job) {
        // Iterate through each player's spawn tiles to find a spot to spawn unit.
        for (const tile of player.spawnTiles) {
            // Check to see if there is a Unit on the tile.
            // If there is move on to the next tile.
            if (tile.unit) {
                continue;
            }
            // Else spawn in Unit and return success to spawning.
            else {
                tile.unit = this.manager.create.unit({
                    acted: false,
                    health: job.health,
                    job,
                    owner: player,
                    tile,
                    moves: job.moves,
                });
                player.units.push(tile.unit);
                this.units.push(tile.unit);
                return;
            }
        }
    }
}
exports.NewtonianGame = NewtonianGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZXd0b25pYW4vZ2FtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlCQUFpQztBQWdEakM7OztHQUdHO0FBRUgsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsYUFBYyxTQUFRLGNBQVcsQ0FBQyxJQUFJO0lBdUkvQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNjLGVBQTZDLEVBQ3ZELFFBQXlDO1FBRXpDLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIdkIsb0JBQWUsR0FBZixlQUFlLENBQThCO1FBaEozRCxrRUFBa0U7UUFDbEQsYUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQTZIdEUsb0NBQW9DO1FBQ3BDOztXQUVHO1FBQ2MsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQW1CcEMscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFakIsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7T0FNRztJQUNJLE9BQU8sQ0FBQyxDQUFTLEVBQUUsQ0FBUztRQUMvQix5Q0FBeUM7UUFDekMsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQXFCLENBQUM7SUFDbkQsQ0FBQztJQUVELHFEQUFxRDtJQUNyRCx1Q0FBdUM7SUFDL0IsVUFBVTtRQUNkLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDVixJQUFJ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QkFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFM0IsT0FBTzthQUNWO1NBQ0o7SUFDTCxDQUFDO0NBR0o7QUFoakRELHNDQWdqREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJhc2VDbGFzc2VzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBOZXd0b25pYW5HYW1lTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtbWFuYWdlclwiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBOZXd0b25pYW5HYW1lU2V0dGluZ3NNYW5hZ2VyIH0gZnJvbSBcIi4vZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBNYWNoaW5lIH0gZnJvbSBcIi4vbWFjaGluZVwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuaW1wb3J0IHsgVW5pdCB9IGZyb20gXCIuL3VuaXRcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBJUG9pbnQsIE11dGFibGUgfSBmcm9tIFwifi91dGlsc1wiO1xuXG4vKiogaW50ZXJmYWNlIHVzZWQgdG8gY3JlYXRlIHJvb21zLnMgKi9cbmludGVyZmFjZSBJUm9vbSB7XG4gICAgLy8gcm9vbSBsb2NhdGlvbnMgdG8gYmUgc3RvcmVkLlxuICAgIC8qKiB4MSBwb3NpdGlvbiAqL1xuICAgIHgxOiBudW1iZXI7XG4gICAgLyoqIHkxIHBvc2l0aW9uICovXG4gICAgeTE6IG51bWJlcjtcbiAgICAvKiogeDIgcG9zaXRpb24gKi9cbiAgICB4MjogbnVtYmVyO1xuICAgIC8qKiB5MiBwb3NpdGlvbiAqL1xuICAgIHkyOiBudW1iZXI7XG4gICAgLyoqIHgzIHBvc2l0aW9uICovXG4gICAgeDM6IG51bWJlcjtcbiAgICAvKiogeTMgcG9zaXRpb24gKi9cbiAgICB5MzogbnVtYmVyO1xuXG4gICAgLy8gdHJhY2tzIGRvb3JzIGFuZCB3YWxscy5cbiAgICAvKiogRmxhZyBmb3IgdGhpcyBkaXJlY3Rpb24/ICovXG4gICAgV05vcnRoOiBib29sZWFuO1xuICAgIC8qKiBGbGFnIGZvciB0aGlzIGRpcmVjdGlvbj8gKi9cbiAgICBXRWFzdDogYm9vbGVhbjtcbiAgICAvKiogRmxhZyBmb3IgdGhpcyBkaXJlY3Rpb24/ICovXG4gICAgV1NvdXRoOiBib29sZWFuO1xuICAgIC8qKiBGbGFnIGZvciB0aGlzIGRpcmVjdGlvbj8gKi9cbiAgICBXV2VzdDogYm9vbGVhbjtcbiAgICAvKiogRmxhZyBmb3IgdGhpcyBkaXJlY3Rpb24/ICovXG4gICAgRE5vcnRoOiBib29sZWFuO1xuICAgIC8qKiBGbGFnIGZvciB0aGlzIGRpcmVjdGlvbj8gKi9cbiAgICBERWFzdDogYm9vbGVhbjtcbiAgICAvKiogRmxhZyBmb3IgdGhpcyBkaXJlY3Rpb24/ICovXG4gICAgRFNvdXRoOiBib29sZWFuO1xuICAgIC8qKiBGbGFnIGZvciB0aGlzIGRpcmVjdGlvbj8gKi9cbiAgICBEV2VzdDogYm9vbGVhbjtcbn1cblxuLyppbnRlcmZhY2UgSUNvbnZleW9yIHtcbiAgICB4OiBudW1iZXI7IHk6IG51bWJlcjtcbiAgICBkaXJlY3Rpb246IFRpbGVbXCJkaXJlY3Rpb25cIl07XG59Ki9cblxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIENvbWJpbmUgZWxlbWVudHMgYW5kIGJlIHRoZSBmaXJzdCBzY2llbnRpc3RzIHRvIGNyZWF0ZSBmdXNpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXd0b25pYW5HYW1lIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZSB7XG4gICAgLyoqIFRoZSBtYW5hZ2VyIG9mIHRoaXMgZ2FtZSwgdGhhdCBjb250cm9scyBldmVyeXRoaW5nIGFyb3VuZCBpdCAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VyITogTmV3dG9uaWFuR2FtZU1hbmFnZXI7XG5cbiAgICAvKiogVGhlIHNldHRpbmdzIHVzZWQgdG8gaW5pdGlhbGl6ZSB0aGUgZ2FtZSwgYXMgc2V0IGJ5IHBsYXllcnMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2V0dGluZ3MgPSBPYmplY3QuZnJlZXplKHRoaXMuc2V0dGluZ3NNYW5hZ2VyLnZhbHVlcyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIHdob3NlIHR1cm4gaXQgaXMgY3VycmVudGx5LiBUaGF0IHBsYXllciBjYW4gc2VuZCBjb21tYW5kcy5cbiAgICAgKiBPdGhlciBwbGF5ZXJzIGNhbm5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFBsYXllciE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHR1cm4gbnVtYmVyLCBzdGFydGluZyBhdCAwIGZvciB0aGUgZmlyc3QgcGxheWVyJ3MgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFR1cm4hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcHBpbmcgb2YgZXZlcnkgZ2FtZSBvYmplY3QncyBJRCB0byB0aGUgYWN0dWFsIGdhbWUgb2JqZWN0LiBQcmltYXJpbHlcbiAgICAgKiB1c2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNsaWVudCB0byBlYXNpbHkgcmVmZXIgdG8gdGhlIGdhbWUgb2JqZWN0cyB2aWFcbiAgICAgKiBJRC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZU9iamVjdHMhOiB7W2lkOiBzdHJpbmddOiBHYW1lT2JqZWN0fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiBpbnRlcm5zIGEgcGxheWVyIGNhbiBoYXZlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBpbnRlcm5DYXAhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIGxpc3Qgb2YgYWxsIGpvYnMuIGZpcnN0IGl0ZW0gaXMgaW50ZXJuLCBzZWNvbmQgaXMgcGh5c2ljaXN0cywgYW5kXG4gICAgICogdGhpcmQgaXMgbWFuYWdlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgam9icyE6IEpvYltdO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgTWFjaGluZSBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgbWFjaGluZXMhOiBNYWNoaW5lW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgbWFuYWdlcnMgYSBwbGF5ZXIgY2FuIGhhdmUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hbmFnZXJDYXAhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIFRpbGVzIGluIHRoZSBtYXAgYWxvbmcgdGhlIHkgKHZlcnRpY2FsKSBheGlzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYXBIZWlnaHQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIFRpbGVzIGluIHRoZSBtYXAgYWxvbmcgdGhlIHggKGhvcml6b250YWwpIGF4aXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hcFdpZHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBtYXRlcmlhbHMgdGhhdCBzcGF3biBwZXIgc3Bhd24gY3ljbGUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hdGVyaWFsU3Bhd24hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYmVmb3JlIHRoZSBnYW1lIHdpbGwgYXV0b21hdGljYWxseSBlbmQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1heFR1cm5zITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIHBoeXNpY2lzdHMgYSBwbGF5ZXIgY2FuIGhhdmUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHBoeXNpY2lzdENhcCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBwbGF5ZXJzITogUGxheWVyW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHZpY3RvcnkgcG9pbnRzIGFkZGVkIHdoZW4gYSByZWZpbmVkIG9yZSBpcyBjb25zdW1lZCBieSB0aGVcbiAgICAgKiBnZW5lcmF0b3IuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHJlZmluZWRWYWx1ZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwZXJjZW50IG9mIG1heCBIUCByZWdhaW5lZCB3aGVuIGEgdW5pdCBlbmQgdGhlaXIgdHVybiBvbiBhIHRpbGVcbiAgICAgKiBvd25lZCBieSB0aGVpciBwbGF5ZXIuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHJlZ2VuZXJhdGVSYXRlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGdhbWUgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBwbGF5ZWQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNlc3Npb24hOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHR1cm5zIGl0IHRha2VzIGEgdW5pdCB0byBzcGF3bi5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc3Bhd25UaW1lITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0dXJucyBhIHVuaXQgY2Fubm90IGRvIGFueXRoaW5nIHdoZW4gc3R1bm5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc3R1blRpbWUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIHRpbGVzIGluIHRoZSBtYXAsIHN0b3JlZCBpbiBSb3ctbWFqb3Igb3JkZXIuIFVzZSBgeCArIHkgKlxuICAgICAqIG1hcFdpZHRoYCB0byBhY2Nlc3MgdGhlIGNvcnJlY3QgaW5kZXguXG4gICAgICovXG4gICAgcHVibGljIHRpbGVzITogVGlsZVtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIGFkZGVkIGFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGFcbiAgICAgKiB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aW1lQWRkZWRQZXJUdXJuITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciB0dXJucyBhIHVuaXQgaXMgaW1tdW5lIHRvIGJlaW5nIHN0dW5uZWQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbWVJbW11bmUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBFdmVyeSBVbml0IGluIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyB1bml0cyE6IFVuaXRbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgY29tYmluZWQgaGVhdCBhbmQgcHJlc3N1cmUgdGhhdCB5b3UgbmVlZCB0byB3aW4uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHZpY3RvcnlBbW91bnQhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGEgY29uc3QgdXNlZCB0byBtb2RpZnkgdGhlIGFtb3VudCBvZiB3YWxscyB0aGF0IHJlY2VpdmUgdGhlIGRlY29yYXRpb24gdmFsdWUgb2YgMS8yLlxuICAgICAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY3ViZUNvbnN0OiBudW1iZXIgPSAyMDtcbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgR2FtZSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNldHRpbmdzTWFuYWdlciAtIFRoZSBtYW5hZ2VyIHRoYXQgaG9sZHMgaW5pdGlhbCBzZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHNldHRpbmdzTWFuYWdlcjogTmV3dG9uaWFuR2FtZVNldHRpbmdzTWFuYWdlcixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZVJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHNldHRpbmdzTWFuYWdlciwgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgdGhpcy5jcmVhdGVKb2JzKCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVNYXAoKTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdGlsZSBhdCAoeCwgeSksIG9yIHVuZGVmaW5lZCBpZiB0aGUgY28tb3JkaW5hdGVzIGFyZSBvZmYtbWFwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHggLSBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgZGVzaXJlZCB0aWxlLlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgcG9zaXRpb24gb2YgdGhlIGRlc2lyZWQgdGlsZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgVGlsZSBhdCAoeCwgeSkgaWYgdmFsaWQsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGdldFRpbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdldFRpbGUoeCwgeSkgYXMgVGlsZSB8IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuICAgIC8qKiBDcmVhdGVzIGFsbCB0aGUgSm9icyBpbiB0aGUgZ2FtZSAqL1xuICAgIHByaXZhdGUgY3JlYXRlSm9icygpOiB2b2lkIHtcbiAgICAgICAgLy8gcHVzaCBhbGwgdGhyZWUgam9icy5cbiAgICAgICAgdGhpcy5qb2JzLnB1c2goXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmpvYih7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiaW50ZXJuXCIsXG4gICAgICAgICAgICAgICAgY2FycnlMaW1pdDogNCxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDQsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiAxMixcbiAgICAgICAgICAgICAgICBtb3ZlczogNSxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmpvYih7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwicGh5c2ljaXN0XCIsXG4gICAgICAgICAgICAgICAgY2FycnlMaW1pdDogMSxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDQsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiAxMixcbiAgICAgICAgICAgICAgICBtb3ZlczogNSxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmpvYih7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibWFuYWdlclwiLFxuICAgICAgICAgICAgICAgIGNhcnJ5TGltaXQ6IDMsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiA0LFxuICAgICAgICAgICAgICAgIGhlYWx0aDogMTYsXG4gICAgICAgICAgICAgICAgbW92ZXM6IDUsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgdGhlIG1hcCBieSBtb2RpZnlpbmcgVGlsZXMgaW4gdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjcmVhdGVNYXAoKTogdm9pZCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGdldCBhIG11dGFibGUgdGlsZSBhdCBhIGdpdmVuICh4LCB5KS5cbiAgICAgICAgICpcbiAgICAgICAgICogTk9URTogVGhpcyBpcyBhIGNsb3N1cmUgZnVuY3Rpb24uIEl0IGlzIGEgZnVuY3Rpb24gd2UgY3JlYXRlIHdoaWxlXG4gICAgICAgICAqIHJ1bm5pbmcgY3JlYXRlTWFwKCksIGFuZCBpdCB3cmFwcyB0aGUgY3VycmVudCBzY29wZSwgc28gdGhhdCBgdGhpc2BcbiAgICAgICAgICogcmVmZXJzIHRvIHRoZSBHYW1lIHJ1bm5pbmcgYGNyZWF0ZU1hcCgpYCwgZXZlbiB0aG91Z2ggdGhlIGdhbWUgd2FzXG4gICAgICAgICAqIG5vdCBwYXNzZWQuXG4gICAgICAgICAqIEBwYXJhbSB4IC0gVGhlIHggY29vcmRpbmF0ZS4gSWYgb2ZmIG1hcCB0aHJvd3MgYW4gRXJyb3IuXG4gICAgICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgY29vcmRpbmF0ZS4gSWYgb2ZmIG1hcCB0aHJvd3MgYW4gRXJyb3IuXG4gICAgICAgICAqIEByZXR1cm5zIEEgVGlsZSB0aGF0IGlzIG11dGFibGUgSlVTVCBmb3IgdGhpcyBmdW5jdGlvbiBzY29wZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGdldE11dGFibGVUaWxlID0gKHg6IG51bWJlciwgeTogbnVtYmVyKTogTXV0YWJsZTxUaWxlPiA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5nZXRUaWxlKHgsIHkpO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZ2V0IGEgdGlsZSBmb3IgbWFwIGdlbmVyYXRpb24gYXQgKCR7eH0sICR7eX0pYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aWxlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIG1hcmtzIHdoZXJlIHRoZSBzcGF3biBhcmVhIGVuZHMgYW5kIHRoZSByb29tcyBiZWdpbi5cbiAgICAgICAgY29uc3QgUk1zdGFydCA9IE1hdGguZmxvb3IodGhpcy5tYXBXaWR0aCAqIDAuMTA1KTtcbiAgICAgICAgLy8gbWFya3Mgd2hlcmUgdGhlIG1pZGRsZSBhcmVhIG9mIHRoZSBtYXAgYmVnaW5zLlxuICAgICAgICBjb25zdCBNTXN0YXJ0ID0gTWF0aC5mbG9vcih0aGlzLm1hcFdpZHRoICogMC4zNjMpO1xuICAgICAgICAvLyBtYXJrcyB3aGVyZSB0aGUgc3Bhd24gcm9vbSBpbiB0aGUgc3Bhd24gYXJlYSBlbmRzLlxuICAgICAgICBjb25zdCBzcGF3bkVuZCA9IE1hdGguZmxvb3IodGhpcy5tYXBIZWlnaHQgKiAwLjMwNCk7XG4gICAgICAgIC8vIG1hcmtzIHdoZXJlIHRoZSBnZW5lcmF0b3Igcm9vbSBpbiB0aGUgc3Bhd24gYXJlYSBlbmRzLlxuICAgICAgICBjb25zdCBnZW5FbmQgPSBNYXRoLmZsb29yKHRoaXMubWFwSGVpZ2h0ICogMC42NTMpO1xuICAgICAgICAvLyBtYXJrcyBob3cgbWFueSB0aWxlcyB3aWRlIHRoZSBzcGF3biBhbmQgZ2VuZXJhdG9yIGFyZSwgYXMgd2VsbCBhcyBjb252ZXlvcnMuXG4gICAgICAgIGNvbnN0IHN0YXJ0RW5kID0gTWF0aC5jZWlsKHRoaXMubWFwV2lkdGggKiAwLjA3Myk7XG4gICAgICAgIC8vIHVzZWQgdG8gdHJhY2sgdGhlIG1hcHMgbWlkLXBvaW50LlxuICAgICAgICBjb25zdCBtaWQgPSBNYXRoLmZsb29yKHRoaXMubWFwSGVpZ2h0IC8gMik7XG4gICAgICAgIC8vIGl0ZXJhdGVzIG92ZXIgdGhlIG1hcCBhbmQgYWRkcyBiYXNpYyBzdHJ1Y3R1cmUuXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgKHRoaXMubWFwV2lkdGggLyAyICsgMSk7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcEhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHkgPT09IDAgLy8gYm90dG9tIGVkZ2Ugb2YgbWFwXG4gICAgICAgICAgICAgICAgIHx8IHkgPT09ICh0aGlzLm1hcEhlaWdodCAtIDEpIC8vIHRvcCBlZGdlIG9mIG1hcFxuICAgICAgICAgICAgICAgICB8fCB4ID09PSAwIC8vIGxlZnQgZWRnZSBvZiBtYXBcbiAgICAgICAgICAgICAgICAgfHwgeCA9PT0gUk1zdGFydFxuICAgICAgICAgICAgICAgICB8fCB4ID09PSBNTXN0YXJ0XG4gICAgICAgICAgICAgICAgLy8gfHwgeCA9PT0gTWF0aC5mbG9vcih0aGlzLm1hcFdpZHRoIC8gMikgLSAxXG4gICAgICAgICAgICAgICAgIHx8ICh4IDwgc3RhcnRFbmQgJiYgKHkgPT09IHNwYXduRW5kIHx8IHkgPT09IGdlbkVuZCkpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHgsIHkpLmlzV2FsbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS0tIFNldCBzcGF3biBhcmVhIC0tLSBcXFxcXG4gICAgICAgIGZvciAobGV0IHkgPSAxOyB5IDwgc3Bhd25FbmQ7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDE7IHggPD0gc3RhcnRFbmQgLSAxOyB4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gZ2V0TXV0YWJsZVRpbGUoeCwgeSk7XG5cbiAgICAgICAgICAgICAgICB0aWxlLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgIHRpbGUudHlwZSA9IFwic3Bhd25cIjtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbMF0uc3Bhd25UaWxlcy5wdXNoKHRpbGUgYXMgVGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyAtLS0gU2V0IGdlbmVyYXRvciBhcmVhIC0tLSBcXFxcXG4gICAgICAgIGZvciAobGV0IHkgPSBzcGF3bkVuZCArIDE7IHkgPCBnZW5FbmQ7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDE7IHggPD0gc3RhcnRFbmQgLSAxOyB4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gZ2V0TXV0YWJsZVRpbGUoeCwgeSk7XG5cbiAgICAgICAgICAgICAgICB0aWxlLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgIHRpbGUudHlwZSA9IFwiZ2VuZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzWzBdLmdlbmVyYXRvclRpbGVzLnB1c2godGlsZSBhcyBUaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tLSBTZXQgcmVzb3VyY2Ugc3Bhd24gLS0tIFxcXFxcbiAgICAgICAgY29uc3QgY29udmV5b3JzOiBBcnJheTx7XG4gICAgICAgICAgICAvKiogeCBwb3NpdGlvbiBmb3IgdGhlIGNvbnZleW9yICovXG4gICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAvKiogeSBwb3NpdGlvbiBmb3IgdGhlIGNvbnZleW9yICovXG4gICAgICAgICAgICB5OiBudW1iZXI7XG4gICAgICAgICAgICAvKiogVGhlIGRpcmVjdGlvbiBvZiB0aGUgY29udmV5b3IgKi9cbiAgICAgICAgICAgIGRpcmVjdGlvbjogVGlsZVtcImRpcmVjdGlvblwiXTtcbiAgICAgICAgfT4gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeCA9IDE7IHggPCBzdGFydEVuZCAtIDE7IHgrKykge1xuICAgICAgICAgICAgY29udmV5b3JzLnB1c2goe3gsIHk6IHRoaXMubWFwSGVpZ2h0IC0gMywgZGlyZWN0aW9uOiBcImVhc3RcIn0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHkgPSB0aGlzLm1hcEhlaWdodCAtIDM7IHkgPiBnZW5FbmQgKyAyOyB5LS0pIHtcbiAgICAgICAgICAgIGNvbnZleW9ycy5wdXNoKHt4OiBzdGFydEVuZCAtIDEsIHksIGRpcmVjdGlvbjogXCJub3J0aFwifSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeCA9IHN0YXJ0RW5kIC0gMTsgeCA+IDE7IHgtLSkge1xuICAgICAgICAgICAgY29udmV5b3JzLnB1c2goe3gsIHk6IGdlbkVuZCArIDIsIGRpcmVjdGlvbjogXCJ3ZXN0XCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBjb252ZXlvcnMucHVzaCh7eDogMSwgeTogZ2VuRW5kICsgMiwgZGlyZWN0aW9uOiBcImJsYW5rXCJ9KTtcbiAgICAgICAgZm9yIChjb25zdCB7IHgsIHksIGRpcmVjdGlvbiB9IG9mIGNvbnZleW9ycykge1xuICAgICAgICAgICAgbGV0IHRpbGUgPSBnZXRNdXRhYmxlVGlsZSh4LCB5KTtcbiAgICAgICAgICAgIHRpbGUudHlwZSA9IFwiY29udmV5b3JcIjtcbiAgICAgICAgICAgIHRpbGUuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzWzBdLmNvbnZleW9ycy5wdXNoKHRpbGUgYXMgVGlsZSk7XG4gICAgICAgICAgICB0aWxlID0gZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSAxIC0geCksIHkpO1xuICAgICAgICAgICAgdGlsZS50eXBlID0gXCJjb252ZXlvclwiO1xuICAgICAgICAgICAgbGV0IGRpciA9IGRpcmVjdGlvbjtcbiAgICAgICAgICAgIGlmIChkaXIgPT09IFwiZWFzdFwiKSB7XG4gICAgICAgICAgICAgICAgZGlyID0gXCJ3ZXN0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChkaXIgPT09IFwid2VzdFwiKSB7XG4gICAgICAgICAgICAgICAgZGlyID0gXCJlYXN0XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aWxlLmRpcmVjdGlvbiA9IGRpcjtcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1sxXS5jb252ZXlvcnMucHVzaCh0aWxlIGFzIFRpbGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNwYXducyBvbmUgb2YgZWFjaCB1bml0IGZvciB0aGUgZmlyc3QgcGxheWVyLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zcGF3blVuaXQodGhpcy5wbGF5ZXJzWzBdLCB0aGlzLmpvYnNbaSAlIDNdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzZXRzIHVwIHNwYXduIHRpbWVzLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW2ldLmludGVyblNwYXduID0gdGhpcy5zcGF3blRpbWU7XG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbaV0ucGh5c2ljaXN0U3Bhd24gPSB0aGlzLnNwYXduVGltZTtcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1tpXS5tYW5hZ2VyU3Bhd24gPSB0aGlzLnNwYXduVGltZTtcbiAgICAgICAgfVxuICAgICAgICAvLyAtLS0gR2VuZXJhdGUgY2VudGVyIC0tLSBcXFxcXG4gICAgICAgIC8vIERldGVybWluZSB0aGUgc2l6ZSBvZiB0aGUgY2VudGVyIHJvb21cbiAgICAgICAgY29uc3QgbWlkU2l6ZSA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDYsIDMpO1xuICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIHJvb21zIG9mZnNldFxuICAgICAgICBsZXQgc2hpZnQgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludChNYXRoLmZsb29yKHRoaXMubWFwSGVpZ2h0IC8gMikgLSBtaWRTaXplKTtcbiAgICAgICAgLy8gbGV0IHNoaWZ0ID0gTWF0aC5mbG9vcih0aGlzLm1hcEhlaWdodCAvIDIpIC0gbWlkU2l6ZSAtIDM7IC8vIGZvciB0ZXN0aW5nXG4gICAgICAgIC8vIEVkZ2UgY2FzZSBoYW5kbGluZyB0byBtYWtlIHN1cmUgd2FsbHMgZG9uJ3QgdG91Y2guXG4gICAgICAgIGlmIChzaGlmdCA9PT0gTWF0aC5mbG9vcih0aGlzLm1hcEhlaWdodCAvIDIpIC0gbWlkU2l6ZSAtIDEpIHtcbiAgICAgICAgICAgIHNoaWZ0Kys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGVjaWRlcyBpZiB0aGUgcm9vbXMgc2hpZnRzIHVwd2FyZHMgb3IgZG93bndhcmRzXG4gICAgICAgIC8qKiB1c2VkIHRvIGRldGVybWluZSByYW5kb20gc2hpZnRzIGFuZCBkb29yd2F5cyAqL1xuICAgICAgICBsZXQgc2hpZnREaXIgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludCgyLCAwKTsgLy8gMCA9IHNtYWxsIHNvdXRoLCAxID0gc21hbGwgbm9ydGhcbiAgICAgICAgLy8gc2hpZnREaXIgPSAwOyAvLyB1c2VkIGZvciB0ZXN0aW5nLlxuICAgICAgICAvKiogRGV0ZXJtaW5lcyB0aGUgc2hpcCBvZiB0aGUgbWlkZGxlIHJvb20gKi9cbiAgICAgICAgaWYgKHNoaWZ0RGlyID09PSAxKSB7XG4gICAgICAgICAgICBzaGlmdCA9IC1zaGlmdDtcbiAgICAgICAgfVxuICAgICAgICAvKiogRGV0ZXJtaW5lcyBtYWNoaW5lcyBzaGlmdCAqL1xuICAgICAgICBzaGlmdERpciA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDIsIDApO1xuICAgICAgICBsZXQgbVNoaWZ0ID0gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQobWlkU2l6ZSk7XG4gICAgICAgIGlmIChzaGlmdERpciA9PT0gMSkge1xuICAgICAgICAgICAgbVNoaWZ0ID0gLW1TaGlmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdlbmVyYXRlIHRoZSBydW4gdGltZSBmb3IgdGhlIG1hY2hpbmVzXG4gICAgICAgIGNvbnN0IHRpbWUgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludCgyLCA5KTtcbiAgICAgICAgLy8gZGV0ZXJtaW5lcyB0aGUgdGlsZSB0aGF0IG1hY2hpbmUgd2lsbCBiZSBvbi5cbiAgICAgICAgY29uc3QgbG9jID0gZ2V0TXV0YWJsZVRpbGUoTU1zdGFydCArIDEsIG1pZCArIHNoaWZ0ICsgbVNoaWZ0KTtcbiAgICAgICAgLy8gbWFrZXMgdGhlIG1hY2hpbmVcbiAgICAgICAgY29uc3QgbWFjaGluZSA9IHRoaXMubWFuYWdlci5jcmVhdGUubWFjaGluZSh7XG4gICAgICAgICAgICBvcmVUeXBlOiBcInJlZGl1bVwiLFxuICAgICAgICAgICAgcmVmaW5lVGltZTogdGltZSxcbiAgICAgICAgICAgIHJlZmluZUlucHV0OiAoTWF0aC5mbG9vcih0aW1lIC8gMikgKyAxKSxcbiAgICAgICAgICAgIHJlZmluZU91dHB1dDogTWF0aC5mbG9vcih0aW1lIC8gMiksXG4gICAgICAgICAgICB0aWxlOiBsb2MgYXMgVGlsZSxcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEFzc2lnbmVkIHRoZSB0aWxlIGl0J3MgbWFjaGluZS5cbiAgICAgICAgbG9jLm1hY2hpbmUgPSBtYWNoaW5lO1xuICAgICAgICAvLyBBZGRzIHRoZSBtYWNoaW5lIHRvIHRoZSBsaXN0XG4gICAgICAgIHRoaXMubWFjaGluZXMucHVzaChtYWNoaW5lKTtcblxuICAgICAgICAvLyBnZW5lcmF0ZXMgc3RydWN0dXJlcyB0aGF0IGZpbGwgaW4gdGhlIHJlc3Qgb2YgdGhlIGNlbnRlciBhcmVhXG4gICAgICAgIC8vIHRvcCBhcmVhXG4gICAgICAgIC8vIG1ha2VzIHN1cmUgdGhlcmUgaXMgYSB0b3AgYXJlYS5cbiAgICAgICAgaWYgKHNoaWZ0ICE9PSAtKE1hdGguZmxvb3IodGhpcy5tYXBIZWlnaHQgLyAyKSAtIG1pZFNpemUpKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBoYXMgdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHNwYWNlIGFuZCBzdGlsbCBleGlzdCwgaGFsbHdheSB0aW1lLlxuICAgICAgICAgICAgaWYgKHNoaWZ0ID09PSAtKE1hdGguZmxvb3IodGhpcy5tYXBIZWlnaHQgLyAyKSAtIG1pZFNpemUgLSAyKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3IoTU1zdGFydCwgMSwgMiwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIDIgc3BhY2VzLlxuICAgICAgICAgICAgZWxzZSBpZiAoc2hpZnQgPT09IC0oTWF0aC5mbG9vcih0aGlzLm1hcEhlaWdodCAvIDIpIC0gbWlkU2l6ZSAtIDUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb29tQ2FsYyhNTXN0YXJ0ICsgMSwgTWF0aC5mbG9vcigodGhpcy5tYXBXaWR0aCAtIDIpIC8gMiksIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaWQgLSBtaWRTaXplICsgc2hpZnQgLSAzLCBnZXRNdXRhYmxlVGlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLCB0cnVlLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyBiaWdnZXIuXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBnZW5lcmF0ZXMgdGhlIHJvb21zLlxuICAgICAgICAgICAgICAgIHRoaXMucm9vbUNhbGMoTU1zdGFydCArIDEsIE1hdGguZmxvb3IoKHRoaXMubWFwV2lkdGggLSAyKSAvIDIpLCAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWlkIC0gbWlkU2l6ZSArIHNoaWZ0IC0gMSwgZ2V0TXV0YWJsZVRpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGJvdHRvbSBhcmVhXG4gICAgICAgIGlmIChzaGlmdCAhPT0gTWF0aC5mbG9vcih0aGlzLm1hcEhlaWdodCAvIDIpICsgbWlkU2l6ZSkge1xuICAgICAgICAgICAgLy8gZ2VuZXJhdGUgZm9yIHNtYWxsZXN0IGxlZnRvdmVyIGFyZWEgLSBtYWtlIGEgaGFsbHdheVxuICAgICAgICAgICAgaWYgKHNoaWZ0ID09PSBNYXRoLmZsb29yKHRoaXMubWFwSGVpZ2h0IC8gMikgKyBtaWRTaXplIC0gMikge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3IoTU1zdGFydCwgMjEsIDIsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIDIgdGFsbCBhcmVhLlxuICAgICAgICAgICAgZWxzZSBpZiAoc2hpZnQgPT09IE1hdGguZmxvb3IodGhpcy5tYXBIZWlnaHQgLyAyKSAtIG1pZFNpemUgLSA1KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb29tQ2FsYyhNTXN0YXJ0ICsgMSwgTWF0aC5mbG9vcigodGhpcy5tYXBXaWR0aCAtIDIpIC8gMiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaWQgKyBtaWRTaXplICsgc2hpZnQgKyAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXBIZWlnaHQgLSAyLCBnZXRNdXRhYmxlVGlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsIHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBnZW5lcmF0ZXMgdGhlIHJvb21zLlxuICAgICAgICAgICAgICAgIHRoaXMucm9vbUNhbGMoTU1zdGFydCArIDEsIE1hdGguZmxvb3IoKHRoaXMubWFwV2lkdGggLSAyKSAvIDIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWlkICsgbWlkU2l6ZSArIHNoaWZ0ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwSGVpZ2h0IC0gMiwgZ2V0TXV0YWJsZVRpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGdlbmVyYXRlIFNpZGUgYXJlYVxuICAgICAgICB0aGlzLnJvb21DYWxjKFJNc3RhcnQgKyAxLCBNTXN0YXJ0IC0gMSwgMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFwSGVpZ2h0IC0gMiwgZ2V0TXV0YWJsZVRpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSwgdHJ1ZSwgZmFsc2UsIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1pbigodGhpcy5tYXBIZWlnaHQgKiB0aGlzLm1hcFdpZHRoKSAvIDcwMCkpO1xuICAgICAgICAvLyBtaXJyb3IgbWFwXG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBldmVyeSB0aWxlIGZyb20gdGhlIGNyZWF0ZWQgaGFsZi5cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcEhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMubWFwV2lkdGggLyAyOyB4KyspIHtcbiAgICAgICAgICAgICAgICAvLyBjb3BpZXMgd2FsbHMuXG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSAxIC0geCksIHkpLmlzV2FsbCA9IGdldE11dGFibGVUaWxlKHgsIHkpLmlzV2FsbDtcbiAgICAgICAgICAgICAgICAvLyBjb3BpZXMgZGVjb3JhdGlvbiB2YWx1ZXMuXG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSAxIC0geCksIHkpLmRlY29yYXRpb24gPSBnZXRNdXRhYmxlVGlsZSh4LCB5KS5kZWNvcmF0aW9uO1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGZvciBhIG1hY2hpbmUuXG4gICAgICAgICAgICAgICAgaWYgKGdldE11dGFibGVUaWxlKHgsIHkpLm1hY2hpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgbWFjaGluZS5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFjaCA9IGdldE11dGFibGVUaWxlKHgsIHkpLm1hY2hpbmU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRvdWJseSBtYWtlIHN1cmUgaXQgZXhpc3RzLCBiZWNhdXNlIHR5cGVzY3JpcHQuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYWNoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIG1hY2hpbmUgeW91IGFyZSBjb3B5aW5nOiAke21hY2h9LCBkb2Vzbid0IGV4aXN0IWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgYSBuZXcgbWFjaGluZS5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWFjaGluZTIgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLm1hY2hpbmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3JlVHlwZTogXCJibHVlaXVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZpbmVUaW1lOiBtYWNoLnJlZmluZVRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZpbmVJbnB1dDogbWFjaC5yZWZpbmVJbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZmluZU91dHB1dDogbWFjaC5yZWZpbmVPdXRwdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlOiBnZXRNdXRhYmxlVGlsZSgodGhpcy5tYXBXaWR0aCAtIDEgLSB4KSwgeSkgYXMgVGlsZSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0ZSBtYWNoaW5lIHRvIHRoZSBkYXRhLlxuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSgodGhpcy5tYXBXaWR0aCAtIDEgLSB4KSwgeSkubWFjaGluZSA9IG1hY2hpbmUyO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hY2hpbmVzLnB1c2gobWFjaGluZTIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgdGlsZSBpcyBhIHNwYXduIHRpbGUsIGNvcHkgaXQuXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZ2V0TXV0YWJsZVRpbGUoeCwgeSkudHlwZSA9PT0gXCJzcGF3blwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgdGhlIG1pcnJvciB0aWxlLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSAxIC0geCksIHkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGluZm9ybWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICB0aWxlLnR5cGUgPSBcInNwYXduXCI7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUub3duZXIgPSB0aGlzLnBsYXllcnNbMV07XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2ggaXQgdG8gdGhlIGxpc3QuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWVyc1sxXS5zcGF3blRpbGVzLnB1c2godGlsZSBhcyBUaWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHRpbGUgaXMgYSBnZW5lcmF0b3IgdGlsZSwgY29weSBpdC5cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS50eXBlID09PSBcImdlbmVyYXRvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgdGhlIG1pcnJvciB0aWxlLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSAxIC0geCksIHkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGluZm9ybWF0aW9uLlxuICAgICAgICAgICAgICAgICAgICB0aWxlLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgICAgICB0aWxlLm93bmVyID0gdGhpcy5wbGF5ZXJzWzFdO1xuICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIGl0IHRvIHRoZSBsaXN0LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbMV0uZ2VuZXJhdG9yVGlsZXMucHVzaCh0aWxlIGFzIFRpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBzcGF3bnMgb25lIG9mIGVhY2ggdW5pdCBmb3IgdGhlIGZpcnN0IHBsYXllci5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuc3Bhd25Vbml0KHRoaXMucGxheWVyc1sxXSwgdGhpcy5qb2JzW2kgJSAzXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGNyZWF0ZXMgYSByb29tIHN0cnVjdCBhbmQgcmV0dXJucyBpdC4gU2F2ZXMgYSBsb3Qgb2Ygc3BhY2UuXG4gICAgICpcbiAgICAgKiBBbGwgb2YgdGhlc2UgcGFyYW1ldGVycyBhcmUgZm9yIHRoZSBJTlNJREUgb2YgdGhlIHJvb20sIHdhbGxzIG5vdCBpbmNsdWRlZCFcbiAgICAgKiBAcGFyYW0geDEgLSBsb3dlc3QgeCB2YWx1ZSBvZiB0aGUgcm9vbS5cbiAgICAgKiBAcGFyYW0geDIgLSBoaWdoZXN0IHggdmFsdWUgb2YgYSAyIGJ5IDIgcm9vbS5cbiAgICAgKiBAcGFyYW0geTEgLSBsb3dlc3QgeSB2YWx1ZSBvZiB0aGUgcm9vbS5cbiAgICAgKiBAcGFyYW0geTIgLSBoaWdoZXN0IHkgdmFsdWUgb2YgYSAyIGJ5IDIgcm9vbS5cbiAgICAgKiBAcGFyYW0geTMgLSBJZiB0aGUgcm9vbSBpcyAzIHRhbGwsIHRoaXMgaXMgYWN0dWFsbHkgdGhlIGhpZ2hlc3QgdmFsdWUuXG4gICAgICogQHBhcmFtIHgzIC0gSWYgdGhlIHJvb20gaXMgMyB3aWRlLCB0aGlzIGlzIGFjdHVhbGx5IHRoZSBoaWdoZXN0IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIC0gdGhlIHJvb20gb2JqZWN0LlxuICAgICAqL1xuICAgIHByaXZhdGUgbWFrZVJvb20oeDE6IG51bWJlciwgeDI6IG51bWJlciwgeTE6IG51bWJlciwgeTI6IG51bWJlciwgeTM6IG51bWJlciA9IC0xLCB4MzogbnVtYmVyID0gLTEpOiBJUm9vbSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4MSwgeTEsXG4gICAgICAgICAgICB4MiwgeTIsXG4gICAgICAgICAgICB4MywgeTMsXG4gICAgICAgICAgICBXTm9ydGg6IHRydWUsIFdFYXN0OiB0cnVlLCBXU291dGg6IHRydWUsIFdXZXN0OiB0cnVlLFxuICAgICAgICAgICAgRE5vcnRoOiBmYWxzZSwgREVhc3Q6IGZhbHNlLCBEU291dGg6IGZhbHNlLCBEV2VzdDogZmFsc2UsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGFrZXMgYSBhcmVhIGFuZCBzdGFydHMgdGhlIHByb2Nlc3Mgb2YgZmlsbGluZyBpdCB3aXRoIHJvb21zLlxuICAgICAqXG4gICAgICogQWxsIG9mIHRoZXNlIHBhcmFtZXRlcnMgYXJlIGZvciB0aGUgSU5TSURFIG9mIHRoZSByb29tLCB3YWxscyBub3QgaW5jbHVkZWQhXG4gICAgICogQHBhcmFtIHgxIC0gbG93ZXN0IHggdmFsdWUgb2YgdGhlIGFyZWEuXG4gICAgICogQHBhcmFtIHgyIC0gaGlnaGVzdCB4IHZhbHVlIG9mIHRoZSBhcmVhLlxuICAgICAqIEBwYXJhbSB5MSAtIGxvd2VzdCB5IHZhbHVlIG9mIHRoZSBhcmVhLlxuICAgICAqIEBwYXJhbSB5MiAtIGhpZ2hlc3QgeSB2YWx1ZSBvZiB0aGUgYXJlYS5cbiAgICAgKiBAcGFyYW0gZ2V0TXV0YWJsZVRpbGUgLSBBIGZ1bmN0aW9uIHRoYXQgZ2V0cyBhIG11dGFibGUgdGlsZSBnaXZlbiBhbiAoeCwgeSlcbiAgICAgKiBAcGFyYW0gRE5vcnRoIC0gSWYgdGhlcmUgc2hvdWxkIGJlIGRvb3JzIHRvIHRoZSBub3J0aC5cbiAgICAgKiBAcGFyYW0gREVhc3QgLSBJZiB0aGVyZSBzaG91bGQgYmUgZG9vcnMgdG8gdGhlIEVhc3QuXG4gICAgICogQHBhcmFtIERTb3V0aCAtIElmIHRoZXJlIHNob3VsZCBiZSBkb29ycyB0byB0aGUgc291dGguXG4gICAgICogQHBhcmFtIERXZXN0IC0gSWYgdGhlcmUgc2hvdWxkIGJlIGRvb3JzIHRvIHRoZSB3ZXN0LlxuICAgICAqIEBwYXJhbSBtYWNoaW5lcyAtIFRoZSBudW1iZXIgb2YgbWFjaGluZXMgeW91IHdhbnQgYWRkZWQgdG8gdGhlIG1hcC5cbiAgICAgKiBAcmV0dXJucyAtIG5vdGhpbmcsIGNhbGxzIHRoZSBuZXh0IHN0YWdlXG4gICAgICovXG4gICAgcHJpdmF0ZSByb29tQ2FsYyh4MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MTogbnVtYmVyLCB5MjogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGU6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gTXV0YWJsZTxUaWxlPixcbiAgICAgICAgICAgICAgICAgICAgIEROb3J0aDogYm9vbGVhbiA9IGZhbHNlLCBERWFzdDogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgRFNvdXRoOiBib29sZWFuID0gZmFsc2UsIERXZXN0OiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICBtYWNoaW5lczogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgICAgICAvLyBkZXRlcm1pbmVzIHRoZSBudW1iZXIgb2Ygcm9vbXMgb24gdGhlIHggYXhpc1xuICAgICAgICBjb25zdCBtYXBXID0gTWF0aC5mbG9vcigoeDIgLSB4MSArIDIpIC8gMyk7IC8vIE1VU1QgYmUgYSB3aG9sZSBudW1iZXJcbiAgICAgICAgLy8gZGV0ZXJtaW5lcyB0aGUgbnVtYmVyIG9mIHJvb21zIG9uIHRoZSB5IGF4aXNcbiAgICAgICAgY29uc3QgbWFwSCA9IE1hdGguZmxvb3IoKHkyIC0geTEgKyAyKSAvIDMpO1xuICAgICAgICBpZiAobWFwSCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1hcCB1c2VkIGZvciBtYXBnZW4uXG4gICAgICAgIGNvbnN0IG1hcDogSVJvb21bXVtdID0gW107XG4gICAgICAgIC8vIHNldHMgc2V0cyB1cCB0aGUgcmVzdCBvZiB0aGUgbWFwLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1hcFc7IGkrKykge1xuICAgICAgICAgICAgbWFwW2ldID0gbmV3IEFycmF5KG1hcEgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvdW50cyB0aGUgZXh0cmEgeSB0aWxlcy5cbiAgICAgICAgY29uc3QgZXh0cmFZID0gKHkyIC0geTEgKyAyKSAlIDM7XG4gICAgICAgIC8vIGNvdW50cyBleHRyYSB4IHRpbGVzLlxuICAgICAgICBjb25zdCBleHRyYVggPSAoeDIgLSB4MSArIDIpICUgMztcbiAgICAgICAgLy8gbWFrZSBhIGxpc3Qgb2YgdGhlIFkgdmFsdWVzIHRoYXQgd2lsbCBoYXZlIHRoZSAzIHRhbGwgcm9vbXMuXG4gICAgICAgIGNvbnN0IHlMYXJnZTogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtYXBIICYmIGV4dHJhWSAhPT0gMDsgeSsrKSB7XG4gICAgICAgICAgICB5TGFyZ2UucHVzaCh5KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIGEgbGlzdCBvZiB0aGUgWCB2YWx1ZXMgdGhhdCB3aWxsIGhhdmUgdGhlIDMgd2lkZSByb29tcy5cbiAgICAgICAgY29uc3QgeExhcmdlOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG1hcFcgJiYgZXh0cmFYICE9PSAwOyB4KyspIHtcbiAgICAgICAgICAgIHhMYXJnZS5wdXNoKHgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlZHVjZSB5TGFyZ2UgdW50aWwgaXQgaXMgaGFzIHRoZSBudW1iZXIgb2YgbmVlZGVkIDMgdGFsbCByb29tcyBzZWxlY3RlZC5cbiAgICAgICAgd2hpbGUgKHlMYXJnZS5sZW5ndGggPiBleHRyYVkpIHtcbiAgICAgICAgICAgIHlMYXJnZS5zcGxpY2UodGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoeUxhcmdlLmxlbmd0aCwgMCksIDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlZHVjZSB4TGFyZ2UgdW50aWwgaXQgaXMgaGFzIHRoZSBudW1iZXIgb2YgbmVlZGVkIDMgdGFsbCByb29tcyBzZWxlY3RlZC5cbiAgICAgICAgd2hpbGUgKHhMYXJnZS5sZW5ndGggPiBleHRyYVgpIHtcbiAgICAgICAgICAgIHhMYXJnZS5zcGxpY2UodGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoeExhcmdlLmxlbmd0aCwgMCksIDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGFjY291bnQgZm9yIHNpemUgMyByb29tcy5cbiAgICAgICAgbGV0IHNoaWZ0WCA9IDA7XG4gICAgICAgIGxldCBzaGlmdFkgPSAwO1xuICAgICAgICAvLyBjcmVhdGUgdGhlIHJlc3Qgb2YgdGhlIHJvb21zIGJ5IGl0ZXJhdGluZyBvdmVyIHRoZSByZXN0IG9mIHRoZSBtYXAuXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbWFwVzsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IG1hcEg7IHkrKykge1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSBhbmQgYWRkIHRoZSByb29tLlxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDMgd2lkZS5cbiAgICAgICAgICAgICAgICBpZiAoeCA9PT0geExhcmdlW3NoaWZ0WF0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgYSAzIHRhbGwuXG4gICAgICAgICAgICAgICAgICAgIGlmICh5ID09PSB5TGFyZ2Vbc2hpZnRZXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSByb29tLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm9vbSA9IHRoaXMubWFrZVJvb20oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDEgKyAoeCAqIDMpICsgc2hpZnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxICsgMSArICh4ICogMykgKyBzaGlmdFgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTEgKyAoeSAqIDMpICsgc2hpZnRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkxICsgMSArICh5ICogMykgKyBzaGlmdFksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTEgKyAyICsgKHkgKiAzKSArIHNoaWZ0WSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSArIDIgKyAoeCAqIDMpICsgc2hpZnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgcm9vbS5cbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcFt4XVt5XSA9IHJvb207XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXJrIHRoZSBzaGlmdCBzbyBmdXR1cmUgcm9vbXMgYXJlIHBsYWNlIGNvcnJlY3RseS5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0WSsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIGEgMiB0YWxsLlxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgcm9vbS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb20gPSB0aGlzLm1ha2VSb29tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxICsgKHggKiAzKSArIHNoaWZ0WCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSArIDEgKyAoeCAqIDMpICsgc2hpZnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkxICsgKHkgKiAzKSArIHNoaWZ0WSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5MSArIDEgKyAoeSAqIDMpICsgc2hpZnRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxICsgMiArICh4ICogMykgKyBzaGlmdFgsXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSByb29tLlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW3hdW3ldID0gcm9vbTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAyIHdpZGUuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIGEgMyB0YWxsLlxuICAgICAgICAgICAgICAgICAgICBpZiAoeSA9PT0geUxhcmdlW3NoaWZ0WV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgcm9vbS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb20gPSB0aGlzLm1ha2VSb29tKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxICsgKHggKiAzKSArIHNoaWZ0WCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4MSArIDEgKyAoeCAqIDMpICsgc2hpZnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkxICsgKHkgKiAzKSArIHNoaWZ0WSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5MSArIDEgKyAoeSAqIDMpICsgc2hpZnRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkxICsgMiArICh5ICogMykgKyBzaGlmdFksXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSByb29tLlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW3hdW3ldID0gcm9vbTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhlIHNoaWZ0IHNvIGZ1dHVyZSByb29tcyBhcmUgcGxhY2UgY29ycmVjdGx5LlxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnRZKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgYSAyIHRhbGwuXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSByb29tLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm9vbSA9IHRoaXMubWFrZVJvb20oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDEgKyAoeCAqIDMpICsgc2hpZnRYLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHgxICsgMSArICh4ICogMykgKyBzaGlmdFgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTEgKyAoeSAqIDMpICsgc2hpZnRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkxICsgMSArICh5ICogMykgKyBzaGlmdFksXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSByb29tLlxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW3hdW3ldID0gcm9vbTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoaWZ0WSA9IDA7XG4gICAgICAgICAgICBpZiAoeCA9PT0geExhcmdlW3NoaWZ0WF0pIHtcbiAgICAgICAgICAgICAgICBzaGlmdFgrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB2YXJpYWJsZXMgdG8gZGVjaWRlIHJhbmRvbSB0aGluZ3MuXG4gICAgICAgIGxldCBzaGlmdCA9IDA7XG4gICAgICAgIC8vIGlmIGl0IHNob3VsZCBhZGQgZG9vcnMgdG8gdGhlIG5vcnRoLlxuICAgICAgICBpZiAoRE5vcnRoKSB7XG4gICAgICAgICAgICAvLyBhZGQgZG9vcnMgaW50byB0aGUgTm9ydGhcbiAgICAgICAgICAgIHNoaWZ0ID0gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQobWFwVywgMCk7XG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG1hcFc7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmIChzaGlmdCAhPT0geCB8fCBtYXBXID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcFt4XVswXS5ETm9ydGggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBpdCBzaG91bGQgYWRkIGRvb3JzIHRvIHRoZSBzb3V0aC5cbiAgICAgICAgaWYgKERTb3V0aCkge1xuICAgICAgICAgICAgLy8gYWRkIGRvb3JzIHRvIHRoZSBzb3V0aFxuICAgICAgICAgICAgc2hpZnQgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludChtYXBXLCAwKTtcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbWFwVzsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNoaWZ0ICE9PSB4IHx8IG1hcFcgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwW3hdW21hcEggLSAxXS5EU291dGggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGVyZSBzaG91bGQgYmUgZG9vcnMgdG8gdGhlIGVhc3QuXG4gICAgICAgIGlmIChERWFzdCkge1xuICAgICAgICAgICAgLy8gYWRkIGRvb3JzIHRvIHRoZSBlYXN0LlxuICAgICAgICAgICAgc2hpZnQgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludChtYXBILCAwKTtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbWFwSDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNoaWZ0ICE9PSB5IHx8IG1hcEggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwW21hcFcgLSAxXVt5XS5ERWFzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHRoZXJlIHNob3VsZCBiZSBkb29ycyB0byB0aGUgd2VzdFxuICAgICAgICBpZiAoRFdlc3QpIHtcbiAgICAgICAgICAgIC8vIGFkZCBkb29ycyBpdG8gdGhlIHdlc3QuXG4gICAgICAgICAgICBzaGlmdCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KG1hcEgsIDApO1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBtYXBIOyB5KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoc2hpZnQgIT09IHkgfHwgbWFwSCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBtYXBbMF1beV0uRFdlc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBnbyBhYm91dCBmaWxsaW5nIG91dCB0aGUgZGV0YWlscyBvZiB0aGUgbWFwLlxuICAgICAgICB0aGlzLnJvb21GaWxsKG1hcCwgbWFjaGluZXMsIGdldE11dGFibGVUaWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgdGhlIHJvb20gY29ubmVjdGlvbnMgYW5kIGRvb3J3YXkgY29ubmVjdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbWFwIC0gYSAyRCBhcnJheSB0aGF0IGNvbnRhaW5zIHJvb20gc3RydWN0cyB0aGF0IGNvbnRhaW4gbWFwIGluZm9ybWF0aW9uLlxuICAgICAqIEBwYXJhbSBtYWNoaW5lcyAtIHRoZSBudW1iZXIgb2YgbWFjaGluZXMgdG8gYmUgYWRkZWQgdG8gdGhlIG1hcC5cbiAgICAgKiBAcGFyYW0gZ2V0TXV0YWJsZVRpbGUgLSBBIGZ1bmN0aW9uIHRoYXQgZ2V0cyBhIG11dGFibGUgdGlsZSBnaXZlbiBhbiAoeCwgeSlcbiAgICAgKi9cbiAgICBwcml2YXRlIHJvb21GaWxsKG1hcDogSVJvb21bXVtdLCBtYWNoaW5lczogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGU6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gTXV0YWJsZTxUaWxlPik6IHZvaWQge1xuICAgICAgICAvLyB0cmFja3MgZXZlcnkgcm9vbSBpbiB0aGUgbWFwIGxpc3QgdGhhdCBpcyB1bmNvbm5lY3RlZC5cbiAgICAgICAgY29uc3QgdW5jb25uZWN0ZWQ6IElQb2ludFtdID0gW107XG4gICAgICAgIC8vIG1hc3RlciBsaXN0IG9mIHJhbmRvbSByb29tcyBpbiBhIGVhc3kgdG8gZ3JhYiBmYXNoaW9uLlxuICAgICAgICBjb25zdCByb29tTGlzdDogSVBvaW50W10gPSBbXTtcbiAgICAgICAgLy8gdHJhY2tzIGFsbCByb29tcyB0aGF0IGFyZSBlbGlnaWJsZSB0byBnZXQgbWFjaGluZXMuXG4gICAgICAgIGNvbnN0IG1hY2hSb29tczogSVBvaW50W10gPSBbXTtcbiAgICAgICAgLy8gdHJhY2tzIHRoZSBudW1iZXIgb2YgY29ubmVjdGlvbnMgdGhhdCBuZWVkIHRvIGJlIG1hZGUuXG4gICAgICAgIGxldCBjb25uZWN0ID0gTWF0aC5mbG9vcigobWFwLmxlbmd0aCAqIG1hcFswXS5sZW5ndGgpIC8gMik7XG4gICAgICAgIC8vIHVzZWQgdG8gdHJhY2sgaWYgYSBkaXJlY3Rpb24gaGFzIGJlZW4gY2hvc2VuLlxuICAgICAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgICAgICAvLyBhZGRzIGFsbCB0aGUgcG9pbnRzIHRvIHRoZSB0d28gbGlzdHNcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBtYXAubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgbWFwWzBdLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgdW5jb25uZWN0ZWQucHVzaCh7eCwgeX0pO1xuICAgICAgICAgICAgICAgIHJvb21MaXN0LnB1c2goe3gsIHl9KTtcbiAgICAgICAgICAgICAgICBtYWNoUm9vbXMucHVzaCh7eCwgeX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZCBtYWNoaW5lcyB0byB0aGUgbWFwXG4gICAgICAgIGlmIChtYWNoaW5lcyA+IDApIHtcbiAgICAgICAgICAgIC8vIHBsYWNlIHRoZSBtYWNoaW5lc1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYWNoaW5lcyAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIGdyYWJzIGEgcmFuZG9tIHJvb20ncyBsb2NhdGlvbi5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KG1hY2hSb29tcy5sZW5ndGgsIDApO1xuICAgICAgICAgICAgICAgIC8vIGdyYWJzIHRoZSByb29tLlxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQgPSBtYWNoUm9vbXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIC8vIG1hcmtzIGl0IGJlaW5nIGNob3NlblxuICAgICAgICAgICAgICAgIG1hY2hSb29tcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZXMgaXQncyBuZWlnaGJvcnNcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2sgPSB0aGlzLmhhcyhtYWNoUm9vbXMsIGZpbmQueCwgZmluZC55IC0gMSk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb21zIGlzIGluIHRoZSBsaXN0LlxuICAgICAgICAgICAgICAgIGlmIChjaGVjayAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgcm9vbVxuICAgICAgICAgICAgICAgICAgICBtYWNoUm9vbXMuc3BsaWNlKGNoZWNrLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2sgPSB0aGlzLmhhcyhtYWNoUm9vbXMsIGZpbmQueCArIDEsIGZpbmQueSk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb21zIGlzIGluIHRoZSBsaXN0LlxuICAgICAgICAgICAgICAgIGlmIChjaGVjayAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgcm9vbVxuICAgICAgICAgICAgICAgICAgICBtYWNoUm9vbXMuc3BsaWNlKGNoZWNrLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2sgPSB0aGlzLmhhcyhtYWNoUm9vbXMsIGZpbmQueCwgZmluZC55ICsgMSk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb21zIGlzIGluIHRoZSBsaXN0LlxuICAgICAgICAgICAgICAgIGlmIChjaGVjayAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgcm9vbVxuICAgICAgICAgICAgICAgICAgICBtYWNoUm9vbXMuc3BsaWNlKGNoZWNrLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2sgPSB0aGlzLmhhcyhtYWNoUm9vbXMsIGZpbmQueCAtIDEsIGZpbmQueSk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb21zIGlzIGluIHRoZSBsaXN0LlxuICAgICAgICAgICAgICAgIGlmIChjaGVjayAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgcm9vbVxuICAgICAgICAgICAgICAgICAgICBtYWNoUm9vbXMuc3BsaWNlKGNoZWNrLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gYWRkcyB0aGUgbWFjaGluZS5cbiAgICAgICAgICAgICAgICBjb25zdCByb29tID0gbWFwW2ZpbmQueF1bZmluZC55XTtcbiAgICAgICAgICAgICAgICAvLyBzZXRzIHVwIGEgbG9jYXRpb24gdG8gYmUgc2V0LlxuICAgICAgICAgICAgICAgIGxldCBsb2MgPSBnZXRNdXRhYmxlVGlsZSgwLCAwKTtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbXMgaXMgMiB0YWxsLlxuICAgICAgICAgICAgICAgIGlmIChyb29tLnkzID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAyIHdpZGUuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb29tLngzID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0cyBhIHJhbmRvbSBsb2NhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRvIHByb3RlY3QgYWdhaW5zdCBtYWNoaW5lIGJsb2NrZWQgZG9vcndheXMuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGFjZSA9IChmaW5kLnggPT09IG1hcC5sZW5ndGggLSAxKSA/IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDIsIDApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yYW5kb20uaW50KDQsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgcm9vbSBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jID0gZ2V0TXV0YWJsZVRpbGUocm9vbS54MSArIE1hdGguZmxvb3IocGxhY2UgLyAyKSwgcm9vbS55MSArIChwbGFjZSAlIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHdpZGUuXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0cyBhIHJhbmRvbSBsb2NhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIHRvIHByb3RlY3QgYWdhaW5zdCBtYWNoaW5lIGJsb2NrZWQgZG9vcndheXMuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwbGFjZSA9IChmaW5kLnggPT09IG1hcC5sZW5ndGggLSAxKSA/IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDQsIDApIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5yYW5kb20uaW50KDYsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgcm9vbSBsb2NhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jID0gZ2V0TXV0YWJsZVRpbGUocm9vbS54MSArIE1hdGguZmxvb3IocGxhY2UgLyAyKSwgcm9vbS55MSArIChwbGFjZSAlIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHRhbGwuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDIgd2lkZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvb20ueDMgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXRzIGEgcmFuZG9tIGxvY2F0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgdG8gcHJvdGVjdCBhZ2FpbnN0IG1hY2hpbmUgYmxvY2tlZCBkb29yd2F5cy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gKGZpbmQueCA9PT0gbWFwLmxlbmd0aCAtIDEpID8gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoMywgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoNiwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBncmFiIHRoZSByb29tIGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2MgPSBnZXRNdXRhYmxlVGlsZShyb29tLngxICsgTWF0aC5mbG9vcihwbGFjZSAvIDMpLCByb29tLnkxICsgKHBsYWNlICUgMykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDMgd2lkZS5cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXRzIGEgcmFuZG9tIGxvY2F0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgdG8gcHJvdGVjdCBhZ2FpbnN0IG1hY2hpbmUgYmxvY2tlZCBkb29yd2F5cy5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYWNlID0gKGZpbmQueCA9PT0gbWFwLmxlbmd0aCAtIDEpID8gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoNiwgMCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoOSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBncmFiIHRoZSByb29tIGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2MgPSBnZXRNdXRhYmxlVGlsZShyb29tLngxICsgTWF0aC5mbG9vcihwbGFjZSAvIDMpLCByb29tLnkxICsgKHBsYWNlICUgMykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIHRoZSBydW4gdGltZSBmb3IgdGhlIG1hY2hpbmVzXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZSA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDIsIDkpO1xuICAgICAgICAgICAgICAgIC8vIG1ha2VzIHRoZSBtYWNoaW5lXG4gICAgICAgICAgICAgICAgY29uc3QgbWFjaGluZSA9IHRoaXMubWFuYWdlci5jcmVhdGUubWFjaGluZSh7XG4gICAgICAgICAgICAgICAgICAgIG9yZVR5cGU6IFwicmVkaXVtXCIsXG4gICAgICAgICAgICAgICAgICAgIHJlZmluZVRpbWU6IHRpbWUsXG4gICAgICAgICAgICAgICAgICAgIHJlZmluZUlucHV0OiAoTWF0aC5mbG9vcih0aW1lIC8gMikgKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgcmVmaW5lT3V0cHV0OiBNYXRoLmZsb29yKHRpbWUgLyAyKSxcbiAgICAgICAgICAgICAgICAgICAgdGlsZTogbG9jIGFzIFRpbGUsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gQXNzaWduZWQgdGhlIHRpbGUgaXQncyBtYWNoaW5lLlxuICAgICAgICAgICAgICAgIGxvYy5tYWNoaW5lID0gbWFjaGluZTtcbiAgICAgICAgICAgICAgICAvLyBBZGRzIHRoZSBtYWNoaW5lIHRvIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgdGhpcy5tYWNoaW5lcy5wdXNoKG1hY2hpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGFkZHMgZXh0cmEgY29ubmVjdHMgZm9yIG1vcmUgcm9vbXMgY29ubmVjdGlvbnMuXG4gICAgICAgIGNvbm5lY3QgKz0gTWF0aC5mbG9vcihjb25uZWN0ICogdGhpcy5tYW5hZ2VyLnJhbmRvbS5mbG9hdCgwLjUsIDAuMjUpKTtcbiAgICAgICAgaWYgKHJvb21MaXN0Lmxlbmd0aCA8PSA0KSB7XG4gICAgICAgICAgICBjb25uZWN0ID0gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoMSwgLTEpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGNvbm5lY3Q7IGkrKykge1xuICAgICAgICAgICAgLy8gdXNlZCB0byBtYWtlIHRoZSBtYXAtZ2VuIGZhdm9yIGNvbm5lY3RpbmcgdW5jb25uZWN0ZWQgcm9vbXMuXG4gICAgICAgICAgICBpZiAodW5jb25uZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIGdyYWJzIGEgcmFuZG9tIHJvb20uIEFsc28gdXNlZCB0byByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdC5cbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHVuY29ubmVjdGVkLmxlbmd0aCwgMCk7XG4gICAgICAgICAgICAgICAgLy8gZ3JhYnMgdGhlIHJvb20uXG4gICAgICAgICAgICAgICAgY29uc3QgZmluZCA9IHVuY29ubmVjdGVkW2luZGV4XTtcbiAgICAgICAgICAgICAgICAvLyByZXNldHMgZG9uZS5cbiAgICAgICAgICAgICAgICBkb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gcGlja3MgYSByYW5kb20gZGlyZWN0aW9uLlxuICAgICAgICAgICAgICAgIGxldCByb3QgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludCg0LCAwKTtcbiAgICAgICAgICAgICAgICAvLyBtYWtlcyBzdXJlIGl0IHBpY2tzIHNvbWV0aGluZyBpZiBubyBvcHRpb25zIGFyZSBvcHRpbWFsLlxuICAgICAgICAgICAgICAgIGxldCBudW0gPSAwO1xuICAgICAgICAgICAgICAgIC8vIGEgd2hpbGUgbG9vcCB0aGF0IGZvcmNlcyBpdCB0byBwaWNrIHNvbWV0aGluZy5cbiAgICAgICAgICAgICAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGRpcmVjdGlvbiBpcyBub3J0aC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2tzIGlmIHRoZSBjaG9pY2UgaXMgb3B0aW1hbCBvciBhdCBsZWFzdCBsZWdhbFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFtmaW5kLnhdW2ZpbmQueSAtIDFdICYmICh0aGlzLmhhcyh1bmNvbm5lY3RlZCwgZmluZC54LCBmaW5kLnkgLSAxKSA+PSAwIHx8IG51bSA+PSA0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2VzIHRoZSBjb25uZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uV05vcnRoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueF1bZmluZC55IC0gMV0uV1NvdXRoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJvb20gaXMgY29ubmVjdGVkLCBzbyBpdCBpcyByZW1vdmVkIGZyb20gdW5jb25uZWN0ZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgb3RoZXIgcm9vbSBpcyBpbiB0aGUgdW5jb25uZWN0ZWQgbGlzdCwgcmVtb3ZlIGl0IGFzIHdlbGwuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzKHVuY29ubmVjdGVkLCBmaW5kLngsIGZpbmQueSAtIDEpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5jb25uZWN0ZWQuc3BsaWNlKHRoaXMuaGFzKHVuY29ubmVjdGVkLCBmaW5kLngsIGZpbmQueSAtIDEpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgaGFzIHBpY2tlZCBzb21ldGhpbmcsIGxldCB0aGUgbG9vcCBlbmQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UsIGdvIHRvIHRoZSBuZXh0IGFuZCBub3RlIHRoZSBmYWlsdXJlLlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGRpcmVjdGlvbiBpcyBlYXN0XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJvdCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2tzIGlmIHRoZSBjaG9pY2UgaXMgb3B0aW1hbCBvciBhdCBsZWFzdCBsZWdhbFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFtmaW5kLnggKyAxXSAmJiAodGhpcy5oYXModW5jb25uZWN0ZWQsIGZpbmQueCArIDEsIGZpbmQueSkgPj0gMCB8fCBudW0gPj0gNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlcyB0aGUgY29ubmVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54XVtmaW5kLnldLldFYXN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueCArIDFdW2ZpbmQueV0uV1dlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcm9vbSBpcyBjb25uZWN0ZWQsIHNvIGl0IGlzIHJlbW92ZWQgZnJvbSB1bmNvbm5lY3RlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmNvbm5lY3RlZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBvdGhlciByb29tIGlzIGluIHRoZSB1bmNvbm5lY3RlZCBsaXN0LCByZW1vdmUgaXQgYXMgd2VsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXModW5jb25uZWN0ZWQsIGZpbmQueCArIDEsIGZpbmQueSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmNvbm5lY3RlZC5zcGxpY2UodGhpcy5oYXModW5jb25uZWN0ZWQsIGZpbmQueCArIDEsIGZpbmQueSksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBoYXMgcGlja2VkIHNvbWV0aGluZywgbGV0IHRoZSBsb29wIGVuZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgZ28gdG8gdGhlIG5leHQgYW5kIG5vdGUgdGhlIGZhaWx1cmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW0rKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3QrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZGlyZWN0aW9uIGlzIHNvdXRoLlxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyb3QgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrcyBpZiB0aGUgY2hvaWNlIGlzIG9wdGltYWwgb3IgYXQgbGVhc3QgbGVnYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBbZmluZC54XVtmaW5kLnkgKyAxXSAmJiAodGhpcy5oYXModW5jb25uZWN0ZWQsIGZpbmQueCwgZmluZC55ICsgMSkgPj0gMCB8fCBudW0gPj0gNSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlcyB0aGUgY29ubmVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54XVtmaW5kLnldLldTb3V0aCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueSArIDFdLldOb3J0aCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByb29tIGlzIGNvbm5lY3RlZCwgc28gaXQgaXMgcmVtb3ZlZCBmcm9tIHVuY29ubmVjdGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIG90aGVyIHJvb20gaXMgaW4gdGhlIHVuY29ubmVjdGVkIGxpc3QsIHJlbW92ZSBpdCBhcyB3ZWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhcyh1bmNvbm5lY3RlZCwgZmluZC54LCBmaW5kLnkgKyAxKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuY29ubmVjdGVkLnNwbGljZSh0aGlzLmhhcyh1bmNvbm5lY3RlZCwgZmluZC54ICsgMSwgZmluZC55KSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGhhcyBwaWNrZWQgc29tZXRoaW5nLCBsZXQgdGhlIGxvb3AgZW5kLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBnbyB0byB0aGUgbmV4dCBhbmQgbm90ZSB0aGUgZmFpbHVyZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBkaXJlY3Rpb24gaXMgd2VzdC5cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVja3MgaWYgdGhlIGNob2ljZSBpcyBvcHRpbWFsIG9yIGF0IGxlYXN0IGxlZ2FsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwW2ZpbmQueCAtIDFdICYmICh0aGlzLmhhcyh1bmNvbm5lY3RlZCwgZmluZC54IC0gMSwgZmluZC55KSA+PSAwIHx8IG51bSA+PSA1KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2VzIHRoZSBjb25uZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uV1dlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54IC0gMV1bZmluZC55XS5XRWFzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByb29tIGlzIGNvbm5lY3RlZCwgc28gaXQgaXMgcmVtb3ZlZCBmcm9tIHVuY29ubmVjdGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIG90aGVyIHJvb20gaXMgaW4gdGhlIHVuY29ubmVjdGVkIGxpc3QsIHJlbW92ZSBpdCBhcyB3ZWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhcyh1bmNvbm5lY3RlZCwgZmluZC54IC0gMSwgZmluZC55KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuY29ubmVjdGVkLnNwbGljZSh0aGlzLmhhcyh1bmNvbm5lY3RlZCwgZmluZC54IC0gMSwgZmluZC55KSwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGhhcyBwaWNrZWQgc29tZXRoaW5nLCBsZXQgdGhlIGxvb3AgZW5kLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBnbyB0byB0aGUgbmV4dCBhbmQgbm90ZSB0aGUgZmFpbHVyZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bSsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBldmVyeSByb29tIGFzIGJlZW4gY29ubmVjdGVkLCBkbyBhIHNpbXBsZXIgcmFuZG9tIGNvbm5lY3Rpb24uXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBncmFicyBhIHJhbmRvbSByb29tLlxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbmQgPSByb29tTGlzdFt0aGlzLm1hbmFnZXIucmFuZG9tLmludChyb29tTGlzdC5sZW5ndGgsIDApXTtcbiAgICAgICAgICAgICAgICAvLyBtYWtlcyBzdXJlIGl0IHBpY2tzIGEgdmFsaWQgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHBpY2tzIGEgcmFuZG9tIGRpcmVjdGlvbi9cbiAgICAgICAgICAgICAgICBsZXQgcm90ID0gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoNCwgMCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IHBpY2tlZCBub3J0aC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBkaXJlY3Rpb24gaXMgdmFsaWQuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwW2ZpbmQueF1bZmluZC55IC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyB0aGUgY29ubmVjdGlvbiBhbmQgZW5kIHRoZSBsb29wLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uV05vcnRoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueF1bZmluZC55IC0gMV0uV1NvdXRoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgZ28gdG8gdGhlIG5leHQgZGlyZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocm90ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGRpcmVjdGlvbiBpcyB2YWxpZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBbZmluZC54ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyB0aGUgY29ubmVjdGlvbiBhbmQgZW5kIHRoZSBsb29wLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uV0Vhc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54ICsgMV1bZmluZC55XS5XV2VzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGdvIHRvIHRoZSBuZXh0IGRpcmVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJvdCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBkaXJlY3Rpb24gaXMgdmFsaWQuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwW2ZpbmQueF1bZmluZC55ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyB0aGUgY29ubmVjdGlvbiBhbmQgZW5kIHRoZSBsb29wLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uV1NvdXRoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueF1bZmluZC55ICsgMV0uV05vcnRoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UgZ28gdG8gdGhlIG5leHQgZGlyZWN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGRpcmVjdGlvbiBpcyB2YWxpZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBbZmluZC54IC0gMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkbyB0aGUgY29ubmVjdGlvbiBhbmQgZW5kIHRoZSBsb29wLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uV1dlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54IC0gMV1bZmluZC55XS5XRWFzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIGdvIHRvIHRoZSBuZXh0IGRpcmVjdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2xlYW51cCBMaXN0IHRvIHJlZHVjZSBtZW1vcnkgdXNhZ2VcbiAgICAgICAgdW5jb25uZWN0ZWQubGVuZ3RoID0gMDtcbiAgICAgICAgLy8gUXVlIG9mIHJvb21zIHRvIGJlIGNvbm5lY3RlZFxuICAgICAgICBjb25zdCB0b0Nvbm5lY3RRdWU6IElQb2ludFtdID0gW107XG4gICAgICAgIC8vIHVzZWQgdG8gdHJhY2sgcm9vbXMgdGhhdCBhcmUgY29ubmVjdGVkLlxuICAgICAgICBjb25zdCBjb25uZWN0ZWQ6IElQb2ludFtdID0gW107XG4gICAgICAgIC8vIGZpbmQgYSBzdGFydGluZyByb29tLlxuICAgICAgICBjb25zdCBzdGFydCA9IHJvb21MaXN0W3RoaXMubWFuYWdlci5yYW5kb20uaW50KHJvb21MaXN0Lmxlbmd0aCwgMCldO1xuICAgICAgICAvLyBhZGQgc3RhcnRpbmcgcm9vbS5cbiAgICAgICAgY29ubmVjdGVkLnB1c2goc3RhcnQpO1xuICAgICAgICAvLyBhZGQgZXhpc3RpbmcgbmVpZ2hib3JzIHRvIHRoZSBxdWVcbiAgICAgICAgaWYgKG1hcFtzdGFydC54IC0gMV0pIHtcbiAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5wdXNoKHt4OiBzdGFydC54IC0gMSwgeTogc3RhcnQueX0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXBbc3RhcnQueCArIDFdKSB7XG4gICAgICAgICAgICB0b0Nvbm5lY3RRdWUucHVzaCh7eDogc3RhcnQueCArIDEsIHk6IHN0YXJ0Lnl9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWFwW3N0YXJ0LnhdW3N0YXJ0LnkgLSAxXSkge1xuICAgICAgICAgICAgdG9Db25uZWN0UXVlLnB1c2goe3g6IHN0YXJ0LngsIHk6IHN0YXJ0LnkgLSAxfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hcFtzdGFydC54XVtzdGFydC55ICsgMV0pIHtcbiAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5wdXNoKHt4OiBzdGFydC54LCB5OiBzdGFydC55ICsgMX0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2luZyBlYWNoIHJvb20gbWFrZSBhIHVuaXF1ZSBjb25uZWN0aW9uLlxuICAgICAgICB3aGlsZSAodG9Db25uZWN0UXVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgLy8gZ3JhYiB0aGUgaW5kZXggb2YgdGhlIHJvb20gdG8gYmUgd29ya2VkIHdpdGguXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHRvQ29ubmVjdFF1ZS5sZW5ndGgsIDApO1xuICAgICAgICAgICAgLy8gZ3JhYiB0aGUgcm9vbSBpbmZvLlxuICAgICAgICAgICAgY29uc3QgZmluZCA9IHRvQ29ubmVjdFF1ZVtpbmRleF07XG4gICAgICAgICAgICAvLyBtYXJrIHRoYXQgdGhlIHJvb20gaGFzbid0IGJlZW4gZm91bmQuXG4gICAgICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIHBpY2sgYSByYW5kb20gZGlyZWN0aW9uLlxuICAgICAgICAgICAgbGV0IHJvdCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDQsIDApO1xuICAgICAgICAgICAgLy8gdW50aWwgYSByb29tIGlzIGZvdW5kLlxuICAgICAgICAgICAgd2hpbGUgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSBub3J0aCBleGlzdHMgYW5kIGlzIGNvbm5lY3RlZC5cbiAgICAgICAgICAgICAgICBpZiAocm90ID09PSAwICYmIG1hcFtmaW5kLnhdW2ZpbmQueSAtIDFdICYmIHRoaXMuaGFzKGNvbm5lY3RlZCwgZmluZC54LCBmaW5kLnkgLSAxKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbm5lY3QgaXQuXG4gICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnhdW2ZpbmQueV0uRE5vcnRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueF1bZmluZC55IC0gMV0uRFNvdXRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0IGZyb20gdGhlIGNvbm5lY3Rpb24gcXVldWUuXG4gICAgICAgICAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIHJvb20gdG8gdGhlIGNvbm5lY3RlZCBsaXN0LlxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0ZWQucHVzaChmaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGF0IGEgY29ubmVjdGlvbiB3YXMgZm91bmQuXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgZGlyZWN0aW9uIGlzIGludmFsaWQsIG1vdmUgb250byB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgICAgIHJvdCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm90ID09PSAxICYmIG1hcFtmaW5kLnggKyAxXSAmJiB0aGlzLmhhcyhjb25uZWN0ZWQsIGZpbmQueCArIDEsIGZpbmQueSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25uZWN0IGl0LlxuICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54XVtmaW5kLnldLkRFYXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueCArIDFdW2ZpbmQueV0uRFdlc3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQgZnJvbSB0aGUgY29ubmVjdGlvbiBxdWV1ZS5cbiAgICAgICAgICAgICAgICAgICAgdG9Db25uZWN0UXVlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgcm9vbSB0byB0aGUgY29ubmVjdGVkIGxpc3QuXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZC5wdXNoKGZpbmQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrIHRoYXQgYSBjb25uZWN0aW9uIHdhcyBmb3VuZC5cbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBkaXJlY3Rpb24gaXMgaW52YWxpZCwgbW92ZSBvbnRvIHRoZSBuZXh0IG9uZS5cbiAgICAgICAgICAgICAgICAgICAgcm90Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb3QgPT09IDIgJiYgbWFwW2ZpbmQueF1bZmluZC55ICsgMV0gJiYgdGhpcy5oYXMoY29ubmVjdGVkLCBmaW5kLngsIGZpbmQueSArIDEpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29ubmVjdCBpdC5cbiAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueF1bZmluZC55XS5EU291dGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtYXBbZmluZC54XVtmaW5kLnkgKyAxXS5ETm9ydGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaXQgZnJvbSB0aGUgY29ubmVjdGlvbiBxdWV1ZS5cbiAgICAgICAgICAgICAgICAgICAgdG9Db25uZWN0UXVlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgcm9vbSB0byB0aGUgY29ubmVjdGVkIGxpc3QuXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZC5wdXNoKGZpbmQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrIHRoYXQgYSBjb25uZWN0aW9uIHdhcyBmb3VuZC5cbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhpcyBkaXJlY3Rpb24gaXMgaW52YWxpZCwgbW92ZSBvbnRvIHRoZSBuZXh0IG9uZS5cbiAgICAgICAgICAgICAgICAgICAgcm90Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChtYXBbZmluZC54IC0gMV0gJiYgdGhpcy5oYXMoY29ubmVjdGVkLCBmaW5kLnggLSAxLCBmaW5kLnkpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29ubmVjdCBpdC5cbiAgICAgICAgICAgICAgICAgICAgbWFwW2ZpbmQueF1bZmluZC55XS5EV2VzdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG1hcFtmaW5kLnggLSAxXVtmaW5kLnldLkRFYXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGl0IGZyb20gdGhlIGNvbm5lY3Rpb24gcXVldWUuXG4gICAgICAgICAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIHJvb20gdG8gdGhlIGNvbm5lY3RlZCBsaXN0LlxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0ZWQucHVzaChmaW5kKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFyayB0aGF0IGEgY29ubmVjdGlvbiB3YXMgZm91bmQuXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgZGlyZWN0aW9uIGlzIGludmFsaWQsIG1vdmUgb250byB0aGUgbmV4dCBvbmUuXG4gICAgICAgICAgICAgICAgICAgIHJvdCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIGEgY29ubmVjdGlvbiB3YXMgZm91bmQuXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIHRvIHRoZSBsZWZ0IGlzbid0IGluIGVpdGhlciBsaXN0IGFuZCBleGlzdHMsIGFkZCBpdCB0byB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFtmaW5kLnggLSAxXSAmJiB0aGlzLmhhcyhjb25uZWN0ZWQsIGZpbmQueCAtIDEsIGZpbmQueSkgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhhcyh0b0Nvbm5lY3RRdWUsIGZpbmQueCAtIDEsIGZpbmQueSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b0Nvbm5lY3RRdWUucHVzaCh7eDogZmluZC54IC0gMSwgeTogZmluZC55fSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gdG8gdGhlIHJpZ2h0IGlzbid0IGluIGVpdGhlciBsaXN0IGFuZCBleGlzdHMsIGFkZCBpdCB0byB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFtmaW5kLnggKyAxXSAmJiB0aGlzLmhhcyhjb25uZWN0ZWQsIGZpbmQueCArIDEsIGZpbmQueSkgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzKHRvQ29ubmVjdFF1ZSwgZmluZC54ICsgMSwgZmluZC55KSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5wdXNoKHt4OiBmaW5kLnggKyAxLCB5OiBmaW5kLnl9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBhYm92ZSBpc24ndCBpbiBlaXRoZXIgbGlzdCBhbmQgZXhpc3RzLCBhZGQgaXQgdG8gdGhlIHF1ZXVlXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXBbZmluZC54XVtmaW5kLnkgLSAxXSAmJiB0aGlzLmhhcyhjb25uZWN0ZWQsIGZpbmQueCwgZmluZC55IC0gMSkgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzKHRvQ29ubmVjdFF1ZSwgZmluZC54LCBmaW5kLnkgLSAxKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5wdXNoKHt4OiBmaW5kLngsIHk6IGZpbmQueSAtIDF9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBiZWxvdyBpc24ndCBpbiBlaXRoZXIgbGlzdCBhbmQgZXhpc3RzLCBhZGQgaXQgdG8gdGhlIHF1ZXVlXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXBbZmluZC54XVtmaW5kLnkgKyAxXSAmJiB0aGlzLmhhcyhjb25uZWN0ZWQsIGZpbmQueCwgZmluZC55ICsgMSkgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzKHRvQ29ubmVjdFF1ZSwgZmluZC54LCBmaW5kLnkgKyAxKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvQ29ubmVjdFF1ZS5wdXNoKHt4OiBmaW5kLngsIHk6IGZpbmQueSArIDF9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBhY3R1YWxseSBkcmF3cyBhbGwgdGhlIHdhbGxzIGFuZCBkb29ycy5cbiAgICAgICAgdGhpcy5kcmF3KG1hcCwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgZHJhd3MgdGhlIHJvb21zLiBvbmx5IGhhbmRsZXMgc2ltcGxlIHJvb20gY2x1c3RlcnMsIDMgdGFsbCwgbm90IDMgd2lkZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtYXAgLSBhIDJEIGFycmF5IG9mIHJvb21zIGZvciBpdCB0byBkcmF3IHVzaW5nLlxuICAgICAqIEBwYXJhbSBnZXRNdXRhYmxlVGlsZSAtIHRoZSBmdW5jdGlvbiBmb3IgaXQgdG8gZ3JhYiB0aWxlcy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRyYXcobWFwOiBJUm9vbVtdW10sIGdldE11dGFibGVUaWxlOiAoeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IE11dGFibGU8VGlsZT4pOiB2b2lkIHtcbiAgICAgICAgLy8gVGVzdCBjb2RlIHRvIGhlbHAgdmlzdWFsaXplIHdoZXJlIGl0IGFjdHVhbGx5IHBsYWNlcyByb29tcy5cbiAgICAgICAgLypmb3IgKGNvbnN0IHggb2YgbWFwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHkgb2YgeCkge1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDEsIHkueTEpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDEsIHkueTEpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDEsIHkueTIpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDEsIHkueTIpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDIsIHkueTEpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDIsIHkueTEpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDIsIHkueTIpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDIsIHkueTIpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgIGlmICh5LnkzICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoeS54MyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDMsIHkueTEpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MywgeS55MSkudHlwZSA9IFwiZ2VuZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh5LngzLCB5LnkyKS5vd25lciA9IHRoaXMucGxheWVyc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDMsIHkueTIpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MSwgeS55Mykub3duZXIgPSB0aGlzLnBsYXllcnNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh5LngxLCB5LnkzKS50eXBlID0gXCJnZW5lcmF0b3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDIsIHkueTMpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MiwgeS55MykudHlwZSA9IFwiZ2VuZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh5LngzLCB5LnkzKS5vd25lciA9IHRoaXMucGxheWVyc1swXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDMsIHkueTMpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MSwgeS55Mykub3duZXIgPSB0aGlzLnBsYXllcnNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh5LngxLCB5LnkzKS50eXBlID0gXCJnZW5lcmF0b3JcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDIsIHkueTMpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MiwgeS55MykudHlwZSA9IFwiZ2VuZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoeS54MyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MywgeS55MSkub3duZXIgPSB0aGlzLnBsYXllcnNbMF07XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHkueDMsIHkueTEpLnR5cGUgPSBcImdlbmVyYXRvclwiO1xuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh5LngzLCB5LnkyKS5vd25lciA9IHRoaXMucGxheWVyc1swXTtcbiAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeS54MywgeS55MikudHlwZSA9IFwiZ2VuZXJhdG9yXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9Ki9cbiAgICAgICAgLy8gaXRlcmF0ZSB0aHJvdWdoIHRoZSByb29tcyBvZiB0aGUgbWFwLlxuICAgICAgICBsZXQgdjogbnVtYmVyID0gMDtcbiAgICAgICAgbGV0IHc6IG51bWJlciA9IDA7XG4gICAgICAgIGZvciAoY29uc3Qgcm9vbXMgb2YgbWFwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJvb20gb2Ygcm9vbXMpIHtcbiAgICAgICAgICAgICAgICAvLyBjb3JuZXJzLlxuICAgICAgICAgICAgICAgIC8vIGRyYXcgdGhlIG5vcnRoZXJuIGNvcm5lcnNcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdDb3JuZXIocm9vbS54MSAtIDEsIHJvb20ueTEgLSAxLCByb29tLldOb3J0aCwgcm9vbS5XV2VzdCwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDIgd2lkZS5cbiAgICAgICAgICAgICAgICBpZiAocm9vbS54MyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Q29ybmVyKHJvb20ueDIgKyAxLCByb29tLnkxIC0gMSwgcm9vbS5XTm9ydGgsIHJvb20uV0Vhc3QsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZHJhdyB0aGUgc291dGhlcm4gY29ybmVycywgYWNjb3VudCBmb3IgZGlmZmVyZW50IGhlaWdodHNcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgMiB0YWxsLlxuICAgICAgICAgICAgICAgICAgICBpZiAocm9vbS55MyA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Nvcm5lcihyb29tLngxIC0gMSwgcm9vbS55MiArIDEsIHJvb20uV1NvdXRoLCByb29tLldXZXN0LCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdDb3JuZXIocm9vbS54MiArIDEsIHJvb20ueTIgKyAxLCByb29tLldTb3V0aCwgcm9vbS5XRWFzdCwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDMgdGFsbC5cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdDb3JuZXIocm9vbS54MSAtIDEsIHJvb20ueTMgKyAxLCByb29tLldTb3V0aCwgcm9vbS5XV2VzdCwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Q29ybmVyKHJvb20ueDIgKyAxLCByb29tLnkzICsgMSwgcm9vbS5XU291dGgsIHJvb20uV0Vhc3QsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHdpZGUuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Nvcm5lcihyb29tLngzICsgMSwgcm9vbS55MSAtIDEsIHJvb20uV05vcnRoLCByb29tLldFYXN0LCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRyYXcgdGhlIHNvdXRoZXJuIGNvcm5lcnMsIGFjY291bnQgZm9yIGRpZmZlcmVudCBoZWlnaHRzXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDIgdGFsbC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJvb20ueTMgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdDb3JuZXIocm9vbS54MSAtIDEsIHJvb20ueTIgKyAxLCByb29tLldTb3V0aCwgcm9vbS5XV2VzdCwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Q29ybmVyKHJvb20ueDMgKyAxLCByb29tLnkyICsgMSwgcm9vbS5XU291dGgsIHJvb20uV0Vhc3QsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHRhbGwuXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Q29ybmVyKHJvb20ueDEgLSAxLCByb29tLnkzICsgMSwgcm9vbS5XU291dGgsIHJvb20uV1dlc3QsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Nvcm5lcihyb29tLngzICsgMSwgcm9vbS55MyArIDEsIHJvb20uV1NvdXRoLCByb29tLldFYXN0LCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSB3YWxsIHRvIHRoZSBub3J0aCwgZHJhdyBpdC5cbiAgICAgICAgICAgICAgICBpZiAocm9vbS5XTm9ydGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHRoaXMuY3ViZUNvbnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3ViZTogYm9vbGVhbiA9IG1hcFt2XVt3IC0gMV0gJiYgcmFuZCA8PSA4ICYmICgoIW1hcFt2XVt3IC0gMV0uV0Vhc3QgJiYgIXJvb20uV0Vhc3QpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW1hcFt2XVt3IC0gMV0uV1dlc3QgJiYgIXJvb20uV1dlc3QpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgMyB3aWRlLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDEsIHJvb20ueTEgLSAxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEsIHJvb20ueTEgLSAxKS5kZWNvcmF0aW9uID0gY3ViZSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDIsIHJvb20ueTEgLSAxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDIsIHJvb20ueTEgLSAxKS5kZWNvcmF0aW9uID0gY3ViZSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHdpZGUuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb29tLngzICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3V2FsbChyb29tLngzLCByb29tLnkxIC0gMSwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54Mywgcm9vbS55MSAtIDEpLmRlY29yYXRpb24gPSBjdWJlID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSB3YWxsIHRvIHRoZSBlYXN0LCBkcmF3IGl0LlxuICAgICAgICAgICAgICAgIGlmIChyb29tLldFYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmQgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludCh0aGlzLmN1YmVDb25zdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1YmU6IGJvb2xlYW4gPSBtYXBbdiArIDFdICYmIHJhbmQgPD0gOCAmJiAoKCFtYXBbdiArIDFdW3ddLldOb3J0aCAmJiAhcm9vbS5XTm9ydGgpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCFtYXBbdiArIDFdW3ddLldTb3V0aCAmJiAhcm9vbS5XU291dGgpKSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgMyB3aWRlLlxuICAgICAgICAgICAgICAgICAgICBpZiAocm9vbS54MyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBsYWNlIHRoZSB3YWxsIGFzIGxvbmcgYXMgaXQgZG9lc24ndCBjb3ZlciB1cCBhIGRvb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDMgKyAxLCByb29tLnkxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngzICsgMSwgcm9vbS55MSkuZGVjb3JhdGlvbiA9IGN1YmUgPyAyIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1dhbGwocm9vbS54MyArIDEsIHJvb20ueTIsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDMgKyAxLCByb29tLnkyKS5kZWNvcmF0aW9uID0gY3ViZSA/IDIgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgMyB0YWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvb20ueTMgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxhY2UgdGhlIHdhbGwgYXMgbG9uZyBhcyBpdCBkb2Vzbid0IGNvdmVyIHVwIGEgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDMgKyAxLCByb29tLnkzLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54MyArIDEsIHJvb20ueTMpLmRlY29yYXRpb24gPSBjdWJlID8gMiA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgMiB3aWRlLlxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBsYWNlIHRoZSB3YWxsIGFzIGxvbmcgYXMgaXQgZG9lc24ndCBjb3ZlciB1cCBhIGRvb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDIgKyAxLCByb29tLnkxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngyICsgMSwgcm9vbS55MSkuZGVjb3JhdGlvbiA9IGN1YmUgPyAyIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1dhbGwocm9vbS54MiArIDEsIHJvb20ueTIsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDIgKyAxLCByb29tLnkyKS5kZWNvcmF0aW9uID0gY3ViZSA/IDIgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHJvb20gaXMgMyB0YWxsLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvb20ueTMgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxhY2UgdGhlIHdhbGwgYXMgbG9uZyBhcyBpdCBkb2Vzbid0IGNvdmVyIHVwIGEgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDIgKyAxLCByb29tLnkzLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54MiArIDEsIHJvb20ueTMpLmRlY29yYXRpb24gPSBjdWJlID8gMiA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSB3YWxsIHRvIHRoZSBzb3V0aCwgZHJhd24gaXQuXG4gICAgICAgICAgICAgICAgaWYgKHJvb20uV1NvdXRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmQgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludCh0aGlzLmN1YmVDb25zdCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1YmU6IGJvb2xlYW4gPSBtYXBbdl1bdyArIDFdICYmIHJhbmQgPD0gOCAmJiAoKCFtYXBbdl1bdyArIDFdLldFYXN0ICYmICFyb29tLldFYXN0KSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICghbWFwW3ZdW3cgKyAxXS5XV2VzdCAmJiAhcm9vbS5XV2VzdCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHRhbGwuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb29tLnkzICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxhY2UgdGhlIHdhbGwgYXMgbG9uZyBhcyBpdCBkb2Vzbid0IGNvdmVyIHVwIGEgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1dhbGwocm9vbS54MSwgcm9vbS55MyArIDEsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEsIHJvb20ueTMgKyAxKS5kZWNvcmF0aW9uID0gY3ViZSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3V2FsbChyb29tLngyLCByb29tLnkzICsgMSwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54Miwgcm9vbS55MyArIDEpLmRlY29yYXRpb24gPSBjdWJlID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHdpZGUuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocm9vbS54MyAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDMsIHJvb20ueTMgKyAxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54Mywgcm9vbS55MyArIDEpLmRlY29yYXRpb24gPSBjdWJlID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAyIHRhbGwuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZSB0aGUgd2FsbCBhcyBsb25nIGFzIGl0IGRvZXNuJ3QgY292ZXIgdXAgYSBkb29yLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3V2FsbChyb29tLngxLCByb29tLnkyICsgMSwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54MSwgcm9vbS55MiArIDEpLmRlY29yYXRpb24gPSBjdWJlID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDIsIHJvb20ueTIgKyAxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngyLCByb29tLnkyICsgMSkuZGVjb3JhdGlvbiA9IGN1YmUgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSByb29tIGlzIDMgd2lkZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb29tLngzICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1dhbGwocm9vbS54Mywgcm9vbS55MiArIDEsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngzLCByb29tLnkyICsgMSkuZGVjb3JhdGlvbiA9IGN1YmUgPyAxIDogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHdhbGwgdG8gdGhlIHdlc3QsIGRyYXcgaXQuXG4gICAgICAgICAgICAgICAgaWYgKHJvb20uV1dlc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmFuZCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHRoaXMuY3ViZUNvbnN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3ViZTogYm9vbGVhbiA9IG1hcFt2IC0gMV0gJiYgcmFuZCA8PSA4ICYmICgoIW1hcFt2IC0gMV1bd10uV05vcnRoICYmICFyb29tLldOb3J0aCkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoIW1hcFt2IC0gMV1bd10uV1NvdXRoICYmICFyb29tLldTb3V0aCkpID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBwbGFjZSB0aGUgd2FsbCBhcyBsb25nIGFzIGl0IGRvZXNuJ3QgY292ZXIgdXAgYSBkb29yLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDEgLSAxLCByb29tLnkxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgLSAxLCByb29tLnkxKS5kZWNvcmF0aW9uID0gY3ViZSA/IDIgOiAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdXYWxsKHJvb20ueDEgLSAxLCByb29tLnkyLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgLSAxLCByb29tLnkyKS5kZWNvcmF0aW9uID0gY3ViZSA/IDIgOiAwO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcm9vbSBpcyAzIHRhbGwuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyb29tLnkzICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGxhY2UgdGhlIHdhbGwgYXMgbG9uZyBhcyBpdCBkb2Vzbid0IGNvdmVyIHVwIGEgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd1dhbGwocm9vbS54MSAtIDEsIHJvb20ueTMsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgLSAxLCByb29tLnkzKS5kZWNvcmF0aW9uID0gY3ViZSA/IDIgOiAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHcrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHYrKztcbiAgICAgICAgICAgIHcgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgbWFwIGluIG9yZGVyIHRvIGRyYXcgcm9vbXMuXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbWFwLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IG1hcFswXS5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvb20gPSBtYXBbeF1beV07XG4gICAgICAgICAgICAgICAgLy8gc3RhcnQgZHJhd2luZyB3YWxsc1xuICAgICAgICAgICAgICAgIGxldCBzaGlmdCA9IDA7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgZG9vciB0byB0aGUgbm9ydGgsIGRyYXcgaXQuXG4gICAgICAgICAgICAgICAgaWYgKHJvb20uRE5vcnRoID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBpdCBpcyBkcmF3biBvbmx5IG9uY2UuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXBbeF1beSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBbeF1beSAtIDFdLkRTb3V0aCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hpY2ggcGFydCBvZiB0aGUgd2FsbCB0byBtYWtlIHRoZSBkb29yLlxuICAgICAgICAgICAgICAgICAgICBpZiAocm9vbS5XTm9ydGggPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRldGVybWluZXMgcG9zc2libGUgcGxhY2VtZW50cyBkZXBlbmRpbmcgb24gcm9vbSBzaXplLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHJvb20ueDMgPT09IC0xID8gMiA6IDM7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBwaWNrIGEgcmFuZG9tIHNwb3QuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlmdCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHNpemUsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlZCB0byBjb3VudCBhdHRlbXB0cyB0byBtYWtlIHN1cmUgdGhlIGJlc3Qgb3V0Y29tZSBpcyByZWFjaGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gIGRlY2lkZSB3aGljaCBzcG90IHRoZSBkb29yIHNob3VsZCBiZSBvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGxvb3AgaXMgYXQgdGhlIGN1cnJlbnQgc2hpZnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoaWZ0ID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IHdvdWxkIGNyZWF0ZSBhIHBhdGgtYWJsZSBkb29yd2F5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKChnZXRNdXRhYmxlVGlsZShyb29tLngxICsgaSwgcm9vbS55MSAtIDIpLm1hY2hpbmUgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54MSArIGksIHJvb20ueTEpLm1hY2hpbmUgIT09IHVuZGVmaW5lZCkgJiYgdGVtcCA8IHNpemUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngxICsgaSwgcm9vbS55MSAtIDIpLmlzV2FsbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbS54MSArIGksIHJvb20ueTEgLSAyKS5kZWNvcmF0aW9uID09PSAxIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngxICsgaSwgcm9vbS55MSAtIDIpLmRlY29yYXRpb24gPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSBhIGRpZmZlcmVudCBzcG90LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHNoaWZ0IGlzIGludmFsaWQsIG1ha2UgaXQgdmFsaWQuIFJlc3RhcnQgdGhlIGxvb3AuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hpZnQgPj0gc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdGUgdGhlIGF0dGVtcHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZXBlbmRpbmcgb24gdGhlIHNwb3QgY2hvc2VuLCBhZGQgdGhlIGRvb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hpZnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdEb29yKHJvb20ueDEsIHJvb20ueTEgLSAxLCAxLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzaGlmdCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3Iocm9vbS54Miwgcm9vbS55MSAtIDEsIDEsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3Iocm9vbS54Mywgcm9vbS55MSAtIDEsIDEsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGRvb3IgdG8gdGhlIGVhc3QuXG4gICAgICAgICAgICAgICAgaWYgKHJvb20uREVhc3QgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBzdXJlIGl0IGlzIGRyYXduIG9ubHkgb25jZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hcFt4ICsgMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcFt4ICsgMV1beV0uRFdlc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocm9vbS5XRWFzdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGV0ZXJtaW5lcyBwb3NzaWJsZSBwbGFjZW1lbnRzIGRlcGVuZGluZyBvbiByb29tIHNpemUuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gcm9vbS55MyA9PT0gLTEgPyAyIDogMztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRldGVybWluZXMgd2hpY2ggeCB2YWx1ZSB3aWxsIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb21YID0gcm9vbS54MyA9PT0gLTEgPyByb29tLngyIDogcm9vbS54MztcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hpY2ggcGFydCBvZiB0aGUgd2FsbCB0byBtYWtlIHRoZSBkb29yLlxuICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQgPSB0aGlzLm1hbmFnZXIucmFuZG9tLmludChzaXplLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZWQgdG8gY291bnQgYXR0ZW1wdHMgdG8gbWFrZSBzdXJlIHRoZSBiZXN0IG91dGNvbWUgaXMgcmVhY2hlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGxvb3AgaXMgYXQgdGhlIGN1cnJlbnQgc2hpZnQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNoaWZ0ID09PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IHdvdWxkIGNyZWF0ZSBhIHBhdGgtYWJsZSBkb29yd2F5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKChnZXRNdXRhYmxlVGlsZShyb29tWCArIDIsIHJvb20ueTEgKyBpKS5tYWNoaW5lICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb21YLCByb29tLnkxICsgaSkubWFjaGluZSAhPT0gdW5kZWZpbmVkKSAmJiB0ZW1wIDwgc2l6ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb21YICsgMiwgcm9vbS55MSArIGkpLmlzV2FsbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbVggKyAyLCByb29tLnkxICsgaSkuZGVjb3JhdGlvbiA9PT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUocm9vbVggKyAyLCByb29tLnkxICsgaSkuZGVjb3JhdGlvbiA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IGEgZGlmZmVyZW50IHNwb3QuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlmdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgc2hpZnQgaXMgaW52YWxpZCwgbWFrZSBpdCB2YWxpZC4gUmVzdGFydCB0aGUgbG9vcC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGlmdCA+PSBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90ZSB0aGUgYXR0ZW1wdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXArKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlcGVuZGluZyBvbiB0aGUgc3BvdCBjaG9zZW4sIGFkZCB0aGUgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGlmdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3Iocm9vbVggKyAxLCByb29tLnkxLCAyLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChzaGlmdCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3Iocm9vbVggKyAxLCByb29tLnkyLCAyLCBnZXRNdXRhYmxlVGlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdEb29yKHJvb21YICsgMSwgcm9vbS55MywgMiwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb29tLkRTb3V0aCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXMgZHJhd24gb25seSBvbmNlLlxuICAgICAgICAgICAgICAgICAgICBpZiAobWFwW3hdW3kgKyAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW3hdW3kgKyAxXS5ETm9ydGggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocm9vbS5XU291dGggPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRldGVybWluZXMgcG9zc2libGUgcGxhY2VtZW50cyBkZXBlbmRpbmcgb24gcm9vbSBzaXplLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHJvb20ueDMgPT09IC0xID8gMiA6IDM7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZXRlcm1pbmVzIHdoaWNoIHkgdmFsdWUgd2lsbCBiZSB1c2VkXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByb29tWSA9IHJvb20ueTMgPT09IC0xID8gcm9vbS55MiA6IHJvb20ueTM7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmaWd1cmUgb3V0IHdoaWNoIHBhcnQgb2YgdGhlIHdhbGwgdG8gbWFrZSB0aGUgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0ID0gdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQoc2l6ZSwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2VkIHRvIGNvdW50IGF0dGVtcHRzIHRvIG1ha2Ugc3VyZSB0aGUgYmVzdCBvdXRjb21lIGlzIHJlYWNoZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBsb29wIGlzIGF0IHRoZSBjdXJyZW50IHNoaWZ0LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGlmdCA9PT0gaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBpdCB3b3VsZCBjcmVhdGUgYSBwYXRoLWFibGUgZG9vcndheS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCgoZ2V0TXV0YWJsZVRpbGUocm9vbS54MSArIGksIHJvb21ZICsgMikubWFjaGluZSAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngxICsgaSwgcm9vbVkpLm1hY2hpbmUgIT09IHVuZGVmaW5lZCkgJiYgdGVtcCA8IHNpemUpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngxICsgaSwgcm9vbVkgKyAyKS5pc1dhbGwgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgKyBpLCByb29tWSArIDIpLmRlY29yYXRpb24gPT09IDEgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgKyBpLCByb29tWSArIDIpLmRlY29yYXRpb24gPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyeSBhIGRpZmZlcmVudCBzcG90LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjdXJyZW50IHNoaWZ0IGlzIGludmFsaWQsIG1ha2UgaXQgdmFsaWQuIFJlc3RhcnQgdGhlIGxvb3AuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hpZnQgPj0gc2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoaWZ0ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdGUgdGhlIGF0dGVtcHQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZXBlbmRpbmcgb24gdGhlIHNwb3QgY2hvc2VuLCBhZGQgdGhlIGRvb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hpZnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdEb29yKHJvb20ueDEsIHJvb21ZICsgMSwgMSwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hpZnQgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdEb29yKHJvb20ueDIsIHJvb21ZICsgMSwgMSwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RG9vcihyb29tLngzLCByb29tWSArIDEsIDEsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocm9vbS5EV2VzdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXMgZHJhd24gb25seSBvbmNlLlxuICAgICAgICAgICAgICAgICAgICBpZiAobWFwW3ggLSAxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW3ggLSAxXVt5XS5ERWFzdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyb29tLldXZXN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkZXRlcm1pbmVzIHBvc3NpYmxlIHBsYWNlbWVudHMgZGVwZW5kaW5nIG9uIHJvb20gc2l6ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNpemUgPSByb29tLnkzID09PSAtMSA/IDIgOiAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmlndXJlIG91dCB3aGljaCBwYXJ0IG9mIHRoZSB3YWxsIHRvIG1ha2UgdGhlIGRvb3IuXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGlmdCA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHNpemUsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXNlZCB0byBjb3VudCBhdHRlbXB0cyB0byBtYWtlIHN1cmUgdGhlIGJlc3Qgb3V0Y29tZSBpcyByZWFjaGVkLlxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbG9vcCBpcyBhdCB0aGUgY3VycmVudCBzaGlmdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2hpZnQgPT09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQgd291bGQgY3JlYXRlIGEgcGF0aC1hYmxlIGRvb3J3YXkuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoKGdldE11dGFibGVUaWxlKHJvb20ueDEgLSAyLCByb29tLnkxICsgaSkubWFjaGluZSAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngxLCByb29tLnkxICsgaSkubWFjaGluZSAhPT0gdW5kZWZpbmVkKSAmJiB0ZW1wIDwgc2l6ZSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgLSAyLCByb29tLnkxICsgaSkuaXNXYWxsIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZShyb29tLngxIC0gMiwgcm9vbS55MSArIGkpLmRlY29yYXRpb24gPT09IDEgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHJvb20ueDEgLSAyLCByb29tLnkxICsgaSkuZGVjb3JhdGlvbiA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJ5IGEgZGlmZmVyZW50IHNwb3QuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGlmdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGN1cnJlbnQgc2hpZnQgaXMgaW52YWxpZCwgbWFrZSBpdCB2YWxpZC4gUmVzdGFydCB0aGUgbG9vcC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGlmdCA+PSBzaXplKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90ZSB0aGUgYXR0ZW1wdC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXArKztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRlcGVuZGluZyBvbiB0aGUgc3BvdCBjaG9zZW4sIGFkZCB0aGUgZG9vci5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzaGlmdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Rvb3Iocm9vbS54MSAtIDEsIHJvb20ueTEsIDIsIGdldE11dGFibGVUaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoaWZ0ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RG9vcihyb29tLngxIC0gMSwgcm9vbS55MiwgMiwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3RG9vcihyb29tLngxIC0gMSwgcm9vbS55MywgMiwgZ2V0TXV0YWJsZVRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhpcyBkcmF3cyBhIGNvcm5lciBpZiB0aGVyZSBhcmVuJ3Qgcm9vbSBjb25uZWN0aW9ucyBpbiB0aGF0IGRpcmVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IC0gdGhlIHggcG9pbnQgdGhlIGNvcm5lciB3aWxsIGJlIHBsYWNlZCBhdC5cbiAgICAgKiBAcGFyYW0geSAtIHRoZSB5IHBvaW50IHRoZSBjb3JuZXIgd2lsbCBiZSBwbGFjZWQgYXQuXG4gICAgICogQHBhcmFtIGRpcjEgLSBkaXJlY3Rpb24gb25lIHRvIGNoZWNrIHRvIHNlZSBpZiB0aGUgY29ybmVyIHNob3VsZCBiZSBwbGFjZWQuXG4gICAgICogQHBhcmFtIGRpcjIgLSBkaXJlY3Rpb24gdHdvIHRvIGNoZWNrIHRvIHNlZSBpZiB0aGUgY29ybmVyIHNob3VsZCBiZSBwbGFjZWQuXG4gICAgICogQHBhcmFtIGdldE11dGFibGVUaWxlIC0gdGhlIGZ1bmN0aW9uIGZvciBpdCB0byBncmFiIHRpbGVzLlxuICAgICAqIEByZXR1cm5zIG5vdGhpbmcuXG4gICAgICovXG4gICAgcHJpdmF0ZSBkcmF3Q29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCBkaXIxOiBib29sZWFuLCBkaXIyOiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZTogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBNdXRhYmxlPFRpbGU+KTogdm9pZCB7XG4gICAgICAgIGlmIChkaXIxID09PSB0cnVlIHx8IGRpcjIgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHgsIHkpLmlzV2FsbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGlzIGRyYXdzIHdhbGxzIGFuZCBtYWtlcyBzdXJlIHRoYXQgdGhlcmUgaXNuJ3QgYSBkb29yIHRoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHggLSB0aGUgeCBwb2ludCB0aGUgY29ybmVyIHdpbGwgYmUgcGxhY2VkIGF0LlxuICAgICAqIEBwYXJhbSB5IC0gdGhlIHkgcG9pbnQgdGhlIGNvcm5lciB3aWxsIGJlIHBsYWNlZCBhdC5cbiAgICAgKiBAcGFyYW0gZ2V0TXV0YWJsZVRpbGUgLSB0aGUgZnVuY3Rpb24gZm9yIGl0IHRvIGdyYWIgdGlsZXMuXG4gICAgICogQHJldHVybnMgbm90aGluZy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRyYXdXYWxsKHg6IG51bWJlciwgeTogbnVtYmVyLCBnZXRNdXRhYmxlVGlsZTogKHg6IG51bWJlciwgeTogbnVtYmVyKSA9PiBNdXRhYmxlPFRpbGU+KTogdm9pZCB7XG4gICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5kZWNvcmF0aW9uICE9PSAxKSB7XG4gICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1dhbGwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhpcyBkcmF3cyB3YWxscyBhbmQgbWFrZXMgc3VyZSB0aGF0IHRoZXJlIGlzbid0IGEgZG9vciB0aGVyZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IC0gdGhlIHggcG9pbnQgdGhlIGNvcm5lciB3aWxsIGJlIHBsYWNlZCBhdC5cbiAgICAgKiBAcGFyYW0geSAtIHRoZSB5IHBvaW50IHRoZSBjb3JuZXIgd2lsbCBiZSBwbGFjZWQgYXQuXG4gICAgICogQHBhcmFtIGQgLSBkZWNvcmF0aW9uIHZhbHVlIG9mIHRoZSBkb29yLiBEZWZhdWx0IG9mIDFcbiAgICAgKiBAcGFyYW0gZ2V0TXV0YWJsZVRpbGUgLSB0aGUgZnVuY3Rpb24gZm9yIGl0IHRvIGdyYWIgdGlsZXMuXG4gICAgICogQHJldHVybnMgbm90aGluZy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRyYXdEb29yKHg6IG51bWJlciwgeTogbnVtYmVyLCBkOiBudW1iZXIgPSAxLFxuICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGU6ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gTXV0YWJsZTxUaWxlPik6IHZvaWQge1xuICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1dhbGwgPSBmYWxzZTtcbiAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuZGVjb3JhdGlvbiA9IGQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhpcyBtYWtlcyBzdXJlIHRoZSByb29tIGlzIGluIHRoZSBsaXN0LiBJIHdhcyB1bmNyZWF0aXZlIHdpdGggdGhlIG5hbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdW5jb24gLSBhIGxpc3Qgb2YgeCBhbmQgeSBwb2ludHMuXG4gICAgICogQHBhcmFtIHggLSB0aGUgeCBwb2ludCB5b3UgYXJlIGNoZWNraW5nIGZvci5cbiAgICAgKiBAcGFyYW0geSAtIHRoZSB5IHBvaW50IHlvdSBhcmUgY2hlY2tpbmcgZm9yLlxuICAgICAqIEByZXR1cm5zIHJldHVybnMgaXQncyBpbmRleCBvciAtMSBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuICAgICAqL1xuICAgIHByaXZhdGUgaGFzKHVuY29uOiBJUG9pbnRbXSwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHVuY29uLmxlbmd0aDsgdysrKSB7XG4gICAgICAgICAgICBpZiAodW5jb25bd10ueCA9PT0geCAmJiB1bmNvblt3XS55ID09PSB5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gc3Bhd24gaW4gYSB1bml0IGZvciBhIGdpdmVuIHBsYXllci5cbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IHdpbGwgb3duIHRoZSB1bml0LlxuICAgICAqIEBwYXJhbSBqb2IgLSBUaGUgam9iIG9mIHRoZSB1bml0LlxuICAgICAqL1xuICAgIHByaXZhdGUgc3Bhd25Vbml0KHBsYXllcjogUGxheWVyLCBqb2I6IEpvYik6IHZvaWQge1xuICAgICAgICAvLyBJdGVyYXRlIHRocm91Z2ggZWFjaCBwbGF5ZXIncyBzcGF3biB0aWxlcyB0byBmaW5kIGEgc3BvdCB0byBzcGF3biB1bml0LlxuICAgICAgICBmb3IgKGNvbnN0IHRpbGUgb2YgcGxheWVyLnNwYXduVGlsZXMpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGVyZSBpcyBhIFVuaXQgb24gdGhlIHRpbGUuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBtb3ZlIG9uIHRvIHRoZSBuZXh0IHRpbGUuXG4gICAgICAgICAgICBpZiAodGlsZS51bml0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBFbHNlIHNwYXduIGluIFVuaXQgYW5kIHJldHVybiBzdWNjZXNzIHRvIHNwYXduaW5nLlxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGlsZS51bml0ID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICAgICAgYWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoZWFsdGg6IGpvYi5oZWFsdGgsXG4gICAgICAgICAgICAgICAgICAgIGpvYixcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHBsYXllcixcbiAgICAgICAgICAgICAgICAgICAgdGlsZSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZXM6IGpvYi5tb3ZlcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudW5pdHMucHVzaCh0aWxlLnVuaXQpO1xuICAgICAgICAgICAgICAgIHRoaXMudW5pdHMucHVzaCh0aWxlLnVuaXQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=