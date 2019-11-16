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
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Adds rowdiness to the player, which may cause a siesta
     *
     * @param rowdiness The amount of rowdiness to add
     */
    addRowdiness(rowdiness) {
        this.rowdiness += rowdiness;
        if (this.rowdiness >= this.game.rowdinessToSiesta) {
            this.rowdiness = 0;
            this.siesta = this.game.siestaLength;
            // siesta!
            for (const cowboy of this.cowboys) {
                if (cowboy.isDead) {
                    continue;
                }
                cowboy.turnsBusy = this.game.siestaLength;
                cowboy.isDrunk = true;
                // they don't move in a direction during a siesta
                cowboy.drunkDirection = "";
                cowboy.canMove = false;
                cowboy.focus = 0;
            }
        }
    }
}
exports.Player = Player;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NhbG9vbi9wbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSwrQ0FBMkM7QUFHM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLE1BQU8sU0FBUSx3QkFBVTtJQTZFbEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNIO0lBQ0ksNENBQTRDO0lBQzVDLElBQWlDLEVBQ2pDLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0MscURBQXFEO0lBRXJEOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsU0FBaUI7UUFDakMsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUM7UUFFNUIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUVyQyxVQUFVO1lBQ1YsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUMvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7b0JBQ2YsU0FBUztpQkFDWjtnQkFFRCxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUMxQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDdEIsaURBQWlEO2dCQUNqRCxNQUFNLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7SUFDTCxDQUFDO0NBR0o7QUE5SUQsd0JBOElDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJQmFzZVNhbG9vblBsYXllciB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgQUkgfSBmcm9tIFwiLi9haVwiO1xuaW1wb3J0IHsgQ293Ym95IH0gZnJvbSBcIi4vY293Ym95XCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFlvdW5nR3VuIH0gZnJvbSBcIi4veW91bmctZ3VuXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgcGxheWVyIGluIHRoaXMgZ2FtZS4gRXZlcnkgQUkgY29udHJvbHMgb25lIHBsYXllci5cbiAqL1xuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIEdhbWVPYmplY3QgaW1wbGVtZW50cyBJQmFzZVNhbG9vblBsYXllciB7XG4gICAgLyoqIFRoZSBBSSBjb250cm9sbGluZyB0aGlzIFBsYXllciAqL1xuICAgIHB1YmxpYyByZWFkb25seSBhaSE6IEFJO1xuXG4gICAgLyoqXG4gICAgICogV2hhdCB0eXBlIG9mIGNsaWVudCB0aGlzIGlzLCBlLmcuICdQeXRob24nLCAnSmF2YVNjcmlwdCcsIG9yIHNvbWUgb3RoZXJcbiAgICAgKiBsYW5ndWFnZS4gRm9yIHBvdGVudGlhbCBkYXRhIG1pbmluZyBwdXJwb3Nlcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2xpZW50VHlwZSE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEV2ZXJ5IENvd2JveSBvd25lZCBieSB0aGlzIFBsYXllci5cbiAgICAgKi9cbiAgICBwdWJsaWMgY293Ym95cyE6IENvd2JveVtdO1xuXG4gICAgLyoqXG4gICAgICogSG93IG1hbnkgZW5lbXkgQ293Ym95cyB0aGlzIHBsYXllcidzIHRlYW0gaGFzIGtpbGxlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMga2lsbHMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcGxheWVyIGxvc3QgdGhlIGdhbWUgb3Igbm90LlxuICAgICAqL1xuICAgIHB1YmxpYyBsb3N0ITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBwbGF5ZXIuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG5hbWUhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIHBsYXllcidzIG9wcG9uZW50IGluIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBvcHBvbmVudCE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSByZWFzb24gd2h5IHRoZSBwbGF5ZXIgbG9zdCB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhc29uTG9zdCE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSByZWFzb24gd2h5IHRoZSBwbGF5ZXIgd29uIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFzb25Xb24hOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgcm93ZHkgdGhlaXIgdGVhbSBpcy4gV2hlbiBpdCBnZXRzIHRvbyBoaWdoIHRoZWlyIHRlYW0gdGFrZXMgYVxuICAgICAqIGNvbGxlY3RpdmUgc2llc3RhLlxuICAgICAqL1xuICAgIHB1YmxpYyByb3dkaW5lc3MhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbWFueSB0aW1lcyB0aGVpciB0ZWFtIGhhcyBwbGF5ZWQgYSBwaWFuby5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2NvcmUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiAwIHdoZW4gbm90IGhhdmluZyBhIHRlYW0gc2llc3RhLiBXaGVuIGdyZWF0ZXIgdGhhbiAwIHJlcHJlc2VudHMgaG93IG1hbnlcbiAgICAgKiB0dXJucyBsZWZ0IGZvciB0aGUgdGVhbSBzaWVzdGEgdG8gY29tcGxldGUuXG4gICAgICovXG4gICAgcHVibGljIHNpZXN0YSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdGltZSAoaW4gbnMpIHJlbWFpbmluZyBmb3IgdGhpcyBBSSB0byBzZW5kIGNvbW1hbmRzLlxuICAgICAqL1xuICAgIHB1YmxpYyB0aW1lUmVtYWluaW5nITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHBsYXllciB3b24gdGhlIGdhbWUgb3Igbm90LlxuICAgICAqL1xuICAgIHB1YmxpYyB3b24hOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFlvdW5nR3VuIHRoaXMgUGxheWVyIHVzZXMgdG8gY2FsbCBpbiBuZXcgQ293Ym95cy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgeW91bmdHdW4hOiBZb3VuZ0d1bjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFBsYXllciBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAvLyBuZXZlciBkaXJlY3RseSBjcmVhdGVkIGJ5IGdhbWUgZGV2ZWxvcGVyc1xuICAgICAgICBhcmdzOiBSZWFkb25seTxJQmFzZVNhbG9vblBsYXllcj4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEFkZHMgcm93ZGluZXNzIHRvIHRoZSBwbGF5ZXIsIHdoaWNoIG1heSBjYXVzZSBhIHNpZXN0YVxuICAgICAqXG4gICAgICogQHBhcmFtIHJvd2RpbmVzcyBUaGUgYW1vdW50IG9mIHJvd2RpbmVzcyB0byBhZGRcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkUm93ZGluZXNzKHJvd2RpbmVzczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucm93ZGluZXNzICs9IHJvd2RpbmVzcztcblxuICAgICAgICBpZiAodGhpcy5yb3dkaW5lc3MgPj0gdGhpcy5nYW1lLnJvd2RpbmVzc1RvU2llc3RhKSB7XG4gICAgICAgICAgICB0aGlzLnJvd2RpbmVzcyA9IDA7XG4gICAgICAgICAgICB0aGlzLnNpZXN0YSA9IHRoaXMuZ2FtZS5zaWVzdGFMZW5ndGg7XG5cbiAgICAgICAgICAgIC8vIHNpZXN0YSFcbiAgICAgICAgICAgIGZvciAoY29uc3QgY293Ym95IG9mIHRoaXMuY293Ym95cykge1xuICAgICAgICAgICAgICAgIGlmIChjb3dib3kuaXNEZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvd2JveS50dXJuc0J1c3kgPSB0aGlzLmdhbWUuc2llc3RhTGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvd2JveS5pc0RydW5rID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyB0aGV5IGRvbid0IG1vdmUgaW4gYSBkaXJlY3Rpb24gZHVyaW5nIGEgc2llc3RhXG4gICAgICAgICAgICAgICAgY293Ym95LmRydW5rRGlyZWN0aW9uID0gXCJcIjtcbiAgICAgICAgICAgICAgICBjb3dib3kuY2FuTW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvd2JveS5mb2N1cyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==