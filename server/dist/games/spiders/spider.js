"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
const brood_mother_1 = require("./brood-mother");
// <<-- /Creer-Merge: imports -->>
/**
 * A Spider in the game. The most basic unit.
 */
class Spider extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Spider is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        this.owner = args.owner;
        if (!(this instanceof brood_mother_1.BroodMother)) {
            this.nest = this.owner.broodMother.nest;
        }
        if (!this.nest) {
            throw new Error(`Tried to create Spider ${this} on no nest!`);
        }
        this.isDead = false;
        this.nest.spiders.push(this);
        this.owner.spiders.push(this);
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    // <<-- Creer-Merge: protected-private-functions -->>
    /** Kill the spider and remove it from arrays */
    kill() {
        this.isDead = true;
        if (this.nest) {
            utils_1.removeElements(this.nest.spiders, this);
            this.nest = undefined;
        }
        utils_1.removeElements(this.owner.spiders, this);
    }
    /**
     * Invalidates base logic for any spider to do anything.
     *
     * @param player - The player trying to command this Spider.
     * @returns A string if some validation error was found, undefined otherwise.
     */
    invalidate(player) {
        if (this.owner !== player) {
            return `${player} does not own ${this}.`;
        }
        if (this.isDead) {
            return `${this} is dead and cannot do anything.`;
        }
    }
}
exports.Spider = Spider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvc3BpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsK0NBQTJDO0FBSTNDLGlDQUFpQztBQUNqQyxtQ0FBeUM7QUFDekMsaURBQTZDO0FBQzdDLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsTUFBTyxTQUFRLHdCQUFVO0lBaUJsQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0gsWUFDSSxJQUtFLEVBQ0YsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxDQUFDLElBQUksWUFBWSwwQkFBVyxDQUFDLEVBQUU7WUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7U0FDM0M7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLElBQUksY0FBYyxDQUFDLENBQUM7U0FDakU7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQyxxREFBcUQ7SUFFckQsZ0RBQWdEO0lBQ3pDLElBQUk7UUFDUCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUVuQixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxzQkFBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1NBQ3pCO1FBRUQsc0JBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxVQUFVLENBQUMsTUFBYztRQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBTSxFQUFFO1lBQ3ZCLE9BQU8sR0FBRyxNQUFNLGlCQUFpQixJQUFJLEdBQUcsQ0FBQztTQUM1QztRQUVELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU8sR0FBRyxJQUFJLGtDQUFrQyxDQUFDO1NBQ3BEO0lBQ0wsQ0FBQztDQUdKO0FBakdELHdCQWlHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgSVNwaWRlclByb3BlcnRpZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgTmVzdCB9IGZyb20gXCIuL25lc3RcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IHJlbW92ZUVsZW1lbnRzIH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IEJyb29kTW90aGVyIH0gZnJvbSBcIi4vYnJvb2QtbW90aGVyXCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQSBTcGlkZXIgaW4gdGhlIGdhbWUuIFRoZSBtb3N0IGJhc2ljIHVuaXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGlkZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIFNwaWRlciBpcyBkZWFkIGFuZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIGlzRGVhZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgTmVzdCB0aGF0IHRoaXMgU3BpZGVyIGlzIGN1cnJlbnRseSBvbi4gVW5kZWZpbmVkIHdoZW4gbW92aW5nIG9uIGFcbiAgICAgKiBXZWIuXG4gICAgICovXG4gICAgcHVibGljIG5lc3Q/OiBOZXN0O1xuXG4gICAgLyoqXG4gICAgICogVGhlIFBsYXllciB0aGF0IG93bnMgdGhpcyBTcGlkZXIsIGFuZCBjYW4gY29tbWFuZCBpdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgb3duZXI6IFBsYXllcjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFNwaWRlciBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxJU3BpZGVyUHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLyoqIFRoZSBjb250cm9sbGluZyBQbGF5ZXIgb2YgdGhpcyBTcGlkZXIuICovXG4gICAgICAgICAgICBvd25lcjogUGxheWVyO1xuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICB9PixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIHRoaXMub3duZXIgPSBhcmdzLm93bmVyO1xuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnJvb2RNb3RoZXIpKSB7XG4gICAgICAgICAgICB0aGlzLm5lc3QgPSB0aGlzLm93bmVyLmJyb29kTW90aGVyLm5lc3Q7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubmVzdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmllZCB0byBjcmVhdGUgU3BpZGVyICR7dGhpc30gb24gbm8gbmVzdCFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNEZWFkID0gZmFsc2U7XG4gICAgICAgIHRoaXMubmVzdC5zcGlkZXJzLnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMub3duZXIuc3BpZGVycy5wdXNoKHRoaXMpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKiBLaWxsIHRoZSBzcGlkZXIgYW5kIHJlbW92ZSBpdCBmcm9tIGFycmF5cyAqL1xuICAgIHB1YmxpYyBraWxsKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmlzRGVhZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMubmVzdCkge1xuICAgICAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5uZXN0LnNwaWRlcnMsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5uZXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVtb3ZlRWxlbWVudHModGhpcy5vd25lci5zcGlkZXJzLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRlcyBiYXNlIGxvZ2ljIGZvciBhbnkgc3BpZGVyIHRvIGRvIGFueXRoaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdHJ5aW5nIHRvIGNvbW1hbmQgdGhpcyBTcGlkZXIuXG4gICAgICogQHJldHVybnMgQSBzdHJpbmcgaWYgc29tZSB2YWxpZGF0aW9uIGVycm9yIHdhcyBmb3VuZCwgdW5kZWZpbmVkIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZShwbGF5ZXI6IFBsYXllcik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICh0aGlzLm93bmVyICE9PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtwbGF5ZXJ9IGRvZXMgbm90IG93biAke3RoaXN9LmA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0RlYWQpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBpcyBkZWFkIGFuZCBjYW5ub3QgZG8gYW55dGhpbmcuYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19