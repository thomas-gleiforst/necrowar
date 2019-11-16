"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
const materialNameToVariableName = (material) => {
    switch (material) {
        case "redium":
        case "blueium":
            return material;
        case "redium ore":
            return "rediumOre";
        case "blueium ore":
            return "blueiumOre";
    }
};
// <<-- /Creer-Merge: imports -->>
/**
 * A unit in the game. May be a manager, intern, or physicist.
 */
class Unit extends game_object_1.GameObject {
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
        this.attacked = false;
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for act. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The tile the unit acts on.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAct(player, tile) {
        // <<-- Creer-Merge: invalidate-act -->>
        // Check all the arguments for act here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.// check widespread reasons.
        const reason = this.invalidate(player, true);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // make sure the unit is on the planet.... wait...
        if (!tile) {
            return `${this}, is trying to act on a tile that doesn't exist`;
        }
        // make sure the tile is next to the unit
        if (this.tile !== tile.tileEast && this.tile !== tile.tileSouth &&
            this.tile !== tile.tileWest && this.tile !== tile.tileNorth) {
            return `${this} can only act on an adjacent tile.`;
        }
        // make sure valid target
        // if the unit is a physicist
        if (this.job.title === "physicist") {
            // if the tile has a unit.
            if (tile.unit) {
                // if the target isn't a manager.
                if (tile.unit.job.title !== "manager") {
                    return `${this} tried to act on ${tile.unit} which is not a manager`;
                }
            }
            // if there isn't a machine.
            else if (tile.machine) {
                if (tile.machine.worked <= 0) {
                    if (tile.machine.oreType === "redium" && tile.rediumOre < tile.machine.refineInput) {
                        return `${this} tried to work the machine on ${tile} which didn't have enough input to start`;
                    }
                    else if (tile.machine.oreType === "blueium" && tile.blueiumOre < tile.machine.refineInput) {
                        return `${this} tried to work the machine on ${tile} which didn't have enough input to start`;
                    }
                }
            }
            // if there isn't a machine.
            else if (!tile.machine) {
                return `${this} tried to act on ${tile} which does not contain a machine`;
            }
        }
        // if the unit is a manager.
        if (this.job.title === "manager") {
            // if the tile has a unit.
            if (tile.unit) {
                // if the target isn't a intern.
                if (tile.unit.job.title !== "intern") {
                    return `${this} tried to act on ${tile.unit} which is not a intern`;
                }
            }
            // if the target isn't a unit.
            else {
                return `${this} tried to act on ${tile} which is doesn't contain a unit`;
            }
        }
        // if the unit is a intern.
        if (this.job.title === "intern") {
            // if the tile has a unit.
            if (tile.unit) {
                if (tile.unit.job.title !== "physicist") {
                    return `${this} tried to act on ${tile.unit} which is not a physicist`;
                }
            }
            // if there isn't a machine.
            else if (!tile.machine) {
                return `${this} tried to act on ${tile} which does not contain a machine`;
            }
            // if the machine hasn't been worked.
            else if (tile.machine.worked <= 1) {
                return `${this} tried to act on ${tile} which was not worked enough`;
            }
        }
        // <<-- /Creer-Merge: invalidate-act -->>
    }
    /**
     * Makes the unit do something to a machine or unit adjacent to its tile.
     * Interns sabotage, physicists work. Interns stun physicist, physicist
     * stuns manager, manager stuns intern.
     *
     * @param player - The player that called this.
     * @param tile - The tile the unit acts on.
     * @returns True if successfully acted, false otherwise.
     */
    async act(player, tile) {
        // <<-- Creer-Merge: act -->>
        // Add logic here for act.
        // checking if player object is Physicist and is targeting a machine
        if (this.job.title === "physicist" && tile.machine) {
            // if it is a blueium machine.
            if (tile.machine.oreType === "blueium") {
                // if the machine has been worked
                if (tile.machine.worked > 0) {
                    // work the machine.
                    tile.machine.worked++;
                }
                // if it has enough ore to start being worked.
                else {
                    // work the machine.
                    tile.machine.worked++;
                    // grab it's input.
                    tile.blueiumOre -= tile.machine.refineInput;
                }
                // resolve the machine being worked.
                if (tile.machine.worked === tile.machine.refineTime) {
                    // add the refined material.
                    tile.blueium += tile.machine.refineOutput;
                    // reset the work cycle.
                    tile.machine.worked = 0;
                }
            }
            // if it is a redium machine.
            if (tile.machine.oreType === "redium") {
                // if the machine has been worked
                if (tile.machine.worked > 0) {
                    // work the machine.
                    tile.machine.worked++;
                }
                // if it has enough ore to start being worked.
                else {
                    // work the machine.
                    tile.machine.worked++;
                    // grab it's input.
                    tile.rediumOre -= tile.machine.refineInput;
                }
                // resolve the machine being worked.
                if (tile.machine.worked === tile.machine.refineTime) {
                    // add the refined material.
                    tile.redium += tile.machine.refineOutput;
                    // reset the work cycle.
                    tile.machine.worked = 0;
                }
            }
        }
        // checking if player object is intern and their target is a machine
        else if (this.job.title === "intern" && tile.machine) {
            // reset it's work cycle, because you are mean.
            tile.machine.worked = 1;
        }
        // if the target is a unit, stun it.
        else if (tile.unit) {
            // stun the unit.
            tile.unit.stunTime += this.game.stunTime;
            // make it immune.
            tile.unit.stunImmune += this.game.timeImmune;
        }
        this.acted = true;
        // TODO: replace this with actual logic
        return true;
        // <<-- /Creer-Merge: act -->>
    }
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
        // Check all the arguments for attack here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.// check widespread reasons.
        const reason = this.invalidate(player, true);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // Handle possible tile invalidations here:
        if (!tile) {
            return `${this} is trying to attack a tile that doesn't exist`;
        }
        // make sure the tile is in range.
        if (this.tile !== tile.tileEast && this.tile !== tile.tileSouth &&
            this.tile !== tile.tileWest && this.tile !== tile.tileNorth) {
            return `${this} is trying to attack ${tile} which is too far away.`;
        }
        // check if the unit is attacking a wall (not needed but we try to be funny).
        if (tile.isWall === true) {
            return `${this} hurt its hand attacking a wall on tile ${tile}.`;
        }
        // make sure the the unit is attacking a unit.
        if (tile.unit === undefined) {
            return `${this} is attacking ${tile} that doesn't have a unit.`;
        }
        // make sure you aren't attacking a friend.
        if (tile.unit.owner === player) {
            return `${this} is trying to attack the ally: ${tile.unit} on tile ${tile}`;
        }
        // Handle possible unit invalidations here:
        if (this.owner === undefined) {
            return `${this} is attacking a unit that has no owner. Report this to the game Devs. This is 100% a bug`;
        }
        // make sure the unit has a job.
        if (this.job === undefined) {
            return `${this} doesn't have a job. That shouldn't be possible.`;
        }
        // make sure the unit hasn't moved.
        if (this.moves < this.job.moves) {
            return `${this} has already moved this turn and cannot attack`;
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks a unit on an adjacent tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to attack.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, tile) {
        // <<-- Creer-Merge: attack -->>
        // Write logic here
        if (tile.unit === undefined) {
            throw new Error("Unit on tile is undefined.");
        }
        tile.unit.health = tile.unit.health - this.job.damage;
        tile.unit.attacked = true;
        if (tile.unit.health <= 0) {
            tile.blueium += tile.unit.blueium;
            tile.redium += tile.unit.redium;
            tile.blueiumOre += tile.unit.blueiumOre;
            tile.rediumOre += tile.unit.rediumOre;
            tile.unit.health = 0; // set unit's health to zero.
            tile.unit.tile = undefined; // unlink dead unit.
            tile.unit = undefined; // Unlink tile.
        }
        this.acted = true; // unit has acted
        return true; // return true by default
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for drop. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The tile the materials will be dropped on.
     * @param amount - The number of materials to dropped. Amounts <= 0 will
     * drop all the materials.
     * @param material - The material the unit will drop. 'redium', 'blueium',
     * 'redium ore', or 'blueium ore'.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDrop(player, tile, amount, material) {
        // <<-- Creer-Merge: invalidate-drop -->>
        const reason = this.invalidate(player, false);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // make sure there isn't a wall there.
        if (tile.isWall) {
            return `${this} can't place stuff on a wall on tile ${tile}.`;
        }
        // make sure the target tile exists.
        if (!tile) {
            return `${this} is trying to prove flat earthers correct. Target Tile doesn't exist.`;
        }
        // make sure it is selecting a adjacent tile.
        if (tile !== this.tile && this.tile !== tile.tileEast && this.tile !== tile.tileSouth &&
            this.tile !== tile.tileWest && this.tile !== tile.tileNorth) {
            return `${this} can only drop things on adjacent tiles or it's tile. Target tile ${tile} is too far away.`;
        }
        return;
        // <<-- /Creer-Merge: invalidate-drop -->>
    }
    /**
     * Drops materials at the units feet or adjacent tile.
     *
     * @param player - The player that called this.
     * @param tile - The tile the materials will be dropped on.
     * @param amount - The number of materials to dropped. Amounts <= 0 will
     * drop all the materials.
     * @param material - The material the unit will drop. 'redium', 'blueium',
     * 'redium ore', or 'blueium ore'.
     * @returns True if successfully deposited, false otherwise.
     */
    async drop(player, tile, amount, material) {
        // <<-- Creer-Merge: drop -->>
        const memberName = materialNameToVariableName(material);
        const amt = Math.min(this[memberName], amount);
        // If amount <= 0, the unit will drop all resources.
        if (amount <= 0) {
            tile.blueium += this.blueium;
            tile.blueiumOre += this.blueiumOre;
            tile.redium += this.redium;
            tile.rediumOre += this.rediumOre;
            this.blueium = this.redium = this.blueiumOre = this.rediumOre = 0;
        }
        else {
            tile[memberName] += amt;
            this[memberName] -= amt;
        }
        return true;
        // <<-- /Creer-Merge: drop -->>
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
        // check widespread reasons.
        const reason = this.invalidate(player, true);
        // if there is a reason, return it.
        if (reason) {
            return reason;
        }
        // make sure the unit is on the planet.... wait...
        if (!tile) {
            return `${this}, gratz. You proved flat earthers correct. Target tile doesn't exist.`;
        }
        // Make sure there isn't a wall there. Ouch.
        if (tile.isWall) {
            return `${this} cannot walk through solid matter on tile ${tile}. Yet....`;
        }
        // Make sure the unit still has moves
        if (this.moves <= 0) {
            return `${this} cannot move anymore this turn`;
        }
        // Make sure there isn't a machine there.
        if (tile.machine) {
            return `${this} cannot walk over the machine on tile ${tile}. It is expensive.`;
        }
        // Make sure the tile isn't ocuppied.
        if (tile.unit) {
            return `${this} cannot walk through the unit on tile ${tile}. Yet.....`;
        }
        // make sure the tile is next to the unit.
        if (this.tile !== tile.tileEast && this.tile !== tile.tileSouth &&
            this.tile !== tile.tileWest && this.tile !== tile.tileNorth) {
            return `${this} can only travel to an adjacent tile. Tile ${tile} too far away.`;
        }
        // make sure they aren't entering a spawn area.
        if (tile.type === "spawn" && this.owner !== tile.owner) {
            return `${this} is entering a invalid tile. Units cannot enter opponents spawn area.`;
        }
        return;
        // Check all the arguments for move here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
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
        // Add logic here for move.
        if (!this.tile) {
            throw new Error(`${this} has no Tile to move from!`);
        }
        this.tile.unit = undefined;
        this.tile = tile;
        tile.unit = this;
        this.moves -= 1;
        return true;
        // <<-- /Creer-Merge: move -->>
    }
    /**
     * Invalidation function for pickup. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The tile the materials will be picked up from.
     * @param amount - The amount of materials to pick up. Amounts <= 0 will
     * pick up all the materials that the unit can.
     * @param material - The material the unit will pick up. 'redium',
     * 'blueium', 'redium ore', or 'blueium ore'.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidatePickup(player, tile, amount, material) {
        // <<-- Creer-Merge: invalidate-pickup -->>
        // Check all the arguments for pickup here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // check common invalidates.
        const reason = this.invalidate(player, false);
        // if there is a reason, report it.
        if (reason) {
            return reason;
        }
        // make sure the target tile exists.
        if (!tile) {
            return `${this} can only pick things up off tiles that exist`;
        }
        // make sure the tile is adjacent to the current tile, or its tile.
        if (tile !== this.tile && this.tile !== tile.tileEast && this.tile !== tile.tileSouth &&
            this.tile !== tile.tileWest && this.tile !== tile.tileNorth) {
            return `${this} can only drop things on adjacent tiles or it's tile. Target tile ${tile} is too far away.`;
        }
        // tracks the material to be picked up.
        let totalMaterialOnTile = 0;
        // sets up the amount of material.
        switch (material) {
            case "redium ore": {
                totalMaterialOnTile = tile.rediumOre;
                if (this.job.title === "manager") {
                    return `${this} cannot pick up ore!`;
                }
                break;
            }
            case "redium": {
                totalMaterialOnTile = tile.redium;
                if (this.job.title === "intern") {
                    return `${this} cannot pick up refined ore!`;
                }
                break;
            }
            case "blueium": {
                totalMaterialOnTile = tile.blueium;
                if (this.job.title === "intern") {
                    return `${this} cannot pick up refined ore!`;
                }
                break;
            }
            case "blueium ore": {
                totalMaterialOnTile = tile.blueiumOre;
                if (this.job.title === "manager") {
                    return `${this} cannot pick up ore!`;
                }
            }
        }
        const actualAmount = amount <= 0
            ? totalMaterialOnTile
            : Math.min(totalMaterialOnTile, amount);
        // Amount of materials the unit is currently carrying
        const currentLoad = this.rediumOre + this.redium + this.blueium + this.blueiumOre;
        // if the unit can't carry anymore.
        if (currentLoad === this.job.carryLimit) {
            return `${this} is already carrying as many resources as it can.`;
        }
        // if there is nothing to pickup.
        if (actualAmount <= 0) {
            return `There are no resources on ${tile} for ${this} to pickup.`;
        }
        // <<-- /Creer-Merge: invalidate-pickup -->>
    }
    /**
     * Picks up material at the units feet or adjacent tile.
     *
     * @param player - The player that called this.
     * @param tile - The tile the materials will be picked up from.
     * @param amount - The amount of materials to pick up. Amounts <= 0 will
     * pick up all the materials that the unit can.
     * @param material - The material the unit will pick up. 'redium',
     * 'blueium', 'redium ore', or 'blueium ore'.
     * @returns True if successfully deposited, false otherwise.
     */
    async pickup(player, tile, amount, material) {
        // <<-- Creer-Merge: pickup -->>
        const memberName = materialNameToVariableName(material);
        const totalMaterialOnTile = tile[memberName];
        let actualAmount = amount <= 0
            ? totalMaterialOnTile
            : Math.min(totalMaterialOnTile, amount);
        const currentLoad = this.rediumOre + this.redium + this.blueium + this.blueiumOre;
        actualAmount = Math.min(actualAmount, this.job.carryLimit - currentLoad);
        tile[memberName] -= actualAmount;
        this[memberName] += actualAmount;
        return true;
        // <<-- /Creer-Merge: pickup -->>
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
        if (!player || player !== this.game.currentPlayer) {
            return `It isn't your turn, ${player}.`;
        }
        if (this.owner !== player || this.owner === undefined) {
            return `${this} isn't owned by you.`;
        }
        // Make sure the unit hasn't acted.
        if (checkAction && this.acted) {
            return `${this} has already acted this turn. Or not enough coffee`;
        }
        // make sure the unit can function
        if (this.stunTime > 0) {
            return `${this} is stunned and cannot move.`;
        }
        // Make sure the unit is alive.
        if (this.health <= 0) {
            return `${this} is dead, probably fuel too.`;
        }
        // make sure the unit is on a tile.
        if (!this.tile) {
            return `${this} is dead and cannot do things from the afterlife.`;
        }
    }
}
exports.Unit = Unit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZXd0b25pYW4vdW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtDQUEyQztBQUszQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBRS9FLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxRQUErQyxFQUFFLEVBQUU7SUFDbkYsUUFBUSxRQUFRLEVBQUU7UUFDZCxLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssU0FBUztZQUNWLE9BQU8sUUFBUSxDQUFDO1FBQ3BCLEtBQUssWUFBWTtZQUNiLE9BQU8sV0FBVyxDQUFDO1FBQ3ZCLEtBQUssYUFBYTtZQUNkLE9BQU8sWUFBWSxDQUFDO0tBQzNCO0FBQ0wsQ0FBQyxDQUFDO0FBQ0Ysa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsd0JBQVU7SUEyRWhDLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFLRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7Ozs7O09BVUc7SUFDTyxhQUFhLENBQ25CLE1BQWMsRUFDZCxJQUFVO1FBRVYsd0NBQXdDO1FBRXhDLGtEQUFrRDtRQUNsRCxxREFBcUQ7UUFDckQsZ0VBQWdFO1FBQ2hFLDBFQUEwRTtRQUMxRSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM3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LElBQUksbURBQW1ELENBQUM7U0FDckU7SUFDTCxDQUFDO0NBS0o7QUFydEJELG9CQXF0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElVbml0QWN0QXJncywgSVVuaXRBdHRhY2tBcmdzLCBJVW5pdERyb3BBcmdzLCBJVW5pdE1vdmVBcmdzLFxuICAgICAgICAgSVVuaXRQaWNrdXBBcmdzLCBJVW5pdFByb3BlcnRpZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuXG5jb25zdCBtYXRlcmlhbE5hbWVUb1ZhcmlhYmxlTmFtZSA9IChtYXRlcmlhbDogUmVxdWlyZWQ8SVVuaXRQaWNrdXBBcmdzPltcIm1hdGVyaWFsXCJdKSA9PiB7XG4gICAgc3dpdGNoIChtYXRlcmlhbCkge1xuICAgICAgICBjYXNlIFwicmVkaXVtXCI6XG4gICAgICAgIGNhc2UgXCJibHVlaXVtXCI6XG4gICAgICAgICAgICByZXR1cm4gbWF0ZXJpYWw7XG4gICAgICAgIGNhc2UgXCJyZWRpdW0gb3JlXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJyZWRpdW1PcmVcIjtcbiAgICAgICAgY2FzZSBcImJsdWVpdW0gb3JlXCI6XG4gICAgICAgICAgICByZXR1cm4gXCJibHVlaXVtT3JlXCI7XG4gICAgfVxufTtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIHVuaXQgaW4gdGhlIGdhbWUuIE1heSBiZSBhIG1hbmFnZXIsIGludGVybiwgb3IgcGh5c2ljaXN0LlxuICovXG5leHBvcnQgY2xhc3MgVW5pdCBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgVW5pdCBoYXMgcGVyZm9ybWVkIGl0cyBhY3Rpb24gdGhpcyB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBhY3RlZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGJsdWVpdW0gY2FycmllZCBieSB0aGlzIHVuaXQuICgwIHRvIGpvYiBjYXJyeSBjYXBhY2l0eSAtXG4gICAgICogb3RoZXIgY2FycmllZCBpdGVtcykuXG4gICAgICovXG4gICAgcHVibGljIGJsdWVpdW0hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGJsdWVpdW0gb3JlIGNhcnJpZWQgYnkgdGhpcyB1bml0LiAoMCB0byBqb2IgY2FycnkgY2FwYWNpdHlcbiAgICAgKiAtIG90aGVyIGNhcnJpZWQgaXRlbXMpLlxuICAgICAqL1xuICAgIHB1YmxpYyBibHVlaXVtT3JlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlbWFpbmluZyBoZWFsdGggb2YgYSB1bml0LlxuICAgICAqL1xuICAgIHB1YmxpYyBoZWFsdGghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgSm9iIHRoaXMgVW5pdCBoYXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGpvYjogSm9iO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBtb3ZlcyB0aGlzIHVuaXQgaGFzIGxlZnQgdGhpcyB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZlcyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBQbGF5ZXIgdGhhdCBvd25zIGFuZCBjYW4gY29udHJvbCB0aGlzIFVuaXQuXG4gICAgICovXG4gICAgcHVibGljIG93bmVyPzogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiByZWRpdW0gY2FycmllZCBieSB0aGlzIHVuaXQuICgwIHRvIGpvYiBjYXJyeSBjYXBhY2l0eSAtXG4gICAgICogb3RoZXIgY2FycmllZCBpdGVtcykuXG4gICAgICovXG4gICAgcHVibGljIHJlZGl1bSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgcmVkaXVtIG9yZSBjYXJyaWVkIGJ5IHRoaXMgdW5pdC4gKDAgdG8gam9iIGNhcnJ5IGNhcGFjaXR5XG4gICAgICogLSBvdGhlciBjYXJyaWVkIGl0ZW1zKS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVkaXVtT3JlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRHVyYXRpb24gb2Ygc3R1biBpbW11bml0eS4gKDAgdG8gdGltZUltbXVuZSkuXG4gICAgICovXG4gICAgcHVibGljIHN0dW5JbW11bmUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBEdXJhdGlvbiB0aGUgdW5pdCBpcyBzdHVubmVkLiAoMCB0byB0aGUgZ2FtZSBjb25zdGFudCBzdHVuVGltZSkuXG4gICAgICovXG4gICAgcHVibGljIHN0dW5UaW1lITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdGhpcyBVbml0IGlzIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyB0aWxlPzogVGlsZTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG4gICAgLyoqXG4gICAgICogdHJhY2tzIGlmIGEgdW5pdCB3YXMgYXR0YWNrZWQuXG4gICAgICovXG4gICAgcHVibGljIGF0dGFja2VkOiBib29sZWFuO1xuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBVbml0IGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElVbml0UHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLyoqIFRoZSBKb2IgdGhpcyBVbml0IHdpbGwgaGF2ZS4gKi9cbiAgICAgICAgICAgIGpvYjogSm9iO1xuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIHRoaXMuam9iID0gYXJncy5qb2I7XG4gICAgICAgIHRoaXMuYXR0YWNrZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgYWN0LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIHRpbGUgdGhlIHVuaXQgYWN0cyBvbi5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVBY3QoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdEFjdEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWFjdCAtLT4+XG5cbiAgICAgICAgLy8gQ2hlY2sgYWxsIHRoZSBhcmd1bWVudHMgZm9yIGFjdCBoZXJlIGFuZCB0cnkgdG9cbiAgICAgICAgLy8gcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBpbnB1dCBpcyB3cm9uZy5cbiAgICAgICAgLy8gSWYgeW91IG5lZWQgdG8gY2hhbmdlIGFuIGFyZ3VtZW50IGZvciB0aGUgcmVhbCBmdW5jdGlvbiwgdGhlblxuICAgICAgICAvLyBjaGFuZ2luZyBpdHMgdmFsdWUgaW4gdGhpcyBzY29wZSBpcyBlbm91Z2guLy8gY2hlY2sgd2lkZXNwcmVhZCByZWFzb25zLlxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0cnVlKTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSByZWFzb24sIHJldHVybiBpdC5cbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdW5pdCBpcyBvbiB0aGUgcGxhbmV0Li4uLiB3YWl0Li4uXG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9LCBpcyB0cnlpbmcgdG8gYWN0IG9uIGEgdGlsZSB0aGF0IGRvZXNuJ3QgZXhpc3RgO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdGlsZSBpcyBuZXh0IHRvIHRoZSB1bml0XG4gICAgICAgIGlmICh0aGlzLnRpbGUgIT09IHRpbGUudGlsZUVhc3QgJiYgdGhpcy50aWxlICE9PSB0aWxlLnRpbGVTb3V0aCAmJlxuICAgICAgICAgICAgdGhpcy50aWxlICE9PSB0aWxlLnRpbGVXZXN0ICYmIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlTm9ydGgpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4gb25seSBhY3Qgb24gYW4gYWRqYWNlbnQgdGlsZS5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB2YWxpZCB0YXJnZXRcbiAgICAgICAgLy8gaWYgdGhlIHVuaXQgaXMgYSBwaHlzaWNpc3RcbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcInBoeXNpY2lzdFwiKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgdGlsZSBoYXMgYSB1bml0LlxuICAgICAgICAgICAgaWYgKHRpbGUudW5pdCkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXNuJ3QgYSBtYW5hZ2VyLlxuICAgICAgICAgICAgICAgIGlmICh0aWxlLnVuaXQuam9iLnRpdGxlICE9PSBcIm1hbmFnZXJcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gdHJpZWQgdG8gYWN0IG9uICR7dGlsZS51bml0fSB3aGljaCBpcyBub3QgYSBtYW5hZ2VyYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpc24ndCBhIG1hY2hpbmUuXG4gICAgICAgICAgICBlbHNlIGlmICh0aWxlLm1hY2hpbmUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGlsZS5tYWNoaW5lLndvcmtlZCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aWxlLm1hY2hpbmUub3JlVHlwZSA9PT0gXCJyZWRpdW1cIiAmJiB0aWxlLnJlZGl1bU9yZSA8IHRpbGUubWFjaGluZS5yZWZpbmVJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IHRyaWVkIHRvIHdvcmsgdGhlIG1hY2hpbmUgb24gJHt0aWxlfSB3aGljaCBkaWRuJ3QgaGF2ZSBlbm91Z2ggaW5wdXQgdG8gc3RhcnRgO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRpbGUubWFjaGluZS5vcmVUeXBlID09PSBcImJsdWVpdW1cIiAmJiB0aWxlLmJsdWVpdW1PcmUgPCB0aWxlLm1hY2hpbmUucmVmaW5lSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSB0cmllZCB0byB3b3JrIHRoZSBtYWNoaW5lIG9uICR7dGlsZX0gd2hpY2ggZGlkbid0IGhhdmUgZW5vdWdoIGlucHV0IHRvIHN0YXJ0YDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzbid0IGEgbWFjaGluZS5cbiAgICAgICAgICAgIGVsc2UgaWYgKCF0aWxlLm1hY2hpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gdHJpZWQgdG8gYWN0IG9uICR7dGlsZX0gd2hpY2ggZG9lcyBub3QgY29udGFpbiBhIG1hY2hpbmVgO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHRoZSB1bml0IGlzIGEgbWFuYWdlci5cbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcIm1hbmFnZXJcIikge1xuICAgICAgICAgICAgLy8gaWYgdGhlIHRpbGUgaGFzIGEgdW5pdC5cbiAgICAgICAgICAgIGlmICh0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgdGFyZ2V0IGlzbid0IGEgaW50ZXJuLlxuICAgICAgICAgICAgICAgIGlmICh0aWxlLnVuaXQuam9iLnRpdGxlICE9PSBcImludGVyblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSB0cmllZCB0byBhY3Qgb24gJHt0aWxlLnVuaXR9IHdoaWNoIGlzIG5vdCBhIGludGVybmA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpc24ndCBhIHVuaXQuXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gdHJpZWQgdG8gYWN0IG9uICR7dGlsZX0gd2hpY2ggaXMgZG9lc24ndCBjb250YWluIGEgdW5pdGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdGhlIHVuaXQgaXMgYSBpbnRlcm4uXG4gICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSA9PT0gXCJpbnRlcm5cIikge1xuICAgICAgICAgICAgLy8gaWYgdGhlIHRpbGUgaGFzIGEgdW5pdC5cbiAgICAgICAgICAgIGlmICh0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGlsZS51bml0LmpvYi50aXRsZSAhPT0gXCJwaHlzaWNpc3RcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gdHJpZWQgdG8gYWN0IG9uICR7dGlsZS51bml0fSB3aGljaCBpcyBub3QgYSBwaHlzaWNpc3RgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzbid0IGEgbWFjaGluZS5cbiAgICAgICAgICAgIGVsc2UgaWYgKCF0aWxlLm1hY2hpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gdHJpZWQgdG8gYWN0IG9uICR7dGlsZX0gd2hpY2ggZG9lcyBub3QgY29udGFpbiBhIG1hY2hpbmVgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlIG1hY2hpbmUgaGFzbid0IGJlZW4gd29ya2VkLlxuICAgICAgICAgICAgZWxzZSBpZiAodGlsZS5tYWNoaW5lLndvcmtlZCA8PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IHRyaWVkIHRvIGFjdCBvbiAke3RpbGV9IHdoaWNoIHdhcyBub3Qgd29ya2VkIGVub3VnaGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1hY3QgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoZSB1bml0IGRvIHNvbWV0aGluZyB0byBhIG1hY2hpbmUgb3IgdW5pdCBhZGphY2VudCB0byBpdHMgdGlsZS5cbiAgICAgKiBJbnRlcm5zIHNhYm90YWdlLCBwaHlzaWNpc3RzIHdvcmsuIEludGVybnMgc3R1biBwaHlzaWNpc3QsIHBoeXNpY2lzdFxuICAgICAqIHN0dW5zIG1hbmFnZXIsIG1hbmFnZXIgc3R1bnMgaW50ZXJuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSB0aWxlIHRoZSB1bml0IGFjdHMgb24uXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYWN0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYWN0KHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFjdCAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIGFjdC5cbiAgICAgICAgLy8gY2hlY2tpbmcgaWYgcGxheWVyIG9iamVjdCBpcyBQaHlzaWNpc3QgYW5kIGlzIHRhcmdldGluZyBhIG1hY2hpbmVcbiAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcInBoeXNpY2lzdFwiICYmIHRpbGUubWFjaGluZSkge1xuICAgICAgICAgICAgLy8gaWYgaXQgaXMgYSBibHVlaXVtIG1hY2hpbmUuXG4gICAgICAgICAgICBpZiAodGlsZS5tYWNoaW5lLm9yZVR5cGUgPT09IFwiYmx1ZWl1bVwiKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIG1hY2hpbmUgaGFzIGJlZW4gd29ya2VkXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUubWFjaGluZS53b3JrZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdvcmsgdGhlIG1hY2hpbmUuXG4gICAgICAgICAgICAgICAgICAgIHRpbGUubWFjaGluZS53b3JrZWQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgaGFzIGVub3VnaCBvcmUgdG8gc3RhcnQgYmVpbmcgd29ya2VkLlxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrIHRoZSBtYWNoaW5lLlxuICAgICAgICAgICAgICAgICAgICB0aWxlLm1hY2hpbmUud29ya2VkKys7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgaXQncyBpbnB1dC5cbiAgICAgICAgICAgICAgICAgICAgdGlsZS5ibHVlaXVtT3JlIC09IHRpbGUubWFjaGluZS5yZWZpbmVJbnB1dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcmVzb2x2ZSB0aGUgbWFjaGluZSBiZWluZyB3b3JrZWQuXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUubWFjaGluZS53b3JrZWQgPT09IHRpbGUubWFjaGluZS5yZWZpbmVUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgcmVmaW5lZCBtYXRlcmlhbC5cbiAgICAgICAgICAgICAgICAgICAgdGlsZS5ibHVlaXVtICs9IHRpbGUubWFjaGluZS5yZWZpbmVPdXRwdXQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlc2V0IHRoZSB3b3JrIGN5Y2xlLlxuICAgICAgICAgICAgICAgICAgICB0aWxlLm1hY2hpbmUud29ya2VkID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIHJlZGl1bSBtYWNoaW5lLlxuICAgICAgICAgICAgaWYgKHRpbGUubWFjaGluZS5vcmVUeXBlID09PSBcInJlZGl1bVwiKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIG1hY2hpbmUgaGFzIGJlZW4gd29ya2VkXG4gICAgICAgICAgICAgICAgaWYgKHRpbGUubWFjaGluZS53b3JrZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdvcmsgdGhlIG1hY2hpbmUuXG4gICAgICAgICAgICAgICAgICAgIHRpbGUubWFjaGluZS53b3JrZWQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgaGFzIGVub3VnaCBvcmUgdG8gc3RhcnQgYmVpbmcgd29ya2VkLlxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyB3b3JrIHRoZSBtYWNoaW5lLlxuICAgICAgICAgICAgICAgICAgICB0aWxlLm1hY2hpbmUud29ya2VkKys7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgaXQncyBpbnB1dC5cbiAgICAgICAgICAgICAgICAgICAgdGlsZS5yZWRpdW1PcmUgLT0gdGlsZS5tYWNoaW5lLnJlZmluZUlucHV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZXNvbHZlIHRoZSBtYWNoaW5lIGJlaW5nIHdvcmtlZC5cbiAgICAgICAgICAgICAgICBpZiAodGlsZS5tYWNoaW5lLndvcmtlZCA9PT0gdGlsZS5tYWNoaW5lLnJlZmluZVRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSByZWZpbmVkIG1hdGVyaWFsLlxuICAgICAgICAgICAgICAgICAgICB0aWxlLnJlZGl1bSArPSB0aWxlLm1hY2hpbmUucmVmaW5lT3V0cHV0O1xuICAgICAgICAgICAgICAgICAgICAvLyByZXNldCB0aGUgd29yayBjeWNsZS5cbiAgICAgICAgICAgICAgICAgICAgdGlsZS5tYWNoaW5lLndvcmtlZCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNraW5nIGlmIHBsYXllciBvYmplY3QgaXMgaW50ZXJuIGFuZCB0aGVpciB0YXJnZXQgaXMgYSBtYWNoaW5lXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcImludGVyblwiICYmIHRpbGUubWFjaGluZSkge1xuICAgICAgICAgICAgLy8gcmVzZXQgaXQncyB3b3JrIGN5Y2xlLCBiZWNhdXNlIHlvdSBhcmUgbWVhbi5cbiAgICAgICAgICAgIHRpbGUubWFjaGluZS53b3JrZWQgPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXMgYSB1bml0LCBzdHVuIGl0LlxuICAgICAgICBlbHNlIGlmICh0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIC8vIHN0dW4gdGhlIHVuaXQuXG4gICAgICAgICAgICB0aWxlLnVuaXQuc3R1blRpbWUgKz0gdGhpcy5nYW1lLnN0dW5UaW1lO1xuICAgICAgICAgICAgLy8gbWFrZSBpdCBpbW11bmUuXG4gICAgICAgICAgICB0aWxlLnVuaXQuc3R1bkltbXVuZSArPSB0aGlzLmdhbWUudGltZUltbXVuZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcblxuICAgICAgICAvLyBUT0RPOiByZXBsYWNlIHRoaXMgd2l0aCBhY3R1YWwgbG9naWNcbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGFjdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBhdHRhY2suIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBhdHRhY2suXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlQXR0YWNrKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRBdHRhY2tBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1hdHRhY2sgLS0+PlxuXG4gICAgICAgIC8vIENoZWNrIGFsbCB0aGUgYXJndW1lbnRzIGZvciBhdHRhY2sgaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLi8vIGNoZWNrIHdpZGVzcHJlYWQgcmVhc29ucy5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVhc29uLCByZXR1cm4gaXQuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBIYW5kbGUgcG9zc2libGUgdGlsZSBpbnZhbGlkYXRpb25zIGhlcmU6XG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRyeWluZyB0byBhdHRhY2sgYSB0aWxlIHRoYXQgZG9lc24ndCBleGlzdGA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB0aWxlIGlzIGluIHJhbmdlLlxuICAgICAgICBpZiAodGhpcy50aWxlICE9PSB0aWxlLnRpbGVFYXN0ICYmIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlU291dGggJiZcbiAgICAgICAgICAgIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlV2VzdCAmJiB0aGlzLnRpbGUgIT09IHRpbGUudGlsZU5vcnRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgdHJ5aW5nIHRvIGF0dGFjayAke3RpbGV9IHdoaWNoIGlzIHRvbyBmYXIgYXdheS5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZSB1bml0IGlzIGF0dGFja2luZyBhIHdhbGwgKG5vdCBuZWVkZWQgYnV0IHdlIHRyeSB0byBiZSBmdW5ueSkuXG4gICAgICAgIGlmICh0aWxlLmlzV2FsbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGh1cnQgaXRzIGhhbmQgYXR0YWNraW5nIGEgd2FsbCBvbiB0aWxlICR7dGlsZX0uYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHRoZSB1bml0IGlzIGF0dGFja2luZyBhIHVuaXQuXG4gICAgICAgIGlmICh0aWxlLnVuaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGF0dGFja2luZyAke3RpbGV9IHRoYXQgZG9lc24ndCBoYXZlIGEgdW5pdC5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB5b3UgYXJlbid0IGF0dGFja2luZyBhIGZyaWVuZC5cbiAgICAgICAgaWYgKHRpbGUudW5pdC5vd25lciA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgdHJ5aW5nIHRvIGF0dGFjayB0aGUgYWxseTogJHt0aWxlLnVuaXR9IG9uIHRpbGUgJHt0aWxlfWA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSGFuZGxlIHBvc3NpYmxlIHVuaXQgaW52YWxpZGF0aW9ucyBoZXJlOlxuICAgICAgICBpZiAodGhpcy5vd25lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgYXR0YWNraW5nIGEgdW5pdCB0aGF0IGhhcyBubyBvd25lci4gUmVwb3J0IHRoaXMgdG8gdGhlIGdhbWUgRGV2cy4gVGhpcyBpcyAxMDAlIGEgYnVnYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaGFzIGEgam9iLlxuICAgICAgICBpZiAodGhpcy5qb2IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGRvZXNuJ3QgaGF2ZSBhIGpvYi4gVGhhdCBzaG91bGRuJ3QgYmUgcG9zc2libGUuYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaGFzbid0IG1vdmVkLlxuICAgICAgICBpZiAodGhpcy5tb3ZlcyA8IHRoaXMuam9iLm1vdmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIGFscmVhZHkgbW92ZWQgdGhpcyB0dXJuIGFuZCBjYW5ub3QgYXR0YWNrYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0YWNrcyBhIHVuaXQgb24gYW4gYWRqYWNlbnQgdGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBhdHRhY2suXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYXR0YWNrZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYXR0YWNrKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dGFjayAtLT4+XG5cbiAgICAgICAgLy8gV3JpdGUgbG9naWMgaGVyZVxuICAgICAgICBpZiAodGlsZS51bml0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuaXQgb24gdGlsZSBpcyB1bmRlZmluZWQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRpbGUudW5pdC5oZWFsdGggPSB0aWxlLnVuaXQuaGVhbHRoIC0gdGhpcy5qb2IuZGFtYWdlO1xuICAgICAgICB0aWxlLnVuaXQuYXR0YWNrZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGlsZS51bml0LmhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICB0aWxlLmJsdWVpdW0gKz0gdGlsZS51bml0LmJsdWVpdW07XG4gICAgICAgICAgICB0aWxlLnJlZGl1bSArPSB0aWxlLnVuaXQucmVkaXVtO1xuICAgICAgICAgICAgdGlsZS5ibHVlaXVtT3JlICs9IHRpbGUudW5pdC5ibHVlaXVtT3JlO1xuICAgICAgICAgICAgdGlsZS5yZWRpdW1PcmUgKz0gdGlsZS51bml0LnJlZGl1bU9yZTtcbiAgICAgICAgICAgIHRpbGUudW5pdC5oZWFsdGggPSAwOyAvLyBzZXQgdW5pdCdzIGhlYWx0aCB0byB6ZXJvLlxuICAgICAgICAgICAgdGlsZS51bml0LnRpbGUgPSB1bmRlZmluZWQ7IC8vIHVubGluayBkZWFkIHVuaXQuXG4gICAgICAgICAgICB0aWxlLnVuaXQgPSB1bmRlZmluZWQ7IC8vIFVubGluayB0aWxlLlxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWN0ZWQgPSB0cnVlOyAvLyB1bml0IGhhcyBhY3RlZFxuXG4gICAgICAgIHJldHVybiB0cnVlOyAvLyByZXR1cm4gdHJ1ZSBieSBkZWZhdWx0XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgZHJvcC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSB0aWxlIHRoZSBtYXRlcmlhbHMgd2lsbCBiZSBkcm9wcGVkIG9uLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyB0byBkcm9wcGVkLiBBbW91bnRzIDw9IDAgd2lsbFxuICAgICAqIGRyb3AgYWxsIHRoZSBtYXRlcmlhbHMuXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIC0gVGhlIG1hdGVyaWFsIHRoZSB1bml0IHdpbGwgZHJvcC4gJ3JlZGl1bScsICdibHVlaXVtJyxcbiAgICAgKiAncmVkaXVtIG9yZScsIG9yICdibHVlaXVtIG9yZScuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlRHJvcChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIGFtb3VudDogbnVtYmVyLFxuICAgICAgICBtYXRlcmlhbDogXCJyZWRpdW0gb3JlXCIgfCBcInJlZGl1bVwiIHwgXCJibHVlaXVtXCIgfCBcImJsdWVpdW0gb3JlXCIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0RHJvcEFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWRyb3AgLS0+PlxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCBmYWxzZSk7XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIGEgcmVhc29uLCByZXR1cm4gaXQuXG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlcmUgaXNuJ3QgYSB3YWxsIHRoZXJlLlxuICAgICAgICBpZiAodGlsZS5pc1dhbGwpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4ndCBwbGFjZSBzdHVmZiBvbiBhIHdhbGwgb24gdGlsZSAke3RpbGV9LmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB0YXJnZXQgdGlsZSBleGlzdHMuXG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHRyeWluZyB0byBwcm92ZSBmbGF0IGVhcnRoZXJzIGNvcnJlY3QuIFRhcmdldCBUaWxlIGRvZXNuJ3QgZXhpc3QuYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgaXQgaXMgc2VsZWN0aW5nIGEgYWRqYWNlbnQgdGlsZS5cbiAgICAgICAgaWYgKHRpbGUgIT09IHRoaXMudGlsZSAmJiB0aGlzLnRpbGUgIT09IHRpbGUudGlsZUVhc3QgJiYgdGhpcy50aWxlICE9PSB0aWxlLnRpbGVTb3V0aCAmJlxuICAgICAgICAgICAgdGhpcy50aWxlICE9PSB0aWxlLnRpbGVXZXN0ICYmIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlTm9ydGgpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4gb25seSBkcm9wIHRoaW5ncyBvbiBhZGphY2VudCB0aWxlcyBvciBpdCdzIHRpbGUuIFRhcmdldCB0aWxlICR7dGlsZX0gaXMgdG9vIGZhciBhd2F5LmA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWRyb3AgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyb3BzIG1hdGVyaWFscyBhdCB0aGUgdW5pdHMgZmVldCBvciBhZGphY2VudCB0aWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSB0aWxlIHRoZSBtYXRlcmlhbHMgd2lsbCBiZSBkcm9wcGVkIG9uLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyB0byBkcm9wcGVkLiBBbW91bnRzIDw9IDAgd2lsbFxuICAgICAqIGRyb3AgYWxsIHRoZSBtYXRlcmlhbHMuXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIC0gVGhlIG1hdGVyaWFsIHRoZSB1bml0IHdpbGwgZHJvcC4gJ3JlZGl1bScsICdibHVlaXVtJyxcbiAgICAgKiAncmVkaXVtIG9yZScsIG9yICdibHVlaXVtIG9yZScuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgZGVwb3NpdGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGRyb3AoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICAgICBhbW91bnQ6IG51bWJlcixcbiAgICAgICAgbWF0ZXJpYWw6IFwicmVkaXVtIG9yZVwiIHwgXCJyZWRpdW1cIiB8IFwiYmx1ZWl1bVwiIHwgXCJibHVlaXVtIG9yZVwiLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBkcm9wIC0tPj5cbiAgICAgICAgY29uc3QgbWVtYmVyTmFtZSA9IG1hdGVyaWFsTmFtZVRvVmFyaWFibGVOYW1lKG1hdGVyaWFsKTtcbiAgICAgICAgY29uc3QgYW10ID0gTWF0aC5taW4odGhpc1ttZW1iZXJOYW1lXSwgYW1vdW50KTtcblxuICAgICAgICAvLyBJZiBhbW91bnQgPD0gMCwgdGhlIHVuaXQgd2lsbCBkcm9wIGFsbCByZXNvdXJjZXMuXG4gICAgICAgIGlmIChhbW91bnQgPD0gMCkge1xuICAgICAgICAgICAgdGlsZS5ibHVlaXVtICs9IHRoaXMuYmx1ZWl1bTtcbiAgICAgICAgICAgIHRpbGUuYmx1ZWl1bU9yZSArPSB0aGlzLmJsdWVpdW1PcmU7XG4gICAgICAgICAgICB0aWxlLnJlZGl1bSArPSB0aGlzLnJlZGl1bTtcbiAgICAgICAgICAgIHRpbGUucmVkaXVtT3JlICs9IHRoaXMucmVkaXVtT3JlO1xuICAgICAgICAgICAgdGhpcy5ibHVlaXVtID0gdGhpcy5yZWRpdW0gPSB0aGlzLmJsdWVpdW1PcmUgPSB0aGlzLnJlZGl1bU9yZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aWxlW21lbWJlck5hbWVdICs9IGFtdDtcbiAgICAgICAgICAgIHRoaXNbbWVtYmVyTmFtZV0gLT0gYW10O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGRyb3AgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgbW92ZS4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRoaXMgVW5pdCBzaG91bGQgbW92ZSB0by5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVNb3ZlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRNb3ZlQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG5cbiAgICAgICAgLy8gY2hlY2sgd2lkZXNwcmVhZCByZWFzb25zLlxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0cnVlKTtcbiAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSByZWFzb24sIHJldHVybiBpdC5cbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgaXMgb24gdGhlIHBsYW5ldC4uLi4gd2FpdC4uLlxuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSwgZ3JhdHouIFlvdSBwcm92ZWQgZmxhdCBlYXJ0aGVycyBjb3JyZWN0LiBUYXJnZXQgdGlsZSBkb2Vzbid0IGV4aXN0LmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlIGlzbid0IGEgd2FsbCB0aGVyZS4gT3VjaC5cbiAgICAgICAgaWYgKHRpbGUuaXNXYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IHdhbGsgdGhyb3VnaCBzb2xpZCBtYXR0ZXIgb24gdGlsZSAke3RpbGV9LiBZZXQuLi4uYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHVuaXQgc3RpbGwgaGFzIG1vdmVzXG4gICAgICAgIGlmICh0aGlzLm1vdmVzIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgbW92ZSBhbnltb3JlIHRoaXMgdHVybmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlIGlzbid0IGEgbWFjaGluZSB0aGVyZS5cbiAgICAgICAgaWYgKHRpbGUubWFjaGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCB3YWxrIG92ZXIgdGhlIG1hY2hpbmUgb24gdGlsZSAke3RpbGV9LiBJdCBpcyBleHBlbnNpdmUuYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRpbGUgaXNuJ3Qgb2N1cHBpZWQuXG4gICAgICAgIGlmICh0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3Qgd2FsayB0aHJvdWdoIHRoZSB1bml0IG9uIHRpbGUgJHt0aWxlfS4gWWV0Li4uLi5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdGlsZSBpcyBuZXh0IHRvIHRoZSB1bml0LlxuICAgICAgICBpZiAodGhpcy50aWxlICE9PSB0aWxlLnRpbGVFYXN0ICYmIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlU291dGggJiZcbiAgICAgICAgICAgIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlV2VzdCAmJiB0aGlzLnRpbGUgIT09IHRpbGUudGlsZU5vcnRoKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuIG9ubHkgdHJhdmVsIHRvIGFuIGFkamFjZW50IHRpbGUuIFRpbGUgJHt0aWxlfSB0b28gZmFyIGF3YXkuYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhleSBhcmVuJ3QgZW50ZXJpbmcgYSBzcGF3biBhcmVhLlxuICAgICAgICBpZiAodGlsZS50eXBlID09PSBcInNwYXduXCIgJiYgdGhpcy5vd25lciAhPT0gdGlsZS5vd25lcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGVudGVyaW5nIGEgaW52YWxpZCB0aWxlLiBVbml0cyBjYW5ub3QgZW50ZXIgb3Bwb25lbnRzIHNwYXduIGFyZWEuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3IgbW92ZSBoZXJlIGFuZCB0cnkgdG9cbiAgICAgICAgLy8gcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IHRoZSBpbnB1dCBpcyB3cm9uZy5cbiAgICAgICAgLy8gSWYgeW91IG5lZWQgdG8gY2hhbmdlIGFuIGFyZ3VtZW50IGZvciB0aGUgcmVhbCBmdW5jdGlvbiwgdGhlblxuICAgICAgICAvLyBjaGFuZ2luZyBpdHMgdmFsdWUgaW4gdGhpcyBzY29wZSBpcyBlbm91Z2guXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZXMgdGhpcyBVbml0IGZyb20gaXRzIGN1cnJlbnQgVGlsZSB0byBhbiBhZGphY2VudCBUaWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRoaXMgVW5pdCBzaG91bGQgbW92ZSB0by5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIGl0IG1vdmVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIG1vdmUocGxheWVyOiBQbGF5ZXIsIHRpbGU6IFRpbGUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbW92ZSAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIG1vdmUuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gaGFzIG5vIFRpbGUgdG8gbW92ZSBmcm9tIWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuICAgICAgICB0aWxlLnVuaXQgPSB0aGlzO1xuICAgICAgICB0aGlzLm1vdmVzIC09IDE7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgcGlja3VwLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIHRpbGUgdGhlIG1hdGVyaWFscyB3aWxsIGJlIHBpY2tlZCB1cCBmcm9tLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIG1hdGVyaWFscyB0byBwaWNrIHVwLiBBbW91bnRzIDw9IDAgd2lsbFxuICAgICAqIHBpY2sgdXAgYWxsIHRoZSBtYXRlcmlhbHMgdGhhdCB0aGUgdW5pdCBjYW4uXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIC0gVGhlIG1hdGVyaWFsIHRoZSB1bml0IHdpbGwgcGljayB1cC4gJ3JlZGl1bScsXG4gICAgICogJ2JsdWVpdW0nLCAncmVkaXVtIG9yZScsIG9yICdibHVlaXVtIG9yZScuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlUGlja3VwKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgYW1vdW50OiBudW1iZXIsXG4gICAgICAgIG1hdGVyaWFsOiBcInJlZGl1bSBvcmVcIiB8IFwicmVkaXVtXCIgfCBcImJsdWVpdW1cIiB8IFwiYmx1ZWl1bSBvcmVcIixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRQaWNrdXBBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1waWNrdXAgLS0+PlxuXG4gICAgICAgIC8vIENoZWNrIGFsbCB0aGUgYXJndW1lbnRzIGZvciBwaWNrdXAgaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIGNoZWNrIGNvbW1vbiBpbnZhbGlkYXRlcy5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgZmFsc2UpO1xuICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHJlYXNvbiwgcmVwb3J0IGl0LlxuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdGFyZ2V0IHRpbGUgZXhpc3RzLlxuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4gb25seSBwaWNrIHRoaW5ncyB1cCBvZmYgdGlsZXMgdGhhdCBleGlzdGA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB0aWxlIGlzIGFkamFjZW50IHRvIHRoZSBjdXJyZW50IHRpbGUsIG9yIGl0cyB0aWxlLlxuICAgICAgICBpZiAodGlsZSAhPT0gdGhpcy50aWxlICYmIHRoaXMudGlsZSAhPT0gdGlsZS50aWxlRWFzdCAmJiB0aGlzLnRpbGUgIT09IHRpbGUudGlsZVNvdXRoICYmXG4gICAgICAgICAgICB0aGlzLnRpbGUgIT09IHRpbGUudGlsZVdlc3QgJiYgdGhpcy50aWxlICE9PSB0aWxlLnRpbGVOb3J0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbiBvbmx5IGRyb3AgdGhpbmdzIG9uIGFkamFjZW50IHRpbGVzIG9yIGl0J3MgdGlsZS4gVGFyZ2V0IHRpbGUgJHt0aWxlfSBpcyB0b28gZmFyIGF3YXkuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRyYWNrcyB0aGUgbWF0ZXJpYWwgdG8gYmUgcGlja2VkIHVwLlxuICAgICAgICBsZXQgdG90YWxNYXRlcmlhbE9uVGlsZSA9IDA7XG5cbiAgICAgICAgLy8gc2V0cyB1cCB0aGUgYW1vdW50IG9mIG1hdGVyaWFsLlxuICAgICAgICBzd2l0Y2ggKG1hdGVyaWFsKSB7XG4gICAgICAgICAgICBjYXNlIFwicmVkaXVtIG9yZVwiOiB7XG4gICAgICAgICAgICAgICAgdG90YWxNYXRlcmlhbE9uVGlsZSA9IHRpbGUucmVkaXVtT3JlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmpvYi50aXRsZSA9PT0gXCJtYW5hZ2VyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBwaWNrIHVwIG9yZSFgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJyZWRpdW1cIjoge1xuICAgICAgICAgICAgICAgIHRvdGFsTWF0ZXJpYWxPblRpbGUgPSB0aWxlLnJlZGl1bTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgPT09IFwiaW50ZXJuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCBwaWNrIHVwIHJlZmluZWQgb3JlIWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcImJsdWVpdW1cIjoge1xuICAgICAgICAgICAgICAgIHRvdGFsTWF0ZXJpYWxPblRpbGUgPSB0aWxlLmJsdWVpdW07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuam9iLnRpdGxlID09PSBcImludGVyblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgcGljayB1cCByZWZpbmVkIG9yZSFgO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgXCJibHVlaXVtIG9yZVwiOiB7XG4gICAgICAgICAgICAgICAgdG90YWxNYXRlcmlhbE9uVGlsZSA9IHRpbGUuYmx1ZWl1bU9yZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5qb2IudGl0bGUgPT09IFwibWFuYWdlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgcGljayB1cCBvcmUhYDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhY3R1YWxBbW91bnQgPSBhbW91bnQgPD0gMFxuICAgICAgICAgICAgPyB0b3RhbE1hdGVyaWFsT25UaWxlXG4gICAgICAgICAgICA6IE1hdGgubWluKHRvdGFsTWF0ZXJpYWxPblRpbGUsIGFtb3VudCk7XG5cbiAgICAgICAgLy8gQW1vdW50IG9mIG1hdGVyaWFscyB0aGUgdW5pdCBpcyBjdXJyZW50bHkgY2FycnlpbmdcbiAgICAgICAgY29uc3QgY3VycmVudExvYWQgPSB0aGlzLnJlZGl1bU9yZSArIHRoaXMucmVkaXVtICsgdGhpcy5ibHVlaXVtICsgdGhpcy5ibHVlaXVtT3JlO1xuICAgICAgICAvLyBpZiB0aGUgdW5pdCBjYW4ndCBjYXJyeSBhbnltb3JlLlxuICAgICAgICBpZiAoY3VycmVudExvYWQgPT09IHRoaXMuam9iLmNhcnJ5TGltaXQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBhbHJlYWR5IGNhcnJ5aW5nIGFzIG1hbnkgcmVzb3VyY2VzIGFzIGl0IGNhbi5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vdGhpbmcgdG8gcGlja3VwLlxuICAgICAgICBpZiAoYWN0dWFsQW1vdW50IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhlcmUgYXJlIG5vIHJlc291cmNlcyBvbiAke3RpbGV9IGZvciAke3RoaXN9IHRvIHBpY2t1cC5gO1xuICAgICAgICB9XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXBpY2t1cCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGlja3MgdXAgbWF0ZXJpYWwgYXQgdGhlIHVuaXRzIGZlZXQgb3IgYWRqYWNlbnQgdGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgdGlsZSB0aGUgbWF0ZXJpYWxzIHdpbGwgYmUgcGlja2VkIHVwIGZyb20uXG4gICAgICogQHBhcmFtIGFtb3VudCAtIFRoZSBhbW91bnQgb2YgbWF0ZXJpYWxzIHRvIHBpY2sgdXAuIEFtb3VudHMgPD0gMCB3aWxsXG4gICAgICogcGljayB1cCBhbGwgdGhlIG1hdGVyaWFscyB0aGF0IHRoZSB1bml0IGNhbi5cbiAgICAgKiBAcGFyYW0gbWF0ZXJpYWwgLSBUaGUgbWF0ZXJpYWwgdGhlIHVuaXQgd2lsbCBwaWNrIHVwLiAncmVkaXVtJyxcbiAgICAgKiAnYmx1ZWl1bScsICdyZWRpdW0gb3JlJywgb3IgJ2JsdWVpdW0gb3JlJy5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBkZXBvc2l0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgcGlja3VwKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgYW1vdW50OiBudW1iZXIsXG4gICAgICAgIG1hdGVyaWFsOiBcInJlZGl1bSBvcmVcIiB8IFwicmVkaXVtXCIgfCBcImJsdWVpdW1cIiB8IFwiYmx1ZWl1bSBvcmVcIixcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcGlja3VwIC0tPj5cbiAgICAgICAgY29uc3QgbWVtYmVyTmFtZSA9IG1hdGVyaWFsTmFtZVRvVmFyaWFibGVOYW1lKG1hdGVyaWFsKTtcbiAgICAgICAgY29uc3QgdG90YWxNYXRlcmlhbE9uVGlsZSA9IHRpbGVbbWVtYmVyTmFtZV07XG5cbiAgICAgICAgbGV0IGFjdHVhbEFtb3VudCA9IGFtb3VudCA8PSAwXG4gICAgICAgICAgICA/IHRvdGFsTWF0ZXJpYWxPblRpbGVcbiAgICAgICAgICAgIDogTWF0aC5taW4odG90YWxNYXRlcmlhbE9uVGlsZSwgYW1vdW50KTtcbiAgICAgICAgY29uc3QgY3VycmVudExvYWQgPSB0aGlzLnJlZGl1bU9yZSArIHRoaXMucmVkaXVtICsgdGhpcy5ibHVlaXVtICsgdGhpcy5ibHVlaXVtT3JlO1xuXG4gICAgICAgIGFjdHVhbEFtb3VudCA9IE1hdGgubWluKGFjdHVhbEFtb3VudCwgdGhpcy5qb2IuY2FycnlMaW1pdCAtIGN1cnJlbnRMb2FkKTtcblxuICAgICAgICB0aWxlW21lbWJlck5hbWVdIC09IGFjdHVhbEFtb3VudDtcbiAgICAgICAgdGhpc1ttZW1iZXJOYW1lXSArPSBhY3R1YWxBbW91bnQ7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHBpY2t1cCAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIFRyaWVzIHRvIGludmFsaWRhdGUgYXJncyBmb3IgYW4gYWN0aW9uIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gdGhlIHBsYXllciBjb21tYW5kaW5nIHRoaXMgVW5pdFxuICAgICAqIEBwYXJhbSBjaGVja0FjdGlvbiAtIHRydWUgdG8gY2hlY2sgaWYgdGhpcyBVbml0IGhhcyBhbiBhY3Rpb25cbiAgICAgKiBAcmV0dXJucyBUaGUgcmVhc29uIHRoaXMgaXMgaW52YWxpZCwgdW5kZWZpbmVkIGlmIGxvb2tzIHZhbGlkIHNvIGZhci5cbiAgICAgKi9cbiAgICBwcml2YXRlIGludmFsaWRhdGUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBjaGVja0FjdGlvbjogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghcGxheWVyIHx8IHBsYXllciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgSXQgaXNuJ3QgeW91ciB0dXJuLCAke3BsYXllcn0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIgfHwgdGhpcy5vd25lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXNuJ3Qgb3duZWQgYnkgeW91LmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1bml0IGhhc24ndCBhY3RlZC5cbiAgICAgICAgaWYgKGNoZWNrQWN0aW9uICYmIHRoaXMuYWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBoYXMgYWxyZWFkeSBhY3RlZCB0aGlzIHR1cm4uIE9yIG5vdCBlbm91Z2ggY29mZmVlYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBtYWtlIHN1cmUgdGhlIHVuaXQgY2FuIGZ1bmN0aW9uXG4gICAgICAgIGlmICh0aGlzLnN0dW5UaW1lID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIHN0dW5uZWQgYW5kIGNhbm5vdCBtb3ZlLmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1bml0IGlzIGFsaXZlLlxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGlzIGRlYWQsIHByb2JhYmx5IGZ1ZWwgdG9vLmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB1bml0IGlzIG9uIGEgdGlsZS5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkZWFkIGFuZCBjYW5ub3QgZG8gdGhpbmdzIGZyb20gdGhlIGFmdGVybGlmZS5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkIG9yIHBpcmF0ZSBtZXRob2RzIGNhbiBnbyBoZXJlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=