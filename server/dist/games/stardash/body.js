"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
/**
 * A celestial body located within the game.
 */
class Body extends game_object_1.GameObject {
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Body is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.angle = args.angle;
        this.distance = args.distance;
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Gets the x value of the asteroid at the current angle and distance.
     *
     * @param offset: the difference in angle you wish to apply. By base 0.
     *
     * @returns the x value at it's distance and angle
     */
    getX(offset = 0) {
        // gets the location of the asteroid at the angle and distance.
        if (this.distance > 0 && this.angle > 0) {
            return this.distance * Math.cos(((this.angle + offset + 90) / 180) * Math.PI) + this.game.bodies[2].x;
        }
        else {
            return this.x;
        }
    }
    /**
     * Gets the y value of the asteroid at the current angle and distance.
     *
     * @param offset: the difference in angle you wish to apply. By base 0.
     *
     * @returns the y value at it's distance and angle
     */
    getY(offset = 0) {
        // gets the location of the asteroid at the angle and distance.
        if (this.distance > 0 && this.angle > 0) {
            return this.distance * Math.sin(((this.angle + offset + 90) / 180) * Math.PI) + this.game.bodies[2].y;
        }
        else {
            return this.y;
        }
    }
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for nextX. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param num - The number of turns in the future you wish to check.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateNextX(player, num) {
        // <<-- Creer-Merge: invalidate-nextX -->>
        // Check all the arguments for nextX here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-nextX -->>
    }
    /**
     * The x value of this body a number of turns from now. (0-how many you
     * want).
     *
     * @param player - The player that called this.
     * @param num - The number of turns in the future you wish to check.
     * @returns The x position of the body the input number of turns in the
     * future.
     */
    async nextX(player, num) {
        // <<-- Creer-Merge: nextX -->>
        // Add logic here for nextX.
        // gets the location of the asteroid at the angle and distance.
        if (this.distance && this.angle) {
            return this.distance * Math.cos(((this.angle + 90 + (num * 360 / this.game.turnsToOrbit)) / 180) *
                Math.PI) + this.game.bodies[2].x;
        }
        else {
            return this.x;
        }
        // <<-- /Creer-Merge: nextX -->>
    }
    /**
     * Invalidation function for nextY. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param num - The number of turns in the future you wish to check.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateNextY(player, num) {
        // <<-- Creer-Merge: invalidate-nextY -->>
        // Check all the arguments for nextY here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-nextY -->>
    }
    /**
     * The x value of this body a number of turns from now. (0-how many you
     * want).
     *
     * @param player - The player that called this.
     * @param num - The number of turns in the future you wish to check.
     * @returns The x position of the body the input number of turns in the
     * future.
     */
    async nextY(player, num) {
        // <<-- Creer-Merge: nextY -->>
        // Add logic here for nextY.
        // gets the location of the asteroid at the angle and distance.
        if (this.distance && this.angle) {
            return this.distance * Math.sin(((this.angle + 90 + (num * 360 / this.game.turnsToOrbit)) / 180) *
                Math.PI) + this.game.bodies[2].y;
        }
        else {
            return this.y;
        }
        // <<-- /Creer-Merge: nextY -->>
    }
    /**
     * Invalidation function for spawn. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param x - The x value of the spawned unit.
     * @param y - The y value of the spawned unit.
     * @param title - The job title of the unit being spawned.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSpawn(player, x, y, title) {
        // <<-- Creer-Merge: invalidate-spawn -->>
        // Check if it is the spawning player's turn
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        // Check if the supplied title is valid
        if (title !== "corvette" && title !== "missileboat" && title !== "martyr"
            && title !== "transport" && title !== "miner") {
            return `You must supply a valid job title.`;
        }
        // Check if the body is controlled by the player
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        // Check if the body is indeed a planet
        if (this.bodyType !== "planet") {
            return `${this} isn't a planet, so you can't make ships here.`;
        }
        // Check if the player is trying to spawn the unit too far from their planet's surface
        if (Math.sqrt(((x - this.x) ** 2) + ((y - this.y) ** 2)) > this.radius) {
            return `You must spawn units on your planet!`;
        }
        // Check if the player has the resources to spawn the ship
        // Slow solution; proposed: identify input job and check individual cost?
        // Unsure of how to implement above proposal
        if ((player.money < this.game.jobs[4].unitCost && title === "miner") ||
            (player.money < this.game.jobs[3].unitCost && title === "transport") ||
            (player.money < this.game.jobs[0].unitCost && title === "corvette") ||
            (player.money < this.game.jobs[1].unitCost && title === "missileboat") ||
            (player.money < this.game.jobs[2].unitCost && title === "martyr")) {
            return `You do not have enough resources to spawn this ship.`;
        }
        // Check if the space in which the player is trying to spawn the unit is occupied
        /*const tempUnit = this.manager.create.unit({
            owner: this.owner,
            job: this.game.jobs[0],
            radius: 20, // this.game.shipRadius,
            energy: 100,
            x,
            y,
        });
        // add something to check is the location is open for spawning.
        if (!tempUnit.open(player, x, y)) {
            return `This space is occupied. You cannot spawn a ship here.`;
        }*/
        // Check all the arguments for spawn here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-spawn -->>
    }
    /**
     * Spawn a unit on some value of this celestial body.
     *
     * @param player - The player that called this.
     * @param x - The x value of the spawned unit.
     * @param y - The y value of the spawned unit.
     * @param title - The job title of the unit being spawned.
     * @returns True if successfully taken, false otherwise.
     */
    async spawn(player, x, y, title) {
        // <<-- Creer-Merge: spawn -->>
        // store the units to be added.
        let unit;
        if (title === "corvette") {
            // Deduct ship cost from player's balance
            player.money -= this.game.jobs[0].unitCost;
            // Adds desired unit to player's unit arsenal
            // Unsure if correct implementation
            unit = this.game.manager.create.unit({
                energy: this.game.jobs[0].energy,
                job: this.game.jobs[0],
                owner: player,
                x,
                y,
            });
        }
        else if (title === "missileboat") {
            // Deduct ship cost from player's balance
            player.money -= this.game.jobs[1].unitCost;
            // Adds desired unit to player's unit arsenal
            // Unsure if correct implementation
            unit = this.game.manager.create.unit({
                energy: this.game.jobs[1].energy,
                job: this.game.jobs[1],
                owner: player,
                x,
                y,
            });
        }
        else if (title === "martyr") {
            // Deduct ship cost from player's balance
            player.money -= this.game.jobs[2].unitCost;
            // Adds desired unit to player's unit arsenal
            // Unsure if correct implementation
            unit = this.game.manager.create.unit({
                energy: this.game.jobs[2].energy,
                shield: this.game.jobs[2].shield,
                job: this.game.jobs[2],
                owner: player,
                x,
                y,
            });
        }
        else if (title === "transport") {
            // Deduct ship cost from player's balance
            player.money -= this.game.jobs[3].unitCost;
            // Adds desired unit to player's unit arsenal
            // Unsure if correct implementation
            unit = this.game.manager.create.unit({
                energy: this.game.jobs[3].energy,
                job: this.game.jobs[3],
                owner: player,
                x,
                y,
            });
        }
        else {
            // Deduct ship cost from player's balance
            player.money -= this.game.jobs[4].unitCost;
            // Adds desired unit to player's unit arsenal
            // Unsure if correct implementation
            unit = this.game.manager.create.unit({
                energy: this.game.jobs[4].energy,
                job: this.game.jobs[4],
                owner: player,
                x,
                y,
            });
        }
        // add the unit to the game.
        player.units.push(unit);
        this.game.units.push(unit);
        // return that the action preformed successfully.
        return true;
        // <<-- /Creer-Merge: spawn -->>
    }
}
exports.Body = Body;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zdGFyZGFzaC9ib2R5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsK0NBQTJDO0FBa0IzQzs7R0FFRztBQUNILE1BQWEsSUFBSyxTQUFRLHdCQUFVO0lBcURoQyxxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBUUUsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzlCLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQzs7Ozs7O09BTUc7SUFDSSxJQUFJLENBQUMsU0FBaUIsQ0FBQztRQUMxQiwrREFBK0Q7UUFDL0QsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNyQyxPQUFPLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN6RzthQUNJO1lBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLElBQUksQ0FBQyxTQUFpQixDQUFDO1FBQzFCLCtEQUErRDtRQUMvRCxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJ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O1FBRVosZ0NBQWdDO0lBQ3BDLENBQUM7Q0FPSjtBQXZaRCxvQkF1WkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElCb2R5TmV4dFhBcmdzLCBJQm9keU5leHRZQXJncywgSUJvZHlQcm9wZXJ0aWVzLCBJQm9keVNwYXduQXJncyxcbiAgICAgICB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgY2VsZXN0aWFsIGJvZHkgaXQgaXMuIEVpdGhlciAncGxhbmV0JywgJ2FzdGVyb2lkJywgb3IgJ3N1bicuXG4gKi9cbmV4cG9ydCB0eXBlIEJvZHlCb2R5VHlwZSA9IFwicGxhbmV0XCIgfCBcImFzdGVyb2lkXCIgfCBcInN1blwiO1xuXG4vKipcbiAqIFRoZSB0eXBlIG9mIG1hdGVyaWFsIHRoZSBjZWxlc3RpYWwgYm9keSBoYXMuIEVpdGhlciAnbm9uZScsICdnZW5hcml1bScsXG4gKiAncmFyaXVtJywgJ2xlZ2VuZGFyaXVtJywgb3IgJ215dGhpY2l0ZScuXG4gKi9cbmV4cG9ydCB0eXBlIEJvZHlNYXRlcmlhbFR5cGUgPSBcIm5vbmVcIiB8IFwiZ2VuYXJpdW1cIiB8IFwicmFyaXVtXCIgfCBcImxlZ2VuZGFyaXVtXCIgfCBcIm15dGhpY2l0ZVwiO1xuXG4vKipcbiAqIEEgY2VsZXN0aWFsIGJvZHkgbG9jYXRlZCB3aXRoaW4gdGhlIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBCb2R5IGV4dGVuZHMgR2FtZU9iamVjdCB7XG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBtYXRlcmlhbCB0aGUgb2JqZWN0IGhhcywgb3IgZW5lcmd5IGlmIGl0IGlzIGEgcGxhbmV0LlxuICAgICAqL1xuICAgIHB1YmxpYyBhbW91bnQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdHlwZSBvZiBjZWxlc3RpYWwgYm9keSBpdCBpcy4gRWl0aGVyICdwbGFuZXQnLCAnYXN0ZXJvaWQnLCBvciAnc3VuJy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYm9keVR5cGUhOiBcInBsYW5ldFwiIHwgXCJhc3Rlcm9pZFwiIHwgXCJzdW5cIjtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIG1hdGVyaWFsIHRoZSBjZWxlc3RpYWwgYm9keSBoYXMuIEVpdGhlciAnbm9uZScsICdnZW5hcml1bScsXG4gICAgICogJ3Jhcml1bScsICdsZWdlbmRhcml1bScsIG9yICdteXRoaWNpdGUnLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYXRlcmlhbFR5cGUhOiBcIm5vbmVcIiB8IFwiZ2VuYXJpdW1cIiB8IFwicmFyaXVtXCIgfCBcImxlZ2VuZGFyaXVtXCIgfCBcIm15dGhpY2l0ZVwiO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFBsYXllciB0aGF0IG93bnMgYW5kIGNhbiBjb250cm9sIHRoaXMgQm9keS5cbiAgICAgKi9cbiAgICBwdWJsaWMgb3duZXI/OiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmFkaXVzIG9mIHRoZSBjaXJjbGUgdGhhdCB0aGlzIGJvZHkgdGFrZXMgdXAuXG4gICAgICovXG4gICAgcHVibGljIHJhZGl1cyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSB4IHZhbHVlIHRoaXMgY2VsZXN0aWFsIGJvZHkgaXMgb24uXG4gICAgICovXG4gICAgcHVibGljIHghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSB2YWx1ZSB0aGlzIGNlbGVzdGlhbCBib2R5IGlzIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyB5ITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8qKlxuICAgICAqIFRoZSBhbmdsZSB0aGUgYXN0ZXJvaWQgaXMgcmVsYXRpdmUgdG8gdGhlIHN1bi5cbiAgICAgKi9cbiAgICBwdWJsaWMgYW5nbGUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGlzdGFuY2UgdGhlIGFzdGVyb2lkIGlzIGZyb20gdGhlIGNlbnRlciBvZiB0aGUgc3VuLlxuICAgICAqL1xuICAgIHB1YmxpYyBkaXN0YW5jZSE6IG51bWJlcjtcblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgQm9keSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxJQm9keVByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8qKiBUaGUgYW5nbGUgKi9cbiAgICAgICAgICAgIGFuZ2xlOiBudW1iZXI7XG4gICAgICAgICAgICAvKiogVGhlIGRpc3RhbmNlICovXG4gICAgICAgICAgICBkaXN0YW5jZTogbnVtYmVyO1xuICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgbW9yZSBjb25zdHJ1Y3RvciBhcmdzIGluIGhlcmVcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICB0aGlzLmFuZ2xlID0gYXJncy5hbmdsZTtcbiAgICAgICAgdGhpcy5kaXN0YW5jZSA9IGFyZ3MuZGlzdGFuY2U7XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB4IHZhbHVlIG9mIHRoZSBhc3Rlcm9pZCBhdCB0aGUgY3VycmVudCBhbmdsZSBhbmQgZGlzdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2Zmc2V0OiB0aGUgZGlmZmVyZW5jZSBpbiBhbmdsZSB5b3Ugd2lzaCB0byBhcHBseS4gQnkgYmFzZSAwLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIHggdmFsdWUgYXQgaXQncyBkaXN0YW5jZSBhbmQgYW5nbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0WChvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xuICAgICAgICAvLyBnZXRzIHRoZSBsb2NhdGlvbiBvZiB0aGUgYXN0ZXJvaWQgYXQgdGhlIGFuZ2xlIGFuZCBkaXN0YW5jZS5cbiAgICAgICAgaWYgKHRoaXMuZGlzdGFuY2UgPiAwICYmIHRoaXMuYW5nbGUgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZSAqIE1hdGguY29zKCgodGhpcy5hbmdsZSArIG9mZnNldCArIDkwKSAvIDE4MCkgKiBNYXRoLlBJKSArIHRoaXMuZ2FtZS5ib2RpZXNbMl0ueDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLng7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB5IHZhbHVlIG9mIHRoZSBhc3Rlcm9pZCBhdCB0aGUgY3VycmVudCBhbmdsZSBhbmQgZGlzdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb2Zmc2V0OiB0aGUgZGlmZmVyZW5jZSBpbiBhbmdsZSB5b3Ugd2lzaCB0byBhcHBseS4gQnkgYmFzZSAwLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIHkgdmFsdWUgYXQgaXQncyBkaXN0YW5jZSBhbmQgYW5nbGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0WShvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xuICAgICAgICAvLyBnZXRzIHRoZSBsb2NhdGlvbiBvZiB0aGUgYXN0ZXJvaWQgYXQgdGhlIGFuZ2xlIGFuZCBkaXN0YW5jZS5cbiAgICAgICAgaWYgKHRoaXMuZGlzdGFuY2UgPiAwICYmIHRoaXMuYW5nbGUgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZSAqIE1hdGguc2luKCgodGhpcy5hbmdsZSArIG9mZnNldCArIDkwKSAvIDE4MCkgKiBNYXRoLlBJKSArIHRoaXMuZ2FtZS5ib2RpZXNbMl0ueTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIG5leHRYLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBudW0gLSBUaGUgbnVtYmVyIG9mIHR1cm5zIGluIHRoZSBmdXR1cmUgeW91IHdpc2ggdG8gY2hlY2suXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlTmV4dFgoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBudW06IG51bWJlcixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUJvZHlOZXh0WEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW5leHRYIC0tPj5cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgbmV4dFggaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW5leHRYIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCB2YWx1ZSBvZiB0aGlzIGJvZHkgYSBudW1iZXIgb2YgdHVybnMgZnJvbSBub3cuICgwLWhvdyBtYW55IHlvdVxuICAgICAqIHdhbnQpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gbnVtIC0gVGhlIG51bWJlciBvZiB0dXJucyBpbiB0aGUgZnV0dXJlIHlvdSB3aXNoIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBib2R5IHRoZSBpbnB1dCBudW1iZXIgb2YgdHVybnMgaW4gdGhlXG4gICAgICogZnV0dXJlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBuZXh0WChwbGF5ZXI6IFBsYXllciwgbnVtOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBuZXh0WCAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIG5leHRYLlxuXG4gICAgICAgIC8vIGdldHMgdGhlIGxvY2F0aW9uIG9mIHRoZSBhc3Rlcm9pZCBhdCB0aGUgYW5nbGUgYW5kIGRpc3RhbmNlLlxuICAgICAgICBpZiAodGhpcy5kaXN0YW5jZSAmJiB0aGlzLmFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZSAqIE1hdGguY29zKCgodGhpcy5hbmdsZSArIDkwICsgKG51bSAqIDM2MCAvIHRoaXMuZ2FtZS50dXJuc1RvT3JiaXQpKSAvIDE4MCkgKlxuICAgICAgICAgICAgTWF0aC5QSSkgKyB0aGlzLmdhbWUuYm9kaWVzWzJdLng7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG5leHRYIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIG5leHRZLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBudW0gLSBUaGUgbnVtYmVyIG9mIHR1cm5zIGluIHRoZSBmdXR1cmUgeW91IHdpc2ggdG8gY2hlY2suXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlTmV4dFkoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBudW06IG51bWJlcixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUJvZHlOZXh0WUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW5leHRZIC0tPj5cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgbmV4dFkgaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW5leHRZIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCB2YWx1ZSBvZiB0aGlzIGJvZHkgYSBudW1iZXIgb2YgdHVybnMgZnJvbSBub3cuICgwLWhvdyBtYW55IHlvdVxuICAgICAqIHdhbnQpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gbnVtIC0gVGhlIG51bWJlciBvZiB0dXJucyBpbiB0aGUgZnV0dXJlIHlvdSB3aXNoIHRvIGNoZWNrLlxuICAgICAqIEByZXR1cm5zIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBib2R5IHRoZSBpbnB1dCBudW1iZXIgb2YgdHVybnMgaW4gdGhlXG4gICAgICogZnV0dXJlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBuZXh0WShwbGF5ZXI6IFBsYXllciwgbnVtOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBuZXh0WSAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIG5leHRZLlxuXG4gICAgICAgIC8vIGdldHMgdGhlIGxvY2F0aW9uIG9mIHRoZSBhc3Rlcm9pZCBhdCB0aGUgYW5nbGUgYW5kIGRpc3RhbmNlLlxuICAgICAgICBpZiAodGhpcy5kaXN0YW5jZSAmJiB0aGlzLmFuZ2xlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kaXN0YW5jZSAqIE1hdGguc2luKCgodGhpcy5hbmdsZSArIDkwICsgKG51bSAqIDM2MCAvIHRoaXMuZ2FtZS50dXJuc1RvT3JiaXQpKSAvIDE4MCkgKlxuICAgICAgICAgICAgTWF0aC5QSSkgKyB0aGlzLmdhbWUuYm9kaWVzWzJdLnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy55O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG5leHRZIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHNwYXduLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIHggdmFsdWUgb2YgdGhlIHNwYXduZWQgdW5pdC5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IHZhbHVlIG9mIHRoZSBzcGF3bmVkIHVuaXQuXG4gICAgICogQHBhcmFtIHRpdGxlIC0gVGhlIGpvYiB0aXRsZSBvZiB0aGUgdW5pdCBiZWluZyBzcGF3bmVkLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVNwYXduKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgeDogbnVtYmVyLFxuICAgICAgICB5OiBudW1iZXIsXG4gICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElCb2R5U3Bhd25BcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGF3biAtLT4+XG4gICAgICAgIC8vIENoZWNrIGlmIGl0IGlzIHRoZSBzcGF3bmluZyBwbGF5ZXIncyB0dXJuXG4gICAgICAgIGlmICghcGxheWVyIHx8IHBsYXllciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgSXQgaXNuJ3QgeW91ciB0dXJuLCAke3BsYXllcn0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBzdXBwbGllZCB0aXRsZSBpcyB2YWxpZFxuICAgICAgICBpZiAodGl0bGUgIT09IFwiY29ydmV0dGVcIiAmJiB0aXRsZSAhPT0gXCJtaXNzaWxlYm9hdFwiICYmIHRpdGxlICE9PSBcIm1hcnR5clwiXG4gICAgICAgICAgICAmJiB0aXRsZSAhPT0gXCJ0cmFuc3BvcnRcIiAmJiB0aXRsZSAhPT0gXCJtaW5lclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBtdXN0IHN1cHBseSBhIHZhbGlkIGpvYiB0aXRsZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGJvZHkgaXMgY29udHJvbGxlZCBieSB0aGUgcGxheWVyXG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIgfHwgdGhpcy5vd25lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXNuJ3Qgb3duZWQgYnkgeW91LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgYm9keSBpcyBpbmRlZWQgYSBwbGFuZXRcbiAgICAgICAgaWYgKHRoaXMuYm9keVR5cGUgIT09IFwicGxhbmV0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpc24ndCBhIHBsYW5ldCwgc28geW91IGNhbid0IG1ha2Ugc2hpcHMgaGVyZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYXllciBpcyB0cnlpbmcgdG8gc3Bhd24gdGhlIHVuaXQgdG9vIGZhciBmcm9tIHRoZWlyIHBsYW5ldCdzIHN1cmZhY2VcbiAgICAgICAgaWYgKE1hdGguc3FydCgoKHggLSB0aGlzLngpICoqIDIpICsgKCh5IC0gdGhpcy55KSAqKiAyKSkgPiB0aGlzLnJhZGl1cykge1xuICAgICAgICAgICAgcmV0dXJuIGBZb3UgbXVzdCBzcGF3biB1bml0cyBvbiB5b3VyIHBsYW5ldCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYXllciBoYXMgdGhlIHJlc291cmNlcyB0byBzcGF3biB0aGUgc2hpcFxuICAgICAgICAvLyBTbG93IHNvbHV0aW9uOyBwcm9wb3NlZDogaWRlbnRpZnkgaW5wdXQgam9iIGFuZCBjaGVjayBpbmRpdmlkdWFsIGNvc3Q/XG4gICAgICAgIC8vIFVuc3VyZSBvZiBob3cgdG8gaW1wbGVtZW50IGFib3ZlIHByb3Bvc2FsXG4gICAgICAgIGlmICgocGxheWVyLm1vbmV5IDwgdGhpcy5nYW1lLmpvYnNbNF0udW5pdENvc3QgJiYgdGl0bGUgPT09IFwibWluZXJcIikgfHxcbiAgICAgICAgICAgIChwbGF5ZXIubW9uZXkgPCB0aGlzLmdhbWUuam9ic1szXS51bml0Q29zdCAmJiB0aXRsZSA9PT0gXCJ0cmFuc3BvcnRcIikgfHxcbiAgICAgICAgICAgIChwbGF5ZXIubW9uZXkgPCB0aGlzLmdhbWUuam9ic1swXS51bml0Q29zdCAmJiB0aXRsZSA9PT0gXCJjb3J2ZXR0ZVwiKSB8fFxuICAgICAgICAgICAgKHBsYXllci5tb25leSA8IHRoaXMuZ2FtZS5qb2JzWzFdLnVuaXRDb3N0ICYmIHRpdGxlID09PSBcIm1pc3NpbGVib2F0XCIpIHx8XG4gICAgICAgICAgICAocGxheWVyLm1vbmV5IDwgdGhpcy5nYW1lLmpvYnNbMl0udW5pdENvc3QgJiYgdGl0bGUgPT09IFwibWFydHlyXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gYFlvdSBkbyBub3QgaGF2ZSBlbm91Z2ggcmVzb3VyY2VzIHRvIHNwYXduIHRoaXMgc2hpcC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHNwYWNlIGluIHdoaWNoIHRoZSBwbGF5ZXIgaXMgdHJ5aW5nIHRvIHNwYXduIHRoZSB1bml0IGlzIG9jY3VwaWVkXG4gICAgICAgIC8qY29uc3QgdGVtcFVuaXQgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgb3duZXI6IHRoaXMub3duZXIsXG4gICAgICAgICAgICBqb2I6IHRoaXMuZ2FtZS5qb2JzWzBdLFxuICAgICAgICAgICAgcmFkaXVzOiAyMCwgLy8gdGhpcy5nYW1lLnNoaXBSYWRpdXMsXG4gICAgICAgICAgICBlbmVyZ3k6IDEwMCxcbiAgICAgICAgICAgIHgsXG4gICAgICAgICAgICB5LFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gYWRkIHNvbWV0aGluZyB0byBjaGVjayBpcyB0aGUgbG9jYXRpb24gaXMgb3BlbiBmb3Igc3Bhd25pbmcuXG4gICAgICAgIGlmICghdGVtcFVuaXQub3BlbihwbGF5ZXIsIHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoaXMgc3BhY2UgaXMgb2NjdXBpZWQuIFlvdSBjYW5ub3Qgc3Bhd24gYSBzaGlwIGhlcmUuYDtcbiAgICAgICAgfSovXG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIHRoZSBhcmd1bWVudHMgZm9yIHNwYXduIGhlcmUgYW5kIHRyeSB0b1xuICAgICAgICAvLyByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB3aHkgdGhlIGlucHV0IGlzIHdyb25nLlxuICAgICAgICAvLyBJZiB5b3UgbmVlZCB0byBjaGFuZ2UgYW4gYXJndW1lbnQgZm9yIHRoZSByZWFsIGZ1bmN0aW9uLCB0aGVuXG4gICAgICAgIC8vIGNoYW5naW5nIGl0cyB2YWx1ZSBpbiB0aGlzIHNjb3BlIGlzIGVub3VnaC5cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGF3biAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Bhd24gYSB1bml0IG9uIHNvbWUgdmFsdWUgb2YgdGhpcyBjZWxlc3RpYWwgYm9keS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHggLSBUaGUgeCB2YWx1ZSBvZiB0aGUgc3Bhd25lZCB1bml0LlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgdmFsdWUgb2YgdGhlIHNwYXduZWQgdW5pdC5cbiAgICAgKiBAcGFyYW0gdGl0bGUgLSBUaGUgam9iIHRpdGxlIG9mIHRoZSB1bml0IGJlaW5nIHNwYXduZWQuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgdGFrZW4sIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgc3Bhd24oXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlcixcbiAgICAgICAgdGl0bGU6IHN0cmluZyxcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc3Bhd24gLS0+PlxuXG4gICAgICAgIC8vIHN0b3JlIHRoZSB1bml0cyB0byBiZSBhZGRlZC5cbiAgICAgICAgbGV0IHVuaXQ7XG5cbiAgICAgICAgaWYgKHRpdGxlID09PSBcImNvcnZldHRlXCIpIHtcbiAgICAgICAgICAgIC8vIERlZHVjdCBzaGlwIGNvc3QgZnJvbSBwbGF5ZXIncyBiYWxhbmNlXG4gICAgICAgICAgICBwbGF5ZXIubW9uZXkgLT0gdGhpcy5nYW1lLmpvYnNbMF0udW5pdENvc3Q7XG4gICAgICAgICAgICAvLyBBZGRzIGRlc2lyZWQgdW5pdCB0byBwbGF5ZXIncyB1bml0IGFyc2VuYWxcbiAgICAgICAgICAgIC8vIFVuc3VyZSBpZiBjb3JyZWN0IGltcGxlbWVudGF0aW9uXG4gICAgICAgICAgICB1bml0ID0gdGhpcy5nYW1lLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgIGVuZXJneTogdGhpcy5nYW1lLmpvYnNbMF0uZW5lcmd5LFxuICAgICAgICAgICAgICAgIGpvYjogdGhpcy5nYW1lLmpvYnNbMF0sXG4gICAgICAgICAgICAgICAgb3duZXI6IHBsYXllcixcbiAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJtaXNzaWxlYm9hdFwiKSB7XG4gICAgICAgICAgICAvLyBEZWR1Y3Qgc2hpcCBjb3N0IGZyb20gcGxheWVyJ3MgYmFsYW5jZVxuICAgICAgICAgICAgcGxheWVyLm1vbmV5IC09IHRoaXMuZ2FtZS5qb2JzWzFdLnVuaXRDb3N0O1xuICAgICAgICAgICAgLy8gQWRkcyBkZXNpcmVkIHVuaXQgdG8gcGxheWVyJ3MgdW5pdCBhcnNlbmFsXG4gICAgICAgICAgICAvLyBVbnN1cmUgaWYgY29ycmVjdCBpbXBsZW1lbnRhdGlvblxuICAgICAgICAgICAgdW5pdCA9IHRoaXMuZ2FtZS5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICBlbmVyZ3k6IHRoaXMuZ2FtZS5qb2JzWzFdLmVuZXJneSxcbiAgICAgICAgICAgICAgICBqb2I6IHRoaXMuZ2FtZS5qb2JzWzFdLFxuICAgICAgICAgICAgICAgIG93bmVyOiBwbGF5ZXIsXG4gICAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgICB5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGl0bGUgPT09IFwibWFydHlyXCIpIHtcbiAgICAgICAgICAgIC8vIERlZHVjdCBzaGlwIGNvc3QgZnJvbSBwbGF5ZXIncyBiYWxhbmNlXG4gICAgICAgICAgICBwbGF5ZXIubW9uZXkgLT0gdGhpcy5nYW1lLmpvYnNbMl0udW5pdENvc3Q7XG4gICAgICAgICAgICAvLyBBZGRzIGRlc2lyZWQgdW5pdCB0byBwbGF5ZXIncyB1bml0IGFyc2VuYWxcbiAgICAgICAgICAgIC8vIFVuc3VyZSBpZiBjb3JyZWN0IGltcGxlbWVudGF0aW9uXG4gICAgICAgICAgICB1bml0ID0gdGhpcy5nYW1lLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgIGVuZXJneTogdGhpcy5nYW1lLmpvYnNbMl0uZW5lcmd5LFxuICAgICAgICAgICAgICAgIHNoaWVsZDogdGhpcy5nYW1lLmpvYnNbMl0uc2hpZWxkLFxuICAgICAgICAgICAgICAgIGpvYjogdGhpcy5nYW1lLmpvYnNbMl0sXG4gICAgICAgICAgICAgICAgb3duZXI6IHBsYXllcixcbiAgICAgICAgICAgICAgICB4LFxuICAgICAgICAgICAgICAgIHksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aXRsZSA9PT0gXCJ0cmFuc3BvcnRcIikge1xuICAgICAgICAgICAgLy8gRGVkdWN0IHNoaXAgY29zdCBmcm9tIHBsYXllcidzIGJhbGFuY2VcbiAgICAgICAgICAgIHBsYXllci5tb25leSAtPSB0aGlzLmdhbWUuam9ic1szXS51bml0Q29zdDtcbiAgICAgICAgICAgIC8vIEFkZHMgZGVzaXJlZCB1bml0IHRvIHBsYXllcidzIHVuaXQgYXJzZW5hbFxuICAgICAgICAgICAgLy8gVW5zdXJlIGlmIGNvcnJlY3QgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAgIHVuaXQgPSB0aGlzLmdhbWUubWFuYWdlci5jcmVhdGUudW5pdCh7XG4gICAgICAgICAgICAgICAgZW5lcmd5OiB0aGlzLmdhbWUuam9ic1szXS5lbmVyZ3ksXG4gICAgICAgICAgICAgICAgam9iOiB0aGlzLmdhbWUuam9ic1szXSxcbiAgICAgICAgICAgICAgICBvd25lcjogcGxheWVyLFxuICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gRGVkdWN0IHNoaXAgY29zdCBmcm9tIHBsYXllcidzIGJhbGFuY2VcbiAgICAgICAgICAgIHBsYXllci5tb25leSAtPSB0aGlzLmdhbWUuam9ic1s0XS51bml0Q29zdDtcbiAgICAgICAgICAgIC8vIEFkZHMgZGVzaXJlZCB1bml0IHRvIHBsYXllcidzIHVuaXQgYXJzZW5hbFxuICAgICAgICAgICAgLy8gVW5zdXJlIGlmIGNvcnJlY3QgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAgIHVuaXQgPSB0aGlzLmdhbWUubWFuYWdlci5jcmVhdGUudW5pdCh7XG4gICAgICAgICAgICAgICAgZW5lcmd5OiB0aGlzLmdhbWUuam9ic1s0XS5lbmVyZ3ksXG4gICAgICAgICAgICAgICAgam9iOiB0aGlzLmdhbWUuam9ic1s0XSxcbiAgICAgICAgICAgICAgICBvd25lcjogcGxheWVyLFxuICAgICAgICAgICAgICAgIHgsXG4gICAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHRoZSB1bml0IHRvIHRoZSBnYW1lLlxuICAgICAgICBwbGF5ZXIudW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgdGhpcy5nYW1lLnVuaXRzLnB1c2godW5pdCk7XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoYXQgdGhlIGFjdGlvbiBwcmVmb3JtZWQgc3VjY2Vzc2Z1bGx5LlxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc3Bhd24gLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==