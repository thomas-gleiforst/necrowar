"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spiderling_1 = require("./spiderling");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * A Spiderling that creates and spits new Webs from the Nest it is on to
 * another Nest, connecting them.
 */
class Spitter extends spiderling_1.Spiderling {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Spitter is created.
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
    /** Kills the Spitter */
    kill() {
        super.kill();
        this.spittingWebToNest = undefined;
    }
    /**
     * Finishes the actions of the Spitter
     *
     * @param forceFinish - true if forcing the finish prematurely
     * @returns True if the base finished, false otherwise
     */
    finish(forceFinish) {
        if (super.finish(forceFinish)) {
            return true; // because they finished moving or something the base Spiderling class can handle
        }
        if (forceFinish) {
            this.spittingWebToNest = undefined;
            return false;
        }
        // if we got here they finished spitting
        const newWeb = this.manager.create.web({
            nestA: this.nest,
            nestB: this.spittingWebToNest,
        });
        // cancel spitters on the current nest to the destination
        for (const spider of newWeb.getSideSpiders()) {
            if (spider !== this && spider instanceof Spitter && (spider.spittingWebToNest === this.spittingWebToNest || spider.spittingWebToNest === this.nest)) {
                spider.finish(true);
            }
        }
        this.spittingWebToNest = undefined;
        return false;
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for spit. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param nest - The Nest you want to spit a Web to, thus connecting that
     * Nest and the one the Spitter is on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSpit(player, nest) {
        // <<-- Creer-Merge: invalidate-spit -->>
        const invalid = super.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.nest) {
            return `${this} is not on a Nest`;
        }
        if (nest === this.nest) {
            return `${this} cannot spit at the same Nest it is on (${nest}).`;
        }
        for (const web of nest.webs) {
            if (web.isConnectedTo(this.nest, nest)) {
                return `${this} cannot spit a new Web from ${this.nest} to ${nest} because ${web} already exists.`;
            }
        }
        // <<-- /Creer-Merge: invalidate-spit -->>
    }
    /**
     * Creates and spits a new Web from the Nest the Spitter is on to another
     * Nest, connecting them.
     *
     * @param player - The player that called this.
     * @param nest - The Nest you want to spit a Web to, thus connecting that
     * Nest and the one the Spitter is on.
     * @returns True if the spit was successful, false otherwise.
     */
    async spit(player, nest) {
        // <<-- Creer-Merge: spit -->>
        if (!this.nest) {
            throw new Error(`${this} is trying to spit without being on a Nest!`);
        }
        this.busy = "Spitting";
        this.spittingWebToNest = nest;
        // find coworkers
        const sideSpiders = this.nest.spiders.concat(nest.spiders);
        for (const spider of sideSpiders) {
            if (spider !== this
                && spider instanceof Spitter
                && (spider.spittingWebToNest === nest
                    || spider.spittingWebToNest === this.nest)) {
                this.coworkers.add(spider);
                this.numberOfCoworkers = this.coworkers.size;
                spider.coworkers.add(this);
                spider.numberOfCoworkers = spider.coworkers.size;
            }
        }
        this.workRemaining = utils_1.euclideanDistance(this.nest, nest) / this.game.spitSpeed;
        return true;
        // <<-- /Creer-Merge: spit -->>
    }
}
exports.Spitter = Spitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zcGlkZXJzL3NwaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSw2Q0FBMEM7QUFFMUMsaUNBQWlDO0FBQ2pDLG1DQUE0QztBQUM1QyxrQ0FBa0M7QUFFbEM7OztHQUdHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsdUJBQVU7SUFPbkMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3QkFBd0I7SUFDakIsSUFBSTtRQUNQLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUViLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFdBQXFCO1FBQy9CLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQyxDQUFDLGlGQUFpRjtTQUNqRztRQUVELElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztZQUVuQyxPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELHdDQUF3QztRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDbkMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2hCLEtBQUssRUFBRSxJQUFJLENBQUMsaUJBQWlCO1NBQ2hDLENBQUMsQ0FBQztRQUVILHlEQUF5RDtRQUN6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dGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElTcGl0dGVyUHJvcGVydGllcywgSVNwaXR0ZXJTcGl0QXJncywgU3BpZGVybGluZ0FyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IE5lc3QgfSBmcm9tIFwiLi9uZXN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFNwaWRlcmxpbmcgfSBmcm9tIFwiLi9zcGlkZXJsaW5nXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2UgfSBmcm9tIFwifi91dGlsc1wiO1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgU3BpZGVybGluZyB0aGF0IGNyZWF0ZXMgYW5kIHNwaXRzIG5ldyBXZWJzIGZyb20gdGhlIE5lc3QgaXQgaXMgb24gdG9cbiAqIGFub3RoZXIgTmVzdCwgY29ubmVjdGluZyB0aGVtLlxuICovXG5leHBvcnQgY2xhc3MgU3BpdHRlciBleHRlbmRzIFNwaWRlcmxpbmcge1xuICAgIC8qKlxuICAgICAqIFRoZSBOZXN0IHRoYXQgdGhpcyBTcGl0dGVyIGlzIGNyZWF0aW5nIGEgV2ViIHRvIHNwaXQgYXQsIHRodXMgY29ubmVjdGluZ1xuICAgICAqIHRoZW0uIFVuZGVmaW5lZCBpZiBub3Qgc3BpdHRpbmcuXG4gICAgICovXG4gICAgcHVibGljIHNwaXR0aW5nV2ViVG9OZXN0PzogTmVzdDtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFNwaXR0ZXIgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8U3BpZGVybGluZ0FyZ3MgJiBJU3BpdHRlclByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgY29uc3RydWN0b3IgYXJncyBpbiBoZXJlXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKiBLaWxscyB0aGUgU3BpdHRlciAqL1xuICAgIHB1YmxpYyBraWxsKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5raWxsKCk7XG5cbiAgICAgICAgdGhpcy5zcGl0dGluZ1dlYlRvTmVzdCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5pc2hlcyB0aGUgYWN0aW9ucyBvZiB0aGUgU3BpdHRlclxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcmNlRmluaXNoIC0gdHJ1ZSBpZiBmb3JjaW5nIHRoZSBmaW5pc2ggcHJlbWF0dXJlbHlcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBiYXNlIGZpbmlzaGVkLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgZmluaXNoKGZvcmNlRmluaXNoPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoc3VwZXIuZmluaXNoKGZvcmNlRmluaXNoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIGJlY2F1c2UgdGhleSBmaW5pc2hlZCBtb3Zpbmcgb3Igc29tZXRoaW5nIHRoZSBiYXNlIFNwaWRlcmxpbmcgY2xhc3MgY2FuIGhhbmRsZVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvcmNlRmluaXNoKSB7XG4gICAgICAgICAgICB0aGlzLnNwaXR0aW5nV2ViVG9OZXN0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB3ZSBnb3QgaGVyZSB0aGV5IGZpbmlzaGVkIHNwaXR0aW5nXG4gICAgICAgIGNvbnN0IG5ld1dlYiA9IHRoaXMubWFuYWdlci5jcmVhdGUud2ViKHtcbiAgICAgICAgICAgIG5lc3RBOiB0aGlzLm5lc3QsXG4gICAgICAgICAgICBuZXN0QjogdGhpcy5zcGl0dGluZ1dlYlRvTmVzdCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gY2FuY2VsIHNwaXR0ZXJzIG9uIHRoZSBjdXJyZW50IG5lc3QgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICAgIGZvciAoY29uc3Qgc3BpZGVyIG9mIG5ld1dlYi5nZXRTaWRlU3BpZGVycygpKSB7XG4gICAgICAgICAgICBpZiAoc3BpZGVyICE9PSB0aGlzICYmIHNwaWRlciBpbnN0YW5jZW9mIFNwaXR0ZXIgJiYgKFxuICAgICAgICAgICAgICAgIHNwaWRlci5zcGl0dGluZ1dlYlRvTmVzdCA9PT0gdGhpcy5zcGl0dGluZ1dlYlRvTmVzdCB8fCBzcGlkZXIuc3BpdHRpbmdXZWJUb05lc3QgPT09IHRoaXMubmVzdFxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIHNwaWRlci5maW5pc2godHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNwaXR0aW5nV2ViVG9OZXN0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHNwaXQuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIG5lc3QgLSBUaGUgTmVzdCB5b3Ugd2FudCB0byBzcGl0IGEgV2ViIHRvLCB0aHVzIGNvbm5lY3RpbmcgdGhhdFxuICAgICAqIE5lc3QgYW5kIHRoZSBvbmUgdGhlIFNwaXR0ZXIgaXMgb24uXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlU3BpdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIG5lc3Q6IE5lc3QsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElTcGl0dGVyU3BpdEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNwaXQgLS0+PlxuXG4gICAgICAgIGNvbnN0IGludmFsaWQgPSBzdXBlci5pbnZhbGlkYXRlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5uZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgTmVzdGA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVzdCA9PT0gdGhpcy5uZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IHNwaXQgYXQgdGhlIHNhbWUgTmVzdCBpdCBpcyBvbiAoJHtuZXN0fSkuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3Qgd2ViIG9mIG5lc3Qud2Vicykge1xuICAgICAgICAgICAgaWYgKHdlYi5pc0Nvbm5lY3RlZFRvKHRoaXMubmVzdCwgbmVzdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IHNwaXQgYSBuZXcgV2ViIGZyb20gJHt0aGlzLm5lc3R9IHRvICR7bmVzdH0gYmVjYXVzZSAke3dlYn0gYWxyZWFkeSBleGlzdHMuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNwaXQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW5kIHNwaXRzIGEgbmV3IFdlYiBmcm9tIHRoZSBOZXN0IHRoZSBTcGl0dGVyIGlzIG9uIHRvIGFub3RoZXJcbiAgICAgKiBOZXN0LCBjb25uZWN0aW5nIHRoZW0uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBuZXN0IC0gVGhlIE5lc3QgeW91IHdhbnQgdG8gc3BpdCBhIFdlYiB0bywgdGh1cyBjb25uZWN0aW5nIHRoYXRcbiAgICAgKiBOZXN0IGFuZCB0aGUgb25lIHRoZSBTcGl0dGVyIGlzIG9uLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHNwaXQgd2FzIHN1Y2Nlc3NmdWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgc3BpdChwbGF5ZXI6IFBsYXllciwgbmVzdDogTmVzdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzcGl0IC0tPj5cblxuICAgICAgICBpZiAoIXRoaXMubmVzdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXN9IGlzIHRyeWluZyB0byBzcGl0IHdpdGhvdXQgYmVpbmcgb24gYSBOZXN0IWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idXN5ID0gXCJTcGl0dGluZ1wiO1xuICAgICAgICB0aGlzLnNwaXR0aW5nV2ViVG9OZXN0ID0gbmVzdDtcblxuICAgICAgICAvLyBmaW5kIGNvd29ya2Vyc1xuICAgICAgICBjb25zdCBzaWRlU3BpZGVycyA9IHRoaXMubmVzdC5zcGlkZXJzLmNvbmNhdChuZXN0LnNwaWRlcnMpO1xuICAgICAgICBmb3IgKGNvbnN0IHNwaWRlciBvZiBzaWRlU3BpZGVycykge1xuICAgICAgICAgICAgaWYgKHNwaWRlciAhPT0gdGhpc1xuICAgICAgICAgICAgICAgICYmIHNwaWRlciBpbnN0YW5jZW9mIFNwaXR0ZXJcbiAgICAgICAgICAgICAgICAmJiAoc3BpZGVyLnNwaXR0aW5nV2ViVG9OZXN0ID09PSBuZXN0XG4gICAgICAgICAgICAgICAgICAgIHx8IHNwaWRlci5zcGl0dGluZ1dlYlRvTmVzdCA9PT0gdGhpcy5uZXN0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3dvcmtlcnMuYWRkKHNwaWRlcik7XG4gICAgICAgICAgICAgICAgdGhpcy5udW1iZXJPZkNvd29ya2VycyA9IHRoaXMuY293b3JrZXJzLnNpemU7XG4gICAgICAgICAgICAgICAgc3BpZGVyLmNvd29ya2Vycy5hZGQodGhpcyk7XG4gICAgICAgICAgICAgICAgc3BpZGVyLm51bWJlck9mQ293b3JrZXJzID0gc3BpZGVyLmNvd29ya2Vycy5zaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53b3JrUmVtYWluaW5nID0gZXVjbGlkZWFuRGlzdGFuY2UodGhpcy5uZXN0LCBuZXN0KSAvIHRoaXMuZ2FtZS5zcGl0U3BlZWQ7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNwaXQgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==