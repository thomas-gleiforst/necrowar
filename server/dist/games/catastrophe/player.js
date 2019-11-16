"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- /Creer-Merge: imports -->>
/**
 * A player in this game. Every AI controls one player.
 */
class Player extends game_object_1.GameObject {
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
        // <<-- Creer-Merge: attributes -->>
        /** The units owned by this player that were defeated this turn. */
        this.defeatedUnits = [];
        /** The units owned by this player that were created this turn. */
        this.newUnits = [];
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Gets every structure owned by this player, including new structures
     *
     * @returns All of this player's structures
     */
    getAllStructures() {
        return this.structures.concat(this.game.newStructures.filter((s) => s.owner === this));
    }
    /**
     * Recalculates all squads for this player's units.
     * Unowned units just have squads with only themselves in it.
     */
    calculateSquads() {
        for (const unit of this.units) {
            // Reset squad
            unit.squad = [];
            // Flood fill to calculate squads
            const open = [unit.tile];
            const closed = new Set();
            while (open.length > 0) {
                // Grab a tile from the open list
                const tile = open.shift(); // must exist from above check
                const cur = tile.unit;
                // If the tile grabbed is null/undefined, there's no valid unit there, or we already checked this tile
                if (!cur ||
                    cur.owner !== this ||
                    (unit.squad.length > 0 && cur.job.title !== "soldier") ||
                    closed.has(tile)) {
                    // Skip this tile (and don't spread out from it)
                    continue;
                }
                // Add this unit to the squad
                unit.squad.push(cur);
                // Make sure we never check this tile again
                closed.add(tile);
                // Add the surrounding tiles to the open list to check
                open.push(...tile.getNeighbors());
            }
        }
    }
}
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2NhdGFzdHJvcGhlL3BsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtDQUEyQztBQU0zQyxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLE1BQU8sU0FBUSx3QkFBVTtJQWdGbEMscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0g7SUFDSSw0Q0FBNEM7SUFDNUMsSUFBc0MsRUFDdEMsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQXJCMUIsb0NBQW9DO1FBRXBDLG1FQUFtRTtRQUNuRCxrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUUzQyxrRUFBa0U7UUFDbEQsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQWlCbEMscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQzs7OztPQUlHO0lBQ0ksZ0JBQWdCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGVBQWU7UUFDbEIsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQzNCLGNBQWM7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUVoQixpQ0FBaUM7WUFDakMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQVEsQ0FBQztZQUMvQixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNwQixpQ0FBaUM7Z0JBQ2pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQVUsQ0FBQyxDQUFDLDhCQUE4QjtnQkFDakUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFFdEIsc0dBQXNHO2dCQUN0RyxJQUFJLENBQUMsR0FBRztvQkFDSixHQUFHLENBQUMsS0FBSyxLQUFLLElBQUk7b0JBQ2xCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztvQkFDdEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDbEI7b0JBQ0UsZ0RBQWdEO29CQUNoRCxTQUFTO2lCQUNaO2dCQUVELDZCQUE2QjtnQkFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRXJCLDJDQUEyQztnQkFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFakIsc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7YUFDckM7U0FDSjtJQUNMLENBQUM7Q0FTSjtBQTdKRCx3QkE2SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElCYXNlQ2F0YXN0cm9waGVQbGF5ZXIgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEFJIH0gZnJvbSBcIi4vYWlcIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgU3RydWN0dXJlIH0gZnJvbSBcIi4vc3RydWN0dXJlXCI7XG5pbXBvcnQgeyBVbml0IH0gZnJvbSBcIi4vdW5pdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBwbGF5ZXIgaW4gdGhpcyBnYW1lLiBFdmVyeSBBSSBjb250cm9scyBvbmUgcGxheWVyLlxuICovXG5leHBvcnQgY2xhc3MgUGxheWVyIGV4dGVuZHMgR2FtZU9iamVjdCBpbXBsZW1lbnRzIElCYXNlQ2F0YXN0cm9waGVQbGF5ZXIge1xuICAgIC8qKiBUaGUgQUkgY29udHJvbGxpbmcgdGhpcyBQbGF5ZXIgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYWkhOiBBSTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvdmVybG9yZCBjYXQgVW5pdCBvd25lZCBieSB0aGlzIFBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2F0ITogVW5pdDtcblxuICAgIC8qKlxuICAgICAqIFdoYXQgdHlwZSBvZiBjbGllbnQgdGhpcyBpcywgZS5nLiAnUHl0aG9uJywgJ0phdmFTY3JpcHQnLCBvciBzb21lIG90aGVyXG4gICAgICogbGFuZ3VhZ2UuIEZvciBwb3RlbnRpYWwgZGF0YSBtaW5pbmcgcHVycG9zZXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNsaWVudFR5cGUhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGZvb2Qgb3duZWQgYnkgdGhpcyBwbGF5ZXIuXG4gICAgICovXG4gICAgcHVibGljIGZvb2QhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcGxheWVyIGxvc3QgdGhlIGdhbWUgb3Igbm90LlxuICAgICAqL1xuICAgIHB1YmxpYyBsb3N0ITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwbGF5ZXIuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIHBsYXllcidzIG9wcG9uZW50IGluIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBvcHBvbmVudCE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSByZWFzb24gd2h5IHRoZSBwbGF5ZXIgbG9zdCB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhc29uTG9zdCE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSByZWFzb24gd2h5IHRoZSBwbGF5ZXIgd29uIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFzb25Xb24hOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBFdmVyeSBTdHJ1Y3R1cmUgb3duZWQgYnkgdGhpcyBQbGF5ZXIuXG4gICAgICovXG4gICAgcHVibGljIHN0cnVjdHVyZXMhOiBTdHJ1Y3R1cmVbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdGltZSAoaW4gbnMpIHJlbWFpbmluZyBmb3IgdGhpcyBBSSB0byBzZW5kIGNvbW1hbmRzLlxuICAgICAqL1xuICAgIHB1YmxpYyB0aW1lUmVtYWluaW5nITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgVW5pdCBvd25lZCBieSB0aGlzIFBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5pdHMhOiBVbml0W107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdG90YWwgdXBrZWVwIG9mIGV2ZXJ5IFVuaXQgb3duZWQgYnkgdGhpcyBQbGF5ZXIuIElmIHRoZXJlIGlzbid0XG4gICAgICogZW5vdWdoIGZvb2QgZm9yIGV2ZXJ5IFVuaXQsIGFsbCBVbml0cyBiZWNvbWUgc3RhcnZlZCBhbmQgZG8gbm90IGNvbnN1bWVcbiAgICAgKiBmb29kLlxuICAgICAqL1xuICAgIHB1YmxpYyB1cGtlZXAhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcGxheWVyIHdvbiB0aGUgZ2FtZSBvciBub3QuXG4gICAgICovXG4gICAgcHVibGljIHdvbiE6IGJvb2xlYW47XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKiBUaGUgdW5pdHMgb3duZWQgYnkgdGhpcyBwbGF5ZXIgdGhhdCB3ZXJlIGRlZmVhdGVkIHRoaXMgdHVybi4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVmZWF0ZWRVbml0czogVW5pdFtdID0gW107XG5cbiAgICAvKiogVGhlIHVuaXRzIG93bmVkIGJ5IHRoaXMgcGxheWVyIHRoYXQgd2VyZSBjcmVhdGVkIHRoaXMgdHVybi4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbmV3VW5pdHM6IFVuaXRbXSA9IFtdO1xuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBQbGF5ZXIgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgLy8gbmV2ZXIgZGlyZWN0bHkgY3JlYXRlZCBieSBnYW1lIGRldmVsb3BlcnNcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SUJhc2VDYXRhc3Ryb3BoZVBsYXllcj4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyBldmVyeSBzdHJ1Y3R1cmUgb3duZWQgYnkgdGhpcyBwbGF5ZXIsIGluY2x1ZGluZyBuZXcgc3RydWN0dXJlc1xuICAgICAqXG4gICAgICogQHJldHVybnMgQWxsIG9mIHRoaXMgcGxheWVyJ3Mgc3RydWN0dXJlc1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBbGxTdHJ1Y3R1cmVzKCk6IFN0cnVjdHVyZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RydWN0dXJlcy5jb25jYXQodGhpcy5nYW1lLm5ld1N0cnVjdHVyZXMuZmlsdGVyKChzKSA9PiBzLm93bmVyID09PSB0aGlzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVjYWxjdWxhdGVzIGFsbCBzcXVhZHMgZm9yIHRoaXMgcGxheWVyJ3MgdW5pdHMuXG4gICAgICogVW5vd25lZCB1bml0cyBqdXN0IGhhdmUgc3F1YWRzIHdpdGggb25seSB0aGVtc2VsdmVzIGluIGl0LlxuICAgICAqL1xuICAgIHB1YmxpYyBjYWxjdWxhdGVTcXVhZHMoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiB0aGlzLnVuaXRzKSB7XG4gICAgICAgICAgICAvLyBSZXNldCBzcXVhZFxuICAgICAgICAgICAgdW5pdC5zcXVhZCA9IFtdO1xuXG4gICAgICAgICAgICAvLyBGbG9vZCBmaWxsIHRvIGNhbGN1bGF0ZSBzcXVhZHNcbiAgICAgICAgICAgIGNvbnN0IG9wZW4gPSBbdW5pdC50aWxlXTtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlZCA9IG5ldyBTZXQ8VGlsZT4oKTtcbiAgICAgICAgICAgIHdoaWxlIChvcGVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBHcmFiIGEgdGlsZSBmcm9tIHRoZSBvcGVuIGxpc3RcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gb3Blbi5zaGlmdCgpIGFzIFRpbGU7IC8vIG11c3QgZXhpc3QgZnJvbSBhYm92ZSBjaGVja1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1ciA9IHRpbGUudW5pdDtcblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSB0aWxlIGdyYWJiZWQgaXMgbnVsbC91bmRlZmluZWQsIHRoZXJlJ3Mgbm8gdmFsaWQgdW5pdCB0aGVyZSwgb3Igd2UgYWxyZWFkeSBjaGVja2VkIHRoaXMgdGlsZVxuICAgICAgICAgICAgICAgIGlmICghY3VyIHx8XG4gICAgICAgICAgICAgICAgICAgIGN1ci5vd25lciAhPT0gdGhpcyB8fFxuICAgICAgICAgICAgICAgICAgICAodW5pdC5zcXVhZC5sZW5ndGggPiAwICYmIGN1ci5qb2IudGl0bGUgIT09IFwic29sZGllclwiKSB8fFxuICAgICAgICAgICAgICAgICAgICBjbG9zZWQuaGFzKHRpbGUpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFNraXAgdGhpcyB0aWxlIChhbmQgZG9uJ3Qgc3ByZWFkIG91dCBmcm9tIGl0KVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhpcyB1bml0IHRvIHRoZSBzcXVhZFxuICAgICAgICAgICAgICAgIHVuaXQuc3F1YWQucHVzaChjdXIpO1xuXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIG5ldmVyIGNoZWNrIHRoaXMgdGlsZSBhZ2FpblxuICAgICAgICAgICAgICAgIGNsb3NlZC5hZGQodGlsZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIHN1cnJvdW5kaW5nIHRpbGVzIHRvIHRoZSBvcGVuIGxpc3QgdG8gY2hlY2tcbiAgICAgICAgICAgICAgICBvcGVuLnB1c2goLi4udGlsZS5nZXROZWlnaGJvcnMoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkIG9yIHBpcmF0ZSBtZXRob2RzIGNhbiBnbyBoZXJlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=