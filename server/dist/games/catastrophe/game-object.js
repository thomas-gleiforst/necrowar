"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * An object in the game. The most basic class that all game classes should
 * inherit from automatically.
 */
class GameObject extends _1.BaseClasses.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a GameObject is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
    // never directly created by game developers
    args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
}
exports.GameObject = GameObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1vYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2FtZXMvY2F0YXN0cm9waGUvZ2FtZS1vYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5QkFBd0Q7QUFJeEQsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7OztHQUdHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsY0FBVyxDQUFDLFVBQVU7SUEwQmxELG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSDtJQUNJLDRDQUE0QztJQUM1QyxJQUFxQyxFQUNyQyxRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7Q0FlSjtBQWpFRCxnQ0FpRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJhc2VDbGFzc2VzLCBJR2FtZU9iamVjdFByb3BlcnRpZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IENhdGFzdHJvcGhlR2FtZSB9IGZyb20gXCIuL2dhbWVcIjtcbmltcG9ydCB7IENhdGFzdHJvcGhlR2FtZU1hbmFnZXIgfSBmcm9tIFwiLi9nYW1lLW1hbmFnZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQW4gb2JqZWN0IGluIHRoZSBnYW1lLiBUaGUgbW9zdCBiYXNpYyBjbGFzcyB0aGF0IGFsbCBnYW1lIGNsYXNzZXMgc2hvdWxkXG4gKiBpbmhlcml0IGZyb20gYXV0b21hdGljYWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIEdhbWVPYmplY3QgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lT2JqZWN0IHtcbiAgICAvKiogVGhlIGdhbWUgdGhpcyBnYW1lIG9iamVjdCBpcyBpbiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lITogQ2F0YXN0cm9waGVHYW1lO1xuXG4gICAgLyoqIFRoZSBtYW5hZ2VyIG9mIHRoZSBnYW1lIHRoYXQgY29udHJvbHMgdGhpcyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VyITogQ2F0YXN0cm9waGVHYW1lTWFuYWdlcjtcblxuICAgIC8qKlxuICAgICAqIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHRvcCBsZXZlbCBDbGFzcyB0aGF0IHRoaXMgZ2FtZSBvYmplY3QgaXMgYW5cbiAgICAgKiBpbnN0YW5jZSBvZi4gVXNlZCBmb3IgcmVmbGVjdGlvbiB0byBjcmVhdGUgbmV3IGluc3RhbmNlcyBvbiBjbGllbnRzLCBidXRcbiAgICAgKiBleHBvc2VkIGZvciBjb252ZW5pZW5jZSBzaG91bGQgQUlzIHdhbnQgdGhpcyBkYXRhLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lT2JqZWN0TmFtZSE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgdW5pcXVlIGlkIGZvciBlYWNoIGluc3RhbmNlIG9mIGEgR2FtZU9iamVjdCBvciBhIHN1YiBjbGFzcy4gVXNlZCBmb3JcbiAgICAgKiBjbGllbnQgYW5kIHNlcnZlciBjb21tdW5pY2F0aW9uLiBTaG91bGQgbmV2ZXIgY2hhbmdlIHZhbHVlIGFmdGVyIGJlaW5nXG4gICAgICogc2V0LlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBpZCE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEFueSBzdHJpbmdzIGxvZ2dlZCB3aWxsIGJlIHN0b3JlZCBoZXJlLiBJbnRlbmRlZCBmb3IgZGVidWdnaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBsb2dzITogc3RyaW5nW107XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBHYW1lT2JqZWN0IGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8vIG5ldmVyIGRpcmVjdGx5IGNyZWF0ZWQgYnkgZ2FtZSBkZXZlbG9wZXJzXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElHYW1lT2JqZWN0UHJvcGVydGllcz4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19