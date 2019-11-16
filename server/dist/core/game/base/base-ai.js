"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A way to interact with a client/player's AI via simple async methods for
 * orders
 */
// NOTE: this is basically a wrapper around the AI, so that some public
// functions cannot be seen to games, but can be seen to those with the access
// to the manager
// e.g. the session
class BaseAI {
    /**
     * Creates an AI interface.
     *
     * @param manager - the AI manager for this AI that actually does the heavy
     * lifting.
     */
    constructor(manager) {
        this.manager = manager;
    }
    /**
     * A method invoked by sub AI classes written by creer to send an order
     * command to this AI.
     *
     * @param name - The name of the function (order) to execute.
     * @param args - optional **positional** arguments to send to the function.
     * @returns A promise that resolves to the value the AI returned from that
     * order, once they finish that order.
     */
    executeOrder(name, ...args) {
        return this.manager.executeOrder(name, ...args);
    }
}
exports.BaseAI = BaseAI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1haS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvYmFzZS9iYXNlLWFpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7OztHQUdHO0FBQ0gsdUVBQXVFO0FBQ3ZFLDhFQUE4RTtBQUM5RSxpQkFBaUI7QUFDakIsbUJBQW1CO0FBQ25CLE1BQWEsTUFBTTtJQUNmOzs7OztPQUtHO0lBQ0gsWUFBNkIsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUFHLENBQUM7SUFFdkQ7Ozs7Ozs7O09BUUc7SUFDTyxZQUFZLENBQ2xCLElBQVksRUFDWixHQUFHLElBQWU7UUFFbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0o7QUF4QkQsd0JBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUFJTWFuYWdlciB9IGZyb20gXCIuL2Jhc2UtYWktbWFuYWdlclwiO1xuXG4vKipcbiAqIEEgd2F5IHRvIGludGVyYWN0IHdpdGggYSBjbGllbnQvcGxheWVyJ3MgQUkgdmlhIHNpbXBsZSBhc3luYyBtZXRob2RzIGZvclxuICogb3JkZXJzXG4gKi9cbi8vIE5PVEU6IHRoaXMgaXMgYmFzaWNhbGx5IGEgd3JhcHBlciBhcm91bmQgdGhlIEFJLCBzbyB0aGF0IHNvbWUgcHVibGljXG4vLyBmdW5jdGlvbnMgY2Fubm90IGJlIHNlZW4gdG8gZ2FtZXMsIGJ1dCBjYW4gYmUgc2VlbiB0byB0aG9zZSB3aXRoIHRoZSBhY2Nlc3Ncbi8vIHRvIHRoZSBtYW5hZ2VyXG4vLyBlLmcuIHRoZSBzZXNzaW9uXG5leHBvcnQgY2xhc3MgQmFzZUFJIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEFJIGludGVyZmFjZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtYW5hZ2VyIC0gdGhlIEFJIG1hbmFnZXIgZm9yIHRoaXMgQUkgdGhhdCBhY3R1YWxseSBkb2VzIHRoZSBoZWF2eVxuICAgICAqIGxpZnRpbmcuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBtYW5hZ2VyOiBCYXNlQUlNYW5hZ2VyKSB7fVxuXG4gICAgLyoqXG4gICAgICogQSBtZXRob2QgaW52b2tlZCBieSBzdWIgQUkgY2xhc3NlcyB3cml0dGVuIGJ5IGNyZWVyIHRvIHNlbmQgYW4gb3JkZXJcbiAgICAgKiBjb21tYW5kIHRvIHRoaXMgQUkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiAob3JkZXIpIHRvIGV4ZWN1dGUuXG4gICAgICogQHBhcmFtIGFyZ3MgLSBvcHRpb25hbCAqKnBvc2l0aW9uYWwqKiBhcmd1bWVudHMgdG8gc2VuZCB0byB0aGUgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIHZhbHVlIHRoZSBBSSByZXR1cm5lZCBmcm9tIHRoYXRcbiAgICAgKiBvcmRlciwgb25jZSB0aGV5IGZpbmlzaCB0aGF0IG9yZGVyLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBleGVjdXRlT3JkZXIoXG4gICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgLi4uYXJnczogdW5rbm93bltdXG4gICAgKTogUHJvbWlzZTxhbnk+IC8qIHRzbGludDpkaXNhYmxlLWxpbmU6bm8tYW55IC0gdGhpcyBpcyBkeW5hbWljICovIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuYWdlci5leGVjdXRlT3JkZXIobmFtZSwgLi4uYXJncyk7XG4gICAgfVxufVxuIl19