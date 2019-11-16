"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const building_1 = require("./building");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * Used to keep cities under control and raid Warehouses.
 */
class PoliceDepartment extends building_1.Building {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a PoliceDepartment is created.
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
     * Invalidation function for raid. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param warehouse - The warehouse you want to raid.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateRaid(player, warehouse) {
        // <<-- Creer-Merge: invalidate-raid -->>
        const invalid = this.invalidateBribe(player);
        if (invalid) {
            return invalid;
        }
        // <<-- /Creer-Merge: invalidate-raid -->>
    }
    /**
     * Bribe the police to raid a Warehouse, dealing damage equal based on the
     * Warehouse's current exposure, and then resetting it to 0.
     *
     * @param player - The player that called this.
     * @param warehouse - The warehouse you want to raid.
     * @returns The amount of damage dealt to the warehouse, or -1 if there was
     * an error.
     */
    async raid(player, warehouse) {
        // <<-- Creer-Merge: raid -->>
        const oldHealth = warehouse.health;
        warehouse.health = Math.max(warehouse.health - warehouse.exposure, 0);
        warehouse.exposure = 0;
        this.bribed = true;
        player.bribesRemaining--;
        return oldHealth - warehouse.health;
        // <<-- /Creer-Merge: raid -->>
    }
}
exports.PoliceDepartment = PoliceDepartment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWNlLWRlcGFydG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2FtZXMvYW5hcmNoeS9wb2xpY2UtZGVwYXJ0bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHlDQUFzQztBQUl0QyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEsbUJBQVE7SUFDMUMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7Ozs7T0FVRztJQUNPLGNBQWMsQ0FDcEIsTUFBYyxFQUNkLFNBQW9CO1FBRXBCLHlDQUF5QztRQUV6QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxPQUFPLENBQUM7U0FDbEI7UUFFRCwwQ0FBMEM7SUFDOUMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ08sS0FBSyxDQUFDLElBQUksQ0FDaEIsTUFBYyxFQUNkLFNBQW9CO1FBRXBCLDhCQUE4QjtRQUU5QixNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ25DLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEUsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFFdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBRXpCLE9BQU8sU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFFcEMsK0JBQStCO0lBQ25DLENBQUM7Q0FPSjtBQS9GRCw0Q0ErRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJ1aWxkaW5nQXJncywgSVBvbGljZURlcGFydG1lbnRQcm9wZXJ0aWVzLCBJUG9saWNlRGVwYXJ0bWVudFJhaWRBcmdzLFxuICAgICAgIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBCdWlsZGluZyB9IGZyb20gXCIuL2J1aWxkaW5nXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFdhcmVob3VzZSB9IGZyb20gXCIuL3dhcmVob3VzZVwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBVc2VkIHRvIGtlZXAgY2l0aWVzIHVuZGVyIGNvbnRyb2wgYW5kIHJhaWQgV2FyZWhvdXNlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIFBvbGljZURlcGFydG1lbnQgZXh0ZW5kcyBCdWlsZGluZyB7XG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgUG9saWNlRGVwYXJ0bWVudCBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxCdWlsZGluZ0FyZ3MgJiBJUG9saWNlRGVwYXJ0bWVudFByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8vIFlvdSBjYW4gYWRkIG1vcmUgY29uc3RydWN0b3IgYXJncyBpbiBoZXJlXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3ItYXJncyAtLT4+XG4gICAgICAgIH0+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEludmFsaWRhdGlvbiBmdW5jdGlvbiBmb3IgcmFpZC4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gd2FyZWhvdXNlIC0gVGhlIHdhcmVob3VzZSB5b3Ugd2FudCB0byByYWlkLlxuICAgICAqIEByZXR1cm5zIElmIHRoZSBhcmd1bWVudHMgYXJlIGludmFsaWQsIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHRvXG4gICAgICogaHVtYW4gcGxheWVycyB3aHkgaXQgaXMgaW52YWxpZC4gSWYgaXQgaXMgdmFsaWQgcmV0dXJuIG5vdGhpbmcsIG9yIGFuXG4gICAgICogb2JqZWN0IHdpdGggbmV3IGFyZ3VtZW50cyB0byB1c2UgaW4gdGhlIGFjdHVhbCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZVJhaWQoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB3YXJlaG91c2U6IFdhcmVob3VzZSxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSVBvbGljZURlcGFydG1lbnRSYWlkQXJncyB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUtcmFpZCAtLT4+XG5cbiAgICAgICAgY29uc3QgaW52YWxpZCA9IHRoaXMuaW52YWxpZGF0ZUJyaWJlKHBsYXllcik7XG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXJhaWQgLS0+PlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJyaWJlIHRoZSBwb2xpY2UgdG8gcmFpZCBhIFdhcmVob3VzZSwgZGVhbGluZyBkYW1hZ2UgZXF1YWwgYmFzZWQgb24gdGhlXG4gICAgICogV2FyZWhvdXNlJ3MgY3VycmVudCBleHBvc3VyZSwgYW5kIHRoZW4gcmVzZXR0aW5nIGl0IHRvIDAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSB3YXJlaG91c2UgLSBUaGUgd2FyZWhvdXNlIHlvdSB3YW50IHRvIHJhaWQuXG4gICAgICogQHJldHVybnMgVGhlIGFtb3VudCBvZiBkYW1hZ2UgZGVhbHQgdG8gdGhlIHdhcmVob3VzZSwgb3IgLTEgaWYgdGhlcmUgd2FzXG4gICAgICogYW4gZXJyb3IuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHJhaWQoXG4gICAgICAgIHBsYXllcjogUGxheWVyLFxuICAgICAgICB3YXJlaG91c2U6IFdhcmVob3VzZSxcbiAgICApOiBQcm9taXNlPG51bWJlcj4ge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiByYWlkIC0tPj5cblxuICAgICAgICBjb25zdCBvbGRIZWFsdGggPSB3YXJlaG91c2UuaGVhbHRoO1xuICAgICAgICB3YXJlaG91c2UuaGVhbHRoID0gTWF0aC5tYXgod2FyZWhvdXNlLmhlYWx0aCAtIHdhcmVob3VzZS5leHBvc3VyZSwgMCk7XG4gICAgICAgIHdhcmVob3VzZS5leHBvc3VyZSA9IDA7XG5cbiAgICAgICAgdGhpcy5icmliZWQgPSB0cnVlO1xuICAgICAgICBwbGF5ZXIuYnJpYmVzUmVtYWluaW5nLS07XG5cbiAgICAgICAgcmV0dXJuIG9sZEhlYWx0aCAtIHdhcmVob3VzZS5oZWFsdGg7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJhaWQgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==