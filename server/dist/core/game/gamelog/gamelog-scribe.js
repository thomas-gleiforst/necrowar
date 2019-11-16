"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_typed_events_1 = require("ts-typed-events");
const constants_1 = require("~/core/constants");
/** Observes a game and creates a gamelog by transcribing its events */
class GamelogScribe {
    /**
     * Creates a new game logger for a specific game.
     *
     * @param game - The game we are logging.
     * @param gameVersion - The version of the game we are logging.
     * @param session - The session the game is in.
     * @param clients - The clients in the game session.
     * @param deltaManager - The delta manager that builds deltas for us.
     */
    constructor(game, gameVersion, session, clients, deltaManager) {
        this.deltaManager = deltaManager;
        /** The events the game logger emits when it logs something. */
        this.events = ts_typed_events_1.events({
            /** Emitted every time a new delta is logged to the gamelog. */
            logged: new ts_typed_events_1.Event(),
        });
        /** If our gamelog is finalized and should never be changed after. */
        this.finalized = false;
        this.gamelog = {
            gamelogVersion: "2.2.0",
            gameName: game.name,
            gameSession: game.session,
            gameVersion,
            constants: constants_1.SHARED_CONSTANTS,
            deltas: [],
            epoch: 0,
            losers: [],
            winners: [],
            settings: game.settings,
        };
        // this assumes the GameManager goes first
        session.events.start.on(() => {
            this.add("start");
        });
        session.events.gameOver.on(() => {
            this.add("over");
            this.finalizeGamelog(clients);
        });
        session.events.aiOrdered.on((ordered) => {
            this.add("order", ordered);
        });
        session.events.aiFinished.on((finished) => {
            this.add("finished", finished);
        });
        session.events.aiRan.on((ran) => {
            this.add("ran", ran);
        });
        for (const client of clients) {
            if (!client.player) {
                continue; // We don't care when non-player clients disconnect.
            }
            const { id } = client.player;
            client.events.disconnected.on(() => {
                this.add("disconnect", {
                    player: { id },
                    timeout: client.hasTimedOut(),
                });
            });
        }
    }
    /**
     * Generates the game log from all the events that happened in this game.
     *
     * @param clients - The list of clients that played this game.
     * @returns The gamelog that was generated.
     */
    finalizeGamelog(clients) {
        // update the winners and losers of the gamelog
        for (let i = 0; i < clients.length; i++) {
            const client = clients[i];
            const { player } = client;
            if (!player) {
                continue; // they are a spectator and don't matter to the gamelog.
            }
            const winnerLoserArray = player.won
                ? this.gamelog.winners
                : this.gamelog.losers;
            winnerLoserArray.push({
                index: i,
                id: player.id,
                name: player.name,
                reason: player.won
                    ? player.reasonWon
                    : player.reasonLost,
                disconnected: client.hasDisconnected() && !client.hasTimedOut(),
                // then they lost because they disconnected
                timedOut: client.hasTimedOut(),
            });
        }
        this.gamelog.epoch = (new Date()).getTime();
        this.finalized = true;
    }
    /**
     * Adds a delta for some reason, and emits that we logged it.
     *
     * @param type - The type of delta (reason it occurred).
     * @param data - The data about why it changed, such as what data made the
     * delta occur.
     */
    add(type, data) {
        if (this.finalized) {
            return; // Gamelog is finalized, we can't add things.
        }
        const delta = {
            type,
            data,
            game: this.deltaManager.dump(),
        };
        this.gamelog.deltas.push(delta);
        this.events.logged.emit(delta);
    }
}
exports.GamelogScribe = GamelogScribe;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZWxvZy1zY3JpYmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9nYW1lL2dhbWVsb2cvZ2FtZWxvZy1zY3JpYmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxREFBZ0Q7QUFFaEQsZ0RBQW9EO0FBTXBELHVFQUF1RTtBQUN2RSxNQUFhLGFBQWE7SUFhdEI7Ozs7Ozs7O09BUUc7SUFDSCxZQUNJLElBQWMsRUFDZCxXQUFtQixFQUNuQixPQUFnQixFQUNoQixPQUFnQyxFQUNmLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBMUIvQywrREFBK0Q7UUFDL0MsV0FBTSxHQUFHLHdCQUFNLENBQUM7WUFDNUIsK0RBQStEO1lBQy9ELE1BQU0sRUFBRSxJQUFJLHVCQUFLLEVBQW9CO1NBQ3hDLENBQUMsQ0FBQztRQUtILHFFQUFxRTtRQUM3RCxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBa0J0QixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1gsY0FBYyxFQUFFLE9BQU87WUFDdkIsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ25CLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTztZQUN6QixXQUFXO1lBQ1gsU0FBUyxFQUFFLDRCQUFnQjtZQUMzQixNQUFNLEVBQUUsRUFBRTtZQUNWLEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsRUFBRTtZQUNYLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUMxQixDQUFDO1FBRUYsMENBQTBDO1FBQzFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLEdBQUcsQ0FBYyxPQUFPLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUU7WUFD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SUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyw2Q0FBNkM7U0FDeEQ7UUFFRCxNQUFNLEtBQUssR0FBRztZQUNWLElBQUk7WUFDSixJQUFJO1lBQ0osSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO1NBQ2pDLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBVSxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQVUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDSjtBQTNJRCxzQ0EySUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEZWx0YSwgSURpc2Nvbm5lY3REZWx0YSwgSUZpbmlzaGVkRGVsdGEsIElHYW1lbG9nLCBJT3JkZXJEZWx0YSxcbiAgICAgICAgIElPdmVyRGVsdGEsIElSYW5EZWx0YSwgSVN0YXJ0RGVsdGEgfSBmcm9tIFwiQGNhZHJlL3RzLXV0aWxzL2NhZHJlXCI7XG5pbXBvcnQgeyBFdmVudCwgZXZlbnRzIH0gZnJvbSBcInRzLXR5cGVkLWV2ZW50c1wiO1xuaW1wb3J0IHsgQmFzZUNsaWVudCB9IGZyb20gXCJ+L2NvcmUvY2xpZW50c1wiO1xuaW1wb3J0IHsgU0hBUkVEX0NPTlNUQU5UUyB9IGZyb20gXCJ+L2NvcmUvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBCYXNlR2FtZSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgRGVsdGFNYW5hZ2VyIH0gZnJvbSBcIn4vY29yZS9nYW1lL2RlbHRhLW1hbmFnZXJcIjtcbmltcG9ydCB7IFNlc3Npb24gfSBmcm9tIFwifi9jb3JlL3NlcnZlclwiO1xuaW1wb3J0IHsgSW1tdXRhYmxlIH0gZnJvbSBcIn4vdXRpbHNcIjtcblxuLyoqIE9ic2VydmVzIGEgZ2FtZSBhbmQgY3JlYXRlcyBhIGdhbWVsb2cgYnkgdHJhbnNjcmliaW5nIGl0cyBldmVudHMgKi9cbmV4cG9ydCBjbGFzcyBHYW1lbG9nU2NyaWJlIHtcbiAgICAvKiogVGhlIGV2ZW50cyB0aGUgZ2FtZSBsb2dnZXIgZW1pdHMgd2hlbiBpdCBsb2dzIHNvbWV0aGluZy4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRzID0gZXZlbnRzKHtcbiAgICAgICAgLyoqIEVtaXR0ZWQgZXZlcnkgdGltZSBhIG5ldyBkZWx0YSBpcyBsb2dnZWQgdG8gdGhlIGdhbWVsb2cuICovXG4gICAgICAgIGxvZ2dlZDogbmV3IEV2ZW50PEltbXV0YWJsZTxEZWx0YT4+KCksXG4gICAgfSk7XG5cbiAgICAvKiogVGhlIGdhbWVsb2cgd2UgYXJlIGJ1aWxkaW5nIHVwLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lbG9nOiBJR2FtZWxvZztcblxuICAgIC8qKiBJZiBvdXIgZ2FtZWxvZyBpcyBmaW5hbGl6ZWQgYW5kIHNob3VsZCBuZXZlciBiZSBjaGFuZ2VkIGFmdGVyLiAqL1xuICAgIHByaXZhdGUgZmluYWxpemVkID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGdhbWUgbG9nZ2VyIGZvciBhIHNwZWNpZmljIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ2FtZSAtIFRoZSBnYW1lIHdlIGFyZSBsb2dnaW5nLlxuICAgICAqIEBwYXJhbSBnYW1lVmVyc2lvbiAtIFRoZSB2ZXJzaW9uIG9mIHRoZSBnYW1lIHdlIGFyZSBsb2dnaW5nLlxuICAgICAqIEBwYXJhbSBzZXNzaW9uIC0gVGhlIHNlc3Npb24gdGhlIGdhbWUgaXMgaW4uXG4gICAgICogQHBhcmFtIGNsaWVudHMgLSBUaGUgY2xpZW50cyBpbiB0aGUgZ2FtZSBzZXNzaW9uLlxuICAgICAqIEBwYXJhbSBkZWx0YU1hbmFnZXIgLSBUaGUgZGVsdGEgbWFuYWdlciB0aGF0IGJ1aWxkcyBkZWx0YXMgZm9yIHVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBnYW1lOiBCYXNlR2FtZSxcbiAgICAgICAgZ2FtZVZlcnNpb246IHN0cmluZyxcbiAgICAgICAgc2Vzc2lvbjogU2Vzc2lvbixcbiAgICAgICAgY2xpZW50czogSW1tdXRhYmxlPEJhc2VDbGllbnRbXT4sXG4gICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZGVsdGFNYW5hZ2VyOiBEZWx0YU1hbmFnZXIsXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZ2FtZWxvZyA9IHtcbiAgICAgICAgICAgIGdhbWVsb2dWZXJzaW9uOiBcIjIuMi4wXCIsXG4gICAgICAgICAgICBnYW1lTmFtZTogZ2FtZS5uYW1lLFxuICAgICAgICAgICAgZ2FtZVNlc3Npb246IGdhbWUuc2Vzc2lvbixcbiAgICAgICAgICAgIGdhbWVWZXJzaW9uLFxuICAgICAgICAgICAgY29uc3RhbnRzOiBTSEFSRURfQ09OU1RBTlRTLFxuICAgICAgICAgICAgZGVsdGFzOiBbXSxcbiAgICAgICAgICAgIGVwb2NoOiAwLFxuICAgICAgICAgICAgbG9zZXJzOiBbXSxcbiAgICAgICAgICAgIHdpbm5lcnM6IFtdLFxuICAgICAgICAgICAgc2V0dGluZ3M6IGdhbWUuc2V0dGluZ3MsXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gdGhpcyBhc3N1bWVzIHRoZSBHYW1lTWFuYWdlciBnb2VzIGZpcnN0XG4gICAgICAgIHNlc3Npb24uZXZlbnRzLnN0YXJ0Lm9uKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkPElTdGFydERlbHRhPihcInN0YXJ0XCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZXNzaW9uLmV2ZW50cy5nYW1lT3Zlci5vbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZDxJT3ZlckRlbHRhPihcIm92ZXJcIik7XG4gICAgICAgICAgICB0aGlzLmZpbmFsaXplR2FtZWxvZyhjbGllbnRzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2Vzc2lvbi5ldmVudHMuYWlPcmRlcmVkLm9uKChvcmRlcmVkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZDxJT3JkZXJEZWx0YT4oXCJvcmRlclwiLCBvcmRlcmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2Vzc2lvbi5ldmVudHMuYWlGaW5pc2hlZC5vbigoZmluaXNoZWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWRkPElGaW5pc2hlZERlbHRhPihcImZpbmlzaGVkXCIsIGZpbmlzaGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2Vzc2lvbi5ldmVudHMuYWlSYW4ub24oKHJhbikgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGQ8SVJhbkRlbHRhPihcInJhblwiLCByYW4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiBjbGllbnRzKSB7XG4gICAgICAgICAgICBpZiAoIWNsaWVudC5wbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gV2UgZG9uJ3QgY2FyZSB3aGVuIG5vbi1wbGF5ZXIgY2xpZW50cyBkaXNjb25uZWN0LlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB7IGlkIH0gPSBjbGllbnQucGxheWVyO1xuICAgICAgICAgICAgY2xpZW50LmV2ZW50cy5kaXNjb25uZWN0ZWQub24oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQ8SURpc2Nvbm5lY3REZWx0YT4oXCJkaXNjb25uZWN0XCIsIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyOiB7IGlkIH0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IGNsaWVudC5oYXNUaW1lZE91dCgpLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZXMgdGhlIGdhbWUgbG9nIGZyb20gYWxsIHRoZSBldmVudHMgdGhhdCBoYXBwZW5lZCBpbiB0aGlzIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xpZW50cyAtIFRoZSBsaXN0IG9mIGNsaWVudHMgdGhhdCBwbGF5ZWQgdGhpcyBnYW1lLlxuICAgICAqIEByZXR1cm5zIFRoZSBnYW1lbG9nIHRoYXQgd2FzIGdlbmVyYXRlZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGZpbmFsaXplR2FtZWxvZyhjbGllbnRzOiBJbW11dGFibGU8QmFzZUNsaWVudFtdPik6IHZvaWQge1xuICAgICAgICAvLyB1cGRhdGUgdGhlIHdpbm5lcnMgYW5kIGxvc2VycyBvZiB0aGUgZ2FtZWxvZ1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsaWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNsaWVudCA9IGNsaWVudHNbaV07XG4gICAgICAgICAgICBjb25zdCB7IHBsYXllciB9ID0gY2xpZW50O1xuXG4gICAgICAgICAgICBpZiAoIXBsYXllcikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyB0aGV5IGFyZSBhIHNwZWN0YXRvciBhbmQgZG9uJ3QgbWF0dGVyIHRvIHRoZSBnYW1lbG9nLlxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB3aW5uZXJMb3NlckFycmF5ID0gcGxheWVyLndvblxuICAgICAgICAgICAgICAgID8gdGhpcy5nYW1lbG9nLndpbm5lcnNcbiAgICAgICAgICAgICAgICA6IHRoaXMuZ2FtZWxvZy5sb3NlcnM7XG5cbiAgICAgICAgICAgIHdpbm5lckxvc2VyQXJyYXkucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGksXG4gICAgICAgICAgICAgICAgaWQ6IHBsYXllci5pZCxcbiAgICAgICAgICAgICAgICBuYW1lOiBwbGF5ZXIubmFtZSxcbiAgICAgICAgICAgICAgICByZWFzb246IHBsYXllci53b25cbiAgICAgICAgICAgICAgICAgICAgICAgID8gcGxheWVyLnJlYXNvbldvblxuICAgICAgICAgICAgICAgICAgICAgICAgOiBwbGF5ZXIucmVhc29uTG9zdCxcbiAgICAgICAgICAgICAgICBkaXNjb25uZWN0ZWQ6IGNsaWVudC5oYXNEaXNjb25uZWN0ZWQoKSAmJiAhY2xpZW50Lmhhc1RpbWVkT3V0KCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZXkgbG9zdCBiZWNhdXNlIHRoZXkgZGlzY29ubmVjdGVkXG4gICAgICAgICAgICAgICAgdGltZWRPdXQ6IGNsaWVudC5oYXNUaW1lZE91dCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGVuIHRoZXkgbG9zdCBiZWNhdXNlIHRoZSB0aW1lZCBvdXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nYW1lbG9nLmVwb2NoID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBkZWx0YSBmb3Igc29tZSByZWFzb24sIGFuZCBlbWl0cyB0aGF0IHdlIGxvZ2dlZCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlIC0gVGhlIHR5cGUgb2YgZGVsdGEgKHJlYXNvbiBpdCBvY2N1cnJlZCkuXG4gICAgICogQHBhcmFtIGRhdGEgLSBUaGUgZGF0YSBhYm91dCB3aHkgaXQgY2hhbmdlZCwgc3VjaCBhcyB3aGF0IGRhdGEgbWFkZSB0aGVcbiAgICAgKiBkZWx0YSBvY2N1ci5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFkZDxUIGV4dGVuZHMgRGVsdGE+KHR5cGU6IFRbXCJ0eXBlXCJdLCBkYXRhPzogSW1tdXRhYmxlPFRbXCJkYXRhXCJdPik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gR2FtZWxvZyBpcyBmaW5hbGl6ZWQsIHdlIGNhbid0IGFkZCB0aGluZ3MuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkZWx0YSA9IHtcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgZ2FtZTogdGhpcy5kZWx0YU1hbmFnZXIuZHVtcCgpLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2FtZWxvZy5kZWx0YXMucHVzaChkZWx0YSBhcyBUKTtcbiAgICAgICAgdGhpcy5ldmVudHMubG9nZ2VkLmVtaXQoZGVsdGEgYXMgVCk7XG4gICAgfVxufVxuIl19