"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * A beaver in the game.
 */
class Beaver extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Beaver is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.owner = args.owner;
        this.job = args.job;
        this.tile = args.tile;
        this.health = this.job.health;
        this.actions = this.job.actions;
        this.moves = this.job.moves;
        this.tile.beaver = this;
        this.game.newBeavers.push(this);
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for attack. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param beaver - The Beaver to attack. Must be on an adjacent Tile.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAttack(player, beaver) {
        // <<-- Creer-Merge: invalidate-attack -->>
        const invalid = this.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        if (!beaver) {
            return `${beaver} is not a valid beaver for ${this} to attack.`;
        }
        if (!beaver.recruited) {
            return `${beaver} has not finished being recruited yet, and cannot be attacked yet.`;
        }
        if (!this.tile.hasNeighbor(beaver.tile)) {
            return `${beaver} is not adjacent to ${this} beaver to be attacked.`;
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks another adjacent beaver.
     *
     * @param player - The player that called this.
     * @param beaver - The Beaver to attack. Must be on an adjacent Tile.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, beaver) {
        // <<-- Creer-Merge: attack -->>
        if (!beaver.tile) {
            throw new Error(`${this} is attacking without being on a Tile!`);
        }
        beaver.health = Math.max(0, beaver.health - this.job.damage);
        // If the beaver is already distracted, keep that value, otherwise they
        // get distracted by this attack
        beaver.turnsDistracted = beaver.turnsDistracted || this.job.distractionPower;
        this.actions--;
        // Check if the enemy beaver died.
        if (beaver.health <= 0) {
            // Drop it's resources on the ground.
            beaver.tile.branches += beaver.branches;
            beaver.tile.food += beaver.food;
            // And set its values to invalid numbers to signify it is dead.
            beaver.branches = -1;
            beaver.food = -1;
            beaver.actions = -1;
            beaver.moves = -1;
            beaver.turnsDistracted = -1;
            // Remove him from the map of tiles.
            beaver.tile.beaver = undefined;
            beaver.tile = undefined;
        }
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for buildLodge. Try to find a reason why the
     * passed in parameters are invalid, and return a human readable string
     * telling them why it is invalid.
     *
     * @param player - The player that called this.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateBuildLodge(player) {
        // <<-- Creer-Merge: invalidate-buildLodge -->>
        const invalid = this.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        if ((this.branches + this.tile.branches) < player.branchesToBuildLodge) {
            return `${this} does not have enough branches to build the lodge.`;
        }
        if (this.tile.lodgeOwner) {
            return `${this.tile} already has a lodge owned by ${this.tile.lodgeOwner}.`;
        }
        if (this.tile.spawner) {
            return `${this.tile} has a spawner which cannot be built over.`;
        }
        // <<-- /Creer-Merge: invalidate-buildLodge -->>
    }
    /**
     * Builds a lodge on the Beavers current Tile.
     *
     * @param player - The player that called this.
     * @returns True if successfully built a lodge, false otherwise.
     */
    async buildLodge(player) {
        // <<-- Creer-Merge: buildLodge -->>
        if (!this.tile) {
            throw new Error(`${this} is not on a tile but is trying to build a lodge!`);
        }
        // Overcharge tile's branches
        this.tile.branches -= player.branchesToBuildLodge;
        if (this.tile.branches < 0) {
            // Make up difference with this Beaver's branches
            // NOTE Tile has a debt, ie a negative value being added
            this.branches += this.tile.branches;
            this.tile.branches = 0;
        }
        // All the branches are now on this tile to makeup the lodge
        this.tile.branches = player.branchesToBuildLodge;
        this.tile.lodgeOwner = player;
        this.owner.lodges.push(this.tile);
        this.actions--;
        player.calculateBranchesToBuildLodge();
        return true;
        // <<-- /Creer-Merge: buildLodge -->>
    }
    /**
     * Invalidation function for drop. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to drop branches/food on. Must be the same Tile
     * that the Beaver is on, or an adjacent one.
     * @param resource - The type of resource to drop ('branches' or 'food').
     * @param amount - The amount of the resource to drop, numbers <= 0 will
     * drop all the resource type.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDrop(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: invalidate-drop -->>
        const invalid = this.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        // transform the amount if they passed in a number =< 0
        const actualAmount = amount <= 0
            ? this[resource]
            : amount;
        if (actualAmount <= 0) {
            return `${this} cannot drop ${actualAmount} of ${resource}`;
        }
        if (actualAmount > this[resource]) {
            return `${this} does not have ${actualAmount} ${resource} to drop.`;
        }
        if (!tile) {
            return `${tile} is not a valid tile to drop resources on.`;
        }
        if (this.tile !== tile && !this.tile.hasNeighbor(tile)) {
            return `${tile} is not the adjacent to or equal to the tile ${this} is on (${this.tile})`;
        }
        if (tile.spawner) {
            return `${tile} has ${tile.spawner} on it, and cannot have resourced dropped onto it.`;
        }
        // Looks valid!
        // let's override their `amount` argument with the actual number.
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-drop -->>
    }
    /**
     * Drops some of the given resource on the beaver's Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to drop branches/food on. Must be the same Tile
     * that the Beaver is on, or an adjacent one.
     * @param resource - The type of resource to drop ('branches' or 'food').
     * @param amount - The amount of the resource to drop, numbers <= 0 will
     * drop all the resource type.
     * @returns True if successfully dropped the resource, false otherwise.
     */
    async drop(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: drop -->>
        // We know it must be this from the above function.
        const res = resource;
        this[res] -= amount;
        tile[res] += amount;
        this.actions--;
        return true;
        // <<-- /Creer-Merge: drop -->>
    }
    /**
     * Invalidation function for harvest. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param spawner - The Spawner you want to harvest. Must be on an adjacent
     * Tile.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateHarvest(player, spawner) {
        // <<-- Creer-Merge: invalidate-harvest -->>
        const invalid = this.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        if (!spawner) {
            return `${spawner} is not a valid Spawner`;
        }
        if (!this.tile.hasNeighbor(spawner.tile)) {
            return `${this} on tile ${this.tile} is not adjacent to ${spawner.tile}`;
        }
        const load = this.food + this.branches;
        if (load >= this.job.carryLimit) {
            return `Beaver cannot carry any more resources. Limit: (${load}/${this.job.carryLimit})`;
        }
        // <<-- /Creer-Merge: invalidate-harvest -->>
    }
    /**
     * Harvests the branches or food from a Spawner on an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param spawner - The Spawner you want to harvest. Must be on an adjacent
     * Tile.
     * @returns True if successfully harvested, false otherwise.
     */
    async harvest(player, spawner) {
        // <<-- Creer-Merge: harvest -->>
        // Add logic here for harvest.
        const load = this.food + this.branches;
        const spaceAvailable = this.job.carryLimit - load;
        const skillScalar = spawner.type === "branches"
            ? this.job.chopping
            : this.job.munching;
        const maxCanHarvest = (this.game.spawnerHarvestConstant *
            spawner.health *
            skillScalar);
        this[spawner.type] += Math.min(spaceAvailable, maxCanHarvest);
        this.actions--;
        // damage the spawner because we harvested from it
        if (spawner.health > 0) {
            spawner.health--;
        }
        spawner.hasBeenHarvested = true;
        spawner.harvestCooldown = 2;
        return true;
        // <<-- /Creer-Merge: harvest -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Beaver should move to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, tile) {
        // <<-- Creer-Merge: invalidate-move -->>
        const invalid = this.invalidate(player, true);
        if (invalid) {
            return invalid;
        }
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        if (this.moves <= 0) {
            return `${this} is out of moves.`;
        }
        if (!tile) {
            return `${tile} is not a valid tile to move to.`;
        }
        if (tile.beaver) {
            return `${tile} is already occupied by ${tile.beaver}.`;
        }
        if (tile.lodgeOwner) {
            return `${tile} contains a lodge.`;
        }
        if (tile.spawner) {
            return `${tile} contains ${tile.spawner}.`;
        }
        const movementCost = this.tile.getMovementCost(tile);
        if (isNaN(movementCost)) {
            return `${tile} is not adjacent to ${this.tile}`;
        }
        if (this.moves < movementCost) {
            return `${tile} costs ${movementCost} to reach, and ${this} only has ${this.moves} moves.`;
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves this Beaver from its current Tile to an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Beaver should move to.
     * @returns True if the move worked, false otherwise.
     */
    async move(player, tile) {
        // <<-- Creer-Merge: move -->>
        if (!this.tile) {
            throw new Error(`${this} is not on a tile to move from!`);
        }
        // calculate movement cost before moving
        const cost = this.tile.getMovementCost(tile);
        // update target tile's beaver to this beaver
        tile.beaver = this;
        // remove me from the time I was on
        this.tile.beaver = undefined;
        // update this beaver's tile to target tile
        this.tile = tile;
        // finally decrement this beaver's moves count by the move cost
        this.moves -= cost;
        return true;
        // <<-- /Creer-Merge: move -->>
    }
    /**
     * Invalidation function for pickup. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to pickup branches/food from. Must be the same
     * Tile that the Beaver is on, or an adjacent one.
     * @param resource - The type of resource to pickup ('branches' or 'food').
     * @param amount - The amount of the resource to drop, numbers <= 0 will
     * pickup all of the resource type.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidatePickup(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: invalidate-pickup -->>
        const invalid = this.invalidate(player);
        if (invalid) {
            return invalid;
        }
        if (!this.tile) {
            return `${this} is not on a tile.`;
        }
        if (!tile) {
            return `${tile} is not a valid tile to pick up resources from.`;
        }
        if (this.tile !== tile && !this.tile.hasNeighbor(tile)) {
            return `${tile} is not the adjacent to or equal to the tile ${this} is on (${this.tile})`;
        }
        if (tile.spawner) {
            return `${tile} has ${tile.spawner} on it, and cannot have resources picked up from it.`;
        }
        // transform the resource into the first, lower cased, character.
        // We only need to know 'f' vs 'b' to tell what resource type.
        const char = resource[0].toLowerCase();
        if (char !== "f" && char !== "b") {
            return `${resource} is not a valid resource to pick up.`;
        }
        // Calculate max resources the beaver can carry.
        const spaceAvailable = this.job.carryLimit - this.branches - this.food;
        // Transform the amount if they passed in a number =< 0
        const actualAmount = amount <= 0
            ? Math.min(tile[resource], spaceAvailable)
            : amount;
        if (actualAmount <= 0) {
            return `${this} cannot pick up ${actualAmount} of ${resource}`;
        }
        if (actualAmount > tile[resource]) {
            return `${tile} does not have ${actualAmount} ${resource} to pick up.`;
        }
        if (actualAmount > spaceAvailable) {
            return (`${this} cannot carry ${actualAmount} of ${resource} because it `
                + `only can carry ${spaceAvailable} more resources`);
        }
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-pickup -->>
    }
    /**
     * Picks up some branches or food on the beaver's tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to pickup branches/food from. Must be the same
     * Tile that the Beaver is on, or an adjacent one.
     * @param resource - The type of resource to pickup ('branches' or 'food').
     * @param amount - The amount of the resource to drop, numbers <= 0 will
     * pickup all of the resource type.
     * @returns True if successfully picked up a resource, false otherwise.
     */
    async pickup(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: pickup -->>
        tile[resource] -= amount;
        this[resource] += amount;
        this.actions--;
        // if the tile is a lodge, and it has reached 0 branches, it is no longer a lodge
        if (tile.lodgeOwner && tile.branches === 0) {
            const lodgeOwner = tile.lodgeOwner;
            utils_1.removeElements(lodgeOwner.lodges, tile);
            tile.lodgeOwner = undefined;
            lodgeOwner.calculateBranchesToBuildLodge();
        }
        return true;
        // <<-- /Creer-Merge: pickup -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Tries to invalidate args for an action function
     *
     * @param player - the player commanding this Beaver
     * @param dontCheckActions - pass true to not check if the beaver has enough actions
     * @returns The reason this is invalid, undefined if looks valid so far
     */
    invalidate(player, dontCheckActions) {
        if (!player || player !== this.game.currentPlayer) {
            return `${player} it is not your turn.`;
        }
        if (this.owner !== player) {
            return `${this} is not owned by you.`;
        }
        if (this.health <= 0) {
            return `${this} is dead.`;
        }
        if (this.turnsDistracted > 0) {
            return `${this} is distracted for ${this.turnsDistracted} more turns.`;
        }
        if (!this.recruited) {
            return `${this} is still being recruited and cannot be ordered yet.`;
        }
        if (!dontCheckActions && this.actions <= 0) {
            return `${this} does not have any actions left.`;
        }
    }
}
exports.Beaver = Beaver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVhdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3N0dW1wZWQvYmVhdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsK0NBQTJDO0FBTTNDLGlDQUFpQztBQUNqQyxtQ0FBeUM7QUFDekMsa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsd0JBQVU7SUFvRGxDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBU0UsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUVyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV0QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWhDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQzs7Ozs7Ozs7OztPQVVHO0lBQ08s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SUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDbEIsT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDO1NBQzdCO1FBRUQsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRTtZQUMxQixPQUFPLEdBQUcsSUFBSSxzQkFBc0IsSUFBSSxDQUFDLGVBQWUsY0FBYyxDQUFDO1NBQzFFO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDakIsT0FBTyxHQUFHLElBQUksc0RBQXNELENBQUM7U0FDeEU7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUU7WUFDeEMsT0FBTyxHQUFHLElBQUksa0NBQWtDLENBQUM7U0FDcEQ7SUFDTCxDQUFDO0NBR0o7QUF4ckJELHdCQXdyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElCZWF2ZXJBdHRhY2tBcmdzLCBJQmVhdmVyQnVpbGRMb2RnZUFyZ3MsIElCZWF2ZXJEcm9wQXJncyxcbiAgICAgICAgIElCZWF2ZXJIYXJ2ZXN0QXJncywgSUJlYXZlck1vdmVBcmdzLCBJQmVhdmVyUGlja3VwQXJncyxcbiAgICAgICAgIElCZWF2ZXJQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IEpvYiB9IGZyb20gXCIuL2pvYlwiO1xuaW1wb3J0IHsgUGxheWVyIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgeyBTcGF3bmVyIH0gZnJvbSBcIi4vc3Bhd25lclwiO1xuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyByZW1vdmVFbGVtZW50cyB9IGZyb20gXCJ+L3V0aWxzXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBiZWF2ZXIgaW4gdGhlIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBCZWF2ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIGFjdGlvbnMgcmVtYWluaW5nIGZvciB0aGUgQmVhdmVyIHRoaXMgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgYWN0aW9ucyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgYnJhbmNoZXMgdGhpcyBCZWF2ZXIgaXMgaG9sZGluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgYnJhbmNoZXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGZvb2QgdGhpcyBCZWF2ZXIgaXMgaG9sZGluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9vZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGhlYWx0aCB0aGlzIEJlYXZlciBoYXMgbGVmdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGVhbHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEpvYiB0aGlzIEJlYXZlciB3YXMgcmVjcnVpdGVkIHRvIGRvLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBqb2I6IEpvYjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IG1vdmVzIHRoaXMgQmVhdmVyIGhhcyBsZWZ0IHRoaXMgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW92ZXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgUGxheWVyIHRoYXQgb3ducyBhbmQgY2FuIGNvbnRyb2wgdGhpcyBCZWF2ZXIuXG4gICAgICovXG4gICAgcHVibGljIG93bmVyOiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUcnVlIGlmIHRoZSBCZWF2ZXIgaGFzIGZpbmlzaGVkIGJlaW5nIHJlY3J1aXRlZCBhbmQgY2FuIGRvIHRoaW5ncywgRmFsc2VcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIHJlY3J1aXRlZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0aGlzIEJlYXZlciBpcyBvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdGlsZT86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgdHVybnMgdGhpcyBCZWF2ZXIgaXMgZGlzdHJhY3RlZCBmb3IgKDAgbWVhbnMgbm90IGRpc3RyYWN0ZWQpLlxuICAgICAqL1xuICAgIHB1YmxpYyB0dXJuc0Rpc3RyYWN0ZWQhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBCZWF2ZXIgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SUJlYXZlclByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8qKiBUaGUgSm9iIG9mIHRoaXMgQmVhdmVyLiAqL1xuICAgICAgICAgICAgam9iOiBKb2I7XG4gICAgICAgICAgICAvKiogVGhlIGNvbnRyb2xsaW5nIFBsYXllciBvZiB0aGlzIEJlYXZlci4gKi9cbiAgICAgICAgICAgIG93bmVyOiBQbGF5ZXI7XG4gICAgICAgICAgICAvKiogVGhlIFRpbGUgdG8gc3Bhd24gdGhpcyBCZWF2ZXIgdXBvbi4gKi9cbiAgICAgICAgICAgIHRpbGU6IFRpbGU7XG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cblxuICAgICAgICB0aGlzLm93bmVyID0gYXJncy5vd25lcjtcbiAgICAgICAgdGhpcy5qb2IgPSBhcmdzLmpvYjtcbiAgICAgICAgdGhpcy50aWxlID0gYXJncy50aWxlO1xuXG4gICAgICAgIHRoaXMuaGVhbHRoID0gdGhpcy5qb2IuaGVhbHRoO1xuICAgICAgICB0aGlzLmFjdGlvbnMgPSB0aGlzLmpvYi5hY3Rpb25zO1xuICAgICAgICB0aGlzLm1vdmVzID0gdGhpcy5qb2IubW92ZXM7XG4gICAgICAgIHRoaXMudGlsZS5iZWF2ZXIgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5uZXdCZWF2ZXJzLnB1c2godGhpcyk7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgYXR0YWNrLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBiZWF2ZXIgLSBUaGUgQmVhdmVyIHRvIGF0dGFjay4gTXVzdCBiZSBvbiBhbiBhZGphY2VudCBUaWxlLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUF0dGFjayhcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGJlYXZlcjogQmVhdmVyLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJQmVhdmVyQXR0YWNrQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtYXR0YWNrIC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFiZWF2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtiZWF2ZXJ9IGlzIG5vdCBhIHZhbGlkIGJlYXZlciBmb3IgJHt0aGlzfSB0byBhdHRhY2suYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghYmVhdmVyLnJlY3J1aXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke2JlYXZlcn0gaGFzIG5vdCBmaW5pc2hlZCBiZWluZyByZWNydWl0ZWQgeWV0LCBhbmQgY2Fubm90IGJlIGF0dGFja2VkIHlldC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUuaGFzTmVpZ2hib3IoYmVhdmVyLnRpbGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7YmVhdmVyfSBpcyBub3QgYWRqYWNlbnQgdG8gJHt0aGlzfSBiZWF2ZXIgdG8gYmUgYXR0YWNrZWQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNrcyBhbm90aGVyIGFkamFjZW50IGJlYXZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGJlYXZlciAtIFRoZSBCZWF2ZXIgdG8gYXR0YWNrLiBNdXN0IGJlIG9uIGFuIGFkamFjZW50IFRpbGUuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYXR0YWNrZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYXR0YWNrKHBsYXllcjogUGxheWVyLCBiZWF2ZXI6IEJlYXZlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuXG4gICAgICAgIGlmICghYmVhdmVyLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBpcyBhdHRhY2tpbmcgd2l0aG91dCBiZWluZyBvbiBhIFRpbGUhYCk7XG4gICAgICAgIH1cblxuICAgICAgICBiZWF2ZXIuaGVhbHRoID0gTWF0aC5tYXgoMCwgYmVhdmVyLmhlYWx0aCAtIHRoaXMuam9iLmRhbWFnZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIGJlYXZlciBpcyBhbHJlYWR5IGRpc3RyYWN0ZWQsIGtlZXAgdGhhdCB2YWx1ZSwgb3RoZXJ3aXNlIHRoZXlcbiAgICAgICAgLy8gZ2V0IGRpc3RyYWN0ZWQgYnkgdGhpcyBhdHRhY2tcbiAgICAgICAgYmVhdmVyLnR1cm5zRGlzdHJhY3RlZCA9IGJlYXZlci50dXJuc0Rpc3RyYWN0ZWQgfHwgdGhpcy5qb2IuZGlzdHJhY3Rpb25Qb3dlcjtcbiAgICAgICAgdGhpcy5hY3Rpb25zLS07XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGVuZW15IGJlYXZlciBkaWVkLlxuICAgICAgICBpZiAoYmVhdmVyLmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAvLyBEcm9wIGl0J3MgcmVzb3VyY2VzIG9uIHRoZSBncm91bmQuXG4gICAgICAgICAgICBiZWF2ZXIudGlsZS5icmFuY2hlcyArPSBiZWF2ZXIuYnJhbmNoZXM7XG4gICAgICAgICAgICBiZWF2ZXIudGlsZS5mb29kICs9IGJlYXZlci5mb29kO1xuXG4gICAgICAgICAgICAvLyBBbmQgc2V0IGl0cyB2YWx1ZXMgdG8gaW52YWxpZCBudW1iZXJzIHRvIHNpZ25pZnkgaXQgaXMgZGVhZC5cbiAgICAgICAgICAgIGJlYXZlci5icmFuY2hlcyA9IC0xO1xuICAgICAgICAgICAgYmVhdmVyLmZvb2QgPSAtMTtcbiAgICAgICAgICAgIGJlYXZlci5hY3Rpb25zID0gLTE7XG4gICAgICAgICAgICBiZWF2ZXIubW92ZXMgPSAtMTtcbiAgICAgICAgICAgIGJlYXZlci50dXJuc0Rpc3RyYWN0ZWQgPSAtMTtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGhpbSBmcm9tIHRoZSBtYXAgb2YgdGlsZXMuXG4gICAgICAgICAgICBiZWF2ZXIudGlsZS5iZWF2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBiZWF2ZXIudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgYnVpbGRMb2RnZS4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZVxuICAgICAqIHBhc3NlZCBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nXG4gICAgICogdGVsbGluZyB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVCdWlsZExvZGdlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUJlYXZlckJ1aWxkTG9kZ2VBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1idWlsZExvZGdlIC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh0aGlzLmJyYW5jaGVzICsgdGhpcy50aWxlLmJyYW5jaGVzKSA8IHBsYXllci5icmFuY2hlc1RvQnVpbGRMb2RnZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGRvZXMgbm90IGhhdmUgZW5vdWdoIGJyYW5jaGVzIHRvIGJ1aWxkIHRoZSBsb2RnZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGlsZS5sb2RnZU93bmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpcy50aWxlfSBhbHJlYWR5IGhhcyBhIGxvZGdlIG93bmVkIGJ5ICR7dGhpcy50aWxlLmxvZGdlT3duZXJ9LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlLnNwYXduZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzLnRpbGV9IGhhcyBhIHNwYXduZXIgd2hpY2ggY2Fubm90IGJlIGJ1aWx0IG92ZXIuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWJ1aWxkTG9kZ2UgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkcyBhIGxvZGdlIG9uIHRoZSBCZWF2ZXJzIGN1cnJlbnQgVGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYnVpbHQgYSBsb2RnZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBidWlsZExvZGdlKHBsYXllcjogUGxheWVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGJ1aWxkTG9kZ2UgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZSBidXQgaXMgdHJ5aW5nIHRvIGJ1aWxkIGEgbG9kZ2UhYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdmVyY2hhcmdlIHRpbGUncyBicmFuY2hlc1xuICAgICAgICB0aGlzLnRpbGUuYnJhbmNoZXMgLT0gcGxheWVyLmJyYW5jaGVzVG9CdWlsZExvZGdlO1xuICAgICAgICBpZiAodGhpcy50aWxlLmJyYW5jaGVzIDwgMCkge1xuICAgICAgICAgICAgLy8gTWFrZSB1cCBkaWZmZXJlbmNlIHdpdGggdGhpcyBCZWF2ZXIncyBicmFuY2hlc1xuICAgICAgICAgICAgLy8gTk9URSBUaWxlIGhhcyBhIGRlYnQsIGllIGEgbmVnYXRpdmUgdmFsdWUgYmVpbmcgYWRkZWRcbiAgICAgICAgICAgIHRoaXMuYnJhbmNoZXMgKz0gdGhpcy50aWxlLmJyYW5jaGVzO1xuICAgICAgICAgICAgdGhpcy50aWxlLmJyYW5jaGVzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsbCB0aGUgYnJhbmNoZXMgYXJlIG5vdyBvbiB0aGlzIHRpbGUgdG8gbWFrZXVwIHRoZSBsb2RnZVxuICAgICAgICB0aGlzLnRpbGUuYnJhbmNoZXMgPSBwbGF5ZXIuYnJhbmNoZXNUb0J1aWxkTG9kZ2U7XG4gICAgICAgIHRoaXMudGlsZS5sb2RnZU93bmVyID0gcGxheWVyO1xuICAgICAgICB0aGlzLm93bmVyLmxvZGdlcy5wdXNoKHRoaXMudGlsZSk7XG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xuXG4gICAgICAgIHBsYXllci5jYWxjdWxhdGVCcmFuY2hlc1RvQnVpbGRMb2RnZSgpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBidWlsZExvZGdlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGRyb3AuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBkcm9wIGJyYW5jaGVzL2Zvb2Qgb24uIE11c3QgYmUgdGhlIHNhbWUgVGlsZVxuICAgICAqIHRoYXQgdGhlIEJlYXZlciBpcyBvbiwgb3IgYW4gYWRqYWNlbnQgb25lLlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSAtIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGRyb3AgKCdicmFuY2hlcycgb3IgJ2Zvb2QnKS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0aGUgcmVzb3VyY2UgdG8gZHJvcCwgbnVtYmVycyA8PSAwIHdpbGxcbiAgICAgKiBkcm9wIGFsbCB0aGUgcmVzb3VyY2UgdHlwZS5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVEcm9wKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgcmVzb3VyY2U6IFwiYnJhbmNoZXNcIiB8IFwiZm9vZFwiLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElCZWF2ZXJEcm9wQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZHJvcCAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIHRpbGUuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyYW5zZm9ybSB0aGUgYW1vdW50IGlmIHRoZXkgcGFzc2VkIGluIGEgbnVtYmVyID08IDBcbiAgICAgICAgY29uc3QgYWN0dWFsQW1vdW50ID0gYW1vdW50IDw9IDBcbiAgICAgICAgICAgID8gdGhpc1tyZXNvdXJjZV1cbiAgICAgICAgICAgIDogYW1vdW50O1xuXG4gICAgICAgIGlmIChhY3R1YWxBbW91bnQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBkcm9wICR7YWN0dWFsQW1vdW50fSBvZiAke3Jlc291cmNlfWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0dWFsQW1vdW50ID4gdGhpc1tyZXNvdXJjZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBkb2VzIG5vdCBoYXZlICR7YWN0dWFsQW1vdW50fSAke3Jlc291cmNlfSB0byBkcm9wLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgYSB2YWxpZCB0aWxlIHRvIGRyb3AgcmVzb3VyY2VzIG9uLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlICE9PSB0aWxlICYmICF0aGlzLnRpbGUuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgdGhlIGFkamFjZW50IHRvIG9yIGVxdWFsIHRvIHRoZSB0aWxlICR7dGhpc30gaXMgb24gKCR7dGhpcy50aWxlfSlgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUuc3Bhd25lcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGhhcyAke3RpbGUuc3Bhd25lcn0gb24gaXQsIGFuZCBjYW5ub3QgaGF2ZSByZXNvdXJjZWQgZHJvcHBlZCBvbnRvIGl0LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29rcyB2YWxpZCFcbiAgICAgICAgLy8gbGV0J3Mgb3ZlcnJpZGUgdGhlaXIgYGFtb3VudGAgYXJndW1lbnQgd2l0aCB0aGUgYWN0dWFsIG51bWJlci5cbiAgICAgICAgcmV0dXJuIHsgYW1vdW50OiBhY3R1YWxBbW91bnQgfTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1kcm9wIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcm9wcyBzb21lIG9mIHRoZSBnaXZlbiByZXNvdXJjZSBvbiB0aGUgYmVhdmVyJ3MgVGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBkcm9wIGJyYW5jaGVzL2Zvb2Qgb24uIE11c3QgYmUgdGhlIHNhbWUgVGlsZVxuICAgICAqIHRoYXQgdGhlIEJlYXZlciBpcyBvbiwgb3IgYW4gYWRqYWNlbnQgb25lLlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSAtIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGRyb3AgKCdicmFuY2hlcycgb3IgJ2Zvb2QnKS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0aGUgcmVzb3VyY2UgdG8gZHJvcCwgbnVtYmVycyA8PSAwIHdpbGxcbiAgICAgKiBkcm9wIGFsbCB0aGUgcmVzb3VyY2UgdHlwZS5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBkcm9wcGVkIHRoZSByZXNvdXJjZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBkcm9wKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgcmVzb3VyY2U6IFwiYnJhbmNoZXNcIiB8IFwiZm9vZFwiLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGRyb3AgLS0+PlxuXG4gICAgICAgIC8vIFdlIGtub3cgaXQgbXVzdCBiZSB0aGlzIGZyb20gdGhlIGFib3ZlIGZ1bmN0aW9uLlxuICAgICAgICBjb25zdCByZXMgPSByZXNvdXJjZTtcblxuICAgICAgICB0aGlzW3Jlc10gLT0gYW1vdW50O1xuICAgICAgICB0aWxlW3Jlc10gKz0gYW1vdW50O1xuICAgICAgICB0aGlzLmFjdGlvbnMtLTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogZHJvcCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBoYXJ2ZXN0LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZFxuICAgICAqIGluIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZ1xuICAgICAqIHRoZW0gd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBzcGF3bmVyIC0gVGhlIFNwYXduZXIgeW91IHdhbnQgdG8gaGFydmVzdC4gTXVzdCBiZSBvbiBhbiBhZGphY2VudFxuICAgICAqIFRpbGUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlSGFydmVzdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHNwYXduZXI6IFNwYXduZXIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElCZWF2ZXJIYXJ2ZXN0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtaGFydmVzdCAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIHRpbGUuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc3Bhd25lcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3NwYXduZXJ9IGlzIG5vdCBhIHZhbGlkIFNwYXduZXJgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUuaGFzTmVpZ2hib3Ioc3Bhd25lci50aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG9uIHRpbGUgJHt0aGlzLnRpbGV9IGlzIG5vdCBhZGphY2VudCB0byAke3NwYXduZXIudGlsZX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbG9hZCA9IHRoaXMuZm9vZCArIHRoaXMuYnJhbmNoZXM7XG4gICAgICAgIGlmIChsb2FkID49IHRoaXMuam9iLmNhcnJ5TGltaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgQmVhdmVyIGNhbm5vdCBjYXJyeSBhbnkgbW9yZSByZXNvdXJjZXMuIExpbWl0OiAoJHtsb2FkfS8ke3RoaXMuam9iLmNhcnJ5TGltaXR9KWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1oYXJ2ZXN0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYXJ2ZXN0cyB0aGUgYnJhbmNoZXMgb3IgZm9vZCBmcm9tIGEgU3Bhd25lciBvbiBhbiBhZGphY2VudCBUaWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gc3Bhd25lciAtIFRoZSBTcGF3bmVyIHlvdSB3YW50IHRvIGhhcnZlc3QuIE11c3QgYmUgb24gYW4gYWRqYWNlbnRcbiAgICAgKiBUaWxlLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGhhcnZlc3RlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBoYXJ2ZXN0KFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgc3Bhd25lcjogU3Bhd25lcixcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaGFydmVzdCAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIGhhcnZlc3QuXG5cbiAgICAgICAgY29uc3QgbG9hZCA9IHRoaXMuZm9vZCArIHRoaXMuYnJhbmNoZXM7XG4gICAgICAgIGNvbnN0IHNwYWNlQXZhaWxhYmxlID0gdGhpcy5qb2IuY2FycnlMaW1pdCAtIGxvYWQ7XG4gICAgICAgIGNvbnN0IHNraWxsU2NhbGFyID0gc3Bhd25lci50eXBlID09PSBcImJyYW5jaGVzXCJcbiAgICAgICAgICAgID8gdGhpcy5qb2IuY2hvcHBpbmdcbiAgICAgICAgICAgIDogdGhpcy5qb2IubXVuY2hpbmc7XG5cbiAgICAgICAgY29uc3QgbWF4Q2FuSGFydmVzdCA9IChcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zcGF3bmVySGFydmVzdENvbnN0YW50ICpcbiAgICAgICAgICAgIHNwYXduZXIuaGVhbHRoICpcbiAgICAgICAgICAgIHNraWxsU2NhbGFyXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpc1tzcGF3bmVyLnR5cGVdICs9IE1hdGgubWluKFxuICAgICAgICAgICAgc3BhY2VBdmFpbGFibGUsXG4gICAgICAgICAgICBtYXhDYW5IYXJ2ZXN0LFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmFjdGlvbnMtLTtcblxuICAgICAgICAvLyBkYW1hZ2UgdGhlIHNwYXduZXIgYmVjYXVzZSB3ZSBoYXJ2ZXN0ZWQgZnJvbSBpdFxuICAgICAgICBpZiAoc3Bhd25lci5oZWFsdGggPiAwKSB7XG4gICAgICAgICAgICBzcGF3bmVyLmhlYWx0aC0tO1xuICAgICAgICB9XG5cbiAgICAgICAgc3Bhd25lci5oYXNCZWVuSGFydmVzdGVkID0gdHJ1ZTtcbiAgICAgICAgc3Bhd25lci5oYXJ2ZXN0Q29vbGRvd24gPSAyO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBoYXJ2ZXN0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIG1vdmUuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0aGlzIEJlYXZlciBzaG91bGQgbW92ZSB0by5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVNb3ZlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUJlYXZlck1vdmVBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSk7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubW92ZXMgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG91dCBvZiBtb3Zlcy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gaXMgbm90IGEgdmFsaWQgdGlsZSB0byBtb3ZlIHRvLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGlsZS5iZWF2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBhbHJlYWR5IG9jY3VwaWVkIGJ5ICR7dGlsZS5iZWF2ZXJ9LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGlsZS5sb2RnZU93bmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gY29udGFpbnMgYSBsb2RnZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUuc3Bhd25lcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGNvbnRhaW5zICR7dGlsZS5zcGF3bmVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbW92ZW1lbnRDb3N0ID0gdGhpcy50aWxlLmdldE1vdmVtZW50Q29zdCh0aWxlKTtcbiAgICAgICAgaWYgKGlzTmFOKG1vdmVtZW50Q29zdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgYWRqYWNlbnQgdG8gJHt0aGlzLnRpbGV9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1vdmVzIDwgbW92ZW1lbnRDb3N0KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gY29zdHMgJHttb3ZlbWVudENvc3R9IHRvIHJlYWNoLCBhbmQgJHt0aGlzfSBvbmx5IGhhcyAke3RoaXMubW92ZXN9IG1vdmVzLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlcyB0aGlzIEJlYXZlciBmcm9tIGl0cyBjdXJyZW50IFRpbGUgdG8gYW4gYWRqYWNlbnQgVGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0aGlzIEJlYXZlciBzaG91bGQgbW92ZSB0by5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBtb3ZlIHdvcmtlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBtb3ZlKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZSB0byBtb3ZlIGZyb20hYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYWxjdWxhdGUgbW92ZW1lbnQgY29zdCBiZWZvcmUgbW92aW5nXG4gICAgICAgIGNvbnN0IGNvc3QgPSB0aGlzLnRpbGUuZ2V0TW92ZW1lbnRDb3N0KHRpbGUpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0YXJnZXQgdGlsZSdzIGJlYXZlciB0byB0aGlzIGJlYXZlclxuICAgICAgICB0aWxlLmJlYXZlciA9IHRoaXM7XG5cbiAgICAgICAgLy8gcmVtb3ZlIG1lIGZyb20gdGhlIHRpbWUgSSB3YXMgb25cbiAgICAgICAgdGhpcy50aWxlLmJlYXZlciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyB1cGRhdGUgdGhpcyBiZWF2ZXIncyB0aWxlIHRvIHRhcmdldCB0aWxlXG4gICAgICAgIHRoaXMudGlsZSA9IHRpbGU7XG5cbiAgICAgICAgLy8gZmluYWxseSBkZWNyZW1lbnQgdGhpcyBiZWF2ZXIncyBtb3ZlcyBjb3VudCBieSB0aGUgbW92ZSBjb3N0XG4gICAgICAgIHRoaXMubW92ZXMgLT0gY29zdDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBwaWNrdXAuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBwaWNrdXAgYnJhbmNoZXMvZm9vZCBmcm9tLiBNdXN0IGJlIHRoZSBzYW1lXG4gICAgICogVGlsZSB0aGF0IHRoZSBCZWF2ZXIgaXMgb24sIG9yIGFuIGFkamFjZW50IG9uZS5cbiAgICAgKiBAcGFyYW0gcmVzb3VyY2UgLSBUaGUgdHlwZSBvZiByZXNvdXJjZSB0byBwaWNrdXAgKCdicmFuY2hlcycgb3IgJ2Zvb2QnKS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiB0aGUgcmVzb3VyY2UgdG8gZHJvcCwgbnVtYmVycyA8PSAwIHdpbGxcbiAgICAgKiBwaWNrdXAgYWxsIG9mIHRoZSByZXNvdXJjZSB0eXBlLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVBpY2t1cChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIHJlc291cmNlOiBcImJyYW5jaGVzXCIgfCBcImZvb2RcIixcbiAgICAgICAgYW1vdW50OiBudW1iZXIgPSAwLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJQmVhdmVyUGlja3VwQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcGlja3VwIC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgdGlsZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gaXMgbm90IGEgdmFsaWQgdGlsZSB0byBwaWNrIHVwIHJlc291cmNlcyBmcm9tLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlICE9PSB0aWxlICYmICF0aGlzLnRpbGUuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgdGhlIGFkamFjZW50IHRvIG9yIGVxdWFsIHRvIHRoZSB0aWxlICR7dGhpc30gaXMgb24gKCR7dGhpcy50aWxlfSlgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUuc3Bhd25lcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGhhcyAke3RpbGUuc3Bhd25lcn0gb24gaXQsIGFuZCBjYW5ub3QgaGF2ZSByZXNvdXJjZXMgcGlja2VkIHVwIGZyb20gaXQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyYW5zZm9ybSB0aGUgcmVzb3VyY2UgaW50byB0aGUgZmlyc3QsIGxvd2VyIGNhc2VkLCBjaGFyYWN0ZXIuXG4gICAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBrbm93ICdmJyB2cyAnYicgdG8gdGVsbCB3aGF0IHJlc291cmNlIHR5cGUuXG4gICAgICAgIGNvbnN0IGNoYXIgPSByZXNvdXJjZVswXS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChjaGFyICE9PSBcImZcIiAmJiBjaGFyICE9PSBcImJcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3Jlc291cmNlfSBpcyBub3QgYSB2YWxpZCByZXNvdXJjZSB0byBwaWNrIHVwLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYWxjdWxhdGUgbWF4IHJlc291cmNlcyB0aGUgYmVhdmVyIGNhbiBjYXJyeS5cbiAgICAgICAgY29uc3Qgc3BhY2VBdmFpbGFibGUgPSB0aGlzLmpvYi5jYXJyeUxpbWl0IC0gdGhpcy5icmFuY2hlcyAtIHRoaXMuZm9vZDtcblxuICAgICAgICAvLyBUcmFuc2Zvcm0gdGhlIGFtb3VudCBpZiB0aGV5IHBhc3NlZCBpbiBhIG51bWJlciA9PCAwXG4gICAgICAgIGNvbnN0IGFjdHVhbEFtb3VudCA9IGFtb3VudCA8PSAwXG4gICAgICAgICAgICA/IE1hdGgubWluKHRpbGVbcmVzb3VyY2VdLCBzcGFjZUF2YWlsYWJsZSlcbiAgICAgICAgICAgIDogYW1vdW50O1xuXG4gICAgICAgIGlmIChhY3R1YWxBbW91bnQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBwaWNrIHVwICR7YWN0dWFsQW1vdW50fSBvZiAke3Jlc291cmNlfWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0dWFsQW1vdW50ID4gdGlsZVtyZXNvdXJjZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBkb2VzIG5vdCBoYXZlICR7YWN0dWFsQW1vdW50fSAke3Jlc291cmNlfSB0byBwaWNrIHVwLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWN0dWFsQW1vdW50ID4gc3BhY2VBdmFpbGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgYCR7dGhpc30gY2Fubm90IGNhcnJ5ICR7YWN0dWFsQW1vdW50fSBvZiAke3Jlc291cmNlfSBiZWNhdXNlIGl0IGBcbiAgICAgICAgICAgICAgICArIGBvbmx5IGNhbiBjYXJyeSAke3NwYWNlQXZhaWxhYmxlfSBtb3JlIHJlc291cmNlc2BcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBhbW91bnQ6IGFjdHVhbEFtb3VudCB9O1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXBpY2t1cCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdXAgc29tZSBicmFuY2hlcyBvciBmb29kIG9uIHRoZSBiZWF2ZXIncyB0aWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIHBpY2t1cCBicmFuY2hlcy9mb29kIGZyb20uIE11c3QgYmUgdGhlIHNhbWVcbiAgICAgKiBUaWxlIHRoYXQgdGhlIEJlYXZlciBpcyBvbiwgb3IgYW4gYWRqYWNlbnQgb25lLlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSAtIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIHBpY2t1cCAoJ2JyYW5jaGVzJyBvciAnZm9vZCcpLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRoZSByZXNvdXJjZSB0byBkcm9wLCBudW1iZXJzIDw9IDAgd2lsbFxuICAgICAqIHBpY2t1cCBhbGwgb2YgdGhlIHJlc291cmNlIHR5cGUuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgcGlja2VkIHVwIGEgcmVzb3VyY2UsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgcGlja3VwKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgcmVzb3VyY2U6IFwiYnJhbmNoZXNcIiB8IFwiZm9vZFwiLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHBpY2t1cCAtLT4+XG5cbiAgICAgICAgdGlsZVtyZXNvdXJjZV0gLT0gYW1vdW50O1xuICAgICAgICB0aGlzW3Jlc291cmNlXSArPSBhbW91bnQ7XG4gICAgICAgIHRoaXMuYWN0aW9ucy0tO1xuXG4gICAgICAgIC8vIGlmIHRoZSB0aWxlIGlzIGEgbG9kZ2UsIGFuZCBpdCBoYXMgcmVhY2hlZCAwIGJyYW5jaGVzLCBpdCBpcyBubyBsb25nZXIgYSBsb2RnZVxuICAgICAgICBpZiAodGlsZS5sb2RnZU93bmVyICYmIHRpbGUuYnJhbmNoZXMgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGxvZGdlT3duZXIgPSB0aWxlLmxvZGdlT3duZXI7XG4gICAgICAgICAgICByZW1vdmVFbGVtZW50cyhsb2RnZU93bmVyLmxvZGdlcywgdGlsZSk7XG4gICAgICAgICAgICB0aWxlLmxvZGdlT3duZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBsb2RnZU93bmVyLmNhbGN1bGF0ZUJyYW5jaGVzVG9CdWlsZExvZGdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGlja3VwIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVHJpZXMgdG8gaW52YWxpZGF0ZSBhcmdzIGZvciBhbiBhY3Rpb24gZnVuY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSB0aGUgcGxheWVyIGNvbW1hbmRpbmcgdGhpcyBCZWF2ZXJcbiAgICAgKiBAcGFyYW0gZG9udENoZWNrQWN0aW9ucyAtIHBhc3MgdHJ1ZSB0byBub3QgY2hlY2sgaWYgdGhlIGJlYXZlciBoYXMgZW5vdWdoIGFjdGlvbnNcbiAgICAgKiBAcmV0dXJucyBUaGUgcmVhc29uIHRoaXMgaXMgaW52YWxpZCwgdW5kZWZpbmVkIGlmIGxvb2tzIHZhbGlkIHNvIGZhclxuICAgICAqL1xuICAgIHByaXZhdGUgaW52YWxpZGF0ZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGRvbnRDaGVja0FjdGlvbnM/OiB0cnVlLFxuICAgICk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghcGxheWVyIHx8IHBsYXllciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtwbGF5ZXJ9IGl0IGlzIG5vdCB5b3VyIHR1cm4uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb3duZWQgYnkgeW91LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGRlYWQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnR1cm5zRGlzdHJhY3RlZCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkaXN0cmFjdGVkIGZvciAke3RoaXMudHVybnNEaXN0cmFjdGVkfSBtb3JlIHR1cm5zLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMucmVjcnVpdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgc3RpbGwgYmVpbmcgcmVjcnVpdGVkIGFuZCBjYW5ub3QgYmUgb3JkZXJlZCB5ZXQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZG9udENoZWNrQWN0aW9ucyAmJiB0aGlzLmFjdGlvbnMgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGRvZXMgbm90IGhhdmUgYW55IGFjdGlvbnMgbGVmdC5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=