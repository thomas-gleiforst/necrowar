"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- /Creer-Merge: imports -->>
/**
 * A unit in the game.
 */
class Unit extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Unit is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.energy = args.energy || 100;
        this.job = args.job || this.game.jobs[0];
        this.moves = this.job.moves;
        this.owner = args.owner;
        this.tile = args.tile;
        this.turnsToDie = args.turnsToDie || -1;
        this.movementTarget = args.movementTarget;
        this.game.units.push(this);
        if (this.owner) {
            this.owner.units.push(this);
            this.owner.calculateSquads();
        }
        else {
            this.squad = [this];
        }
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
     * @param tile - The Tile to attack.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAttack(player, tile) {
        // <<-- Creer-Merge: invalidate-attack -->>
        const reason = this.invalidate(player, true, false);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (this.job.title !== "soldier") {
            return `${this} cannot attack as they are not a soldier! Their only combat ability is as a meatshield!`;
        }
        if (this.tile.hasNeighbor(tile)) {
            return `${tile} is not adjacent to ${this}.`;
        }
        if (tile.structure && tile.structure.type !== "road") {
            // Attacking a structure, no checks needed here
        }
        else if (tile.unit) {
            // Attacking a unit
            if (tile.unit.owner === player) {
                return `${this} can't attack friends!`;
            }
        }
        else {
            return `There is nothing on ${tile} for ${this} to attack!`;
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks an adjacent Tile. Costs an action for each Unit in this Unit's
     * squad. Units in the squad without an action don't participate in combat.
     * Units in combat cannot move afterwards. Attacking structures will not
     * give materials.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to attack.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, tile) {
        // <<-- Creer-Merge: attack -->>
        let attackSum = 0; // damage to be distributed
        const toDie = new Set(); // update dead later
        for (const soldier of this.squad) {
            let attackMod = 1; // damage modifier, if unit near allied monument
            if (!soldier.acted) { // if soldier hasn't acted
                if (soldier.isInRange("monument")) {
                    attackMod = this.game.monumentCostMult;
                } // if ally monument nearby, take less dmg from contributing
                soldier.energy -= soldier.job.actionCost * attackMod;
                soldier.acted = true;
                soldier.moves = 0;
                attackSum += soldier.job.actionCost;
                if (soldier.energy <= 0) { // if died
                    // soldier.energy is negative here, can only contribute as much energy as unit has
                    attackSum += soldier.energy / attackMod;
                    toDie.add(soldier);
                }
            }
        }
        // EVERYTHING BEFORE IS CALCULATING DAMAGE, AFTER IS DEALING THE DAMAGE
        if (tile.structure && tile.structure.type !== "road") { // checking if unit or attack-able structure
            // Attack a structure
            tile.structure.materials -= attackSum;
            if (tile.structure.materials <= 0) {
                // Structure will get removed from arrays in next turn logic
                tile.structure.tile = undefined;
                tile.structure = undefined;
            }
        }
        else { // assuming unit, which it should be if not a structure
            // Attack a unit/squad
            if (!tile.unit) {
                throw new Error(`${this} attacking ${tile} with no unit on it!`);
            }
            for (const target of tile.unit.squad) {
                let attackMod = 1; // damage modifier
                if (target.isInRange("monument")) {
                    // if near enemy monument, take less dmg
                    attackMod = this.game.monumentCostMult;
                }
                target.energy -= attackSum * attackMod / tile.unit.squad.length;
                if (target.energy <= 0) {
                    toDie.add(target);
                }
            }
        }
        // IT'S KILLING TIME
        for (const dead of toDie) {
            // Drop carried resources
            if (!dead.tile) {
                throw new Error(`${dead} is already dead`);
            }
            dead.tile.food += dead.food;
            dead.tile.materials += dead.materials;
            dead.food = 0;
            dead.materials = 0;
            if (dead.owner) {
                if (dead.job.title !== "cat overlord") {
                    // actually fresh human converting time, not in fact killing time
                    dead.job = this.game.jobs[0];
                    dead.turnsToDie = 10;
                    dead.energy = 100;
                    dead.squad = [dead];
                    // Don't actually remove it from the player's units array yet
                    dead.owner.defeatedUnits.push(dead);
                    // Make sure the previous owner can't control it anymore
                    dead.owner = undefined;
                }
            }
            else {
                // Neutral fresh human, will get removed from arrays in next turn logic
                dead.tile.unit = undefined;
                dead.tile = undefined;
            }
        }
        // updating squads
        for (const p of this.game.players) {
            p.calculateSquads();
        }
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for changeJob. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param job - The name of the Job to change to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateChangeJob(player, job) {
        // <<-- Creer-Merge: invalidate-changeJob -->>
        const reason = this.invalidate(player, true, false);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (this.job.title === "cat overlord") {
            return `${this} is the overlord. It cannot change jobs!`;
        }
        if (this.job.title === job) {
            return `${this} cannot change to its own job!`;
        }
        if (this.energy < 100) {
            return `${this} must be at 100 energy to change jobs`;
        }
        if (!player.cat.tile) {
            return `Player's Cat ${player.cat} is not on a Tile!`;
        }
        if (Math.abs(this.tile.x - player.cat.tile.x) > 1
            || Math.abs(this.tile.y - player.cat.tile.y) > 1) {
            return `${this} must be adjacent or diagonal to your cat to change jobs`;
        }
        // <<-- /Creer-Merge: invalidate-changeJob -->>
    }
    /**
     * Changes this Unit's Job. Must be at max energy (100.0) to change Jobs.
     *
     * @param player - The player that called this.
     * @param job - The name of the Job to change to.
     * @returns True if successfully changed Jobs, false otherwise.
     */
    async changeJob(player, job) {
        // <<-- Creer-Merge: changeJob -->>
        const actualJob = this.game.jobs.find((j) => j.title === job);
        if (!actualJob) {
            throw new Error(`Trying to set ${this} to unknown job ${job}.`);
        }
        if (!this.tile || !this.owner) {
            throw new Error(`${this} is dead and cannot change job`);
        }
        this.job = actualJob;
        this.acted = true;
        this.moves = 0; // It takes all their time
        this.tile.food += this.food;
        this.tile.materials += this.materials;
        this.food = 0;
        this.materials = 0;
        this.owner.calculateSquads();
        return true;
        // <<-- /Creer-Merge: changeJob -->>
    }
    /**
     * Invalidation function for construct. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to construct the Structure on. It must have
     * enough materials on it for a Structure to be constructed.
     * @param type - The type of Structure to construct on that Tile.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateConstruct(player, tile, type) {
        // <<-- Creer-Merge: invalidate-construct -->>
        const reason = this.invalidate(player, true, true);
        if (reason) {
            return reason;
        }
        else if (this.job.title !== "builder") {
            return `${this} is not a builder. Only builders can construct!`;
        }
        else if (tile.structure) {
            return `${tile} already has a structure! ${this} cannot construct here!`;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        // Check structure type and if they have enough materials
        if (tile.unit && type !== "shelter") {
            return `${this} can't construct on ${tile} because ${tile.unit} is there!`;
        }
        if (!this.tile.hasNeighbor(tile)) {
            return `${tile} is not adjacent to ${this}.`;
        }
        const matsNeeded = this.game.getStructureCost(type);
        if (tile.materials < matsNeeded) {
            return `There aren't enough materials on ${tile}. You need ${matsNeeded} to construct a ${type}.`;
        }
        // <<-- /Creer-Merge: invalidate-construct -->>
    }
    /**
     * Constructs a Structure on an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to construct the Structure on. It must have
     * enough materials on it for a Structure to be constructed.
     * @param type - The type of Structure to construct on that Tile.
     * @returns True if successfully constructed a structure, false otherwise.
     */
    async construct(player, tile, type) {
        // <<-- Creer-Merge: construct -->>
        tile.structure = this.manager.create.structure({
            owner: player,
            tile,
            type,
        });
        const mult = this.isInRange("monument")
            ? this.game.monumentCostMult
            : 1;
        this.energy -= this.job.actionCost * mult;
        tile.materials -= tile.structure.materials;
        tile.harvestRate = 0;
        return true;
        // <<-- /Creer-Merge: construct -->>
    }
    /**
     * Invalidation function for convert. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile with the Unit to convert.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateConvert(player, tile) {
        // <<-- Creer-Merge: invalidate-convert -->>
        const reason = this.invalidate(player, true, true);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (this.job.title !== "missionary") {
            return `${this} isn't a missionary and is thus unable to convince units to join you cul- I mean kingdom.`;
        }
        if (!tile) {
            return `${this} can't convert a nonexistent tile to your cause.`;
        }
        if (!this.tile.hasNeighbor(tile)) {
            return `${this} can only convert units on adjacent tiles.`;
        }
        if (!tile.unit) {
            return `${this} must convert a unit. There is no unit on ${tile}.`;
        }
        if (tile.unit.owner) {
            return `The unit on ${tile} is already owned by somebody. ${this} can't convert it.`;
        }
        // <<-- /Creer-Merge: invalidate-convert -->>
    }
    /**
     * Converts an adjacent Unit to your side.
     *
     * @param player - The player that called this.
     * @param tile - The Tile with the Unit to convert.
     * @returns True if successfully converted, false otherwise.
     */
    async convert(player, tile) {
        // <<-- Creer-Merge: convert -->>
        // Unit will be added to the player's units array at the start of their next turn
        const unit = tile.unit;
        if (!unit) {
            throw new Error(`No unit on ${tile} to convert!`);
        }
        unit.turnsToDie = -1;
        unit.owner = player;
        unit.energy = 100;
        unit.acted = true;
        unit.moves = 0;
        unit.movementTarget = undefined;
        const mult = this.isInRange("monument")
            ? this.game.monumentCostMult
            : 1;
        this.energy -= this.job.actionCost * mult;
        this.acted = true;
        player.newUnits.push(unit);
        return true;
        // <<-- /Creer-Merge: convert -->>
    }
    /**
     * Invalidation function for deconstruct. Try to find a reason why the
     * passed in parameters are invalid, and return a human readable string
     * telling them why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to deconstruct. It must have a Structure on it.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDeconstruct(player, tile) {
        // <<-- Creer-Merge: invalidate-deconstruct -->>
        const reason = this.invalidate(player, true, true);
        if (reason) {
            return reason;
        }
        if (!tile.structure) {
            return `No structure on ${tile} for ${this} to deconstruct.`;
        }
        if (tile.structure.type === "road") {
            return `${this} cannot deconstruct roads!`;
        }
        else if (this.job.title !== "builder") {
            return `${this} is not a builder. Only builders can deconstruct.`;
        }
        else if (this.owner === tile.structure.owner) {
            return `${this} cannot deconstruct friendly structures. `
                + "Soldiers can destroy them by attacking them, though.";
        }
        else if (this.materials + this.food >= this.job.carryLimit) {
            return `${this} cannot carry any more materials.`;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (!this.tile.hasNeighbor(tile)) {
            return `${tile} is not adjacent to ${this}.`;
        }
        // <<-- /Creer-Merge: invalidate-deconstruct -->>
    }
    /**
     * Removes materials from an adjacent Tile's Structure. You cannot
     * deconstruct friendly structures (see Unit.attack).
     *
     * @param player - The player that called this.
     * @param tile - The Tile to deconstruct. It must have a Structure on it.
     * @returns True if successfully deconstructed, false otherwise.
     */
    async deconstruct(player, tile) {
        // <<-- Creer-Merge: deconstruct -->>
        const structure = tile.structure;
        if (!structure) {
            throw new Error(`No structure on ${tile} to desconstruct!`);
        }
        const amount = Math.min(this.job.carryLimit - this.materials - this.food, structure.materials);
        this.materials += amount;
        structure.materials -= amount;
        // Destroy structure if it's out of materials
        if (structure.materials <= 0) {
            // Structure is removed from arrays in next turn logic
            structure.tile = undefined;
            tile.structure = undefined;
        }
        const mult = this.isInRange("monument")
            ? this.game.monumentCostMult
            : 1;
        this.energy -= this.job.actionCost * mult;
        this.acted = true;
        return true;
        // <<-- /Creer-Merge: deconstruct -->>
    }
    /**
     * Invalidation function for drop. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to drop materials/food on.
     * @param resource - The type of resource to drop ('materials' or 'food').
     * @param amount - The amount of the resource to drop. Amounts <= 0 will
     * drop as much as possible.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDrop(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: invalidate-drop -->>
        const reason = this.invalidate(player, false, false);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (tile !== this.tile && !this.tile.hasNeighbor(tile)) {
            return `${this} can only drop things on or adjacent to your tile.`;
        }
        if (tile.structure) {
            if (tile.structure.type === "shelter") {
                if (tile.structure.owner !== player) {
                    return `${this} can't drop things in enemy shelters. Nice thought though.`;
                }
                else if (resource[0] !== "f" && resource[0] !== "F") {
                    return `${this} can only store food in shelters.`;
                }
            }
            else if (tile.structure.type !== "road") {
                return `${this} can't drop resources on structures.`;
            }
        }
        const maxAmount = resource === "food"
            ? this.food
            : this.materials;
        return {
            // ensure the amount is within the max amount, and if less than 1
            // then they drop everything
            amount: Math.min(maxAmount, amount < 1
                ? maxAmount
                : amount),
        };
        // <<-- /Creer-Merge: invalidate-drop -->>
    }
    /**
     * Drops some of the given resource on or adjacent to the Unit's Tile. Does
     * not count as an action.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to drop materials/food on.
     * @param resource - The type of resource to drop ('materials' or 'food').
     * @param amount - The amount of the resource to drop. Amounts <= 0 will
     * drop as much as possible.
     * @returns True if successfully dropped the resource, false otherwise.
     */
    async drop(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: drop -->>
        // Drop the resource
        if (resource === "food") {
            if (tile.structure && tile.structure.type === "shelter" && this.owner) {
                this.owner.food += amount;
            }
            else {
                tile.food += amount;
            }
            this.food -= amount;
        }
        else {
            tile.materials += amount;
            this.materials -= amount;
        }
        return true;
        // <<-- /Creer-Merge: drop -->>
    }
    /**
     * Invalidation function for harvest. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile you want to harvest.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateHarvest(player, tile) {
        // <<-- Creer-Merge: invalidate-harvest -->>
        const reason = this.invalidate(player, true, true);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (tile !== this.tile && !this.tile.hasNeighbor(tile)) {
            return "You can only harvest on or adjacent to your tile.";
        }
        // Make sure unit is harvesting a valid tile
        if (tile.structure) {
            if (tile.structure.type !== "shelter" || tile.structure.owner === player) {
                return "You can only steal from enemy shelters.";
            }
        }
        else if (tile.harvestRate < 1) {
            return "You can't harvest food from that tile.";
        }
        else if (tile.turnsToHarvest !== 0) {
            return "This tile isn't ready to harvest.";
        }
        const carry = this.food + this.materials;
        if (carry >= this.job.carryLimit) {
            return "You cannot carry anymore";
        }
        // <<-- /Creer-Merge: invalidate-harvest -->>
    }
    /**
     * Harvests the food on an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile you want to harvest.
     * @returns True if successfully harvested, false otherwise.
     */
    async harvest(player, tile) {
        // <<-- Creer-Merge: harvest -->>
        const carry = this.job.carryLimit - (this.food + this.materials);
        let pickup = 0;
        if (tile.structure && tile.structure.owner) {
            pickup = Math.min(tile.structure.owner.food, carry);
            tile.structure.owner.food -= pickup;
        }
        else {
            pickup = Math.min(tile.harvestRate, carry);
            tile.turnsToHarvest = this.game.turnsBetweenHarvests;
        }
        const mult = this.isInRange("monument") ? this.game.monumentCostMult : 1;
        this.energy -= this.job.actionCost * mult;
        this.food += pickup;
        this.acted = true;
        return true;
        // <<-- /Creer-Merge: harvest -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, tile) {
        // <<-- Creer-Merge: invalidate-move -->>
        const reason = this.invalidate(player, false, false);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (tile.unit) {
            return `Can't move because the tile is already occupied by ${tile.unit}.`;
        }
        if (this.moves < 1) {
            return "Your unit is out of moves!";
        }
        if (this.tile.hasNeighbor(tile)) {
            return "Your unit must move to a tile to the north, south, east, or west.";
        }
        if (tile.structure && tile.structure.type !== "road" && tile.structure.type !== "shelter") {
            return "Units cannot move onto structures other than roads and shelters.";
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves this Unit from its current Tile to an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns True if it moved, false otherwise.
     */
    async move(player, tile) {
        // <<-- Creer-Merge: move -->>
        if (!this.tile || !this.owner) {
            throw new Error(`${this} is trying to move while dead!`);
        }
        // Deduct the move from the unit
        this.moves -= 1;
        // Update the tiles
        this.tile.unit = undefined;
        this.tile = tile;
        tile.unit = this;
        // Recalculate squads
        this.owner.calculateSquads();
        // console.log(`${this} moving to ${tile}`);
        return true;
        // <<-- /Creer-Merge: move -->>
    }
    /**
     * Invalidation function for pickup. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to pickup materials/food from.
     * @param resource - The type of resource to pickup ('materials' or
     * 'food').
     * @param amount - The amount of the resource to pickup. Amounts <= 0 will
     * pickup as much as possible.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidatePickup(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: invalidate-pickup -->>
        const reason = this.invalidate(player, false, false);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} is not on a Tile!`;
        }
        if (!tile) {
            return `${this} can only pick things up off tiles that exist`;
        }
        if (tile !== this.tile && !this.tile.hasNeighbor(tile)) {
            return `${this} can only pickup resources on or adjacent to its tile.`;
        }
        let actualAmount = amount < 1
            ? tile[resource]
            : Math.min(tile[resource], amount);
        // Make sure it picks up more than 0 resources
        if (Math.floor(this.energy) <= 0) {
            return `${this} doesn't have enough energy to pickup anything.`;
        }
        if (this.getCarryLeft() <= 0) {
            return `${this} is already carrying as many resources as it can.`;
        }
        if (actualAmount <= 0) {
            return `There are no resources on ${tile} for ${this} to pickup.`;
        }
        // looks valid, let's update amount to the computed value
        actualAmount = Math.min(amount, this.getCarryLeft(), Math.floor(this.energy));
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-pickup -->>
    }
    /**
     * Picks up some materials or food on or adjacent to the Unit's Tile. Does
     * not count as an action.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to pickup materials/food from.
     * @param resource - The type of resource to pickup ('materials' or
     * 'food').
     * @param amount - The amount of the resource to pickup. Amounts <= 0 will
     * pickup as much as possible.
     * @returns True if successfully picked up a resource, false otherwise.
     */
    async pickup(player, tile, resource, amount = 0) {
        // <<-- Creer-Merge: pickup -->>
        tile[resource] -= amount;
        this[resource] += amount;
        this.energy -= amount;
        return true;
        // <<-- /Creer-Merge: pickup -->>
    }
    /**
     * Invalidation function for rest. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateRest(player) {
        // <<-- Creer-Merge: invalidate-rest -->>
        const reason = this.invalidate(player, true, false);
        if (reason) {
            return reason;
        }
        if (this.energy >= 100) {
            return "The unit has full energy!";
        }
        if (!this.isInRange("shelter")) {
            return "Unit must be in range of a friendly shelter to heal";
        }
        // <<-- /Creer-Merge: invalidate-rest -->>
    }
    /**
     * Regenerates energy. Must be in range of a friendly shelter to rest.
     * Costs an action. Units cannot move after resting.
     *
     * @param player - The player that called this.
     * @returns True if successfully rested, false otherwise.
     */
    async rest(player) {
        // <<-- Creer-Merge: rest -->>
        if (!this.owner || !this.tile) {
            throw new Error(`${this} trying to rest when dead!`);
        }
        // Get all shelters this unit is in range of
        const nearbyShelters = this.owner.getAllStructures().filter((structure) => {
            // Make sure this structure isn't destroyed
            if (!structure.tile) {
                return false;
            }
            // Make sure this structure is a shelter
            if (structure.type !== "shelter") {
                return false;
            }
            // Make sure this shelter is in range of this unit
            const radius = structure.effectRadius;
            return this.tile
                && Math.abs(this.tile.x - structure.tile.x) <= radius
                && Math.abs(this.tile.y - structure.tile.y) <= radius;
        });
        // Get a nearby shelter with a cat in range of it, or undefined if none
        const catShelter = nearbyShelters.find((shelter) => {
            // Make sure the cat is in range of this shelter
            const cat = this.owner && this.owner.cat;
            const radius = shelter.effectRadius;
            return Boolean(cat && cat.tile && shelter && shelter.tile
                && Math.abs(cat.tile.x - shelter.tile.x) <= radius
                && Math.abs(cat.tile.y - shelter.tile.y) <= radius);
        });
        // Calculate the energy multiplier
        let mult = 1;
        if (this.starving) {
            mult *= this.game.starvingEnergyMult;
        }
        if (catShelter) {
            mult *= this.game.catEnergyMult;
        }
        // Add energy to this unit
        this.energy += mult * this.job.regenRate;
        if (this.energy > 100) {
            this.energy = 100;
        }
        // Make sure they can't do anything else this turn
        this.acted = true;
        this.moves = 0;
        return true;
        // <<-- /Creer-Merge: rest -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Tries to invalidate args for an action function
     *
     * @param player - the player commanding this Unit
     * @param checkAction - true to check if this Unit has an action
     * @param checkEnergy - true to check if this Unit has enough energy
     * @returns The reason this is invalid, undefined if looks valid so far.
     */
    invalidate(player, checkAction = false, checkEnergy = false) {
        if (this.owner !== player) {
            return `${this} isn't owned by you.`;
        }
        if (checkAction && this.acted) {
            return `${this} cannot perform another action this turn.`;
        }
        const mult = this.isInRange("monument") ? this.game.monumentCostMult : 1;
        if (checkEnergy && this.energy < this.job.actionCost * mult) {
            return `${this} doesn't have enough energy.`;
        }
    }
    /**
     * Checks if this unit is in range of a structure of the given type.
     *
     * @param type - The type of structure to search for
     * @returns The structure this unit is in range of, or undefined if none exist
     */
    isInRange(type) {
        return Boolean(this.game.structures.concat(this.game.newStructures).find((structure) => {
            if (!this.tile || !structure.tile || structure.owner !== this.owner || structure.type !== type) {
                return false;
            }
            const radius = structure.effectRadius;
            return Math.abs(this.tile.x - structure.tile.x) <= radius
                && Math.abs(this.tile.y - structure.tile.y) <= radius;
        }, this));
    }
    /**
     * Returns how much stuff this unit can pickup or be given before hitting
     * the carry limit.
     *
     * @returns How much this can still carry
     */
    getCarryLeft() {
        return this.job.carryLimit - this.materials - this.food;
    }
}
exports.Unit = Unit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jYXRhc3Ryb3BoZS91bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsK0NBQTJDO0FBTzNDLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsSUFBSyxTQUFRLHdCQUFVO0lBa0VoQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDSSxJQUlFLEVBQ0YsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFFckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FB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SUFBSSxDQUFDLElBQUksQ0FBQztJQUM1RCxDQUFDO0NBR0o7QUEvbkNELG9CQStuQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElVbml0QXR0YWNrQXJncywgSVVuaXRDaGFuZ2VKb2JBcmdzLCBJVW5pdENvbnN0cnVjdEFyZ3MsXG4gICAgICAgICBJVW5pdENvbnZlcnRBcmdzLCBJVW5pdERlY29uc3RydWN0QXJncywgSVVuaXREcm9wQXJncyxcbiAgICAgICAgIElVbml0SGFydmVzdEFyZ3MsIElVbml0TW92ZUFyZ3MsIElVbml0UGlja3VwQXJncywgSVVuaXRQcm9wZXJ0aWVzLFxuICAgICAgICAgSVVuaXRSZXN0QXJncyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBKb2IgfSBmcm9tIFwiLi9qb2JcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgVGlsZSB9IGZyb20gXCIuL3RpbGVcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBTdHJ1Y3R1cmVUeXBlIH0gZnJvbSBcIi4vc3RydWN0dXJlXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSB1bml0IGluIHRoZSBnYW1lLlxuICovXG5leHBvcnQgY2xhc3MgVW5pdCBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhpcyBVbml0IGhhcyBwZXJmb3JtZWQgaXRzIGFjdGlvbiB0aGlzIHR1cm4uXG4gICAgICovXG4gICAgcHVibGljIGFjdGVkITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZW5lcmd5IHRoaXMgVW5pdCBoYXMgKGZyb20gMC4wIHRvIDEwMC4wKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZW5lcmd5ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBmb29kIHRoaXMgVW5pdCBpcyBob2xkaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBmb29kITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEpvYiB0aGlzIFVuaXQgd2FzIHJlY3J1aXRlZCB0byBkby5cbiAgICAgKi9cbiAgICBwdWJsaWMgam9iOiBKb2I7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIG1hdGVyaWFscyB0aGlzIFVuaXQgaXMgaG9sZGluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgbWF0ZXJpYWxzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHRpbGUgdGhpcyBVbml0IGlzIG1vdmluZyB0by4gVGhpcyBvbmx5IGFwcGxpZXMgdG8gbmV1dHJhbCBmcmVzaFxuICAgICAqIGh1bWFucyBzcGF3bmVkIG9uIHRoZSByb2FkLiBPdGhlcndpc2UsIHRoZSB0aWxlIHRoaXMgVW5pdCBpcyBvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW92ZW1lbnRUYXJnZXQ/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogSG93IG1hbnkgbW92ZXMgdGhpcyBVbml0IGhhcyBsZWZ0IHRoaXMgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW92ZXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgUGxheWVyIHRoYXQgb3ducyBhbmQgY2FuIGNvbnRyb2wgdGhpcyBVbml0LCBvciB1bmRlZmluZWQgaWYgdGhlIFVuaXRcbiAgICAgKiBpcyBuZXV0cmFsLlxuICAgICAqL1xuICAgIHB1YmxpYyBvd25lcj86IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBVbml0cyBpbiB0aGUgc2FtZSBzcXVhZCBhcyB0aGlzIFVuaXQuIFVuaXRzIGluIHRoZSBzYW1lIHNxdWFkIGF0dGFja1xuICAgICAqIGFuZCBkZWZlbmQgdG9nZXRoZXIuXG4gICAgICovXG4gICAgcHVibGljIHNxdWFkITogVW5pdFtdO1xuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGlzIFVuaXQgaXMgc3RhcnZpbmcuIFN0YXJ2aW5nIFVuaXRzIHJlZ2VuZXJhdGUgZW5lcmd5IGF0IGhhbGZcbiAgICAgKiB0aGUgcmF0ZSB0aGV5IG5vcm1hbGx5IHdvdWxkIHdoaWxlIHJlc3RpbmcuXG4gICAgICovXG4gICAgcHVibGljIHN0YXJ2aW5nITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRoaXMgVW5pdCBpcyBvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdGlsZT86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGlzIFVuaXQgZGllcy4gVGhpcyBvbmx5IGFwcGxpZXMgdG8gbmV1dHJhbFxuICAgICAqIGZyZXNoIGh1bWFucyBjcmVhdGVkIGZyb20gY29tYmF0LiBPdGhlcndpc2UsIDAuXG4gICAgICovXG4gICAgcHVibGljIHR1cm5zVG9EaWUhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBVbml0IGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElVbml0UHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgbW9yZSBjb25zdHJ1Y3RvciBhcmdzIGluIGhlcmVcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuXG4gICAgICAgIHRoaXMuZW5lcmd5ID0gYXJncy5lbmVyZ3kgfHwgMTAwO1xuICAgICAgICB0aGlzLmpvYiA9IGFyZ3Muam9iIHx8IHRoaXMuZ2FtZS5qb2JzWzBdO1xuICAgICAgICB0aGlzLm1vdmVzID0gdGhpcy5qb2IubW92ZXM7XG4gICAgICAgIHRoaXMub3duZXIgPSBhcmdzLm93bmVyO1xuICAgICAgICB0aGlzLnRpbGUgPSBhcmdzLnRpbGU7XG4gICAgICAgIHRoaXMudHVybnNUb0RpZSA9IGFyZ3MudHVybnNUb0RpZSB8fCAtMTtcbiAgICAgICAgdGhpcy5tb3ZlbWVudFRhcmdldCA9IGFyZ3MubW92ZW1lbnRUYXJnZXQ7XG5cbiAgICAgICAgdGhpcy5nYW1lLnVuaXRzLnB1c2godGhpcyk7XG4gICAgICAgIGlmICh0aGlzLm93bmVyKSB7XG4gICAgICAgICAgICB0aGlzLm93bmVyLnVuaXRzLnB1c2godGhpcyk7XG4gICAgICAgICAgICB0aGlzLm93bmVyLmNhbGN1bGF0ZVNxdWFkcygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcXVhZCA9IFt0aGlzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGF0dGFjay4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIGF0dGFjay5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVBdHRhY2soXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdEF0dGFja0FyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb24gYSBUaWxlIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgIT09IFwic29sZGllclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGF0dGFjayBhcyB0aGV5IGFyZSBub3QgYSBzb2xkaWVyISBUaGVpciBvbmx5IGNvbWJhdCBhYmlsaXR5IGlzIGFzIGEgbWVhdHNoaWVsZCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGlsZS5oYXNOZWlnaGJvcih0aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGlzIG5vdCBhZGphY2VudCB0byAke3RoaXN9LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUgJiYgdGlsZS5zdHJ1Y3R1cmUudHlwZSAhPT0gXCJyb2FkXCIpIHtcbiAgICAgICAgICAgIC8vIEF0dGFja2luZyBhIHN0cnVjdHVyZSwgbm8gY2hlY2tzIG5lZWRlZCBoZXJlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGlsZS51bml0KSB7XG4gICAgICAgICAgICAvLyBBdHRhY2tpbmcgYSB1bml0XG4gICAgICAgICAgICBpZiAodGlsZS51bml0Lm93bmVyID09PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuJ3QgYXR0YWNrIGZyaWVuZHMhYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhlcmUgaXMgbm90aGluZyBvbiAke3RpbGV9IGZvciAke3RoaXN9IHRvIGF0dGFjayFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtYXR0YWNrIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2tzIGFuIGFkamFjZW50IFRpbGUuIENvc3RzIGFuIGFjdGlvbiBmb3IgZWFjaCBVbml0IGluIHRoaXMgVW5pdCdzXG4gICAgICogc3F1YWQuIFVuaXRzIGluIHRoZSBzcXVhZCB3aXRob3V0IGFuIGFjdGlvbiBkb24ndCBwYXJ0aWNpcGF0ZSBpbiBjb21iYXQuXG4gICAgICogVW5pdHMgaW4gY29tYmF0IGNhbm5vdCBtb3ZlIGFmdGVyd2FyZHMuIEF0dGFja2luZyBzdHJ1Y3R1cmVzIHdpbGwgbm90XG4gICAgICogZ2l2ZSBtYXRlcmlhbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gYXR0YWNrLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGF0dGFja2VkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGF0dGFjayhwbGF5ZXI6IFBsYXllciwgdGlsZTogVGlsZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuXG4gICAgICAgIGxldCBhdHRhY2tTdW0gPSAwOyAvLyBkYW1hZ2UgdG8gYmUgZGlzdHJpYnV0ZWRcbiAgICAgICAgY29uc3QgdG9EaWUgPSBuZXcgU2V0PFVuaXQ+KCk7IC8vIHVwZGF0ZSBkZWFkIGxhdGVyXG4gICAgICAgIGZvciAoY29uc3Qgc29sZGllciBvZiB0aGlzLnNxdWFkKSB7XG4gICAgICAgICAgICBsZXQgYXR0YWNrTW9kID0gMTsgLy8gZGFtYWdlIG1vZGlmaWVyLCBpZiB1bml0IG5lYXIgYWxsaWVkIG1vbnVtZW50XG4gICAgICAgICAgICBpZiAoIXNvbGRpZXIuYWN0ZWQpIHsgLy8gaWYgc29sZGllciBoYXNuJ3QgYWN0ZWRcbiAgICAgICAgICAgICAgICBpZiAoc29sZGllci5pc0luUmFuZ2UoXCJtb251bWVudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRhY2tNb2QgPSB0aGlzLmdhbWUubW9udW1lbnRDb3N0TXVsdDtcbiAgICAgICAgICAgICAgICB9IC8vIGlmIGFsbHkgbW9udW1lbnQgbmVhcmJ5LCB0YWtlIGxlc3MgZG1nIGZyb20gY29udHJpYnV0aW5nXG4gICAgICAgICAgICAgICAgc29sZGllci5lbmVyZ3kgLT0gc29sZGllci5qb2IuYWN0aW9uQ29zdCAqIGF0dGFja01vZDtcbiAgICAgICAgICAgICAgICBzb2xkaWVyLmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzb2xkaWVyLm1vdmVzID0gMDtcbiAgICAgICAgICAgICAgICBhdHRhY2tTdW0gKz0gc29sZGllci5qb2IuYWN0aW9uQ29zdDtcbiAgICAgICAgICAgICAgICBpZiAoc29sZGllci5lbmVyZ3kgPD0gMCkgeyAvLyBpZiBkaWVkXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvbGRpZXIuZW5lcmd5IGlzIG5lZ2F0aXZlIGhlcmUsIGNhbiBvbmx5IGNvbnRyaWJ1dGUgYXMgbXVjaCBlbmVyZ3kgYXMgdW5pdCBoYXNcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNrU3VtICs9IHNvbGRpZXIuZW5lcmd5IC8gYXR0YWNrTW9kO1xuICAgICAgICAgICAgICAgICAgICB0b0RpZS5hZGQoc29sZGllcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRVZFUllUSElORyBCRUZPUkUgSVMgQ0FMQ1VMQVRJTkcgREFNQUdFLCBBRlRFUiBJUyBERUFMSU5HIFRIRSBEQU1BR0VcbiAgICAgICAgaWYgKHRpbGUuc3RydWN0dXJlICYmIHRpbGUuc3RydWN0dXJlLnR5cGUgIT09IFwicm9hZFwiKSB7IC8vIGNoZWNraW5nIGlmIHVuaXQgb3IgYXR0YWNrLWFibGUgc3RydWN0dXJlXG4gICAgICAgICAgICAvLyBBdHRhY2sgYSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgIHRpbGUuc3RydWN0dXJlLm1hdGVyaWFscyAtPSBhdHRhY2tTdW07XG4gICAgICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUubWF0ZXJpYWxzIDw9IDApIHtcbiAgICAgICAgICAgICAgICAvLyBTdHJ1Y3R1cmUgd2lsbCBnZXQgcmVtb3ZlZCBmcm9tIGFycmF5cyBpbiBuZXh0IHR1cm4gbG9naWNcbiAgICAgICAgICAgICAgICB0aWxlLnN0cnVjdHVyZS50aWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHRpbGUuc3RydWN0dXJlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBhc3N1bWluZyB1bml0LCB3aGljaCBpdCBzaG91bGQgYmUgaWYgbm90IGEgc3RydWN0dXJlXG4gICAgICAgICAgICAvLyBBdHRhY2sgYSB1bml0L3NxdWFkXG4gICAgICAgICAgICBpZiAoIXRpbGUudW5pdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBhdHRhY2tpbmcgJHt0aWxlfSB3aXRoIG5vIHVuaXQgb24gaXQhYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFyZ2V0IG9mIHRpbGUudW5pdC5zcXVhZCkge1xuICAgICAgICAgICAgICAgIGxldCBhdHRhY2tNb2QgPSAxOyAvLyBkYW1hZ2UgbW9kaWZpZXJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmlzSW5SYW5nZShcIm1vbnVtZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG5lYXIgZW5lbXkgbW9udW1lbnQsIHRha2UgbGVzcyBkbWdcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNrTW9kID0gdGhpcy5nYW1lLm1vbnVtZW50Q29zdE11bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRhcmdldC5lbmVyZ3kgLT0gYXR0YWNrU3VtICogYXR0YWNrTW9kIC8gdGlsZS51bml0LnNxdWFkLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LmVuZXJneSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvRGllLmFkZCh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElUJ1MgS0lMTElORyBUSU1FXG4gICAgICAgIGZvciAoY29uc3QgZGVhZCBvZiB0b0RpZSkge1xuICAgICAgICAgICAgLy8gRHJvcCBjYXJyaWVkIHJlc291cmNlc1xuICAgICAgICAgICAgaWYgKCFkZWFkLnRpbGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZGVhZH0gaXMgYWxyZWFkeSBkZWFkYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWFkLnRpbGUuZm9vZCArPSBkZWFkLmZvb2Q7XG4gICAgICAgICAgICBkZWFkLnRpbGUubWF0ZXJpYWxzICs9IGRlYWQubWF0ZXJpYWxzO1xuICAgICAgICAgICAgZGVhZC5mb29kID0gMDtcbiAgICAgICAgICAgIGRlYWQubWF0ZXJpYWxzID0gMDtcblxuICAgICAgICAgICAgaWYgKGRlYWQub3duZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVhZC5qb2IudGl0bGUgIT09IFwiY2F0IG92ZXJsb3JkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWN0dWFsbHkgZnJlc2ggaHVtYW4gY29udmVydGluZyB0aW1lLCBub3QgaW4gZmFjdCBraWxsaW5nIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgZGVhZC5qb2IgPSB0aGlzLmdhbWUuam9ic1swXTtcbiAgICAgICAgICAgICAgICAgICAgZGVhZC50dXJuc1RvRGllID0gMTA7XG4gICAgICAgICAgICAgICAgICAgIGRlYWQuZW5lcmd5ID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICBkZWFkLnNxdWFkID0gW2RlYWRdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGFjdHVhbGx5IHJlbW92ZSBpdCBmcm9tIHRoZSBwbGF5ZXIncyB1bml0cyBhcnJheSB5ZXRcbiAgICAgICAgICAgICAgICAgICAgZGVhZC5vd25lci5kZWZlYXRlZFVuaXRzLnB1c2goZGVhZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBwcmV2aW91cyBvd25lciBjYW4ndCBjb250cm9sIGl0IGFueW1vcmVcbiAgICAgICAgICAgICAgICAgICAgZGVhZC5vd25lciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBOZXV0cmFsIGZyZXNoIGh1bWFuLCB3aWxsIGdldCByZW1vdmVkIGZyb20gYXJyYXlzIGluIG5leHQgdHVybiBsb2dpY1xuICAgICAgICAgICAgICAgIGRlYWQudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGRlYWQudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0aW5nIHNxdWFkc1xuICAgICAgICBmb3IgKGNvbnN0IHAgb2YgdGhpcy5nYW1lLnBsYXllcnMpIHtcbiAgICAgICAgICAgIHAuY2FsY3VsYXRlU3F1YWRzKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0YWNrIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGNoYW5nZUpvYi4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWRcbiAgICAgKiBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmdcbiAgICAgKiB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gam9iIC0gVGhlIG5hbWUgb2YgdGhlIEpvYiB0byBjaGFuZ2UgdG8uXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlQ2hhbmdlSm9iKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgam9iOiBcInNvbGRpZXJcIiB8IFwiZ2F0aGVyZXJcIiB8IFwiYnVpbGRlclwiIHwgXCJtaXNzaW9uYXJ5XCIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0Q2hhbmdlSm9iQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtY2hhbmdlSm9iIC0tPj5cblxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIFRpbGUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSA9PT0gXCJjYXQgb3ZlcmxvcmRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRoZSBvdmVybG9yZC4gSXQgY2Fubm90IGNoYW5nZSBqb2JzIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgPT09IGpvYikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBjaGFuZ2UgdG8gaXRzIG93biBqb2IhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmVuZXJneSA8IDEwMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG11c3QgYmUgYXQgMTAwIGVuZXJneSB0byBjaGFuZ2Ugam9ic2A7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBsYXllci5jYXQudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBQbGF5ZXIncyBDYXQgJHtwbGF5ZXIuY2F0fSBpcyBub3Qgb24gYSBUaWxlIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5hYnModGhpcy50aWxlLnggLSBwbGF5ZXIuY2F0LnRpbGUueCkgPiAxXG4gICAgICAgICB8fCBNYXRoLmFicyh0aGlzLnRpbGUueSAtIHBsYXllci5jYXQudGlsZS55KSA+IDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gbXVzdCBiZSBhZGphY2VudCBvciBkaWFnb25hbCB0byB5b3VyIGNhdCB0byBjaGFuZ2Ugam9ic2A7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1jaGFuZ2VKb2IgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoYW5nZXMgdGhpcyBVbml0J3MgSm9iLiBNdXN0IGJlIGF0IG1heCBlbmVyZ3kgKDEwMC4wKSB0byBjaGFuZ2UgSm9icy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGpvYiAtIFRoZSBuYW1lIG9mIHRoZSBKb2IgdG8gY2hhbmdlIHRvLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGNoYW5nZWQgSm9icywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBjaGFuZ2VKb2IoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBqb2I6IFwic29sZGllclwiIHwgXCJnYXRoZXJlclwiIHwgXCJidWlsZGVyXCIgfCBcIm1pc3Npb25hcnlcIixcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY2hhbmdlSm9iIC0tPj5cblxuICAgICAgICBjb25zdCBhY3R1YWxKb2IgPSB0aGlzLmdhbWUuam9icy5maW5kKChqKSA9PiBqLnRpdGxlID09PSBqb2IpO1xuICAgICAgICBpZiAoIWFjdHVhbEpvYikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcnlpbmcgdG8gc2V0ICR7dGhpc30gdG8gdW5rbm93biBqb2IgJHtqb2J9LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUgfHwgIXRoaXMub3duZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBpcyBkZWFkIGFuZCBjYW5ub3QgY2hhbmdlIGpvYmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5qb2IgPSBhY3R1YWxKb2I7XG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vdmVzID0gMDsgLy8gSXQgdGFrZXMgYWxsIHRoZWlyIHRpbWVcbiAgICAgICAgdGhpcy50aWxlLmZvb2QgKz0gdGhpcy5mb29kO1xuICAgICAgICB0aGlzLnRpbGUubWF0ZXJpYWxzICs9IHRoaXMubWF0ZXJpYWxzO1xuICAgICAgICB0aGlzLmZvb2QgPSAwO1xuICAgICAgICB0aGlzLm1hdGVyaWFscyA9IDA7XG4gICAgICAgIHRoaXMub3duZXIuY2FsY3VsYXRlU3F1YWRzKCk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNoYW5nZUpvYiAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBjb25zdHJ1Y3QuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkXG4gICAgICogaW4gcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nXG4gICAgICogdGhlbSB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBjb25zdHJ1Y3QgdGhlIFN0cnVjdHVyZSBvbi4gSXQgbXVzdCBoYXZlXG4gICAgICogZW5vdWdoIG1hdGVyaWFscyBvbiBpdCBmb3IgYSBTdHJ1Y3R1cmUgdG8gYmUgY29uc3RydWN0ZWQuXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSBvZiBTdHJ1Y3R1cmUgdG8gY29uc3RydWN0IG9uIHRoYXQgVGlsZS5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVDb25zdHJ1Y3QoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICAgICB0eXBlOiBcIm5ldXRyYWxcIiB8IFwic2hlbHRlclwiIHwgXCJtb251bWVudFwiIHwgXCJ3YWxsXCIgfCBcInJvYWRcIixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRDb25zdHJ1Y3RBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1jb25zdHJ1Y3QgLS0+PlxuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIsIHRydWUsIHRydWUpO1xuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5qb2IudGl0bGUgIT09IFwiYnVpbGRlclwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IGEgYnVpbGRlci4gT25seSBidWlsZGVycyBjYW4gY29uc3RydWN0IWA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGlsZS5zdHJ1Y3R1cmUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBhbHJlYWR5IGhhcyBhIHN0cnVjdHVyZSEgJHt0aGlzfSBjYW5ub3QgY29uc3RydWN0IGhlcmUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgVGlsZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgc3RydWN0dXJlIHR5cGUgYW5kIGlmIHRoZXkgaGF2ZSBlbm91Z2ggbWF0ZXJpYWxzXG4gICAgICAgIGlmICh0aWxlLnVuaXQgJiYgdHlwZSAhPT0gXCJzaGVsdGVyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4ndCBjb25zdHJ1Y3Qgb24gJHt0aWxlfSBiZWNhdXNlICR7dGlsZS51bml0fSBpcyB0aGVyZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgYWRqYWNlbnQgdG8gJHt0aGlzfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWF0c05lZWRlZCA9IHRoaXMuZ2FtZS5nZXRTdHJ1Y3R1cmVDb3N0KHR5cGUpO1xuICAgICAgICBpZiAodGlsZS5tYXRlcmlhbHMgPCBtYXRzTmVlZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoZXJlIGFyZW4ndCBlbm91Z2ggbWF0ZXJpYWxzIG9uICR7dGlsZX0uIFlvdSBuZWVkICR7bWF0c05lZWRlZH0gdG8gY29uc3RydWN0IGEgJHt0eXBlfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtY29uc3RydWN0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RzIGEgU3RydWN0dXJlIG9uIGFuIGFkamFjZW50IFRpbGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gY29uc3RydWN0IHRoZSBTdHJ1Y3R1cmUgb24uIEl0IG11c3QgaGF2ZVxuICAgICAqIGVub3VnaCBtYXRlcmlhbHMgb24gaXQgZm9yIGEgU3RydWN0dXJlIHRvIGJlIGNvbnN0cnVjdGVkLlxuICAgICAqIEBwYXJhbSB0eXBlIC0gVGhlIHR5cGUgb2YgU3RydWN0dXJlIHRvIGNvbnN0cnVjdCBvbiB0aGF0IFRpbGUuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgY29uc3RydWN0ZWQgYSBzdHJ1Y3R1cmUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29uc3RydWN0KFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgdHlwZTogXCJuZXV0cmFsXCIgfCBcInNoZWx0ZXJcIiB8IFwibW9udW1lbnRcIiB8IFwid2FsbFwiIHwgXCJyb2FkXCIsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdCAtLT4+XG5cbiAgICAgICAgdGlsZS5zdHJ1Y3R1cmUgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLnN0cnVjdHVyZSh7XG4gICAgICAgICAgICBvd25lcjogcGxheWVyLFxuICAgICAgICAgICAgdGlsZSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG11bHQgPSB0aGlzLmlzSW5SYW5nZShcIm1vbnVtZW50XCIpXG4gICAgICAgICAgICA/IHRoaXMuZ2FtZS5tb251bWVudENvc3RNdWx0XG4gICAgICAgICAgICA6IDE7XG4gICAgICAgIHRoaXMuZW5lcmd5IC09IHRoaXMuam9iLmFjdGlvbkNvc3QgKiBtdWx0O1xuICAgICAgICB0aWxlLm1hdGVyaWFscyAtPSB0aWxlLnN0cnVjdHVyZS5tYXRlcmlhbHM7XG4gICAgICAgIHRpbGUuaGFydmVzdFJhdGUgPSAwO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3QgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgY29udmVydC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWRcbiAgICAgKiBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmdcbiAgICAgKiB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHdpdGggdGhlIFVuaXQgdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVDb252ZXJ0KFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRDb252ZXJ0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtY29udmVydCAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIFRpbGUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSAhPT0gXCJtaXNzaW9uYXJ5XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpc24ndCBhIG1pc3Npb25hcnkgYW5kIGlzIHRodXMgdW5hYmxlIHRvIGNvbnZpbmNlIHVuaXRzIHRvIGpvaW4geW91IGN1bC0gSSBtZWFuIGtpbmdkb20uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IGNvbnZlcnQgYSBub25leGlzdGVudCB0aWxlIHRvIHlvdXIgY2F1c2UuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlLmhhc05laWdoYm9yKHRpbGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuIG9ubHkgY29udmVydCB1bml0cyBvbiBhZGphY2VudCB0aWxlcy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBtdXN0IGNvbnZlcnQgYSB1bml0LiBUaGVyZSBpcyBubyB1bml0IG9uICR7dGlsZX0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlLnVuaXQub3duZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhlIHVuaXQgb24gJHt0aWxlfSBpcyBhbHJlYWR5IG93bmVkIGJ5IHNvbWVib2R5LiAke3RoaXN9IGNhbid0IGNvbnZlcnQgaXQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWNvbnZlcnQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFuIGFkamFjZW50IFVuaXQgdG8geW91ciBzaWRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHdpdGggdGhlIFVuaXQgdG8gY29udmVydC5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBjb252ZXJ0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY29udmVydChwbGF5ZXI6IFBsYXllciwgdGlsZTogVGlsZSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb252ZXJ0IC0tPj5cblxuICAgICAgICAvLyBVbml0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHBsYXllcidzIHVuaXRzIGFycmF5IGF0IHRoZSBzdGFydCBvZiB0aGVpciBuZXh0IHR1cm5cbiAgICAgICAgY29uc3QgdW5pdCA9IHRpbGUudW5pdDtcbiAgICAgICAgaWYgKCF1bml0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHVuaXQgb24gJHt0aWxlfSB0byBjb252ZXJ0IWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5pdC50dXJuc1RvRGllID0gLTE7XG4gICAgICAgIHVuaXQub3duZXIgPSBwbGF5ZXI7XG4gICAgICAgIHVuaXQuZW5lcmd5ID0gMTAwO1xuICAgICAgICB1bml0LmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgdW5pdC5tb3ZlcyA9IDA7XG4gICAgICAgIHVuaXQubW92ZW1lbnRUYXJnZXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgbXVsdCA9IHRoaXMuaXNJblJhbmdlKFwibW9udW1lbnRcIilcbiAgICAgICAgICAgID8gdGhpcy5nYW1lLm1vbnVtZW50Q29zdE11bHRcbiAgICAgICAgICAgIDogMTtcbiAgICAgICAgdGhpcy5lbmVyZ3kgLT0gdGhpcy5qb2IuYWN0aW9uQ29zdCAqIG11bHQ7XG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuICAgICAgICBwbGF5ZXIubmV3VW5pdHMucHVzaCh1bml0KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29udmVydCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBkZWNvbnN0cnVjdC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZVxuICAgICAqIHBhc3NlZCBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nXG4gICAgICogdGVsbGluZyB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIGRlY29uc3RydWN0LiBJdCBtdXN0IGhhdmUgYSBTdHJ1Y3R1cmUgb24gaXQuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlRGVjb25zdHJ1Y3QoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdERlY29uc3RydWN0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGVjb25zdHJ1Y3QgLS0+PlxuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIsIHRydWUsIHRydWUpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlLnN0cnVjdHVyZSkge1xuICAgICAgICAgICAgcmV0dXJuIGBObyBzdHJ1Y3R1cmUgb24gJHt0aWxlfSBmb3IgJHt0aGlzfSB0byBkZWNvbnN0cnVjdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUuc3RydWN0dXJlLnR5cGUgPT09IFwicm9hZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGRlY29uc3RydWN0IHJvYWRzIWA7XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmICh0aGlzLmpvYi50aXRsZSAhPT0gXCJidWlsZGVyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3QgYSBidWlsZGVyLiBPbmx5IGJ1aWxkZXJzIGNhbiBkZWNvbnN0cnVjdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAodGhpcy5vd25lciA9PT0gdGlsZS5zdHJ1Y3R1cmUub3duZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgZGVjb25zdHJ1Y3QgZnJpZW5kbHkgc3RydWN0dXJlcy4gYFxuICAgICAgICAgICAgICAgICArIFwiU29sZGllcnMgY2FuIGRlc3Ryb3kgdGhlbSBieSBhdHRhY2tpbmcgdGhlbSwgdGhvdWdoLlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAodGhpcy5tYXRlcmlhbHMgKyB0aGlzLmZvb2QgPj0gdGhpcy5qb2IuY2FycnlMaW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBjYXJyeSBhbnkgbW9yZSBtYXRlcmlhbHMuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgVGlsZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgYWRqYWNlbnQgdG8gJHt0aGlzfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGVjb25zdHJ1Y3QgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgbWF0ZXJpYWxzIGZyb20gYW4gYWRqYWNlbnQgVGlsZSdzIFN0cnVjdHVyZS4gWW91IGNhbm5vdFxuICAgICAqIGRlY29uc3RydWN0IGZyaWVuZGx5IHN0cnVjdHVyZXMgKHNlZSBVbml0LmF0dGFjaykuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gZGVjb25zdHJ1Y3QuIEl0IG11c3QgaGF2ZSBhIFN0cnVjdHVyZSBvbiBpdC5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBkZWNvbnN0cnVjdGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGRlY29uc3RydWN0KFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogZGVjb25zdHJ1Y3QgLS0+PlxuXG4gICAgICAgIGNvbnN0IHN0cnVjdHVyZSA9IHRpbGUuc3RydWN0dXJlO1xuICAgICAgICBpZiAoIXN0cnVjdHVyZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzdHJ1Y3R1cmUgb24gJHt0aWxlfSB0byBkZXNjb25zdHJ1Y3QhYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhbW91bnQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIHRoaXMuam9iLmNhcnJ5TGltaXQgLSB0aGlzLm1hdGVyaWFscyAtIHRoaXMuZm9vZCxcbiAgICAgICAgICAgIHN0cnVjdHVyZS5tYXRlcmlhbHMsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5tYXRlcmlhbHMgKz0gYW1vdW50O1xuICAgICAgICBzdHJ1Y3R1cmUubWF0ZXJpYWxzIC09IGFtb3VudDtcblxuICAgICAgICAvLyBEZXN0cm95IHN0cnVjdHVyZSBpZiBpdCdzIG91dCBvZiBtYXRlcmlhbHNcbiAgICAgICAgaWYgKHN0cnVjdHVyZS5tYXRlcmlhbHMgPD0gMCkge1xuICAgICAgICAgICAgLy8gU3RydWN0dXJlIGlzIHJlbW92ZWQgZnJvbSBhcnJheXMgaW4gbmV4dCB0dXJuIGxvZ2ljXG4gICAgICAgICAgICBzdHJ1Y3R1cmUudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRpbGUuc3RydWN0dXJlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbXVsdCA9IHRoaXMuaXNJblJhbmdlKFwibW9udW1lbnRcIilcbiAgICAgICAgICAgID8gdGhpcy5nYW1lLm1vbnVtZW50Q29zdE11bHRcbiAgICAgICAgICAgIDogMTtcblxuICAgICAgICB0aGlzLmVuZXJneSAtPSB0aGlzLmpvYi5hY3Rpb25Db3N0ICogbXVsdDtcbiAgICAgICAgdGhpcy5hY3RlZCA9IHRydWU7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGRlY29uc3RydWN0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGRyb3AuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBkcm9wIG1hdGVyaWFscy9mb29kIG9uLlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSAtIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGRyb3AgKCdtYXRlcmlhbHMnIG9yICdmb29kJykuXG4gICAgICogQHBhcmFtIGFtb3VudCAtIFRoZSBhbW91bnQgb2YgdGhlIHJlc291cmNlIHRvIGRyb3AuIEFtb3VudHMgPD0gMCB3aWxsXG4gICAgICogZHJvcCBhcyBtdWNoIGFzIHBvc3NpYmxlLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZURyb3AoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICAgICByZXNvdXJjZTogXCJtYXRlcmlhbHNcIiB8IFwiZm9vZFwiLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0RHJvcEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWRyb3AgLS0+PlxuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIsIGZhbHNlLCBmYWxzZSk7XG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBvbiBhIFRpbGUhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGUgJiYgIXRoaXMudGlsZS5oYXNOZWlnaGJvcih0aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbiBvbmx5IGRyb3AgdGhpbmdzIG9uIG9yIGFkamFjZW50IHRvIHlvdXIgdGlsZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUuc3RydWN0dXJlKSB7XG4gICAgICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUudHlwZSA9PT0gXCJzaGVsdGVyXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuJ3QgZHJvcCB0aGluZ3MgaW4gZW5lbXkgc2hlbHRlcnMuIE5pY2UgdGhvdWdodCB0aG91Z2guYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzb3VyY2VbMF0gIT09IFwiZlwiICYmIHJlc291cmNlWzBdICE9PSBcIkZcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuIG9ubHkgc3RvcmUgZm9vZCBpbiBzaGVsdGVycy5gO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRpbGUuc3RydWN0dXJlLnR5cGUgIT09IFwicm9hZFwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IGRyb3AgcmVzb3VyY2VzIG9uIHN0cnVjdHVyZXMuYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1heEFtb3VudCA9IHJlc291cmNlID09PSBcImZvb2RcIlxuICAgICAgICAgICAgPyB0aGlzLmZvb2RcbiAgICAgICAgICAgIDogdGhpcy5tYXRlcmlhbHM7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIGVuc3VyZSB0aGUgYW1vdW50IGlzIHdpdGhpbiB0aGUgbWF4IGFtb3VudCwgYW5kIGlmIGxlc3MgdGhhbiAxXG4gICAgICAgICAgICAvLyB0aGVuIHRoZXkgZHJvcCBldmVyeXRoaW5nXG4gICAgICAgICAgICBhbW91bnQ6IE1hdGgubWluKG1heEFtb3VudCwgYW1vdW50IDwgMVxuICAgICAgICAgICAgICAgID8gbWF4QW1vdW50XG4gICAgICAgICAgICAgICAgOiBhbW91bnQsXG4gICAgICAgICAgICApLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWRyb3AgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyb3BzIHNvbWUgb2YgdGhlIGdpdmVuIHJlc291cmNlIG9uIG9yIGFkamFjZW50IHRvIHRoZSBVbml0J3MgVGlsZS4gRG9lc1xuICAgICAqIG5vdCBjb3VudCBhcyBhbiBhY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gZHJvcCBtYXRlcmlhbHMvZm9vZCBvbi5cbiAgICAgKiBAcGFyYW0gcmVzb3VyY2UgLSBUaGUgdHlwZSBvZiByZXNvdXJjZSB0byBkcm9wICgnbWF0ZXJpYWxzJyBvciAnZm9vZCcpLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRoZSByZXNvdXJjZSB0byBkcm9wLiBBbW91bnRzIDw9IDAgd2lsbFxuICAgICAqIGRyb3AgYXMgbXVjaCBhcyBwb3NzaWJsZS5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBkcm9wcGVkIHRoZSByZXNvdXJjZSwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBkcm9wKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgcmVzb3VyY2U6IFwibWF0ZXJpYWxzXCIgfCBcImZvb2RcIixcbiAgICAgICAgYW1vdW50OiBudW1iZXIgPSAwLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBkcm9wIC0tPj5cblxuICAgICAgICAvLyBEcm9wIHRoZSByZXNvdXJjZVxuICAgICAgICBpZiAocmVzb3VyY2UgPT09IFwiZm9vZFwiKSB7XG4gICAgICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUgJiYgdGlsZS5zdHJ1Y3R1cmUudHlwZSA9PT0gXCJzaGVsdGVyXCIgJiYgdGhpcy5vd25lcikge1xuICAgICAgICAgICAgICAgIHRoaXMub3duZXIuZm9vZCArPSBhbW91bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aWxlLmZvb2QgKz0gYW1vdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mb29kIC09IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRpbGUubWF0ZXJpYWxzICs9IGFtb3VudDtcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWxzIC09IGFtb3VudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBkcm9wIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGhhcnZlc3QuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkXG4gICAgICogaW4gcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nXG4gICAgICogdGhlbSB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB5b3Ugd2FudCB0byBoYXJ2ZXN0LlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUhhcnZlc3QoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdEhhcnZlc3RBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1oYXJ2ZXN0IC0tPj5cblxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgVGlsZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUgIT09IHRoaXMudGlsZSAmJiAhdGhpcy50aWxlLmhhc05laWdoYm9yKHRpbGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJZb3UgY2FuIG9ubHkgaGFydmVzdCBvbiBvciBhZGphY2VudCB0byB5b3VyIHRpbGUuXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdW5pdCBpcyBoYXJ2ZXN0aW5nIGEgdmFsaWQgdGlsZVxuICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUpIHtcbiAgICAgICAgICAgIGlmICh0aWxlLnN0cnVjdHVyZS50eXBlICE9PSBcInNoZWx0ZXJcIiB8fCB0aWxlLnN0cnVjdHVyZS5vd25lciA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiWW91IGNhbiBvbmx5IHN0ZWFsIGZyb20gZW5lbXkgc2hlbHRlcnMuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGlsZS5oYXJ2ZXN0UmF0ZSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBcIllvdSBjYW4ndCBoYXJ2ZXN0IGZvb2QgZnJvbSB0aGF0IHRpbGUuXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGlsZS50dXJuc1RvSGFydmVzdCAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVGhpcyB0aWxlIGlzbid0IHJlYWR5IHRvIGhhcnZlc3QuXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYXJyeSA9IHRoaXMuZm9vZCArIHRoaXMubWF0ZXJpYWxzO1xuICAgICAgICBpZiAoY2FycnkgPj0gdGhpcy5qb2IuY2FycnlMaW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiWW91IGNhbm5vdCBjYXJyeSBhbnltb3JlXCI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1oYXJ2ZXN0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYXJ2ZXN0cyB0aGUgZm9vZCBvbiBhbiBhZGphY2VudCBUaWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHlvdSB3YW50IHRvIGhhcnZlc3QuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgaGFydmVzdGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGhhcnZlc3QocGxheWVyOiBQbGF5ZXIsIHRpbGU6IFRpbGUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaGFydmVzdCAtLT4+XG5cbiAgICAgICAgY29uc3QgY2FycnkgPSB0aGlzLmpvYi5jYXJyeUxpbWl0IC0gKHRoaXMuZm9vZCArIHRoaXMubWF0ZXJpYWxzKTtcbiAgICAgICAgbGV0IHBpY2t1cCA9IDA7XG4gICAgICAgIGlmICh0aWxlLnN0cnVjdHVyZSAmJiB0aWxlLnN0cnVjdHVyZS5vd25lcikge1xuICAgICAgICAgICAgcGlja3VwID0gTWF0aC5taW4odGlsZS5zdHJ1Y3R1cmUub3duZXIuZm9vZCwgY2FycnkpO1xuICAgICAgICAgICAgdGlsZS5zdHJ1Y3R1cmUub3duZXIuZm9vZCAtPSBwaWNrdXA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwaWNrdXAgPSBNYXRoLm1pbih0aWxlLmhhcnZlc3RSYXRlLCBjYXJyeSk7XG4gICAgICAgICAgICB0aWxlLnR1cm5zVG9IYXJ2ZXN0ID0gdGhpcy5nYW1lLnR1cm5zQmV0d2VlbkhhcnZlc3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbXVsdCA9IHRoaXMuaXNJblJhbmdlKFwibW9udW1lbnRcIikgPyB0aGlzLmdhbWUubW9udW1lbnRDb3N0TXVsdCA6IDE7XG4gICAgICAgIHRoaXMuZW5lcmd5IC09IHRoaXMuam9iLmFjdGlvbkNvc3QgKiBtdWx0O1xuICAgICAgICB0aGlzLmZvb2QgKz0gcGlja3VwO1xuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaGFydmVzdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBtb3ZlLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdGhpcyBVbml0IHNob3VsZCBtb3ZlIHRvLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZU1vdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdE1vdmVBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgVGlsZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUudW5pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGBDYW4ndCBtb3ZlIGJlY2F1c2UgdGhlIHRpbGUgaXMgYWxyZWFkeSBvY2N1cGllZCBieSAke3RpbGUudW5pdH0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1vdmVzIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwiWW91ciB1bml0IGlzIG91dCBvZiBtb3ZlcyFcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbGUuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBcIllvdXIgdW5pdCBtdXN0IG1vdmUgdG8gYSB0aWxlIHRvIHRoZSBub3J0aCwgc291dGgsIGVhc3QsIG9yIHdlc3QuXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGlsZS5zdHJ1Y3R1cmUgJiYgdGlsZS5zdHJ1Y3R1cmUudHlwZSAhPT0gXCJyb2FkXCIgJiYgdGlsZS5zdHJ1Y3R1cmUudHlwZSAhPT0gXCJzaGVsdGVyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlVuaXRzIGNhbm5vdCBtb3ZlIG9udG8gc3RydWN0dXJlcyBvdGhlciB0aGFuIHJvYWRzIGFuZCBzaGVsdGVycy5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW1vdmUgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1vdmVzIHRoaXMgVW5pdCBmcm9tIGl0cyBjdXJyZW50IFRpbGUgdG8gYW4gYWRqYWNlbnQgVGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0aGlzIFVuaXQgc2hvdWxkIG1vdmUgdG8uXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBpdCBtb3ZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBtb3ZlKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy50aWxlIHx8ICF0aGlzLm93bmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gaXMgdHJ5aW5nIHRvIG1vdmUgd2hpbGUgZGVhZCFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZHVjdCB0aGUgbW92ZSBmcm9tIHRoZSB1bml0XG4gICAgICAgIHRoaXMubW92ZXMgLT0gMTtcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIHRpbGVzXG4gICAgICAgIHRoaXMudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aWxlLnVuaXQgPSB0aGlzO1xuXG4gICAgICAgIC8vIFJlY2FsY3VsYXRlIHNxdWFkc1xuICAgICAgICB0aGlzLm93bmVyLmNhbGN1bGF0ZVNxdWFkcygpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHt0aGlzfSBtb3ZpbmcgdG8gJHt0aWxlfWApO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHBpY2t1cC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIHBpY2t1cCBtYXRlcmlhbHMvZm9vZCBmcm9tLlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSAtIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIHBpY2t1cCAoJ21hdGVyaWFscycgb3JcbiAgICAgKiAnZm9vZCcpLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRoZSByZXNvdXJjZSB0byBwaWNrdXAuIEFtb3VudHMgPD0gMCB3aWxsXG4gICAgICogcGlja3VwIGFzIG11Y2ggYXMgcG9zc2libGUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlUGlja3VwKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgcmVzb3VyY2U6IFwibWF0ZXJpYWxzXCIgfCBcImZvb2RcIixcbiAgICAgICAgYW1vdW50OiBudW1iZXIgPSAwLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdFBpY2t1cEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXBpY2t1cCAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgZmFsc2UsIGZhbHNlKTtcbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgbm90IG9uIGEgVGlsZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuIG9ubHkgcGljayB0aGluZ3MgdXAgb2ZmIHRpbGVzIHRoYXQgZXhpc3RgO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aWxlICE9PSB0aGlzLnRpbGUgJiYgIXRoaXMudGlsZS5oYXNOZWlnaGJvcih0aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbiBvbmx5IHBpY2t1cCByZXNvdXJjZXMgb24gb3IgYWRqYWNlbnQgdG8gaXRzIHRpbGUuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhY3R1YWxBbW91bnQgPSBhbW91bnQgPCAxXG4gICAgICAgICAgICA/IHRpbGVbcmVzb3VyY2VdXG4gICAgICAgICAgICA6IE1hdGgubWluKHRpbGVbcmVzb3VyY2VdLCBhbW91bnQpO1xuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBpdCBwaWNrcyB1cCBtb3JlIHRoYW4gMCByZXNvdXJjZXNcbiAgICAgICAgaWYgKE1hdGguZmxvb3IodGhpcy5lbmVyZ3kpIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBkb2Vzbid0IGhhdmUgZW5vdWdoIGVuZXJneSB0byBwaWNrdXAgYW55dGhpbmcuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdldENhcnJ5TGVmdCgpIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBhbHJlYWR5IGNhcnJ5aW5nIGFzIG1hbnkgcmVzb3VyY2VzIGFzIGl0IGNhbi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFjdHVhbEFtb3VudCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoZXJlIGFyZSBubyByZXNvdXJjZXMgb24gJHt0aWxlfSBmb3IgJHt0aGlzfSB0byBwaWNrdXAuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxvb2tzIHZhbGlkLCBsZXQncyB1cGRhdGUgYW1vdW50IHRvIHRoZSBjb21wdXRlZCB2YWx1ZVxuICAgICAgICBhY3R1YWxBbW91bnQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIGFtb3VudCxcbiAgICAgICAgICAgIHRoaXMuZ2V0Q2FycnlMZWZ0KCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHRoaXMuZW5lcmd5KSxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4geyBhbW91bnQ6IGFjdHVhbEFtb3VudCB9O1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXBpY2t1cCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdXAgc29tZSBtYXRlcmlhbHMgb3IgZm9vZCBvbiBvciBhZGphY2VudCB0byB0aGUgVW5pdCdzIFRpbGUuIERvZXNcbiAgICAgKiBub3QgY291bnQgYXMgYW4gYWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIHBpY2t1cCBtYXRlcmlhbHMvZm9vZCBmcm9tLlxuICAgICAqIEBwYXJhbSByZXNvdXJjZSAtIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIHBpY2t1cCAoJ21hdGVyaWFscycgb3JcbiAgICAgKiAnZm9vZCcpLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIHRoZSByZXNvdXJjZSB0byBwaWNrdXAuIEFtb3VudHMgPD0gMCB3aWxsXG4gICAgICogcGlja3VwIGFzIG11Y2ggYXMgcG9zc2libGUuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgcGlja2VkIHVwIGEgcmVzb3VyY2UsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgcGlja3VwKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgcmVzb3VyY2U6IFwibWF0ZXJpYWxzXCIgfCBcImZvb2RcIixcbiAgICAgICAgYW1vdW50OiBudW1iZXIgPSAwLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwaWNrdXAgLS0+PlxuXG4gICAgICAgIHRpbGVbcmVzb3VyY2VdIC09IGFtb3VudDtcbiAgICAgICAgdGhpc1tyZXNvdXJjZV0gKz0gYW1vdW50O1xuICAgICAgICB0aGlzLmVuZXJneSAtPSBhbW91bnQ7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHBpY2t1cCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciByZXN0LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVJlc3QocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRSZXN0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmVzdCAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSwgZmFsc2UpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZW5lcmd5ID49IDEwMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiVGhlIHVuaXQgaGFzIGZ1bGwgZW5lcmd5IVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzSW5SYW5nZShcInNoZWx0ZXJcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlVuaXQgbXVzdCBiZSBpbiByYW5nZSBvZiBhIGZyaWVuZGx5IHNoZWx0ZXIgdG8gaGVhbFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmVzdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnZW5lcmF0ZXMgZW5lcmd5LiBNdXN0IGJlIGluIHJhbmdlIG9mIGEgZnJpZW5kbHkgc2hlbHRlciB0byByZXN0LlxuICAgICAqIENvc3RzIGFuIGFjdGlvbi4gVW5pdHMgY2Fubm90IG1vdmUgYWZ0ZXIgcmVzdGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgcmVzdGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHJlc3QocGxheWVyOiBQbGF5ZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcmVzdCAtLT4+XG5cbiAgICAgICAgaWYgKCF0aGlzLm93bmVyIHx8ICF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSB0cnlpbmcgdG8gcmVzdCB3aGVuIGRlYWQhYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZXQgYWxsIHNoZWx0ZXJzIHRoaXMgdW5pdCBpcyBpbiByYW5nZSBvZlxuICAgICAgICBjb25zdCBuZWFyYnlTaGVsdGVycyA9IHRoaXMub3duZXIuZ2V0QWxsU3RydWN0dXJlcygpLmZpbHRlcigoc3RydWN0dXJlKSA9PiB7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyBzdHJ1Y3R1cmUgaXNuJ3QgZGVzdHJveWVkXG4gICAgICAgICAgICBpZiAoIXN0cnVjdHVyZS50aWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyBzdHJ1Y3R1cmUgaXMgYSBzaGVsdGVyXG4gICAgICAgICAgICBpZiAoc3RydWN0dXJlLnR5cGUgIT09IFwic2hlbHRlclwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyBzaGVsdGVyIGlzIGluIHJhbmdlIG9mIHRoaXMgdW5pdFxuICAgICAgICAgICAgY29uc3QgcmFkaXVzID0gc3RydWN0dXJlLmVmZmVjdFJhZGl1cztcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGlsZVxuICAgICAgICAgICAgICAgICYmIE1hdGguYWJzKHRoaXMudGlsZS54IC0gc3RydWN0dXJlLnRpbGUueCkgPD0gcmFkaXVzXG4gICAgICAgICAgICAgICAgJiYgTWF0aC5hYnModGhpcy50aWxlLnkgLSBzdHJ1Y3R1cmUudGlsZS55KSA8PSByYWRpdXM7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEdldCBhIG5lYXJieSBzaGVsdGVyIHdpdGggYSBjYXQgaW4gcmFuZ2Ugb2YgaXQsIG9yIHVuZGVmaW5lZCBpZiBub25lXG4gICAgICAgIGNvbnN0IGNhdFNoZWx0ZXIgPSBuZWFyYnlTaGVsdGVycy5maW5kKChzaGVsdGVyKSA9PiB7XG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGNhdCBpcyBpbiByYW5nZSBvZiB0aGlzIHNoZWx0ZXJcbiAgICAgICAgICAgIGNvbnN0IGNhdCA9IHRoaXMub3duZXIgJiYgdGhpcy5vd25lci5jYXQ7XG4gICAgICAgICAgICBjb25zdCByYWRpdXMgPSBzaGVsdGVyLmVmZmVjdFJhZGl1cztcblxuICAgICAgICAgICAgcmV0dXJuIEJvb2xlYW4oY2F0ICYmIGNhdC50aWxlICYmIHNoZWx0ZXIgJiYgc2hlbHRlci50aWxlXG4gICAgICAgICAgICAgICAgJiYgTWF0aC5hYnMoY2F0LnRpbGUueCAtIHNoZWx0ZXIudGlsZS54KSA8PSByYWRpdXNcbiAgICAgICAgICAgICAgICAmJiBNYXRoLmFicyhjYXQudGlsZS55IC0gc2hlbHRlci50aWxlLnkpIDw9IHJhZGl1cyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZW5lcmd5IG11bHRpcGxpZXJcbiAgICAgICAgbGV0IG11bHQgPSAxO1xuICAgICAgICBpZiAodGhpcy5zdGFydmluZykge1xuICAgICAgICAgICAgbXVsdCAqPSB0aGlzLmdhbWUuc3RhcnZpbmdFbmVyZ3lNdWx0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYXRTaGVsdGVyKSB7XG4gICAgICAgICAgICBtdWx0ICo9IHRoaXMuZ2FtZS5jYXRFbmVyZ3lNdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGVuZXJneSB0byB0aGlzIHVuaXRcbiAgICAgICAgdGhpcy5lbmVyZ3kgKz0gbXVsdCAqIHRoaXMuam9iLnJlZ2VuUmF0ZTtcbiAgICAgICAgaWYgKHRoaXMuZW5lcmd5ID4gMTAwKSB7XG4gICAgICAgICAgICB0aGlzLmVuZXJneSA9IDEwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGV5IGNhbid0IGRvIGFueXRoaW5nIGVsc2UgdGhpcyB0dXJuXG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vdmVzID0gMDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcmVzdCAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRyaWVzIHRvIGludmFsaWRhdGUgYXJncyBmb3IgYW4gYWN0aW9uIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gdGhlIHBsYXllciBjb21tYW5kaW5nIHRoaXMgVW5pdFxuICAgICAqIEBwYXJhbSBjaGVja0FjdGlvbiAtIHRydWUgdG8gY2hlY2sgaWYgdGhpcyBVbml0IGhhcyBhbiBhY3Rpb25cbiAgICAgKiBAcGFyYW0gY2hlY2tFbmVyZ3kgLSB0cnVlIHRvIGNoZWNrIGlmIHRoaXMgVW5pdCBoYXMgZW5vdWdoIGVuZXJneVxuICAgICAqIEByZXR1cm5zIFRoZSByZWFzb24gdGhpcyBpcyBpbnZhbGlkLCB1bmRlZmluZWQgaWYgbG9va3MgdmFsaWQgc28gZmFyLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW52YWxpZGF0ZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGNoZWNrQWN0aW9uOiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgIGNoZWNrRW5lcmd5OiBib29sZWFuID0gZmFsc2UsXG4gICAgKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKHRoaXMub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzbid0IG93bmVkIGJ5IHlvdS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoZWNrQWN0aW9uICYmIHRoaXMuYWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgcGVyZm9ybSBhbm90aGVyIGFjdGlvbiB0aGlzIHR1cm4uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG11bHQgPSB0aGlzLmlzSW5SYW5nZShcIm1vbnVtZW50XCIpID8gdGhpcy5nYW1lLm1vbnVtZW50Q29zdE11bHQgOiAxO1xuICAgICAgICBpZiAoY2hlY2tFbmVyZ3kgJiYgdGhpcy5lbmVyZ3kgPCB0aGlzLmpvYi5hY3Rpb25Db3N0ICogbXVsdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGRvZXNuJ3QgaGF2ZSBlbm91Z2ggZW5lcmd5LmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhpcyB1bml0IGlzIGluIHJhbmdlIG9mIGEgc3RydWN0dXJlIG9mIHRoZSBnaXZlbiB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSBvZiBzdHJ1Y3R1cmUgdG8gc2VhcmNoIGZvclxuICAgICAqIEByZXR1cm5zIFRoZSBzdHJ1Y3R1cmUgdGhpcyB1bml0IGlzIGluIHJhbmdlIG9mLCBvciB1bmRlZmluZWQgaWYgbm9uZSBleGlzdFxuICAgICAqL1xuICAgIHByaXZhdGUgaXNJblJhbmdlKHR5cGU6IFN0cnVjdHVyZVR5cGUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5nYW1lLnN0cnVjdHVyZXMuY29uY2F0KFxuICAgICAgICAgICAgdGhpcy5nYW1lLm5ld1N0cnVjdHVyZXMpLmZpbmQoKHN0cnVjdHVyZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy50aWxlIHx8ICFzdHJ1Y3R1cmUudGlsZSB8fCBzdHJ1Y3R1cmUub3duZXIgIT09IHRoaXMub3duZXIgfHwgc3RydWN0dXJlLnR5cGUgIT09IHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IHN0cnVjdHVyZS5lZmZlY3RSYWRpdXM7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy50aWxlLnggLSBzdHJ1Y3R1cmUudGlsZS54KSA8PSByYWRpdXNcbiAgICAgICAgICAgICAgICAgICAgJiYgTWF0aC5hYnModGhpcy50aWxlLnkgLSBzdHJ1Y3R1cmUudGlsZS55KSA8PSByYWRpdXM7XG4gICAgICAgICAgICB9LCB0aGlzKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGhvdyBtdWNoIHN0dWZmIHRoaXMgdW5pdCBjYW4gcGlja3VwIG9yIGJlIGdpdmVuIGJlZm9yZSBoaXR0aW5nXG4gICAgICogdGhlIGNhcnJ5IGxpbWl0LlxuICAgICAqXG4gICAgICogQHJldHVybnMgSG93IG11Y2ggdGhpcyBjYW4gc3RpbGwgY2FycnlcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldENhcnJ5TGVmdCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5qb2IuY2FycnlMaW1pdCAtIHRoaXMubWF0ZXJpYWxzIC0gdGhpcy5mb29kO1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19