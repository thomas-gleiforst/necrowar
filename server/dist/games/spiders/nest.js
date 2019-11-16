"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A location (node) connected to other Nests via Webs (edges) in the game that
 * Spiders can converge on, regardless of owner.
 */
class Nest extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Nest is created.
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
}
exports.Nest = Nest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zcGlkZXJzL25lc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQ0FBMkM7QUFLM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7OztHQUdHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsd0JBQVU7SUEyQmhDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBSUUsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7Q0FlSjtBQXJFRCxvQkFxRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElOZXN0UHJvcGVydGllcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFNwaWRlciB9IGZyb20gXCIuL3NwaWRlclwiO1xuaW1wb3J0IHsgV2ViIH0gZnJvbSBcIi4vd2ViXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgbG9jYXRpb24gKG5vZGUpIGNvbm5lY3RlZCB0byBvdGhlciBOZXN0cyB2aWEgV2VicyAoZWRnZXMpIGluIHRoZSBnYW1lIHRoYXRcbiAqIFNwaWRlcnMgY2FuIGNvbnZlcmdlIG9uLCByZWdhcmRsZXNzIG9mIG93bmVyLlxuICovXG5leHBvcnQgY2xhc3MgTmVzdCBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIFRoZSBQbGF5ZXIgdGhhdCAnY29udHJvbHMnIHRoaXMgTmVzdCBhcyB0aGV5IGhhdmUgdGhlIG1vc3QgU3BpZGVycyBvblxuICAgICAqIHRoaXMgbmVzdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY29udHJvbGxpbmdQbGF5ZXI/OiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIFNwaWRlcnMgY3VycmVudGx5IGxvY2F0ZWQgb24gdGhpcyBOZXN0LlxuICAgICAqL1xuICAgIHB1YmxpYyBzcGlkZXJzITogU3BpZGVyW107XG5cbiAgICAvKipcbiAgICAgKiBXZWJzIHRoYXQgY29ubmVjdCB0byB0aGlzIE5lc3QuXG4gICAgICovXG4gICAgcHVibGljIHdlYnMhOiBXZWJbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBYIGNvb3JkaW5hdGUgb2YgdGhlIE5lc3QuIFVzZWQgZm9yIGRpc3RhbmNlIGNhbGN1bGF0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgeCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBZIGNvb3JkaW5hdGUgb2YgdGhlIE5lc3QuIFVzZWQgZm9yIGRpc3RhbmNlIGNhbGN1bGF0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgeSE6IG51bWJlcjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIE5lc3QgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SU5lc3RQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIGNvbnN0cnVjdG9yIGFyZ3MgaW4gaGVyZVxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkIG9yIHBpcmF0ZSBtZXRob2RzIGNhbiBnbyBoZXJlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=