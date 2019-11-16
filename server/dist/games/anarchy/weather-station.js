"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const building_1 = require("./building");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
// <<-- /Creer-Merge: imports -->>
/**
 * Can be bribed to change the next Forecast in some way.
 */
class WeatherStation extends building_1.Building {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a WeatherStation is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Invalidation function for intensify. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param negative - By default the intensity will be increased by 1,
     * setting this to true decreases the intensity by 1.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateIntensify(player, negative = false) {
        // <<-- Creer-Merge: invalidate-intensify -->>
        const invalid = this.invalidateBribe(player);
        if (invalid) {
            return invalid;
        }
        if (!this.game.nextForecast) {
            return `${this} cannot intensify the next Forecast as it is the last turn and there is no next Forecast.`;
        }
        // checks if the intensity is at maximum and trying to increase
        if (!negative && this.game.nextForecast.intensity >= this.game.maxForecastIntensity) {
            return `${this} cannot intensify the next Forecast `
                + `${this.game.nextForecast} above ${this.game.maxForecastIntensity}.`;
        }
        // checks if the intensity is at minimum and trying to decrease
        if (negative && this.game.nextForecast.intensity <= 0) {
            return `${this} cannot intensify the next Forecast${this.game.nextForecast} below 0.`;
        }
        // <<-- /Creer-Merge: invalidate-intensify -->>
    }
    /**
     * Bribe the weathermen to intensity the next Forecast by 1 or -1
     *
     * @param player - The player that called this.
     * @param negative - By default the intensity will be increased by 1,
     * setting this to true decreases the intensity by 1.
     * @returns True if the intensity was changed, false otherwise.
     */
    async intensify(player, negative = false) {
        // <<-- Creer-Merge: intensify -->>
        if (!this.game.nextForecast) {
            throw new Error("Intensify called when there is no next forecast!");
        }
        this.game.nextForecast.intensity += (negative ? -1 : 1);
        this.bribed = true;
        player.bribesRemaining--;
        return true;
        // <<-- /Creer-Merge: intensify -->>
    }
    /**
     * Invalidation function for rotate. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param counterclockwise - By default the direction will be rotated
     * clockwise. If you set this to true we will rotate the forecast
     * counterclockwise instead.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateRotate(player, counterclockwise = false) {
        // <<-- Creer-Merge: invalidate-rotate -->>
        const invalid = this.invalidateBribe(player);
        if (invalid) {
            return invalid;
        }
        if (!this.game.nextForecast) {
            return `${this} cannot rotate the next Forecast as it is the last turn and there is no next Forecast.`;
        }
        // <<-- /Creer-Merge: invalidate-rotate -->>
    }
    /**
     * Bribe the weathermen to change the direction of the next Forecast by
     * rotating it clockwise or counterclockwise.
     *
     * @param player - The player that called this.
     * @param counterclockwise - By default the direction will be rotated
     * clockwise. If you set this to true we will rotate the forecast
     * counterclockwise instead.
     * @returns True if the rotation worked, false otherwise.
     */
    async rotate(player, counterclockwise = false) {
        // <<-- Creer-Merge: rotate -->>
        if (!this.game.nextForecast) {
            throw new Error("Intensify called when there is no next forecast!");
        }
        const wrapAround = counterclockwise
            ? utils_1.getPreviousWrapAround
            : utils_1.getNextWrapAround;
        const direction = wrapAround(this.game.directions, this.game.nextForecast.direction);
        if (!direction) {
            throw new Error("No direction should never happen but TS is dumb at times");
        }
        this.game.nextForecast.direction = direction;
        this.bribed = true;
        this.owner.bribesRemaining--;
        return true;
        // <<-- /Creer-Merge: rotate -->>
    }
}
exports.WeatherStation = WeatherStation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VhdGhlci1zdGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2FuYXJjaHkvd2VhdGhlci1zdGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EseUNBQXNDO0FBR3RDLGlDQUFpQztBQUNqQyxtQ0FBbUU7QUFDbkUsa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsbUJBQVE7SUFDeEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7Ozs7O09BV0c7SUFDTyxtQkFBbUIsQ0FDekIsTUFBYyxFQUNkLFdBQW9CLEtBQUs7UUFFekIsOENBQThDO1FBRTlDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN6QixPQUFPLEdBQUcsSUFBSSwyRkFBMkYsQ0FBQztTQUM3RztRQUVELCtEQUErRDtRQUMvRCxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQ2pGLE9BQU8sR0FBRyxJQUFJLHNDQUFzQztrQkFDOUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLENBQUM7U0FDOUU7UUFFRCwrREFBK0Q7UUFDL0QsSUFBSSxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxJQUFJLENBQUMsRUFBRTtZQUNuRCxPQUFPLEdBQUcsSUFBSSxzQ0FBc0MsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLFdBQVcsQ0FBQztTQUN6RjtRQUVELCtDQUErQztJQUNuRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLEtBQUssQ0FBQyxTQUFTLENBQ3JCLE1BQWMsRUFDZCxXQUFvQixLQUFLO1FBRXpCLG1DQUFtQztRQUVuQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXpCLE9BQU8sSUFBSSxDQUFDO1FBRVosb0NBQW9DO0lBQ3hDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDTyxnQkFBZ0IsQ0FDdEIsTUFBYyxFQUNkLG1CQUE0QixLQUFLO1FBRWpDLDJDQUEyQztRQUUzQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDekIsT0FBTyxHQUFHLElBQUksd0ZBQXdGLENBQUM7U0FDMUc7UUFFRCw0Q0FBNEM7SUFDaEQsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNPLEtBQUssQ0FBQyxNQUFNLENBQ2xCLE1BQWMsRUFDZCxtQkFBNEIsS0FBSztRQUVqQyxnQ0FBZ0M7UUFFaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztTQUN2RTtRQUVELE1BQU0sVUFBVSxHQUFHLGdCQUFnQjtZQUMvQixDQUFDLENBQUMsNkJBQXFCO1lBQ3ZCLENBQUMsQ0FBQyx5QkFBaUIsQ0FBQztRQUV4QixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztTQUMvRTtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFN0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUU3QixPQUFPLElBQUksQ0FBQztRQUVaLGlDQUFpQztJQUNyQyxDQUFDO0NBT0o7QUF0TEQsd0NBc0xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBCdWlsZGluZ0FyZ3MsIElXZWF0aGVyU3RhdGlvbkludGVuc2lmeUFyZ3MsIElXZWF0aGVyU3RhdGlvblByb3BlcnRpZXMsXG4gICAgICAgICBJV2VhdGhlclN0YXRpb25Sb3RhdGVBcmdzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBCdWlsZGluZyB9IGZyb20gXCIuL2J1aWxkaW5nXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBnZXROZXh0V3JhcEFyb3VuZCwgZ2V0UHJldmlvdXNXcmFwQXJvdW5kIH0gZnJvbSBcIn4vdXRpbHNcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBDYW4gYmUgYnJpYmVkIHRvIGNoYW5nZSB0aGUgbmV4dCBGb3JlY2FzdCBpbiBzb21lIHdheS5cbiAqL1xuZXhwb3J0IGNsYXNzIFdlYXRoZXJTdGF0aW9uIGV4dGVuZHMgQnVpbGRpbmcge1xuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFdlYXRoZXJTdGF0aW9uIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PEJ1aWxkaW5nQXJncyAmIElXZWF0aGVyU3RhdGlvblByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgY29uc3RydWN0b3IgYXJncyBpbiBoZXJlXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgaW50ZW5zaWZ5LiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZFxuICAgICAqIGluIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZ1xuICAgICAqIHRoZW0gd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBuZWdhdGl2ZSAtIEJ5IGRlZmF1bHQgdGhlIGludGVuc2l0eSB3aWxsIGJlIGluY3JlYXNlZCBieSAxLFxuICAgICAqIHNldHRpbmcgdGhpcyB0byB0cnVlIGRlY3JlYXNlcyB0aGUgaW50ZW5zaXR5IGJ5IDEuXG4gICAgICogQHJldHVybnMgSWYgdGhlIGFyZ3VtZW50cyBhcmUgaW52YWxpZCwgcmV0dXJuIGEgc3RyaW5nIGV4cGxhaW5pbmcgdG9cbiAgICAgKiBodW1hbiBwbGF5ZXJzIHdoeSBpdCBpcyBpbnZhbGlkLiBJZiBpdCBpcyB2YWxpZCByZXR1cm4gbm90aGluZywgb3IgYW5cbiAgICAgKiBvYmplY3Qgd2l0aCBuZXcgYXJndW1lbnRzIHRvIHVzZSBpbiB0aGUgYWN0dWFsIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlSW50ZW5zaWZ5KFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgbmVnYXRpdmU6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVdlYXRoZXJTdGF0aW9uSW50ZW5zaWZ5QXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtaW50ZW5zaWZ5IC0tPj5cblxuICAgICAgICBjb25zdCBpbnZhbGlkID0gdGhpcy5pbnZhbGlkYXRlQnJpYmUocGxheWVyKTtcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmdhbWUubmV4dEZvcmVjYXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGludGVuc2lmeSB0aGUgbmV4dCBGb3JlY2FzdCBhcyBpdCBpcyB0aGUgbGFzdCB0dXJuIGFuZCB0aGVyZSBpcyBubyBuZXh0IEZvcmVjYXN0LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVja3MgaWYgdGhlIGludGVuc2l0eSBpcyBhdCBtYXhpbXVtIGFuZCB0cnlpbmcgdG8gaW5jcmVhc2VcbiAgICAgICAgaWYgKCFuZWdhdGl2ZSAmJiB0aGlzLmdhbWUubmV4dEZvcmVjYXN0LmludGVuc2l0eSA+PSB0aGlzLmdhbWUubWF4Rm9yZWNhc3RJbnRlbnNpdHkpIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0aGlzfSBjYW5ub3QgaW50ZW5zaWZ5IHRoZSBuZXh0IEZvcmVjYXN0IGBcbiAgICAgICAgICAgICAgICArIGAke3RoaXMuZ2FtZS5uZXh0Rm9yZWNhc3R9IGFib3ZlICR7dGhpcy5nYW1lLm1heEZvcmVjYXN0SW50ZW5zaXR5fS5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2tzIGlmIHRoZSBpbnRlbnNpdHkgaXMgYXQgbWluaW11bSBhbmQgdHJ5aW5nIHRvIGRlY3JlYXNlXG4gICAgICAgIGlmIChuZWdhdGl2ZSAmJiB0aGlzLmdhbWUubmV4dEZvcmVjYXN0LmludGVuc2l0eSA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dGhpc30gY2Fubm90IGludGVuc2lmeSB0aGUgbmV4dCBGb3JlY2FzdCR7dGhpcy5nYW1lLm5leHRGb3JlY2FzdH0gYmVsb3cgMC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtaW50ZW5zaWZ5IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmliZSB0aGUgd2VhdGhlcm1lbiB0byBpbnRlbnNpdHkgdGhlIG5leHQgRm9yZWNhc3QgYnkgMSBvciAtMVxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gbmVnYXRpdmUgLSBCeSBkZWZhdWx0IHRoZSBpbnRlbnNpdHkgd2lsbCBiZSBpbmNyZWFzZWQgYnkgMSxcbiAgICAgKiBzZXR0aW5nIHRoaXMgdG8gdHJ1ZSBkZWNyZWFzZXMgdGhlIGludGVuc2l0eSBieSAxLlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGludGVuc2l0eSB3YXMgY2hhbmdlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBpbnRlbnNpZnkoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBuZWdhdGl2ZTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnRlbnNpZnkgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy5nYW1lLm5leHRGb3JlY2FzdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW50ZW5zaWZ5IGNhbGxlZCB3aGVuIHRoZXJlIGlzIG5vIG5leHQgZm9yZWNhc3QhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nYW1lLm5leHRGb3JlY2FzdC5pbnRlbnNpdHkgKz0gKG5lZ2F0aXZlID8gLTEgOiAxKTtcblxuICAgICAgICB0aGlzLmJyaWJlZCA9IHRydWU7XG4gICAgICAgIHBsYXllci5icmliZXNSZW1haW5pbmctLTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW50ZW5zaWZ5IC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZhbGlkYXRpb24gZnVuY3Rpb24gZm9yIHJvdGF0ZS4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gY291bnRlcmNsb2Nrd2lzZSAtIEJ5IGRlZmF1bHQgdGhlIGRpcmVjdGlvbiB3aWxsIGJlIHJvdGF0ZWRcbiAgICAgKiBjbG9ja3dpc2UuIElmIHlvdSBzZXQgdGhpcyB0byB0cnVlIHdlIHdpbGwgcm90YXRlIHRoZSBmb3JlY2FzdFxuICAgICAqIGNvdW50ZXJjbG9ja3dpc2UgaW5zdGVhZC5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVSb3RhdGUoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBjb3VudGVyY2xvY2t3aXNlOiBib29sZWFuID0gZmFsc2UsXG4gICAgKTogdm9pZCB8IHN0cmluZyB8IElXZWF0aGVyU3RhdGlvblJvdGF0ZUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXJvdGF0ZSAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHRoaXMuaW52YWxpZGF0ZUJyaWJlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5nYW1lLm5leHRGb3JlY2FzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGAke3RoaXN9IGNhbm5vdCByb3RhdGUgdGhlIG5leHQgRm9yZWNhc3QgYXMgaXQgaXMgdGhlIGxhc3QgdHVybiBhbmQgdGhlcmUgaXMgbm8gbmV4dCBGb3JlY2FzdC5gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcm90YXRlIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmliZSB0aGUgd2VhdGhlcm1lbiB0byBjaGFuZ2UgdGhlIGRpcmVjdGlvbiBvZiB0aGUgbmV4dCBGb3JlY2FzdCBieVxuICAgICAqIHJvdGF0aW5nIGl0IGNsb2Nrd2lzZSBvciBjb3VudGVyY2xvY2t3aXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gY291bnRlcmNsb2Nrd2lzZSAtIEJ5IGRlZmF1bHQgdGhlIGRpcmVjdGlvbiB3aWxsIGJlIHJvdGF0ZWRcbiAgICAgKiBjbG9ja3dpc2UuIElmIHlvdSBzZXQgdGhpcyB0byB0cnVlIHdlIHdpbGwgcm90YXRlIHRoZSBmb3JlY2FzdFxuICAgICAqIGNvdW50ZXJjbG9ja3dpc2UgaW5zdGVhZC5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSByb3RhdGlvbiB3b3JrZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgcm90YXRlKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgY291bnRlcmNsb2Nrd2lzZTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiByb3RhdGUgLS0+PlxuXG4gICAgICAgIGlmICghdGhpcy5nYW1lLm5leHRGb3JlY2FzdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW50ZW5zaWZ5IGNhbGxlZCB3aGVuIHRoZXJlIGlzIG5vIG5leHQgZm9yZWNhc3QhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd3JhcEFyb3VuZCA9IGNvdW50ZXJjbG9ja3dpc2VcbiAgICAgICAgICAgID8gZ2V0UHJldmlvdXNXcmFwQXJvdW5kXG4gICAgICAgICAgICA6IGdldE5leHRXcmFwQXJvdW5kO1xuXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHdyYXBBcm91bmQodGhpcy5nYW1lLmRpcmVjdGlvbnMsIHRoaXMuZ2FtZS5uZXh0Rm9yZWNhc3QuZGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKCFkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGRpcmVjdGlvbiBzaG91bGQgbmV2ZXIgaGFwcGVuIGJ1dCBUUyBpcyBkdW1iIGF0IHRpbWVzXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nYW1lLm5leHRGb3JlY2FzdC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAgICAgdGhpcy5icmliZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm93bmVyLmJyaWJlc1JlbWFpbmluZy0tO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiByb3RhdGUgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==