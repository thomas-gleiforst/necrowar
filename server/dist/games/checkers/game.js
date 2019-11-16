"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The simple version of American Checkers. An 8x8 board with 12 checkers on
 * each side that must move diagonally to the opposing side until kinged.
 */
class CheckersGame extends _1.BaseClasses.Game {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Game is created.
     *
     * @param settingsManager - The manager that holds initial settings.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(settingsManager, required) {
        super(settingsManager, required);
        this.settingsManager = settingsManager;
        /** The settings used to initialize the game, as set by players */
        this.settings = Object.freeze(this.settingsManager.values);
        // <<-- Creer-Merge: constructor -->>
        // they are on top, and move down the board until kinged
        this.players[0].yDirection = 1;
        // they are on bottom, and move up the board until king
        this.players[1].yDirection = -1;
        // Initialize the Checkers
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if ((x + y) % 2 === 1) {
                    let owner;
                    if (y < 3) { // then it is player 0's checker
                        owner = this.players[0];
                    }
                    else if (y > 4) { // then it is player 1's checker
                        owner = this.players[1];
                    } // else is the middle, which has no initial checker pieces
                    if (owner) {
                        const checker = this.manager.create.checker({
                            owner,
                            x,
                            y,
                            kinged: false,
                        });
                        this.checkers.push(checker);
                        owner.checkers.push(checker);
                    }
                }
            }
        }
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Gets a Checker (if it exists) at a given (x, y).
     *
     * @param x - The x co-ordinate of the checker.
     * @param y - The y co-ordinate of the checker.
     * @returns A Checker if found, undefined otherwise.
     */
    getCheckerAt(x, y) {
        return this.checkers.find((c) => c.x === x && c.y === y);
    }
}
exports.CheckersGame = CheckersGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jaGVja2Vycy9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUJBQWlDO0FBT2pDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOzs7R0FHRztBQUNILE1BQWEsWUFBYSxTQUFRLGNBQVcsQ0FBQyxJQUFJO0lBd0U5QyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDYyxlQUE0QyxFQUN0RCxRQUF5QztRQUV6QyxLQUFLLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBSHZCLG9CQUFlLEdBQWYsZUFBZSxDQUE2QjtRQW5GMUQsa0VBQWtFO1FBQ2xELGFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUF1RmxFLHFDQUFxQztRQUVyQyx3REFBd0Q7UUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVoQywwQkFBMEI7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDbkIsSUFBSSxLQUF5QixDQUFDO29CQUU5QixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxnQ0FBZ0M7d0JBQ3pDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzQjt5QkFDSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxnQ0FBZ0M7d0JBQzlDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMzQixDQUFDLDBEQUEwRDtvQkFFNUQsSUFBSSxLQUFLLEVBQUU7d0JBQ1AsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDOzRCQUN4QyxLQUFLOzRCQUNMLENBQUM7NEJBQ0QsQ0FBQzs0QkFDRCxNQUFNLEVBQUUsS0FBSzt5QkFDaEIsQ0FBQyxDQUFDO3dCQUVILElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUM1QixLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDaEM7aUJBQ0o7YUFFSjtTQUNKO1FBRUQsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUM7Ozs7OztPQU1HO0lBQ0ksWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQVNKO0FBeEpELG9DQXdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZVJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IENoZWNrZXIgfSBmcm9tIFwiLi9jaGVja2VyXCI7XG5pbXBvcnQgeyBDaGVja2Vyc0dhbWVNYW5hZ2VyIH0gZnJvbSBcIi4vZ2FtZS1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IENoZWNrZXJzR2FtZVNldHRpbmdzTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgc2ltcGxlIHZlcnNpb24gb2YgQW1lcmljYW4gQ2hlY2tlcnMuIEFuIDh4OCBib2FyZCB3aXRoIDEyIGNoZWNrZXJzIG9uXG4gKiBlYWNoIHNpZGUgdGhhdCBtdXN0IG1vdmUgZGlhZ29uYWxseSB0byB0aGUgb3Bwb3Npbmcgc2lkZSB1bnRpbCBraW5nZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGVja2Vyc0dhbWUgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lIHtcbiAgICAvKiogVGhlIG1hbmFnZXIgb2YgdGhpcyBnYW1lLCB0aGF0IGNvbnRyb2xzIGV2ZXJ5dGhpbmcgYXJvdW5kIGl0ICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hbmFnZXIhOiBDaGVja2Vyc0dhbWVNYW5hZ2VyO1xuXG4gICAgLyoqIFRoZSBzZXR0aW5ncyB1c2VkIHRvIGluaXRpYWxpemUgdGhlIGdhbWUsIGFzIHNldCBieSBwbGF5ZXJzICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNldHRpbmdzID0gT2JqZWN0LmZyZWV6ZSh0aGlzLnNldHRpbmdzTWFuYWdlci52YWx1ZXMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBvZiB0aGUgYm9hcmQgZm9yIHRoZSBZIGNvbXBvbmVudCBvZiBhIGNoZWNrZXIuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGJvYXJkSGVpZ2h0ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHdpZHRoIG9mIHRoZSBib2FyZCBmb3IgWCBjb21wb25lbnQgb2YgYSBjaGVja2VyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBib2FyZFdpZHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNoZWNrZXIgdGhhdCBsYXN0IG1vdmVkIGFuZCBtdXN0IGJlIG1vdmVkIGJlY2F1c2Ugb25seSBvbmUgY2hlY2tlclxuICAgICAqIGNhbiBtb3ZlIGR1cmluZyBlYWNoIHBsYXllcnMgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2hlY2tlck1vdmVkPzogQ2hlY2tlcjtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBsYXN0IGNoZWNrZXIgdGhhdCBtb3ZlZCBqdW1wZWQsIG1lYW5pbmcgaXQgY2FuIG1vdmUgYWdhaW4uXG4gICAgICovXG4gICAgcHVibGljIGNoZWNrZXJNb3ZlZEp1bXBlZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGNoZWNrZXJzIGN1cnJlbnRseSBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2hlY2tlcnMhOiBDaGVja2VyW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIHdob3NlIHR1cm4gaXQgaXMgY3VycmVudGx5LiBUaGF0IHBsYXllciBjYW4gc2VuZCBjb21tYW5kcy5cbiAgICAgKiBPdGhlciBwbGF5ZXJzIGNhbm5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFBsYXllciE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHR1cm4gbnVtYmVyLCBzdGFydGluZyBhdCAwIGZvciB0aGUgZmlyc3QgcGxheWVyJ3MgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFR1cm4hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcHBpbmcgb2YgZXZlcnkgZ2FtZSBvYmplY3QncyBJRCB0byB0aGUgYWN0dWFsIGdhbWUgb2JqZWN0LiBQcmltYXJpbHlcbiAgICAgKiB1c2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNsaWVudCB0byBlYXNpbHkgcmVmZXIgdG8gdGhlIGdhbWUgb2JqZWN0cyB2aWFcbiAgICAgKiBJRC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZU9iamVjdHMhOiB7W2lkOiBzdHJpbmddOiBHYW1lT2JqZWN0fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiB0dXJucyBiZWZvcmUgdGhlIGdhbWUgd2lsbCBhdXRvbWF0aWNhbGx5IGVuZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWF4VHVybnMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcGxheWVycyE6IFBsYXllcltdO1xuXG4gICAgLyoqXG4gICAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGdhbWUgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBwbGF5ZWQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNlc3Npb24hOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgKGluIG5hbm8tc2Vjb25kcykgYWRkZWQgYWZ0ZXIgZWFjaCBwbGF5ZXIgcGVyZm9ybXMgYVxuICAgICAqIHR1cm4uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbWVBZGRlZFBlclR1cm4hOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBHYW1lIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2V0dGluZ3NNYW5hZ2VyIC0gVGhlIG1hbmFnZXIgdGhhdCBob2xkcyBpbml0aWFsIHNldHRpbmdzLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc2V0dGluZ3NNYW5hZ2VyOiBDaGVja2Vyc0dhbWVTZXR0aW5nc01hbmFnZXIsXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihzZXR0aW5nc01hbmFnZXIsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG5cbiAgICAgICAgLy8gdGhleSBhcmUgb24gdG9wLCBhbmQgbW92ZSBkb3duIHRoZSBib2FyZCB1bnRpbCBraW5nZWRcbiAgICAgICAgdGhpcy5wbGF5ZXJzWzBdLnlEaXJlY3Rpb24gPSAxO1xuXG4gICAgICAgIC8vIHRoZXkgYXJlIG9uIGJvdHRvbSwgYW5kIG1vdmUgdXAgdGhlIGJvYXJkIHVudGlsIGtpbmdcbiAgICAgICAgdGhpcy5wbGF5ZXJzWzFdLnlEaXJlY3Rpb24gPSAtMTtcblxuICAgICAgICAvLyBJbml0aWFsaXplIHRoZSBDaGVja2Vyc1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuYm9hcmRIZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmJvYXJkV2lkdGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmICgoeCArIHkpICUgMiA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgb3duZXI6IFBsYXllciB8IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoeSA8IDMpIHsgLy8gdGhlbiBpdCBpcyBwbGF5ZXIgMCdzIGNoZWNrZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyID0gdGhpcy5wbGF5ZXJzWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHkgPiA0KSB7IC8vIHRoZW4gaXQgaXMgcGxheWVyIDEncyBjaGVja2VyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lciA9IHRoaXMucGxheWVyc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgfSAvLyBlbHNlIGlzIHRoZSBtaWRkbGUsIHdoaWNoIGhhcyBubyBpbml0aWFsIGNoZWNrZXIgcGllY2VzXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGVja2VyID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS5jaGVja2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAga2luZ2VkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrZXJzLnB1c2goY2hlY2tlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lci5jaGVja2Vycy5wdXNoKGNoZWNrZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIENoZWNrZXIgKGlmIGl0IGV4aXN0cykgYXQgYSBnaXZlbiAoeCwgeSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geCAtIFRoZSB4IGNvLW9yZGluYXRlIG9mIHRoZSBjaGVja2VyLlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgY28tb3JkaW5hdGUgb2YgdGhlIGNoZWNrZXIuXG4gICAgICogQHJldHVybnMgQSBDaGVja2VyIGlmIGZvdW5kLCB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDaGVja2VyQXQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBDaGVja2VyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tlcnMuZmluZCgoYykgPT4gYy54ID09PSB4ICYmIGMueSA9PT0geSk7XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19