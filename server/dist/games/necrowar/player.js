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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL25lY3Jvd2FyL3BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtDQUEyQztBQUszQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsTUFBTyxTQUFRLHdCQUFVO0lBZ0ZsQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0g7SUFDSSw0Q0FBNEM7SUFDNUMsSUFBbUMsRUFDbkMsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0NBZUo7QUF2SEQsd0JBdUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJQmFzZU5lY3Jvd2FyUGxheWVyIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBBSSB9IGZyb20gXCIuL2FpXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5pbXBvcnQgeyBUb3dlciB9IGZyb20gXCIuL3Rvd2VyXCI7XG5pbXBvcnQgeyBVbml0IH0gZnJvbSBcIi4vdW5pdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIHBsYXllciBpbiB0aGlzIGdhbWUuIEV2ZXJ5IEFJIGNvbnRyb2xzIG9uZSBwbGF5ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IGltcGxlbWVudHMgSUJhc2VOZWNyb3dhclBsYXllciB7XG4gICAgLyoqIFRoZSBBSSBjb250cm9sbGluZyB0aGlzIFBsYXllciAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhaSE6IEFJO1xuXG4gICAgLyoqXG4gICAgICogV2hhdCB0eXBlIG9mIGNsaWVudCB0aGlzIGlzLCBlLmcuICdQeXRob24nLCAnSmF2YVNjcmlwdCcsIG9yIHNvbWUgb3RoZXJcbiAgICAgKiBsYW5ndWFnZS4gRm9yIHBvdGVudGlhbCBkYXRhIG1pbmluZyBwdXJwb3Nlcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2xpZW50VHlwZSE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZ29sZCB0aGlzIFBsYXllciBoYXMuXG4gICAgICovXG4gICAgcHVibGljIGdvbGQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGhlYWx0aCByZW1haW5pbmcgZm9yIHRoaXMgcGxheWVyJ3MgbWFpbiB1bml0LlxuICAgICAqL1xuICAgIHB1YmxpYyBoZWFsdGghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdGlsZSB0aGF0IHRoZSBob21lIGJhc2UgaXMgbG9jYXRlZCBvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgaG9tZUJhc2UhOiBUaWxlW107XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcGxheWVyIGxvc3QgdGhlIGdhbWUgb3Igbm90LlxuICAgICAqL1xuICAgIHB1YmxpYyBsb3N0ITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgbWFuYSB0aGlzIHBsYXllciBoYXMuXG4gICAgICovXG4gICAgcHVibGljIG1hbmEhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcGxheWVyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBuYW1lITogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBwbGF5ZXIncyBvcHBvbmVudCBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgb3Bwb25lbnQhOiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVhc29uIHdoeSB0aGUgcGxheWVyIGxvc3QgdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIHJlYXNvbkxvc3QhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVhc29uIHdoeSB0aGUgcGxheWVyIHdvbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhc29uV29uITogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogQWxsIHRpbGVzIHRoYXQgdGhpcyBwbGF5ZXIgY2FuIGJ1aWxkIG9uIGFuZCBtb3ZlIHdvcmtlcnMgb24uXG4gICAgICovXG4gICAgcHVibGljIHNpZGUhOiBUaWxlW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgKGluIG5zKSByZW1haW5pbmcgZm9yIHRoaXMgQUkgdG8gc2VuZCBjb21tYW5kcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgdGltZVJlbWFpbmluZyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEV2ZXJ5IFRvd2VyIG93bmVkIGJ5IHRoaXMgcGxheWVyLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b3dlcnMhOiBUb3dlcltdO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgVW5pdCBvd25lZCBieSB0aGlzIFBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5pdHMhOiBVbml0W107XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcGxheWVyIHdvbiB0aGUgZ2FtZSBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIHdvbiE6IGJvb2xlYW47XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBQbGF5ZXIgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgLy8gbmV2ZXIgZGlyZWN0bHkgY3JlYXRlZCBieSBnYW1lIGRldmVsb3BlcnNcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SUJhc2VOZWNyb3dhclBsYXllcj4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19