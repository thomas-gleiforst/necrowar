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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1vYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2FtZXMvc3R1bXBlZC9nYW1lLW9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlCQUF3RDtBQUl4RCxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7O0dBR0c7QUFDSCxNQUFhLFVBQVcsU0FBUSxjQUFXLENBQUMsVUFBVTtJQTBCbEQsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNIO0lBQ0ksNENBQTRDO0lBQzVDLElBQXFDLEVBQ3JDLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztDQWVKO0FBakVELGdDQWlFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMsIElHYW1lT2JqZWN0UHJvcGVydGllcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgU3R1bXBlZEdhbWUgfSBmcm9tIFwiLi9nYW1lXCI7XG5pbXBvcnQgeyBTdHVtcGVkR2FtZU1hbmFnZXIgfSBmcm9tIFwiLi9nYW1lLW1hbmFnZXJcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQW4gb2JqZWN0IGluIHRoZSBnYW1lLiBUaGUgbW9zdCBiYXNpYyBjbGFzcyB0aGF0IGFsbCBnYW1lIGNsYXNzZXMgc2hvdWxkXG4gKiBpbmhlcml0IGZyb20gYXV0b21hdGljYWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIEdhbWVPYmplY3QgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lT2JqZWN0IHtcbiAgICAvKiogVGhlIGdhbWUgdGhpcyBnYW1lIG9iamVjdCBpcyBpbiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lITogU3R1bXBlZEdhbWU7XG5cbiAgICAvKiogVGhlIG1hbmFnZXIgb2YgdGhlIGdhbWUgdGhhdCBjb250cm9scyB0aGlzICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hbmFnZXIhOiBTdHVtcGVkR2FtZU1hbmFnZXI7XG5cbiAgICAvKipcbiAgICAgKiBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0b3AgbGV2ZWwgQ2xhc3MgdGhhdCB0aGlzIGdhbWUgb2JqZWN0IGlzIGFuXG4gICAgICogaW5zdGFuY2Ugb2YuIFVzZWQgZm9yIHJlZmxlY3Rpb24gdG8gY3JlYXRlIG5ldyBpbnN0YW5jZXMgb24gY2xpZW50cywgYnV0XG4gICAgICogZXhwb3NlZCBmb3IgY29udmVuaWVuY2Ugc2hvdWxkIEFJcyB3YW50IHRoaXMgZGF0YS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZU9iamVjdE5hbWUhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBIHVuaXF1ZSBpZCBmb3IgZWFjaCBpbnN0YW5jZSBvZiBhIEdhbWVPYmplY3Qgb3IgYSBzdWIgY2xhc3MuIFVzZWQgZm9yXG4gICAgICogY2xpZW50IGFuZCBzZXJ2ZXIgY29tbXVuaWNhdGlvbi4gU2hvdWxkIG5ldmVyIGNoYW5nZSB2YWx1ZSBhZnRlciBiZWluZ1xuICAgICAqIHNldC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgaWQhOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBBbnkgc3RyaW5ncyBsb2dnZWQgd2lsbCBiZSBzdG9yZWQgaGVyZS4gSW50ZW5kZWQgZm9yIGRlYnVnZ2luZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgbG9ncyE6IHN0cmluZ1tdO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgR2FtZU9iamVjdCBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBJbml0aWFsIHZhbHVlKHMpIHRvIHNldCBtZW1iZXIgdmFyaWFibGVzIHRvLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICAvLyBuZXZlciBkaXJlY3RseSBjcmVhdGVkIGJ5IGdhbWUgZGV2ZWxvcGVyc1xuICAgICAgICBhcmdzOiBSZWFkb25seTxJR2FtZU9iamVjdFByb3BlcnRpZXM+LFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoYXJncywgcmVxdWlyZWQpO1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICAgICAgLy8gc2V0dXAgYW55IHRoaW5nIHlvdSBuZWVkIGhlcmVcbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHByb3RlY3RlZC1wcml2YXRlLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBwcm90ZWN0ZWQgb3IgcGlyYXRlIG1ldGhvZHMgY2FuIGdvIGhlcmUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==