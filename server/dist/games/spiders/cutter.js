"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spiderling_1 = require("./spiderling");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A Spiderling that can cut existing Webs.
 */
class Cutter extends spiderling_1.Spiderling {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Cutter is created.
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
    /** Kills the Cutter */
    kill() {
        super.kill();
        this.cuttingWeb = undefined;
    }
    /**
     * Finishes the actions of the Cutter
     *
     * @param forceFinish - true if forcing the finish prematurely
     * @returns True if the base logic can handle finishing
     */
    finish(forceFinish) {
        if (this.finish(forceFinish)) {
            return true; // because they finished moving or something the base Spiderling class can handle
        }
        if (!forceFinish && this.cuttingWeb && !this.cuttingWeb.hasSnapped()) {
            this.cuttingWeb.snap();
        }
        this.cuttingWeb = undefined;
        return false;
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for cut. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param web - The web you want to Cut. Must be connected to the Nest this
     * Cutter is currently on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateCut(player, web) {
        // <<-- Creer-Merge: invalidate-cut -->>
        const invalid = super.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.nest) {
            return `${this} is not on a Nest.`;
        }
        if (!web.isConnectedTo(this.nest)) {
            return `${this} can only cut Webs connected to the Nest it is on (${this.nest}), ${web} is not.`;
        }
        // <<-- /Creer-Merge: invalidate-cut -->>
    }
    /**
     * Cuts a web, destroying it, and any Spiderlings on it.
     *
     * @param player - The player that called this.
     * @param web - The web you want to Cut. Must be connected to the Nest this
     * Cutter is currently on.
     * @returns True if the cut was successfully started, false otherwise.
     */
    async cut(player, web) {
        // <<-- Creer-Merge: cut -->>
        this.busy = "Cutting";
        this.cuttingWeb = web;
        // find coworkers
        for (const spider of web.getSideSpiders()) {
            if (spider !== this &&
                spider instanceof Cutter &&
                spider.cuttingWeb === web) {
                this.coworkers.add(spider);
                this.numberOfCoworkers = this.coworkers.size;
                spider.coworkers.add(this);
                spider.numberOfCoworkers = spider.coworkers.size;
            }
        }
        // workRemaining =  5 * strength^2 / (cutterSpeed * sqrt(distance))
        this.workRemaining = (web.strength ** 2) * 5 / (this.game.cutSpeed * Math.sqrt(web.length));
        return true;
        // <<-- /Creer-Merge: cut -->>
    }
}
exports.Cutter = Cutter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3V0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvY3V0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsNkNBQTBDO0FBRzFDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsdUJBQVU7SUFNbEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx1QkFBdUI7SUFDaEIsSUFBSTtRQUNQLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUViLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxXQUFxQjtRQUMvQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDMUIsT0FBTyxJQUFJLENBQUMsQ0FBQyxpRkFBaUY7U0FDakc7UUFFRCxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ2xFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztRQUU1QixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsMkNBQTJDO0lBRTNDOzs7Ozs7Ozs7OztPQVdHO0lBQ08sYUFBYSxDQUNuQixNQUFjLEVBQ2QsR0FBUTtRQUVSLHdDQUF3QztRQUV4QyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNaLE9BQU8sR0FBRyxJQUFJLG9CQUFvQixDQUFDO1NBQ3RDO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLE9BQU8sR0FBRyxJQUFJLHNEQUFzRCxJQUFJLENBQUMsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDO1NBQ3BHO1FBRUQseUNBQXlDO0lBQzdDLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ08sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFjLEVBQUUsR0FBUTtRQUN4Qyw2QkFBNkI7UUFFN0IsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7UUFFdEIsaUJBQWlCO1FBQ2pCLEtBQUssTUFBTSxNQUFNLElBQUksR0FBRyxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ3ZDLElBQ0ksTUFBTSxLQUFLLElBQUk7Z0JBQ2YsTUFBTSxZQUFZLE1BQU07Z0JBQ3hCLE1BQU0sQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUMzQjtnQkFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2FBQ3BEO1NBQ0o7UUFFRCxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUU1RixPQUFPLElBQUksQ0FBQztRQUVaLDhCQUE4QjtJQUNsQyxDQUFDO0NBT0o7QUE3SUQsd0JBNklDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJQ3V0dGVyQ3V0QXJncywgSUN1dHRlclByb3BlcnRpZXMsIFNwaWRlcmxpbmdBcmdzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFNwaWRlcmxpbmcgfSBmcm9tIFwiLi9zcGlkZXJsaW5nXCI7XG5pbXBvcnQgeyBXZWIgfSBmcm9tIFwiLi93ZWJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBTcGlkZXJsaW5nIHRoYXQgY2FuIGN1dCBleGlzdGluZyBXZWJzLlxuICovXG5leHBvcnQgY2xhc3MgQ3V0dGVyIGV4dGVuZHMgU3BpZGVybGluZyB7XG4gICAgLyoqXG4gICAgICogVGhlIFdlYiB0aGF0IHRoaXMgQ3V0dGVyIGlzIHRyeWluZyB0byBjdXQuIFVuZGVmaW5lZCBpZiBub3QgY3V0dGluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3V0dGluZ1dlYj86IFdlYjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIEN1dHRlciBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxTcGlkZXJsaW5nQXJncyAmIElDdXR0ZXJQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIGNvbnN0cnVjdG9yIGFyZ3MgaW4gaGVyZVxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKiogS2lsbHMgdGhlIEN1dHRlciAqL1xuICAgIHB1YmxpYyBraWxsKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5raWxsKCk7XG5cbiAgICAgICAgdGhpcy5jdXR0aW5nV2ViID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmlzaGVzIHRoZSBhY3Rpb25zIG9mIHRoZSBDdXR0ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZUZpbmlzaCAtIHRydWUgaWYgZm9yY2luZyB0aGUgZmluaXNoIHByZW1hdHVyZWx5XG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgYmFzZSBsb2dpYyBjYW4gaGFuZGxlIGZpbmlzaGluZ1xuICAgICAqL1xuICAgIHB1YmxpYyBmaW5pc2goZm9yY2VGaW5pc2g/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmZpbmlzaChmb3JjZUZpbmlzaCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBiZWNhdXNlIHRoZXkgZmluaXNoZWQgbW92aW5nIG9yIHNvbWV0aGluZyB0aGUgYmFzZSBTcGlkZXJsaW5nIGNsYXNzIGNhbiBoYW5kbGVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZm9yY2VGaW5pc2ggJiYgdGhpcy5jdXR0aW5nV2ViICYmICF0aGlzLmN1dHRpbmdXZWIuaGFzU25hcHBlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmN1dHRpbmdXZWIuc25hcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXR0aW5nV2ViID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGN1dC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gd2ViIC0gVGhlIHdlYiB5b3Ugd2FudCB0byBDdXQuIE11c3QgYmUgY29ubmVjdGVkIHRvIHRoZSBOZXN0IHRoaXNcbiAgICAgKiBDdXR0ZXIgaXMgY3VycmVudGx5IG9uLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUN1dChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHdlYjogV2ViLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJQ3V0dGVyQ3V0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtY3V0IC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gc3VwZXIuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIE5lc3QuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2ViLmlzQ29ubmVjdGVkVG8odGhpcy5uZXN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbiBvbmx5IGN1dCBXZWJzIGNvbm5lY3RlZCB0byB0aGUgTmVzdCBpdCBpcyBvbiAoJHt0aGlzLm5lc3R9KSwgJHt3ZWJ9IGlzIG5vdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtY3V0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDdXRzIGEgd2ViLCBkZXN0cm95aW5nIGl0LCBhbmQgYW55IFNwaWRlcmxpbmdzIG9uIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gd2ViIC0gVGhlIHdlYiB5b3Ugd2FudCB0byBDdXQuIE11c3QgYmUgY29ubmVjdGVkIHRvIHRoZSBOZXN0IHRoaXNcbiAgICAgKiBDdXR0ZXIgaXMgY3VycmVudGx5IG9uLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGN1dCB3YXMgc3VjY2Vzc2Z1bGx5IHN0YXJ0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY3V0KHBsYXllcjogUGxheWVyLCB3ZWI6IFdlYik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjdXQgLS0+PlxuXG4gICAgICAgIHRoaXMuYnVzeSA9IFwiQ3V0dGluZ1wiO1xuICAgICAgICB0aGlzLmN1dHRpbmdXZWIgPSB3ZWI7XG5cbiAgICAgICAgLy8gZmluZCBjb3dvcmtlcnNcbiAgICAgICAgZm9yIChjb25zdCBzcGlkZXIgb2Ygd2ViLmdldFNpZGVTcGlkZXJzKCkpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzcGlkZXIgIT09IHRoaXMgJiZcbiAgICAgICAgICAgICAgICBzcGlkZXIgaW5zdGFuY2VvZiBDdXR0ZXIgJiZcbiAgICAgICAgICAgICAgICBzcGlkZXIuY3V0dGluZ1dlYiA9PT0gd2ViXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvd29ya2Vycy5hZGQoc3BpZGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLm51bWJlck9mQ293b3JrZXJzID0gdGhpcy5jb3dvcmtlcnMuc2l6ZTtcbiAgICAgICAgICAgICAgICBzcGlkZXIuY293b3JrZXJzLmFkZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBzcGlkZXIubnVtYmVyT2ZDb3dvcmtlcnMgPSBzcGlkZXIuY293b3JrZXJzLnNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3b3JrUmVtYWluaW5nID0gIDUgKiBzdHJlbmd0aF4yIC8gKGN1dHRlclNwZWVkICogc3FydChkaXN0YW5jZSkpXG4gICAgICAgIHRoaXMud29ya1JlbWFpbmluZyA9ICh3ZWIuc3RyZW5ndGggKiogMikgKiA1IC8gKHRoaXMuZ2FtZS5jdXRTcGVlZCAqIE1hdGguc3FydCh3ZWIubGVuZ3RoKSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGN1dCAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19