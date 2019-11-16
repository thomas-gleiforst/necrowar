"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Checkers Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class CheckersGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-Test-Checkers",
        ];
    }
    // <<-- Creer-Merge: public-methods -->>
    // any additional public methods you need can be added here
    // <<-- /Creer-Merge: public-methods -->>
    /**
     * This is called BEFORE each player's runTun function is called
     * (including the first turn).
     * This is a good place to get their player ready for their turn.
     */
    async beforeTurn() {
        await super.beforeTurn();
        // <<-- Creer-Merge: before-turn -->>
        // add logic here for before the current player's turn starts
        // <<-- /Creer-Merge: before-turn -->>
    }
    /**
     * This is called AFTER each player's turn ends. Before the turn counter
     * increases.
     * This is a good place to end-of-turn effects, and clean up arrays.
     */
    async afterTurn() {
        await super.afterTurn();
        // <<-- Creer-Merge: after-turn -->>
        // add logic here after the current player's turn starts
        // <<-- /Creer-Merge: after-turn -->>
    }
    /**
     * Checks if the game is over in between turns.
     * This is invoked AFTER afterTurn() is called, but BEFORE beforeTurn()
     * is called.
     *
     * @returns True if the game is indeed over, otherwise if the game
     * should continue return false.
     */
    primaryWinConditionsCheck() {
        super.primaryWinConditionsCheck();
        // <<-- Creer-Merge: primary-win-conditions -->>
        // We need to check if the owner won because they just jumped all
        // the other checkers
        let winner;
        for (const player of this.game.players) {
            if (player.checkers.length === 0) {
                winner = player.opponent;
                break;
            }
        }
        if (winner) {
            this.declareLoser("No checkers remaining", winner.opponent);
            this.declareWinner("All enemy checkers jumped!", winner);
            return true;
        }
        // <<-- /Creer-Merge: primary-win-conditions -->>
        return false; // If we get here no one won on this turn.
    }
    /**
     * Called when the game needs to end, but primary game ending conditions
     * are not met (like max turns reached). Use this to check for secondary
     * game win conditions to crown a winner.
     * @param reason The reason why a secondary victory condition is happening
     */
    secondaryWinConditions(reason) {
        // <<-- Creer-Merge: secondary-win-conditions -->>
        // Add logic here checking for the secondary win conditions
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
}
exports.CheckersGameManager = CheckersGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2NoZWNrZXJzL2dhbWUtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZFQUE2RTtBQUM3RSxhQUFhO0FBQ2IseUJBQTBFO0FBSTFFLGtDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsY0FBVyxDQUFDLFdBQVc7SUFDNUQsaUVBQWlFO0lBQzFELE1BQU0sS0FBSyxPQUFPO1FBQ3JCLE9BQU87WUFDSCxpQ0FBaUM7WUFDakMsMkJBQTJCO1NBRTlCLENBQUM7SUFDTixDQUFDO0lBUUQsd0NBQXdDO0lBRXhDLDJEQUEyRDtJQUUzRCx5Q0FBeUM7SUFFekM7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxVQUFVO1FBQ3RCLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXpCLHFDQUFxQztRQUNyQyw2REFBNkQ7UUFDN0Qsc0NBQXNDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFNBQVM7UUFDckIsTUFBTSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFeEIsb0NBQW9DO1FBQ3BDLHdEQUF3RDtRQUN4RCxxQ0FBcUM7SUFDekMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyx5QkFBeUI7UUFDL0IsS0FBSyxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFFbEMsZ0RBQWdEO1FBQ2hELGlFQUFpRTtRQUNqRSxxQkFBcUI7UUFDckIsSUFBSSxNQUEwQixDQUFDO1FBQy9CLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO2dCQUN6QixNQUFNO2FBQ1Q7U0FDSjtRQUVELElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUV6RCxPQUFPLElBQUksQ0FBQztTQUNmO1FBQ0QsaURBQWlEO1FBRWpELE9BQU8sS0FBSyxDQUFDLENBQUMsMENBQTBDO0lBQzVELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLHNCQUFzQixDQUFDLE1BQWM7UUFDM0Msa0RBQWtEO1FBQ2xELDJEQUEyRDtRQUMzRCxtREFBbUQ7UUFFbkQsMEJBQTBCO1FBQzFCLHNFQUFzRTtRQUN0RSxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQU9KO0FBdEdELGtEQXNHQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBpcyB3aGVyZSB5b3Ugc2hvdWxkIHB1dCBsb2dpYyB0byBjb250cm9sIHRoZSBnYW1lIGFuZCBldmVyeXRoaW5nXG4vLyBhcm91bmQgaXQuXG5pbXBvcnQgeyBCYXNlQ2xhc3NlcywgQ2hlY2tlcnNHYW1lLCBDaGVja2Vyc0dhbWVPYmplY3RGYWN0b3J5IH0gZnJvbSBcIi4vXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgZ2FtZSBsb2dpYyBhcm91bmQgdGhlIENoZWNrZXJzIEdhbWUuXG4gKiBUaGlzIGlzIHdoZXJlIHlvdSBjb3VsZCBkbyBsb2dpYyBmb3IgY2hlY2tpbmcgaWYgdGhlIGdhbWUgaXMgb3ZlciwgdXBkYXRlXG4gKiB0aGUgZ2FtZSBiZXR3ZWVuIHR1cm5zLCBhbmQgYW55dGhpbmcgdGhhdCB0aWVzIGFsbCB0aGUgXCJzdHVmZlwiIGluIHRoZSBnYW1lXG4gKiB0b2dldGhlci5cbiAqL1xuZXhwb3J0IGNsYXNzIENoZWNrZXJzR2FtZU1hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lTWFuYWdlciB7XG4gICAgLyoqIE90aGVyIHN0cmluZ3MgKGNhc2UgaW5zZW5zaXRpdmUpIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gSUQgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICAgICAgXCJNZWdhTWluZXJBSS1UZXN0LUNoZWNrZXJzXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IENoZWNrZXJzR2FtZTtcblxuICAgIC8qKiBUaGUgZmFjdG9yeSB0aGF0IG11c3QgYmUgdXNlZCB0byBpbml0aWFsaXplIG5ldyBnYW1lIG9iamVjdHMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRlITogQ2hlY2tlcnNHYW1lT2JqZWN0RmFjdG9yeTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8vIGFueSBhZGRpdGlvbmFsIHB1YmxpYyBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQkVGT1JFIGVhY2ggcGxheWVyJ3MgcnVuVHVuIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgICAqIChpbmNsdWRpbmcgdGhlIGZpcnN0IHR1cm4pLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGdldCB0aGVpciBwbGF5ZXIgcmVhZHkgZm9yIHRoZWlyIHR1cm4uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGJlZm9yZVR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmJlZm9yZVR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG4gICAgICAgIC8vIGFkZCBsb2dpYyBoZXJlIGZvciBiZWZvcmUgdGhlIGN1cnJlbnQgcGxheWVyJ3MgdHVybiBzdGFydHNcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGJlZm9yZS10dXJuIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBBRlRFUiBlYWNoIHBsYXllcidzIHR1cm4gZW5kcy4gQmVmb3JlIHRoZSB0dXJuIGNvdW50ZXJcbiAgICAgKiBpbmNyZWFzZXMuXG4gICAgICogVGhpcyBpcyBhIGdvb2QgcGxhY2UgdG8gZW5kLW9mLXR1cm4gZWZmZWN0cywgYW5kIGNsZWFuIHVwIGFycmF5cy5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYWZ0ZXJUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5hZnRlclR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhZnRlci10dXJuIC0tPj5cbiAgICAgICAgLy8gYWRkIGxvZ2ljIGhlcmUgYWZ0ZXIgdGhlIGN1cnJlbnQgcGxheWVyJ3MgdHVybiBzdGFydHNcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFmdGVyLXR1cm4gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZ2FtZSBpcyBvdmVyIGluIGJldHdlZW4gdHVybnMuXG4gICAgICogVGhpcyBpcyBpbnZva2VkIEFGVEVSIGFmdGVyVHVybigpIGlzIGNhbGxlZCwgYnV0IEJFRk9SRSBiZWZvcmVUdXJuKClcbiAgICAgKiBpcyBjYWxsZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBnYW1lIGlzIGluZGVlZCBvdmVyLCBvdGhlcndpc2UgaWYgdGhlIGdhbWVcbiAgICAgKiBzaG91bGQgY29udGludWUgcmV0dXJuIGZhbHNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBwcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICBzdXBlci5wcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gY2hlY2sgaWYgdGhlIG93bmVyIHdvbiBiZWNhdXNlIHRoZXkganVzdCBqdW1wZWQgYWxsXG4gICAgICAgIC8vIHRoZSBvdGhlciBjaGVja2Vyc1xuICAgICAgICBsZXQgd2lubmVyOiBQbGF5ZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIHRoaXMuZ2FtZS5wbGF5ZXJzKSB7XG4gICAgICAgICAgICBpZiAocGxheWVyLmNoZWNrZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHdpbm5lciA9IHBsYXllci5vcHBvbmVudDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aW5uZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKFwiTm8gY2hlY2tlcnMgcmVtYWluaW5nXCIsIHdpbm5lci5vcHBvbmVudCk7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJBbGwgZW5lbXkgY2hlY2tlcnMganVtcGVkIVwiLCB3aW5uZXIpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBJZiB3ZSBnZXQgaGVyZSBubyBvbmUgd29uIG9uIHRoaXMgdHVybi5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgZ2FtZSBuZWVkcyB0byBlbmQsIGJ1dCBwcmltYXJ5IGdhbWUgZW5kaW5nIGNvbmRpdGlvbnNcbiAgICAgKiBhcmUgbm90IG1ldCAobGlrZSBtYXggdHVybnMgcmVhY2hlZCkuIFVzZSB0aGlzIHRvIGNoZWNrIGZvciBzZWNvbmRhcnlcbiAgICAgKiBnYW1lIHdpbiBjb25kaXRpb25zIHRvIGNyb3duIGEgd2lubmVyLlxuICAgICAqIEBwYXJhbSByZWFzb24gVGhlIHJlYXNvbiB3aHkgYSBzZWNvbmRhcnkgdmljdG9yeSBjb25kaXRpb24gaXMgaGFwcGVuaW5nXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNlY29uZGFyeVdpbkNvbmRpdGlvbnMocmVhc29uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2Vjb25kYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgY2hlY2tpbmcgZm9yIHRoZSBzZWNvbmRhcnkgd2luIGNvbmRpdGlvbnNcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNlY29uZGFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGVuZCB0aGUgZ2FtZS5cbiAgICAgICAgLy8gSWYgbm8gd2lubmVyIGl0IGRldGVybWluZWQgYWJvdmUsIHRoZW4gYSByYW5kb20gb25lIHdpbGwgYmUgY2hvc2VuLlxuICAgICAgICBzdXBlci5zZWNvbmRhcnlXaW5Db25kaXRpb25zKHJlYXNvbik7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQvcHJpdmF0ZSBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG59XG4iXX0=