"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
const spiderling_1 = require("./spiderling");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Spiders Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class SpidersGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-17-Spiders",
            "MegaMiner-AI-17-Spiders",
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
        const player = this.game.currentPlayer;
        player.broodMother.eggs = Math.ceil((player.maxSpiderlings - player.spiders.length - 1) * this.game.eggsScalar); // -1 for the BroodMother in player.spiders that is not a Spiderling
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
        const movers = [];
        for (const spider of this.game.currentPlayer.spiders) {
            if (!(spider instanceof spiderling_1.Spiderling)) {
                continue;
            }
            if (spider.workRemaining > 0) {
                spider.workRemaining -= Math.sqrt(spider.coworkers.size + 1); // + 1 for the spiderling itself
                if (spider.workRemaining <= 0) { // then they are done
                    if (spider.busy === "Moving") {
                        movers.push(spider); // they will finish moving AFTER other actions (e.g. cut)
                    }
                    else { // they finish now
                        for (const coworker of spider.coworkers) { // all the co-workers are done too
                            coworker.finish(true); // force finish them
                        }
                        spider.finish();
                    }
                }
            }
        }
        for (const mover of movers) {
            if (!mover.isDead) { // they may have died because of an action above (e.g. cut)
                mover.finish(); // now the spiderling moving can finish, because his Web may have been snapped above
            }
        }
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
        const losers = this.game.players.filter((p) => p.broodMother.isDead);
        if (losers.length > 0) { // someone lost
            if (losers.length === this.game.players.length) {
                this.secondaryWinConditions("All BroodMothers died on same turn");
            }
            else {
                this.declareLosers("BroodMother died", ...losers);
                const notLosers = this.game.players.filter((p) => !p.broodMother.isDead);
                if (notLosers.length === 1) {
                    // they win!
                    this.declareWinner("Eliminated enemy BroodMother!", notLosers[0]);
                }
            }
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
        const players = this.game.players.slice();
        if (!utils_1.arrayHasElements(players)) {
            throw new Error("No players to win game!");
        }
        players.sort((a, b) => b.broodMother.health - a.broodMother.health);
        // check if one player has more health in his BroodMother than the rest
        if (players[0].broodMother.health !== players[1].broodMother.health) {
            const winner = players.shift();
            if (!winner) {
                throw new Error("No winners for Spiders game!");
            }
            this.declareWinner(`${reason} - BroodMother has the most remaining health (${winner.broodMother.health}).`, winner);
            this.declareLosers(`${reason} - BroodMother has less health remaining than winner.`, ...players);
            return;
        }
        players.sort((a, b) => b.numberOfNestsControlled - a.numberOfNestsControlled);
        if (players[0].numberOfNestsControlled !== players[1].numberOfNestsControlled) {
            const winner = players.shift();
            if (!winner) {
                throw new Error("No winners for Spiders game!");
            }
            this.declareWinner(`${reason} - Has the most controlled Nests (${winner.numberOfNestsControlled}).`, winner);
            this.declareLosers(`${reason} - Has less controlled Nests.`, ...players);
            return;
        }
        // else check if one player has more spiders than the other
        players.sort((a, b) => b.spiders.length - a.spiders.length);
        if (players[0].spiders.length !== players[1].spiders.length) {
            const winner = players.shift();
            if (!winner) {
                throw new Error("No winners for Spiders game!");
            }
            this.declareWinner(`${reason} - Player has the most Spiders (${winner.spiders.length}).`, winner);
            this.declareLosers(`${reason} - Player has less Spiders alive than winner.`, ...players);
            return;
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
}
exports.SpidersGameManager = SpidersGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvZ2FtZS1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkVBQTZFO0FBQzdFLGFBQWE7QUFDYix5QkFBd0U7QUFFeEUsaUNBQWlDO0FBQ2pDLG1DQUEyQztBQUMzQyw2Q0FBMEM7QUFDMUMsa0NBQWtDO0FBRWxDOzs7OztHQUtHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxjQUFXLENBQUMsV0FBVztJQUMzRCxpRUFBaUU7SUFDMUQsTUFBTSxLQUFLLE9BQU87UUFDckIsT0FBTztZQUNILGlDQUFpQztZQUNqQyx3QkFBd0I7WUFDeEIseUJBQXlCO1NBRTVCLENBQUM7SUFDTixDQUFDO0lBUUQsd0NBQXdDO0lBRXhDLDJEQUEyRDtJQUUzRCx5Q0FBeUM7SUFFekM7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxVQUFVO1FBQ3RCLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXpCLHFDQUFxQztRQUVyQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN2QyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUMvQixDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQzdFLENBQUMsQ0FBQyxvRUFBb0U7UUFFdkUsc0NBQXNDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFNBQVM7UUFDckIsTUFBTSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFeEIsb0NBQW9DO1FBRXBDLE1BQU0sTUFBTSxHQUFHLEVBQWtCLENBQUM7UUFDbEMsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMs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LCtCQUErQixFQUN4QyxHQUFHLE9BQU8sQ0FDYixDQUFDO1lBRUYsT0FBTztTQUNWO1FBRUQsMkRBQTJEO1FBQzNELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDekQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1QsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO2FBQ25EO1lBRUQsSUFBSSxDQUFDLGFBQWEsQ0FDZCxHQUFHLE1BQU0sbUNBQW1DLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQ3JFLE1BQU0sQ0FDVCxDQUFDO1lBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FDZCxHQUFHLE1BQU0sK0NBQStDLEVBQ3hELEdBQUcsT0FBTyxDQUNiLENBQUM7WUFFRixPQUFPO1NBQ1Y7UUFFRCxtREFBbUQ7UUFFbkQsMEJBQTBCO1FBQzFCLHNFQUFzRTtRQUN0RSxLQUFLLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQztDQU9KO0FBak5ELGdEQWlOQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoaXMgZmlsZSBpcyB3aGVyZSB5b3Ugc2hvdWxkIHB1dCBsb2dpYyB0byBjb250cm9sIHRoZSBnYW1lIGFuZCBldmVyeXRoaW5nXG4vLyBhcm91bmQgaXQuXG5pbXBvcnQgeyBCYXNlQ2xhc3NlcywgU3BpZGVyc0dhbWUsIFNwaWRlcnNHYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IGFycmF5SGFzRWxlbWVudHMgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgU3BpZGVybGluZyB9IGZyb20gXCIuL3NwaWRlcmxpbmdcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBnYW1lIGxvZ2ljIGFyb3VuZCB0aGUgU3BpZGVycyBHYW1lLlxuICogVGhpcyBpcyB3aGVyZSB5b3UgY291bGQgZG8gbG9naWMgZm9yIGNoZWNraW5nIGlmIHRoZSBnYW1lIGlzIG92ZXIsIHVwZGF0ZVxuICogdGhlIGdhbWUgYmV0d2VlbiB0dXJucywgYW5kIGFueXRoaW5nIHRoYXQgdGllcyBhbGwgdGhlIFwic3R1ZmZcIiBpbiB0aGUgZ2FtZVxuICogdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGlkZXJzR2FtZU1hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lTWFuYWdlciB7XG4gICAgLyoqIE90aGVyIHN0cmluZ3MgKGNhc2UgaW5zZW5zaXRpdmUpIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gSUQgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFsaWFzZXMgLS0+PlxuICAgICAgICAgICAgXCJNZWdhTWluZXJBSS0xNy1TcGlkZXJzXCIsXG4gICAgICAgICAgICBcIk1lZ2FNaW5lci1BSS0xNy1TcGlkZXJzXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IFNwaWRlcnNHYW1lO1xuXG4gICAgLyoqIFRoZSBmYWN0b3J5IHRoYXQgbXVzdCBiZSB1c2VkIHRvIGluaXRpYWxpemUgbmV3IGdhbWUgb2JqZWN0cyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmVhdGUhOiBTcGlkZXJzR2FtZU9iamVjdEZhY3Rvcnk7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyBhbnkgYWRkaXRpb25hbCBwdWJsaWMgbWV0aG9kcyB5b3UgbmVlZCBjYW4gYmUgYWRkZWQgaGVyZVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEJFRk9SRSBlYWNoIHBsYXllcidzIHJ1blR1biBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICAgKiAoaW5jbHVkaW5nIHRoZSBmaXJzdCB0dXJuKS5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBnZXQgdGhlaXIgcGxheWVyIHJlYWR5IGZvciB0aGVpciB0dXJuLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBiZWZvcmVUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5iZWZvcmVUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuXG4gICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyO1xuICAgICAgICBwbGF5ZXIuYnJvb2RNb3RoZXIuZWdncyA9IE1hdGguY2VpbChcbiAgICAgICAgICAgIChwbGF5ZXIubWF4U3BpZGVybGluZ3MgLSBwbGF5ZXIuc3BpZGVycy5sZW5ndGggLSAxKSAqIHRoaXMuZ2FtZS5lZ2dzU2NhbGFyLFxuICAgICAgICApOyAvLyAtMSBmb3IgdGhlIEJyb29kTW90aGVyIGluIHBsYXllci5zcGlkZXJzIHRoYXQgaXMgbm90IGEgU3BpZGVybGluZ1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQUZURVIgZWFjaCBwbGF5ZXIncyB0dXJuIGVuZHMuIEJlZm9yZSB0aGUgdHVybiBjb3VudGVyXG4gICAgICogaW5jcmVhc2VzLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGVuZC1vZi10dXJuIGVmZmVjdHMsIGFuZCBjbGVhbiB1cCBhcnJheXMuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGFmdGVyVHVybigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgc3VwZXIuYWZ0ZXJUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWZ0ZXItdHVybiAtLT4+XG5cbiAgICAgICAgY29uc3QgbW92ZXJzID0gW10gYXMgU3BpZGVybGluZ1tdO1xuICAgICAgICBmb3IgKGNvbnN0IHNwaWRlciBvZiB0aGlzLmdhbWUuY3VycmVudFBsYXllci5zcGlkZXJzKSB7XG4gICAgICAgICAgICBpZiAoIShzcGlkZXIgaW5zdGFuY2VvZiBTcGlkZXJsaW5nKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3BpZGVyLndvcmtSZW1haW5pbmcgPiAwKSB7XG4gICAgICAgICAgICAgICAgc3BpZGVyLndvcmtSZW1haW5pbmcgLT0gTWF0aC5zcXJ0KHNwaWRlci5jb3dvcmtlcnMuc2l6ZSArIDEpOyAvLyArIDEgZm9yIHRoZSBzcGlkZXJsaW5nIGl0c2VsZlxuXG4gICAgICAgICAgICAgICAgaWYgKHNwaWRlci53b3JrUmVtYWluaW5nIDw9IDApIHsgLy8gdGhlbiB0aGV5IGFyZSBkb25lXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcGlkZXIuYnVzeSA9PT0gXCJNb3ZpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZXJzLnB1c2goc3BpZGVyKTsgLy8gdGhleSB3aWxsIGZpbmlzaCBtb3ZpbmcgQUZURVIgb3RoZXIgYWN0aW9ucyAoZS5nLiBjdXQpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7IC8vIHRoZXkgZmluaXNoIG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjb3dvcmtlciBvZiBzcGlkZXIuY293b3JrZXJzKSB7IC8vIGFsbCB0aGUgY28td29ya2VycyBhcmUgZG9uZSB0b29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3dvcmtlci5maW5pc2godHJ1ZSk7IC8vIGZvcmNlIGZpbmlzaCB0aGVtXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwaWRlci5maW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgbW92ZXIgb2YgbW92ZXJzKSB7XG4gICAgICAgICAgICBpZiAoIW1vdmVyLmlzRGVhZCkgeyAvLyB0aGV5IG1heSBoYXZlIGRpZWQgYmVjYXVzZSBvZiBhbiBhY3Rpb24gYWJvdmUgKGUuZy4gY3V0KVxuICAgICAgICAgICAgICAgIG1vdmVyLmZpbmlzaCgpOyAvLyBub3cgdGhlIHNwaWRlcmxpbmcgbW92aW5nIGNhbiBmaW5pc2gsIGJlY2F1c2UgaGlzIFdlYiBtYXkgaGF2ZSBiZWVuIHNuYXBwZWQgYWJvdmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhZnRlci10dXJuIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlciBpbiBiZXR3ZWVuIHR1cm5zLlxuICAgICAqIFRoaXMgaXMgaW52b2tlZCBBRlRFUiBhZnRlclR1cm4oKSBpcyBjYWxsZWQsIGJ1dCBCRUZPUkUgYmVmb3JlVHVybigpXG4gICAgICogaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgZ2FtZSBpcyBpbmRlZWQgb3Zlciwgb3RoZXJ3aXNlIGlmIHRoZSBnYW1lXG4gICAgICogc2hvdWxkIGNvbnRpbnVlIHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpOiBib29sZWFuIHtcbiAgICAgICAgc3VwZXIucHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByaW1hcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIGNvbnN0IGxvc2VycyA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmZpbHRlcigocCkgPT4gcC5icm9vZE1vdGhlci5pc0RlYWQpO1xuXG4gICAgICAgIGlmIChsb3NlcnMubGVuZ3RoID4gMCkgeyAvLyBzb21lb25lIGxvc3RcbiAgICAgICAgICAgIGlmIChsb3NlcnMubGVuZ3RoID09PSB0aGlzLmdhbWUucGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXCJBbGwgQnJvb2RNb3RoZXJzIGRpZWQgb24gc2FtZSB0dXJuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKFwiQnJvb2RNb3RoZXIgZGllZFwiLCAuLi5sb3NlcnMpO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgbm90TG9zZXJzID0gdGhpcy5nYW1lLnBsYXllcnMuZmlsdGVyKChwKSA9PiAhcC5icm9vZE1vdGhlci5pc0RlYWQpO1xuICAgICAgICAgICAgICAgIGlmIChub3RMb3NlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZXkgd2luIVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJFbGltaW5hdGVkIGVuZW15IEJyb29kTW90aGVyIVwiLCBub3RMb3NlcnNbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJpbWFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBJZiB3ZSBnZXQgaGVyZSBubyBvbmUgd29uIG9uIHRoaXMgdHVybi5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgZ2FtZSBuZWVkcyB0byBlbmQsIGJ1dCBwcmltYXJ5IGdhbWUgZW5kaW5nIGNvbmRpdGlvbnNcbiAgICAgKiBhcmUgbm90IG1ldCAobGlrZSBtYXggdHVybnMgcmVhY2hlZCkuIFVzZSB0aGlzIHRvIGNoZWNrIGZvciBzZWNvbmRhcnlcbiAgICAgKiBnYW1lIHdpbiBjb25kaXRpb25zIHRvIGNyb3duIGEgd2lubmVyLlxuICAgICAqIEBwYXJhbSByZWFzb24gVGhlIHJlYXNvbiB3aHkgYSBzZWNvbmRhcnkgdmljdG9yeSBjb25kaXRpb24gaXMgaGFwcGVuaW5nXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHNlY29uZGFyeVdpbkNvbmRpdGlvbnMocmVhc29uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2Vjb25kYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cbiAgICAgICAgY29uc3QgcGxheWVycyA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnNsaWNlKCk7XG5cbiAgICAgICAgaWYgKCFhcnJheUhhc0VsZW1lbnRzKHBsYXllcnMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBwbGF5ZXJzIHRvIHdpbiBnYW1lIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllcnMuc29ydCgoYSwgYikgPT4gYi5icm9vZE1vdGhlci5oZWFsdGggLSBhLmJyb29kTW90aGVyLmhlYWx0aCk7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgb25lIHBsYXllciBoYXMgbW9yZSBoZWFsdGggaW4gaGlzIEJyb29kTW90aGVyIHRoYW4gdGhlIHJlc3RcbiAgICAgICAgaWYgKHBsYXllcnNbMF0uYnJvb2RNb3RoZXIuaGVhbHRoICE9PSBwbGF5ZXJzWzFdLmJyb29kTW90aGVyLmhlYWx0aCkge1xuICAgICAgICAgICAgY29uc3Qgd2lubmVyID0gcGxheWVycy5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKCF3aW5uZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyB3aW5uZXJzIGZvciBTcGlkZXJzIGdhbWUhXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXG4gICAgICAgICAgICAgICAgYCR7cmVhc29ufSAtIEJyb29kTW90aGVyIGhhcyB0aGUgbW9zdCByZW1haW5pbmcgaGVhbHRoICgke3dpbm5lci5icm9vZE1vdGhlci5oZWFsdGh9KS5gLFxuICAgICAgICAgICAgICAgIHdpbm5lcixcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VycyhcbiAgICAgICAgICAgICAgICBgJHtyZWFzb259IC0gQnJvb2RNb3RoZXIgaGFzIGxlc3MgaGVhbHRoIHJlbWFpbmluZyB0aGFuIHdpbm5lci5gLFxuICAgICAgICAgICAgICAgIC4uLnBsYXllcnMsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5ZXJzLnNvcnQoKGEsIGIpID0+IGIubnVtYmVyT2ZOZXN0c0NvbnRyb2xsZWQgLSBhLm51bWJlck9mTmVzdHNDb250cm9sbGVkKTtcbiAgICAgICAgaWYgKHBsYXllcnNbMF0ubnVtYmVyT2ZOZXN0c0NvbnRyb2xsZWQgIT09IHBsYXllcnNbMV0ubnVtYmVyT2ZOZXN0c0NvbnRyb2xsZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHBsYXllcnMuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICghd2lubmVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gd2lubmVycyBmb3IgU3BpZGVycyBnYW1lIVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFxuICAgICAgICAgICAgICAgIGAke3JlYXNvbn0gLSBIYXMgdGhlIG1vc3QgY29udHJvbGxlZCBOZXN0cyAoJHt3aW5uZXIubnVtYmVyT2ZOZXN0c0NvbnRyb2xsZWR9KS5gLFxuICAgICAgICAgICAgICAgIHdpbm5lcixcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VycyhcbiAgICAgICAgICAgICAgICBgJHtyZWFzb259IC0gSGFzIGxlc3MgY29udHJvbGxlZCBOZXN0cy5gLFxuICAgICAgICAgICAgICAgIC4uLnBsYXllcnMsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbHNlIGNoZWNrIGlmIG9uZSBwbGF5ZXIgaGFzIG1vcmUgc3BpZGVycyB0aGFuIHRoZSBvdGhlclxuICAgICAgICBwbGF5ZXJzLnNvcnQoKGEsIGIpID0+IGIuc3BpZGVycy5sZW5ndGggLSBhLnNwaWRlcnMubGVuZ3RoKTtcbiAgICAgICAgaWYgKHBsYXllcnNbMF0uc3BpZGVycy5sZW5ndGggIT09IHBsYXllcnNbMV0uc3BpZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHBsYXllcnMuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICghd2lubmVyKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gd2lubmVycyBmb3IgU3BpZGVycyBnYW1lIVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFxuICAgICAgICAgICAgICAgIGAke3JlYXNvbn0gLSBQbGF5ZXIgaGFzIHRoZSBtb3N0IFNwaWRlcnMgKCR7d2lubmVyLnNwaWRlcnMubGVuZ3RofSkuYCxcbiAgICAgICAgICAgICAgICB3aW5uZXIsXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKFxuICAgICAgICAgICAgICAgIGAke3JlYXNvbn0gLSBQbGF5ZXIgaGFzIGxlc3MgU3BpZGVycyBhbGl2ZSB0aGFuIHdpbm5lci5gLFxuICAgICAgICAgICAgICAgIC4uLnBsYXllcnMsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2Vjb25kYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICAvLyBUaGlzIHdpbGwgZW5kIHRoZSBnYW1lLlxuICAgICAgICAvLyBJZiBubyB3aW5uZXIgaXQgZGV0ZXJtaW5lZCBhYm92ZSwgdGhlbiBhIHJhbmRvbSBvbmUgd2lsbCBiZSBjaG9zZW4uXG4gICAgICAgIHN1cGVyLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMocmVhc29uKTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cblxuICAgIC8vIGFueSBhZGRpdGlvbmFsIHByb3RlY3RlZC9wcml2YXRlIG1ldGhvZHMgeW91IG5lZWQgY2FuIGJlIGFkZGVkIGhlcmVcblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cbn1cbiJdfQ==