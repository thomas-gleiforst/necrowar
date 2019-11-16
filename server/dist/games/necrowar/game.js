"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- /Creer-Merge: imports -->>
/**
 * Send hordes of the undead at your opponent while defending yourself against
 * theirs to win.
 */
class NecrowarGame extends _1.BaseClasses.Game {
    // <<-- Creer-Merge: attributes -->>
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
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        this.createunitJobs();
        this.createtowerJobs();
        this.createMap();
        this.giveInitialStuff();
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
    // Any additional protected or pirate methods can go here.
    /**
     * Gives players gold and mana.
     */
    giveInitialStuff() {
        this.players[0].gold = 100;
        this.players[0].mana = 100;
        this.players[1].gold = 100;
        this.players[1].mana = 100;
    }
    /** Creates all unit types in the game */
    createunitJobs() {
        // pushes all unit types
        this.unitJobs.push(this.manager.create.unitJob({
            title: "worker",
            goldCost: 10,
            manaCost: 0,
            damage: 0,
            health: 1,
            moves: 8,
            range: 1,
            perTile: 1,
        }), this.manager.create.unitJob({
            title: "zombie",
            goldCost: 0,
            manaCost: 2,
            damage: 1,
            health: 5,
            moves: 3,
            range: 1,
            perTile: 10,
        }), this.manager.create.unitJob({
            title: "ghoul",
            goldCost: 20,
            manaCost: 5,
            damage: 5,
            health: 15,
            moves: 3,
            range: 1,
            perTile: 2,
        }), this.manager.create.unitJob({
            title: "abomination",
            goldCost: 25,
            manaCost: 10,
            damage: 10,
            health: 60,
            moves: 1,
            range: 1,
            perTile: 1,
        }), this.manager.create.unitJob({
            title: "hound",
            goldCost: 15,
            manaCost: 4,
            damage: 5,
            health: 5,
            moves: 5,
            range: 1,
            perTile: 3,
        }), this.manager.create.unitJob({
            title: "wraith",
            goldCost: 40,
            manaCost: 20,
            damage: 10,
            health: 10,
            moves: 6,
            range: 1,
            perTile: 1,
        }), this.manager.create.unitJob({
            title: "horseman",
            goldCost: 150,
            manaCost: 50,
            damage: 15,
            health: 75,
            moves: 5,
            range: 1,
            perTile: 1,
        }));
    }
    /**
     * Creates all tower types.
     */
    createtowerJobs() {
        // pushes all tower types
        this.towerJobs.push(this.manager.create.towerJob({
            title: "castle",
            goldCost: 9999,
            manaCost: 9999,
            health: 100,
            range: 3,
            turnsBetweenAttacks: 1,
            allUnits: true,
            damage: 3,
        }), this.manager.create.towerJob({
            title: "arrow",
            goldCost: 50,
            manaCost: 0,
            health: 30,
            range: 3,
            turnsBetweenAttacks: 1,
            allUnits: false,
            damage: 5,
        }), this.manager.create.towerJob({
            title: "ballista",
            goldCost: 75,
            manaCost: 0,
            health: 30,
            range: 3,
            turnsBetweenAttacks: 3,
            allUnits: false,
            damage: 20,
        }), this.manager.create.towerJob({
            title: "cleansing",
            goldCost: 30,
            manaCost: 30,
            health: 30,
            range: 3,
            turnsBetweenAttacks: 1,
            allUnits: false,
            damage: 5,
        }), this.manager.create.towerJob({
            title: "aoe",
            goldCost: 40,
            manaCost: 15,
            health: 30,
            range: 3,
            turnsBetweenAttacks: 1,
            allUnits: true,
            damage: 3,
        }));
    }
    /**
     * Generates the map
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
        // Cover a whole side in grass tiles
        for (let x = 0; x < (this.mapWidth / 2 - 1.5); x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                getMutableTile(x, y).isGrass = true;
                const tile = this.getTile(x, y);
                if (tile) {
                    this.players[0].side.push(tile);
                }
            }
        }
        // Cover the middle stripe in river tiles
        for (let x = (this.mapWidth / 2 - 1.5); x < (this.mapWidth / 2 + 1.5); x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                getMutableTile(x, y).isRiver = true;
                getMutableTile(x, y).isGrass = false;
            }
        }
        // Create the paths going around the map
        for (let x = 0; x < (this.mapWidth / 2); x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (
                // bottom Part
                ((y === (this.mapHeight - 6)) && (x > 5)) ||
                    ((y === (this.mapHeight - 7)) && (x > 5)) ||
                    // top Part
                    ((y === 6) && (x > 15)) ||
                    ((y === 5) && (x > 15)) ||
                    // Left Side Part
                    ((y > 4) && (y < (this.mapHeight - 5)) && (x === 5)) ||
                    ((y > 4) && (y < (this.mapHeight - 5)) && (x === 6))) {
                    getMutableTile(x, y).isPath = true;
                    getMutableTile(x, y).isGrass = false;
                }
            }
        }
        // Create the extra paths surrounding the castle location
        getMutableTile(7, 7).isPath = true;
        getMutableTile(7, 6).isPath = true;
        getMutableTile(7, 5).isPath = true;
        getMutableTile(7, 7).isGrass = false;
        getMutableTile(7, 6).isGrass = false;
        getMutableTile(7, 5).isGrass = false;
        // Place castle
        getMutableTile(6, 6).isCastle = true;
        getMutableTile(6, 6).isPath = false;
        getMutableTile(6, 6).owner = this.players[0];
        // Place gold mine tiles
        for (let x = 15; x <= 16; x++) {
            for (let y = (this.mapHeight - 16); y <= (this.mapHeight - 15); y++) {
                getMutableTile(x, y).isGoldMine = true;
            }
        }
        // Set Worker Spawn
        getMutableTile(8, 9).isWorkerSpawn = true;
        getMutableTile(8, 9).owner = this.players[0];
        // Set Unit Spawn
        getMutableTile(15, 6).isUnitSpawn = true;
        getMutableTile(15, 6).isGrass = false;
        getMutableTile(11, 6).owner = this.players[0];
        // Mirror the generated map for the other side, both mirroring x and y so it flips diagnolly
        for (let x = 0; x < this.mapWidth / 2; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const tile = this.getTile(this.mapWidth - x - 1, this.mapHeight - y - 1);
                if (tile) {
                    this.players[1].side.push(tile);
                }
                // Grass
                if (getMutableTile(x, y).isGrass) {
                    getMutableTile((this.mapWidth - x - 1), (this.mapHeight - y - 1)).isGrass = true;
                }
                // Paths
                if (getMutableTile(x, y).isPath) {
                    getMutableTile((this.mapWidth - x - 1), (this.mapHeight - y - 1)).isPath = true;
                }
                // Gold Mines
                if (getMutableTile(x, y).isGoldMine) {
                    getMutableTile((this.mapWidth - x - 1), (this.mapHeight - y - 1)).isGoldMine = true;
                }
                // Castle
                if (getMutableTile(x, y).isCastle) {
                    getMutableTile((this.mapWidth - x - 1), (this.mapHeight - y - 1)).isCastle = true;
                }
                // Worker Spawn
                if (getMutableTile(x, y).isWorkerSpawn) {
                    getMutableTile((this.mapWidth - x - 1), (this.mapHeight - y - 1)).isWorkerSpawn = true;
                }
                // Unit Spawn
                if (getMutableTile(x, y).isUnitSpawn) {
                    getMutableTile((this.mapWidth - x - 1), (this.mapHeight - y - 1)).isUnitSpawn = true;
                }
            }
        }
        // Generate Island
        // Make a Square of river in the center of the map, the "lake"
        for (let x = (this.mapWidth / 2 - 2.5); x <= (this.mapWidth / 2 + 1.5); x++) {
            for (let y = (this.mapHeight / 2 - 2); y <= (this.mapHeight / 2 + 2); y++) {
                getMutableTile(x, y).isRiver = true;
                getMutableTile(x, y).isGrass = false;
            }
        }
        // Make a smaller square of grass within the "lake"
        for (let x = (this.mapWidth / 2 - 1.5); x <= (this.mapWidth / 2 + 0.5); x++) {
            for (let y = (this.mapHeight / 2 - 1); y < (this.mapHeight / 2 + 2); y++) {
                getMutableTile(x, y).isGrass = true;
                getMutableTile(x, y).isRiver = false;
            }
        }
        // Paths leading to island
        getMutableTile(this.mapWidth / 2 - 2.5, this.mapHeight / 2).isGrass = true;
        getMutableTile(this.mapWidth / 2 - 2.5, this.mapHeight / 2).isRiver = false;
        getMutableTile(this.mapWidth / 2 + 1.5, this.mapHeight / 2).isGrass = true;
        getMutableTile(this.mapWidth / 2 + 1.5, this.mapHeight / 2).isRiver = false;
        // Make island mine tiles on the middle three tiles
        for (let x = (this.mapWidth / 2 - 0.5); x <= (this.mapWidth / 2 - 0.5); x++) {
            for (let y = (this.mapHeight / 2 - 1); y < (this.mapHeight / 2 + 2); y++) {
                getMutableTile(x, y).isIslandGoldMine = true;
            }
        }
        // Assign ownership to sides
        for (let x = 0; x < (this.mapWidth / 2 - 0.5); x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (getMutableTile(x, y).isGrass || getMutableTile(x, y).isGoldMine || getMutableTile(x, y).isCastle ||
                    getMutableTile(x, y).isWorkerSpawn || getMutableTile(x, y).isUnitSpawn) {
                    getMutableTile(x, y).owner = this.players[0];
                }
            }
        }
        for (let x = (this.mapWidth / 2 + 0.5); x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (getMutableTile(x, y).isGrass || getMutableTile(x, y).isGoldMine || getMutableTile(x, y).isCastle ||
                    getMutableTile(x, y).isWorkerSpawn || getMutableTile(x, y).isUnitSpawn) {
                    getMutableTile(x, y).owner = this.players[1];
                }
            }
        }
        // Creates the castles on either side
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if (getMutableTile(x, y).isCastle) {
                    // if it's player 0's castle
                    if (getMutableTile(x, y).owner === this.players[0]) {
                        getMutableTile(x, y).tower = this.manager.create.tower({
                            owner: this.players[0],
                            tile: this.getTile(x, y),
                            job: this.towerJobs[0],
                            health: this.towerJobs[0].health,
                        });
                        const tile = this.getTile(x, y);
                        if (tile && tile.tower) {
                            this.towers.push(tile.tower);
                            this.players[0].towers.push(tile.tower);
                            getMutableTile(x, y).isTower = true;
                            getMutableTile(x, y).isCastle = true;
                        }
                    }
                    else if (getMutableTile(x, y).owner === this.players[1]) {
                        // if it's player 1's castle
                        if (getMutableTile(x, y).owner === this.players[1]) {
                            getMutableTile(x, y).tower = this.manager.create.tower({
                                owner: this.players[1],
                                tile: this.getTile(x, y),
                                job: this.towerJobs[0],
                                health: this.towerJobs[0].health,
                            });
                            const tile = this.getTile(x, y);
                            if (tile && tile.tower) {
                                this.towers.push(tile.tower);
                                this.players[1].towers.push(tile.tower);
                                getMutableTile(x, y).isTower = true;
                                getMutableTile(x, y).isCastle = true;
                            }
                        }
                    }
                }
            }
        }
    }
}
exports.NecrowarGame = NecrowarGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZWNyb3dhci9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUJBQWlDO0FBY2pDLGtDQUFrQztBQUVsQzs7O0dBR0c7QUFDSCxNQUFhLFlBQWEsU0FBUSxjQUFXLENBQUMsSUFBSTtJQXNHOUMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ2MsZUFBNEMsRUFDdEQsUUFBeUM7UUFFekMsS0FBSyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUh2QixvQkFBZSxHQUFmLGVBQWUsQ0FBNkI7UUFqSDFELGtFQUFrRTtRQUNsRCxhQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBcUhsRSxxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBRWhDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWpCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXhCLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQzs7Ozs7O09BTUc7SUFDSSxPQUFPLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDL0IseUNBQXlDO1FBQ3pDLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFxQixDQUFDO0lBQ25ELENBQUM7SUFFRCxxREFBcUQ7SUFFckQsMERBQTBEO0lBRTFEOztPQUVHO0lBQ0ssZ0JBQWdCO1FBQ3BCLElBQUksQ0FBQyxPQUFPLENBQUMs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LElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUN4QyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0NBQ3BDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs2QkFDeEM7eUJBQ0o7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKO0lBQ0wsQ0FBQztDQUdKO0FBcGhCRCxvQ0FvaEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lUmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgTmVjcm93YXJHYW1lTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtbWFuYWdlclwiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBOZWNyb3dhckdhbWVTZXR0aW5nc01hbmFnZXIgfSBmcm9tIFwiLi9nYW1lLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5pbXBvcnQgeyBUb3dlciB9IGZyb20gXCIuL3Rvd2VyXCI7XG5pbXBvcnQgeyBUb3dlckpvYiB9IGZyb20gXCIuL3Rvd2VyLWpvYlwiO1xuaW1wb3J0IHsgVW5pdCB9IGZyb20gXCIuL3VuaXRcIjtcbmltcG9ydCB7IFVuaXRKb2IgfSBmcm9tIFwiLi91bml0LWpvYlwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbmltcG9ydCB7IE11dGFibGUgfSBmcm9tIFwifi91dGlsc1wiO1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIFNlbmQgaG9yZGVzIG9mIHRoZSB1bmRlYWQgYXQgeW91ciBvcHBvbmVudCB3aGlsZSBkZWZlbmRpbmcgeW91cnNlbGYgYWdhaW5zdFxuICogdGhlaXJzIHRvIHdpbi5cbiAqL1xuZXhwb3J0IGNsYXNzIE5lY3Jvd2FyR2FtZSBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWUge1xuICAgIC8qKiBUaGUgbWFuYWdlciBvZiB0aGlzIGdhbWUsIHRoYXQgY29udHJvbHMgZXZlcnl0aGluZyBhcm91bmQgaXQgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWFuYWdlciE6IE5lY3Jvd2FyR2FtZU1hbmFnZXI7XG5cbiAgICAvKiogVGhlIHNldHRpbmdzIHVzZWQgdG8gaW5pdGlhbGl6ZSB0aGUgZ2FtZSwgYXMgc2V0IGJ5IHBsYXllcnMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2V0dGluZ3MgPSBPYmplY3QuZnJlZXplKHRoaXMuc2V0dGluZ3NNYW5hZ2VyLnZhbHVlcyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIHdob3NlIHR1cm4gaXQgaXMgY3VycmVudGx5LiBUaGF0IHBsYXllciBjYW4gc2VuZCBjb21tYW5kcy5cbiAgICAgKiBPdGhlciBwbGF5ZXJzIGNhbm5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFBsYXllciE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHR1cm4gbnVtYmVyLCBzdGFydGluZyBhdCAwIGZvciB0aGUgZmlyc3QgcGxheWVyJ3MgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFR1cm4hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcHBpbmcgb2YgZXZlcnkgZ2FtZSBvYmplY3QncyBJRCB0byB0aGUgYWN0dWFsIGdhbWUgb2JqZWN0LiBQcmltYXJpbHlcbiAgICAgKiB1c2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNsaWVudCB0byBlYXNpbHkgcmVmZXIgdG8gdGhlIGdhbWUgb2JqZWN0cyB2aWFcbiAgICAgKiBJRC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZU9iamVjdHMhOiB7W2lkOiBzdHJpbmddOiBHYW1lT2JqZWN0fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZ29sZCBpbmNvbWUgcGVyIHR1cm4gcGVyIHVuaXQgaW4gYSBtaW5lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnb2xkSW5jb21lUGVyVW5pdCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZ29sZCBpbmNvbWUgcGVyIHR1cm4gcGVyIHVuaXQgaW4gdGhlIGlzbGFuZCBtaW5lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBpc2xhbmRJbmNvbWVQZXJVbml0ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEFtb3VudCBvZiBnb2xkIGluY29tZSBwZXIgdHVybiBwZXIgdW5pdCBmaXNoaW5nIG9uIHRoZSByaXZlciBzaWRlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYW5hSW5jb21lUGVyVW5pdCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgVGlsZXMgaW4gdGhlIG1hcCBhbG9uZyB0aGUgeSAodmVydGljYWwpIGF4aXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hcEhlaWdodCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgVGlsZXMgaW4gdGhlIG1hcCBhbG9uZyB0aGUgeCAoaG9yaXpvbnRhbCkgYXhpcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWFwV2lkdGghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYmVmb3JlIHRoZSBnYW1lIHdpbGwgYXV0b21hdGljYWxseSBlbmQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1heFR1cm5zITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBhbGwgdGhlIHBsYXllcnMgaW4gdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIHBsYXllcnMhOiBQbGF5ZXJbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdHVybnMgaXQgdGFrZXMgYmV0d2VlbiB0aGUgcml2ZXIgY2hhbmdpbmcgcGhhc2VzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSByaXZlclBoYXNlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGdhbWUgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBwbGF5ZWQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNlc3Npb24hOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIHRpbGVzIGluIHRoZSBtYXAsIHN0b3JlZCBpbiBSb3ctbWFqb3Igb3JkZXIuIFVzZSBgeCArIHkgKlxuICAgICAqIG1hcFdpZHRoYCB0byBhY2Nlc3MgdGhlIGNvcnJlY3QgaW5kZXguXG4gICAgICovXG4gICAgcHVibGljIHRpbGVzITogVGlsZVtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIGFkZGVkIGFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGFcbiAgICAgKiB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aW1lQWRkZWRQZXJUdXJuITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQSBsaXN0IG9mIGV2ZXJ5IHRvd2VyIHR5cGUgLyBqb2IuXG4gICAgICovXG4gICAgcHVibGljIHRvd2VySm9icyE6IFRvd2VySm9iW107XG5cbiAgICAvKipcbiAgICAgKiBFdmVyeSBUb3dlciBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgdG93ZXJzITogVG93ZXJbXTtcblxuICAgIC8qKlxuICAgICAqIEEgbGlzdCBvZiBldmVyeSB1bml0IHR5cGUgLyBqb2IuXG4gICAgICovXG4gICAgcHVibGljIHVuaXRKb2JzITogVW5pdEpvYltdO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgVW5pdCBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5pdHMhOiBVbml0W107XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBHYW1lIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2V0dGluZ3NNYW5hZ2VyIC0gVGhlIG1hbmFnZXIgdGhhdCBob2xkcyBpbml0aWFsIHNldHRpbmdzLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc2V0dGluZ3NNYW5hZ2VyOiBOZWNyb3dhckdhbWVTZXR0aW5nc01hbmFnZXIsXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihzZXR0aW5nc01hbmFnZXIsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG5cbiAgICAgICAgdGhpcy5jcmVhdGV1bml0Sm9icygpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRldG93ZXJKb2JzKCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVNYXAoKTtcblxuICAgICAgICB0aGlzLmdpdmVJbml0aWFsU3R1ZmYoKTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdGlsZSBhdCAoeCwgeSksIG9yIHVuZGVmaW5lZCBpZiB0aGUgY28tb3JkaW5hdGVzIGFyZSBvZmYtbWFwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHggLSBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgZGVzaXJlZCB0aWxlLlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgcG9zaXRpb24gb2YgdGhlIGRlc2lyZWQgdGlsZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgVGlsZSBhdCAoeCwgeSkgaWYgdmFsaWQsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGdldFRpbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdldFRpbGUoeCwgeSkgYXMgVGlsZSB8IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkIG9yIHBpcmF0ZSBtZXRob2RzIGNhbiBnbyBoZXJlLlxuXG4gICAgLyoqXG4gICAgICogR2l2ZXMgcGxheWVycyBnb2xkIGFuZCBtYW5hLlxuICAgICAqL1xuICAgIHByaXZhdGUgZ2l2ZUluaXRpYWxTdHVmZigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wbGF5ZXJzWzBdLmdvbGQgPSAxMDA7XG4gICAgICAgIHRoaXMucGxheWVyc1swXS5tYW5hID0gMTAwO1xuICAgICAgICB0aGlzLnBsYXllcnNbMV0uZ29sZCA9IDEwMDtcbiAgICAgICAgdGhpcy5wbGF5ZXJzWzFdLm1hbmEgPSAxMDA7XG4gICAgfVxuXG4gICAgLyoqIENyZWF0ZXMgYWxsIHVuaXQgdHlwZXMgaW4gdGhlIGdhbWUgKi9cbiAgICBwcml2YXRlIGNyZWF0ZXVuaXRKb2JzKCk6IHZvaWQge1xuICAgICAgICAvLyBwdXNoZXMgYWxsIHVuaXQgdHlwZXNcbiAgICAgICAgdGhpcy51bml0Sm9icy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0Sm9iKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ3b3JrZXJcIixcbiAgICAgICAgICAgICAgICBnb2xkQ29zdDogMTAsXG4gICAgICAgICAgICAgICAgbWFuYUNvc3Q6IDAsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAwLFxuICAgICAgICAgICAgICAgIGhlYWx0aDogMSxcbiAgICAgICAgICAgICAgICBtb3ZlczogOCxcbiAgICAgICAgICAgICAgICByYW5nZTogMSxcbiAgICAgICAgICAgICAgICBwZXJUaWxlOiAxLFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudW5pdEpvYih7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiem9tYmllXCIsXG4gICAgICAgICAgICAgICAgZ29sZENvc3Q6IDAsXG4gICAgICAgICAgICAgICAgbWFuYUNvc3Q6IDIsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAxLFxuICAgICAgICAgICAgICAgIGhlYWx0aDogNSxcbiAgICAgICAgICAgICAgICBtb3ZlczogMyxcbiAgICAgICAgICAgICAgICByYW5nZTogMSxcbiAgICAgICAgICAgICAgICBwZXJUaWxlOiAxMCxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLnVuaXRKb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcImdob3VsXCIsXG4gICAgICAgICAgICAgICAgZ29sZENvc3Q6IDIwLFxuICAgICAgICAgICAgICAgIG1hbmFDb3N0OiA1LFxuICAgICAgICAgICAgICAgIGRhbWFnZTogNSxcbiAgICAgICAgICAgICAgICBoZWFsdGg6IDE1LFxuICAgICAgICAgICAgICAgIG1vdmVzOiAzLFxuICAgICAgICAgICAgICAgIHJhbmdlOiAxLFxuICAgICAgICAgICAgICAgIHBlclRpbGU6IDIsXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0Sm9iKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJhYm9taW5hdGlvblwiLFxuICAgICAgICAgICAgICAgIGdvbGRDb3N0OiAyNSxcbiAgICAgICAgICAgICAgICBtYW5hQ29zdDogMTAsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAxMCxcbiAgICAgICAgICAgICAgICBoZWFsdGg6IDYwLFxuICAgICAgICAgICAgICAgIG1vdmVzOiAxLFxuICAgICAgICAgICAgICAgIHJhbmdlOiAxLFxuICAgICAgICAgICAgICAgIHBlclRpbGU6IDEsXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0Sm9iKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJob3VuZFwiLFxuICAgICAgICAgICAgICAgIGdvbGRDb3N0OiAxNSxcbiAgICAgICAgICAgICAgICBtYW5hQ29zdDogNCxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDUsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiA1LFxuICAgICAgICAgICAgICAgIG1vdmVzOiA1LFxuICAgICAgICAgICAgICAgIHJhbmdlOiAxLFxuICAgICAgICAgICAgICAgIHBlclRpbGU6IDMsXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0Sm9iKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ3cmFpdGhcIixcbiAgICAgICAgICAgICAgICBnb2xkQ29zdDogNDAsXG4gICAgICAgICAgICAgICAgbWFuYUNvc3Q6IDIwLFxuICAgICAgICAgICAgICAgIGRhbWFnZTogMTAsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiAxMCxcbiAgICAgICAgICAgICAgICBtb3ZlczogNixcbiAgICAgICAgICAgICAgICByYW5nZTogMSxcbiAgICAgICAgICAgICAgICBwZXJUaWxlOiAxLFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudW5pdEpvYih7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiaG9yc2VtYW5cIixcbiAgICAgICAgICAgICAgICBnb2xkQ29zdDogMTUwLFxuICAgICAgICAgICAgICAgIG1hbmFDb3N0OiA1MCxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDE1LFxuICAgICAgICAgICAgICAgIGhlYWx0aDogNzUsXG4gICAgICAgICAgICAgICAgbW92ZXM6IDUsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IDEsXG4gICAgICAgICAgICAgICAgcGVyVGlsZTogMSxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbGwgdG93ZXIgdHlwZXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjcmVhdGV0b3dlckpvYnMoKTogdm9pZCB7XG4gICAgICAgIC8vIHB1c2hlcyBhbGwgdG93ZXIgdHlwZXNcbiAgICAgICAgdGhpcy50b3dlckpvYnMucHVzaChcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudG93ZXJKb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcImNhc3RsZVwiLFxuICAgICAgICAgICAgICAgIGdvbGRDb3N0OiA5OTk5LFxuICAgICAgICAgICAgICAgIG1hbmFDb3N0OiA5OTk5LFxuICAgICAgICAgICAgICAgIGhlYWx0aDogMTAwLFxuICAgICAgICAgICAgICAgIHJhbmdlOiAzLFxuICAgICAgICAgICAgICAgIHR1cm5zQmV0d2VlbkF0dGFja3M6IDEsXG4gICAgICAgICAgICAgICAgYWxsVW5pdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAzLFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudG93ZXJKb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcImFycm93XCIsXG4gICAgICAgICAgICAgICAgZ29sZENvc3Q6IDUwLFxuICAgICAgICAgICAgICAgIG1hbmFDb3N0OiAwLFxuICAgICAgICAgICAgICAgIGhlYWx0aDogMzAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IDMsXG4gICAgICAgICAgICAgICAgdHVybnNCZXR3ZWVuQXR0YWNrczogMSxcbiAgICAgICAgICAgICAgICBhbGxVbml0czogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiA1LFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudG93ZXJKb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcImJhbGxpc3RhXCIsXG4gICAgICAgICAgICAgICAgZ29sZENvc3Q6IDc1LFxuICAgICAgICAgICAgICAgIG1hbmFDb3N0OiAwLFxuICAgICAgICAgICAgICAgIGhlYWx0aDogMzAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IDMsXG4gICAgICAgICAgICAgICAgdHVybnNCZXR3ZWVuQXR0YWNrczogMyxcbiAgICAgICAgICAgICAgICBhbGxVbml0czogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAyMCxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLnRvd2VySm9iKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJjbGVhbnNpbmdcIixcbiAgICAgICAgICAgICAgICBnb2xkQ29zdDogMzAsXG4gICAgICAgICAgICAgICAgbWFuYUNvc3Q6IDMwLFxuICAgICAgICAgICAgICAgIGhlYWx0aDogMzAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IDMsXG4gICAgICAgICAgICAgICAgdHVybnNCZXR3ZWVuQXR0YWNrczogMSxcbiAgICAgICAgICAgICAgICBhbGxVbml0czogZmFsc2UsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiA1LFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudG93ZXJKb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcImFvZVwiLFxuICAgICAgICAgICAgICAgIGdvbGRDb3N0OiA0MCxcbiAgICAgICAgICAgICAgICBtYW5hQ29zdDogMTUsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiAzMCxcbiAgICAgICAgICAgICAgICByYW5nZTogMyxcbiAgICAgICAgICAgICAgICB0dXJuc0JldHdlZW5BdHRhY2tzOiAxLFxuICAgICAgICAgICAgICAgIGFsbFVuaXRzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRhbWFnZTogMyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyB0aGUgbWFwXG4gICAgICovXG4gICAgcHJpdmF0ZSBjcmVhdGVNYXAoKTogdm9pZCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGdldCBhIG11dGFibGUgdGlsZSBhdCBhIGdpdmVuICh4LCB5KS5cbiAgICAgICAgICpcbiAgICAgICAgICogTk9URTogVGhpcyBpcyBhIGNsb3N1cmUgZnVuY3Rpb24uIEl0IGlzIGEgZnVuY3Rpb24gd2UgY3JlYXRlIHdoaWxlXG4gICAgICAgICAqIHJ1bm5pbmcgY3JlYXRlTWFwKCksIGFuZCBpdCB3cmFwcyB0aGUgY3VycmVudCBzY29wZSwgc28gdGhhdCBgdGhpc2BcbiAgICAgICAgICogcmVmZXJzIHRvIHRoZSBHYW1lIHJ1bm5pbmcgYGNyZWF0ZU1hcCgpYCwgZXZlbiB0aG91Z2ggdGhlIGdhbWUgd2FzXG4gICAgICAgICAqIG5vdCBwYXNzZWQuXG4gICAgICAgICAqIEBwYXJhbSB4IC0gVGhlIHggY29vcmRpbmF0ZS4gSWYgb2ZmIG1hcCB0aHJvd3MgYW4gRXJyb3IuXG4gICAgICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgY29vcmRpbmF0ZS4gSWYgb2ZmIG1hcCB0aHJvd3MgYW4gRXJyb3IuXG4gICAgICAgICAqIEByZXR1cm5zIEEgVGlsZSB0aGF0IGlzIG11dGFibGUgSlVTVCBmb3IgdGhpcyBmdW5jdGlvbiBzY29wZS5cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0IGdldE11dGFibGVUaWxlID0gKHg6IG51bWJlciwgeTogbnVtYmVyKTogTXV0YWJsZTxUaWxlPiA9PiB7XG4gICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5nZXRUaWxlKHgsIHkpO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZ2V0IGEgdGlsZSBmb3IgbWFwIGdlbmVyYXRpb24gYXQgKCR7eH0sICR7eX0pYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aWxlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENvdmVyIGEgd2hvbGUgc2lkZSBpbiBncmFzcyB0aWxlc1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8ICh0aGlzLm1hcFdpZHRoIC8gMiAtIDEuNSk7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcEhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNHcmFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuZ2V0VGlsZSh4LCB5KTtcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbMF0uc2lkZS5wdXNoKHRpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvdmVyIHRoZSBtaWRkbGUgc3RyaXBlIGluIHJpdmVyIHRpbGVzXG4gICAgICAgIGZvciAobGV0IHggPSAodGhpcy5tYXBXaWR0aCAvIDIgLSAxLjUpOyB4IDwgKHRoaXMubWFwV2lkdGggLyAyICsgMS41KTsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwSGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1JpdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0dyYXNzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgdGhlIHBhdGhzIGdvaW5nIGFyb3VuZCB0aGUgbWFwXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgKHRoaXMubWFwV2lkdGggLyAyKTsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwSGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tIFBhcnRcbiAgICAgICAgICAgICAgICAoKHkgPT09ICh0aGlzLm1hcEhlaWdodCAtIDYpKSAmJiAoeCA+IDUpKSB8fFxuICAgICAgICAgICAgICAgICgoeSA9PT0gKHRoaXMubWFwSGVpZ2h0IC0gNykpICYmICh4ID4gNSkpIHx8XG4gICAgICAgICAgICAgICAgLy8gdG9wIFBhcnRcbiAgICAgICAgICAgICAgICAoKHkgPT09IDYpICYmICh4ID4gMTUpKSB8fFxuICAgICAgICAgICAgICAgICgoeSA9PT0gNSkgJiYgKHggPiAxNSkpIHx8XG4gICAgICAgICAgICAgICAgLy8gTGVmdCBTaWRlIFBhcnRcbiAgICAgICAgICAgICAgICAoKHkgPiA0KSAmJiAoeSA8ICh0aGlzLm1hcEhlaWdodCAtIDUpKSAmJiAoeCA9PT0gNSkpIHx8XG4gICAgICAgICAgICAgICAgKCh5ID4gNCkgJiYgKHkgPCAodGhpcy5tYXBIZWlnaHQgLSA1KSkgJiYgKHggPT09IDYpKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1BhdGggPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0dyYXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBleHRyYSBwYXRocyBzdXJyb3VuZGluZyB0aGUgY2FzdGxlIGxvY2F0aW9uXG4gICAgICAgIGdldE11dGFibGVUaWxlKDcsIDcpLmlzUGF0aCA9IHRydWU7XG4gICAgICAgIGdldE11dGFibGVUaWxlKDcsIDYpLmlzUGF0aCA9IHRydWU7XG4gICAgICAgIGdldE11dGFibGVUaWxlKDcsIDUpLmlzUGF0aCA9IHRydWU7XG4gICAgICAgIGdldE11dGFibGVUaWxlKDcsIDcpLmlzR3Jhc3MgPSBmYWxzZTtcbiAgICAgICAgZ2V0TXV0YWJsZVRpbGUoNywgNikuaXNHcmFzcyA9IGZhbHNlO1xuICAgICAgICBnZXRNdXRhYmxlVGlsZSg3LCA1KS5pc0dyYXNzID0gZmFsc2U7XG5cbiAgICAgICAgLy8gUGxhY2UgY2FzdGxlXG4gICAgICAgIGdldE11dGFibGVUaWxlKDYsIDYpLmlzQ2FzdGxlID0gdHJ1ZTtcbiAgICAgICAgZ2V0TXV0YWJsZVRpbGUoNiwgNikuaXNQYXRoID0gZmFsc2U7XG4gICAgICAgIGdldE11dGFibGVUaWxlKDYsIDYpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuXG4gICAgICAgIC8vIFBsYWNlIGdvbGQgbWluZSB0aWxlc1xuICAgICAgICBmb3IgKGxldCB4ID0gMTU7IHggPD0gMTY7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9ICh0aGlzLm1hcEhlaWdodCAtIDE2KTsgeSA8PSAodGhpcy5tYXBIZWlnaHQgLSAxNSk7IHkrKykge1xuICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHgsIHkpLmlzR29sZE1pbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IFdvcmtlciBTcGF3blxuICAgICAgICBnZXRNdXRhYmxlVGlsZSg4LCA5KS5pc1dvcmtlclNwYXduID0gdHJ1ZTtcbiAgICAgICAgZ2V0TXV0YWJsZVRpbGUoOCwgOSkub3duZXIgPSB0aGlzLnBsYXllcnNbMF07XG4gICAgICAgIC8vIFNldCBVbml0IFNwYXduXG4gICAgICAgIGdldE11dGFibGVUaWxlKDE1LCA2KS5pc1VuaXRTcGF3biA9IHRydWU7XG4gICAgICAgIGdldE11dGFibGVUaWxlKDE1LCA2KS5pc0dyYXNzID0gZmFsc2U7XG4gICAgICAgIGdldE11dGFibGVUaWxlKDExLCA2KS5vd25lciA9IHRoaXMucGxheWVyc1swXTtcblxuICAgICAgICAvLyBNaXJyb3IgdGhlIGdlbmVyYXRlZCBtYXAgZm9yIHRoZSBvdGhlciBzaWRlLCBib3RoIG1pcnJvcmluZyB4IGFuZCB5IHNvIGl0IGZsaXBzIGRpYWdub2xseVxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMubWFwV2lkdGggLyAyOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5tYXBIZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmdldFRpbGUodGhpcy5tYXBXaWR0aCAtIHggLSAxLCB0aGlzLm1hcEhlaWdodCAtIHkgLSAxKTtcbiAgICAgICAgICAgICAgICBpZiAodGlsZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbMV0uc2lkZS5wdXNoKHRpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBHcmFzc1xuICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0dyYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKCh0aGlzLm1hcFdpZHRoIC0geCAtIDEpLCAodGhpcy5tYXBIZWlnaHQgLSB5IC0gMSkpLmlzR3Jhc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBQYXRoc1xuICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1BhdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSB4IC0gMSksICh0aGlzLm1hcEhlaWdodCAtIHkgLSAxKSkuaXNQYXRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gR29sZCBNaW5lc1xuICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0dvbGRNaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKCh0aGlzLm1hcFdpZHRoIC0geCAtIDEpLCAodGhpcy5tYXBIZWlnaHQgLSB5IC0gMSkpLmlzR29sZE1pbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXN0bGVcbiAgICAgICAgICAgICAgICBpZiAoZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNDYXN0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoKHRoaXMubWFwV2lkdGggLSB4IC0gMSksICh0aGlzLm1hcEhlaWdodCAtIHkgLSAxKSkuaXNDYXN0bGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXb3JrZXIgU3Bhd25cbiAgICAgICAgICAgICAgICBpZiAoZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNXb3JrZXJTcGF3bikge1xuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSgodGhpcy5tYXBXaWR0aCAtIHggLSAxKSwgKHRoaXMubWFwSGVpZ2h0IC0geSAtIDEpKS5pc1dvcmtlclNwYXduID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVW5pdCBTcGF3blxuICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1VuaXRTcGF3bikge1xuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSgodGhpcy5tYXBXaWR0aCAtIHggLSAxKSwgKHRoaXMubWFwSGVpZ2h0IC0geSAtIDEpKS5pc1VuaXRTcGF3biA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgSXNsYW5kXG4gICAgICAgIC8vIE1ha2UgYSBTcXVhcmUgb2Ygcml2ZXIgaW4gdGhlIGNlbnRlciBvZiB0aGUgbWFwLCB0aGUgXCJsYWtlXCJcbiAgICAgICAgZm9yIChsZXQgeCA9ICh0aGlzLm1hcFdpZHRoIC8gMiAtIDIuNSk7IHggPD0gKHRoaXMubWFwV2lkdGggLyAyICsgMS41KTsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gKHRoaXMubWFwSGVpZ2h0IC8gMiAtIDIpOyB5IDw9ICh0aGlzLm1hcEhlaWdodCAvIDIgKyAyKTsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNSaXZlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNHcmFzcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE1ha2UgYSBzbWFsbGVyIHNxdWFyZSBvZiBncmFzcyB3aXRoaW4gdGhlIFwibGFrZVwiXG4gICAgICAgIGZvciAobGV0IHggPSAodGhpcy5tYXBXaWR0aCAvIDIgLSAxLjUpOyB4IDw9ICh0aGlzLm1hcFdpZHRoIC8gMiArIDAuNSk7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9ICh0aGlzLm1hcEhlaWdodCAvIDIgLSAxKTsgeSA8ICh0aGlzLm1hcEhlaWdodCAvIDIgKyAyKTsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNHcmFzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNSaXZlciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFBhdGhzIGxlYWRpbmcgdG8gaXNsYW5kXG4gICAgICAgIGdldE11dGFibGVUaWxlKHRoaXMubWFwV2lkdGggLyAyIC0gMi41LCB0aGlzLm1hcEhlaWdodCAvIDIpLmlzR3Jhc3MgPSB0cnVlO1xuICAgICAgICBnZXRNdXRhYmxlVGlsZSh0aGlzLm1hcFdpZHRoIC8gMiAtIDIuNSwgdGhpcy5tYXBIZWlnaHQgLyAyKS5pc1JpdmVyID0gZmFsc2U7XG4gICAgICAgIGdldE11dGFibGVUaWxlKHRoaXMubWFwV2lkdGggLyAyICsgMS41LCB0aGlzLm1hcEhlaWdodCAvIDIpLmlzR3Jhc3MgPSB0cnVlO1xuICAgICAgICBnZXRNdXRhYmxlVGlsZSh0aGlzLm1hcFdpZHRoIC8gMiArIDEuNSwgdGhpcy5tYXBIZWlnaHQgLyAyKS5pc1JpdmVyID0gZmFsc2U7XG5cbiAgICAgICAgLy8gTWFrZSBpc2xhbmQgbWluZSB0aWxlcyBvbiB0aGUgbWlkZGxlIHRocmVlIHRpbGVzXG4gICAgICAgIGZvciAobGV0IHggPSAodGhpcy5tYXBXaWR0aCAvIDIgLSAwLjUpOyB4IDw9ICh0aGlzLm1hcFdpZHRoIC8gMiAtIDAuNSk7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9ICh0aGlzLm1hcEhlaWdodCAvIDIgLSAxKTsgeSA8ICh0aGlzLm1hcEhlaWdodCAvIDIgKyAyKTsgeSsrKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNJc2xhbmRHb2xkTWluZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBc3NpZ24gb3duZXJzaGlwIHRvIHNpZGVzXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgKHRoaXMubWFwV2lkdGggLyAyIC0gMC41KTsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwSGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNHcmFzcyB8fCBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0dvbGRNaW5lIHx8IGdldE11dGFibGVUaWxlKHgsIHkpLmlzQ2FzdGxlIHx8XG4gICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNXb3JrZXJTcGF3biB8fCBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1VuaXRTcGF3bikge1xuICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5vd25lciA9IHRoaXMucGxheWVyc1swXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeCA9ICh0aGlzLm1hcFdpZHRoIC8gMiArIDAuNSk7IHggPCB0aGlzLm1hcFdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5tYXBIZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0dyYXNzIHx8IGdldE11dGFibGVUaWxlKHgsIHkpLmlzR29sZE1pbmUgfHwgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNDYXN0bGUgfHxcbiAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc1dvcmtlclNwYXduIHx8IGdldE11dGFibGVUaWxlKHgsIHkpLmlzVW5pdFNwYXduKSB7XG4gICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHgsIHkpLm93bmVyID0gdGhpcy5wbGF5ZXJzWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZXMgdGhlIGNhc3RsZXMgb24gZWl0aGVyIHNpZGVcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLm1hcFdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5tYXBIZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5pc0Nhc3RsZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIHBsYXllciAwJ3MgY2FzdGxlXG4gICAgICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5vd25lciA9PT0gdGhpcy5wbGF5ZXJzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZXRNdXRhYmxlVGlsZSh4LCB5KS50b3dlciA9IHRoaXMubWFuYWdlci5jcmVhdGUudG93ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLnBsYXllcnNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZTogdGhpcy5nZXRUaWxlKHgsIHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpvYjogdGhpcy50b3dlckpvYnNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhbHRoOiB0aGlzLnRvd2VySm9ic1swXS5oZWFsdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB0aGlzLmdldFRpbGUoeCwgeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGlsZSAmJiB0aWxlLnRvd2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3dlcnMucHVzaCh0aWxlLnRvd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbMF0udG93ZXJzLnB1c2godGlsZS50b3dlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNUb3dlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNDYXN0bGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGdldE11dGFibGVUaWxlKHgsIHkpLm93bmVyID09PSB0aGlzLnBsYXllcnNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0J3MgcGxheWVyIDEncyBjYXN0bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChnZXRNdXRhYmxlVGlsZSh4LCB5KS5vd25lciA9PT0gdGhpcy5wbGF5ZXJzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkudG93ZXIgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLnRvd2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IHRoaXMucGxheWVyc1sxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZTogdGhpcy5nZXRUaWxlKHgsIHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBqb2I6IHRoaXMudG93ZXJKb2JzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFsdGg6IHRoaXMudG93ZXJKb2JzWzBdLmhlYWx0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuZ2V0VGlsZSh4LCB5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGlsZSAmJiB0aWxlLnRvd2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudG93ZXJzLnB1c2godGlsZS50b3dlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWVyc1sxXS50b3dlcnMucHVzaCh0aWxlLnRvd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TXV0YWJsZVRpbGUoeCwgeSkuaXNUb3dlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE11dGFibGVUaWxlKHgsIHkpLmlzQ2FzdGxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==