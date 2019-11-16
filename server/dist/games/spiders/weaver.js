"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spiderling_1 = require("./spiderling");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A Spiderling that can alter existing Webs by weaving to add or remove silk
 * from the Webs, thus altering its strength.
 */
class Weaver extends spiderling_1.Spiderling {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Weaver is created.
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
    /**
     * Kills the Weaver
     */
    kill() {
        super.kill();
        this.strengtheningWeb = undefined;
        this.weakeningWeb = undefined;
    }
    /**
     * Finishes the actions of the Weaver
     *
     * @param forceFinish - true if forcing the finish prematurely
     * @returns True if they finished, false otherwise
     */
    finish(forceFinish) {
        const weakening = this.busy === "Weakening";
        if (super.finish(forceFinish)) {
            return true; // because they finished moving or something the base Spiderling class can handle
        }
        const web = weakening
            ? this.weakeningWeb
            : this.strengtheningWeb;
        this.weakeningWeb = undefined;
        this.strengtheningWeb = undefined;
        if (!forceFinish && web && !web.hasSnapped()) {
            // Then they are finishing a weave, not being forced to finish
            // because the web snapped
            web.addStrength((weakening ? -1 : 1) * this.game.weavePower);
        }
        return false;
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for strengthen. Try to find a reason why the
     * passed in parameters are invalid, and return a human readable string
     * telling them why it is invalid.
     *
     * @param player - The player that called this.
     * @param web - The web you want to strengthen. Must be connected to the
     * Nest this Weaver is currently on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateStrengthen(player, web) {
        // <<-- Creer-Merge: invalidate-strengthen -->>
        const invalid = this.invalidateWeave(player, web, false);
        if (invalid) {
            return invalid;
        }
        // <<-- /Creer-Merge: invalidate-strengthen -->>
    }
    /**
     * Weaves more silk into an existing Web to strengthen it.
     *
     * @param player - The player that called this.
     * @param web - The web you want to strengthen. Must be connected to the
     * Nest this Weaver is currently on.
     * @returns True if the strengthen was successfully started, false
     * otherwise.
     */
    async strengthen(player, web) {
        // <<-- Creer-Merge: strengthen -->>
        return this.weave(player, web, "Strengthening");
        // <<-- /Creer-Merge: strengthen -->>
    }
    /**
     * Invalidation function for weaken. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param web - The web you want to weaken. Must be connected to the Nest
     * this Weaver is currently on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateWeaken(player, web) {
        // <<-- Creer-Merge: invalidate-weaken -->>
        const invalid = this.invalidateWeave(player, web, true);
        if (invalid) {
            return invalid;
        }
        // <<-- /Creer-Merge: invalidate-weaken -->>
    }
    /**
     * Weaves more silk into an existing Web to strengthen it.
     *
     * @param player - The player that called this.
     * @param web - The web you want to weaken. Must be connected to the Nest
     * this Weaver is currently on.
     * @returns True if the weaken was successfully started, false otherwise.
     */
    async weaken(player, web) {
        // <<-- Creer-Merge: weaken -->>
        return this.weave(player, web, "Weakening");
        // <<-- /Creer-Merge: weaken -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * A generic strengthen/weaken wrapper because both are so similar to try to invalidate it
     *
     * @param player - the player that called this.
     * @param web - The web you want to weaken. Must be connected to the Nest this Weaver is currently on.
     * @param weaveType - should be "Strengthening" or "Weakening" as appropriate
     * @returns True if the weaken was successfully started, false otherwise.
     */
    invalidateWeave(player, web, weakening) {
        const invalid = super.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (this.nest !== web.nestA && this.nest !== web.nestB) {
            return `${this} can only strengthen Webs connected to ${this.nest}, ${web} is not.`;
        }
        if (weakening && web.strength <= 1) {
            return `${this} cannot weaken ${web} as its strength is at the minimum (1).`;
        }
        if (!weakening && web.strength >= this.game.maxWebStrength) {
            return `${this} cannot strengthen ${web} as its strength is at the maximum (${this.game.maxWebStrength}).`;
        }
    }
    /**
     * A generic strengthen/weaken wrapper because both are so similar
     *
     * @param player - the player that called this.
     * @param web - The web you want to weaken. Must be connected to the Nest this Weaver is currently on.
     * @param weaveType - should be "Strengthening" or "Weakening" as appropriate
     * @returns True if the weaken was successfully started, false otherwise.
     */
    weave(player, web, weaveType) {
        this.busy = weaveType;
        const webField = weaveType === "Strengthening"
            ? "strengtheningWeb"
            : "weakeningWeb";
        this[webField] = web;
        // workRemaining = distance * sqrt(strength) / speed
        this.workRemaining = web.length * Math.sqrt(web.strength) / this.game.weaveSpeed;
        // find coworkers
        for (const spider of web.getSideSpiders()) {
            if (spider !== this &&
                spider instanceof Weaver &&
                spider[webField] === web) {
                this.coworkers.add(spider);
                this.numberOfCoworkers = this.coworkers.size;
                spider.coworkers.add(this);
                spider.numberOfCoworkers = spider.coworkers.size;
            }
        }
        return true;
    }
}
exports.Weaver = Weaver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VhdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvd2VhdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsNkNBQTBDO0FBRzFDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOzs7R0FHRztBQUNILE1BQWEsTUFBTyxTQUFRLHVCQUFVO0lBWWxDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBSUUsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUM7O09BRUc7SUFDSSxJQUFJO1FBQ1AsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsV0FBcUI7UUFDL0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUM7UUFFNUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLENBQUMsaUZBQWlGO1NBQ2pHO1FBRUQsTUFBTSxHQUFHLEdBQUcsU0FBUztZQUNqQixDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVk7WUFDbkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztRQUU1QixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO1FB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LFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUVyQixvREFBb0Q7UUFDcEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRWpGLGlCQUFpQjtRQUNqQixLQUFLLE1BQU0sTUFBTSxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUUsRUFBRTtZQUN2QyxJQUNJLE1BQU0sS0FBSyxJQUFJO2dCQUNmLE1BQU0sWUFBWSxNQUFNO2dCQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUMxQjtnQkFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO2FBQ3BEO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBR0o7QUFwUEQsd0JBb1BDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJV2VhdmVyUHJvcGVydGllcywgSVdlYXZlclN0cmVuZ3RoZW5BcmdzLCBJV2VhdmVyV2Vha2VuQXJncyxcbiAgICAgICAgIFNwaWRlcmxpbmdBcmdzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFNwaWRlcmxpbmcgfSBmcm9tIFwiLi9zcGlkZXJsaW5nXCI7XG5pbXBvcnQgeyBXZWIgfSBmcm9tIFwiLi93ZWJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBTcGlkZXJsaW5nIHRoYXQgY2FuIGFsdGVyIGV4aXN0aW5nIFdlYnMgYnkgd2VhdmluZyB0byBhZGQgb3IgcmVtb3ZlIHNpbGtcbiAqIGZyb20gdGhlIFdlYnMsIHRodXMgYWx0ZXJpbmcgaXRzIHN0cmVuZ3RoLlxuICovXG5leHBvcnQgY2xhc3MgV2VhdmVyIGV4dGVuZHMgU3BpZGVybGluZyB7XG4gICAgLyoqXG4gICAgICogVGhlIFdlYiB0aGF0IHRoaXMgV2VhdmVyIGlzIHN0cmVuZ3RoZW5pbmcuIFVuZGVmaW5lZCBpZiBub3RcbiAgICAgKiBzdHJlbmd0aGVuaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdHJlbmd0aGVuaW5nV2ViPzogV2ViO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFdlYiB0aGF0IHRoaXMgV2VhdmVyIGlzIHdlYWtlbmluZy4gVW5kZWZpbmVkIGlmIG5vdCB3ZWFrZW5pbmcuXG4gICAgICovXG4gICAgcHVibGljIHdlYWtlbmluZ1dlYj86IFdlYjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFdlYXZlciBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxTcGlkZXJsaW5nQXJncyAmIElXZWF2ZXJQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIGNvbnN0cnVjdG9yIGFyZ3MgaW4gaGVyZVxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBLaWxscyB0aGUgV2VhdmVyXG4gICAgICovXG4gICAgcHVibGljIGtpbGwoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmtpbGwoKTtcblxuICAgICAgICB0aGlzLnN0cmVuZ3RoZW5pbmdXZWIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMud2Vha2VuaW5nV2ViID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmlzaGVzIHRoZSBhY3Rpb25zIG9mIHRoZSBXZWF2ZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZUZpbmlzaCAtIHRydWUgaWYgZm9yY2luZyB0aGUgZmluaXNoIHByZW1hdHVyZWx5XG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGV5IGZpbmlzaGVkLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluaXNoKGZvcmNlRmluaXNoPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCB3ZWFrZW5pbmcgPSB0aGlzLmJ1c3kgPT09IFwiV2Vha2VuaW5nXCI7XG5cbiAgICAgICAgaWYgKHN1cGVyLmZpbmlzaChmb3JjZUZpbmlzaCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBiZWNhdXNlIHRoZXkgZmluaXNoZWQgbW92aW5nIG9yIHNvbWV0aGluZyB0aGUgYmFzZSBTcGlkZXJsaW5nIGNsYXNzIGNhbiBoYW5kbGVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHdlYiA9IHdlYWtlbmluZ1xuICAgICAgICAgICAgPyB0aGlzLndlYWtlbmluZ1dlYlxuICAgICAgICAgICAgOiB0aGlzLnN0cmVuZ3RoZW5pbmdXZWI7XG5cbiAgICAgICAgdGhpcy53ZWFrZW5pbmdXZWIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuc3RyZW5ndGhlbmluZ1dlYiA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAoIWZvcmNlRmluaXNoICYmIHdlYiAmJiAhd2ViLmhhc1NuYXBwZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlbiB0aGV5IGFyZSBmaW5pc2hpbmcgYSB3ZWF2ZSwgbm90IGJlaW5nIGZvcmNlZCB0byBmaW5pc2hcbiAgICAgICAgICAgIC8vIGJlY2F1c2UgdGhlIHdlYiBzbmFwcGVkXG4gICAgICAgICAgICB3ZWIuYWRkU3RyZW5ndGgoKHdlYWtlbmluZyA/IC0xIDogMSkgKiB0aGlzLmdhbWUud2VhdmVQb3dlcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBzdHJlbmd0aGVuLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlXG4gICAgICogcGFzc2VkIGluIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmdcbiAgICAgKiB0ZWxsaW5nIHRoZW0gd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB3ZWIgLSBUaGUgd2ViIHlvdSB3YW50IHRvIHN0cmVuZ3RoZW4uIE11c3QgYmUgY29ubmVjdGVkIHRvIHRoZVxuICAgICAqIE5lc3QgdGhpcyBXZWF2ZXIgaXMgY3VycmVudGx5IG9uLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVN0cmVuZ3RoZW4oXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB3ZWI6IFdlYixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVdlYXZlclN0cmVuZ3RoZW5BcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zdHJlbmd0aGVuIC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlV2VhdmUocGxheWVyLCB3ZWIsIGZhbHNlKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtc3RyZW5ndGhlbiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2VhdmVzIG1vcmUgc2lsayBpbnRvIGFuIGV4aXN0aW5nIFdlYiB0byBzdHJlbmd0aGVuIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gd2ViIC0gVGhlIHdlYiB5b3Ugd2FudCB0byBzdHJlbmd0aGVuLiBNdXN0IGJlIGNvbm5lY3RlZCB0byB0aGVcbiAgICAgKiBOZXN0IHRoaXMgV2VhdmVyIGlzIGN1cnJlbnRseSBvbi5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBzdHJlbmd0aGVuIHdhcyBzdWNjZXNzZnVsbHkgc3RhcnRlZCwgZmFsc2VcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHN0cmVuZ3RoZW4ocGxheWVyOiBQbGF5ZXIsIHdlYjogV2ViKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHN0cmVuZ3RoZW4gLS0+PlxuXG4gICAgICAgIHJldHVybiB0aGlzLndlYXZlKHBsYXllciwgd2ViLCBcIlN0cmVuZ3RoZW5pbmdcIik7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHN0cmVuZ3RoZW4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3Igd2Vha2VuLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB3ZWIgLSBUaGUgd2ViIHlvdSB3YW50IHRvIHdlYWtlbi4gTXVzdCBiZSBjb25uZWN0ZWQgdG8gdGhlIE5lc3RcbiAgICAgKiB0aGlzIFdlYXZlciBpcyBjdXJyZW50bHkgb24uXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlV2Vha2VuKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgd2ViOiBXZWIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElXZWF2ZXJXZWFrZW5BcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS13ZWFrZW4gLS0+PlxuXG4gICAgICAgIGNvbnN0IGludmFsaWQgPSB0aGlzLmludmFsaWRhdGVXZWF2ZShwbGF5ZXIsIHdlYiwgdHJ1ZSk7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXdlYWtlbiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2VhdmVzIG1vcmUgc2lsayBpbnRvIGFuIGV4aXN0aW5nIFdlYiB0byBzdHJlbmd0aGVuIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gd2ViIC0gVGhlIHdlYiB5b3Ugd2FudCB0byB3ZWFrZW4uIE11c3QgYmUgY29ubmVjdGVkIHRvIHRoZSBOZXN0XG4gICAgICogdGhpcyBXZWF2ZXIgaXMgY3VycmVudGx5IG9uLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHdlYWtlbiB3YXMgc3VjY2Vzc2Z1bGx5IHN0YXJ0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgd2Vha2VuKHBsYXllcjogUGxheWVyLCB3ZWI6IFdlYik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB3ZWFrZW4gLS0+PlxuXG4gICAgICAgIHJldHVybiB0aGlzLndlYXZlKHBsYXllciwgd2ViLCBcIldlYWtlbmluZ1wiKTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogd2Vha2VuIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQSBnZW5lcmljIHN0cmVuZ3RoZW4vd2Vha2VuIHdyYXBwZXIgYmVjYXVzZSBib3RoIGFyZSBzbyBzaW1pbGFyIHRvIHRyeSB0byBpbnZhbGlkYXRlIGl0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gdGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB3ZWIgLSBUaGUgd2ViIHlvdSB3YW50IHRvIHdlYWtlbi4gTXVzdCBiZSBjb25uZWN0ZWQgdG8gdGhlIE5lc3QgdGhpcyBXZWF2ZXIgaXMgY3VycmVudGx5IG9uLlxuICAgICAqIEBwYXJhbSB3ZWF2ZVR5cGUgLSBzaG91bGQgYmUgXCJTdHJlbmd0aGVuaW5nXCIgb3IgXCJXZWFrZW5pbmdcIiBhcyBhcHByb3ByaWF0ZVxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHdlYWtlbiB3YXMgc3VjY2Vzc2Z1bGx5IHN0YXJ0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVdlYXZlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgd2ViOiBXZWIsXG4gICAgICAgIHdlYWtlbmluZzogYm9vbGVhbixcbiAgICApOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBpbnZhbGlkID0gc3VwZXIuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5uZXN0ICE9PSB3ZWIubmVzdEEgJiYgdGhpcy5uZXN0ICE9PSB3ZWIubmVzdEIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4gb25seSBzdHJlbmd0aGVuIFdlYnMgY29ubmVjdGVkIHRvICR7dGhpcy5uZXN0fSwgJHt3ZWJ9IGlzIG5vdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHdlYWtlbmluZyAmJiB3ZWIuc3RyZW5ndGggPD0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCB3ZWFrZW4gJHt3ZWJ9IGFzIGl0cyBzdHJlbmd0aCBpcyBhdCB0aGUgbWluaW11bSAoMSkuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2Vha2VuaW5nICYmIHdlYi5zdHJlbmd0aCA+PSB0aGlzLmdhbWUubWF4V2ViU3RyZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3Qgc3RyZW5ndGhlbiAke3dlYn0gYXMgaXRzIHN0cmVuZ3RoIGlzIGF0IHRoZSBtYXhpbXVtICgke3RoaXMuZ2FtZS5tYXhXZWJTdHJlbmd0aH0pLmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBIGdlbmVyaWMgc3RyZW5ndGhlbi93ZWFrZW4gd3JhcHBlciBiZWNhdXNlIGJvdGggYXJlIHNvIHNpbWlsYXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSB0aGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHdlYiAtIFRoZSB3ZWIgeW91IHdhbnQgdG8gd2Vha2VuLiBNdXN0IGJlIGNvbm5lY3RlZCB0byB0aGUgTmVzdCB0aGlzIFdlYXZlciBpcyBjdXJyZW50bHkgb24uXG4gICAgICogQHBhcmFtIHdlYXZlVHlwZSAtIHNob3VsZCBiZSBcIlN0cmVuZ3RoZW5pbmdcIiBvciBcIldlYWtlbmluZ1wiIGFzIGFwcHJvcHJpYXRlXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgd2Vha2VuIHdhcyBzdWNjZXNzZnVsbHkgc3RhcnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByaXZhdGUgd2VhdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB3ZWI6IFdlYixcbiAgICAgICAgd2VhdmVUeXBlOiBcIlN0cmVuZ3RoZW5pbmdcIiB8IFwiV2Vha2VuaW5nXCIsXG4gICAgKTogdHJ1ZSB7XG4gICAgICAgIHRoaXMuYnVzeSA9IHdlYXZlVHlwZTtcblxuICAgICAgICBjb25zdCB3ZWJGaWVsZCA9IHdlYXZlVHlwZSA9PT0gXCJTdHJlbmd0aGVuaW5nXCJcbiAgICAgICAgICAgID8gXCJzdHJlbmd0aGVuaW5nV2ViXCJcbiAgICAgICAgICAgIDogXCJ3ZWFrZW5pbmdXZWJcIjtcblxuICAgICAgICB0aGlzW3dlYkZpZWxkXSA9IHdlYjtcblxuICAgICAgICAvLyB3b3JrUmVtYWluaW5nID0gZGlzdGFuY2UgKiBzcXJ0KHN0cmVuZ3RoKSAvIHNwZWVkXG4gICAgICAgIHRoaXMud29ya1JlbWFpbmluZyA9IHdlYi5sZW5ndGggKiBNYXRoLnNxcnQod2ViLnN0cmVuZ3RoKSAvIHRoaXMuZ2FtZS53ZWF2ZVNwZWVkO1xuXG4gICAgICAgIC8vIGZpbmQgY293b3JrZXJzXG4gICAgICAgIGZvciAoY29uc3Qgc3BpZGVyIG9mIHdlYi5nZXRTaWRlU3BpZGVycygpKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc3BpZGVyICE9PSB0aGlzICYmXG4gICAgICAgICAgICAgICAgc3BpZGVyIGluc3RhbmNlb2YgV2VhdmVyICYmXG4gICAgICAgICAgICAgICAgc3BpZGVyW3dlYkZpZWxkXSA9PT0gd2ViXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvd29ya2Vycy5hZGQoc3BpZGVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLm51bWJlck9mQ293b3JrZXJzID0gdGhpcy5jb3dvcmtlcnMuc2l6ZTtcbiAgICAgICAgICAgICAgICBzcGlkZXIuY293b3JrZXJzLmFkZCh0aGlzKTtcbiAgICAgICAgICAgICAgICBzcGlkZXIubnVtYmVyT2ZDb3dvcmtlcnMgPSBzcGlkZXIuY293b3JrZXJzLnNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==