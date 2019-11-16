"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A tower in the game. Used to combat enemy waves.
 */
class Tower extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Tower is created.
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
        const range = 2.2; // Attack range
        // Check if tower already attacked
        if (this.attacked) {
            return `${this}, cannot attack becuase has already attacked this turn`;
        }
        // Check if any unit belongs to the player
        if ((tile.unit) && (tile.unit.owner === player)) {
            return `${this}, cannot attack allied units!`;
        }
        // Check if tile exists
        if (!tile) {
            return `${this}, cannot attack a tile that doesn't exist!`;
        }
        if (this.cooldown > 0) {
            return `${this} is not ready to attack yet!`;
        }
        // Check if tile has no units
        if (!tile.unit) {
            return `${this}, cannot attack a tile with no units!`;
        }
        if (tile.unit.job.title === "worker") {
            return `Towers may not attack workers!`;
        }
        if (this.job.title === "cleansing") {
            if (tile.unit.job.title !== "wraith" && tile.unit.job.title !== "abomination") {
                return `Cleansing towers can only attack wraiths and abominations!`;
            }
        }
        else if (tile.unit.job.title === "wraith") {
            return `${this} cannot attack wraiths! They are incorporeal!`;
        }
        // Check if tower has zero health
        if (this.health <= 0) {
            return `${this}, cannot attack because it has been destroyed!`;
        }
        /*
         * Shape of the tower range:
         *         _   x   _
         *           x x x
         *         x x T x x
         *           x x x
         *         _   x   _
         */
        if (this.tile === undefined) {
            return `${this} is not on a tile!`;
        }
        // Check if tile is in range
        if (range < this.distance(this.tile.x, this.tile.y, tile.x, tile.y)) {
            return `${this}, cannot attack because target tile is out of range`;
        }
        // Check if job is valid
        if (!this.job) {
            return `${this}, has an unknown job`;
        }
        else {
            if (!this.job.title) {
                return `${this}, has an unknown job name`;
            }
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks an enemy unit on an tile within it's range.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to attack.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, tile) {
        // <<-- Creer-Merge: attack -->>
        /*
         * Damage That Towers Do To Units
         * Castle | Arrow | Ballista | Cleansing | AOE
         * -------+-------+----------+-----------+-----
         *    5   |   5   |    20    |     5     |  3
         */
        this.cooldown = this.job.turnsBetweenAttacks;
        // Get all units on target tile
        const tileUnits = [];
        for (const unit of this.game.units) {
            if (unit.tile === tile) {
                tileUnits.push(unit);
            }
        }
        if (!tile.unit) {
            return false;
        }
        if (this.job.title === "aoe" || this.job.title === "castle") {
            for (const unit of tileUnits) {
                unit.health = Math.max(0, unit.health - this.job.damage);
            }
        }
        else {
            tile.unit.health = Math.max(0, tile.unit.health - this.job.damage);
        }
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Returns the distance between the points
     *
     * @param x1: the first x coordinate.
     * @param y1: the first y coordinate.
     * @param x2: the second x coordinate.
     * @param y2: the second y coordinate.
     *
     * @returns the distance between the points.
     */
    distance(x1, y1, x2, y2) {
        // Calculate differences
        const xDif = (x1 - x2);
        const yDif = (y1 - y2);
        return Math.sqrt((xDif ** 2) + (yDif ** 2));
    }
}
exports.Tower = Tower;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2FtZXMvbmVjcm93YXIvdG93ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQ0FBMkM7QUFLM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLEtBQU0sU0FBUSx3QkFBVTtJQStCakMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7Ozs7T0FVRztJQUNPLGdCQUFnQixDQUN0QixNQUFjLEVBQ2QsSUFBVTtRQUVWLDJDQUEyQztRQUMzQyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxlQUFlO1FBRWxDLGtDQUFrQztRQUNsQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixPQUFPLEdBQUcsSUFBSSx3REFBd0QsQ0FBQztTQUMxRTtRQUVELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLEVBQUU7WUFDN0MsT0FBTyxHQUFHLElBQUksK0JBQStCLENBQUM7U0FDakQ7UUFFRCx1QkFBdUI7UUFDdkIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU8sR0FBRyxJQUFJLDRDQUE0QyxDQUFDO1NBQzlEO1FBRUQsSUFBSSxJQUFJLENBQUMs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LElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEU7UUFFRCxPQUFPLElBQUksQ0FBQztRQUNaLGlDQUFpQztJQUNyQyxDQUFDO0lBRUQscURBQXFEO0lBRXJEOzs7Ozs7Ozs7T0FTRztJQUNLLFFBQVEsQ0FBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO1FBQzNELHdCQUF3QjtRQUN4QixNQUFNLElBQUksR0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMvQixNQUFNLElBQUksR0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUUvQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBR0o7QUFoT0Qsc0JBZ09DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJVG93ZXJBdHRhY2tBcmdzLCBJVG93ZXJQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcbmltcG9ydCB7IFRvd2VySm9iIH0gZnJvbSBcIi4vdG93ZXItam9iXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgdG93ZXIgaW4gdGhlIGdhbWUuIFVzZWQgdG8gY29tYmF0IGVuZW15IHdhdmVzLlxuICovXG5leHBvcnQgY2xhc3MgVG93ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoaXMgdG93ZXIgaGFzIGF0dGFja2VkIHRoaXMgdHVybiBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIGF0dGFja2VkITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IHR1cm5zIGFyZSBsZWZ0IGJlZm9yZSBpdCBjYW4gZmlyZSBhZ2Fpbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY29vbGRvd24hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCByZW1haW5pbmcgaGVhbHRoIHRoaXMgdG93ZXIgaGFzLlxuICAgICAqL1xuICAgIHB1YmxpYyBoZWFsdGghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBXaGF0IHR5cGUgb2YgdG93ZXIgdGhpcyBpcyAoaXQncyBqb2IpLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBqb2IhOiBUb3dlckpvYjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgdGhhdCBidWlsdCAvIG93bnMgdGhpcyB0b3dlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgb3duZXI/OiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0aGlzIFRvd2VyIGlzIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlPzogVGlsZTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFRvd2VyIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElUb3dlclByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgY29uc3RydWN0b3IgYXJncyBpbiBoZXJlXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgYXR0YWNrLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gYXR0YWNrLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUF0dGFjayhcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElUb3dlckF0dGFja0FyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG4gICAgICAgIGNvbnN0IHJhbmdlID0gMi4yOyAvLyBBdHRhY2sgcmFuZ2VcblxuICAgICAgICAvLyBDaGVjayBpZiB0b3dlciBhbHJlYWR5IGF0dGFja2VkXG4gICAgICAgIGlmICh0aGlzLmF0dGFja2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIGNhbm5vdCBhdHRhY2sgYmVjdWFzZSBoYXMgYWxyZWFkeSBhdHRhY2tlZCB0aGlzIHR1cm5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgYW55IHVuaXQgYmVsb25ncyB0byB0aGUgcGxheWVyXG4gICAgICAgIGlmICgodGlsZS51bml0KSAmJiAodGlsZS51bml0Lm93bmVyID09PSBwbGF5ZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIGNhbm5vdCBhdHRhY2sgYWxsaWVkIHVuaXRzIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB0aWxlIGV4aXN0c1xuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSwgY2Fubm90IGF0dGFjayBhIHRpbGUgdGhhdCBkb2Vzbid0IGV4aXN0IWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb29sZG93biA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3QgcmVhZHkgdG8gYXR0YWNrIHlldCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGlsZSBoYXMgbm8gdW5pdHNcbiAgICAgICAgaWYgKCF0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSwgY2Fubm90IGF0dGFjayBhIHRpbGUgd2l0aCBubyB1bml0cyFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUudW5pdC5qb2IudGl0bGUgPT09IFwid29ya2VyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgVG93ZXJzIG1heSBub3QgYXR0YWNrIHdvcmtlcnMhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSA9PT0gXCJjbGVhbnNpbmdcIikge1xuICAgICAgICAgICAgaWYgKHRpbGUudW5pdC5qb2IudGl0bGUgIT09IFwid3JhaXRoXCIgJiYgdGlsZS51bml0LmpvYi50aXRsZSAhPT0gXCJhYm9taW5hdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBDbGVhbnNpbmcgdG93ZXJzIGNhbiBvbmx5IGF0dGFjayB3cmFpdGhzIGFuZCBhYm9taW5hdGlvbnMhYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aWxlLnVuaXQuam9iLnRpdGxlID09PSBcIndyYWl0aFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGF0dGFjayB3cmFpdGhzISBUaGV5IGFyZSBpbmNvcnBvcmVhbCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdG93ZXIgaGFzIHplcm8gaGVhbHRoXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIGNhbm5vdCBhdHRhY2sgYmVjYXVzZSBpdCBoYXMgYmVlbiBkZXN0cm95ZWQhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIFNoYXBlIG9mIHRoZSB0b3dlciByYW5nZTpcbiAgICAgICAgICogICAgICAgICBfICAgeCAgIF9cbiAgICAgICAgICogICAgICAgICAgIHggeCB4XG4gICAgICAgICAqICAgICAgICAgeCB4IFQgeCB4XG4gICAgICAgICAqICAgICAgICAgICB4IHggeFxuICAgICAgICAgKiAgICAgICAgIF8gICB4ICAgX1xuICAgICAgICAgKi9cblxuICAgICAgICBpZiAodGhpcy50aWxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb24gYSB0aWxlIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB0aWxlIGlzIGluIHJhbmdlXG4gICAgICAgIGlmIChyYW5nZSA8IHRoaXMuZGlzdGFuY2UodGhpcy50aWxlLngsIHRoaXMudGlsZS55LCB0aWxlLnggLCB0aWxlLnkpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIGNhbm5vdCBhdHRhY2sgYmVjYXVzZSB0YXJnZXQgdGlsZSBpcyBvdXQgb2YgcmFuZ2VgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgam9iIGlzIHZhbGlkXG4gICAgICAgIGlmICghdGhpcy5qb2IpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSwgaGFzIGFuIHVua25vd24gam9iYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5qb2IudGl0bGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30sIGhhcyBhbiB1bmtub3duIGpvYiBuYW1lYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNrcyBhbiBlbmVteSB1bml0IG9uIGFuIHRpbGUgd2l0aGluIGl0J3MgcmFuZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gYXR0YWNrLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGF0dGFja2VkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGF0dGFjayhwbGF5ZXI6IFBsYXllciwgdGlsZTogVGlsZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuXG4gICAgICAgIC8qXG4gICAgICAgICAqIERhbWFnZSBUaGF0IFRvd2VycyBEbyBUbyBVbml0c1xuICAgICAgICAgKiBDYXN0bGUgfCBBcnJvdyB8IEJhbGxpc3RhIHwgQ2xlYW5zaW5nIHwgQU9FXG4gICAgICAgICAqIC0tLS0tLS0rLS0tLS0tLSstLS0tLS0tLS0tKy0tLS0tLS0tLS0tKy0tLS0tXG4gICAgICAgICAqICAgIDUgICB8ICAgNSAgIHwgICAgMjAgICAgfCAgICAgNSAgICAgfCAgM1xuICAgICAgICAgKi9cblxuICAgICAgICB0aGlzLmNvb2xkb3duID0gdGhpcy5qb2IudHVybnNCZXR3ZWVuQXR0YWNrcztcblxuICAgICAgICAvLyBHZXQgYWxsIHVuaXRzIG9uIHRhcmdldCB0aWxlXG4gICAgICAgIGNvbnN0IHRpbGVVbml0cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnVuaXRzKSB7XG4gICAgICAgICAgICBpZiAodW5pdC50aWxlID09PSB0aWxlKSB7XG4gICAgICAgICAgICAgICAgdGlsZVVuaXRzLnB1c2godW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRpbGUudW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcImFvZVwiIHx8IHRoaXMuam9iLnRpdGxlID09PSBcImNhc3RsZVwiKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGlsZVVuaXRzKSB7XG4gICAgICAgICAgICAgICAgdW5pdC5oZWFsdGggPSBNYXRoLm1heCgwLCB1bml0LmhlYWx0aCAtIHRoaXMuam9iLmRhbWFnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aWxlLnVuaXQuaGVhbHRoID0gTWF0aC5tYXgoMCwgdGlsZS51bml0LmhlYWx0aCAtIHRoaXMuam9iLmRhbWFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50c1xuICAgICAqXG4gICAgICogQHBhcmFtIHgxOiB0aGUgZmlyc3QgeCBjb29yZGluYXRlLlxuICAgICAqIEBwYXJhbSB5MTogdGhlIGZpcnN0IHkgY29vcmRpbmF0ZS5cbiAgICAgKiBAcGFyYW0geDI6IHRoZSBzZWNvbmQgeCBjb29yZGluYXRlLlxuICAgICAqIEBwYXJhbSB5MjogdGhlIHNlY29uZCB5IGNvb3JkaW5hdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcG9pbnRzLlxuICAgICAqL1xuICAgIHByaXZhdGUgZGlzdGFuY2UoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSBkaWZmZXJlbmNlc1xuICAgICAgICBjb25zdCB4RGlmOiBudW1iZXIgPSAoeDEgLSB4Mik7XG4gICAgICAgIGNvbnN0IHlEaWY6IG51bWJlciA9ICh5MSAtIHkyKTtcblxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh4RGlmICoqIDIpICsgKHlEaWYgKiogMikpO1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19