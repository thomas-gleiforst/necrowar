"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_typed_events_1 = require("ts-typed-events");
const logger_1 = require("~/core/logger");
const utils_1 = require("~/utils");
/**
 * A container for the Lobby to contain clients and information about what they
 * want to play.
 */
class Room {
    /**
     * Creates a room for a lobby to hold clients before they play the game.
     *
     * @param id - The ID of our session we will run in time.
     * @param gameNamespace - The namespace of the game to play.
     * @param gamelogManager - The gamelog manager instance to log gamelogs
     * generated in this room.
     * @param updater - The updated to check for updates with.
     */
    constructor(id, gameNamespace, gamelogManager, updater) {
        this.id = id;
        this.gameNamespace = gameNamespace;
        this.gamelogManager = gamelogManager;
        this.updater = updater;
        /** The events emitted from this room. */
        this.events = ts_typed_events_1.events({
            over: new ts_typed_events_1.Signal(),
        });
        /**
         * All the clients connected to this room (spectators and players alike)
         */
        this.clients = [];
        /** The time this room was created */
        this.timeCreated = new Date();
        /** If the game this room is playing has been ran and it is over */
        this.over = false;
        this.gameSettingsManager = new gameNamespace.GameSettingsManager();
    }
    /**
     * Gets the clients that are playing the game (omits spectators).
     *
     * @returns A new array of only clients playing the game.
     */
    getClientsPlaying() {
        return this.clients.filter((c) => !c.isSpectating);
    }
    /**
     * Adds a client to this session.
     *
     * @param client - the client to add to this session
     */
    addClient(client) {
        this.clients.push(client);
    }
    /**
     * Removes a client from this session.
     *
     * @param client - the client to remove from this session
     */
    removeClient(client) {
        utils_1.removeElements(this.clients, client);
    }
    /**
     * Checks if the game for this session is over
     * @returns True if the game is over, false otherwise
     */
    isOver() {
        return this.over;
    }
    /**
     * If this session is open to more clients joining
     *
     * @returns true if open, false otherwise
     */
    isOpen() {
        return !this.isOver() && !this.isRunning() && !this.canStart();
    }
    /**
     * If this session has enough playing clients in it to start running.
     * The Lobby uses this to know when it should start.
     *
     * @returns true if ready to start running, false otherwise
     */
    canStart() {
        const { requiredNumberOfPlayers } = this.gameNamespace.GameManager;
        return !this.isOver()
            && !this.isRunning()
            && this.getClientsPlaying().length === requiredNumberOfPlayers;
    }
    /**
     * Starts this session by having it spin up a new worker thread for the
     * game instance.
     */
    start() {
        if (this.updater) { // && this.updater.foundUpdates()) {
            logger_1.logger.warn("Starting a game session without updates!");
        }
        // super classes should inherit and do things
    }
    /**
     * If this session has a game instance running on a worker thread.
     * @returns true if it is running, false otherwise
     */
    isRunning() {
        return false; // super lobbies should do the thing
    }
    /**
     * Adds game settings to this game instance, parsing them from strings to
     * correct types.
     *
     * @param settings - the key/value pair settings to add
     * @returns An error if the settings were invalid, otherwise nothing
     */
    addGameSettings(settings) {
        return this.gameSettingsManager.addSettings(settings);
    }
    /**
     * Gets the data about the game, if over
     *
     * @returns nothing if not over, otherwise info about the clients.
     */
    getOverData() {
        return this.isOver()
            ? this.clientInfos
            : undefined;
    }
    /**
     * Invoked when a sub class knows its game session.
     *
     * @param clientInfos - A list of information about clients state as the game ended.
     * @returns Once the over event is emitted.
     */
    async handleOver(clientInfos) {
        this.clients.length = 0;
        this.clientInfos = clientInfos;
        this.events.over.emit();
    }
    /**
     * Cleans everything up once the same session is over
     *
     * @param gamelog The gamelog resulting from the game played in the session
     * @returns A promise that resolves once the gamelog is written to disk.
     */
    async cleanUp(gamelog) {
        this.over = true;
        if (gamelog) {
            // copy their winners and losers to ours.
            this.winners = gamelog.winners.slice();
            this.losers = gamelog.losers.slice();
            // Undefined to signify the gamelog does not exist,
            // as it has not be written to the file system yet
            this.gamelogFilename = undefined;
            // Now write the gamelog, once written update our
            // `gamelogFilename` to the actual slug to signify it can be
            // read now
            this.gamelogFilename = await this.gamelogManager.log(gamelog);
        }
    }
}
exports.Room = Room;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnktcm9vbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3NlcnZlci9sb2JieS1yb29tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQWlEO0FBR2pELDBDQUF1QztBQUN2QyxtQ0FBbUU7QUFJbkU7OztHQUdHO0FBQ0gsTUFBc0IsSUFBSTtJQXNDdEI7Ozs7Ozs7O09BUUc7SUFDSCxZQUNvQixFQUFVLEVBQ1YsYUFBNEMsRUFDekMsY0FBOEIsRUFDaEMsT0FBaUI7UUFIbEIsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLGtCQUFhLEdBQWIsYUFBYSxDQUErQjtRQUN6QyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDaEMsWUFBTyxHQUFQLE9BQU8sQ0FBVTtRQWxEdEMseUNBQXlDO1FBQ3pCLFdBQU0sR0FBRyx3QkFBTSxDQUFDO1lBQzVCLElBQUksRUFBRSxJQUFJLHdCQUFNLEVBQUU7U0FDckIsQ0FBQyxDQUFDO1FBRUg7O1dBRUc7UUFDYSxZQUFPLEdBQWlCLEVBQUUsQ0FBQztRQWlCM0MscUNBQXFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUt6QyxtRUFBbUU7UUFDM0QsU0FBSSxHQUFHLEtBQUssQ0FBQztRQW9CakIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksYUFBYSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdkUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxpQkFBaUI7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxTQUFTLENBQUMsTUFBa0I7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxZQUFZLENBQUMsTUFBa0I7UUFDbEMsc0JBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7O09BR0c7SUFDSSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTTtRQUNULE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUTtRQUNYLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBRW5FLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2VBQ2QsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO2VBQ2pCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE1BQU0sS0FBSyx1QkFBdUIsQ0FBQztJQUN2RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSztRQUNSLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLG9DQUFvQztZQUNwRCxlQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDM0Q7UUFFRCw2Q0FBNkM7SUFDakQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFNBQVM7UUFDWixPQUFPLEtBQUssQ0FBQyxDQUFDLG9DQUFvQztJQUN0RCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksZUFBZSxDQUFDLFFBQWtDO1FBQ3JELE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXO1lBQ2xCLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sS0FBSyxDQUFDLFVBQVUsQ0FBQyxXQUFpRDtRQUN4RSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUE0QixDQUFDO1FBRWhELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBNkI7UUFDakQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFakIsSUFBSSxPQUFPLEVBQUU7WUFDVCx5Q0FBeUM7WUFDekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVyQyxtREFBbUQ7WUFDbkQsa0RBQWtEO1lBQ2xELElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1lBRWpDLGlEQUFpRDtZQUNqRCw0REFBNEQ7WUFDNUQsV0FBVztZQUNYLElBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqRTtJQUNMLENBQUM7Q0FDSjtBQWpNRCxvQkFpTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJR2FtZWxvZywgSUdhbWVsb2dXaW5uZXJMb3NlciB9IGZyb20gXCJAY2FkcmUvdHMtdXRpbHMvY2FkcmVcIjtcbmltcG9ydCB7IGV2ZW50cywgU2lnbmFsIH0gZnJvbSBcInRzLXR5cGVkLWV2ZW50c1wiO1xuaW1wb3J0IHsgQmFzZUdhbWVTZXR0aW5nc01hbmFnZXIsIEdhbWVsb2dNYW5hZ2VyLCBJQmFzZUdhbWVOYW1lc3BhY2UsXG4gICAgICAgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCJ+L2NvcmUvbG9nZ2VyXCI7XG5pbXBvcnQgeyBJbW11dGFibGUsIHJlbW92ZUVsZW1lbnRzLCBVbmtub3duT2JqZWN0IH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IEJhc2VDbGllbnQsIElDbGllbnRJbmZvIH0gZnJvbSBcIi4uL2NsaWVudHMvXCI7XG5pbXBvcnQgeyBVcGRhdGVyIH0gZnJvbSBcIi4uL3VwZGF0ZXJcIjtcblxuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgdGhlIExvYmJ5IHRvIGNvbnRhaW4gY2xpZW50cyBhbmQgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCB0aGV5XG4gKiB3YW50IHRvIHBsYXkuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSb29tIHtcbiAgICAvKiogVGhlIGV2ZW50cyBlbWl0dGVkIGZyb20gdGhpcyByb29tLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBldmVudHMgPSBldmVudHMoe1xuICAgICAgICBvdmVyOiBuZXcgU2lnbmFsKCksXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIGNsaWVudHMgY29ubmVjdGVkIHRvIHRoaXMgcm9vbSAoc3BlY3RhdG9ycyBhbmQgcGxheWVycyBhbGlrZSlcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2xpZW50czogQmFzZUNsaWVudFtdID0gW107XG5cbiAgICAvKipcbiAgICAgKiBPbmNlIHdyaXR0ZW4gdG8gZGlzaywgdGhpcyB3aWxsIGJlIHRoZSBmaWxlbmFtZSBvZiB0aGUgZ2FtZWxvZyBmb3IgdGhpc1xuICAgICAqIHJvb21cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZWxvZ0ZpbGVuYW1lPzogc3RyaW5nO1xuXG4gICAgLyoqIE9uY2UgdGhlIGdhbWUgaXMgb3ZlciwgdGhpcyB3aWxsIGV4aXN0IGFuZCBiZSB0aGUgbGlzdCBvZiB3aW5uZXJzICovXG4gICAgcHVibGljIHdpbm5lcnM/OiBJR2FtZWxvZ1dpbm5lckxvc2VyW107XG5cbiAgICAvKiogT25jZSB0aGUgZ2FtZSBpcyBvdmVyLCB0aGlzIHdpbGwgZXhpc3QgYW5kIGJlIHRoZSBsaXN0IG9mIGxvc2VycyAqL1xuICAgIHB1YmxpYyBsb3NlcnM/OiBJR2FtZWxvZ1dpbm5lckxvc2VyW107XG5cbiAgICAvKiogVGhlIHBhc3N3b3JkIHRvIGVudHJ5IHRoaXMgcm9vbS4gSWYgdW5kZWZpbmVkIG9wZW4gdG8gYW55b25lLiAqL1xuICAgIHB1YmxpYyBwYXNzd29yZD86IHN0cmluZztcblxuICAgIC8qKiBUaGUgdGltZSB0aGlzIHJvb20gd2FzIGNyZWF0ZWQgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGltZUNyZWF0ZWQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgLyoqIFRoZSBtYW5hZ2VyIHdlIHVzZSB0byB2YWxpZGF0ZSBnYW1lIHNldHRpbmdzIGFnYWluc3QgKi9cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2FtZVNldHRpbmdzTWFuYWdlcjogQmFzZUdhbWVTZXR0aW5nc01hbmFnZXI7XG5cbiAgICAvKiogSWYgdGhlIGdhbWUgdGhpcyByb29tIGlzIHBsYXlpbmcgaGFzIGJlZW4gcmFuIGFuZCBpdCBpcyBvdmVyICovXG4gICAgcHJpdmF0ZSBvdmVyID0gZmFsc2U7XG5cbiAgICAvKiogVGhlIGluZm9zIGFib3V0IHRoZSBjbGllbnQgb25jZSB0aGUgZ2FtZSBpcyBvdmVyLiAqL1xuICAgIHByaXZhdGUgY2xpZW50SW5mb3M/OiBJQ2xpZW50SW5mb1tdO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHJvb20gZm9yIGEgbG9iYnkgdG8gaG9sZCBjbGllbnRzIGJlZm9yZSB0aGV5IHBsYXkgdGhlIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQgLSBUaGUgSUQgb2Ygb3VyIHNlc3Npb24gd2Ugd2lsbCBydW4gaW4gdGltZS5cbiAgICAgKiBAcGFyYW0gZ2FtZU5hbWVzcGFjZSAtIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIGdhbWUgdG8gcGxheS5cbiAgICAgKiBAcGFyYW0gZ2FtZWxvZ01hbmFnZXIgLSBUaGUgZ2FtZWxvZyBtYW5hZ2VyIGluc3RhbmNlIHRvIGxvZyBnYW1lbG9nc1xuICAgICAqIGdlbmVyYXRlZCBpbiB0aGlzIHJvb20uXG4gICAgICogQHBhcmFtIHVwZGF0ZXIgLSBUaGUgdXBkYXRlZCB0byBjaGVjayBmb3IgdXBkYXRlcyB3aXRoLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZyxcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGdhbWVOYW1lc3BhY2U6IEltbXV0YWJsZTxJQmFzZUdhbWVOYW1lc3BhY2U+LFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2FtZWxvZ01hbmFnZXI6IEdhbWVsb2dNYW5hZ2VyLFxuICAgICAgICBwcml2YXRlIHJlYWRvbmx5IHVwZGF0ZXI/OiBVcGRhdGVyLFxuICAgICkge1xuICAgICAgICB0aGlzLmdhbWVTZXR0aW5nc01hbmFnZXIgPSBuZXcgZ2FtZU5hbWVzcGFjZS5HYW1lU2V0dGluZ3NNYW5hZ2VyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY2xpZW50cyB0aGF0IGFyZSBwbGF5aW5nIHRoZSBnYW1lIChvbWl0cyBzcGVjdGF0b3JzKS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgbmV3IGFycmF5IG9mIG9ubHkgY2xpZW50cyBwbGF5aW5nIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRDbGllbnRzUGxheWluZygpOiBCYXNlQ2xpZW50W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGllbnRzLmZpbHRlcigoYykgPT4gIWMuaXNTcGVjdGF0aW5nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgY2xpZW50IHRvIHRoaXMgc2Vzc2lvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbGllbnQgLSB0aGUgY2xpZW50IHRvIGFkZCB0byB0aGlzIHNlc3Npb25cbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkQ2xpZW50KGNsaWVudDogQmFzZUNsaWVudCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSBjbGllbnQgZnJvbSB0aGlzIHNlc3Npb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50IC0gdGhlIGNsaWVudCB0byByZW1vdmUgZnJvbSB0aGlzIHNlc3Npb25cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlQ2xpZW50KGNsaWVudDogQmFzZUNsaWVudCk6IHZvaWQge1xuICAgICAgICByZW1vdmVFbGVtZW50cyh0aGlzLmNsaWVudHMsIGNsaWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBnYW1lIGZvciB0aGlzIHNlc3Npb24gaXMgb3ZlclxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGdhbWUgaXMgb3ZlciwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGlzT3ZlcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3ZlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIHNlc3Npb24gaXMgb3BlbiB0byBtb3JlIGNsaWVudHMgam9pbmluZ1xuICAgICAqXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBvcGVuLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNPcGVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNPdmVyKCkgJiYgIXRoaXMuaXNSdW5uaW5nKCkgJiYgIXRoaXMuY2FuU3RhcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIHNlc3Npb24gaGFzIGVub3VnaCBwbGF5aW5nIGNsaWVudHMgaW4gaXQgdG8gc3RhcnQgcnVubmluZy5cbiAgICAgKiBUaGUgTG9iYnkgdXNlcyB0aGlzIHRvIGtub3cgd2hlbiBpdCBzaG91bGQgc3RhcnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHJlYWR5IHRvIHN0YXJ0IHJ1bm5pbmcsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBjYW5TdGFydCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgeyByZXF1aXJlZE51bWJlck9mUGxheWVycyB9ID0gdGhpcy5nYW1lTmFtZXNwYWNlLkdhbWVNYW5hZ2VyO1xuXG4gICAgICAgIHJldHVybiAhdGhpcy5pc092ZXIoKVxuICAgICAgICAgICAgJiYgIXRoaXMuaXNSdW5uaW5nKClcbiAgICAgICAgICAgICYmIHRoaXMuZ2V0Q2xpZW50c1BsYXlpbmcoKS5sZW5ndGggPT09IHJlcXVpcmVkTnVtYmVyT2ZQbGF5ZXJzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyB0aGlzIHNlc3Npb24gYnkgaGF2aW5nIGl0IHNwaW4gdXAgYSBuZXcgd29ya2VyIHRocmVhZCBmb3IgdGhlXG4gICAgICogZ2FtZSBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnVwZGF0ZXIpIHsgLy8gJiYgdGhpcy51cGRhdGVyLmZvdW5kVXBkYXRlcygpKSB7XG4gICAgICAgICAgICBsb2dnZXIud2FybihcIlN0YXJ0aW5nIGEgZ2FtZSBzZXNzaW9uIHdpdGhvdXQgdXBkYXRlcyFcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdXBlciBjbGFzc2VzIHNob3VsZCBpbmhlcml0IGFuZCBkbyB0aGluZ3NcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIHNlc3Npb24gaGFzIGEgZ2FtZSBpbnN0YW5jZSBydW5uaW5nIG9uIGEgd29ya2VyIHRocmVhZC5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGl0IGlzIHJ1bm5pbmcsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc1J1bm5pbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmYWxzZTsgLy8gc3VwZXIgbG9iYmllcyBzaG91bGQgZG8gdGhlIHRoaW5nXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBnYW1lIHNldHRpbmdzIHRvIHRoaXMgZ2FtZSBpbnN0YW5jZSwgcGFyc2luZyB0aGVtIGZyb20gc3RyaW5ncyB0b1xuICAgICAqIGNvcnJlY3QgdHlwZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2V0dGluZ3MgLSB0aGUga2V5L3ZhbHVlIHBhaXIgc2V0dGluZ3MgdG8gYWRkXG4gICAgICogQHJldHVybnMgQW4gZXJyb3IgaWYgdGhlIHNldHRpbmdzIHdlcmUgaW52YWxpZCwgb3RoZXJ3aXNlIG5vdGhpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkR2FtZVNldHRpbmdzKHNldHRpbmdzOiBJbW11dGFibGU8VW5rbm93bk9iamVjdD4pOiB2b2lkIHwgRXJyb3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lU2V0dGluZ3NNYW5hZ2VyLmFkZFNldHRpbmdzKHNldHRpbmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBkYXRhIGFib3V0IHRoZSBnYW1lLCBpZiBvdmVyXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBub3RoaW5nIGlmIG5vdCBvdmVyLCBvdGhlcndpc2UgaW5mbyBhYm91dCB0aGUgY2xpZW50cy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0T3ZlckRhdGEoKTogdW5kZWZpbmVkIHwgSUNsaWVudEluZm9bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzT3ZlcigpXG4gICAgICAgICAgICA/IHRoaXMuY2xpZW50SW5mb3NcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiBhIHN1YiBjbGFzcyBrbm93cyBpdHMgZ2FtZSBzZXNzaW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNsaWVudEluZm9zIC0gQSBsaXN0IG9mIGluZm9ybWF0aW9uIGFib3V0IGNsaWVudHMgc3RhdGUgYXMgdGhlIGdhbWUgZW5kZWQuXG4gICAgICogQHJldHVybnMgT25jZSB0aGUgb3ZlciBldmVudCBpcyBlbWl0dGVkLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhc3luYyBoYW5kbGVPdmVyKGNsaWVudEluZm9zOiBJbW11dGFibGU8SUNsaWVudEluZm9bXT4gfCB1bmRlZmluZWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5jbGllbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuY2xpZW50SW5mb3MgPSBjbGllbnRJbmZvcyBhcyBJQ2xpZW50SW5mb1tdO1xuXG4gICAgICAgIHRoaXMuZXZlbnRzLm92ZXIuZW1pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFucyBldmVyeXRoaW5nIHVwIG9uY2UgdGhlIHNhbWUgc2Vzc2lvbiBpcyBvdmVyXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ2FtZWxvZyBUaGUgZ2FtZWxvZyByZXN1bHRpbmcgZnJvbSB0aGUgZ2FtZSBwbGF5ZWQgaW4gdGhlIHNlc3Npb25cbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIHRoZSBnYW1lbG9nIGlzIHdyaXR0ZW4gdG8gZGlzay5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY2xlYW5VcChnYW1lbG9nPzogSW1tdXRhYmxlPElHYW1lbG9nPik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLm92ZXIgPSB0cnVlO1xuXG4gICAgICAgIGlmIChnYW1lbG9nKSB7XG4gICAgICAgICAgICAvLyBjb3B5IHRoZWlyIHdpbm5lcnMgYW5kIGxvc2VycyB0byBvdXJzLlxuICAgICAgICAgICAgdGhpcy53aW5uZXJzID0gZ2FtZWxvZy53aW5uZXJzLnNsaWNlKCk7XG4gICAgICAgICAgICB0aGlzLmxvc2VycyA9IGdhbWVsb2cubG9zZXJzLnNsaWNlKCk7XG5cbiAgICAgICAgICAgIC8vIFVuZGVmaW5lZCB0byBzaWduaWZ5IHRoZSBnYW1lbG9nIGRvZXMgbm90IGV4aXN0LFxuICAgICAgICAgICAgLy8gYXMgaXQgaGFzIG5vdCBiZSB3cml0dGVuIHRvIHRoZSBmaWxlIHN5c3RlbSB5ZXRcbiAgICAgICAgICAgIHRoaXMuZ2FtZWxvZ0ZpbGVuYW1lID0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAvLyBOb3cgd3JpdGUgdGhlIGdhbWVsb2csIG9uY2Ugd3JpdHRlbiB1cGRhdGUgb3VyXG4gICAgICAgICAgICAvLyBgZ2FtZWxvZ0ZpbGVuYW1lYCB0byB0aGUgYWN0dWFsIHNsdWcgdG8gc2lnbmlmeSBpdCBjYW4gYmVcbiAgICAgICAgICAgIC8vIHJlYWQgbm93XG4gICAgICAgICAgICB0aGlzLmdhbWVsb2dGaWxlbmFtZSA9IGF3YWl0IHRoaXMuZ2FtZWxvZ01hbmFnZXIubG9nKGdhbWVsb2cpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19