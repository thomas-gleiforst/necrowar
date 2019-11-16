"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * Information about a beaver's job.
 */
class Job extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Job is created.
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
     * Invalidation function for recruit. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile that is a lodge owned by you that you wish to
     * spawn the Beaver of this Job on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateRecruit(player, tile) {
        // <<-- Creer-Merge: invalidate-recruit -->>
        if (!player || player !== this.game.currentPlayer) {
            return `Not ${player}'s turn.`;
        }
        if (!tile) {
            return `${tile} is not a valid Tile.`;
        }
        if (tile.lodgeOwner !== player) {
            return `${tile} is not owned by ${player}.`;
        }
        if (tile.beaver) {
            return `There's already ${tile.beaver} at that lodge`;
        }
        if (player.getAliveBeavers().length >= this.game.freeBeaversCount && tile.food < this.cost) {
            return `${tile} does not have enough food available. (${tile.food}/${this.cost})`;
        }
        // <<-- /Creer-Merge: invalidate-recruit -->>
    }
    /**
     * Recruits a Beaver of this Job to a lodge
     *
     * @param player - The player that called this.
     * @param tile - The Tile that is a lodge owned by you that you wish to
     * spawn the Beaver of this Job on.
     * @returns The recruited Beaver if successful, undefined otherwise.
     */
    async recruit(player, tile) {
        // <<-- Creer-Merge: recruit -->>
        // if they have more beavers
        if (player.getAliveBeavers().length >= this.game.freeBeaversCount) {
            tile.food -= this.cost;
        }
        const beaver = this.manager.create.beaver({
            job: this,
            owner: player,
            tile,
            recruited: false,
        });
        return beaver;
        // <<-- /Creer-Merge: recruit -->>
    }
}
exports.Job = Job;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3N0dW1wZWQvam9iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0NBQTJDO0FBSTNDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxHQUFJLFNBQVEsd0JBQVU7SUFtRC9CLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBSUUsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7Ozs7OztPQVdHO0lBQ08saUJBQWlCLENBQ3ZCLE1BQWMsRUFDZCxJQUFVO1FBRVYsNENBQTRDO1FBRTVDLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQy9DLE9BQU8sT0FBTyxNQUFNLFVBQVUsQ0FBQztTQUNsQztRQUNELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDUCxPQUFPLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQztTQUN6QztRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxNQUFNLEVBQUU7WUFDNUIsT0FBTyxHQUFHLElBQUksb0JBQW9CLE1BQU0sR0FBRyxDQUFDO1NBQy9DO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsT0FBTyxtQkFBbUIsSUFBSSxDQUFDLE1BQU0sZ0JBQWdCLENBQUM7U0FDekQ7UUFDRCxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDeEYsT0FBTyxHQUFHLElBQUksMENBQTBDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO1NBQ3JGO1FBRUQsNkNBQTZDO0lBQ2pELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sS0FBSyxDQUFDLE9BQU8sQ0FDbkIsTUFBYyxFQUNkLElBQVU7UUFFVixpQ0FBaUM7UUFFakMsNEJBQTRCO1FBQzVCLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQy9ELElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQztTQUMxQjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN0QyxHQUFHLEVBQUUsSUFBSTtZQUNULEtBQUssRUFBRSxNQUFNO1lBQ2IsSUFBSTtZQUNKLFNBQVMsRUFBRSxLQUFLO1NBQ25CLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO1FBRWQsa0NBQWtDO0lBQ3RDLENBQUM7Q0FPSjtBQWpLRCxrQkFpS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElKb2JQcm9wZXJ0aWVzLCBJSm9iUmVjcnVpdEFyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEJlYXZlciB9IGZyb20gXCIuL2JlYXZlclwiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEluZm9ybWF0aW9uIGFib3V0IGEgYmVhdmVyJ3Mgam9iLlxuICovXG5leHBvcnQgY2xhc3MgSm9iIGV4dGVuZHMgR2FtZU9iamVjdCB7XG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBhY3Rpb25zIHRoaXMgSm9iIGNhbiBtYWtlIHBlciB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhY3Rpb25zITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSG93IG1hbnkgY29tYmluZWQgcmVzb3VyY2VzIGEgYmVhdmVyIHdpdGggdGhpcyBKb2IgY2FuIGhvbGQgYXQgb25jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2FycnlMaW1pdCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFNjYWxhciBmb3IgaG93IG1hbnkgYnJhbmNoZXMgdGhpcyBKb2IgaGFydmVzdHMgYXQgb25jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hvcHBpbmchOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBmb29kIHRoaXMgSm9iIGNvc3RzIHRvIHJlY3J1aXQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNvc3QhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGRhbWFnZSB0aGlzIEpvYiBkb2VzIHBlciBhdHRhY2suXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGRhbWFnZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IHR1cm5zIGEgYmVhdmVyIGF0dGFja2VkIGJ5IHRoaXMgSm9iIGlzIGRpc3RyYWN0ZWQgYnkuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGRpc3RyYWN0aW9uUG93ZXIhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHN0YXJ0aW5nIGhlYWx0aCB0aGlzIEpvYiBoYXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGhlYWx0aCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgbW92ZXMgdGhpcyBKb2IgY2FuIG1ha2UgcGVyIHR1cm4uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1vdmVzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogU2NhbGFyIGZvciBob3cgbXVjaCBmb29kIHRoaXMgSm9iIGhhcnZlc3RzIGF0IG9uY2UuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG11bmNoaW5nITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEpvYiB0aXRsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGl0bGUhOiBzdHJpbmc7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBKb2IgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SUpvYlByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgY29uc3RydWN0b3IgYXJncyBpbiBoZXJlXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgcmVjcnVpdC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWRcbiAgICAgKiBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmdcbiAgICAgKiB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRoYXQgaXMgYSBsb2RnZSBvd25lZCBieSB5b3UgdGhhdCB5b3Ugd2lzaCB0b1xuICAgICAqIHNwYXduIHRoZSBCZWF2ZXIgb2YgdGhpcyBKb2Igb24uXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlUmVjcnVpdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElKb2JSZWNydWl0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmVjcnVpdCAtLT4+XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgcGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBOb3QgJHtwbGF5ZXJ9J3MgdHVybi5gO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGlzIG5vdCBhIHZhbGlkIFRpbGUuYDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGlsZS5sb2RnZU93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3Qgb3duZWQgYnkgJHtwbGF5ZXJ9LmA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRpbGUuYmVhdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoZXJlJ3MgYWxyZWFkeSAke3RpbGUuYmVhdmVyfSBhdCB0aGF0IGxvZGdlYDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGxheWVyLmdldEFsaXZlQmVhdmVycygpLmxlbmd0aCA+PSB0aGlzLmdhbWUuZnJlZUJlYXZlcnNDb3VudCAmJiB0aWxlLmZvb2QgPCB0aGlzLmNvc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBkb2VzIG5vdCBoYXZlIGVub3VnaCBmb29kIGF2YWlsYWJsZS4gKCR7dGlsZS5mb29kfS8ke3RoaXMuY29zdH0pYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXJlY3J1aXQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY3J1aXRzIGEgQmVhdmVyIG9mIHRoaXMgSm9iIHRvIGEgbG9kZ2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0aGF0IGlzIGEgbG9kZ2Ugb3duZWQgYnkgeW91IHRoYXQgeW91IHdpc2ggdG9cbiAgICAgKiBzcGF3biB0aGUgQmVhdmVyIG9mIHRoaXMgSm9iIG9uLlxuICAgICAqIEByZXR1cm5zIFRoZSByZWNydWl0ZWQgQmVhdmVyIGlmIHN1Y2Nlc3NmdWwsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHJlY3J1aXQoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IFByb21pc2U8QmVhdmVyIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHJlY3J1aXQgLS0+PlxuXG4gICAgICAgIC8vIGlmIHRoZXkgaGF2ZSBtb3JlIGJlYXZlcnNcbiAgICAgICAgaWYgKHBsYXllci5nZXRBbGl2ZUJlYXZlcnMoKS5sZW5ndGggPj0gdGhpcy5nYW1lLmZyZWVCZWF2ZXJzQ291bnQpIHtcbiAgICAgICAgICAgIHRpbGUuZm9vZCAtPSB0aGlzLmNvc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBiZWF2ZXIgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLmJlYXZlcih7XG4gICAgICAgICAgICBqb2I6IHRoaXMsXG4gICAgICAgICAgICBvd25lcjogcGxheWVyLFxuICAgICAgICAgICAgdGlsZSxcbiAgICAgICAgICAgIHJlY3J1aXRlZDogZmFsc2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBiZWF2ZXI7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJlY3J1aXQgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==