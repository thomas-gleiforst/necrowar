"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Pirates Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class PiratesGameManager extends _1.BaseClasses.GameManager {
    constructor() {
        super(...arguments);
        // <<-- Creer-Merge: public-methods -->>
        /** The new units created DURING turns. */
        this.newUnits = [];
        // <<-- /Creer-Merge: protected-private-methods -->>
    }
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-21-Pirates",
        ];
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
        this.updateMerchants();
        this.updateOtherStuff();
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
        // Primary win conditions: destroy your enemy's units and rob them of enough of their gold
        const killedOff = this.game.players.filter((p) => p.gold < this.game.shipCost && p.units.length === 0);
        if (killedOff.length === 2) {
            this.secondaryWinConditions("Ye killed each other");
            return true;
        }
        else if (killedOff.length === 1) {
            const loser = killedOff[0];
            this.declareWinner("Ye killed the other pirate!", loser.opponent);
            this.declareLoser("Crew be in Davy Jones' locker, and can't build a ship", loser);
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
        // clone the array as sorting is in place
        const players = this.game.players.slice();
        // 1. Most infamy
        players.sort((a, b) => b.infamy - a.infamy);
        if (players[0].infamy > players[1].infamy) {
            this.declareWinner(`${reason}: Had the most infamy`, players[0]);
            this.declareLoser(`${reason}: Had the least infamy`, players[1]);
        }
        // 2. Most net worth
        players.sort((a, b) => b.netWorth() - a.netWorth());
        if (players[0].netWorth() > players[1].netWorth()) {
            this.declareWinner(`${reason}: Had the highest net worth`, players[0]);
            this.declareLoser(`${reason}: Had the lowest net worth`, players[1]);
        }
        // 3. Coin toss (handled by default below)
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    /**
     * Updates the arrays clients can see so they do not resize during turns.
     */
    updateArrays() {
        // Properly add all new units
        for (const unit of this.newUnits) {
            this.game.units.push(unit);
            if (unit.owner) {
                unit.owner.units.push(unit);
            }
        }
        // now empty it as we've dumped all the new units into their arrays.
        this.newUnits.length = 0;
        // if the unit has a tile, it is alive, so keep it
        const keepAliveUnits = (unit) => Boolean(unit.tile);
        utils_1.filterInPlace(this.game.units, keepAliveUnits);
        for (const player of this.game.players) {
            utils_1.filterInPlace(player.units, keepAliveUnits);
        }
    }
    /** Updates units in-between turns */
    updateUnits() {
        for (const unit of this.game.units) {
            // Reset the unit
            if (!unit.owner || unit.owner === this.game.currentPlayer) {
                unit.acted = false;
                unit.moves = Math.max(this.game.crewMoves, unit.shipHealth > 0
                    ? this.game.shipMoves
                    : 0);
            }
            // Decrease turns stunned
            if (unit.stunTurns > 0) {
                unit.stunTurns--;
            }
            else if (!unit.owner && unit.targetPort) {
                // Move merchant units
                // Check current path
                let pathValid = true;
                if (unit.path && unit.path.length > 0) {
                    const next = unit.path[0];
                    if (next.unit || (next.port && next.port.owner)) {
                        pathValid = false;
                    }
                }
                else {
                    pathValid = false;
                }
                if (!unit.tile) {
                    throw new Error(`${unit} has not Tile to update from!`);
                }
                // Find path to target port (BFS)
                if (!pathValid) {
                    const open = [{
                            tile: unit.tile,
                            g: 1,
                            parent: undefined,
                        }];
                    const closed = new Set();
                    unit.path = [];
                    while (open.length > 0) {
                        // Pop the first open element (lowest distance)
                        let current = open.shift(); // must exist from above check
                        if (closed.has(current.tile)) {
                            continue;
                        }
                        closed.add(current.tile);
                        // Check if at the target
                        if (current.tile === unit.targetPort.tile) {
                            while (current) {
                                if (current.tile !== unit.tile) {
                                    unit.path.unshift(current.tile);
                                }
                                current = current.parent;
                            }
                            break;
                        }
                        // Add neighbors
                        const neighbors = [
                            { tile: current.tile.tileNorth, cost: 1 },
                            { tile: current.tile.tileEast, cost: 1 / Math.min(current.g * 10, 1000) + 1 },
                            { tile: current.tile.tileSouth, cost: 1 },
                            { tile: current.tile.tileWest, cost: 1 / Math.min(current.g * 10, 1000) + 1 },
                        ];
                        let unsorted = false;
                        for (const neighbor of neighbors) {
                            if (neighbor.tile) {
                                // Don't path through land
                                if (neighbor.tile.type === "land") {
                                    continue;
                                }
                                // Don't path through player ports
                                if (neighbor.tile.port && neighbor.tile.port.owner) {
                                    continue;
                                }
                                // Don't path through friendly units unless it's a port
                                if (neighbor.tile.unit && !neighbor.tile.port) {
                                    continue;
                                }
                                open.push({
                                    tile: neighbor.tile,
                                    g: current.g + neighbor.cost,
                                    parent: current,
                                });
                                unsorted = true;
                            }
                        }
                        // Sort open list
                        if (unsorted) {
                            open.sort((a, b) => a.g - b.g);
                        }
                    }
                }
                // Make the merchant attack this turn's player if they have a unit in range
                const target = this.game.currentPlayer.units.find((u) => {
                    // Only attack ships
                    if (u.shipHealth <= 0 || !u.tile || !unit.tile) {
                        return false;
                    }
                    // Check if in range
                    const range = (unit.tile.x - u.tile.x) ** 2 + (unit.tile.y - u.tile.y) ** 2;
                    return range <= this.game.shipRange ** 2;
                });
                if (target && target.tile) {
                    // Attack the target
                    target.shipHealth -= this.game.shipDamage;
                    if (target.shipHealth <= 0 && !target.tile.port) {
                        target.tile.unit = undefined;
                        target.tile = undefined;
                    }
                    target.shipHealth = Math.max(0, target.shipHealth);
                }
                // Move the merchant
                if (unit.path.length > 0) {
                    // Check if it's at its destination
                    if (unit.path[0].port === unit.targetPort) {
                        // Mark it as dead
                        unit.tile.unit = undefined;
                        unit.tile = undefined;
                    }
                    else {
                        const tile = unit.path.shift(); // must exist from above check
                        unit.tile.unit = undefined;
                        unit.tile = tile;
                        tile.unit = unit;
                    }
                }
            }
        }
    }
    /**
     * Updates the merchants in the game, moving them and updating their gold.
     */
    updateMerchants() {
        const merchantGold = this.game.shipCost;
        const merchantBaseCrew = 3;
        const merchantCost = this.game.shipCost * 4;
        // Create units as needed
        const merchantPorts = this.game.ports.filter((p) => !p.owner);
        for (const port of merchantPorts) {
            // Skip player-owned ports
            if (port.owner) {
                continue;
            }
            // Add gold to the port
            port.gold += this.game.merchantGoldRate;
            // Try to spawn a ship
            if (!port.tile.unit && port.gold >= merchantCost) {
                // Deduct gold
                port.gold -= merchantCost;
                // Calculate crew and gold
                const gold = merchantGold + (port.investment * this.game.merchantInterestRate);
                const invested = Math.floor(port.investment * this.game.merchantInterestRate / this.game.crewCost);
                const crew = merchantBaseCrew + invested;
                // Get the opposite port of this one
                const target = this.game.getTile(this.game.mapWidth - port.tile.x - 1, this.game.mapHeight - port.tile.y - 1);
                if (!target) {
                    throw new Error("Merchange has no opposite target!");
                }
                const targetPort = target.port;
                // Spawn the unit
                const unit = this.create.unit({
                    owner: undefined,
                    tile: port.tile,
                    crew,
                    crewHealth: crew * this.game.crewHealth,
                    shipHealth: this.game.shipHealth / 2,
                    gold,
                    targetPort,
                });
                unit.tile.unit = unit;
                this.newUnits.push(unit);
                port.investment = 0;
            }
        }
    }
    /** Update other variables in-between turns */
    updateOtherStuff() {
        for (const tile of this.game.tiles) {
            const gold = tile.gold * this.game.buryInterestRate;
            tile.gold = Math.min(gold, this.game.settings.maxTileGold);
            if (tile.unit && tile.unit.tile !== tile) {
                tile.unit = undefined; // it died
            }
        }
        this.game.currentPlayer.port.gold = this.game.shipCost;
    }
}
exports.PiratesGameManager = PiratesGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3BpcmF0ZXMvZ2FtZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkVBQTZFO0FBQzdFLGFBQWE7QUFDYix5QkFBd0U7QUFFeEUsaUNBQWlDO0FBRWpDLG1DQUF3QztBQWN4QyxrQ0FBa0M7QUFFbEM7Ozs7O0dBS0c7QUFDSCxNQUFhLGtCQUFtQixTQUFRLGNBQVcsQ0FBQyxXQUFXO0lBQS9EOztRQWdCSSx3Q0FBd0M7UUFFeEMsMENBQTBDO1FBQzFCLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFpV3RDLG9EQUFvRDtJQUN4RCxDQUFDO0lBcFhHLGlFQUFpRTtJQUMxRCxNQUFNLEtBQUssT0FBTztRQUNyQixPQUFPO1lBQ0gsaUNBQWlDO1lBQ2pDLHdCQUF3QjtTQUUzQixDQUFDO0lBQ04sQ0FBQztJQWFELHlDQUF5QztJQUV6Qzs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFVBQVU7UUFDdEIsTUFBTSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFekIscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUNwQixzQ0FBc0M7SUFDMUMsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxLQUFLLENBQUMsU0FBUztRQUNyQixNQUFNLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUV4QixvQ0FBb0M7UUFFcEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFFeEIscUNBQXFDO0lBQ3pDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08seUJBQXlCO1FBQy9CLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBRWxDLGdEQUFnRDtRQUVoRCwwRkFBMEY7UUFDMUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXZHLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFFcEQsT0FBTyxJQUFJLENBQUM7U0FDZjthQUNJLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxZQUFZLENBQUMsdURBQXVELEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFbEYsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUVELGlEQUFpRDtRQUVqRCxPQUFPLEtBQUssQ0FBQyxDQUFDLDBDQUEwQztJQUM1RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxzQkFBc0IsQ0FBQyxNQUFjO1FBQzNDLGtEQUFrRDtRQUVsRCx5Q0FBeUM7UUFDekMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFMUMsaUJBQWlCO1FBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSx1QkFBdUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSx3QkFBd0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNwRTtRQUVELG9CQUFvQjtRQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUMvQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsTUFBTSw2QkFBNkIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSw0QkFBNEIsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4RTtRQUVELDBDQUEwQztRQUUxQyxtREFBbUQ7UUFFbkQsMEJBQTBCO1FBQzFCLHNFQUFzRTtRQUN0RSxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELG1EQUFtRDtJQUVuRDs7T0FFRztJQUNLLFlBQVk7UUFDaEIsNkJBQTZCO1FBQzdCLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMvQjtTQUNKO1FBRUQsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUV6QixrREFBa0Q7UUFDbEQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUQscUJBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMvQyxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3BDLHFCQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQztTQUMvQztJQUNMLENBQUM7SUFFRCxxQ0FBcUM7SUFDN0IsV0FBVztRQUNmLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEMsaUJBQWlCO1lBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDO29CQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO29CQUNyQixDQUFDLENBQUMsQ0FBQyxDQUNOLENBQUM7YUFDTDtZQUVELHlCQUF5QjtZQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDcEI7aUJBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDckMsc0JBQXNCO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDckIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDbkMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUM3QyxTQUFTLEdBQUcsS0FBSyxDQUFDO3FCQUNyQjtpQkFDSjtxQkFDSTtvQkFDRCxTQUFTLEdBQUcsS0FBSyxDQUFDO2lCQUNyQjtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSwrQkFBK0IsQ0FBQyxDQUFDO2lCQUMzRDtnQkFFRCxpQ0FBaUM7Z0JBQ2pDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ1osTUFBTSxJQUFJLEdBQVksQ0FBQzs0QkFDbkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJOzRCQUNmLENBQUMsRUFBRSxDQUFDOzRCQUNKLE1BQU0sRUFBRSxTQUFTO3lCQUNwQixDQUFDLENBQUM7b0JBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQVEsQ0FBQztvQkFFL0IsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQ2YsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDcEIsK0NBQStDO3dCQUMvQyxJQUFJLE9BQU8sR0FBc0IsSUFBSSxDQUFDLEtBQUssRUFBVyxDQUFDLENBQUMsOEJBQThCO3dCQUN0RixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFOzRCQUMxQixTQUFTO3lCQUNaO3dCQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUV6Qix5QkFBeUI7d0JBQ3pCLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRTs0QkFDdkMsT0FBTyxPQUFPLEVBQUU7Z0NBQ1osSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7b0NBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQ0FDbkM7Z0NBQ0QsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7NkJBQzVCOzRCQUVELE1BQU07eUJBQ1Q7d0JBRUQsZ0JBQWdCO3dCQUNoQixNQUFNLFNBQVMsR0FBRzs0QkFDZCxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFOzRCQUN6QyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUM3RSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFOzRCQUN6QyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFDO3lCQUMvRSxDQUFDO3dCQUVGLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQzt3QkFDckIsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7NEJBQzlCLElBQUksUUFBUSxDQUFDLElBQUksRUFBRTtnQ0FDZiwwQkFBMEI7Z0NBQzFCLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO29DQUMvQixTQUFTO2lDQUNaO2dDQUVELGtDQUFrQztnQ0FDbEMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7b0NBQ2hELFNBQVM7aUNBQ1o7Z0NBRUQsdURBQXVEO2dDQUN2RCxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7b0NBQzNDLFNBQVM7aUNBQ1o7Z0NBRUQsSUFBSSxDQUFDLElBQUksQ0FBQztvQ0FDTixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7b0NBQ25CLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJO29DQUM1QixNQUFNLEVBQUUsT0FBTztpQ0FDbEIsQ0FBQyxDQUFDO2dDQUNILFFBQVEsR0FBRyxJQUFJLENBQUM7NkJBQ25CO3lCQUNKO3dCQUVELGlCQUFpQjt3QkFDakIsSUFBSSxRQUFRLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNsQztxQkFDSjtpQkFDSjtnQkFFRCwyRUFBMkU7Z0JBQzNFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDcEQsb0JBQW9CO29CQUNwQixJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7d0JBQzVDLE9BQU8sS0FBSyxDQUFDO3FCQUNoQjtvQkFFRCxvQkFBb0I7b0JBQ3BCLE1BQU0sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFNUUsT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO2dCQUM3QyxDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUN2QixvQkFBb0I7b0JBQ3BCLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7b0JBQzFDLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTt3QkFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO3dCQUM3QixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztxQkFDM0I7b0JBRUQsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3REO2dCQUVELG9CQUFvQjtnQkFDcEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3RCLG1DQUFtQztvQkFDbkMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUN2QyxrQkFBa0I7d0JBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7cUJBQ3pCO3lCQUNJO3dCQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFVLENBQUMsQ0FBQyw4QkFBOEI7d0JBQ3RFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzt3QkFDM0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7d0JBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO3FCQUNwQjtpQkFDSjthQUNKO1NBQ0o7SUFDTCxDQUFDO0lBRUQ7O09BRUc7SUFDSyxlQUFlO1FBQ25CLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUU1Qyx5QkFBeUI7UUFDekIsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RCxLQUFLLE1BQU0sSUFBSSxJQUFJLGFBQWEsRUFBRTtZQUM5QiwwQkFBMEI7WUFDMUIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNaLFNBQVM7YUFDWjtZQUVELHVCQUF1QjtZQUN2QixJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFFeEMsc0JBQXNCO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFlBQVksRUFBRTtnQkFDOUMsY0FBYztnQkFDZCxJQUFJLENBQUMsSUFBSSxJQUFJLFlBQVksQ0FBQztnQkFFMUIsMEJBQTBCO2dCQUMxQixNQUFNLElBQUksR0FBRyxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFDL0UsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbkcsTUFBTSxJQUFJLEdBQUcsZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO2dCQUV6QyxvQ0FBb0M7Z0JBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FDeEMsQ0FBQztnQkFFRixJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztpQkFDeEQ7Z0JBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFFL0IsaUJBQWlCO2dCQUNqQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDMUIsS0FBSyxFQUFFLFNBQVM7b0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixJQUFJO29CQUNKLFVBQVUsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO29CQUN2QyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQztvQkFDcEMsSUFBSTtvQkFDSixVQUFVO2lCQUNiLENBQUMsQ0FBQztnQkFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUN2QjtTQUNKO0lBQ0wsQ0FBQztJQUVELDhDQUE4QztJQUN0QyxnQkFBZ0I7UUFDcEIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDcEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUzRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN0QyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLFVBQVU7YUFDcEM7U0FDSjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDM0QsQ0FBQztDQUdKO0FBclhELGdEQXFYQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBpcyB3aGVyZSB5b3Ugc2hvdWxkIHB1dCBsb2dpYyB0byBjb250cm9sIHRoZSBnYW1lIGFuZCBldmVyeXRoaW5nXG4vLyBhcm91bmQgaXQuXG5pbXBvcnQgeyBCYXNlQ2xhc3NlcywgUGlyYXRlc0dhbWUsIFBpcmF0ZXNHYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuaW1wb3J0IHsgZmlsdGVySW5QbGFjZSB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuaW1wb3J0IHsgVW5pdCB9IGZyb20gXCIuL3VuaXRcIjtcblxuLyoqIEEgbm9kZSBvbiB0aGUgbWVyY2hhbnQgcGF0aC1maW5kaW5nIHN0YWNrICovXG5pbnRlcmZhY2UgSVBhdGgge1xuICAgIC8qKiBUaGUgVGlsZSBvbiB0aGlzIHBhdGguICovXG4gICAgdGlsZTogVGlsZTtcbiAgICAvKiogU2NvcmUgaGV1cmlzdGljICovXG4gICAgZzogbnVtYmVyO1xuICAgIC8qKiBQYXJlbnQgVGlsZSBub2RlIHRvIHJlY29uc3RydWN0IHRoZSBwYXRoLiAqL1xuICAgIHBhcmVudDogSVBhdGggfCB1bmRlZmluZWQ7XG59XG5cbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBnYW1lIGxvZ2ljIGFyb3VuZCB0aGUgUGlyYXRlcyBHYW1lLlxuICogVGhpcyBpcyB3aGVyZSB5b3UgY291bGQgZG8gbG9naWMgZm9yIGNoZWNraW5nIGlmIHRoZSBnYW1lIGlzIG92ZXIsIHVwZGF0ZVxuICogdGhlIGdhbWUgYmV0d2VlbiB0dXJucywgYW5kIGFueXRoaW5nIHRoYXQgdGllcyBhbGwgdGhlIFwic3R1ZmZcIiBpbiB0aGUgZ2FtZVxuICogdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaXJhdGVzR2FtZU1hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lTWFuYWdlciB7XG4gICAgLyoqIE90aGVyIHN0cmluZ3MgKGNhc2UgaW5zZW5zaXRpdmUpIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gSUQgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICAgICAgXCJNZWdhTWluZXJBSS0yMS1QaXJhdGVzXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IFBpcmF0ZXNHYW1lO1xuXG4gICAgLyoqIFRoZSBmYWN0b3J5IHRoYXQgbXVzdCBiZSB1c2VkIHRvIGluaXRpYWxpemUgbmV3IGdhbWUgb2JqZWN0cyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmVhdGUhOiBQaXJhdGVzR2FtZU9iamVjdEZhY3Rvcnk7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtbWV0aG9kcyAtLT4+XG5cbiAgICAvKiogVGhlIG5ldyB1bml0cyBjcmVhdGVkIERVUklORyB0dXJucy4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbmV3VW5pdHM6IFVuaXRbXSA9IFtdO1xuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEJFRk9SRSBlYWNoIHBsYXllcidzIHJ1blR1biBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICAgKiAoaW5jbHVkaW5nIHRoZSBmaXJzdCB0dXJuKS5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBnZXQgdGhlaXIgcGxheWVyIHJlYWR5IGZvciB0aGVpciB0dXJuLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBiZWZvcmVUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5iZWZvcmVUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgICAgICB0aGlzLnVwZGF0ZUFycmF5cygpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEFGVEVSIGVhY2ggcGxheWVyJ3MgdHVybiBlbmRzLiBCZWZvcmUgdGhlIHR1cm4gY291bnRlclxuICAgICAqIGluY3JlYXNlcy5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBlbmQtb2YtdHVybiBlZmZlY3RzLCBhbmQgY2xlYW4gdXAgYXJyYXlzLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBhZnRlclR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmFmdGVyVHVybigpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuXG4gICAgICAgIHRoaXMudXBkYXRlQXJyYXlzKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVW5pdHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVNZXJjaGFudHMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVPdGhlclN0dWZmKCk7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2FtZSBpcyBvdmVyIGluIGJldHdlZW4gdHVybnMuXG4gICAgICogVGhpcyBpcyBpbnZva2VkIEFGVEVSIGFmdGVyVHVybigpIGlzIGNhbGxlZCwgYnV0IEJFRk9SRSBiZWZvcmVUdXJuKClcbiAgICAgKiBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBnYW1lIGlzIGluZGVlZCBvdmVyLCBvdGhlcndpc2UgaWYgdGhlIGdhbWVcbiAgICAgKiBzaG91bGQgY29udGludWUgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICBzdXBlci5wcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gUHJpbWFyeSB3aW4gY29uZGl0aW9uczogZGVzdHJveSB5b3VyIGVuZW15J3MgdW5pdHMgYW5kIHJvYiB0aGVtIG9mIGVub3VnaCBvZiB0aGVpciBnb2xkXG4gICAgICAgIGNvbnN0IGtpbGxlZE9mZiA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmZpbHRlcigocCkgPT4gcC5nb2xkIDwgdGhpcy5nYW1lLnNoaXBDb3N0ICYmIHAudW5pdHMubGVuZ3RoID09PSAwKTtcblxuICAgICAgICBpZiAoa2lsbGVkT2ZmLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgdGhpcy5zZWNvbmRhcnlXaW5Db25kaXRpb25zKFwiWWUga2lsbGVkIGVhY2ggb3RoZXJcIik7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtpbGxlZE9mZi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvc2VyID0ga2lsbGVkT2ZmWzBdO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFwiWWUga2lsbGVkIHRoZSBvdGhlciBwaXJhdGUhXCIsIGxvc2VyLm9wcG9uZW50KTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKFwiQ3JldyBiZSBpbiBEYXZ5IEpvbmVzJyBsb2NrZXIsIGFuZCBjYW4ndCBidWlsZCBhIHNoaXBcIiwgbG9zZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIC8vIGNsb25lIHRoZSBhcnJheSBhcyBzb3J0aW5nIGlzIGluIHBsYWNlXG4gICAgICAgIGNvbnN0IHBsYXllcnMgPSB0aGlzLmdhbWUucGxheWVycy5zbGljZSgpO1xuXG4gICAgICAgIC8vIDEuIE1vc3QgaW5mYW15XG4gICAgICAgIHBsYXllcnMuc29ydCgoYSwgYikgPT4gYi5pbmZhbXkgLSBhLmluZmFteSk7XG4gICAgICAgIGlmIChwbGF5ZXJzWzBdLmluZmFteSA+IHBsYXllcnNbMV0uaW5mYW15KSB7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoYCR7cmVhc29ufTogSGFkIHRoZSBtb3N0IGluZmFteWAsIHBsYXllcnNbMF0pO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoYCR7cmVhc29ufTogSGFkIHRoZSBsZWFzdCBpbmZhbXlgLCBwbGF5ZXJzWzFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIuIE1vc3QgbmV0IHdvcnRoXG4gICAgICAgIHBsYXllcnMuc29ydCgoYSwgYikgPT4gYi5uZXRXb3J0aCgpIC0gYS5uZXRXb3J0aCgpKTtcbiAgICAgICAgaWYgKHBsYXllcnNbMF0ubmV0V29ydGgoKSA+IHBsYXllcnNbMV0ubmV0V29ydGgoKSkge1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn06IEhhZCB0aGUgaGlnaGVzdCBuZXQgd29ydGhgLCBwbGF5ZXJzWzBdKTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKGAke3JlYXNvbn06IEhhZCB0aGUgbG93ZXN0IG5ldCB3b3J0aGAsIHBsYXllcnNbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gMy4gQ29pbiB0b3NzIChoYW5kbGVkIGJ5IGRlZmF1bHQgYmVsb3cpXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNlY29uZGFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGVuZCB0aGUgZ2FtZS5cbiAgICAgICAgLy8gSWYgbm8gd2lubmVyIGl0IGRldGVybWluZWQgYWJvdmUsIHRoZW4gYSByYW5kb20gb25lIHdpbGwgYmUgY2hvc2VuLlxuICAgICAgICBzdXBlci5zZWNvbmRhcnlXaW5Db25kaXRpb25zKHJlYXNvbik7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBhcnJheXMgY2xpZW50cyBjYW4gc2VlIHNvIHRoZXkgZG8gbm90IHJlc2l6ZSBkdXJpbmcgdHVybnMuXG4gICAgICovXG4gICAgcHJpdmF0ZSB1cGRhdGVBcnJheXMoKTogdm9pZCB7XG4gICAgICAgIC8vIFByb3Blcmx5IGFkZCBhbGwgbmV3IHVuaXRzXG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiB0aGlzLm5ld1VuaXRzKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUudW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgICAgIGlmICh1bml0Lm93bmVyKSB7XG4gICAgICAgICAgICAgICAgdW5pdC5vd25lci51bml0cy5wdXNoKHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IGVtcHR5IGl0IGFzIHdlJ3ZlIGR1bXBlZCBhbGwgdGhlIG5ldyB1bml0cyBpbnRvIHRoZWlyIGFycmF5cy5cbiAgICAgICAgdGhpcy5uZXdVbml0cy5sZW5ndGggPSAwO1xuXG4gICAgICAgIC8vIGlmIHRoZSB1bml0IGhhcyBhIHRpbGUsIGl0IGlzIGFsaXZlLCBzbyBrZWVwIGl0XG4gICAgICAgIGNvbnN0IGtlZXBBbGl2ZVVuaXRzID0gKHVuaXQ6IFVuaXQpID0+IEJvb2xlYW4odW5pdC50aWxlKTtcblxuICAgICAgICBmaWx0ZXJJblBsYWNlKHRoaXMuZ2FtZS51bml0cywga2VlcEFsaXZlVW5pdHMpO1xuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLmdhbWUucGxheWVycykge1xuICAgICAgICAgICAgZmlsdGVySW5QbGFjZShwbGF5ZXIudW5pdHMsIGtlZXBBbGl2ZVVuaXRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKiBVcGRhdGVzIHVuaXRzIGluLWJldHdlZW4gdHVybnMgKi9cbiAgICBwcml2YXRlIHVwZGF0ZVVuaXRzKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnVuaXRzKSB7XG4gICAgICAgICAgICAvLyBSZXNldCB0aGUgdW5pdFxuICAgICAgICAgICAgaWYgKCF1bml0Lm93bmVyIHx8IHVuaXQub3duZXIgPT09IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdW5pdC5hY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHVuaXQubW92ZXMgPSBNYXRoLm1heCh0aGlzLmdhbWUuY3Jld01vdmVzLCB1bml0LnNoaXBIZWFsdGggPiAwXG4gICAgICAgICAgICAgICAgICAgID8gdGhpcy5nYW1lLnNoaXBNb3Zlc1xuICAgICAgICAgICAgICAgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRGVjcmVhc2UgdHVybnMgc3R1bm5lZFxuICAgICAgICAgICAgaWYgKHVuaXQuc3R1blR1cm5zID4gMCkge1xuICAgICAgICAgICAgICAgIHVuaXQuc3R1blR1cm5zLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghdW5pdC5vd25lciAmJiB1bml0LnRhcmdldFBvcnQpIHtcbiAgICAgICAgICAgICAgICAvLyBNb3ZlIG1lcmNoYW50IHVuaXRzXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgY3VycmVudCBwYXRoXG4gICAgICAgICAgICAgICAgbGV0IHBhdGhWYWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXQucGF0aCAmJiB1bml0LnBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gdW5pdC5wYXRoWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dC51bml0IHx8IChuZXh0LnBvcnQgJiYgbmV4dC5wb3J0Lm93bmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aFZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGhWYWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdW5pdC50aWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt1bml0fSBoYXMgbm90IFRpbGUgdG8gdXBkYXRlIGZyb20hYCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRmluZCBwYXRoIHRvIHRhcmdldCBwb3J0IChCRlMpXG4gICAgICAgICAgICAgICAgaWYgKCFwYXRoVmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3BlbjogSVBhdGhbXSA9IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlOiB1bml0LnRpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBnOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIH1dO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNsb3NlZCA9IG5ldyBTZXQ8VGlsZT4oKTtcblxuICAgICAgICAgICAgICAgICAgICB1bml0LnBhdGggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKG9wZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUG9wIHRoZSBmaXJzdCBvcGVuIGVsZW1lbnQgKGxvd2VzdCBkaXN0YW5jZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50OiBJUGF0aCB8IHVuZGVmaW5lZCA9IG9wZW4uc2hpZnQoKSBhcyBJUGF0aDsgLy8gbXVzdCBleGlzdCBmcm9tIGFib3ZlIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2xvc2VkLmhhcyhjdXJyZW50LnRpbGUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9zZWQuYWRkKGN1cnJlbnQudGlsZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGF0IHRoZSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50LnRpbGUgPT09IHVuaXQudGFyZ2V0UG9ydC50aWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQudGlsZSAhPT0gdW5pdC50aWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0LnBhdGgudW5zaGlmdChjdXJyZW50LnRpbGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIG5laWdoYm9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmVpZ2hib3JzID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGlsZTogY3VycmVudC50aWxlLnRpbGVOb3J0aCwgY29zdDogMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGlsZTogY3VycmVudC50aWxlLnRpbGVFYXN0LCBjb3N0OiAxIC8gTWF0aC5taW4oY3VycmVudC5nICogMTAsIDEwMDApICsgMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGlsZTogY3VycmVudC50aWxlLnRpbGVTb3V0aCwgY29zdDogMSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGlsZTogY3VycmVudC50aWxlLnRpbGVXZXN0LCBjb3N0OiAxIC8gTWF0aC5taW4oY3VycmVudC5nICogMTAsIDEwMDApICsgMX0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdW5zb3J0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbmVpZ2hib3Igb2YgbmVpZ2hib3JzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yLnRpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgcGF0aCB0aHJvdWdoIGxhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yLnRpbGUudHlwZSA9PT0gXCJsYW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgcGF0aCB0aHJvdWdoIHBsYXllciBwb3J0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmVpZ2hib3IudGlsZS5wb3J0ICYmIG5laWdoYm9yLnRpbGUucG9ydC5vd25lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEb24ndCBwYXRoIHRocm91Z2ggZnJpZW5kbHkgdW5pdHMgdW5sZXNzIGl0J3MgYSBwb3J0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZWlnaGJvci50aWxlLnVuaXQgJiYgIW5laWdoYm9yLnRpbGUucG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVuLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZTogbmVpZ2hib3IudGlsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGc6IGN1cnJlbnQuZyArIG5laWdoYm9yLmNvc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGN1cnJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bnNvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTb3J0IG9wZW4gbGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVuc29ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3Blbi5zb3J0KChhLCBiKSA9PiBhLmcgLSBiLmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSB0aGUgbWVyY2hhbnQgYXR0YWNrIHRoaXMgdHVybidzIHBsYXllciBpZiB0aGV5IGhhdmUgYSB1bml0IGluIHJhbmdlXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIudW5pdHMuZmluZCgodSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGF0dGFjayBzaGlwc1xuICAgICAgICAgICAgICAgICAgICBpZiAodS5zaGlwSGVhbHRoIDw9IDAgfHwgIXUudGlsZSB8fCAhdW5pdC50aWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBpbiByYW5nZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5nZSA9ICh1bml0LnRpbGUueCAtIHUudGlsZS54KSAqKiAyICsgKHVuaXQudGlsZS55IC0gdS50aWxlLnkpICoqIDI7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJhbmdlIDw9IHRoaXMuZ2FtZS5zaGlwUmFuZ2UgKiogMjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0LnRpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXR0YWNrIHRoZSB0YXJnZXRcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnNoaXBIZWFsdGggLT0gdGhpcy5nYW1lLnNoaXBEYW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQuc2hpcEhlYWx0aCA8PSAwICYmICF0YXJnZXQudGlsZS5wb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnRpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc2hpcEhlYWx0aCA9IE1hdGgubWF4KDAsIHRhcmdldC5zaGlwSGVhbHRoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBNb3ZlIHRoZSBtZXJjaGFudFxuICAgICAgICAgICAgICAgIGlmICh1bml0LnBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBpdCdzIGF0IGl0cyBkZXN0aW5hdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAodW5pdC5wYXRoWzBdLnBvcnQgPT09IHVuaXQudGFyZ2V0UG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWFyayBpdCBhcyBkZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0LnRpbGUudW5pdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRpbGUgPSB1bml0LnBhdGguc2hpZnQoKSBhcyBUaWxlOyAvLyBtdXN0IGV4aXN0IGZyb20gYWJvdmUgY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC50aWxlID0gdGlsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudW5pdCA9IHVuaXQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBtZXJjaGFudHMgaW4gdGhlIGdhbWUsIG1vdmluZyB0aGVtIGFuZCB1cGRhdGluZyB0aGVpciBnb2xkLlxuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlTWVyY2hhbnRzKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtZXJjaGFudEdvbGQgPSB0aGlzLmdhbWUuc2hpcENvc3Q7XG4gICAgICAgIGNvbnN0IG1lcmNoYW50QmFzZUNyZXcgPSAzO1xuICAgICAgICBjb25zdCBtZXJjaGFudENvc3QgPSB0aGlzLmdhbWUuc2hpcENvc3QgKiA0O1xuXG4gICAgICAgIC8vIENyZWF0ZSB1bml0cyBhcyBuZWVkZWRcbiAgICAgICAgY29uc3QgbWVyY2hhbnRQb3J0cyA9IHRoaXMuZ2FtZS5wb3J0cy5maWx0ZXIoKHApID0+ICFwLm93bmVyKTtcbiAgICAgICAgZm9yIChjb25zdCBwb3J0IG9mIG1lcmNoYW50UG9ydHMpIHtcbiAgICAgICAgICAgIC8vIFNraXAgcGxheWVyLW93bmVkIHBvcnRzXG4gICAgICAgICAgICBpZiAocG9ydC5vd25lcikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgZ29sZCB0byB0aGUgcG9ydFxuICAgICAgICAgICAgcG9ydC5nb2xkICs9IHRoaXMuZ2FtZS5tZXJjaGFudEdvbGRSYXRlO1xuXG4gICAgICAgICAgICAvLyBUcnkgdG8gc3Bhd24gYSBzaGlwXG4gICAgICAgICAgICBpZiAoIXBvcnQudGlsZS51bml0ICYmIHBvcnQuZ29sZCA+PSBtZXJjaGFudENvc3QpIHtcbiAgICAgICAgICAgICAgICAvLyBEZWR1Y3QgZ29sZFxuICAgICAgICAgICAgICAgIHBvcnQuZ29sZCAtPSBtZXJjaGFudENvc3Q7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgY3JldyBhbmQgZ29sZFxuICAgICAgICAgICAgICAgIGNvbnN0IGdvbGQgPSBtZXJjaGFudEdvbGQgKyAocG9ydC5pbnZlc3RtZW50ICogdGhpcy5nYW1lLm1lcmNoYW50SW50ZXJlc3RSYXRlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnZlc3RlZCA9IE1hdGguZmxvb3IocG9ydC5pbnZlc3RtZW50ICogdGhpcy5nYW1lLm1lcmNoYW50SW50ZXJlc3RSYXRlIC8gdGhpcy5nYW1lLmNyZXdDb3N0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjcmV3ID0gbWVyY2hhbnRCYXNlQ3JldyArIGludmVzdGVkO1xuXG4gICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBvcHBvc2l0ZSBwb3J0IG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nYW1lLmdldFRpbGUoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5tYXBXaWR0aCAtIHBvcnQudGlsZS54IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLm1hcEhlaWdodCAtIHBvcnQudGlsZS55IC0gMSxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWVyY2hhbmdlIGhhcyBubyBvcHBvc2l0ZSB0YXJnZXQhXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFBvcnQgPSB0YXJnZXQucG9ydDtcblxuICAgICAgICAgICAgICAgIC8vIFNwYXduIHRoZSB1bml0XG4gICAgICAgICAgICAgICAgY29uc3QgdW5pdCA9IHRoaXMuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICB0aWxlOiBwb3J0LnRpbGUsXG4gICAgICAgICAgICAgICAgICAgIGNyZXcsXG4gICAgICAgICAgICAgICAgICAgIGNyZXdIZWFsdGg6IGNyZXcgKiB0aGlzLmdhbWUuY3Jld0hlYWx0aCxcbiAgICAgICAgICAgICAgICAgICAgc2hpcEhlYWx0aDogdGhpcy5nYW1lLnNoaXBIZWFsdGggLyAyLFxuICAgICAgICAgICAgICAgICAgICBnb2xkLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRQb3J0LFxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdW5pdC50aWxlLnVuaXQgPSB1bml0O1xuICAgICAgICAgICAgICAgIHRoaXMubmV3VW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgICAgICAgICBwb3J0LmludmVzdG1lbnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqIFVwZGF0ZSBvdGhlciB2YXJpYWJsZXMgaW4tYmV0d2VlbiB0dXJucyAqL1xuICAgIHByaXZhdGUgdXBkYXRlT3RoZXJTdHVmZigpOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCB0aWxlIG9mIHRoaXMuZ2FtZS50aWxlcykge1xuICAgICAgICAgICAgY29uc3QgZ29sZCA9IHRpbGUuZ29sZCAqIHRoaXMuZ2FtZS5idXJ5SW50ZXJlc3RSYXRlO1xuICAgICAgICAgICAgdGlsZS5nb2xkID0gTWF0aC5taW4oZ29sZCwgdGhpcy5nYW1lLnNldHRpbmdzLm1heFRpbGVHb2xkKTtcblxuICAgICAgICAgICAgaWYgKHRpbGUudW5pdCAmJiB0aWxlLnVuaXQudGlsZSAhPT0gdGlsZSkge1xuICAgICAgICAgICAgICAgIHRpbGUudW5pdCA9IHVuZGVmaW5lZDsgLy8gaXQgZGllZFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIucG9ydC5nb2xkID0gdGhpcy5nYW1lLnNoaXBDb3N0O1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cbn1cbiJdfQ==