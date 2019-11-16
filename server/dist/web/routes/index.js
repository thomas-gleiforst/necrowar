"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const url_1 = require("url");
const server_1 = require("~/core/server");
const utils_1 = require("~/web/utils");
// because this is also the index, we need to export barrels
tslib_1.__exportStar(require("./archives"), exports);
tslib_1.__exportStar(require("./gamelog"), exports);
tslib_1.__exportStar(require("./gamelogs"), exports);
tslib_1.__exportStar(require("./setup"), exports);
tslib_1.__exportStar(require("./status"), exports);
const MAX_GAMELOGS_ON_INDEX = 10;
const games = [];
// if (app && Config.WEB_ENABLED) {
/**
 * Registers the index route for an Express app.
 *
 * @param app - The Express app instance to register the route on.
 */
function registerRouteIndex(app) {
    // then we need to show them the list of all games this server can play,
    // as well as the most recent game logs
    const lobby = server_1.Lobby.getInstance();
    lobby.gamesInitializedPromise.then(() => {
        for (const gameName of Array.from(lobby.gameNamespaces.keys()).sort()) {
            const namespace = lobby.gameNamespaces.get(gameName);
            if (!namespace) {
                throw new Error(`${namespace} is not a game namespace!`);
            }
            // Clone all the settings in the schema to a version with its
            // name included for the index page to show game settings by name.
            const settings = Object.keys(namespace.gameSettingsManager.schema)
                .sort()
                .map((name) => ({
                name,
                ...namespace.gameSettingsManager.schema[name],
            }));
            games.push({
                name: gameName,
                description: "",
                settings,
            });
        }
    });
    app.get("/", async (req, res) => {
        // get the current gamelogs
        const logs = lobby.gamelogManager.gamelogInfos;
        const hostUrl = req.headers.host
            ? new url_1.URL(`http://${req.headers.host}/`) // tslint:disable-line:no-http-string
            : undefined;
        const gamelogs = utils_1.formatGamelogInfos(logs
            .slice(-MAX_GAMELOGS_ON_INDEX) // select the last 10 gamelogs from all the logs to render on the index
            .reverse(), // reverse the order, so that the last is the first element (latest) in the array
        hostUrl && hostUrl.hostname);
        const activeRooms = lobby.getActiveRooms();
        res.render("index.hbs", {
            games,
            gamelogs,
            moreGamelogs: (gamelogs.length === MAX_GAMELOGS_ON_INDEX // If we're showing the max number of gamelogs now
                && logs.length > gamelogs.length),
            rooms: activeRooms.map((room) => ({
                id: room.id,
                gameName: room.gameNamespace.gameName,
                isRunning: room.isRunning(),
                clients: room.clients.map(({ name }) => name).join(", "),
                timeCreated: Number(room.timeCreated),
            })),
            hasActiveRooms: activeRooms.length > 0,
        });
    });
}
exports.registerRouteIndex = registerRouteIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw2QkFBMEI7QUFFMUIsMENBQXNDO0FBQ3RDLHVDQUFpRDtBQUVqRCw0REFBNEQ7QUFFNUQscURBQTJCO0FBQzNCLG9EQUEwQjtBQUMxQixxREFBMkI7QUFDM0Isa0RBQXdCO0FBQ3hCLG1EQUF5QjtBQVF6QixNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztBQUVqQyxNQUFNLEtBQUssR0FPTixFQUFFLENBQUM7QUFFUixtQ0FBbUM7QUFDbkM7Ozs7R0FJRztBQUNILFNBQWdCLGtCQUFrQixDQUFDLEdBQVk7SUFDM0Msd0VBQXdFO0lBQ3hFLHVDQUF1QztJQUV2QyxNQUFNLEtBQUssR0FBRyxjQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsS0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDcEMsS0FBSyxNQUFNLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNuRSxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxTQUFTLDJCQUEyQixDQUFDLENBQUM7YUFDNUQ7WUFFRCw2REFBNkQ7WUFDN0Qsa0VBQWtFO1lBQ2xFLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQztpQkFDN0QsSUFBSSxFQUFFO2lCQUNOLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDWixJQUFJO2dCQUNKLEdBQUksU0FBUyxDQUFDLG1CQUFtQixDQUFDLE1BQTJCLENBQUMsSUFBSSxDQUFDO2FBQ3RFLENBQUMsQ0FBQyxDQUFDO1lBRVIsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxXQUFXLEVBQUUsRUFBRTtnQkFDZixRQUFRO2FBQ1gsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDNUIsMkJBQTJCO1FBQzNCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSTtZQUM1QixDQUFDLENBQUMsSUFBSSxTQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMscUNBQXFDO1lBQzlFLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFaEIsTUFBTSxRQUFRLEdBQUcsMEJBQWtCLENBQUMsSUFBSTthQUNuQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLHVFQUF1RTthQUNyRyxPQUFPLEVBQUUsRUFBRSxpRkFBaUY7UUFDakcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3QixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFM0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7WUFDcEIsS0FBSztZQUNMLFFBQVE7WUFDUixZQUFZLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLHFCQUFxQixDQUFDLGtEQUFrRDttQkFDNUYsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzdDLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ1gsUUFBUSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUTtnQkFDckMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQzNCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ3hELFdBQVcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN4QyxDQUFDLENBQUM7WUFDSCxjQUFjLEVBQUUsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDO1NBQ3pDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTFERCxnREEwREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHByZXNzIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IFVSTCB9IGZyb20gXCJ1cmxcIjtcbmltcG9ydCB7IElTZXR0aW5nc1NjaGVtYSwgSVNldHRpbmdzU2NoZW1hcyB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgTG9iYnkgfSBmcm9tIFwifi9jb3JlL3NlcnZlclwiO1xuaW1wb3J0IHsgZm9ybWF0R2FtZWxvZ0luZm9zIH0gZnJvbSBcIn4vd2ViL3V0aWxzXCI7XG5cbi8vIGJlY2F1c2UgdGhpcyBpcyBhbHNvIHRoZSBpbmRleCwgd2UgbmVlZCB0byBleHBvcnQgYmFycmVsc1xuXG5leHBvcnQgKiBmcm9tIFwiLi9hcmNoaXZlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vZ2FtZWxvZ1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vZ2FtZWxvZ3NcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3NldHVwXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9zdGF0dXNcIjtcblxuLyoqIFNldHRpbmcgZm9yIHRoZSB2aWV3IHRvIGV4cGVjdC4gKi9cbnR5cGUgU2V0dGluZyA9IElTZXR0aW5nc1NjaGVtYSAmIHtcbiAgICAvKiogVGhlIG5hbWUgb2YgdGhlIHNldHRpbmcgKi9cbiAgICBuYW1lOiBzdHJpbmc7XG59O1xuXG5jb25zdCBNQVhfR0FNRUxPR1NfT05fSU5ERVggPSAxMDtcblxuY29uc3QgZ2FtZXM6IEFycmF5PHtcbiAgICAvKiogVGhlIHVuaXF1ZSBuYW1lIG9mIHRoZSBnYW1lLCB1c2VkIGFzIGFuIElELiAqL1xuICAgIG5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGh1bWFuIHJlYWRhYmxlIGRlc2NyaXB0aW9uIG9mIHRoZSBnYW1lLiBTaG91bGQgYmUgYnJpZWYuICovXG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICAvKiogQSBsaXN0IG9mIHNldHRpbmdzIGF2YWlsYWJsZSBpbiB0aGlzIGdhbWUuICovXG4gICAgc2V0dGluZ3M6IFNldHRpbmdbXTtcbn0+ID0gW107XG5cbi8vIGlmIChhcHAgJiYgQ29uZmlnLldFQl9FTkFCTEVEKSB7XG4vKipcbiAqIFJlZ2lzdGVycyB0aGUgaW5kZXggcm91dGUgZm9yIGFuIEV4cHJlc3MgYXBwLlxuICpcbiAqIEBwYXJhbSBhcHAgLSBUaGUgRXhwcmVzcyBhcHAgaW5zdGFuY2UgdG8gcmVnaXN0ZXIgdGhlIHJvdXRlIG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJSb3V0ZUluZGV4KGFwcDogRXhwcmVzcyk6IHZvaWQge1xuICAgIC8vIHRoZW4gd2UgbmVlZCB0byBzaG93IHRoZW0gdGhlIGxpc3Qgb2YgYWxsIGdhbWVzIHRoaXMgc2VydmVyIGNhbiBwbGF5LFxuICAgIC8vIGFzIHdlbGwgYXMgdGhlIG1vc3QgcmVjZW50IGdhbWUgbG9nc1xuXG4gICAgY29uc3QgbG9iYnkgPSBMb2JieS5nZXRJbnN0YW5jZSgpO1xuICAgIGxvYmJ5LmdhbWVzSW5pdGlhbGl6ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGdhbWVOYW1lIG9mIEFycmF5LmZyb20obG9iYnkuZ2FtZU5hbWVzcGFjZXMua2V5cygpKS5zb3J0KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWVzcGFjZSA9IGxvYmJ5LmdhbWVOYW1lc3BhY2VzLmdldChnYW1lTmFtZSk7XG4gICAgICAgICAgICBpZiAoIW5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lc3BhY2V9IGlzIG5vdCBhIGdhbWUgbmFtZXNwYWNlIWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDbG9uZSBhbGwgdGhlIHNldHRpbmdzIGluIHRoZSBzY2hlbWEgdG8gYSB2ZXJzaW9uIHdpdGggaXRzXG4gICAgICAgICAgICAvLyBuYW1lIGluY2x1ZGVkIGZvciB0aGUgaW5kZXggcGFnZSB0byBzaG93IGdhbWUgc2V0dGluZ3MgYnkgbmFtZS5cbiAgICAgICAgICAgIGNvbnN0IHNldHRpbmdzID0gT2JqZWN0LmtleXMobmFtZXNwYWNlLmdhbWVTZXR0aW5nc01hbmFnZXIuc2NoZW1hKVxuICAgICAgICAgICAgICAgIC5zb3J0KClcbiAgICAgICAgICAgICAgICAubWFwKChuYW1lKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgICAgICAuLi4obmFtZXNwYWNlLmdhbWVTZXR0aW5nc01hbmFnZXIuc2NoZW1hIGFzIElTZXR0aW5nc1NjaGVtYXMpW25hbWVdLFxuICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgZ2FtZXMucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZTogZ2FtZU5hbWUsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsIC8vIFRPRE86IGRvXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBwLmdldChcIi9cIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgY3VycmVudCBnYW1lbG9nc1xuICAgICAgICBjb25zdCBsb2dzID0gbG9iYnkuZ2FtZWxvZ01hbmFnZXIuZ2FtZWxvZ0luZm9zO1xuICAgICAgICBjb25zdCBob3N0VXJsID0gcmVxLmhlYWRlcnMuaG9zdFxuICAgICAgICAgICAgPyBuZXcgVVJMKGBodHRwOi8vJHtyZXEuaGVhZGVycy5ob3N0fS9gKSAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWh0dHAtc3RyaW5nXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICBjb25zdCBnYW1lbG9ncyA9IGZvcm1hdEdhbWVsb2dJbmZvcyhsb2dzXG4gICAgICAgICAgICAuc2xpY2UoLU1BWF9HQU1FTE9HU19PTl9JTkRFWCkgLy8gc2VsZWN0IHRoZSBsYXN0IDEwIGdhbWVsb2dzIGZyb20gYWxsIHRoZSBsb2dzIHRvIHJlbmRlciBvbiB0aGUgaW5kZXhcbiAgICAgICAgICAgIC5yZXZlcnNlKCksIC8vIHJldmVyc2UgdGhlIG9yZGVyLCBzbyB0aGF0IHRoZSBsYXN0IGlzIHRoZSBmaXJzdCBlbGVtZW50IChsYXRlc3QpIGluIHRoZSBhcnJheVxuICAgICAgICBob3N0VXJsICYmIGhvc3RVcmwuaG9zdG5hbWUpO1xuXG4gICAgICAgIGNvbnN0IGFjdGl2ZVJvb21zID0gbG9iYnkuZ2V0QWN0aXZlUm9vbXMoKTtcblxuICAgICAgICByZXMucmVuZGVyKFwiaW5kZXguaGJzXCIsIHtcbiAgICAgICAgICAgIGdhbWVzLFxuICAgICAgICAgICAgZ2FtZWxvZ3MsXG4gICAgICAgICAgICBtb3JlR2FtZWxvZ3M6IChnYW1lbG9ncy5sZW5ndGggPT09IE1BWF9HQU1FTE9HU19PTl9JTkRFWCAvLyBJZiB3ZSdyZSBzaG93aW5nIHRoZSBtYXggbnVtYmVyIG9mIGdhbWVsb2dzIG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgbG9ncy5sZW5ndGggPiBnYW1lbG9ncy5sZW5ndGgpLCAgICAgICAgICAgLy8gYW5kIHRoZXJlIGFyZSBzdGlsbCBtb3JlIGxvZ3MgcmVtYWluaW5nIHRvIHNob3dcbiAgICAgICAgICAgIHJvb21zOiBhY3RpdmVSb29tcy5tYXAoKHJvb20pID0+ICh7XG4gICAgICAgICAgICAgICAgaWQ6IHJvb20uaWQsXG4gICAgICAgICAgICAgICAgZ2FtZU5hbWU6IHJvb20uZ2FtZU5hbWVzcGFjZS5nYW1lTmFtZSxcbiAgICAgICAgICAgICAgICBpc1J1bm5pbmc6IHJvb20uaXNSdW5uaW5nKCksXG4gICAgICAgICAgICAgICAgY2xpZW50czogcm9vbS5jbGllbnRzLm1hcCgoeyBuYW1lIH0pID0+IG5hbWUpLmpvaW4oXCIsIFwiKSxcbiAgICAgICAgICAgICAgICB0aW1lQ3JlYXRlZDogTnVtYmVyKHJvb20udGltZUNyZWF0ZWQpLFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgaGFzQWN0aXZlUm9vbXM6IGFjdGl2ZVJvb21zLmxlbmd0aCA+IDAsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuIl19