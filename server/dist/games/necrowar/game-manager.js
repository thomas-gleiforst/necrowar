"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Necrowar Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class NecrowarGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-##-Necrowar",
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
        for (const unit of this.game.units) {
            if (!unit.owner || unit.owner === this.game.currentPlayer) {
                unit.acted = false;
                unit.moves = unit.job.moves;
            }
            if (unit.tile && unit.tile.owner === unit.owner) {
                if (unit.health > unit.job.health) {
                    unit.health = unit.job.health;
                }
            }
        }
        // Code for the river phases, clearing out workers in the island gold mine
        // Every 15 turns
        if (this.game.currentTurn % 15 === 0) {
            for (const unit of this.game.units) {
                if (unit.tile) {
                    if (unit.tile.isIslandGoldMine) {
                        unit.tile.unit = undefined;
                        unit.tile = undefined;
                        unit.health = 0;
                    }
                }
            }
        }
        this.updateUnits();
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
        // add logic here after the current player's turn ends
        this.updateUnits();
        this.updateTowers();
        for (const unit of this.game.currentPlayer.units) {
            unit.acted = false;
            unit.moves = unit.job.moves;
            if (unit.health > unit.job.health) {
                unit.health = unit.job.health;
            }
        }
        for (const tower of this.game.currentPlayer.towers) {
            if (tower.cooldown > 0) {
                tower.cooldown--;
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
        // Add logic here checking for the primary win condition(s)
        let castleStandingOne = false;
        let castleStandingTwo = false;
        for (const player of this.game.players) {
            if (player.towers.length > 0) {
                if (player.towers[0].job.title === "castle") {
                    if (player === this.game.players[0]) {
                        castleStandingOne = true;
                    }
                    else if (player === this.game.players[1]) {
                        castleStandingTwo = true;
                    }
                }
            }
        }
        if (!castleStandingOne) {
            if (!castleStandingTwo) {
                this.secondaryWinConditions("Both castles fell at the same time.");
            }
            else {
                this.declareWinner("You defeated the enemy Necromancer!", this.game.players[0]);
                this.declareLosers("The enemy Necromancer has bested you!", this.game.players[0].opponent);
                return true;
            }
        }
        else {
            if (!castleStandingTwo) {
                this.declareWinner("You defeated the enemy Necromancer!", this.game.players[1]);
                this.declareLosers("The enemy Necromancer has bested you!", this.game.players[1].opponent);
                return true;
            }
            else {
                return false;
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
        // Add logic here for the secondary win conditions
        if (this.game.players[0].towers[0].health > this.game.players[1].towers[0].health) {
            this.declareWinner(`${reason}: You had higher castle health!`, this.game.players[0]);
            this.declareLoser(`${reason}: Your opponent's castle had higher health!`, this.game.players[1]);
        }
        else if (this.game.players[1].towers[0].health > this.game.players[0].towers[0].health) {
            this.declareWinner(`${reason}: You had higher castle health!`, this.game.players[1]);
            this.declareLoser(`${reason}: Your opponent's castle had higher health!`, this.game.players[0]);
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    // any additional protected/private methods you need can be added here
    /**
     * Updates units.
     */
    updateUnits() {
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
                if (unit.job.title !== "zombie") {
                    unit.tile.corpses++;
                }
                if (unit.job.title === "zombie") {
                    unit.tile.numZombies--;
                }
                if (unit.job.title === "ghoul") {
                    unit.tile.numGhouls--;
                }
                if (unit.job.title === "hound") {
                    unit.tile.numHounds--;
                }
                unit.tile.unit = undefined;
                unit.tile = undefined;
            }
        }
    }
    /**
     * Updates towers.
     */
    updateTowers() {
        // Properly remove all killed towers
        const deadTowers = this.game.towers.filter((t) => !t.tile || t.health <= 0);
        // remove dead towers from all player's towers list
        for (const player of this.game.players) {
            utils_1.removeElements(player.towers, ...deadTowers);
        }
        // and remove them from the game
        utils_1.removeElements(this.game.towers, ...deadTowers);
        // mark them dead
        for (const tower of deadTowers) {
            if (tower.tile) {
                tower.tile.tower = undefined;
            }
        }
    }
}
exports.NecrowarGameManager = NecrowarGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL25lY3Jvd2FyL2dhbWUtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZFQUE2RTtBQUM3RSxhQUFhO0FBQ2IseUJBQTBFO0FBRTFFLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0UsbUNBQXlDO0FBQ3pDLGtDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsY0FBVyxDQUFDLFdBQVc7SUFDNUQsaUVBQWlFO0lBQzFELE1BQU0sS0FBSyxPQUFPO1FBQ3JCLE9BQU87WUFDSCxpQ0FBaUM7WUFDakMseUJBQXlCO1NBRTVCLENBQUM7SUFDTixDQUFDO0lBUUQsd0NBQXdDO0lBRXhDLDJEQUEyRDtJQUUzRCx5Q0FBeUM7SUFFekM7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxVQUFVO1FBQ3RCLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXpCLHFDQUFxQztRQUNyQyw2REFBNkQ7UUFDN0QsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzthQUMvQjtZQUVELElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM3QyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7b0JBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7aUJBQ2pDO2FBQ0o7U0FDSjtRQUVELDBFQUEwRTtRQUMxRSxpQkFBaUI7UUFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDWCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7d0JBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7d0JBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUNuQjtpQkFDSjthQUNKO1NBQ0o7UUFFRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsc0NBQXNDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFNBQVM7UUFDckIsTUFBTSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFeEIsb0NBQW9DO1FBQ3BDLHNEQUFzRDtRQUN0RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFO1lBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFFNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFO2dCQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2FBQ2pDO1NBQ0o7UUFFRCxLQUFLLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNoRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDcEI7U0FDSjtRQUNELHFDQUFxQztJQUN6QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLHlCQUF5QjtRQUMvQixLQUFLLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUVsQyxnREFBZ0Q7UUFDaEQsMkRBQTJEO1FBQzNELElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO1FBRTlCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzFCLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtvQkFDekMsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ2pDLGlCQUFpQixHQUFHLElBQUksQ0FBQztxQkFDNUI7eUJBQ0ksSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3RDLGlCQUFpQixHQUFHLElBQUksQ0FBQztxQkFDNUI7aUJBQ0o7YUFDSjtTQUNKO1FBRUQsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3BCLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLHFDQUFxQyxDQUFDLENBQUM7YUFDdEU7aUJBQ0k7Z0JBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRixJQUFJLENBQUMsYUFBYSxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUUzRixPQUFPLElBQUksQ0FBQzthQUNmO1NBQ0o7YUFDSTtZQUNELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRixJQUFJLENBQUMsYUFBYSxDQUFDLHVDQUF1QyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUUzRixPQUFPLElBQUksQ0FBQzthQUNmO2lCQUNJO2dCQUNELE9BQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7UUFDRCxpREFBaUQ7UUFFakQsT0FBTyxLQUFLLENBQUMsQ0FBQywwQ0FBMEM7SUFDNUQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sc0JBQXNCLENBQUMsTUFBYztRQUMzQyxrREFBa0Q7UUFDbEQsa0RBQWtEO1FBRWxELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQy9FLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLE1BQU0sNkNBQTZDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRzthQUNJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ3BGLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxNQUFNLGlDQUFpQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckYsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLE1BQU0sNkNBQTZDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuRztRQUVELG1EQUFtRDtRQUVuRCwwQkFBMEI7UUFDMUIsc0VBQXNFO1FBQ3RFLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsbURBQW1EO0lBRW5ELHNFQUFzRTtJQUN0RTs7T0FFRztJQUNLLFdBQVc7UUFDZixtQ0FBbUM7UUFDbkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUUxRSxpREFBaUQ7UUFDakQsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNwQyxzQkFBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQztTQUM5QztRQUNELGdDQUFnQztRQUNoQyxzQkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFDN0MsaUJBQWlCO1FBQ2xCLEtBQUssTUFBTSxJQUFJLElBQUksU0FBUyxFQUFFO1lBQzFCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDWCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLFFBQVEsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDdkI7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxRQUFRLEVBQUU7b0JBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7aUJBQzFCO2dCQUNELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssT0FBTyxFQUFFO29CQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2lCQUN6QjtnQkFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLE9BQU8sRUFBRTtvQkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztpQkFDekI7Z0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzthQUN6QjtTQUNKO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssWUFBWTtRQUNoQixvQ0FBb0M7UUFDcEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQztRQUU1RSxtREFBbUQ7UUFDbkQsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNwQyxzQkFBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztTQUNoRDtRQUNELGdDQUFnQztRQUNoQyxzQkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDL0MsaUJBQWlCO1FBQ2xCLEtBQUssTUFBTSxLQUFLLElBQUksVUFBVSxFQUFFO1lBQzVCLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDWixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7YUFDaEM7U0FDSjtJQUNMLENBQUM7Q0FFSjtBQXhPRCxrREF3T0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgd2hlcmUgeW91IHNob3VsZCBwdXQgbG9naWMgdG8gY29udHJvbCB0aGUgZ2FtZSBhbmQgZXZlcnl0aGluZ1xuLy8gYXJvdW5kIGl0LlxuaW1wb3J0IHsgQmFzZUNsYXNzZXMsIE5lY3Jvd2FyR2FtZSwgTmVjcm93YXJHYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbmltcG9ydCB7IHJlbW92ZUVsZW1lbnRzIH0gZnJvbSBcIn4vdXRpbHNcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBnYW1lIGxvZ2ljIGFyb3VuZCB0aGUgTmVjcm93YXIgR2FtZS5cbiAqIFRoaXMgaXMgd2hlcmUgeW91IGNvdWxkIGRvIGxvZ2ljIGZvciBjaGVja2luZyBpZiB0aGUgZ2FtZSBpcyBvdmVyLCB1cGRhdGVcbiAqIHRoZSBnYW1lIGJldHdlZW4gdHVybnMsIGFuZCBhbnl0aGluZyB0aGF0IHRpZXMgYWxsIHRoZSBcInN0dWZmXCIgaW4gdGhlIGdhbWVcbiAqIHRvZ2V0aGVyLlxuICovXG5leHBvcnQgY2xhc3MgTmVjcm93YXJHYW1lTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVNYW5hZ2VyIHtcbiAgICAvKiogT3RoZXIgc3RyaW5ncyAoY2FzZSBpbnNlbnNpdGl2ZSkgdGhhdCBjYW4gYmUgdXNlZCBhcyBhbiBJRCAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGFsaWFzZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgICAgICBcIk1lZ2FNaW5lckFJLSMjLU5lY3Jvd2FyXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IE5lY3Jvd2FyR2FtZTtcblxuICAgIC8qKiBUaGUgZmFjdG9yeSB0aGF0IG11c3QgYmUgdXNlZCB0byBpbml0aWFsaXplIG5ldyBnYW1lIG9iamVjdHMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRlITogTmVjcm93YXJHYW1lT2JqZWN0RmFjdG9yeTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8vIGFueSBhZGRpdGlvbmFsIHB1YmxpYyBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQkVGT1JFIGVhY2ggcGxheWVyJ3MgcnVuVHVuIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgICAqIChpbmNsdWRpbmcgdGhlIGZpcnN0IHR1cm4pLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGdldCB0aGVpciBwbGF5ZXIgcmVhZHkgZm9yIHRoZWlyIHR1cm4uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGJlZm9yZVR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmJlZm9yZVR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG4gICAgICAgIC8vIGFkZCBsb2dpYyBoZXJlIGZvciBiZWZvcmUgdGhlIGN1cnJlbnQgcGxheWVyJ3MgdHVybiBzdGFydHNcbiAgICAgICAgZm9yIChjb25zdCB1bml0IG9mIHRoaXMuZ2FtZS51bml0cykge1xuICAgICAgICAgICAgaWYgKCF1bml0Lm93bmVyIHx8IHVuaXQub3duZXIgPT09IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdW5pdC5hY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVuaXQubW92ZXMgPSB1bml0LmpvYi5tb3ZlcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVuaXQudGlsZSAmJiB1bml0LnRpbGUub3duZXIgPT09IHVuaXQub3duZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodW5pdC5oZWFsdGggPiB1bml0LmpvYi5oZWFsdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdW5pdC5oZWFsdGggPSB1bml0LmpvYi5oZWFsdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29kZSBmb3IgdGhlIHJpdmVyIHBoYXNlcywgY2xlYXJpbmcgb3V0IHdvcmtlcnMgaW4gdGhlIGlzbGFuZCBnb2xkIG1pbmVcbiAgICAgICAgLy8gRXZlcnkgMTUgdHVybnNcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5jdXJyZW50VHVybiAlIDE1ID09PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnVuaXRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXQudGlsZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodW5pdC50aWxlLmlzSXNsYW5kR29sZE1pbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC50aWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC5oZWFsdGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVVbml0cygpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEFGVEVSIGVhY2ggcGxheWVyJ3MgdHVybiBlbmRzLiBCZWZvcmUgdGhlIHR1cm4gY291bnRlclxuICAgICAqIGluY3JlYXNlcy5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBlbmQtb2YtdHVybiBlZmZlY3RzLCBhbmQgY2xlYW4gdXAgYXJyYXlzLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBhZnRlclR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmFmdGVyVHVybigpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgICAgICAvLyBhZGQgbG9naWMgaGVyZSBhZnRlciB0aGUgY3VycmVudCBwbGF5ZXIncyB0dXJuIGVuZHNcbiAgICAgICAgdGhpcy51cGRhdGVVbml0cygpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRvd2VycygpO1xuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIudW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXQuYWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHVuaXQubW92ZXMgPSB1bml0LmpvYi5tb3ZlcztcblxuICAgICAgICAgICAgaWYgKHVuaXQuaGVhbHRoID4gdW5pdC5qb2IuaGVhbHRoKSB7XG4gICAgICAgICAgICAgICAgdW5pdC5oZWFsdGggPSB1bml0LmpvYi5oZWFsdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHRvd2VyIG9mIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLnRvd2Vycykge1xuICAgICAgICAgICAgaWYgKHRvd2VyLmNvb2xkb3duID4gMCkge1xuICAgICAgICAgICAgICAgIHRvd2VyLmNvb2xkb3duLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2FtZSBpcyBvdmVyIGluIGJldHdlZW4gdHVybnMuXG4gICAgICogVGhpcyBpcyBpbnZva2VkIEFGVEVSIGFmdGVyVHVybigpIGlzIGNhbGxlZCwgYnV0IEJFRk9SRSBiZWZvcmVUdXJuKClcbiAgICAgKiBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBnYW1lIGlzIGluZGVlZCBvdmVyLCBvdGhlcndpc2UgaWYgdGhlIGdhbWVcbiAgICAgKiBzaG91bGQgY29udGludWUgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICBzdXBlci5wcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG4gICAgICAgIC8vIEFkZCBsb2dpYyBoZXJlIGNoZWNraW5nIGZvciB0aGUgcHJpbWFyeSB3aW4gY29uZGl0aW9uKHMpXG4gICAgICAgIGxldCBjYXN0bGVTdGFuZGluZ09uZSA9IGZhbHNlO1xuICAgICAgICBsZXQgY2FzdGxlU3RhbmRpbmdUd28gPSBmYWxzZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLmdhbWUucGxheWVycykge1xuICAgICAgICAgICAgaWYgKHBsYXllci50b3dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIudG93ZXJzWzBdLmpvYi50aXRsZSA9PT0gXCJjYXN0bGVcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGxheWVyID09PSB0aGlzLmdhbWUucGxheWVyc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzdGxlU3RhbmRpbmdPbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnNbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc3RsZVN0YW5kaW5nVHdvID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2FzdGxlU3RhbmRpbmdPbmUpIHtcbiAgICAgICAgICAgIGlmICghY2FzdGxlU3RhbmRpbmdUd28pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXCJCb3RoIGNhc3RsZXMgZmVsbCBhdCB0aGUgc2FtZSB0aW1lLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihcIllvdSBkZWZlYXRlZCB0aGUgZW5lbXkgTmVjcm9tYW5jZXIhXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJUaGUgZW5lbXkgTmVjcm9tYW5jZXIgaGFzIGJlc3RlZCB5b3UhXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLm9wcG9uZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjYXN0bGVTdGFuZGluZ1R3bykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihcIllvdSBkZWZlYXRlZCB0aGUgZW5lbXkgTmVjcm9tYW5jZXIhXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJUaGUgZW5lbXkgTmVjcm9tYW5jZXIgaGFzIGJlc3RlZCB5b3UhXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLm9wcG9uZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuICAgICAgICAvLyBBZGQgbG9naWMgaGVyZSBmb3IgdGhlIHNlY29uZGFyeSB3aW4gY29uZGl0aW9uc1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUucGxheWVyc1swXS50b3dlcnNbMF0uaGVhbHRoID4gdGhpcy5nYW1lLnBsYXllcnNbMV0udG93ZXJzWzBdLmhlYWx0aCkge1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn06IFlvdSBoYWQgaGlnaGVyIGNhc3RsZSBoZWFsdGghYCwgdGhpcy5nYW1lLnBsYXllcnNbMF0pO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoYCR7cmVhc29ufTogWW91ciBvcHBvbmVudCdzIGNhc3RsZSBoYWQgaGlnaGVyIGhlYWx0aCFgLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5nYW1lLnBsYXllcnNbMV0udG93ZXJzWzBdLmhlYWx0aCA+IHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLnRvd2Vyc1swXS5oZWFsdGgpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259OiBZb3UgaGFkIGhpZ2hlciBjYXN0bGUgaGVhbHRoIWAsIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdKTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKGAke3JlYXNvbn06IFlvdXIgb3Bwb25lbnQncyBjYXN0bGUgaGFkIGhpZ2hlciBoZWFsdGghYCwgdGhpcy5nYW1lLnBsYXllcnNbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNlY29uZGFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGVuZCB0aGUgZ2FtZS5cbiAgICAgICAgLy8gSWYgbm8gd2lubmVyIGl0IGRldGVybWluZWQgYWJvdmUsIHRoZW4gYSByYW5kb20gb25lIHdpbGwgYmUgY2hvc2VuLlxuICAgICAgICBzdXBlci5zZWNvbmRhcnlXaW5Db25kaXRpb25zKHJlYXNvbik7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQvcHJpdmF0ZSBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB1bml0cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVVuaXRzKCk6IHZvaWQge1xuICAgICAgICAvLyBQcm9wZXJseSByZW1vdmUgYWxsIGtpbGxlZCB1bml0c1xuICAgICAgICBjb25zdCBkZWFkVW5pdHMgPSB0aGlzLmdhbWUudW5pdHMuZmlsdGVyKCh1KSA9PiAhdS50aWxlIHx8IHUuaGVhbHRoIDw9IDApO1xuXG4gICAgICAgIC8vIHJlbW92ZSBkZWFkIHVuaXRzIGZyb20gYWxsIHBsYXllcidzIHVuaXRzIGxpc3RcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5nYW1lLnBsYXllcnMpIHtcbiAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKHBsYXllci51bml0cywgLi4uZGVhZFVuaXRzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhbmQgcmVtb3ZlIHRoZW0gZnJvbSB0aGUgZ2FtZVxuICAgICAgICByZW1vdmVFbGVtZW50cyh0aGlzLmdhbWUudW5pdHMsIC4uLmRlYWRVbml0cyk7XG4gICAgICAgICAvLyBtYXJrIHRoZW0gZGVhZFxuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgZGVhZFVuaXRzKSB7XG4gICAgICAgICAgICBpZiAodW5pdC50aWxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXQuam9iLnRpdGxlICE9PSBcInpvbWJpZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXQudGlsZS5jb3Jwc2VzKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1bml0LmpvYi50aXRsZSA9PT0gXCJ6b21iaWVcIikge1xuICAgICAgICAgICAgICAgICAgICB1bml0LnRpbGUubnVtWm9tYmllcy0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodW5pdC5qb2IudGl0bGUgPT09IFwiZ2hvdWxcIikge1xuICAgICAgICAgICAgICAgICAgICB1bml0LnRpbGUubnVtR2hvdWxzLS07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh1bml0LmpvYi50aXRsZSA9PT0gXCJob3VuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHVuaXQudGlsZS5udW1Ib3VuZHMtLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdW5pdC50aWxlLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdW5pdC50aWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0b3dlcnMuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVUb3dlcnMoKTogdm9pZCB7XG4gICAgICAgIC8vIFByb3Blcmx5IHJlbW92ZSBhbGwga2lsbGVkIHRvd2Vyc1xuICAgICAgICBjb25zdCBkZWFkVG93ZXJzID0gdGhpcy5nYW1lLnRvd2Vycy5maWx0ZXIoKHQpID0+ICF0LnRpbGUgfHwgdC5oZWFsdGggPD0gMCk7XG5cbiAgICAgICAgLy8gcmVtb3ZlIGRlYWQgdG93ZXJzIGZyb20gYWxsIHBsYXllcidzIHRvd2VycyBsaXN0XG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIHRoaXMuZ2FtZS5wbGF5ZXJzKSB7XG4gICAgICAgICAgICByZW1vdmVFbGVtZW50cyhwbGF5ZXIudG93ZXJzLCAuLi5kZWFkVG93ZXJzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhbmQgcmVtb3ZlIHRoZW0gZnJvbSB0aGUgZ2FtZVxuICAgICAgICByZW1vdmVFbGVtZW50cyh0aGlzLmdhbWUudG93ZXJzLCAuLi5kZWFkVG93ZXJzKTtcbiAgICAgICAgIC8vIG1hcmsgdGhlbSBkZWFkXG4gICAgICAgIGZvciAoY29uc3QgdG93ZXIgb2YgZGVhZFRvd2Vycykge1xuICAgICAgICAgICAgaWYgKHRvd2VyLnRpbGUpIHtcbiAgICAgICAgICAgICAgICB0b3dlci50aWxlLnRvd2VyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cbn1cbiJdfQ==