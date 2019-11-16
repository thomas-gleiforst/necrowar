"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_1 = require("./game-object");
/**
 * Information about a unit's job.
 */
class Job extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Job is created.
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
}
exports.Job = Job;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL25ld3Rvbmlhbi9qb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQ0FBMkM7QUFXM0M7O0dBRUc7QUFDSCxNQUFhLEdBQUksU0FBUSx3QkFBVTtJQTBCL0Isb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ0ksSUFJRSxFQUNGLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztDQWVKO0FBcEVELGtCQW9FQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgSUpvYlByb3BlcnRpZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgSm9iIHRpdGxlLiAnaW50ZXJuJywgJ21hbmFnZXInLCBvciAncGh5c2ljaXN0Jy5cbiAqL1xuZXhwb3J0IHR5cGUgSm9iVGl0bGUgPSBcImludGVyblwiIHwgXCJtYW5hZ2VyXCIgfCBcInBoeXNpY2lzdFwiO1xuXG4vKipcbiAqIEluZm9ybWF0aW9uIGFib3V0IGEgdW5pdCdzIGpvYi5cbiAqL1xuZXhwb3J0IGNsYXNzIEpvYiBleHRlbmRzIEdhbWVPYmplY3Qge1xuICAgIC8qKlxuICAgICAqIEhvdyBtYW55IGNvbWJpbmVkIHJlc291cmNlcyBhIHVuaXQgd2l0aCB0aGlzIEpvYiBjYW4gaG9sZCBhdCBvbmNlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjYXJyeUxpbWl0ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBkYW1hZ2UgdGhpcyBKb2IgZG9lcyBwZXIgYXR0YWNrLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBkYW1hZ2UhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIHN0YXJ0aW5nIGhlYWx0aCB0aGlzIEpvYiBoYXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGhlYWx0aCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgbW92ZXMgdGhpcyBKb2IgY2FuIG1ha2UgcGVyIHR1cm4uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1vdmVzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIEpvYiB0aXRsZS4gJ2ludGVybicsICdtYW5hZ2VyJywgb3IgJ3BoeXNpY2lzdCcuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpdGxlITogXCJpbnRlcm5cIiB8IFwibWFuYWdlclwiIHwgXCJwaHlzaWNpc3RcIjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIEpvYiBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBhcmdzOiBSZWFkb25seTxJSm9iUHJvcGVydGllcyAmIHtcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yLWFyZ3MgLS0+PlxuICAgICAgICAgICAgLy8gWW91IGNhbiBhZGQgbW9yZSBjb25zdHJ1Y3RvciBhcmdzIGluIGhlcmVcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3Rvci1hcmdzIC0tPj5cbiAgICAgICAgfT4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19