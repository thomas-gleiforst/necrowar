"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cluster = require("cluster");
const path = require("path");
const ts_typed_events_1 = require("ts-typed-events");
const core_1 = require("~/core");
const lobby_room_1 = require("./lobby-room");
cluster.setupMaster({
    exec: path.join(__dirname, "worker"),
});
/**
 * A LobbyRoom that in intended to be ran in serial
 * (on one thread with the master lobby)
 */
class ThreadedRoom extends lobby_room_1.Room {
    /**
     * If this session has a game instance running on a worker thread.
     * @returns true if it is running, false otherwise
     */
    isRunning() {
        return Boolean(this.worker);
    }
    /** Starts the game session by spinning up a true thread for the session. */
    start() {
        super.start();
        this.threadSession();
    }
    /**
     * This happens when there are enough clients to start the game Instance.
     * We start the on a separate "worker" thread, for true multi-threading via
     * cluster
     */
    threadSession() {
        // we can only pass strings via environment variables so serialize them
        // here and the worker threads will de-serialize them once running
        const workerSessionData = {
            mainDebugPort: process._debugPort,
            sessionID: this.id,
            gameName: this.gameNamespace.gameName,
            gameSettings: this.gameSettingsManager.values,
        };
        this.worker = cluster.fork({
            ...core_1.Config,
            WORKER_GAME_SESSION_DATA: JSON.stringify(workerSessionData),
        });
        this.worker.on("online", () => {
            if (!this.worker) {
                throw new Error("Threaded room lost worker on online.");
            }
            for (const client of this.clients) {
                // we are about to send it, so we don't want this client object
                // listening to it, as we no longer care.
                client.stopListeningToSocket();
                const socket = client.popNetSocket();
                const clientClass = Object.getPrototypeOf(client);
                const messageFromMainThread = {
                    type: "client",
                    clientInfo: {
                        className: clientClass.constructor.name,
                        index: client.playerIndex,
                        name: client.name,
                        type: client.programmingLanguage,
                        spectating: client.isSpectating,
                        metaDeltas: client.sendMetaDeltas,
                    },
                };
                this.worker.send(messageFromMainThread, socket);
            }
            // Tell the worker thread we are done sending client + sockets to
            // them
            this.worker.send({ type: "done" });
            // And remove the clients from us, they are no longer ours to care
            // about; instead the worker thread will handle them from here-on.
            for (const client of this.clients) {
                ts_typed_events_1.events.offAll(client.events);
            }
        });
        let overData = {};
        // this message should only happen once, when the game is over
        this.worker.once("message", async (data) => {
            overData = data;
            this.cleanUp(data.gamelog);
        });
        this.worker.on("exit", () => {
            this.handleOver(overData.clientInfos);
        });
    }
    /**
     * Cleans up the room by terminating our worker thread.
     *
     * @param gamelog - The gamelog sent from the session.
     * @returns A promise that resolves once we've cleaned up.
     */
    async cleanUp(gamelog) {
        this.worker = undefined; // we are done with that worker thread
        await super.cleanUp(gamelog);
    }
}
exports.ThreadedRoom = ThreadedRoom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnktcm9vbS10aHJlYWRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3NlcnZlci9sb2JieS1yb29tLXRocmVhZGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQW1DO0FBQ25DLDZCQUE2QjtBQUM3QixxREFBeUM7QUFDekMsaUNBQWdDO0FBRWhDLDZDQUFvQztBQUdwQyxPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUM7Q0FDdkMsQ0FBQyxDQUFDO0FBRUg7OztHQUdHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsaUJBQUk7SUFJbEM7OztPQUdHO0lBQ0ksU0FBUztRQUNaLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsNEVBQTRFO0lBQ3JFLEtBQUs7UUFDUixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDTyxhQUFhO1FBQ25CLHVFQUF1RTtRQUN2RSxrRUFBa0U7UUFDbEUsTUFBTSxpQkFBaUIsR0FBMkI7WUFDOUMsYUFBYSxFQUFHLE9BSWYsQ0FBQyxVQUFVO1lBQ1osU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ2xCLFFBQVEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVE7WUFDckMsWUFBWSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNO1NBQ2hELENBQUM7UUFFRixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDdkIsR0FBRyxhQUFNO1lBQ1Qsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztTQUM5RCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQzthQUMzRDtZQUVELEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDL0IsK0RBQStEO2dCQUMvRCx5Q0FBeUM7Z0JBQ3pDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUMvQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBRXJDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFrQixDQUFDO2dCQUVuRSxNQUFNLHFCQUFxQixHQUEwQjtvQkFDakQsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsVUFBVSxFQUFFO3dCQUNSLFNBQVMsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUk7d0JBQ3ZDLEtBQUssRUFBRSxNQUFNLENBQUMsV0FBVzt3QkFDekIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO3dCQUNqQixJQUFJLEVBQUUsTUFBTSxDQUFDLG1CQUFtQjt3QkFDaEMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxZQUFZO3dCQUMvQixVQUFVLEVBQUUsTUFBTSxDQUFDLGNBQWM7cUJBQ3BDO2lCQUNKLENBQUM7Z0JBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDbkQ7WUFFRCxpRUFBaUU7WUFDakUsT0FBTztZQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7WUFFbEMsa0VBQWtFO1lBQ2xFLGtFQUFrRTtZQUNsRSxLQUFLLE1BQU0sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQy9CLHdCQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLEdBQXVCLEVBQUUsQ0FBQztRQUN0Qyw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUF3QixFQUFFLEVBQUU7WUFDM0QsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQTZCO1FBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsc0NBQXNDO1FBRS9ELE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxDQUFDO0NBQ0o7QUF6R0Qsb0NBeUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUdhbWVsb2cgfSBmcm9tIFwiQGNhZHJlL3RzLXV0aWxzL2NhZHJlXCI7XG5pbXBvcnQgKiBhcyBjbHVzdGVyIGZyb20gXCJjbHVzdGVyXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tIFwidHMtdHlwZWQtZXZlbnRzXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwifi9jb3JlXCI7XG5pbXBvcnQgeyBJbW11dGFibGUgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgUm9vbSB9IGZyb20gXCIuL2xvYmJ5LXJvb21cIjtcbmltcG9ydCB7IElXb3JrZXJHYW1lU2Vzc2lvbkRhdGEsIElXb3JrZXJPdmVyTWVzc2FnZSwgTWVzc2FnZUZyb21NYWluVGhyZWFkIH0gZnJvbSBcIi4vd29ya2VyXCI7XG5cbmNsdXN0ZXIuc2V0dXBNYXN0ZXIoe1xuICAgIGV4ZWM6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwid29ya2VyXCIpLFxufSk7XG5cbi8qKlxuICogQSBMb2JieVJvb20gdGhhdCBpbiBpbnRlbmRlZCB0byBiZSByYW4gaW4gc2VyaWFsXG4gKiAob24gb25lIHRocmVhZCB3aXRoIHRoZSBtYXN0ZXIgbG9iYnkpXG4gKi9cbmV4cG9ydCBjbGFzcyBUaHJlYWRlZFJvb20gZXh0ZW5kcyBSb29tIHtcbiAgICAvKiogVGhlIFdvcmtlciB0aHJlYWQgcnVubmluZyB0aGlzIHNlc3Npb24uICovXG4gICAgcHJpdmF0ZSB3b3JrZXI/OiBjbHVzdGVyLldvcmtlcjtcblxuICAgIC8qKlxuICAgICAqIElmIHRoaXMgc2Vzc2lvbiBoYXMgYSBnYW1lIGluc3RhbmNlIHJ1bm5pbmcgb24gYSB3b3JrZXIgdGhyZWFkLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgaXQgaXMgcnVubmluZywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGlzUnVubmluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy53b3JrZXIpO1xuICAgIH1cblxuICAgIC8qKiBTdGFydHMgdGhlIGdhbWUgc2Vzc2lvbiBieSBzcGlubmluZyB1cCBhIHRydWUgdGhyZWFkIGZvciB0aGUgc2Vzc2lvbi4gKi9cbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAgICAgdGhpcy50aHJlYWRTZXNzaW9uKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBoYXBwZW5zIHdoZW4gdGhlcmUgYXJlIGVub3VnaCBjbGllbnRzIHRvIHN0YXJ0IHRoZSBnYW1lIEluc3RhbmNlLlxuICAgICAqIFdlIHN0YXJ0IHRoZSBvbiBhIHNlcGFyYXRlIFwid29ya2VyXCIgdGhyZWFkLCBmb3IgdHJ1ZSBtdWx0aS10aHJlYWRpbmcgdmlhXG4gICAgICogY2x1c3RlclxuICAgICAqL1xuICAgIHByb3RlY3RlZCB0aHJlYWRTZXNzaW9uKCk6IHZvaWQge1xuICAgICAgICAvLyB3ZSBjYW4gb25seSBwYXNzIHN0cmluZ3MgdmlhIGVudmlyb25tZW50IHZhcmlhYmxlcyBzbyBzZXJpYWxpemUgdGhlbVxuICAgICAgICAvLyBoZXJlIGFuZCB0aGUgd29ya2VyIHRocmVhZHMgd2lsbCBkZS1zZXJpYWxpemUgdGhlbSBvbmNlIHJ1bm5pbmdcbiAgICAgICAgY29uc3Qgd29ya2VyU2Vzc2lvbkRhdGE6IElXb3JrZXJHYW1lU2Vzc2lvbkRhdGEgPSB7XG4gICAgICAgICAgICBtYWluRGVidWdQb3J0OiAocHJvY2VzcyBhcyBOb2RlSlMuUHJvY2VzcyAmIHtcbiAgICAgICAgICAgICAgICAvKiogc3BlY2lhbCBmbGFnIGZvciBOb2RlIHRvIGtub3cgd2hhdCBwb3J0IHRoZSBkZWJ1Z2dlciBjYW4gYmluZCB0by4gKi9cbiAgICAgICAgICAgICAgICBfZGVidWdQb3J0PzogbnVtYmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS5fZGVidWdQb3J0LFxuICAgICAgICAgICAgc2Vzc2lvbklEOiB0aGlzLmlkLFxuICAgICAgICAgICAgZ2FtZU5hbWU6IHRoaXMuZ2FtZU5hbWVzcGFjZS5nYW1lTmFtZSxcbiAgICAgICAgICAgIGdhbWVTZXR0aW5nczogdGhpcy5nYW1lU2V0dGluZ3NNYW5hZ2VyLnZhbHVlcyxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLndvcmtlciA9IGNsdXN0ZXIuZm9yayh7XG4gICAgICAgICAgICAuLi5Db25maWcsIC8vIHRoZSB3b3JrZXIgdGhyZWFkIHdpbGwgc2VlIHRoZXNlIGluIGl0cyBwcm9jZXNzLmVudlxuICAgICAgICAgICAgV09SS0VSX0dBTUVfU0VTU0lPTl9EQVRBOiBKU09OLnN0cmluZ2lmeSh3b3JrZXJTZXNzaW9uRGF0YSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMud29ya2VyLm9uKFwib25saW5lXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy53b3JrZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaHJlYWRlZCByb29tIGxvc3Qgd29ya2VyIG9uIG9ubGluZS5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIHRoaXMuY2xpZW50cykge1xuICAgICAgICAgICAgICAgIC8vIHdlIGFyZSBhYm91dCB0byBzZW5kIGl0LCBzbyB3ZSBkb24ndCB3YW50IHRoaXMgY2xpZW50IG9iamVjdFxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmluZyB0byBpdCwgYXMgd2Ugbm8gbG9uZ2VyIGNhcmUuXG4gICAgICAgICAgICAgICAgY2xpZW50LnN0b3BMaXN0ZW5pbmdUb1NvY2tldCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvY2tldCA9IGNsaWVudC5wb3BOZXRTb2NrZXQoKTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGNsaWVudENsYXNzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGNsaWVudCkgYXMgdHlwZW9mIGNsaWVudDtcblxuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2VGcm9tTWFpblRocmVhZDogTWVzc2FnZUZyb21NYWluVGhyZWFkID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNsaWVudFwiLFxuICAgICAgICAgICAgICAgICAgICBjbGllbnRJbmZvOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6IGNsaWVudENsYXNzLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleDogY2xpZW50LnBsYXllckluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY2xpZW50Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBjbGllbnQucHJvZ3JhbW1pbmdMYW5ndWFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwZWN0YXRpbmc6IGNsaWVudC5pc1NwZWN0YXRpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhRGVsdGFzOiBjbGllbnQuc2VuZE1ldGFEZWx0YXMsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIHRoaXMud29ya2VyLnNlbmQobWVzc2FnZUZyb21NYWluVGhyZWFkLCBzb2NrZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUZWxsIHRoZSB3b3JrZXIgdGhyZWFkIHdlIGFyZSBkb25lIHNlbmRpbmcgY2xpZW50ICsgc29ja2V0cyB0b1xuICAgICAgICAgICAgLy8gdGhlbVxuICAgICAgICAgICAgdGhpcy53b3JrZXIuc2VuZCh7IHR5cGU6IFwiZG9uZVwifSk7XG5cbiAgICAgICAgICAgIC8vIEFuZCByZW1vdmUgdGhlIGNsaWVudHMgZnJvbSB1cywgdGhleSBhcmUgbm8gbG9uZ2VyIG91cnMgdG8gY2FyZVxuICAgICAgICAgICAgLy8gYWJvdXQ7IGluc3RlYWQgdGhlIHdvcmtlciB0aHJlYWQgd2lsbCBoYW5kbGUgdGhlbSBmcm9tIGhlcmUtb24uXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcbiAgICAgICAgICAgICAgICBldmVudHMub2ZmQWxsKGNsaWVudC5ldmVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgb3ZlckRhdGE6IElXb3JrZXJPdmVyTWVzc2FnZSA9IHt9O1xuICAgICAgICAvLyB0aGlzIG1lc3NhZ2Ugc2hvdWxkIG9ubHkgaGFwcGVuIG9uY2UsIHdoZW4gdGhlIGdhbWUgaXMgb3ZlclxuICAgICAgICB0aGlzLndvcmtlci5vbmNlKFwibWVzc2FnZVwiLCBhc3luYyAoZGF0YTogSVdvcmtlck92ZXJNZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICBvdmVyRGF0YSA9IGRhdGE7XG4gICAgICAgICAgICB0aGlzLmNsZWFuVXAoZGF0YS5nYW1lbG9nKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy53b3JrZXIub24oXCJleGl0XCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlT3ZlcihvdmVyRGF0YS5jbGllbnRJbmZvcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsZWFucyB1cCB0aGUgcm9vbSBieSB0ZXJtaW5hdGluZyBvdXIgd29ya2VyIHRocmVhZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBnYW1lbG9nIC0gVGhlIGdhbWVsb2cgc2VudCBmcm9tIHRoZSBzZXNzaW9uLlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2Ugd2UndmUgY2xlYW5lZCB1cC5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgYXN5bmMgY2xlYW5VcChnYW1lbG9nPzogSW1tdXRhYmxlPElHYW1lbG9nPik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLndvcmtlciA9IHVuZGVmaW5lZDsgLy8gd2UgYXJlIGRvbmUgd2l0aCB0aGF0IHdvcmtlciB0aHJlYWRcblxuICAgICAgICBhd2FpdCBzdXBlci5jbGVhblVwKGdhbWVsb2cpO1xuICAgIH1cbn1cbiJdfQ==