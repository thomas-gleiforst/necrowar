"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spider_1 = require("./spider");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
/**
 * A Spider spawned by the BroodMother.
 */
class Spiderling extends spider_1.Spider {
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Spiderling is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: attributes -->>
        /**
         * The other Spiderlings working on the same task this Spiderling is busy
         * with.
         */
        this.coworkers = new Set();
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /** Kills the Spiderling */
    kill() {
        super.kill();
        this.busy = "";
        this.workRemaining = -1;
        this.movingToNest = undefined;
        for (const coworker of this.coworkers) {
            coworker.coworkers.delete(this);
            coworker.numberOfCoworkers = coworker.coworkers.size;
        }
        this.coworkers.clear();
        this.numberOfCoworkers = 0;
        if (this.movingOnWeb) {
            utils_1.removeElements(this.movingOnWeb.spiderlings, this);
            this.movingOnWeb = undefined;
        }
    }
    /**
     * Tells the Spiderling to finish what it is doing
     * (moving, cutting, spitting, weaving)
     *   Note: coworkers are finished in the Game class, not here
     *
     * @param forceFinish - True if the task was not finished by THIS spiderling
     * @returns true if finished, false otherwise
     */
    finish(forceFinish = false) {
        const finishing = this.busy;
        this.busy = "";
        this.workRemaining = 0;
        if (finishing === "Moving") {
            if (!this.movingToNest || !this.movingOnWeb) {
                throw new Error(`${this} finished Moving but to no web!`);
            }
            this.nest = this.movingToNest;
            this.nest.spiders.push(this);
            utils_1.removeElements(this.movingOnWeb.spiderlings, this);
            this.movingOnWeb.addLoad(-1);
            this.movingToNest = undefined;
            this.movingOnWeb = undefined;
            const enemyBroodMother = this.owner.opponent.broodMother;
            if (this.nest === enemyBroodMother.nest) {
                // then we reached the enemy's BroodMother! Kamikaze into her!
                enemyBroodMother.health = Math.max(enemyBroodMother.health - 1, 0);
                if (enemyBroodMother.health === 0) {
                    enemyBroodMother.isDead = true;
                }
                this.kill();
            }
            return true;
        }
        else if (finishing === "Attacking") {
            return true;
        }
        else { // they finished doing a different action (cut, weave, spit)
            this.coworkers.clear();
            this.numberOfCoworkers = this.coworkers.size;
            return false;
        }
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for attack. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param spiderling - The Spiderling to attack.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAttack(player, spiderling) {
        // <<-- Creer-Merge: invalidate-attack -->>
        const invalid = super.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!spiderling) {
            return `${this} cannot attack because '${spiderling}' is not a Spiderling.`;
        }
        if (spiderling.nest !== this.nest) {
            return `${this} cannot attack because '${spiderling}' is not on the same Nest as itself.`;
        }
        if (this === spiderling) {
            return `${this} cannot attack itself.`;
        }
        if (spiderling.isDead) {
            return `${this} cannot attack because'${spiderling}' is dead.`;
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks another Spiderling
     *
     * @param player - The player that called this.
     * @param spiderling - The Spiderling to attack.
     * @returns True if the attack was successful, false otherwise.
     */
    async attack(player, spiderling) {
        // <<-- Creer-Merge: attack -->>
        // Rock Paper Scissors
        // Cutter > Weaver > Spitter > Cutter
        // Ties, both die
        if (this.gameObjectName === spiderling.gameObjectName) { // they are the same type, so
            this.kill();
            spiderling.kill();
        }
        if ((this.gameObjectName === "Cutter" && spiderling.gameObjectName === "Weaver") ||
            (this.gameObjectName === "Weaver" && spiderling.gameObjectName === "Spitter") ||
            (this.gameObjectName === "Spitter" && spiderling.gameObjectName === "Cutter")) {
            spiderling.kill();
        }
        if ((spiderling.gameObjectName === "Cutter" && this.gameObjectName === "Weaver") ||
            (spiderling.gameObjectName === "Weaver" && this.gameObjectName === "Spitter") ||
            (spiderling.gameObjectName === "Spitter" && this.gameObjectName === "Cutter")) {
            this.kill();
        }
        if (!this.isDead) {
            this.busy = "Attacking"; // so they cannot attack again
            this.workRemaining = 1;
        }
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param web - The Web you want to move across to the other Nest.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, web) {
        // <<-- Creer-Merge: invalidate-move -->>
        const invalid = super.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!web) {
            return `${web} is not a Web for ${this} to move on.`;
        }
        if (!this.nest) {
            return `${this} is not on a Nest to move from`;
        }
        if (!web.isConnectedTo(this.nest)) {
            return `${web} is not connected to ${this.nest} for ${this} to move on.`;
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Starts moving the Spiderling across a Web to another Nest.
     *
     * @param player - The player that called this.
     * @param web - The Web you want to move across to the other Nest.
     * @returns True if the move was successful, false otherwise.
     */
    async move(player, web) {
        // <<-- Creer-Merge: move -->>
        if (!this.nest) {
            throw new Error(`${this} told to move without being on a Nest.`);
        }
        this.busy = "Moving";
        this.workRemaining = Math.ceil(web.length / this.game.movementSpeed);
        this.movingOnWeb = web;
        this.movingToNest = web.getOtherNest(this.nest);
        utils_1.removeElements(this.nest.spiders, this);
        this.nest = undefined;
        web.spiderlings.push(this);
        web.addLoad(1);
        return true;
        // <<-- /Creer-Merge: move -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Invalidates base logic for any spider to do anything.
     *
     * @param player - The player trying to command this Spiderling.
     * @returns A string if an invalid reason was found, undefined otherwise.
     */
    invalidate(player) {
        const invalid = super.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (this.busy) {
            return `${this} is already busy with '${this.busy}'.`;
        }
    }
}
exports.Spiderling = Spiderling;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpZGVybGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zcGlkZXJzL3NwaWRlcmxpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxxQ0FBa0M7QUFHbEMsaUNBQWlDO0FBQ2pDLG1DQUF5QztBQVN6Qzs7R0FFRztBQUNILE1BQWEsVUFBVyxTQUFRLGVBQU07SUFxQ2xDLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUF4QjFCLG9DQUFvQztRQUVwQzs7O1dBR0c7UUFDYSxjQUFTLEdBQUcsSUFBSSxHQUFHLEVBQWMsQ0FBQztRQW9COUMscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQywyQkFBMkI7SUFDcEIsSUFBSTtRQUNQLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUViLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUU5QixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsUUFBUSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1NBQ3hEO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBRTNCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNsQixzQkFBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMs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QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUV0QixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWYsT0FBTyxJQUFJLENBQUM7UUFFWiwrQkFBK0I7SUFDbkMsQ0FBQztJQUVELHFEQUFxRDtJQUVyRDs7Ozs7T0FLRztJQUNPLFVBQVUsQ0FBQyxNQUFjO1FBQy9CLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNYLE9BQU8sR0FBRyxJQUFJLDBCQUEwQixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUM7U0FDekQ7SUFDTCxDQUFDO0NBR0o7QUF2VEQsZ0NBdVRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJU3BpZGVybGluZ0F0dGFja0FyZ3MsIElTcGlkZXJsaW5nTW92ZUFyZ3MsIElTcGlkZXJsaW5nUHJvcGVydGllcyxcbiAgICAgICAgIFNwaWRlckFyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IE5lc3QgfSBmcm9tIFwiLi9uZXN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFNwaWRlciB9IGZyb20gXCIuL3NwaWRlclwiO1xuaW1wb3J0IHsgV2ViIH0gZnJvbSBcIi4vd2ViXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuaW1wb3J0IHsgcmVtb3ZlRWxlbWVudHMgfSBmcm9tIFwifi91dGlsc1wiO1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIFdoZW4gZW1wdHkgc3RyaW5nIHRoaXMgU3BpZGVybGluZyBpcyBub3QgYnVzeSwgYW5kIGNhbiBhY3QuIE90aGVyd2lzZSBhXG4gKiBzdHJpbmcgcmVwcmVzZW50aW5nIHdoYXQgaXQgaXMgYnVzeSB3aXRoLCBlLmcuICdNb3ZpbmcnLCAnQXR0YWNraW5nJy5cbiAqL1xuZXhwb3J0IHR5cGUgU3BpZGVybGluZ0J1c3kgPSBcIlwiIHwgXCJNb3ZpbmdcIiB8IFwiQXR0YWNraW5nXCIgfCBcIlN0cmVuZ3RoZW5pbmdcIiB8IFwiV2Vha2VuaW5nXCIgfCBcIkN1dHRpbmdcIiB8IFwiU3BpdHRpbmdcIjtcblxuLyoqXG4gKiBBIFNwaWRlciBzcGF3bmVkIGJ5IHRoZSBCcm9vZE1vdGhlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwaWRlcmxpbmcgZXh0ZW5kcyBTcGlkZXIge1xuICAgIC8qKlxuICAgICAqIFdoZW4gZW1wdHkgc3RyaW5nIHRoaXMgU3BpZGVybGluZyBpcyBub3QgYnVzeSwgYW5kIGNhbiBhY3QuIE90aGVyd2lzZSBhXG4gICAgICogc3RyaW5nIHJlcHJlc2VudGluZyB3aGF0IGl0IGlzIGJ1c3kgd2l0aCwgZS5nLiAnTW92aW5nJywgJ0F0dGFja2luZycuXG4gICAgICovXG4gICAgcHVibGljIGJ1c3khOiBcIlwiIHwgXCJNb3ZpbmdcIiB8IFwiQXR0YWNraW5nXCIgfCBcIlN0cmVuZ3RoZW5pbmdcIiB8IFwiV2Vha2VuaW5nXCIgfCBcIkN1dHRpbmdcIiB8IFwiU3BpdHRpbmdcIjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBXZWIgdGhpcyBTcGlkZXJsaW5nIGlzIHVzaW5nIHRvIG1vdmUuIFVuZGVmaW5lZCBpZiBpdCBpcyBub3QgbW92aW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZpbmdPbldlYj86IFdlYjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBOZXN0IHRoaXMgU3BpZGVybGluZyBpcyBtb3ZpbmcgdG8uIFVuZGVmaW5lZCBpZiBpdCBpcyBub3QgbW92aW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZpbmdUb05lc3Q/OiBOZXN0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBTcGlkZXJsaW5ncyBidXN5IHdpdGggdGhlIHNhbWUgd29yayB0aGlzIFNwaWRlcmxpbmcgaXNcbiAgICAgKiBkb2luZywgc3BlZWRpbmcgdXAgdGhlIHRhc2suXG4gICAgICovXG4gICAgcHVibGljIG51bWJlck9mQ293b3JrZXJzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSG93IG11Y2ggd29yayBuZWVkcyB0byBiZSBkb25lIGZvciB0aGlzIFNwaWRlcmxpbmcgdG8gZmluaXNoIGJlaW5nIGJ1c3kuXG4gICAgICogU2VlIGRvY3MgZm9yIHRoZSBXb3JrIGZvcnVtbGEuXG4gICAgICovXG4gICAgcHVibGljIHdvcmtSZW1haW5pbmchOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRoZSBvdGhlciBTcGlkZXJsaW5ncyB3b3JraW5nIG9uIHRoZSBzYW1lIHRhc2sgdGhpcyBTcGlkZXJsaW5nIGlzIGJ1c3lcbiAgICAgKiB3aXRoLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjb3dvcmtlcnMgPSBuZXcgU2V0PFNwaWRlcmxpbmc+KCk7XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFNwaWRlcmxpbmcgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8U3BpZGVyQXJncyAmIElTcGlkZXJsaW5nUHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgbW9yZSBjb25zdHJ1Y3RvciBhcmdzIGluIGhlcmVcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqIEtpbGxzIHRoZSBTcGlkZXJsaW5nICovXG4gICAgcHVibGljIGtpbGwoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmtpbGwoKTtcblxuICAgICAgICB0aGlzLmJ1c3kgPSBcIlwiO1xuICAgICAgICB0aGlzLndvcmtSZW1haW5pbmcgPSAtMTtcbiAgICAgICAgdGhpcy5tb3ZpbmdUb05lc3QgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgZm9yIChjb25zdCBjb3dvcmtlciBvZiB0aGlzLmNvd29ya2Vycykge1xuICAgICAgICAgICAgY293b3JrZXIuY293b3JrZXJzLmRlbGV0ZSh0aGlzKTtcbiAgICAgICAgICAgIGNvd29ya2VyLm51bWJlck9mQ293b3JrZXJzID0gY293b3JrZXIuY293b3JrZXJzLnNpemU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvd29ya2Vycy5jbGVhcigpO1xuICAgICAgICB0aGlzLm51bWJlck9mQ293b3JrZXJzID0gMDtcblxuICAgICAgICBpZiAodGhpcy5tb3ZpbmdPbldlYikge1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5tb3ZpbmdPbldlYi5zcGlkZXJsaW5ncywgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLm1vdmluZ09uV2ViID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVsbHMgdGhlIFNwaWRlcmxpbmcgdG8gZmluaXNoIHdoYXQgaXQgaXMgZG9pbmdcbiAgICAgKiAobW92aW5nLCBjdXR0aW5nLCBzcGl0dGluZywgd2VhdmluZylcbiAgICAgKiAgIE5vdGU6IGNvd29ya2VycyBhcmUgZmluaXNoZWQgaW4gdGhlIEdhbWUgY2xhc3MsIG5vdCBoZXJlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9yY2VGaW5pc2ggLSBUcnVlIGlmIHRoZSB0YXNrIHdhcyBub3QgZmluaXNoZWQgYnkgVEhJUyBzcGlkZXJsaW5nXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBmaW5pc2hlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGZpbmlzaChmb3JjZUZpbmlzaDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IGZpbmlzaGluZyA9IHRoaXMuYnVzeTtcbiAgICAgICAgdGhpcy5idXN5ID0gXCJcIjtcbiAgICAgICAgdGhpcy53b3JrUmVtYWluaW5nID0gMDtcblxuICAgICAgICBpZiAoZmluaXNoaW5nID09PSBcIk1vdmluZ1wiKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubW92aW5nVG9OZXN0IHx8ICF0aGlzLm1vdmluZ09uV2ViKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXN9IGZpbmlzaGVkIE1vdmluZyBidXQgdG8gbm8gd2ViIWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5uZXN0ID0gdGhpcy5tb3ZpbmdUb05lc3Q7XG4gICAgICAgICAgICB0aGlzLm5lc3Quc3BpZGVycy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5tb3ZpbmdPbldlYi5zcGlkZXJsaW5ncywgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLm1vdmluZ09uV2ViLmFkZExvYWQoLTEpO1xuXG4gICAgICAgICAgICB0aGlzLm1vdmluZ1RvTmVzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMubW92aW5nT25XZWIgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGVuZW15QnJvb2RNb3RoZXIgPSB0aGlzLm93bmVyLm9wcG9uZW50LmJyb29kTW90aGVyO1xuICAgICAgICAgICAgaWYgKHRoaXMubmVzdCA9PT0gZW5lbXlCcm9vZE1vdGhlci5uZXN0KSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSByZWFjaGVkIHRoZSBlbmVteSdzIEJyb29kTW90aGVyISBLYW1pa2F6ZSBpbnRvIGhlciFcbiAgICAgICAgICAgICAgICBlbmVteUJyb29kTW90aGVyLmhlYWx0aCA9IE1hdGgubWF4KGVuZW15QnJvb2RNb3RoZXIuaGVhbHRoIC0gMSwgMCk7XG4gICAgICAgICAgICAgICAgaWYgKGVuZW15QnJvb2RNb3RoZXIuaGVhbHRoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZW15QnJvb2RNb3RoZXIuaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5raWxsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpbmlzaGluZyA9PT0gXCJBdHRhY2tpbmdcIikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIHRoZXkgZmluaXNoZWQgZG9pbmcgYSBkaWZmZXJlbnQgYWN0aW9uIChjdXQsIHdlYXZlLCBzcGl0KVxuICAgICAgICAgICAgdGhpcy5jb3dvcmtlcnMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZDb3dvcmtlcnMgPSB0aGlzLmNvd29ya2Vycy5zaXplO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGF0dGFjay4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gc3BpZGVybGluZyAtIFRoZSBTcGlkZXJsaW5nIHRvIGF0dGFjay5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVBdHRhY2soXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBzcGlkZXJsaW5nOiBTcGlkZXJsaW5nLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJU3BpZGVybGluZ0F0dGFja0FyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHN1cGVyLmludmFsaWRhdGUocGxheWVyKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzcGlkZXJsaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGF0dGFjayBiZWNhdXNlICcke3NwaWRlcmxpbmd9JyBpcyBub3QgYSBTcGlkZXJsaW5nLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3BpZGVybGluZy5uZXN0ICE9PSB0aGlzLm5lc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgYXR0YWNrIGJlY2F1c2UgJyR7c3BpZGVybGluZ30nIGlzIG5vdCBvbiB0aGUgc2FtZSBOZXN0IGFzIGl0c2VsZi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMgPT09IHNwaWRlcmxpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgYXR0YWNrIGl0c2VsZi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNwaWRlcmxpbmcuaXNEZWFkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGF0dGFjayBiZWNhdXNlJyR7c3BpZGVybGluZ30nIGlzIGRlYWQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNrcyBhbm90aGVyIFNwaWRlcmxpbmdcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHNwaWRlcmxpbmcgLSBUaGUgU3BpZGVybGluZyB0byBhdHRhY2suXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgYXR0YWNrIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGF0dGFjayhcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHNwaWRlcmxpbmc6IFNwaWRlcmxpbmcsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dGFjayAtLT4+XG5cbiAgICAgICAgLy8gUm9jayBQYXBlciBTY2lzc29yc1xuICAgICAgICAvLyBDdXR0ZXIgPiBXZWF2ZXIgPiBTcGl0dGVyID4gQ3V0dGVyXG4gICAgICAgIC8vIFRpZXMsIGJvdGggZGllXG5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZU9iamVjdE5hbWUgPT09IHNwaWRlcmxpbmcuZ2FtZU9iamVjdE5hbWUpIHsgLy8gdGhleSBhcmUgdGhlIHNhbWUgdHlwZSwgc29cbiAgICAgICAgICAgIHRoaXMua2lsbCgpO1xuICAgICAgICAgICAgc3BpZGVybGluZy5raWxsKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodGhpcy5nYW1lT2JqZWN0TmFtZSA9PT0gXCJDdXR0ZXJcIiAmJiBzcGlkZXJsaW5nLmdhbWVPYmplY3ROYW1lID09PSBcIldlYXZlclwiKSB8fFxuICAgICAgICAgICAgKHRoaXMuZ2FtZU9iamVjdE5hbWUgPT09IFwiV2VhdmVyXCIgJiYgc3BpZGVybGluZy5nYW1lT2JqZWN0TmFtZSA9PT0gXCJTcGl0dGVyXCIpIHx8XG4gICAgICAgICAgICAodGhpcy5nYW1lT2JqZWN0TmFtZSA9PT0gXCJTcGl0dGVyXCIgJiYgc3BpZGVybGluZy5nYW1lT2JqZWN0TmFtZSA9PT0gXCJDdXR0ZXJcIilcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBzcGlkZXJsaW5nLmtpbGwoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIChzcGlkZXJsaW5nLmdhbWVPYmplY3ROYW1lID09PSBcIkN1dHRlclwiICYmIHRoaXMuZ2FtZU9iamVjdE5hbWUgPT09IFwiV2VhdmVyXCIpIHx8XG4gICAgICAgICAgICAoc3BpZGVybGluZy5nYW1lT2JqZWN0TmFtZSA9PT0gXCJXZWF2ZXJcIiAmJiB0aGlzLmdhbWVPYmplY3ROYW1lID09PSBcIlNwaXR0ZXJcIikgfHxcbiAgICAgICAgICAgIChzcGlkZXJsaW5nLmdhbWVPYmplY3ROYW1lID09PSBcIlNwaXR0ZXJcIiAmJiB0aGlzLmdhbWVPYmplY3ROYW1lID09PSBcIkN1dHRlclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMua2lsbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzRGVhZCkge1xuICAgICAgICAgICAgdGhpcy5idXN5ID0gXCJBdHRhY2tpbmdcIjsgLy8gc28gdGhleSBjYW5ub3QgYXR0YWNrIGFnYWluXG4gICAgICAgICAgICB0aGlzLndvcmtSZW1haW5pbmcgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBtb3ZlLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB3ZWIgLSBUaGUgV2ViIHlvdSB3YW50IHRvIG1vdmUgYWNyb3NzIHRvIHRoZSBvdGhlciBOZXN0LlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZU1vdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB3ZWI6IFdlYixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVNwaWRlcmxpbmdNb3ZlQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHN1cGVyLmludmFsaWRhdGUocGxheWVyKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3ZWIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt3ZWJ9IGlzIG5vdCBhIFdlYiBmb3IgJHt0aGlzfSB0byBtb3ZlIG9uLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIE5lc3QgdG8gbW92ZSBmcm9tYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2ViLmlzQ29ubmVjdGVkVG8odGhpcy5uZXN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3dlYn0gaXMgbm90IGNvbm5lY3RlZCB0byAke3RoaXMubmVzdH0gZm9yICR7dGhpc30gdG8gbW92ZSBvbi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIG1vdmluZyB0aGUgU3BpZGVybGluZyBhY3Jvc3MgYSBXZWIgdG8gYW5vdGhlciBOZXN0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gd2ViIC0gVGhlIFdlYiB5b3Ugd2FudCB0byBtb3ZlIGFjcm9zcyB0byB0aGUgb3RoZXIgTmVzdC5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBtb3ZlIHdhcyBzdWNjZXNzZnVsLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIG1vdmUocGxheWVyOiBQbGF5ZXIsIHdlYjogV2ViKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy5uZXN0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gdG9sZCB0byBtb3ZlIHdpdGhvdXQgYmVpbmcgb24gYSBOZXN0LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5idXN5ID0gXCJNb3ZpbmdcIjtcbiAgICAgICAgdGhpcy53b3JrUmVtYWluaW5nID0gTWF0aC5jZWlsKHdlYi5sZW5ndGggLyB0aGlzLmdhbWUubW92ZW1lbnRTcGVlZCk7XG5cbiAgICAgICAgdGhpcy5tb3ZpbmdPbldlYiA9IHdlYjtcbiAgICAgICAgdGhpcy5tb3ZpbmdUb05lc3QgPSB3ZWIuZ2V0T3RoZXJOZXN0KHRoaXMubmVzdCk7XG5cbiAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5uZXN0LnNwaWRlcnMsIHRoaXMpO1xuICAgICAgICB0aGlzLm5lc3QgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgd2ViLnNwaWRlcmxpbmdzLnB1c2godGhpcyk7XG4gICAgICAgIHdlYi5hZGRMb2FkKDEpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0ZXMgYmFzZSBsb2dpYyBmb3IgYW55IHNwaWRlciB0byBkbyBhbnl0aGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRyeWluZyB0byBjb21tYW5kIHRoaXMgU3BpZGVybGluZy5cbiAgICAgKiBAcmV0dXJucyBBIHN0cmluZyBpZiBhbiBpbnZhbGlkIHJlYXNvbiB3YXMgZm91bmQsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGUocGxheWVyOiBQbGF5ZXIpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBjb25zdCBpbnZhbGlkID0gc3VwZXIuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5idXN5KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgYWxyZWFkeSBidXN5IHdpdGggJyR7dGhpcy5idXN5fScuYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19