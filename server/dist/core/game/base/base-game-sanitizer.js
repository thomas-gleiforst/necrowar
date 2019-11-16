"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_1 = require("~/core/sanitize/");
const utils_1 = require("~/utils");
const base_game_object_1 = require("./base-game-object");
/**
 * A collection of static functions to sanitize inputs from AI clients for the
 * Game.
 */
class BaseGameSanitizer {
    /**
     * Creates a new sanitizer for a game.
     *
     * @param namespace - The game namespace we are sanitizing for.
     */
    constructor(namespace) {
        this.namespace = namespace;
    }
    /**
     * Sanitizes arguments for an AI order.
     *
     * @param aiFunctionName - The name of the order.
     * @param args  - The arguments for that order (in order of arguments).
     * @returns An error if they could not be sanitized. Otherwise a new array
     * with freshly sanitized arguments.
     */
    sanitizeOrderArgs(aiFunctionName, args) {
        const schema = this.namespace.gameObjectsSchema.AI.functions[aiFunctionName];
        if (!schema) {
            return new Error(`Order ${aiFunctionName} does not exist to sanitize args for`);
        }
        const argsArray = sanitize_1.sanitizeArray(args, false);
        return schema.args.map((t, i) => {
            const sanitized = sanitize_1.sanitizeType(t, argsArray[i]);
            if (sanitized instanceof Error) {
                throw sanitized; // server side error, we should never have this happen
            }
            return sanitized;
        });
    }
    /**
     * Validates a return value from an AI finishing an order.
     *
     * @param aiFunctionName - The name of the order/function the AI executed.
     * @param returned - The value they returned.
     * @returns The returned value, now sanitized.
     */
    validateFinishedReturned(aiFunctionName, returned) {
        const schema = this.namespace.gameObjectsSchema.AI.functions[aiFunctionName];
        if (!schema) {
            return new Error(`Order ${aiFunctionName} does not exist to sanitize returned for`);
        }
        return sanitize_1.sanitizeType(schema.returns, returned);
    }
    /**
     * Validates the arguments for an AI requesting a run function.
     *
     * @param gameObject - The game object that would run this function.
     * @param functionName - The name of the function trying to run.
     * @param args - Key/value arguments for the function
     * @returns An error if validation failed, otherwise a map of sanitized
     * key/value arguments, with the iteration order respecting their argument
     * order for the function.
     */
    validateRunArgs(gameObject, functionName, args) {
        const schema = this.validateGameObject(gameObject, functionName);
        if (schema instanceof Error) {
            return schema;
        }
        const sanitizedArgs = new Map();
        for (const arg of schema.args) {
            const value = utils_1.objectHasProperty(args, arg.argName)
                ? args[arg.argName]
                : arg.defaultValue;
            const sanitized = sanitize_1.sanitizeType(arg, value);
            if (sanitized instanceof Error) {
                return {
                    invalid: `${gameObject.gameObjectName}.${functionName}()'s '${arg.argName}' arg was sent ${utils_1.quoteIfString(value)} - ${sanitized.message}`,
                };
            }
            sanitizedArgs.set(arg.argName, sanitized);
        }
        return sanitizedArgs;
    }
    /**
     * Validates the return value of a ran function.
     *
     * @param gameObject - The game object instance that ran code.
     * @param functionName - The function name in the game object that ran.
     * @param returned - The value that was returned from that function.
     * @returns A sanitized return value of the expected schema type.
     */
    validateRanReturned(gameObject, functionName, returned) {
        const schema = this.validateGameObject(gameObject, functionName);
        if (schema instanceof Error) {
            return schema;
        }
        const sanitized = sanitize_1.sanitizeType(schema.returns, returned);
        if (sanitized instanceof Error) {
            throw sanitized; // server side error, we should never have this happen
        }
        return sanitized;
    }
    /**
     * Validates a game object has a specific function.
     *
     * @param gameObject - The game object instance.
     * @param functionName The function name inside the game object.
     * @returns The schema if valid, otherwise an error.
     */
    validateGameObject(gameObject, functionName) {
        if (!gameObject ||
            !(gameObject instanceof base_game_object_1.BaseGameObject) ||
            !this.namespace.gameObjectsSchema[gameObject.gameObjectName]) {
            return new Error(`${gameObject} is not a valid game object`);
        }
        const gameObjectSchema = this.namespace.gameObjectsSchema[gameObject.gameObjectName];
        const functionSchema = gameObjectSchema && gameObjectSchema.functions[functionName];
        if (!gameObjectSchema || !functionSchema) {
            return new Error(`${gameObject} does not have a method ${functionName}`);
        }
        return functionSchema;
    }
}
exports.BaseGameSanitizer = BaseGameSanitizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1nYW1lLXNhbml0aXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2FuaXRpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQStEO0FBQy9ELG1DQUFxRjtBQUVyRix5REFBb0Q7QUFRcEQ7OztHQUdHO0FBQ0gsTUFBYSxpQkFBaUI7SUFDMUI7Ozs7T0FJRztJQUNILFlBQStCLFNBQXdDO1FBQXhDLGNBQVMsR0FBVCxTQUFTLENBQStCO0lBQ3ZFLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksaUJBQWlCLENBQ3BCLGNBQXNCLEVBQ3RCLElBQTBCO1FBRTFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1QsT0FBTyxJQUFJLEtBQUssQ0FBQyxTQUFTLGNBQWMsc0NBQXNDLENBQUMsQ0FBQztTQUNuRjtRQUVELE1BQU0sU0FBUyxHQUFHLHdCQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTdDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsTUFBTSxTQUFTLEdBQUcsdUJBQVksQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxTQUFTLFlBQVksS0FBSyxFQUFFO2dCQUM1QixNQUFNLFNBQVMsQ0FBQyxDQUFDLHNEQUFzRDthQUMxRTtZQUVELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLHdCQUF3QixDQUMzQixjQUFzQixFQUN0QixRQUFpQjtRQUVqQixNQUFNLE1B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QUFVLDJCQUEyQixZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQzVFO1FBRUQsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztDQUNKO0FBeEpELDhDQXdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNhbml0aXplQXJyYXksIHNhbml0aXplVHlwZSB9IGZyb20gXCJ+L2NvcmUvc2FuaXRpemUvXCI7XG5pbXBvcnQgeyBJbW11dGFibGUsIG9iamVjdEhhc1Byb3BlcnR5LCBxdW90ZUlmU3RyaW5nLCBVbmtub3duT2JqZWN0IH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IElCYXNlR2FtZU5hbWVzcGFjZSwgSUJhc2VHYW1lT2JqZWN0RnVuY3Rpb25TY2hlbWEgfSBmcm9tIFwiLi9iYXNlLWdhbWUtbmFtZXNwYWNlXCI7XG5pbXBvcnQgeyBCYXNlR2FtZU9iamVjdCB9IGZyb20gXCIuL2Jhc2UtZ2FtZS1vYmplY3RcIjtcblxuLyoqIElmIGZhaWxlZCB2YWxpZGF0aW9uIHRoaXMgc2hhcGUgaXMgZXhwZWN0ZWQuICovXG5leHBvcnQgaW50ZXJmYWNlIElJbnZhbGlkYXRlZCB7XG4gICAgLyoqIFRoZSBodW1hbiByZWFkYWJsZSBzdHJpbmcgd2h5IGl0IGlzIGludmFsaWQuICovXG4gICAgaW52YWxpZDogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiBzdGF0aWMgZnVuY3Rpb25zIHRvIHNhbml0aXplIGlucHV0cyBmcm9tIEFJIGNsaWVudHMgZm9yIHRoZVxuICogR2FtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VHYW1lU2FuaXRpemVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHNhbml0aXplciBmb3IgYSBnYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWVzcGFjZSAtIFRoZSBnYW1lIG5hbWVzcGFjZSB3ZSBhcmUgc2FuaXRpemluZyBmb3IuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IG5hbWVzcGFjZTogSW1tdXRhYmxlPElCYXNlR2FtZU5hbWVzcGFjZT4pIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYW5pdGl6ZXMgYXJndW1lbnRzIGZvciBhbiBBSSBvcmRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhaUZ1bmN0aW9uTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBvcmRlci5cbiAgICAgKiBAcGFyYW0gYXJncyAgLSBUaGUgYXJndW1lbnRzIGZvciB0aGF0IG9yZGVyIChpbiBvcmRlciBvZiBhcmd1bWVudHMpLlxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIGlmIHRoZXkgY291bGQgbm90IGJlIHNhbml0aXplZC4gT3RoZXJ3aXNlIGEgbmV3IGFycmF5XG4gICAgICogd2l0aCBmcmVzaGx5IHNhbml0aXplZCBhcmd1bWVudHMuXG4gICAgICovXG4gICAgcHVibGljIHNhbml0aXplT3JkZXJBcmdzKFxuICAgICAgICBhaUZ1bmN0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICBhcmdzOiBJbW11dGFibGU8dW5rbm93bltdPixcbiAgICApOiBFcnJvciB8IHVua25vd25bXSB7XG4gICAgICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMubmFtZXNwYWNlLmdhbWVPYmplY3RzU2NoZW1hLkFJLmZ1bmN0aW9uc1thaUZ1bmN0aW9uTmFtZV07XG4gICAgICAgIGlmICghc2NoZW1hKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKGBPcmRlciAke2FpRnVuY3Rpb25OYW1lfSBkb2VzIG5vdCBleGlzdCB0byBzYW5pdGl6ZSBhcmdzIGZvcmApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXJnc0FycmF5ID0gc2FuaXRpemVBcnJheShhcmdzLCBmYWxzZSk7XG5cbiAgICAgICAgcmV0dXJuIHNjaGVtYS5hcmdzLm1hcCgodCwgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2FuaXRpemVkID0gc2FuaXRpemVUeXBlKHQsIGFyZ3NBcnJheVtpXSk7XG4gICAgICAgICAgICBpZiAoc2FuaXRpemVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBzYW5pdGl6ZWQ7IC8vIHNlcnZlciBzaWRlIGVycm9yLCB3ZSBzaG91bGQgbmV2ZXIgaGF2ZSB0aGlzIGhhcHBlblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2FuaXRpemVkO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgYSByZXR1cm4gdmFsdWUgZnJvbSBhbiBBSSBmaW5pc2hpbmcgYW4gb3JkZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWlGdW5jdGlvbk5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgb3JkZXIvZnVuY3Rpb24gdGhlIEFJIGV4ZWN1dGVkLlxuICAgICAqIEBwYXJhbSByZXR1cm5lZCAtIFRoZSB2YWx1ZSB0aGV5IHJldHVybmVkLlxuICAgICAqIEByZXR1cm5zIFRoZSByZXR1cm5lZCB2YWx1ZSwgbm93IHNhbml0aXplZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgdmFsaWRhdGVGaW5pc2hlZFJldHVybmVkKFxuICAgICAgICBhaUZ1bmN0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICByZXR1cm5lZDogdW5rbm93bixcbiAgICApOiB1bmtub3duIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5uYW1lc3BhY2UuZ2FtZU9iamVjdHNTY2hlbWEuQUkuZnVuY3Rpb25zW2FpRnVuY3Rpb25OYW1lXTtcbiAgICAgICAgaWYgKCFzY2hlbWEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoYE9yZGVyICR7YWlGdW5jdGlvbk5hbWV9IGRvZXMgbm90IGV4aXN0IHRvIHNhbml0aXplIHJldHVybmVkIGZvcmApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNhbml0aXplVHlwZShzY2hlbWEucmV0dXJucywgcmV0dXJuZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyB0aGUgYXJndW1lbnRzIGZvciBhbiBBSSByZXF1ZXN0aW5nIGEgcnVuIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGdhbWVPYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgdGhhdCB3b3VsZCBydW4gdGhpcyBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0gZnVuY3Rpb25OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRyeWluZyB0byBydW4uXG4gICAgICogQHBhcmFtIGFyZ3MgLSBLZXkvdmFsdWUgYXJndW1lbnRzIGZvciB0aGUgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBpZiB2YWxpZGF0aW9uIGZhaWxlZCwgb3RoZXJ3aXNlIGEgbWFwIG9mIHNhbml0aXplZFxuICAgICAqIGtleS92YWx1ZSBhcmd1bWVudHMsIHdpdGggdGhlIGl0ZXJhdGlvbiBvcmRlciByZXNwZWN0aW5nIHRoZWlyIGFyZ3VtZW50XG4gICAgICogb3JkZXIgZm9yIHRoZSBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgdmFsaWRhdGVSdW5BcmdzKFxuICAgICAgICBnYW1lT2JqZWN0OiBCYXNlR2FtZU9iamVjdCxcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PFVua25vd25PYmplY3Q+LFxuICAgICk6IEVycm9yIHwgTWFwPHN0cmluZywgdW5rbm93bj4gfCBJSW52YWxpZGF0ZWQge1xuICAgICAgICBjb25zdCBzY2hlbWEgPSB0aGlzLnZhbGlkYXRlR2FtZU9iamVjdChnYW1lT2JqZWN0LCBmdW5jdGlvbk5hbWUpO1xuICAgICAgICBpZiAoc2NoZW1hIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlbWE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzYW5pdGl6ZWRBcmdzID0gbmV3IE1hcDxzdHJpbmcsIHVua25vd24+KCk7XG4gICAgICAgIGZvciAoY29uc3QgYXJnIG9mIHNjaGVtYS5hcmdzKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG9iamVjdEhhc1Byb3BlcnR5KGFyZ3MsIGFyZy5hcmdOYW1lKVxuICAgICAgICAgICAgICAgID8gYXJnc1thcmcuYXJnTmFtZV1cbiAgICAgICAgICAgICAgICA6IGFyZy5kZWZhdWx0VmFsdWU7XG5cbiAgICAgICAgICAgIGNvbnN0IHNhbml0aXplZCA9IHNhbml0aXplVHlwZShhcmcsIHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKHNhbml0aXplZCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaW52YWxpZDogYCR7Z2FtZU9iamVjdC5nYW1lT2JqZWN0TmFtZX0uJHtmdW5jdGlvbk5hbWV9KCkncyAnJHthcmcuYXJnTmFtZX0nIGFyZyB3YXMgc2VudCAke1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVvdGVJZlN0cmluZyh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgfSAtICR7c2FuaXRpemVkLm1lc3NhZ2V9YCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzYW5pdGl6ZWRBcmdzLnNldChhcmcuYXJnTmFtZSwgc2FuaXRpemVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzYW5pdGl6ZWRBcmdzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyB0aGUgcmV0dXJuIHZhbHVlIG9mIGEgcmFuIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGdhbWVPYmplY3QgLSBUaGUgZ2FtZSBvYmplY3QgaW5zdGFuY2UgdGhhdCByYW4gY29kZS5cbiAgICAgKiBAcGFyYW0gZnVuY3Rpb25OYW1lIC0gVGhlIGZ1bmN0aW9uIG5hbWUgaW4gdGhlIGdhbWUgb2JqZWN0IHRoYXQgcmFuLlxuICAgICAqIEBwYXJhbSByZXR1cm5lZCAtIFRoZSB2YWx1ZSB0aGF0IHdhcyByZXR1cm5lZCBmcm9tIHRoYXQgZnVuY3Rpb24uXG4gICAgICogQHJldHVybnMgQSBzYW5pdGl6ZWQgcmV0dXJuIHZhbHVlIG9mIHRoZSBleHBlY3RlZCBzY2hlbWEgdHlwZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgdmFsaWRhdGVSYW5SZXR1cm5lZChcbiAgICAgICAgZ2FtZU9iamVjdDogQmFzZUdhbWVPYmplY3QsXG4gICAgICAgIGZ1bmN0aW9uTmFtZTogc3RyaW5nLFxuICAgICAgICByZXR1cm5lZDogdW5rbm93bixcbiAgICApOiB1bmtub3duIHtcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy52YWxpZGF0ZUdhbWVPYmplY3QoZ2FtZU9iamVjdCwgZnVuY3Rpb25OYW1lKTtcbiAgICAgICAgaWYgKHNjaGVtYSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZW1hO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2FuaXRpemVkID0gc2FuaXRpemVUeXBlKHNjaGVtYS5yZXR1cm5zLCByZXR1cm5lZCk7XG4gICAgICAgIGlmIChzYW5pdGl6ZWQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgc2FuaXRpemVkOyAvLyBzZXJ2ZXIgc2lkZSBlcnJvciwgd2Ugc2hvdWxkIG5ldmVyIGhhdmUgdGhpcyBoYXBwZW5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzYW5pdGl6ZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIGEgZ2FtZSBvYmplY3QgaGFzIGEgc3BlY2lmaWMgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCBpbnN0YW5jZS5cbiAgICAgKiBAcGFyYW0gZnVuY3Rpb25OYW1lIFRoZSBmdW5jdGlvbiBuYW1lIGluc2lkZSB0aGUgZ2FtZSBvYmplY3QuXG4gICAgICogQHJldHVybnMgVGhlIHNjaGVtYSBpZiB2YWxpZCwgb3RoZXJ3aXNlIGFuIGVycm9yLlxuICAgICAqL1xuICAgIHByaXZhdGUgdmFsaWRhdGVHYW1lT2JqZWN0KFxuICAgICAgICBnYW1lT2JqZWN0OiBCYXNlR2FtZU9iamVjdCxcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgKTogRXJyb3IgfCBJbW11dGFibGU8SUJhc2VHYW1lT2JqZWN0RnVuY3Rpb25TY2hlbWE+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWdhbWVPYmplY3QgfHxcbiAgICAgICAgICAgICEoZ2FtZU9iamVjdCBpbnN0YW5jZW9mIEJhc2VHYW1lT2JqZWN0KSB8fFxuICAgICAgICAgICAgIXRoaXMubmFtZXNwYWNlLmdhbWVPYmplY3RzU2NoZW1hW2dhbWVPYmplY3QuZ2FtZU9iamVjdE5hbWVdXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgJHtnYW1lT2JqZWN0fSBpcyBub3QgYSB2YWxpZCBnYW1lIG9iamVjdGApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2FtZU9iamVjdFNjaGVtYSA9IHRoaXMubmFtZXNwYWNlLmdhbWVPYmplY3RzU2NoZW1hW2dhbWVPYmplY3QuZ2FtZU9iamVjdE5hbWVdO1xuICAgICAgICBjb25zdCBmdW5jdGlvblNjaGVtYSA9IGdhbWVPYmplY3RTY2hlbWEgJiYgZ2FtZU9iamVjdFNjaGVtYS5mdW5jdGlvbnNbZnVuY3Rpb25OYW1lXTtcbiAgICAgICAgaWYgKCFnYW1lT2JqZWN0U2NoZW1hIHx8ICFmdW5jdGlvblNjaGVtYSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgJHtnYW1lT2JqZWN0fSBkb2VzIG5vdCBoYXZlIGEgbWV0aG9kICR7ZnVuY3Rpb25OYW1lfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uU2NoZW1hO1xuICAgIH1cbn1cbiJdfQ==