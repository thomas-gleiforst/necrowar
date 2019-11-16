"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
/**
 * A person on the map that can move around and interact within the saloon.
 */
class Cowboy extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Cowboy is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.owner = args.owner;
        this.tile = args.tile;
        this.canMove = true;
        this.health = 10;
        this.tile.cowboy = this;
        // NOTE: don't add to the cowboys arrays so it doesn't resize during a
        // player's turn
        this.manager.spawnedCowboys.push(this); // just tell the game we spawned
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * String coercion override.
     *
     * @returns string stating what this cowboy is
     */
    toString() {
        return `'${this.job}' ${this.gameObjectName} #${this.id}`;
    }
    /**
     * Damages this cowboy for some amount of damage, setting isDead if it dies
     *
     * @param damage How much damage to do to this
     */
    damage(damage) {
        this.health = Math.max(0, this.health - damage);
        if (this.health === 0) {
            this.isDead = true;
            this.canMove = false;
            this.drunkDirection = "";
            this.isDrunk = false;
            this.turnsBusy = this.game.maxTurns;
            if (this.tile) {
                this.tile.cowboy = undefined;
            }
            this.tile = undefined;
            this.owner.opponent.kills++;
        }
    }
    /**
     * Gets this cowboy drunk
     *
     * @param drunkDirection The valid string direction to set this.drunkDirection
     */
    getDrunk(drunkDirection) {
        this.owner.addRowdiness(1);
        this.canMove = false;
        if (this.owner.siesta === 0) { // then they did not start a siesta, so they actually get drunk
            this.isDrunk = true;
            this.turnsBusy = this.game.turnsDrunk;
            this.drunkDirection = drunkDirection;
            this.focus = 0;
        }
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for act. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile you want this Cowboy to act on.
     * @param drunkDirection - The direction the bottle will cause drunk
     * cowboys to be in, can be 'North', 'East', 'South', or 'West'.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateAct(player, tile, drunkDirection = "") {
        // <<-- Creer-Merge: invalidate-act -->>
        let invalid = this.invalidate(player, tile);
        if (invalid) {
            return invalid;
        }
        if (this.turnsBusy > 0) {
            return `${this} is busy and cannot act this turn for ${this.turnsBusy} more turns.`;
        }
        // job specific acts
        switch (this.job) {
            case "Bartender":
                invalid = this.invalidateBartender(player, tile, drunkDirection);
                break;
            case "Brawler":
                return `${this} is a Brawler and cannot act`;
            case "Sharpshooter":
                invalid = this.invalidateSharpshooter(player, tile);
        }
        if (invalid) {
            return invalid;
        }
        // <<-- /Creer-Merge: invalidate-act -->>
    }
    /**
     * Does their job's action on a Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile you want this Cowboy to act on.
     * @param drunkDirection - The direction the bottle will cause drunk
     * cowboys to be in, can be 'North', 'East', 'South', or 'West'.
     * @returns True if the act worked, false otherwise.
     */
    async act(player, tile, drunkDirection = "") {
        // <<-- Creer-Merge: act -->>
        switch (this.job) {
            case "Sharpshooter":
                return this.actSharpshooter(player, tile);
            case "Bartender":
                return this.actBartender(player, tile, drunkDirection);
        }
        throw new Error("cowboy.act should not reach this point!");
        // <<-- /Creer-Merge: act -->>
    }
    /**
     * Invalidation function for move. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param tile - The Tile you want to move this Cowboy to.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateMove(player, tile) {
        // <<-- Creer-Merge: invalidate-move -->>
        const invalid = this.invalidate(player, tile);
        if (invalid) {
            return invalid;
        }
        if (!this.canMove) {
            return `${this} has already moved.`;
        }
        if (tile) { // check if blocked or not adjacent
            if (this.tile && !this.tile.hasNeighbor(tile)) {
                return `${tile} is not adjacent to ${this.tile}`;
            }
            else if (tile.isBalcony) {
                return `${tile} is a balcony and cannot be moved onto.`;
            }
            else if (tile.cowboy) {
                return `${tile} is blocked by ${tile.cowboy} and cannot be moved into.`;
            }
            else if (tile.furnishing) {
                return `${tile} is blocked by ${tile.furnishing} and cannot be moved into.`;
            }
        }
        // <<-- /Creer-Merge: invalidate-move -->>
    }
    /**
     * Moves this Cowboy from its current Tile to an adjacent Tile.
     *
     * @param player - The player that called this.
     * @param tile - The Tile you want to move this Cowboy to.
     * @returns True if the move worked, false otherwise.
     */
    async move(player, tile) {
        // <<-- Creer-Merge: move -->>
        if (!this.tile) {
            throw new Error("Cowboy.move called in illegal state!");
        }
        this.tile.cowboy = undefined; // remove me from the tile I was on
        tile.cowboy = this;
        this.tile = tile; // and move me to the new tile
        this.canMove = false; // and mark me as having moved this turn
        if (this.tile.bottle) {
            this.tile.bottle.break();
        }
        // sharpshooters loose focus when they move
        if (this.job === "Sharpshooter") {
            this.focus = 0;
        }
        return true;
        // <<-- /Creer-Merge: move -->>
    }
    /**
     * Invalidation function for play. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param piano - The Furnishing that is a piano you want to play.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidatePlay(player, piano) {
        // <<-- Creer-Merge: invalidate-play -->>
        const invalid = this.invalidate(player, this.tile);
        if (invalid) {
            return invalid;
        }
        if (this.turnsBusy > 0) {
            return `${this} is busy and cannot act this turn for ${this.turnsBusy} more turns.`;
        }
        if (!piano || !piano.isPiano) {
            return `${piano} is not a piano to play`;
        }
        if (piano.isPlaying) {
            return `${piano} is already playing music this turn.`;
        }
        if (piano.isDestroyed) {
            return `${piano} is destroyed and cannot be played.`;
        }
        if (!piano || !piano.tile || !piano.tile.hasNeighbor(this.tile)) {
            return `${piano} is not adjacent to ${this}`;
        }
        // <<-- /Creer-Merge: invalidate-play -->>
    }
    /**
     * Sits down and plays a piano.
     *
     * @param player - The player that called this.
     * @param piano - The Furnishing that is a piano you want to play.
     * @returns True if the play worked, false otherwise.
     */
    async play(player, piano) {
        // <<-- Creer-Merge: play -->>
        piano.isPlaying = true;
        this.turnsBusy = 1;
        this.owner.score++;
        piano.damage(1);
        return true;
        // <<-- /Creer-Merge: play -->>
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Checks if this Cowboy can do things based on the player and tile
     * (can move, can act, acn play, etc).
     *
     * @param player - The player commanding this Cowboy.
     * @param tile - The tile trying to do something to.
     * @returns The reason this is invalid (still in need of formatting),
     * undefined if valid.
     */
    invalidate(player, tile) {
        if (this.owner !== player) {
            return `${this} is not owned by you.`;
        }
        if (this.isDead) {
            return `${this} is dead.`;
        }
        if (this.isDrunk) {
            return `${this} is drunk, can cannot be directly controlled by you.`;
        }
        if (this.owner.siesta > 0) {
            return `${this} is asleep because of their siesta and cannot be controlled by you.`;
        }
        if (!tile) {
            return `${tile} is not a valid Tile.`;
        }
    }
    /**
     * Tries to invalidate the args for the Sharpshooter's act.
     *
     * @see Cowboy.act
     * @param player - The player making the cowboy act.
     * @param tile - The tile the cowboy wants to act on.
     * @returns The invalid reason if invalid (format not invoked against it),
     * undefined if valid.
     */
    invalidateSharpshooter(player, tile) {
        if (!this.tile) {
            return `${this} must be on a tile`;
        }
        if (this.focus < 1) {
            return `${this} needs focus to act. Currently has ${this.focus} focus.`;
        }
        if (!this.tile.getAdjacentDirection(tile)) {
            return `${tile} is not adjacent to the Tile that ${this} is on (${this.tile}).`;
        }
    }
    /**
     * Makes a Sharpshooter cowboy act.
     *
     * @see Cowboy.act
     * @param player - The player making the cowboy act.
     * @param tile - The tile the cowboy wants to act on.
     * @returns True because it worked.
     */
    actSharpshooter(player, tile) {
        let shot = tile;
        let distance = this.focus;
        while (shot && distance > 0) { // shoot things
            distance--; // yes we could do this above but it reads stupid
            if (!shot || shot.isBalcony) {
                break; // we are done
            }
            if (shot.cowboy) {
                shot.cowboy.damage(this.game.sharpshooterDamage);
            }
            if (shot.furnishing) {
                shot.furnishing.damage(this.game.sharpshooterDamage);
            }
            if (shot.bottle) {
                shot.bottle.break();
            }
            if (!this.tile) {
                throw new Error("Sharpshooter's act invoked illegally");
            }
            const adjacentDirection = this.tile.getAdjacentDirection(tile);
            if (!adjacentDirection) {
                throw new Error("Sharpshooter act on illegal tile direction");
            }
            shot = shot.getNeighbor(adjacentDirection);
        }
        this.focus = 0;
        this.turnsBusy = 1;
        return true;
    }
    /**
     * Tries to invalidate the args for the Bartender's act.
     *
     * @see Cowboy.act
     * @param player - The player making the cowboy act.
     * @param tile - The tile the cowboy wants to act on.
     * @param drunkDirection - The direction the player wants drunks hit by the
     * bottle to go.
     * @returns The invalid reason if invalid (format not invoked against it),
     * undefined if valid.
     */
    invalidateBartender(player, tile, drunkDirection) {
        if (!drunkDirection) {
            return "drunkDirection cannot be empty for a Bartender to act.";
        }
        if (!this.tile) {
            return `${this} has no tile.`;
        }
        // make sure the tile is an adjacent tile
        if (!this.tile.hasNeighbor(tile)) {
            return `${tile} is not adjacent to the Tile that ${this} is on (${this.tile}).`;
        }
    }
    /**
     * Makes a Bartender cowboy act.
     *
     * @see Cowboy.act
     * @param player - The player making the cowboy act.
     * @param tile - The tile the cowboy wants to act on.
     * @param drunkDirection - The direction the player wants drunks hit by the
     * bottle to go.
     * @returns True because it worked.
     */
    actBartender(player, tile, drunkDirection) {
        // check to make sure the tile the bottle spawns on would not cause it to instantly break
        // because if so, don't create it, just instantly get the cowboy there drunk
        if (!tile.isPathableToBottles() || tile.bottle) { // don't spawn a bottle, just splash the beer at them
            if (tile.cowboy) {
                tile.cowboy.getDrunk(drunkDirection);
            }
            if (tile.bottle) {
                tile.bottle.break();
            }
        }
        else { // the adjacent tile is empty, so spawn one
            if (!this.tile) {
                throw new Error("Bartender act called in illegal state!");
            }
            const direction = this.tile.getAdjacentDirection(tile);
            if (!direction) {
                throw new Error("Could not get direction between tiles!");
            }
            this.manager.create.bottle({
                tile,
                drunkDirection: drunkDirection || undefined,
                direction,
            });
        }
        this.turnsBusy = this.game.bartenderCooldown;
        return true;
    }
}
exports.Cowboy = Cowboy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY293Ym95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NhbG9vbi9jb3dib3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSwrQ0FBMkM7QUFvQjNDOztHQUVHO0FBQ0gsTUFBYSxNQUFPLFNBQVEsd0JBQVU7SUE4RGxDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBUUUsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUVyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUV4QixzRUFBc0U7UUFDdEUsZ0JBQWdCO1FBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdDQUFnQztRQUV4RSxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQzs7OztPQUlHO0lBQ0ksUUFBUTtRQUNYLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQzlELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE1BQWM7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxH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QUUsRUFBRSxxREFBcUQ7WUFDbkcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ3hDO1lBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDdkI7U0FDSjthQUNJLEVBQUUsMkNBQTJDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQzthQUM3RDtZQUVELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFdkQsSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7YUFDN0Q7WUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZCLElBQUk7Z0JBQ0osY0FBYyxFQUFFLGNBQWMsSUFBSSxTQUFTO2dCQUMzQyxTQUFTO2FBQ1osQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFFN0MsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztDQUdKO0FBM2lCRCx3QkEyaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBJQ293Ym95QWN0QXJncywgSUNvd2JveU1vdmVBcmdzLCBJQ293Ym95UGxheUFyZ3MsIElDb3dib3lQcm9wZXJ0aWVzLFxuICAgICAgIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBGdXJuaXNoaW5nIH0gZnJvbSBcIi4vZnVybmlzaGluZ1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuaW1wb3J0IHsgVGlsZURpcmVjdGlvbiB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9taXhpbnMvdGlsZWRcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgZGlyZWN0aW9uIHRoaXMgQ293Ym95IGlzIG1vdmluZyB3aGlsZSBkcnVuay4gV2lsbCBiZSAnTm9ydGgnLCAnRWFzdCcsXG4gKiAnU291dGgnLCBvciAnV2VzdCcgd2hlbiBkcnVuazsgb3IgJycgKGVtcHR5IHN0cmluZykgd2hlbiBub3QgZHJ1bmsuXG4gKi9cbmV4cG9ydCB0eXBlIENvd2JveURydW5rRGlyZWN0aW9uID0gXCJcIiB8IFwiTm9ydGhcIiB8IFwiRWFzdFwiIHwgXCJTb3V0aFwiIHwgXCJXZXN0XCI7XG5cbi8qKlxuICogVGhlIGpvYiB0aGF0IHRoaXMgQ293Ym95IGRvZXMsIGFuZCBkaWN0YXRlcyBob3cgdGhleSBmaWdodCBhbmQgaW50ZXJhY3RcbiAqIHdpdGhpbiB0aGUgU2Fsb29uLlxuICovXG5leHBvcnQgdHlwZSBDb3dib3lKb2IgPSBcIkJhcnRlbmRlclwiIHwgXCJCcmF3bGVyXCIgfCBcIlNoYXJwc2hvb3RlclwiO1xuXG4vKipcbiAqIEEgcGVyc29uIG9uIHRoZSBtYXAgdGhhdCBjYW4gbW92ZSBhcm91bmQgYW5kIGludGVyYWN0IHdpdGhpbiB0aGUgc2Fsb29uLlxuICovXG5leHBvcnQgY2xhc3MgQ293Ym95IGV4dGVuZHMgR2FtZU9iamVjdCB7XG4gICAgLyoqXG4gICAgICogSWYgdGhlIENvd2JveSBjYW4gYmUgbW92ZWQgdGhpcyB0dXJuIHZpYSBpdHMgb3duZXIuXG4gICAgICovXG4gICAgcHVibGljIGNhbk1vdmUhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRpcmVjdGlvbiB0aGlzIENvd2JveSBpcyBtb3Zpbmcgd2hpbGUgZHJ1bmsuIFdpbGwgYmUgJ05vcnRoJyxcbiAgICAgKiAnRWFzdCcsICdTb3V0aCcsIG9yICdXZXN0JyB3aGVuIGRydW5rOyBvciAnJyAoZW1wdHkgc3RyaW5nKSB3aGVuIG5vdFxuICAgICAqIGRydW5rLlxuICAgICAqL1xuICAgIHB1YmxpYyBkcnVua0RpcmVjdGlvbiE6IFwiXCIgfCBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiO1xuXG4gICAgLyoqXG4gICAgICogSG93IG11Y2ggZm9jdXMgdGhpcyBDb3dib3kgaGFzLiBEaWZmZXJlbnQgSm9icyBkbyBkaWZmZXJlbnQgdGhpbmdzIHdpdGhcbiAgICAgKiB0aGVpciBDb3dib3kncyBmb2N1cy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9jdXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBoZWFsdGggdGhpcyBDb3dib3kgY3VycmVudGx5IGhhcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGVhbHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBDb3dib3kgaXMgZGVhZCBhbmQgaGFzIGJlZW4gcmVtb3ZlZCBmcm9tIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0RlYWQhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBDb3dib3kgaXMgZHJ1bmssIGFuZCB3aWxsIGF1dG9tYXRpY2FsbHkgd2Fsay5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNEcnVuayE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgam9iIHRoYXQgdGhpcyBDb3dib3kgZG9lcywgYW5kIGRpY3RhdGVzIGhvdyB0aGV5IGZpZ2h0IGFuZCBpbnRlcmFjdFxuICAgICAqIHdpdGhpbiB0aGUgU2Fsb29uLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBqb2IhOiBcIkJhcnRlbmRlclwiIHwgXCJCcmF3bGVyXCIgfCBcIlNoYXJwc2hvb3RlclwiO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFBsYXllciB0aGF0IG93bnMgYW5kIGNhbiBjb250cm9sIHRoaXMgQ293Ym95LlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBvd25lcjogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdGhhdCB0aGlzIENvd2JveSBpcyBsb2NhdGVkIG9uLlxuICAgICAqL1xuICAgIHB1YmxpYyB0aWxlPzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IHRpbWVzIHRoaXMgdW5pdCBoYXMgYmVlbiBkcnVuayBiZWZvcmUgdGFraW5nIHRoZWlyIHNpZXN0YSBhbmRcbiAgICAgKiByZXNldGluZyB0aGlzIHRvIDAuXG4gICAgICovXG4gICAgcHVibGljIHRvbGVyYW5jZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IHR1cm5zIHRoaXMgdW5pdCBoYXMgcmVtYWluaW5nIGJlZm9yZSBpdCBpcyBubyBsb25nZXIgYnVzeSBhbmRcbiAgICAgKiBjYW4gYGFjdCgpYCBvciBgcGxheSgpYCBhZ2Fpbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHVybnNCdXN5ITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgQ293Ym95IGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElDb3dib3lQcm9wZXJ0aWVzICYge1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgICAgICAvKiogVGhlIG93bmVyIG9mIHRoaXMgQ293Ym95LiAqL1xuICAgICAgICAgICAgb3duZXI6IFBsYXllcjtcblxuICAgICAgICAgICAgLyoqIFRoZSBUaWxlIHRvIHNwYXduIHRoaXMgY293Ym95IG9uLiAqL1xuICAgICAgICAgICAgdGlsZTogVGlsZTtcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuXG4gICAgICAgIHRoaXMub3duZXIgPSBhcmdzLm93bmVyO1xuICAgICAgICB0aGlzLnRpbGUgPSBhcmdzLnRpbGU7XG5cbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oZWFsdGggPSAxMDtcbiAgICAgICAgdGhpcy50aWxlLmNvd2JveSA9IHRoaXM7XG5cbiAgICAgICAgLy8gTk9URTogZG9uJ3QgYWRkIHRvIHRoZSBjb3dib3lzIGFycmF5cyBzbyBpdCBkb2Vzbid0IHJlc2l6ZSBkdXJpbmcgYVxuICAgICAgICAvLyBwbGF5ZXIncyB0dXJuXG4gICAgICAgIHRoaXMubWFuYWdlci5zcGF3bmVkQ293Ym95cy5wdXNoKHRoaXMpOyAvLyBqdXN0IHRlbGwgdGhlIGdhbWUgd2Ugc3Bhd25lZFxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBTdHJpbmcgY29lcmNpb24gb3ZlcnJpZGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBzdHJpbmcgc3RhdGluZyB3aGF0IHRoaXMgY293Ym95IGlzXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgJyR7dGhpcy5qb2J9JyAke3RoaXMuZ2FtZU9iamVjdE5hbWV9ICMke3RoaXMuaWR9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEYW1hZ2VzIHRoaXMgY293Ym95IGZvciBzb21lIGFtb3VudCBvZiBkYW1hZ2UsIHNldHRpbmcgaXNEZWFkIGlmIGl0IGRpZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYW1hZ2UgSG93IG11Y2ggZGFtYWdlIHRvIGRvIHRvIHRoaXNcbiAgICAgKi9cbiAgICBwdWJsaWMgZGFtYWdlKGRhbWFnZTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaGVhbHRoID0gTWF0aC5tYXgoMCwgdGhpcy5oZWFsdGggLSBkYW1hZ2UpO1xuICAgICAgICBpZiAodGhpcy5oZWFsdGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuaXNEZWFkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kcnVua0RpcmVjdGlvbiA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmlzRHJ1bmsgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudHVybnNCdXN5ID0gdGhpcy5nYW1lLm1heFR1cm5zO1xuXG4gICAgICAgICAgICBpZiAodGhpcy50aWxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aWxlLmNvd2JveSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMudGlsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMub3duZXIub3Bwb25lbnQua2lsbHMrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhpcyBjb3dib3kgZHJ1bmtcbiAgICAgKlxuICAgICAqIEBwYXJhbSBkcnVua0RpcmVjdGlvbiBUaGUgdmFsaWQgc3RyaW5nIGRpcmVjdGlvbiB0byBzZXQgdGhpcy5kcnVua0RpcmVjdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBnZXREcnVuayhkcnVua0RpcmVjdGlvbjogQ293Ym95RHJ1bmtEaXJlY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vd25lci5hZGRSb3dkaW5lc3MoMSk7XG5cbiAgICAgICAgdGhpcy5jYW5Nb3ZlID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMub3duZXIuc2llc3RhID09PSAwKSB7IC8vIHRoZW4gdGhleSBkaWQgbm90IHN0YXJ0IGEgc2llc3RhLCBzbyB0aGV5IGFjdHVhbGx5IGdldCBkcnVua1xuICAgICAgICAgICAgdGhpcy5pc0RydW5rID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudHVybnNCdXN5ID0gdGhpcy5nYW1lLnR1cm5zRHJ1bms7XG4gICAgICAgICAgICB0aGlzLmRydW5rRGlyZWN0aW9uID0gZHJ1bmtEaXJlY3Rpb247XG4gICAgICAgICAgICB0aGlzLmZvY3VzID0gMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgYWN0LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZCBpblxuICAgICAqIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZyB0aGVtXG4gICAgICogd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgeW91IHdhbnQgdGhpcyBDb3dib3kgdG8gYWN0IG9uLlxuICAgICAqIEBwYXJhbSBkcnVua0RpcmVjdGlvbiAtIFRoZSBkaXJlY3Rpb24gdGhlIGJvdHRsZSB3aWxsIGNhdXNlIGRydW5rXG4gICAgICogY293Ym95cyB0byBiZSBpbiwgY2FuIGJlICdOb3J0aCcsICdFYXN0JywgJ1NvdXRoJywgb3IgJ1dlc3QnLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUFjdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIGRydW5rRGlyZWN0aW9uOiBcIlwiIHwgXCJOb3J0aFwiIHwgXCJFYXN0XCIgfCBcIlNvdXRoXCIgfCBcIldlc3RcIiA9IFwiXCIsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElDb3dib3lBY3RBcmdzIHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZS1hY3QgLS0+PlxuXG4gICAgICAgIGxldCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlKHBsYXllciwgdGlsZSk7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnR1cm5zQnVzeSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBidXN5IGFuZCBjYW5ub3QgYWN0IHRoaXMgdHVybiBmb3IgJHt0aGlzLnR1cm5zQnVzeX0gbW9yZSB0dXJucy5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gam9iIHNwZWNpZmljIGFjdHNcbiAgICAgICAgc3dpdGNoICh0aGlzLmpvYikge1xuICAgICAgICAgICAgY2FzZSBcIkJhcnRlbmRlclwiOlxuICAgICAgICAgICAgICAgIGludmFsaWQgPSB0aGlzLmludmFsaWRhdGVCYXJ0ZW5kZXIocGxheWVyLCB0aWxlLCBkcnVua0RpcmVjdGlvbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQnJhd2xlclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBhIEJyYXdsZXIgYW5kIGNhbm5vdCBhY3RgO1xuICAgICAgICAgICAgY2FzZSBcIlNoYXJwc2hvb3RlclwiOlxuICAgICAgICAgICAgICAgIGludmFsaWQgPSB0aGlzLmludmFsaWRhdGVTaGFycHNob290ZXIocGxheWVyLCB0aWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWFjdCAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyB0aGVpciBqb2IncyBhY3Rpb24gb24gYSBUaWxlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSBUaWxlIHlvdSB3YW50IHRoaXMgQ293Ym95IHRvIGFjdCBvbi5cbiAgICAgKiBAcGFyYW0gZHJ1bmtEaXJlY3Rpb24gLSBUaGUgZGlyZWN0aW9uIHRoZSBib3R0bGUgd2lsbCBjYXVzZSBkcnVua1xuICAgICAqIGNvd2JveXMgdG8gYmUgaW4sIGNhbiBiZSAnTm9ydGgnLCAnRWFzdCcsICdTb3V0aCcsIG9yICdXZXN0Jy5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBhY3Qgd29ya2VkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGFjdChcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIGRydW5rRGlyZWN0aW9uOiBcIlwiIHwgXCJOb3J0aFwiIHwgXCJFYXN0XCIgfCBcIlNvdXRoXCIgfCBcIldlc3RcIiA9IFwiXCIsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGFjdCAtLT4+XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLmpvYikge1xuICAgICAgICAgICAgY2FzZSBcIlNoYXJwc2hvb3RlclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdFNoYXJwc2hvb3RlcihwbGF5ZXIsIHRpbGUpO1xuICAgICAgICAgICAgY2FzZSBcIkJhcnRlbmRlclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdEJhcnRlbmRlcihwbGF5ZXIsIHRpbGUsIGRydW5rRGlyZWN0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNvd2JveS5hY3Qgc2hvdWxkIG5vdCByZWFjaCB0aGlzIHBvaW50IVwiKTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYWN0IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIG1vdmUuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB5b3Ugd2FudCB0byBtb3ZlIHRoaXMgQ293Ym95IHRvLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZU1vdmUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB0aWxlOiBUaWxlLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJQ293Ym95TW92ZUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLW1vdmUgLS0+PlxuXG4gICAgICAgIGNvbnN0IGludmFsaWQgPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0aWxlKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNhbk1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBoYXMgYWxyZWFkeSBtb3ZlZC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRpbGUpIHsgLy8gY2hlY2sgaWYgYmxvY2tlZCBvciBub3QgYWRqYWNlbnRcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbGUgJiYgIXRoaXMudGlsZS5oYXNOZWlnaGJvcih0aWxlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBgJHt0aWxlfSBpcyBub3QgYWRqYWNlbnQgdG8gJHt0aGlzLnRpbGV9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRpbGUuaXNCYWxjb255KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGlzIGEgYmFsY29ueSBhbmQgY2Fubm90IGJlIG1vdmVkIG9udG8uYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRpbGUuY293Ym95KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGlzIGJsb2NrZWQgYnkgJHt0aWxlLmNvd2JveX0gYW5kIGNhbm5vdCBiZSBtb3ZlZCBpbnRvLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aWxlLmZ1cm5pc2hpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gaXMgYmxvY2tlZCBieSAke3RpbGUuZnVybmlzaGluZ30gYW5kIGNhbm5vdCBiZSBtb3ZlZCBpbnRvLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1tb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNb3ZlcyB0aGlzIENvd2JveSBmcm9tIGl0cyBjdXJyZW50IFRpbGUgdG8gYW4gYWRqYWNlbnQgVGlsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB5b3Ugd2FudCB0byBtb3ZlIHRoaXMgQ293Ym95IHRvLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIG1vdmUgd29ya2VkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIG1vdmUocGxheWVyOiBQbGF5ZXIsIHRpbGU6IFRpbGUpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbW92ZSAtLT4+XG5cbiAgICAgICAgaWYgKCF0aGlzLnRpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvd2JveS5tb3ZlIGNhbGxlZCBpbiBpbGxlZ2FsIHN0YXRlIVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGlsZS5jb3dib3kgPSB1bmRlZmluZWQ7IC8vIHJlbW92ZSBtZSBmcm9tIHRoZSB0aWxlIEkgd2FzIG9uXG4gICAgICAgIHRpbGUuY293Ym95ID0gdGhpcztcbiAgICAgICAgdGhpcy50aWxlID0gdGlsZTsgLy8gYW5kIG1vdmUgbWUgdG8gdGhlIG5ldyB0aWxlXG4gICAgICAgIHRoaXMuY2FuTW92ZSA9IGZhbHNlOyAvLyBhbmQgbWFyayBtZSBhcyBoYXZpbmcgbW92ZWQgdGhpcyB0dXJuXG5cbiAgICAgICAgaWYgKHRoaXMudGlsZS5ib3R0bGUpIHtcbiAgICAgICAgICAgIHRoaXMudGlsZS5ib3R0bGUuYnJlYWsoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNoYXJwc2hvb3RlcnMgbG9vc2UgZm9jdXMgd2hlbiB0aGV5IG1vdmVcbiAgICAgICAgaWYgKHRoaXMuam9iID09PSBcIlNoYXJwc2hvb3RlclwiKSB7XG4gICAgICAgICAgICB0aGlzLmZvY3VzID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtb3ZlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHBsYXkuIFRyeSB0byBmaW5kIGEgcmVhc29uIHdoeSB0aGUgcGFzc2VkIGluXG4gICAgICogcGFyYW1ldGVycyBhcmUgaW52YWxpZCwgYW5kIHJldHVybiBhIGh1bWFuIHJlYWRhYmxlIHN0cmluZyB0ZWxsaW5nIHRoZW1cbiAgICAgKiB3aHkgaXQgaXMgaW52YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHBpYW5vIC0gVGhlIEZ1cm5pc2hpbmcgdGhhdCBpcyBhIHBpYW5vIHlvdSB3YW50IHRvIHBsYXkuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlUGxheShcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHBpYW5vOiBGdXJuaXNoaW5nLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJQ293Ym95UGxheUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXBsYXkgLS0+PlxuXG4gICAgICAgIGNvbnN0IGludmFsaWQgPSB0aGlzLmludmFsaWRhdGUocGxheWVyLCB0aGlzLnRpbGUpO1xuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50dXJuc0J1c3kgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgYnVzeSBhbmQgY2Fubm90IGFjdCB0aGlzIHR1cm4gZm9yICR7dGhpcy50dXJuc0J1c3l9IG1vcmUgdHVybnMuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcGlhbm8gfHwgIXBpYW5vLmlzUGlhbm8pIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtwaWFub30gaXMgbm90IGEgcGlhbm8gdG8gcGxheWA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGlhbm8uaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7cGlhbm99IGlzIGFscmVhZHkgcGxheWluZyBtdXNpYyB0aGlzIHR1cm4uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwaWFuby5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3BpYW5vfSBpcyBkZXN0cm95ZWQgYW5kIGNhbm5vdCBiZSBwbGF5ZWQuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcGlhbm8gfHwgIXBpYW5vLnRpbGUgfHwgIXBpYW5vLnRpbGUuaGFzTmVpZ2hib3IodGhpcy50aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3BpYW5vfSBpcyBub3QgYWRqYWNlbnQgdG8gJHt0aGlzfWA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1wbGF5IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaXRzIGRvd24gYW5kIHBsYXlzIGEgcGlhbm8uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBwaWFubyAtIFRoZSBGdXJuaXNoaW5nIHRoYXQgaXMgYSBwaWFubyB5b3Ugd2FudCB0byBwbGF5LlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHBsYXkgd29ya2VkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHBsYXkoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBwaWFubzogRnVybmlzaGluZyxcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcGxheSAtLT4+XG5cbiAgICAgICAgcGlhbm8uaXNQbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50dXJuc0J1c3kgPSAxO1xuICAgICAgICB0aGlzLm93bmVyLnNjb3JlKys7XG4gICAgICAgIHBpYW5vLmRhbWFnZSgxKTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheSAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGlzIENvd2JveSBjYW4gZG8gdGhpbmdzIGJhc2VkIG9uIHRoZSBwbGF5ZXIgYW5kIHRpbGVcbiAgICAgKiAoY2FuIG1vdmUsIGNhbiBhY3QsIGFjbiBwbGF5LCBldGMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgY29tbWFuZGluZyB0aGlzIENvd2JveS5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSB0aWxlIHRyeWluZyB0byBkbyBzb21ldGhpbmcgdG8uXG4gICAgICogQHJldHVybnMgVGhlIHJlYXNvbiB0aGlzIGlzIGludmFsaWQgKHN0aWxsIGluIG5lZWQgb2YgZm9ybWF0dGluZyksXG4gICAgICogdW5kZWZpbmVkIGlmIHZhbGlkLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW52YWxpZGF0ZShwbGF5ZXI6IFBsYXllciwgdGlsZTogVGlsZSB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBub3Qgb3duZWQgYnkgeW91LmA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNEZWFkKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaXMgZGVhZC5gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzRHJ1bmspIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkcnVuaywgY2FuIGNhbm5vdCBiZSBkaXJlY3RseSBjb250cm9sbGVkIGJ5IHlvdS5gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm93bmVyLnNpZXN0YSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBhc2xlZXAgYmVjYXVzZSBvZiB0aGVpciBzaWVzdGEgYW5kIGNhbm5vdCBiZSBjb250cm9sbGVkIGJ5IHlvdS5gO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGlzIG5vdCBhIHZhbGlkIFRpbGUuYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyaWVzIHRvIGludmFsaWRhdGUgdGhlIGFyZ3MgZm9yIHRoZSBTaGFycHNob290ZXIncyBhY3QuXG4gICAgICpcbiAgICAgKiBAc2VlIENvd2JveS5hY3RcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciBtYWtpbmcgdGhlIGNvd2JveSBhY3QuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgdGlsZSB0aGUgY293Ym95IHdhbnRzIHRvIGFjdCBvbi5cbiAgICAgKiBAcmV0dXJucyBUaGUgaW52YWxpZCByZWFzb24gaWYgaW52YWxpZCAoZm9ybWF0IG5vdCBpbnZva2VkIGFnYWluc3QgaXQpLFxuICAgICAqIHVuZGVmaW5lZCBpZiB2YWxpZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGludmFsaWRhdGVTaGFycHNob290ZXIocGxheWVyOiBQbGF5ZXIsIHRpbGU6IFRpbGUpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG11c3QgYmUgb24gYSB0aWxlYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmZvY3VzIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IG5lZWRzIGZvY3VzIHRvIGFjdC4gQ3VycmVudGx5IGhhcyAke3RoaXMuZm9jdXN9IGZvY3VzLmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudGlsZS5nZXRBZGphY2VudERpcmVjdGlvbih0aWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RpbGV9IGlzIG5vdCBhZGphY2VudCB0byB0aGUgVGlsZSB0aGF0ICR7dGhpc30gaXMgb24gKCR7dGhpcy50aWxlfSkuYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgU2hhcnBzaG9vdGVyIGNvd2JveSBhY3QuXG4gICAgICpcbiAgICAgKiBAc2VlIENvd2JveS5hY3RcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciBtYWtpbmcgdGhlIGNvd2JveSBhY3QuXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgdGlsZSB0aGUgY293Ym95IHdhbnRzIHRvIGFjdCBvbi5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGJlY2F1c2UgaXQgd29ya2VkLlxuICAgICAqL1xuICAgIHByaXZhdGUgYWN0U2hhcnBzaG9vdGVyKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlKTogdHJ1ZSB7XG5cbiAgICAgICAgbGV0IHNob3Q6IFRpbGUgfCB1bmRlZmluZWQgPSB0aWxlO1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0aGlzLmZvY3VzO1xuICAgICAgICB3aGlsZSAoc2hvdCAmJiBkaXN0YW5jZSA+IDApIHsgLy8gc2hvb3QgdGhpbmdzXG4gICAgICAgICAgICBkaXN0YW5jZS0tOyAvLyB5ZXMgd2UgY291bGQgZG8gdGhpcyBhYm92ZSBidXQgaXQgcmVhZHMgc3R1cGlkXG5cbiAgICAgICAgICAgIGlmICghc2hvdCB8fCBzaG90LmlzQmFsY29ueSkge1xuICAgICAgICAgICAgICAgIGJyZWFrOyAvLyB3ZSBhcmUgZG9uZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2hvdC5jb3dib3kpIHtcbiAgICAgICAgICAgICAgICBzaG90LmNvd2JveS5kYW1hZ2UodGhpcy5nYW1lLnNoYXJwc2hvb3RlckRhbWFnZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzaG90LmZ1cm5pc2hpbmcpIHtcbiAgICAgICAgICAgICAgICBzaG90LmZ1cm5pc2hpbmcuZGFtYWdlKHRoaXMuZ2FtZS5zaGFycHNob290ZXJEYW1hZ2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2hvdC5ib3R0bGUpIHtcbiAgICAgICAgICAgICAgICBzaG90LmJvdHRsZS5icmVhaygpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMudGlsZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNoYXJwc2hvb3RlcidzIGFjdCBpbnZva2VkIGlsbGVnYWxseVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWRqYWNlbnREaXJlY3Rpb24gPSB0aGlzLnRpbGUuZ2V0QWRqYWNlbnREaXJlY3Rpb24odGlsZSk7XG4gICAgICAgICAgICBpZiAoIWFkamFjZW50RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hhcnBzaG9vdGVyIGFjdCBvbiBpbGxlZ2FsIHRpbGUgZGlyZWN0aW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvdCA9IHNob3QuZ2V0TmVpZ2hib3IoYWRqYWNlbnREaXJlY3Rpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mb2N1cyA9IDA7XG4gICAgICAgIHRoaXMudHVybnNCdXN5ID0gMTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUcmllcyB0byBpbnZhbGlkYXRlIHRoZSBhcmdzIGZvciB0aGUgQmFydGVuZGVyJ3MgYWN0LlxuICAgICAqXG4gICAgICogQHNlZSBDb3dib3kuYWN0XG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgbWFraW5nIHRoZSBjb3dib3kgYWN0LlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIHRpbGUgdGhlIGNvd2JveSB3YW50cyB0byBhY3Qgb24uXG4gICAgICogQHBhcmFtIGRydW5rRGlyZWN0aW9uIC0gVGhlIGRpcmVjdGlvbiB0aGUgcGxheWVyIHdhbnRzIGRydW5rcyBoaXQgYnkgdGhlXG4gICAgICogYm90dGxlIHRvIGdvLlxuICAgICAqIEByZXR1cm5zIFRoZSBpbnZhbGlkIHJlYXNvbiBpZiBpbnZhbGlkIChmb3JtYXQgbm90IGludm9rZWQgYWdhaW5zdCBpdCksXG4gICAgICogdW5kZWZpbmVkIGlmIHZhbGlkLlxuICAgICAqL1xuICAgIHByaXZhdGUgaW52YWxpZGF0ZUJhcnRlbmRlcihcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHRpbGU6IFRpbGUsXG4gICAgICAgIGRydW5rRGlyZWN0aW9uOiBcIlwiIHwgVGlsZURpcmVjdGlvbixcbiAgICApOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICBpZiAoIWRydW5rRGlyZWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJkcnVua0RpcmVjdGlvbiBjYW5ub3QgYmUgZW1wdHkgZm9yIGEgQmFydGVuZGVyIHRvIGFjdC5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gaGFzIG5vIHRpbGUuYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgdGlsZSBpcyBhbiBhZGphY2VudCB0aWxlXG4gICAgICAgIGlmICghdGhpcy50aWxlLmhhc05laWdoYm9yKHRpbGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGlsZX0gaXMgbm90IGFkamFjZW50IHRvIHRoZSBUaWxlIHRoYXQgJHt0aGlzfSBpcyBvbiAoJHt0aGlzLnRpbGV9KS5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBCYXJ0ZW5kZXIgY293Ym95IGFjdC5cbiAgICAgKlxuICAgICAqIEBzZWUgQ293Ym95LmFjdFxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIG1ha2luZyB0aGUgY293Ym95IGFjdC5cbiAgICAgKiBAcGFyYW0gdGlsZSAtIFRoZSB0aWxlIHRoZSBjb3dib3kgd2FudHMgdG8gYWN0IG9uLlxuICAgICAqIEBwYXJhbSBkcnVua0RpcmVjdGlvbiAtIFRoZSBkaXJlY3Rpb24gdGhlIHBsYXllciB3YW50cyBkcnVua3MgaGl0IGJ5IHRoZVxuICAgICAqIGJvdHRsZSB0byBnby5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGJlY2F1c2UgaXQgd29ya2VkLlxuICAgICAqL1xuICAgIHByaXZhdGUgYWN0QmFydGVuZGVyKHBsYXllcjogUGxheWVyLCB0aWxlOiBUaWxlLCBkcnVua0RpcmVjdGlvbjogQ293Ym95RHJ1bmtEaXJlY3Rpb24pOiB0cnVlIHtcbiAgICAgICAgLy8gY2hlY2sgdG8gbWFrZSBzdXJlIHRoZSB0aWxlIHRoZSBib3R0bGUgc3Bhd25zIG9uIHdvdWxkIG5vdCBjYXVzZSBpdCB0byBpbnN0YW50bHkgYnJlYWtcbiAgICAgICAgLy8gYmVjYXVzZSBpZiBzbywgZG9uJ3QgY3JlYXRlIGl0LCBqdXN0IGluc3RhbnRseSBnZXQgdGhlIGNvd2JveSB0aGVyZSBkcnVua1xuICAgICAgICBpZiAoIXRpbGUuaXNQYXRoYWJsZVRvQm90dGxlcygpIHx8IHRpbGUuYm90dGxlKSB7IC8vIGRvbid0IHNwYXduIGEgYm90dGxlLCBqdXN0IHNwbGFzaCB0aGUgYmVlciBhdCB0aGVtXG4gICAgICAgICAgICBpZiAodGlsZS5jb3dib3kpIHtcbiAgICAgICAgICAgICAgICB0aWxlLmNvd2JveS5nZXREcnVuayhkcnVua0RpcmVjdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aWxlLmJvdHRsZSkge1xuICAgICAgICAgICAgICAgIHRpbGUuYm90dGxlLmJyZWFrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIHRoZSBhZGphY2VudCB0aWxlIGlzIGVtcHR5LCBzbyBzcGF3biBvbmVcbiAgICAgICAgICAgIGlmICghdGhpcy50aWxlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmFydGVuZGVyIGFjdCBjYWxsZWQgaW4gaWxsZWdhbCBzdGF0ZSFcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMudGlsZS5nZXRBZGphY2VudERpcmVjdGlvbih0aWxlKTtcblxuICAgICAgICAgICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgZ2V0IGRpcmVjdGlvbiBiZXR3ZWVuIHRpbGVzIVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5ib3R0bGUoe1xuICAgICAgICAgICAgICAgIHRpbGUsXG4gICAgICAgICAgICAgICAgZHJ1bmtEaXJlY3Rpb246IGRydW5rRGlyZWN0aW9uIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHVybnNCdXN5ID0gdGhpcy5nYW1lLmJhcnRlbmRlckNvb2xkb3duO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19