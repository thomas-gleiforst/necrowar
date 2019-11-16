"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("~/core/server");
/**
 * Registers the gamelog/ route on a given Express app.
 *
 * @param app - The express app to register the route on.
 */
function registerRouteGamelog(app) {
    const lobby = server_1.Lobby.getInstance();
    /**
     * @api {get} /gamelog/:filename/ Gamelog
     * @apiName Get Gamelog
     * @apiGroup API
     * @apiDescription Simply given the id of a gamelog, responds with the
     * gamelog If found. See [Gamelog formatting documentation](
     * https://github.com/siggame/Cadre/blob/master/gamelog-format.md) for more
     * information.
     * @apiParam {string} filename The filename (with no extension) of the
     * gamelog, this is sent to clients when a game is over,
     * and in status when a game is over.
     * Optionally can also be the string "latest", to get the latest gamelog
     * logged, if there is any.
     *
     * @apiSuccessExample {json} Gamelog found
     * {
     *      "gameName": "Anarchy",
     *      "gameSession": "1",
     *      "constants": { "DELTA_REMOVED": "&RM","DELTA_LIST_LENGTH": "&LEN" },
     *      "deltas": [ "A bunch of delta objects, not this string" ],
     *      "epoch": 1525474117946,
     *      "winners":[
     *          {
     *              "index": 1,
     *              "id": "1",
     *              "name":
     *              "Anarchy Lua Player",
     *              "reason": "Max turns reached (200) - You had the most buildings not burned down.",
     *              "disconnected": false,
     *              "timedOut": false
     *          }
     *      ],
     *      "losers":[
     *          {
     *              "index": 0,
     *              "id": "0",
     *              "name": "Anarchy JavaScript Player",
     *              "reason": "Max turns reached (200) - You had more buildings burned down than another player.",
     *              "disconnected": false,
     *              "timedOut": false
     *          }
     *      ],
     *      "settings":{
     *          "key": "value pairs of all the game settings used to initialize the game."
     *      }
     * }
     *
     * @apiError (404 Error) {string} error If the gamelog was not found.
     * @apiErrorExample {json} Gamelog not found
     * {
     *     "error": "Gamelog not found."
     * }
     */
    app.get("/gamelog/:filename", async (req, res) => {
        const params = req.params;
        // cross origin safety
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        const filename = String(params.filename);
        const stream = await lobby.gamelogManager.getGamelogFileStream(filename);
        if (!stream) {
            res.status(404);
            res.json({ error: "Gamelog not found." });
            return;
        }
        // Else it was ok!
        res.status(200);
        // The file stream is the gamelog already compressed as a gzipped json.
        // We don't need to process it or anything like that, we can just setup
        // the HTTP headers and pipe the file contents straight to the body.
        res.header("Content-Encoding", "gzip");
        res.header("Content-Type", "application/json");
        stream.pipe(res);
    });
}
exports.registerRouteGamelog = registerRouteGamelog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy93ZWIvcm91dGVzL2dhbWVsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwQ0FBc0M7QUFFdEM7Ozs7R0FJRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLEdBQVk7SUFDN0MsTUFBTSxLQUFLLEdBQUcsY0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRWxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bb0RHO0lBQ0gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzdDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUdsQixDQUFDO1FBRUYsc0JBQXNCO1FBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXpFLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBRTFDLE9BQU87U0FDVjtRQUVELGtCQUFrQjtRQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLHVFQUF1RTtRQUN2RSx1RUFBdUU7UUFDdkUsb0VBQW9FO1FBQ3BFLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQXRGRCxvREFzRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHByZXNzIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IExvYmJ5IH0gZnJvbSBcIn4vY29yZS9zZXJ2ZXJcIjtcblxuLyoqXG4gKiBSZWdpc3RlcnMgdGhlIGdhbWVsb2cvIHJvdXRlIG9uIGEgZ2l2ZW4gRXhwcmVzcyBhcHAuXG4gKlxuICogQHBhcmFtIGFwcCAtIFRoZSBleHByZXNzIGFwcCB0byByZWdpc3RlciB0aGUgcm91dGUgb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclJvdXRlR2FtZWxvZyhhcHA6IEV4cHJlc3MpOiB2b2lkIHtcbiAgICBjb25zdCBsb2JieSA9IExvYmJ5LmdldEluc3RhbmNlKCk7XG5cbiAgICAvKipcbiAgICAgKiBAYXBpIHtnZXR9IC9nYW1lbG9nLzpmaWxlbmFtZS8gR2FtZWxvZ1xuICAgICAqIEBhcGlOYW1lIEdldCBHYW1lbG9nXG4gICAgICogQGFwaUdyb3VwIEFQSVxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBTaW1wbHkgZ2l2ZW4gdGhlIGlkIG9mIGEgZ2FtZWxvZywgcmVzcG9uZHMgd2l0aCB0aGVcbiAgICAgKiBnYW1lbG9nIElmIGZvdW5kLiBTZWUgW0dhbWVsb2cgZm9ybWF0dGluZyBkb2N1bWVudGF0aW9uXShcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vc2lnZ2FtZS9DYWRyZS9ibG9iL21hc3Rlci9nYW1lbG9nLWZvcm1hdC5tZCkgZm9yIG1vcmVcbiAgICAgKiBpbmZvcm1hdGlvbi5cbiAgICAgKiBAYXBpUGFyYW0ge3N0cmluZ30gZmlsZW5hbWUgVGhlIGZpbGVuYW1lICh3aXRoIG5vIGV4dGVuc2lvbikgb2YgdGhlXG4gICAgICogZ2FtZWxvZywgdGhpcyBpcyBzZW50IHRvIGNsaWVudHMgd2hlbiBhIGdhbWUgaXMgb3ZlcixcbiAgICAgKiBhbmQgaW4gc3RhdHVzIHdoZW4gYSBnYW1lIGlzIG92ZXIuXG4gICAgICogT3B0aW9uYWxseSBjYW4gYWxzbyBiZSB0aGUgc3RyaW5nIFwibGF0ZXN0XCIsIHRvIGdldCB0aGUgbGF0ZXN0IGdhbWVsb2dcbiAgICAgKiBsb2dnZWQsIGlmIHRoZXJlIGlzIGFueS5cbiAgICAgKlxuICAgICAqIEBhcGlTdWNjZXNzRXhhbXBsZSB7anNvbn0gR2FtZWxvZyBmb3VuZFxuICAgICAqIHtcbiAgICAgKiAgICAgIFwiZ2FtZU5hbWVcIjogXCJBbmFyY2h5XCIsXG4gICAgICogICAgICBcImdhbWVTZXNzaW9uXCI6IFwiMVwiLFxuICAgICAqICAgICAgXCJjb25zdGFudHNcIjogeyBcIkRFTFRBX1JFTU9WRURcIjogXCImUk1cIixcIkRFTFRBX0xJU1RfTEVOR1RIXCI6IFwiJkxFTlwiIH0sXG4gICAgICogICAgICBcImRlbHRhc1wiOiBbIFwiQSBidW5jaCBvZiBkZWx0YSBvYmplY3RzLCBub3QgdGhpcyBzdHJpbmdcIiBdLFxuICAgICAqICAgICAgXCJlcG9jaFwiOiAxNTI1NDc0MTE3OTQ2LFxuICAgICAqICAgICAgXCJ3aW5uZXJzXCI6W1xuICAgICAqICAgICAgICAgIHtcbiAgICAgKiAgICAgICAgICAgICAgXCJpbmRleFwiOiAxLFxuICAgICAqICAgICAgICAgICAgICBcImlkXCI6IFwiMVwiLFxuICAgICAqICAgICAgICAgICAgICBcIm5hbWVcIjpcbiAgICAgKiAgICAgICAgICAgICAgXCJBbmFyY2h5IEx1YSBQbGF5ZXJcIixcbiAgICAgKiAgICAgICAgICAgICAgXCJyZWFzb25cIjogXCJNYXggdHVybnMgcmVhY2hlZCAoMjAwKSAtIFlvdSBoYWQgdGhlIG1vc3QgYnVpbGRpbmdzIG5vdCBidXJuZWQgZG93bi5cIixcbiAgICAgKiAgICAgICAgICAgICAgXCJkaXNjb25uZWN0ZWRcIjogZmFsc2UsXG4gICAgICogICAgICAgICAgICAgIFwidGltZWRPdXRcIjogZmFsc2VcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICBdLFxuICAgICAqICAgICAgXCJsb3NlcnNcIjpbXG4gICAgICogICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICBcImluZGV4XCI6IDAsXG4gICAgICogICAgICAgICAgICAgIFwiaWRcIjogXCIwXCIsXG4gICAgICogICAgICAgICAgICAgIFwibmFtZVwiOiBcIkFuYXJjaHkgSmF2YVNjcmlwdCBQbGF5ZXJcIixcbiAgICAgKiAgICAgICAgICAgICAgXCJyZWFzb25cIjogXCJNYXggdHVybnMgcmVhY2hlZCAoMjAwKSAtIFlvdSBoYWQgbW9yZSBidWlsZGluZ3MgYnVybmVkIGRvd24gdGhhbiBhbm90aGVyIHBsYXllci5cIixcbiAgICAgKiAgICAgICAgICAgICAgXCJkaXNjb25uZWN0ZWRcIjogZmFsc2UsXG4gICAgICogICAgICAgICAgICAgIFwidGltZWRPdXRcIjogZmFsc2VcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICBdLFxuICAgICAqICAgICAgXCJzZXR0aW5nc1wiOntcbiAgICAgKiAgICAgICAgICBcImtleVwiOiBcInZhbHVlIHBhaXJzIG9mIGFsbCB0aGUgZ2FtZSBzZXR0aW5ncyB1c2VkIHRvIGluaXRpYWxpemUgdGhlIGdhbWUuXCJcbiAgICAgKiAgICAgIH1cbiAgICAgKiB9XG4gICAgICpcbiAgICAgKiBAYXBpRXJyb3IgKDQwNCBFcnJvcikge3N0cmluZ30gZXJyb3IgSWYgdGhlIGdhbWVsb2cgd2FzIG5vdCBmb3VuZC5cbiAgICAgKiBAYXBpRXJyb3JFeGFtcGxlIHtqc29ufSBHYW1lbG9nIG5vdCBmb3VuZFxuICAgICAqIHtcbiAgICAgKiAgICAgXCJlcnJvclwiOiBcIkdhbWVsb2cgbm90IGZvdW5kLlwiXG4gICAgICogfVxuICAgICAqL1xuICAgIGFwcC5nZXQoXCIvZ2FtZWxvZy86ZmlsZW5hbWVcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHJlcS5wYXJhbXMgYXMge1xuICAgICAgICAgICAgLyoqIFRoZSBmaWxlbmFtZSB0cCBhdHRlbXB0IHRvIGdldC4gKi9cbiAgICAgICAgICAgIGZpbGVuYW1lOiB1bmtub3duO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGNyb3NzIG9yaWdpbiBzYWZldHlcbiAgICAgICAgcmVzLmhlYWRlcihcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLCBcIipcIik7XG4gICAgICAgIHJlcy5oZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCIsIFwiWC1SZXF1ZXN0ZWQtV2l0aFwiKTtcblxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IFN0cmluZyhwYXJhbXMuZmlsZW5hbWUpO1xuICAgICAgICBjb25zdCBzdHJlYW0gPSBhd2FpdCBsb2JieS5nYW1lbG9nTWFuYWdlci5nZXRHYW1lbG9nRmlsZVN0cmVhbShmaWxlbmFtZSk7XG5cbiAgICAgICAgaWYgKCFzdHJlYW0pIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA0KTtcbiAgICAgICAgICAgIHJlcy5qc29uKHsgZXJyb3I6IFwiR2FtZWxvZyBub3QgZm91bmQuXCIgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVsc2UgaXQgd2FzIG9rIVxuICAgICAgICByZXMuc3RhdHVzKDIwMCk7XG5cbiAgICAgICAgLy8gVGhlIGZpbGUgc3RyZWFtIGlzIHRoZSBnYW1lbG9nIGFscmVhZHkgY29tcHJlc3NlZCBhcyBhIGd6aXBwZWQganNvbi5cbiAgICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBwcm9jZXNzIGl0IG9yIGFueXRoaW5nIGxpa2UgdGhhdCwgd2UgY2FuIGp1c3Qgc2V0dXBcbiAgICAgICAgLy8gdGhlIEhUVFAgaGVhZGVycyBhbmQgcGlwZSB0aGUgZmlsZSBjb250ZW50cyBzdHJhaWdodCB0byB0aGUgYm9keS5cbiAgICAgICAgcmVzLmhlYWRlcihcIkNvbnRlbnQtRW5jb2RpbmdcIiwgXCJnemlwXCIpO1xuICAgICAgICByZXMuaGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICAgICAgc3RyZWFtLnBpcGUocmVzKTtcbiAgICB9KTtcbn1cbiJdfQ==