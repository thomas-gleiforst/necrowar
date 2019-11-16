"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * An furnishing in the Saloon that must be pathed around, or destroyed.
 */
class Furnishing extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Furnishing is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.tile = args.tile;
        this.game.furnishings.push(this);
        this.health = this.isPiano ? 48 : 16;
        this.tile.furnishing = this;
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Damages this Furnishing for some amount of damage, setting isDestroyed if it dies
     *
     * @param damage How much damage to do to this.
     */
    damage(damage) {
        this.health = Math.max(0, this.health - damage);
        if (this.health === 0) { // it has been destroyed
            this.isDestroyed = true;
            this.isPlaying = false;
            if (this.tile) {
                this.tile.furnishing = undefined;
            }
            this.tile = undefined;
            if (this.isPiano) {
                // then we may have been the last piano getting destroyed, so check to end the game
                this.manager.checkForWinner();
            }
        }
    }
}
exports.Furnishing = Furnishing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVybmlzaGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zYWxvb24vZnVybmlzaGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLCtDQUEyQztBQUczQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsVUFBVyxTQUFRLHdCQUFVO0lBMkJ0QyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDSSxJQUtFLEVBQ0YsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFFckMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXRCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUU1QixzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0MscURBQXFEO0lBRXJEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsTUFBYztRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFFaEQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxFQUFFLHdCQUF3QjtZQUM3QyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO2FBQ3BDO1lBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7WUFFdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNkLG1GQUFtRjtnQkFDbkYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUNqQztTQUNKO0lBQ0wsQ0FBQztDQUdKO0FBakdELGdDQWlHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgSUZ1cm5pc2hpbmdQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEFuIGZ1cm5pc2hpbmcgaW4gdGhlIFNhbG9vbiB0aGF0IG11c3QgYmUgcGF0aGVkIGFyb3VuZCwgb3IgZGVzdHJveWVkLlxuICovXG5leHBvcnQgY2xhc3MgRnVybmlzaGluZyBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGhlYWx0aCB0aGlzIEZ1cm5pc2hpbmcgY3VycmVudGx5IGhhcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGVhbHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBGdXJuaXNoaW5nIGhhcyBiZWVuIGRlc3Ryb3llZCwgYW5kIGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgKiBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0Rlc3Ryb3llZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUcnVlIGlmIHRoaXMgRnVybmlzaGluZyBpcyBhIHBpYW5vIGFuZCBjYW4gYmUgcGxheWVkLCBGYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGlzUGlhbm8hOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBpcyBhIHBpYW5vIGFuZCBhIENvd2JveSBpcyBwbGF5aW5nIGl0IHRoaXMgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgaXNQbGF5aW5nITogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRoYXQgdGhpcyBGdXJuaXNoaW5nIGlzIGxvY2F0ZWQgb24uXG4gICAgICovXG4gICAgcHVibGljIHRpbGU/OiBUaWxlO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgRnVybmlzaGluZyBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxJRnVybmlzaGluZ1Byb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8qKiBUaGUgVGlsZSB0byBzcGF3biB0aGlzIEZ1cm5pc2hpbmcgdXBvbi4gKi9cbiAgICAgICAgICAgIHRpbGU6IFRpbGU7XG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cblxuICAgICAgICB0aGlzLnRpbGUgPSBhcmdzLnRpbGU7XG5cbiAgICAgICAgdGhpcy5nYW1lLmZ1cm5pc2hpbmdzLnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMuaGVhbHRoID0gdGhpcy5pc1BpYW5vID8gNDggOiAxNjtcbiAgICAgICAgdGhpcy50aWxlLmZ1cm5pc2hpbmcgPSB0aGlzO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogRGFtYWdlcyB0aGlzIEZ1cm5pc2hpbmcgZm9yIHNvbWUgYW1vdW50IG9mIGRhbWFnZSwgc2V0dGluZyBpc0Rlc3Ryb3llZCBpZiBpdCBkaWVzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGFtYWdlIEhvdyBtdWNoIGRhbWFnZSB0byBkbyB0byB0aGlzLlxuICAgICAqL1xuICAgIHB1YmxpYyBkYW1hZ2UoZGFtYWdlOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5oZWFsdGggPSBNYXRoLm1heCgwLCB0aGlzLmhlYWx0aCAtIGRhbWFnZSk7XG5cbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoID09PSAwKSB7IC8vIGl0IGhhcyBiZWVuIGRlc3Ryb3llZFxuICAgICAgICAgICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMudGlsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGlsZS5mdXJuaXNoaW5nID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aWxlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pc1BpYW5vKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiB3ZSBtYXkgaGF2ZSBiZWVuIHRoZSBsYXN0IHBpYW5vIGdldHRpbmcgZGVzdHJveWVkLCBzbyBjaGVjayB0byBlbmQgdGhlIGdhbWVcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuY2hlY2tGb3JXaW5uZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19