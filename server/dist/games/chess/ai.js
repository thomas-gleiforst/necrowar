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
     * This is called every time it is this AI.player's turn to make a move.
     *
     * @returns A string in Standard Algebraic Notation (SAN) for the move you
     * want to make. If the move is invalid or not properly formatted you will
     * lose the game.
     */
    async makeMove() {
        return this.executeOrder("makeMove");
    }
}
exports.AI = AI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ2FtZXMvY2hlc3MvYWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBaUM7QUFFakMsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7OztHQUdHO0FBQ0gsTUFBYSxFQUFHLFNBQVEsY0FBVyxDQUFDLEVBQUU7SUFFdEMsb0NBQW9DO0lBQ3BDLHVEQUF1RDtJQUN2RCx5Q0FBeUM7SUFDekMscUNBQXFDO0lBQ2pDOzs7Ozs7T0FNRztJQUNJLEtBQUssQ0FBQyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN6QyxDQUFDO0NBT0o7QUF0QkQsZ0JBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgQUkgdGhhdCBhIHBsYXllciBjb250cm9scy4gVGhpcyBhY3RzIGFzIGFuIGludGVyZmFjZSB0byBzZW5kXG4gKiB0aGUgQUkgb3JkZXJzIHRvIGV4ZWN1dGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBSSBleHRlbmRzIEJhc2VDbGFzc2VzLkFJIHtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG4vLyBJZiB0aGUgQUkgbmVlZHMgYWRkaXRpb25hbCBhdHRyaWJ1dGVzIGFkZCB0aGVtIGhlcmUuXG4vLyBOT1RFOiB0aGVzZSBhcmUgbm90IHNldCBpbiBjbGllbnQgQUlzLlxuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgaXQgaXMgdGhpcyBBSS5wbGF5ZXIncyB0dXJuIHRvIG1ha2UgYSBtb3ZlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBzdHJpbmcgaW4gU3RhbmRhcmQgQWxnZWJyYWljIE5vdGF0aW9uIChTQU4pIGZvciB0aGUgbW92ZSB5b3VcbiAgICAgKiB3YW50IHRvIG1ha2UuIElmIHRoZSBtb3ZlIGlzIGludmFsaWQgb3Igbm90IHByb3Blcmx5IGZvcm1hdHRlZCB5b3Ugd2lsbFxuICAgICAqIGxvc2UgdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIG1ha2VNb3ZlKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGVPcmRlcihcIm1ha2VNb3ZlXCIpO1xuICAgIH1cblxuLy8gPDwtLSBDcmVlci1NZXJnZTogZnVuY3Rpb25zIC0tPj5cbi8vIElmIHRoZSBBSSBuZWVkcyBhZGRpdGlvbmFsIGF0dHJpYnV0ZXMgYWRkIHRoZW0gaGVyZS5cbi8vLyBOT1RFOiB0aGVzZSB3aWxsIG5vdCBiZSBjYWxsYWJsZSBpbiBjbGllbnQgQUlzLlxuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGZ1bmN0aW9ucyAtLT4+XG5cbn1cbiJdfQ==