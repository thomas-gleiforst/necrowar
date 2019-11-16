"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const building_1 = require("./building");
// <<-- Creer-Merge: imports -->>
const lodash_1 = require("lodash");
// <<-- /Creer-Merge: imports -->>
/**
 * Can put out fires completely.
 */
class FireDepartment extends building_1.Building {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a FireDepartment is created.
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
     * Invalidation function for extinguish. Try to find a reason why the
     * passed in parameters are invalid, and return a human readable string
     * telling them why it is invalid.
     *
     * @param player - The player that called this.
     * @param building - The Building you want to extinguish.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateExtinguish(player, building) {
        // <<-- Creer-Merge: invalidate-extinguish -->>
        const invalid = this.invalidateBribe(player);
        if (invalid) {
            return invalid;
        }
        if (building.isHeadquarters) {
            return `${building} is a Headquarters and cannot be extinguished by ${this}.`;
        }
        // <<-- /Creer-Merge: invalidate-extinguish -->>
    }
    /**
     * Bribes this FireDepartment to extinguish the some of the fire in a
     * building.
     *
     * @param player - The player that called this.
     * @param building - The Building you want to extinguish.
     * @returns True if the bribe worked, false otherwise.
     */
    async extinguish(player, building) {
        // <<-- Creer-Merge: extinguish -->>
        building.fire = lodash_1.clamp(building.fire - this.fireExtinguished, 0, this.game.maxFire);
        this.bribed = true;
        player.bribesRemaining--;
        return true;
        // <<-- /Creer-Merge: extinguish -->>
    }
}
exports.FireDepartment = FireDepartment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZS1kZXBhcnRtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2FuYXJjaHkvZmlyZS1kZXBhcnRtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EseUNBQXNDO0FBR3RDLGlDQUFpQztBQUNqQyxtQ0FBK0I7QUFDL0Isa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsbUJBQVE7SUFPeEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7Ozs7T0FVRztJQUNPLG9CQUFvQixDQUMxQixNQUFjLEVBQ2QsUUFBa0I7UUFFbEIsK0NBQStDO1FBRS9DLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLEVBQUU7WUFDVCxPQUFPLE9BQU8sQ0FBQztTQUNsQjtRQUVELElBQUksUUFBUSxDQUFDLGNBQWMsRUFBRTtZQUN6QixPQUFPLEdBQUcsUUFBUSxvREFBb0QsSUFBSSxHQUFHLENBQUM7U0FDakY7UUFFRCxnREFBZ0Q7SUFDcEQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTyxLQUFLLENBQUMsVUFBVSxDQUN0QixNQUFjLEVBQ2QsUUFBa0I7UUFFbEIsb0NBQW9DO1FBRXBDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsY0FBSyxDQUNqQixRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFDckMsQ0FBQyxFQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUNwQixDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXpCLE9BQU8sSUFBSSxDQUFDO1FBRVoscUNBQXFDO0lBQ3pDLENBQUM7Q0FPSjtBQTFHRCx3Q0EwR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJ1aWxkaW5nQXJncywgSUZpcmVEZXBhcnRtZW50RXh0aW5ndWlzaEFyZ3MsXG4gICAgICAgICBJRmlyZURlcGFydG1lbnRQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBCdWlsZGluZyB9IGZyb20gXCIuL2J1aWxkaW5nXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gXCJsb2Rhc2hcIjtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBDYW4gcHV0IG91dCBmaXJlcyBjb21wbGV0ZWx5LlxuICovXG5leHBvcnQgY2xhc3MgRmlyZURlcGFydG1lbnQgZXh0ZW5kcyBCdWlsZGluZyB7XG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBmaXJlIHJlbW92ZWQgZnJvbSBhIGJ1aWxkaW5nIHdoZW4gYnJpYmVkIHRvIGV4dGluZ3Vpc2ggYVxuICAgICAqIGJ1aWxkaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBmaXJlRXh0aW5ndWlzaGVkITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgRmlyZURlcGFydG1lbnQgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8QnVpbGRpbmdBcmdzICYgSUZpcmVEZXBhcnRtZW50UHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgY29uc3RydWN0b3IgYXJncyBpbiBoZXJlXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgZXh0aW5ndWlzaC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZVxuICAgICAqIHBhc3NlZCBpbiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nXG4gICAgICogdGVsbGluZyB0aGVtIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gYnVpbGRpbmcgLSBUaGUgQnVpbGRpbmcgeW91IHdhbnQgdG8gZXh0aW5ndWlzaC5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVFeHRpbmd1aXNoKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgYnVpbGRpbmc6IEJ1aWxkaW5nLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJRmlyZURlcGFydG1lbnRFeHRpbmd1aXNoQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtZXh0aW5ndWlzaCAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHRoaXMuaW52YWxpZGF0ZUJyaWJlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChidWlsZGluZy5pc0hlYWRxdWFydGVycykge1xuICAgICAgICAgICAgcmV0dXJuIGAke2J1aWxkaW5nfSBpcyBhIEhlYWRxdWFydGVycyBhbmQgY2Fubm90IGJlIGV4dGluZ3Vpc2hlZCBieSAke3RoaXN9LmA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1leHRpbmd1aXNoIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcmliZXMgdGhpcyBGaXJlRGVwYXJ0bWVudCB0byBleHRpbmd1aXNoIHRoZSBzb21lIG9mIHRoZSBmaXJlIGluIGFcbiAgICAgKiBidWlsZGluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIGJ1aWxkaW5nIC0gVGhlIEJ1aWxkaW5nIHlvdSB3YW50IHRvIGV4dGluZ3Vpc2guXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgYnJpYmUgd29ya2VkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGV4dGluZ3Vpc2goXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICBidWlsZGluZzogQnVpbGRpbmcsXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGV4dGluZ3Vpc2ggLS0+PlxuXG4gICAgICAgIGJ1aWxkaW5nLmZpcmUgPSBjbGFtcChcbiAgICAgICAgICAgIGJ1aWxkaW5nLmZpcmUgLSB0aGlzLmZpcmVFeHRpbmd1aXNoZWQsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgdGhpcy5nYW1lLm1heEZpcmUsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5icmliZWQgPSB0cnVlO1xuICAgICAgICBwbGF5ZXIuYnJpYmVzUmVtYWluaW5nLS07XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGV4dGluZ3Vpc2ggLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==