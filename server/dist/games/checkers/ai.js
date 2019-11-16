"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * Represents the AI that a player controls. This acts as an interface to send
 * the AI orders to execute.
 */
class AI extends _1.BaseClasses.AI {
    // <<-- Creer-Merge: attributes -->>
    // If the AI needs additional attributes add them here.
    // NOTE: these are not set in client AIs.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * This is called whenever your checker gets captured (during an opponent's
     * turn).
     *
     * @param checker - The checker that was captured.
     */
    async gotCaptured(checker) {
        this.executeOrder("gotCaptured", checker);
    }
}
exports.AI = AI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2FtZXMvY2hlY2tlcnMvYWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBaUM7QUFHakMsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7OztHQUdHO0FBQ0gsTUFBYSxFQUFHLFNBQVEsY0FBVyxDQUFDLEVBQUU7SUFFdEMsb0NBQW9DO0lBQ3BDLHVEQUF1RDtJQUN2RCx5Q0FBeUM7SUFDekMscUNBQXFDO0lBQ2pDOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFnQjtRQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFDM0IsT0FBTyxDQUNWLENBQUM7SUFDTixDQUFDO0NBT0o7QUF2QkQsZ0JBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IENoZWNrZXIgfSBmcm9tIFwiLi9jaGVja2VyXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIEFJIHRoYXQgYSBwbGF5ZXIgY29udHJvbHMuIFRoaXMgYWN0cyBhcyBhbiBpbnRlcmZhY2UgdG8gc2VuZFxuICogdGhlIEFJIG9yZGVycyB0byBleGVjdXRlLlxuICovXG5leHBvcnQgY2xhc3MgQUkgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5BSSB7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuLy8gSWYgdGhlIEFJIG5lZWRzIGFkZGl0aW9uYWwgYXR0cmlidXRlcyBhZGQgdGhlbSBoZXJlLlxuLy8gTk9URTogdGhlc2UgYXJlIG5vdCBzZXQgaW4gY2xpZW50IEFJcy5cbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGNhbGxlZCB3aGVuZXZlciB5b3VyIGNoZWNrZXIgZ2V0cyBjYXB0dXJlZCAoZHVyaW5nIGFuIG9wcG9uZW50J3NcbiAgICAgKiB0dXJuKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGVja2VyIC0gVGhlIGNoZWNrZXIgdGhhdCB3YXMgY2FwdHVyZWQuXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGdvdENhcHR1cmVkKGNoZWNrZXI6IENoZWNrZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5leGVjdXRlT3JkZXIoXCJnb3RDYXB0dXJlZFwiLFxuICAgICAgICAgICAgY2hlY2tlcixcbiAgICAgICAgKTtcbiAgICB9XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGZ1bmN0aW9ucyAtLT4+XG4vLyBJZiB0aGUgQUkgbmVlZHMgYWRkaXRpb25hbCBhdHRyaWJ1dGVzIGFkZCB0aGVtIGhlcmUuXG4vLy8gTk9URTogdGhlc2Ugd2lsbCBub3QgYmUgY2FsbGFibGUgaW4gY2xpZW50IEFJcy5cbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBmdW5jdGlvbnMgLS0+PlxuXG59XG4iXX0=