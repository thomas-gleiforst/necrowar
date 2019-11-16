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
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Gets all the beavers alive for this player.
     *
     * @returns A new array with all the beavers owned by this player.
     */
    getAliveBeavers() {
        // Return all our beavers and filter out dead ones (health === 0)
        // concatenated with the newly spawned beavers
        // NOTE: only works when you call this on the current player
        // (as they spawn the new beavers)
        return this.beavers
            .concat(this.game.newBeavers)
            .filter((beaver) => beaver.health > 0);
    }
    /** Re-calculates this player's branchesToBuildLodge number */
    calculateBranchesToBuildLodge() {
        this.branchesToBuildLodge = Math.ceil(this.game.lodgeCostConstant ** this.lodges.length);
    }
}
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3N0dW1wZWQvcGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsK0NBQTJDO0FBRzNDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsd0JBQVU7SUE0RGxDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSDtJQUNJLDRDQUE0QztJQUM1QyxJQUFrQyxFQUNsQyxRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUM7Ozs7T0FJRztJQUNJLGVBQWU7UUFDbEIsaUVBQWlFO1FBQ2pFLDhDQUE4QztRQUM5Qyw0REFBNEQ7UUFDNUQsa0NBQWtDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLE9BQU87YUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7YUFDNUIsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCw4REFBOEQ7SUFDdkQsNkJBQTZCO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUNwRCxDQUFDO0lBQ04sQ0FBQztDQVNKO0FBckhELHdCQXFIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgSUJhc2VTdHVtcGVkUGxheWVyIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBBSSB9IGZyb20gXCIuL2FpXCI7XG5pbXBvcnQgeyBCZWF2ZXIgfSBmcm9tIFwiLi9iZWF2ZXJcIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBwbGF5ZXIgaW4gdGhpcyBnYW1lLiBFdmVyeSBBSSBjb250cm9scyBvbmUgcGxheWVyLlxuICovXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgR2FtZU9iamVjdCBpbXBsZW1lbnRzIElCYXNlU3R1bXBlZFBsYXllciB7XG4gICAgLyoqIFRoZSBBSSBjb250cm9sbGluZyB0aGlzIFBsYXllciAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhaSE6IEFJO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxpc3Qgb2YgQmVhdmVycyBvd25lZCBieSB0aGlzIFBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgYmVhdmVycyE6IEJlYXZlcltdO1xuXG4gICAgLyoqXG4gICAgICogSG93IG1hbnkgYnJhbmNoZXMgYXJlIHJlcXVpcmVkIHRvIGJ1aWxkIGEgbG9kZ2UgZm9yIHRoaXMgUGxheWVyLlxuICAgICAqL1xuICAgIHB1YmxpYyBicmFuY2hlc1RvQnVpbGRMb2RnZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFdoYXQgdHlwZSBvZiBjbGllbnQgdGhpcyBpcywgZS5nLiAnUHl0aG9uJywgJ0phdmFTY3JpcHQnLCBvciBzb21lIG90aGVyXG4gICAgICogbGFuZ3VhZ2UuIEZvciBwb3RlbnRpYWwgZGF0YSBtaW5pbmcgcHVycG9zZXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNsaWVudFR5cGUhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIGxpc3Qgb2YgVGlsZXMgdGhhdCBjb250YWluIGxvZGdlcyBvd25lZCBieSB0aGlzIHBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9kZ2VzITogVGlsZVtdO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHBsYXllciBsb3N0IHRoZSBnYW1lIG9yIG5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9zdCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgcGxheWVyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBuYW1lITogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhpcyBwbGF5ZXIncyBvcHBvbmVudCBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgb3Bwb25lbnQhOiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVhc29uIHdoeSB0aGUgcGxheWVyIGxvc3QgdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIHJlYXNvbkxvc3QhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmVhc29uIHdoeSB0aGUgcGxheWVyIHdvbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhc29uV29uITogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0aW1lIChpbiBucykgcmVtYWluaW5nIGZvciB0aGlzIEFJIHRvIHNlbmQgY29tbWFuZHMuXG4gICAgICovXG4gICAgcHVibGljIHRpbWVSZW1haW5pbmchOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcGxheWVyIHdvbiB0aGUgZ2FtZSBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIHdvbiE6IGJvb2xlYW47XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBQbGF5ZXIgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgLy8gbmV2ZXIgZGlyZWN0bHkgY3JlYXRlZCBieSBnYW1lIGRldmVsb3BlcnNcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SUJhc2VTdHVtcGVkUGxheWVyPixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFsbCB0aGUgYmVhdmVycyBhbGl2ZSBmb3IgdGhpcyBwbGF5ZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBhcnJheSB3aXRoIGFsbCB0aGUgYmVhdmVycyBvd25lZCBieSB0aGlzIHBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QWxpdmVCZWF2ZXJzKCk6IEJlYXZlcltdIHtcbiAgICAgICAgLy8gUmV0dXJuIGFsbCBvdXIgYmVhdmVycyBhbmQgZmlsdGVyIG91dCBkZWFkIG9uZXMgKGhlYWx0aCA9PT0gMClcbiAgICAgICAgLy8gY29uY2F0ZW5hdGVkIHdpdGggdGhlIG5ld2x5IHNwYXduZWQgYmVhdmVyc1xuICAgICAgICAvLyBOT1RFOiBvbmx5IHdvcmtzIHdoZW4geW91IGNhbGwgdGhpcyBvbiB0aGUgY3VycmVudCBwbGF5ZXJcbiAgICAgICAgLy8gKGFzIHRoZXkgc3Bhd24gdGhlIG5ldyBiZWF2ZXJzKVxuICAgICAgICByZXR1cm4gdGhpcy5iZWF2ZXJzXG4gICAgICAgICAgICAuY29uY2F0KHRoaXMuZ2FtZS5uZXdCZWF2ZXJzKVxuICAgICAgICAgICAgLmZpbHRlcigoYmVhdmVyKSA9PiBiZWF2ZXIuaGVhbHRoID4gMCk7XG4gICAgfVxuXG4gICAgLyoqIFJlLWNhbGN1bGF0ZXMgdGhpcyBwbGF5ZXIncyBicmFuY2hlc1RvQnVpbGRMb2RnZSBudW1iZXIgKi9cbiAgICBwdWJsaWMgY2FsY3VsYXRlQnJhbmNoZXNUb0J1aWxkTG9kZ2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnJhbmNoZXNUb0J1aWxkTG9kZ2UgPSBNYXRoLmNlaWwoXG4gICAgICAgICAgICB0aGlzLmdhbWUubG9kZ2VDb3N0Q29uc3RhbnQgKiogdGhpcy5sb2RnZXMubGVuZ3RoLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==