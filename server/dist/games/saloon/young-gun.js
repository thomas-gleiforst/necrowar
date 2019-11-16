"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * An eager young person that wants to join your gang, and will call in the
 * veteran Cowboys you need to win the brawl in the saloon.
 */
class YoungGun extends game_object_1.GameObject {
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a YoungGun is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.owner = args.owner;
        this.tile = args.tile;
        this.previousTile = args.previousTile;
        this.callInTile = args.tile; // will be over-ridden next
        this.update();
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Updates Young Gun related logic: moving them clockwise
     */
    update() {
        this.canCallIn = true; // they can call in a cowboy on their next turn
        // find the adjacent tile that they were not on last turn,
        //   this way all YoungGuns continue walking clockwise
        const tiles = this.tile.getNeighbors();
        const moveTo = tiles.find((tile) => tile.isBalcony && this.previousTile !== tile);
        if (!moveTo) {
            throw new Error(`${this} cannot move to a new Tile!`);
        }
        // do a quick BFS to find the callInTile
        const searchTiles = [moveTo];
        const searched = new Set();
        while (searchTiles.length > 0) {
            const searchTile = searchTiles.shift(); // will exist because above check
            if (!searched.has(searchTile)) {
                searched.add(searchTile);
                if (searchTile.isBalcony) { // add its neighbors to be searched
                    searchTiles.push(...searchTile.getNeighbors());
                }
                else {
                    this.callInTile = searchTile;
                    break; // we found it
                }
            }
        }
        this.previousTile = this.tile;
        this.tile.youngGun = undefined;
        this.tile = moveTo;
        moveTo.youngGun = this;
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for callIn. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param job - The job you want the Cowboy being brought to have.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateCallIn(player, job) {
        // <<-- Creer-Merge: invalidate-callIn -->>
        if (!this.canCallIn) {
            return `${this} cannot call in any more Cowboys this turn.`;
        }
        // make sure they are not trying to go above the limit
        const count = this.owner.cowboys.filter((c) => c.job === job && !c.isDead).length;
        if (count >= this.game.maxCowboysPerJob) {
            return `You cannot call in any more '${job}' Cowboys (max of ${this.game.maxCowboysPerJob})`;
        }
        // <<-- /Creer-Merge: invalidate-callIn -->>
    }
    /**
     * Tells the YoungGun to call in a new Cowboy of the given job to the open
     * Tile nearest to them.
     *
     * @param player - The player that called this.
     * @param job - The job you want the Cowboy being brought to have.
     * @returns The new Cowboy that was called in if valid. They will not be
     * added to any `cowboys` lists until the turn ends. Undefined otherwise.
     */
    async callIn(player, job) {
        // <<-- Creer-Merge: callIn -->>
        // clear the open tile before moving the young gun to it
        if (this.callInTile.cowboy) {
            this.callInTile.cowboy.damage(Infinity);
        }
        if (this.callInTile.furnishing) {
            this.callInTile.furnishing.damage(Infinity);
        }
        this.canCallIn = false;
        const cowboy = this.manager.create.cowboy({
            owner: this.owner,
            job,
            tile: this.callInTile,
            canMove: false,
        });
        if (this.callInTile.bottle) {
            // then break the bottle on this new cowboy, so he immediately gets drunk
            this.callInTile.bottle.break(cowboy);
        }
        this.callInTile.cowboy = cowboy;
        return cowboy;
        // <<-- /Creer-Merge: callIn -->>
    }
}
exports.YoungGun = YoungGun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieW91bmctZ3VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NhbG9vbi95b3VuZy1ndW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwrQ0FBMkM7QUFJM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7OztHQUdHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsd0JBQVU7SUEyQnBDLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFTRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLDJCQUEyQjtRQUN4RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQzs7T0FFRztJQUNJLE1BQU07UUFDVCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLCtDQUErQztRQUV0RSwwREFBMEQ7UUFDMUQsc0RBQXNEO1FBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdkMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDO1FBRWxGLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxNQUFNLElB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LElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVoQyxPQUFPLE1BQU0sQ0FBQztRQUVkLGlDQUFpQztJQUNyQyxDQUFDO0NBT0o7QUF2TEQsNEJBdUxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJWW91bmdHdW5DYWxsSW5BcmdzLCBJWW91bmdHdW5Qcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBDb3dib3kgfSBmcm9tIFwiLi9jb3dib3lcIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBbiBlYWdlciB5b3VuZyBwZXJzb24gdGhhdCB3YW50cyB0byBqb2luIHlvdXIgZ2FuZywgYW5kIHdpbGwgY2FsbCBpbiB0aGVcbiAqIHZldGVyYW4gQ293Ym95cyB5b3UgbmVlZCB0byB3aW4gdGhlIGJyYXdsIGluIHRoZSBzYWxvb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBZb3VuZ0d1biBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRoYXQgYSBDb3dib3kgd2lsbCBiZSBjYWxsZWQgaW4gb24gaWYgdGhpcyBZb3VuZ0d1biBjYWxscyBpbiBhXG4gICAgICogQ293Ym95LlxuICAgICAqL1xuICAgIHB1YmxpYyBjYWxsSW5UaWxlOiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVHJ1ZSBpZiB0aGUgWW91bmdHdW4gY2FuIGNhbGwgaW4gYSBDb3dib3ksIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2FuQ2FsbEluITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBQbGF5ZXIgdGhhdCBvd25zIGFuZCBjYW4gY29udHJvbCB0aGlzIFlvdW5nR3VuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBvd25lcjogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdGhpcyBZb3VuZ0d1biBpcyBjdXJyZW50bHkgb24uXG4gICAgICovXG4gICAgcHVibGljIHRpbGU6IFRpbGU7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKiBUaGUgcHJldmlvdXMgdGlsZSB0aGlzIFlvdW5nIEd1biBjYW1lIGZyb20gKi9cbiAgICBwdWJsaWMgcHJldmlvdXNUaWxlOiBUaWxlO1xuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBZb3VuZ0d1biBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxJWW91bmdHdW5Qcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvKiogVGhlIGNvbnRyb2xsaW5nIFBsYXllciBvZiB0aGlzIFlvdW5nR3VuLiAqL1xuICAgICAgICAgICAgb3duZXI6IFBsYXllcjtcbiAgICAgICAgICAgIC8qKiBUaGUgVGlsZSB0byBzcGF3biB0aGlzIFlvdW5nR3VuIHVwb24uICovXG4gICAgICAgICAgICB0aWxlOiBUaWxlO1xuICAgICAgICAgICAgLyoqIFRoZSBwcmV2aW91cyBUaWxlIGhlIHdvdWxkIGhhdmUgbW92ZWQgZnJvbSwgdXNlZCB0byBmaWd1cmUgb3V0IG1vdmVtZW50IGRpcmVjdGlvbi4gKi9cbiAgICAgICAgICAgIHByZXZpb3VzVGlsZTogVGlsZTtcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICB0aGlzLm93bmVyID0gYXJncy5vd25lcjtcbiAgICAgICAgdGhpcy50aWxlID0gYXJncy50aWxlO1xuICAgICAgICB0aGlzLnByZXZpb3VzVGlsZSA9IGFyZ3MucHJldmlvdXNUaWxlO1xuICAgICAgICB0aGlzLmNhbGxJblRpbGUgPSBhcmdzLnRpbGU7IC8vIHdpbGwgYmUgb3Zlci1yaWRkZW4gbmV4dFxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBZb3VuZyBHdW4gcmVsYXRlZCBsb2dpYzogbW92aW5nIHRoZW0gY2xvY2t3aXNlXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jYW5DYWxsSW4gPSB0cnVlOyAvLyB0aGV5IGNhbiBjYWxsIGluIGEgY293Ym95IG9uIHRoZWlyIG5leHQgdHVyblxuXG4gICAgICAgIC8vIGZpbmQgdGhlIGFkamFjZW50IHRpbGUgdGhhdCB0aGV5IHdlcmUgbm90IG9uIGxhc3QgdHVybixcbiAgICAgICAgLy8gICB0aGlzIHdheSBhbGwgWW91bmdHdW5zIGNvbnRpbnVlIHdhbGtpbmcgY2xvY2t3aXNlXG4gICAgICAgIGNvbnN0IHRpbGVzID0gdGhpcy50aWxlLmdldE5laWdoYm9ycygpO1xuICAgICAgICBjb25zdCBtb3ZlVG8gPSB0aWxlcy5maW5kKCh0aWxlKSA9PiB0aWxlLmlzQmFsY29ueSAmJiB0aGlzLnByZXZpb3VzVGlsZSAhPT0gdGlsZSk7XG5cbiAgICAgICAgaWYgKCFtb3ZlVG8pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBjYW5ub3QgbW92ZSB0byBhIG5ldyBUaWxlIWApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG8gYSBxdWljayBCRlMgdG8gZmluZCB0aGUgY2FsbEluVGlsZVxuICAgICAgICBjb25zdCBzZWFyY2hUaWxlcyA9IFsgbW92ZVRvIF07XG4gICAgICAgIGNvbnN0IHNlYXJjaGVkID0gbmV3IFNldCgpO1xuICAgICAgICB3aGlsZSAoc2VhcmNoVGlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoVGlsZSA9IHNlYXJjaFRpbGVzLnNoaWZ0KCkgYXMgVGlsZTsgLy8gd2lsbCBleGlzdCBiZWNhdXNlIGFib3ZlIGNoZWNrXG5cbiAgICAgICAgICAgIGlmICghc2VhcmNoZWQuaGFzKHNlYXJjaFRpbGUpKSB7XG4gICAgICAgICAgICAgICAgc2VhcmNoZWQuYWRkKHNlYXJjaFRpbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlYXJjaFRpbGUuaXNCYWxjb255KSB7IC8vIGFkZCBpdHMgbmVpZ2hib3JzIHRvIGJlIHNlYXJjaGVkXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFRpbGVzLnB1c2goLi4uc2VhcmNoVGlsZS5nZXROZWlnaGJvcnMoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbGxJblRpbGUgPSBzZWFyY2hUaWxlO1xuICAgICAgICAgICAgICAgICAgICBicmVhazsgLy8gd2UgZm91bmQgaXRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZXZpb3VzVGlsZSA9IHRoaXMudGlsZTtcbiAgICAgICAgdGhpcy50aWxlLnlvdW5nR3VuID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnRpbGUgPSBtb3ZlVG87XG4gICAgICAgIG1vdmVUby55b3VuZ0d1biA9IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBjYWxsSW4uIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGpvYiAtIFRoZSBqb2IgeW91IHdhbnQgdGhlIENvd2JveSBiZWluZyBicm91Z2h0IHRvIGhhdmUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlQ2FsbEluKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgam9iOiBcIkJhcnRlbmRlclwiIHwgXCJCcmF3bGVyXCIgfCBcIlNoYXJwc2hvb3RlclwiLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJWW91bmdHdW5DYWxsSW5BcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1jYWxsSW4gLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy5jYW5DYWxsSW4pIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgY2FsbCBpbiBhbnkgbW9yZSBDb3dib3lzIHRoaXMgdHVybi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZXkgYXJlIG5vdCB0cnlpbmcgdG8gZ28gYWJvdmUgdGhlIGxpbWl0XG4gICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5vd25lci5jb3dib3lzLmZpbHRlcigoYykgPT4gYy5qb2IgPT09IGpvYiAmJiAhYy5pc0RlYWQpLmxlbmd0aDtcbiAgICAgICAgaWYgKGNvdW50ID49IHRoaXMuZ2FtZS5tYXhDb3dib3lzUGVySm9iKSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBjYW5ub3QgY2FsbCBpbiBhbnkgbW9yZSAnJHtqb2J9JyBDb3dib3lzIChtYXggb2YgJHt0aGlzLmdhbWUubWF4Q293Ym95c1BlckpvYn0pYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWNhbGxJbiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVsbHMgdGhlIFlvdW5nR3VuIHRvIGNhbGwgaW4gYSBuZXcgQ293Ym95IG9mIHRoZSBnaXZlbiBqb2IgdG8gdGhlIG9wZW5cbiAgICAgKiBUaWxlIG5lYXJlc3QgdG8gdGhlbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGpvYiAtIFRoZSBqb2IgeW91IHdhbnQgdGhlIENvd2JveSBiZWluZyBicm91Z2h0IHRvIGhhdmUuXG4gICAgICogQHJldHVybnMgVGhlIG5ldyBDb3dib3kgdGhhdCB3YXMgY2FsbGVkIGluIGlmIHZhbGlkLiBUaGV5IHdpbGwgbm90IGJlXG4gICAgICogYWRkZWQgdG8gYW55IGBjb3dib3lzYCBsaXN0cyB1bnRpbCB0aGUgdHVybiBlbmRzLiBVbmRlZmluZWQgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBjYWxsSW4oXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBqb2I6IFwiQmFydGVuZGVyXCIgfCBcIkJyYXdsZXJcIiB8IFwiU2hhcnBzaG9vdGVyXCIsXG4gICAgKTogUHJvbWlzZTxDb3dib3kgfCB1bmRlZmluZWQ+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY2FsbEluIC0tPj5cblxuICAgICAgICAvLyBjbGVhciB0aGUgb3BlbiB0aWxlIGJlZm9yZSBtb3ZpbmcgdGhlIHlvdW5nIGd1biB0byBpdFxuICAgICAgICBpZiAodGhpcy5jYWxsSW5UaWxlLmNvd2JveSkge1xuICAgICAgICAgICAgdGhpcy5jYWxsSW5UaWxlLmNvd2JveS5kYW1hZ2UoSW5maW5pdHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2FsbEluVGlsZS5mdXJuaXNoaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxJblRpbGUuZnVybmlzaGluZy5kYW1hZ2UoSW5maW5pdHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYW5DYWxsSW4gPSBmYWxzZTtcblxuICAgICAgICBjb25zdCBjb3dib3kgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLmNvd2JveSh7XG4gICAgICAgICAgICBvd25lcjogdGhpcy5vd25lcixcbiAgICAgICAgICAgIGpvYixcbiAgICAgICAgICAgIHRpbGU6IHRoaXMuY2FsbEluVGlsZSxcbiAgICAgICAgICAgIGNhbk1vdmU6IGZhbHNlLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5jYWxsSW5UaWxlLmJvdHRsZSkge1xuICAgICAgICAgICAgLy8gdGhlbiBicmVhayB0aGUgYm90dGxlIG9uIHRoaXMgbmV3IGNvd2JveSwgc28gaGUgaW1tZWRpYXRlbHkgZ2V0cyBkcnVua1xuICAgICAgICAgICAgdGhpcy5jYWxsSW5UaWxlLmJvdHRsZS5icmVhayhjb3dib3kpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWxsSW5UaWxlLmNvd2JveSA9IGNvd2JveTtcblxuICAgICAgICByZXR1cm4gY293Ym95O1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjYWxsSW4gLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==