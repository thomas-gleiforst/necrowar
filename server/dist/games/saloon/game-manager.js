"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Saloon Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class SaloonGameManager extends _1.BaseClasses.GameManager {
    constructor() {
        super(...arguments);
        // <<-- Creer-Merge: public-methods -->>
        /**
         * list of cowboys to add to their cowboy lists between turns (so we don't
         * resize arrays during players turns)
         */
        this.spawnedCowboys = [];
        // <<-- /Creer-Merge: protected-private-methods -->>
    }
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-18-Saloon",
            "MegaMiner-AI-18-Saloon",
        ];
    }
    /**
     * Checks if someone won, and if so declares a winner
     *
     * @returns True if there was a winner and the game is over, false otherwise
     */
    checkForWinner() {
        if (this.primaryWinConditionsCheck()) {
            this.endGame();
        }
    }
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
        this.updateSpawnedCowboys();
        this.game.currentPlayer.siesta = Math.max(0, this.game.currentPlayer.siesta - 1);
        this.updateCowboys();
        this.advanceBottles();
        this.resetPianoPlaying();
        this.applyHazardDamage();
        utils_1.filterInPlace(this.game.cowboys, (c) => !c.isDead);
        utils_1.filterInPlace(this.game.furnishings, (f) => !f.isDestroyed);
        utils_1.filterInPlace(this.game.bottles, (b) => !b.isDestroyed);
        this.game.currentPlayer.youngGun.update();
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
        const alivePianos = this.game.furnishings.filter((f) => !f.isDestroyed && f.isPiano);
        if (alivePianos.length === 0) { // game over
            this.secondaryWinConditions("all pianos destroyed.");
        }
        // check to see if one player has more score than the other can possibly get
        const winning = this.game.players[0].score > this.game.players[1].score
            ? this.game.players[0]
            : this.game.players[1];
        // this assumes they play every piano on every remaining turn
        const remainingTurns = this.game.maxTurns - this.game.currentTurn;
        const maxAdditionalScore = Math.ceil(alivePianos.length * remainingTurns / 2);
        if (winning.score > winning.opponent.score + maxAdditionalScore) {
            // then the losing player can't catch up to the winner's score,
            // so end the game early
            this.declareWinner(`Score (${winning.score}) high enough that the opponent can't `
                + `win in the remaining turns (${remainingTurns}).`, winning);
            this.declareLoser("Score too low to catch up to the winner in the number of remaining turns.", winning.opponent);
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
        const { players } = this.game;
        if (players[0].score !== players[1].score) { // someone won with a higher score
            const winner = players[0].score > players[1].score
                ? players[0]
                : players[1];
            this.declareWinner(`${reason} - Has highest score (${winner.score}).`, winner);
            this.declareLoser("Lower score than winner", winner.opponent);
            this.endGame();
            return;
        }
        if (players[0].kills !== players[1].kills) { // someone won with a higher kills
            const winner = players[0].kills > players[1].kills
                ? players[0]
                : players[1];
            this.declareWinner(`${reason} - Has the most kills (${winner.kills}).`, winner);
            this.declareLoser("Less kills than winner", winner.opponent);
            this.endGame();
            return;
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    /**
     * Take all the cowboys spawned during the turn and put them in the appropriate arrays
     */
    updateSpawnedCowboys() {
        for (const cowboy of this.spawnedCowboys) {
            this.game.cowboys.push(cowboy);
            cowboy.owner.cowboys.push(cowboy);
        }
        this.spawnedCowboys.length = 0;
    }
    /**
     * Updates all the cowboys with in-between turns logic.
     */
    updateCowboys() {
        for (const cowboy of this.game.currentPlayer.cowboys) {
            if (cowboy.isDead || !cowboy.tile) {
                continue; // don't update dead dudes, they won't come back
            }
            if (cowboy.isDrunk) {
                if (cowboy.drunkDirection !== "") {
                    // then they are not drunk because of a siesta, so move them
                    const next = cowboy.tile.getNeighbor(cowboy.drunkDirection);
                    if (!next) {
                        throw new Error(`${this} somehow is trying to walk off the map!`);
                    }
                    if (next.isBalcony || next.cowboy || next.furnishing) { // then something is in the way
                        if (next.cowboy) {
                            next.cowboy.focus = 0;
                        }
                        if (next.isBalcony || next.furnishing) {
                            cowboy.damage(1);
                            if (cowboy.isDead) { // RIP he died from that
                                continue; // don't update dead dudes, they won't come back
                            }
                        }
                    }
                    else { // the next tile is valid
                        cowboy.tile.cowboy = undefined;
                        cowboy.tile = next;
                        next.cowboy = cowboy;
                        if (next.bottle) {
                            next.bottle.break();
                        }
                    }
                }
                cowboy.turnsBusy = Math.max(0, cowboy.turnsBusy - 1);
                cowboy.isDrunk = (cowboy.turnsBusy !== 0);
                cowboy.canMove = !cowboy.isDrunk;
            }
            else { // they are not drunk, so update them for use next turn
                if (cowboy.job === "Sharpshooter" && cowboy.canMove && cowboy.turnsBusy === 0) {
                    // then the sharpshooter didn't move, so increase his focus
                    cowboy.focus++;
                }
                cowboy.canMove = true;
            }
            cowboy.turnsBusy = Math.max(0, cowboy.turnsBusy - 1);
            if (cowboy.job === "Brawler") { // damage surroundings
                for (const neighbor of cowboy.tile.getNeighbors()) {
                    if (neighbor.cowboy) { // if there is a cowboy, damage them
                        neighbor.cowboy.damage(this.game.brawlerDamage);
                    }
                    if (neighbor.furnishing) { // if there is a furnishing, damage it
                        neighbor.furnishing.damage(this.game.brawlerDamage);
                    }
                }
            }
        }
    }
    /**
     * Moves all bottles currently in the game
     */
    advanceBottles() {
        const bottlesAtTile = new Map();
        // Make a copy as bottles breaking could change the array's size during
        // iteration
        for (const bottle of this.game.bottles.slice()) {
            if (bottle.isDestroyed) {
                continue;
            }
            bottle.advance();
            if (!bottle.isDestroyed && bottle.tile) {
                let bottles = bottlesAtTile.get(bottle.tile);
                if (!bottles) {
                    bottles = [];
                    bottlesAtTile.set(bottle.tile, bottles);
                }
                bottles.push(bottle);
            }
        }
        // now check for bottle <--> bottle collisions, and cleanup
        for (const [tile, bottles] of bottlesAtTile) {
            if (bottles.length > 1) { // there's more than 1 bottle on that tile, break them all
                for (const bottle of bottles) {
                    bottle.break();
                }
            }
            else { // there is 1 or 0 bottles on the tile with `id`
                tile.bottle = bottles[0];
            }
            tile.bottle = tile.bottle || undefined;
        }
    }
    /**
     * Damages all pianos 1 damage, accelerating the game
     */
    resetPianoPlaying() {
        for (const furnishing of this.game.furnishings) {
            if (furnishing.isDestroyed || !furnishing.isPiano) {
                continue;
            }
            // else it's a non destroyed piano
            furnishing.isPlaying = false;
        }
    }
    /**
     * Damages all cowboys which are standing on a hazard
     */
    applyHazardDamage() {
        for (const cowboy of this.game.cowboys) {
            if (cowboy.tile && cowboy.tile.hasHazard) {
                cowboy.damage(1);
            }
        }
    }
}
exports.SaloonGameManager = SaloonGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NhbG9vbi9nYW1lLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2RUFBNkU7QUFDN0UsYUFBYTtBQUNiLHlCQUFzRTtBQUV0RSxpQ0FBaUM7QUFDakMsbUNBQXdDO0FBSXhDLGtDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsY0FBVyxDQUFDLFdBQVc7SUFBOUQ7O1FBaUJJLHdDQUF3QztRQUV4Qzs7O1dBR0c7UUFDYSxtQkFBYyxHQUFhLEVBQUUsQ0FBQztRQWlTOUMsb0RBQW9EO0lBQ3hELENBQUM7SUF4VEcsaUVBQWlFO0lBQzFELE1BQU0sS0FBSyxPQUFPO1FBQ3JCLE9BQU87WUFDSCxpQ0FBaUM7WUFDakMsdUJBQXVCO1lBQ3ZCLHdCQUF3QjtTQUUzQixDQUFDO0lBQ04sQ0FBQztJQWdCRDs7OztPQUlHO0lBQ0ksY0FBYztRQUNqQixJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNsQjtJQUNMLENBQUM7SUFFRCx5Q0FBeUM7SUFFekM7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxVQUFVO1FBQ3RCLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXpCLHFDQUFxQztRQUNyQyw2REFBNkQ7UUFDN0Qsc0NBQXNDO0lBQzFDLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sS0FBSyxDQUFDLFNBQVM7UUFDckIsTUFBTSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFeEIsb0NBQW9DO1FBQ3BDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRTVCLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFD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Q0FBQyxNQUFNLENBQUMsQ0FBQzthQUN4QjtTQUNKO1FBRUQsMkRBQTJEO1FBQzNELEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxhQUFhLEVBQUU7WUFDekMsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLDBEQUEwRDtnQkFDaEYsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7b0JBQzFCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztpQkFDbEI7YUFDSjtpQkFDSSxFQUFFLGdEQUFnRDtnQkFDbkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUI7WUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssaUJBQWlCO1FBQ3JCLEtBQUssTUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDNUMsSUFBSSxVQUFVLENBQUMsV0FBVyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRTtnQkFDL0MsU0FBUzthQUNaO1lBQ0Qsa0NBQWtDO1lBQ2xDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQ2hDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssaUJBQWlCO1FBQ3JCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDcEMsSUFBSSxNQUFNLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7SUFDTCxDQUFDO0NBR0o7QUF6VEQsOENBeVRDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBmaWxlIGlzIHdoZXJlIHlvdSBzaG91bGQgcHV0IGxvZ2ljIHRvIGNvbnRyb2wgdGhlIGdhbWUgYW5kIGV2ZXJ5dGhpbmdcbi8vIGFyb3VuZCBpdC5cbmltcG9ydCB7IEJhc2VDbGFzc2VzLCBTYWxvb25HYW1lLCBTYWxvb25HYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IGZpbHRlckluUGxhY2UgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQm90dGxlIH0gZnJvbSBcIi4vYm90dGxlXCI7XG5pbXBvcnQgeyBDb3dib3kgfSBmcm9tIFwiLi9jb3dib3lcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogTWFuYWdlcyB0aGUgZ2FtZSBsb2dpYyBhcm91bmQgdGhlIFNhbG9vbiBHYW1lLlxuICogVGhpcyBpcyB3aGVyZSB5b3UgY291bGQgZG8gbG9naWMgZm9yIGNoZWNraW5nIGlmIHRoZSBnYW1lIGlzIG92ZXIsIHVwZGF0ZVxuICogdGhlIGdhbWUgYmV0d2VlbiB0dXJucywgYW5kIGFueXRoaW5nIHRoYXQgdGllcyBhbGwgdGhlIFwic3R1ZmZcIiBpbiB0aGUgZ2FtZVxuICogdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBTYWxvb25HYW1lTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVNYW5hZ2VyIHtcbiAgICAvKiogT3RoZXIgc3RyaW5ncyAoY2FzZSBpbnNlbnNpdGl2ZSkgdGhhdCBjYW4gYmUgdXNlZCBhcyBhbiBJRCAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGFsaWFzZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgICAgICBcIk1lZ2FNaW5lckFJLTE4LVNhbG9vblwiLFxuICAgICAgICAgICAgXCJNZWdhTWluZXItQUktMTgtU2Fsb29uXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IFNhbG9vbkdhbWU7XG5cbiAgICAvKiogVGhlIGZhY3RvcnkgdGhhdCBtdXN0IGJlIHVzZWQgdG8gaW5pdGlhbGl6ZSBuZXcgZ2FtZSBvYmplY3RzICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNyZWF0ZSE6IFNhbG9vbkdhbWVPYmplY3RGYWN0b3J5O1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogbGlzdCBvZiBjb3dib3lzIHRvIGFkZCB0byB0aGVpciBjb3dib3kgbGlzdHMgYmV0d2VlbiB0dXJucyAoc28gd2UgZG9uJ3RcbiAgICAgKiByZXNpemUgYXJyYXlzIGR1cmluZyBwbGF5ZXJzIHR1cm5zKVxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzcGF3bmVkQ293Ym95czogQ293Ym95W10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBzb21lb25lIHdvbiwgYW5kIGlmIHNvIGRlY2xhcmVzIGEgd2lubmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZXJlIHdhcyBhIHdpbm5lciBhbmQgdGhlIGdhbWUgaXMgb3ZlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGNoZWNrRm9yV2lubmVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5wcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kR2FtZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIEJFRk9SRSBlYWNoIHBsYXllcidzIHJ1blR1biBmdW5jdGlvbiBpcyBjYWxsZWRcbiAgICAgKiAoaW5jbHVkaW5nIHRoZSBmaXJzdCB0dXJuKS5cbiAgICAgKiBUaGlzIGlzIGEgZ29vZCBwbGFjZSB0byBnZXQgdGhlaXIgcGxheWVyIHJlYWR5IGZvciB0aGVpciB0dXJuLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBiZWZvcmVUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5iZWZvcmVUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYmVmb3JlLXR1cm4gLS0+PlxuICAgICAgICAvLyBhZGQgbG9naWMgaGVyZSBmb3IgYmVmb3JlIHRoZSBjdXJyZW50IHBsYXllcidzIHR1cm4gc3RhcnRzXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQUZURVIgZWFjaCBwbGF5ZXIncyB0dXJuIGVuZHMuIEJlZm9yZSB0aGUgdHVybiBjb3VudGVyXG4gICAgICogaW5jcmVhc2VzLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGVuZC1vZi10dXJuIGVmZmVjdHMsIGFuZCBjbGVhbiB1cCBhcnJheXMuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGFmdGVyVHVybigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgYXdhaXQgc3VwZXIuYWZ0ZXJUdXJuKCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWZ0ZXItdHVybiAtLT4+XG4gICAgICAgIHRoaXMudXBkYXRlU3Bhd25lZENvd2JveXMoKTtcblxuICAgICAgICB0aGlzLmdhbWUuY3VycmVudFBsYXllci5zaWVzdGEgPSBNYXRoLm1heCgwLCB0aGlzLmdhbWUuY3VycmVudFBsYXllci5zaWVzdGEgLSAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVDb3dib3lzKCk7XG4gICAgICAgIHRoaXMuYWR2YW5jZUJvdHRsZXMoKTtcbiAgICAgICAgdGhpcy5yZXNldFBpYW5vUGxheWluZygpO1xuICAgICAgICB0aGlzLmFwcGx5SGF6YXJkRGFtYWdlKCk7XG5cbiAgICAgICAgZmlsdGVySW5QbGFjZSh0aGlzLmdhbWUuY293Ym95cywgKGMpID0+ICFjLmlzRGVhZCk7XG4gICAgICAgIGZpbHRlckluUGxhY2UodGhpcy5nYW1lLmZ1cm5pc2hpbmdzLCAoZikgPT4gIWYuaXNEZXN0cm95ZWQpO1xuICAgICAgICBmaWx0ZXJJblBsYWNlKHRoaXMuZ2FtZS5ib3R0bGVzLCAoYikgPT4gIWIuaXNEZXN0cm95ZWQpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLnlvdW5nR3VuLnVwZGF0ZSgpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWZ0ZXItdHVybiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnYW1lIGlzIG92ZXIgaW4gYmV0d2VlbiB0dXJucy5cbiAgICAgKiBUaGlzIGlzIGludm9rZWQgQUZURVIgYWZ0ZXJUdXJuKCkgaXMgY2FsbGVkLCBidXQgQkVGT1JFIGJlZm9yZVR1cm4oKVxuICAgICAqIGlzIGNhbGxlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGdhbWUgaXMgaW5kZWVkIG92ZXIsIG90aGVyd2lzZSBpZiB0aGUgZ2FtZVxuICAgICAqIHNob3VsZCBjb250aW51ZSByZXR1cm4gZmFsc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHByaW1hcnlXaW5Db25kaXRpb25zQ2hlY2soKTogYm9vbGVhbiB7XG4gICAgICAgIHN1cGVyLnByaW1hcnlXaW5Db25kaXRpb25zQ2hlY2soKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICBjb25zdCBhbGl2ZVBpYW5vcyA9IHRoaXMuZ2FtZS5mdXJuaXNoaW5ncy5maWx0ZXIoKGYpID0+ICFmLmlzRGVzdHJveWVkICYmIGYuaXNQaWFubyk7XG5cbiAgICAgICAgaWYgKGFsaXZlUGlhbm9zLmxlbmd0aCA9PT0gMCkgeyAvLyBnYW1lIG92ZXJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhcImFsbCBwaWFub3MgZGVzdHJveWVkLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBvbmUgcGxheWVyIGhhcyBtb3JlIHNjb3JlIHRoYW4gdGhlIG90aGVyIGNhbiBwb3NzaWJseSBnZXRcbiAgICAgICAgY29uc3Qgd2lubmluZyA9IHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLnNjb3JlID4gdGhpcy5nYW1lLnBsYXllcnNbMV0uc2NvcmVcbiAgICAgICAgICAgID8gdGhpcy5nYW1lLnBsYXllcnNbMF1cbiAgICAgICAgICAgIDogdGhpcy5nYW1lLnBsYXllcnNbMV07XG5cbiAgICAgICAgLy8gdGhpcyBhc3N1bWVzIHRoZXkgcGxheSBldmVyeSBwaWFubyBvbiBldmVyeSByZW1haW5pbmcgdHVyblxuICAgICAgICBjb25zdCByZW1haW5pbmdUdXJucyA9IHRoaXMuZ2FtZS5tYXhUdXJucyAtIHRoaXMuZ2FtZS5jdXJyZW50VHVybjtcbiAgICAgICAgY29uc3QgbWF4QWRkaXRpb25hbFNjb3JlID0gTWF0aC5jZWlsKGFsaXZlUGlhbm9zLmxlbmd0aCAqIHJlbWFpbmluZ1R1cm5zIC8gMik7XG4gICAgICAgIGlmICh3aW5uaW5nLnNjb3JlID4gd2lubmluZy5vcHBvbmVudC5zY29yZSArIG1heEFkZGl0aW9uYWxTY29yZSkge1xuICAgICAgICAgICAgLy8gdGhlbiB0aGUgbG9zaW5nIHBsYXllciBjYW4ndCBjYXRjaCB1cCB0byB0aGUgd2lubmVyJ3Mgc2NvcmUsXG4gICAgICAgICAgICAvLyBzbyBlbmQgdGhlIGdhbWUgZWFybHlcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihcbiAgICAgICAgICAgICAgICBgU2NvcmUgKCR7d2lubmluZy5zY29yZX0pIGhpZ2ggZW5vdWdoIHRoYXQgdGhlIG9wcG9uZW50IGNhbid0IGBcbiAgICAgICAgICAgICAgICArIGB3aW4gaW4gdGhlIHJlbWFpbmluZyB0dXJucyAoJHtyZW1haW5pbmdUdXJuc30pLmAsXG4gICAgICAgICAgICAgICAgd2lubmluZyxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VyKFxuICAgICAgICAgICAgICAgIFwiU2NvcmUgdG9vIGxvdyB0byBjYXRjaCB1cCB0byB0aGUgd2lubmVyIGluIHRoZSBudW1iZXIgb2YgcmVtYWluaW5nIHR1cm5zLlwiLFxuICAgICAgICAgICAgICAgIHdpbm5pbmcub3Bwb25lbnQsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIGNvbnN0IHsgcGxheWVycyB9ID0gdGhpcy5nYW1lO1xuICAgICAgICBpZiAocGxheWVyc1swXS5zY29yZSAhPT0gcGxheWVyc1sxXS5zY29yZSkgeyAvLyBzb21lb25lIHdvbiB3aXRoIGEgaGlnaGVyIHNjb3JlXG4gICAgICAgICAgICBjb25zdCB3aW5uZXIgPSBwbGF5ZXJzWzBdLnNjb3JlID4gcGxheWVyc1sxXS5zY29yZVxuICAgICAgICAgICAgICAgID8gcGxheWVyc1swXVxuICAgICAgICAgICAgICAgIDogcGxheWVyc1sxXTtcblxuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn0gLSBIYXMgaGlnaGVzdCBzY29yZSAoJHt3aW5uZXIuc2NvcmV9KS5gLCB3aW5uZXIpO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoXCJMb3dlciBzY29yZSB0aGFuIHdpbm5lclwiLCB3aW5uZXIub3Bwb25lbnQpO1xuICAgICAgICAgICAgdGhpcy5lbmRHYW1lKCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXJzWzBdLmtpbGxzICE9PSBwbGF5ZXJzWzFdLmtpbGxzKSB7IC8vIHNvbWVvbmUgd29uIHdpdGggYSBoaWdoZXIga2lsbHNcbiAgICAgICAgICAgIGNvbnN0IHdpbm5lciA9IHBsYXllcnNbMF0ua2lsbHMgPiBwbGF5ZXJzWzFdLmtpbGxzXG4gICAgICAgICAgICAgICAgPyBwbGF5ZXJzWzBdXG4gICAgICAgICAgICAgICAgOiBwbGF5ZXJzWzFdO1xuXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoYCR7cmVhc29ufSAtIEhhcyB0aGUgbW9zdCBraWxscyAoJHt3aW5uZXIua2lsbHN9KS5gLCB3aW5uZXIpO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIoXCJMZXNzIGtpbGxzIHRoYW4gd2lubmVyXCIsIHdpbm5lci5vcHBvbmVudCk7XG4gICAgICAgICAgICB0aGlzLmVuZEdhbWUoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNlY29uZGFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGVuZCB0aGUgZ2FtZS5cbiAgICAgICAgLy8gSWYgbm8gd2lubmVyIGl0IGRldGVybWluZWQgYWJvdmUsIHRoZW4gYSByYW5kb20gb25lIHdpbGwgYmUgY2hvc2VuLlxuICAgICAgICBzdXBlci5zZWNvbmRhcnlXaW5Db25kaXRpb25zKHJlYXNvbik7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBUYWtlIGFsbCB0aGUgY293Ym95cyBzcGF3bmVkIGR1cmluZyB0aGUgdHVybiBhbmQgcHV0IHRoZW0gaW4gdGhlIGFwcHJvcHJpYXRlIGFycmF5c1xuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlU3Bhd25lZENvd2JveXMoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY293Ym95IG9mIHRoaXMuc3Bhd25lZENvd2JveXMpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb3dib3lzLnB1c2goY293Ym95KTtcbiAgICAgICAgICAgIGNvd2JveS5vd25lci5jb3dib3lzLnB1c2goY293Ym95KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zcGF3bmVkQ293Ym95cy5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgYWxsIHRoZSBjb3dib3lzIHdpdGggaW4tYmV0d2VlbiB0dXJucyBsb2dpYy5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZUNvd2JveXMoKTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgY293Ym95IG9mIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLmNvd2JveXMpIHtcbiAgICAgICAgICAgIGlmIChjb3dib3kuaXNEZWFkIHx8ICFjb3dib3kudGlsZSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBkb24ndCB1cGRhdGUgZGVhZCBkdWRlcywgdGhleSB3b24ndCBjb21lIGJhY2tcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvd2JveS5pc0RydW5rKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvd2JveS5kcnVua0RpcmVjdGlvbiAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZXkgYXJlIG5vdCBkcnVuayBiZWNhdXNlIG9mIGEgc2llc3RhLCBzbyBtb3ZlIHRoZW1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IGNvd2JveS50aWxlLmdldE5laWdoYm9yKGNvd2JveS5kcnVua0RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXN9IHNvbWVob3cgaXMgdHJ5aW5nIHRvIHdhbGsgb2ZmIHRoZSBtYXAhYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dC5pc0JhbGNvbnkgfHwgbmV4dC5jb3dib3kgfHwgbmV4dC5mdXJuaXNoaW5nKSB7IC8vIHRoZW4gc29tZXRoaW5nIGlzIGluIHRoZSB3YXlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0LmNvd2JveSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHQuY293Ym95LmZvY3VzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQuaXNCYWxjb255IHx8IG5leHQuZnVybmlzaGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvd2JveS5kYW1hZ2UoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvd2JveS5pc0RlYWQpIHsgLy8gUklQIGhlIGRpZWQgZnJvbSB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBkb24ndCB1cGRhdGUgZGVhZCBkdWRlcywgdGhleSB3b24ndCBjb21lIGJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7IC8vIHRoZSBuZXh0IHRpbGUgaXMgdmFsaWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvd2JveS50aWxlLmNvd2JveSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvd2JveS50aWxlID0gbmV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQuY293Ym95ID0gY293Ym95O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dC5ib3R0bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0LmJvdHRsZS5icmVhaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY293Ym95LnR1cm5zQnVzeSA9IE1hdGgubWF4KDAsIGNvd2JveS50dXJuc0J1c3kgLSAxKTtcbiAgICAgICAgICAgICAgICBjb3dib3kuaXNEcnVuayA9IChjb3dib3kudHVybnNCdXN5ICE9PSAwKTtcbiAgICAgICAgICAgICAgICBjb3dib3kuY2FuTW92ZSA9ICFjb3dib3kuaXNEcnVuaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvLyB0aGV5IGFyZSBub3QgZHJ1bmssIHNvIHVwZGF0ZSB0aGVtIGZvciB1c2UgbmV4dCB0dXJuXG4gICAgICAgICAgICAgICAgaWYgKGNvd2JveS5qb2IgPT09IFwiU2hhcnBzaG9vdGVyXCIgJiYgY293Ym95LmNhbk1vdmUgJiYgY293Ym95LnR1cm5zQnVzeSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZSBzaGFycHNob290ZXIgZGlkbid0IG1vdmUsIHNvIGluY3JlYXNlIGhpcyBmb2N1c1xuICAgICAgICAgICAgICAgICAgICBjb3dib3kuZm9jdXMrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb3dib3kuY2FuTW92ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvd2JveS50dXJuc0J1c3kgPSBNYXRoLm1heCgwLCBjb3dib3kudHVybnNCdXN5IC0gMSk7XG5cbiAgICAgICAgICAgIGlmIChjb3dib3kuam9iID09PSBcIkJyYXdsZXJcIikgeyAvLyBkYW1hZ2Ugc3Vycm91bmRpbmdzXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBuZWlnaGJvciBvZiBjb3dib3kudGlsZS5nZXROZWlnaGJvcnMoKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmVpZ2hib3IuY293Ym95KSB7IC8vIGlmIHRoZXJlIGlzIGEgY293Ym95LCBkYW1hZ2UgdGhlbVxuICAgICAgICAgICAgICAgICAgICAgICAgbmVpZ2hib3IuY293Ym95LmRhbWFnZSh0aGlzLmdhbWUuYnJhd2xlckRhbWFnZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yLmZ1cm5pc2hpbmcpIHsgLy8gaWYgdGhlcmUgaXMgYSBmdXJuaXNoaW5nLCBkYW1hZ2UgaXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG5laWdoYm9yLmZ1cm5pc2hpbmcuZGFtYWdlKHRoaXMuZ2FtZS5icmF3bGVyRGFtYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgLyoqXG4gICAgKiBNb3ZlcyBhbGwgYm90dGxlcyBjdXJyZW50bHkgaW4gdGhlIGdhbWVcbiAgICAqL1xuICAgIHByaXZhdGUgYWR2YW5jZUJvdHRsZXMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGJvdHRsZXNBdFRpbGUgPSBuZXcgTWFwPFRpbGUsIEJvdHRsZVtdPigpO1xuXG4gICAgICAgIC8vIE1ha2UgYSBjb3B5IGFzIGJvdHRsZXMgYnJlYWtpbmcgY291bGQgY2hhbmdlIHRoZSBhcnJheSdzIHNpemUgZHVyaW5nXG4gICAgICAgIC8vIGl0ZXJhdGlvblxuICAgICAgICBmb3IgKGNvbnN0IGJvdHRsZSBvZiB0aGlzLmdhbWUuYm90dGxlcy5zbGljZSgpKSB7XG4gICAgICAgICAgICBpZiAoYm90dGxlLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJvdHRsZS5hZHZhbmNlKCk7XG4gICAgICAgICAgICBpZiAoIWJvdHRsZS5pc0Rlc3Ryb3llZCAmJiBib3R0bGUudGlsZSkge1xuICAgICAgICAgICAgICAgIGxldCBib3R0bGVzID0gYm90dGxlc0F0VGlsZS5nZXQoYm90dGxlLnRpbGUpO1xuICAgICAgICAgICAgICAgIGlmICghYm90dGxlcykge1xuICAgICAgICAgICAgICAgICAgICBib3R0bGVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGJvdHRsZXNBdFRpbGUuc2V0KGJvdHRsZS50aWxlLCBib3R0bGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYm90dGxlcy5wdXNoKGJvdHRsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3cgY2hlY2sgZm9yIGJvdHRsZSA8LS0+IGJvdHRsZSBjb2xsaXNpb25zLCBhbmQgY2xlYW51cFxuICAgICAgICBmb3IgKGNvbnN0IFt0aWxlLCBib3R0bGVzXSBvZiBib3R0bGVzQXRUaWxlKSB7XG4gICAgICAgICAgICBpZiAoYm90dGxlcy5sZW5ndGggPiAxKSB7IC8vIHRoZXJlJ3MgbW9yZSB0aGFuIDEgYm90dGxlIG9uIHRoYXQgdGlsZSwgYnJlYWsgdGhlbSBhbGxcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGJvdHRsZSBvZiBib3R0bGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGJvdHRsZS5icmVhaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvLyB0aGVyZSBpcyAxIG9yIDAgYm90dGxlcyBvbiB0aGUgdGlsZSB3aXRoIGBpZGBcbiAgICAgICAgICAgICAgICB0aWxlLmJvdHRsZSA9IGJvdHRsZXNbMF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRpbGUuYm90dGxlID0gdGlsZS5ib3R0bGUgfHwgdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGFtYWdlcyBhbGwgcGlhbm9zIDEgZGFtYWdlLCBhY2NlbGVyYXRpbmcgdGhlIGdhbWVcbiAgICAgKi9cbiAgICBwcml2YXRlIHJlc2V0UGlhbm9QbGF5aW5nKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGZ1cm5pc2hpbmcgb2YgdGhpcy5nYW1lLmZ1cm5pc2hpbmdzKSB7XG4gICAgICAgICAgICBpZiAoZnVybmlzaGluZy5pc0Rlc3Ryb3llZCB8fCAhZnVybmlzaGluZy5pc1BpYW5vKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIGl0J3MgYSBub24gZGVzdHJveWVkIHBpYW5vXG4gICAgICAgICAgICBmdXJuaXNoaW5nLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGFtYWdlcyBhbGwgY293Ym95cyB3aGljaCBhcmUgc3RhbmRpbmcgb24gYSBoYXphcmRcbiAgICAgKi9cbiAgICBwcml2YXRlIGFwcGx5SGF6YXJkRGFtYWdlKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGNvd2JveSBvZiB0aGlzLmdhbWUuY293Ym95cykge1xuICAgICAgICAgICAgaWYgKGNvd2JveS50aWxlICYmIGNvd2JveS50aWxlLmhhc0hhemFyZCkge1xuICAgICAgICAgICAgICAgIGNvd2JveS5kYW1hZ2UoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG59XG4iXX0=