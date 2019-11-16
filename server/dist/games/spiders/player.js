"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A player in this game. Every AI controls one player.
 */
class Player extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Player is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
    // never directly created by game developers
    args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
}
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvcGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsK0NBQTJDO0FBRzNDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsd0JBQVU7SUFpRWxDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSDtJQUNJLDRDQUE0QztJQUM1QyxJQUFrQyxFQUNsQyxRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7Q0FlSjtBQXhHRCx3QkF3R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElCYXNlU3BpZGVyc1BsYXllciB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgQUkgfSBmcm9tIFwiLi9haVwiO1xuaW1wb3J0IHsgQnJvb2RNb3RoZXIgfSBmcm9tIFwiLi9icm9vZC1tb3RoZXJcIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgU3BpZGVyIH0gZnJvbSBcIi4vc3BpZGVyXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgcGxheWVyIGluIHRoaXMgZ2FtZS4gRXZlcnkgQUkgY29udHJvbHMgb25lIHBsYXllci5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIEdhbWVPYmplY3QgaW1wbGVtZW50cyBJQmFzZVNwaWRlcnNQbGF5ZXIge1xuICAgIC8qKiBUaGUgQUkgY29udHJvbGxpbmcgdGhpcyBQbGF5ZXIgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYWkhOiBBSTtcblxuICAgIC8qKlxuICAgICAqIFRoaXMgcGxheWVyJ3MgQnJvb2RNb3RoZXIuIElmIGl0IGRpZXMgdGhleSBsb3NlIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBicm9vZE1vdGhlciE6IEJyb29kTW90aGVyO1xuXG4gICAgLyoqXG4gICAgICogV2hhdCB0eXBlIG9mIGNsaWVudCB0aGlzIGlzLCBlLmcuICdQeXRob24nLCAnSmF2YVNjcmlwdCcsIG9yIHNvbWUgb3RoZXJcbiAgICAgKiBsYW5ndWFnZS4gRm9yIHBvdGVudGlhbCBkYXRhIG1pbmluZyBwdXJwb3Nlcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2xpZW50VHlwZSE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBwbGF5ZXIgbG9zdCB0aGUgZ2FtZSBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIGxvc3QhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1heCBudW1iZXIgb2YgU3BpZGVybGluZ3MgcGxheWVycyBjYW4gc3Bhd24uXG4gICAgICovXG4gICAgcHVibGljIG1heFNwaWRlcmxpbmdzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIHBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgbmVzdHMgdGhpcyBwbGF5ZXIgY29udHJvbHMuXG4gICAgICovXG4gICAgcHVibGljIG51bWJlck9mTmVzdHNDb250cm9sbGVkITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBwbGF5ZXIncyBvcHBvbmVudCBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgb3Bwb25lbnQhOiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVhc29uIHdoeSB0aGUgcGxheWVyIGxvc3QgdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIHJlYXNvbkxvc3QhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVhc29uIHdoeSB0aGUgcGxheWVyIHdvbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhc29uV29uITogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBTcGlkZXJzIG93bmVkIGJ5IHRoaXMgcGxheWVyLlxuICAgICAqL1xuICAgIHB1YmxpYyBzcGlkZXJzITogU3BpZGVyW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgKGluIG5zKSByZW1haW5pbmcgZm9yIHRoaXMgQUkgdG8gc2VuZCBjb21tYW5kcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgdGltZVJlbWFpbmluZyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBwbGF5ZXIgd29uIHRoZSBnYW1lIG9yIG5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgd29uITogYm9vbGVhbjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFBsYXllciBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAvLyBuZXZlciBkaXJlY3RseSBjcmVhdGVkIGJ5IGdhbWUgZGV2ZWxvcGVyc1xuICAgICAgICBhcmdzOiBSZWFkb25seTxJQmFzZVNwaWRlcnNQbGF5ZXI+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==