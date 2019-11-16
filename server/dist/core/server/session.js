"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = require("delay");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const ts_typed_events_1 = require("ts-typed-events");
const config_1 = require("~/core/config");
const base_ai_manager_1 = require("~/core/game/base/base-ai-manager");
const base_game_sanitizer_1 = require("~/core/game/base/base-game-sanitizer");
const delta_manager_1 = require("~/core/game/delta-manager");
const gamelog_scribe_1 = require("~/core/game/gamelog/gamelog-scribe");
const gamelog_utils_1 = require("~/core/game/gamelog/gamelog-utils");
const logger_1 = require("~/core/logger");
const utils_1 = require("~/utils");
const TIMEOUT_PADDING = 30 * 1000; // 30 sec padding for internal computations
let profiler;
Promise.resolve().then(() => require("v8-profiler")).then((imported) => {
    profiler = imported;
})
    .catch((err) => {
    if (config_1.Config.RUN_PROFILER) {
        logger_1.logger.error("Error importing profiler with RUN_PROFILER enabled");
        logger_1.logger.error(err);
        process.exit(1);
    }
});
/**
 * Session: the server that handles of communications between a game and its
 * clients, on a separate thread than the lobby.
 */
class Session {
    /**
     * Initializes a new session with data to create and run the game.
     *
     * @param args - The initialization args required to hookup a game.
     */
    constructor(args) {
        /** The events this Session emits. */
        this.events = ts_typed_events_1.events({
            /** Emitted once everything is setup and the game should start */
            start: new ts_typed_events_1.Signal(),
            /**
             * Emitted once the game is over, however not before the session is
             * over and the gamelog is ready.
             */
            gameOver: new ts_typed_events_1.Signal(),
            /** Emitted once this session is over and we can be deleted. */
            ended: new ts_typed_events_1.Event(),
            // -- Events proxies through from AIs in our game -- \\
            aiOrdered: new ts_typed_events_1.Event(),
            aiRan: new ts_typed_events_1.Event(),
            aiFinished: new ts_typed_events_1.Event(),
        });
        /** The manager of deltas for the game, which the game logger will log. */
        this.deltaManager = new delta_manager_1.DeltaManager();
        // private updateDeltas(type: "over", data?: undefined): void;
        /**
         * When the game state changes the clients need to know, and we need to
         * check if that game ended when its state changed.
         * @param type - the type of delta that ocurred
         * @param [data] - any additional data about what caused the delta
         */
        this.sendDeltas = (delta) => {
            if (!utils_1.isObjectEmpty(delta.game)) {
                for (const client of this.clients) {
                    // TODO: different deltas by player for hidden object games
                    client.send(client.sendMetaDeltas
                        ? { event: "meta-delta", data: delta }
                        : { event: "delta", data: delta.game });
                }
            }
            if (this.gameManager.isGameOver()) {
                // We no longer need to send deltas because the game is over and
                // the last delta was just sent above.
                this.gamelogScribe.events.logged.off(this.sendDeltas);
            }
        };
        this.id = args.id;
        this.gameNamespace = args.gameNamespace;
        this.gameName = args.gameNamespace.gameName;
        this.clients = args.clients;
        // Now we have all our clients, so let's make the structures to play
        // the game with.
        const n = this.gameNamespace.GameManager.requiredNumberOfPlayers;
        // NOTE: the game only knows about clients playing, this session will
        // care about spectators sending them deltas a such.
        // Therefore, the game never needs to know of their existence.
        const nonSpectators = this.clients.
            filter((c) => !c.isSpectating);
        const playingClients = new Array(n);
        const noIndexClients = [];
        for (const client of nonSpectators) {
            const index = client.playerIndex;
            if (index === undefined) {
                noIndexClients.push(client);
            }
            else {
                playingClients[index] = client;
            }
        }
        // now we've filled in the clients that requested index, backfill those that did not
        for (let i = 0; i < n; i++) {
            const client = playingClients[i];
            if (client) {
                continue;
            }
            const clientNeedingIndex = noIndexClients.shift();
            if (!clientNeedingIndex) {
                break; // no more clients to add
            }
            playingClients[i] = clientNeedingIndex;
        }
        const gameSanitizer = new base_game_sanitizer_1.BaseGameSanitizer(args.gameNamespace);
        for (const client of playingClients) {
            client.aiManager = new base_ai_manager_1.BaseAIManager(client, gameSanitizer, args.gameNamespace);
            client.aiManager.events.ordered.on((ordered) => {
                this.events.aiOrdered.emit(ordered);
            });
            client.aiManager.events.finished.on((finished) => {
                this.events.aiFinished.emit(finished);
            });
            client.aiManager.events.ran.on((ran) => {
                this.events.aiRan.emit(ran);
            });
        }
        if (config_1.Config.RUN_PROFILER && profiler) {
            profiler.startProfiling();
        }
        if (config_1.Config.SESSION_TIMEOUTS_ENABLED) {
            this.startTimeout(args.gameSettingsManager);
        }
        const started = new ts_typed_events_1.Signal();
        this.gameManager = new args.gameNamespace.GameManager(args.gameNamespace, args.gameSettingsManager, playingClients, this.deltaManager.rootDeltaMergeable, this.id, started, () => this.handleGameOver());
        this.game = this.gameManager.game;
        this.gamelogScribe = new gamelog_scribe_1.GamelogScribe(this.game, args.gameNamespace.gameVersion, this, playingClients, this.deltaManager);
        this.gamelogScribe.events.logged.on(this.sendDeltas);
        logger_1.logger.info(`${this.gameName} - ${this.id} is starting.`);
        this.events.start.emit();
        for (const client of this.clients) {
            client.send({
                event: "start",
                data: { playerID: client.player && client.player.id },
            });
        }
        started.emit();
    }
    /**
     * When a fatal (unhandled) error occurs we need to exit and kill all
     * clients, and then end this session.
     *
     * @param err - the unhandled error
     * @returns once all the cleanup is done
     */
    async kill(err) {
        logger_1.logger.error(String(err));
        const fatal = typeof err === "string"
            ? new Error(err)
            : err;
        this.fatal = fatal;
        await Promise.all([...this.clients].map((client) => {
            return client.disconnect(`An unhandled fatal error occurred on the server:

${fatal.message}`);
        }));
        await this.end();
    }
    /**
     * Called when the game ends, so that this thread "ends"
     * @param gamelog The gamelog we made to send back to the master thread.
     */
    async end(gamelog) {
        if (this.timeout) {
            // then we are done, so we cannot timeout
            clearTimeout(this.timeout);
        }
        await this.stopProfiler();
        // TODO: find a way to make this delay un-needed.
        // As it stands without it some clients won't get the last event "over"
        // and sit and listen forever
        await delay_1.default(1000); // 1 second
        const message = `${this.gameName} - ${this.id} is over.`;
        if (gamelog) {
            logger_1.logger.info(message);
        }
        else {
            logger_1.logger.warn(`${message} But no gamelog!`);
        }
        this.events.ended.emit(this.fatal || (gamelog
            ? {
                gamelog,
                clientInfos: this.getClientInfos(),
            }
            : new Error("No gamelog!")));
    }
    /**
     * Stops the profiler and generates a profile if running.
     *
     * @returns A promise that resolves once the profile is written to disk,
     * or immediately if no profiler is running.
     */
    stopProfiler() {
        return new Promise((resolve, reject) => {
            if (!config_1.Config.RUN_PROFILER || !profiler) {
                resolve();
                return;
            }
            const profile = profiler.stopProfiling();
            profile.export((error, result) => {
                const dateTime = utils_1.momentString();
                fs_extra_1.writeFile(path_1.join(config_1.Config.LOGS_DIR, "profiles/", `${this.gameName}-${this.id}-${dateTime}.cpuprofile`), result, (err) => {
                    profile.delete();
                    resolve();
                });
            });
            resolve();
        });
    }
    /**
     * Starts a timeout to automatically kill this game session if the game
     * goes on too long. Useful for game servers hosted over long periods of
     * time so they clean up zombie sessions.
     *
     * @param gameSettingsManager The game settings for this session
     */
    startTimeout(gameSettingsManager) {
        const maxTimePerPlayer = gameSettingsManager.getMaxPlayerTime();
        const { requiredNumberOfPlayers } = this.gameNamespace.GameManager;
        const maxTime = maxTimePerPlayer * requiredNumberOfPlayers;
        // We now know the maximum number amount of time that all clients
        // can use accumulatively. However we need to account for server-side
        // processing time, so do a rough approximation and double it.
        // some padding for internal computations
        let timeoutTime = (maxTime * 2) * 1e-6 + TIMEOUT_PADDING; // convert ns to ms
        if (timeoutTime <= 0) {
            // It is invalid, so they probably set a custom timeout time of 0,
            // so we'll default to 30min as that is a reasonable amount of
            // debug time.
            timeoutTime = 1.8e6; // 30 minutes as ms
        }
        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            // if this triggers the game of this session timed out, so kill it
            this.kill(`Game session timed out after ${timeoutTime} ms.`);
        }, timeoutTime);
    }
    /**
     * Called when the game has ended (is over) and the clients need to know,
     * and the gamelog needs to be generated.
     */
    handleGameOver() {
        this.events.gameOver.emit();
        const gamelog = this.gamelogScribe.gamelog;
        const gamelogFilename = gamelog_utils_1.filenameFor(gamelog);
        const gamelogURL = gamelog_utils_1.getURL(gamelogFilename);
        const visualizerURL = gamelog_utils_1.getVisualizerURL(gamelogFilename);
        const message = visualizerURL &&
            `---
Your gamelog is viewable at:
${visualizerURL}
---`;
        for (const client of this.clients) {
            client.send({
                event: "over",
                data: { gamelogURL, visualizerURL, message },
            });
        }
        this.end(gamelog);
    }
    /**
     * Gets the current client infos for all out clients.
     *
     * @returns A new array of client infos for soft client information.
     */
    getClientInfos() {
        return this.clients.map((client, index) => ({
            name: client.name,
            spectating: client.isSpectating,
            ...(client.player
                ? {
                    index,
                    won: client.player.won,
                    lost: client.player.lost,
                    reason: client.player.reasonWon || client.player.reasonLost,
                    disconnected: !client.player.won && client.hasDisconnected() || false,
                    timedOut: !client.player.won && client.hasTimedOut() || false,
                }
                : null),
        }));
    }
}
exports.Session = Session;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3NlcnZlci9zZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaUNBQTBCO0FBQzFCLHVDQUFxQztBQUNyQywrQkFBNEI7QUFDNUIscURBQXdEO0FBR3hELDBDQUF1QztBQUN2QyxzRUFBaUU7QUFJakUsOEVBQXlFO0FBRXpFLDZEQUF5RDtBQUN6RCx1RUFBbUU7QUFDbkUscUVBQTBGO0FBQzFGLDBDQUF1QztBQUN2QyxtQ0FBaUU7QUFVakUsTUFBTSxlQUFlLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLDJDQUEyQztBQUU5RSxJQUFJLFFBQThCLENBQUM7QUFDbkMscUNBQU8sYUFBYSxHQUNmLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO0lBQ2YsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN4QixDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUNYLElBQUksZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNyQixlQUFNLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFDbkUsZUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFZLENBQUMsQ0FBQztRQUUzQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFUDs7O0dBR0c7QUFDSCxNQUFhLE9BQU87SUFxRGhCOzs7O09BSUc7SUFDSCxZQUFZLElBU1g7UUFsRUQscUNBQXFDO1FBQ3JCLFdBQU0sR0FBRyx3QkFBTSxDQUFDO1lBQzVCLGlFQUFpRTtZQUNqRSxLQUFLLEVBQUUsSUFBSSx3QkFBTSxFQUFFO1lBRW5COzs7ZUFHRztZQUNILFFBQVEsRUFBRSxJQUFJLHdCQUFNLEVBQUU7WUFFdEIsK0RBQStEO1lBQy9ELEtBQUssRUFBRSxJQUFJLHVCQUFLLEVBQXlCO1lBRXpDLHVEQUF1RDtZQUN2RCxTQUFTLEVBQUUsSUFBSSx1QkFBSyxFQUFrQztZQUN0RCxLQUFLLEVBQUUsSUFBSSx1QkFBSyxFQUFnQztZQUNoRCxVQUFVLEVBQUUsSUFBSSx1QkFBSyxFQUFxQztTQUM3RCxDQUFDLENBQUM7UUE0QkgsMEVBQTBFO1FBQ3pELGlCQUFZLEdBQUcsSUFBSSw0QkFBWSxFQUFFLENBQUM7UUE2UG5ELDhEQUE4RDtRQUU5RDs7Ozs7V0FLRztRQUNjLGVBQVUsR0FBRyxDQUFDLEtBQXVCLEVBQUUsRUFBRTtZQUN0RCxJQUFJLENBQUMscUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDL0IsMkRBQTJEO29CQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjO3dCQUM3QixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7d0JBQ3RDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FDekMsQ0FBQztpQkFDTDthQUNKO1lBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxFQUFFO2dCQUMvQixnRUFBZ0U7Z0JBQ2hFLHNDQUFzQztnQkFDdEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDekQ7UUFDTCxDQUFDLENBQUE7UUFqUUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztRQUN4QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUU1QixvRUFBb0U7UUFDcEUsaUJBQWlCO1FBRWpCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDO1FBRWpFLHFFQUFxRTtRQUNyRSxvREFBb0Q7UUFDcEQsOERBQThEO1FBQzlELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPO1lBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUF3QixDQUFDO1FBRTFELE1BQU0sY0FBYyxHQUFHLElBQUksS0FBSyxDQUFvQixDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLGNBQWMsR0FBRyxFQUEwQixDQUFDO1FBQ2xELEtBQUssTUFBTSxNQUFNLElBQUksYUFBYSxFQUFFO1lBQ2hDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDakMsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQy9CO2lCQUNJO2dCQUNELGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7YUFDbEM7U0FDSjtRQUVELG9GQUFvRjtRQUNwRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hCLE1BQU0sTUFBTSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLE1BQU0sRUFBRTtnQkFDUixTQUFTO2FBQ1o7WUFFRCxNQUFNLGtCQUFrQixHQUFHLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3JCLE1BQU0sQ0FBQyx5QkFBeUI7YUFDbkM7WUFDRCxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUM7U0FDMUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLHVDQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRSxLQUFLLE1BQU0sTUFBTSxJQUFJLGNBQWMsRUFBRTtZQUNqQyxNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksK0JBQWEsQ0FDaEMsTUFBTSxFQUNOLGFBQWEsRUFDYixJQUFJLENBQUMsYUFBYSxDQUNyQixDQUFDO1lBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLGVBQU0sQ0FBQyxZQUFZLElBQUksUUFBUSxFQUFFO1lBQ2pDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUM3QjtRQUVELElBQUksZUFBTSxDQUFDLHdCQUF3QixFQUFFO1lBQ2pDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDL0M7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLHdCQUFNLEVBQUUsQ0FBQztRQUU3QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQ2pELElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxtQkFBbUIsRUFDeEIsY0FBYyxFQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQ3BDLElBQUksQ0FBQyxFQUFFLEVBQ1AsT0FBTyxFQUNQLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FDOUIsQ0FBQztRQUNGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFFbEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDhCQUFhLENBQ2xDLElBQUksQ0FBQyxJQUFJLEVBQ1QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQzlCLElBQUksRUFDSixjQUFjLEVBQ2QsSUFBSSxDQUFDLFlBQVksQ0FDcEIsQ0FBQztRQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXJELGVBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxNQUFNLElBQUksQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXpCLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNSLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO2FBQ3hELENBQUMsQ0FBQztTQUNOO1FBRUQsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQW1CO1FBQ2pDLGVBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUTtZQUNqQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFVixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMvQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQ3BDOztFQUVFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FDSixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7O09BR0c7SUFDSyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQTRCO1FBQzFDLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNkLHlDQUF5QztZQUN6QyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO1FBRUQsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFMUIsaURBQWlEO1FBQ2pELHVFQUF1RTtRQUN2RSw2QkFBNkI7UUFDN0IsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxXQUFXO1FBRTlCLE1BQU0sT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsTUFBTSxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUM7UUFDekQsSUFBSSxPQUFPLEVBQUU7WUFDVCxlQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3hCO2FBQ0k7WUFDRCxlQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxrQkFBa0IsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPO1lBQ3pDLENBQUMsQ0FBQztnQkFDRSxPQUFPO2dCQUNQLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFO2FBQ3JDO1lBQ0QsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQzlCLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxZQUFZO1FBQ2hCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLGVBQU0sQ0FBQyxZQUFZLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDO2dCQUVWLE9BQU87YUFDVjtZQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN6QyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUM3QixNQUFNLFFBQVEsR0FBRyxvQkFBWSxFQUFFLENBQUM7Z0JBQ2hDLG9CQUFTLENBQ0wsV0FBSSxDQUNBLGVBQU0sQ0FBQyxRQUFRLEVBQ2YsV0FBVyxFQUNYLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLFFBQVEsYUFBYSxDQUN2RCxFQUNELE1BQU0sRUFDTixDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNKLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztvQkFDakIsT0FBTyxFQUFFLENBQUM7Z0JBQ2QsQ0FBQyxDQUNKLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssWUFBWSxDQUFDLG1CQUE0QztRQUM3RCxNQUFNLGdCQUFnQixHQUFHLG1CQUFtQixDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDaEUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFDbkUsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUM7UUFFM0QsaUVBQWlFO1FBQ2pFLHFFQUFxRTtRQUNyRSw4REFBOEQ7UUFDOUQseUNBQXlDO1FBQ3pDLElBQUksV0FBVyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxlQUFlLENBQUMsQ0FBQyxtQkFBbUI7UUFFN0UsSUFBSSxXQUFXLElBQUksQ0FBQyxFQUFFO1lBQ2xCLGtFQUFrRTtZQUNsRSw4REFBOEQ7WUFDOUQsY0FBYztZQUNkLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQyxtQkFBbUI7U0FDM0M7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7WUFDekIsa0VBQWtFO1lBQ2xFLElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLFdBQVcsTUFBTSxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUE0QkQ7OztPQUdHO0lBQ0ssY0FBYztRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUU1QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUUzQyxNQUFNLGVBQWUsR0FBRywyQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLE1BQU0sVUFBVSxHQUFHLHNCQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFM0MsTUFBTSxhQUFhLEdBQUcsZ0NBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDeEQsTUFBTSxPQUFPLEdBQUcsYUFBYTtZQUNyQzs7RUFFRSxhQUFhO0lBQ1gsQ0FBQztRQUVHLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNSLEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFO2FBQy9DLENBQUMsQ0FBQztTQUNOO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLGNBQWM7UUFDbEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDeEMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1lBQ2pCLFVBQVUsRUFBRSxNQUFNLENBQUMsWUFBWTtZQUUvQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU07Z0JBQ2IsQ0FBQyxDQUFDO29CQUNFLEtBQUs7b0JBQ0wsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRztvQkFDdEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSTtvQkFDeEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVTtvQkFDM0QsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRSxJQUFJLEtBQUs7b0JBQ3JFLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxLQUFLO2lCQUNoRTtnQkFDRCxDQUFDLENBQUMsSUFBSSxDQUNUO1NBQ0osQ0FBQyxDQUFDLENBQUM7SUFDUixDQUFDO0NBQ0o7QUEzWEQsMEJBMlhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVsdGEsIElGaW5pc2hlZERlbHRhLCBJR2FtZWxvZywgSU9yZGVyRGVsdGEsIElSYW5EZWx0YSB9IGZyb20gXCJAY2FkcmUvdHMtdXRpbHMvY2FkcmVcIjtcbmltcG9ydCBkZWxheSBmcm9tIFwiZGVsYXlcIjtcbmltcG9ydCB7IHdyaXRlRmlsZSB9IGZyb20gXCJmcy1leHRyYVwiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBFdmVudCwgZXZlbnRzLCBTaWduYWwgfSBmcm9tIFwidHMtdHlwZWQtZXZlbnRzXCI7XG5pbXBvcnQgeyBQcm9maWxlciB9IGZyb20gXCJ2OC1wcm9maWxlclwiOyAvLyBzaG91bGQgYmUgc2FmZSBhcyBpdCdzIGZyb20gQHR5cGVzXG5pbXBvcnQgeyBCYXNlQ2xpZW50LCBCYXNlUGxheWluZ0NsaWVudCwgSUNsaWVudEluZm8gfSBmcm9tIFwifi9jb3JlL2NsaWVudHNcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCJ+L2NvcmUvY29uZmlnXCI7XG5pbXBvcnQgeyBCYXNlQUlNYW5hZ2VyIH0gZnJvbSBcIn4vY29yZS9nYW1lL2Jhc2UvYmFzZS1haS1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBCYXNlR2FtZSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZUdhbWVNYW5hZ2VyIH0gZnJvbSBcIn4vY29yZS9nYW1lL2Jhc2UvYmFzZS1nYW1lLW1hbmFnZXJcIjtcbmltcG9ydCB7IElCYXNlR2FtZU5hbWVzcGFjZSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1uYW1lc3BhY2VcIjtcbmltcG9ydCB7IEJhc2VHYW1lU2FuaXRpemVyIH0gZnJvbSBcIn4vY29yZS9nYW1lL2Jhc2UvYmFzZS1nYW1lLXNhbml0aXplclwiO1xuaW1wb3J0IHsgQmFzZUdhbWVTZXR0aW5nc01hbmFnZXIgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IERlbHRhTWFuYWdlciB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9kZWx0YS1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBHYW1lbG9nU2NyaWJlIH0gZnJvbSBcIn4vY29yZS9nYW1lL2dhbWVsb2cvZ2FtZWxvZy1zY3JpYmVcIjtcbmltcG9ydCB7IGZpbGVuYW1lRm9yLCBnZXRVUkwsIGdldFZpc3VhbGl6ZXJVUkwgfSBmcm9tIFwifi9jb3JlL2dhbWUvZ2FtZWxvZy9nYW1lbG9nLXV0aWxzXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwifi9jb3JlL2xvZ2dlclwiO1xuaW1wb3J0IHsgSW1tdXRhYmxlLCBpc09iamVjdEVtcHR5LCBtb21lbnRTdHJpbmcgfSBmcm9tIFwifi91dGlsc1wiO1xuXG4vKiogRGF0YSBhYm91dCB3aGVuIGEgc2Vzc2lvbiBlbmRzICovXG5leHBvcnQgaW50ZXJmYWNlIElTZXNzaW9uRW5kZWQge1xuICAgIC8qKiBUaGUgY2xpZW50cyBhcyB0aGUgZ2FtZSBlbmRlZCAqL1xuICAgIGNsaWVudEluZm9zOiBJbW11dGFibGU8SUNsaWVudEluZm9bXT47XG4gICAgLyoqIFRoZSBnYW1lbG9nIHJlc3VsdGluZyBmcm9tIHRoZSBnYW1lICovXG4gICAgZ2FtZWxvZzogSW1tdXRhYmxlPElHYW1lbG9nPjtcbn1cblxuY29uc3QgVElNRU9VVF9QQURESU5HID0gMzAgKiAxMDAwOyAvLyAzMCBzZWMgcGFkZGluZyBmb3IgaW50ZXJuYWwgY29tcHV0YXRpb25zXG5cbmxldCBwcm9maWxlcjogUHJvZmlsZXIgfCB1bmRlZmluZWQ7XG5pbXBvcnQoXCJ2OC1wcm9maWxlclwiKVxuICAgIC50aGVuKChpbXBvcnRlZCkgPT4ge1xuICAgICAgICBwcm9maWxlciA9IGltcG9ydGVkO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgaWYgKENvbmZpZy5SVU5fUFJPRklMRVIpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIkVycm9yIGltcG9ydGluZyBwcm9maWxlciB3aXRoIFJVTl9QUk9GSUxFUiBlbmFibGVkXCIpO1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVyciBhcyBFcnJvcik7XG5cbiAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4vKipcbiAqIFNlc3Npb246IHRoZSBzZXJ2ZXIgdGhhdCBoYW5kbGVzIG9mIGNvbW11bmljYXRpb25zIGJldHdlZW4gYSBnYW1lIGFuZCBpdHNcbiAqIGNsaWVudHMsIG9uIGEgc2VwYXJhdGUgdGhyZWFkIHRoYW4gdGhlIGxvYmJ5LlxuICovXG5leHBvcnQgY2xhc3MgU2Vzc2lvbiB7XG4gICAgLyoqIFRoZSBldmVudHMgdGhpcyBTZXNzaW9uIGVtaXRzLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBldmVudHMgPSBldmVudHMoe1xuICAgICAgICAvKiogRW1pdHRlZCBvbmNlIGV2ZXJ5dGhpbmcgaXMgc2V0dXAgYW5kIHRoZSBnYW1lIHNob3VsZCBzdGFydCAqL1xuICAgICAgICBzdGFydDogbmV3IFNpZ25hbCgpLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbWl0dGVkIG9uY2UgdGhlIGdhbWUgaXMgb3ZlciwgaG93ZXZlciBub3QgYmVmb3JlIHRoZSBzZXNzaW9uIGlzXG4gICAgICAgICAqIG92ZXIgYW5kIHRoZSBnYW1lbG9nIGlzIHJlYWR5LlxuICAgICAgICAgKi9cbiAgICAgICAgZ2FtZU92ZXI6IG5ldyBTaWduYWwoKSxcblxuICAgICAgICAvKiogRW1pdHRlZCBvbmNlIHRoaXMgc2Vzc2lvbiBpcyBvdmVyIGFuZCB3ZSBjYW4gYmUgZGVsZXRlZC4gKi9cbiAgICAgICAgZW5kZWQ6IG5ldyBFdmVudDxFcnJvciB8IElTZXNzaW9uRW5kZWQ+KCksXG5cbiAgICAgICAgLy8gLS0gRXZlbnRzIHByb3hpZXMgdGhyb3VnaCBmcm9tIEFJcyBpbiBvdXIgZ2FtZSAtLSBcXFxcXG4gICAgICAgIGFpT3JkZXJlZDogbmV3IEV2ZW50PEltbXV0YWJsZTxJT3JkZXJEZWx0YVtcImRhdGFcIl0+PigpLFxuICAgICAgICBhaVJhbjogbmV3IEV2ZW50PEltbXV0YWJsZTxJUmFuRGVsdGFbXCJkYXRhXCJdPj4oKSxcbiAgICAgICAgYWlGaW5pc2hlZDogbmV3IEV2ZW50PEltbXV0YWJsZTxJRmluaXNoZWREZWx0YVtcImRhdGFcIl0+PigpLFxuICAgIH0pO1xuXG4gICAgLyoqIFRoZSBzZXNzaW9uIElELiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBpZDogc3RyaW5nO1xuXG4gICAgLyoqIFRoZSBuYW1lIG9mIHRoZSBnYW1lIHdlIGFyZSBwbGF5aW5nLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lTmFtZTogc3RyaW5nO1xuXG4gICAgLyoqIElmIGEgZmF0YWwgZXJyb3Igb2NjdXJyZWQsIGl0IGlzIHN0b3JlZCBoZXJlLiAqL1xuICAgIHByaXZhdGUgZmF0YWw/OiBFcnJvcjtcblxuICAgIC8qKiBBbGwgdGhlIGNsaWVudHMgaW4gdGhpcyBnYW1lLiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgY2xpZW50czogUmVhZG9ubHlBcnJheTxCYXNlQ2xpZW50PjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzY3JpYmUgdGhhdCBsb2dzIGV2ZW50cyAoZGVsdGFzKSBmcm9tIHRoZSBnYW1lLCB0byBtYWtlIHRoZSBnYW1lbG9nLlxuICAgICAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgZ2FtZWxvZ1NjcmliZTogR2FtZWxvZ1NjcmliZTtcblxuICAgIC8qKiBUaGUgbWFuYWdlciBmb3IgdGhlIGdhbWUuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lTWFuYWdlcjogQmFzZUdhbWVNYW5hZ2VyO1xuXG4gICAgLyoqIFRoZSBuYW1lc3BhY2Ugb2YgdGhlIGdhbWUgd2UgYXJlIHJ1bm5pbmcuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lTmFtZXNwYWNlOiBJbW11dGFibGU8SUJhc2VHYW1lTmFtZXNwYWNlPjtcblxuICAgIC8qKiBUaGUgZ2FtZSB3ZSBhcmUgcnVubmluZy4gVGhlIEdhbWVNYW5hZ2VyIGFjdHVhbGx5IGNyZWF0ZXMgaXQuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBnYW1lOiBCYXNlR2FtZTtcblxuICAgIC8qKiBUaGUgbWFuYWdlciBvZiBkZWx0YXMgZm9yIHRoZSBnYW1lLCB3aGljaCB0aGUgZ2FtZSBsb2dnZXIgd2lsbCBsb2cuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWx0YU1hbmFnZXIgPSBuZXcgRGVsdGFNYW5hZ2VyKCk7XG5cbiAgICAvKiogQSB0aW1lb3V0IHRvIHNlbGYgdGVybWluYXRlIGluIGNhc2UgYSBnYW1lIGdldHMgXCJzdHVja1wiLiAqL1xuICAgIHByaXZhdGUgdGltZW91dD86IE5vZGVKUy5UaW1lcjtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGEgbmV3IHNlc3Npb24gd2l0aCBkYXRhIHRvIGNyZWF0ZSBhbmQgcnVuIHRoZSBnYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3MgLSBUaGUgaW5pdGlhbGl6YXRpb24gYXJncyByZXF1aXJlZCB0byBob29rdXAgYSBnYW1lLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGFyZ3M6IHtcbiAgICAgICAgLyoqIFRoZSBpZCBvZiB0aGlzIHNlc3Npb24uIFBhc3NlZCBhcm91bmQgYXMgc2Vzc2lvbjogc3RyaW5nIG9mdGVuICovXG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgIC8qKiBUaGUgbmFtZXNwYWNlIG9mIHRoaXMgZ2FtZSB0byBjcmVhdGUgbmV3IGluc3RhbmNlcyBmcm9tICovXG4gICAgICAgIGdhbWVOYW1lc3BhY2U6IEltbXV0YWJsZTxJQmFzZUdhbWVOYW1lc3BhY2U+O1xuICAgICAgICAvKiogVGhlIGFscmVhZHkgYWN0aXZlIGdhbWUgbWFuYWdlciB0aGF0IGhvbGRzIEFJcy4gKi9cbiAgICAgICAgZ2FtZVNldHRpbmdzTWFuYWdlcjogQmFzZUdhbWVTZXR0aW5nc01hbmFnZXI7XG4gICAgICAgIC8qKiBUaGUgY2xpZW50cyBjb25uZWN0ZWQgdG8gdGhpcyBzZXNzaW9uLiBJbmNsdWRlcyBzcGVjdGF0b3JzIGFuZCBwbGF5ZXJzLiAqL1xuICAgICAgICBjbGllbnRzOiBSZWFkb25seUFycmF5PEJhc2VDbGllbnQ+O1xuICAgIH0pIHtcbiAgICAgICAgdGhpcy5pZCA9IGFyZ3MuaWQ7XG4gICAgICAgIHRoaXMuZ2FtZU5hbWVzcGFjZSA9IGFyZ3MuZ2FtZU5hbWVzcGFjZTtcbiAgICAgICAgdGhpcy5nYW1lTmFtZSA9IGFyZ3MuZ2FtZU5hbWVzcGFjZS5nYW1lTmFtZTtcbiAgICAgICAgdGhpcy5jbGllbnRzID0gYXJncy5jbGllbnRzO1xuXG4gICAgICAgIC8vIE5vdyB3ZSBoYXZlIGFsbCBvdXIgY2xpZW50cywgc28gbGV0J3MgbWFrZSB0aGUgc3RydWN0dXJlcyB0byBwbGF5XG4gICAgICAgIC8vIHRoZSBnYW1lIHdpdGguXG5cbiAgICAgICAgY29uc3QgbiA9IHRoaXMuZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlci5yZXF1aXJlZE51bWJlck9mUGxheWVycztcblxuICAgICAgICAvLyBOT1RFOiB0aGUgZ2FtZSBvbmx5IGtub3dzIGFib3V0IGNsaWVudHMgcGxheWluZywgdGhpcyBzZXNzaW9uIHdpbGxcbiAgICAgICAgLy8gY2FyZSBhYm91dCBzcGVjdGF0b3JzIHNlbmRpbmcgdGhlbSBkZWx0YXMgYSBzdWNoLlxuICAgICAgICAvLyBUaGVyZWZvcmUsIHRoZSBnYW1lIG5ldmVyIG5lZWRzIHRvIGtub3cgb2YgdGhlaXIgZXhpc3RlbmNlLlxuICAgICAgICBjb25zdCBub25TcGVjdGF0b3JzID0gdGhpcy5jbGllbnRzLlxuICAgICAgICAgICAgZmlsdGVyKChjKSA9PiAhYy5pc1NwZWN0YXRpbmcpIGFzIEJhc2VQbGF5aW5nQ2xpZW50W107XG5cbiAgICAgICAgY29uc3QgcGxheWluZ0NsaWVudHMgPSBuZXcgQXJyYXk8QmFzZVBsYXlpbmdDbGllbnQ+KG4pO1xuICAgICAgICBjb25zdCBub0luZGV4Q2xpZW50cyA9IFtdIGFzIHR5cGVvZiBub25TcGVjdGF0b3JzO1xuICAgICAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiBub25TcGVjdGF0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGNsaWVudC5wbGF5ZXJJbmRleDtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbm9JbmRleENsaWVudHMucHVzaChjbGllbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGxheWluZ0NsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IHdlJ3ZlIGZpbGxlZCBpbiB0aGUgY2xpZW50cyB0aGF0IHJlcXVlc3RlZCBpbmRleCwgYmFja2ZpbGwgdGhvc2UgdGhhdCBkaWQgbm90XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjbGllbnQgPSBwbGF5aW5nQ2xpZW50c1tpXTtcbiAgICAgICAgICAgIGlmIChjbGllbnQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY2xpZW50TmVlZGluZ0luZGV4ID0gbm9JbmRleENsaWVudHMuc2hpZnQoKTtcbiAgICAgICAgICAgIGlmICghY2xpZW50TmVlZGluZ0luZGV4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIG5vIG1vcmUgY2xpZW50cyB0byBhZGRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsYXlpbmdDbGllbnRzW2ldID0gY2xpZW50TmVlZGluZ0luZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2FtZVNhbml0aXplciA9IG5ldyBCYXNlR2FtZVNhbml0aXplcihhcmdzLmdhbWVOYW1lc3BhY2UpO1xuICAgICAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiBwbGF5aW5nQ2xpZW50cykge1xuICAgICAgICAgICAgY2xpZW50LmFpTWFuYWdlciA9IG5ldyBCYXNlQUlNYW5hZ2VyKFxuICAgICAgICAgICAgICAgIGNsaWVudCxcbiAgICAgICAgICAgICAgICBnYW1lU2FuaXRpemVyLFxuICAgICAgICAgICAgICAgIGFyZ3MuZ2FtZU5hbWVzcGFjZSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGNsaWVudC5haU1hbmFnZXIuZXZlbnRzLm9yZGVyZWQub24oKG9yZGVyZWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5haU9yZGVyZWQuZW1pdChvcmRlcmVkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjbGllbnQuYWlNYW5hZ2VyLmV2ZW50cy5maW5pc2hlZC5vbigoZmluaXNoZWQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cy5haUZpbmlzaGVkLmVtaXQoZmluaXNoZWQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNsaWVudC5haU1hbmFnZXIuZXZlbnRzLnJhbi5vbigocmFuKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHMuYWlSYW4uZW1pdChyYW4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ29uZmlnLlJVTl9QUk9GSUxFUiAmJiBwcm9maWxlcikge1xuICAgICAgICAgICAgcHJvZmlsZXIuc3RhcnRQcm9maWxpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDb25maWcuU0VTU0lPTl9USU1FT1VUU19FTkFCTEVEKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0VGltZW91dChhcmdzLmdhbWVTZXR0aW5nc01hbmFnZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhcnRlZCA9IG5ldyBTaWduYWwoKTtcblxuICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyID0gbmV3IGFyZ3MuZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlcihcbiAgICAgICAgICAgIGFyZ3MuZ2FtZU5hbWVzcGFjZSxcbiAgICAgICAgICAgIGFyZ3MuZ2FtZVNldHRpbmdzTWFuYWdlcixcbiAgICAgICAgICAgIHBsYXlpbmdDbGllbnRzLFxuICAgICAgICAgICAgdGhpcy5kZWx0YU1hbmFnZXIucm9vdERlbHRhTWVyZ2VhYmxlLFxuICAgICAgICAgICAgdGhpcy5pZCxcbiAgICAgICAgICAgIHN0YXJ0ZWQsXG4gICAgICAgICAgICAoKSA9PiB0aGlzLmhhbmRsZUdhbWVPdmVyKCksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZ2FtZSA9IHRoaXMuZ2FtZU1hbmFnZXIuZ2FtZTtcblxuICAgICAgICB0aGlzLmdhbWVsb2dTY3JpYmUgPSBuZXcgR2FtZWxvZ1NjcmliZShcbiAgICAgICAgICAgIHRoaXMuZ2FtZSxcbiAgICAgICAgICAgIGFyZ3MuZ2FtZU5hbWVzcGFjZS5nYW1lVmVyc2lvbixcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICBwbGF5aW5nQ2xpZW50cyxcbiAgICAgICAgICAgIHRoaXMuZGVsdGFNYW5hZ2VyLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmdhbWVsb2dTY3JpYmUuZXZlbnRzLmxvZ2dlZC5vbih0aGlzLnNlbmREZWx0YXMpO1xuXG4gICAgICAgIGxvZ2dlci5pbmZvKGAke3RoaXMuZ2FtZU5hbWV9IC0gJHt0aGlzLmlkfSBpcyBzdGFydGluZy5gKTtcbiAgICAgICAgdGhpcy5ldmVudHMuc3RhcnQuZW1pdCgpO1xuXG4gICAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIHRoaXMuY2xpZW50cykge1xuICAgICAgICAgICAgY2xpZW50LnNlbmQoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiBcInN0YXJ0XCIsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBwbGF5ZXJJRDogY2xpZW50LnBsYXllciAmJiBjbGllbnQucGxheWVyLmlkIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0ZWQuZW1pdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gYSBmYXRhbCAodW5oYW5kbGVkKSBlcnJvciBvY2N1cnMgd2UgbmVlZCB0byBleGl0IGFuZCBraWxsIGFsbFxuICAgICAqIGNsaWVudHMsIGFuZCB0aGVuIGVuZCB0aGlzIHNlc3Npb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXJyIC0gdGhlIHVuaGFuZGxlZCBlcnJvclxuICAgICAqIEByZXR1cm5zIG9uY2UgYWxsIHRoZSBjbGVhbnVwIGlzIGRvbmVcbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMga2lsbChlcnI6IEVycm9yIHwgc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGxvZ2dlci5lcnJvcihTdHJpbmcoZXJyKSk7XG4gICAgICAgIGNvbnN0IGZhdGFsID0gdHlwZW9mIGVyciA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgPyBuZXcgRXJyb3IoZXJyKVxuICAgICAgICAgICAgOiBlcnI7XG5cbiAgICAgICAgdGhpcy5mYXRhbCA9IGZhdGFsO1xuXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFsuLi50aGlzLmNsaWVudHNdLm1hcCgoY2xpZW50KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2xpZW50LmRpc2Nvbm5lY3QoXG5gQW4gdW5oYW5kbGVkIGZhdGFsIGVycm9yIG9jY3VycmVkIG9uIHRoZSBzZXJ2ZXI6XG5cbiR7ZmF0YWwubWVzc2FnZX1gLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMuZW5kKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gdGhlIGdhbWUgZW5kcywgc28gdGhhdCB0aGlzIHRocmVhZCBcImVuZHNcIlxuICAgICAqIEBwYXJhbSBnYW1lbG9nIFRoZSBnYW1lbG9nIHdlIG1hZGUgdG8gc2VuZCBiYWNrIHRvIHRoZSBtYXN0ZXIgdGhyZWFkLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgZW5kKGdhbWVsb2c/OiBSZWFkb25seTxJR2FtZWxvZz4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMudGltZW91dCkge1xuICAgICAgICAgICAgLy8gdGhlbiB3ZSBhcmUgZG9uZSwgc28gd2UgY2Fubm90IHRpbWVvdXRcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5zdG9wUHJvZmlsZXIoKTtcblxuICAgICAgICAvLyBUT0RPOiBmaW5kIGEgd2F5IHRvIG1ha2UgdGhpcyBkZWxheSB1bi1uZWVkZWQuXG4gICAgICAgIC8vIEFzIGl0IHN0YW5kcyB3aXRob3V0IGl0IHNvbWUgY2xpZW50cyB3b24ndCBnZXQgdGhlIGxhc3QgZXZlbnQgXCJvdmVyXCJcbiAgICAgICAgLy8gYW5kIHNpdCBhbmQgbGlzdGVuIGZvcmV2ZXJcbiAgICAgICAgYXdhaXQgZGVsYXkoMTAwMCk7IC8vIDEgc2Vjb25kXG5cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGAke3RoaXMuZ2FtZU5hbWV9IC0gJHt0aGlzLmlkfSBpcyBvdmVyLmA7XG4gICAgICAgIGlmIChnYW1lbG9nKSB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGAke21lc3NhZ2V9IEJ1dCBubyBnYW1lbG9nIWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHMuZW5kZWQuZW1pdCh0aGlzLmZhdGFsIHx8IChnYW1lbG9nXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBnYW1lbG9nLFxuICAgICAgICAgICAgICAgIGNsaWVudEluZm9zOiB0aGlzLmdldENsaWVudEluZm9zKCksXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IG5ldyBFcnJvcihcIk5vIGdhbWVsb2chXCIpKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgcHJvZmlsZXIgYW5kIGdlbmVyYXRlcyBhIHByb2ZpbGUgaWYgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgdGhlIHByb2ZpbGUgaXMgd3JpdHRlbiB0byBkaXNrLFxuICAgICAqIG9yIGltbWVkaWF0ZWx5IGlmIG5vIHByb2ZpbGVyIGlzIHJ1bm5pbmcuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdG9wUHJvZmlsZXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIUNvbmZpZy5SVU5fUFJPRklMRVIgfHwgIXByb2ZpbGVyKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwcm9maWxlID0gcHJvZmlsZXIuc3RvcFByb2ZpbGluZygpO1xuICAgICAgICAgICAgcHJvZmlsZS5leHBvcnQoKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRlVGltZSA9IG1vbWVudFN0cmluZygpO1xuICAgICAgICAgICAgICAgIHdyaXRlRmlsZShcbiAgICAgICAgICAgICAgICAgICAgam9pbihcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbmZpZy5MT0dTX0RJUixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicHJvZmlsZXMvXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHt0aGlzLmdhbWVOYW1lfS0ke3RoaXMuaWR9LSR7ZGF0ZVRpbWV9LmNwdXByb2ZpbGVgLFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGUuZGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyBhIHRpbWVvdXQgdG8gYXV0b21hdGljYWxseSBraWxsIHRoaXMgZ2FtZSBzZXNzaW9uIGlmIHRoZSBnYW1lXG4gICAgICogZ29lcyBvbiB0b28gbG9uZy4gVXNlZnVsIGZvciBnYW1lIHNlcnZlcnMgaG9zdGVkIG92ZXIgbG9uZyBwZXJpb2RzIG9mXG4gICAgICogdGltZSBzbyB0aGV5IGNsZWFuIHVwIHpvbWJpZSBzZXNzaW9ucy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBnYW1lU2V0dGluZ3NNYW5hZ2VyIFRoZSBnYW1lIHNldHRpbmdzIGZvciB0aGlzIHNlc3Npb25cbiAgICAgKi9cbiAgICBwcml2YXRlIHN0YXJ0VGltZW91dChnYW1lU2V0dGluZ3NNYW5hZ2VyOiBCYXNlR2FtZVNldHRpbmdzTWFuYWdlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBtYXhUaW1lUGVyUGxheWVyID0gZ2FtZVNldHRpbmdzTWFuYWdlci5nZXRNYXhQbGF5ZXJUaW1lKCk7XG4gICAgICAgIGNvbnN0IHsgcmVxdWlyZWROdW1iZXJPZlBsYXllcnMgfSA9IHRoaXMuZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlcjtcbiAgICAgICAgY29uc3QgbWF4VGltZSA9IG1heFRpbWVQZXJQbGF5ZXIgKiByZXF1aXJlZE51bWJlck9mUGxheWVycztcblxuICAgICAgICAvLyBXZSBub3cga25vdyB0aGUgbWF4aW11bSBudW1iZXIgYW1vdW50IG9mIHRpbWUgdGhhdCBhbGwgY2xpZW50c1xuICAgICAgICAvLyBjYW4gdXNlIGFjY3VtdWxhdGl2ZWx5LiBIb3dldmVyIHdlIG5lZWQgdG8gYWNjb3VudCBmb3Igc2VydmVyLXNpZGVcbiAgICAgICAgLy8gcHJvY2Vzc2luZyB0aW1lLCBzbyBkbyBhIHJvdWdoIGFwcHJveGltYXRpb24gYW5kIGRvdWJsZSBpdC5cbiAgICAgICAgLy8gc29tZSBwYWRkaW5nIGZvciBpbnRlcm5hbCBjb21wdXRhdGlvbnNcbiAgICAgICAgbGV0IHRpbWVvdXRUaW1lID0gKG1heFRpbWUgKiAyKSAqIDFlLTYgKyBUSU1FT1VUX1BBRERJTkc7IC8vIGNvbnZlcnQgbnMgdG8gbXNcblxuICAgICAgICBpZiAodGltZW91dFRpbWUgPD0gMCkge1xuICAgICAgICAgICAgLy8gSXQgaXMgaW52YWxpZCwgc28gdGhleSBwcm9iYWJseSBzZXQgYSBjdXN0b20gdGltZW91dCB0aW1lIG9mIDAsXG4gICAgICAgICAgICAvLyBzbyB3ZSdsbCBkZWZhdWx0IHRvIDMwbWluIGFzIHRoYXQgaXMgYSByZWFzb25hYmxlIGFtb3VudCBvZlxuICAgICAgICAgICAgLy8gZGVidWcgdGltZS5cbiAgICAgICAgICAgIHRpbWVvdXRUaW1lID0gMS44ZTY7IC8vIDMwIG1pbnV0ZXMgYXMgbXNcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgLy8gaWYgdGhpcyB0cmlnZ2VycyB0aGUgZ2FtZSBvZiB0aGlzIHNlc3Npb24gdGltZWQgb3V0LCBzbyBraWxsIGl0XG4gICAgICAgICAgICB0aGlzLmtpbGwoYEdhbWUgc2Vzc2lvbiB0aW1lZCBvdXQgYWZ0ZXIgJHt0aW1lb3V0VGltZX0gbXMuYCk7XG4gICAgICAgIH0sIHRpbWVvdXRUaW1lKTtcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlIHVwZGF0ZURlbHRhcyh0eXBlOiBcIm92ZXJcIiwgZGF0YT86IHVuZGVmaW5lZCk6IHZvaWQ7XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHRoZSBnYW1lIHN0YXRlIGNoYW5nZXMgdGhlIGNsaWVudHMgbmVlZCB0byBrbm93LCBhbmQgd2UgbmVlZCB0b1xuICAgICAqIGNoZWNrIGlmIHRoYXQgZ2FtZSBlbmRlZCB3aGVuIGl0cyBzdGF0ZSBjaGFuZ2VkLlxuICAgICAqIEBwYXJhbSB0eXBlIC0gdGhlIHR5cGUgb2YgZGVsdGEgdGhhdCBvY3VycmVkXG4gICAgICogQHBhcmFtIFtkYXRhXSAtIGFueSBhZGRpdGlvbmFsIGRhdGEgYWJvdXQgd2hhdCBjYXVzZWQgdGhlIGRlbHRhXG4gICAgICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBzZW5kRGVsdGFzID0gKGRlbHRhOiBJbW11dGFibGU8RGVsdGE+KSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3RFbXB0eShkZWx0YS5nYW1lKSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjbGllbnQgb2YgdGhpcy5jbGllbnRzKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogZGlmZmVyZW50IGRlbHRhcyBieSBwbGF5ZXIgZm9yIGhpZGRlbiBvYmplY3QgZ2FtZXNcbiAgICAgICAgICAgICAgICBjbGllbnQuc2VuZChjbGllbnQuc2VuZE1ldGFEZWx0YXNcbiAgICAgICAgICAgICAgICAgICAgPyB7IGV2ZW50OiBcIm1ldGEtZGVsdGFcIiwgZGF0YTogZGVsdGEgfVxuICAgICAgICAgICAgICAgICAgICA6IHsgZXZlbnQ6IFwiZGVsdGFcIiwgZGF0YTogZGVsdGEuZ2FtZSB9LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nYW1lTWFuYWdlci5pc0dhbWVPdmVyKCkpIHtcbiAgICAgICAgICAgIC8vIFdlIG5vIGxvbmdlciBuZWVkIHRvIHNlbmQgZGVsdGFzIGJlY2F1c2UgdGhlIGdhbWUgaXMgb3ZlciBhbmRcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGRlbHRhIHdhcyBqdXN0IHNlbnQgYWJvdmUuXG4gICAgICAgICAgICB0aGlzLmdhbWVsb2dTY3JpYmUuZXZlbnRzLmxvZ2dlZC5vZmYodGhpcy5zZW5kRGVsdGFzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBnYW1lIGhhcyBlbmRlZCAoaXMgb3ZlcikgYW5kIHRoZSBjbGllbnRzIG5lZWQgdG8ga25vdyxcbiAgICAgKiBhbmQgdGhlIGdhbWVsb2cgbmVlZHMgdG8gYmUgZ2VuZXJhdGVkLlxuICAgICAqL1xuICAgIHByaXZhdGUgaGFuZGxlR2FtZU92ZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXZlbnRzLmdhbWVPdmVyLmVtaXQoKTtcblxuICAgICAgICBjb25zdCBnYW1lbG9nID0gdGhpcy5nYW1lbG9nU2NyaWJlLmdhbWVsb2c7XG5cbiAgICAgICAgY29uc3QgZ2FtZWxvZ0ZpbGVuYW1lID0gZmlsZW5hbWVGb3IoZ2FtZWxvZyk7XG4gICAgICAgIGNvbnN0IGdhbWVsb2dVUkwgPSBnZXRVUkwoZ2FtZWxvZ0ZpbGVuYW1lKTtcblxuICAgICAgICBjb25zdCB2aXN1YWxpemVyVVJMID0gZ2V0VmlzdWFsaXplclVSTChnYW1lbG9nRmlsZW5hbWUpO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gdmlzdWFsaXplclVSTCAmJlxuYC0tLVxuWW91ciBnYW1lbG9nIGlzIHZpZXdhYmxlIGF0OlxuJHt2aXN1YWxpemVyVVJMfVxuLS0tYDtcblxuICAgICAgICBmb3IgKGNvbnN0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcbiAgICAgICAgICAgIGNsaWVudC5zZW5kKHtcbiAgICAgICAgICAgICAgICBldmVudDogXCJvdmVyXCIsXG4gICAgICAgICAgICAgICAgZGF0YTogeyBnYW1lbG9nVVJMLCB2aXN1YWxpemVyVVJMLCBtZXNzYWdlIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW5kKGdhbWVsb2cpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgY2xpZW50IGluZm9zIGZvciBhbGwgb3V0IGNsaWVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBhcnJheSBvZiBjbGllbnQgaW5mb3MgZm9yIHNvZnQgY2xpZW50IGluZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0Q2xpZW50SW5mb3MoKTogSUNsaWVudEluZm9bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsaWVudHMubWFwKChjbGllbnQsIGluZGV4KSA9PiAoe1xuICAgICAgICAgICAgbmFtZTogY2xpZW50Lm5hbWUsXG4gICAgICAgICAgICBzcGVjdGF0aW5nOiBjbGllbnQuaXNTcGVjdGF0aW5nLFxuXG4gICAgICAgICAgICAuLi4oY2xpZW50LnBsYXllclxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICAgICAgd29uOiBjbGllbnQucGxheWVyLndvbixcbiAgICAgICAgICAgICAgICAgICAgbG9zdDogY2xpZW50LnBsYXllci5sb3N0LFxuICAgICAgICAgICAgICAgICAgICByZWFzb246IGNsaWVudC5wbGF5ZXIucmVhc29uV29uIHx8IGNsaWVudC5wbGF5ZXIucmVhc29uTG9zdCxcbiAgICAgICAgICAgICAgICAgICAgZGlzY29ubmVjdGVkOiAhY2xpZW50LnBsYXllci53b24gJiYgY2xpZW50Lmhhc0Rpc2Nvbm5lY3RlZCgpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0aW1lZE91dDogIWNsaWVudC5wbGF5ZXIud29uICYmIGNsaWVudC5oYXNUaW1lZE91dCgpIHx8IGZhbHNlLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IG51bGxcbiAgICAgICAgICAgICksXG4gICAgICAgIH0pKTtcbiAgICB9XG59XG4iXX0=