"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A unit in the game. May be a corvette, missleboat, martyr, transport, miner.
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
        this.job = args.job;
        this.acted = false;
        this.legendarium = 0;
        this.mythicite = 0;
        this.rarium = 0;
        this.genarium = 0;
        this.isBusy = false;
        // setup any thing you need here
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
     * @param enemy - The Unit being attacked.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAttack(player, enemy) {
        // <<-- Creer-Merge: invalidate-attack -->>
        // check widely consistent things.
        const reason = this.invalidate(player, true);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // make sure the the unit is attacking a unit.
        if (!enemy) {
            return `${this} is attacking unit that doesn't exist.`;
        }
        // Handle possible coordinate invalidations here:
        if ((enemy.x < 0) || (enemy.y < 0) || enemy.x > this.game.sizeX ||
            enemy.y > this.game.sizeY) {
            return `${this} is trying to attack a location that doesn't exist`;
        }
        // make sure the target is in range.
        if ((this.job.range + this.game.shipRadius) < this.distance(this.x, this.y, enemy.x, enemy.y)) {
            return `${this} is trying to attack a location which is too far away.`;
        }
        // make sure you aren't attacking a friend.
        if (enemy.owner === player) {
            return `${this} is trying to attack the ally: ${enemy.job.title} at ${enemy.x}, ${enemy.y}`;
        }
        // Handle possible unit invalidations here:
        if (enemy.owner === undefined) {
            return `${this} is attacking a unit that has no owner. Report this to the game Devs. This is 100% a bug`;
        }
        // make sure the unit has a job.
        if (this.job === undefined) {
            return `${this} doesn't have a job. That shouldn't be possible.`;
        }
        // make sure the unit is a attacking job
        if (this.job.title !== "corvette" && this.job.title !== "missileboat") {
            return `${this} is not a unit that can attack.`;
        }
        // Check all the arguments for attack here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks the specified unit.
     *
     * @param player - The player that called this.
     * @param enemy - The Unit being attacked.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, enemy) {
        // <<-- Creer-Merge: attack -->>
        // Do different attack based on the job of the unit.
        if (this.job.title === "corvette") {
            let attackDamage = this.job.damage;
            // if enemy is protected by a martyr
            if (enemy.protector) {
                // damage the shield if it will absorb it all.
                if (enemy.protector.shield >= attackDamage) {
                    enemy.protector.shield -= attackDamage;
                    // if it emptied the martyr sheild, grab a new martyr.
                    enemy.protector = undefined;
                    this.game.updateProtector(enemy);
                }
                // otherwise, grab a new martyr and deal the damage to the new shield.
                // Note, there is no reasons why this should ever run.
                else if (enemy.protector.shield < attackDamage) {
                    // deal the damage and update the shield.
                    attackDamage -= enemy.protector.shield;
                    enemy.protector.shield = 0;
                    // keep cycling through protectors until the damage is gone or there is no protector.
                    while (enemy.protector !== undefined && attackDamage > 0) {
                        // if it emptied the martyr sheild, grab a new martyr.
                        this.game.updateProtector(enemy);
                        // handle shield damage
                        if (enemy.protector) {
                            // if the shield is stronger, damage the shield.
                            if (enemy.protector.shield >= attackDamage) {
                                enemy.protector.shield -= attackDamage;
                                attackDamage = 0;
                            }
                            // kill the shield and update the damage.
                            else {
                                // deal the damage and update the shield.
                                attackDamage -= enemy.protector.shield;
                                enemy.protector.shield = 0;
                            }
                        }
                    }
                    // if there is left over damage, deal it.
                    if (attackDamage > 0) {
                        enemy.energy -= attackDamage;
                    }
                }
            }
            // if no martyr in ranges
            else {
                enemy.energy -= attackDamage;
            }
            if (enemy.energy < 0) {
                // set unit's location to out of bounds
                enemy.x = -1;
                enemy.y = -1;
            }
        }
        else {
            // creates the missile to be fired.
            const missile = this.manager.create.projectile({
                fuel: this.game.projectileSpeed * this.job.range / 100,
                owner: this.owner,
                target: enemy,
                x: this.x,
                y: this.y,
                energy: this.game.jobs[0].damage * 1,
            });
            // adds the projectiles.
            this.game.projectiles.push(missile);
            player.projectiles.push(missile);
        }
        // flag that the unit has acted.
        this.acted = true;
        // return that the action was successful.
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for dash. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param x - The x value of the destination's coordinates.
     * @param y - The y value of the destination's coordinates.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDash(player, x, y) {
        // <<-- Creer-Merge: invalidate-dash -->>
        // check widely consistent things.
        const reason = this.invalidate(player, false);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // variables for ease of reference.
        const trav = this.distance(this.x, this.y, x, y);
        const cost = Math.ceil(trav / this.game.dashDistance) * this.game.dashCost;
        // make sure the unit can move to that locaiton.
        if (this.energy < cost) {
            return `${this} needs at least ${cost} energy to move ${trav} and it has ${this.energy}.`;
        }
        // make sure the unit is in bounds.
        if (x < 0 || y < 0 || x > this.game.sizeX || y > this.game.sizeY || this.energy < 0) {
            return `${this} is dead and cannot move.`;
        }
        // make sure it isn't dashing through the sun zone
        if (this.collide(x, y, this.x, this.y)) {
            return `${this} cannot dash to those coordinates due to magnetic interference from the sun.`;
        }
        // Check all the arguments for dash here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-dash -->>
    }
    /**
     * Causes the unit to dash towards the designated destination.
     *
     * @param player - The player that called this.
     * @param x - The x value of the destination's coordinates.
     * @param y - The y value of the destination's coordinates.
     * @returns True if it moved, false otherwise.
     */
    async dash(player, x, y) {
        // <<-- Creer-Merge: dash -->>
        // calculate  dash distance
        const dist = Math.sqrt(((this.x - x) ** 2) + ((this.y - y) ** 2));
        // Add logic here for dash.
        this.dashX = x;
        this.dashY = y;
        this.isBusy = true;
        this.acted = true;
        this.moves = 0;
        this.energy -= Math.ceil(this.game.dashCost * ((dist) / this.game.dashDistance));
        // return the action was successful.
        return true;
        // <<-- /Creer-Merge: dash -->>
    }
    /**
     * Invalidation function for mine. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param body - The object to be mined.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMine(player, body) {
        // <<-- Creer-Merge: invalidate-mine -->>
        // check widely consistent things.
        const reason = this.invalidate(player, true);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // make sure a body was given.
        if (!body) {
            return `Body doesn't exist`;
        }
        // make sure it is an asteroid.
        if (body.bodyType !== "asteroid") {
            return `${body} must be an asteroid!`;
        }
        // make sure the ship is a miner.
        if (this.job.title !== "miner") {
            return `${this} must be a miner ship.`;
        }
        // make sure it has some material to mine.
        if ((body.bodyType !== "asteroid") || (body.amount <= 0)) {
            return `${body} does not have any materials to mine!`;
        }
        // make sure the asteroid is in range.
        if (this.job.range + body.radius < this.distance(this.x, this.y, body.x, body.y)) {
            return `${this} is too far away from ${body} to mine!`;
        }
        // make sure the unit can hold things.
        if (this.job.carryLimit <= 0) {
            return `${this} cannot hold materials!`;
        }
        // make sure mining of the mythicite is legal.
        if (this.game.currentTurn < this.game.orbitsProtected && body.materialType === "mythicite") {
            return `${this} cannot mine the mythicite yet. It is protected for the first 12 turns.`;
        }
        // make sure mining of your opponent doesn't own the asteroid.
        if (body.owner !== undefined && body.owner !== player) {
            return `${this} cannot mine the asteroid as it is owned by your opponent.`;
        }
        // make sure the unit can carry more materials.
        const currentLoad = this.genarium + this.rarium + this.legendarium +
            this.mythicite;
        if (this.job.carryLimit <= currentLoad) {
            return `${this} cannot hold any more materials!`;
        }
        // Check all the arguments for mine here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-mine -->>
    }
    /**
     * allows a miner to mine a asteroid
     *
     * @param player - The player that called this.
     * @param body - The object to be mined.
     * @returns True if successfully acted, false otherwise.
     */
    async mine(player, body) {
        // <<-- Creer-Merge: mine -->>
        // Set the asteroids owner to the ships owner.
        body.owner = player;
        // Add ore to miner based on the mining rate vs what is in the body.
        let actualAmount = Math.min(body.amount, this.game.miningSpeed);
        const currentLoad = this.genarium + this.legendarium + this.mythicite +
            this.rarium;
        // Makes sure amount added does not go over the carry limit
        if (this.job.carryLimit < actualAmount + currentLoad) {
            actualAmount = this.job.carryLimit - currentLoad;
        }
        // adds the corrected amount to the necessary material.
        if (body.materialType === "genarium") {
            this.genarium += actualAmount;
        }
        else if (body.materialType === "legendarium") {
            this.legendarium += actualAmount;
        }
        else if (body.materialType === "mythicite") {
            this.mythicite += actualAmount;
        }
        else if (body.materialType === "rarium") {
            this.rarium += actualAmount;
        }
        // mark the unit has acted.
        this.acted = true;
        // make sure it can't do anything else this turn
        this.isBusy = true;
        this.dashX = this.x;
        this.dashY = this.y;
        this.moves = 0;
        // remove the mined ore from the asteroid
        body.amount -= actualAmount;
        // return the action was successful.
        return true;
        // <<-- /Creer-Merge: mine -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param x - The x value of the destination's coordinates.
     * @param y - The y value of the destination's coordinates.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, x, y) {
        // <<-- Creer-Merge: invalidate-move -->>
        // check widely consistent things.
        const reason = this.invalidate(player, false);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // make sure the unit can move to that locaiton.
        if (this.distance(this.x, this.y, x, y) > this.moves) {
            return `${this} can only move ${this.moves} distance!`;
        }
        // make sure the unit is in bounds.
        if (this.x < 0 || this.y < 0 || this.x > this.game.sizeX || this.y > this.game.sizeY) {
            return `${this} is dead and cannot move.`;
        }
        // make sure the unit is in bounds.
        if (x < 0 || y < 0 || x > this.game.sizeX || y > this.game.sizeY) {
            return `${this} cannot move off the map.`;
        }
        // grab the sun
        const sun = this.game.bodies[2];
        // make sure it isn't moving into the sun zone
        if (this.distance(x, y, sun.x, sun.y) < sun.radius + this.game.shipRadius) {
            return `${this} cannot move to those coordinates due to landing in the sun.`;
        }
        // Check all the arguments for move here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves this Unit from its current location to the new location specified.
     *
     * @param player - The player that called this.
     * @param x - The x value of the destination's coordinates.
     * @param y - The y value of the destination's coordinates.
     * @returns True if it moved, false otherwise.
     */
    async move(player, x, y) {
        // <<-- Creer-Merge: move -->>
        // Add logic here for move.
        this.moves -= this.distance(this.x, this.y, x, y);
        this.x = x;
        this.y = y;
        // if it is a missile boat, it can no longer fire
        if (this.job.title === "missileboat") {
            this.acted = true;
        }
        // magic code that updates the units grid position.
        return true;
        // <<-- /Creer-Merge: move -->>
    }
    /**
     * Invalidation function for safe. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param x - The x position of the location you wish to arrive.
     * @param y - The y position of the location you wish to arrive.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSafe(player, x, y) {
        // <<-- Creer-Merge: invalidate-safe -->>
        // make sure the unit is in bounds.
        if (x < 0 || y < 0 || x > this.game.sizeX || y > this.game.sizeY) {
            return `${this} cannot be off of the map.`;
        }
        // make sure the unit is in bounds.
        if (this.x < 0 || this.y < 0 || this.x > this.game.sizeX || this.y > this.game.sizeY) {
            return `${this} is dead, why do you bother checking?`;
        }
        // Check all the arguments for safe here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-safe -->>
    }
    /**
     * tells you if your ship can move to that location from were it is without
     * clipping the sun.
     *
     * @param player - The player that called this.
     * @param x - The x position of the location you wish to arrive.
     * @param y - The y position of the location you wish to arrive.
     * @returns True if pathable by this unit, false otherwise.
     */
    async safe(player, x, y) {
        // <<-- Creer-Merge: safe -->>
        // grab the sun
        const sun = this.game.bodies[2];
        // make sure it isn't moving into the sun zone
        if (this.distance(x, y, sun.x, sun.y) < sun.radius + this.game.shipRadius) {
            return false;
        }
        // return that the move is safe.
        return true;
        // <<-- /Creer-Merge: safe -->>
    }
    /**
     * Invalidation function for shootdown. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param missile - The projectile being shot down.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateShootdown(player, missile) {
        // <<-- Creer-Merge: invalidate-shootdown -->>
        // check widely consistent things.
        const reason = this.invalidate(player, true);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // if the projectile does not exist
        if (!missile) {
            return `${this} cannot shoot down a missile that does not exist.`;
        }
        // if the projectile is out of bounds of the map
        if (missile.x < 0 || missile.x > this.game.sizeX || missile.y < 0 || missile.y > this.game.sizeY) {
            return `${this} cannot shoot down ${missile} which is out of bounds. Let it go.`;
        }
        // if the projectile belongs to the player trying to shoot it down
        if (missile.owner === player) {
            return `${this} is trying to shoot down ${missile} which is an ally.`;
        }
        // if this unit has already acted, it may not act again
        if (this.acted) {
            return `${this} has already acted.`;
        }
        // if this unit is NOT a corvette
        if (this.job.title !== "corvette" && this.job.title !== "missileboat") {
            return `${this} is not a corvette or missileboat. It cannot shoot down missiles.`;
        }
        // if the projectile is out of the range of the corvette
        if (this.distance(this.x, this.y, missile.x, missile.y) > this.game.jobs[0].range) {
            return `${this} is too far away from the target. Must be within attack range for a corvette.`;
        }
        // Check all the arguments for shootDown here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-shootdown -->>
    }
    /**
     * Attacks the specified projectile.
     *
     * @param player - The player that called this.
     * @param missile - The projectile being shot down.
     * @returns True if successfully attacked, false otherwise.
     */
    async shootdown(player, missile) {
        // <<-- Creer-Merge: shootdown -->>
        // Add logic here for shootDown.
        // damage the missile.
        if (this.job.title === "corvette") {
            missile.energy -= this.job.damage;
        }
        else {
            missile.energy = -1;
        }
        // if the missile is dead, kill it. The only thing that dies at 0 energy.
        if (missile.energy < 0) {
            missile.x = -101;
            missile.y = -101;
            missile.fuel = 0;
        }
        // the corvette has now acted
        this.acted = true;
        // logic has been added
        return true;
        // <<-- /Creer-Merge: shootdown -->>
    }
    /**
     * Invalidation function for transfer. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param unit - The unit you are grabbing the resources from.
     * @param amount - The amount of materials to you with to grab. Amounts <=
     * 0 will pick up all the materials that the unit can.
     * @param material - The material the unit will pick up. 'genarium',
     * 'rarium', 'legendarium', or 'mythicite'.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateTransfer(player, unit, amount, material) {
        // <<-- Creer-Merge: invalidate-transfer -->>
        // Check all the arguments for transfer here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // Check common invalidates
        const reason = this.invalidate(player, false);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // Check that target ship exists
        if (!unit) {
            return `${this} can't create minerals out of thin space! The target ship doesn't exist.`;
        }
        // make sure you own the unit.
        if (unit.owner !== player) {
            return `${this} your opponent won't give you materials.`;
        }
        // Check that target ship is in range
        if (this.distance(this.x, this.y, unit.x, unit.y) > this.job.range) {
            return `${this} is too far away to transfer materials with the target ship!`;
        }
        // Check that the ship can hold car
        if (this.job.carryLimit <= 0) {
            return `${this} cannot hold cargo!`;
        }
        // Check that the ship has space
        const currentLoad = this.genarium + this.rarium + this.legendarium + this.mythicite;
        if (currentLoad === this.job.carryLimit) {
            return `${this} already has a full cargo hold!`;
        }
        // Check that the target ship has the material
        if (unit[material] <= 0) {
            return `${unit} does not have any ${material} for ${this} to take!`;
        }
        // <<-- /Creer-Merge: invalidate-transfer -->>
    }
    /**
     * Grab materials from a friendly unit. Doesn't use a action.
     *
     * @param player - The player that called this.
     * @param unit - The unit you are grabbing the resources from.
     * @param amount - The amount of materials to you with to grab. Amounts <=
     * 0 will pick up all the materials that the unit can.
     * @param material - The material the unit will pick up. 'genarium',
     * 'rarium', 'legendarium', or 'mythicite'.
     * @returns True if successfully taken, false otherwise.
     */
    async transfer(player, unit, amount, material) {
        // <<-- Creer-Merge: transfer -->>
        // grab the resources on the ship.
        const totalResourceOnShip = unit[material];
        // grab the current materials on the ship.
        const currentLoad = this.genarium + this.rarium + this.legendarium + this.mythicite;
        // correct the acutal amount to account for a negative argument.
        let actualAmount = amount <= 0
            ? totalResourceOnShip
            : Math.min(totalResourceOnShip, amount);
        // account for carry limit.
        actualAmount = Math.min(actualAmount, this.job.carryLimit - currentLoad);
        // shift the amounts for transfer.
        unit[material] -= actualAmount;
        this[material] += actualAmount;
        // return it was successful.
        return true;
        // <<-- /Creer-Merge: transfer -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Tries to invalidate args for an action function
     *
     * @param player - the player commanding this Unit
     * @param checkAction - true to check if this Unit has an action
     * @returns The reason this is invalid, undefined if looks valid so far.
     */
    invalidate(player, checkAction = false) {
        // make sure there is a player and it is their turn.
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        // make sure the thing is owned by the player.
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        if (this.isBusy) {
            return `${this} cannot do anything else as it is dashing or mining.`;
        }
        // Make sure the unit hasn't acted.
        if (checkAction && this.acted) {
            return `${this} has already acted this turn.`;
        }
        // Make sure the unit is alive.
        if (this.energy < 0) {
            return `${this} is dead, and cannot do anything.`;
        }
    }
    /**
     * returns the distance between the points
     *
     * @param x1: the start x coordinate.
     * @param y1: the start y coordinate.
     * @param x2: the end x coordinate.
     * @param y2: the end y coordinate.
     *
     * @returns the distance between the points.
     */
    distance(x1, y1, x2, y2) {
        // grab the differences.
        const xDif = (x1 - x2);
        const yDif = (y1 - y2);
        // return the distance.
        return Math.sqrt((xDif ** 2) + (yDif ** 2));
    }
    /**
     * detects if the given line intersects the sun.
     *
     * @param x1: the start x coordinate.
     * @param y1: the start y coordinate.
     * @param x2: the end x coordinate.
     * @param y2: the end y coordinate.
     *
     * @returns True = collide, false = no collide.
     */
    collide(x1, y1, x2, y2) {
        // grab the sun for reference.
        const sun = this.game.bodies[2];
        // grab line length
        const length = this.distance(x1, y1, x2, y2);
        // grab the length of the ship and sun.
        const minDist = sun.radius + this.game.shipRadius;
        // make sure it isn't dashing through the sun zone
        const a = (y1 - y2);
        const b = (x2 - x1);
        const c = (x1 * y2) - (x2 * y1);
        // grab the distance between the line and the circle at it's closest.
        const dist = Math.abs((a * sun.x) + (b * sun.y) + c) / Math.sqrt((a ** 2) + (b ** 2));
        if (dist <= minDist) {
            // grab the two bool for possible infinite line catches
            const check1 = this.distance(x1, y1, sun.x, sun.y) > length;
            const check2 = this.distance(x2, y2, sun.x, sun.y) > length;
            // if the sun is within collision distance, but further than the other end point.
            if (check1) {
                // if it collides with the other end point.
                if (this.distance(x2, y2, sun.x, sun.y) < minDist) {
                    return true;
                }
            }
            // if the sun is within collision distance, but further than the other end point.
            if (check2) {
                // if it collides with the other end point.
                if (this.distance(x1, y1, sun.x, sun.y) < minDist) {
                    return true;
                }
            }
            // if neither check is true, then it is a normal collision.
            if (!check1 && !check2) {
                return true;
            }
        }
        // return that there is no collision
        return false;
    }
}
exports.Unit = Unit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zdGFyZGFzaC91bml0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsK0NBQTJDO0FBSzNDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsd0JBQVU7SUFzRmhDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBTUUsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQzs7Ozs7Ozs7OztPQVVHO0lBQ08sZ0JBQWdCLENBQ3RCLE1BQWMsRUFDZCxLQUFXO1FBRVgsMkNBQTJDO1FBRTNDLGtDQUFrQztRQUNsQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3QyxtQ0FBbUM7UUFDbkMsSUFB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QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDNUQsaUZBQWlGO1lBQ2pGLElBQUksTUFBTSxFQUFFO2dCQUNSLDJDQUEyQztnQkFDM0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFO29CQUMvQyxPQUFPLElBQUksQ0FBQztpQkFDZjthQUNKO1lBQ0QsaUZBQWlGO1lBQ2pGLElBQUksTUFBTSxFQUFFO2dCQUNSLDJDQUEyQztnQkFDM0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxFQUFFO29CQUMvQyxPQUFPLElBQUksQ0FBQztpQkFDZjthQUNKO1lBQ0QsMkRBQTJEO1lBQzNELElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BCLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FDSjtRQUVELG9DQUFvQztRQUNwQyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0NBS0o7QUE1OUJELG9CQTQ5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElVbml0QXR0YWNrQXJncywgSVVuaXREYXNoQXJncywgSVVuaXRNaW5lQXJncywgSVVuaXRNb3ZlQXJncyxcbiAgICAgICAgIElVbml0UHJvcGVydGllcywgSVVuaXRTYWZlQXJncywgSVVuaXRTaG9vdGRvd25BcmdzLCBJVW5pdFRyYW5zZmVyQXJncyxcbiAgICAgICB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgQm9keSB9IGZyb20gXCIuL2JvZHlcIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFByb2plY3RpbGUgfSBmcm9tIFwiLi9wcm9qZWN0aWxlXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgdW5pdCBpbiB0aGUgZ2FtZS4gTWF5IGJlIGEgY29ydmV0dGUsIG1pc3NsZWJvYXQsIG1hcnR5ciwgdHJhbnNwb3J0LCBtaW5lci5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXQgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIG9yIG5vdCB0aGlzIFVuaXQgaGFzIHBlcmZvcm1lZCBpdHMgYWN0aW9uIHRoaXMgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgYWN0ZWQhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHggdmFsdWUgdGhpcyB1bml0IGlzIGRhc2hpbmcgdG8uXG4gICAgICovXG4gICAgcHVibGljIGRhc2hYITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHkgdmFsdWUgdGhpcyB1bml0IGlzIGRhc2hpbmcgdG8uXG4gICAgICovXG4gICAgcHVibGljIGRhc2hZITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlbWFpbmluZyBoZWFsdGggb2YgdGhlIHVuaXQuXG4gICAgICovXG4gICAgcHVibGljIGVuZXJneSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgR2VuYXJpdW0gb3JlIGNhcnJpZWQgYnkgdGhpcyB1bml0LiAoMCB0byBqb2IgY2FycnlcbiAgICAgKiBjYXBhY2l0eSAtIG90aGVyIGNhcnJpZWQgaXRlbXMpLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZW5hcml1bSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRyYWNrcyB3aGVpdGhlciBvciBub3QgdGhlIHNoaXAgaXMgZGFzaGluZyBvciBNaW5pbmcuIElmIHRydWUsIGl0IGNhbm5vdFxuICAgICAqIGRvIGFueXRoaW5nIGVsc2UuXG4gICAgICovXG4gICAgcHVibGljIGlzQnVzeSE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSm9iIHRoaXMgVW5pdCBoYXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGpvYjogSm9iO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBMZWdlbmRhcml1bSBvcmUgY2FycmllZCBieSB0aGlzIHVuaXQuICgwIHRvIGpvYiBjYXJyeVxuICAgICAqIGNhcGFjaXR5IC0gb3RoZXIgY2FycmllZCBpdGVtcykuXG4gICAgICovXG4gICAgcHVibGljIGxlZ2VuZGFyaXVtITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIHRoaXMgdW5pdCBjYW4gc3RpbGwgbW92ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW92ZXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIE15dGhpY2l0ZSBjYXJyaWVkIGJ5IHRoaXMgdW5pdC4gKDAgdG8gam9iIGNhcnJ5IGNhcGFjaXR5IC1cbiAgICAgKiBvdGhlciBjYXJyaWVkIGl0ZW1zKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgbXl0aGljaXRlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFBsYXllciB0aGF0IG93bnMgYW5kIGNhbiBjb250cm9sIHRoaXMgVW5pdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgb3duZXI/OiBQbGF5ZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWFydHlyIHNoaXAgdGhhdCBpcyBjdXJyZW50bHkgc2hpZWxkaW5nIHRoaXMgc2hpcCBpZiBhbnkuXG4gICAgICovXG4gICAgcHVibGljIHByb3RlY3Rvcj86IFVuaXQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIFJhcml1bSBjYXJyaWVkIGJ5IHRoaXMgdW5pdC4gKDAgdG8gam9iIGNhcnJ5IGNhcGFjaXR5IC1cbiAgICAgKiBvdGhlciBjYXJyaWVkIGl0ZW1zKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmFyaXVtITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNoZWlsZCB0aGF0IGEgbWFydHlyIHNoaXAgaGFzLlxuICAgICAqL1xuICAgIHB1YmxpYyBzaGllbGQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCB2YWx1ZSB0aGlzIHVuaXQgaXMgb24uXG4gICAgICovXG4gICAgcHVibGljIHghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeSB2YWx1ZSB0aGlzIHVuaXQgaXMgb24uXG4gICAgICovXG4gICAgcHVibGljIHkhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBVbml0IGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElVbml0UHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLyoqIFRoZSBKb2IgdG8gc2V0IHRoaXMgVW5pdCB0by4gKi9cbiAgICAgICAgICAgIGpvYjogSm9iO1xuICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgbW9yZSBjb25zdHJ1Y3RvciBhcmdzIGluIGhlcmVcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICB0aGlzLmpvYiA9IGFyZ3Muam9iO1xuICAgICAgICB0aGlzLmFjdGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGVnZW5kYXJpdW0gPSAwO1xuICAgICAgICB0aGlzLm15dGhpY2l0ZSA9IDA7XG4gICAgICAgIHRoaXMucmFyaXVtID0gMDtcbiAgICAgICAgdGhpcy5nZW5hcml1bSA9IDA7XG4gICAgICAgIHRoaXMuaXNCdXN5ID0gZmFsc2U7XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGF0dGFjay4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gZW5lbXkgLSBUaGUgVW5pdCBiZWluZyBhdHRhY2tlZC5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVBdHRhY2soXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBlbmVteTogVW5pdCxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRBdHRhY2tBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1hdHRhY2sgLS0+PlxuXG4gICAgICAgIC8vIGNoZWNrIHdpZGVseSBjb25zaXN0ZW50IHRoaW5ncy5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVhc29uLCByZXR1cm4gaXQuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHRoZSB1bml0IGlzIGF0dGFja2luZyBhIHVuaXQuXG4gICAgICAgIGlmICghZW5lbXkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBhdHRhY2tpbmcgdW5pdCB0aGF0IGRvZXNuJ3QgZXhpc3QuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBwb3NzaWJsZSBjb29yZGluYXRlIGludmFsaWRhdGlvbnMgaGVyZTpcbiAgICAgICAgaWYgKChlbmVteS54IDwgMCkgfHwgKGVuZW15LnkgPCAwKSB8fCBlbmVteS54ID4gdGhpcy5nYW1lLnNpemVYIHx8XG4gICAgICAgICAgICBlbmVteS55ID4gdGhpcy5nYW1lLnNpemVZKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgdHJ5aW5nIHRvIGF0dGFjayBhIGxvY2F0aW9uIHRoYXQgZG9lc24ndCBleGlzdGA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHRhcmdldCBpcyBpbiByYW5nZS5cbiAgICAgICAgaWYgKCh0aGlzLmpvYi5yYW5nZSArIHRoaXMuZ2FtZS5zaGlwUmFkaXVzKSA8IHRoaXMuZGlzdGFuY2UodGhpcy54LCB0aGlzLnksIGVuZW15LngsIGVuZW15LnkpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgdHJ5aW5nIHRvIGF0dGFjayBhIGxvY2F0aW9uIHdoaWNoIGlzIHRvbyBmYXIgYXdheS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHlvdSBhcmVuJ3QgYXR0YWNraW5nIGEgZnJpZW5kLlxuICAgICAgICBpZiAoZW5lbXkub3duZXIgPT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRyeWluZyB0byBhdHRhY2sgdGhlIGFsbHk6ICR7ZW5lbXkuam9iLnRpdGxlfSBhdCAke2VuZW15Lnh9LCAke2VuZW15Lnl9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhhbmRsZSBwb3NzaWJsZSB1bml0IGludmFsaWRhdGlvbnMgaGVyZTpcbiAgICAgICAgaWYgKGVuZW15Lm93bmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBhdHRhY2tpbmcgYSB1bml0IHRoYXQgaGFzIG5vIG93bmVyLiBSZXBvcnQgdGhpcyB0byB0aGUgZ2FtZSBEZXZzLiBUaGlzIGlzIDEwMCUgYSBidWdgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB1bml0IGhhcyBhIGpvYi5cbiAgICAgICAgaWYgKHRoaXMuam9iID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBkb2Vzbid0IGhhdmUgYSBqb2IuIFRoYXQgc2hvdWxkbid0IGJlIHBvc3NpYmxlLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaXMgYSBhdHRhY2tpbmcgam9iXG4gICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSAhPT0gXCJjb3J2ZXR0ZVwiICYmIHRoaXMuam9iLnRpdGxlICE9PSBcIm1pc3NpbGVib2F0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3QgYSB1bml0IHRoYXQgY2FuIGF0dGFjay5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIHRoZSBhcmd1bWVudHMgZm9yIGF0dGFjayBoZXJlIGFuZCB0cnkgdG9cbiAgICAgICAgLy8gcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBpbnB1dCBpcyB3cm9uZy5cbiAgICAgICAgLy8gSWYgeW91IG5lZWQgdG8gY2hhbmdlIGFuIGFyZ3VtZW50IGZvciB0aGUgcmVhbCBmdW5jdGlvbiwgdGhlblxuICAgICAgICAvLyBjaGFuZ2luZyBpdHMgdmFsdWUgaW4gdGhpcyBzY29wZSBpcyBlbm91Z2guXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtYXR0YWNrIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2tzIHRoZSBzcGVjaWZpZWQgdW5pdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGVuZW15IC0gVGhlIFVuaXQgYmVpbmcgYXR0YWNrZWQuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYXR0YWNrZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYXR0YWNrKHBsYXllcjogUGxheWVyLCBlbmVteTogVW5pdCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuXG4gICAgICAgIC8vIERvIGRpZmZlcmVudCBhdHRhY2sgYmFzZWQgb24gdGhlIGpvYiBvZiB0aGUgdW5pdC5cbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcImNvcnZldHRlXCIpIHtcbiAgICAgICAgICAgIGxldCBhdHRhY2tEYW1hZ2UgPSB0aGlzLmpvYi5kYW1hZ2U7XG5cbiAgICAgICAgICAgIC8vIGlmIGVuZW15IGlzIHByb3RlY3RlZCBieSBhIG1hcnR5clxuICAgICAgICAgICAgaWYgKGVuZW15LnByb3RlY3Rvcikge1xuICAgICAgICAgICAgICAgIC8vIGRhbWFnZSB0aGUgc2hpZWxkIGlmIGl0IHdpbGwgYWJzb3JiIGl0IGFsbC5cbiAgICAgICAgICAgICAgICBpZiAoZW5lbXkucHJvdGVjdG9yLnNoaWVsZCA+PSBhdHRhY2tEYW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZW5lbXkucHJvdGVjdG9yLnNoaWVsZCAtPSBhdHRhY2tEYW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGVtcHRpZWQgdGhlIG1hcnR5ciBzaGVpbGQsIGdyYWIgYSBuZXcgbWFydHlyLlxuICAgICAgICAgICAgICAgICAgICBlbmVteS5wcm90ZWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS51cGRhdGVQcm90ZWN0b3IoZW5lbXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBvdGhlcndpc2UsIGdyYWIgYSBuZXcgbWFydHlyIGFuZCBkZWFsIHRoZSBkYW1hZ2UgdG8gdGhlIG5ldyBzaGllbGQuXG4gICAgICAgICAgICAgICAgLy8gTm90ZSwgdGhlcmUgaXMgbm8gcmVhc29ucyB3aHkgdGhpcyBzaG91bGQgZXZlciBydW4uXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZW5lbXkucHJvdGVjdG9yLnNoaWVsZCA8IGF0dGFja0RhbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZWFsIHRoZSBkYW1hZ2UgYW5kIHVwZGF0ZSB0aGUgc2hpZWxkLlxuICAgICAgICAgICAgICAgICAgICBhdHRhY2tEYW1hZ2UgLT0gZW5lbXkucHJvdGVjdG9yLnNoaWVsZDtcbiAgICAgICAgICAgICAgICAgICAgZW5lbXkucHJvdGVjdG9yLnNoaWVsZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgY3ljbGluZyB0aHJvdWdoIHByb3RlY3RvcnMgdW50aWwgdGhlIGRhbWFnZSBpcyBnb25lIG9yIHRoZXJlIGlzIG5vIHByb3RlY3Rvci5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGVuZW15LnByb3RlY3RvciAhPT0gdW5kZWZpbmVkICYmIGF0dGFja0RhbWFnZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0IGVtcHRpZWQgdGhlIG1hcnR5ciBzaGVpbGQsIGdyYWIgYSBuZXcgbWFydHlyLlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnVwZGF0ZVByb3RlY3RvcihlbmVteSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGUgc2hpZWxkIGRhbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZW15LnByb3RlY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzaGllbGQgaXMgc3Ryb25nZXIsIGRhbWFnZSB0aGUgc2hpZWxkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmVteS5wcm90ZWN0b3Iuc2hpZWxkID49IGF0dGFja0RhbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmVteS5wcm90ZWN0b3Iuc2hpZWxkIC09IGF0dGFja0RhbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrRGFtYWdlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2lsbCB0aGUgc2hpZWxkIGFuZCB1cGRhdGUgdGhlIGRhbWFnZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGVhbCB0aGUgZGFtYWdlIGFuZCB1cGRhdGUgdGhlIHNoaWVsZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNrRGFtYWdlIC09IGVuZW15LnByb3RlY3Rvci5zaGllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZW15LnByb3RlY3Rvci5zaGllbGQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBsZWZ0IG92ZXIgZGFtYWdlLCBkZWFsIGl0LlxuICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNrRGFtYWdlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXkuZW5lcmd5IC09IGF0dGFja0RhbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIG5vIG1hcnR5ciBpbiByYW5nZXNcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZW15LmVuZXJneSAtPSBhdHRhY2tEYW1hZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbmVteS5lbmVyZ3kgPCAwKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHVuaXQncyBsb2NhdGlvbiB0byBvdXQgb2YgYm91bmRzXG4gICAgICAgICAgICAgICAgZW5lbXkueCA9IC0xO1xuICAgICAgICAgICAgICAgIGVuZW15LnkgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNyZWF0ZXMgdGhlIG1pc3NpbGUgdG8gYmUgZmlyZWQuXG4gICAgICAgICAgICBjb25zdCBtaXNzaWxlOiBQcm9qZWN0aWxlID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS5wcm9qZWN0aWxlKHtcbiAgICAgICAgICAgICAgICBmdWVsOiB0aGlzLmdhbWUucHJvamVjdGlsZVNwZWVkICogdGhpcy5qb2IucmFuZ2UgLyAxMDAsXG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMub3duZXIsXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBlbmVteSxcbiAgICAgICAgICAgICAgICB4OiB0aGlzLngsXG4gICAgICAgICAgICAgICAgeTogdGhpcy55LFxuICAgICAgICAgICAgICAgIGVuZXJneTogdGhpcy5nYW1lLmpvYnNbMF0uZGFtYWdlICogMSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBhZGRzIHRoZSBwcm9qZWN0aWxlcy5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wcm9qZWN0aWxlcy5wdXNoKG1pc3NpbGUpO1xuICAgICAgICAgICAgcGxheWVyLnByb2plY3RpbGVzLnB1c2gobWlzc2lsZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmbGFnIHRoYXQgdGhlIHVuaXQgaGFzIGFjdGVkLlxuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcblxuICAgICAgICAvLyByZXR1cm4gdGhhdCB0aGUgYWN0aW9uIHdhcyBzdWNjZXNzZnVsLlxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0YWNrIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGRhc2guIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHggLSBUaGUgeCB2YWx1ZSBvZiB0aGUgZGVzdGluYXRpb24ncyBjb29yZGluYXRlcy5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IHZhbHVlIG9mIHRoZSBkZXN0aW5hdGlvbidzIGNvb3JkaW5hdGVzLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZURhc2goXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlcixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXREYXNoQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGFzaCAtLT4+XG5cbiAgICAgICAgLy8gY2hlY2sgd2lkZWx5IGNvbnNpc3RlbnQgdGhpbmdzLlxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCBmYWxzZSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVhc29uLCByZXR1cm4gaXQuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YXJpYWJsZXMgZm9yIGVhc2Ugb2YgcmVmZXJlbmNlLlxuICAgICAgICBjb25zdCB0cmF2ID0gdGhpcy5kaXN0YW5jZSh0aGlzLngsIHRoaXMueSwgeCwgeSk7XG4gICAgICAgIGNvbnN0IGNvc3QgPSBNYXRoLmNlaWwodHJhdiAvIHRoaXMuZ2FtZS5kYXNoRGlzdGFuY2UpICogdGhpcy5nYW1lLmRhc2hDb3N0O1xuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgY2FuIG1vdmUgdG8gdGhhdCBsb2NhaXRvbi5cbiAgICAgICAgaWYgKHRoaXMuZW5lcmd5IDwgY29zdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG5lZWRzIGF0IGxlYXN0ICR7Y29zdH0gZW5lcmd5IHRvIG1vdmUgJHt0cmF2fSBhbmQgaXQgaGFzICR7dGhpcy5lbmVyZ3l9LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaXMgaW4gYm91bmRzLlxuICAgICAgICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHRoaXMuZ2FtZS5zaXplWCB8fCB5ID4gdGhpcy5nYW1lLnNpemVZIHx8IHRoaXMuZW5lcmd5IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGRlYWQgYW5kIGNhbm5vdCBtb3ZlLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXNuJ3QgZGFzaGluZyB0aHJvdWdoIHRoZSBzdW4gem9uZVxuICAgICAgICBpZiAodGhpcy5jb2xsaWRlKHgsIHksIHRoaXMueCwgdGhpcy55KSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBkYXNoIHRvIHRob3NlIGNvb3JkaW5hdGVzIGR1ZSB0byBtYWduZXRpYyBpbnRlcmZlcmVuY2UgZnJvbSB0aGUgc3VuLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgZGFzaCBoZXJlIGFuZCB0cnkgdG9cbiAgICAgICAgLy8gcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBpbnB1dCBpcyB3cm9uZy5cbiAgICAgICAgLy8gSWYgeW91IG5lZWQgdG8gY2hhbmdlIGFuIGFyZ3VtZW50IGZvciB0aGUgcmVhbCBmdW5jdGlvbiwgdGhlblxuICAgICAgICAvLyBjaGFuZ2luZyBpdHMgdmFsdWUgaW4gdGhpcyBzY29wZSBpcyBlbm91Z2guXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGFzaCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2F1c2VzIHRoZSB1bml0IHRvIGRhc2ggdG93YXJkcyB0aGUgZGVzaWduYXRlZCBkZXN0aW5hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHggLSBUaGUgeCB2YWx1ZSBvZiB0aGUgZGVzdGluYXRpb24ncyBjb29yZGluYXRlcy5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IHZhbHVlIG9mIHRoZSBkZXN0aW5hdGlvbidzIGNvb3JkaW5hdGVzLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgaXQgbW92ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZGFzaChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBkYXNoIC0tPj5cblxuICAgICAgICAvLyBjYWxjdWxhdGUgIGRhc2ggZGlzdGFuY2VcbiAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydCgoKHRoaXMueCAtIHgpICoqIDIpICsgKCh0aGlzLnkgLSB5KSAqKiAyKSk7XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIGRhc2guXG4gICAgICAgIHRoaXMuZGFzaFggPSB4O1xuICAgICAgICB0aGlzLmRhc2hZID0geTtcbiAgICAgICAgdGhpcy5pc0J1c3kgPSB0cnVlO1xuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb3ZlcyA9IDA7XG4gICAgICAgIHRoaXMuZW5lcmd5IC09IE1hdGguY2VpbCh0aGlzLmdhbWUuZGFzaENvc3QgKiAoKGRpc3QpIC8gdGhpcy5nYW1lLmRhc2hEaXN0YW5jZSkpO1xuXG4gICAgICAgIC8vIHJldHVybiB0aGUgYWN0aW9uIHdhcyBzdWNjZXNzZnVsLlxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogZGFzaCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBtaW5lLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBib2R5IC0gVGhlIG9iamVjdCB0byBiZSBtaW5lZC5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVNaW5lKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgYm9keTogQm9keSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRNaW5lQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbWluZSAtLT4+XG5cbiAgICAgICAgLy8gY2hlY2sgd2lkZWx5IGNvbnNpc3RlbnQgdGhpbmdzLlxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0cnVlKTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSByZWFzb24sIHJldHVybiBpdC5cbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBhIGJvZHkgd2FzIGdpdmVuLlxuICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiBgQm9keSBkb2Vzbid0IGV4aXN0YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBpdCBpcyBhbiBhc3Rlcm9pZC5cbiAgICAgICAgaWYgKGJvZHkuYm9keVR5cGUgIT09IFwiYXN0ZXJvaWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke2JvZHl9IG11c3QgYmUgYW4gYXN0ZXJvaWQhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc2hpcCBpcyBhIG1pbmVyLlxuICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgIT09IFwibWluZXJcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG11c3QgYmUgYSBtaW5lciBzaGlwLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaGFzIHNvbWUgbWF0ZXJpYWwgdG8gbWluZS5cbiAgICAgICAgaWYgKChib2R5LmJvZHlUeXBlICE9PSBcImFzdGVyb2lkXCIpIHx8IChib2R5LmFtb3VudCA8PSAwKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke2JvZHl9IGRvZXMgbm90IGhhdmUgYW55IG1hdGVyaWFscyB0byBtaW5lIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIGFzdGVyb2lkIGlzIGluIHJhbmdlLlxuICAgICAgICBpZiAodGhpcy5qb2IucmFuZ2UgKyBib2R5LnJhZGl1cyA8IHRoaXMuZGlzdGFuY2UodGhpcy54LCB0aGlzLnksIGJvZHkueCwgYm9keS55KSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRvbyBmYXIgYXdheSBmcm9tICR7Ym9keX0gdG8gbWluZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB1bml0IGNhbiBob2xkIHRoaW5ncy5cbiAgICAgICAgaWYgKHRoaXMuam9iLmNhcnJ5TGltaXQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBob2xkIG1hdGVyaWFscyFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIG1pbmluZyBvZiB0aGUgbXl0aGljaXRlIGlzIGxlZ2FsLlxuICAgICAgICBpZiAodGhpcy5nYW1lLmN1cnJlbnRUdXJuIDwgdGhpcy5nYW1lLm9yYml0c1Byb3RlY3RlZCAmJiBib2R5Lm1hdGVyaWFsVHlwZSA9PT0gXCJteXRoaWNpdGVcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBtaW5lIHRoZSBteXRoaWNpdGUgeWV0LiBJdCBpcyBwcm90ZWN0ZWQgZm9yIHRoZSBmaXJzdCAxMiB0dXJucy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIG1pbmluZyBvZiB5b3VyIG9wcG9uZW50IGRvZXNuJ3Qgb3duIHRoZSBhc3Rlcm9pZC5cbiAgICAgICAgaWYgKGJvZHkub3duZXIgIT09IHVuZGVmaW5lZCAmJiBib2R5Lm93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgbWluZSB0aGUgYXN0ZXJvaWQgYXMgaXQgaXMgb3duZWQgYnkgeW91ciBvcHBvbmVudC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB1bml0IGNhbiBjYXJyeSBtb3JlIG1hdGVyaWFscy5cbiAgICAgICAgY29uc3QgY3VycmVudExvYWQgPSB0aGlzLmdlbmFyaXVtICsgdGhpcy5yYXJpdW0gKyB0aGlzLmxlZ2VuZGFyaXVtICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5teXRoaWNpdGU7XG4gICAgICAgIGlmICh0aGlzLmpvYi5jYXJyeUxpbWl0IDw9IGN1cnJlbnRMb2FkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGhvbGQgYW55IG1vcmUgbWF0ZXJpYWxzIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgbWluZSBoZXJlIGFuZCB0cnkgdG9cbiAgICAgICAgLy8gcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBpbnB1dCBpcyB3cm9uZy5cbiAgICAgICAgLy8gSWYgeW91IG5lZWQgdG8gY2hhbmdlIGFuIGFyZ3VtZW50IGZvciB0aGUgcmVhbCBmdW5jdGlvbiwgdGhlblxuICAgICAgICAvLyBjaGFuZ2luZyBpdHMgdmFsdWUgaW4gdGhpcyBzY29wZSBpcyBlbm91Z2guXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbWluZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWxsb3dzIGEgbWluZXIgdG8gbWluZSBhIGFzdGVyb2lkXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBib2R5IC0gVGhlIG9iamVjdCB0byBiZSBtaW5lZC5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBhY3RlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBtaW5lKHBsYXllcjogUGxheWVyLCBib2R5OiBCb2R5KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1pbmUgLS0+PlxuXG4gICAgICAgIC8vIFNldCB0aGUgYXN0ZXJvaWRzIG93bmVyIHRvIHRoZSBzaGlwcyBvd25lci5cbiAgICAgICAgYm9keS5vd25lciA9IHBsYXllcjtcblxuICAgICAgICAvLyBBZGQgb3JlIHRvIG1pbmVyIGJhc2VkIG9uIHRoZSBtaW5pbmcgcmF0ZSB2cyB3aGF0IGlzIGluIHRoZSBib2R5LlxuICAgICAgICBsZXQgYWN0dWFsQW1vdW50ID0gTWF0aC5taW4oYm9keS5hbW91bnQsIHRoaXMuZ2FtZS5taW5pbmdTcGVlZCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRMb2FkID0gdGhpcy5nZW5hcml1bSArIHRoaXMubGVnZW5kYXJpdW0gKyB0aGlzLm15dGhpY2l0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yYXJpdW07XG5cbiAgICAgICAgLy8gTWFrZXMgc3VyZSBhbW91bnQgYWRkZWQgZG9lcyBub3QgZ28gb3ZlciB0aGUgY2FycnkgbGltaXRcbiAgICAgICAgaWYgKHRoaXMuam9iLmNhcnJ5TGltaXQgPCBhY3R1YWxBbW91bnQgKyBjdXJyZW50TG9hZCkge1xuICAgICAgICAgICAgYWN0dWFsQW1vdW50ID0gdGhpcy5qb2IuY2FycnlMaW1pdCAtIGN1cnJlbnRMb2FkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkcyB0aGUgY29ycmVjdGVkIGFtb3VudCB0byB0aGUgbmVjZXNzYXJ5IG1hdGVyaWFsLlxuICAgICAgICBpZiAoYm9keS5tYXRlcmlhbFR5cGUgPT09IFwiZ2VuYXJpdW1cIikge1xuICAgICAgICAgICAgdGhpcy5nZW5hcml1bSArPSBhY3R1YWxBbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYm9keS5tYXRlcmlhbFR5cGUgPT09IFwibGVnZW5kYXJpdW1cIikge1xuICAgICAgICAgICAgdGhpcy5sZWdlbmRhcml1bSArPSBhY3R1YWxBbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYm9keS5tYXRlcmlhbFR5cGUgPT09IFwibXl0aGljaXRlXCIpIHtcbiAgICAgICAgICAgIHRoaXMubXl0aGljaXRlICs9IGFjdHVhbEFtb3VudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChib2R5Lm1hdGVyaWFsVHlwZSA9PT0gXCJyYXJpdW1cIikge1xuICAgICAgICAgICAgdGhpcy5yYXJpdW0gKz0gYWN0dWFsQW1vdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFyayB0aGUgdW5pdCBoYXMgYWN0ZWQuXG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBpdCBjYW4ndCBkbyBhbnl0aGluZyBlbHNlIHRoaXMgdHVyblxuICAgICAgICB0aGlzLmlzQnVzeSA9IHRydWU7XG4gICAgICAgIHRoaXMuZGFzaFggPSB0aGlzLng7XG4gICAgICAgIHRoaXMuZGFzaFkgPSB0aGlzLnk7XG4gICAgICAgIHRoaXMubW92ZXMgPSAwO1xuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgbWluZWQgb3JlIGZyb20gdGhlIGFzdGVyb2lkXG4gICAgICAgIGJvZHkuYW1vdW50IC09IGFjdHVhbEFtb3VudDtcblxuICAgICAgICAvLyByZXR1cm4gdGhlIGFjdGlvbiB3YXMgc3VjY2Vzc2Z1bC5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1pbmUgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgbW92ZS4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0geCAtIFRoZSB4IHZhbHVlIG9mIHRoZSBkZXN0aW5hdGlvbidzIGNvb3JkaW5hdGVzLlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgdmFsdWUgb2YgdGhlIGRlc3RpbmF0aW9uJ3MgY29vcmRpbmF0ZXMuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlTW92ZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdE1vdmVBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cblxuICAgICAgICAvLyBjaGVjayB3aWRlbHkgY29uc2lzdGVudCB0aGluZ3MuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIsIGZhbHNlKTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSByZWFzb24sIHJldHVybiBpdC5cbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdW5pdCBjYW4gbW92ZSB0byB0aGF0IGxvY2FpdG9uLlxuICAgICAgICBpZiAodGhpcy5kaXN0YW5jZSh0aGlzLngsIHRoaXMueSwgeCwgeSkgPiB0aGlzLm1vdmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuIG9ubHkgbW92ZSAke3RoaXMubW92ZXN9IGRpc3RhbmNlIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaXMgaW4gYm91bmRzLlxuICAgICAgICBpZiAodGhpcy54IDwgMCB8fCB0aGlzLnkgPCAwIHx8IHRoaXMueCA+IHRoaXMuZ2FtZS5zaXplWCB8fCB0aGlzLnkgPiB0aGlzLmdhbWUuc2l6ZVkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkZWFkIGFuZCBjYW5ub3QgbW92ZS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB1bml0IGlzIGluIGJvdW5kcy5cbiAgICAgICAgaWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPiB0aGlzLmdhbWUuc2l6ZVggfHwgeSA+IHRoaXMuZ2FtZS5zaXplWSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBtb3ZlIG9mZiB0aGUgbWFwLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBncmFiIHRoZSBzdW5cbiAgICAgICAgY29uc3Qgc3VuID0gdGhpcy5nYW1lLmJvZGllc1syXTtcblxuICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXNuJ3QgbW92aW5nIGludG8gdGhlIHN1biB6b25lXG4gICAgICAgIGlmICh0aGlzLmRpc3RhbmNlKHgsIHksIHN1bi54LCBzdW4ueSkgPCBzdW4ucmFkaXVzICsgdGhpcy5nYW1lLnNoaXBSYWRpdXMpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgbW92ZSB0byB0aG9zZSBjb29yZGluYXRlcyBkdWUgdG8gbGFuZGluZyBpbiB0aGUgc3VuLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgbW92ZSBoZXJlIGFuZCB0cnkgdG9cbiAgICAgICAgLy8gcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBpbnB1dCBpcyB3cm9uZy5cbiAgICAgICAgLy8gSWYgeW91IG5lZWQgdG8gY2hhbmdlIGFuIGFyZ3VtZW50IGZvciB0aGUgcmVhbCBmdW5jdGlvbiwgdGhlblxuICAgICAgICAvLyBjaGFuZ2luZyBpdHMgdmFsdWUgaW4gdGhpcyBzY29wZSBpcyBlbm91Z2guXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZXMgdGhpcyBVbml0IGZyb20gaXRzIGN1cnJlbnQgbG9jYXRpb24gdG8gdGhlIG5ldyBsb2NhdGlvbiBzcGVjaWZpZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIHggdmFsdWUgb2YgdGhlIGRlc3RpbmF0aW9uJ3MgY29vcmRpbmF0ZXMuXG4gICAgICogQHBhcmFtIHkgLSBUaGUgeSB2YWx1ZSBvZiB0aGUgZGVzdGluYXRpb24ncyBjb29yZGluYXRlcy5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGl0IG1vdmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIG1vdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB4OiBudW1iZXIsXG4gICAgICAgIHk6IG51bWJlcixcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbW92ZSAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIG1vdmUuXG4gICAgICAgIHRoaXMubW92ZXMgLT0gdGhpcy5kaXN0YW5jZSh0aGlzLngsIHRoaXMueSwgeCwgeSk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgLy8gaWYgaXQgaXMgYSBtaXNzaWxlIGJvYXQsIGl0IGNhbiBubyBsb25nZXIgZmlyZVxuICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgPT09IFwibWlzc2lsZWJvYXRcIikge1xuICAgICAgICAgICAgdGhpcy5hY3RlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWdpYyBjb2RlIHRoYXQgdXBkYXRlcyB0aGUgdW5pdHMgZ3JpZCBwb3NpdGlvbi5cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBzYWZlLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIHggcG9zaXRpb24gb2YgdGhlIGxvY2F0aW9uIHlvdSB3aXNoIHRvIGFycml2ZS5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IHBvc2l0aW9uIG9mIHRoZSBsb2NhdGlvbiB5b3Ugd2lzaCB0byBhcnJpdmUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlU2FmZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdFNhZmVBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zYWZlIC0tPj5cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaXMgaW4gYm91bmRzLlxuICAgICAgICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+IHRoaXMuZ2FtZS5zaXplWCB8fCB5ID4gdGhpcy5nYW1lLnNpemVZKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGJlIG9mZiBvZiB0aGUgbWFwLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaXMgaW4gYm91bmRzLlxuICAgICAgICBpZiAodGhpcy54IDwgMCB8fCB0aGlzLnkgPCAwIHx8IHRoaXMueCA+IHRoaXMuZ2FtZS5zaXplWCB8fCB0aGlzLnkgPiB0aGlzLmdhbWUuc2l6ZVkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkZWFkLCB3aHkgZG8geW91IGJvdGhlciBjaGVja2luZz9gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIHRoZSBhcmd1bWVudHMgZm9yIHNhZmUgaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNhZmUgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRlbGxzIHlvdSBpZiB5b3VyIHNoaXAgY2FuIG1vdmUgdG8gdGhhdCBsb2NhdGlvbiBmcm9tIHdlcmUgaXQgaXMgd2l0aG91dFxuICAgICAqIGNsaXBwaW5nIHRoZSBzdW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIHggcG9zaXRpb24gb2YgdGhlIGxvY2F0aW9uIHlvdSB3aXNoIHRvIGFycml2ZS5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IHBvc2l0aW9uIG9mIHRoZSBsb2NhdGlvbiB5b3Ugd2lzaCB0byBhcnJpdmUuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBwYXRoYWJsZSBieSB0aGlzIHVuaXQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgc2FmZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHg6IG51bWJlcixcbiAgICAgICAgeTogbnVtYmVyLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzYWZlIC0tPj5cblxuICAgICAgICAvLyBncmFiIHRoZSBzdW5cbiAgICAgICAgY29uc3Qgc3VuID0gdGhpcy5nYW1lLmJvZGllc1syXTtcblxuICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXNuJ3QgbW92aW5nIGludG8gdGhlIHN1biB6b25lXG4gICAgICAgIGlmICh0aGlzLmRpc3RhbmNlKHgsIHksIHN1bi54LCBzdW4ueSkgPCBzdW4ucmFkaXVzICsgdGhpcy5nYW1lLnNoaXBSYWRpdXMpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJldHVybiB0aGF0IHRoZSBtb3ZlIGlzIHNhZmUuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzYWZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHNob290ZG93bi4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWRcbiAgICAgKiBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmdcbiAgICAgKiB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gbWlzc2lsZSAtIFRoZSBwcm9qZWN0aWxlIGJlaW5nIHNob3QgZG93bi5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVTaG9vdGRvd24oXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBtaXNzaWxlOiBQcm9qZWN0aWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdFNob290ZG93bkFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNob290ZG93biAtLT4+XG4gICAgICAgIC8vIGNoZWNrIHdpZGVseSBjb25zaXN0ZW50IHRoaW5ncy5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVhc29uLCByZXR1cm4gaXQuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgcHJvamVjdGlsZSBkb2VzIG5vdCBleGlzdFxuICAgICAgICBpZiAoIW1pc3NpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3Qgc2hvb3QgZG93biBhIG1pc3NpbGUgdGhhdCBkb2VzIG5vdCBleGlzdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIHByb2plY3RpbGUgaXMgb3V0IG9mIGJvdW5kcyBvZiB0aGUgbWFwXG4gICAgICAgIGlmIChtaXNzaWxlLnggPCAwIHx8IG1pc3NpbGUueCA+IHRoaXMuZ2FtZS5zaXplWCB8fCBtaXNzaWxlLnkgPCAwIHx8IG1pc3NpbGUueSA+IHRoaXMuZ2FtZS5zaXplWSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBzaG9vdCBkb3duICR7bWlzc2lsZX0gd2hpY2ggaXMgb3V0IG9mIGJvdW5kcy4gTGV0IGl0IGdvLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgcHJvamVjdGlsZSBiZWxvbmdzIHRvIHRoZSBwbGF5ZXIgdHJ5aW5nIHRvIHNob290IGl0IGRvd25cbiAgICAgICAgaWYgKG1pc3NpbGUub3duZXIgPT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRyeWluZyB0byBzaG9vdCBkb3duICR7bWlzc2lsZX0gd2hpY2ggaXMgYW4gYWxseS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhpcyB1bml0IGhhcyBhbHJlYWR5IGFjdGVkLCBpdCBtYXkgbm90IGFjdCBhZ2FpblxuICAgICAgICBpZiAodGhpcy5hY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGhhcyBhbHJlYWR5IGFjdGVkLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGlzIHVuaXQgaXMgTk9UIGEgY29ydmV0dGVcbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlICE9PSBcImNvcnZldHRlXCIgJiYgdGhpcy5qb2IudGl0bGUgIT09IFwibWlzc2lsZWJvYXRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIG5vdCBhIGNvcnZldHRlIG9yIG1pc3NpbGVib2F0LiBJdCBjYW5ub3Qgc2hvb3QgZG93biBtaXNzaWxlcy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIHByb2plY3RpbGUgaXMgb3V0IG9mIHRoZSByYW5nZSBvZiB0aGUgY29ydmV0dGVcbiAgICAgICAgaWYgKHRoaXMuZGlzdGFuY2UodGhpcy54LCB0aGlzLnksIG1pc3NpbGUueCwgbWlzc2lsZS55KSA+IHRoaXMuZ2FtZS5qb2JzWzBdLnJhbmdlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgdG9vIGZhciBhd2F5IGZyb20gdGhlIHRhcmdldC4gTXVzdCBiZSB3aXRoaW4gYXR0YWNrIHJhbmdlIGZvciBhIGNvcnZldHRlLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3Igc2hvb3REb3duIGhlcmUgYW5kIHRyeSB0b1xuICAgICAgICAvLyByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB3aHkgdGhlIGlucHV0IGlzIHdyb25nLlxuICAgICAgICAvLyBJZiB5b3UgbmVlZCB0byBjaGFuZ2UgYW4gYXJndW1lbnQgZm9yIHRoZSByZWFsIGZ1bmN0aW9uLCB0aGVuXG4gICAgICAgIC8vIGNoYW5naW5nIGl0cyB2YWx1ZSBpbiB0aGlzIHNjb3BlIGlzIGVub3VnaC5cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zaG9vdGRvd24gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGFja3MgdGhlIHNwZWNpZmllZCBwcm9qZWN0aWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gbWlzc2lsZSAtIFRoZSBwcm9qZWN0aWxlIGJlaW5nIHNob3QgZG93bi5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBhdHRhY2tlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBzaG9vdGRvd24oXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBtaXNzaWxlOiBQcm9qZWN0aWxlLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzaG9vdGRvd24gLS0+PlxuXG4gICAgICAgIC8vIEFkZCBsb2dpYyBoZXJlIGZvciBzaG9vdERvd24uXG4gICAgICAgIC8vIGRhbWFnZSB0aGUgbWlzc2lsZS5cbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcImNvcnZldHRlXCIpIHtcbiAgICAgICAgICAgIG1pc3NpbGUuZW5lcmd5IC09IHRoaXMuam9iLmRhbWFnZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1pc3NpbGUuZW5lcmd5ID0gLTE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWlzc2lsZSBpcyBkZWFkLCBraWxsIGl0LiBUaGUgb25seSB0aGluZyB0aGF0IGRpZXMgYXQgMCBlbmVyZ3kuXG4gICAgICAgIGlmIChtaXNzaWxlLmVuZXJneSA8IDApIHtcbiAgICAgICAgICAgIG1pc3NpbGUueCA9IC0xMDE7XG4gICAgICAgICAgICBtaXNzaWxlLnkgPSAtMTAxO1xuICAgICAgICAgICAgbWlzc2lsZS5mdWVsID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoZSBjb3J2ZXR0ZSBoYXMgbm93IGFjdGVkXG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlO1xuXG4gICAgICAgIC8vIGxvZ2ljIGhhcyBiZWVuIGFkZGVkXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzaG9vdGRvd24gLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgdHJhbnNmZXIuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkXG4gICAgICogaW4gcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nXG4gICAgICogdGhlbSB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHVuaXQgLSBUaGUgdW5pdCB5b3UgYXJlIGdyYWJiaW5nIHRoZSByZXNvdXJjZXMgZnJvbS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiBtYXRlcmlhbHMgdG8geW91IHdpdGggdG8gZ3JhYi4gQW1vdW50cyA8PVxuICAgICAqIDAgd2lsbCBwaWNrIHVwIGFsbCB0aGUgbWF0ZXJpYWxzIHRoYXQgdGhlIHVuaXQgY2FuLlxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCAtIFRoZSBtYXRlcmlhbCB0aGUgdW5pdCB3aWxsIHBpY2sgdXAuICdnZW5hcml1bScsXG4gICAgICogJ3Jhcml1bScsICdsZWdlbmRhcml1bScsIG9yICdteXRoaWNpdGUnLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVRyYW5zZmVyKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdW5pdDogVW5pdCxcbiAgICAgICAgYW1vdW50OiBudW1iZXIsXG4gICAgICAgIG1hdGVyaWFsOiBcImdlbmFyaXVtXCIgfCBcInJhcml1bVwiIHwgXCJsZWdlbmRhcml1bVwiIHwgXCJteXRoaWNpdGVcIixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRUcmFuc2ZlckFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXRyYW5zZmVyIC0tPj5cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgdHJhbnNmZXIgaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIENoZWNrIGNvbW1vbiBpbnZhbGlkYXRlc1xuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCBmYWxzZSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVhc29uLCByZXR1cm4gaXQuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayB0aGF0IHRhcmdldCBzaGlwIGV4aXN0c1xuICAgICAgICBpZiAoIXVuaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4ndCBjcmVhdGUgbWluZXJhbHMgb3V0IG9mIHRoaW4gc3BhY2UhIFRoZSB0YXJnZXQgc2hpcCBkb2Vzbid0IGV4aXN0LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgeW91IG93biB0aGUgdW5pdC5cbiAgICAgICAgaWYgKHVuaXQub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IHlvdXIgb3Bwb25lbnQgd29uJ3QgZ2l2ZSB5b3UgbWF0ZXJpYWxzLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayB0aGF0IHRhcmdldCBzaGlwIGlzIGluIHJhbmdlXG4gICAgICAgIGlmICh0aGlzLmRpc3RhbmNlKHRoaXMueCwgdGhpcy55LCB1bml0LngsIHVuaXQueSkgPiB0aGlzLmpvYi5yYW5nZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRvbyBmYXIgYXdheSB0byB0cmFuc2ZlciBtYXRlcmlhbHMgd2l0aCB0aGUgdGFyZ2V0IHNoaXAhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHNoaXAgY2FuIGhvbGQgY2FyXG4gICAgICAgIGlmICh0aGlzLmpvYi5jYXJyeUxpbWl0IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgaG9sZCBjYXJnbyFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgc2hpcCBoYXMgc3BhY2VcbiAgICAgICAgY29uc3QgY3VycmVudExvYWQgPSB0aGlzLmdlbmFyaXVtICsgdGhpcy5yYXJpdW0gKyB0aGlzLmxlZ2VuZGFyaXVtICsgdGhpcy5teXRoaWNpdGU7XG4gICAgICAgIGlmIChjdXJyZW50TG9hZCA9PT0gdGhpcy5qb2IuY2FycnlMaW1pdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGFscmVhZHkgaGFzIGEgZnVsbCBjYXJnbyBob2xkIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSB0YXJnZXQgc2hpcCBoYXMgdGhlIG1hdGVyaWFsXG4gICAgICAgIGlmICh1bml0W21hdGVyaWFsXSA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dW5pdH0gZG9lcyBub3QgaGF2ZSBhbnkgJHttYXRlcmlhbH0gZm9yICR7dGhpc30gdG8gdGFrZSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtdHJhbnNmZXIgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdyYWIgbWF0ZXJpYWxzIGZyb20gYSBmcmllbmRseSB1bml0LiBEb2Vzbid0IHVzZSBhIGFjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHVuaXQgLSBUaGUgdW5pdCB5b3UgYXJlIGdyYWJiaW5nIHRoZSByZXNvdXJjZXMgZnJvbS5cbiAgICAgKiBAcGFyYW0gYW1vdW50IC0gVGhlIGFtb3VudCBvZiBtYXRlcmlhbHMgdG8geW91IHdpdGggdG8gZ3JhYi4gQW1vdW50cyA8PVxuICAgICAqIDAgd2lsbCBwaWNrIHVwIGFsbCB0aGUgbWF0ZXJpYWxzIHRoYXQgdGhlIHVuaXQgY2FuLlxuICAgICAqIEBwYXJhbSBtYXRlcmlhbCAtIFRoZSBtYXRlcmlhbCB0aGUgdW5pdCB3aWxsIHBpY2sgdXAuICdnZW5hcml1bScsXG4gICAgICogJ3Jhcml1bScsICdsZWdlbmRhcml1bScsIG9yICdteXRoaWNpdGUnLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IHRha2VuLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHRyYW5zZmVyKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdW5pdDogVW5pdCxcbiAgICAgICAgYW1vdW50OiBudW1iZXIsXG4gICAgICAgIG1hdGVyaWFsOiBcImdlbmFyaXVtXCIgfCBcInJhcml1bVwiIHwgXCJsZWdlbmRhcml1bVwiIHwgXCJteXRoaWNpdGVcIixcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogdHJhbnNmZXIgLS0+PlxuXG4gICAgICAgIC8vIGdyYWIgdGhlIHJlc291cmNlcyBvbiB0aGUgc2hpcC5cbiAgICAgICAgY29uc3QgdG90YWxSZXNvdXJjZU9uU2hpcCA9IHVuaXRbbWF0ZXJpYWxdO1xuICAgICAgICAvLyBncmFiIHRoZSBjdXJyZW50IG1hdGVyaWFscyBvbiB0aGUgc2hpcC5cbiAgICAgICAgY29uc3QgY3VycmVudExvYWQgPSB0aGlzLmdlbmFyaXVtICsgdGhpcy5yYXJpdW0gKyB0aGlzLmxlZ2VuZGFyaXVtICsgdGhpcy5teXRoaWNpdGU7XG5cbiAgICAgICAgLy8gY29ycmVjdCB0aGUgYWN1dGFsIGFtb3VudCB0byBhY2NvdW50IGZvciBhIG5lZ2F0aXZlIGFyZ3VtZW50LlxuICAgICAgICBsZXQgYWN0dWFsQW1vdW50ID0gYW1vdW50IDw9IDBcbiAgICAgICAgICAgID8gdG90YWxSZXNvdXJjZU9uU2hpcFxuICAgICAgICAgICAgOiBNYXRoLm1pbih0b3RhbFJlc291cmNlT25TaGlwLCBhbW91bnQpO1xuXG4gICAgICAgIC8vIGFjY291bnQgZm9yIGNhcnJ5IGxpbWl0LlxuICAgICAgICBhY3R1YWxBbW91bnQgPSBNYXRoLm1pbihhY3R1YWxBbW91bnQsIHRoaXMuam9iLmNhcnJ5TGltaXQgLSBjdXJyZW50TG9hZCk7XG5cbiAgICAgICAgLy8gc2hpZnQgdGhlIGFtb3VudHMgZm9yIHRyYW5zZmVyLlxuICAgICAgICB1bml0W21hdGVyaWFsXSAtPSBhY3R1YWxBbW91bnQ7XG4gICAgICAgIHRoaXNbbWF0ZXJpYWxdICs9IGFjdHVhbEFtb3VudDtcblxuICAgICAgICAvLyByZXR1cm4gaXQgd2FzIHN1Y2Nlc3NmdWwuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0cmFuc2ZlciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRyaWVzIHRvIGludmFsaWRhdGUgYXJncyBmb3IgYW4gYWN0aW9uIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gdGhlIHBsYXllciBjb21tYW5kaW5nIHRoaXMgVW5pdFxuICAgICAqIEBwYXJhbSBjaGVja0FjdGlvbiAtIHRydWUgdG8gY2hlY2sgaWYgdGhpcyBVbml0IGhhcyBhbiBhY3Rpb25cbiAgICAgKiBAcmV0dXJucyBUaGUgcmVhc29uIHRoaXMgaXMgaW52YWxpZCwgdW5kZWZpbmVkIGlmIGxvb2tzIHZhbGlkIHNvIGZhci5cbiAgICAgKi9cbiAgICBwcml2YXRlIGludmFsaWRhdGUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBjaGVja0FjdGlvbjogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGVyZSBpcyBhIHBsYXllciBhbmQgaXQgaXMgdGhlaXIgdHVybi5cbiAgICAgICAgaWYgKCFwbGF5ZXIgfHwgcGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGBJdCBpc24ndCB5b3VyIHR1cm4sICR7cGxheWVyfS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB0aGluZyBpcyBvd25lZCBieSB0aGUgcGxheWVyLlxuICAgICAgICBpZiAodGhpcy5vd25lciAhPT0gcGxheWVyIHx8IHRoaXMub3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzbid0IG93bmVkIGJ5IHlvdS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNCdXN5KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGRvIGFueXRoaW5nIGVsc2UgYXMgaXQgaXMgZGFzaGluZyBvciBtaW5pbmcuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdW5pdCBoYXNuJ3QgYWN0ZWQuXG4gICAgICAgIGlmIChjaGVja0FjdGlvbiAmJiB0aGlzLmFjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIGFscmVhZHkgYWN0ZWQgdGhpcyB0dXJuLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHVuaXQgaXMgYWxpdmUuXG4gICAgICAgIGlmICh0aGlzLmVuZXJneSA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkZWFkLCBhbmQgY2Fubm90IGRvIGFueXRoaW5nLmA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm5zIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwb2ludHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB4MTogdGhlIHN0YXJ0IHggY29vcmRpbmF0ZS5cbiAgICAgKiBAcGFyYW0geTE6IHRoZSBzdGFydCB5IGNvb3JkaW5hdGUuXG4gICAgICogQHBhcmFtIHgyOiB0aGUgZW5kIHggY29vcmRpbmF0ZS5cbiAgICAgKiBAcGFyYW0geTI6IHRoZSBlbmQgeSBjb29yZGluYXRlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50cy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGRpc3RhbmNlKHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICAvLyBncmFiIHRoZSBkaWZmZXJlbmNlcy5cbiAgICAgICAgY29uc3QgeERpZiA9ICh4MSAtIHgyKTtcbiAgICAgICAgY29uc3QgeURpZiA9ICh5MSAtIHkyKTtcblxuICAgICAgICAvLyByZXR1cm4gdGhlIGRpc3RhbmNlLlxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh4RGlmICoqIDIpICsgKHlEaWYgKiogMikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRldGVjdHMgaWYgdGhlIGdpdmVuIGxpbmUgaW50ZXJzZWN0cyB0aGUgc3VuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHgxOiB0aGUgc3RhcnQgeCBjb29yZGluYXRlLlxuICAgICAqIEBwYXJhbSB5MTogdGhlIHN0YXJ0IHkgY29vcmRpbmF0ZS5cbiAgICAgKiBAcGFyYW0geDI6IHRoZSBlbmQgeCBjb29yZGluYXRlLlxuICAgICAqIEBwYXJhbSB5MjogdGhlIGVuZCB5IGNvb3JkaW5hdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUcnVlID0gY29sbGlkZSwgZmFsc2UgPSBubyBjb2xsaWRlLlxuICAgICAqL1xuICAgIHByaXZhdGUgY29sbGlkZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIGdyYWIgdGhlIHN1biBmb3IgcmVmZXJlbmNlLlxuICAgICAgICBjb25zdCBzdW4gPSB0aGlzLmdhbWUuYm9kaWVzWzJdO1xuXG4gICAgICAgIC8vIGdyYWIgbGluZSBsZW5ndGhcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5kaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mik7XG5cbiAgICAgICAgLy8gZ3JhYiB0aGUgbGVuZ3RoIG9mIHRoZSBzaGlwIGFuZCBzdW4uXG4gICAgICAgIGNvbnN0IG1pbkRpc3QgPSBzdW4ucmFkaXVzICsgdGhpcy5nYW1lLnNoaXBSYWRpdXM7XG5cbiAgICAgICAgLy8gbWFrZSBzdXJlIGl0IGlzbid0IGRhc2hpbmcgdGhyb3VnaCB0aGUgc3VuIHpvbmVcbiAgICAgICAgY29uc3QgYSA9ICh5MSAtIHkyKTtcbiAgICAgICAgY29uc3QgYiA9ICh4MiAtIHgxKTtcbiAgICAgICAgY29uc3QgYyA9ICh4MSAqIHkyKSAtICh4MiAqIHkxKTtcbiAgICAgICAgLy8gZ3JhYiB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgbGluZSBhbmQgdGhlIGNpcmNsZSBhdCBpdCdzIGNsb3Nlc3QuXG4gICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmFicygoYSAqIHN1bi54KSArIChiICogc3VuLnkpICsgYykgLyBNYXRoLnNxcnQoKGEgKiogMikgKyAoYiAqKiAyKSk7XG4gICAgICAgIGlmIChkaXN0IDw9IG1pbkRpc3QpIHtcbiAgICAgICAgICAgIC8vIGdyYWIgdGhlIHR3byBib29sIGZvciBwb3NzaWJsZSBpbmZpbml0ZSBsaW5lIGNhdGNoZXNcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrMSA9IHRoaXMuZGlzdGFuY2UoeDEsIHkxLCBzdW4ueCwgc3VuLnkpID4gbGVuZ3RoO1xuICAgICAgICAgICAgY29uc3QgY2hlY2syID0gdGhpcy5kaXN0YW5jZSh4MiwgeTIsIHN1bi54LCBzdW4ueSkgPiBsZW5ndGg7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc3VuIGlzIHdpdGhpbiBjb2xsaXNpb24gZGlzdGFuY2UsIGJ1dCBmdXJ0aGVyIHRoYW4gdGhlIG90aGVyIGVuZCBwb2ludC5cbiAgICAgICAgICAgIGlmIChjaGVjazEpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBjb2xsaWRlcyB3aXRoIHRoZSBvdGhlciBlbmQgcG9pbnQuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlzdGFuY2UoeDIsIHkyLCBzdW4ueCwgc3VuLnkpIDwgbWluRGlzdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGUgc3VuIGlzIHdpdGhpbiBjb2xsaXNpb24gZGlzdGFuY2UsIGJ1dCBmdXJ0aGVyIHRoYW4gdGhlIG90aGVyIGVuZCBwb2ludC5cbiAgICAgICAgICAgIGlmIChjaGVjazIpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBjb2xsaWRlcyB3aXRoIHRoZSBvdGhlciBlbmQgcG9pbnQuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlzdGFuY2UoeDEsIHkxLCBzdW4ueCwgc3VuLnkpIDwgbWluRGlzdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBuZWl0aGVyIGNoZWNrIGlzIHRydWUsIHRoZW4gaXQgaXMgYSBub3JtYWwgY29sbGlzaW9uLlxuICAgICAgICAgICAgaWYgKCFjaGVjazEgJiYgIWNoZWNrMikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoYXQgdGhlcmUgaXMgbm8gY29sbGlzaW9uXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==