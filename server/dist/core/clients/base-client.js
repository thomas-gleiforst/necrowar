"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_typed_events_1 = require("ts-typed-events");
const config_1 = require("~/core/config");
const logger_1 = require("~/core/logger");
const utils_1 = require("~/utils");
const DEFAULT_STR = "Unknown";
/**
 * The basic implementation of a connection to the server via some I/O.
 * Should be inherited and implemented with that IO.
 * This is just a base class. It would be abstract but then Lobby couldn't
 * make it generically.
 */
class BaseClient {
    /**
     * Creates a client connected to a server
     *
     * @param socket - The socket this client communicates through.
     * @param server - The server this client is connected to.
     */
    constructor(socket) {
        /** All events this client can do. */
        this.events = ts_typed_events_1.events({
            disconnected: new ts_typed_events_1.Signal(),
            timedOut: new ts_typed_events_1.Signal(),
        });
        /** The events clients emit (send). */
        this.sent = ts_typed_events_1.events({
            finished: new ts_typed_events_1.Event(),
            run: new ts_typed_events_1.Event(),
            play: new ts_typed_events_1.Event(),
            alias: new ts_typed_events_1.Event(),
        });
        /** If this client wants to be sent meta deltas instead of normal deltas. */
        this.sendMetaDeltas = false;
        /** If this client is a spectator. */
        this.isSpectating = false;
        /** The timer we use to see if this client timed out. */
        this.timer = {};
        /** If we are listening to our socket. */
        this.listening = false;
        /** The listener callbacks for socket events. */
        this.listeners = {};
        /** True once we have disconnected from the socket */
        this.hasDisconnectedFromSocket = false;
        /** Set to try if this client times out. */
        this.timedOut = false;
        /** The name of the player, use player to get. */
        this.ourName = DEFAULT_STR;
        /** The type of client this is, e.g. C++, C#, Python, etc... */
        this.ourProgrammingLanguageType = DEFAULT_STR;
        this.socket = socket;
        // We need to wrap all the listener functions in closures to not lose
        // reference to 'this', which is this instance of a Client.
        this.listeners[this.onDataEventName] = (data) => {
            this.onSocketData(data);
        };
        this.listeners[this.onCloseEventName] = (data) => {
            this.onSocketClose();
        };
        this.listeners[this.onErrorEventName] = (data) => {
            this.onSocketError();
        };
        this.listenToSocket();
    }
    /** The name of this client. */
    get name() {
        return this.ourName;
    }
    /** The Player in the game this client controls. Undefined if spectating. */
    get player() {
        return this.ourPlayer;
    }
    /** A "fun" field for the name of the programming language this client. */
    get programmingLanguage() {
        return this.ourProgrammingLanguageType;
    }
    /** The index of this client's player in the game.players array. */
    get playerIndex() {
        return this.ourPlayerIndex;
    }
    /**
     * Returns if the player has disconnected.
     *
     * @returns True if this client has disconnected from the server,
     * false otherwise.
     */
    hasDisconnected() {
        return this.hasDisconnectedFromSocket;
    }
    /**
     * Removes and returns the raw net.Socket used by this client,
     * probably for thread passing. Use with care.
     *
     * @returns The socket.
     */
    popNetSocket() {
        if (!this.socket) {
            return;
        }
        const socket = this.socket;
        this.socket = undefined;
        return socket;
    }
    /**
     * Checks if this client's timer is ticking (we are awaiting them to finish
     * an order).
     *
     * @returns True if ticking, false otherwise.
     */
    isTicking() {
        return (this.timer.timeout !== undefined);
    }
    /**
     * Starts the timeout timer counting down from how much time this client's
     * player has left.
     * This should be called when the client is being timed for orders.
     *
     * @returns True if ticking, false if timeouts are not enabled.
     */
    startTicking() {
        if (!this.player) {
            return false;
        }
        if (!config_1.Config.TIMEOUT_TIME) {
            // The server is never going to timeout clients
            return false;
        }
        if (this.isTicking()) {
            return true;
        }
        this.timer.startTime = process.hrtime();
        this.timer.timeout = setTimeout(() => {
            this.triggerTimedOut();
        }, Math.ceil(this.player.timeRemaining / 1e6)); // ns to ms
        return true;
    }
    /**
     * If this client has timed out.
     *
     * @returns True if they have timed out, false otherwise.
     */
    hasTimedOut() {
        return this.timedOut;
    }
    /**
     * Pauses the timeout timer. This should be done any time we don't expect
     * the client to be computing something, like when they are not working on
     * an order, or we are running game logic.
     */
    pauseTicking() {
        if (this.player && this.isTicking()) {
            const timeDiff = process.hrtime(this.timer.startTime);
            if (this.timer.timeout) {
                clearTimeout(this.timer.timeout);
            }
            this.timer.timeout = undefined;
            this.timer.startTime = undefined;
            // high resolution time to only ns
            const timeTaken = (timeDiff[0] * 1e9 + timeDiff[1]);
            this.player.timeRemaining -= timeTaken;
        }
    }
    /**
     * Detaches the server from its socket (removes EventListeners).
     * This must be used when passing between threads.
     *
     * @returns A boolean representing if the detachment(s) were successful.
     */
    stopListeningToSocket() {
        if (this.listening && this.socket) {
            for (const key of Object.keys(this.listeners)) {
                this.socket.removeListener(key, this.listeners[key]);
            }
            this.listening = false;
            return true;
        }
        return false;
    }
    /**
     * Disconnects from the socket.
     *
     * @param fatalMessage - If you want to send the client a 'fatal' event
     * with a message, do so here. This is common when the client sends or
     * does something erroneous.
     * @returns A promise that resolves when we have sent the disconnect
     * message, or immediately if none.
     */
    async disconnect(fatalMessage) {
        if (fatalMessage) {
            await this.send({
                event: "fatal",
                data: {
                    message: fatalMessage,
                    timedOut: this.timedOut,
                },
            });
        }
        this.disconnected();
    }
    /**
     * Sets the optional information about.
     *
     * @param info - The name, language, and index of the client
     */
    setInfo(info) {
        this.ourName = info.name || DEFAULT_STR;
        this.ourProgrammingLanguageType = info.type || DEFAULT_STR;
        this.ourPlayerIndex = info.index;
        this.sendMetaDeltas = Boolean(info.metaDeltas);
        if (this.ourName.length > 80) {
            // We don't want players to be able to use stupidly long names.
            // so here's a limit of 80 characters.
            this.ourName = `${this.ourProgrammingLanguageType} Player`;
            // If people start cheesing this too and sending a "fake"
            // programming language, then we might want to hard code a list of
            // known languages and make sure it is valid here too.
        }
    }
    /**
     * Sets the data related to the game this client is connected to play.
     *
     * @param player - The player this ai controls.
     */
    setPlayer(player) {
        this.ourPlayer = player;
    }
    /**
     * Sends the message of type event to this client as a json string EOT_CHAR
     * terminated.
     *
     * @param event - The event to send. Must be an expected server event.
     * @returns After the data is sent.
     */
    async send(event) {
        // event.epoch = Number(new Date()); -- Disabled for now
        return this.sendRaw(JSON.stringify(event));
    }
    /**
     * Sends a the raw string to the remote client this class represents.
     * Intended to be overridden to actually send through client...
     *
     * @param str - The raw string to send. Should be EOT_CHAR terminated.
     */
    async sendRaw(str) {
        if (config_1.Config.PRINT_TCP) {
            logger_1.logger.debug(`> to client ${this.name} --> ${str}\n---`);
        }
        return;
    }
    /** The string key of the EventEmitter name to register for data events. */
    get onDataEventName() {
        return "data";
    }
    /** The string key of the EventEmitter name to register for close events. */
    get onCloseEventName() {
        return "close";
    }
    /** The string key of the EventEmitter name to register for error events. */
    get onErrorEventName() {
        return "error";
    }
    /**
     * Called when the client sends some data. the specific super class should
     * inherit and do stuff to this.
     *
     * @param data - What the client send via the socket event listener.
     */
    onSocketData(data) {
        if (config_1.Config.PRINT_TCP) {
            logger_1.logger.debug(`< From client ${this.name}  <-- ${data}\n---`);
        }
        // super classes should override and do stuff with data...
    }
    /**
     * Handler for when we know this client sent us some data.
     *
     * @param jsonData - The data, as an already parsed json object.
     */
    handleSent(jsonData) {
        if (!utils_1.isObject(jsonData)
            || !utils_1.objectHasProperty(jsonData, "event")
            || typeof jsonData.event !== "string") {
            this.disconnect("Sent malformed json event");
            return;
        }
        const event = this.sent[jsonData.event];
        if (!event) {
            this.disconnect(`Sent unknown event '${jsonData.event}'.`);
            return;
        }
        // if we got here the sent event looks valid, emit it!
        event.emit(jsonData.data);
    }
    /**
     * Called when the client closes (disconnects).
     */
    onSocketClose() {
        this.disconnected();
    }
    /**
     * Called when the client disconnects unexpectedly.
     */
    onSocketError() {
        this.disconnected();
    }
    /**
     * Tries to parse json data from the client, and disconnects them fatally
     * if it is malformed.
     *
     * @param json - The json formatted string to parse.
     * @returns The parsed json structure, or undefined if malformed json.
     */
    parseData(json) {
        let invalid = "";
        if (typeof json !== "string") {
            invalid = `Sent ${json}, which cannot be parsed.`;
        }
        else {
            try {
                return JSON.parse(json);
            }
            catch (err) {
                invalid = `Sent malformed JSON: '${String(err)}'`;
            }
        }
        if (invalid) {
            this.disconnect(invalid);
        }
    }
    /**
     * Called when disconnected from the remote client this Client represents.
     */
    disconnected() {
        this.hasDisconnectedFromSocket = true;
        this.pauseTicking();
        this.stopListeningToSocket();
        this.events.disconnected.emit();
    }
    /**
     * Sets up the listener functions to listen to the socket this client
     * should have data streaming from.
     */
    listenToSocket() {
        if (!this.socket) {
            return;
        }
        for (const key of Object.keys(this.listeners)) {
            this.socket.on(key, this.listeners[key]);
        }
        this.listening = true;
    }
    /**
     * Called when this Client runs out of time om it's timer.
     * Probably because it infinite looped, broke, or is just very slow.
     */
    triggerTimedOut() {
        this.timedOut = true;
        this.pauseTicking();
        this.events.timedOut.emit();
        this.disconnect("Your client has run out of time, and has been timed out.");
    }
}
exports.BaseClient = BaseClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jbGllbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9jbGllbnRzL2Jhc2UtY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EscURBQXdEO0FBQ3hELDBDQUF1QztBQUV2QywwQ0FBdUM7QUFDdkMsbUNBQXVFO0FBRXZFLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUU5Qjs7Ozs7R0FLRztBQUNILE1BQWEsVUFBVTtJQWlGbkI7Ozs7O09BS0c7SUFDSCxZQUFZLE1BQWtCO1FBdEY5QixxQ0FBcUM7UUFDckIsV0FBTSxHQUFHLHdCQUFNLENBQUM7WUFDNUIsWUFBWSxFQUFFLElBQUksd0JBQU0sRUFBRTtZQUMxQixRQUFRLEVBQUUsSUFBSSx3QkFBTSxFQUFFO1NBQ3pCLENBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QixTQUFJLEdBQUcsd0JBQU0sQ0FBQztZQUMxQixRQUFRLEVBQUUsSUFBSSx1QkFBSyxFQUFpRDtZQUNwRSxHQUFHLEVBQUUsSUFBSSx1QkFBSyxFQUE0QztZQUMxRCxJQUFJLEVBQUUsSUFBSSx1QkFBSyxFQUE2QztZQUM1RCxLQUFLLEVBQUUsSUFBSSx1QkFBSyxFQUE4QztTQUNqRSxDQUFDLENBQUM7UUF5QkgsNEVBQTRFO1FBQ3JFLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBRXZDLHFDQUFxQztRQUM5QixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUtyQyx3REFBd0Q7UUFDdkMsVUFBSyxHQUtsQixFQUFFLENBQUM7UUFFUCx5Q0FBeUM7UUFDakMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUVuQyxnREFBZ0Q7UUFDL0IsY0FBUyxHQUV0QixFQUFFLENBQUM7UUFFUCxxREFBcUQ7UUFDN0MsOEJBQXlCLEdBQVksS0FBSyxDQUFDO1FBRW5ELDJDQUEyQztRQUNuQyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBS2xDLGlEQUFpRDtRQUN6QyxZQUFPLEdBQVcsV0FBVyxDQUFD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SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGVBQWU7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsMERBQTBELENBQUMsQ0FBQztJQUNoRixDQUFDO0NBQ0o7QUE5YkQsZ0NBOGJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2VydmVyRXZlbnQgfSBmcm9tIFwiQGNhZHJlL3RzLXV0aWxzL2NhZHJlXCI7XG5pbXBvcnQgKiBhcyBDbGllbnRFdmVudHMgZnJvbSBcIkBjYWRyZS90cy11dGlscy9jYWRyZS9ldmVudHMvY2xpZW50XCI7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSBcIm5ldFwiO1xuaW1wb3J0IHsgRXZlbnQsIGV2ZW50cywgU2lnbmFsIH0gZnJvbSBcInRzLXR5cGVkLWV2ZW50c1wiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIn4vY29yZS9jb25maWdcIjtcbmltcG9ydCB7IEJhc2VBSU1hbmFnZXIsIEJhc2VQbGF5ZXIgfSBmcm9tIFwifi9jb3JlL2dhbWUvXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwifi9jb3JlL2xvZ2dlclwiO1xuaW1wb3J0IHsgSW1tdXRhYmxlLCBpc09iamVjdCwgSnNvbiwgb2JqZWN0SGFzUHJvcGVydHkgfSBmcm9tIFwifi91dGlsc1wiO1xuXG5jb25zdCBERUZBVUxUX1NUUiA9IFwiVW5rbm93blwiO1xuXG4vKipcbiAqIFRoZSBiYXNpYyBpbXBsZW1lbnRhdGlvbiBvZiBhIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciB2aWEgc29tZSBJL08uXG4gKiBTaG91bGQgYmUgaW5oZXJpdGVkIGFuZCBpbXBsZW1lbnRlZCB3aXRoIHRoYXQgSU8uXG4gKiBUaGlzIGlzIGp1c3QgYSBiYXNlIGNsYXNzLiBJdCB3b3VsZCBiZSBhYnN0cmFjdCBidXQgdGhlbiBMb2JieSBjb3VsZG4ndFxuICogbWFrZSBpdCBnZW5lcmljYWxseS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VDbGllbnQge1xuICAgIC8qKiBBbGwgZXZlbnRzIHRoaXMgY2xpZW50IGNhbiBkby4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRzID0gZXZlbnRzKHtcbiAgICAgICAgZGlzY29ubmVjdGVkOiBuZXcgU2lnbmFsKCksXG4gICAgICAgIHRpbWVkT3V0OiBuZXcgU2lnbmFsKCksXG4gICAgfSk7XG5cbiAgICAvKiogVGhlIGV2ZW50cyBjbGllbnRzIGVtaXQgKHNlbmQpLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzZW50ID0gZXZlbnRzKHtcbiAgICAgICAgZmluaXNoZWQ6IG5ldyBFdmVudDxJbW11dGFibGU8Q2xpZW50RXZlbnRzLkZpbmlzaGVkRXZlbnRbXCJkYXRhXCJdPj4oKSxcbiAgICAgICAgcnVuOiBuZXcgRXZlbnQ8SW1tdXRhYmxlPENsaWVudEV2ZW50cy5SdW5FdmVudFtcImRhdGFcIl0+PigpLFxuICAgICAgICBwbGF5OiBuZXcgRXZlbnQ8SW1tdXRhYmxlPENsaWVudEV2ZW50cy5QbGF5RXZlbnRbXCJkYXRhXCJdPj4oKSxcbiAgICAgICAgYWxpYXM6IG5ldyBFdmVudDxJbW11dGFibGU8Q2xpZW50RXZlbnRzLkFsaWFzRXZlbnRbXCJkYXRhXCJdPj4oKSxcbiAgICB9KTtcblxuICAgIC8qKiBUaGUgbmFtZSBvZiB0aGlzIGNsaWVudC4gKi9cbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3VyTmFtZTtcbiAgICB9XG5cbiAgICAvKiogVGhlIFBsYXllciBpbiB0aGUgZ2FtZSB0aGlzIGNsaWVudCBjb250cm9scy4gVW5kZWZpbmVkIGlmIHNwZWN0YXRpbmcuICovXG4gICAgcHVibGljIGdldCBwbGF5ZXIoKTogQmFzZVBsYXllciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLm91clBsYXllcjtcbiAgICB9XG5cbiAgICAvKiogQSBcImZ1blwiIGZpZWxkIGZvciB0aGUgbmFtZSBvZiB0aGUgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UgdGhpcyBjbGllbnQuICovXG4gICAgcHVibGljIGdldCBwcm9ncmFtbWluZ0xhbmd1YWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLm91clByb2dyYW1taW5nTGFuZ3VhZ2VUeXBlO1xuICAgIH1cblxuICAgIC8qKiBUaGUgaW5kZXggb2YgdGhpcyBjbGllbnQncyBwbGF5ZXIgaW4gdGhlIGdhbWUucGxheWVycyBhcnJheS4gKi9cbiAgICBwdWJsaWMgZ2V0IHBsYXllckluZGV4KCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLm91clBsYXllckluZGV4O1xuICAgIH1cblxuICAgIC8qKiBUaGUgbWFuYWdlciBvZiB0aGUgQUkgdGhpcyBjbGllbnQgY29udHJvbHMuICovXG4gICAgcHVibGljIGFpTWFuYWdlcj86IEJhc2VBSU1hbmFnZXI7XG5cbiAgICAvKiogSWYgdGhpcyBjbGllbnQgd2FudHMgdG8gYmUgc2VudCBtZXRhIGRlbHRhcyBpbnN0ZWFkIG9mIG5vcm1hbCBkZWx0YXMuICovXG4gICAgcHVibGljIHNlbmRNZXRhRGVsdGFzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogSWYgdGhpcyBjbGllbnQgaXMgYSBzcGVjdGF0b3IuICovXG4gICAgcHVibGljIGlzU3BlY3RhdGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIFRoZSBzb2NrZXQgdGhpcyBjb21tdW5pY2F0ZXMgdGhyb3VnaC4gKi9cbiAgICBwcm90ZWN0ZWQgc29ja2V0PzogbmV0LlNvY2tldDtcblxuICAgIC8qKiBUaGUgdGltZXIgd2UgdXNlIHRvIHNlZSBpZiB0aGlzIGNsaWVudCB0aW1lZCBvdXQuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSB0aW1lcjoge1xuICAgICAgICAvKiogVGhlIHRpbWVvdXQgbGFzdCB1c2VkLiAqL1xuICAgICAgICB0aW1lb3V0PzogTm9kZUpTLlRpbWVyO1xuICAgICAgICAvKiogVGhlIHN0YXJ0IHRpbWUgd2Ugc3RhcnRlZCB0aWNraW5nLiAqL1xuICAgICAgICBzdGFydFRpbWU/OiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIH0gPSB7fTtcblxuICAgIC8qKiBJZiB3ZSBhcmUgbGlzdGVuaW5nIHRvIG91ciBzb2NrZXQuICovXG4gICAgcHJpdmF0ZSBsaXN0ZW5pbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBUaGUgbGlzdGVuZXIgY2FsbGJhY2tzIGZvciBzb2NrZXQgZXZlbnRzLiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgbGlzdGVuZXJzOiB7XG4gICAgICAgIFtrZXk6IHN0cmluZ106IChkYXRhOiB1bmtub3duKSA9PiB2b2lkIHwgdW5kZWZpbmVkO1xuICAgIH0gPSB7fTtcblxuICAgIC8qKiBUcnVlIG9uY2Ugd2UgaGF2ZSBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgc29ja2V0ICovXG4gICAgcHJpdmF0ZSBoYXNEaXNjb25uZWN0ZWRGcm9tU29ja2V0OiBib29sZWFuID0gZmFsc2U7XG5cbiAgICAvKiogU2V0IHRvIHRyeSBpZiB0aGlzIGNsaWVudCB0aW1lcyBvdXQuICovXG4gICAgcHJpdmF0ZSB0aW1lZE91dDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIE91ciBwbGF5ZXIgaW4gdGhlIGdhbWUuICovXG4gICAgcHJpdmF0ZSBvdXJQbGF5ZXI/OiBCYXNlUGxheWVyO1xuXG4gICAgLyoqIFRoZSBuYW1lIG9mIHRoZSBwbGF5ZXIsIHVzZSBwbGF5ZXIgdG8gZ2V0LiAqL1xuICAgIHByaXZhdGUgb3VyTmFtZTogc3RyaW5nID0gREVGQVVMVF9TVFI7XG5cbiAgICAvKiogVGhlIHR5cGUgb2YgY2xpZW50IHRoaXMgaXMsIGUuZy4gQysrLCBDIywgUHl0aG9uLCBldGMuLi4gKi9cbiAgICBwcml2YXRlIG91clByb2dyYW1taW5nTGFuZ3VhZ2VUeXBlOiBzdHJpbmcgPSBERUZBVUxUX1NUUjtcblxuICAgIC8qKiBUaGUgcHJpdmF0ZSBpbmRleCBvZiB0aGlzIGNsaWVudCdzIHBsYXllciBpbiB0aGUgZ2FtZS5wbGF5ZXJzIGFycmF5LiAqL1xuICAgIHByaXZhdGUgb3VyUGxheWVySW5kZXg/OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xpZW50IGNvbm5lY3RlZCB0byBhIHNlcnZlclxuICAgICAqXG4gICAgICogQHBhcmFtIHNvY2tldCAtIFRoZSBzb2NrZXQgdGhpcyBjbGllbnQgY29tbXVuaWNhdGVzIHRocm91Z2guXG4gICAgICogQHBhcmFtIHNlcnZlciAtIFRoZSBzZXJ2ZXIgdGhpcyBjbGllbnQgaXMgY29ubmVjdGVkIHRvLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNvY2tldDogbmV0LlNvY2tldCkge1xuICAgICAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcblxuICAgICAgICAvLyBXZSBuZWVkIHRvIHdyYXAgYWxsIHRoZSBsaXN0ZW5lciBmdW5jdGlvbnMgaW4gY2xvc3VyZXMgdG8gbm90IGxvc2VcbiAgICAgICAgLy8gcmVmZXJlbmNlIHRvICd0aGlzJywgd2hpY2ggaXMgdGhpcyBpbnN0YW5jZSBvZiBhIENsaWVudC5cbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdGhpcy5vbkRhdGFFdmVudE5hbWVdID0gKGRhdGE6IHVua25vd24pID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXREYXRhKGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0aGlzLm9uQ2xvc2VFdmVudE5hbWVdID0gKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRDbG9zZSgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0aGlzLm9uRXJyb3JFdmVudE5hbWVdID0gKGRhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Tb2NrZXRFcnJvcigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlzdGVuVG9Tb2NrZXQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGlmIHRoZSBwbGF5ZXIgaGFzIGRpc2Nvbm5lY3RlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjbGllbnQgaGFzIGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzZXJ2ZXIsXG4gICAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNEaXNjb25uZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc0Rpc2Nvbm5lY3RlZEZyb21Tb2NrZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgcmF3IG5ldC5Tb2NrZXQgdXNlZCBieSB0aGlzIGNsaWVudCxcbiAgICAgKiBwcm9iYWJseSBmb3IgdGhyZWFkIHBhc3NpbmcuIFVzZSB3aXRoIGNhcmUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgc29ja2V0LlxuICAgICAqL1xuICAgIHB1YmxpYyBwb3BOZXRTb2NrZXQoKTogbmV0LlNvY2tldCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGlmICghdGhpcy5zb2NrZXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IHRoaXMuc29ja2V0O1xuICAgICAgICB0aGlzLnNvY2tldCA9IHVuZGVmaW5lZDtcblxuICAgICAgICByZXR1cm4gc29ja2V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGlzIGNsaWVudCdzIHRpbWVyIGlzIHRpY2tpbmcgKHdlIGFyZSBhd2FpdGluZyB0aGVtIHRvIGZpbmlzaFxuICAgICAqIGFuIG9yZGVyKS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGlja2luZywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc1RpY2tpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy50aW1lci50aW1lb3V0ICE9PSB1bmRlZmluZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyB0aGUgdGltZW91dCB0aW1lciBjb3VudGluZyBkb3duIGZyb20gaG93IG11Y2ggdGltZSB0aGlzIGNsaWVudCdzXG4gICAgICogcGxheWVyIGhhcyBsZWZ0LlxuICAgICAqIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgaXMgYmVpbmcgdGltZWQgZm9yIG9yZGVycy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGlja2luZywgZmFsc2UgaWYgdGltZW91dHMgYXJlIG5vdCBlbmFibGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdGFydFRpY2tpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5wbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ29uZmlnLlRJTUVPVVRfVElNRSkge1xuICAgICAgICAgICAgLy8gVGhlIHNlcnZlciBpcyBuZXZlciBnb2luZyB0byB0aW1lb3V0IGNsaWVudHNcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVGlja2luZygpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGltZXIuc3RhcnRUaW1lID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgICAgICB0aGlzLnRpbWVyLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlclRpbWVkT3V0KCk7XG4gICAgICAgIH0sIE1hdGguY2VpbCh0aGlzLnBsYXllci50aW1lUmVtYWluaW5nIC8gMWU2KSk7IC8vIG5zIHRvIG1zXG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBjbGllbnQgaGFzIHRpbWVkIG91dC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhleSBoYXZlIHRpbWVkIG91dCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNUaW1lZE91dCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGltZWRPdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGF1c2VzIHRoZSB0aW1lb3V0IHRpbWVyLiBUaGlzIHNob3VsZCBiZSBkb25lIGFueSB0aW1lIHdlIGRvbid0IGV4cGVjdFxuICAgICAqIHRoZSBjbGllbnQgdG8gYmUgY29tcHV0aW5nIHNvbWV0aGluZywgbGlrZSB3aGVuIHRoZXkgYXJlIG5vdCB3b3JraW5nIG9uXG4gICAgICogYW4gb3JkZXIsIG9yIHdlIGFyZSBydW5uaW5nIGdhbWUgbG9naWMuXG4gICAgICovXG4gICAgcHVibGljIHBhdXNlVGlja2luZygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucGxheWVyICYmIHRoaXMuaXNUaWNraW5nKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVEaWZmID0gcHJvY2Vzcy5ocnRpbWUodGhpcy50aW1lci5zdGFydFRpbWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lci50aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIudGltZW91dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRpbWVyLnRpbWVvdXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnRpbWVyLnN0YXJ0VGltZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgLy8gaGlnaCByZXNvbHV0aW9uIHRpbWUgdG8gb25seSBuc1xuICAgICAgICAgICAgY29uc3QgdGltZVRha2VuID0gKHRpbWVEaWZmWzBdICogMWU5ICsgdGltZURpZmZbMV0pO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZXIudGltZVJlbWFpbmluZyAtPSB0aW1lVGFrZW47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXRhY2hlcyB0aGUgc2VydmVyIGZyb20gaXRzIHNvY2tldCAocmVtb3ZlcyBFdmVudExpc3RlbmVycykuXG4gICAgICogVGhpcyBtdXN0IGJlIHVzZWQgd2hlbiBwYXNzaW5nIGJldHdlZW4gdGhyZWFkcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgYm9vbGVhbiByZXByZXNlbnRpbmcgaWYgdGhlIGRldGFjaG1lbnQocykgd2VyZSBzdWNjZXNzZnVsLlxuICAgICAqL1xuICAgIHB1YmxpYyBzdG9wTGlzdGVuaW5nVG9Tb2NrZXQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICh0aGlzLmxpc3RlbmluZyAmJiB0aGlzLnNvY2tldCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5saXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoa2V5LCB0aGlzLmxpc3RlbmVyc1trZXldKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5saXN0ZW5pbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlzY29ubmVjdHMgZnJvbSB0aGUgc29ja2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGZhdGFsTWVzc2FnZSAtIElmIHlvdSB3YW50IHRvIHNlbmQgdGhlIGNsaWVudCBhICdmYXRhbCcgZXZlbnRcbiAgICAgKiB3aXRoIGEgbWVzc2FnZSwgZG8gc28gaGVyZS4gVGhpcyBpcyBjb21tb24gd2hlbiB0aGUgY2xpZW50IHNlbmRzIG9yXG4gICAgICogZG9lcyBzb21ldGhpbmcgZXJyb25lb3VzLlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gd2UgaGF2ZSBzZW50IHRoZSBkaXNjb25uZWN0XG4gICAgICogbWVzc2FnZSwgb3IgaW1tZWRpYXRlbHkgaWYgbm9uZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgZGlzY29ubmVjdChmYXRhbE1lc3NhZ2U/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKGZhdGFsTWVzc2FnZSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZW5kKHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJmYXRhbFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZmF0YWxNZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgICB0aW1lZE91dDogdGhpcy50aW1lZE91dCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2Nvbm5lY3RlZCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIG9wdGlvbmFsIGluZm9ybWF0aW9uIGFib3V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIGluZm8gLSBUaGUgbmFtZSwgbGFuZ3VhZ2UsIGFuZCBpbmRleCBvZiB0aGUgY2xpZW50XG4gICAgICovXG4gICAgcHVibGljIHNldEluZm8oaW5mbzoge1xuICAgICAgICAvKiogTmFtZSBvZiB0aGUgY2xpbmV0ICovXG4gICAgICAgIG5hbWU/OiBzdHJpbmc7XG5cbiAgICAgICAgLyoqIFR5cGUgb2YgY2xpZW50ICh3cy90Y3ApICovXG4gICAgICAgIHR5cGU/OiBzdHJpbmc7XG5cbiAgICAgICAgLyoqIENvbm5lY3Rpb24gaW5kZXggb2YgdGhlIGNsaWVudCAqL1xuICAgICAgICBpbmRleD86IG51bWJlcjtcblxuICAgICAgICAvKiogRmxhZyBmb3IgaWYgbWV0YSBkZWx0YXMgc2hvdWxkIGJlIHNlbnQgaW5zdGVhZCBvZiBub3JtYWwgZGVsdGFzICovXG4gICAgICAgIG1ldGFEZWx0YXM/OiBib29sZWFuO1xuICAgIH0pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vdXJOYW1lID0gaW5mby5uYW1lIHx8IERFRkFVTFRfU1RSO1xuICAgICAgICB0aGlzLm91clByb2dyYW1taW5nTGFuZ3VhZ2VUeXBlID0gaW5mby50eXBlIHx8IERFRkFVTFRfU1RSO1xuICAgICAgICB0aGlzLm91clBsYXllckluZGV4ID0gaW5mby5pbmRleDtcbiAgICAgICAgdGhpcy5zZW5kTWV0YURlbHRhcyA9IEJvb2xlYW4oaW5mby5tZXRhRGVsdGFzKTtcblxuICAgICAgICBpZiAodGhpcy5vdXJOYW1lLmxlbmd0aCA+IDgwKSB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCB3YW50IHBsYXllcnMgdG8gYmUgYWJsZSB0byB1c2Ugc3R1cGlkbHkgbG9uZyBuYW1lcy5cbiAgICAgICAgICAgIC8vIHNvIGhlcmUncyBhIGxpbWl0IG9mIDgwIGNoYXJhY3RlcnMuXG5cbiAgICAgICAgICAgIHRoaXMub3VyTmFtZSA9IGAke3RoaXMub3VyUHJvZ3JhbW1pbmdMYW5ndWFnZVR5cGV9IFBsYXllcmA7XG4gICAgICAgICAgICAvLyBJZiBwZW9wbGUgc3RhcnQgY2hlZXNpbmcgdGhpcyB0b28gYW5kIHNlbmRpbmcgYSBcImZha2VcIlxuICAgICAgICAgICAgLy8gcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHRoZW4gd2UgbWlnaHQgd2FudCB0byBoYXJkIGNvZGUgYSBsaXN0IG9mXG4gICAgICAgICAgICAvLyBrbm93biBsYW5ndWFnZXMgYW5kIG1ha2Ugc3VyZSBpdCBpcyB2YWxpZCBoZXJlIHRvby5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGRhdGEgcmVsYXRlZCB0byB0aGUgZ2FtZSB0aGlzIGNsaWVudCBpcyBjb25uZWN0ZWQgdG8gcGxheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHRoaXMgYWkgY29udHJvbHMuXG4gICAgICovXG4gICAgcHVibGljIHNldFBsYXllcihwbGF5ZXI6IEJhc2VQbGF5ZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vdXJQbGF5ZXIgPSBwbGF5ZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZHMgdGhlIG1lc3NhZ2Ugb2YgdHlwZSBldmVudCB0byB0aGlzIGNsaWVudCBhcyBhIGpzb24gc3RyaW5nIEVPVF9DSEFSXG4gICAgICogdGVybWluYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCAtIFRoZSBldmVudCB0byBzZW5kLiBNdXN0IGJlIGFuIGV4cGVjdGVkIHNlcnZlciBldmVudC5cbiAgICAgKiBAcmV0dXJucyBBZnRlciB0aGUgZGF0YSBpcyBzZW50LlxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBzZW5kKGV2ZW50OiBJbW11dGFibGU8U2VydmVyRXZlbnQ+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIC8vIGV2ZW50LmVwb2NoID0gTnVtYmVyKG5ldyBEYXRlKCkpOyAtLSBEaXNhYmxlZCBmb3Igbm93XG4gICAgICAgIHJldHVybiB0aGlzLnNlbmRSYXcoSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIHRoZSByYXcgc3RyaW5nIHRvIHRoZSByZW1vdGUgY2xpZW50IHRoaXMgY2xhc3MgcmVwcmVzZW50cy5cbiAgICAgKiBJbnRlbmRlZCB0byBiZSBvdmVycmlkZGVuIHRvIGFjdHVhbGx5IHNlbmQgdGhyb3VnaCBjbGllbnQuLi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHIgLSBUaGUgcmF3IHN0cmluZyB0byBzZW5kLiBTaG91bGQgYmUgRU9UX0NIQVIgdGVybWluYXRlZC5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgc2VuZFJhdyhzdHI6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoQ29uZmlnLlBSSU5UX1RDUCkge1xuICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGA+IHRvIGNsaWVudCAke3RoaXMubmFtZX0gLS0+ICR7c3RyfVxcbi0tLWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKiBUaGUgc3RyaW5nIGtleSBvZiB0aGUgRXZlbnRFbWl0dGVyIG5hbWUgdG8gcmVnaXN0ZXIgZm9yIGRhdGEgZXZlbnRzLiAqL1xuICAgIHByb3RlY3RlZCBnZXQgb25EYXRhRXZlbnROYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcImRhdGFcIjtcbiAgICB9XG5cbiAgICAvKiogVGhlIHN0cmluZyBrZXkgb2YgdGhlIEV2ZW50RW1pdHRlciBuYW1lIHRvIHJlZ2lzdGVyIGZvciBjbG9zZSBldmVudHMuICovXG4gICAgcHJvdGVjdGVkIGdldCBvbkNsb3NlRXZlbnROYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcImNsb3NlXCI7XG4gICAgfVxuXG4gICAgLyoqIFRoZSBzdHJpbmcga2V5IG9mIHRoZSBFdmVudEVtaXR0ZXIgbmFtZSB0byByZWdpc3RlciBmb3IgZXJyb3IgZXZlbnRzLiAqL1xuICAgIHByb3RlY3RlZCBnZXQgb25FcnJvckV2ZW50TmFtZSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gXCJlcnJvclwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc2VuZHMgc29tZSBkYXRhLiB0aGUgc3BlY2lmaWMgc3VwZXIgY2xhc3Mgc2hvdWxkXG4gICAgICogaW5oZXJpdCBhbmQgZG8gc3R1ZmYgdG8gdGhpcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkYXRhIC0gV2hhdCB0aGUgY2xpZW50IHNlbmQgdmlhIHRoZSBzb2NrZXQgZXZlbnQgbGlzdGVuZXIuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uU29ja2V0RGF0YShkYXRhOiB1bmtub3duKTogdm9pZCB7XG4gICAgICAgIGlmIChDb25maWcuUFJJTlRfVENQKSB7XG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoYDwgRnJvbSBjbGllbnQgJHt0aGlzLm5hbWV9ICA8LS0gJHtkYXRhfVxcbi0tLWApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3VwZXIgY2xhc3NlcyBzaG91bGQgb3ZlcnJpZGUgYW5kIGRvIHN0dWZmIHdpdGggZGF0YS4uLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXIgZm9yIHdoZW4gd2Uga25vdyB0aGlzIGNsaWVudCBzZW50IHVzIHNvbWUgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBqc29uRGF0YSAtIFRoZSBkYXRhLCBhcyBhbiBhbHJlYWR5IHBhcnNlZCBqc29uIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaGFuZGxlU2VudChqc29uRGF0YTogdW5rbm93bik6IHZvaWQge1xuICAgICAgICBpZiAoIWlzT2JqZWN0KGpzb25EYXRhKVxuICAgICAgICAgfHwgIW9iamVjdEhhc1Byb3BlcnR5KGpzb25EYXRhLCBcImV2ZW50XCIpXG4gICAgICAgICB8fCB0eXBlb2YganNvbkRhdGEuZXZlbnQgIT09IFwic3RyaW5nXCJcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoXCJTZW50IG1hbGZvcm1lZCBqc29uIGV2ZW50XCIpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBldmVudCA9IHRoaXMuc2VudFtqc29uRGF0YS5ldmVudF07XG4gICAgICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdChgU2VudCB1bmtub3duIGV2ZW50ICcke2pzb25EYXRhLmV2ZW50fScuYCk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHdlIGdvdCBoZXJlIHRoZSBzZW50IGV2ZW50IGxvb2tzIHZhbGlkLCBlbWl0IGl0IVxuICAgICAgICBldmVudC5lbWl0KGpzb25EYXRhLmRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY2xvc2VzIChkaXNjb25uZWN0cykuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uU29ja2V0Q2xvc2UoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyB1bmV4cGVjdGVkbHkuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIG9uU29ja2V0RXJyb3IoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdGVkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJpZXMgdG8gcGFyc2UganNvbiBkYXRhIGZyb20gdGhlIGNsaWVudCwgYW5kIGRpc2Nvbm5lY3RzIHRoZW0gZmF0YWxseVxuICAgICAqIGlmIGl0IGlzIG1hbGZvcm1lZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBqc29uIC0gVGhlIGpzb24gZm9ybWF0dGVkIHN0cmluZyB0byBwYXJzZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgcGFyc2VkIGpzb24gc3RydWN0dXJlLCBvciB1bmRlZmluZWQgaWYgbWFsZm9ybWVkIGpzb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHBhcnNlRGF0YShqc29uOiB1bmtub3duKTogSnNvbiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGxldCBpbnZhbGlkID0gXCJcIjtcblxuICAgICAgICBpZiAodHlwZW9mIGpzb24gIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGludmFsaWQgPSBgU2VudCAke2pzb259LCB3aGljaCBjYW5ub3QgYmUgcGFyc2VkLmA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGpzb24pIGFzIEpzb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgaW52YWxpZCA9IGBTZW50IG1hbGZvcm1lZCBKU09OOiAnJHtTdHJpbmcoZXJyKX0nYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoaW52YWxpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgcmVtb3RlIGNsaWVudCB0aGlzIENsaWVudCByZXByZXNlbnRzLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBkaXNjb25uZWN0ZWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuaGFzRGlzY29ubmVjdGVkRnJvbVNvY2tldCA9IHRydWU7XG4gICAgICAgIHRoaXMucGF1c2VUaWNraW5nKCk7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmluZ1RvU29ja2V0KCk7XG4gICAgICAgIHRoaXMuZXZlbnRzLmRpc2Nvbm5lY3RlZC5lbWl0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyB1cCB0aGUgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGxpc3RlbiB0byB0aGUgc29ja2V0IHRoaXMgY2xpZW50XG4gICAgICogc2hvdWxkIGhhdmUgZGF0YSBzdHJlYW1pbmcgZnJvbS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGxpc3RlblRvU29ja2V0KCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc29ja2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0Lm9uKGtleSwgdGhpcy5saXN0ZW5lcnNba2V5XSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmxpc3RlbmluZyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhpcyBDbGllbnQgcnVucyBvdXQgb2YgdGltZSBvbSBpdCdzIHRpbWVyLlxuICAgICAqIFByb2JhYmx5IGJlY2F1c2UgaXQgaW5maW5pdGUgbG9vcGVkLCBicm9rZSwgb3IgaXMganVzdCB2ZXJ5IHNsb3cuXG4gICAgICovXG4gICAgcHJpdmF0ZSB0cmlnZ2VyVGltZWRPdXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGltZWRPdXQgPSB0cnVlO1xuICAgICAgICB0aGlzLnBhdXNlVGlja2luZygpO1xuICAgICAgICB0aGlzLmV2ZW50cy50aW1lZE91dC5lbWl0KCk7XG4gICAgICAgIHRoaXMuZGlzY29ubmVjdChcIllvdXIgY2xpZW50IGhhcyBydW4gb3V0IG9mIHRpbWUsIGFuZCBoYXMgYmVlbiB0aW1lZCBvdXQuXCIpO1xuICAgIH1cbn1cbiJdfQ==