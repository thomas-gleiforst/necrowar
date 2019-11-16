"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
const warehouse_1 = require("./warehouse");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Anarchy Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class AnarchyGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-16-Anarchy",
        ];
    }
    // <<-- Creer-Merge: public-methods -->>
    /**
     * Creates a building of the specified type.
     *
     * @param type - The type of building to create. Must be the class name.
     * @param data - The initialization data for that building.
     * @returns A new building of that type.
     */
    createBuilding(type, data) {
        let building;
        switch (type) {
            case "FireDepartment":
                building = this.create.fireDepartment(data);
                building.owner.fireDepartments.push(building);
                break;
            case "PoliceDepartment":
                building = this.create.policeDepartment(data);
                building.owner.policeDepartments.push(building);
                break;
            case "Warehouse":
                building = this.create.warehouse(data);
                building.owner.warehouses.push(building);
                break;
            case "WeatherStation":
                building = this.create.weatherStation(data);
                building.owner.weatherStations.push(building);
                break;
            default:
                throw new Error(`${type} is not a valid building type to create`);
        }
        this.game.buildingsGrid[building.x][building.y] = building;
        this.game.buildings.push(building);
        building.owner.buildings.push(building);
        return building;
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
        for (const player of this.game.players) {
            player.bribesRemaining = this.game.baseBribesPerTurn;
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
        const playersBurnedDownBuildings = new Map();
        const fireSpreads = [];
        for (const player of this.game.players) {
            playersBurnedDownBuildings.set(player, 0);
        }
        for (const building of this.game.buildings) {
            if (building.fire > 0) {
                building.health = Math.max(0, building.health - building.fire); // it takes fire damage
                if (building.health <= 0) {
                    const num = playersBurnedDownBuildings.get(building.owner);
                    if (num === undefined) {
                        continue; // dead building
                    }
                    playersBurnedDownBuildings.set(building.owner, num);
                }
                // Try to spread the fire
                if (this.game.currentForecast.intensity > 0) {
                    const buildingSpreadingTo = building.getNeighbor(this.game.currentForecast.direction);
                    if (buildingSpreadingTo) {
                        fireSpreads.push({
                            building: buildingSpreadingTo,
                            fire: Math.min(building.fire, this.game.currentForecast.intensity),
                        });
                    }
                }
                // it dies down after dealing damage
                building.fire = Math.max(0, building.fire - this.game.settings.firePerTurnReduction);
            }
            if (building instanceof warehouse_1.Warehouse && building.exposure > 0 && !building.bribed) {
                // then they didn't act, so their exposure drops
                building.exposure = Math.max(building.exposure - this.game.settings.exposurePerTurnReduction, 0);
            }
            building.bribed = false;
        }
        // spread fire, now that everything has taken fire damage
        for (const fireSpread of fireSpreads) {
            fireSpread.building.fire = Math.max(fireSpread.building.fire, fireSpread.fire);
        }
        if (this.game.nextForecast) {
            // if there is a next turn, update the current forecast
            this.game.currentForecast = this.game.nextForecast;
        }
        // Turn isn't incremented until super statement
        this.game.nextForecast = this.game.forecasts[this.game.currentTurn + 1];
        for (const player of this.game.players) {
            const num = playersBurnedDownBuildings.get(player) || 0;
            player.bribesRemaining = this.game.baseBribesPerTurn + num;
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
        let loser;
        let gameOver = false;
        for (const player of this.game.players) {
            if (player.headquarters.health <= 0) { // then it burned down, and they have lost
                if (loser) {
                    // someone else already lost this turn...
                    // so they both lost their headquarters this turn,
                    // so check secondary win conditions (and the game is over)
                    this.secondaryWinConditions("Both headquarters reached zero health on the same turn");
                    gameOver = true;
                    loser = undefined;
                    break;
                }
                loser = player;
            }
        }
        if (gameOver) {
            if (loser) {
                this.declareLoser("Headquarters reached zero health.", loser);
                this.declareWinner("Reduced health of enemy's headquarters to zero.", loser.opponent);
            }
            return true; // the game is over
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
        // 1. Check if one player's HQ has more heath than the other
        const headquarters = this.game.players
            .map((p) => p.headquarters)
            .sort((a, b) => b.health - a.health);
        if (headquarters[0].health !== headquarters[1].health) {
            this.declareWinner(`${reason} - Your headquarters had the most health remaining.`, headquarters[0].owner);
            this.declareLoser(`${reason} - Your headquarters had less health remaining than another player.`, headquarters[1].owner);
            return;
        }
        // 2. Else, check if one player has more building alive than the other
        const buildingsAlive = this.game.players
            .map((p) => p.buildings.filter((b) => b.health > 0))
            .sort((a, b) => b.length - a.length);
        if (buildingsAlive[0].length !== buildingsAlive[1].length) {
            // store the winner as the loser could be lost in this scope if their array is empty
            const winner = buildingsAlive[0][0].owner;
            this.declareWinner(`${reason} - You had the most buildings not burned down.`, winner);
            this.declareLoser(`${reason} - You had more buildings burned down than another player.`, winner.opponent);
            return;
        }
        // 3. Else, check if one player has a higher sum of the buildings' healths
        const buildingsHealthSum = this.game.players
            .map((p) => p.buildings.reduce((sum, b) => sum + b.health, 0));
        if (buildingsHealthSum[0] !== buildingsHealthSum[1]) {
            const winner = this.game.players[buildingsHealthSum[0] > buildingsHealthSum[1]
                ? 0
                : 1];
            this.declareWinner(`${reason} - You had the highest health sum among your Buildings.`, winner);
            this.declareLoser(`${reason} - You had a lower health sum than the other player.`, winner.opponent);
            return;
        }
        // else all their buildings are identical,
        // so they are probably the same AIs, so just random chance
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
}
exports.AnarchyGameManager = AnarchyGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2FuYXJjaHkvZ2FtZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkVBQTZFO0FBQzdFLGFBQWE7QUFDYix5QkFBd0U7QUFReEUsMkNBQXdDO0FBRXhDLGtDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsY0FBVyxDQUFDLFdBQVc7SUFDM0QsaUVBQWlFO0lBQzFELE1BQU0sS0FBSyxPQUFPO1FBQ3JCLE9BQU87WUFDSCxpQ0FBaUM7WUFDakMsd0JBQXdCO1NBRTNCLENBQUM7SUFDTixDQUFDO0lBUUQsd0NBQXdDO0lBRXhDOzs7Ozs7T0FNRztJQUNJLGNBQWMsQ0FDakIsSUFBcUYsRUFDckYsSUFBa0I7UUFFbEIsSUFBSSxRQUE4QixDQUFDO1FBQ25DLFFBQVEsSUFBSSxFQUFFO1lBQ1YsS0FBSyxnQkFBZ0I7Z0JBQ2pCLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQTBCLENBQUMsQ0FBQztnQkFDaEUsTUFBTTtZQUNWLEtBQUssa0JBQWtCO2dCQUNuQixRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDOUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBNEIsQ0FBQyxDQUFDO2dCQUNwRSxNQUFNO1lBQ1YsS0FBSyxXQUFXO2dCQUNaLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQXFCLENBQUMsQ0FBQztnQkFD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QUFDO0lBQ3pDLENBQUM7Q0FPSjtBQXRRRCxnREFzUUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgd2hlcmUgeW91IHNob3VsZCBwdXQgbG9naWMgdG8gY29udHJvbCB0aGUgZ2FtZSBhbmQgZXZlcnl0aGluZ1xuLy8gYXJvdW5kIGl0LlxuaW1wb3J0IHsgQW5hcmNoeUdhbWUsIEFuYXJjaHlHYW1lT2JqZWN0RmFjdG9yeSwgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBCdWlsZGluZ0FyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEJ1aWxkaW5nIH0gZnJvbSBcIi4vYnVpbGRpbmdcIjtcbmltcG9ydCB7IEZpcmVEZXBhcnRtZW50IH0gZnJvbSBcIi4vZmlyZS1kZXBhcnRtZW50XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFBvbGljZURlcGFydG1lbnQgfSBmcm9tIFwiLi9wb2xpY2UtZGVwYXJ0bWVudFwiO1xuaW1wb3J0IHsgV2FyZWhvdXNlIH0gZnJvbSBcIi4vd2FyZWhvdXNlXCI7XG5pbXBvcnQgeyBXZWF0aGVyU3RhdGlvbiB9IGZyb20gXCIuL3dlYXRoZXItc3RhdGlvblwiO1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIE1hbmFnZXMgdGhlIGdhbWUgbG9naWMgYXJvdW5kIHRoZSBBbmFyY2h5IEdhbWUuXG4gKiBUaGlzIGlzIHdoZXJlIHlvdSBjb3VsZCBkbyBsb2dpYyBmb3IgY2hlY2tpbmcgaWYgdGhlIGdhbWUgaXMgb3ZlciwgdXBkYXRlXG4gKiB0aGUgZ2FtZSBiZXR3ZWVuIHR1cm5zLCBhbmQgYW55dGhpbmcgdGhhdCB0aWVzIGFsbCB0aGUgXCJzdHVmZlwiIGluIHRoZSBnYW1lXG4gKiB0b2dldGhlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEFuYXJjaHlHYW1lTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVNYW5hZ2VyIHtcbiAgICAvKiogT3RoZXIgc3RyaW5ncyAoY2FzZSBpbnNlbnNpdGl2ZSkgdGhhdCBjYW4gYmUgdXNlZCBhcyBhbiBJRCAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGFsaWFzZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgICAgICBcIk1lZ2FNaW5lckFJLTE2LUFuYXJjaHlcIixcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhbGlhc2VzIC0tPj5cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvKiogVGhlIGdhbWUgdGhpcyBHYW1lTWFuYWdlciBpcyBtYW5hZ2luZyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lITogQW5hcmNoeUdhbWU7XG5cbiAgICAvKiogVGhlIGZhY3RvcnkgdGhhdCBtdXN0IGJlIHVzZWQgdG8gaW5pdGlhbGl6ZSBuZXcgZ2FtZSBvYmplY3RzICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNyZWF0ZSE6IEFuYXJjaHlHYW1lT2JqZWN0RmFjdG9yeTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBidWlsZGluZyBvZiB0aGUgc3BlY2lmaWVkIHR5cGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdHlwZSAtIFRoZSB0eXBlIG9mIGJ1aWxkaW5nIHRvIGNyZWF0ZS4gTXVzdCBiZSB0aGUgY2xhc3MgbmFtZS5cbiAgICAgKiBAcGFyYW0gZGF0YSAtIFRoZSBpbml0aWFsaXphdGlvbiBkYXRhIGZvciB0aGF0IGJ1aWxkaW5nLlxuICAgICAqIEByZXR1cm5zIEEgbmV3IGJ1aWxkaW5nIG9mIHRoYXQgdHlwZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3JlYXRlQnVpbGRpbmcoXG4gICAgICAgIHR5cGU6IFwiRmlyZURlcGFydG1lbnRcIiB8IFwiUG9saWNlRGVwYXJ0bWVudFwiIHwgXCJXYXJlaG91c2VcIiB8IFwiV2VhdGhlclN0YXRpb25cIiB8IHN0cmluZyxcbiAgICAgICAgZGF0YTogQnVpbGRpbmdBcmdzLFxuICAgICk6IEJ1aWxkaW5nIHtcbiAgICAgICAgbGV0IGJ1aWxkaW5nOiBCdWlsZGluZyB8IHVuZGVmaW5lZDtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiRmlyZURlcGFydG1lbnRcIjpcbiAgICAgICAgICAgICAgICBidWlsZGluZyA9IHRoaXMuY3JlYXRlLmZpcmVEZXBhcnRtZW50KGRhdGEpO1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nLm93bmVyLmZpcmVEZXBhcnRtZW50cy5wdXNoKGJ1aWxkaW5nIGFzIEZpcmVEZXBhcnRtZW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQb2xpY2VEZXBhcnRtZW50XCI6XG4gICAgICAgICAgICAgICAgYnVpbGRpbmcgPSB0aGlzLmNyZWF0ZS5wb2xpY2VEZXBhcnRtZW50KGRhdGEpO1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nLm93bmVyLnBvbGljZURlcGFydG1lbnRzLnB1c2goYnVpbGRpbmcgYXMgUG9saWNlRGVwYXJ0bWVudCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiV2FyZWhvdXNlXCI6XG4gICAgICAgICAgICAgICAgYnVpbGRpbmcgPSB0aGlzLmNyZWF0ZS53YXJlaG91c2UoZGF0YSk7XG4gICAgICAgICAgICAgICAgYnVpbGRpbmcub3duZXIud2FyZWhvdXNlcy5wdXNoKGJ1aWxkaW5nIGFzIFdhcmVob3VzZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiV2VhdGhlclN0YXRpb25cIjpcbiAgICAgICAgICAgICAgICBidWlsZGluZyA9IHRoaXMuY3JlYXRlLndlYXRoZXJTdGF0aW9uKGRhdGEpO1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nLm93bmVyLndlYXRoZXJTdGF0aW9ucy5wdXNoKGJ1aWxkaW5nIGFzIFdlYXRoZXJTdGF0aW9uKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3R5cGV9IGlzIG5vdCBhIHZhbGlkIGJ1aWxkaW5nIHR5cGUgdG8gY3JlYXRlYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdhbWUuYnVpbGRpbmdzR3JpZFtidWlsZGluZy54XVtidWlsZGluZy55XSA9IGJ1aWxkaW5nO1xuICAgICAgICB0aGlzLmdhbWUuYnVpbGRpbmdzLnB1c2goYnVpbGRpbmcpO1xuICAgICAgICBidWlsZGluZy5vd25lci5idWlsZGluZ3MucHVzaChidWlsZGluZyk7XG5cbiAgICAgICAgcmV0dXJuIGJ1aWxkaW5nO1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtbWV0aG9kcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBCRUZPUkUgZWFjaCBwbGF5ZXIncyBydW5UdW4gZnVuY3Rpb24gaXMgY2FsbGVkXG4gICAgICogKGluY2x1ZGluZyB0aGUgZmlyc3QgdHVybikuXG4gICAgICogVGhpcyBpcyBhIGdvb2QgcGxhY2UgdG8gZ2V0IHRoZWlyIHBsYXllciByZWFkeSBmb3IgdGhlaXIgdHVybi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYmVmb3JlVHVybigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgc3VwZXIuYmVmb3JlVHVybigpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGJlZm9yZS10dXJuIC0tPj5cblxuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLmdhbWUucGxheWVycykge1xuICAgICAgICAgICAgcGxheWVyLmJyaWJlc1JlbWFpbmluZyA9IHRoaXMuZ2FtZS5iYXNlQnJpYmVzUGVyVHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQUZURVIgZWFjaCBwbGF5ZXIncyB0dXJuIGVuZHMuIEJlZm9yZSB0aGUgdHVybiBjb3VudGVyXG4gICAgICogaW5jcmVhc2VzLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGVuZC1vZi10dXJuIGVmZmVjdHMsIGFuZCBjbGVhbiB1cCBhcnJheXMuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGFmdGVyVHVybigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgc3VwZXIuYWZ0ZXJUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWZ0ZXItdHVybiAtLT4+XG4gICAgICAgIGNvbnN0IHBsYXllcnNCdXJuZWREb3duQnVpbGRpbmdzID0gbmV3IE1hcDxQbGF5ZXIsIG51bWJlcj4oKTtcbiAgICAgICAgY29uc3QgZmlyZVNwcmVhZHM6IEFycmF5PHtcbiAgICAgICAgICAgIC8qKiBUaGUgYnVpbGRpbmcgdG8gc3ByZWFkIHRvLiAqL1xuICAgICAgICAgICAgYnVpbGRpbmc6IEJ1aWxkaW5nO1xuICAgICAgICAgICAgLyoqIFRoZSBmaXJlIHRoZXkgd2lsbCBhY2N1bXVsYXRlLiAqL1xuICAgICAgICAgICAgZmlyZTogbnVtYmVyO1xuICAgICAgICB9PiA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIHRoaXMuZ2FtZS5wbGF5ZXJzKSB7XG4gICAgICAgICAgICBwbGF5ZXJzQnVybmVkRG93bkJ1aWxkaW5ncy5zZXQocGxheWVyLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgYnVpbGRpbmcgb2YgdGhpcy5nYW1lLmJ1aWxkaW5ncykge1xuICAgICAgICAgICAgaWYgKGJ1aWxkaW5nLmZpcmUgPiAwKSB7XG4gICAgICAgICAgICAgICAgYnVpbGRpbmcuaGVhbHRoID0gTWF0aC5tYXgoMCwgYnVpbGRpbmcuaGVhbHRoIC0gYnVpbGRpbmcuZmlyZSk7IC8vIGl0IHRha2VzIGZpcmUgZGFtYWdlXG5cbiAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmcuaGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbnVtID0gcGxheWVyc0J1cm5lZERvd25CdWlsZGluZ3MuZ2V0KGJ1aWxkaW5nLm93bmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gZGVhZCBidWlsZGluZ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBsYXllcnNCdXJuZWREb3duQnVpbGRpbmdzLnNldChidWlsZGluZy5vd25lciwgbnVtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gc3ByZWFkIHRoZSBmaXJlXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5jdXJyZW50Rm9yZWNhc3QuaW50ZW5zaXR5ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBidWlsZGluZ1NwcmVhZGluZ1RvID0gYnVpbGRpbmcuZ2V0TmVpZ2hib3IodGhpcy5nYW1lLmN1cnJlbnRGb3JlY2FzdC5kaXJlY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnVpbGRpbmdTcHJlYWRpbmdUbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlyZVNwcmVhZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRpbmc6IGJ1aWxkaW5nU3ByZWFkaW5nVG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyZTogTWF0aC5taW4oYnVpbGRpbmcuZmlyZSwgdGhpcy5nYW1lLmN1cnJlbnRGb3JlY2FzdC5pbnRlbnNpdHkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBpdCBkaWVzIGRvd24gYWZ0ZXIgZGVhbGluZyBkYW1hZ2VcbiAgICAgICAgICAgICAgICBidWlsZGluZy5maXJlID0gTWF0aC5tYXgoMCwgYnVpbGRpbmcuZmlyZSAtIHRoaXMuZ2FtZS5zZXR0aW5ncy5maXJlUGVyVHVyblJlZHVjdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChidWlsZGluZyBpbnN0YW5jZW9mIFdhcmVob3VzZSAmJiBidWlsZGluZy5leHBvc3VyZSA+IDAgJiYgIWJ1aWxkaW5nLmJyaWJlZCkge1xuICAgICAgICAgICAgICAgIC8vIHRoZW4gdGhleSBkaWRuJ3QgYWN0LCBzbyB0aGVpciBleHBvc3VyZSBkcm9wc1xuICAgICAgICAgICAgICAgIGJ1aWxkaW5nLmV4cG9zdXJlID0gTWF0aC5tYXgoYnVpbGRpbmcuZXhwb3N1cmUgLSB0aGlzLmdhbWUuc2V0dGluZ3MuZXhwb3N1cmVQZXJUdXJuUmVkdWN0aW9uLCAwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnVpbGRpbmcuYnJpYmVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzcHJlYWQgZmlyZSwgbm93IHRoYXQgZXZlcnl0aGluZyBoYXMgdGFrZW4gZmlyZSBkYW1hZ2VcbiAgICAgICAgZm9yIChjb25zdCBmaXJlU3ByZWFkIG9mIGZpcmVTcHJlYWRzKSB7XG4gICAgICAgICAgICBmaXJlU3ByZWFkLmJ1aWxkaW5nLmZpcmUgPSBNYXRoLm1heChmaXJlU3ByZWFkLmJ1aWxkaW5nLmZpcmUsIGZpcmVTcHJlYWQuZmlyZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nYW1lLm5leHRGb3JlY2FzdCkge1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBuZXh0IHR1cm4sIHVwZGF0ZSB0aGUgY3VycmVudCBmb3JlY2FzdFxuICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRGb3JlY2FzdCA9IHRoaXMuZ2FtZS5uZXh0Rm9yZWNhc3Q7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVHVybiBpc24ndCBpbmNyZW1lbnRlZCB1bnRpbCBzdXBlciBzdGF0ZW1lbnRcbiAgICAgICAgdGhpcy5nYW1lLm5leHRGb3JlY2FzdCA9IHRoaXMuZ2FtZS5mb3JlY2FzdHNbdGhpcy5nYW1lLmN1cnJlbnRUdXJuICsgMV07XG5cbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5nYW1lLnBsYXllcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IG51bSA9IHBsYXllcnNCdXJuZWREb3duQnVpbGRpbmdzLmdldChwbGF5ZXIpIHx8IDA7XG4gICAgICAgICAgICBwbGF5ZXIuYnJpYmVzUmVtYWluaW5nID0gdGhpcy5nYW1lLmJhc2VCcmliZXNQZXJUdXJuICsgbnVtO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2FtZSBpcyBvdmVyIGluIGJldHdlZW4gdHVybnMuXG4gICAgICogVGhpcyBpcyBpbnZva2VkIEFGVEVSIGFmdGVyVHVybigpIGlzIGNhbGxlZCwgYnV0IEJFRk9SRSBiZWZvcmVUdXJuKClcbiAgICAgKiBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBnYW1lIGlzIGluZGVlZCBvdmVyLCBvdGhlcndpc2UgaWYgdGhlIGdhbWVcbiAgICAgKiBzaG91bGQgY29udGludWUgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICBzdXBlci5wcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG4gICAgICAgIGxldCBsb3NlcjogUGxheWVyIHwgdW5kZWZpbmVkO1xuICAgICAgICBsZXQgZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5nYW1lLnBsYXllcnMpIHtcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuaGVhZHF1YXJ0ZXJzLmhlYWx0aCA8PSAwKSB7IC8vIHRoZW4gaXQgYnVybmVkIGRvd24sIGFuZCB0aGV5IGhhdmUgbG9zdFxuICAgICAgICAgICAgICAgIGlmIChsb3Nlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBzb21lb25lIGVsc2UgYWxyZWFkeSBsb3N0IHRoaXMgdHVybi4uLlxuICAgICAgICAgICAgICAgICAgICAvLyBzbyB0aGV5IGJvdGggbG9zdCB0aGVpciBoZWFkcXVhcnRlcnMgdGhpcyB0dXJuLFxuICAgICAgICAgICAgICAgICAgICAvLyBzbyBjaGVjayBzZWNvbmRhcnkgd2luIGNvbmRpdGlvbnMgKGFuZCB0aGUgZ2FtZSBpcyBvdmVyKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXCJCb3RoIGhlYWRxdWFydGVycyByZWFjaGVkIHplcm8gaGVhbHRoIG9uIHRoZSBzYW1lIHR1cm5cIik7XG4gICAgICAgICAgICAgICAgICAgIGdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgbG9zZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsb3NlciA9IHBsYXllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChnYW1lT3Zlcikge1xuICAgICAgICAgICAgaWYgKGxvc2VyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoXCJIZWFkcXVhcnRlcnMgcmVhY2hlZCB6ZXJvIGhlYWx0aC5cIiwgbG9zZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihcIlJlZHVjZWQgaGVhbHRoIG9mIGVuZW15J3MgaGVhZHF1YXJ0ZXJzIHRvIHplcm8uXCIsIGxvc2VyLm9wcG9uZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIHRoZSBnYW1lIGlzIG92ZXJcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIC8vIDEuIENoZWNrIGlmIG9uZSBwbGF5ZXIncyBIUSBoYXMgbW9yZSBoZWF0aCB0aGFuIHRoZSBvdGhlclxuICAgICAgICBjb25zdCBoZWFkcXVhcnRlcnMgPSB0aGlzLmdhbWUucGxheWVyc1xuICAgICAgICAgICAgLm1hcCgocCkgPT4gcC5oZWFkcXVhcnRlcnMpXG4gICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYi5oZWFsdGggLSBhLmhlYWx0aCk7XG5cbiAgICAgICAgaWYgKGhlYWRxdWFydGVyc1swXS5oZWFsdGggIT09IGhlYWRxdWFydGVyc1sxXS5oZWFsdGgpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259IC0gWW91ciBoZWFkcXVhcnRlcnMgaGFkIHRoZSBtb3N0IGhlYWx0aCByZW1haW5pbmcuYCwgaGVhZHF1YXJ0ZXJzWzBdLm93bmVyKTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKGAke3JlYXNvbn0gLSBZb3VyIGhlYWRxdWFydGVycyBoYWQgbGVzcyBoZWFsdGggcmVtYWluaW5nIHRoYW4gYW5vdGhlciBwbGF5ZXIuYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRxdWFydGVyc1sxXS5vd25lcik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDIuIEVsc2UsIGNoZWNrIGlmIG9uZSBwbGF5ZXIgaGFzIG1vcmUgYnVpbGRpbmcgYWxpdmUgdGhhbiB0aGUgb3RoZXJcbiAgICAgICAgY29uc3QgYnVpbGRpbmdzQWxpdmUgPSB0aGlzLmdhbWUucGxheWVyc1xuICAgICAgICAgICAgLm1hcCgocCkgPT4gcC5idWlsZGluZ3MuZmlsdGVyKChiKSA9PiBiLmhlYWx0aCA+IDApKVxuICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGIubGVuZ3RoIC0gYS5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChidWlsZGluZ3NBbGl2ZVswXS5sZW5ndGggIT09IGJ1aWxkaW5nc0FsaXZlWzFdLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gc3RvcmUgdGhlIHdpbm5lciBhcyB0aGUgbG9zZXIgY291bGQgYmUgbG9zdCBpbiB0aGlzIHNjb3BlIGlmIHRoZWlyIGFycmF5IGlzIGVtcHR5XG4gICAgICAgICAgICBjb25zdCB3aW5uZXIgPSBidWlsZGluZ3NBbGl2ZVswXVswXS5vd25lcjtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259IC0gWW91IGhhZCB0aGUgbW9zdCBidWlsZGluZ3Mgbm90IGJ1cm5lZCBkb3duLmAsIHdpbm5lcik7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcihgJHtyZWFzb259IC0gWW91IGhhZCBtb3JlIGJ1aWxkaW5ncyBidXJuZWQgZG93biB0aGFuIGFub3RoZXIgcGxheWVyLmAsIHdpbm5lci5vcHBvbmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDMuIEVsc2UsIGNoZWNrIGlmIG9uZSBwbGF5ZXIgaGFzIGEgaGlnaGVyIHN1bSBvZiB0aGUgYnVpbGRpbmdzJyBoZWFsdGhzXG4gICAgICAgIGNvbnN0IGJ1aWxkaW5nc0hlYWx0aFN1bSA9IHRoaXMuZ2FtZS5wbGF5ZXJzXG4gICAgICAgICAgICAubWFwKChwKSA9PiBwLmJ1aWxkaW5ncy5yZWR1Y2UoKHN1bSwgYikgPT4gc3VtICsgYi5oZWFsdGgsIDApKTtcblxuICAgICAgICBpZiAoYnVpbGRpbmdzSGVhbHRoU3VtWzBdICE9PSBidWlsZGluZ3NIZWFsdGhTdW1bMV0pIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuZ2FtZS5wbGF5ZXJzW2J1aWxkaW5nc0hlYWx0aFN1bVswXSA+IGJ1aWxkaW5nc0hlYWx0aFN1bVsxXVxuICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgIDogMVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259IC0gWW91IGhhZCB0aGUgaGlnaGVzdCBoZWFsdGggc3VtIGFtb25nIHlvdXIgQnVpbGRpbmdzLmAsIHdpbm5lcik7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcihgJHtyZWFzb259IC0gWW91IGhhZCBhIGxvd2VyIGhlYWx0aCBzdW0gdGhhbiB0aGUgb3RoZXIgcGxheWVyLmAsIHdpbm5lci5vcHBvbmVudCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGVsc2UgYWxsIHRoZWlyIGJ1aWxkaW5ncyBhcmUgaWRlbnRpY2FsLFxuICAgICAgICAvLyBzbyB0aGV5IGFyZSBwcm9iYWJseSB0aGUgc2FtZSBBSXMsIHNvIGp1c3QgcmFuZG9tIGNoYW5jZVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBlbmQgdGhlIGdhbWUuXG4gICAgICAgIC8vIElmIG5vIHdpbm5lciBpdCBkZXRlcm1pbmVkIGFib3ZlLCB0aGVuIGEgcmFuZG9tIG9uZSB3aWxsIGJlIGNob3Nlbi5cbiAgICAgICAgc3VwZXIuc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb24pO1xuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLW1ldGhvZHMgLS0+PlxuXG4gICAgLy8gYW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkL3ByaXZhdGUgbWV0aG9kcyB5b3UgbmVlZCBjYW4gYmUgYWRkZWQgaGVyZVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLW1ldGhvZHMgLS0+PlxufVxuIl19