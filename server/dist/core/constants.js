"use strict";
// Put constant values here to be sent to clients,
// they will not be able to be changed thanks to Object.freeze
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * These constants will be sent to clients.
 * (hence shared between the server here and clients)
 */
exports.SHARED_CONSTANTS = Object.freeze({
    /**
     * Special symbol that indicates a delta's key was removed when this value
     * is present.
     */
    DELTA_REMOVED: "&RM",
    /**
     * A special key that indicates the object is an array with the value being
     * the array's length.
     */
    DELTA_LIST_LENGTH: "&LEN",
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvcmUvY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxrREFBa0Q7QUFDbEQsOERBQThEOztBQUk5RDs7O0dBR0c7QUFDVSxRQUFBLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQXVCO0lBQ2hFOzs7T0FHRztJQUNILGFBQWEsRUFBRSxLQUFLO0lBRXBCOzs7T0FHRztJQUNILGlCQUFpQixFQUFFLE1BQU07Q0FDNUIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUHV0IGNvbnN0YW50IHZhbHVlcyBoZXJlIHRvIGJlIHNlbnQgdG8gY2xpZW50cyxcbi8vIHRoZXkgd2lsbCBub3QgYmUgYWJsZSB0byBiZSBjaGFuZ2VkIHRoYW5rcyB0byBPYmplY3QuZnJlZXplXG5cbmltcG9ydCB7IElEZWx0YU1lcmdlQ29uc3RhbnRzIH0gZnJvbSBcIkBjYWRyZS90cy11dGlscy9jYWRyZVwiO1xuXG4vKipcbiAqIFRoZXNlIGNvbnN0YW50cyB3aWxsIGJlIHNlbnQgdG8gY2xpZW50cy5cbiAqIChoZW5jZSBzaGFyZWQgYmV0d2VlbiB0aGUgc2VydmVyIGhlcmUgYW5kIGNsaWVudHMpXG4gKi9cbmV4cG9ydCBjb25zdCBTSEFSRURfQ09OU1RBTlRTID0gT2JqZWN0LmZyZWV6ZTxJRGVsdGFNZXJnZUNvbnN0YW50cz4oe1xuICAgIC8qKlxuICAgICAqIFNwZWNpYWwgc3ltYm9sIHRoYXQgaW5kaWNhdGVzIGEgZGVsdGEncyBrZXkgd2FzIHJlbW92ZWQgd2hlbiB0aGlzIHZhbHVlXG4gICAgICogaXMgcHJlc2VudC5cbiAgICAgKi9cbiAgICBERUxUQV9SRU1PVkVEOiBcIiZSTVwiLFxuXG4gICAgLyoqXG4gICAgICogQSBzcGVjaWFsIGtleSB0aGF0IGluZGljYXRlcyB0aGUgb2JqZWN0IGlzIGFuIGFycmF5IHdpdGggdGhlIHZhbHVlIGJlaW5nXG4gICAgICogdGhlIGFycmF5J3MgbGVuZ3RoLlxuICAgICAqL1xuICAgIERFTFRBX0xJU1RfTEVOR1RIOiBcIiZMRU5cIixcbn0pO1xuIl19