"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const building_1 = require("./building");
// <<-- Creer-Merge: imports -->>
const lodash_1 = require("lodash");
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * A typical abandoned warehouse... that anarchists hang out in and can be
 * bribed to burn down Buildings.
 */
class Warehouse extends building_1.Building {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Warehouse is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.fireAdded = 3;
        if (this.isHeadquarters) {
            this.owner.headquarters = this;
            this.health *= this.game.settings.headquartersHealthScalar;
            this.fireAdded = this.game.settings.maxFire;
        }
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for ignite. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param building - The Building you want to light on fire.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateIgnite(player, building) {
        // <<-- Creer-Merge: invalidate-ignite -->>
        const invalid = this.invalidateBribe(player);
        if (invalid) {
            return invalid;
        }
        if (building.isHeadquarters) {
            return `${building} Headquarters cannot be targeted by Warehouses directly.`;
        }
        // <<-- /Creer-Merge: invalidate-ignite -->>
    }
    /**
     * Bribes the Warehouse to light a Building on fire. This adds this
     * building's fireAdded to their fire, and then this building's exposure is
     * increased based on the Manhatten distance between the two buildings.
     *
     * @param player - The player that called this.
     * @param building - The Building you want to light on fire.
     * @returns The exposure added to this Building's exposure. -1 is returned
     * if there was an error.
     */
    async ignite(player, building) {
        // <<-- Creer-Merge: ignite -->>
        building.fire = lodash_1.clamp(building.fire + this.fireAdded, 0, this.game.maxFire);
        const exposure = utils_1.manhattanDistance(this, building);
        this.exposure += exposure; // Do we want a cap on this?
        this.bribed = true;
        player.bribesRemaining--;
        return exposure;
        // <<-- /Creer-Merge: ignite -->>
    }
}
exports.Warehouse = Warehouse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FyZWhvdXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2FuYXJjaHkvd2FyZWhvdXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEseUNBQXNDO0FBR3RDLGlDQUFpQztBQUNqQyxtQ0FBK0I7QUFDL0IsbUNBQTRDO0FBQzVDLGtDQUFrQztBQUVsQzs7O0dBR0c7QUFDSCxNQUFhLFNBQVUsU0FBUSxtQkFBUTtJQWNuQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDSSxJQUlFLEVBQ0YsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFFckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFFbkIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUMvQixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDO1lBQzNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1NBQy9DO1FBRUQsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7Ozs7O09BVUc7SUFDTyxnQkFBZ0IsQ0FDdEIsTUFBYyxFQUNkLFFBQWtCO1FBRWxCLDJDQUEyQztRQUUzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFFRCxJQUFJLFFBQVEsQ0FBQyxjQUFjLEVBQUU7WUFDekIsT0FBTyxHQUFHLFFBQVEsMERBQTBELENBQUM7U0FDaEY7UUFFRCw0Q0FBNEM7SUFDaEQsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNPLEtBQUssQ0FBQyxNQUFNLENBQ2xCLE1BQWMsRUFDZCxRQUFrQjtRQUVsQixnQ0FBZ0M7UUFFaEMsUUFBUSxDQUFDLElBQUksR0FBRyxjQUFLLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVFLE1BQU0sUUFBUSxHQUFHLHlCQUFpQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxDQUFDLDRCQUE0QjtRQUV2RCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixNQUFNLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFekIsT0FBTyxRQUFRLENBQUM7UUFFaEIsaUNBQWlDO0lBQ3JDLENBQUM7Q0FPSjtBQXpIRCw4QkF5SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJ1aWxkaW5nQXJncywgSVdhcmVob3VzZUlnbml0ZUFyZ3MsIElXYXJlaG91c2VQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBCdWlsZGluZyB9IGZyb20gXCIuL2J1aWxkaW5nXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IG1hbmhhdHRhbkRpc3RhbmNlIH0gZnJvbSBcIn4vdXRpbHNcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIHR5cGljYWwgYWJhbmRvbmVkIHdhcmVob3VzZS4uLiB0aGF0IGFuYXJjaGlzdHMgaGFuZyBvdXQgaW4gYW5kIGNhbiBiZVxuICogYnJpYmVkIHRvIGJ1cm4gZG93biBCdWlsZGluZ3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBXYXJlaG91c2UgZXh0ZW5kcyBCdWlsZGluZyB7XG4gICAgLyoqXG4gICAgICogSG93IGV4cG9zZWQgdGhlIGFuYXJjaGlzdHMgaW4gdGhpcyB3YXJlaG91c2UgYXJlIHRvIFBvbGljZURlcGFydG1lbnRzLlxuICAgICAqIFJhaXNlcyB3aGVuIGJyaWJlZCB0byBpZ25pdGUgYnVpbGRpbmdzLCBhbmQgZHJvcHMgZWFjaCB0dXJuIGlmIG5vdFxuICAgICAqIGJyaWJlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZXhwb3N1cmUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGZpcmUgYWRkZWQgdG8gYnVpbGRpbmdzIHdoZW4gYnJpYmVkIHRvIGlnbml0ZSBhIGJ1aWxkaW5nLlxuICAgICAqIEhlYWRxdWFydGVycyBhZGQgbW9yZSBmaXJlIHRoYW4gbm9ybWFsIFdhcmVob3VzZXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGZpcmVBZGRlZCE6IG51bWJlcjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFdhcmVob3VzZSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxCdWlsZGluZ0FyZ3MgJiBJV2FyZWhvdXNlUHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgbW9yZSBjb25zdHJ1Y3RvciBhcmdzIGluIGhlcmVcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuXG4gICAgICAgIHRoaXMuZmlyZUFkZGVkID0gMztcblxuICAgICAgICBpZiAodGhpcy5pc0hlYWRxdWFydGVycykge1xuICAgICAgICAgICAgdGhpcy5vd25lci5oZWFkcXVhcnRlcnMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5oZWFsdGggKj0gdGhpcy5nYW1lLnNldHRpbmdzLmhlYWRxdWFydGVyc0hlYWx0aFNjYWxhcjtcbiAgICAgICAgICAgIHRoaXMuZmlyZUFkZGVkID0gdGhpcy5nYW1lLnNldHRpbmdzLm1heEZpcmU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBpZ25pdGUuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGJ1aWxkaW5nIC0gVGhlIEJ1aWxkaW5nIHlvdSB3YW50IHRvIGxpZ2h0IG9uIGZpcmUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlSWduaXRlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgYnVpbGRpbmc6IEJ1aWxkaW5nLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJV2FyZWhvdXNlSWduaXRlQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtaWduaXRlIC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlQnJpYmUocGxheWVyKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGJ1aWxkaW5nLmlzSGVhZHF1YXJ0ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7YnVpbGRpbmd9IEhlYWRxdWFydGVycyBjYW5ub3QgYmUgdGFyZ2V0ZWQgYnkgV2FyZWhvdXNlcyBkaXJlY3RseS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtaWduaXRlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmliZXMgdGhlIFdhcmVob3VzZSB0byBsaWdodCBhIEJ1aWxkaW5nIG9uIGZpcmUuIFRoaXMgYWRkcyB0aGlzXG4gICAgICogYnVpbGRpbmcncyBmaXJlQWRkZWQgdG8gdGhlaXIgZmlyZSwgYW5kIHRoZW4gdGhpcyBidWlsZGluZydzIGV4cG9zdXJlIGlzXG4gICAgICogaW5jcmVhc2VkIGJhc2VkIG9uIHRoZSBNYW5oYXR0ZW4gZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHdvIGJ1aWxkaW5ncy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGJ1aWxkaW5nIC0gVGhlIEJ1aWxkaW5nIHlvdSB3YW50IHRvIGxpZ2h0IG9uIGZpcmUuXG4gICAgICogQHJldHVybnMgVGhlIGV4cG9zdXJlIGFkZGVkIHRvIHRoaXMgQnVpbGRpbmcncyBleHBvc3VyZS4gLTEgaXMgcmV0dXJuZWRcbiAgICAgKiBpZiB0aGVyZSB3YXMgYW4gZXJyb3IuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGlnbml0ZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGJ1aWxkaW5nOiBCdWlsZGluZyxcbiAgICApOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpZ25pdGUgLS0+PlxuXG4gICAgICAgIGJ1aWxkaW5nLmZpcmUgPSBjbGFtcChidWlsZGluZy5maXJlICsgdGhpcy5maXJlQWRkZWQsIDAsIHRoaXMuZ2FtZS5tYXhGaXJlKTtcbiAgICAgICAgY29uc3QgZXhwb3N1cmUgPSBtYW5oYXR0YW5EaXN0YW5jZSh0aGlzLCBidWlsZGluZyk7XG4gICAgICAgIHRoaXMuZXhwb3N1cmUgKz0gZXhwb3N1cmU7IC8vIERvIHdlIHdhbnQgYSBjYXAgb24gdGhpcz9cblxuICAgICAgICB0aGlzLmJyaWJlZCA9IHRydWU7XG4gICAgICAgIHBsYXllci5icmliZXNSZW1haW5pbmctLTtcblxuICAgICAgICByZXR1cm4gZXhwb3N1cmU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGlnbml0ZSAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19