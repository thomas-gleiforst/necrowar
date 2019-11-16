"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * A checker on the game board.
 */
class Checker extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Checker is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.owner = args.owner;
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for isMine. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateIsMine(player) {
        // <<-- Creer-Merge: invalidate-isMine -->>
        // Check all the arguments for isMine here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-isMine -->>
    }
    /**
     * Returns if the checker is owned by your player or not.
     *
     * @param player - The player that called this.
     * @returns True if it is yours, false if it is not yours.
     */
    async isMine(player) {
        // <<-- Creer-Merge: isMine -->>
        // Add logic here for isMine.
        return (player === this.owner);
        // <<-- /Creer-Merge: isMine -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param x - The x coordinate to move to.
     * @param y - The y coordinate to move to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, x, y) {
        // <<-- Creer-Merge: invalidate-move -->>
        if (this.game.currentPlayer !== player) {
            return `${player} it is not your turn!`;
        }
        if (this.owner !== player) {
            return `${this} is not owned by you.`;
        }
        if (this.game.checkerMoved) {
            if (this.game.checkerMoved !== this) {
                return "Tried to move a check after already moving one.";
            }
            else if (!this.game.checkerMovedJumped) {
                return "Tried to move again after not jumping another checker.";
            }
        }
        const checkerAt = this.game.getCheckerAt(x, y);
        if (checkerAt) {
            return `Cannot move to (${x}, ${y}) because there is ${checkerAt} present at that location.`;
        }
        const dy = y - this.y;
        const dx = x - this.x;
        const fromString = `(${this.x}, ${this.y}) -> (${x}, ${y})`;
        if (!this.kinged) {
            // Then check if they are moving the right direction via dy when
            // not kinged.
            if ((this.owner.yDirection === 1 && dy < 1) ||
                (this.owner.yDirection === -1 && dy > -1)) {
                return `Moved ${this} in the wrong vertical direction ${fromString}`;
            }
        }
        const jumped = this.getJumped(x, y);
        if (jumped && jumped.owner === this.owner) {
            // then it's jumping something
            return `${this} tried to jump its own checker ${fromString}`;
        }
        else if (Math.abs(dx) === 1 && Math.abs(dy) === 1) {
            // then they are just moving 1 tile diagonally
            if (this.game.checkerMovedJumped) {
                return `The current checker must jump again, not move diagonally one tile ${fromString}`;
            }
            // else valid as normal move
        }
        else {
            return `Invalid move ${fromString}`;
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves the checker from its current location to the given (x, y).
     *
     * @param player - The player that called this.
     * @param x - The x coordinate to move to.
     * @param y - The y coordinate to move to.
     * @returns Returns the same checker that moved if the move was successful.
     * undefined otherwise.
     */
    async move(player, x, y) {
        // <<-- Creer-Merge: move -->>
        this.x = x;
        this.y = y;
        // check if they need to be kinged
        if (this.y === (this.owner.yDirection === 1
            ? (this.game.boardHeight - 1) : 0)) {
            this.kinged = true;
        }
        // mark us as the checker that moved
        if (!this.game.checkerMoved) {
            this.game.checkerMoved = this;
        }
        // and remove the checker we jumped (if we did), and check if we won
        const jumped = this.getJumped(x, y);
        if (jumped) {
            utils_1.removeElements(this.game.checkers, jumped);
            utils_1.removeElements(jumped.owner.checkers, jumped);
            // Tell the owner's AI that their jumped checker was captured
            await jumped.owner.ai.gotCaptured(jumped);
            this.game.checkerMovedJumped = true;
        }
        return this;
        // <<-- /Creer-Merge: move -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Gets the checker that was jumped at a given position
     * @param x - The x coordinate.
     * @param y - The y coordinate.
     * @returns A checker, if one was jumped. undefined otherwise.
     */
    getJumped(x, y) {
        const dy = y - this.y;
        const dx = x - this.x;
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
            // Then it's jumping something
            return this.game.getCheckerAt(this.x + dx / 2, this.y + dy / 2);
        }
    }
}
exports.Checker = Checker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jaGVja2Vycy9jaGVja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0NBQTJDO0FBRzNDLGlDQUFpQztBQUNqQyxtQ0FBeUM7QUFDekMsa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsd0JBQVU7SUFxQm5DLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBS0UsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7Ozs7T0FTRztJQUNPLGdCQUFnQixDQUN0QixNQUFjO1FBRWQsMkNBQTJDO1FBRTNDLHFEQUFxRDtRQUNyRCxxREFBcUQ7UUFDckQsZ0VBQWdFO1FBQ2hFLDhDQUE4QztRQUU5Qyw0Q0FBNEM7SUFDaEQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFjO1FBQ2pDLGdDQUFnQztRQUVoQyw2QkFBNkI7UUFFN0IsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0IsaUNBQWlDO0lBQ3JDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNPLGNBQWMsQ0FDcEIsTUFBYyxFQUNkLENBQVMsRUFDVCxDQUFTO1FBRVQseUNBQXlDO1FBRXpDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUss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U0FDbkU7SUFDTCxDQUFDO0NBR0o7QUE5T0QsMEJBOE9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJQ2hlY2tlcklzTWluZUFyZ3MsIElDaGVja2VyTW92ZUFyZ3MsIElDaGVja2VyUHJvcGVydGllcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyByZW1vdmVFbGVtZW50cyB9IGZyb20gXCJ+L3V0aWxzXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBjaGVja2VyIG9uIHRoZSBnYW1lIGJvYXJkLlxuICovXG5leHBvcnQgY2xhc3MgQ2hlY2tlciBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIElmIHRoZSBjaGVja2VyIGhhcyBiZWVuIGtpbmdlZCBhbmQgY2FuIG1vdmUgYmFja3dhcmRzLlxuICAgICAqL1xuICAgIHB1YmxpYyBraW5nZWQhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXllciB0aGF0IGNvbnRyb2xzIHRoaXMgQ2hlY2tlci5cbiAgICAgKi9cbiAgICBwdWJsaWMgb3duZXI6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIGNoZWNrZXIuXG4gICAgICovXG4gICAgcHVibGljIHghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSBjb29yZGluYXRlIG9mIHRoZSBjaGVja2VyLlxuICAgICAqL1xuICAgIHB1YmxpYyB5ITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgQ2hlY2tlciBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxJQ2hlY2tlclByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8qKiBUaGUgUGxheWVyIHRoYXQgb3ducyB0aGlzIENoZWNrZXIuICovXG4gICAgICAgICAgICBvd25lcjogUGxheWVyO1xuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIHRoaXMub3duZXIgPSBhcmdzLm93bmVyO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBpc01pbmUuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlSXNNaW5lKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUNoZWNrZXJJc01pbmVBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1pc01pbmUgLS0+PlxuXG4gICAgICAgIC8vIENoZWNrIGFsbCB0aGUgYXJndW1lbnRzIGZvciBpc01pbmUgaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWlzTWluZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpZiB0aGUgY2hlY2tlciBpcyBvd25lZCBieSB5b3VyIHBsYXllciBvciBub3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgaXQgaXMgeW91cnMsIGZhbHNlIGlmIGl0IGlzIG5vdCB5b3Vycy5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgaXNNaW5lKHBsYXllcjogUGxheWVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGlzTWluZSAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIGlzTWluZS5cblxuICAgICAgICByZXR1cm4gKHBsYXllciA9PT0gdGhpcy5vd25lcik7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGlzTWluZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBtb3ZlLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIHggY29vcmRpbmF0ZSB0byBtb3ZlIHRvLlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgY29vcmRpbmF0ZSB0byBtb3ZlIHRvLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZU1vdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlcixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUNoZWNrZXJNb3ZlQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtwbGF5ZXJ9IGl0IGlzIG5vdCB5b3VyIHR1cm4hYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb3duZWQgYnkgeW91LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nYW1lLmNoZWNrZXJNb3ZlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5jaGVja2VyTW92ZWQgIT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUcmllZCB0byBtb3ZlIGEgY2hlY2sgYWZ0ZXIgYWxyZWFkeSBtb3Zpbmcgb25lLlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuZ2FtZS5jaGVja2VyTW92ZWRKdW1wZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUcmllZCB0byBtb3ZlIGFnYWluIGFmdGVyIG5vdCBqdW1waW5nIGFub3RoZXIgY2hlY2tlci5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNoZWNrZXJBdCA9IHRoaXMuZ2FtZS5nZXRDaGVja2VyQXQoeCwgeSk7XG4gICAgICAgIGlmIChjaGVja2VyQXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgQ2Fubm90IG1vdmUgdG8gKCR7eH0sICR7eX0pIGJlY2F1c2UgdGhlcmUgaXMgJHtjaGVja2VyQXR9IHByZXNlbnQgYXQgdGhhdCBsb2NhdGlvbi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHkgPSB5IC0gdGhpcy55O1xuICAgICAgICBjb25zdCBkeCA9IHggLSB0aGlzLng7XG5cbiAgICAgICAgY29uc3QgZnJvbVN0cmluZyA9IGAoJHt0aGlzLnh9LCAke3RoaXMueX0pIC0+ICgke3h9LCAke3l9KWA7XG4gICAgICAgIGlmICghdGhpcy5raW5nZWQpIHtcbiAgICAgICAgICAgIC8vIFRoZW4gY2hlY2sgaWYgdGhleSBhcmUgbW92aW5nIHRoZSByaWdodCBkaXJlY3Rpb24gdmlhIGR5IHdoZW5cbiAgICAgICAgICAgIC8vIG5vdCBraW5nZWQuXG4gICAgICAgICAgICBpZiAoKHRoaXMub3duZXIueURpcmVjdGlvbiA9PT0gMSAmJiBkeSA8IDEpIHx8XG4gICAgICAgICAgICAgICAodGhpcy5vd25lci55RGlyZWN0aW9uID09PSAtMSAmJiBkeSA+IC0xKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBNb3ZlZCAke3RoaXN9IGluIHRoZSB3cm9uZyB2ZXJ0aWNhbCBkaXJlY3Rpb24gJHtmcm9tU3RyaW5nfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBqdW1wZWQgPSB0aGlzLmdldEp1bXBlZCh4LCB5KTtcbiAgICAgICAgaWYgKGp1bXBlZCAmJiBqdW1wZWQub3duZXIgPT09IHRoaXMub3duZXIpIHtcbiAgICAgICAgICAgIC8vIHRoZW4gaXQncyBqdW1waW5nIHNvbWV0aGluZ1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IHRyaWVkIHRvIGp1bXAgaXRzIG93biBjaGVja2VyICR7ZnJvbVN0cmluZ31gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKE1hdGguYWJzKGR4KSA9PT0gMSAmJiBNYXRoLmFicyhkeSkgPT09IDEpIHtcbiAgICAgICAgICAgIC8vIHRoZW4gdGhleSBhcmUganVzdCBtb3ZpbmcgMSB0aWxlIGRpYWdvbmFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLmdhbWUuY2hlY2tlck1vdmVkSnVtcGVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGBUaGUgY3VycmVudCBjaGVja2VyIG11c3QganVtcCBhZ2Fpbiwgbm90IG1vdmUgZGlhZ29uYWxseSBvbmUgdGlsZSAke2Zyb21TdHJpbmd9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2UgdmFsaWQgYXMgbm9ybWFsIG1vdmVcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgSW52YWxpZCBtb3ZlICR7ZnJvbVN0cmluZ31gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZXMgdGhlIGNoZWNrZXIgZnJvbSBpdHMgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgZ2l2ZW4gKHgsIHkpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0geCAtIFRoZSB4IGNvb3JkaW5hdGUgdG8gbW92ZSB0by5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IGNvb3JkaW5hdGUgdG8gbW92ZSB0by5cbiAgICAgKiBAcmV0dXJucyBSZXR1cm5zIHRoZSBzYW1lIGNoZWNrZXIgdGhhdCBtb3ZlZCBpZiB0aGUgbW92ZSB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgKiB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBtb3ZlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgeDogbnVtYmVyLFxuICAgICAgICB5OiBudW1iZXIsXG4gICAgKTogUHJvbWlzZTxDaGVja2VyIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuXG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgdGhleSBuZWVkIHRvIGJlIGtpbmdlZFxuICAgICAgICBpZiAodGhpcy55ID09PSAodGhpcy5vd25lci55RGlyZWN0aW9uID09PSAxXG4gICAgICAgICAgICAgICAgPyAodGhpcy5nYW1lLmJvYXJkSGVpZ2h0IC0gMSkgOiAwKSkge1xuICAgICAgICAgICAgdGhpcy5raW5nZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFyayB1cyBhcyB0aGUgY2hlY2tlciB0aGF0IG1vdmVkXG4gICAgICAgIGlmICghdGhpcy5nYW1lLmNoZWNrZXJNb3ZlZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNoZWNrZXJNb3ZlZCA9IHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhbmQgcmVtb3ZlIHRoZSBjaGVja2VyIHdlIGp1bXBlZCAoaWYgd2UgZGlkKSwgYW5kIGNoZWNrIGlmIHdlIHdvblxuICAgICAgICBjb25zdCBqdW1wZWQgPSB0aGlzLmdldEp1bXBlZCh4LCB5KTtcbiAgICAgICAgaWYgKGp1bXBlZCkge1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5nYW1lLmNoZWNrZXJzLCBqdW1wZWQpO1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHMoanVtcGVkLm93bmVyLmNoZWNrZXJzLCBqdW1wZWQpO1xuXG4gICAgICAgICAgICAvLyBUZWxsIHRoZSBvd25lcidzIEFJIHRoYXQgdGhlaXIganVtcGVkIGNoZWNrZXIgd2FzIGNhcHR1cmVkXG4gICAgICAgICAgICBhd2FpdCBqdW1wZWQub3duZXIuYWkuZ290Q2FwdHVyZWQoanVtcGVkKTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLmNoZWNrZXJNb3ZlZEp1bXBlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNoZWNrZXIgdGhhdCB3YXMganVtcGVkIGF0IGEgZ2l2ZW4gcG9zaXRpb25cbiAgICAgKiBAcGFyYW0geCAtIFRoZSB4IGNvb3JkaW5hdGUuXG4gICAgICogQHBhcmFtIHkgLSBUaGUgeSBjb29yZGluYXRlLlxuICAgICAqIEByZXR1cm5zIEEgY2hlY2tlciwgaWYgb25lIHdhcyBqdW1wZWQuIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRKdW1wZWQoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBDaGVja2VyIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgY29uc3QgZHkgPSB5IC0gdGhpcy55O1xuICAgICAgICBjb25zdCBkeCA9IHggLSB0aGlzLng7XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKGR4KSA9PT0gMiAmJiBNYXRoLmFicyhkeSkgPT09IDIpIHtcbiAgICAgICAgICAgIC8vIFRoZW4gaXQncyBqdW1waW5nIHNvbWV0aGluZ1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZS5nZXRDaGVja2VyQXQodGhpcy54ICsgZHggLyAyLCB0aGlzLnkgKyBkeSAvIDIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=