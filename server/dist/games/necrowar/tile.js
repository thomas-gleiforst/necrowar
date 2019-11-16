"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiled_1 = require("~/core/game/mixins/tiled");
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A Tile in the game that makes up the 2D map grid.
 */
class Tile extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Tile is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
    // never directly created by game developers
    args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for res. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param num - Number of zombies to resurrect.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateRes(player, num) {
        // <<-- Creer-Merge: invalidate-res -->>
        // Player invalidation
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        // Ensure tile exists
        if (!this) {
            return `This tile does not exist!`;
        }
        // Ensure number isn't too large
        if (this.corpses < num) {
            return `${this} doesn't have ${num} corpses, it only has ${this.corpses}!`;
        }
        // Ensure num is positive
        if (num <= 0) {
            return `Why are you trying to resurrect ${num} corpses?!`;
        }
        // Ensure the player has enough mana
        const cost = num * this.game.unitJobs[1].manaCost;
        if (this.game.currentPlayer.mana < cost) {
            return `You do not have enough mana to resurrect ${num} corpses!`;
        }
        let spawnTile;
        for (const tile of this.game.tiles) {
            if (tile.owner === player && tile.isUnitSpawn) {
                spawnTile = tile;
            }
        }
        if (!spawnTile) {
            return `You do not have a unit spawn tile. This is probably a bug.`;
        }
        // Ensure there isn't another unit currently on this tile
        const unitCount = Math.max(this.numGhouls, this.numHounds);
        if (unitCount > 0 || (this.unit !== undefined && this.unit.job.title !== "zombie")) {
            return `Your unit spawn tile is already occupied by another unit!`;
        }
        // Ensure there wouldn't be too many zombies
        if (spawnTile.numZombies + num > this.game.unitJobs[1].perTile) {
            return `Your spawn tile cannot fit an additional ${num} zombies!`;
        }
        // <<-- /Creer-Merge: invalidate-res -->>
    }
    /**
     * Resurrect the corpses on this tile into Zombies.
     *
     * @param player - The player that called this.
     * @param num - Number of zombies to resurrect.
     * @returns True if successful res, false otherwise.
     */
    async res(player, num) {
        // <<-- Creer-Merge: res -->>
        // Reduce player mana
        this.game.currentPlayer.mana -= (num * this.game.unitJobs[1].manaCost);
        // Find spawn tile
        let spawnTile;
        for (const tile of this.game.tiles) {
            if (tile.owner === player && tile.isUnitSpawn) {
                spawnTile = tile;
            }
        }
        if (!spawnTile) {
            throw new Error(`${player} has no spawn unit tile!`);
        }
        // Create stack of zombies
        let unit;
        for (let i = 0; i < num; i++) {
            unit = this.manager.create.unit({
                acted: false,
                health: this.game.unitJobs[1].health,
                owner: this.game.currentPlayer,
                tile: spawnTile,
                job: this.game.unitJobs[1],
                moves: this.game.unitJobs[1].moves,
            });
            if (!spawnTile.unit) {
                spawnTile.unit = unit;
            }
            this.game.units.push(unit);
            player.units.push(unit);
        }
        // Add zombies to the spawn tile
        spawnTile.numZombies += num;
        // Remove corpses from tile
        this.corpses -= num;
        return true;
        // <<-- /Creer-Merge: res -->>
    }
    /**
     * Invalidation function for spawnUnit. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param title - The title of the desired unit type.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSpawnUnit(player, title) {
        // <<-- Creer-Merge: invalidate-spawnUnit -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        let unitIndex = -1;
        if (title === "ghoul") {
            unitIndex = 2;
        }
        else if (title === "abomination") {
            unitIndex = 3;
        }
        else if (title === "hound") {
            unitIndex = 4;
        }
        else if (title === "wraith") {
            unitIndex = 5;
        }
        else if (title === "horseman") {
            unitIndex = 6;
        }
        if (unitIndex === -1) {
            return `Invalid unit type!`;
        }
        if (player.gold < this.game.unitJobs[unitIndex].goldCost
            || player.mana < this.game.unitJobs[unitIndex].manaCost) {
            return `You cannot afford to spawn this unit.`;
        }
        if (!this) {
            return `This tile does not exist!`;
        }
        if (!this.isUnitSpawn) {
            return `This tile cannot spawn units!`;
        }
        if (this.unit) {
            if (this.unit.job.title === "zombie"
                || this.unit.job.title === "horseman"
                || this.unit.job.title === "abomination"
                || this.unit.job.title === "wraith"
                || this.unit.job.title !== title) {
                return `You cannot fit another unit on this tile!`;
            }
            if (this.unit.job.title === "ghoul" && this.numGhouls >= this.game.unitJobs[2].perTile) {
                return `The maximum number of ghouls are already on this tile!`;
            }
            if (this.unit.job.title === "hound" && this.numHounds >= this.game.unitJobs[4].perTile) {
                return `The maximum number of hounds are already on this tile!`;
            }
        }
        // <<-- /Creer-Merge: invalidate-spawnUnit -->>
    }
    /**
     * Spawns a fighting unit on the correct tile.
     *
     * @param player - The player that called this.
     * @param title - The title of the desired unit type.
     * @returns True if successfully spawned, false otherwise.
     */
    async spawnUnit(player, title) {
        // <<-- Creer-Merge: spawnUnit -->>
        let unitIndex = -1;
        if (title === "ghoul") {
            unitIndex = 2;
        }
        else if (title === "abomination") {
            unitIndex = 3;
        }
        else if (title === "hound") {
            unitIndex = 4;
        }
        else if (title === "wraith") {
            unitIndex = 5;
        }
        else if (title === "horseman") {
            unitIndex = 6;
        }
        const goldCost = this.game.unitJobs[unitIndex].goldCost;
        const manaCost = this.game.unitJobs[unitIndex].manaCost;
        player.gold -= goldCost;
        player.mana -= manaCost;
        const unit = this.game.manager.create.unit({
            acted: false,
            health: this.game.unitJobs[unitIndex].health,
            owner: player,
            tile: this,
            job: this.game.unitJobs[unitIndex],
            title,
            moves: this.game.unitJobs[unitIndex].moves,
        });
        this.game.units.push(unit);
        player.units.push(unit);
        if (this.unit) {
            if (this.numGhouls !== 0) {
                this.numGhouls += 1;
            }
            else {
                this.numHounds += 1;
            }
        }
        else {
            this.unit = unit;
            if (title === "hound") {
                this.numHounds = 1;
            }
            else if (title === "ghoul") {
                this.numGhouls = 1;
            }
        }
        return true;
        // <<-- /Creer-Merge: spawnUnit -->>
    }
    /**
     * Invalidation function for spawnWorker. Try to find a reason why the
     * passed in parameters are invalid, and return a human readable string
     * telling them why it is invalid.
     *
     * @param player - The player that called this.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSpawnWorker(player) {
        // <<-- Creer-Merge: invalidate-spawnWorker -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (player.gold < this.game.unitJobs[0].goldCost
            || player.mana < this.game.unitJobs[0].manaCost) {
            return `You cannot afford to spawn a worker.`;
        }
        if (!this) {
            return `This tile does not exist!`;
        }
        if (!this.isWorkerSpawn) {
            return `This tile cannot spawn workers!`;
        }
        if (this.unit) {
            return `You cannot fit another worker on this tile!`;
        }
        // <<-- /Creer-Merge: invalidate-spawnWorker -->>
    }
    /**
     * Spawns a worker on the correct tile.
     *
     * @param player - The player that called this.
     * @returns True if successfully spawned, false otherwise.
     */
    async spawnWorker(player) {
        // <<-- Creer-Merge: spawnWorker -->>
        const goldCost = this.game.unitJobs[0].goldCost;
        const manaCost = this.game.unitJobs[0].manaCost;
        player.gold -= goldCost;
        player.mana -= manaCost;
        const unit = this.game.manager.create.unit({
            acted: false,
            health: this.game.unitJobs[0].health,
            owner: player,
            tile: this,
            job: this.game.unitJobs[0],
            title: "worker",
            moves: this.game.unitJobs[0].moves,
        });
        this.unit = unit;
        this.game.units.push(unit);
        player.units.push(unit);
        return true;
        // <<-- /Creer-Merge: spawnWorker -->>
    }
    /**
     * Gets the adjacent direction between this Tile and an adjacent Tile
     * (if one exists).
     *
     * @param adjacentTile - A tile that should be adjacent to this Tile.
     * @returns "North", "East", "South", or "West" if the tile is adjacent to
     * this Tile in that direction. Otherwise undefined.
     */
    getAdjacentDirection(adjacentTile) {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.getAdjacentDirection.call(this, adjacentTile);
    }
    /**
     * Gets a list of all the neighbors of this Tile.
     *
     * @returns An array of all adjacent tiles. Should be between 2 to 4 tiles.
     */
    getNeighbors() {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.getNeighbors.call(this);
    }
    /**
     * Gets a neighbor in a particular direction
     *
     * @param direction - The direction you want, must be
     * "North", "East", "South", or "West".
     * @returns The Tile in that direction, or undefined if there is none.
     */
    getNeighbor(direction) {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.getNeighbor.call(this, direction);
    }
    /**
     * Checks if a Tile has another Tile as its neighbor.
     *
     * @param tile - The Tile to check.
     * @returns True if neighbor, false otherwise.
     */
    hasNeighbor(tile) {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.hasNeighbor.call(this, tile);
    }
    /**
     * toString override.
     *
     * @returns A string representation of the Tile.
     */
    toString() {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.toString.call(this);
    }
}
exports.Tile = Tile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZWNyb3dhci90aWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0RBQW9EO0FBR3BELCtDQUEyQztBQUszQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsSUFBSyxTQUFRLHdCQUFVO0lBMkhoQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0g7SUFDSSw0Q0FBNEM7SUFDNUMsSUFBK0IsRUFDL0IsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQzs7Ozs7Ozs7OztPQVVHO0lBQ08sYUFBYSxDQUNuQixNQUFjLEVBQ2QsR0FBVztRQUVYLHdDQUF3QztRQUV4QyxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDL0MsT0FBTyx1QkFBdUIsTUFBTSxHQUFHLENBQUM7U0FDM0M7UUFFRCxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sMkJBQTJCLENBQUM7U0FDdEM7UUFFRCxnQ0FBZ0M7UUFDaEMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNwQixPQUFPLEdBQUcsSUFBSSxpQkFBaUIsR0FBRyx5QkFBeUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDO1NBQzlFO1FBRUQseUJBQXlCO1FBQ3pCLElBQUksR0FBRyxJ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QUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FPSjtBQXBqQkQsb0JBb2pCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZVRpbGUgfSBmcm9tIFwifi9jb3JlL2dhbWUvbWl4aW5zL3RpbGVkXCI7XG5pbXBvcnQgeyBJVGlsZVByb3BlcnRpZXMsIElUaWxlUmVzQXJncywgSVRpbGVTcGF3blVuaXRBcmdzLFxuICAgICAgICAgSVRpbGVTcGF3bldvcmtlckFyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBUb3dlciB9IGZyb20gXCIuL3Rvd2VyXCI7XG5pbXBvcnQgeyBVbml0IH0gZnJvbSBcIi4vdW5pdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIFRpbGUgaW4gdGhlIGdhbWUgdGhhdCBtYWtlcyB1cCB0aGUgMkQgbWFwIGdyaWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlIGV4dGVuZHMgR2FtZU9iamVjdCBpbXBsZW1lbnRzIEJhc2VUaWxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGNvcnBzZXMgb24gdGhpcyB0aWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyBjb3Jwc2VzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgaXMgYSBjYXN0bGUgdGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNDYXN0bGUhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgaXMgY29uc2lkZXJlZCB0byBiZSBhIGdvbGQgbWluZSBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIGlzR29sZE1pbmUhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgaXMgY29uc2lkZXJlZCBncmFzcyBvciBub3QgKFdvcmtlcnMgY2FuIHdhbGsgb25cbiAgICAgKiBncmFzcykuXG4gICAgICovXG4gICAgcHVibGljIGlzR3Jhc3MhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgaXNsYW5kIGdvbGQgbWluZSBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIGlzSXNsYW5kR29sZE1pbmUhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgaXMgY29uc2lkZXJlZCBhIHBhdGggb3Igbm90IChVbml0cyBjYW4gd2FsayBvblxuICAgICAqIHBhdGhzKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNQYXRoITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoZSB0aWxlIGlzIGNvbnNpZGVyZWQgYSByaXZlciBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIGlzUml2ZXIhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgaXMgY29uc2lkZXJlZCBhIHRvd2VyIG9yIG5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNUb3dlciE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdGlsZSBpcyB0aGUgdW5pdCBzcGF3bi5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNVbml0U3Bhd24hOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciBvciBub3QgdGhlIHRpbGUgY2FuIGJlIG1vdmVkIG9uIGJ5IHdvcmtlcnMuXG4gICAgICovXG4gICAgcHVibGljIGlzV2FsbCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGUgdGlsZSBpcyB0aGUgd29ya2VyIHNwYXduLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1dvcmtlclNwYXduITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgR2hvdWxzIG9uIHRoaXMgdGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgbnVtR2hvdWxzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBIb3VuZHMgb24gdGhpcyB0aWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyBudW1Ib3VuZHMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIFpvbWJpZXMgb24gdGhpcyB0aWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyBudW1ab21iaWVzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogV2hpY2ggcGxheWVyIG93bnMgdGhpcyB0aWxlLCBvbmx5IGFwcGxpZXMgdG8gZ3Jhc3MgdGlsZXMgZm9yIHdvcmtlcnMsXG4gICAgICogTlVMTCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIG93bmVyPzogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdFYXN0JyBvZiB0aGlzIG9uZSAoeCsxLCB5KS4gVW5kZWZpbmVkIGlmIG91dCBvZiBib3VuZHNcbiAgICAgKiBvZiB0aGUgbWFwLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlRWFzdD86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0byB0aGUgJ05vcnRoJyBvZiB0aGlzIG9uZSAoeCwgeS0xKS4gVW5kZWZpbmVkIGlmIG91dCBvZiBib3VuZHNcbiAgICAgKiBvZiB0aGUgbWFwLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlTm9ydGg/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdTb3V0aCcgb2YgdGhpcyBvbmUgKHgsIHkrMSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVNvdXRoPzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnV2VzdCcgb2YgdGhpcyBvbmUgKHgtMSwgeSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVdlc3Q/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRvd2VyIG9uIHRoaXMgVGlsZSBpZiBwcmVzZW50LCBvdGhlcndpc2UgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b3dlcj86IFRvd2VyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFVuaXQgb24gdGhpcyBUaWxlIGlmIHByZXNlbnQsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gICAgICovXG4gICAgcHVibGljIHVuaXQ/OiBVbml0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIHggKGhvcml6b250YWwpIHBvc2l0aW9uIG9mIHRoaXMgVGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgeCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSB5ICh2ZXJ0aWNhbCkgcG9zaXRpb24gb2YgdGhpcyBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB5ITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgVGlsZSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAvLyBuZXZlciBkaXJlY3RseSBjcmVhdGVkIGJ5IGdhbWUgZGV2ZWxvcGVyc1xuICAgICAgICBhcmdzOiBSZWFkb25seTxJVGlsZVByb3BlcnRpZXM+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgcmVzLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBudW0gLSBOdW1iZXIgb2Ygem9tYmllcyB0byByZXN1cnJlY3QuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlUmVzKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgbnVtOiBudW1iZXIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElUaWxlUmVzQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmVzIC0tPj5cblxuICAgICAgICAvLyBQbGF5ZXIgaW52YWxpZGF0aW9uXG4gICAgICAgIGlmICghcGxheWVyIHx8IHBsYXllciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgSXQgaXNuJ3QgeW91ciB0dXJuLCAke3BsYXllcn0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aWxlIGV4aXN0c1xuICAgICAgICBpZiAoIXRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhpcyB0aWxlIGRvZXMgbm90IGV4aXN0IWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbnN1cmUgbnVtYmVyIGlzbid0IHRvbyBsYXJnZVxuICAgICAgICBpZiAodGhpcy5jb3Jwc2VzIDwgbnVtKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gZG9lc24ndCBoYXZlICR7bnVtfSBjb3Jwc2VzLCBpdCBvbmx5IGhhcyAke3RoaXMuY29ycHNlc30hYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSBudW0gaXMgcG9zaXRpdmVcbiAgICAgICAgaWYgKG51bSA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYFdoeSBhcmUgeW91IHRyeWluZyB0byByZXN1cnJlY3QgJHtudW19IGNvcnBzZXM/IWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbnN1cmUgdGhlIHBsYXllciBoYXMgZW5vdWdoIG1hbmFcbiAgICAgICAgY29uc3QgY29zdCA9IG51bSAqIHRoaXMuZ2FtZS51bml0Sm9ic1sxXS5tYW5hQ29zdDtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLm1hbmEgPCBjb3N0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBkbyBub3QgaGF2ZSBlbm91Z2ggbWFuYSB0byByZXN1cnJlY3QgJHtudW19IGNvcnBzZXMhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGF3blRpbGU7XG4gICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiB0aGlzLmdhbWUudGlsZXMpIHtcbiAgICAgICAgICAgIGlmICh0aWxlLm93bmVyID09PSBwbGF5ZXIgJiYgdGlsZS5pc1VuaXRTcGF3bikge1xuICAgICAgICAgICAgICAgIHNwYXduVGlsZSA9IHRpbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNwYXduVGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgZG8gbm90IGhhdmUgYSB1bml0IHNwYXduIHRpbGUuIFRoaXMgaXMgcHJvYmFibHkgYSBidWcuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGVyZSBpc24ndCBhbm90aGVyIHVuaXQgY3VycmVudGx5IG9uIHRoaXMgdGlsZVxuICAgICAgICBjb25zdCB1bml0Q291bnQgPSBNYXRoLm1heCh0aGlzLm51bUdob3VscywgdGhpcy5udW1Ib3VuZHMpO1xuICAgICAgICBpZiAodW5pdENvdW50ID4gMCB8fCAodGhpcy51bml0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy51bml0LmpvYi50aXRsZSAhPT0gXCJ6b21iaWVcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBgWW91ciB1bml0IHNwYXduIHRpbGUgaXMgYWxyZWFkeSBvY2N1cGllZCBieSBhbm90aGVyIHVuaXQhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuc3VyZSB0aGVyZSB3b3VsZG4ndCBiZSB0b28gbWFueSB6b21iaWVzXG4gICAgICAgIGlmIChzcGF3blRpbGUubnVtWm9tYmllcyArIG51bSA+IHRoaXMuZ2FtZS51bml0Sm9ic1sxXS5wZXJUaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdXIgc3Bhd24gdGlsZSBjYW5ub3QgZml0IGFuIGFkZGl0aW9uYWwgJHtudW19IHpvbWJpZXMhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXJlcyAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzdXJyZWN0IHRoZSBjb3Jwc2VzIG9uIHRoaXMgdGlsZSBpbnRvIFpvbWJpZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBudW0gLSBOdW1iZXIgb2Ygem9tYmllcyB0byByZXN1cnJlY3QuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsIHJlcywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyByZXMocGxheWVyOiBQbGF5ZXIsIG51bTogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHJlcyAtLT4+XG5cbiAgICAgICAgLy8gUmVkdWNlIHBsYXllciBtYW5hXG4gICAgICAgIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLm1hbmEgLT0gKG51bSAqIHRoaXMuZ2FtZS51bml0Sm9ic1sxXS5tYW5hQ29zdCk7XG5cbiAgICAgICAgLy8gRmluZCBzcGF3biB0aWxlXG4gICAgICAgIGxldCBzcGF3blRpbGU7XG4gICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiB0aGlzLmdhbWUudGlsZXMpIHtcbiAgICAgICAgICAgIGlmICh0aWxlLm93bmVyID09PSBwbGF5ZXIgJiYgdGlsZS5pc1VuaXRTcGF3bikge1xuICAgICAgICAgICAgICAgIHNwYXduVGlsZSA9IHRpbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNwYXduVGlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3BsYXllcn0gaGFzIG5vIHNwYXduIHVuaXQgdGlsZSFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBzdGFjayBvZiB6b21iaWVzXG4gICAgICAgIGxldCB1bml0O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgICAgICB1bml0ID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICBhY3RlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGVhbHRoOiB0aGlzLmdhbWUudW5pdEpvYnNbMV0uaGVhbHRoLFxuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLmdhbWUuY3VycmVudFBsYXllcixcbiAgICAgICAgICAgICAgICB0aWxlOiBzcGF3blRpbGUsXG4gICAgICAgICAgICAgICAgam9iOiB0aGlzLmdhbWUudW5pdEpvYnNbMV0sXG4gICAgICAgICAgICAgICAgbW92ZXM6IHRoaXMuZ2FtZS51bml0Sm9ic1sxXS5tb3ZlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFzcGF3blRpbGUudW5pdCkge1xuICAgICAgICAgICAgICAgIHNwYXduVGlsZS51bml0ID0gdW5pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2FtZS51bml0cy5wdXNoKHVuaXQpO1xuICAgICAgICAgICAgcGxheWVyLnVuaXRzLnB1c2godW5pdCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgem9tYmllcyB0byB0aGUgc3Bhd24gdGlsZVxuICAgICAgICBzcGF3blRpbGUubnVtWm9tYmllcyArPSBudW07XG5cbiAgICAgICAgLy8gUmVtb3ZlIGNvcnBzZXMgZnJvbSB0aWxlXG4gICAgICAgIHRoaXMuY29ycHNlcyAtPSBudW07XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJlcyAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBzcGF3blVuaXQuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkXG4gICAgICogaW4gcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nXG4gICAgICogdGhlbSB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpdGxlIC0gVGhlIHRpdGxlIG9mIHRoZSBkZXNpcmVkIHVuaXQgdHlwZS5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVTcGF3blVuaXQoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aXRsZTogc3RyaW5nLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVGlsZVNwYXduVW5pdEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNwYXduVW5pdCAtLT4+XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgcGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBJdCBpc24ndCB5b3VyIHR1cm4sICR7cGxheWVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHVuaXRJbmRleCA9IC0xO1xuXG4gICAgICAgIGlmICh0aXRsZSA9PT0gXCJnaG91bFwiKSB7XG4gICAgICAgICAgICB1bml0SW5kZXggPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpdGxlID09PSBcImFib21pbmF0aW9uXCIpIHtcbiAgICAgICAgICAgIHVuaXRJbmRleCA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGl0bGUgPT09IFwiaG91bmRcIikge1xuICAgICAgICAgICAgdW5pdEluZGV4ID0gNDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJ3cmFpdGhcIikge1xuICAgICAgICAgICAgdW5pdEluZGV4ID0gNTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJob3JzZW1hblwiKSB7XG4gICAgICAgICAgICB1bml0SW5kZXggPSA2O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHVuaXRJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBgSW52YWxpZCB1bml0IHR5cGUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIuZ29sZCA8IHRoaXMuZ2FtZS51bml0Sm9ic1t1bml0SW5kZXhdLmdvbGRDb3N0XG4gICAgICAgICAgICB8fCBwbGF5ZXIubWFuYSA8IHRoaXMuZ2FtZS51bml0Sm9ic1t1bml0SW5kZXhdLm1hbmFDb3N0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBjYW5ub3QgYWZmb3JkIHRvIHNwYXduIHRoaXMgdW5pdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoaXMgdGlsZSBkb2VzIG5vdCBleGlzdCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzVW5pdFNwYXduKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoaXMgdGlsZSBjYW5ub3Qgc3Bhd24gdW5pdHMhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnVuaXQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnVuaXQuam9iLnRpdGxlID09PSBcInpvbWJpZVwiXG4gICAgICAgICAgICAgICAgfHwgdGhpcy51bml0LmpvYi50aXRsZSA9PT0gXCJob3JzZW1hblwiXG4gICAgICAgICAgICAgICAgfHwgdGhpcy51bml0LmpvYi50aXRsZSA9PT0gXCJhYm9taW5hdGlvblwiXG4gICAgICAgICAgICAgICAgfHwgdGhpcy51bml0LmpvYi50aXRsZSA9PT0gXCJ3cmFpdGhcIlxuICAgICAgICAgICAgICAgIHx8IHRoaXMudW5pdC5qb2IudGl0bGUgIT09IHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBZb3UgY2Fubm90IGZpdCBhbm90aGVyIHVuaXQgb24gdGhpcyB0aWxlIWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnVuaXQuam9iLnRpdGxlID09PSBcImdob3VsXCIgJiYgdGhpcy5udW1HaG91bHMgPj0gdGhpcy5nYW1lLnVuaXRKb2JzWzJdLnBlclRpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYFRoZSBtYXhpbXVtIG51bWJlciBvZiBnaG91bHMgYXJlIGFscmVhZHkgb24gdGhpcyB0aWxlIWA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnVuaXQuam9iLnRpdGxlID09PSBcImhvdW5kXCIgJiYgdGhpcy5udW1Ib3VuZHMgPj0gdGhpcy5nYW1lLnVuaXRKb2JzWzRdLnBlclRpbGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYFRoZSBtYXhpbXVtIG51bWJlciBvZiBob3VuZHMgYXJlIGFscmVhZHkgb24gdGhpcyB0aWxlIWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGF3blVuaXQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwYXducyBhIGZpZ2h0aW5nIHVuaXQgb24gdGhlIGNvcnJlY3QgdGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpdGxlIC0gVGhlIHRpdGxlIG9mIHRoZSBkZXNpcmVkIHVuaXQgdHlwZS5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBzcGF3bmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHNwYXduVW5pdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNwYXduVW5pdCAtLT4+XG5cbiAgICAgICAgbGV0IHVuaXRJbmRleCA9IC0xO1xuXG4gICAgICAgIGlmICh0aXRsZSA9PT0gXCJnaG91bFwiKSB7XG4gICAgICAgICAgICB1bml0SW5kZXggPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpdGxlID09PSBcImFib21pbmF0aW9uXCIpIHtcbiAgICAgICAgICAgIHVuaXRJbmRleCA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGl0bGUgPT09IFwiaG91bmRcIikge1xuICAgICAgICAgICAgdW5pdEluZGV4ID0gNDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJ3cmFpdGhcIikge1xuICAgICAgICAgICAgdW5pdEluZGV4ID0gNTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJob3JzZW1hblwiKSB7XG4gICAgICAgICAgICB1bml0SW5kZXggPSA2O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ29sZENvc3QgPSB0aGlzLmdhbWUudW5pdEpvYnNbdW5pdEluZGV4XS5nb2xkQ29zdDtcbiAgICAgICAgY29uc3QgbWFuYUNvc3QgPSB0aGlzLmdhbWUudW5pdEpvYnNbdW5pdEluZGV4XS5tYW5hQ29zdDtcblxuICAgICAgICBwbGF5ZXIuZ29sZCAtPSBnb2xkQ29zdDtcbiAgICAgICAgcGxheWVyLm1hbmEgLT0gbWFuYUNvc3Q7XG5cbiAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuZ2FtZS5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgIGFjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIGhlYWx0aDogdGhpcy5nYW1lLnVuaXRKb2JzW3VuaXRJbmRleF0uaGVhbHRoLFxuICAgICAgICAgICAgb3duZXI6IHBsYXllcixcbiAgICAgICAgICAgIHRpbGU6IHRoaXMsXG4gICAgICAgICAgICBqb2I6IHRoaXMuZ2FtZS51bml0Sm9ic1t1bml0SW5kZXhdLFxuICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICBtb3ZlczogdGhpcy5nYW1lLnVuaXRKb2JzW3VuaXRJbmRleF0ubW92ZXMsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmdhbWUudW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgcGxheWVyLnVuaXRzLnB1c2godW5pdCk7XG5cbiAgICAgICAgaWYgKHRoaXMudW5pdCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubnVtR2hvdWxzICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1HaG91bHMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubnVtSG91bmRzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVuaXQgPSB1bml0O1xuICAgICAgICAgICAgaWYgKHRpdGxlID09PSBcImhvdW5kXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm51bUhvdW5kcyA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJnaG91bFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1HaG91bHMgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNwYXduVW5pdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBzcGF3bldvcmtlci4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZVxuICAgICAqIHBhc3NlZCBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nXG4gICAgICogdGVsbGluZyB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVTcGF3bldvcmtlcihcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElUaWxlU3Bhd25Xb3JrZXJBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGF3bldvcmtlciAtLT4+XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgcGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBJdCBpc24ndCB5b3VyIHR1cm4sICR7cGxheWVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsYXllci5nb2xkIDwgdGhpcy5nYW1lLnVuaXRKb2JzWzBdLmdvbGRDb3N0XG4gICAgICAgICAgICB8fCBwbGF5ZXIubWFuYSA8IHRoaXMuZ2FtZS51bml0Sm9ic1swXS5tYW5hQ29zdCkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgY2Fubm90IGFmZm9yZCB0byBzcGF3biBhIHdvcmtlci5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoaXMgdGlsZSBkb2VzIG5vdCBleGlzdCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzV29ya2VyU3Bhd24pIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhpcyB0aWxlIGNhbm5vdCBzcGF3biB3b3JrZXJzIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51bml0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBjYW5ub3QgZml0IGFub3RoZXIgd29ya2VyIG9uIHRoaXMgdGlsZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtc3Bhd25Xb3JrZXIgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNwYXducyBhIHdvcmtlciBvbiB0aGUgY29ycmVjdCB0aWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBzcGF3bmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHNwYXduV29ya2VyKHBsYXllcjogUGxheWVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNwYXduV29ya2VyIC0tPj5cblxuICAgICAgICBjb25zdCBnb2xkQ29zdCA9IHRoaXMuZ2FtZS51bml0Sm9ic1swXS5nb2xkQ29zdDtcbiAgICAgICAgY29uc3QgbWFuYUNvc3QgPSB0aGlzLmdhbWUudW5pdEpvYnNbMF0ubWFuYUNvc3Q7XG5cbiAgICAgICAgcGxheWVyLmdvbGQgLT0gZ29sZENvc3Q7XG4gICAgICAgIHBsYXllci5tYW5hIC09IG1hbmFDb3N0O1xuXG4gICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzLmdhbWUubWFuYWdlci5jcmVhdGUudW5pdCh7XG4gICAgICAgICAgICBhY3RlZDogZmFsc2UsXG4gICAgICAgICAgICBoZWFsdGg6IHRoaXMuZ2FtZS51bml0Sm9ic1swXS5oZWFsdGgsXG4gICAgICAgICAgICBvd25lcjogcGxheWVyLFxuICAgICAgICAgICAgdGlsZTogdGhpcyxcbiAgICAgICAgICAgIGpvYjogdGhpcy5nYW1lLnVuaXRKb2JzWzBdLFxuICAgICAgICAgICAgdGl0bGU6IFwid29ya2VyXCIsXG4gICAgICAgICAgICBtb3ZlczogdGhpcy5nYW1lLnVuaXRKb2JzWzBdLm1vdmVzLFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnVuaXQgPSB1bml0O1xuICAgICAgICB0aGlzLmdhbWUudW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgcGxheWVyLnVuaXRzLnB1c2godW5pdCk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNwYXduV29ya2VyIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBhZGphY2VudCBkaXJlY3Rpb24gYmV0d2VlbiB0aGlzIFRpbGUgYW5kIGFuIGFkamFjZW50IFRpbGVcbiAgICAgKiAoaWYgb25lIGV4aXN0cykuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWRqYWNlbnRUaWxlIC0gQSB0aWxlIHRoYXQgc2hvdWxkIGJlIGFkamFjZW50IHRvIHRoaXMgVGlsZS5cbiAgICAgKiBAcmV0dXJucyBcIk5vcnRoXCIsIFwiRWFzdFwiLCBcIlNvdXRoXCIsIG9yIFwiV2VzdFwiIGlmIHRoZSB0aWxlIGlzIGFkamFjZW50IHRvXG4gICAgICogdGhpcyBUaWxlIGluIHRoYXQgZGlyZWN0aW9uLiBPdGhlcndpc2UgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBZGphY2VudERpcmVjdGlvbihcbiAgICAgICAgYWRqYWNlbnRUaWxlOiBUaWxlIHwgdW5kZWZpbmVkLFxuICAgICk6IFwiTm9ydGhcIiB8IFwiU291dGhcIiB8IFwiRWFzdFwiIHwgXCJXZXN0XCIgfCB1bmRlZmluZWQge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLmdldEFkamFjZW50RGlyZWN0aW9uLmNhbGwodGhpcywgYWRqYWNlbnRUaWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbGlzdCBvZiBhbGwgdGhlIG5laWdoYm9ycyBvZiB0aGlzIFRpbGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBhbGwgYWRqYWNlbnQgdGlsZXMuIFNob3VsZCBiZSBiZXR3ZWVuIDIgdG8gNCB0aWxlcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TmVpZ2hib3JzKCk6IFRpbGVbXSB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3JzLmNhbGwodGhpcykgYXMgVGlsZVtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBuZWlnaGJvciBpbiBhIHBhcnRpY3VsYXIgZGlyZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIC0gVGhlIGRpcmVjdGlvbiB5b3Ugd2FudCwgbXVzdCBiZVxuICAgICAqIFwiTm9ydGhcIiwgXCJFYXN0XCIsIFwiU291dGhcIiwgb3IgXCJXZXN0XCIuXG4gICAgICogQHJldHVybnMgVGhlIFRpbGUgaW4gdGhhdCBkaXJlY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBub25lLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXROZWlnaGJvcihkaXJlY3Rpb246IFwiTm9ydGhcIiB8IFwiRWFzdFwiIHwgXCJTb3V0aFwiIHwgXCJXZXN0XCIpOiBUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5nZXROZWlnaGJvci5jYWxsKHRoaXMsIGRpcmVjdGlvbikgYXMgVGlsZSB8IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSBUaWxlIGhhcyBhbm90aGVyIFRpbGUgYXMgaXRzIG5laWdoYm9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIG5laWdoYm9yLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGhhc05laWdoYm9yKHRpbGU6IFRpbGUgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5oYXNOZWlnaGJvci5jYWxsKHRoaXMsIHRpbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvU3RyaW5nIG92ZXJyaWRlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkIG9yIHBpcmF0ZSBtZXRob2RzIGNhbiBnbyBoZXJlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=