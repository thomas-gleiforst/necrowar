"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ts_typed_events_1 = require("ts-typed-events");
const serializer_1 = require("~/core/serializer");
const utils_1 = require("~/utils");
/**
 * The maximum number of times an AI can error trying to execute a single order
 * before we assume they will always error and force disconnect them.
 */
const MAX_ORDER_ERRORS = 10;
/**
 * Manages the AI that actually plays games, basically a wrapper for public
 * functions so games can't see those and get themselves into deep shit
 */
class BaseAIManager {
    /**
     * Creates an AI Manager for some client('s AI).
     *
     * @param client - The client this is managing the AI for.
     * Must have a player.
     * @param gameSanitizer - The sanitizer instance for this AI's game.
     * @param namespace - The namespace of the game, to get schemas from.
     */
    constructor(client, gameSanitizer, namespace) {
        this.client = client;
        this.gameSanitizer = gameSanitizer;
        this.namespace = namespace;
        /** The events this AI (manager) emits */
        this.events = ts_typed_events_1.events({
            ordered: new ts_typed_events_1.Event(),
            finished: new ts_typed_events_1.Event(),
            ran: new ts_typed_events_1.Event(),
        });
        /** The orders that have been sent to clients */
        this.orders = new Map();
        /** The next number to use for an order's index */
        this.nextOrderIndex = 0;
        this.client.sent.finished.on((finished) => {
            this.finishedOrder(finished.orderIndex, finished.returned);
        });
        this.client.sent.run.on((run) => {
            this.requestedRun(run.caller, run.functionName, run.args);
        });
    }
    /**
     * Called by AI's to instruct their client to run an order.
     *
     * @param name - The name of the order (function name on client's AI).
     * @param unsanitizedArgs - The args to send to that function.
     * @returns A promise that will resolve when the AI finishes that order
     * resolving to their returned value.
     */
    executeOrder(name, ...unsanitizedArgs) {
        return new Promise((resolve, reject) => {
            const sanitizedArgs = this.gameSanitizer.sanitizeOrderArgs(name, unsanitizedArgs);
            if (sanitizedArgs instanceof Error) {
                // Then the structure of the order is so bad that we
                // can't figure out what to do
                this.client.disconnect(`We could not make you execute ${name}.`);
                reject(sanitizedArgs);
                return;
            }
            const args = sanitizedArgs.map(serializer_1.serialize);
            const index = this.nextOrderIndex++;
            const order = {
                index,
                name,
                args,
                errors: 0,
                // trying to execute this order.
                // When the client sends back that they resolved this order,
                // we will resolve via this stored resolve callback
                resolve,
                reject,
            };
            this.orders.set(index, order);
            this.sendOrder(order);
            // Now they have an order, start their timer while they execute it.
            this.client.startTicking();
        });
    }
    /**
     * Invoked when a client requests some game logic be run.
     *
     * @param callerReference - The game object reference of the instance
     * in the game.
     * @param functionName - The name of the function of the caller to invoke.
     * @param unsanitizedArgs - The key/value args for that function.
     * @returns A promise that will eventually resolve to the return value of
     * this run command, or undefined if the command is incomprehensible.
     *
     * NOTE: while game logic runs a delta will probably be sent out.
     */
    async requestedRun(callerReference, functionName, unsanitizedArgs) {
        this.client.pauseTicking();
        const returned = await this.tryToRun(callerReference, functionName, unsanitizedArgs);
        this.client.startTicking();
        return returned;
    }
    /**
     * Attempts to run some game logic
     *
     * @param callerReference - The game object reference of the instance
     * in the game.
     * @param functionName - The name of the function of the caller to invoke.
     * @param unsanitizedArgs - The key/value args for that function.
     * @returns A promise that will eventually resolve to the return value of
     * this run command, or undefined if the command is incomprehensible.
     */
    async tryToRun(callerReference, functionName, unsanitizedArgs) {
        if (!this.client.player) {
            this.client.disconnect("You do not have a Player to send run commands for");
            return undefined;
        }
        const callerID = callerReference && callerReference.id;
        const gameObject = this.game.gameObjects[callerID];
        if (!gameObject) {
            // they sent us an invalid caller
            this.client.disconnect(`Cannot determine the calling game object of ${callerReference} to run for.`);
            return undefined;
        }
        const sanitizedArgs = this.gameSanitizer.validateRunArgs(gameObject, functionName, serializer_1.unSerialize(unsanitizedArgs, this.game));
        if (sanitizedArgs instanceof Error) {
            // The structure of their run command is so malformed we can't even
            // run it, so something is wrong with their client, disconnect them
            this.client.disconnect(sanitizedArgs.message);
            return undefined;
        }
        const gameObjectSchema = this.namespace.gameObjectsSchema[gameObject.gameObjectName];
        if (!gameObjectSchema) {
            // the caller is malformed in some unexpected way
            this.client.disconnect(`Cannot find schema for game object '${gameObject.gameObjectName}'.`);
            return undefined;
        }
        // If we got here, we have sanitized the args and know the calling
        // game object has the appropriate function
        const schema = gameObjectSchema.functions[functionName];
        if (!schema) {
            throw new Error(`Invalid state: no schema found for ${gameObject}'s function ${functionName}.`);
        }
        let returned = schema.invalidValue;
        let invalid = sanitizedArgs instanceof Map
            // if it appears valid, try to invalidate
            ? this.invalidateRun(this.client.player, gameObject, functionName, sanitizedArgs)
            // else, failed to even sanitize
            : sanitizedArgs.invalid;
        // If the game said the run is invalid for all runs
        if (invalid) {
            // Tell the client it is invalid
            this.client.send({
                event: "invalid",
                data: { message: invalid },
            });
        }
        else {
            // else, the game is ok with trying to have
            // the calling game object try to invalidate the run
            let argsMap = sanitizedArgs;
            const invalidateName = `invalidate${lodash_1.upperFirst(functionName)}`;
            //  ↙ We are getting this function via reflection, no easier way to do this.
            // tslint:disable-next-line:no-any no-unsafe-any
            const validated = gameObject[invalidateName](this.client.player, ...argsMap.values());
            invalid = typeof validated === "string"
                ? validated
                : undefined;
            if (typeof validated === "object") {
                // they returns an object for new args, so re-validate them
                const argsMapAsObject = utils_1.mapToObject(argsMap);
                const newArgsMap = this.gameSanitizer.validateRunArgs(gameObject, functionName, { ...argsMapAsObject, ...validated });
                if (newArgsMap instanceof Error) {
                    // Somehow a game dev returned an invalid object,
                    // so this is a server error
                    throw new Error(`Invalidate function for ${gameObject.gameObjectName}.${functionName} returned invalid object:
${JSON.stringify(validated)}
from:
${JSON.stringify(utils_1.mapToObject(argsMap))}
`);
                }
                else if (newArgsMap instanceof Map) {
                    argsMap = newArgsMap;
                }
            }
            if (invalid) {
                // Their arguments did not validate,
                // so they get told it was invalid
                this.client.send({
                    event: "invalid",
                    data: { message: invalid },
                });
            }
            else {
                // It's valid!
                // tslint:disable-next-line:no-any no-unsafe-any
                const unsanitizedReturned = await gameObject[functionName](this.client.player, ...argsMap.values());
                returned = this.gameSanitizer.validateRanReturned(gameObject, functionName, unsanitizedReturned);
            }
        }
        returned = serializer_1.serialize(returned);
        // This is basically to notify upstream for the gamelog manager and
        // session to record/send these
        this.events.ran.emit({
            player: { id: this.client.player.id },
            invalid,
            run: {
                caller: callerReference,
                functionName,
                // store the raw args in the gamelog for better debugging
                args: unsanitizedArgs,
            },
            returned,
        });
        this.client.send({ event: "ran", data: returned });
        return returned;
    }
    /**
     * Sends an order to our client and notifies upstream that we did so.
     *
     * @param order The order to send
     */
    sendOrder(order) {
        const simpleOrder = {
            name: order.name,
            index: order.index,
            args: order.args,
        };
        if (!this.client.player) {
            throw new Error(`Cannot send an order to client ${this.client} as it is not playing!`);
        }
        // This is basically to notify upstream for the gamelog manager
        // and session to record/send these
        this.events.ordered.emit({
            player: { id: this.client.player.id },
            order: simpleOrder,
        });
        this.client.send({ event: "order", data: simpleOrder });
    }
    /**
     * Invoked by a client when they claim to have finished an order.
     *
     * This should resolve the promised generated in `executeOrder`.
     * @param orderIndex - The index (id) of the order they finished executing.
     * @param unsanitizedReturned - The value they returned from executing
     * that order.
     */
    finishedOrder(orderIndex, unsanitizedReturned) {
        const order = this.orders.get(orderIndex);
        if (!order || !this.client.player) {
            this.client.disconnect(`Cannot find order # ${orderIndex} you claim to have finished.`);
            return; // we have no order to resolve or reject
        }
        // Remove this order as it's finished
        this.orders.delete(orderIndex);
        // And check to make sure if they have no orders we stop ticking their timer
        if (this.orders.size === 0) {
            // No orders remaining, stop their timer as we are not waiting on
            // them for anything
            this.client.pauseTicking();
        }
        const validated = this.gameSanitizer.validateFinishedReturned(order.name, serializer_1.unSerialize(unsanitizedReturned, this.game));
        const invalid = validated instanceof Error
            ? validated.message
            : undefined;
        // This is basically to notify upstream for the gamelog manager and
        // session to record/send these
        this.events.finished.emit({
            player: { id: this.client.player.id },
            invalid,
            order,
            returned: unsanitizedReturned,
        });
        if (invalid) {
            this.client.send({
                event: "invalid",
                data: {
                    message: `Return value (${utils_1.quoteIfString(unsanitizedReturned)}) from finished order invalid! ${invalid}`,
                },
            });
            order.errors++;
            if (order.errors >= MAX_ORDER_ERRORS) {
                this.client.disconnect(`Exceeded max number of errors (${MAX_ORDER_ERRORS}) `
                    + `executing order '${order.name}' #${order.index}.`);
            }
            else {
                // re-send them the same order, as they fucked up last time.
                this.sendOrder(order);
                // do not resolve/reject the promise, let them try again
                return;
            }
        }
        if (invalid) {
            order.reject(validated); // will be an Error
        }
        else {
            order.resolve(validated);
        }
    }
}
exports.BaseAIManager = BaseAIManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1haS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvZ2FtZS9iYXNlL2Jhc2UtYWktbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUFvQztBQUNwQyxxREFBZ0Q7QUFFaEQsa0RBQTJEO0FBQzNELG1DQUErRTtBQThCL0U7OztHQUdHO0FBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFFNUI7OztHQUdHO0FBQ0gsTUFBYSxhQUFhO0lBeUJ0Qjs7Ozs7OztPQU9HO0lBQ0gsWUFDcUIsTUFBa0IsRUFDbEIsYUFBZ0MsRUFDaEMsU0FBd0M7UUFGeEMsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQUNsQixrQkFBYSxHQUFiLGFBQWEsQ0FBbUI7UUFDaEMsY0FBUyxHQUFULFNBQVMsQ0FBK0I7UUFuQzdELHlDQUF5QztRQUN6QixXQUFNLEdBQUcsd0JBQU0sQ0FBQztZQUM1QixPQUFPLEVBQUUsSUFBSSx1QkFBSyxFQUFrQztZQUNwRCxRQUFRLEVBQUUsSUFBSSx1QkFBSyxFQUFxQztZQUN4RCxHQUFHLEVBQUUsSUFBSSx1QkFBSyxFQUFnQztTQUNqRCxDQUFDLENBQUM7UUFhSCxnREFBZ0Q7UUFDL0IsV0FBTSxHQUFHLElBQUksR0FBRyxFQUE4QixDQUFDO1FBRWhFLGtEQUFrRDtRQUMxQyxtQkFBYyxHQUFHLENBQUMsQ0FBQztRQWV2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZ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QUV0Qix3REFBd0Q7Z0JBQ3hELE9BQU87YUFDVjtTQUNKO1FBRUQsSUFBSSxPQUFPLEVBQUU7WUFDVCxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CO1NBQy9DO2FBQ0k7WUFDRCxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztDQUNKO0FBalpELHNDQWlaQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElGaW5pc2hlZERlbHRhLCBJR2FtZU9iamVjdFJlZmVyZW5jZSwgSU9yZGVyRGVsdGEsIElSYW5EZWx0YSB9IGZyb20gXCJAY2FkcmUvdHMtdXRpbHMvY2FkcmVcIjtcbmltcG9ydCB7IHVwcGVyRmlyc3QgfSBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBFdmVudCwgZXZlbnRzIH0gZnJvbSBcInRzLXR5cGVkLWV2ZW50c1wiO1xuaW1wb3J0IHsgQmFzZUNsaWVudCB9IGZyb20gXCJ+L2NvcmUvY2xpZW50c1wiO1xuaW1wb3J0IHsgc2VyaWFsaXplLCB1blNlcmlhbGl6ZSB9IGZyb20gXCJ+L2NvcmUvc2VyaWFsaXplclwiO1xuaW1wb3J0IHsgSW1tdXRhYmxlLCBtYXBUb09iamVjdCwgcXVvdGVJZlN0cmluZywgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBCYXNlR2FtZSB9IGZyb20gXCIuL2Jhc2UtZ2FtZVwiO1xuaW1wb3J0IHsgSUJhc2VHYW1lTmFtZXNwYWNlIH0gZnJvbSBcIi4vYmFzZS1nYW1lLW5hbWVzcGFjZVwiO1xuaW1wb3J0IHsgQmFzZUdhbWVPYmplY3QgfSBmcm9tIFwiLi9iYXNlLWdhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBCYXNlR2FtZVNhbml0aXplciB9IGZyb20gXCIuL2Jhc2UtZ2FtZS1zYW5pdGl6ZXJcIjtcbmltcG9ydCB7IEJhc2VQbGF5ZXIgfSBmcm9tIFwiLi9iYXNlLXBsYXllclwiO1xuXG4vKiogUmVwcmVzZW50cyBhbiBvcmRlciBzZW50IHRvIGFuIEFJLiAqL1xuaW50ZXJmYWNlIElPcmRlciB7XG4gICAgLyoqIFRoZSBpbmRleCBvZiB0aGUgb3JkZXIsIHVzZWQgbGlrZSBhIHVuaXF1ZSBpZGVudGlmaWVyLiAqL1xuICAgIC8vIFRPRE86IFRoaXMgc2hvdWxkIHByb2JhYmx5IGJlIGFuIGlkIGluIHRoZSBmdXR1cmUsXG4gICAgLy8gYnV0IGNsaWVudHMgY3VycmVudGx5IG9ubHkga25vdyB0aGUgbnVtYmVyZWQgaW5kZXhcbiAgICBpbmRleDogbnVtYmVyO1xuXG4gICAgLyoqIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIGZvciB0aGUgb3JkZXIuICovXG4gICAgbmFtZTogc3RyaW5nO1xuXG4gICAgLyoqIHRoZSBhcmd1bWVudHMgKGluIGNhbGwgb3JkZXIpIGZvciB0aGUgZnVuY3Rpb24uICovXG4gICAgYXJnczogdW5rbm93bltdOyAvLyBzaG91bGQgYmUgdGhlIHNlcmlhbGl6ZWQgYXJnc1xuXG4gICAgLyoqIG51bWJlciBvZiBlcnJvcnMgZW5jb3VudGVyZWQgZm9yIHNhaWQgb3JkZXIuICovXG4gICAgZXJyb3JzOiBudW1iZXI7XG5cbiAgICAvKiogdGhlIHJlc29sdmVyIGNhbGxiYWNrIG9mIHRoZSBQcm9taXNlIGZvciB0aGlzIG9yZGVyLiAqL1xuICAgIHJlc29sdmUocmV0dXJuZWQ6IHVua25vd24pOiB2b2lkO1xuXG4gICAgLyoqIHRoZSByZWplY3RvciBjYWxsYmFjayBvZiB0aGUgUHJvbWlzZSBmb3IgdGhpcyBvcmRlci4gKi9cbiAgICByZWplY3QoZXJyOiB1bmtub3duKTogdm9pZDtcbn1cblxuLyoqXG4gKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdGltZXMgYW4gQUkgY2FuIGVycm9yIHRyeWluZyB0byBleGVjdXRlIGEgc2luZ2xlIG9yZGVyXG4gKiBiZWZvcmUgd2UgYXNzdW1lIHRoZXkgd2lsbCBhbHdheXMgZXJyb3IgYW5kIGZvcmNlIGRpc2Nvbm5lY3QgdGhlbS5cbiAqL1xuY29uc3QgTUFYX09SREVSX0VSUk9SUyA9IDEwO1xuXG4vKipcbiAqIE1hbmFnZXMgdGhlIEFJIHRoYXQgYWN0dWFsbHkgcGxheXMgZ2FtZXMsIGJhc2ljYWxseSBhIHdyYXBwZXIgZm9yIHB1YmxpY1xuICogZnVuY3Rpb25zIHNvIGdhbWVzIGNhbid0IHNlZSB0aG9zZSBhbmQgZ2V0IHRoZW1zZWx2ZXMgaW50byBkZWVwIHNoaXRcbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VBSU1hbmFnZXIge1xuICAgIC8qKiBUaGUgZXZlbnRzIHRoaXMgQUkgKG1hbmFnZXIpIGVtaXRzICovXG4gICAgcHVibGljIHJlYWRvbmx5IGV2ZW50cyA9IGV2ZW50cyh7XG4gICAgICAgIG9yZGVyZWQ6IG5ldyBFdmVudDxJbW11dGFibGU8SU9yZGVyRGVsdGFbXCJkYXRhXCJdPj4oKSxcbiAgICAgICAgZmluaXNoZWQ6IG5ldyBFdmVudDxJbW11dGFibGU8SUZpbmlzaGVkRGVsdGFbXCJkYXRhXCJdPj4oKSxcbiAgICAgICAgcmFuOiBuZXcgRXZlbnQ8SW1tdXRhYmxlPElSYW5EZWx0YVtcImRhdGFcIl0+PigpLFxuICAgIH0pO1xuXG4gICAgLyoqICoqVGhpcyBtdXN0IGJlIHNldCBleHRlcm5hbGx5IGJlZm9yZSB1c2UqKiAqL1xuICAgIHB1YmxpYyBnYW1lITogQmFzZUdhbWU7XG5cbiAgICAvKiogKipUaGlzIG9uZSB0b28qKiAqL1xuICAgIHB1YmxpYyBpbnZhbGlkYXRlUnVuITogKFxuICAgICAgICBwbGF5ZXI6IEJhc2VQbGF5ZXIsXG4gICAgICAgIGdhbWVPYmplY3Q6IEJhc2VHYW1lT2JqZWN0LFxuICAgICAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgICAgICAgYXJnczogTWFwPHN0cmluZywgdW5rbm93bj4sXG4gICAgKSA9PiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKiogVGhlIG9yZGVycyB0aGF0IGhhdmUgYmVlbiBzZW50IHRvIGNsaWVudHMgKi9cbiAgICBwcml2YXRlIHJlYWRvbmx5IG9yZGVycyA9IG5ldyBNYXA8bnVtYmVyLCBJT3JkZXIgfCB1bmRlZmluZWQ+KCk7XG5cbiAgICAvKiogVGhlIG5leHQgbnVtYmVyIHRvIHVzZSBmb3IgYW4gb3JkZXIncyBpbmRleCAqL1xuICAgIHByaXZhdGUgbmV4dE9yZGVySW5kZXggPSAwO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBBSSBNYW5hZ2VyIGZvciBzb21lIGNsaWVudCgncyBBSSkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGlzIGlzIG1hbmFnaW5nIHRoZSBBSSBmb3IuXG4gICAgICogTXVzdCBoYXZlIGEgcGxheWVyLlxuICAgICAqIEBwYXJhbSBnYW1lU2FuaXRpemVyIC0gVGhlIHNhbml0aXplciBpbnN0YW5jZSBmb3IgdGhpcyBBSSdzIGdhbWUuXG4gICAgICogQHBhcmFtIG5hbWVzcGFjZSAtIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIGdhbWUsIHRvIGdldCBzY2hlbWFzIGZyb20uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgY2xpZW50OiBCYXNlQ2xpZW50LFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGdhbWVTYW5pdGl6ZXI6IEJhc2VHYW1lU2FuaXRpemVyLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IG5hbWVzcGFjZTogSW1tdXRhYmxlPElCYXNlR2FtZU5hbWVzcGFjZT4sXG4gICAgKSB7XG4gICAgICAgIHRoaXMuY2xpZW50LnNlbnQuZmluaXNoZWQub24oKGZpbmlzaGVkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaGVkT3JkZXIoZmluaXNoZWQub3JkZXJJbmRleCwgZmluaXNoZWQucmV0dXJuZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmNsaWVudC5zZW50LnJ1bi5vbigocnVuKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RlZFJ1bihydW4uY2FsbGVyLCBydW4uZnVuY3Rpb25OYW1lLCBydW4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCBieSBBSSdzIHRvIGluc3RydWN0IHRoZWlyIGNsaWVudCB0byBydW4gYW4gb3JkZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBvcmRlciAoZnVuY3Rpb24gbmFtZSBvbiBjbGllbnQncyBBSSkuXG4gICAgICogQHBhcmFtIHVuc2FuaXRpemVkQXJncyAtIFRoZSBhcmdzIHRvIHNlbmQgdG8gdGhhdCBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgd2hlbiB0aGUgQUkgZmluaXNoZXMgdGhhdCBvcmRlclxuICAgICAqIHJlc29sdmluZyB0byB0aGVpciByZXR1cm5lZCB2YWx1ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZXhlY3V0ZU9yZGVyKFxuICAgICAgICBuYW1lOiBzdHJpbmcsXG4gICAgICAgIC4uLnVuc2FuaXRpemVkQXJnczogdW5rbm93bltdXG4gICAgKTogUHJvbWlzZTx1bmtub3duPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzYW5pdGl6ZWRBcmdzID0gdGhpcy5nYW1lU2FuaXRpemVyLnNhbml0aXplT3JkZXJBcmdzKFxuICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgdW5zYW5pdGl6ZWRBcmdzLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHNhbml0aXplZEFyZ3MgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIFRoZW4gdGhlIHN0cnVjdHVyZSBvZiB0aGUgb3JkZXIgaXMgc28gYmFkIHRoYXQgd2VcbiAgICAgICAgICAgICAgICAvLyBjYW4ndCBmaWd1cmUgb3V0IHdoYXQgdG8gZG9cbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudC5kaXNjb25uZWN0KGBXZSBjb3VsZCBub3QgbWFrZSB5b3UgZXhlY3V0ZSAke25hbWV9LmApO1xuICAgICAgICAgICAgICAgIHJlamVjdChzYW5pdGl6ZWRBcmdzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYXJncyA9IHNhbml0aXplZEFyZ3MubWFwKHNlcmlhbGl6ZSk7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubmV4dE9yZGVySW5kZXgrKztcblxuICAgICAgICAgICAgY29uc3Qgb3JkZXI6IElPcmRlciA9IHtcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICAgICAgZXJyb3JzOiAwLCAvLyBrZWVwIHRyYWNrIG9mIGhvdyBtYW55IGVycm9ycyB0aGUgY2xpZW50IG1ha2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cnlpbmcgdG8gZXhlY3V0ZSB0aGlzIG9yZGVyLlxuICAgICAgICAgICAgICAgIC8vIFdoZW4gdGhlIGNsaWVudCBzZW5kcyBiYWNrIHRoYXQgdGhleSByZXNvbHZlZCB0aGlzIG9yZGVyLFxuICAgICAgICAgICAgICAgIC8vIHdlIHdpbGwgcmVzb2x2ZSB2aWEgdGhpcyBzdG9yZWQgcmVzb2x2ZSBjYWxsYmFja1xuICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgcmVqZWN0LFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5vcmRlcnMuc2V0KGluZGV4LCBvcmRlcik7XG5cbiAgICAgICAgICAgIHRoaXMuc2VuZE9yZGVyKG9yZGVyKTtcblxuICAgICAgICAgICAgLy8gTm93IHRoZXkgaGF2ZSBhbiBvcmRlciwgc3RhcnQgdGhlaXIgdGltZXIgd2hpbGUgdGhleSBleGVjdXRlIGl0LlxuICAgICAgICAgICAgdGhpcy5jbGllbnQuc3RhcnRUaWNraW5nKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiBhIGNsaWVudCByZXF1ZXN0cyBzb21lIGdhbWUgbG9naWMgYmUgcnVuLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxlclJlZmVyZW5jZSAtIFRoZSBnYW1lIG9iamVjdCByZWZlcmVuY2Ugb2YgdGhlIGluc3RhbmNlXG4gICAgICogaW4gdGhlIGdhbWUuXG4gICAgICogQHBhcmFtIGZ1bmN0aW9uTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbiBvZiB0aGUgY2FsbGVyIHRvIGludm9rZS5cbiAgICAgKiBAcGFyYW0gdW5zYW5pdGl6ZWRBcmdzIC0gVGhlIGtleS92YWx1ZSBhcmdzIGZvciB0aGF0IGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHdpbGwgZXZlbnR1YWxseSByZXNvbHZlIHRvIHRoZSByZXR1cm4gdmFsdWUgb2ZcbiAgICAgKiB0aGlzIHJ1biBjb21tYW5kLCBvciB1bmRlZmluZWQgaWYgdGhlIGNvbW1hbmQgaXMgaW5jb21wcmVoZW5zaWJsZS5cbiAgICAgKlxuICAgICAqIE5PVEU6IHdoaWxlIGdhbWUgbG9naWMgcnVucyBhIGRlbHRhIHdpbGwgcHJvYmFibHkgYmUgc2VudCBvdXQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyByZXF1ZXN0ZWRSdW48VD4oXG4gICAgICAgIGNhbGxlclJlZmVyZW5jZTogSW1tdXRhYmxlPElHYW1lT2JqZWN0UmVmZXJlbmNlPixcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBzdHJpbmcsXG4gICAgICAgIHVuc2FuaXRpemVkQXJnczogSW1tdXRhYmxlPFVua25vd25PYmplY3Q+LFxuICAgICk6IFByb21pc2U8VCB8IHVuZGVmaW5lZD4ge1xuICAgICAgICB0aGlzLmNsaWVudC5wYXVzZVRpY2tpbmcoKTtcblxuICAgICAgICBjb25zdCByZXR1cm5lZCA9IGF3YWl0IHRoaXMudHJ5VG9SdW48VD4oXG4gICAgICAgICAgICBjYWxsZXJSZWZlcmVuY2UsXG4gICAgICAgICAgICBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICB1bnNhbml0aXplZEFyZ3MsXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuc3RhcnRUaWNraW5nKCk7XG5cbiAgICAgICAgcmV0dXJuIHJldHVybmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIHJ1biBzb21lIGdhbWUgbG9naWNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsZXJSZWZlcmVuY2UgLSBUaGUgZ2FtZSBvYmplY3QgcmVmZXJlbmNlIG9mIHRoZSBpbnN0YW5jZVxuICAgICAqIGluIHRoZSBnYW1lLlxuICAgICAqIEBwYXJhbSBmdW5jdGlvbk5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gb2YgdGhlIGNhbGxlciB0byBpbnZva2UuXG4gICAgICogQHBhcmFtIHVuc2FuaXRpemVkQXJncyAtIFRoZSBrZXkvdmFsdWUgYXJncyBmb3IgdGhhdCBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCB3aWxsIGV2ZW50dWFsbHkgcmVzb2x2ZSB0byB0aGUgcmV0dXJuIHZhbHVlIG9mXG4gICAgICogdGhpcyBydW4gY29tbWFuZCwgb3IgdW5kZWZpbmVkIGlmIHRoZSBjb21tYW5kIGlzIGluY29tcHJlaGVuc2libGUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyB0cnlUb1J1bjxUPihcbiAgICAgICAgY2FsbGVyUmVmZXJlbmNlOiBJbW11dGFibGU8SUdhbWVPYmplY3RSZWZlcmVuY2U+LFxuICAgICAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgICAgICAgdW5zYW5pdGl6ZWRBcmdzOiBJbW11dGFibGU8VW5rbm93bk9iamVjdD4sXG4gICAgKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIGlmICghdGhpcy5jbGllbnQucGxheWVyKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWVudC5kaXNjb25uZWN0KFxuICAgICAgICAgICAgICAgIFwiWW91IGRvIG5vdCBoYXZlIGEgUGxheWVyIHRvIHNlbmQgcnVuIGNvbW1hbmRzIGZvclwiLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNhbGxlcklEID0gY2FsbGVyUmVmZXJlbmNlICYmIGNhbGxlclJlZmVyZW5jZS5pZDtcbiAgICAgICAgY29uc3QgZ2FtZU9iamVjdCA9IHRoaXMuZ2FtZS5nYW1lT2JqZWN0c1tjYWxsZXJJRF07XG5cbiAgICAgICAgaWYgKCFnYW1lT2JqZWN0KSB7XG4gICAgICAgICAgICAvLyB0aGV5IHNlbnQgdXMgYW4gaW52YWxpZCBjYWxsZXJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmRpc2Nvbm5lY3QoYENhbm5vdCBkZXRlcm1pbmUgdGhlIGNhbGxpbmcgZ2FtZSBvYmplY3Qgb2YgJHtjYWxsZXJSZWZlcmVuY2V9IHRvIHJ1biBmb3IuYCk7XG5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzYW5pdGl6ZWRBcmdzID0gdGhpcy5nYW1lU2FuaXRpemVyLnZhbGlkYXRlUnVuQXJncyhcbiAgICAgICAgICAgIGdhbWVPYmplY3QsXG4gICAgICAgICAgICBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICB1blNlcmlhbGl6ZSh1bnNhbml0aXplZEFyZ3MsIHRoaXMuZ2FtZSksXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHNhbml0aXplZEFyZ3MgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgLy8gVGhlIHN0cnVjdHVyZSBvZiB0aGVpciBydW4gY29tbWFuZCBpcyBzbyBtYWxmb3JtZWQgd2UgY2FuJ3QgZXZlblxuICAgICAgICAgICAgLy8gcnVuIGl0LCBzbyBzb21ldGhpbmcgaXMgd3Jvbmcgd2l0aCB0aGVpciBjbGllbnQsIGRpc2Nvbm5lY3QgdGhlbVxuICAgICAgICAgICAgdGhpcy5jbGllbnQuZGlzY29ubmVjdChzYW5pdGl6ZWRBcmdzLm1lc3NhZ2UpO1xuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2FtZU9iamVjdFNjaGVtYSA9IHRoaXMubmFtZXNwYWNlLmdhbWVPYmplY3RzU2NoZW1hW2dhbWVPYmplY3QuZ2FtZU9iamVjdE5hbWVdO1xuICAgICAgICBpZiAoIWdhbWVPYmplY3RTY2hlbWEpIHtcbiAgICAgICAgICAgIC8vIHRoZSBjYWxsZXIgaXMgbWFsZm9ybWVkIGluIHNvbWUgdW5leHBlY3RlZCB3YXlcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmRpc2Nvbm5lY3QoYENhbm5vdCBmaW5kIHNjaGVtYSBmb3IgZ2FtZSBvYmplY3QgJyR7Z2FtZU9iamVjdC5nYW1lT2JqZWN0TmFtZX0nLmApO1xuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgd2UgZ290IGhlcmUsIHdlIGhhdmUgc2FuaXRpemVkIHRoZSBhcmdzIGFuZCBrbm93IHRoZSBjYWxsaW5nXG4gICAgICAgIC8vIGdhbWUgb2JqZWN0IGhhcyB0aGUgYXBwcm9wcmlhdGUgZnVuY3Rpb25cbiAgICAgICAgY29uc3Qgc2NoZW1hID0gZ2FtZU9iamVjdFNjaGVtYS5mdW5jdGlvbnNbZnVuY3Rpb25OYW1lXTtcbiAgICAgICAgaWYgKCFzY2hlbWEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBzdGF0ZTogbm8gc2NoZW1hIGZvdW5kIGZvciAke2dhbWVPYmplY3R9J3MgZnVuY3Rpb24gJHtmdW5jdGlvbk5hbWV9LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJldHVybmVkID0gc2NoZW1hLmludmFsaWRWYWx1ZTtcblxuICAgICAgICBsZXQgaW52YWxpZCA9IHNhbml0aXplZEFyZ3MgaW5zdGFuY2VvZiBNYXBcbiAgICAgICAgICAgIC8vIGlmIGl0IGFwcGVhcnMgdmFsaWQsIHRyeSB0byBpbnZhbGlkYXRlXG4gICAgICAgICAgICA/IHRoaXMuaW52YWxpZGF0ZVJ1bihcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudC5wbGF5ZXIsXG4gICAgICAgICAgICAgICAgZ2FtZU9iamVjdCxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgc2FuaXRpemVkQXJncyxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC8vIGVsc2UsIGZhaWxlZCB0byBldmVuIHNhbml0aXplXG4gICAgICAgICAgICA6IHNhbml0aXplZEFyZ3MuaW52YWxpZDtcblxuICAgICAgICAvLyBJZiB0aGUgZ2FtZSBzYWlkIHRoZSBydW4gaXMgaW52YWxpZCBmb3IgYWxsIHJ1bnNcbiAgICAgICAgaWYgKGludmFsaWQpIHtcbiAgICAgICAgICAgIC8vIFRlbGwgdGhlIGNsaWVudCBpdCBpcyBpbnZhbGlkXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5zZW5kKHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJpbnZhbGlkXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBtZXNzYWdlOiBpbnZhbGlkIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVsc2UsIHRoZSBnYW1lIGlzIG9rIHdpdGggdHJ5aW5nIHRvIGhhdmVcbiAgICAgICAgICAgIC8vIHRoZSBjYWxsaW5nIGdhbWUgb2JqZWN0IHRyeSB0byBpbnZhbGlkYXRlIHRoZSBydW5cbiAgICAgICAgICAgIGxldCBhcmdzTWFwID0gKHNhbml0aXplZEFyZ3MgYXMgTWFwPHN0cmluZywgdW5rbm93bj4pO1xuXG4gICAgICAgICAgICBjb25zdCBpbnZhbGlkYXRlTmFtZSA9IGBpbnZhbGlkYXRlJHt1cHBlckZpcnN0KGZ1bmN0aW9uTmFtZSl9YDtcbiAgICAgICAgICAgIC8vICDihpkgV2UgYXJlIGdldHRpbmcgdGhpcyBmdW5jdGlvbiB2aWEgcmVmbGVjdGlvbiwgbm8gZWFzaWVyIHdheSB0byBkbyB0aGlzLlxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSBuby11bnNhZmUtYW55XG4gICAgICAgICAgICBjb25zdCB2YWxpZGF0ZWQgPSAoZ2FtZU9iamVjdCBhcyBhbnkpW2ludmFsaWRhdGVOYW1lXShcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudC5wbGF5ZXIsXG4gICAgICAgICAgICAgICAgLi4uYXJnc01hcC52YWx1ZXMoKSxcbiAgICAgICAgICAgICkgYXMgdm9pZCB8IHN0cmluZyB8IFVua25vd25PYmplY3Q7XG5cbiAgICAgICAgICAgIGludmFsaWQgPSB0eXBlb2YgdmFsaWRhdGVkID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgPyB2YWxpZGF0ZWRcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZGF0ZWQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGV5IHJldHVybnMgYW4gb2JqZWN0IGZvciBuZXcgYXJncywgc28gcmUtdmFsaWRhdGUgdGhlbVxuICAgICAgICAgICAgICAgIGNvbnN0IGFyZ3NNYXBBc09iamVjdCA9IG1hcFRvT2JqZWN0KGFyZ3NNYXApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0FyZ3NNYXAgPSB0aGlzLmdhbWVTYW5pdGl6ZXIudmFsaWRhdGVSdW5BcmdzKFxuICAgICAgICAgICAgICAgICAgICBnYW1lT2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHsgLi4uYXJnc01hcEFzT2JqZWN0LCAuLi52YWxpZGF0ZWQgfSxcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5ld0FyZ3NNYXAgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBTb21laG93IGEgZ2FtZSBkZXYgcmV0dXJuZWQgYW4gaW52YWxpZCBvYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIHRoaXMgaXMgYSBzZXJ2ZXIgZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuYEludmFsaWRhdGUgZnVuY3Rpb24gZm9yICR7Z2FtZU9iamVjdC5nYW1lT2JqZWN0TmFtZX0uJHtmdW5jdGlvbk5hbWV9IHJldHVybmVkIGludmFsaWQgb2JqZWN0OlxuJHtKU09OLnN0cmluZ2lmeSh2YWxpZGF0ZWQpfVxuZnJvbTpcbiR7SlNPTi5zdHJpbmdpZnkobWFwVG9PYmplY3QoYXJnc01hcCkpfVxuYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5ld0FyZ3NNYXAgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc01hcCA9IG5ld0FyZ3NNYXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZWlyIGFyZ3VtZW50cyBkaWQgbm90IHZhbGlkYXRlLFxuICAgICAgICAgICAgICAgIC8vIHNvIHRoZXkgZ2V0IHRvbGQgaXQgd2FzIGludmFsaWRcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudC5zZW5kKHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiaW52YWxpZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7IG1lc3NhZ2U6IGludmFsaWQgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEl0J3MgdmFsaWQhXG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueSBuby11bnNhZmUtYW55XG4gICAgICAgICAgICAgICAgY29uc3QgdW5zYW5pdGl6ZWRSZXR1cm5lZCA9IGF3YWl0IChnYW1lT2JqZWN0IGFzIGFueSlbZnVuY3Rpb25OYW1lXShcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGllbnQucGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAuLi5hcmdzTWFwLnZhbHVlcygpLFxuICAgICAgICAgICAgICAgICkgYXMgdW5rbm93bjtcbiAgICAgICAgICAgICAgICByZXR1cm5lZCA9IHRoaXMuZ2FtZVNhbml0aXplci52YWxpZGF0ZVJhblJldHVybmVkKGdhbWVPYmplY3QsIGZ1bmN0aW9uTmFtZSwgdW5zYW5pdGl6ZWRSZXR1cm5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm5lZCA9IHNlcmlhbGl6ZShyZXR1cm5lZCk7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBiYXNpY2FsbHkgdG8gbm90aWZ5IHVwc3RyZWFtIGZvciB0aGUgZ2FtZWxvZyBtYW5hZ2VyIGFuZFxuICAgICAgICAvLyBzZXNzaW9uIHRvIHJlY29yZC9zZW5kIHRoZXNlXG4gICAgICAgIHRoaXMuZXZlbnRzLnJhbi5lbWl0KHtcbiAgICAgICAgICAgIHBsYXllcjogeyBpZDogdGhpcy5jbGllbnQucGxheWVyLmlkIH0sXG4gICAgICAgICAgICBpbnZhbGlkLFxuICAgICAgICAgICAgcnVuOiB7XG4gICAgICAgICAgICAgICAgY2FsbGVyOiBjYWxsZXJSZWZlcmVuY2UsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgIC8vIHN0b3JlIHRoZSByYXcgYXJncyBpbiB0aGUgZ2FtZWxvZyBmb3IgYmV0dGVyIGRlYnVnZ2luZ1xuICAgICAgICAgICAgICAgIGFyZ3M6IHVuc2FuaXRpemVkQXJncyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXR1cm5lZCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuc2VuZCh7IGV2ZW50OiBcInJhblwiLCBkYXRhOiByZXR1cm5lZCB9KTtcblxuICAgICAgICByZXR1cm4gcmV0dXJuZWQgYXMgVDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhbiBvcmRlciB0byBvdXIgY2xpZW50IGFuZCBub3RpZmllcyB1cHN0cmVhbSB0aGF0IHdlIGRpZCBzby5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcmRlciBUaGUgb3JkZXIgdG8gc2VuZFxuICAgICAqL1xuICAgIHByaXZhdGUgc2VuZE9yZGVyKG9yZGVyOiBJbW11dGFibGU8SU9yZGVyPik6IHZvaWQge1xuICAgICAgICBjb25zdCBzaW1wbGVPcmRlciA9IHtcbiAgICAgICAgICAgIG5hbWU6IG9yZGVyLm5hbWUsXG4gICAgICAgICAgICBpbmRleDogb3JkZXIuaW5kZXgsXG4gICAgICAgICAgICBhcmdzOiBvcmRlci5hcmdzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghdGhpcy5jbGllbnQucGxheWVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzZW5kIGFuIG9yZGVyIHRvIGNsaWVudCAke3RoaXMuY2xpZW50fSBhcyBpdCBpcyBub3QgcGxheWluZyFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgYmFzaWNhbGx5IHRvIG5vdGlmeSB1cHN0cmVhbSBmb3IgdGhlIGdhbWVsb2cgbWFuYWdlclxuICAgICAgICAvLyBhbmQgc2Vzc2lvbiB0byByZWNvcmQvc2VuZCB0aGVzZVxuICAgICAgICB0aGlzLmV2ZW50cy5vcmRlcmVkLmVtaXQoe1xuICAgICAgICAgICAgcGxheWVyOiB7IGlkOiB0aGlzLmNsaWVudC5wbGF5ZXIuaWQgfSxcbiAgICAgICAgICAgIG9yZGVyOiBzaW1wbGVPcmRlcixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuc2VuZCh7IGV2ZW50OiBcIm9yZGVyXCIsIGRhdGE6IHNpbXBsZU9yZGVyIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgYnkgYSBjbGllbnQgd2hlbiB0aGV5IGNsYWltIHRvIGhhdmUgZmluaXNoZWQgYW4gb3JkZXIuXG4gICAgICpcbiAgICAgKiBUaGlzIHNob3VsZCByZXNvbHZlIHRoZSBwcm9taXNlZCBnZW5lcmF0ZWQgaW4gYGV4ZWN1dGVPcmRlcmAuXG4gICAgICogQHBhcmFtIG9yZGVySW5kZXggLSBUaGUgaW5kZXggKGlkKSBvZiB0aGUgb3JkZXIgdGhleSBmaW5pc2hlZCBleGVjdXRpbmcuXG4gICAgICogQHBhcmFtIHVuc2FuaXRpemVkUmV0dXJuZWQgLSBUaGUgdmFsdWUgdGhleSByZXR1cm5lZCBmcm9tIGV4ZWN1dGluZ1xuICAgICAqIHRoYXQgb3JkZXIuXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaW5pc2hlZE9yZGVyKFxuICAgICAgICBvcmRlckluZGV4OiBudW1iZXIsXG4gICAgICAgIHVuc2FuaXRpemVkUmV0dXJuZWQ6IHVua25vd24sXG4gICAgKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG9yZGVyID0gdGhpcy5vcmRlcnMuZ2V0KG9yZGVySW5kZXgpO1xuICAgICAgICBpZiAoIW9yZGVyIHx8ICF0aGlzLmNsaWVudC5wbGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LmRpc2Nvbm5lY3QoXG4gICAgICAgICAgICAgICAgYENhbm5vdCBmaW5kIG9yZGVyICMgJHtvcmRlckluZGV4fSB5b3UgY2xhaW0gdG8gaGF2ZSBmaW5pc2hlZC5gLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuOyAvLyB3ZSBoYXZlIG5vIG9yZGVyIHRvIHJlc29sdmUgb3IgcmVqZWN0XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgdGhpcyBvcmRlciBhcyBpdCdzIGZpbmlzaGVkXG4gICAgICAgIHRoaXMub3JkZXJzLmRlbGV0ZShvcmRlckluZGV4KTtcblxuICAgICAgICAvLyBBbmQgY2hlY2sgdG8gbWFrZSBzdXJlIGlmIHRoZXkgaGF2ZSBubyBvcmRlcnMgd2Ugc3RvcCB0aWNraW5nIHRoZWlyIHRpbWVyXG4gICAgICAgIGlmICh0aGlzLm9yZGVycy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICAvLyBObyBvcmRlcnMgcmVtYWluaW5nLCBzdG9wIHRoZWlyIHRpbWVyIGFzIHdlIGFyZSBub3Qgd2FpdGluZyBvblxuICAgICAgICAgICAgLy8gdGhlbSBmb3IgYW55dGhpbmdcbiAgICAgICAgICAgIHRoaXMuY2xpZW50LnBhdXNlVGlja2luZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRhdGVkID0gdGhpcy5nYW1lU2FuaXRpemVyLnZhbGlkYXRlRmluaXNoZWRSZXR1cm5lZChcbiAgICAgICAgICAgIG9yZGVyLm5hbWUsXG4gICAgICAgICAgICB1blNlcmlhbGl6ZSh1bnNhbml0aXplZFJldHVybmVkLCB0aGlzLmdhbWUpLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGludmFsaWQgPSB2YWxpZGF0ZWQgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICAgICAgPyB2YWxpZGF0ZWQubWVzc2FnZVxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBiYXNpY2FsbHkgdG8gbm90aWZ5IHVwc3RyZWFtIGZvciB0aGUgZ2FtZWxvZyBtYW5hZ2VyIGFuZFxuICAgICAgICAvLyBzZXNzaW9uIHRvIHJlY29yZC9zZW5kIHRoZXNlXG4gICAgICAgIHRoaXMuZXZlbnRzLmZpbmlzaGVkLmVtaXQoe1xuICAgICAgICAgICAgcGxheWVyOiB7IGlkOiB0aGlzLmNsaWVudC5wbGF5ZXIuaWQgfSxcbiAgICAgICAgICAgIGludmFsaWQsXG4gICAgICAgICAgICBvcmRlcixcbiAgICAgICAgICAgIHJldHVybmVkOiB1bnNhbml0aXplZFJldHVybmVkLFxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgdGhpcy5jbGllbnQuc2VuZCh7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IFwiaW52YWxpZFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogYFJldHVybiB2YWx1ZSAoJHtxdW90ZUlmU3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgdW5zYW5pdGl6ZWRSZXR1cm5lZCxcbiAgICAgICAgICAgICAgICAgICAgKX0pIGZyb20gZmluaXNoZWQgb3JkZXIgaW52YWxpZCEgJHtpbnZhbGlkfWAsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBvcmRlci5lcnJvcnMrKztcblxuICAgICAgICAgICAgaWYgKG9yZGVyLmVycm9ycyA+PSBNQVhfT1JERVJfRVJST1JTKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnQuZGlzY29ubmVjdChcbiAgICAgICAgICAgICAgICAgICAgYEV4Y2VlZGVkIG1heCBudW1iZXIgb2YgZXJyb3JzICgke01BWF9PUkRFUl9FUlJPUlN9KSBgXG4gICAgICAgICAgICAgICAgICArIGBleGVjdXRpbmcgb3JkZXIgJyR7b3JkZXIubmFtZX0nICMke29yZGVyLmluZGV4fS5gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByZS1zZW5kIHRoZW0gdGhlIHNhbWUgb3JkZXIsIGFzIHRoZXkgZnVja2VkIHVwIGxhc3QgdGltZS5cbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRPcmRlcihvcmRlcik7XG5cbiAgICAgICAgICAgICAgICAvLyBkbyBub3QgcmVzb2x2ZS9yZWplY3QgdGhlIHByb21pc2UsIGxldCB0aGVtIHRyeSBhZ2FpblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICBvcmRlci5yZWplY3QodmFsaWRhdGVkKTsgLy8gd2lsbCBiZSBhbiBFcnJvclxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3JkZXIucmVzb2x2ZSh2YWxpZGF0ZWQpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19