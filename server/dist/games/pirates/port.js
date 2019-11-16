"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A port on a Tile.
 */
class Port extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Port is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.tile = args.tile;
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for spawn. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param type - What type of Unit to create ('crew' or 'ship').
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSpawn(player, type) {
        // <<-- Creer-Merge: invalidate-spawn -->>
        if (this.owner !== player) {
            return `${this} isn't yer port.`;
        }
        if (player !== this.game.currentPlayer) {
            return `Avast, it ain't yer turn, ${player}.`;
        }
        if (type === "crew") { // Crew
            if (player.gold < this.game.crewCost) {
                return `Ye don't have enough gold to spawn a crew at ${this}.`;
            }
            if (this.gold < this.game.crewCost) {
                return `${this} can't spend enough gold to spawn a crew this turn! Ye gotta wait til next turn.`;
            }
        }
        else { // Ships
            if (player.gold < this.game.shipCost) {
                return `Ye don't have enough gold to spawn a ship at ${this}.`;
            }
            if (this.gold < this.game.shipCost) {
                return `${this} can't spend enough gold to spawn a ship this turn! Ye gotta wait til next turn.`;
            }
            if (this.tile.unit && this.tile.unit.shipHealth > 0) {
                return `Blimey! There isn't enough space in ${this} to spawn a ship.`;
            }
        }
        // <<-- /Creer-Merge: invalidate-spawn -->>
    }
    /**
     * Spawn a Unit on this port.
     *
     * @param player - The player that called this.
     * @param type - What type of Unit to create ('crew' or 'ship').
     * @returns True if Unit was created successfully, false otherwise.
     */
    async spawn(player, type) {
        // <<-- Creer-Merge: spawn -->>
        // Make sure there's a unit on this tile
        if (!this.tile.unit) {
            this.tile.unit = this.game.manager.create.unit({
                tile: this.tile,
            });
            this.game.manager.newUnits.push(this.tile.unit);
        }
        if (type === "crew") {
            this.tile.unit.crew++;
            this.tile.unit.crewHealth += this.game.crewHealth;
            this.tile.unit.acted = true;
            this.tile.unit.moves = 0;
            this.tile.unit.owner = player;
            player.gold -= this.game.crewCost;
            this.gold -= this.game.crewCost;
        }
        else {
            this.tile.unit.shipHealth = this.game.shipHealth;
            this.tile.unit.acted = true;
            this.tile.unit.moves = 0;
            player.gold -= this.game.shipCost;
            this.gold -= this.game.shipCost;
        }
        return true;
        // <<-- /Creer-Merge: spawn -->>
    }
}
exports.Port = Port;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9ydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9waXJhdGVzL3BvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQ0FBMkM7QUFJM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLElBQUssU0FBUSx3QkFBVTtJQXdCaEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFLRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7Ozs7T0FVRztJQUNPLGVBQWUsQ0FDckIsTUFBYyxFQUNkLElBQXFCO1FBRXJCLDBDQUEwQztRQUUxQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxFQUFFO1lBQ3ZCLE9BQU8sR0FBRyxJQUFJLGtCQUFrQixDQUFDO1NBQ3BDO1FBRUQsSUFBSSxNQUFNLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEMsT0FBTyw2QkFBNkIsTUFBTSxHQUFHLENBQUM7U0FDakQ7UUFFRCxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUUsRUFBRSxPQUFPO1lBQzFCLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEMsT0FBTyxnREFBZ0QsSUFBSSxHQUFHLENBQUM7YUFDbEU7WUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hDLE9BQU8sR0FBRyxJQUFJLGtGQUFrRixDQUFDO2FBQ3BHO1NBQ0o7YUFDSSxFQUFFLFFBQVE7WUFDWCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xDLE9BQU8sZ0RBQWdELElBQUksR0FBRyxDQUFDO2FBQ2xFO1lBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNoQyxPQUFPLEdBQUcsSUFBSSxrRkFBa0YsQ0FBQzthQUNwRztZQUVELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtnQkFDakQsT0FBTyx1Q0FBdUMsSUFBSSxtQkFBbUIsQ0FBQzthQUN6RTtTQUNKO1FBRUQsMkNBQTJDO0lBQy9DLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxLQUFLLENBQUMsS0FBSyxDQUNqQixNQUFjLEVBQ2QsSUFBcUI7UUFFckIsK0JBQStCO1FBRS9CLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDM0MsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO2FBQ2xCLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRztZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNsQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ25DO2FBQ0k7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDbEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUNuQztRQUVELE9BQU8sSUFBSSxDQUFDO1FBRVosZ0NBQWdDO0lBQ3BDLENBQUM7Q0FPSjtBQWxLRCxvQkFrS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElQb3J0UHJvcGVydGllcywgSVBvcnRTcGF3bkFyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIHBvcnQgb24gYSBUaWxlLlxuICovXG5leHBvcnQgY2xhc3MgUG9ydCBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIEZvciBwbGF5ZXJzLCBob3cgbXVjaCBtb3JlIGdvbGQgdGhpcyBQb3J0IGNhbiBzcGVuZCB0aGlzIHR1cm4uIEZvclxuICAgICAqIG1lcmNoYW50cywgaG93IG11Y2ggZ29sZCB0aGlzIFBvcnQgaGFzIGFjY3VtdWxhdGVkIChpdCB3aWxsIHNwYXduIGEgc2hpcFxuICAgICAqIHdoZW4gdGhlIFBvcnQgY2FuIGFmZm9yZCBvbmUpLlxuICAgICAqL1xuICAgIHB1YmxpYyBnb2xkITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogKE1lcmNoYW50cyBvbmx5KSBIb3cgbXVjaCBnb2xkIHdhcyBpbnZlc3RlZCBpbnRvIHRoaXMgUG9ydC4gSW52ZXN0bWVudFxuICAgICAqIGRldGVybWluZXMgdGhlIHN0cmVuZ3RoIGFuZCB2YWx1ZSBvZiB0aGUgbmV4dCBzaGlwLlxuICAgICAqL1xuICAgIHB1YmxpYyBpbnZlc3RtZW50ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG93bmVyIG9mIHRoaXMgUG9ydCwgb3IgdW5kZWZpbmVkIGlmIG93bmVkIGJ5IG1lcmNoYW50cy5cbiAgICAgKi9cbiAgICBwdWJsaWMgb3duZXI/OiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0aGlzIFBvcnQgaXMgb24uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbGU6IFRpbGU7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBQb3J0IGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElQb3J0UHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLyoqIFRoZSBUaWxlIHRvIHBsYWNlIHRoaXMgUG9ydCB1cG9uLiAqL1xuICAgICAgICAgICAgdGlsZTogVGlsZTtcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICB0aGlzLnRpbGUgPSBhcmdzLnRpbGU7XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHNwYXduLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0eXBlIC0gV2hhdCB0eXBlIG9mIFVuaXQgdG8gY3JlYXRlICgnY3Jldycgb3IgJ3NoaXAnKS5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVTcGF3bihcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHR5cGU6IFwiY3Jld1wiIHwgXCJzaGlwXCIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElQb3J0U3Bhd25BcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGF3biAtLT4+XG5cbiAgICAgICAgaWYgKHRoaXMub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzbid0IHllciBwb3J0LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBBdmFzdCwgaXQgYWluJ3QgeWVyIHR1cm4sICR7cGxheWVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwiY3Jld1wiKSB7IC8vIENyZXdcbiAgICAgICAgICAgIGlmIChwbGF5ZXIuZ29sZCA8IHRoaXMuZ2FtZS5jcmV3Q29zdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgWWUgZG9uJ3QgaGF2ZSBlbm91Z2ggZ29sZCB0byBzcGF3biBhIGNyZXcgYXQgJHt0aGlzfS5gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5nb2xkIDwgdGhpcy5nYW1lLmNyZXdDb3N0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IHNwZW5kIGVub3VnaCBnb2xkIHRvIHNwYXduIGEgY3JldyB0aGlzIHR1cm4hIFllIGdvdHRhIHdhaXQgdGlsIG5leHQgdHVybi5gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBTaGlwc1xuICAgICAgICAgICAgaWYgKHBsYXllci5nb2xkIDwgdGhpcy5nYW1lLnNoaXBDb3N0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBZZSBkb24ndCBoYXZlIGVub3VnaCBnb2xkIHRvIHNwYXduIGEgc2hpcCBhdCAke3RoaXN9LmA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdvbGQgPCB0aGlzLmdhbWUuc2hpcENvc3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuJ3Qgc3BlbmQgZW5vdWdoIGdvbGQgdG8gc3Bhd24gYSBzaGlwIHRoaXMgdHVybiEgWWUgZ290dGEgd2FpdCB0aWwgbmV4dCB0dXJuLmA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnRpbGUudW5pdCAmJiB0aGlzLnRpbGUudW5pdC5zaGlwSGVhbHRoID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgQmxpbWV5ISBUaGVyZSBpc24ndCBlbm91Z2ggc3BhY2UgaW4gJHt0aGlzfSB0byBzcGF3biBhIHNoaXAuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNwYXduIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGF3biBhIFVuaXQgb24gdGhpcyBwb3J0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdHlwZSAtIFdoYXQgdHlwZSBvZiBVbml0IHRvIGNyZWF0ZSAoJ2NyZXcnIG9yICdzaGlwJykuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBVbml0IHdhcyBjcmVhdGVkIHN1Y2Nlc3NmdWxseSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBzcGF3bihcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHR5cGU6IFwiY3Jld1wiIHwgXCJzaGlwXCIsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNwYXduIC0tPj5cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlcmUncyBhIHVuaXQgb24gdGhpcyB0aWxlXG4gICAgICAgIGlmICghdGhpcy50aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0ID0gdGhpcy5nYW1lLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgIHRpbGU6IHRoaXMudGlsZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUubWFuYWdlci5uZXdVbml0cy5wdXNoKHRoaXMudGlsZS51bml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlID09PSBcImNyZXdcIilcdFx0e1xuICAgICAgICAgICAgdGhpcy50aWxlLnVuaXQuY3JldysrO1xuICAgICAgICAgICAgdGhpcy50aWxlLnVuaXQuY3Jld0hlYWx0aCArPSB0aGlzLmdhbWUuY3Jld0hlYWx0aDtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0LmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0Lm1vdmVzID0gMDtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0Lm93bmVyID0gcGxheWVyO1xuICAgICAgICAgICAgcGxheWVyLmdvbGQgLT0gdGhpcy5nYW1lLmNyZXdDb3N0O1xuICAgICAgICAgICAgdGhpcy5nb2xkIC09IHRoaXMuZ2FtZS5jcmV3Q29zdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0LnNoaXBIZWFsdGggPSB0aGlzLmdhbWUuc2hpcEhlYWx0aDtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0LmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0Lm1vdmVzID0gMDtcbiAgICAgICAgICAgIHBsYXllci5nb2xkIC09IHRoaXMuZ2FtZS5zaGlwQ29zdDtcbiAgICAgICAgICAgIHRoaXMuZ29sZCAtPSB0aGlzLmdhbWUuc2hpcENvc3Q7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc3Bhd24gLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==