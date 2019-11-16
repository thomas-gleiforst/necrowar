"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Stumped Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class StumpedGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-19-Stumped",
            "MegaMiner-AI-19-Stumped",
        ];
    }
    // <<-- Creer-Merge: public-methods -->>
    /**
     * Cleans up the beavers arrays removing dead ones and adding new ones
     * to their appropriate Beaver arrays.
     */
    cleanupArrays() {
        // add all the new beavers to this.beavers
        for (const newBeaver of this.game.newBeavers) {
            this.game.beavers.push(newBeaver);
            newBeaver.owner.beavers.push(newBeaver);
        }
        // and empty out the `this.newBeavers` array as they are no longer new and have been added above
        this.game.newBeavers.length = 0;
        // Clone of array so we can remove them from the actual array and not
        // fuck up loop iteration
        const allBeavers = this.game.beavers.slice();
        // remove all beavers from the game that died
        for (const beaver of allBeavers) {
            if (beaver.health <= 0) {
                // poor beaver died, remove it from arrays
                utils_1.removeElements(beaver.owner.beavers, beaver);
                utils_1.removeElements(this.game.beavers, beaver);
            }
            else if (beaver.tile) {
                beaver.tile.beaver = beaver;
            }
        }
    }
    // <<-- /Creer-Merge: public-methods -->>
    /**
     * This is called BEFORE each player's runTun function is called
     * (including the first turn).
     * This is a good place to get their player ready for their turn.
     */
    async beforeTurn() {
        await super.beforeTurn();
        // <<-- Creer-Merge: before-turn -->>
        this.cleanupArrays();
        // finish recruiting any new beavers
        for (const beaver of this.game.currentPlayer.beavers) {
            beaver.recruited = true;
        }
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
        this.cleanupArrays();
        this.updateBeavers();
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
        // Check if a player has created 10 lodges (they are built instantly)
        // Check if this.maxTurns turns have passed, and if so, in this order:
        // - Player has been made extinct (all beavers & lodges destroyed)
        // - Player with most lodges wins
        // - Player with most branches wins
        // - Player with most food wins
        // - Random player wins
        const players = this.game.players.slice();
        const extinctPlayers = players.filter((p) => (p.beavers.length === 0 && p.lodges.length === 0));
        if (extinctPlayers.length > 0) {
            // Someone lost via extermination, so the game is over.
            if (extinctPlayers.length === this.game.players.length) {
                // they both somehow killed everything, so the board is empty. Win via coin flip
                this.secondaryWinConditions("Both Players exterminated on the same turn");
            }
            else {
                // all exterminated players lost
                const loser = extinctPlayers[0];
                this.declareWinner("Drove opponent to extinction", loser.opponent);
                this.declareLoser("Extinct - All Beavers and lodges destroyed", loser);
                this.endGame();
            }
            return true;
        }
        players.sort((a, b) => b.lodges.length - a.lodges.length);
        if (this.game.currentTurn % 2 === 1) {
            // round end, check for primary win condition
            if (players[0].lodges.length >= this.game.lodgesToWin) {
                if (players[0].lodges.length === players[1].lodges.length) {
                    // Then both players completed the same number of lodges by
                    // the end of this round, do secondary win conditions.
                    this.secondaryWinConditions("Lodges complete on the same round");
                }
                else {
                    // someone won
                    const winner = players[0];
                    const loser = players[1];
                    this.declareWinner(`Reached ${winner.lodges.length}/${this.game.lodgesToWin} lodges!`, winner);
                    this.declareLoser("Less lodges than winner who reached completed all lodges", loser);
                    this.endGame();
                }
                return true;
            }
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
        const players = this.game.players.slice().sort((p1, p2) => p2.lodges.length - p1.lodges.length);
        // check if someone won by having more lodges
        if (players[0].lodges.length !== players[1].lodges.length) {
            const winner = players[0];
            const loser = players[1];
            this.declareWinner(`${reason} - Has the most lodges (${winner.lodges.length})`, winner);
            this.declareLoser(`${reason} - Less lodges than opponent`, loser);
            this.endGame();
            return;
        }
        // check if someone won by having more branches or food
        for (const resource of ["branches", "food"]) {
            /**
             * counts the number of resources a player has
             *
             * @param p - player to count for
             * @returns the count f resource
             */
            const count = (p) => (p.lodges
                .map((m) => m[resource])
                .reduce((acc, val) => acc + val, 0));
            const player0Count = count(players[0]);
            const player1Count = count(players[1]);
            if (player0Count !== player1Count) {
                const winner = players[player0Count > player1Count ? 0 : 1];
                const winnerCount = Math.max(player0Count, player1Count);
                const looserCount = Math.min(player0Count, player1Count);
                this.declareWinner(`${reason} - Has more ${resource} than opponent (${winnerCount})`, winner);
                this.declareLoser(`${reason} - Less ${resource} than winner (${looserCount})`, winner.opponent);
                this.endGame();
                return;
            }
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    /**
     * Updates the beavers variables. Must be called after their array is
     * cleaned up.
     */
    updateBeavers() {
        for (const beaver of this.game.beavers) {
            // If they are distracted
            if (beaver.turnsDistracted > 0) {
                beaver.turnsDistracted--; // decrement the turns count
            }
            // reset their actions/moves for next turn
            beaver.actions = beaver.job.actions;
            beaver.moves = beaver.job.moves;
        }
    }
    /**
     * Updates the resources by moving them down water and such
     */
    updateResources() {
        const newResources = new Map();
        for (const tile of this.game.tiles) {
            // Keep resources here
            if (!newResources.has(tile)) {
                newResources.set(tile, {
                    branches: 0,
                    food: 0,
                });
            }
            let resources = newResources.get(tile);
            if (!tile.lodgeOwner && tile.type === "water" && tile.flowDirection) {
                const nextTile = tile.getNeighbor(tile.flowDirection);
                if (!nextTile) {
                    continue;
                }
                if (!newResources.has(nextTile)) {
                    newResources.set(nextTile, {
                        branches: 0,
                        food: 0,
                    });
                }
                resources = newResources.get(nextTile);
            }
            // Else, keep resources here
            if (!resources) {
                throw new Error(`Could not update resources for tile ${tile}`);
            }
            resources.branches += tile.branches;
            resources.food += tile.food;
            // Spawn new resources
            if (tile.spawner) {
                if (tile.spawner.hasBeenHarvested) {
                    tile.spawner.harvestCooldown--;
                    if (tile.spawner.harvestCooldown === 0) {
                        tile.spawner.hasBeenHarvested = false;
                    }
                }
                else if (tile.spawner.health < this.game.settings.maxSpawnerHealth) {
                    tile.spawner.health++;
                }
            }
        }
        // Move resources
        for (const tile of this.game.tiles) {
            const resources = newResources.get(tile);
            if (resources) {
                tile.branches = resources.branches;
                tile.food = resources.food;
            }
        }
    }
}
exports.StumpedGameManager = StumpedGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3N0dW1wZWQvZ2FtZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkVBQTZFO0FBQzdFLGFBQWE7QUFDYix5QkFBd0U7QUFFeEUsaUNBQWlDO0FBQ2pDLG1DQUF5QztBQUd6QyxrQ0FBa0M7QUFFbEM7Ozs7O0dBS0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLGNBQVcsQ0FBQyxXQUFXO0lBQzNELGlFQUFpRTtJQUMxRCxNQUFNLEtBQUssT0FBTztRQUNyQixPQUFPO1lBQ0gsaUNBQWlDO1lBQ2pDLHdCQUF3QjtZQUN4Qix5QkFBeUI7U0FFNUIsQ0FBQztJQUNOLENBQUM7SUFRRCx3Q0FBd0M7SUFFeEM7OztPQUdHO0lBQ0ksYUFBYTtRQUNoQiwwQ0FBMEM7UUFDMUMsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsZ0dBQWdHO1FBQ2hHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFL0IscUVBQXFFO1FBQ3JFLHlCQUF5QjtRQUMxQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3Qyw2Q0FBNkM7UUFDN0MsS0FBSyxNQUFNLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDN0IsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDcEIsMENBQTBDO2dCQUMxQyxzQkFBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMs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ZSxFQUFFLENBQUM7b0JBRS9CLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEtBQUssQ0FBQyxFQUFFO3dCQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztxQkFDekM7aUJBQ0o7cUJBQ0ksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDekI7YUFDSjtTQUNKO1FBRUQsaUJBQWlCO1FBQ2pCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEMsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxJQUFJLFNBQVMsRUFBRTtnQkFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQzthQUM5QjtTQUNKO0lBQ0wsQ0FBQztDQUdKO0FBL1RELGdEQStUQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBpcyB3aGVyZSB5b3Ugc2hvdWxkIHB1dCBsb2dpYyB0byBjb250cm9sIHRoZSBnYW1lIGFuZCBldmVyeXRoaW5nXG4vLyBhcm91bmQgaXQuXG5pbXBvcnQgeyBCYXNlQ2xhc3NlcywgU3R1bXBlZEdhbWUsIFN0dW1wZWRHYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IHJlbW92ZUVsZW1lbnRzIH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBnYW1lIGxvZ2ljIGFyb3VuZCB0aGUgU3R1bXBlZCBHYW1lLlxuICogVGhpcyBpcyB3aGVyZSB5b3UgY291bGQgZG8gbG9naWMgZm9yIGNoZWNraW5nIGlmIHRoZSBnYW1lIGlzIG92ZXIsIHVwZGF0ZVxuICogdGhlIGdhbWUgYmV0d2VlbiB0dXJucywgYW5kIGFueXRoaW5nIHRoYXQgdGllcyBhbGwgdGhlIFwic3R1ZmZcIiBpbiB0aGUgZ2FtZVxuICogdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHVtcGVkR2FtZU1hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lTWFuYWdlciB7XG4gICAgLyoqIE90aGVyIHN0cmluZ3MgKGNhc2UgaW5zZW5zaXRpdmUpIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gSUQgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICAgICAgXCJNZWdhTWluZXJBSS0xOS1TdHVtcGVkXCIsXG4gICAgICAgICAgICBcIk1lZ2FNaW5lci1BSS0xOS1TdHVtcGVkXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IFN0dW1wZWRHYW1lO1xuXG4gICAgLyoqIFRoZSBmYWN0b3J5IHRoYXQgbXVzdCBiZSB1c2VkIHRvIGluaXRpYWxpemUgbmV3IGdhbWUgb2JqZWN0cyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmVhdGUhOiBTdHVtcGVkR2FtZU9iamVjdEZhY3Rvcnk7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtbWV0aG9kcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbnMgdXAgdGhlIGJlYXZlcnMgYXJyYXlzIHJlbW92aW5nIGRlYWQgb25lcyBhbmQgYWRkaW5nIG5ldyBvbmVzXG4gICAgICogdG8gdGhlaXIgYXBwcm9wcmlhdGUgQmVhdmVyIGFycmF5cy5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYW51cEFycmF5cygpOiB2b2lkIHtcbiAgICAgICAgLy8gYWRkIGFsbCB0aGUgbmV3IGJlYXZlcnMgdG8gdGhpcy5iZWF2ZXJzXG4gICAgICAgIGZvciAoY29uc3QgbmV3QmVhdmVyIG9mIHRoaXMuZ2FtZS5uZXdCZWF2ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYmVhdmVycy5wdXNoKG5ld0JlYXZlcik7XG4gICAgICAgICAgICBuZXdCZWF2ZXIub3duZXIuYmVhdmVycy5wdXNoKG5ld0JlYXZlcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbmQgZW1wdHkgb3V0IHRoZSBgdGhpcy5uZXdCZWF2ZXJzYCBhcnJheSBhcyB0aGV5IGFyZSBubyBsb25nZXIgbmV3IGFuZCBoYXZlIGJlZW4gYWRkZWQgYWJvdmVcbiAgICAgICAgdGhpcy5nYW1lLm5ld0JlYXZlcnMubGVuZ3RoID0gMDtcblxuICAgICAgICAgLy8gQ2xvbmUgb2YgYXJyYXkgc28gd2UgY2FuIHJlbW92ZSB0aGVtIGZyb20gdGhlIGFjdHVhbCBhcnJheSBhbmQgbm90XG4gICAgICAgICAvLyBmdWNrIHVwIGxvb3AgaXRlcmF0aW9uXG4gICAgICAgIGNvbnN0IGFsbEJlYXZlcnMgPSB0aGlzLmdhbWUuYmVhdmVycy5zbGljZSgpO1xuICAgICAgICAvLyByZW1vdmUgYWxsIGJlYXZlcnMgZnJvbSB0aGUgZ2FtZSB0aGF0IGRpZWRcbiAgICAgICAgZm9yIChjb25zdCBiZWF2ZXIgb2YgYWxsQmVhdmVycykge1xuICAgICAgICAgICAgaWYgKGJlYXZlci5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgICAgIC8vIHBvb3IgYmVhdmVyIGRpZWQsIHJlbW92ZSBpdCBmcm9tIGFycmF5c1xuICAgICAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKGJlYXZlci5vd25lci5iZWF2ZXJzLCBiZWF2ZXIpO1xuICAgICAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKHRoaXMuZ2FtZS5iZWF2ZXJzLCBiZWF2ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYmVhdmVyLnRpbGUpIHtcbiAgICAgICAgICAgICAgICBiZWF2ZXIudGlsZS5iZWF2ZXIgPSBiZWF2ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQkVGT1JFIGVhY2ggcGxheWVyJ3MgcnVuVHVuIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgICAqIChpbmNsdWRpbmcgdGhlIGZpcnN0IHR1cm4pLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGdldCB0aGVpciBwbGF5ZXIgcmVhZHkgZm9yIHRoZWlyIHR1cm4uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGJlZm9yZVR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmJlZm9yZVR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG5cbiAgICAgICAgdGhpcy5jbGVhbnVwQXJyYXlzKCk7XG5cbiAgICAgICAgLy8gZmluaXNoIHJlY3J1aXRpbmcgYW55IG5ldyBiZWF2ZXJzXG4gICAgICAgIGZvciAoY29uc3QgYmVhdmVyIG9mIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLmJlYXZlcnMpIHtcbiAgICAgICAgICAgIGJlYXZlci5yZWNydWl0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGJlZm9yZS10dXJuIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBBRlRFUiBlYWNoIHBsYXllcidzIHR1cm4gZW5kcy4gQmVmb3JlIHRoZSB0dXJuIGNvdW50ZXJcbiAgICAgKiBpbmNyZWFzZXMuXG4gICAgICogVGhpcyBpcyBhIGdvb2QgcGxhY2UgdG8gZW5kLW9mLXR1cm4gZWZmZWN0cywgYW5kIGNsZWFuIHVwIGFycmF5cy5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYWZ0ZXJUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5hZnRlclR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhZnRlci10dXJuIC0tPj5cblxuICAgICAgICB0aGlzLmNsZWFudXBBcnJheXMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVCZWF2ZXJzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlUmVzb3VyY2VzKCk7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2FtZSBpcyBvdmVyIGluIGJldHdlZW4gdHVybnMuXG4gICAgICogVGhpcyBpcyBpbnZva2VkIEFGVEVSIGFmdGVyVHVybigpIGlzIGNhbGxlZCwgYnV0IEJFRk9SRSBiZWZvcmVUdXJuKClcbiAgICAgKiBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBnYW1lIGlzIGluZGVlZCBvdmVyLCBvdGhlcndpc2UgaWYgdGhlIGdhbWVcbiAgICAgKiBzaG91bGQgY29udGludWUgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICBzdXBlci5wcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgYSBwbGF5ZXIgaGFzIGNyZWF0ZWQgMTAgbG9kZ2VzICh0aGV5IGFyZSBidWlsdCBpbnN0YW50bHkpXG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMubWF4VHVybnMgdHVybnMgaGF2ZSBwYXNzZWQsIGFuZCBpZiBzbywgaW4gdGhpcyBvcmRlcjpcbiAgICAgICAgLy8gLSBQbGF5ZXIgaGFzIGJlZW4gbWFkZSBleHRpbmN0IChhbGwgYmVhdmVycyAmIGxvZGdlcyBkZXN0cm95ZWQpXG4gICAgICAgIC8vIC0gUGxheWVyIHdpdGggbW9zdCBsb2RnZXMgd2luc1xuICAgICAgICAvLyAtIFBsYXllciB3aXRoIG1vc3QgYnJhbmNoZXMgd2luc1xuICAgICAgICAvLyAtIFBsYXllciB3aXRoIG1vc3QgZm9vZCB3aW5zXG4gICAgICAgIC8vIC0gUmFuZG9tIHBsYXllciB3aW5zXG5cbiAgICAgICAgY29uc3QgcGxheWVycyA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnNsaWNlKCk7XG4gICAgICAgIGNvbnN0IGV4dGluY3RQbGF5ZXJzID0gcGxheWVycy5maWx0ZXIoXG4gICAgICAgICAgICAocCkgPT4gKHAuYmVhdmVycy5sZW5ndGggPT09IDAgJiYgcC5sb2RnZXMubGVuZ3RoID09PSAwKSxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZXh0aW5jdFBsYXllcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gU29tZW9uZSBsb3N0IHZpYSBleHRlcm1pbmF0aW9uLCBzbyB0aGUgZ2FtZSBpcyBvdmVyLlxuICAgICAgICAgICAgaWYgKGV4dGluY3RQbGF5ZXJzLmxlbmd0aCA9PT0gdGhpcy5nYW1lLnBsYXllcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhleSBib3RoIHNvbWVob3cga2lsbGVkIGV2ZXJ5dGhpbmcsIHNvIHRoZSBib2FyZCBpcyBlbXB0eS4gV2luIHZpYSBjb2luIGZsaXBcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXG4gICAgICAgICAgICAgICAgICAgIFwiQm90aCBQbGF5ZXJzIGV4dGVybWluYXRlZCBvbiB0aGUgc2FtZSB0dXJuXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGFsbCBleHRlcm1pbmF0ZWQgcGxheWVycyBsb3N0XG4gICAgICAgICAgICAgICAgY29uc3QgbG9zZXIgPSBleHRpbmN0UGxheWVyc1swXTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJEcm92ZSBvcHBvbmVudCB0byBleHRpbmN0aW9uXCIsIGxvc2VyLm9wcG9uZW50KTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcihcIkV4dGluY3QgLSBBbGwgQmVhdmVycyBhbmQgbG9kZ2VzIGRlc3Ryb3llZFwiLCBsb3Nlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmRHYW1lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheWVycy5zb3J0KChhLCBiKSA9PiBiLmxvZGdlcy5sZW5ndGggLSBhLmxvZGdlcy5sZW5ndGgpO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuY3VycmVudFR1cm4gJSAyID09PSAxKSB7XG4gICAgICAgICAgICAvLyByb3VuZCBlbmQsIGNoZWNrIGZvciBwcmltYXJ5IHdpbiBjb25kaXRpb25cblxuICAgICAgICAgICAgaWYgKHBsYXllcnNbMF0ubG9kZ2VzLmxlbmd0aCA+PSB0aGlzLmdhbWUubG9kZ2VzVG9XaW4pIHtcbiAgICAgICAgICAgICAgICBpZiAocGxheWVyc1swXS5sb2RnZXMubGVuZ3RoID09PSBwbGF5ZXJzWzFdLmxvZGdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlbiBib3RoIHBsYXllcnMgY29tcGxldGVkIHRoZSBzYW1lIG51bWJlciBvZiBsb2RnZXMgYnlcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGlzIHJvdW5kLCBkbyBzZWNvbmRhcnkgd2luIGNvbmRpdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiTG9kZ2VzIGNvbXBsZXRlIG9uIHRoZSBzYW1lIHJvdW5kXCIsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBzb21lb25lIHdvblxuICAgICAgICAgICAgICAgICAgICBjb25zdCB3aW5uZXIgPSBwbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsb3NlciA9IHBsYXllcnNbMV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgUmVhY2hlZCAke3dpbm5lci5sb2RnZXMubGVuZ3RofS8ke3RoaXMuZ2FtZS5sb2RnZXNUb1dpbn0gbG9kZ2VzIWAsIHdpbm5lcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKFwiTGVzcyBsb2RnZXMgdGhhbiB3aW5uZXIgd2hvIHJlYWNoZWQgY29tcGxldGVkIGFsbCBsb2RnZXNcIiwgbG9zZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEdhbWUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLmdhbWUucGxheWVycy5zbGljZSgpLnNvcnQoXG4gICAgICAgICAgICAocDEsIHAyKSA9PiBwMi5sb2RnZXMubGVuZ3RoIC0gcDEubG9kZ2VzLmxlbmd0aCxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBjaGVjayBpZiBzb21lb25lIHdvbiBieSBoYXZpbmcgbW9yZSBsb2RnZXNcbiAgICAgICAgaWYgKHBsYXllcnNbMF0ubG9kZ2VzLmxlbmd0aCAhPT0gcGxheWVyc1sxXS5sb2RnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCB3aW5uZXIgPSBwbGF5ZXJzWzBdO1xuICAgICAgICAgICAgY29uc3QgbG9zZXIgPSBwbGF5ZXJzWzFdO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn0gLSBIYXMgdGhlIG1vc3QgbG9kZ2VzICgke3dpbm5lci5sb2RnZXMubGVuZ3RofSlgLCB3aW5uZXIpO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoYCR7cmVhc29ufSAtIExlc3MgbG9kZ2VzIHRoYW4gb3Bwb25lbnRgLCBsb3Nlcik7XG5cbiAgICAgICAgICAgIHRoaXMuZW5kR2FtZSgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBpZiBzb21lb25lIHdvbiBieSBoYXZpbmcgbW9yZSBicmFuY2hlcyBvciBmb29kXG4gICAgICAgIGZvciAoY29uc3QgcmVzb3VyY2Ugb2YgW1wiYnJhbmNoZXNcIiwgXCJmb29kXCJdKSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIGNvdW50cyB0aGUgbnVtYmVyIG9mIHJlc291cmNlcyBhIHBsYXllciBoYXNcbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBAcGFyYW0gcCAtIHBsYXllciB0byBjb3VudCBmb3JcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHRoZSBjb3VudCBmIHJlc291cmNlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGNvdW50ID0gKHA6IFBsYXllcikgPT4gKHAubG9kZ2VzXG4gICAgICAgICAgICAgICAgLm1hcCgobSkgPT4gbVtyZXNvdXJjZSBhcyBcImJyYW5jaGVzXCIgfCBcImZvb2RcIl0pXG4gICAgICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCB2YWwpID0+IGFjYyArIHZhbCwgMClcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBsYXllcjBDb3VudCA9IGNvdW50KHBsYXllcnNbMF0pO1xuICAgICAgICAgICAgY29uc3QgcGxheWVyMUNvdW50ID0gY291bnQocGxheWVyc1sxXSk7XG5cbiAgICAgICAgICAgIGlmIChwbGF5ZXIwQ291bnQgIT09IHBsYXllcjFDb3VudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHBsYXllcnNbcGxheWVyMENvdW50ID4gcGxheWVyMUNvdW50ID8gMCA6IDFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHdpbm5lckNvdW50ID0gTWF0aC5tYXgocGxheWVyMENvdW50LCBwbGF5ZXIxQ291bnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvb3NlckNvdW50ID0gTWF0aC5taW4ocGxheWVyMENvdW50LCBwbGF5ZXIxQ291bnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259IC0gSGFzIG1vcmUgJHtyZXNvdXJjZX0gdGhhbiBvcHBvbmVudCAoJHt3aW5uZXJDb3VudH0pYCwgd2lubmVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcihcbiAgICAgICAgICAgICAgICAgICAgYCR7cmVhc29ufSAtIExlc3MgJHtyZXNvdXJjZX0gdGhhbiB3aW5uZXIgKCR7bG9vc2VyQ291bnR9KWAsXG4gICAgICAgICAgICAgICAgICAgIHdpbm5lci5vcHBvbmVudCxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRHYW1lKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2Vjb25kYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICAvLyBUaGlzIHdpbGwgZW5kIHRoZSBnYW1lLlxuICAgICAgICAvLyBJZiBubyB3aW5uZXIgaXQgZGV0ZXJtaW5lZCBhYm92ZSwgdGhlbiBhIHJhbmRvbSBvbmUgd2lsbCBiZSBjaG9zZW4uXG4gICAgICAgIHN1cGVyLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMocmVhc29uKTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGJlYXZlcnMgdmFyaWFibGVzLiBNdXN0IGJlIGNhbGxlZCBhZnRlciB0aGVpciBhcnJheSBpc1xuICAgICAqIGNsZWFuZWQgdXAuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVCZWF2ZXJzKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGJlYXZlciBvZiB0aGlzLmdhbWUuYmVhdmVycykge1xuICAgICAgICAgICAgLy8gSWYgdGhleSBhcmUgZGlzdHJhY3RlZFxuICAgICAgICAgICAgaWYgKGJlYXZlci50dXJuc0Rpc3RyYWN0ZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgYmVhdmVyLnR1cm5zRGlzdHJhY3RlZC0tOyAvLyBkZWNyZW1lbnQgdGhlIHR1cm5zIGNvdW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJlc2V0IHRoZWlyIGFjdGlvbnMvbW92ZXMgZm9yIG5leHQgdHVyblxuICAgICAgICAgICAgYmVhdmVyLmFjdGlvbnMgPSBiZWF2ZXIuam9iLmFjdGlvbnM7XG4gICAgICAgICAgICBiZWF2ZXIubW92ZXMgPSBiZWF2ZXIuam9iLm1vdmVzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgcmVzb3VyY2VzIGJ5IG1vdmluZyB0aGVtIGRvd24gd2F0ZXIgYW5kIHN1Y2hcbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVJlc291cmNlcygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbmV3UmVzb3VyY2VzID0gbmV3IE1hcDxUaWxlLCB7XG4gICAgICAgICAgICAvKiogVGhlIG51bWJlciBvZiBicmFuY2hlcyB0aGF0IHdpbGwgZXhpc3Qgb24gdGhpcyBUaWxlIGtleS4gKi9cbiAgICAgICAgICAgIGJyYW5jaGVzOiBudW1iZXI7XG4gICAgICAgICAgICAvKiogVGhlIG51bWJlciBvZiBmb29kIHRoYXQgd2lsbCBleGlzdCBvbiB0aGlzIFRpbGUga2V5ICovXG4gICAgICAgICAgICBmb29kOiBudW1iZXI7XG4gICAgICAgIH0+KCk7XG5cbiAgICAgICAgZm9yIChjb25zdCB0aWxlIG9mIHRoaXMuZ2FtZS50aWxlcykge1xuICAgICAgICAgICAgLy8gS2VlcCByZXNvdXJjZXMgaGVyZVxuICAgICAgICAgICAgaWYgKCFuZXdSZXNvdXJjZXMuaGFzKHRpbGUpKSB7XG4gICAgICAgICAgICAgICAgbmV3UmVzb3VyY2VzLnNldCh0aWxlLCB7XG4gICAgICAgICAgICAgICAgICAgIGJyYW5jaGVzOiAwLFxuICAgICAgICAgICAgICAgICAgICBmb29kOiAwLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcmVzb3VyY2VzID0gbmV3UmVzb3VyY2VzLmdldCh0aWxlKTtcblxuICAgICAgICAgICAgaWYgKCF0aWxlLmxvZGdlT3duZXIgJiYgdGlsZS50eXBlID09PSBcIndhdGVyXCIgJiYgdGlsZS5mbG93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dFRpbGUgPSB0aWxlLmdldE5laWdoYm9yKHRpbGUuZmxvd0RpcmVjdGlvbik7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW5leHRUaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghbmV3UmVzb3VyY2VzLmhhcyhuZXh0VGlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UmVzb3VyY2VzLnNldChuZXh0VGlsZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJhbmNoZXM6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb29kOiAwLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzID0gbmV3UmVzb3VyY2VzLmdldChuZXh0VGlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBFbHNlLCBrZWVwIHJlc291cmNlcyBoZXJlXG5cbiAgICAgICAgICAgIGlmICghcmVzb3VyY2VzKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgdXBkYXRlIHJlc291cmNlcyBmb3IgdGlsZSAke3RpbGV9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlc291cmNlcy5icmFuY2hlcyArPSB0aWxlLmJyYW5jaGVzO1xuICAgICAgICAgICAgcmVzb3VyY2VzLmZvb2QgKz0gdGlsZS5mb29kO1xuXG4gICAgICAgICAgICAvLyBTcGF3biBuZXcgcmVzb3VyY2VzXG4gICAgICAgICAgICBpZiAodGlsZS5zcGF3bmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUuc3Bhd25lci5oYXNCZWVuSGFydmVzdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUuc3Bhd25lci5oYXJ2ZXN0Q29vbGRvd24tLTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGlsZS5zcGF3bmVyLmhhcnZlc3RDb29sZG93biA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5zcGF3bmVyLmhhc0JlZW5IYXJ2ZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aWxlLnNwYXduZXIuaGVhbHRoIDwgdGhpcy5nYW1lLnNldHRpbmdzLm1heFNwYXduZXJIZWFsdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGlsZS5zcGF3bmVyLmhlYWx0aCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vdmUgcmVzb3VyY2VzXG4gICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiB0aGlzLmdhbWUudGlsZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc291cmNlcyA9IG5ld1Jlc291cmNlcy5nZXQodGlsZSk7XG4gICAgICAgICAgICBpZiAocmVzb3VyY2VzKSB7XG4gICAgICAgICAgICAgICAgdGlsZS5icmFuY2hlcyA9IHJlc291cmNlcy5icmFuY2hlcztcbiAgICAgICAgICAgICAgICB0aWxlLmZvb2QgPSByZXNvdXJjZXMuZm9vZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cbn1cbiJdfQ==