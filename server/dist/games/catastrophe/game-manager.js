"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Catastrophe Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class CatastropheGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-20-Catastrophe",
        ];
    }
    // <<-- Creer-Merge: public-methods -->>
    // any additional public methods you need can be added here
    // <<-- /Creer-Merge: public-methods -->>
    /**
     * This is called BEFORE each player's runTun function is called
     * (including the first turn).
     * This is a good place to get their player ready for their turn.
     */
    async beforeTurn() {
        await super.beforeTurn();
        // <<-- Creer-Merge: before-turn -->>
        this.updateArrays();
        // <<-- /Creer-Merge: before-turn -->>
    }
    /**
     * This is called AFTER each player's turn ends. Before the turn counter
     * increases.
     * This is a good place to end-of-turn effects, and clean up arrays.
     */
    async afterTurn() {
        await super.afterTurn();
        // <<-- Creer-Merge: after-turn -->>
        this.updateArrays();
        this.updateUnits();
        this.updateResources();
        // <<-- /Creer-Merge: after-turn -->>
    }
    /**
     * Checks if the game is over in between turns.
     * This is invoked AFTER afterTurn() is called, but BEFORE beforeTurn()
     * is called.
     *
     * @returns True if the game is indeed over, otherwise if the game
     * should continue return false.
     */
    primaryWinConditionsCheck() {
        super.primaryWinConditionsCheck();
        // <<-- Creer-Merge: primary-win-conditions -->>
        const players = this.game.players.slice();
        // Primary win conditions: defeat enemy cat or defeat all enemy humans
        // 1. enemy cats defeated
        players.sort((a, b) => b.cat.energy - a.cat.energy);
        if (players[0].cat.energy <= 0) {
            this.secondaryWinConditions("Both players' cats defeated at the same time.");
            return true;
        }
        else if (players[1].cat.energy <= 0) {
            const winner = players.shift();
            this.declareWinner("Defeated opponent's cat!", winner);
            this.declareLosers("Cat died", ...players);
            return true;
        }
        // 2. All humans died.
        players.sort((a, b) => b.units.length - a.units.length);
        if (players[0].units.length === 1) {
            this.secondaryWinConditions("All units died for both players.");
            return true;
        }
        else if (players[1].units.length === 1) {
            const winner = players.shift();
            this.declareWinner("Defeated all enemy humans!", winner);
            this.declareLosers("Humans died", ...players);
            return true;
        }
        // <<-- /Creer-Merge: primary-win-conditions -->>
        return false; // If we get here no one won on this turn.
    }
    /**
     * Called when the game needs to end, but primary game ending conditions
     * are not met (like max turns reached). Use this to check for secondary
     * game win conditions to crown a winner.
     * @param reason The reason why a secondary victory condition is happening
     */
    secondaryWinConditions(reason) {
        // <<-- Creer-Merge: secondary-win-conditions -->>
        const players = this.game.players.slice();
        // 1. Most units
        players.sort((a, b) => b.units.length - a.units.length);
        if (players[0].units.length > players[1].units.length) {
            const winner = players.shift();
            this.declareWinner(`${reason}: Had the most units`, winner);
            this.declareLosers(`${reason}: Had the least units`, ...players);
            return;
        }
        // 2. Most food
        players.sort((a, b) => b.food - a.food);
        if (players[0].food > players[1].food) {
            const winner = players.shift();
            this.declareWinner(`${reason}: Had the most food`, winner);
            this.declareLosers(`${reason}: Had the least food`, ...players);
            return;
        }
        // 3. Most structures
        players.sort((a, b) => b.structures.length - a.structures.length);
        if (players[0].structures.length > players[1].structures.length) {
            const winner = players.shift();
            this.declareWinner(`${reason}: Had the most structures`, winner);
            this.declareLosers(`${reason}: Had the least structures`, ...players);
            return;
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    /** Updates all arrays in the game with new/dead game objects */
    updateArrays() {
        // Add new structures
        for (const structure of this.game.newStructures) {
            this.game.structures.push(structure);
            if (structure.owner) {
                structure.owner.structures.push(structure);
            }
        }
        this.game.newStructures.length = 0;
        // Properly remove all destroyed structures
        for (let i = 0; i < this.game.structures.length; i++) {
            const structure = this.game.structures[i];
            if (!structure.tile) {
                if (structure.owner) {
                    // Remove this structure from the player's structures array
                    utils_1.removeElements(structure.owner.structures, structure);
                }
                // Remove this structure from the game's structures array
                this.game.structures.splice(i, 1);
                i--; // Make sure we don't skip an element
            }
        }
        // Properly remove all killed units
        for (let i = 0; i < this.game.units.length; i++) {
            const unit = this.game.units[i];
            if (!unit.tile || unit.turnsToDie === 0) {
                if (unit.tile) {
                    unit.tile.unit = undefined;
                    unit.tile = undefined;
                }
                if (unit.owner) {
                    // Remove this unit from the player's units array
                    utils_1.removeElements(unit.owner.units, unit);
                }
                // Remove this unit from the game's units array
                this.game.units.splice(i, 1);
                i--; // Make sure we don't skip an element
            }
        }
    }
    /** Updates all the units in the game */
    updateUnits() {
        // Reset all upkeeps
        for (const player of this.game.players) {
            player.upkeep = 0;
            // Remove all defeated units from their units list
            utils_1.removeElements(player.units, ...player.defeatedUnits);
            player.defeatedUnits.length = 0;
            // Add all new units to their units list
            player.units.push(...player.newUnits);
            player.newUnits.length = 0;
        }
        // Iterate through all units
        for (const unit of this.game.units) {
            if (!unit.owner || unit.owner === this.game.currentPlayer) {
                unit.acted = false;
                unit.moves = unit.job.moves;
                unit.starving = false;
            }
            if (unit.owner) {
                // Add this unit's upkeep to the player's total upkeep
                unit.owner.upkeep += unit.job.upkeep;
            }
            else {
                // Neutral fresh humans
                if (unit.turnsToDie > 0) {
                    unit.turnsToDie--;
                }
                const target = unit.movementTarget;
                if (target && unit.tile) {
                    // Move neutral fresh humans on the road
                    const nextTile = this.game.getTile(unit.tile.x + Math.sign(target.x - unit.tile.x), unit.tile.y);
                    if (nextTile && !nextTile.unit) {
                        unit.tile.unit = undefined;
                        nextTile.unit = unit;
                        unit.tile = nextTile;
                    }
                }
            }
        }
        // Check if new fresh humans should walk across the road
        if (this.game.currentTurn % this.game.turnsToCreateHuman === 0) {
            // Spawn two new fresh humans
            let tile;
            // Search for a valid spawning tile
            for (let x = 0; x < this.game.mapWidth; x++) {
                tile = this.game.getTile(x, this.game.mapHeight / 2 - 1);
                if (tile && !tile.unit) {
                    break;
                }
            }
            if (!tile) {
                // this should never happen
                throw new Error("No tile could be found for unit to spawn.");
            }
            // If one was found (as in, not a map-wide line of units), spawn a new fresh human
            if (!tile.unit) {
                const unit = this.create.unit({
                    job: this.game.jobs[0],
                    owner: undefined,
                    tile,
                    turnsToDie: this.game.mapWidth - tile.x,
                    movementTarget: this.game.getTile(this.game.mapWidth - 1, this.game.mapHeight / 2 - 1),
                });
                unit.tile.unit = unit;
            }
        }
        else if (this.game.currentTurn % this.game.turnsToCreateHuman === 1) {
            let tile;
            // Search for a valid spawning tile
            for (let x = this.game.mapWidth - 1; x >= 0; x--) {
                tile = this.game.getTile(x, this.game.mapHeight / 2);
                if (tile && !tile.unit) {
                    break;
                }
            }
            if (!tile) {
                // this should never happen
                throw new Error("No tile could be found for unit to spawn.");
            }
            // If one was found (as in, not a map-wide line of units), spawn a new fresh human
            if (!tile.unit) {
                const unit = this.create.unit({
                    job: this.game.jobs[0],
                    owner: undefined,
                    tile,
                    turnsToDie: tile.x + 1,
                    movementTarget: this.game.getTile(0, this.game.mapHeight / 2),
                });
                unit.tile.unit = unit;
            }
        }
        // Check if units are starving and update food
        if (this.game.currentPlayer.food >= this.game.currentPlayer.upkeep) {
            this.game.currentPlayer.food -= this.game.currentPlayer.upkeep;
        }
        else {
            for (const unit of this.game.currentPlayer.units) {
                unit.starving = true;
            }
        }
    }
    /** Updates the resources in between turns */
    updateResources() {
        const lowerHarvests = this.game.currentTurn % this.game.turnsToLowerHarvest === 0;
        // Iterate through every tile
        for (const tile of this.game.tiles) {
            if (tile.turnsToHarvest > 0) {
                tile.turnsToHarvest--;
            }
            if (lowerHarvests && tile.harvestRate > 0) {
                tile.harvestRate -= this.game.lowerHarvestAmount;
                if (tile.harvestRate < 0) {
                    tile.harvestRate = 0;
                }
            }
        }
    }
}
exports.CatastropheGameManager = CatastropheGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2NhdGFzdHJvcGhlL2dhbWUtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZFQUE2RTtBQUM3RSxhQUFhO0FBQ2IseUJBQ21CO0FBRW5CLGlDQUFpQztBQUNqQyxtQ0FBeUM7QUFHekMsa0NBQWtDO0FBRWxDOzs7OztHQUtHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxjQUFXLENBQUMsV0FBVztJQUMvRCxpRUFBaUU7SUFDMUQsTUFBTSxLQUFLLE9BQU87UUFDckIsT0FBTztZQUNILGlDQUFpQztZQUNqQyw0QkFBNEI7U0FFL0IsQ0FBQztJQUNOLENBQUM7SUFRRCx3Q0FBd0M7SUFFeEMsMkRBQTJEO0lBRTNELHlDQUF5QztJQUV6Qzs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFVBQVU7UUFDdEIsTUFBTSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFekIscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixzQ0FBc0M7SUFDMUMsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxLQUFLLENBQUMsU0FBUztRQUNyQixNQUFNLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUV4QixvQ0FBb0M7UUFDcEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIscUNBQXFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08seUJBQXlCO1FBQy9CLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBRWxDLGdEQUFnRDtRQUVoRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUUxQyxzRUFBc0U7UUFFdEUseUJBQXlCO1FB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SUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ2hFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7U0FDbEU7YUFDSTtZQUNELEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFO2dCQUM5QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzthQUN4QjtTQUNKO0lBQ0wsQ0FBQztJQUVELDZDQUE2QztJQUNyQyxlQUFlO1FBQ25CLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEtBQUssQ0FBQyxDQUFDO1FBRWxGLDZCQUE2QjtRQUM3QixLQUFLLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2hDLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN6QjtZQUVELElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7Z0JBQ2pELElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO2lCQUN4QjthQUNKO1NBQ0o7SUFDTCxDQUFDO0NBR0o7QUEvVUQsd0RBK1VDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGlzIHdoZXJlIHlvdSBzaG91bGQgcHV0IGxvZ2ljIHRvIGNvbnRyb2wgdGhlIGdhbWUgYW5kIGV2ZXJ5dGhpbmdcbi8vIGFyb3VuZCBpdC5cbmltcG9ydCB7IEJhc2VDbGFzc2VzLCBDYXRhc3Ryb3BoZUdhbWUsIENhdGFzdHJvcGhlR2FtZU9iamVjdEZhY3RvcnksXG4gICAgICAgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyByZW1vdmVFbGVtZW50cyB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgZ2FtZSBsb2dpYyBhcm91bmQgdGhlIENhdGFzdHJvcGhlIEdhbWUuXG4gKiBUaGlzIGlzIHdoZXJlIHlvdSBjb3VsZCBkbyBsb2dpYyBmb3IgY2hlY2tpbmcgaWYgdGhlIGdhbWUgaXMgb3ZlciwgdXBkYXRlXG4gKiB0aGUgZ2FtZSBiZXR3ZWVuIHR1cm5zLCBhbmQgYW55dGhpbmcgdGhhdCB0aWVzIGFsbCB0aGUgXCJzdHVmZlwiIGluIHRoZSBnYW1lXG4gKiB0b2dldGhlci5cbiAqL1xuZXhwb3J0IGNsYXNzIENhdGFzdHJvcGhlR2FtZU1hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lTWFuYWdlciB7XG4gICAgLyoqIE90aGVyIHN0cmluZ3MgKGNhc2UgaW5zZW5zaXRpdmUpIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gSUQgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICAgICAgXCJNZWdhTWluZXJBSS0yMC1DYXRhc3Ryb3BoZVwiLFxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICBdO1xuICAgIH1cblxuICAgIC8qKiBUaGUgZ2FtZSB0aGlzIEdhbWVNYW5hZ2VyIGlzIG1hbmFnaW5nICovXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWUhOiBDYXRhc3Ryb3BoZUdhbWU7XG5cbiAgICAvKiogVGhlIGZhY3RvcnkgdGhhdCBtdXN0IGJlIHVzZWQgdG8gaW5pdGlhbGl6ZSBuZXcgZ2FtZSBvYmplY3RzICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNyZWF0ZSE6IENhdGFzdHJvcGhlR2FtZU9iamVjdEZhY3Rvcnk7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyBhbnkgYWRkaXRpb25hbCBwdWJsaWMgbWV0aG9kcyB5b3UgbmVlZCBjYW4gYmUgYWRkZWQgaGVyZVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEJFRk9SRSBlYWNoIHBsYXllcidzIHJ1blR1biBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICAgKiAoaW5jbHVkaW5nIHRoZSBmaXJzdCB0dXJuKS5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBnZXQgdGhlaXIgcGxheWVyIHJlYWR5IGZvciB0aGVpciB0dXJuLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBiZWZvcmVUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5iZWZvcmVUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgICAgICB0aGlzLnVwZGF0ZUFycmF5cygpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEFGVEVSIGVhY2ggcGxheWVyJ3MgdHVybiBlbmRzLiBCZWZvcmUgdGhlIHR1cm4gY291bnRlclxuICAgICAqIGluY3JlYXNlcy5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBlbmQtb2YtdHVybiBlZmZlY3RzLCBhbmQgY2xlYW4gdXAgYXJyYXlzLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBhZnRlclR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmFmdGVyVHVybigpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgICAgICB0aGlzLnVwZGF0ZUFycmF5cygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVVuaXRzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUmVzb3VyY2VzKCk7XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhZnRlci10dXJuIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlciBpbiBiZXR3ZWVuIHR1cm5zLlxuICAgICAqIFRoaXMgaXMgaW52b2tlZCBBRlRFUiBhZnRlclR1cm4oKSBpcyBjYWxsZWQsIGJ1dCBCRUZPUkUgYmVmb3JlVHVybigpXG4gICAgICogaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgZ2FtZSBpcyBpbmRlZWQgb3Zlciwgb3RoZXJ3aXNlIGlmIHRoZSBnYW1lXG4gICAgICogc2hvdWxkIGNvbnRpbnVlIHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpOiBib29sZWFuIHtcbiAgICAgICAgc3VwZXIucHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByaW1hcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLmdhbWUucGxheWVycy5zbGljZSgpO1xuXG4gICAgICAgIC8vIFByaW1hcnkgd2luIGNvbmRpdGlvbnM6IGRlZmVhdCBlbmVteSBjYXQgb3IgZGVmZWF0IGFsbCBlbmVteSBodW1hbnNcblxuICAgICAgICAvLyAxLiBlbmVteSBjYXRzIGRlZmVhdGVkXG4gICAgICAgIHBsYXllcnMuc29ydCgoYSwgYikgPT4gYi5jYXQuZW5lcmd5IC0gYS5jYXQuZW5lcmd5KTtcbiAgICAgICAgaWYgKHBsYXllcnNbMF0uY2F0LmVuZXJneSA8PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXCJCb3RoIHBsYXllcnMnIGNhdHMgZGVmZWF0ZWQgYXQgdGhlIHNhbWUgdGltZS5cIik7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsYXllcnNbMV0uY2F0LmVuZXJneSA8PSAwKSB7XG4gICAgICAgICAgICBjb25zdCB3aW5uZXIgPSBwbGF5ZXJzLnNoaWZ0KCkgYXMgUGxheWVyO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFwiRGVmZWF0ZWQgb3Bwb25lbnQncyBjYXQhXCIsIHdpbm5lcik7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJDYXQgZGllZFwiLCAuLi5wbGF5ZXJzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyAyLiBBbGwgaHVtYW5zIGRpZWQuXG4gICAgICAgIHBsYXllcnMuc29ydCgoYSwgYikgPT4gYi51bml0cy5sZW5ndGggLSBhLnVuaXRzLmxlbmd0aCk7XG4gICAgICAgIGlmIChwbGF5ZXJzWzBdLnVuaXRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5zZWNvbmRhcnlXaW5Db25kaXRpb25zKFwiQWxsIHVuaXRzIGRpZWQgZm9yIGJvdGggcGxheWVycy5cIik7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsYXllcnNbMV0udW5pdHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjb25zdCB3aW5uZXIgPSBwbGF5ZXJzLnNoaWZ0KCkgYXMgUGxheWVyO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFwiRGVmZWF0ZWQgYWxsIGVuZW15IGh1bWFucyFcIiwgd2lubmVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VycyhcIkh1bWFucyBkaWVkXCIsIC4uLnBsYXllcnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLmdhbWUucGxheWVycy5zbGljZSgpO1xuXG4gICAgICAgIC8vIDEuIE1vc3QgdW5pdHNcbiAgICAgICAgcGxheWVycy5zb3J0KChhLCBiKSA9PiBiLnVuaXRzLmxlbmd0aCAtIGEudW5pdHMubGVuZ3RoKTtcbiAgICAgICAgaWYgKHBsYXllcnNbMF0udW5pdHMubGVuZ3RoID4gcGxheWVyc1sxXS51bml0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHBsYXllcnMuc2hpZnQoKSBhcyBQbGF5ZXI7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoYCR7cmVhc29ufTogSGFkIHRoZSBtb3N0IHVuaXRzYCwgd2lubmVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VycyhgJHtyZWFzb259OiBIYWQgdGhlIGxlYXN0IHVuaXRzYCwgLi4ucGxheWVycyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIuIE1vc3QgZm9vZFxuICAgICAgICBwbGF5ZXJzLnNvcnQoKGEsIGIpID0+IGIuZm9vZCAtIGEuZm9vZCk7XG4gICAgICAgIGlmIChwbGF5ZXJzWzBdLmZvb2QgPiBwbGF5ZXJzWzFdLmZvb2QpIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHBsYXllcnMuc2hpZnQoKSBhcyBQbGF5ZXI7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoYCR7cmVhc29ufTogSGFkIHRoZSBtb3N0IGZvb2RgLCB3aW5uZXIpO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKGAke3JlYXNvbn06IEhhZCB0aGUgbGVhc3QgZm9vZGAsIC4uLnBsYXllcnMpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyAzLiBNb3N0IHN0cnVjdHVyZXNcbiAgICAgICAgcGxheWVycy5zb3J0KChhLCBiKSA9PiBiLnN0cnVjdHVyZXMubGVuZ3RoIC0gYS5zdHJ1Y3R1cmVzLmxlbmd0aCk7XG4gICAgICAgIGlmIChwbGF5ZXJzWzBdLnN0cnVjdHVyZXMubGVuZ3RoID4gcGxheWVyc1sxXS5zdHJ1Y3R1cmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3Qgd2lubmVyID0gcGxheWVycy5zaGlmdCgpIGFzIFBsYXllcjtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259OiBIYWQgdGhlIG1vc3Qgc3RydWN0dXJlc2AsIHdpbm5lcik7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoYCR7cmVhc29ufTogSGFkIHRoZSBsZWFzdCBzdHJ1Y3R1cmVzYCwgLi4ucGxheWVycyk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBlbmQgdGhlIGdhbWUuXG4gICAgICAgIC8vIElmIG5vIHdpbm5lciBpdCBkZXRlcm1pbmVkIGFib3ZlLCB0aGVuIGEgcmFuZG9tIG9uZSB3aWxsIGJlIGNob3Nlbi5cbiAgICAgICAgc3VwZXIuc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb24pO1xuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqIFVwZGF0ZXMgYWxsIGFycmF5cyBpbiB0aGUgZ2FtZSB3aXRoIG5ldy9kZWFkIGdhbWUgb2JqZWN0cyAqL1xuICAgIHByaXZhdGUgdXBkYXRlQXJyYXlzKCk6IHZvaWQge1xuICAgICAgICAgLy8gQWRkIG5ldyBzdHJ1Y3R1cmVzXG4gICAgICAgIGZvciAoY29uc3Qgc3RydWN0dXJlIG9mIHRoaXMuZ2FtZS5uZXdTdHJ1Y3R1cmVzKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuc3RydWN0dXJlcy5wdXNoKHN0cnVjdHVyZSk7XG4gICAgICAgICAgICBpZiAoc3RydWN0dXJlLm93bmVyKSB7XG4gICAgICAgICAgICAgICAgc3RydWN0dXJlLm93bmVyLnN0cnVjdHVyZXMucHVzaChzdHJ1Y3R1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2FtZS5uZXdTdHJ1Y3R1cmVzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy8gUHJvcGVybHkgcmVtb3ZlIGFsbCBkZXN0cm95ZWQgc3RydWN0dXJlc1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5zdHJ1Y3R1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdHJ1Y3R1cmUgPSB0aGlzLmdhbWUuc3RydWN0dXJlc1tpXTtcbiAgICAgICAgICAgIGlmICghc3RydWN0dXJlLnRpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RydWN0dXJlLm93bmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGlzIHN0cnVjdHVyZSBmcm9tIHRoZSBwbGF5ZXIncyBzdHJ1Y3R1cmVzIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKHN0cnVjdHVyZS5vd25lci5zdHJ1Y3R1cmVzLCBzdHJ1Y3R1cmUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGlzIHN0cnVjdHVyZSBmcm9tIHRoZSBnYW1lJ3Mgc3RydWN0dXJlcyBhcnJheVxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5zdHJ1Y3R1cmVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpLS07IC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCBza2lwIGFuIGVsZW1lbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByb3Blcmx5IHJlbW92ZSBhbGwga2lsbGVkIHVuaXRzXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnVuaXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB1bml0ID0gdGhpcy5nYW1lLnVuaXRzW2ldO1xuICAgICAgICAgICAgaWYgKCF1bml0LnRpbGUgfHwgdW5pdC50dXJuc1RvRGllID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXQudGlsZSkge1xuICAgICAgICAgICAgICAgICAgICB1bml0LnRpbGUudW5pdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdW5pdC50aWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh1bml0Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGlzIHVuaXQgZnJvbSB0aGUgcGxheWVyJ3MgdW5pdHMgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHModW5pdC5vd25lci51bml0cywgdW5pdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoaXMgdW5pdCBmcm9tIHRoZSBnYW1lJ3MgdW5pdHMgYXJyYXlcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudW5pdHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGktLTsgLy8gTWFrZSBzdXJlIHdlIGRvbid0IHNraXAgYW4gZWxlbWVudFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFVwZGF0ZXMgYWxsIHRoZSB1bml0cyBpbiB0aGUgZ2FtZSAqL1xuICAgIHByaXZhdGUgdXBkYXRlVW5pdHMoKTogdm9pZCB7XG4gICAgICAgIC8vIFJlc2V0IGFsbCB1cGtlZXBzXG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIHRoaXMuZ2FtZS5wbGF5ZXJzKSB7XG4gICAgICAgICAgICBwbGF5ZXIudXBrZWVwID0gMDtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBkZWZlYXRlZCB1bml0cyBmcm9tIHRoZWlyIHVuaXRzIGxpc3RcbiAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKHBsYXllci51bml0cywgLi4ucGxheWVyLmRlZmVhdGVkVW5pdHMpO1xuICAgICAgICAgICAgcGxheWVyLmRlZmVhdGVkVW5pdHMubGVuZ3RoID0gMDtcblxuICAgICAgICAgICAgLy8gQWRkIGFsbCBuZXcgdW5pdHMgdG8gdGhlaXIgdW5pdHMgbGlzdFxuICAgICAgICAgICAgcGxheWVyLnVuaXRzLnB1c2goLi4ucGxheWVyLm5ld1VuaXRzKTtcbiAgICAgICAgICAgIHBsYXllci5uZXdVbml0cy5sZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCB1bml0c1xuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnVuaXRzKSB7XG4gICAgICAgICAgICBpZiAoIXVuaXQub3duZXIgfHwgdW5pdC5vd25lciA9PT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICB1bml0LmFjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdW5pdC5tb3ZlcyA9IHVuaXQuam9iLm1vdmVzO1xuICAgICAgICAgICAgICAgIHVuaXQuc3RhcnZpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVuaXQub3duZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhpcyB1bml0J3MgdXBrZWVwIHRvIHRoZSBwbGF5ZXIncyB0b3RhbCB1cGtlZXBcbiAgICAgICAgICAgICAgICB1bml0Lm93bmVyLnVwa2VlcCArPSB1bml0LmpvYi51cGtlZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBOZXV0cmFsIGZyZXNoIGh1bWFuc1xuICAgICAgICAgICAgICAgIGlmICh1bml0LnR1cm5zVG9EaWUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXQudHVybnNUb0RpZS0tO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHVuaXQubW92ZW1lbnRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCAmJiB1bml0LnRpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBuZXV0cmFsIGZyZXNoIGh1bWFucyBvbiB0aGUgcm9hZFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0VGlsZSA9IHRoaXMuZ2FtZS5nZXRUaWxlKHVuaXQudGlsZS54ICsgTWF0aC5zaWduKHRhcmdldC54IC0gdW5pdC50aWxlLngpLCB1bml0LnRpbGUueSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VGlsZSAmJiAhbmV4dFRpbGUudW5pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC50aWxlLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0VGlsZS51bml0ID0gdW5pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQudGlsZSA9IG5leHRUaWxlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbmV3IGZyZXNoIGh1bWFucyBzaG91bGQgd2FsayBhY3Jvc3MgdGhlIHJvYWRcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5jdXJyZW50VHVybiAlIHRoaXMuZ2FtZS50dXJuc1RvQ3JlYXRlSHVtYW4gPT09IDApIHtcbiAgICAgICAgICAgIC8vIFNwYXduIHR3byBuZXcgZnJlc2ggaHVtYW5zXG4gICAgICAgICAgICBsZXQgdGlsZTogVGlsZSB8IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgLy8gU2VhcmNoIGZvciBhIHZhbGlkIHNwYXduaW5nIHRpbGVcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5nYW1lLm1hcFdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aWxlID0gdGhpcy5nYW1lLmdldFRpbGUoeCwgdGhpcy5nYW1lLm1hcEhlaWdodCAvIDIgLSAxKTtcbiAgICAgICAgICAgICAgICBpZiAodGlsZSAmJiAhdGlsZS51bml0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gdGlsZSBjb3VsZCBiZSBmb3VuZCBmb3IgdW5pdCB0byBzcGF3bi5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG9uZSB3YXMgZm91bmQgKGFzIGluLCBub3QgYSBtYXAtd2lkZSBsaW5lIG9mIHVuaXRzKSwgc3Bhd24gYSBuZXcgZnJlc2ggaHVtYW5cbiAgICAgICAgICAgIGlmICghdGlsZS51bml0KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgICAgICBqb2I6IHRoaXMuZ2FtZS5qb2JzWzBdLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB0aWxlLFxuICAgICAgICAgICAgICAgICAgICB0dXJuc1RvRGllOiB0aGlzLmdhbWUubWFwV2lkdGggLSB0aWxlLngsXG4gICAgICAgICAgICAgICAgICAgIG1vdmVtZW50VGFyZ2V0OiB0aGlzLmdhbWUuZ2V0VGlsZSh0aGlzLmdhbWUubWFwV2lkdGggLSAxLCB0aGlzLmdhbWUubWFwSGVpZ2h0IC8gMiAtIDEpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHVuaXQudGlsZS51bml0ID0gdW5pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmdhbWUuY3VycmVudFR1cm4gJSB0aGlzLmdhbWUudHVybnNUb0NyZWF0ZUh1bWFuID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgdGlsZTtcblxuICAgICAgICAgICAgLy8gU2VhcmNoIGZvciBhIHZhbGlkIHNwYXduaW5nIHRpbGVcbiAgICAgICAgICAgIGZvciAobGV0IHggPSB0aGlzLmdhbWUubWFwV2lkdGggLSAxOyB4ID49IDA7IHgtLSkge1xuICAgICAgICAgICAgICAgIHRpbGUgPSB0aGlzLmdhbWUuZ2V0VGlsZSh4LCB0aGlzLmdhbWUubWFwSGVpZ2h0IC8gMik7XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUgJiYgIXRpbGUudW5pdCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgc2hvdWxkIG5ldmVyIGhhcHBlblxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHRpbGUgY291bGQgYmUgZm91bmQgZm9yIHVuaXQgdG8gc3Bhd24uXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBvbmUgd2FzIGZvdW5kIChhcyBpbiwgbm90IGEgbWFwLXdpZGUgbGluZSBvZiB1bml0cyksIHNwYXduIGEgbmV3IGZyZXNoIGh1bWFuXG4gICAgICAgICAgICBpZiAoIXRpbGUudW5pdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXQgPSB0aGlzLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICAgICAgam9iOiB0aGlzLmdhbWUuam9ic1swXSxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgdGlsZSxcbiAgICAgICAgICAgICAgICAgICAgdHVybnNUb0RpZTogdGlsZS54ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZW1lbnRUYXJnZXQ6IHRoaXMuZ2FtZS5nZXRUaWxlKDAsIHRoaXMuZ2FtZS5tYXBIZWlnaHQgLyAyKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB1bml0LnRpbGUudW5pdCA9IHVuaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB1bml0cyBhcmUgc3RhcnZpbmcgYW5kIHVwZGF0ZSBmb29kXG4gICAgICAgIGlmICh0aGlzLmdhbWUuY3VycmVudFBsYXllci5mb29kID49IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLnVwa2VlcCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIuZm9vZCAtPSB0aGlzLmdhbWUuY3VycmVudFBsYXllci51cGtlZXA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIudW5pdHMpIHtcbiAgICAgICAgICAgICAgICB1bml0LnN0YXJ2aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBVcGRhdGVzIHRoZSByZXNvdXJjZXMgaW4gYmV0d2VlbiB0dXJucyAqL1xuICAgIHByaXZhdGUgdXBkYXRlUmVzb3VyY2VzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBsb3dlckhhcnZlc3RzID0gdGhpcy5nYW1lLmN1cnJlbnRUdXJuICUgdGhpcy5nYW1lLnR1cm5zVG9Mb3dlckhhcnZlc3QgPT09IDA7XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGV2ZXJ5IHRpbGVcbiAgICAgICAgZm9yIChjb25zdCB0aWxlIG9mIHRoaXMuZ2FtZS50aWxlcykge1xuICAgICAgICAgICAgaWYgKHRpbGUudHVybnNUb0hhcnZlc3QgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGlsZS50dXJuc1RvSGFydmVzdC0tO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobG93ZXJIYXJ2ZXN0cyAmJiB0aWxlLmhhcnZlc3RSYXRlID4gMCkge1xuICAgICAgICAgICAgICAgIHRpbGUuaGFydmVzdFJhdGUgLT0gdGhpcy5nYW1lLmxvd2VySGFydmVzdEFtb3VudDtcbiAgICAgICAgICAgICAgICBpZiAodGlsZS5oYXJ2ZXN0UmF0ZSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5oYXJ2ZXN0UmF0ZSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLW1ldGhvZHMgLS0+PlxufVxuIl19