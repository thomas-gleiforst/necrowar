"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spider_1 = require("./spider");
// <<-- /Creer-Merge: imports -->>
/**
 * The Spider Queen. She alone can spawn Spiderlings for each Player, and if
 * she dies the owner loses.
 */
class BroodMother extends spider_1.Spider {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a BroodMother is created.
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
     * Invalidation function for consume. Try to find a reason why the passed
     * in parameters are invalid, and return a human readable string telling
     * them why it is invalid.
     *
     * @param player - The player that called this.
     * @param spiderling - The Spiderling to consume. It must be on the same
     * Nest as this BroodMother.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateConsume(player, spiderling) {
        // <<-- Creer-Merge: invalidate-consume -->>
        // Check all the arguments for consume here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-consume -->>
    }
    /**
     * Consumes a Spiderling of the same owner to regain some eggs to spawn
     * more Spiderlings.
     *
     * @param player - The player that called this.
     * @param spiderling - The Spiderling to consume. It must be on the same
     * Nest as this BroodMother.
     * @returns True if the Spiderling was consumed. False otherwise.
     */
    async consume(player, spiderling) {
        // <<-- Creer-Merge: consume -->>
        // Add logic here for consume.
        // TODO: replace this with actual logic
        return false;
        // <<-- /Creer-Merge: consume -->>
    }
    /**
     * Invalidation function for spawn. Try to find a reason why the passed in
     * parameters are invalid, and return a human readable string telling them
     * why it is invalid.
     *
     * @param player - The player that called this.
     * @param spiderlingType - The string name of the Spiderling class you want
     * to Spawn. Must be 'Spitter', 'Weaver', or 'Cutter'.
     * @returns If the arguments are invalid, return a string explaining to
     * human players why it is invalid. If it is valid return nothing, or an
     * object with new arguments to use in the actual function.
     */
    invalidateSpawn(player, spiderlingType) {
        // <<-- Creer-Merge: invalidate-spawn -->>
        // Check all the arguments for spawn here and try to
        // return a string explaining why the input is wrong.
        // If you need to change an argument for the real function, then
        // changing its value in this scope is enough.
        // <<-- /Creer-Merge: invalidate-spawn -->>
    }
    /**
     * Spawns a new Spiderling on the same Nest as this BroodMother, consuming
     * an egg.
     *
     * @param player - The player that called this.
     * @param spiderlingType - The string name of the Spiderling class you want
     * to Spawn. Must be 'Spitter', 'Weaver', or 'Cutter'.
     * @returns The newly spwaned Spiderling if successful. Undefined
     * otherwise.
     */
    async spawn(player, spiderlingType) {
        // <<-- Creer-Merge: spawn -->>
        // Add logic here for spawn.
        // TODO: replace this with actual logic
        return undefined;
        // <<-- /Creer-Merge: spawn -->>
    }
}
exports.BroodMother = BroodMother;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvb2QtbW90aGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3NwaWRlcnMvYnJvb2QtbW90aGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEscUNBQWtDO0FBS2xDLGtDQUFrQztBQUVsQzs7O0dBR0c7QUFDSCxNQUFhLFdBQVksU0FBUSxlQUFNO0lBWW5DLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNJLElBS0UsRUFDRixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7Ozs7OztPQVdHO0lBQ08saUJBQWlCLENBQ3ZCLE1BQWMsRUFDZCxVQUFzQjtRQUV0Qiw0Q0FBNEM7UUFFNUMsc0RBQXNEO1FBQ3RELHFEQUFxRDtRQUNyRCxnRUFBZ0U7UUFDaEUsOENBQThDO1FBRTlDLDZDQUE2QztJQUNqRCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDTyxLQUFLLENBQUMsT0FBTyxDQUNuQixNQUFjLEVBQ2QsVUFBc0I7UUFFdEIsaUNBQWlDO1FBRWpDLDhCQUE4QjtRQUU5Qix1Q0FBdUM7UUFDdkMsT0FBTyxLQUFLLENBQUM7UUFFYixrQ0FBa0M7SUFDdEMsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ08sZUFBZSxDQUNyQixNQUFjLEVBQ2QsY0FBK0M7UUFFL0MsMENBQTBDO1FBRTFDLG9EQUFvRDtRQUNwRCxxREFBcUQ7UUFDckQsZ0VBQWdFO1FBQ2hFLDhDQUE4QztRQUU5QywyQ0FBMkM7SUFDL0MsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNPLEtBQUssQ0FBQyxLQUFLLENBQ2pCLE1BQWMsRUFDZCxjQUErQztRQUUvQywrQkFBK0I7UUFFL0IsNEJBQTRCO1FBRTVCLHVDQUF1QztRQUN2QyxPQUFPLFNBQVMsQ0FBQztRQUVqQixnQ0FBZ0M7SUFDcEMsQ0FBQztDQU9KO0FBMUpELGtDQTBKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgSUJyb29kTW90aGVyQ29uc3VtZUFyZ3MsIElCcm9vZE1vdGhlclByb3BlcnRpZXMsXG4gICAgICAgICBJQnJvb2RNb3RoZXJTcGF3bkFyZ3MsIFNwaWRlckFyZ3MgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgU3BpZGVyIH0gZnJvbSBcIi4vc3BpZGVyXCI7XG5pbXBvcnQgeyBTcGlkZXJsaW5nIH0gZnJvbSBcIi4vc3BpZGVybGluZ1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IE5lc3QgfSBmcm9tIFwiLi9uZXN0XCI7XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIFNwaWRlciBRdWVlbi4gU2hlIGFsb25lIGNhbiBzcGF3biBTcGlkZXJsaW5ncyBmb3IgZWFjaCBQbGF5ZXIsIGFuZCBpZlxuICogc2hlIGRpZXMgdGhlIG93bmVyIGxvc2VzLlxuICovXG5leHBvcnQgY2xhc3MgQnJvb2RNb3RoZXIgZXh0ZW5kcyBTcGlkZXIge1xuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IGVnZ3MgdGhlIEJyb29kTW90aGVyIGhhcyB0byBzcGF3biBTcGlkZXJsaW5ncyB0aGlzIHR1cm4uXG4gICAgICovXG4gICAgcHVibGljIGVnZ3MhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBoZWFsdGggdGhpcyBCcm9vZE1vdGhlciBoYXMgbGVmdC4gV2hlbiBpdCByZWFjaGVzIDAsIHNoZSBkaWVzXG4gICAgICogYW5kIGhlciBvd25lciBsb3Nlcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgaGVhbHRoITogbnVtYmVyO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgQnJvb2RNb3RoZXIgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgYXJnczogUmVhZG9ubHk8U3BpZGVyQXJncyAmIElCcm9vZE1vdGhlclByb3BlcnRpZXMgJiB7XG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgICAgIC8qKiBUaGUgTmVzdCB0aGlzIEJyb29kTW90aGVyIGV4aXN0cyB1cG9uLiAqL1xuICAgICAgICAgICAgbmVzdDogTmVzdDtcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBjb25zdW1lLiBUcnkgdG8gZmluZCBhIHJlYXNvbiB3aHkgdGhlIHBhc3NlZFxuICAgICAqIGluIHBhcmFtZXRlcnMgYXJlIGludmFsaWQsIGFuZCByZXR1cm4gYSBodW1hbiByZWFkYWJsZSBzdHJpbmcgdGVsbGluZ1xuICAgICAqIHRoZW0gd2h5IGl0IGlzIGludmFsaWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBzcGlkZXJsaW5nIC0gVGhlIFNwaWRlcmxpbmcgdG8gY29uc3VtZS4gSXQgbXVzdCBiZSBvbiB0aGUgc2FtZVxuICAgICAqIE5lc3QgYXMgdGhpcyBCcm9vZE1vdGhlci5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVDb25zdW1lKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgc3BpZGVybGluZzogU3BpZGVybGluZyxcbiAgICApOiB2b2lkIHwgc3RyaW5nIHwgSUJyb29kTW90aGVyQ29uc3VtZUFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLWNvbnN1bWUgLS0+PlxuXG4gICAgICAgIC8vIENoZWNrIGFsbCB0aGUgYXJndW1lbnRzIGZvciBjb25zdW1lIGhlcmUgYW5kIHRyeSB0b1xuICAgICAgICAvLyByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB3aHkgdGhlIGlucHV0IGlzIHdyb25nLlxuICAgICAgICAvLyBJZiB5b3UgbmVlZCB0byBjaGFuZ2UgYW4gYXJndW1lbnQgZm9yIHRoZSByZWFsIGZ1bmN0aW9uLCB0aGVuXG4gICAgICAgIC8vIGNoYW5naW5nIGl0cyB2YWx1ZSBpbiB0aGlzIHNjb3BlIGlzIGVub3VnaC5cblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZS1jb25zdW1lIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25zdW1lcyBhIFNwaWRlcmxpbmcgb2YgdGhlIHNhbWUgb3duZXIgdG8gcmVnYWluIHNvbWUgZWdncyB0byBzcGF3blxuICAgICAqIG1vcmUgU3BpZGVybGluZ3MuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciB0aGF0IGNhbGxlZCB0aGlzLlxuICAgICAqIEBwYXJhbSBzcGlkZXJsaW5nIC0gVGhlIFNwaWRlcmxpbmcgdG8gY29uc3VtZS4gSXQgbXVzdCBiZSBvbiB0aGUgc2FtZVxuICAgICAqIE5lc3QgYXMgdGhpcyBCcm9vZE1vdGhlci5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBTcGlkZXJsaW5nIHdhcyBjb25zdW1lZC4gRmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBjb25zdW1lKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgc3BpZGVybGluZzogU3BpZGVybGluZyxcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3VtZSAtLT4+XG5cbiAgICAgICAgLy8gQWRkIGxvZ2ljIGhlcmUgZm9yIGNvbnN1bWUuXG5cbiAgICAgICAgLy8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggYWN0dWFsIGxvZ2ljXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3VtZSAtLT4+XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52YWxpZGF0aW9uIGZ1bmN0aW9uIGZvciBzcGF3bi4gVHJ5IHRvIGZpbmQgYSByZWFzb24gd2h5IHRoZSBwYXNzZWQgaW5cbiAgICAgKiBwYXJhbWV0ZXJzIGFyZSBpbnZhbGlkLCBhbmQgcmV0dXJuIGEgaHVtYW4gcmVhZGFibGUgc3RyaW5nIHRlbGxpbmcgdGhlbVxuICAgICAqIHdoeSBpdCBpcyBpbnZhbGlkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgdGhhdCBjYWxsZWQgdGhpcy5cbiAgICAgKiBAcGFyYW0gc3BpZGVybGluZ1R5cGUgLSBUaGUgc3RyaW5nIG5hbWUgb2YgdGhlIFNwaWRlcmxpbmcgY2xhc3MgeW91IHdhbnRcbiAgICAgKiB0byBTcGF3bi4gTXVzdCBiZSAnU3BpdHRlcicsICdXZWF2ZXInLCBvciAnQ3V0dGVyJy5cbiAgICAgKiBAcmV0dXJucyBJZiB0aGUgYXJndW1lbnRzIGFyZSBpbnZhbGlkLCByZXR1cm4gYSBzdHJpbmcgZXhwbGFpbmluZyB0b1xuICAgICAqIGh1bWFuIHBsYXllcnMgd2h5IGl0IGlzIGludmFsaWQuIElmIGl0IGlzIHZhbGlkIHJldHVybiBub3RoaW5nLCBvciBhblxuICAgICAqIG9iamVjdCB3aXRoIG5ldyBhcmd1bWVudHMgdG8gdXNlIGluIHRoZSBhY3R1YWwgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGVTcGF3bihcbiAgICAgICAgcGxheWVyOiBQbGF5ZXIsXG4gICAgICAgIHNwaWRlcmxpbmdUeXBlOiBcIlNwaXR0ZXJcIiB8IFwiV2VhdmVyXCIgfCBcIkN1dHRlclwiLFxuICAgICk6IHZvaWQgfCBzdHJpbmcgfCBJQnJvb2RNb3RoZXJTcGF3bkFyZ3Mge1xuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNwYXduIC0tPj5cblxuICAgICAgICAvLyBDaGVjayBhbGwgdGhlIGFyZ3VtZW50cyBmb3Igc3Bhd24gaGVyZSBhbmQgdHJ5IHRvXG4gICAgICAgIC8vIHJldHVybiBhIHN0cmluZyBleHBsYWluaW5nIHdoeSB0aGUgaW5wdXQgaXMgd3JvbmcuXG4gICAgICAgIC8vIElmIHlvdSBuZWVkIHRvIGNoYW5nZSBhbiBhcmd1bWVudCBmb3IgdGhlIHJlYWwgZnVuY3Rpb24sIHRoZW5cbiAgICAgICAgLy8gY2hhbmdpbmcgaXRzIHZhbHVlIGluIHRoaXMgc2NvcGUgaXMgZW5vdWdoLlxuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlLXNwYXduIC0tPj5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTcGF3bnMgYSBuZXcgU3BpZGVybGluZyBvbiB0aGUgc2FtZSBOZXN0IGFzIHRoaXMgQnJvb2RNb3RoZXIsIGNvbnN1bWluZ1xuICAgICAqIGFuIGVnZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoYXQgY2FsbGVkIHRoaXMuXG4gICAgICogQHBhcmFtIHNwaWRlcmxpbmdUeXBlIC0gVGhlIHN0cmluZyBuYW1lIG9mIHRoZSBTcGlkZXJsaW5nIGNsYXNzIHlvdSB3YW50XG4gICAgICogdG8gU3Bhd24uIE11c3QgYmUgJ1NwaXR0ZXInLCAnV2VhdmVyJywgb3IgJ0N1dHRlcicuXG4gICAgICogQHJldHVybnMgVGhlIG5ld2x5IHNwd2FuZWQgU3BpZGVybGluZyBpZiBzdWNjZXNzZnVsLiBVbmRlZmluZWRcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHNwYXduKFxuICAgICAgICBwbGF5ZXI6IFBsYXllcixcbiAgICAgICAgc3BpZGVybGluZ1R5cGU6IFwiU3BpdHRlclwiIHwgXCJXZWF2ZXJcIiB8IFwiQ3V0dGVyXCIsXG4gICAgKTogUHJvbWlzZTxTcGlkZXJsaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNwYXduIC0tPj5cblxuICAgICAgICAvLyBBZGQgbG9naWMgaGVyZSBmb3Igc3Bhd24uXG5cbiAgICAgICAgLy8gVE9ETzogcmVwbGFjZSB0aGlzIHdpdGggYWN0dWFsIGxvZ2ljXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNwYXduIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgcHJvdGVjdGVkIG9yIHBpcmF0ZSBtZXRob2RzIGNhbiBnbyBoZXJlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG59XG4iXX0=