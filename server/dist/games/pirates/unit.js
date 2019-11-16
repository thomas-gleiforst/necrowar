"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * A unit group in the game. This may consist of a ship and any number of crew.
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
        this.acted = true;
        this.crewHealth = this.crewHealth || (this.crew * this.game.crewHealth);
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
     * @param target - Whether to attack 'crew' or 'ship'. Crew deal damage to
     * crew and ships deal damage to ships. Consumes any remaining moves.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAttack(player, tile, target) {
        // <<-- Creer-Merge: invalidate-attack -->>
        const reason = this.invalidate(player, true);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        if (!tile.unit) {
            return `There be nothin' for ${this} to attack on ${tile}!`;
        }
        if (tile.unit.owner === player) {
            return `${this} doesn't have time for a mutany! Don't be attackin' yer own!`;
        }
        if (target === "crew") {
            if (tile.unit.crew <= 0) {
                return `${tile} has got no crew for you to attack!`;
            }
        }
        else { // target === "ship"
            if (tile.unit.shipHealth <= 0) {
                return `There be no ship for ${this} to attack.`;
            }
            if (this.shipHealth <= 0) {
                return `${this} has no ship to perform the attack.`;
            }
        }
        const dx = this.tile.x - tile.x;
        const dy = this.tile.y - tile.y;
        const distSq = dx * dx + dy * dy;
        const range = target === "crew"
            ? "crewRange"
            : "shipRange";
        if (distSq > (this.game[range] ** 2)) {
            return `${this} isn't in range for that attack. Ye don't wanna fire blindly into the wind!`;
        }
        // <<-- /Creer-Merge: invalidate-attack -->>
    }
    /**
     * Attacks either the 'crew' or 'ship' on a Tile in range.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to attack.
     * @param target - Whether to attack 'crew' or 'ship'. Crew deal damage to
     * crew and ships deal damage to ships. Consumes any remaining moves.
     * @returns True if successfully attacked, false otherwise.
     */
    async attack(player, tile, target) {
        // <<-- Creer-Merge: attack -->>
        if (!tile.unit) {
            throw new Error("tile has no unit, should be impossible");
        }
        let deadCrew = 0;
        let deadShips = 0;
        let gold = 0;
        const merchant = Boolean(tile.unit.targetPort);
        const neutral = !merchant && !tile.unit.owner;
        if (target === "crew") {
            // Crew attacking crew
            tile.unit.crewHealth -= this.game.crewDamage * this.crew;
            tile.unit.crewHealth = Math.max(0, tile.unit.crewHealth);
            // For counting the dead accurately
            if (tile.unit.crew > tile.unit.crewHealth) {
                deadCrew = tile.unit.crew - tile.unit.crewHealth;
                tile.unit.crew = tile.unit.crewHealth;
            }
            // Check if the crew was completely destroyed
            if (tile.unit.crewHealth <= 0) {
                if (tile.unit.shipHealth <= 0) {
                    gold += tile.unit.gold;
                    // Mark it as dead
                    tile.unit.tile = undefined;
                    tile.unit = undefined;
                }
                else {
                    tile.unit.owner = undefined;
                    tile.unit.shipHealth = 1;
                    // Make sure it's not a merchant ship anymore either
                    tile.unit.targetPort = undefined;
                    tile.unit.path.length = 0;
                }
            }
        }
        else {
            // Ship attacking ship
            tile.unit.shipHealth -= this.game.shipDamage;
            tile.unit.shipHealth = Math.max(0, tile.unit.shipHealth);
            // Check if ship was destroyed
            if (tile.unit.shipHealth <= 0) {
                deadShips += 1;
                gold += tile.unit.gold;
                deadCrew += tile.unit.crew;
                // Mark it as dead
                tile.unit.tile = undefined;
                tile.unit = undefined;
            }
        }
        // Infamy
        this.acted = true;
        this.gold += gold;
        // Calculate the infamy factor
        let factor = 1;
        if (!merchant) {
            // Calculate each player's net worth
            const allyWorth = player.netWorth() + player.gold - gold;
            const opponentWorth = (player.opponent.netWorth() + player.opponent.gold + gold) + deadCrew * this.game.crewCost + deadShips * this.game.shipCost;
            if (allyWorth > opponentWorth) {
                factor = 0.5;
            }
            else if (allyWorth < opponentWorth) {
                factor = 2;
            }
        }
        // Calculate infamy
        let infamy = (deadCrew * this.game.crewCost + deadShips * this.game.shipCost) * factor;
        if (!neutral) {
            if (!merchant) {
                infamy = Math.min(infamy, player.opponent.infamy);
                player.opponent.infamy -= infamy;
            }
            player.infamy += infamy;
        }
        if (merchant && tile.unit) {
            tile.unit.stunTurns = 2;
        }
        return true;
        // <<-- /Creer-Merge: attack -->>
    }
    /**
     * Invalidation function for bury. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param amount - How much gold this Unit should bury. Amounts <= 0 will
     * bury as much as possible.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateBury(player, amount) {
        // <<-- Creer-Merge: invalidate-bury -->>
        const reason = this.invalidate(player);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        if (this.tile.type !== "land") {
            return `${this} can't bury gold on the sea.`;
        }
        if (this.tile.port) {
            return `${this} can't bury gold in ports.`;
        }
        if (this.tile.gold >= this.game.settings.maxTileGold) {
            return `${this} can't bury loot on a tile with the max amount of booty (${this.game.settings.maxTileGold}).`;
        }
        const dx = this.tile.x - player.port.tile.x;
        const dy = this.tile.y - player.port.tile.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < this.game.minInterestDistance * this.game.minInterestDistance) {
            return `${this} is too close to home! Ye gotta bury yer loot far away from yer port.`;
        }
        let actualAmount = amount <= 0
            ? this.gold
            : Math.min(this.gold, amount);
        actualAmount = Math.min(this.game.settings.maxTileGold - this.tile.gold, actualAmount);
        if (actualAmount <= 0) {
            return `${this} doesn't have any gold to bury! Ye poor scallywag.`;
        }
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-bury -->>
    }
    /**
     * Buries gold on this Unit's Tile. Gold must be a certain distance away
     * for it to get interest (Game.minInterestDistance).
     *
     * @param player - The player that called this.
     * @param amount - How much gold this Unit should bury. Amounts <= 0 will
     * bury as much as possible.
     * @returns True if successfully buried, false otherwise.
     */
    async bury(player, amount) {
        // <<-- Creer-Merge: bury -->>
        if (!this.tile) {
            throw new Error(`${this} has no Tile to bury gold!`);
        }
        this.tile.gold += amount;
        this.gold -= amount;
        return true;
        // <<-- /Creer-Merge: bury -->>
    }
    /**
     * Invalidation function for deposit. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param amount - The amount of gold to deposit. Amounts <= 0 will deposit
     * all the gold on this Unit.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDeposit(player, amount = 0) {
        // <<-- Creer-Merge: invalidate-deposit -->>
        const reason = this.invalidate(player);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        const tiles = [this.tile, ...this.tile.getNeighbors()];
        const found = tiles.find((t) => Boolean(t && t.port && t.port.owner !== player.opponent));
        if (!found) {
            return `Arr, ${this} has to deposit yer booty in yer home port or a merchant port, matey!`;
        }
        if (this.gold <= 0) {
            return `Shiver me timbers! ${this} doesn't have any booty to deposit!`;
        }
        let actualAmount = Math.min(Math.max(amount, 0), this.gold);
        if (actualAmount <= 0) {
            actualAmount = this.gold;
        }
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-deposit -->>
    }
    /**
     * Puts gold into an adjacent Port. If that Port is the Player's port, the
     * gold is added to that Player. If that Port is owned by merchants, it
     * adds to that Port's investment.
     *
     * @param player - The player that called this.
     * @param amount - The amount of gold to deposit. Amounts <= 0 will deposit
     * all the gold on this Unit.
     * @returns True if successfully deposited, false otherwise.
     */
    async deposit(player, amount = 0) {
        // <<-- Creer-Merge: deposit -->>
        this.gold -= amount;
        if (!this.tile) {
            throw new Error(`${this} has no Tile to deposit gold!`);
        }
        const tiles = [this.tile, ...this.tile.getNeighbors()];
        let tile = tiles.find((t) => Boolean(t && t.port && t.port.owner !== player.opponent)); // will be found as we validated it above
        if (tile) {
            player.gold += amount;
        }
        else {
            // Get the merchant's port
            tile = tiles.find((t) => Boolean(t && t.port && !t.port.owner));
            if (!tile) {
                throw new Error("Could not find perchant port tile to deposit money on!");
            }
            if (!tile.port) {
                throw new Error(`${tile} has no port to deposit money on to!`);
            }
            tile.port.investment += amount;
        }
        return true;
        // <<-- /Creer-Merge: deposit -->>
    }
    /**
     * Invalidation function for dig. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param amount - How much gold this Unit should take. Amounts <= 0 will
     * dig up as much as possible.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateDig(player, amount = 0) {
        // <<-- Creer-Merge: invalidate-dig -->>
        const reason = this.invalidate(player);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        // Checking to see if the tile is anything other than a land type.
        if (this.tile.type !== "land") {
            return `${this} can't dig in the sea!`;
        }
        // Checking to see if the tile has gold to be dug up.
        if (this.tile.gold === 0) {
            return `There be no booty for ${this} to plunder.`;
        }
        const actualAmount = amount <= 0 || amount > this.tile.gold
            ? this.tile.gold
            : amount;
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-dig -->>
    }
    /**
     * Digs up gold on this Unit's Tile.
     *
     * @param player - The player that called this.
     * @param amount - How much gold this Unit should take. Amounts <= 0 will
     * dig up as much as possible.
     * @returns True if successfully dug up, false otherwise.
     */
    async dig(player, amount = 0) {
        // <<-- Creer-Merge: dig -->>
        if (!this.tile) {
            throw new Error(`${this} has no Tile to dig!`);
        }
        // Adds amount requested to Unit.
        this.gold += amount;
        // Subtracts amount from Tile's gold
        this.tile.gold -= amount;
        return true;
        // <<-- /Creer-Merge: dig -->>
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
        const reason = this.invalidate(player);
        if (reason) {
            return reason;
        }
        const ship = this.shipHealth > 0;
        if (this.moves <= 0) {
            return `${this}'s crew are too tired to travel any further.`;
        }
        if (this.acted) {
            return `${this} can't move after acting. The men are too tired!`;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        if (!this.tile.hasNeighbor(tile)) {
            return `${tile} be too far for ${this} to move to.`;
        }
        if (tile.unit && tile.unit.owner && tile.unit.owner !== player) {
            return `${this} refuses to share the same ground with a living foe.`;
        }
        if (!ship && tile.type === "water" && !tile.port && !(tile.unit && tile.unit.shipHealth > 0)) {
            return `${this} has no ship and can't walk on water!`;
        }
        if (ship && tile.type === "land") {
            return `Land ho! ${this} belongs in the sea! Use 'Unit.split' if ye want to move just yer crew ashore.`;
        }
        if (ship && tile.unit && tile.unit.shipHealth > 0) {
            return `There be a ship there. If ye move ${this} to ${tile}, ye'll scuttle yer ship!`;
        }
        if (!ship && tile.unit && tile.unit.shipHealth > 0 && this.acted) {
            return `${this} already acted, and it be too tired to board that ship.`;
        }
        if (tile.port && tile.port.owner !== player) {
            return `${this} can't enter an enemy port!`;
        }
        if (ship && tile.port && tile.unit && tile.unit.shipHealth > 0) {
            return `${this} can't move into yer port, ye'll scuttle yer ship!`;
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves this Unit from its current Tile to an adjacent Tile. If this Unit
     * merges with another one, the other Unit will be destroyed and its tile
     * will be set to undefined. Make sure to check that your Unit's tile is
     * not undefined before doing things with it.
     *
     * @param player - The player that called this.
     * @param tile - The Tile this Unit should move to.
     * @returns True if it moved, false otherwise.
     */
    async move(player, tile) {
        // <<-- Creer-Merge: move -->>
        if (tile.unit) {
            // combine with that unit
            const other = tile.unit;
            other.tile = undefined;
            tile.unit = this;
            this.tile = tile;
            this.gold += other.gold;
            this.crew += other.crew;
            this.crewHealth += other.crewHealth;
            this.shipHealth += other.shipHealth;
            this.acted = this.acted || other.acted || other.shipHealth > 0;
            this.moves = Math.min(this.moves - 1, other.moves);
        }
        else {
            if (!this.tile) {
                throw new Error(`${this} has no Tile to move from!`);
            }
            // Move this unit to that tile
            this.tile.unit = undefined;
            this.tile = tile;
            tile.unit = this;
            this.moves -= 1;
        }
        return true;
        // <<-- /Creer-Merge: move -->>
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
        const reason = this.invalidate(player, true);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        // Check if it's in range
        const radius = this.game.restRange;
        if (((this.tile.x - player.port.tile.x) ** 2 + (this.tile.y - player.port.tile.y) ** 2) > radius ** 2) {
            return `${this} has no nearby port to rest at. No home tavern means no free rum!`;
        }
        // <<-- /Creer-Merge: invalidate-rest -->>
    }
    /**
     * Regenerates this Unit's health. Must be used in range of a port.
     *
     * @param player - The player that called this.
     * @returns True if successfully rested, false otherwise.
     */
    async rest(player) {
        // <<-- Creer-Merge: rest -->>
        // Heal the units
        this.crewHealth += Math.ceil(this.game.crewHealth * this.game.healFactor) * this.crew;
        this.crewHealth = Math.min(this.crewHealth, this.crew * this.game.crewHealth);
        if (this.shipHealth > 0) {
            this.shipHealth += Math.ceil(this.game.shipHealth * this.game.healFactor);
            this.shipHealth = Math.min(this.shipHealth, this.game.shipHealth);
        }
        // Make sure the unit can't do anything else this turn
        this.acted = true;
        this.moves = 0;
        return true;
        // <<-- /Creer-Merge: rest -->>
    }
    /**
     * Invalidation function for split. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to move the crew to.
     * @param amount - The number of crew to move onto that Tile. Amount <= 0
     * will move all the crew to that Tile.
     * @param gold - The amount of gold the crew should take with them. Gold <
     * 0 will move all the gold to that Tile.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSplit(player, tile, amount = 1, gold = 0) {
        // <<-- Creer-Merge: invalidate-split -->>
        const reason = this.invalidate(player);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            return `${this} must be on a Tile!`;
        }
        if (!tile) {
            return `${this} can't split onto null!`;
        }
        // Check to see if the crew has a move to move
        if (this.moves <= 0) {
            return `${this} can't split cause they be out of moves.`;
        }
        // Check to see if they have already acted.
        if (this.acted) {
            return `${this} crew are too tired to split!`;
        }
        // Check to see if it is not one of the tiles around in the current direction
        if (!this.tile.hasNeighbor(tile)) {
            return `${tile} be too far for ${this} to split to.`;
        }
        // Check to make sure target tile is a valid tile
        if (tile.type === "water" && !tile.unit && !tile.port) {
            return `${this} can't split onto water!`;
        }
        if (tile.unit && (tile.unit.owner === player.opponent || tile.unit.targetPort)) {
            return `${this} can't split onto enemy pirates!`;
        }
        if (tile.port && tile.port.owner !== player) {
            return `${this} can't split onto enemy ports!`;
        }
        // Adjust the amount of crew to split
        const actualAmount = amount <= 0
            ? this.crew
            : Math.min(amount, this.crew);
        // Adjust the amount of gold to split
        const actualGold = ((amount === this.crew && this.shipHealth <= 0) || gold < 0)
            ? this.gold
            : Math.min(gold, this.gold);
        return {
            amount: actualAmount,
            gold: actualGold,
        };
        // <<-- /Creer-Merge: invalidate-split -->>
    }
    /**
     * Moves a number of crew from this Unit to the given Tile. This will
     * consume a move from those crew.
     *
     * @param player - The player that called this.
     * @param tile - The Tile to move the crew to.
     * @param amount - The number of crew to move onto that Tile. Amount <= 0
     * will move all the crew to that Tile.
     * @param gold - The amount of gold the crew should take with them. Gold <
     * 0 will move all the gold to that Tile.
     * @returns True if successfully split, false otherwise.
     */
    async split(player, tile, amount = 1, gold = 0) {
        // <<-- Creer-Merge: split -->>
        if (!this.tile) {
            throw new Error("Unit split in invalid state!");
        }
        const originalCrew = this.crew;
        // Create a new unit
        const newUnit = {
            tile,
            gold,
            owner: player,
            crew: amount,
            moves: this.moves - 1,
            // Check if boarding a ship
            acted: tile.unit && tile.unit.shipHealth > 0,
            // Crew health
            crewHealth: amount === this.crew
                ? this.crewHealth
                : Math.ceil((this.crewHealth / originalCrew) * amount),
        };
        // Move the crew
        this.crew -= amount;
        // Adjust the amount of gold to split
        newUnit.gold = ((amount === this.crew && this.shipHealth <= 0) || gold < 0)
            ? this.gold
            : Math.min(gold, this.gold);
        this.gold -= newUnit.gold;
        // Crew health
        newUnit.crewHealth = amount === this.crew
            ? this.crewHealth
            : Math.ceil((this.crewHealth / originalCrew) * amount);
        this.crewHealth -= newUnit.crewHealth || 0;
        // Ownership
        if (this.crew <= 0) {
            // Disassociating from old Tile if all the crew moved
            this.owner = undefined;
            if (this.shipHealth <= 0) {
                // If no units are left over, remove the unit
                this.tile.unit = undefined;
                this.tile = undefined;
            }
        }
        // Check if merging with another unit
        if (tile.unit) {
            const other = tile.unit;
            other.owner = player;
            other.gold += newUnit.gold || 0;
            other.crew += newUnit.crew || 0;
            other.crewHealth += newUnit.crewHealth || 0;
            other.acted = other.acted || other.shipHealth > 0;
            other.moves = Math.min(newUnit.moves || 0, other.moves);
        }
        else {
            const unit = this.game.manager.create.unit(newUnit);
            if (!unit.tile) {
                throw new Error("New unit is not on a Tile somehow!");
            }
            tile.unit = unit;
            this.game.manager.newUnits.push(unit);
        }
        tile.unit.owner = player;
        return true;
        // <<-- /Creer-Merge: split -->>
    }
    /**
     * Invalidation function for withdraw. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param amount - The amount of gold to withdraw. Amounts <= 0 will
     * withdraw everything.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateWithdraw(player, amount = 0) {
        // <<-- Creer-Merge: invalidate-withdraw -->>
        const reason = this.invalidate(player);
        if (reason) {
            return reason;
        }
        if (!this.tile) {
            throw new Error(`${this} has no Tile!`);
        }
        const tile = player.port.tile;
        if (this.tile !== tile && !this.tile.hasNeighbor(tile)) {
            return `${this} has to withdraw yer booty from yer home port, matey!`;
        }
        let actualAmount = amount;
        if (actualAmount <= 0) {
            // Take all the gold
            actualAmount = player.gold;
        }
        // cap the amount taken by how much gold they have
        // (so they can't withdraw more gold than their player has)
        actualAmount = Math.min(actualAmount, player.gold);
        return { amount: actualAmount };
        // <<-- /Creer-Merge: invalidate-withdraw -->>
    }
    /**
     * Takes gold from the Player. You can only withdraw from your own Port.
     *
     * @param player - The player that called this.
     * @param amount - The amount of gold to withdraw. Amounts <= 0 will
     * withdraw everything.
     * @returns True if successfully withdrawn, false otherwise.
     */
    async withdraw(player, amount = 0) {
        // <<-- Creer-Merge: withdraw -->>
        this.gold += amount;
        player.gold -= amount;
        return true;
        // <<-- /Creer-Merge: withdraw -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Tries to invalidate args for an action function
     *
     * @param player - the player commanding this Unit
     * @param checkAction - true to check if this Unit has an action
     * @returns the reason this is invalid, undefined if looks valid so far
     */
    invalidate(player, checkAction) {
        if (!player || player !== this.game.currentPlayer) {
            return `Avast, it isn't yer turn, ${player}.`;
        }
        if (this.owner !== player) {
            return `${this} isn't among yer crew.`;
        }
        if (checkAction && this.acted) {
            return `${this} can't perform another action this turn.`;
        }
        if (!this.tile || this.crew === 0) {
            return `Ye can't control ${this}.`;
        }
    }
}
exports.Unit = Unit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9waXJhdGVzL3VuaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSwrQ0FBMkM7QUFLM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLElBQUssU0FBUSx3QkFBVTtJQThEaEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFLRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBRXJDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV4RSxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7Ozs7OztPQVlHO0lBQ08sZ0JBQWdCLENBQ3RCLE1BQWMsRUFDZCxJQUFVLEVBQ1YsTUFBdUI7UUFFdkIsMkNBQTJDO1FBRTNDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksTUFBTSxFQUFFO1lBQ1IsT0FBTyxNQUFNLENBQUM7U0FDakI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxJQUFJLGVBQWUsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsSUFBSSxDQUFDLElB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LE9BQU8sR0FBRyxJQUFJLDBDQUEwQyxDQUFDO1NBQzVEO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxvQkFBb0IsSUFBSSxHQUFHLENBQUM7U0FDdEM7SUFDTCxDQUFDO0NBR0o7QUE3OUJELG9CQTY5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElVbml0QXR0YWNrQXJncywgSVVuaXRCdXJ5QXJncywgSVVuaXREZXBvc2l0QXJncywgSVVuaXREaWdBcmdzLFxuICAgICAgICAgSVVuaXRNb3ZlQXJncywgSVVuaXRQcm9wZXJ0aWVzLCBJVW5pdFJlc3RBcmdzLCBJVW5pdFNwbGl0QXJncyxcbiAgICAgICAgIElVbml0V2l0aGRyYXdBcmdzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgUG9ydCB9IGZyb20gXCIuL3BvcnRcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgdW5pdCBncm91cCBpbiB0aGUgZ2FtZS4gVGhpcyBtYXkgY29uc2lzdCBvZiBhIHNoaXAgYW5kIGFueSBudW1iZXIgb2YgY3Jldy5cbiAqL1xuZXhwb3J0IGNsYXNzIFVuaXQgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoaXMgVW5pdCBoYXMgcGVyZm9ybWVkIGl0cyBhY3Rpb24gdGhpcyB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBhY3RlZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbWFueSBjcmV3IGFyZSBvbiB0aGlzIFRpbGUuIFRoaXMgbnVtYmVyIHdpbGwgYWx3YXlzIGJlIDw9XG4gICAgICogY3Jld0hlYWx0aC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3JldyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIHRvdGFsIGhlYWx0aCB0aGUgY3JldyBvbiB0aGlzIFRpbGUgaGF2ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3Jld0hlYWx0aCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGdvbGQgdGhpcyBVbml0IGlzIGNhcnJ5aW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBnb2xkITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSG93IG1hbnkgbW9yZSB0aW1lcyB0aGlzIFVuaXQgbWF5IG1vdmUgdGhpcyB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBtb3ZlcyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBQbGF5ZXIgdGhhdCBvd25zIGFuZCBjYW4gY29udHJvbCB0aGlzIFVuaXQsIG9yIHVuZGVmaW5lZCBpZiB0aGUgVW5pdFxuICAgICAqIGlzIG5ldXRyYWwuXG4gICAgICovXG4gICAgcHVibGljIG93bmVyPzogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogKE1lcmNoYW50cyBvbmx5KSBUaGUgcGF0aCB0aGlzIFVuaXQgd2lsbCBmb2xsb3cuIFRoZSBmaXJzdCBlbGVtZW50IGlzXG4gICAgICogdGhlIFRpbGUgdGhpcyBVbml0IHdpbGwgbW92ZSB0byBuZXh0LlxuICAgICAqL1xuICAgIHB1YmxpYyBwYXRoITogVGlsZVtdO1xuXG4gICAgLyoqXG4gICAgICogSWYgYSBzaGlwIGlzIG9uIHRoaXMgVGlsZSwgaG93IG11Y2ggaGVhbHRoIGl0IGhhcyByZW1haW5pbmcuIDAgZm9yIG5vXG4gICAgICogc2hpcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2hpcEhlYWx0aCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIChNZXJjaGFudHMgb25seSkgVGhlIG51bWJlciBvZiB0dXJucyB0aGlzIG1lcmNoYW50IHNoaXAgd29uJ3QgYmUgYWJsZSB0b1xuICAgICAqIG1vdmUuIFRoZXkgd2lsbCBzdGlsbCBhdHRhY2suIE1lcmNoYW50IHNoaXBzIGFyZSBzdHVubmVkIHdoZW4gdGhleSdyZVxuICAgICAqIGF0dGFja2VkLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdHVuVHVybnMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiAoTWVyY2hhbnRzIG9ubHkpIFRoZSBQb3J0IHRoaXMgVW5pdCBpcyBtb3ZpbmcgdG8uXG4gICAgICovXG4gICAgcHVibGljIHRhcmdldFBvcnQ/OiBQb3J0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdGhpcyBVbml0IGlzIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyB0aWxlPzogVGlsZTtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFVuaXQgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SVVuaXRQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvKiogVGhlIFRpbGUgdG8gcGxhY2UgdGhpcyBVbml0IHVwb24uICovXG4gICAgICAgICAgICB0aWxlOiBUaWxlO1xuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG5cbiAgICAgICAgdGhpcy5hY3RlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY3Jld0hlYWx0aCA9IHRoaXMuY3Jld0hlYWx0aCB8fCAodGhpcy5jcmV3ICogdGhpcy5nYW1lLmNyZXdIZWFsdGgpO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIGF0dGFjay4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIGF0dGFjay5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gV2hldGhlciB0byBhdHRhY2sgJ2NyZXcnIG9yICdzaGlwJy4gQ3JldyBkZWFsIGRhbWFnZSB0b1xuICAgICAqIGNyZXcgYW5kIHNoaXBzIGRlYWwgZGFtYWdlIHRvIHNoaXBzLiBDb25zdW1lcyBhbnkgcmVtYWluaW5nIG1vdmVzLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUF0dGFjayhcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIHRhcmdldDogXCJjcmV3XCIgfCBcInNoaXBcIixcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRBdHRhY2tBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1hdHRhY2sgLS0+PlxuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIsIHRydWUpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBoYXMgbm8gVGlsZSFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGlsZS51bml0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoZXJlIGJlIG5vdGhpbicgZm9yICR7dGhpc30gdG8gYXR0YWNrIG9uICR7dGlsZX0hYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlLnVuaXQub3duZXIgPT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGRvZXNuJ3QgaGF2ZSB0aW1lIGZvciBhIG11dGFueSEgRG9uJ3QgYmUgYXR0YWNraW4nIHllciBvd24hYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXQgPT09IFwiY3Jld1wiKSB7XG4gICAgICAgICAgICBpZiAodGlsZS51bml0LmNyZXcgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBoYXMgZ290IG5vIGNyZXcgZm9yIHlvdSB0byBhdHRhY2shYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy8gdGFyZ2V0ID09PSBcInNoaXBcIlxuICAgICAgICAgICAgaWYgKHRpbGUudW5pdC5zaGlwSGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYFRoZXJlIGJlIG5vIHNoaXAgZm9yICR7dGhpc30gdG8gYXR0YWNrLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zaGlwSGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIG5vIHNoaXAgdG8gcGVyZm9ybSB0aGUgYXR0YWNrLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkeCA9IHRoaXMudGlsZS54IC0gdGlsZS54O1xuICAgICAgICBjb25zdCBkeSA9IHRoaXMudGlsZS55IC0gdGlsZS55O1xuICAgICAgICBjb25zdCBkaXN0U3EgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSB0YXJnZXQgPT09IFwiY3Jld1wiXG4gICAgICAgICAgICA/IFwiY3Jld1JhbmdlXCJcbiAgICAgICAgICAgIDogXCJzaGlwUmFuZ2VcIjtcbiAgICAgICAgaWYgKGRpc3RTcSA+ICh0aGlzLmdhbWVbcmFuZ2VdICoqIDIpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXNuJ3QgaW4gcmFuZ2UgZm9yIHRoYXQgYXR0YWNrLiBZZSBkb24ndCB3YW5uYSBmaXJlIGJsaW5kbHkgaW50byB0aGUgd2luZCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtYXR0YWNrIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2tzIGVpdGhlciB0aGUgJ2NyZXcnIG9yICdzaGlwJyBvbiBhIFRpbGUgaW4gcmFuZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gYXR0YWNrLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBXaGV0aGVyIHRvIGF0dGFjayAnY3Jldycgb3IgJ3NoaXAnLiBDcmV3IGRlYWwgZGFtYWdlIHRvXG4gICAgICogY3JldyBhbmQgc2hpcHMgZGVhbCBkYW1hZ2UgdG8gc2hpcHMuIENvbnN1bWVzIGFueSByZW1haW5pbmcgbW92ZXMuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgYXR0YWNrZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgYXR0YWNrKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgdGlsZTogVGlsZSxcbiAgICAgICAgdGFyZ2V0OiBcImNyZXdcIiB8IFwic2hpcFwiLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRhY2sgLS0+PlxuXG4gICAgICAgIGlmICghdGlsZS51bml0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0aWxlIGhhcyBubyB1bml0LCBzaG91bGQgYmUgaW1wb3NzaWJsZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkZWFkQ3JldyA9IDA7XG4gICAgICAgIGxldCBkZWFkU2hpcHMgPSAwO1xuICAgICAgICBsZXQgZ29sZCA9IDA7XG4gICAgICAgIGNvbnN0IG1lcmNoYW50ID0gQm9vbGVhbih0aWxlLnVuaXQudGFyZ2V0UG9ydCk7XG4gICAgICAgIGNvbnN0IG5ldXRyYWwgPSAhbWVyY2hhbnQgJiYgIXRpbGUudW5pdC5vd25lcjtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gXCJjcmV3XCIpIHtcbiAgICAgICAgICAgIC8vIENyZXcgYXR0YWNraW5nIGNyZXdcbiAgICAgICAgICAgIHRpbGUudW5pdC5jcmV3SGVhbHRoIC09IHRoaXMuZ2FtZS5jcmV3RGFtYWdlICogdGhpcy5jcmV3O1xuICAgICAgICAgICAgdGlsZS51bml0LmNyZXdIZWFsdGggPSBNYXRoLm1heCgwLCB0aWxlLnVuaXQuY3Jld0hlYWx0aCk7XG5cbiAgICAgICAgICAgIC8vIEZvciBjb3VudGluZyB0aGUgZGVhZCBhY2N1cmF0ZWx5XG4gICAgICAgICAgICBpZiAodGlsZS51bml0LmNyZXcgPiB0aWxlLnVuaXQuY3Jld0hlYWx0aCkge1xuICAgICAgICAgICAgICAgIGRlYWRDcmV3ID0gdGlsZS51bml0LmNyZXcgLSB0aWxlLnVuaXQuY3Jld0hlYWx0aDtcbiAgICAgICAgICAgICAgICB0aWxlLnVuaXQuY3JldyA9IHRpbGUudW5pdC5jcmV3SGVhbHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgY3JldyB3YXMgY29tcGxldGVseSBkZXN0cm95ZWRcbiAgICAgICAgICAgIGlmICh0aWxlLnVuaXQuY3Jld0hlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbGUudW5pdC5zaGlwSGVhbHRoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ29sZCArPSB0aWxlLnVuaXQuZ29sZDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBNYXJrIGl0IGFzIGRlYWRcbiAgICAgICAgICAgICAgICAgICAgdGlsZS51bml0LnRpbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUudW5pdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUudW5pdC5vd25lciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGlsZS51bml0LnNoaXBIZWFsdGggPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBpdCdzIG5vdCBhIG1lcmNoYW50IHNoaXAgYW55bW9yZSBlaXRoZXJcbiAgICAgICAgICAgICAgICAgICAgdGlsZS51bml0LnRhcmdldFBvcnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRpbGUudW5pdC5wYXRoLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU2hpcCBhdHRhY2tpbmcgc2hpcFxuICAgICAgICAgICAgdGlsZS51bml0LnNoaXBIZWFsdGggLT0gdGhpcy5nYW1lLnNoaXBEYW1hZ2U7XG4gICAgICAgICAgICB0aWxlLnVuaXQuc2hpcEhlYWx0aCA9IE1hdGgubWF4KDAsIHRpbGUudW5pdC5zaGlwSGVhbHRoKTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgc2hpcCB3YXMgZGVzdHJveWVkXG4gICAgICAgICAgICBpZiAodGlsZS51bml0LnNoaXBIZWFsdGggPD0gMCkge1xuICAgICAgICAgICAgICAgIGRlYWRTaGlwcyArPSAxO1xuICAgICAgICAgICAgICAgIGdvbGQgKz0gdGlsZS51bml0LmdvbGQ7XG4gICAgICAgICAgICAgICAgZGVhZENyZXcgKz0gdGlsZS51bml0LmNyZXc7XG5cbiAgICAgICAgICAgICAgICAvLyBNYXJrIGl0IGFzIGRlYWRcbiAgICAgICAgICAgICAgICB0aWxlLnVuaXQudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aWxlLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbmZhbXlcblxuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nb2xkICs9IGdvbGQ7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBpbmZhbXkgZmFjdG9yXG4gICAgICAgIGxldCBmYWN0b3IgPSAxO1xuICAgICAgICBpZiAoIW1lcmNoYW50KSB7XG4gICAgICAgICAgICAvLyBDYWxjdWxhdGUgZWFjaCBwbGF5ZXIncyBuZXQgd29ydGhcbiAgICAgICAgICAgIGNvbnN0IGFsbHlXb3J0aCA9IHBsYXllci5uZXRXb3J0aCgpICsgcGxheWVyLmdvbGQgLSBnb2xkO1xuICAgICAgICAgICAgY29uc3Qgb3Bwb25lbnRXb3J0aCA9IChcbiAgICAgICAgICAgICAgICBwbGF5ZXIub3Bwb25lbnQubmV0V29ydGgoKSArIHBsYXllci5vcHBvbmVudC5nb2xkICsgZ29sZFxuICAgICAgICAgICAgKSArIGRlYWRDcmV3ICogdGhpcy5nYW1lLmNyZXdDb3N0ICsgZGVhZFNoaXBzICogdGhpcy5nYW1lLnNoaXBDb3N0O1xuXG4gICAgICAgICAgICBpZiAoYWxseVdvcnRoID4gb3Bwb25lbnRXb3J0aCkge1xuICAgICAgICAgICAgICAgIGZhY3RvciA9IDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFsbHlXb3J0aCA8IG9wcG9uZW50V29ydGgpIHtcbiAgICAgICAgICAgICAgICBmYWN0b3IgPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGluZmFteVxuICAgICAgICBsZXQgaW5mYW15ID0gKGRlYWRDcmV3ICogdGhpcy5nYW1lLmNyZXdDb3N0ICsgZGVhZFNoaXBzICogdGhpcy5nYW1lLnNoaXBDb3N0KSAqIGZhY3RvcjtcblxuICAgICAgICBpZiAoIW5ldXRyYWwpIHtcbiAgICAgICAgICAgIGlmICghbWVyY2hhbnQpIHtcbiAgICAgICAgICAgICAgICBpbmZhbXkgPSBNYXRoLm1pbihpbmZhbXksIHBsYXllci5vcHBvbmVudC5pbmZhbXkpO1xuICAgICAgICAgICAgICAgIHBsYXllci5vcHBvbmVudC5pbmZhbXkgLT0gaW5mYW15O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwbGF5ZXIuaW5mYW15ICs9IGluZmFteTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXJjaGFudCAmJiB0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIHRpbGUudW5pdC5zdHVuVHVybnMgPSAyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dGFjayAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBidXJ5LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBIb3cgbXVjaCBnb2xkIHRoaXMgVW5pdCBzaG91bGQgYnVyeS4gQW1vdW50cyA8PSAwIHdpbGxcbiAgICAgKiBidXJ5IGFzIG11Y2ggYXMgcG9zc2libGUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlQnVyeShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGFtb3VudDogbnVtYmVyLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdEJ1cnlBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1idXJ5IC0tPj5cblxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyKTtcbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gaGFzIG5vIFRpbGUhYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aWxlLnR5cGUgIT09IFwibGFuZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuJ3QgYnVyeSBnb2xkIG9uIHRoZSBzZWEuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbGUucG9ydCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IGJ1cnkgZ29sZCBpbiBwb3J0cy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGlsZS5nb2xkID49IHRoaXMuZ2FtZS5zZXR0aW5ncy5tYXhUaWxlR29sZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IGJ1cnkgbG9vdCBvbiBhIHRpbGUgd2l0aCB0aGUgbWF4IGFtb3VudCBvZiBib290eSAoJHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuc2V0dGluZ3MubWF4VGlsZUdvbGRcbiAgICAgICAgICAgIH0pLmA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkeCA9IHRoaXMudGlsZS54IC0gcGxheWVyLnBvcnQudGlsZS54O1xuICAgICAgICBjb25zdCBkeSA9IHRoaXMudGlsZS55IC0gcGxheWVyLnBvcnQudGlsZS55O1xuICAgICAgICBjb25zdCBkaXN0U3EgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgICAgaWYgKGRpc3RTcSA8IHRoaXMuZ2FtZS5taW5JbnRlcmVzdERpc3RhbmNlICogdGhpcy5nYW1lLm1pbkludGVyZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyB0b28gY2xvc2UgdG8gaG9tZSEgWWUgZ290dGEgYnVyeSB5ZXIgbG9vdCBmYXIgYXdheSBmcm9tIHllciBwb3J0LmA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0dWFsQW1vdW50ID0gYW1vdW50IDw9IDBcbiAgICAgICAgICAgID8gdGhpcy5nb2xkXG4gICAgICAgICAgICA6IE1hdGgubWluKHRoaXMuZ29sZCwgYW1vdW50KTtcblxuICAgICAgICBhY3R1YWxBbW91bnQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5zZXR0aW5ncy5tYXhUaWxlR29sZCAtIHRoaXMudGlsZS5nb2xkLFxuICAgICAgICAgICAgYWN0dWFsQW1vdW50LFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChhY3R1YWxBbW91bnQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGRvZXNuJ3QgaGF2ZSBhbnkgZ29sZCB0byBidXJ5ISBZZSBwb29yIHNjYWxseXdhZy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHsgYW1vdW50OiBhY3R1YWxBbW91bnQgfTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1idXJ5IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCdXJpZXMgZ29sZCBvbiB0aGlzIFVuaXQncyBUaWxlLiBHb2xkIG11c3QgYmUgYSBjZXJ0YWluIGRpc3RhbmNlIGF3YXlcbiAgICAgKiBmb3IgaXQgdG8gZ2V0IGludGVyZXN0IChHYW1lLm1pbkludGVyZXN0RGlzdGFuY2UpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gYW1vdW50IC0gSG93IG11Y2ggZ29sZCB0aGlzIFVuaXQgc2hvdWxkIGJ1cnkuIEFtb3VudHMgPD0gMCB3aWxsXG4gICAgICogYnVyeSBhcyBtdWNoIGFzIHBvc3NpYmxlLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGJ1cmllZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBidXJ5KHBsYXllcjogUGxheWVyLCBhbW91bnQ6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBidXJ5IC0tPj5cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXN9IGhhcyBubyBUaWxlIHRvIGJ1cnkgZ29sZCFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGlsZS5nb2xkICs9IGFtb3VudDtcbiAgICAgICAgdGhpcy5nb2xkIC09IGFtb3VudDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYnVyeSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBkZXBvc2l0LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZFxuICAgICAqIGluIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZ1xuICAgICAqIHRoZW0gd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIGdvbGQgdG8gZGVwb3NpdC4gQW1vdW50cyA8PSAwIHdpbGwgZGVwb3NpdFxuICAgICAqIGFsbCB0aGUgZ29sZCBvbiB0aGlzIFVuaXQuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlRGVwb3NpdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGFtb3VudDogbnVtYmVyID0gMCxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXREZXBvc2l0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGVwb3NpdCAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllcik7XG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXN9IGhhcyBubyBUaWxlIWApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGlsZXMgPSBbIHRoaXMudGlsZSwgLi4udGhpcy50aWxlLmdldE5laWdoYm9ycygpIF07XG4gICAgICAgIGNvbnN0IGZvdW5kID0gdGlsZXMuZmluZChcbiAgICAgICAgICAgICh0KSA9PiBCb29sZWFuKHQgJiYgdC5wb3J0ICYmIHQucG9ydC5vd25lciAhPT0gcGxheWVyLm9wcG9uZW50KSxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gYEFyciwgJHt0aGlzfSBoYXMgdG8gZGVwb3NpdCB5ZXIgYm9vdHkgaW4geWVyIGhvbWUgcG9ydCBvciBhIG1lcmNoYW50IHBvcnQsIG1hdGV5IWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nb2xkIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgU2hpdmVyIG1lIHRpbWJlcnMhICR7dGhpc30gZG9lc24ndCBoYXZlIGFueSBib290eSB0byBkZXBvc2l0IWA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0dWFsQW1vdW50ID0gTWF0aC5taW4oTWF0aC5tYXgoYW1vdW50LCAwKSwgdGhpcy5nb2xkKTtcbiAgICAgICAgaWYgKGFjdHVhbEFtb3VudCA8PSAwKSB7XG4gICAgICAgICAgICBhY3R1YWxBbW91bnQgPSB0aGlzLmdvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geyBhbW91bnQ6IGFjdHVhbEFtb3VudCB9O1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWRlcG9zaXQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFB1dHMgZ29sZCBpbnRvIGFuIGFkamFjZW50IFBvcnQuIElmIHRoYXQgUG9ydCBpcyB0aGUgUGxheWVyJ3MgcG9ydCwgdGhlXG4gICAgICogZ29sZCBpcyBhZGRlZCB0byB0aGF0IFBsYXllci4gSWYgdGhhdCBQb3J0IGlzIG93bmVkIGJ5IG1lcmNoYW50cywgaXRcbiAgICAgKiBhZGRzIHRvIHRoYXQgUG9ydCdzIGludmVzdG1lbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgYW1vdW50IG9mIGdvbGQgdG8gZGVwb3NpdC4gQW1vdW50cyA8PSAwIHdpbGwgZGVwb3NpdFxuICAgICAqIGFsbCB0aGUgZ29sZCBvbiB0aGlzIFVuaXQuXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBzdWNjZXNzZnVsbHkgZGVwb3NpdGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGRlcG9zaXQoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGRlcG9zaXQgLS0+PlxuXG4gICAgICAgIHRoaXMuZ29sZCAtPSBhbW91bnQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBoYXMgbm8gVGlsZSB0byBkZXBvc2l0IGdvbGQhYCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0aWxlcyA9IFsgdGhpcy50aWxlLCAuLi50aGlzLnRpbGUuZ2V0TmVpZ2hib3JzKCkgXTtcbiAgICAgICAgbGV0IHRpbGUgPSB0aWxlcy5maW5kKFxuICAgICAgICAgICAgKHQpID0+IEJvb2xlYW4odCAmJiB0LnBvcnQgJiYgdC5wb3J0Lm93bmVyICE9PSBwbGF5ZXIub3Bwb25lbnQpLFxuICAgICAgICApOyAvLyB3aWxsIGJlIGZvdW5kIGFzIHdlIHZhbGlkYXRlZCBpdCBhYm92ZVxuXG4gICAgICAgIGlmICh0aWxlKSB7XG4gICAgICAgICAgICBwbGF5ZXIuZ29sZCArPSBhbW91bnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIG1lcmNoYW50J3MgcG9ydFxuICAgICAgICAgICAgdGlsZSA9IHRpbGVzLmZpbmQoKHQpID0+IEJvb2xlYW4odCAmJiB0LnBvcnQgJiYgIXQucG9ydC5vd25lcikpO1xuICAgICAgICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGZpbmQgcGVyY2hhbnQgcG9ydCB0aWxlIHRvIGRlcG9zaXQgbW9uZXkgb24hXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRpbGUucG9ydCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aWxlfSBoYXMgbm8gcG9ydCB0byBkZXBvc2l0IG1vbmV5IG9uIHRvIWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGlsZS5wb3J0LmludmVzdG1lbnQgKz0gYW1vdW50O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGRlcG9zaXQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgZGlnLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBIb3cgbXVjaCBnb2xkIHRoaXMgVW5pdCBzaG91bGQgdGFrZS4gQW1vdW50cyA8PSAwIHdpbGxcbiAgICAgKiBkaWcgdXAgYXMgbXVjaCBhcyBwb3NzaWJsZS5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVEaWcoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0RGlnQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGlnIC0tPj5cblxuICAgICAgICBjb25zdCByZWFzb24gPSB0aGlzLmludmFsaWRhdGUocGxheWVyKTtcbiAgICAgICAgaWYgKHJlYXNvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlYXNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpc30gaGFzIG5vIFRpbGUhYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVja2luZyB0byBzZWUgaWYgdGhlIHRpbGUgaXMgYW55dGhpbmcgb3RoZXIgdGhhbiBhIGxhbmQgdHlwZS5cbiAgICAgICAgaWYgKHRoaXMudGlsZS50eXBlICE9PSBcImxhbmRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IGRpZyBpbiB0aGUgc2VhIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVja2luZyB0byBzZWUgaWYgdGhlIHRpbGUgaGFzIGdvbGQgdG8gYmUgZHVnIHVwLlxuICAgICAgICBpZiAodGhpcy50aWxlLmdvbGQgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgVGhlcmUgYmUgbm8gYm9vdHkgZm9yICR7dGhpc30gdG8gcGx1bmRlci5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYWN0dWFsQW1vdW50ID0gYW1vdW50IDw9IDAgfHwgYW1vdW50ID4gdGhpcy50aWxlLmdvbGRcbiAgICAgICAgICAgID8gdGhpcy50aWxlLmdvbGRcbiAgICAgICAgICAgIDogYW1vdW50O1xuXG4gICAgICAgIHJldHVybiB7IGFtb3VudDogYWN0dWFsQW1vdW50IH07XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZGlnIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEaWdzIHVwIGdvbGQgb24gdGhpcyBVbml0J3MgVGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGFtb3VudCAtIEhvdyBtdWNoIGdvbGQgdGhpcyBVbml0IHNob3VsZCB0YWtlLiBBbW91bnRzIDw9IDAgd2lsbFxuICAgICAqIGRpZyB1cCBhcyBtdWNoIGFzIHBvc3NpYmxlLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IGR1ZyB1cCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBkaWcoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDAsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGRpZyAtLT4+XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBoYXMgbm8gVGlsZSB0byBkaWchYCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGRzIGFtb3VudCByZXF1ZXN0ZWQgdG8gVW5pdC5cbiAgICAgICAgdGhpcy5nb2xkICs9IGFtb3VudDtcbiAgICAgICAgLy8gU3VidHJhY3RzIGFtb3VudCBmcm9tIFRpbGUncyBnb2xkXG4gICAgICAgIHRoaXMudGlsZS5nb2xkIC09IGFtb3VudDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogZGlnIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIG1vdmUuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0aGlzIFVuaXQgc2hvdWxkIG1vdmUgdG8uXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlTW92ZShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0TW92ZUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW1vdmUgLS0+PlxuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2hpcCA9IHRoaXMuc2hpcEhlYWx0aCA+IDA7XG4gICAgICAgIGlmICh0aGlzLm1vdmVzIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSdzIGNyZXcgYXJlIHRvbyB0aXJlZCB0byB0cmF2ZWwgYW55IGZ1cnRoZXIuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuJ3QgbW92ZSBhZnRlciBhY3RpbmcuIFRoZSBtZW4gYXJlIHRvbyB0aXJlZCFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBoYXMgbm8gVGlsZSFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlLmhhc05laWdoYm9yKHRpbGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gYmUgdG9vIGZhciBmb3IgJHt0aGlzfSB0byBtb3ZlIHRvLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGlsZS51bml0ICYmIHRpbGUudW5pdC5vd25lciAmJiB0aWxlLnVuaXQub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IHJlZnVzZXMgdG8gc2hhcmUgdGhlIHNhbWUgZ3JvdW5kIHdpdGggYSBsaXZpbmcgZm9lLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXNoaXAgJiYgdGlsZS50eXBlID09PSBcIndhdGVyXCIgJiYgIXRpbGUucG9ydCAmJiAhKHRpbGUudW5pdCAmJiB0aWxlLnVuaXQuc2hpcEhlYWx0aCA+IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIG5vIHNoaXAgYW5kIGNhbid0IHdhbGsgb24gd2F0ZXIhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaGlwICYmIHRpbGUudHlwZSA9PT0gXCJsYW5kXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBgTGFuZCBobyEgJHt0aGlzfSBiZWxvbmdzIGluIHRoZSBzZWEhIFVzZSAnVW5pdC5zcGxpdCcgaWYgeWUgd2FudCB0byBtb3ZlIGp1c3QgeWVyIGNyZXcgYXNob3JlLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hpcCAmJiB0aWxlLnVuaXQgJiYgdGlsZS51bml0LnNoaXBIZWFsdGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYFRoZXJlIGJlIGEgc2hpcCB0aGVyZS4gSWYgeWUgbW92ZSAke3RoaXN9IHRvICR7dGlsZX0sIHllJ2xsIHNjdXR0bGUgeWVyIHNoaXAhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2hpcCAmJiB0aWxlLnVuaXQgJiYgdGlsZS51bml0LnNoaXBIZWFsdGggPiAwICYmIHRoaXMuYWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBhbHJlYWR5IGFjdGVkLCBhbmQgaXQgYmUgdG9vIHRpcmVkIHRvIGJvYXJkIHRoYXQgc2hpcC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUucG9ydCAmJiB0aWxlLnBvcnQub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IGVudGVyIGFuIGVuZW15IHBvcnQhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaGlwICYmIHRpbGUucG9ydCAmJiB0aWxlLnVuaXQgJiYgdGlsZS51bml0LnNoaXBIZWFsdGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2FuJ3QgbW92ZSBpbnRvIHllciBwb3J0LCB5ZSdsbCBzY3V0dGxlIHllciBzaGlwIWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlcyB0aGlzIFVuaXQgZnJvbSBpdHMgY3VycmVudCBUaWxlIHRvIGFuIGFkamFjZW50IFRpbGUuIElmIHRoaXMgVW5pdFxuICAgICAqIG1lcmdlcyB3aXRoIGFub3RoZXIgb25lLCB0aGUgb3RoZXIgVW5pdCB3aWxsIGJlIGRlc3Ryb3llZCBhbmQgaXRzIHRpbGVcbiAgICAgKiB3aWxsIGJlIHNldCB0byB1bmRlZmluZWQuIE1ha2Ugc3VyZSB0byBjaGVjayB0aGF0IHlvdXIgVW5pdCdzIHRpbGUgaXNcbiAgICAgKiBub3QgdW5kZWZpbmVkIGJlZm9yZSBkb2luZyB0aGluZ3Mgd2l0aCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0aGlzIFVuaXQgc2hvdWxkIG1vdmUgdG8uXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBpdCBtb3ZlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBtb3ZlKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vdmUgLS0+PlxuXG4gICAgICAgIGlmICh0aWxlLnVuaXQpIHtcbiAgICAgICAgICAgIC8vIGNvbWJpbmUgd2l0aCB0aGF0IHVuaXRcbiAgICAgICAgICAgIGNvbnN0IG90aGVyID0gdGlsZS51bml0O1xuICAgICAgICAgICAgb3RoZXIudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRpbGUudW5pdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRpbGUgPSB0aWxlO1xuXG4gICAgICAgICAgICB0aGlzLmdvbGQgKz0gb3RoZXIuZ29sZDtcbiAgICAgICAgICAgIHRoaXMuY3JldyArPSBvdGhlci5jcmV3O1xuICAgICAgICAgICAgdGhpcy5jcmV3SGVhbHRoICs9IG90aGVyLmNyZXdIZWFsdGg7XG4gICAgICAgICAgICB0aGlzLnNoaXBIZWFsdGggKz0gb3RoZXIuc2hpcEhlYWx0aDtcbiAgICAgICAgICAgIHRoaXMuYWN0ZWQgPSB0aGlzLmFjdGVkIHx8IG90aGVyLmFjdGVkIHx8IG90aGVyLnNoaXBIZWFsdGggPiAwO1xuICAgICAgICAgICAgdGhpcy5tb3ZlcyA9IE1hdGgubWluKHRoaXMubW92ZXMgLSAxLCBvdGhlci5tb3Zlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBoYXMgbm8gVGlsZSB0byBtb3ZlIGZyb20hYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNb3ZlIHRoaXMgdW5pdCB0byB0aGF0IHRpbGVcbiAgICAgICAgICAgIHRoaXMudGlsZS51bml0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy50aWxlID0gdGlsZTtcbiAgICAgICAgICAgIHRpbGUudW5pdCA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLm1vdmVzIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbW92ZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciByZXN0LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVJlc3QocGxheWVyOiBQbGF5ZXIpOiB2b2lkIHwgc3RyaW5nIHwgSVVuaXRSZXN0QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmVzdCAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdHJ1ZSk7XG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXN9IGhhcyBubyBUaWxlIWApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgaXQncyBpbiByYW5nZVxuICAgICAgICBjb25zdCByYWRpdXMgPSB0aGlzLmdhbWUucmVzdFJhbmdlO1xuICAgICAgICBpZiAoKCh0aGlzLnRpbGUueCAtIHBsYXllci5wb3J0LnRpbGUueCkgKiogMiArICh0aGlzLnRpbGUueSAtIHBsYXllci5wb3J0LnRpbGUueSkgKiogMikgPiByYWRpdXMgKiogMikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGhhcyBubyBuZWFyYnkgcG9ydCB0byByZXN0IGF0LiBObyBob21lIHRhdmVybiBtZWFucyBubyBmcmVlIHJ1bSFgO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmVzdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVnZW5lcmF0ZXMgdGhpcyBVbml0J3MgaGVhbHRoLiBNdXN0IGJlIHVzZWQgaW4gcmFuZ2Ugb2YgYSBwb3J0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSByZXN0ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgcmVzdChwbGF5ZXI6IFBsYXllcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiByZXN0IC0tPj5cblxuICAgICAgICAvLyBIZWFsIHRoZSB1bml0c1xuICAgICAgICB0aGlzLmNyZXdIZWFsdGggKz0gTWF0aC5jZWlsKHRoaXMuZ2FtZS5jcmV3SGVhbHRoICogdGhpcy5nYW1lLmhlYWxGYWN0b3IpICogdGhpcy5jcmV3O1xuICAgICAgICB0aGlzLmNyZXdIZWFsdGggPSBNYXRoLm1pbih0aGlzLmNyZXdIZWFsdGgsIHRoaXMuY3JldyAqIHRoaXMuZ2FtZS5jcmV3SGVhbHRoKTtcbiAgICAgICAgaWYgKHRoaXMuc2hpcEhlYWx0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2hpcEhlYWx0aCArPSBNYXRoLmNlaWwodGhpcy5nYW1lLnNoaXBIZWFsdGggKiB0aGlzLmdhbWUuaGVhbEZhY3Rvcik7XG4gICAgICAgICAgICB0aGlzLnNoaXBIZWFsdGggPSBNYXRoLm1pbih0aGlzLnNoaXBIZWFsdGgsIHRoaXMuZ2FtZS5zaGlwSGVhbHRoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdW5pdCBjYW4ndCBkbyBhbnl0aGluZyBlbHNlIHRoaXMgdHVyblxuICAgICAgICB0aGlzLmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb3ZlcyA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJlc3QgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3Igc3BsaXQuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBtb3ZlIHRoZSBjcmV3IHRvLlxuICAgICAqIEBwYXJhbSBhbW91bnQgLSBUaGUgbnVtYmVyIG9mIGNyZXcgdG8gbW92ZSBvbnRvIHRoYXQgVGlsZS4gQW1vdW50IDw9IDBcbiAgICAgKiB3aWxsIG1vdmUgYWxsIHRoZSBjcmV3IHRvIHRoYXQgVGlsZS5cbiAgICAgKiBAcGFyYW0gZ29sZCAtIFRoZSBhbW91bnQgb2YgZ29sZCB0aGUgY3JldyBzaG91bGQgdGFrZSB3aXRoIHRoZW0uIEdvbGQgPFxuICAgICAqIDAgd2lsbCBtb3ZlIGFsbCB0aGUgZ29sZCB0byB0aGF0IFRpbGUuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlU3BsaXQoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICAgICBhbW91bnQ6IG51bWJlciA9IDEsXG4gICAgICAgIGdvbGQ6IG51bWJlciA9IDAsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElVbml0U3BsaXRBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGxpdCAtLT4+XG5cbiAgICAgICAgY29uc3QgcmVhc29uID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllcik7XG4gICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG11c3QgYmUgb24gYSBUaWxlIWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4ndCBzcGxpdCBvbnRvIG51bGwhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgY3JldyBoYXMgYSBtb3ZlIHRvIG1vdmVcbiAgICAgICAgaWYgKHRoaXMubW92ZXMgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IHNwbGl0IGNhdXNlIHRoZXkgYmUgb3V0IG9mIG1vdmVzLmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhleSBoYXZlIGFscmVhZHkgYWN0ZWQuXG4gICAgICAgIGlmICh0aGlzLmFjdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY3JldyBhcmUgdG9vIHRpcmVkIHRvIHNwbGl0IWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgaXQgaXMgbm90IG9uZSBvZiB0aGUgdGlsZXMgYXJvdW5kIGluIHRoZSBjdXJyZW50IGRpcmVjdGlvblxuICAgICAgICBpZiAoIXRoaXMudGlsZS5oYXNOZWlnaGJvcih0aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGJlIHRvbyBmYXIgZm9yICR7dGhpc30gdG8gc3BsaXQgdG8uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0YXJnZXQgdGlsZSBpcyBhIHZhbGlkIHRpbGVcbiAgICAgICAgaWYgKHRpbGUudHlwZSA9PT0gXCJ3YXRlclwiICYmICF0aWxlLnVuaXQgJiYgIXRpbGUucG9ydCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IHNwbGl0IG9udG8gd2F0ZXIhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aWxlLnVuaXQgJiYgKHRpbGUudW5pdC5vd25lciA9PT0gcGxheWVyLm9wcG9uZW50IHx8IHRpbGUudW5pdC50YXJnZXRQb3J0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IHNwbGl0IG9udG8gZW5lbXkgcGlyYXRlcyFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUucG9ydCAmJiB0aWxlLnBvcnQub3duZXIgIT09IHBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbid0IHNwbGl0IG9udG8gZW5lbXkgcG9ydHMhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkanVzdCB0aGUgYW1vdW50IG9mIGNyZXcgdG8gc3BsaXRcbiAgICAgICAgY29uc3QgYWN0dWFsQW1vdW50ID0gYW1vdW50IDw9IDBcbiAgICAgICAgICAgID8gdGhpcy5jcmV3XG4gICAgICAgICAgICA6IE1hdGgubWluKGFtb3VudCwgdGhpcy5jcmV3KTtcblxuICAgICAgICAvLyBBZGp1c3QgdGhlIGFtb3VudCBvZiBnb2xkIHRvIHNwbGl0XG4gICAgICAgIGNvbnN0IGFjdHVhbEdvbGQgPSAoKGFtb3VudCA9PT0gdGhpcy5jcmV3ICYmIHRoaXMuc2hpcEhlYWx0aCA8PSAwKSB8fCBnb2xkIDwgMClcbiAgICAgICAgICAgID8gdGhpcy5nb2xkXG4gICAgICAgICAgICA6IE1hdGgubWluKGdvbGQsIHRoaXMuZ29sZCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFtb3VudDogYWN0dWFsQW1vdW50LFxuICAgICAgICAgICAgZ29sZDogYWN0dWFsR29sZCxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1zcGxpdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZXMgYSBudW1iZXIgb2YgY3JldyBmcm9tIHRoaXMgVW5pdCB0byB0aGUgZ2l2ZW4gVGlsZS4gVGhpcyB3aWxsXG4gICAgICogY29uc3VtZSBhIG1vdmUgZnJvbSB0aG9zZSBjcmV3LlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHRvIG1vdmUgdGhlIGNyZXcgdG8uXG4gICAgICogQHBhcmFtIGFtb3VudCAtIFRoZSBudW1iZXIgb2YgY3JldyB0byBtb3ZlIG9udG8gdGhhdCBUaWxlLiBBbW91bnQgPD0gMFxuICAgICAqIHdpbGwgbW92ZSBhbGwgdGhlIGNyZXcgdG8gdGhhdCBUaWxlLlxuICAgICAqIEBwYXJhbSBnb2xkIC0gVGhlIGFtb3VudCBvZiBnb2xkIHRoZSBjcmV3IHNob3VsZCB0YWtlIHdpdGggdGhlbS4gR29sZCA8XG4gICAgICogMCB3aWxsIG1vdmUgYWxsIHRoZSBnb2xkIHRvIHRoYXQgVGlsZS5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHN1Y2Nlc3NmdWxseSBzcGxpdCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBzcGxpdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIGFtb3VudDogbnVtYmVyID0gMSxcbiAgICAgICAgZ29sZDogbnVtYmVyID0gMCxcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc3BsaXQgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbml0IHNwbGl0IGluIGludmFsaWQgc3RhdGUhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3JpZ2luYWxDcmV3ID0gdGhpcy5jcmV3O1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyB1bml0XG4gICAgICAgIGNvbnN0IG5ld1VuaXQgPSB7XG4gICAgICAgICAgICB0aWxlLFxuICAgICAgICAgICAgZ29sZCxcbiAgICAgICAgICAgIG93bmVyOiBwbGF5ZXIsXG4gICAgICAgICAgICBjcmV3OiBhbW91bnQsXG4gICAgICAgICAgICBtb3ZlczogdGhpcy5tb3ZlcyAtIDEsXG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGJvYXJkaW5nIGEgc2hpcFxuICAgICAgICAgICAgYWN0ZWQ6IHRpbGUudW5pdCAmJiB0aWxlLnVuaXQuc2hpcEhlYWx0aCA+IDAsXG5cbiAgICAgICAgICAgIC8vIENyZXcgaGVhbHRoXG4gICAgICAgICAgICBjcmV3SGVhbHRoOiBhbW91bnQgPT09IHRoaXMuY3Jld1xuICAgICAgICAgICAgICAgID8gdGhpcy5jcmV3SGVhbHRoXG4gICAgICAgICAgICAgICAgOiBNYXRoLmNlaWwoKHRoaXMuY3Jld0hlYWx0aCAvIG9yaWdpbmFsQ3JldykgKiBhbW91bnQpLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1vdmUgdGhlIGNyZXdcbiAgICAgICAgdGhpcy5jcmV3IC09IGFtb3VudDtcblxuICAgICAgICAvLyBBZGp1c3QgdGhlIGFtb3VudCBvZiBnb2xkIHRvIHNwbGl0XG4gICAgICAgIG5ld1VuaXQuZ29sZCA9ICgoYW1vdW50ID09PSB0aGlzLmNyZXcgJiYgdGhpcy5zaGlwSGVhbHRoIDw9IDApIHx8IGdvbGQgPCAwKVxuICAgICAgICAgICAgPyB0aGlzLmdvbGRcbiAgICAgICAgICAgIDogTWF0aC5taW4oZ29sZCwgdGhpcy5nb2xkKTtcbiAgICAgICAgdGhpcy5nb2xkIC09IG5ld1VuaXQuZ29sZDtcblxuICAgICAgICAvLyBDcmV3IGhlYWx0aFxuICAgICAgICBuZXdVbml0LmNyZXdIZWFsdGggPSBhbW91bnQgPT09IHRoaXMuY3Jld1xuICAgICAgICAgICAgPyB0aGlzLmNyZXdIZWFsdGhcbiAgICAgICAgICAgIDogTWF0aC5jZWlsKCh0aGlzLmNyZXdIZWFsdGggLyBvcmlnaW5hbENyZXcpICogYW1vdW50KTtcbiAgICAgICAgdGhpcy5jcmV3SGVhbHRoIC09IG5ld1VuaXQuY3Jld0hlYWx0aCB8fCAwO1xuXG4gICAgICAgIC8vIE93bmVyc2hpcFxuICAgICAgICBpZiAodGhpcy5jcmV3IDw9IDApIHtcbiAgICAgICAgICAgIC8vIERpc2Fzc29jaWF0aW5nIGZyb20gb2xkIFRpbGUgaWYgYWxsIHRoZSBjcmV3IG1vdmVkXG4gICAgICAgICAgICB0aGlzLm93bmVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hpcEhlYWx0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbm8gdW5pdHMgYXJlIGxlZnQgb3ZlciwgcmVtb3ZlIHRoZSB1bml0XG4gICAgICAgICAgICAgICAgdGhpcy50aWxlLnVuaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdGhpcy50aWxlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbWVyZ2luZyB3aXRoIGFub3RoZXIgdW5pdFxuICAgICAgICBpZiAodGlsZS51bml0KSB7XG4gICAgICAgICAgICBjb25zdCBvdGhlciA9IHRpbGUudW5pdDtcbiAgICAgICAgICAgIG90aGVyLm93bmVyID0gcGxheWVyO1xuICAgICAgICAgICAgb3RoZXIuZ29sZCArPSBuZXdVbml0LmdvbGQgfHwgMDtcbiAgICAgICAgICAgIG90aGVyLmNyZXcgKz0gbmV3VW5pdC5jcmV3IHx8IDA7XG4gICAgICAgICAgICBvdGhlci5jcmV3SGVhbHRoICs9IG5ld1VuaXQuY3Jld0hlYWx0aCB8fCAwO1xuICAgICAgICAgICAgb3RoZXIuYWN0ZWQgPSBvdGhlci5hY3RlZCB8fCBvdGhlci5zaGlwSGVhbHRoID4gMDtcbiAgICAgICAgICAgIG90aGVyLm1vdmVzID0gTWF0aC5taW4obmV3VW5pdC5tb3ZlcyB8fCAwLCBvdGhlci5tb3Zlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB1bml0ID0gdGhpcy5nYW1lLm1hbmFnZXIuY3JlYXRlLnVuaXQobmV3VW5pdCk7XG4gICAgICAgICAgICBpZiAoIXVuaXQudGlsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5ldyB1bml0IGlzIG5vdCBvbiBhIFRpbGUgc29tZWhvdyFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aWxlLnVuaXQgPSB1bml0O1xuICAgICAgICAgICAgdGhpcy5nYW1lLm1hbmFnZXIubmV3VW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbGUudW5pdC5vd25lciA9IHBsYXllcjtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc3BsaXQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3Igd2l0aGRyYXcuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkXG4gICAgICogaW4gcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nXG4gICAgICogdGhlbSB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGFtb3VudCAtIFRoZSBhbW91bnQgb2YgZ29sZCB0byB3aXRoZHJhdy4gQW1vdW50cyA8PSAwIHdpbGxcbiAgICAgKiB3aXRoZHJhdyBldmVyeXRoaW5nLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVdpdGhkcmF3KFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgYW1vdW50OiBudW1iZXIgPSAwLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJVW5pdFdpdGhkcmF3QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtd2l0aGRyYXcgLS0+PlxuXG4gICAgICAgIGNvbnN0IHJlYXNvbiA9IHRoaXMuaW52YWxpZGF0ZShwbGF5ZXIpO1xuICAgICAgICBpZiAocmVhc29uKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzfSBoYXMgbm8gVGlsZSFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpbGUgPSBwbGF5ZXIucG9ydC50aWxlO1xuICAgICAgICBpZiAodGhpcy50aWxlICE9PSB0aWxlICYmICF0aGlzLnRpbGUuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBoYXMgdG8gd2l0aGRyYXcgeWVyIGJvb3R5IGZyb20geWVyIGhvbWUgcG9ydCwgbWF0ZXkhYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhY3R1YWxBbW91bnQgPSBhbW91bnQ7XG5cbiAgICAgICAgaWYgKGFjdHVhbEFtb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAvLyBUYWtlIGFsbCB0aGUgZ29sZFxuICAgICAgICAgICAgYWN0dWFsQW1vdW50ID0gcGxheWVyLmdvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYXAgdGhlIGFtb3VudCB0YWtlbiBieSBob3cgbXVjaCBnb2xkIHRoZXkgaGF2ZVxuICAgICAgICAvLyAoc28gdGhleSBjYW4ndCB3aXRoZHJhdyBtb3JlIGdvbGQgdGhhbiB0aGVpciBwbGF5ZXIgaGFzKVxuICAgICAgICBhY3R1YWxBbW91bnQgPSBNYXRoLm1pbihhY3R1YWxBbW91bnQsIHBsYXllci5nb2xkKTtcblxuICAgICAgICByZXR1cm4geyBhbW91bnQ6IGFjdHVhbEFtb3VudCB9O1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXdpdGhkcmF3IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBnb2xkIGZyb20gdGhlIFBsYXllci4gWW91IGNhbiBvbmx5IHdpdGhkcmF3IGZyb20geW91ciBvd24gUG9ydC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGFtb3VudCAtIFRoZSBhbW91bnQgb2YgZ29sZCB0byB3aXRoZHJhdy4gQW1vdW50cyA8PSAwIHdpbGxcbiAgICAgKiB3aXRoZHJhdyBldmVyeXRoaW5nLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgc3VjY2Vzc2Z1bGx5IHdpdGhkcmF3biwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyB3aXRoZHJhdyhcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIGFtb3VudDogbnVtYmVyID0gMCxcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogd2l0aGRyYXcgLS0+PlxuXG4gICAgICAgIHRoaXMuZ29sZCArPSBhbW91bnQ7XG4gICAgICAgIHBsYXllci5nb2xkIC09IGFtb3VudDtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogd2l0aGRyYXcgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBUcmllcyB0byBpbnZhbGlkYXRlIGFyZ3MgZm9yIGFuIGFjdGlvbiBmdW5jdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIHRoZSBwbGF5ZXIgY29tbWFuZGluZyB0aGlzIFVuaXRcbiAgICAgKiBAcGFyYW0gY2hlY2tBY3Rpb24gLSB0cnVlIHRvIGNoZWNrIGlmIHRoaXMgVW5pdCBoYXMgYW4gYWN0aW9uXG4gICAgICogQHJldHVybnMgdGhlIHJlYXNvbiB0aGlzIGlzIGludmFsaWQsIHVuZGVmaW5lZCBpZiBsb29rcyB2YWxpZCBzbyBmYXJcbiAgICAgKi9cbiAgICBwcml2YXRlIGludmFsaWRhdGUocGxheWVyOiBQbGF5ZXIsIGNoZWNrQWN0aW9uPzogdHJ1ZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghcGxheWVyIHx8IHBsYXllciAhPT0gdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgQXZhc3QsIGl0IGlzbid0IHllciB0dXJuLCAke3BsYXllcn0uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpc24ndCBhbW9uZyB5ZXIgY3Jldy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoZWNrQWN0aW9uICYmIHRoaXMuYWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW4ndCBwZXJmb3JtIGFub3RoZXIgYWN0aW9uIHRoaXMgdHVybi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUgfHwgdGhpcy5jcmV3ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYFllIGNhbid0IGNvbnRyb2wgJHt0aGlzfS5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=