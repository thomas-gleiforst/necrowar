"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("~/core/config");
const server_1 = require("~/core/server");
const utils_1 = require("~/utils");
/**
 * Registers the setup/ route on an express app.
 *
 * @param app - The app to register the route on.
 */
function registerRouteSetup(app) {
    // Only expose this route for the arena.
    if (!config_1.Config.ARENA_MODE) {
        return;
    }
    const lobby = server_1.Lobby.getInstance();
    /**
     * @api {post} /setup/ Setup
     * @apiName Setup game session
     * @apiGroup API
     * @apiDescription Sets up (reserves) a game session for specific clients
     * to play. Intended to be used **only** by the Arena, as this is disabled
     * in normal play.
     * The POST body **must** be valid JSON.
     *
     * @apiParam {string} gameName The name of the game (or alias) that the
     * clients will be playing.
     * @apiParam {string} session The id of the session to setup. Must not
     * conflict with any other sessions, and clients will need to connect to
     * this id when connecting to the game server after this succeeds.
     * when a game is over, and in status when a game is over.
     * @apiParam {string} [password] An optional string to password protect
     * the room setting up. When set all clients connecting must provide this
     * same password to connect.
     * @apiParam {GameSettings} gameSettings A key/value object of valid game
     * settings for the game. The only **required** gameSettings are
     * `playerNames`.
     * @apiParam {string[]} gameSettings.playerNames An array of strings to
     * force the clients player names to be. Must be an array of the exact same
     * length as the number of players for the game. When clients connect
     * these names will override the name they claim to use. So connect them
     * in order of who they are.
     * (e.g. Player 0 should connect first to get the first name).
     * game-settings.ts file for more information.
     *
     * @apiSuccessExample {json} Success Response
     * {}
     *
     * @apiError (400 Error) error A human readable message explaining why the sent
     * parameters do not work to setup a game session. No game session will be
     * set up in this case.
     * @apiErrorExample {json} Error Response
     * {
     *     "error": "gameName 'undefined' is not a known game alias"
     * }
     */
    app.post("/setup", async (req, res) => {
        if (!utils_1.isObject(req.body)) {
            res.status(400);
            res.json({ error: "No body sent." });
            return;
        }
        const body = req.body;
        const errors = [];
        const gameAlias = String(body.gameName);
        const gameNamespace = lobby.getGameNamespace(gameAlias);
        let numPlayers = -1;
        if (!gameNamespace) {
            errors.push(`gameName '${gameAlias}' is not a known game alias`);
        }
        else {
            numPlayers = gameNamespace.GameManager.requiredNumberOfPlayers;
        }
        if (typeof body.session !== "string") {
            errors.push(`session id required`);
        }
        else if (body.session === "*" || body.session === "new") {
            errors.push(`session '${body.session}' is a reserved session name`);
        }
        const session = String(body.session);
        const gameSettings = body.gameSettings;
        if (!gameSettings || !utils_1.isObject(gameSettings)) {
            errors.push("gameSettings is required");
        }
        else if (!gameSettings.playerNames) {
            errors.push("gameSettings.playerNames is required");
        }
        else if (!Array.isArray(gameSettings.playerNames)) {
            errors.push("gameSettings.playerNames must be an array");
        }
        else if (gameNamespace && gameSettings.playerNames.length !== numPlayers) {
            errors.push(`gameSettings.playerNames must be an array of length ${numPlayers}`);
        }
        let password;
        if (body.password) {
            if (typeof body.password === "string") {
                password = body.password;
            }
            else {
                errors.push("password must be a string");
            }
        }
        if (errors.length === 0 && utils_1.isObject(gameSettings)) {
            const error = lobby.setup({
                gameAlias,
                gameSettings,
                password,
                session,
            });
            if (error) {
                errors.push(error);
            }
            else {
                // else it has now been setup successfully!
                res.status(200); // it was ok
                res.json({}); // empty object
                return; // to not respond with 400 below
            }
        }
        res.status(400);
        res.json({ error: errors.join("\n") });
    });
}
exports.registerRouteSetup = registerRouteSetup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9zZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDBDQUF1QztBQUN2QywwQ0FBc0M7QUFDdEMsbUNBQW1DO0FBRW5DOzs7O0dBSUc7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxHQUFZO0lBQzNDLHdDQUF3QztJQUN4QyxJQUFJLENBQUMsZUFBTSxDQUFDLFVBQVUsRUFBRTtRQUNwQixPQUFPO0tBQ1Y7SUFFRCxNQUFNLEtBQUssR0FBRyxjQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFbEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXVDRztJQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDbEMsSUFBSSxDQUFDLGdCQUFRLENBQUMsR0FBRyxDQUFDLElBQWUsQ0FBQyxFQUFFO1lBQ2hDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBRXJDLE9BQU87U0FDVjtRQUVELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQVNoQixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUcsRUFBYyxDQUFDO1FBRTlCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hELElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLFNBQVMsNkJBQTZCLENBQUMsQ0FBQztTQUNwRTthQUNJO1lBQ0QsVUFBVSxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUM7U0FDbEU7UUFFRCxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3RDO2FBQ0ksSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTtZQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sOEJBQThCLENBQUMsQ0FBQztTQUN2RTtRQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFckMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN2QyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7U0FDM0M7YUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRTtZQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7U0FDdkQ7YUFDSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQzVEO2FBQ0ksSUFBSSxhQUFhLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO1lBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsdURBQXVELFVBQVUsRUFBRSxDQUFDLENBQUM7U0FDcEY7UUFFRCxJQUFJLFFBQTRCLENBQUM7UUFDakMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO2dCQUNuQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzthQUM1QjtpQkFDSTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7YUFDNUM7U0FDSjtRQUVELElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksZ0JBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUMvQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN0QixTQUFTO2dCQUNULFlBQVk7Z0JBQ1osUUFBUTtnQkFDUixPQUFPO2FBQ1YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxLQUFLLEVBQUU7Z0JBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QjtpQkFDSTtnQkFDRCwyQ0FBMkM7Z0JBQzNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO2dCQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZTtnQkFFN0IsT0FBTyxDQUFDLGdDQUFnQzthQUMzQztTQUNKO1FBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQXRJRCxnREFzSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHByZXNzIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gXCJ+L2NvcmUvY29uZmlnXCI7XG5pbXBvcnQgeyBMb2JieSB9IGZyb20gXCJ+L2NvcmUvc2VydmVyXCI7XG5pbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5cbi8qKlxuICogUmVnaXN0ZXJzIHRoZSBzZXR1cC8gcm91dGUgb24gYW4gZXhwcmVzcyBhcHAuXG4gKlxuICogQHBhcmFtIGFwcCAtIFRoZSBhcHAgdG8gcmVnaXN0ZXIgdGhlIHJvdXRlIG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJSb3V0ZVNldHVwKGFwcDogRXhwcmVzcyk6IHZvaWQge1xuICAgIC8vIE9ubHkgZXhwb3NlIHRoaXMgcm91dGUgZm9yIHRoZSBhcmVuYS5cbiAgICBpZiAoIUNvbmZpZy5BUkVOQV9NT0RFKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsb2JieSA9IExvYmJ5LmdldEluc3RhbmNlKCk7XG5cbiAgICAvKipcbiAgICAgKiBAYXBpIHtwb3N0fSAvc2V0dXAvIFNldHVwXG4gICAgICogQGFwaU5hbWUgU2V0dXAgZ2FtZSBzZXNzaW9uXG4gICAgICogQGFwaUdyb3VwIEFQSVxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBTZXRzIHVwIChyZXNlcnZlcykgYSBnYW1lIHNlc3Npb24gZm9yIHNwZWNpZmljIGNsaWVudHNcbiAgICAgKiB0byBwbGF5LiBJbnRlbmRlZCB0byBiZSB1c2VkICoqb25seSoqIGJ5IHRoZSBBcmVuYSwgYXMgdGhpcyBpcyBkaXNhYmxlZFxuICAgICAqIGluIG5vcm1hbCBwbGF5LlxuICAgICAqIFRoZSBQT1NUIGJvZHkgKiptdXN0KiogYmUgdmFsaWQgSlNPTi5cbiAgICAgKlxuICAgICAqIEBhcGlQYXJhbSB7c3RyaW5nfSBnYW1lTmFtZSBUaGUgbmFtZSBvZiB0aGUgZ2FtZSAob3IgYWxpYXMpIHRoYXQgdGhlXG4gICAgICogY2xpZW50cyB3aWxsIGJlIHBsYXlpbmcuXG4gICAgICogQGFwaVBhcmFtIHtzdHJpbmd9IHNlc3Npb24gVGhlIGlkIG9mIHRoZSBzZXNzaW9uIHRvIHNldHVwLiBNdXN0IG5vdFxuICAgICAqIGNvbmZsaWN0IHdpdGggYW55IG90aGVyIHNlc3Npb25zLCBhbmQgY2xpZW50cyB3aWxsIG5lZWQgdG8gY29ubmVjdCB0b1xuICAgICAqIHRoaXMgaWQgd2hlbiBjb25uZWN0aW5nIHRvIHRoZSBnYW1lIHNlcnZlciBhZnRlciB0aGlzIHN1Y2NlZWRzLlxuICAgICAqIHdoZW4gYSBnYW1lIGlzIG92ZXIsIGFuZCBpbiBzdGF0dXMgd2hlbiBhIGdhbWUgaXMgb3Zlci5cbiAgICAgKiBAYXBpUGFyYW0ge3N0cmluZ30gW3Bhc3N3b3JkXSBBbiBvcHRpb25hbCBzdHJpbmcgdG8gcGFzc3dvcmQgcHJvdGVjdFxuICAgICAqIHRoZSByb29tIHNldHRpbmcgdXAuIFdoZW4gc2V0IGFsbCBjbGllbnRzIGNvbm5lY3RpbmcgbXVzdCBwcm92aWRlIHRoaXNcbiAgICAgKiBzYW1lIHBhc3N3b3JkIHRvIGNvbm5lY3QuXG4gICAgICogQGFwaVBhcmFtIHtHYW1lU2V0dGluZ3N9IGdhbWVTZXR0aW5ncyBBIGtleS92YWx1ZSBvYmplY3Qgb2YgdmFsaWQgZ2FtZVxuICAgICAqIHNldHRpbmdzIGZvciB0aGUgZ2FtZS4gVGhlIG9ubHkgKipyZXF1aXJlZCoqIGdhbWVTZXR0aW5ncyBhcmVcbiAgICAgKiBgcGxheWVyTmFtZXNgLlxuICAgICAqIEBhcGlQYXJhbSB7c3RyaW5nW119IGdhbWVTZXR0aW5ncy5wbGF5ZXJOYW1lcyBBbiBhcnJheSBvZiBzdHJpbmdzIHRvXG4gICAgICogZm9yY2UgdGhlIGNsaWVudHMgcGxheWVyIG5hbWVzIHRvIGJlLiBNdXN0IGJlIGFuIGFycmF5IG9mIHRoZSBleGFjdCBzYW1lXG4gICAgICogbGVuZ3RoIGFzIHRoZSBudW1iZXIgb2YgcGxheWVycyBmb3IgdGhlIGdhbWUuIFdoZW4gY2xpZW50cyBjb25uZWN0XG4gICAgICogdGhlc2UgbmFtZXMgd2lsbCBvdmVycmlkZSB0aGUgbmFtZSB0aGV5IGNsYWltIHRvIHVzZS4gU28gY29ubmVjdCB0aGVtXG4gICAgICogaW4gb3JkZXIgb2Ygd2hvIHRoZXkgYXJlLlxuICAgICAqIChlLmcuIFBsYXllciAwIHNob3VsZCBjb25uZWN0IGZpcnN0IHRvIGdldCB0aGUgZmlyc3QgbmFtZSkuXG4gICAgICogZ2FtZS1zZXR0aW5ncy50cyBmaWxlIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogQGFwaVN1Y2Nlc3NFeGFtcGxlIHtqc29ufSBTdWNjZXNzIFJlc3BvbnNlXG4gICAgICoge31cbiAgICAgKlxuICAgICAqIEBhcGlFcnJvciAoNDAwIEVycm9yKSBlcnJvciBBIGh1bWFuIHJlYWRhYmxlIG1lc3NhZ2UgZXhwbGFpbmluZyB3aHkgdGhlIHNlbnRcbiAgICAgKiBwYXJhbWV0ZXJzIGRvIG5vdCB3b3JrIHRvIHNldHVwIGEgZ2FtZSBzZXNzaW9uLiBObyBnYW1lIHNlc3Npb24gd2lsbCBiZVxuICAgICAqIHNldCB1cCBpbiB0aGlzIGNhc2UuXG4gICAgICogQGFwaUVycm9yRXhhbXBsZSB7anNvbn0gRXJyb3IgUmVzcG9uc2VcbiAgICAgKiB7XG4gICAgICogICAgIFwiZXJyb3JcIjogXCJnYW1lTmFtZSAndW5kZWZpbmVkJyBpcyBub3QgYSBrbm93biBnYW1lIGFsaWFzXCJcbiAgICAgKiB9XG4gICAgICovXG4gICAgYXBwLnBvc3QoXCIvc2V0dXBcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGlmICghaXNPYmplY3QocmVxLmJvZHkgYXMgdW5rbm93bikpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKTtcbiAgICAgICAgICAgIHJlcy5qc29uKHsgZXJyb3I6IFwiTm8gYm9keSBzZW50LlwiIH0pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBib2R5ID0gcmVxLmJvZHkgYXMge1xuICAgICAgICAgICAgLyoqIE5hbWUgb2YgdGhlIGdhbWUgdG8gc2V0dXAuIENhbiB0ZWNobmljYWxseSBiZSBsb29zZS4gKi9cbiAgICAgICAgICAgIGdhbWVOYW1lOiB1bmtub3duO1xuICAgICAgICAgICAgLyoqIFRoZSBrZXkvdmFsdWUgcGFpcnMgZm9yIHRoZSBzZXR0aW5ncyBhYm91dCB0aGUgZ2FtZS4gKi9cbiAgICAgICAgICAgIGdhbWVTZXR0aW5nczogdW5rbm93bjtcbiAgICAgICAgICAgIC8qKiBQYXNzd29yZCByZXF1aXJlZCB0byBqb2luIHRoaXMgcm9vbSBiZWluZyBzZXQgdXAuICovXG4gICAgICAgICAgICBwYXNzd29yZDogdW5rbm93bjtcbiAgICAgICAgICAgIC8qKiBUaGUgaWQgb2YgdGhlIHNlc3Npb24gZm9yIHRoaXMgcm9vbS4gKi9cbiAgICAgICAgICAgIHNlc3Npb246IHVua25vd247XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZXJyb3JzID0gW10gYXMgc3RyaW5nW107XG5cbiAgICAgICAgY29uc3QgZ2FtZUFsaWFzID0gU3RyaW5nKGJvZHkuZ2FtZU5hbWUpO1xuICAgICAgICBjb25zdCBnYW1lTmFtZXNwYWNlID0gbG9iYnkuZ2V0R2FtZU5hbWVzcGFjZShnYW1lQWxpYXMpO1xuICAgICAgICBsZXQgbnVtUGxheWVycyA9IC0xO1xuICAgICAgICBpZiAoIWdhbWVOYW1lc3BhY2UpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKGBnYW1lTmFtZSAnJHtnYW1lQWxpYXN9JyBpcyBub3QgYSBrbm93biBnYW1lIGFsaWFzYCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBudW1QbGF5ZXJzID0gZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlci5yZXF1aXJlZE51bWJlck9mUGxheWVycztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgYm9keS5zZXNzaW9uICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChgc2Vzc2lvbiBpZCByZXF1aXJlZGApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGJvZHkuc2Vzc2lvbiA9PT0gXCIqXCIgfHwgYm9keS5zZXNzaW9uID09PSBcIm5ld1wiKSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChgc2Vzc2lvbiAnJHtib2R5LnNlc3Npb259JyBpcyBhIHJlc2VydmVkIHNlc3Npb24gbmFtZWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSBTdHJpbmcoYm9keS5zZXNzaW9uKTtcblxuICAgICAgICBjb25zdCBnYW1lU2V0dGluZ3MgPSBib2R5LmdhbWVTZXR0aW5ncztcbiAgICAgICAgaWYgKCFnYW1lU2V0dGluZ3MgfHwgIWlzT2JqZWN0KGdhbWVTZXR0aW5ncykpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiZ2FtZVNldHRpbmdzIGlzIHJlcXVpcmVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFnYW1lU2V0dGluZ3MucGxheWVyTmFtZXMpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiZ2FtZVNldHRpbmdzLnBsYXllck5hbWVzIGlzIHJlcXVpcmVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFBcnJheS5pc0FycmF5KGdhbWVTZXR0aW5ncy5wbGF5ZXJOYW1lcykpIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiZ2FtZVNldHRpbmdzLnBsYXllck5hbWVzIG11c3QgYmUgYW4gYXJyYXlcIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZ2FtZU5hbWVzcGFjZSAmJiBnYW1lU2V0dGluZ3MucGxheWVyTmFtZXMubGVuZ3RoICE9PSBudW1QbGF5ZXJzKSB7XG4gICAgICAgICAgICBlcnJvcnMucHVzaChgZ2FtZVNldHRpbmdzLnBsYXllck5hbWVzIG11c3QgYmUgYW4gYXJyYXkgb2YgbGVuZ3RoICR7bnVtUGxheWVyc31gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwYXNzd29yZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoYm9keS5wYXNzd29yZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBib2R5LnBhc3N3b3JkID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcGFzc3dvcmQgPSBib2R5LnBhc3N3b3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJwYXNzd29yZCBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDAgJiYgaXNPYmplY3QoZ2FtZVNldHRpbmdzKSkge1xuICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBsb2JieS5zZXR1cCh7XG4gICAgICAgICAgICAgICAgZ2FtZUFsaWFzLFxuICAgICAgICAgICAgICAgIGdhbWVTZXR0aW5ncyxcbiAgICAgICAgICAgICAgICBwYXNzd29yZCxcbiAgICAgICAgICAgICAgICBzZXNzaW9uLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGVsc2UgaXQgaGFzIG5vdyBiZWVuIHNldHVwIHN1Y2Nlc3NmdWxseSFcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKDIwMCk7IC8vIGl0IHdhcyBva1xuICAgICAgICAgICAgICAgIHJlcy5qc29uKHt9KTsgLy8gZW1wdHkgb2JqZWN0XG5cbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIHRvIG5vdCByZXNwb25kIHdpdGggNDAwIGJlbG93XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXMuc3RhdHVzKDQwMCk7XG4gICAgICAgIHJlcy5qc29uKHsgZXJyb3I6IGVycm9ycy5qb2luKFwiXFxuXCIpIH0pO1xuICAgIH0pO1xufVxuIl19