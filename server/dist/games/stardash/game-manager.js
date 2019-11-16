"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Stardash Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class StardashGameManager extends _1.BaseClasses.GameManager {
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-23-StarDash",
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
        // TODO: HANDLE COLLISION ID FOR UNITS. MAKE A DICTIONARY CONNECTED TO HANDLE COLLISION DAMAGE
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
        // kill units. (handle collisions.)
        this.updateArrays();
        // handle dashes
        this.updateUnits();
        // make asteroids orbit
        this.updateOrbit();
        // recharge the players homeworlds.
        this.game.players[0].homeBase.amount += this.game.regenerateRate;
        this.game.players[1].homeBase.amount += this.game.regenerateRate;
        // updates ships.
        this.manageShip();
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
        // Add logic here checking for the primary win condition(s)
        if (this.game.players[0].victoryPoints === (this.game.mythiciteAmount - this.game.lostMythicite) / 2 &&
            this.game.players[1].victoryPoints === (this.game.mythiciteAmount - this.game.lostMythicite) / 2) {
            // check secondary conditions.
            this.secondaryWinConditions("Both players have half of the mythicite.");
            // return that a win result was found.
            return true;
        }
        else if (this.game.players[0].victoryPoints > ((this.game.mythiciteAmount - this.game.lostMythicite) / 2)) {
            // declare the winner!
            this.declareWinner("You got the most mythicite!", this.game.players[0]);
            this.declareLosers("Your opponent got the most mythicite.", this.game.players[1]);
            // return that a win result was found.
            return true;
        }
        else if (this.game.players[1].victoryPoints > ((this.game.mythiciteAmount - this.game.lostMythicite) / 2)) {
            // declare the winner!
            this.declareWinner("You got the most mythicite!", this.game.players[1]);
            this.declareLosers("Your opponent got the most mythicite.", this.game.players[0]);
            // return that a win result was found.
            return true;
        }
        else if (this.game.players[0].money < 75 && this.game.players[0].units.length === 0) {
            // declare the winner!
            this.declareWinner("You bankrupted your opponent.", this.game.players[1]);
            this.declareLosers("You have no cash and no assets.", this.game.players[0]);
            // return that a win result was found.
            return true;
        }
        else if (this.game.players[1].money < 75 && this.game.players[1].units.length === 0) {
            // declare the winner!
            this.declareWinner("You bankrupted your opponent.", this.game.players[0]);
            this.declareLosers("You have no cash and no assets.", this.game.players[1]);
            // return that a win result was found.
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
        // Add logic here for the secondary win conditions
        // set up trackers for each players value.
        if (this.game.players[0].victoryPoints > this.game.players[1].victoryPoints) {
            // declare the winner!
            this.declareWinner("You got the most mythicite!", this.game.players[0]);
            this.declareLosers("Your opponent got the most mythicite.", this.game.players[1]);
            // return that a win result was found.
            return;
        }
        else if (this.game.players[1].victoryPoints > this.game.players[0].victoryPoints) {
            // declare the winner!
            this.declareWinner("You got the most mythicite!", this.game.players[1]);
            this.declareLosers("Your opponent got the most mythicite.", this.game.players[0]);
            // return that a win result was found.
            return;
        }
        let player0Value = this.game.players[0].money;
        let player0Mat = 0;
        let player1Value = this.game.players[1].money;
        let player1Mat = 0;
        // add up the value of player 0.
        for (const unit of this.game.players[0].units) {
            player0Value += unit.job.unitCost;
            player0Mat += unit.genarium * this.game.genariumValue +
                unit.rarium * this.game.rariumValue +
                unit.legendarium * this.game.legendariumValue;
        }
        // add up the value of player 1.
        for (const unit of this.game.players[1].units) {
            player1Value += unit.job.unitCost;
            player1Mat += unit.genarium * this.game.genariumValue +
                unit.rarium * this.game.rariumValue +
                unit.legendarium * this.game.legendariumValue;
        }
        if (player0Value > player1Value) {
            // declare the winners!
            this.declareWinner(`${reason}: You were worth more than your opponent. `, this.game.players[0]);
            this.declareLosers(`${reason}: You were worth less than your opponent.`, this.game.players[1]);
            // exit the secondary win condition handler.
            return;
        }
        else if (player0Value < player1Value) {
            // declare the winners!
            this.declareWinner(`${reason}: You were worth more than your opponent. `, this.game.players[1]);
            this.declareLosers(`${reason}: You were worth less than your opponent`, this.game.players[0]);
            // exit the secondary win condition handler.
            return;
        }
        else if (player0Mat > player1Mat) {
            // declare the winners!
            this.declareWinner(`${reason}: You were worth more than your opponent. `, this.game.players[0]);
            this.declareLosers(`${reason}: You were worth less than your opponent`, this.game.players[1]);
            // exit the secondary win condition handler.
            return;
        }
        else if (player0Mat < player1Mat) {
            // declare the winners!
            this.declareWinner(`${reason}: You were worth more than your opponent. `, this.game.players[1]);
            this.declareLosers(`${reason}: You were worth less than your opponent`, this.game.players[0]);
            // exit the secondary win condition handler.
            return;
        }
        // <<-- /Creer-Merge: secondary-win-conditions -->>
        // This will end the game.
        // If no winner it determined above, then a random one will be chosen.
        super.secondaryWinConditions(reason);
    }
    // <<-- Creer-Merge: protected-private-methods -->>
    // any additional protected/private methods you need can be added here
    /**
     * Game-Manager update units.
     * This goes into the after turn function.
     * Makes the ships of the next player conclude their dashing, and resets
     * their information. Update martyr protections.
     */
    updateUnits() {
        // only move the next player's units.
        if (this.game.currentPlayer === this.game.players[0]) {
            // iterate over each unit to check the dashing status.
            for (const unit of this.game.players[0].units) {
                // set the protector to undefined as units have moved.
                unit.protector = undefined;
                // make it so the unit can act again
                unit.acted = false;
                // check if the unit is dashing.
                if (unit.isBusy) {
                    // update it's location and conditions.
                    unit.x = unit.dashX;
                    unit.dashX = -1000;
                    unit.y = unit.dashY;
                    unit.dashY = -1000;
                    unit.isBusy = false;
                }
                // resets the units moves.
                unit.moves = unit.job.moves;
            }
        }
        else {
            // iterate over each unit to check the dashing status.
            for (const unit of this.game.players[1].units) {
                // set the protector to undefined as units have moved.
                unit.protector = undefined;
                // make it so the unit can act again
                unit.acted = false;
                // check if the unit is dashing.
                if (unit.isBusy) {
                    // update it's location and conditions.
                    unit.x = unit.dashX;
                    unit.dashX = -1000;
                    unit.y = unit.dashY;
                    unit.dashY = -1000;
                    unit.isBusy = false;
                }
                // resets the units moves.
                unit.moves = unit.job.moves;
            }
        }
        // recharges player 0's home base.
        this.game.players[0].homeBase.amount += this.game.planetRechargeRate;
        // makes sure it stays below the energy cap.
        if (this.game.players[0].homeBase.amount > this.game.planetEnergyCap) {
            this.game.players[0].homeBase.amount = this.game.planetEnergyCap;
        }
        // recharges player 1's home base.
        this.game.players[1].homeBase.amount += this.game.planetRechargeRate;
        // makes sure it stays below the energy cap.
        if (this.game.players[1].homeBase.amount > this.game.planetEnergyCap) {
            this.game.players[1].homeBase.amount = this.game.planetEnergyCap;
        }
        // for each player, update martyr protection.
        this.updateMartyr(0);
        this.updateMartyr(1);
        // safety return.
        return;
    }
    /**
     * Update martyr protections.
     * This will take in the player to update protections for and update the
     * martyr protections for all of their units.
     * @param player: the player to be updated.
     */
    updateMartyr(player) {
        // all martyr ships owned by the player that can protect.
        const martyrs = this.game.players[player].units.filter((u) => u.job.title === "martyr");
        // all units owned by the player that need to be guarded.
        const units = this.game.players[player].units.filter((u) => u.protector === undefined && u.shield <= 0);
        // iterate over martyr that can protect.
        for (const martyr of martyrs) {
            // regen martyr shields.
            martyr.shield += this.game.jobs[1].damage;
            // keep it under the cap.
            if (martyr.job.shield < martyr.shield) {
                martyr.shield = martyr.job.shield;
            }
            // iterate over every unprotected unit.
            for (const unit of units) {
                // if the unit isn't protected and is in range.
                if (Math.sqrt(((unit.x - martyr.x) ** 2) +
                    ((unit.y - martyr.y) ** 2)) < martyr.job.range) {
                    // protected.
                    unit.protector = martyr;
                }
            }
            // make the martyr protect it's self
            martyr.protector = martyr;
        }
    }
    /**
     * Game-Manager Materials
     * This goes into the after turn function
     * Make planets pull materials off of ships and convert them into cash and
     * VP points. Regardless of owner if it is in range.
     */
    manageShip() {
        // grab bases for easy reference.
        const baseA = this.game.players[0].homeBase;
        const baseB = this.game.players[1].homeBase;
        // iterate over every unit.
        for (const unit of this.game.units) {
            // if they are in the range of the player0 planet.
            if (Math.sqrt(((unit.x - baseA.x) ** 2) + ((unit.y - baseA.y) ** 2)) <= baseA.radius) {
                // grab all valued materials and convert them to cash. Not Josh.
                this.game.players[0].money += unit.genarium * this.game.genariumValue
                    + unit.rarium * this.game.rariumValue +
                    unit.legendarium * this.game.legendariumValue;
                // grab all vp materials.
                this.game.players[0].victoryPoints += unit.mythicite;
                // erase all materials on the unit.
                unit.genarium = 0;
                unit.rarium = 0;
                unit.legendarium = 0;
                unit.mythicite = 0;
                // thank them if they are the enemy
                if (unit.owner !== baseA.owner) {
                    // tslint:disable-next-line: no-console
                    console.log("Thank you for the donation.");
                }
                // if it is a friendly ship, recharge it.
                if (unit.owner === baseA.owner) {
                    const dif = unit.job.energy - unit.energy;
                    if (dif < baseA.amount) {
                        unit.energy = unit.job.energy;
                        baseA.amount -= dif;
                    }
                }
            }
            // if they are in the range of the player1 planet.
            if (Math.sqrt(((unit.x - baseB.x) ** 2) + ((unit.y - baseB.y) ** 2)) <= baseB.radius) {
                // grab all valued materials and convert them to cash. Not Josh.
                this.game.players[1].money += unit.genarium * this.game.genariumValue
                    + unit.rarium * this.game.rariumValue +
                    unit.legendarium * this.game.legendariumValue;
                // grab all vp materials.
                this.game.players[1].victoryPoints += unit.mythicite;
                // erase all materials on the unit.
                unit.genarium = 0;
                unit.rarium = 0;
                unit.legendarium = 0;
                unit.mythicite = 0;
                // if it is a friendly ship, recharge it.
                if (unit.owner === baseB.owner) {
                    const dif = unit.job.energy - unit.energy + unit.job.shield - unit.shield;
                    if (dif < baseB.amount) {
                        unit.energy = unit.job.energy;
                        unit.shield = unit.job.shield;
                        baseB.amount -= dif;
                    }
                }
            }
        }
        // safety return.
        return;
    }
    /** Updates all arrays in the game with new/dead game objects */
    updateArrays() {
        // the sun
        const sun = this.game.bodies[2];
        // iterate over all projectiles in the game.
        for (const mis of this.game.projectiles) {
            // make sure we are only updating the last players missiles
            if (mis.owner !== this.game.currentPlayer) {
                continue;
            }
            if (mis.target === null || mis.target === undefined || mis.target.x < 0 || mis.target.y < 0) {
                mis.x = -100;
                mis.y = -100;
                continue;
            }
            // grab the distance between the projectile and it's target
            const distance = Math.sqrt(((mis.x - mis.target.x) ** 2) + ((mis.y - mis.target.y) ** 2));
            // grab the x difference between the projectile and it's target.
            const difX = Math.abs(mis.x - mis.target.x);
            // as long as the projectile isn't ontop of the target.
            if (distance !== 0) {
                // grab the angle difference between the target and the missile.
                const angle = Math.acos(difX / distance);
                // set the travel distance
                const trav = Math.min(this.game.projectileSpeed, distance);
                // grab the change in x and y it can achieve.
                const moveX = Math.abs(trav * Math.cos(angle));
                const moveY = Math.abs(trav * Math.sin(angle));
                // if the target is to the left, move left.
                if (mis.x > mis.target.x) {
                    mis.x -= moveX;
                }
                // otherwise move right.
                else {
                    mis.x += moveX;
                }
                // if the target is below, move down.
                if (mis.y > mis.target.y) {
                    mis.y -= moveY;
                }
                // otherwise move up.
                else {
                    mis.y += moveY;
                }
                // decrease the missiles fuel appropriately.
                mis.fuel -= Math.sqrt(((moveX) ** 2) + ((moveY) ** 2));
            }
            // if it is colliding with the target.
            if (Math.sqrt(((mis.x - mis.target.x) ** 2) + ((mis.y - mis.target.y) ** 2)) <
                (this.game.projectileRadius + this.game.shipRadius)) {
                // kill the missile and the target.
                mis.x = -1;
                mis.y = -1;
                mis.fuel = -1;
                mis.target.x = -1;
                mis.target.y = -1;
                mis.target.energy = -1;
            }
        }
        // Properly remove all killed units and ones that collide with the sun.
        const deadUnits = this.game.units.filter((u) => u.x < 0 || u.y < 0 || u.energy < 0 ||
            Math.sqrt(((sun.x - u.x) ** 2) + ((sun.y - u.y) ** 2)) < sun.radius + this.game.shipRadius);
        // Properly remove all killed units and ones that collide with the sun.
        const deadProj = this.game.projectiles.filter((u) => u.x < 0 || u.y < 0 || u.fuel < 0 || u.target.x < 0 ||
            Math.sqrt(((sun.x - u.x) ** 2) + ((sun.y - u.y) ** 2)) < sun.radius + this.game.projectileRadius);
        // add up destroyed mythicite.
        for (const unit of deadUnits) {
            this.game.lostMythicite += Math.abs(unit.mythicite);
        }
        // remove dead units from all player's units list
        for (const player of this.game.players) {
            utils_1.removeElements(player.units, ...deadUnits);
        }
        // and remove them from the game
        utils_1.removeElements(this.game.units, ...deadUnits);
        // remove dead projectiles from all player's units list
        for (const player of this.game.players) {
            utils_1.removeElements(player.projectiles, ...deadProj);
        }
        // and remove them from the game
        utils_1.removeElements(this.game.projectiles, ...deadProj);
    }
    /** Updates asteroids orbiting the sun. */
    updateOrbit() {
        // iterate over all bodies.
        for (const ast of this.game.bodies) {
            // skip them if they aren't a asteroid.
            if (ast.bodyType !== "asteroid") {
                continue;
            }
            // resets a asteroid's owner so other can mine it. Gives the old owner
            // a chance to continue to claim it.
            if (ast.owner !== this.game.currentPlayer) {
                ast.owner = undefined;
            }
            // if a angle exists.
            if (ast.angle >= 0) {
                // move the asteroid.
                ast.angle -= 360 / this.game.turnsToOrbit;
                if (ast.angle < 0) {
                    ast.angle += 360;
                }
                ast.x = ast.getX();
                ast.y = ast.getY();
            }
            // kill the asteroid if it is depleted.
            if (ast.amount <= 0 && this.game.regenerateRate === 0) {
                ast.x = -1;
                ast.y = -1;
            }
            else if (this.game.regenerateRate > 0) {
                ast.amount += this.game.regenerateRate;
            }
        }
        // Properly remove all killed asteroids.
        const deadBodies = this.game.bodies.filter((u) => (u.x < 0 || u.y < 0)
            && u.bodyType === "asteroid");
        // and remove them from the game
        utils_1.removeElements(this.game.bodies, ...deadBodies);
    }
}
exports.StardashGameManager = StardashGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3N0YXJkYXNoL2dhbWUtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZFQUE2RTtBQUM3RSxhQUFhO0FBQ2IseUJBQTBFO0FBRTFFLGlDQUFpQztBQUNqQyxtQ0FBeUM7QUFDekMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsY0FBVyxDQUFDLFdBQVc7SUFDNUQsaUVBQWlFO0lBQzFELE1BQU0sS0FBSyxPQUFPO1FBQ3JCLE9BQU87WUFDSCxpQ0FBaUM7WUFDakMseUJBQXlCO1NBRTVCLENBQUM7SUFDTixDQUFDO0lBUUQsd0NBQXdDO0lBRXhDLDJEQUEyRDtJQUUzRCx5Q0FBeUM7SUFFekM7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxVQUFVO1FBQ3RCLE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXpCLHFDQUFxQztRQUVyQyw4RkFBOEY7UUFFOUYsNkRBQTZEO1FBQzdELHNDQUFzQztJQUMxQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNPLEtBQUssQ0FBQyxTQUFTO1FBQ3JCLE1BQU0sS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRXhCLG9DQUFvQztRQUNwQyxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLGdCQUFnQjtRQUNoQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FB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O2FBQzFDO1NBQ0o7UUFFRCx3Q0FBd0M7UUFDeEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2VBQzNCLENBQUMsQ0FBQyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUM7UUFFdEUsZ0NBQWdDO1FBQ2hDLHNCQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBR0o7QUF4Z0JELGtEQXdnQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgd2hlcmUgeW91IHNob3VsZCBwdXQgbG9naWMgdG8gY29udHJvbCB0aGUgZ2FtZSBhbmQgZXZlcnl0aGluZ1xuLy8gYXJvdW5kIGl0LlxuaW1wb3J0IHsgQmFzZUNsYXNzZXMsIFN0YXJkYXNoR2FtZSwgU3RhcmRhc2hHYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IHJlbW92ZUVsZW1lbnRzIH0gZnJvbSBcIn4vdXRpbHNcIjtcbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBNYW5hZ2VzIHRoZSBnYW1lIGxvZ2ljIGFyb3VuZCB0aGUgU3RhcmRhc2ggR2FtZS5cbiAqIFRoaXMgaXMgd2hlcmUgeW91IGNvdWxkIGRvIGxvZ2ljIGZvciBjaGVja2luZyBpZiB0aGUgZ2FtZSBpcyBvdmVyLCB1cGRhdGVcbiAqIHRoZSBnYW1lIGJldHdlZW4gdHVybnMsIGFuZCBhbnl0aGluZyB0aGF0IHRpZXMgYWxsIHRoZSBcInN0dWZmXCIgaW4gdGhlIGdhbWVcbiAqIHRvZ2V0aGVyLlxuICovXG5leHBvcnQgY2xhc3MgU3RhcmRhc2hHYW1lTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVNYW5hZ2VyIHtcbiAgICAvKiogT3RoZXIgc3RyaW5ncyAoY2FzZSBpbnNlbnNpdGl2ZSkgdGhhdCBjYW4gYmUgdXNlZCBhcyBhbiBJRCAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IGFsaWFzZXMoKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgICAgICBcIk1lZ2FNaW5lckFJLTIzLVN0YXJEYXNoXCIsXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWxpYXNlcyAtLT4+XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgR2FtZU1hbmFnZXIgaXMgbWFuYWdpbmcgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IFN0YXJkYXNoR2FtZTtcblxuICAgIC8qKiBUaGUgZmFjdG9yeSB0aGF0IG11c3QgYmUgdXNlZCB0byBpbml0aWFsaXplIG5ldyBnYW1lIG9iamVjdHMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRlITogU3RhcmRhc2hHYW1lT2JqZWN0RmFjdG9yeTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1tZXRob2RzIC0tPj5cblxuICAgIC8vIGFueSBhZGRpdGlvbmFsIHB1YmxpYyBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBjYWxsZWQgQkVGT1JFIGVhY2ggcGxheWVyJ3MgcnVuVHVuIGZ1bmN0aW9uIGlzIGNhbGxlZFxuICAgICAqIChpbmNsdWRpbmcgdGhlIGZpcnN0IHR1cm4pLlxuICAgICAqIFRoaXMgaXMgYSBnb29kIHBsYWNlIHRvIGdldCB0aGVpciBwbGF5ZXIgcmVhZHkgZm9yIHRoZWlyIHR1cm4uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGJlZm9yZVR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHN1cGVyLmJlZm9yZVR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBiZWZvcmUtdHVybiAtLT4+XG5cbiAgICAgICAgLy8gVE9ETzogSEFORExFIENPTExJU0lPTiBJRCBGT1IgVU5JVFMuIE1BS0UgQSBESUNUSU9OQVJZIENPTk5FQ1RFRCBUTyBIQU5ETEUgQ09MTElTSU9OIERBTUFHRVxuXG4gICAgICAgIC8vIGFkZCBsb2dpYyBoZXJlIGZvciBiZWZvcmUgdGhlIGN1cnJlbnQgcGxheWVyJ3MgdHVybiBzdGFydHNcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGJlZm9yZS10dXJuIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBBRlRFUiBlYWNoIHBsYXllcidzIHR1cm4gZW5kcy4gQmVmb3JlIHRoZSB0dXJuIGNvdW50ZXJcbiAgICAgKiBpbmNyZWFzZXMuXG4gICAgICogVGhpcyBpcyBhIGdvb2QgcGxhY2UgdG8gZW5kLW9mLXR1cm4gZWZmZWN0cywgYW5kIGNsZWFuIHVwIGFycmF5cy5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYWZ0ZXJUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCBzdXBlci5hZnRlclR1cm4oKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhZnRlci10dXJuIC0tPj5cbiAgICAgICAgLy8ga2lsbCB1bml0cy4gKGhhbmRsZSBjb2xsaXNpb25zLilcbiAgICAgICAgdGhpcy51cGRhdGVBcnJheXMoKTtcbiAgICAgICAgLy8gaGFuZGxlIGRhc2hlc1xuICAgICAgICB0aGlzLnVwZGF0ZVVuaXRzKCk7XG4gICAgICAgIC8vIG1ha2UgYXN0ZXJvaWRzIG9yYml0XG4gICAgICAgIHRoaXMudXBkYXRlT3JiaXQoKTtcbiAgICAgICAgLy8gcmVjaGFyZ2UgdGhlIHBsYXllcnMgaG9tZXdvcmxkcy5cbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnNbMF0uaG9tZUJhc2UuYW1vdW50ICs9IHRoaXMuZ2FtZS5yZWdlbmVyYXRlUmF0ZTtcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnNbMV0uaG9tZUJhc2UuYW1vdW50ICs9IHRoaXMuZ2FtZS5yZWdlbmVyYXRlUmF0ZTtcbiAgICAgICAgLy8gdXBkYXRlcyBzaGlwcy5cbiAgICAgICAgdGhpcy5tYW5hZ2VTaGlwKCk7XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhZnRlci10dXJuIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlciBpbiBiZXR3ZWVuIHR1cm5zLlxuICAgICAqIFRoaXMgaXMgaW52b2tlZCBBRlRFUiBhZnRlclR1cm4oKSBpcyBjYWxsZWQsIGJ1dCBCRUZPUkUgYmVmb3JlVHVybigpXG4gICAgICogaXMgY2FsbGVkLlxuICAgICAqXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgZ2FtZSBpcyBpbmRlZWQgb3Zlciwgb3RoZXJ3aXNlIGlmIHRoZSBnYW1lXG4gICAgICogc2hvdWxkIGNvbnRpbnVlIHJldHVybiBmYWxzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpOiBib29sZWFuIHtcbiAgICAgICAgc3VwZXIucHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByaW1hcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuXG4gICAgICAgIC8vIEFkZCBsb2dpYyBoZXJlIGNoZWNraW5nIGZvciB0aGUgcHJpbWFyeSB3aW4gY29uZGl0aW9uKHMpXG4gICAgICAgIGlmICh0aGlzLmdhbWUucGxheWVyc1swXS52aWN0b3J5UG9pbnRzID09PSAodGhpcy5nYW1lLm15dGhpY2l0ZUFtb3VudCAtIHRoaXMuZ2FtZS5sb3N0TXl0aGljaXRlKSAvIDIgJiZcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLnZpY3RvcnlQb2ludHMgPT09ICh0aGlzLmdhbWUubXl0aGljaXRlQW1vdW50IC0gdGhpcy5nYW1lLmxvc3RNeXRoaWNpdGUpIC8gMikge1xuICAgICAgICAgICAgLy8gY2hlY2sgc2Vjb25kYXJ5IGNvbmRpdGlvbnMuXG4gICAgICAgICAgICB0aGlzLnNlY29uZGFyeVdpbkNvbmRpdGlvbnMoXCJCb3RoIHBsYXllcnMgaGF2ZSBoYWxmIG9mIHRoZSBteXRoaWNpdGUuXCIpO1xuXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhhdCBhIHdpbiByZXN1bHQgd2FzIGZvdW5kLlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5nYW1lLnBsYXllcnNbMF0udmljdG9yeVBvaW50cyA+ICgodGhpcy5nYW1lLm15dGhpY2l0ZUFtb3VudCAtIHRoaXMuZ2FtZS5sb3N0TXl0aGljaXRlKSAvIDIpKSB7XG4gICAgICAgICAgICAvLyBkZWNsYXJlIHRoZSB3aW5uZXIhXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJZb3UgZ290IHRoZSBtb3N0IG15dGhpY2l0ZSFcIiwgdGhpcy5nYW1lLnBsYXllcnNbMF0pO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKFwiWW91ciBvcHBvbmVudCBnb3QgdGhlIG1vc3QgbXl0aGljaXRlLlwiLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiB0aGF0IGEgd2luIHJlc3VsdCB3YXMgZm91bmQuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmdhbWUucGxheWVyc1sxXS52aWN0b3J5UG9pbnRzID4gKCh0aGlzLmdhbWUubXl0aGljaXRlQW1vdW50IC0gdGhpcy5nYW1lLmxvc3RNeXRoaWNpdGUpIC8gMikpIHtcbiAgICAgICAgICAgIC8vIGRlY2xhcmUgdGhlIHdpbm5lciFcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihcIllvdSBnb3QgdGhlIG1vc3QgbXl0aGljaXRlIVwiLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJZb3VyIG9wcG9uZW50IGdvdCB0aGUgbW9zdCBteXRoaWNpdGUuXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoYXQgYSB3aW4gcmVzdWx0IHdhcyBmb3VuZC5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLm1vbmV5IDwgNzUgJiYgdGhpcy5nYW1lLnBsYXllcnNbMF0udW5pdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBkZWNsYXJlIHRoZSB3aW5uZXIhXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJZb3UgYmFua3J1cHRlZCB5b3VyIG9wcG9uZW50LlwiLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJZb3UgaGF2ZSBubyBjYXNoIGFuZCBubyBhc3NldHMuXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoYXQgYSB3aW4gcmVzdWx0IHdhcyBmb3VuZC5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLm1vbmV5IDwgNzUgJiYgdGhpcy5nYW1lLnBsYXllcnNbMV0udW5pdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBkZWNsYXJlIHRoZSB3aW5uZXIhXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJZb3UgYmFua3J1cHRlZCB5b3VyIG9wcG9uZW50LlwiLCB0aGlzLmdhbWUucGxheWVyc1swXSk7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJZb3UgaGF2ZSBubyBjYXNoIGFuZCBubyBhc3NldHMuXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdKTtcblxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoYXQgYSB3aW4gcmVzdWx0IHdhcyBmb3VuZC5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcmltYXJ5LXdpbi1jb25kaXRpb25zIC0tPj5cblxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIElmIHdlIGdldCBoZXJlIG5vIG9uZSB3b24gb24gdGhpcyB0dXJuLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIG5lZWRzIHRvIGVuZCwgYnV0IHByaW1hcnkgZ2FtZSBlbmRpbmcgY29uZGl0aW9uc1xuICAgICAqIGFyZSBub3QgbWV0IChsaWtlIG1heCB0dXJucyByZWFjaGVkKS4gVXNlIHRoaXMgdG8gY2hlY2sgZm9yIHNlY29uZGFyeVxuICAgICAqIGdhbWUgd2luIGNvbmRpdGlvbnMgdG8gY3Jvd24gYSB3aW5uZXIuXG4gICAgICogQHBhcmFtIHJlYXNvbiBUaGUgcmVhc29uIHdoeSBhIHNlY29uZGFyeSB2aWN0b3J5IGNvbmRpdGlvbiBpcyBoYXBwZW5pbmdcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzZWNvbmRhcnktd2luLWNvbmRpdGlvbnMgLS0+PlxuICAgICAgICAvLyBBZGQgbG9naWMgaGVyZSBmb3IgdGhlIHNlY29uZGFyeSB3aW4gY29uZGl0aW9uc1xuICAgICAgICAvLyBzZXQgdXAgdHJhY2tlcnMgZm9yIGVhY2ggcGxheWVycyB2YWx1ZS5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLnZpY3RvcnlQb2ludHMgPiB0aGlzLmdhbWUucGxheWVyc1sxXS52aWN0b3J5UG9pbnRzKSB7XG4gICAgICAgICAgICAvLyBkZWNsYXJlIHRoZSB3aW5uZXIhXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoXCJZb3UgZ290IHRoZSBtb3N0IG15dGhpY2l0ZSFcIiwgdGhpcy5nYW1lLnBsYXllcnNbMF0pO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKFwiWW91ciBvcHBvbmVudCBnb3QgdGhlIG1vc3QgbXl0aGljaXRlLlwiLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiB0aGF0IGEgd2luIHJlc3VsdCB3YXMgZm91bmQuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5nYW1lLnBsYXllcnNbMV0udmljdG9yeVBvaW50cyA+IHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLnZpY3RvcnlQb2ludHMpIHtcbiAgICAgICAgICAgIC8vIGRlY2xhcmUgdGhlIHdpbm5lciFcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihcIllvdSBnb3QgdGhlIG1vc3QgbXl0aGljaXRlIVwiLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoXCJZb3VyIG9wcG9uZW50IGdvdCB0aGUgbW9zdCBteXRoaWNpdGUuXCIsIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoYXQgYSB3aW4gcmVzdWx0IHdhcyBmb3VuZC5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcGxheWVyMFZhbHVlID0gdGhpcy5nYW1lLnBsYXllcnNbMF0ubW9uZXk7XG4gICAgICAgIGxldCBwbGF5ZXIwTWF0ID0gMDtcbiAgICAgICAgbGV0IHBsYXllcjFWYWx1ZSA9IHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLm1vbmV5O1xuICAgICAgICBsZXQgcGxheWVyMU1hdCA9IDA7XG4gICAgICAgIC8vIGFkZCB1cCB0aGUgdmFsdWUgb2YgcGxheWVyIDAuXG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiB0aGlzLmdhbWUucGxheWVyc1swXS51bml0cykge1xuICAgICAgICAgICAgcGxheWVyMFZhbHVlICs9IHVuaXQuam9iLnVuaXRDb3N0O1xuICAgICAgICAgICAgcGxheWVyME1hdCArPSB1bml0LmdlbmFyaXVtICogdGhpcy5nYW1lLmdlbmFyaXVtVmFsdWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0LnJhcml1bSAqIHRoaXMuZ2FtZS5yYXJpdW1WYWx1ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXQubGVnZW5kYXJpdW0gKiB0aGlzLmdhbWUubGVnZW5kYXJpdW1WYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBhZGQgdXAgdGhlIHZhbHVlIG9mIHBsYXllciAxLlxuICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnBsYXllcnNbMV0udW5pdHMpIHtcbiAgICAgICAgICAgIHBsYXllcjFWYWx1ZSArPSB1bml0LmpvYi51bml0Q29zdDtcbiAgICAgICAgICAgIHBsYXllcjFNYXQgKz0gdW5pdC5nZW5hcml1bSAqIHRoaXMuZ2FtZS5nZW5hcml1bVZhbHVlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC5yYXJpdW0gKiB0aGlzLmdhbWUucmFyaXVtVmFsdWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0LmxlZ2VuZGFyaXVtICogdGhpcy5nYW1lLmxlZ2VuZGFyaXVtVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBsYXllcjBWYWx1ZSA+IHBsYXllcjFWYWx1ZSkge1xuICAgICAgICAgICAgLy8gZGVjbGFyZSB0aGUgd2lubmVycyFcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259OiBZb3Ugd2VyZSB3b3J0aCBtb3JlIHRoYW4geW91ciBvcHBvbmVudC4gYCwgdGhpcy5nYW1lLnBsYXllcnNbMF0pO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKGAke3JlYXNvbn06IFlvdSB3ZXJlIHdvcnRoIGxlc3MgdGhhbiB5b3VyIG9wcG9uZW50LmAsIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdKTtcblxuICAgICAgICAgICAgLy8gZXhpdCB0aGUgc2Vjb25kYXJ5IHdpbiBjb25kaXRpb24gaGFuZGxlci5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwbGF5ZXIwVmFsdWUgPCBwbGF5ZXIxVmFsdWUpIHtcbiAgICAgICAgICAgIC8vIGRlY2xhcmUgdGhlIHdpbm5lcnMhXG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVXaW5uZXIoYCR7cmVhc29ufTogWW91IHdlcmUgd29ydGggbW9yZSB0aGFuIHlvdXIgb3Bwb25lbnQuIGAsIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdKTtcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZUxvc2VycyhgJHtyZWFzb259OiBZb3Ugd2VyZSB3b3J0aCBsZXNzIHRoYW4geW91ciBvcHBvbmVudGAsIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICAgICAgLy8gZXhpdCB0aGUgc2Vjb25kYXJ5IHdpbiBjb25kaXRpb24gaGFuZGxlci5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwbGF5ZXIwTWF0ID4gcGxheWVyMU1hdCkge1xuICAgICAgICAgICAgLy8gZGVjbGFyZSB0aGUgd2lubmVycyFcbiAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcihgJHtyZWFzb259OiBZb3Ugd2VyZSB3b3J0aCBtb3JlIHRoYW4geW91ciBvcHBvbmVudC4gYCwgdGhpcy5nYW1lLnBsYXllcnNbMF0pO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKGAke3JlYXNvbn06IFlvdSB3ZXJlIHdvcnRoIGxlc3MgdGhhbiB5b3VyIG9wcG9uZW50YCwgdGhpcy5nYW1lLnBsYXllcnNbMV0pO1xuXG4gICAgICAgICAgICAvLyBleGl0IHRoZSBzZWNvbmRhcnkgd2luIGNvbmRpdGlvbiBoYW5kbGVyLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHBsYXllcjBNYXQgPCBwbGF5ZXIxTWF0KSB7XG4gICAgICAgICAgICAvLyBkZWNsYXJlIHRoZSB3aW5uZXJzIVxuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKGAke3JlYXNvbn06IFlvdSB3ZXJlIHdvcnRoIG1vcmUgdGhhbiB5b3VyIG9wcG9uZW50LiBgLCB0aGlzLmdhbWUucGxheWVyc1sxXSk7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcnMoYCR7cmVhc29ufTogWW91IHdlcmUgd29ydGggbGVzcyB0aGFuIHlvdXIgb3Bwb25lbnRgLCB0aGlzLmdhbWUucGxheWVyc1swXSk7XG5cbiAgICAgICAgICAgIC8vIGV4aXQgdGhlIHNlY29uZGFyeSB3aW4gY29uZGl0aW9uIGhhbmRsZXIuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNlY29uZGFyeS13aW4tY29uZGl0aW9ucyAtLT4+XG5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGVuZCB0aGUgZ2FtZS5cbiAgICAgICAgLy8gSWYgbm8gd2lubmVyIGl0IGRldGVybWluZWQgYWJvdmUsIHRoZW4gYSByYW5kb20gb25lIHdpbGwgYmUgY2hvc2VuLlxuICAgICAgICBzdXBlci5zZWNvbmRhcnlXaW5Db25kaXRpb25zKHJlYXNvbik7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyBhbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQvcHJpdmF0ZSBtZXRob2RzIHlvdSBuZWVkIGNhbiBiZSBhZGRlZCBoZXJlXG5cbiAgICAvKipcbiAgICAgKiBHYW1lLU1hbmFnZXIgdXBkYXRlIHVuaXRzLlxuICAgICAqIFRoaXMgZ29lcyBpbnRvIHRoZSBhZnRlciB0dXJuIGZ1bmN0aW9uLlxuICAgICAqIE1ha2VzIHRoZSBzaGlwcyBvZiB0aGUgbmV4dCBwbGF5ZXIgY29uY2x1ZGUgdGhlaXIgZGFzaGluZywgYW5kIHJlc2V0c1xuICAgICAqIHRoZWlyIGluZm9ybWF0aW9uLiBVcGRhdGUgbWFydHlyIHByb3RlY3Rpb25zLlxuICAgICAqL1xuICAgIHByaXZhdGUgdXBkYXRlVW5pdHMoKTogdm9pZCB7XG4gICAgICAgIC8vIG9ubHkgbW92ZSB0aGUgbmV4dCBwbGF5ZXIncyB1bml0cy5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVyc1swXSkge1xuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggdW5pdCB0byBjaGVjayB0aGUgZGFzaGluZyBzdGF0dXMuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnBsYXllcnNbMF0udW5pdHMpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHByb3RlY3RvciB0byB1bmRlZmluZWQgYXMgdW5pdHMgaGF2ZSBtb3ZlZC5cbiAgICAgICAgICAgICAgICB1bml0LnByb3RlY3RvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIGl0IHNvIHRoZSB1bml0IGNhbiBhY3QgYWdhaW5cbiAgICAgICAgICAgICAgICB1bml0LmFjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHVuaXQgaXMgZGFzaGluZy5cbiAgICAgICAgICAgICAgICBpZiAodW5pdC5pc0J1c3kpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGl0J3MgbG9jYXRpb24gYW5kIGNvbmRpdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHVuaXQueCA9IHVuaXQuZGFzaFg7XG4gICAgICAgICAgICAgICAgICAgIHVuaXQuZGFzaFggPSAtMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgdW5pdC55ID0gdW5pdC5kYXNoWTtcbiAgICAgICAgICAgICAgICAgICAgdW5pdC5kYXNoWSA9IC0xMDAwO1xuICAgICAgICAgICAgICAgICAgICB1bml0LmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlc2V0cyB0aGUgdW5pdHMgbW92ZXMuXG4gICAgICAgICAgICAgICAgdW5pdC5tb3ZlcyA9IHVuaXQuam9iLm1vdmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggdW5pdCB0byBjaGVjayB0aGUgZGFzaGluZyBzdGF0dXMuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHVuaXQgb2YgdGhpcy5nYW1lLnBsYXllcnNbMV0udW5pdHMpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHByb3RlY3RvciB0byB1bmRlZmluZWQgYXMgdW5pdHMgaGF2ZSBtb3ZlZC5cbiAgICAgICAgICAgICAgICB1bml0LnByb3RlY3RvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIGl0IHNvIHRoZSB1bml0IGNhbiBhY3QgYWdhaW5cbiAgICAgICAgICAgICAgICB1bml0LmFjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHVuaXQgaXMgZGFzaGluZy5cbiAgICAgICAgICAgICAgICBpZiAodW5pdC5pc0J1c3kpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIGl0J3MgbG9jYXRpb24gYW5kIGNvbmRpdGlvbnMuXG4gICAgICAgICAgICAgICAgICAgIHVuaXQueCA9IHVuaXQuZGFzaFg7XG4gICAgICAgICAgICAgICAgICAgIHVuaXQuZGFzaFggPSAtMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgdW5pdC55ID0gdW5pdC5kYXNoWTtcbiAgICAgICAgICAgICAgICAgICAgdW5pdC5kYXNoWSA9IC0xMDAwO1xuICAgICAgICAgICAgICAgICAgICB1bml0LmlzQnVzeSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHJlc2V0cyB0aGUgdW5pdHMgbW92ZXMuXG4gICAgICAgICAgICAgICAgdW5pdC5tb3ZlcyA9IHVuaXQuam9iLm1vdmVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVjaGFyZ2VzIHBsYXllciAwJ3MgaG9tZSBiYXNlLlxuICAgICAgICB0aGlzLmdhbWUucGxheWVyc1swXS5ob21lQmFzZS5hbW91bnQgKz0gdGhpcy5nYW1lLnBsYW5ldFJlY2hhcmdlUmF0ZTtcbiAgICAgICAgLy8gbWFrZXMgc3VyZSBpdCBzdGF5cyBiZWxvdyB0aGUgZW5lcmd5IGNhcC5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLmhvbWVCYXNlLmFtb3VudCA+IHRoaXMuZ2FtZS5wbGFuZXRFbmVyZ3lDYXApIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLmhvbWVCYXNlLmFtb3VudCA9IHRoaXMuZ2FtZS5wbGFuZXRFbmVyZ3lDYXA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVjaGFyZ2VzIHBsYXllciAxJ3MgaG9tZSBiYXNlLlxuICAgICAgICB0aGlzLmdhbWUucGxheWVyc1sxXS5ob21lQmFzZS5hbW91bnQgKz0gdGhpcy5nYW1lLnBsYW5ldFJlY2hhcmdlUmF0ZTtcbiAgICAgICAgLy8gbWFrZXMgc3VyZSBpdCBzdGF5cyBiZWxvdyB0aGUgZW5lcmd5IGNhcC5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLmhvbWVCYXNlLmFtb3VudCA+IHRoaXMuZ2FtZS5wbGFuZXRFbmVyZ3lDYXApIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLmhvbWVCYXNlLmFtb3VudCA9IHRoaXMuZ2FtZS5wbGFuZXRFbmVyZ3lDYXA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgZWFjaCBwbGF5ZXIsIHVwZGF0ZSBtYXJ0eXIgcHJvdGVjdGlvbi5cbiAgICAgICAgdGhpcy51cGRhdGVNYXJ0eXIoMCk7XG4gICAgICAgIHRoaXMudXBkYXRlTWFydHlyKDEpO1xuXG4gICAgICAgIC8vIHNhZmV0eSByZXR1cm4uXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgbWFydHlyIHByb3RlY3Rpb25zLlxuICAgICAqIFRoaXMgd2lsbCB0YWtlIGluIHRoZSBwbGF5ZXIgdG8gdXBkYXRlIHByb3RlY3Rpb25zIGZvciBhbmQgdXBkYXRlIHRoZVxuICAgICAqIG1hcnR5ciBwcm90ZWN0aW9ucyBmb3IgYWxsIG9mIHRoZWlyIHVuaXRzLlxuICAgICAqIEBwYXJhbSBwbGF5ZXI6IHRoZSBwbGF5ZXIgdG8gYmUgdXBkYXRlZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIHVwZGF0ZU1hcnR5cihwbGF5ZXI6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAvLyBhbGwgbWFydHlyIHNoaXBzIG93bmVkIGJ5IHRoZSBwbGF5ZXIgdGhhdCBjYW4gcHJvdGVjdC5cbiAgICAgICAgY29uc3QgbWFydHlycyA9IHRoaXMuZ2FtZS5wbGF5ZXJzW3BsYXllcl0udW5pdHMuZmlsdGVyKCh1KSA9PlxuICAgICAgICAgICAgICAgICAgICAgIHUuam9iLnRpdGxlID09PSBcIm1hcnR5clwiKTtcbiAgICAgICAgLy8gYWxsIHVuaXRzIG93bmVkIGJ5IHRoZSBwbGF5ZXIgdGhhdCBuZWVkIHRvIGJlIGd1YXJkZWQuXG4gICAgICAgIGNvbnN0IHVuaXRzID0gdGhpcy5nYW1lLnBsYXllcnNbcGxheWVyXS51bml0cy5maWx0ZXIoKHUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgdS5wcm90ZWN0b3IgPT09IHVuZGVmaW5lZCAmJiB1LnNoaWVsZCA8PSAwKTtcbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIG1hcnR5ciB0aGF0IGNhbiBwcm90ZWN0LlxuICAgICAgICBmb3IgKGNvbnN0IG1hcnR5ciBvZiBtYXJ0eXJzKSB7XG4gICAgICAgICAgICAvLyByZWdlbiBtYXJ0eXIgc2hpZWxkcy5cbiAgICAgICAgICAgIG1hcnR5ci5zaGllbGQgKz0gdGhpcy5nYW1lLmpvYnNbMV0uZGFtYWdlO1xuICAgICAgICAgICAgLy8ga2VlcCBpdCB1bmRlciB0aGUgY2FwLlxuICAgICAgICAgICAgaWYgKG1hcnR5ci5qb2Iuc2hpZWxkIDwgbWFydHlyLnNoaWVsZCkge1xuICAgICAgICAgICAgICAgIG1hcnR5ci5zaGllbGQgPSBtYXJ0eXIuam9iLnNoaWVsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBldmVyeSB1bnByb3RlY3RlZCB1bml0LlxuICAgICAgICAgICAgZm9yIChjb25zdCB1bml0IG9mIHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHVuaXQgaXNuJ3QgcHJvdGVjdGVkIGFuZCBpcyBpbiByYW5nZS5cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5zcXJ0KCgodW5pdC54IC0gbWFydHlyLngpICoqIDIpICtcbiAgICAgICAgICAgICAgICAgICAgKCh1bml0LnkgLSBtYXJ0eXIueSkgKiogMikpIDwgbWFydHlyLmpvYi5yYW5nZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBwcm90ZWN0ZWQuXG4gICAgICAgICAgICAgICAgICAgIHVuaXQucHJvdGVjdG9yID0gbWFydHlyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbWFrZSB0aGUgbWFydHlyIHByb3RlY3QgaXQncyBzZWxmXG4gICAgICAgICAgICBtYXJ0eXIucHJvdGVjdG9yID0gbWFydHlyO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHYW1lLU1hbmFnZXIgTWF0ZXJpYWxzXG4gICAgICogVGhpcyBnb2VzIGludG8gdGhlIGFmdGVyIHR1cm4gZnVuY3Rpb25cbiAgICAgKiBNYWtlIHBsYW5ldHMgcHVsbCBtYXRlcmlhbHMgb2ZmIG9mIHNoaXBzIGFuZCBjb252ZXJ0IHRoZW0gaW50byBjYXNoIGFuZFxuICAgICAqIFZQIHBvaW50cy4gUmVnYXJkbGVzcyBvZiBvd25lciBpZiBpdCBpcyBpbiByYW5nZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIG1hbmFnZVNoaXAoKTogdm9pZCB7XG4gICAgICAgIC8vIGdyYWIgYmFzZXMgZm9yIGVhc3kgcmVmZXJlbmNlLlxuICAgICAgICBjb25zdCBiYXNlQSA9IHRoaXMuZ2FtZS5wbGF5ZXJzWzBdLmhvbWVCYXNlO1xuICAgICAgICBjb25zdCBiYXNlQiA9IHRoaXMuZ2FtZS5wbGF5ZXJzWzFdLmhvbWVCYXNlO1xuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgZXZlcnkgdW5pdC5cbiAgICAgICAgZm9yIChjb25zdCB1bml0IG9mIHRoaXMuZ2FtZS51bml0cykge1xuICAgICAgICAgICAgLy8gaWYgdGhleSBhcmUgaW4gdGhlIHJhbmdlIG9mIHRoZSBwbGF5ZXIwIHBsYW5ldC5cbiAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoKCh1bml0LnggLSBiYXNlQS54KSAqKiAyKSArICgodW5pdC55IC0gYmFzZUEueSkgKiogMikpIDw9IGJhc2VBLnJhZGl1cykge1xuICAgICAgICAgICAgICAgIC8vIGdyYWIgYWxsIHZhbHVlZCBtYXRlcmlhbHMgYW5kIGNvbnZlcnQgdGhlbSB0byBjYXNoLiBOb3QgSm9zaC5cbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVyc1swXS5tb25leSArPSB1bml0LmdlbmFyaXVtICogdGhpcy5nYW1lLmdlbmFyaXVtVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgKyB1bml0LnJhcml1bSAqIHRoaXMuZ2FtZS5yYXJpdW1WYWx1ZSArXG4gICAgICAgICAgICAgICAgICAgIHVuaXQubGVnZW5kYXJpdW0gKiB0aGlzLmdhbWUubGVnZW5kYXJpdW1WYWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBncmFiIGFsbCB2cCBtYXRlcmlhbHMuXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnNbMF0udmljdG9yeVBvaW50cyArPSB1bml0Lm15dGhpY2l0ZTtcbiAgICAgICAgICAgICAgICAvLyBlcmFzZSBhbGwgbWF0ZXJpYWxzIG9uIHRoZSB1bml0LlxuICAgICAgICAgICAgICAgIHVuaXQuZ2VuYXJpdW0gPSAwO1xuICAgICAgICAgICAgICAgIHVuaXQucmFyaXVtID0gMDtcbiAgICAgICAgICAgICAgICB1bml0LmxlZ2VuZGFyaXVtID0gMDtcbiAgICAgICAgICAgICAgICB1bml0Lm15dGhpY2l0ZSA9IDA7XG4gICAgICAgICAgICAgICAgLy8gdGhhbmsgdGhlbSBpZiB0aGV5IGFyZSB0aGUgZW5lbXlcbiAgICAgICAgICAgICAgICBpZiAodW5pdC5vd25lciAhPT0gYmFzZUEub3duZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhhbmsgeW91IGZvciB0aGUgZG9uYXRpb24uXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGZyaWVuZGx5IHNoaXAsIHJlY2hhcmdlIGl0LlxuICAgICAgICAgICAgICAgIGlmICh1bml0Lm93bmVyID09PSBiYXNlQS5vd25lcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaWYgPSB1bml0LmpvYi5lbmVyZ3kgLSB1bml0LmVuZXJneTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZiA8IGJhc2VBLmFtb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC5lbmVyZ3kgPSB1bml0LmpvYi5lbmVyZ3k7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYXNlQS5hbW91bnQgLT0gZGlmO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhleSBhcmUgaW4gdGhlIHJhbmdlIG9mIHRoZSBwbGF5ZXIxIHBsYW5ldC5cbiAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoKCh1bml0LnggLSBiYXNlQi54KSAqKiAyKSArICgodW5pdC55IC0gYmFzZUIueSkgKiogMikpIDw9IGJhc2VCLnJhZGl1cykge1xuICAgICAgICAgICAgICAgIC8vIGdyYWIgYWxsIHZhbHVlZCBtYXRlcmlhbHMgYW5kIGNvbnZlcnQgdGhlbSB0byBjYXNoLiBOb3QgSm9zaC5cbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVyc1sxXS5tb25leSArPSB1bml0LmdlbmFyaXVtICogdGhpcy5nYW1lLmdlbmFyaXVtVmFsdWVcbiAgICAgICAgICAgICAgICAgICAgKyB1bml0LnJhcml1bSAqIHRoaXMuZ2FtZS5yYXJpdW1WYWx1ZSArXG4gICAgICAgICAgICAgICAgICAgIHVuaXQubGVnZW5kYXJpdW0gKiB0aGlzLmdhbWUubGVnZW5kYXJpdW1WYWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBncmFiIGFsbCB2cCBtYXRlcmlhbHMuXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnNbMV0udmljdG9yeVBvaW50cyArPSB1bml0Lm15dGhpY2l0ZTtcbiAgICAgICAgICAgICAgICAvLyBlcmFzZSBhbGwgbWF0ZXJpYWxzIG9uIHRoZSB1bml0LlxuICAgICAgICAgICAgICAgIHVuaXQuZ2VuYXJpdW0gPSAwO1xuICAgICAgICAgICAgICAgIHVuaXQucmFyaXVtID0gMDtcbiAgICAgICAgICAgICAgICB1bml0LmxlZ2VuZGFyaXVtID0gMDtcbiAgICAgICAgICAgICAgICB1bml0Lm15dGhpY2l0ZSA9IDA7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgaXMgYSBmcmllbmRseSBzaGlwLCByZWNoYXJnZSBpdC5cbiAgICAgICAgICAgICAgICBpZiAodW5pdC5vd25lciA9PT0gYmFzZUIub3duZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlmID0gdW5pdC5qb2IuZW5lcmd5IC0gdW5pdC5lbmVyZ3kgKyB1bml0LmpvYi5zaGllbGQgLSB1bml0LnNoaWVsZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpZiA8IGJhc2VCLmFtb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdW5pdC5lbmVyZ3kgPSB1bml0LmpvYi5lbmVyZ3k7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bml0LnNoaWVsZCA9IHVuaXQuam9iLnNoaWVsZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VCLmFtb3VudCAtPSBkaWY7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzYWZldHkgcmV0dXJuLlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqIFVwZGF0ZXMgYWxsIGFycmF5cyBpbiB0aGUgZ2FtZSB3aXRoIG5ldy9kZWFkIGdhbWUgb2JqZWN0cyAqL1xuICAgIHByaXZhdGUgdXBkYXRlQXJyYXlzKCk6IHZvaWQge1xuICAgICAgICAvLyB0aGUgc3VuXG4gICAgICAgIGNvbnN0IHN1biA9IHRoaXMuZ2FtZS5ib2RpZXNbMl07XG5cbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGFsbCBwcm9qZWN0aWxlcyBpbiB0aGUgZ2FtZS5cbiAgICAgICAgZm9yIChjb25zdCBtaXMgb2YgdGhpcy5nYW1lLnByb2plY3RpbGVzKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgYXJlIG9ubHkgdXBkYXRpbmcgdGhlIGxhc3QgcGxheWVycyBtaXNzaWxlc1xuICAgICAgICAgICAgaWYgKG1pcy5vd25lciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG1pcy50YXJnZXQgPT09IG51bGwgfHwgbWlzLnRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IG1pcy50YXJnZXQueCA8IDAgfHwgbWlzLnRhcmdldC55IDwgMCkge1xuICAgICAgICAgICAgICAgIG1pcy54ID0gLTEwMDtcbiAgICAgICAgICAgICAgICBtaXMueSA9IC0xMDA7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGdyYWIgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHByb2plY3RpbGUgYW5kIGl0J3MgdGFyZ2V0XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IE1hdGguc3FydCgoKG1pcy54IC0gbWlzLnRhcmdldC54KSAqKiAyKSArICgobWlzLnkgLSBtaXMudGFyZ2V0LnkpICoqIDIpKTtcbiAgICAgICAgICAgIC8vIGdyYWIgdGhlIHggZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBwcm9qZWN0aWxlIGFuZCBpdCdzIHRhcmdldC5cbiAgICAgICAgICAgIGNvbnN0IGRpZlggPSBNYXRoLmFicyhtaXMueCAtIG1pcy50YXJnZXQueCk7XG4gICAgICAgICAgICAvLyBhcyBsb25nIGFzIHRoZSBwcm9qZWN0aWxlIGlzbid0IG9udG9wIG9mIHRoZSB0YXJnZXQuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgIT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBncmFiIHRoZSBhbmdsZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHRhcmdldCBhbmQgdGhlIG1pc3NpbGUuXG4gICAgICAgICAgICAgICAgY29uc3QgYW5nbGUgPSBNYXRoLmFjb3MoZGlmWCAvIGRpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgdGhlIHRyYXZlbCBkaXN0YW5jZVxuICAgICAgICAgICAgICAgIGNvbnN0IHRyYXYgPSBNYXRoLm1pbih0aGlzLmdhbWUucHJvamVjdGlsZVNwZWVkLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgY2hhbmdlIGluIHggYW5kIHkgaXQgY2FuIGFjaGlldmUuXG4gICAgICAgICAgICAgICAgY29uc3QgbW92ZVggPSBNYXRoLmFicyh0cmF2ICogTWF0aC5jb3MoYW5nbGUpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtb3ZlWSA9IE1hdGguYWJzKHRyYXYgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXMgdG8gdGhlIGxlZnQsIG1vdmUgbGVmdC5cbiAgICAgICAgICAgICAgICBpZiAobWlzLnggPiBtaXMudGFyZ2V0LngpIHtcbiAgICAgICAgICAgICAgICAgICAgbWlzLnggLT0gbW92ZVg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBtb3ZlIHJpZ2h0LlxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBtaXMueCArPSBtb3ZlWDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBiZWxvdywgbW92ZSBkb3duLlxuICAgICAgICAgICAgICAgIGlmIChtaXMueSA+IG1pcy50YXJnZXQueSkge1xuICAgICAgICAgICAgICAgICAgICBtaXMueSAtPSBtb3ZlWTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIG1vdmUgdXAuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG1pcy55ICs9IG1vdmVZO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkZWNyZWFzZSB0aGUgbWlzc2lsZXMgZnVlbCBhcHByb3ByaWF0ZWx5LlxuICAgICAgICAgICAgICAgIG1pcy5mdWVsIC09IE1hdGguc3FydCgoKG1vdmVYKSAqKiAyKSArICgobW92ZVkpICoqIDIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaXQgaXMgY29sbGlkaW5nIHdpdGggdGhlIHRhcmdldC5cbiAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoKChtaXMueCAtIG1pcy50YXJnZXQueCkgKiogMikgKyAoKG1pcy55IC0gbWlzLnRhcmdldC55KSAqKiAyKSkgPFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLmdhbWUucHJvamVjdGlsZVJhZGl1cyArIHRoaXMuZ2FtZS5zaGlwUmFkaXVzKSkge1xuICAgICAgICAgICAgICAgIC8vIGtpbGwgdGhlIG1pc3NpbGUgYW5kIHRoZSB0YXJnZXQuXG4gICAgICAgICAgICAgICAgbWlzLnggPSAtMTtcbiAgICAgICAgICAgICAgICBtaXMueSA9IC0xO1xuICAgICAgICAgICAgICAgIG1pcy5mdWVsID0gLTE7XG4gICAgICAgICAgICAgICAgbWlzLnRhcmdldC54ID0gLTE7XG4gICAgICAgICAgICAgICAgbWlzLnRhcmdldC55ID0gLTE7XG4gICAgICAgICAgICAgICAgbWlzLnRhcmdldC5lbmVyZ3kgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFByb3Blcmx5IHJlbW92ZSBhbGwga2lsbGVkIHVuaXRzIGFuZCBvbmVzIHRoYXQgY29sbGlkZSB3aXRoIHRoZSBzdW4uXG4gICAgICAgIGNvbnN0IGRlYWRVbml0cyA9IHRoaXMuZ2FtZS51bml0cy5maWx0ZXIoKHUpID0+IHUueCA8IDAgfHwgdS55IDwgMCB8fCB1LmVuZXJneSA8IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zcXJ0KCgoc3VuLnggLSB1LngpICoqIDIpICsgKChzdW4ueSAtIHUueSkgKiogMikpIDwgc3VuLnJhZGl1cyArIHRoaXMuZ2FtZS5zaGlwUmFkaXVzKTtcblxuICAgICAgICAvLyBQcm9wZXJseSByZW1vdmUgYWxsIGtpbGxlZCB1bml0cyBhbmQgb25lcyB0aGF0IGNvbGxpZGUgd2l0aCB0aGUgc3VuLlxuICAgICAgICBjb25zdCBkZWFkUHJvaiA9IHRoaXMuZ2FtZS5wcm9qZWN0aWxlcy5maWx0ZXIoKHUpID0+IHUueCA8IDAgfHwgdS55IDwgMCB8fCB1LmZ1ZWwgPCAwIHx8IHUudGFyZ2V0LnggPCAwIHx8XG4gICAgICAgICAgICAgICAgICAgIE1hdGguc3FydCgoKHN1bi54IC0gdS54KSAqKiAyKSArICgoc3VuLnkgLSB1LnkpICoqIDIpKSA8IHN1bi5yYWRpdXMgKyB0aGlzLmdhbWUucHJvamVjdGlsZVJhZGl1cyk7XG5cbiAgICAgICAgLy8gYWRkIHVwIGRlc3Ryb3llZCBteXRoaWNpdGUuXG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiBkZWFkVW5pdHMpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5sb3N0TXl0aGljaXRlICs9IE1hdGguYWJzKHVuaXQubXl0aGljaXRlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZW1vdmUgZGVhZCB1bml0cyBmcm9tIGFsbCBwbGF5ZXIncyB1bml0cyBsaXN0XG4gICAgICAgIGZvciAoY29uc3QgcGxheWVyIG9mIHRoaXMuZ2FtZS5wbGF5ZXJzKSB7XG4gICAgICAgICAgICByZW1vdmVFbGVtZW50cyhwbGF5ZXIudW5pdHMsIC4uLmRlYWRVbml0cyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGdhbWVcbiAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5nYW1lLnVuaXRzLCAuLi5kZWFkVW5pdHMpO1xuXG4gICAgICAgIC8vIHJlbW92ZSBkZWFkIHByb2plY3RpbGVzIGZyb20gYWxsIHBsYXllcidzIHVuaXRzIGxpc3RcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5nYW1lLnBsYXllcnMpIHtcbiAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKHBsYXllci5wcm9qZWN0aWxlcywgLi4uZGVhZFByb2opO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBnYW1lXG4gICAgICAgIHJlbW92ZUVsZW1lbnRzKHRoaXMuZ2FtZS5wcm9qZWN0aWxlcywgLi4uZGVhZFByb2opO1xuICAgIH1cblxuICAgIC8qKiBVcGRhdGVzIGFzdGVyb2lkcyBvcmJpdGluZyB0aGUgc3VuLiAqL1xuICAgIHByaXZhdGUgdXBkYXRlT3JiaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgYm9kaWVzLlxuICAgICAgICBmb3IgKGNvbnN0IGFzdCBvZiB0aGlzLmdhbWUuYm9kaWVzKSB7XG4gICAgICAgICAgICAvLyBza2lwIHRoZW0gaWYgdGhleSBhcmVuJ3QgYSBhc3Rlcm9pZC5cbiAgICAgICAgICAgIGlmIChhc3QuYm9keVR5cGUgIT09IFwiYXN0ZXJvaWRcIikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZXNldHMgYSBhc3Rlcm9pZCdzIG93bmVyIHNvIG90aGVyIGNhbiBtaW5lIGl0LiBHaXZlcyB0aGUgb2xkIG93bmVyXG4gICAgICAgICAgICAvLyBhIGNoYW5jZSB0byBjb250aW51ZSB0byBjbGFpbSBpdC5cbiAgICAgICAgICAgIGlmIChhc3Qub3duZXIgIT09IHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyKSB7XG4gICAgICAgICAgICAgICAgYXN0Lm93bmVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpZiBhIGFuZ2xlIGV4aXN0cy5cbiAgICAgICAgICAgIGlmIChhc3QuYW5nbGUgPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG1vdmUgdGhlIGFzdGVyb2lkLlxuICAgICAgICAgICAgICAgIGFzdC5hbmdsZSAtPSAzNjAgLyB0aGlzLmdhbWUudHVybnNUb09yYml0O1xuICAgICAgICAgICAgICAgIGlmIChhc3QuYW5nbGUgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzdC5hbmdsZSArPSAzNjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFzdC54ID0gYXN0LmdldFgoKTtcbiAgICAgICAgICAgICAgICBhc3QueSA9IGFzdC5nZXRZKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGtpbGwgdGhlIGFzdGVyb2lkIGlmIGl0IGlzIGRlcGxldGVkLlxuICAgICAgICAgICAgaWYgKGFzdC5hbW91bnQgPD0gMCAmJiB0aGlzLmdhbWUucmVnZW5lcmF0ZVJhdGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICBhc3QueCA9IC0xO1xuICAgICAgICAgICAgICAgIGFzdC55ID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmdhbWUucmVnZW5lcmF0ZVJhdGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgYXN0LmFtb3VudCArPSB0aGlzLmdhbWUucmVnZW5lcmF0ZVJhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9wZXJseSByZW1vdmUgYWxsIGtpbGxlZCBhc3Rlcm9pZHMuXG4gICAgICAgIGNvbnN0IGRlYWRCb2RpZXMgPSB0aGlzLmdhbWUuYm9kaWVzLmZpbHRlcigodSkgPT4gKHUueCA8IDAgfHwgdS55IDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHUuYm9keVR5cGUgPT09IFwiYXN0ZXJvaWRcIik7XG5cbiAgICAgICAgLy8gYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGdhbWVcbiAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5nYW1lLmJvZGllcywgLi4uZGVhZEJvZGllcyk7XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLW1ldGhvZHMgLS0+PlxufVxuIl19