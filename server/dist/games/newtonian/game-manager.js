"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
const utils_1 = require("~/utils");
// Scores a list of players for easy game win checking
const score = (players) => players
    .map((player) => ({ player, score: Math.max(player.heat, 1) * Math.max(player.pressure, 1) }))
    .sort((a, b) => b.score - a.score);
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Newtonian Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class NewtonianGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-22-Newtonian",
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
        // add logic here for before the current player's turn starts
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
        // clean up dead units
        this.updateArrays();
        // update units
        this.updateUnits();
        // add logic here after the current player's turn starts
        this.manageMaterials();
        // code spawning below this:
        // Number of units For the target player.
        const units = [0, 0, 0];
        // The player who to spawn for.
        const player = this.game.currentPlayer.opponent;
        // Iterate through all the player's units to find how many of each type there are.
        for (const u of player.units) {
            units[(u.job.title === this.game.jobs[0].title
                ? 0 : u.job.title === this.game.jobs[1].title ? 1 : 2)]++;
        }
        // If Intern Cap has not been met then try to spawn an Intern.
        if (this.game.internCap > units[0] && player.internSpawn <= 0) {
            if (this.spawnUnit(player, this.game.jobs[0])) {
                player.internSpawn = this.game.spawnTime;
            }
        }
        // If Physicist Cap has not been met then try to spawn an Physicist.
        if (this.game.physicistCap > units[1] && player.physicistSpawn <= 0) {
            if (this.spawnUnit(player, this.game.jobs[1])) {
                player.physicistSpawn = this.game.spawnTime;
            }
        }
        // If Manager Cap has not been met then try to spawn an Manager.
        if (this.game.managerCap > units[2] && player.managerSpawn <= 0) {
            if (this.spawnUnit(player, this.game.jobs[2])) {
                player.managerSpawn = this.game.spawnTime;
            }
        }
        // Manager Incrementing spawner Timers
        player.internSpawn = (units[0] >= this.game.internCap)
            ? this.game.spawnTime : player.internSpawn - 1;
        player.physicistSpawn = (units[1] >= this.game.physicistCap)
            ? this.game.spawnTime : player.physicistSpawn - 1;
        player.managerSpawn = (units[2] >= this.game.managerCap)
            ? this.game.spawnTime : player.managerSpawn - 1;
        // code the generator below this:
        // iterate through each tile on the map
        for (const tile of this.game.tiles) {
            // focus specifically on generator tiles owned by the current player
            if (tile.type === "generator" && tile.owner === this.game.currentPlayer) {
                // if the tile has redium or blueium, heat and pressure are increased accordingly
                // the redium and blueium is then removed from the map
                if (tile.redium > 0) {
                    this.game.currentPlayer.heat += (tile.redium * this.game.refinedValue);
                    tile.redium = 0;
                }
                if (tile.blueium > 0) {
                    this.game.currentPlayer.pressure += (tile.blueium * this.game.refinedValue);
                    tile.blueium = 0;
                }
                // if there's a unit on a generator tile...
                if (tile.unit !== undefined) {
                    // scores the refined materials on the unit before removing them
                    if (tile.unit.redium > 0) {
                        this.game.currentPlayer.heat += (tile.unit.redium * this.game.refinedValue);
                    }
                    tile.unit.redium = 0;
                    if (tile.unit.blueium > 0) {
                        this.game.currentPlayer.pressure += (tile.unit.blueium * this.game.refinedValue);
                    }
                    tile.unit.blueium = 0;
                    // if there's an enemy intern in your generator...
                    if (tile.unit.job.title === "intern" && tile.unit.owner !== this.game.currentPlayer) {
                        // the intern dies
                        tile.unit.health = 0;
                        // the player gains internium (+resources to both scores)
                        this.game.currentPlayer.pressure += ((tile.unit.blueium + 1) * this.game.refinedValue);
                        this.game.currentPlayer.heat += ((tile.unit.redium + 1) * this.game.refinedValue);
                    }
                    // RIP intern
                }
            }
        }
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
        const winners = score(this.game.players).filter((p) => p.score >= this.game.victoryAmount);
        // Add logic here checking for the primary win condition(s)
        if (winners.length === this.game.players.length) {
            this.secondaryWinConditions("Both players achieved fusion at the same time.");
            return true;
        }
        else if (winners.length === 1) {
            this.declareWinner("You achieved fusion!", winners[0].player);
            this.declareLosers("Your opponents achieved fusion.", winners[0].player.opponent);
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
        // Add logic here for the secondary win conditions
        const scored = score(this.game.players);
        if (scored[0].score !== scored[1].score) {
            this.declareWinner(`${reason}: You were closer to achieving fusion`, scored[0].player);
            this.declareLosers(`${reason}: Your opponent is closer to achieving fusion`, scored[1].player);
            return;
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    // any additional protected/private methods you need can be added here
    /**
     * Attempts to spawn in a unit for a given player.
     * @param player - The player that will own the unit.
     * @param job - The job of the unit.
     * @returns True if unit is spawned, otherwise returns false.
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
                tile.unit = this.create.unit({
                    acted: false,
                    health: job.health,
                    job,
                    owner: player,
                    tile,
                    moves: job.moves,
                });
                player.units.push(tile.unit);
                this.game.units.push(tile.unit);
                return true;
            }
        }
        // Return failure. We finished looking over all the spawn for Unit spawning.
        return false;
    }
    /**
     * conveyMaterials
     * This function moves materials and units on conveyor
     * @param conveyors - a list of conveyors.
     */
    conveyMaterials(conveyors) {
        for (let i = conveyors.length - 1; i >= 0; i--) {
            const tile = conveyors[i];
            let end = tile ? tile : undefined;
            if (tile.type === "conveyor" && tile.direction !== "blank") {
                if (tile.direction === "north") {
                    end = tile.tileNorth;
                }
                if (tile.direction === "east") {
                    end = tile.tileEast;
                }
                if (tile.direction === "south") {
                    end = tile.tileSouth;
                }
                if (tile.direction === "west") {
                    end = tile.tileWest;
                }
                if (!end) {
                    continue;
                }
                // Transfers materials
                end.rediumOre += tile.rediumOre;
                tile.rediumOre = 0;
                end.redium += tile.redium;
                tile.redium = 0;
                end.blueiumOre += tile.blueiumOre;
                tile.blueiumOre = 0;
                end.blueium += tile.blueium;
                tile.blueium = 0;
                // Moves units if they exist and the destination is unoccupied
                if (!end.unit && tile.unit) {
                    tile.unit.tile = end;
                    end.unit = tile.unit;
                    tile.unit = undefined;
                }
            }
        }
        return;
    }
    /**
     * Game-Manager Materials
     * This goes into the after turn function
     * Select the player who's turns it currently isn't, and spawn materials
     * on their side of the base.
     * Makes sure all conveyers move units and materials ontop of them.
     */
    manageMaterials() {
        // Spawns the appropriate ore at the start of the conveyor
        // on the side of the the player who's turns it currently isn't
        if (this.game.players[0] === this.game.currentPlayer) {
            this.game.players[0].conveyors[0].blueiumOre += this.game.materialSpawn;
        }
        else {
            this.game.players[1].conveyors[0].rediumOre += this.game.materialSpawn;
        }
        this.conveyMaterials(this.game.players[0].conveyors);
        this.conveyMaterials(this.game.players[1].conveyors);
        return;
    }
    /** Updates all arrays in the game with new/dead game objects */
    updateArrays() {
        // Properly remove all killed units
        const deadUnits = this.game.units.filter((u) => !u.tile || u.health <= 0);
        // remove dead units from all player's units list
        for (const player of this.game.players) {
            utils_1.removeElements(player.units, ...deadUnits);
        }
        // and remove them from the game
        utils_1.removeElements(this.game.units, ...deadUnits);
        // mark them dead
        for (const unit of deadUnits) {
            if (unit.tile) {
                unit.tile.unit = undefined;
                unit.tile = undefined;
            }
        }
    }
    /** Updates all units */
    updateUnits() {
        for (const unit of this.game.units) {
            if (unit.stunTime > 0) {
                unit.stunTime--;
            }
            if (unit.stunImmune > 0) {
                unit.stunImmune--;
            }
            if (!unit.owner || unit.owner === this.game.currentPlayer) {
                unit.acted = false;
                unit.moves = unit.attacked ? unit.job.moves + 1 : unit.job.moves;
            }
            unit.attacked = false;
            if (unit.tile && unit.tile.owner === unit.owner) {
                unit.health += Math.ceil(unit.job.health * this.game.regenerateRate);
                if (unit.health > unit.job.health) {
                    unit.health = unit.job.health;
                }
            }
        }
    }
}
exports.NewtonianGameManager = NewtonianGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL25ld3Rvbmlhbi9nYW1lLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2RUFBNkU7QUFDN0UsYUFBYTtBQUNiLHlCQUE0RTtBQUU1RSxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLG1DQUF5QztBQUt6QyxzREFBc0Q7QUFDdEQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxPQUFpQixFQUFFLEVBQUUsQ0FBQyxPQUFPO0tBQ3ZDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDN0YsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsa0NBQWtDO0FBRWxDOzs7OztHQUtHO0FBQ0gsTUFBYSxvQkFBcUIsU0FBUSxjQUFXLENBQUMsV0FBVztJQUM3RCxpRUFBaUU7SUFDMUQsTUFBTSxLQUFLLE9BQU87UUFDckIsT0FBTztZQUNILGlDQUFpQztZQUNqQywwQkFBMEI7U0FFN0IsQ0FBQztJQUNOLENBQUM7SUFRRCx3Q0FBd0M7SUFFeEMsMkRBQTJEO0lBRTNELHlDQUF5QztJQUV6Qzs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFVBQVU7UUFDdEIsTUFBTSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFekIscUNBQXFDO1FBQ3JDLDZEQUE2RDtRQUU3RCxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxLQUFL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LENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ3JCO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdkQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzthQUNwRTtZQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM3QyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDckUsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2lCQUNqQzthQUNKO1NBQ0o7SUFDTCxDQUFDO0NBRUo7QUF2VkQsb0RBdVZDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGlzIHdoZXJlIHlvdSBzaG91bGQgcHV0IGxvZ2ljIHRvIGNvbnRyb2wgdGhlIGdhbWUgYW5kIGV2ZXJ5dGhpbmdcbi8vIGFyb3VuZCBpdC5cbmltcG9ydCB7IEJhc2VDbGFzc2VzLCBOZXd0b25pYW5HYW1lLCBOZXd0b25pYW5HYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbmltcG9ydCB7IHJlbW92ZUVsZW1lbnRzIH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IEpvYiB9IGZyb20gXCIuL2pvYlwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuXG4vLyBTY29yZXMgYSBsaXN0IG9mIHBsYXllcnMgZm9yIGVhc3kgZ2FtZSB3aW4gY2hlY2tpbmdcbmNvbnN0IHNjb3JlID0gKHBsYXllcnM6IFBsYXllcltdKSA9PiBwbGF5ZXJzXG4gICAgLm1hcCgocGxheWVyKSA9PiAoeyBwbGF5ZXIsIHNjb3JlOiBNYXRoLm1heChwbGF5ZXIuaGVhdCwgMSkgKiBNYXRoLm1heChwbGF5ZXIucHJlc3N1cmUsIDEpIH0pKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSk7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgZ2FtZSBsb2dpYyBhcm91bmQgdGhlIE5ld3RvbmlhbiBHYW1lLlxuICogVGhpcyBpcyB3aGVyZSB5b3UgY291bGQgZG8gbG9naWMgZm9yIGNoZWNraW5nIGlmIHRoZSBnYW1lIGlzIG92ZXIsIHVwZGF0ZVxuICogdGhlIGdhbWUgYmV0d2VlbiB0dXJucywgYW5kIGFueXRoaW5nIHRoYXQgdGllcyBhbGwgdGhlIFwic3R1ZmZcIiBpbiB0aGUgZ2FtZVxuICogdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXd0b25pYW5HYW1lTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVNYW5hZ2VyIHtcbiAgICAvKiogT3RoZXIgc3RyaW5ncyAoY2FzZSBpbnNlbnNpdGl2ZSkgdGhhdCBjYW4gYmUgdXNlZCBhcyBhbiBJRCAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGFsaWFzZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgICAgICBcIk1lZ2FNaW5lckFJLTIyLU5ld3RvbmlhblwiLFxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICBdO1xuICAgIH1cblxuICAgIC8qKiBUaGUgZ2FtZSB0aGlzIEdhbWVNYW5hZ2VyIGlzIG1hbmFnaW5nICovXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWUhOiBOZXd0b25pYW5HYW1lO1xuXG4gICAgLyoqIFRoZSBmYWN0b3J5IHRoYXQgbXVzdCBiZSB1c2VkIHRvIGluaXRpYWxpemUgbmV3IGdhbWUgb2JqZWN0cyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmVhdGUhOiBOZXd0b25pYW5HYW1lT2JqZWN0RmFjdG9yeTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8vIGFueSBhZGRpdGlvbmFsIHB1YmxpYyBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQkVGT1JFIGVhY2ggcGxheWVyJ3MgcnVuVHVuIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgICAqIChpbmNsdWRpbmcgdGhlIGZpcnN0IHR1cm4pLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGdldCB0aGVpciBwbGF5ZXIgcmVhZHkgZm9yIHRoZWlyIHR1cm4uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGJlZm9yZVR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmJlZm9yZVR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG4gICAgICAgIC8vIGFkZCBsb2dpYyBoZXJlIGZvciBiZWZvcmUgdGhlIGN1cnJlbnQgcGxheWVyJ3MgdHVybiBzdGFydHNcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEFGVEVSIGVhY2ggcGxheWVyJ3MgdHVybiBlbmRzLiBCZWZvcmUgdGhlIHR1cm4gY291bnRlclxuICAgICAqIGluY3JlYXNlcy5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBlbmQtb2YtdHVybiBlZmZlY3RzLCBhbmQgY2xlYW4gdXAgYXJyYXlzLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBhZnRlclR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmFmdGVyVHVybigpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgICAgICAvLyBjbGVhbiB1cCBkZWFkIHVuaXRzXG4gICAgICAgIHRoaXMudXBkYXRlQXJyYXlzKCk7XG4gICAgICAgIC8vIHVwZGF0ZSB1bml0c1xuICAgICAgICB0aGlzLnVwZGF0ZVVuaXRzKCk7XG4gICAgICAgIC8vIGFkZCBsb2dpYyBoZXJlIGFmdGVyIHRoZSBjdXJyZW50IHBsYXllcidzIHR1cm4gc3RhcnRzXG4gICAgICAgIHRoaXMubWFuYWdlTWF0ZXJpYWxzKCk7XG4gICAgICAgIC8vIGNvZGUgc3Bhd25pbmcgYmVsb3cgdGhpczpcbiAgICAgICAgLy8gTnVtYmVyIG9mIHVuaXRzIEZvciB0aGUgdGFyZ2V0IHBsYXllci5cbiAgICAgICAgY29uc3QgdW5pdHMgPSBbMCwgMCwgMF07XG4gICAgICAgIC8vIFRoZSBwbGF5ZXIgd2hvIHRvIHNwYXduIGZvci5cbiAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIub3Bwb25lbnQ7XG5cbiAgICAgICAgLy8gSXRlcmF0ZSB0aHJvdWdoIGFsbCB0aGUgcGxheWVyJ3MgdW5pdHMgdG8gZmluZCBob3cgbWFueSBvZiBlYWNoIHR5cGUgdGhlcmUgYXJlLlxuICAgICAgICBmb3IgKGNvbnN0IHUgb2YgcGxheWVyLnVuaXRzKSB7XG4gICAgICAgICAgICB1bml0c1soXG4gICAgICAgICAgICAgICAgdS5qb2IudGl0bGUgPT09IHRoaXMuZ2FtZS5qb2JzWzBdLnRpdGxlXG4gICAgICAgICAgICAgICAgPyAwIDogdS5qb2IudGl0bGUgPT09IHRoaXMuZ2FtZS5qb2JzWzFdLnRpdGxlID8gMSA6IDJcbiAgICAgICAgICAgICldKys7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBJbnRlcm4gQ2FwIGhhcyBub3QgYmVlbiBtZXQgdGhlbiB0cnkgdG8gc3Bhd24gYW4gSW50ZXJuLlxuICAgICAgICBpZiAodGhpcy5nYW1lLmludGVybkNhcCA+IHVuaXRzWzBdICYmIHBsYXllci5pbnRlcm5TcGF3biA8PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGF3blVuaXQocGxheWVyLCB0aGlzLmdhbWUuam9ic1swXSkpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuaW50ZXJuU3Bhd24gPSB0aGlzLmdhbWUuc3Bhd25UaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgUGh5c2ljaXN0IENhcCBoYXMgbm90IGJlZW4gbWV0IHRoZW4gdHJ5IHRvIHNwYXduIGFuIFBoeXNpY2lzdC5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5waHlzaWNpc3RDYXAgPiB1bml0c1sxXSAmJiBwbGF5ZXIucGh5c2ljaXN0U3Bhd24gPD0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3Bhd25Vbml0KHBsYXllciwgdGhpcy5nYW1lLmpvYnNbMV0pKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyLnBoeXNpY2lzdFNwYXduID0gdGhpcy5nYW1lLnNwYXduVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIE1hbmFnZXIgQ2FwIGhhcyBub3QgYmVlbiBtZXQgdGhlbiB0cnkgdG8gc3Bhd24gYW4gTWFuYWdlci5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5tYW5hZ2VyQ2FwID4gdW5pdHNbMl0gJiYgcGxheWVyLm1hbmFnZXJTcGF3biA8PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGF3blVuaXQocGxheWVyLCB0aGlzLmdhbWUuam9ic1syXSkpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIubWFuYWdlclNwYXduID0gdGhpcy5nYW1lLnNwYXduVGltZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1hbmFnZXIgSW5jcmVtZW50aW5nIHNwYXduZXIgVGltZXJzXG5cbiAgICAgICAgcGxheWVyLmludGVyblNwYXduID0gKHVuaXRzWzBdID49IHRoaXMuZ2FtZS5pbnRlcm5DYXApXG4gICAgICAgICAgPyB0aGlzLmdhbWUuc3Bhd25UaW1lIDogcGxheWVyLmludGVyblNwYXduIC0gMTtcbiAgICAgICAgcGxheWVyLnBoeXNpY2lzdFNwYXduID0gKHVuaXRzWzFdID49IHRoaXMuZ2FtZS5waHlzaWNpc3RDYXApXG4gICAgICAgICAgPyB0aGlzLmdhbWUuc3Bhd25UaW1lIDogcGxheWVyLnBoeXNpY2lzdFNwYXduIC0gMTtcbiAgICAgICAgcGxheWVyLm1hbmFnZXJTcGF3biA9ICh1bml0c1syXSA+PSB0aGlzLmdhbWUubWFuYWdlckNhcClcbiAgICAgICAgID8gdGhpcy5nYW1lLnNwYXduVGltZSA6IHBsYXllci5tYW5hZ2VyU3Bhd24gLSAxO1xuXG4gICAgICAgIC8vIGNvZGUgdGhlIGdlbmVyYXRvciBiZWxvdyB0aGlzOlxuICAgICAgICAvLyBpdGVyYXRlIHRocm91Z2ggZWFjaCB0aWxlIG9uIHRoZSBtYXBcbiAgICAgICAgZm9yIChjb25zdCB0aWxlIG9mIHRoaXMuZ2FtZS50aWxlcykge1xuICAgICAgICAgICAgLy8gZm9jdXMgc3BlY2lmaWNhbGx5IG9uIGdlbmVyYXRvciB0aWxlcyBvd25lZCBieSB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgICAgIGlmICh0aWxlLnR5cGUgPT09IFwiZ2VuZXJhdG9yXCIgJiYgdGlsZS5vd25lciA9PT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgdGlsZSBoYXMgcmVkaXVtIG9yIGJsdWVpdW0sIGhlYXQgYW5kIHByZXNzdXJlIGFyZSBpbmNyZWFzZWQgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgICAvLyB0aGUgcmVkaXVtIGFuZCBibHVlaXVtIGlzIHRoZW4gcmVtb3ZlZCBmcm9tIHRoZSBtYXBcbiAgICAgICAgICAgICAgICBpZiAodGlsZS5yZWRpdW0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLmhlYXQgKz0gKHRpbGUucmVkaXVtICogdGhpcy5nYW1lLnJlZmluZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUucmVkaXVtID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUuYmx1ZWl1bSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIucHJlc3N1cmUgKz0gKHRpbGUuYmx1ZWl1bSAqIHRoaXMuZ2FtZS5yZWZpbmVkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB0aWxlLmJsdWVpdW0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSdzIGEgdW5pdCBvbiBhIGdlbmVyYXRvciB0aWxlLi4uXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUudW5pdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNjb3JlcyB0aGUgcmVmaW5lZCBtYXRlcmlhbHMgb24gdGhlIHVuaXQgYmVmb3JlIHJlbW92aW5nIHRoZW1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGUudW5pdC5yZWRpdW0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY3VycmVudFBsYXllci5oZWF0ICs9ICh0aWxlLnVuaXQucmVkaXVtICogdGhpcy5nYW1lLnJlZmluZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGlsZS51bml0LnJlZGl1bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aWxlLnVuaXQuYmx1ZWl1bSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLnByZXNzdXJlICs9ICh0aWxlLnVuaXQuYmx1ZWl1bSAqIHRoaXMuZ2FtZS5yZWZpbmVkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRpbGUudW5pdC5ibHVlaXVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUncyBhbiBlbmVteSBpbnRlcm4gaW4geW91ciBnZW5lcmF0b3IuLi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGUudW5pdC5qb2IudGl0bGUgPT09IFwiaW50ZXJuXCIgJiYgdGlsZS51bml0Lm93bmVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGludGVybiBkaWVzXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLnVuaXQuaGVhbHRoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBwbGF5ZXIgZ2FpbnMgaW50ZXJuaXVtICgrcmVzb3VyY2VzIHRvIGJvdGggc2NvcmVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIucHJlc3N1cmUgKz0gKCh0aWxlLnVuaXQuYmx1ZWl1bSArIDEpICogdGhpcy5nYW1lLnJlZmluZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY3VycmVudFBsYXllci5oZWF0ICs9ICgodGlsZS51bml0LnJlZGl1bSArIDEpICogdGhpcy5nYW1lLnJlZmluZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gUklQIGludGVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWZ0ZXItdHVybiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnYW1lIGlzIG92ZXIgaW4gYmV0d2VlbiB0dXJucy5cbiAgICAgKiBUaGlzIGlzIGludm9rZWQgQUZURVIgYWZ0ZXJUdXJuKCkgaXMgY2FsbGVkLCBidXQgQkVGT1JFIGJlZm9yZVR1cm4oKVxuICAgICAqIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGdhbWUgaXMgaW5kZWVkIG92ZXIsIG90aGVyd2lzZSBpZiB0aGUgZ2FtZVxuICAgICAqIHNob3VsZCBjb250aW51ZSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHByaW1hcnlXaW5Db25kaXRpb25zQ2hlY2soKTogYm9vbGVhbiB7XG4gICAgICAgIHN1cGVyLnByaW1hcnlXaW5Db25kaXRpb25zQ2hlY2soKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cbiAgICAgICAgY29uc3Qgd2lubmVycyA9IHNjb3JlKHRoaXMuZ2FtZS5wbGF5ZXJzKS5maWx0ZXIoKHApID0+IHAuc2NvcmUgPj0gdGhpcy5nYW1lLnZpY3RvcnlBbW91bnQpO1xuXG4gICAgICAgIC8vIEFkZCBsb2dpYyBoZXJlIGNoZWNraW5nIGZvciB0aGUgcHJpbWFyeSB3aW4gY29uZGl0aW9uKHMpXG4gICAgICAgIGlmICh3aW5uZXJzLmxlbmd0aCA9PT0gdGhpcy5nYW1lLnBsYXllcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXCJCb3RoIHBsYXllcnMgYWNoaWV2ZWQgZnVzaW9uIGF0IHRoZSBzYW1lIHRpbWUuXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh3aW5uZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFwiWW91IGFjaGlldmVkIGZ1c2lvbiFcIiwgd2lubmVyc1swXS5wbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKFwiWW91ciBvcHBvbmVudHMgYWNoaWV2ZWQgZnVzaW9uLlwiLCB3aW5uZXJzWzBdLnBsYXllci5vcHBvbmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuICAgICAgICAvLyBBZGQgbG9naWMgaGVyZSBmb3IgdGhlIHNlY29uZGFyeSB3aW4gY29uZGl0aW9uc1xuICAgICAgICBjb25zdCBzY29yZWQgPSBzY29yZSh0aGlzLmdhbWUucGxheWVycyk7XG4gICAgICAgIGlmIChzY29yZWRbMF0uc2NvcmUgIT09IHNjb3JlZFsxXS5zY29yZSkge1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn06IFlvdSB3ZXJlIGNsb3NlciB0byBhY2hpZXZpbmcgZnVzaW9uYCwgc2NvcmVkWzBdLnBsYXllcik7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoYCR7cmVhc29ufTogWW91ciBvcHBvbmVudCBpcyBjbG9zZXIgdG8gYWNoaWV2aW5nIGZ1c2lvbmAsIHNjb3JlZFsxXS5wbGF5ZXIpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNlY29uZGFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGVuZCB0aGUgZ2FtZS5cbiAgICAgICAgLy8gSWYgbm8gd2lubmVyIGl0IGRldGVybWluZWQgYWJvdmUsIHRoZW4gYSByYW5kb20gb25lIHdpbGwgYmUgY2hvc2VuLlxuICAgICAgICBzdXBlci5zZWNvbmRhcnlXaW5Db25kaXRpb25zKHJlYXNvbik7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQvcHJpdmF0ZSBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBzcGF3biBpbiBhIHVuaXQgZm9yIGEgZ2l2ZW4gcGxheWVyLlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgd2lsbCBvd24gdGhlIHVuaXQuXG4gICAgICogQHBhcmFtIGpvYiAtIFRoZSBqb2Igb2YgdGhlIHVuaXQuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB1bml0IGlzIHNwYXduZWQsIG90aGVyd2lzZSByZXR1cm5zIGZhbHNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBzcGF3blVuaXQocGxheWVyOiBQbGF5ZXIsIGpvYjogSm9iKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIHBsYXllcidzIHNwYXduIHRpbGVzIHRvIGZpbmQgYSBzcG90IHRvIHNwYXduIHVuaXQuXG4gICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiBwbGF5ZXIuc3Bhd25UaWxlcykge1xuICAgICAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZXJlIGlzIGEgVW5pdCBvbiB0aGUgdGlsZS5cbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG1vdmUgb24gdG8gdGhlIG5leHQgdGlsZS5cbiAgICAgICAgICAgIGlmICh0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEVsc2Ugc3Bhd24gaW4gVW5pdCBhbmQgcmV0dXJuIHN1Y2Nlc3MgdG8gc3Bhd25pbmcuXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aWxlLnVuaXQgPSB0aGlzLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICAgICAgYWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBoZWFsdGg6IGpvYi5oZWFsdGgsXG4gICAgICAgICAgICAgICAgICAgIGpvYixcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHBsYXllcixcbiAgICAgICAgICAgICAgICAgICAgdGlsZSxcbiAgICAgICAgICAgICAgICAgICAgbW92ZXM6IGpvYi5tb3ZlcyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudW5pdHMucHVzaCh0aWxlLnVuaXQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS51bml0cy5wdXNoKHRpbGUudW5pdCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBmYWlsdXJlLiBXZSBmaW5pc2hlZCBsb29raW5nIG92ZXIgYWxsIHRoZSBzcGF3biBmb3IgVW5pdCBzcGF3bmluZy5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnZleU1hdGVyaWFsc1xuICAgICAqIFRoaXMgZnVuY3Rpb24gbW92ZXMgbWF0ZXJpYWxzIGFuZCB1bml0cyBvbiBjb252ZXlvclxuICAgICAqIEBwYXJhbSBjb252ZXlvcnMgLSBhIGxpc3Qgb2YgY29udmV5b3JzLlxuICAgICAqL1xuICAgIHByaXZhdGUgY29udmV5TWF0ZXJpYWxzKGNvbnZleW9yczogVGlsZVtdKTogdm9pZCB7XG4gICAgICAgIGZvciAobGV0IGkgPSBjb252ZXlvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbGUgPSBjb252ZXlvcnNbaV07XG4gICAgICAgICAgICBsZXQgZW5kOiBUaWxlIHwgdW5kZWZpbmVkID0gdGlsZSA/IHRpbGUgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAodGlsZS50eXBlID09PSBcImNvbnZleW9yXCIgJiYgdGlsZS5kaXJlY3Rpb24gIT09IFwiYmxhbmtcIikge1xuICAgICAgICAgICAgICAgIGlmICh0aWxlLmRpcmVjdGlvbiA9PT0gXCJub3J0aFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IHRpbGUudGlsZU5vcnRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGlsZS5kaXJlY3Rpb24gPT09IFwiZWFzdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IHRpbGUudGlsZUVhc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aWxlLmRpcmVjdGlvbiA9PT0gXCJzb3V0aFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IHRpbGUudGlsZVNvdXRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGlsZS5kaXJlY3Rpb24gPT09IFwid2VzdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IHRpbGUudGlsZVdlc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFRyYW5zZmVycyBtYXRlcmlhbHNcbiAgICAgICAgICAgICAgICBlbmQucmVkaXVtT3JlICs9IHRpbGUucmVkaXVtT3JlO1xuICAgICAgICAgICAgICAgIHRpbGUucmVkaXVtT3JlID0gMDtcbiAgICAgICAgICAgICAgICBlbmQucmVkaXVtICs9IHRpbGUucmVkaXVtO1xuICAgICAgICAgICAgICAgIHRpbGUucmVkaXVtID0gMDtcbiAgICAgICAgICAgICAgICBlbmQuYmx1ZWl1bU9yZSArPSB0aWxlLmJsdWVpdW1PcmU7XG4gICAgICAgICAgICAgICAgdGlsZS5ibHVlaXVtT3JlID0gMDtcbiAgICAgICAgICAgICAgICBlbmQuYmx1ZWl1bSArPSB0aWxlLmJsdWVpdW07XG4gICAgICAgICAgICAgICAgdGlsZS5ibHVlaXVtID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIE1vdmVzIHVuaXRzIGlmIHRoZXkgZXhpc3QgYW5kIHRoZSBkZXN0aW5hdGlvbiBpcyB1bm9jY3VwaWVkXG4gICAgICAgICAgICAgICAgaWYgKCFlbmQudW5pdCAmJiB0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZS51bml0LnRpbGUgPSBlbmQ7XG4gICAgICAgICAgICAgICAgICAgIGVuZC51bml0ID0gdGlsZS51bml0O1xuICAgICAgICAgICAgICAgICAgICB0aWxlLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdhbWUtTWFuYWdlciBNYXRlcmlhbHNcbiAgICAgKiBUaGlzIGdvZXMgaW50byB0aGUgYWZ0ZXIgdHVybiBmdW5jdGlvblxuICAgICAqIFNlbGVjdCB0aGUgcGxheWVyIHdobydzIHR1cm5zIGl0IGN1cnJlbnRseSBpc24ndCwgYW5kIHNwYXduIG1hdGVyaWFsc1xuICAgICAqIG9uIHRoZWlyIHNpZGUgb2YgdGhlIGJhc2UuXG4gICAgICogTWFrZXMgc3VyZSBhbGwgY29udmV5ZXJzIG1vdmUgdW5pdHMgYW5kIG1hdGVyaWFscyBvbnRvcCBvZiB0aGVtLlxuICAgICAqL1xuICAgIHByaXZhdGUgbWFuYWdlTWF0ZXJpYWxzKCk6IHZvaWQge1xuXG4gICAgICAgIC8vIFNwYXducyB0aGUgYXBwcm9wcmlhdGUgb3JlIGF0IHRoZSBzdGFydCBvZiB0aGUgY29udmV5b3JcbiAgICAgICAgLy8gb24gdGhlIHNpZGUgb2YgdGhlIHRoZSBwbGF5ZXIgd2hvJ3MgdHVybnMgaXQgY3VycmVudGx5IGlzbid0XG4gICAgICAgIGlmICh0aGlzLmdhbWUucGxheWVyc1swXSA9PT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLmNvbnZleW9yc1swXS5ibHVlaXVtT3JlICs9IHRoaXMuZ2FtZS5tYXRlcmlhbFNwYXduO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnNbMV0uY29udmV5b3JzWzBdLnJlZGl1bU9yZSArPSB0aGlzLmdhbWUubWF0ZXJpYWxTcGF3bjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbnZleU1hdGVyaWFscyh0aGlzLmdhbWUucGxheWVyc1swXS5jb252ZXlvcnMpO1xuICAgICAgICB0aGlzLmNvbnZleU1hdGVyaWFscyh0aGlzLmdhbWUucGxheWVyc1sxXS5jb252ZXlvcnMpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiogVXBkYXRlcyBhbGwgYXJyYXlzIGluIHRoZSBnYW1lIHdpdGggbmV3L2RlYWQgZ2FtZSBvYmplY3RzICovXG4gICAgcHJpdmF0ZSB1cGRhdGVBcnJheXMoKTogdm9pZCB7XG4gICAgICAgIC8vIFByb3Blcmx5IHJlbW92ZSBhbGwga2lsbGVkIHVuaXRzXG4gICAgICAgIGNvbnN0IGRlYWRVbml0cyA9IHRoaXMuZ2FtZS51bml0cy5maWx0ZXIoKHUpID0+ICF1LnRpbGUgfHwgdS5oZWFsdGggPD0gMCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGRlYWQgdW5pdHMgZnJvbSBhbGwgcGxheWVyJ3MgdW5pdHMgbGlzdFxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLmdhbWUucGxheWVycykge1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHMocGxheWVyLnVuaXRzLCAuLi5kZWFkVW5pdHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBnYW1lXG4gICAgICAgIHJlbW92ZUVsZW1lbnRzKHRoaXMuZ2FtZS51bml0cywgLi4uZGVhZFVuaXRzKTtcbiAgICAgICAgIC8vIG1hcmsgdGhlbSBkZWFkXG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiBkZWFkVW5pdHMpIHtcbiAgICAgICAgICAgIGlmICh1bml0LnRpbGUpIHtcbiAgICAgICAgICAgICAgICB1bml0LnRpbGUudW5pdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB1bml0LnRpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogVXBkYXRlcyBhbGwgdW5pdHMgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVVuaXRzKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnVuaXRzKSB7XG4gICAgICAgICAgICBpZiAodW5pdC5zdHVuVGltZSA+IDApIHtcbiAgICAgICAgICAgICAgICB1bml0LnN0dW5UaW1lLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodW5pdC5zdHVuSW1tdW5lID4gMCkge1xuICAgICAgICAgICAgICAgIHVuaXQuc3R1bkltbXVuZS0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF1bml0Lm93bmVyIHx8IHVuaXQub3duZXIgPT09IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdW5pdC5hY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVuaXQubW92ZXMgPSB1bml0LmF0dGFja2VkID8gdW5pdC5qb2IubW92ZXMgKyAxIDogdW5pdC5qb2IubW92ZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bml0LmF0dGFja2VkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAodW5pdC50aWxlICYmIHVuaXQudGlsZS5vd25lciA9PT0gdW5pdC5vd25lcikge1xuICAgICAgICAgICAgICAgIHVuaXQuaGVhbHRoICs9IE1hdGguY2VpbCh1bml0LmpvYi5oZWFsdGggKiB0aGlzLmdhbWUucmVnZW5lcmF0ZVJhdGUpO1xuICAgICAgICAgICAgICAgIGlmICh1bml0LmhlYWx0aCA+IHVuaXQuam9iLmhlYWx0aCkge1xuICAgICAgICAgICAgICAgICAgICB1bml0LmhlYWx0aCA9IHVuaXQuam9iLmhlYWx0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLW1ldGhvZHMgLS0+PlxufVxuIl19