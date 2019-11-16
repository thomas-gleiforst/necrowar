"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A unit in the game. May be a worker, zombie, ghoul, hound, abomination,
 * wraith or horseman.
 */
class Unit extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Unit is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
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
     * Invalidation function for attack. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to attack.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAttack(player, tile) {
        // <<-- Creer-Merge: invalidate-attack -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (!this) {
            return `This unit does not exist!`;
        }
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        // Make sure the unit hasn't acted.
        if (this.acted) {
            return `${this} has already acted this turn.`;
        }
        // Make sure the unit is alive.
        if (this.health <= 0) {
            return `${this} is dead, for now.`;
        }
        // Make sure the unit is on a tile.
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        // Make sure the tile exists.
        if (!tile) {
            return `${this} is trying to attack a tile that doesn't exist`;
        }
        // Make sure the tile is in range.
        if (this.tile !== tile.tileEast && this.tile !== tile.tileSouth &&
            this.tile !== tile.tileWest && this.tile !== tile.tileNorth) {
            return `${this} is trying to attack ${tile}, which is too far away.`;
        }
        // Make sure the the unit is attacking a tower.
        if (!tile.tower) {
            return `${this} is attacking ${tile}, which doesn't have a tower.`;
        }
        // Make sure you aren't attacking a friendly tower.
        if (tile.tower.owner === player) {
            return `${this} is trying to attack the allied tower: ${tile.tower} on tile ${tile}`;
        }
        // Handle possible unit invalidations here:
        if (this.owner === undefined) {
            return `${this} is attacking a unit that has no owner. Report this to the game Devs. This is 100% a bug`;
        }
        //  Make sure the unit has a job.
        if (this.job === undefined) {
            return `${this} doesn't have a job. That shouldn't be possible.`;
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks an enemy tower on an adjacent tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to attack.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, tile) {
        // <<-- Creer-Merge: attack -->>
        // TS thinks this could be undefined despite the invalidate for some reason, so we check it again.
        if (!tile.tower) {
            return false;
        }
        tile.tower.health -= this.job.damage;
        this.acted = true;
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for build. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param title - The tower type to build, as a string.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateBuild(player, title) {
        // <<-- Creer-Merge: invalidate-build -->>
        let towerIndex = -1;
        if (title === "arrow") {
            towerIndex = 1;
        }
        else if (title === "ballista") {
            towerIndex = 2;
        }
        else if (title === "cleansing") {
            towerIndex = 3;
        }
        else if (title === "aoe") {
            towerIndex = 4;
        }
        if (towerIndex === -1) {
            return `Invalid tower type!`;
        }
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (!this) {
            return `This unit does not exist!`;
        }
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        // Make sure the unit hasn't acted.
        if (this.acted) {
            return `${this} has already acted this turn.`;
        }
        // Make sure the unit is alive.
        if (this.health <= 0) {
            return `${this} is dead, for now.`;
        }
        // Make sure the unit is on a tile.
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        if (player.gold < this.game.towerJobs[towerIndex].goldCost
            || player.mana < this.game.towerJobs[towerIndex].manaCost) {
            return `You don't have enough gold or mana to build this tower.`;
        }
        if (this.tile !== this.tile) {
            return `${this} must be on the target tile to build!`;
        }
        if (this.tile.isGoldMine) {
            return `You can not build on a gold mine.`;
        }
        if (this.tile.isIslandGoldMine) {
            return `You can not build on the island.`;
        }
        if (this.tile.isPath) {
            return `You can not build on the path.`;
        }
        if (this.tile.isRiver) {
            return `You can not build on the river.`;
        }
        if (this.tile.isTower) {
            return `You can not build on top another tower.`;
        }
        if (this.tile.isWall) {
            return `You can not build on a wall.`;
        }
        // <<-- /Creer-Merge: invalidate-build -->>
    }
    /**
     * Unit, if it is a worker, builds a tower on the tile it is on, only
     * workers can do this.
     *
     * @param player - The player that called this.
     * @param title - The tower type to build, as a string.
     * @returns True if successfully built, false otherwise.
     */
    async build(player, title) {
        // <<-- Creer-Merge: build -->>
        if (!this.tile) {
            return false;
        }
        let towerIndex = -1;
        if (title === "arrow") {
            towerIndex = 1;
        }
        else if (title === "ballista") {
            towerIndex = 2;
        }
        else if (title === "cleansing") {
            towerIndex = 3;
        }
        else if (title === "aoe") {
            towerIndex = 4;
        }
        this.tile.tower = this.game.manager.create.tower({
            owner: player,
            attacked: false,
            health: this.game.towerJobs[towerIndex].health,
            job: this.game.towerJobs[towerIndex],
            tile: this.tile,
        });
        this.game.towers.push(this.tile.tower);
        player.towers.push(this.tile.tower);
        this.tile.isTower = true;
        player.gold -= this.game.towerJobs[towerIndex].goldCost;
        player.mana -= this.game.towerJobs[towerIndex].manaCost;
        return true;
        // <<-- /Creer-Merge: build -->>
    }
    /**
     * Invalidation function for fish. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The tile the unit will stand on as it fishes.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateFish(player, tile) {
        // <<-- Creer-Merge: invalidate-fish -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        if (this.acted) {
            return `${this} has already acted this turn.`;
        }
        if (!this.tile) {
            return `${this} is not on a tile! Could they be behind you..?`;
        }
        if (!((this.tile.tileEast && this.tile.tileEast.isRiver)
            || (this.tile.tileWest && this.tile.tileWest.isRiver)
            || (this.tile.tileNorth && this.tile.tileNorth.isRiver)
            || (this.tile.tileSouth && this.tile.tileSouth.isRiver))) {
            return `${this} is not near any river tiles!`;
        }
        if (!tile.isRiver) {
            return `${this} unit is trying to fish on land.`;
        }
        if (!tile) {
            return `Target tile does not exist.`;
        }
        if (this.job.title !== "worker") {
            return `${this} must be a worker.`;
        }
        // <<-- /Creer-Merge: invalidate-fish -->>
    }
    /**
     * Stops adjacent to a river tile and begins fishing for mana.
     *
     * @param player - The player that called this.
     * @param tile - The tile the unit will stand on as it fishes.
     * @returns True if successfully began fishing for mana, false otherwise.
     */
    async fish(player, tile) {
        // <<-- Creer-Merge: fish -->>
        this.acted = true;
        player.mana += this.game.manaIncomePerUnit;
        return true;
        // <<-- /Creer-Merge: fish -->>
    }
    /**
     * Invalidation function for mine. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The tile the mine is located on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMine(player, tile) {
        // <<-- Creer-Merge: invalidate-mine -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        if (this.acted) {
            return `${this} has already acted this turn.`;
        }
        if (!this.tile) {
            return `${this} is not on a tile! Could they be behind you..?`;
        }
        if (tile !== this.tile) {
            return `${this} must be standing in the gold mine!`;
        }
        if (!tile.isGoldMine && !tile.isIslandGoldMine) {
            return `${tile} must be a gold mine!`;
        }
        if (!tile.unit) {
            return `You are not on the target tile!`;
        }
        if (tile.unit.owner !== player) {
            return `You are trying to mine where another player's unit is!`;
        }
        // Make sure unit is a worker
        if (this.job.title !== "worker") {
            return `${this} must be a worker to mine!`;
        }
        // <<-- /Creer-Merge: invalidate-mine -->>
    }
    /**
     * Enters a mine and is put to work gathering resources.
     *
     * @param player - The player that called this.
     * @param tile - The tile the mine is located on.
     * @returns True if successfully entered mine and began mining, false
     * otherwise.
     */
    async mine(player, tile) {
        // <<-- Creer-Merge: mine -->>
        let goldGain = 0;
        // Assign Gold gain based on mine type
        // tslint:disable-next-line:prefer-conditional-expression
        if ((this.tile) && (this.tile.isIslandGoldMine)) {
            // Is island Gold Mine
            goldGain = this.game.islandIncomePerUnit;
        }
        else {
            // Is Normal Gold Mine
            goldGain = this.game.goldIncomePerUnit;
        }
        // Give gold to player
        player.gold += goldGain;
        // Unit has acted
        this.acted = true;
        return true;
        // <<-- /Creer-Merge: mine -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, tile) {
        // <<-- Creer-Merge: invalidate-move -->>
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        if (this.acted) {
            return `${this} has already acted this turn.`;
        }
        if (!this.tile) {
            return `${this} is not on a tile! Could they be behind you..?`;
        }
        // Make sure the tile is on the map
        if (!tile) {
            return `${this}, unit cannot plane shift, tile does not exist in this plane.`;
        }
        // Make sure there are moves left
        if (this.moves <= 0) {
            return `${this} has no more moves and might fall apart!`;
        }
        if (!tile.isPath && this.owner !== this.owner.opponent) {
            return `${this} cannot walk on the enemies side!`;
        }
        // Make sure tile is part of the path
        if (!tile.isPath && this.job.title !== "worker") {
            return `${this}, going off the path is dangerous!`;
        }
        // Or, make sure it isn't for workers
        if (tile.isPath && this.job.title === "worker") {
            return `${this}, workers are not allowed on the path!`;
        }
        // Make sure tile is not a river tile
        if (tile.isRiver) {
            return `${this} cannot swim.`;
        }
        // Make sure tile isnt occupied by a different unit type
        if (tile.unit) {
            if (tile.unit.job !== this.job) {
                return `${this} is not allowed to walk on ${tile.unit}!`;
            }
            else {
                if (this.job.title === "zombie" && tile.numZombies >= this.game.unitJobs[1].perTile
                    || this.job.title === "hound" && tile.numHounds >= this.game.unitJobs[4].perTile
                    || this.job.title === "ghoul" && tile.numGhouls >= this.game.unitJobs[2].perTile) {
                    return `${this} cannot walk on a fully occupied tile!`;
                }
                if (this.job.title === "worker" || this.job.title === "abomination"
                    || this.job.title === "horseman" || this.job.title === "wraith") {
                    return `${this} cannot walk on an occupied tile!`;
                }
            }
        }
        // Make sure tile isnt a tower
        if (tile.isTower) {
            return `${this} cannot hide in the tower.`;
        }
        // Make sure tile isnt a wall
        if (tile.isWall) {
            return `${this} cannot move through, under, over or around walls..we are sorry.`;
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves this Unit from its current Tile to an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns True if it moved, false otherwise.
     */
    async move(player, tile) {
        // <<-- Creer-Merge: move -->>
        // Add logic here for move.
        if (!this.tile) {
            return false;
        }
        if (this.job.title === "ghoul") {
            tile.numGhouls++;
            this.tile.numGhouls--;
        }
        else if (this.job.title === "hound") {
            tile.numHounds++;
            this.tile.numHounds--;
        }
        else if (this.job.title === "zombie") {
            tile.numZombies++;
            this.tile.numZombies--;
        }
        let replacementUnit = undefined;
        for (const unit of player.units) {
            if (unit !== this && unit.tile === this.tile) {
                replacementUnit = unit;
            }
        }
        this.tile.unit = replacementUnit;
        this.tile = tile;
        tile.unit = this;
        this.moves -= 1;
        return true;
        // <<-- /Creer-Merge: move -->>
    }
}
exports.Unit = Unit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZWNyb3dhci91bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0NBQTJDO0FBSzNDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOzs7R0FHRztBQUNILE1BQWEsSUFBSyxTQUFRLHdCQUFVO0lBZ0NoQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDSSxJQUlFLEVBQ0YsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQzs7Ozs7Ozs7OztPQVVHO0lBQ08sZ0JBQWdCLENBQ3RCLE1BQWMsRUFDZCxJQUFVO1FBRVYsMkNBQTJDO1FBRTNDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQy9DLE9BQU8sdUJBQXVCLE1BQU0sR0FBRyxDQUFDO1NBQzNDO1FBRUQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sMkJBQTJCLENBQUM7U0FDdEM7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ25ELE9BQU8sR0FBRyxJQUFJLHNCQUFzQixDQUFDO1NBQ3hDO1FBRUQsbUNBQW1DO1FBQ25DLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLE9BQU8sR0FBRyxJQUFJLCtCQUErQixDQUFDO1NBQ2pEO1FBRUQsK0JBQStCO1FB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LEdBQUcsQ0FBQyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxlQUFlLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRTtZQUM3QixJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUMxQyxlQUFlLEdBQUcsSUFBSSxDQUFDO2FBQzFCO1NBQ0o7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7UUFFaEIsT0FBTyxJQUFJLENBQUM7UUFDWiwrQkFBK0I7SUFDbkMsQ0FBQztDQU9KO0FBNW1CRCxvQkE0bUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJVW5pdEF0dGFja0FyZ3MsIElVbml0QnVpbGRBcmdzLCBJVW5pdEZpc2hBcmdzLCBJVW5pdE1pbmVBcmdzLFxuICAgICAgICAgSVVuaXRNb3ZlQXJncywgSVVuaXRQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcbmltcG9ydCB7IFVuaXRKb2IgfSBmcm9tIFwiLi91bml0LWpvYlwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIHVuaXQgaW4gdGhlIGdhbWUuIE1heSBiZSBhIHdvcmtlciwgem9tYmllLCBnaG91bCwgaG91bmQsIGFib21pbmF0aW9uLFxuICogd3JhaXRoIG9yIGhvcnNlbWFuLlxuICovXG5leHBvcnQgY2xhc3MgVW5pdCBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgVW5pdCBoYXMgcGVyZm9ybWVkIGl0cyBhY3Rpb24gdGhpcyB0dXJuIChhdHRhY2sgb3JcbiAgICAgKiBidWlsZCkuXG4gICAgICovXG4gICAgcHVibGljIGFjdGVkITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSByZW1haW5pbmcgaGVhbHRoIG9mIGEgdW5pdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGVhbHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgdW5pdCB0aGlzIGlzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBqb2IhOiBVbml0Sm9iO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBtb3ZlcyB0aGlzIHVuaXQgaGFzIGxlZnQgdGhpcyB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZlcyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBQbGF5ZXIgdGhhdCBvd25zIGFuZCBjYW4gY29udHJvbCB0aGlzIFVuaXQuXG4gICAgICovXG4gICAgcHVibGljIG93bmVyPzogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdGhpcyBVbml0IGlzIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyB0aWxlPzogVGlsZTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFVuaXQgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SVVuaXRQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIGNvbnN0cnVjdG9yIGFyZ3MgaW4gaGVyZVxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGF0dGFjay4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIGF0dGFjay5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVBdHRhY2soXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdEF0dGFja0FyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgcGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBJdCBpc24ndCB5b3VyIHR1cm4sICR7cGxheWVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoaXMgdW5pdCBkb2VzIG5vdCBleGlzdCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3duZXIgIT09IHBsYXllciB8fCB0aGlzLm93bmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpc24ndCBvd25lZCBieSB5b3UuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdW5pdCBoYXNuJ3QgYWN0ZWQuXG4gICAgICAgIGlmICh0aGlzLmFjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIGFscmVhZHkgYWN0ZWQgdGhpcyB0dXJuLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHVuaXQgaXMgYWxpdmUuXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgZGVhZCwgZm9yIG5vdy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1bml0IGlzIG9uIGEgdGlsZS5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb24gYSB0aWxlLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRpbGUgZXhpc3RzLlxuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyB0cnlpbmcgdG8gYXR0YWNrIGEgdGlsZSB0aGF0IGRvZXNuJ3QgZXhpc3RgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB0aWxlIGlzIGluIHJhbmdlLlxuICAgICAgICBpZiAodGhpcy50aWxlICE9PSB0aWxlLnRpbGVFYXN0ICYmIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlU291dGggJiZcbiAgICAgICAgICAgIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlV2VzdCAmJiB0aGlzLnRpbGUgIT09IHRpbGUudGlsZU5vcnRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgdHJ5aW5nIHRvIGF0dGFjayAke3RpbGV9LCB3aGljaCBpcyB0b28gZmFyIGF3YXkuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdGhlIHVuaXQgaXMgYXR0YWNraW5nIGEgdG93ZXIuXG4gICAgICAgIGlmICghdGlsZS50b3dlcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGF0dGFja2luZyAke3RpbGV9LCB3aGljaCBkb2Vzbid0IGhhdmUgYSB0b3dlci5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHlvdSBhcmVuJ3QgYXR0YWNraW5nIGEgZnJpZW5kbHkgdG93ZXIuXG4gICAgICAgIGlmICh0aWxlLnRvd2VyLm93bmVyID09PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyB0cnlpbmcgdG8gYXR0YWNrIHRoZSBhbGxpZWQgdG93ZXI6ICR7dGlsZS50b3dlcn0gb24gdGlsZSAke3RpbGV9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBwb3NzaWJsZSB1bml0IGludmFsaWRhdGlvbnMgaGVyZTpcbiAgICAgICAgaWYgKHRoaXMub3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGF0dGFja2luZyBhIHVuaXQgdGhhdCBoYXMgbm8gb3duZXIuIFJlcG9ydCB0aGlzIHRvIHRoZSBnYW1lIERldnMuIFRoaXMgaXMgMTAwJSBhIGJ1Z2A7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAgTWFrZSBzdXJlIHRoZSB1bml0IGhhcyBhIGpvYi5cbiAgICAgICAgaWYgKHRoaXMuam9iID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBkb2Vzbid0IGhhdmUgYSBqb2IuIFRoYXQgc2hvdWxkbid0IGJlIHBvc3NpYmxlLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1hdHRhY2sgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFja3MgYW4gZW5lbXkgdG93ZXIgb24gYW4gYWRqYWNlbnQgdGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBhdHRhY2suXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYXR0YWNrZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYXR0YWNrKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dGFjayAtLT4+XG4gICAgICAgIC8vIFRTIHRoaW5rcyB0aGlzIGNvdWxkIGJlIHVuZGVmaW5lZCBkZXNwaXRlIHRoZSBpbnZhbGlkYXRlIGZvciBzb21lIHJlYXNvbiwgc28gd2UgY2hlY2sgaXQgYWdhaW4uXG4gICAgICAgIGlmICghdGlsZS50b3dlcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGlsZS50b3dlci5oZWFsdGggLT0gdGhpcy5qb2IuZGFtYWdlO1xuXG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0YWNrIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGJ1aWxkLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aXRsZSAtIFRoZSB0b3dlciB0eXBlIHRvIGJ1aWxkLCBhcyBhIHN0cmluZy5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVCdWlsZChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0QnVpbGRBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1idWlsZCAtLT4+XG4gICAgICAgIGxldCB0b3dlckluZGV4ID0gLTE7XG5cbiAgICAgICAgaWYgKHRpdGxlID09PSBcImFycm93XCIpIHtcbiAgICAgICAgICAgIHRvd2VySW5kZXggPSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpdGxlID09PSBcImJhbGxpc3RhXCIpIHtcbiAgICAgICAgICAgIHRvd2VySW5kZXggPSAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpdGxlID09PSBcImNsZWFuc2luZ1wiKSB7XG4gICAgICAgICAgICB0b3dlckluZGV4ID0gMztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJhb2VcIikge1xuICAgICAgICAgICAgdG93ZXJJbmRleCA9IDQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG93ZXJJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBgSW52YWxpZCB0b3dlciB0eXBlIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBsYXllciB8fCBwbGF5ZXIgIT09IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYEl0IGlzbid0IHlvdXIgdHVybiwgJHtwbGF5ZXJ9LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMpIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhpcyB1bml0IGRvZXMgbm90IGV4aXN0IWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vd25lciAhPT0gcGxheWVyIHx8IHRoaXMub3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzbid0IG93bmVkIGJ5IHlvdS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1bml0IGhhc24ndCBhY3RlZC5cbiAgICAgICAgaWYgKHRoaXMuYWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBoYXMgYWxyZWFkeSBhY3RlZCB0aGlzIHR1cm4uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdW5pdCBpcyBhbGl2ZS5cbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkZWFkLCBmb3Igbm93LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHVuaXQgaXMgb24gYSB0aWxlLlxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIHRpbGUuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIuZ29sZCA8IHRoaXMuZ2FtZS50b3dlckpvYnNbdG93ZXJJbmRleF0uZ29sZENvc3RcbiAgICAgICAgICAgIHx8IHBsYXllci5tYW5hIDwgdGhpcy5nYW1lLnRvd2VySm9ic1t0b3dlckluZGV4XS5tYW5hQ29zdCkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgZG9uJ3QgaGF2ZSBlbm91Z2ggZ29sZCBvciBtYW5hIHRvIGJ1aWxkIHRoaXMgdG93ZXIuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbGUgIT09IHRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG11c3QgYmUgb24gdGhlIHRhcmdldCB0aWxlIHRvIGJ1aWxkIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlLmlzR29sZE1pbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBgWW91IGNhbiBub3QgYnVpbGQgb24gYSBnb2xkIG1pbmUuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbGUuaXNJc2xhbmRHb2xkTWluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgY2FuIG5vdCBidWlsZCBvbiB0aGUgaXNsYW5kLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlLmlzUGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgY2FuIG5vdCBidWlsZCBvbiB0aGUgcGF0aC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGlsZS5pc1JpdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBjYW4gbm90IGJ1aWxkIG9uIHRoZSByaXZlci5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGlsZS5pc1Rvd2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBjYW4gbm90IGJ1aWxkIG9uIHRvcCBhbm90aGVyIHRvd2VyLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlLmlzV2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgY2FuIG5vdCBidWlsZCBvbiBhIHdhbGwuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWJ1aWxkIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbml0LCBpZiBpdCBpcyBhIHdvcmtlciwgYnVpbGRzIGEgdG93ZXIgb24gdGhlIHRpbGUgaXQgaXMgb24sIG9ubHlcbiAgICAgKiB3b3JrZXJzIGNhbiBkbyB0aGlzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGl0bGUgLSBUaGUgdG93ZXIgdHlwZSB0byBidWlsZCwgYXMgYSBzdHJpbmcuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYnVpbHQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYnVpbGQocGxheWVyOiBQbGF5ZXIsIHRpdGxlOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYnVpbGQgLS0+PlxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRvd2VySW5kZXggPSAtMTtcblxuICAgICAgICBpZiAodGl0bGUgPT09IFwiYXJyb3dcIikge1xuICAgICAgICAgICAgdG93ZXJJbmRleCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGl0bGUgPT09IFwiYmFsbGlzdGFcIikge1xuICAgICAgICAgICAgdG93ZXJJbmRleCA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGl0bGUgPT09IFwiY2xlYW5zaW5nXCIpIHtcbiAgICAgICAgICAgIHRvd2VySW5kZXggPSAzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRpdGxlID09PSBcImFvZVwiKSB7XG4gICAgICAgICAgICB0b3dlckluZGV4ID0gNDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGlsZS50b3dlciA9IHRoaXMuZ2FtZS5tYW5hZ2VyLmNyZWF0ZS50b3dlcih7XG4gICAgICAgICAgICBvd25lcjogcGxheWVyLFxuICAgICAgICAgICAgYXR0YWNrZWQ6IGZhbHNlLFxuICAgICAgICAgICAgaGVhbHRoOiB0aGlzLmdhbWUudG93ZXJKb2JzW3Rvd2VySW5kZXhdLmhlYWx0aCxcbiAgICAgICAgICAgIGpvYjogdGhpcy5nYW1lLnRvd2VySm9ic1t0b3dlckluZGV4XSxcbiAgICAgICAgICAgIHRpbGU6IHRoaXMudGlsZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRvd2Vycy5wdXNoKHRoaXMudGlsZS50b3dlcik7XG5cbiAgICAgICAgcGxheWVyLnRvd2Vycy5wdXNoKHRoaXMudGlsZS50b3dlcik7XG5cbiAgICAgICAgdGhpcy50aWxlLmlzVG93ZXIgPSB0cnVlO1xuXG4gICAgICAgIHBsYXllci5nb2xkIC09IHRoaXMuZ2FtZS50b3dlckpvYnNbdG93ZXJJbmRleF0uZ29sZENvc3Q7XG4gICAgICAgIHBsYXllci5tYW5hIC09IHRoaXMuZ2FtZS50b3dlckpvYnNbdG93ZXJJbmRleF0ubWFuYUNvc3Q7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGJ1aWxkIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGZpc2guIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgdGlsZSB0aGUgdW5pdCB3aWxsIHN0YW5kIG9uIGFzIGl0IGZpc2hlcy5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVGaXNoKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRGaXNoQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZmlzaCAtLT4+XG4gICAgICAgIGlmICghcGxheWVyIHx8IHBsYXllciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgSXQgaXNuJ3QgeW91ciB0dXJuLCAke3BsYXllcn0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIgfHwgdGhpcy5vd25lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXNuJ3Qgb3duZWQgYnkgeW91LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5hY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGhhcyBhbHJlYWR5IGFjdGVkIHRoaXMgdHVybi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb24gYSB0aWxlISBDb3VsZCB0aGV5IGJlIGJlaGluZCB5b3UuLj9gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCEoKHRoaXMudGlsZS50aWxlRWFzdCAmJiB0aGlzLnRpbGUudGlsZUVhc3QuaXNSaXZlcilcbiAgICAgICAgICAgIHx8ICh0aGlzLnRpbGUudGlsZVdlc3QgJiYgdGhpcy50aWxlLnRpbGVXZXN0LmlzUml2ZXIpXG4gICAgICAgICAgICB8fCAodGhpcy50aWxlLnRpbGVOb3J0aCAmJiB0aGlzLnRpbGUudGlsZU5vcnRoLmlzUml2ZXIpXG4gICAgICAgICAgICB8fCAodGhpcy50aWxlLnRpbGVTb3V0aCAmJiB0aGlzLnRpbGUudGlsZVNvdXRoLmlzUml2ZXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBuZWFyIGFueSByaXZlciB0aWxlcyFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlLmlzUml2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSB1bml0IGlzIHRyeWluZyB0byBmaXNoIG9uIGxhbmQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBUYXJnZXQgdGlsZSBkb2VzIG5vdCBleGlzdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlICE9PSBcIndvcmtlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gbXVzdCBiZSBhIHdvcmtlci5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZmlzaCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgYWRqYWNlbnQgdG8gYSByaXZlciB0aWxlIGFuZCBiZWdpbnMgZmlzaGluZyBmb3IgbWFuYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgdGlsZSB0aGUgdW5pdCB3aWxsIHN0YW5kIG9uIGFzIGl0IGZpc2hlcy5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBiZWdhbiBmaXNoaW5nIGZvciBtYW5hLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGZpc2gocGxheWVyOiBQbGF5ZXIsIHRpbGU6IFRpbGUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogZmlzaCAtLT4+XG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIHBsYXllci5tYW5hICs9IHRoaXMuZ2FtZS5tYW5hSW5jb21lUGVyVW5pdDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGZpc2ggLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgbWluZS4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSB0aWxlIHRoZSBtaW5lIGlzIGxvY2F0ZWQgb24uXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlTWluZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0TWluZUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW1pbmUgLS0+PlxuICAgICAgICBpZiAoIXBsYXllciB8fCBwbGF5ZXIgIT09IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYEl0IGlzbid0IHlvdXIgdHVybiwgJHtwbGF5ZXJ9LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vd25lciAhPT0gcGxheWVyIHx8IHRoaXMub3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzbid0IG93bmVkIGJ5IHlvdS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBoYXMgYWxyZWFkeSBhY3RlZCB0aGlzIHR1cm4uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZSEgQ291bGQgdGhleSBiZSBiZWhpbmQgeW91Li4/YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBtdXN0IGJlIHN0YW5kaW5nIGluIHRoZSBnb2xkIG1pbmUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGlsZS5pc0dvbGRNaW5lICYmICF0aWxlLmlzSXNsYW5kR29sZE1pbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBtdXN0IGJlIGEgZ29sZCBtaW5lIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRpbGUudW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgYXJlIG5vdCBvbiB0aGUgdGFyZ2V0IHRpbGUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlLnVuaXQub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgYXJlIHRyeWluZyB0byBtaW5lIHdoZXJlIGFub3RoZXIgcGxheWVyJ3MgdW5pdCBpcyFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHVuaXQgaXMgYSB3b3JrZXJcbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlICE9PSBcIndvcmtlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gbXVzdCBiZSBhIHdvcmtlciB0byBtaW5lIWA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbWluZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRW50ZXJzIGEgbWluZSBhbmQgaXMgcHV0IHRvIHdvcmsgZ2F0aGVyaW5nIHJlc291cmNlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgdGlsZSB0aGUgbWluZSBpcyBsb2NhdGVkIG9uLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGVudGVyZWQgbWluZSBhbmQgYmVnYW4gbWluaW5nLCBmYWxzZVxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbWluZShwbGF5ZXI6IFBsYXllciwgdGlsZTogVGlsZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtaW5lIC0tPj5cblxuICAgICAgICBsZXQgZ29sZEdhaW4gPSAwO1xuXG4gICAgICAgIC8vIEFzc2lnbiBHb2xkIGdhaW4gYmFzZWQgb24gbWluZSB0eXBlXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItY29uZGl0aW9uYWwtZXhwcmVzc2lvblxuICAgICAgICBpZiAoKHRoaXMudGlsZSkgJiYgKHRoaXMudGlsZS5pc0lzbGFuZEdvbGRNaW5lKSkge1xuICAgICAgICAgICAgLy8gSXMgaXNsYW5kIEdvbGQgTWluZVxuICAgICAgICAgICAgZ29sZEdhaW4gPSB0aGlzLmdhbWUuaXNsYW5kSW5jb21lUGVyVW5pdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIElzIE5vcm1hbCBHb2xkIE1pbmVcbiAgICAgICAgICAgIGdvbGRHYWluID0gdGhpcy5nYW1lLmdvbGRJbmNvbWVQZXJVbml0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2l2ZSBnb2xkIHRvIHBsYXllclxuICAgICAgICBwbGF5ZXIuZ29sZCArPSBnb2xkR2FpbjtcblxuICAgICAgICAvLyBVbml0IGhhcyBhY3RlZFxuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWluZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBtb3ZlLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdGhpcyBVbml0IHNob3VsZCBtb3ZlIHRvLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZU1vdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdE1vdmVBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgcGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBJdCBpc24ndCB5b3VyIHR1cm4sICR7cGxheWVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3duZXIgIT09IHBsYXllciB8fCB0aGlzLm93bmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpc24ndCBvd25lZCBieSB5b3UuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIGFscmVhZHkgYWN0ZWQgdGhpcyB0dXJuLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIHRpbGUhIENvdWxkIHRoZXkgYmUgYmVoaW5kIHlvdS4uP2A7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRpbGUgaXMgb24gdGhlIG1hcFxuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSwgdW5pdCBjYW5ub3QgcGxhbmUgc2hpZnQsIHRpbGUgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyBwbGFuZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlIGFyZSBtb3ZlcyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLm1vdmVzIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBoYXMgbm8gbW9yZSBtb3ZlcyBhbmQgbWlnaHQgZmFsbCBhcGFydCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlLmlzUGF0aCAmJiB0aGlzLm93bmVyICE9PSB0aGlzLm93bmVyLm9wcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IHdhbGsgb24gdGhlIGVuZW1pZXMgc2lkZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRpbGUgaXMgcGFydCBvZiB0aGUgcGF0aFxuICAgICAgICBpZiAoIXRpbGUuaXNQYXRoICYmIHRoaXMuam9iLnRpdGxlICE9PSBcIndvcmtlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIGdvaW5nIG9mZiB0aGUgcGF0aCBpcyBkYW5nZXJvdXMhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9yLCBtYWtlIHN1cmUgaXQgaXNuJ3QgZm9yIHdvcmtlcnNcbiAgICAgICAgaWYgKHRpbGUuaXNQYXRoICYmIHRoaXMuam9iLnRpdGxlID09PSBcIndvcmtlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIHdvcmtlcnMgYXJlIG5vdCBhbGxvd2VkIG9uIHRoZSBwYXRoIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGlsZSBpcyBub3QgYSByaXZlciB0aWxlXG4gICAgICAgIGlmICh0aWxlLmlzUml2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3Qgc3dpbS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRpbGUgaXNudCBvY2N1cGllZCBieSBhIGRpZmZlcmVudCB1bml0IHR5cGVcbiAgICAgICAgaWYgKHRpbGUudW5pdCkge1xuICAgICAgICAgICAgaWYgKHRpbGUudW5pdC5qb2IgIT09IHRoaXMuam9iKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBhbGxvd2VkIHRvIHdhbGsgb24gJHt0aWxlLnVuaXR9IWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgPT09IFwiem9tYmllXCIgJiYgdGlsZS5udW1ab21iaWVzID49IHRoaXMuZ2FtZS51bml0Sm9ic1sxXS5wZXJUaWxlXG4gICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuam9iLnRpdGxlID09PSBcImhvdW5kXCIgJiYgdGlsZS5udW1Ib3VuZHMgPj0gdGhpcy5nYW1lLnVuaXRKb2JzWzRdLnBlclRpbGVcbiAgICAgICAgICAgICAgICAgICAgfHwgdGhpcy5qb2IudGl0bGUgPT09IFwiZ2hvdWxcIiAmJiB0aWxlLm51bUdob3VscyA+PSB0aGlzLmdhbWUudW5pdEpvYnNbMl0ucGVyVGlsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IHdhbGsgb24gYSBmdWxseSBvY2N1cGllZCB0aWxlIWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSA9PT0gXCJ3b3JrZXJcIiB8fCB0aGlzLmpvYi50aXRsZSA9PT0gXCJhYm9taW5hdGlvblwiXG4gICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuam9iLnRpdGxlID09PSBcImhvcnNlbWFuXCIgfHwgdGhpcy5qb2IudGl0bGUgPT09IFwid3JhaXRoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCB3YWxrIG9uIGFuIG9jY3VwaWVkIHRpbGUhYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGlsZSBpc250IGEgdG93ZXJcbiAgICAgICAgaWYgKHRpbGUuaXNUb3dlcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBoaWRlIGluIHRoZSB0b3dlci5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRpbGUgaXNudCBhIHdhbGxcbiAgICAgICAgaWYgKHRpbGUuaXNXYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IG1vdmUgdGhyb3VnaCwgdW5kZXIsIG92ZXIgb3IgYXJvdW5kIHdhbGxzLi53ZSBhcmUgc29ycnkuYDtcbiAgICAgICAgfVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlcyB0aGlzIFVuaXQgZnJvbSBpdHMgY3VycmVudCBUaWxlIHRvIGFuIGFkamFjZW50IFRpbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdGhpcyBVbml0IHNob3VsZCBtb3ZlIHRvLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgaXQgbW92ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgbW92ZShwbGF5ZXI6IFBsYXllciwgdGlsZTogVGlsZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtb3ZlIC0tPj5cblxuICAgICAgICAvLyBBZGQgbG9naWMgaGVyZSBmb3IgbW92ZS5cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcImdob3VsXCIpIHtcbiAgICAgICAgICAgIHRpbGUubnVtR2hvdWxzKys7XG4gICAgICAgICAgICB0aGlzLnRpbGUubnVtR2hvdWxzLS07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5qb2IudGl0bGUgPT09IFwiaG91bmRcIikge1xuICAgICAgICAgICAgdGlsZS5udW1Ib3VuZHMrKztcbiAgICAgICAgICAgIHRoaXMudGlsZS5udW1Ib3VuZHMtLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmpvYi50aXRsZSA9PT0gXCJ6b21iaWVcIikge1xuICAgICAgICAgICAgdGlsZS5udW1ab21iaWVzKys7XG4gICAgICAgICAgICB0aGlzLnRpbGUubnVtWm9tYmllcy0tO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlcGxhY2VtZW50VW5pdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgZm9yIChjb25zdCB1bml0IG9mIHBsYXllci51bml0cykge1xuICAgICAgICAgICAgaWYgKHVuaXQgIT09IHRoaXMgJiYgdW5pdC50aWxlID09PSB0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlbWVudFVuaXQgPSB1bml0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50aWxlLnVuaXQgPSByZXBsYWNlbWVudFVuaXQ7XG4gICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XG4gICAgICAgIHRpbGUudW5pdCA9IHRoaXM7XG4gICAgICAgIHRoaXMubW92ZXMgLT0gMTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==