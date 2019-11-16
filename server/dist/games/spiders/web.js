"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
const lodash_1 = require("lodash");
const utils_1 = require("~/utils");
const cutter_1 = require("./cutter");
const weaver_1 = require("./weaver");
// <<-- /Creer-Merge: imports -->>
/**
 * A connection (edge) to a Nest (node) in the game that Spiders can converge
 * on (regardless of owner). Spiders can travel in either direction on Webs.
 */
class Web extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Web is created.
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
     * Snaps the web, killing all spiders on it.
     */
    snap() {
        if (this.hasSnapped() || !this.nestA || !this.nestB) {
            return; // as it's snapping more than once at the end of the turn
        }
        const spiderlings = this.spiderlings.slice();
        for (const spiderling of spiderlings) {
            spiderling.kill();
        }
        this.strength = -1; // has now snapped
        // if any Spiderlings are doing something with this web on nestA or B, tell them to finish
        const sideSpiders = this.getSideSpiders();
        for (const spider of sideSpiders) {
            if ((spider instanceof cutter_1.Cutter && spider.cuttingWeb === this) ||
                (spider instanceof weaver_1.Weaver && (spider.strengtheningWeb === this ||
                    spider.weakeningWeb === this))) { // then they may be busy with this
                spider.finish(true);
            }
        }
        utils_1.removeElementFrom(this, this.game.webs, this.nestA.webs, this.nestB.webs);
        this.nestA = undefined;
        this.nestB = undefined;
    }
    /**
     * Returns if this Web has been snapped, and is thus no longer part of the game.
     *
     * @returns True if the web has been snapped (is dead), false otherwise
     */
    hasSnapped() {
        return this.strength === -1;
    }
    /**
     * Returns if this Web has been NOT snapped, and thus has nests.
     *
     * @returns False if the web has been snapped (is dead), True otherwise
     */
    hasNotSnapped() {
        return this.strength > -1;
    }
    /**
     * Checks if the Web is connected to some Nest
     *
     * @param nest - The nest to check if is connected to at nestA or nestB
     * @param otherNest - if passed then checks if nestA and nestB are the
     * otherNest and the previous arg nest (in either order).
     * @returns True if it is connected to that web, false otherwise,
     * undefined if nest is undefined.
     */
    isConnectedTo(nest, otherNest) {
        if (!nest) {
            return undefined;
        }
        if (!otherNest) {
            return this.nestA === nest || this.nestB === nest;
        }
        return (this.nestA === nest && this.nestB === otherNest) ||
            (this.nestA === otherNest && this.nestB === nest);
    }
    /**
     * Gets the other nest, given one of its nests A or B
     *
     * @param nest - the nest to get the other one
     * @returns the other Nest that the passed in nest is not, undefined is
     * nest is not part of this Web.
     */
    getOtherNest(nest) {
        if (!this.isConnectedTo(nest)) {
            return undefined;
        }
        return this.nestA === nest ? this.nestB : this.nestA;
    }
    /**
     * Should be called whenever something changes on the web, so it needs to
     * re-calculate its current load and maybe snap.
     *
     * @param num - the load (weight) of a spiderling to add
     */
    addLoad(num) {
        this.load = Math.max(this.load + num, 0);
        if (this.load > this.strength) {
            this.snap();
        }
    }
    /**
     * Adds some number to this web's strength, and might snap it
     *
     * @param num - number to add to this Web's strength
     */
    addStrength(num) {
        this.strength = lodash_1.clamp(this.strength + num, 1, this.game.maxWebStrength);
        if (this.load >= this.strength) {
            this.snap();
        }
    }
    /**
     * Gets a new array containing all the spiders on this Web's nestA & B.
     *
     * @returns An array of Spiders in nest A and B (the sides of this web).
     */
    getSideSpiders() {
        return (this.nestA && this.nestB)
            ? this.nestA.spiders.concat(this.nestB.spiders)
            : [];
    }
}
exports.Web = Web;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0NBQTJDO0FBSTNDLGlDQUFpQztBQUNqQyxtQ0FBK0I7QUFDL0IsbUNBQTRDO0FBQzVDLHFDQUFrQztBQUVsQyxxQ0FBa0M7QUFDbEMsa0NBQWtDO0FBRWxDOzs7R0FHRztBQUNILE1BQWEsR0FBSSxTQUFRLHdCQUFVO0lBaUMvQixvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDSSxJQUlFLEVBQ0YsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDOztPQUVHO0lBQ0ksSUFBSTtRQUNQLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDakQsT0FBTyxDQUFDLHlEQUF5RDtTQUNwRTtRQUVELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0MsS0FBSyxNQUFNLFVBQVUsSUFBSSxXQUFXLEVBQUU7WUFDbEMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQjtRQUV0QywwRkFBMEY7UUFDMUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFDLEtBQUssTUFBTSxNQUFNLElBQUksV0FBVyxFQUFFO1lBQzlCLElBQ0ksQ0FBQyxNQUFNLFlBQVksZUFBTSxJ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QUMsQ0FBQyxFQUFFLENBQUM7SUFDYixDQUFDO0NBU0o7QUFwTkQsa0JBb05DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJV2ViUHJvcGVydGllcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBOZXN0IH0gZnJvbSBcIi4vbmVzdFwiO1xuaW1wb3J0IHsgU3BpZGVybGluZyB9IGZyb20gXCIuL3NwaWRlcmxpbmdcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IHJlbW92ZUVsZW1lbnRGcm9tIH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IEN1dHRlciB9IGZyb20gXCIuL2N1dHRlclwiO1xuaW1wb3J0IHsgU3BpZGVyIH0gZnJvbSBcIi4vc3BpZGVyXCI7XG5pbXBvcnQgeyBXZWF2ZXIgfSBmcm9tIFwiLi93ZWF2ZXJcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIGNvbm5lY3Rpb24gKGVkZ2UpIHRvIGEgTmVzdCAobm9kZSkgaW4gdGhlIGdhbWUgdGhhdCBTcGlkZXJzIGNhbiBjb252ZXJnZVxuICogb24gKHJlZ2FyZGxlc3Mgb2Ygb3duZXIpLiBTcGlkZXJzIGNhbiB0cmF2ZWwgaW4gZWl0aGVyIGRpcmVjdGlvbiBvbiBXZWJzLlxuICovXG5leHBvcnQgY2xhc3MgV2ViIGV4dGVuZHMgR2FtZU9iamVjdCB7XG4gICAgLyoqXG4gICAgICogSG93IGxvbmcgdGhpcyBXZWIgaXMsIGkuZS4sIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIGl0cyBuZXN0QSBhbmQgbmVzdEIuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGxlbmd0aCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIHdlaWdodCB0aGlzIFdlYiBjdXJyZW50bHkgaGFzIG9uIGl0LCB3aGljaCBpcyB0aGUgc3VtIG9mIGFsbFxuICAgICAqIGl0cyBTcGlkZXJsaW5ncyB3ZWlnaHQuXG4gICAgICovXG4gICAgcHVibGljIGxvYWQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZmlyc3QgTmVzdCB0aGlzIFdlYiBpcyBjb25uZWN0ZWQgdG8uXG4gICAgICovXG4gICAgcHVibGljIG5lc3RBPzogTmVzdDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzZWNvbmQgTmVzdCB0aGlzIFdlYiBpcyBjb25uZWN0ZWQgdG8uXG4gICAgICovXG4gICAgcHVibGljIG5lc3RCPzogTmVzdDtcblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgU3BpZGVybGluZ3MgY3VycmVudGx5IG1vdmluZyBhbG9uZyB0aGlzIFdlYi5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3BpZGVybGluZ3MhOiBTcGlkZXJsaW5nW107XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCB3ZWlnaHQgdGhpcyBXZWIgY2FuIHRha2UgYmVmb3JlIHNuYXBwaW5nIGFuZCBkZXN0cm95aW5nIGl0c2VsZlxuICAgICAqIGFuZCBhbGwgdGhlIFNwaWRlcnMgb24gaXQuXG4gICAgICovXG4gICAgcHVibGljIHN0cmVuZ3RoITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgV2ViIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElXZWJQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIGNvbnN0cnVjdG9yIGFyZ3MgaW4gaGVyZVxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBTbmFwcyB0aGUgd2ViLCBraWxsaW5nIGFsbCBzcGlkZXJzIG9uIGl0LlxuICAgICAqL1xuICAgIHB1YmxpYyBzbmFwKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5oYXNTbmFwcGVkKCkgfHwgIXRoaXMubmVzdEEgfHwgIXRoaXMubmVzdEIpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gYXMgaXQncyBzbmFwcGluZyBtb3JlIHRoYW4gb25jZSBhdCB0aGUgZW5kIG9mIHRoZSB0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzcGlkZXJsaW5ncyA9IHRoaXMuc3BpZGVybGluZ3Muc2xpY2UoKTtcbiAgICAgICAgZm9yIChjb25zdCBzcGlkZXJsaW5nIG9mIHNwaWRlcmxpbmdzKSB7XG4gICAgICAgICAgICBzcGlkZXJsaW5nLmtpbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RyZW5ndGggPSAtMTsgLy8gaGFzIG5vdyBzbmFwcGVkXG5cbiAgICAgICAgLy8gaWYgYW55IFNwaWRlcmxpbmdzIGFyZSBkb2luZyBzb21ldGhpbmcgd2l0aCB0aGlzIHdlYiBvbiBuZXN0QSBvciBCLCB0ZWxsIHRoZW0gdG8gZmluaXNoXG4gICAgICAgIGNvbnN0IHNpZGVTcGlkZXJzID0gdGhpcy5nZXRTaWRlU3BpZGVycygpO1xuICAgICAgICBmb3IgKGNvbnN0IHNwaWRlciBvZiBzaWRlU3BpZGVycykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChzcGlkZXIgaW5zdGFuY2VvZiBDdXR0ZXIgJiYgc3BpZGVyLmN1dHRpbmdXZWIgPT09IHRoaXMpIHx8XG4gICAgICAgICAgICAgICAgKHNwaWRlciBpbnN0YW5jZW9mIFdlYXZlciAmJiAoXG4gICAgICAgICAgICAgICAgICAgIHNwaWRlci5zdHJlbmd0aGVuaW5nV2ViID09PSB0aGlzIHx8XG4gICAgICAgICAgICAgICAgICAgIHNwaWRlci53ZWFrZW5pbmdXZWIgPT09IHRoaXNcbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgKSB7IC8vIHRoZW4gdGhleSBtYXkgYmUgYnVzeSB3aXRoIHRoaXNcbiAgICAgICAgICAgICAgICBzcGlkZXIuZmluaXNoKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlRWxlbWVudEZyb20odGhpcyxcbiAgICAgICAgICAgIHRoaXMuZ2FtZS53ZWJzLFxuICAgICAgICAgICAgdGhpcy5uZXN0QS53ZWJzLFxuICAgICAgICAgICAgdGhpcy5uZXN0Qi53ZWJzLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMubmVzdEEgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubmVzdEIgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGlzIFdlYiBoYXMgYmVlbiBzbmFwcGVkLCBhbmQgaXMgdGh1cyBubyBsb25nZXIgcGFydCBvZiB0aGUgZ2FtZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHdlYiBoYXMgYmVlbiBzbmFwcGVkIChpcyBkZWFkKSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGhhc1NuYXBwZWQoKTogdGhpcyBpcyBXZWIgJiB7XG4gICAgICAgIC8qKiBObyBuZXN0IGluIHRoaXMgY2FzZS4gKi9cbiAgICAgICAgbmVzdEE6IHVuZGVmaW5lZDtcbiAgICAgICAgLyoqIE5vIG5lc3QgaW4gdGhpcyBjYXNlLiAqL1xuICAgICAgICBuZXN0QjogdW5kZWZpbmVkO1xuICAgIH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJlbmd0aCA9PT0gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGlzIFdlYiBoYXMgYmVlbiBOT1Qgc25hcHBlZCwgYW5kIHRodXMgaGFzIG5lc3RzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgRmFsc2UgaWYgdGhlIHdlYiBoYXMgYmVlbiBzbmFwcGVkIChpcyBkZWFkKSwgVHJ1ZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzTm90U25hcHBlZCgpOiB0aGlzIGlzIFdlYiAmIHtcbiAgICAgICAgLyoqIFRoZSBOZXN0IGl0IGlzIGNvbm5lY3RlZCB0by4gKi9cbiAgICAgICAgbmVzdEE6IE5lc3Q7XG4gICAgICAgIC8qKiBUaGUgTmVzdCBpdCBpcyBjb25uZWN0ZWQgdG8uICovXG4gICAgICAgIG5lc3RCOiBOZXN0O1xuICAgIH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJlbmd0aCA+IC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgV2ViIGlzIGNvbm5lY3RlZCB0byBzb21lIE5lc3RcbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXN0IC0gVGhlIG5lc3QgdG8gY2hlY2sgaWYgaXMgY29ubmVjdGVkIHRvIGF0IG5lc3RBIG9yIG5lc3RCXG4gICAgICogQHBhcmFtIG90aGVyTmVzdCAtIGlmIHBhc3NlZCB0aGVuIGNoZWNrcyBpZiBuZXN0QSBhbmQgbmVzdEIgYXJlIHRoZVxuICAgICAqIG90aGVyTmVzdCBhbmQgdGhlIHByZXZpb3VzIGFyZyBuZXN0IChpbiBlaXRoZXIgb3JkZXIpLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgaXQgaXMgY29ubmVjdGVkIHRvIHRoYXQgd2ViLCBmYWxzZSBvdGhlcndpc2UsXG4gICAgICogdW5kZWZpbmVkIGlmIG5lc3QgaXMgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0Nvbm5lY3RlZFRvKG5lc3Q6IE5lc3QsIG90aGVyTmVzdD86IE5lc3QpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKCFuZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFvdGhlck5lc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5lc3RBID09PSBuZXN0IHx8IHRoaXMubmVzdEIgPT09IG5lc3Q7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKHRoaXMubmVzdEEgPT09IG5lc3QgJiYgdGhpcy5uZXN0QiA9PT0gb3RoZXJOZXN0KSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLm5lc3RBID09PSBvdGhlck5lc3QgJiYgdGhpcy5uZXN0QiA9PT0gbmVzdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgb3RoZXIgbmVzdCwgZ2l2ZW4gb25lIG9mIGl0cyBuZXN0cyBBIG9yIEJcbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXN0IC0gdGhlIG5lc3QgdG8gZ2V0IHRoZSBvdGhlciBvbmVcbiAgICAgKiBAcmV0dXJucyB0aGUgb3RoZXIgTmVzdCB0aGF0IHRoZSBwYXNzZWQgaW4gbmVzdCBpcyBub3QsIHVuZGVmaW5lZCBpc1xuICAgICAqIG5lc3QgaXMgbm90IHBhcnQgb2YgdGhpcyBXZWIuXG4gICAgICovXG4gICAgcHVibGljIGdldE90aGVyTmVzdChuZXN0OiBOZXN0KTogTmVzdCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0Nvbm5lY3RlZFRvKG5lc3QpKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubmVzdEEgPT09IG5lc3QgPyB0aGlzLm5lc3RCIDogdGhpcy5uZXN0QTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgYmUgY2FsbGVkIHdoZW5ldmVyIHNvbWV0aGluZyBjaGFuZ2VzIG9uIHRoZSB3ZWIsIHNvIGl0IG5lZWRzIHRvXG4gICAgICogcmUtY2FsY3VsYXRlIGl0cyBjdXJyZW50IGxvYWQgYW5kIG1heWJlIHNuYXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbnVtIC0gdGhlIGxvYWQgKHdlaWdodCkgb2YgYSBzcGlkZXJsaW5nIHRvIGFkZFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRMb2FkKG51bTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9hZCA9IE1hdGgubWF4KHRoaXMubG9hZCArIG51bSwgMCk7XG5cbiAgICAgICAgaWYgKHRoaXMubG9hZCA+IHRoaXMuc3RyZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc25hcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBzb21lIG51bWJlciB0byB0aGlzIHdlYidzIHN0cmVuZ3RoLCBhbmQgbWlnaHQgc25hcCBpdFxuICAgICAqXG4gICAgICogQHBhcmFtIG51bSAtIG51bWJlciB0byBhZGQgdG8gdGhpcyBXZWIncyBzdHJlbmd0aFxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRTdHJlbmd0aChudW06IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnN0cmVuZ3RoID0gY2xhbXAodGhpcy5zdHJlbmd0aCArIG51bSwgMSwgdGhpcy5nYW1lLm1heFdlYlN0cmVuZ3RoKTtcbiAgICAgICAgaWYgKHRoaXMubG9hZCA+PSB0aGlzLnN0cmVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNuYXAoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBuZXcgYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIHNwaWRlcnMgb24gdGhpcyBXZWIncyBuZXN0QSAmIEIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBTcGlkZXJzIGluIG5lc3QgQSBhbmQgQiAodGhlIHNpZGVzIG9mIHRoaXMgd2ViKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U2lkZVNwaWRlcnMoKTogU3BpZGVyW10ge1xuICAgICAgICByZXR1cm4gKHRoaXMubmVzdEEgJiYgdGhpcy5uZXN0QilcbiAgICAgICAgICAgID8gdGhpcy5uZXN0QS5zcGlkZXJzLmNvbmNhdCh0aGlzLm5lc3RCLnNwaWRlcnMpXG4gICAgICAgICAgICA6IFtdO1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==