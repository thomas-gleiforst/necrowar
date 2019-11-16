"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("~/core/server");
/**
 * Registers the gamelogs/ route on a given Express app.
 *
 * @param app - The express app to register the route on.
 */
function registerRouteGamelogs(app) {
    const lobby = server_1.Lobby.getInstance();
    /**
     * @api {get} /gamelogs Gamelogs
     * @apiName Get Gamelogs
     * @apiGroup API
     * @apiDescription Gets a list of gamelog ids (filenames) that are
     * available to get.
     *
     * @apiSuccessExample {json} Gamelogs found
     * [
     *   "2018.03.07.15.28.57.858-Anarchy-2.json.gz",
     *   "2018.04.25.14.35.18.795-Chess-1.json.gz",
     *   "2018.05.25.11.06.21.462-Spiders-Foo.json.gz"
     * ]
     */
    app.get("/gamelogs/", async (req, res) => {
        // cross origin safety
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.status(200);
        res.json(lobby.gamelogManager.gamelogInfos.map((info) => info.filename));
    });
}
exports.registerRouteGamelogs = registerRouteGamelogs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZWxvZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3JvdXRlcy9nYW1lbG9ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDBDQUFzQztBQUV0Qzs7OztHQUlHO0FBQ0gsU0FBZ0IscUJBQXFCLENBQUMsR0FBWTtJQUM5QyxNQUFNLEtBQUssR0FBRyxjQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFbEM7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckMsc0JBQXNCO1FBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBRS9ELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQXpCRCxzREF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHByZXNzIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IExvYmJ5IH0gZnJvbSBcIn4vY29yZS9zZXJ2ZXJcIjtcblxuLyoqXG4gKiBSZWdpc3RlcnMgdGhlIGdhbWVsb2dzLyByb3V0ZSBvbiBhIGdpdmVuIEV4cHJlc3MgYXBwLlxuICpcbiAqIEBwYXJhbSBhcHAgLSBUaGUgZXhwcmVzcyBhcHAgdG8gcmVnaXN0ZXIgdGhlIHJvdXRlIG9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJSb3V0ZUdhbWVsb2dzKGFwcDogRXhwcmVzcyk6IHZvaWQge1xuICAgIGNvbnN0IGxvYmJ5ID0gTG9iYnkuZ2V0SW5zdGFuY2UoKTtcblxuICAgIC8qKlxuICAgICAqIEBhcGkge2dldH0gL2dhbWVsb2dzIEdhbWVsb2dzXG4gICAgICogQGFwaU5hbWUgR2V0IEdhbWVsb2dzXG4gICAgICogQGFwaUdyb3VwIEFQSVxuICAgICAqIEBhcGlEZXNjcmlwdGlvbiBHZXRzIGEgbGlzdCBvZiBnYW1lbG9nIGlkcyAoZmlsZW5hbWVzKSB0aGF0IGFyZVxuICAgICAqIGF2YWlsYWJsZSB0byBnZXQuXG4gICAgICpcbiAgICAgKiBAYXBpU3VjY2Vzc0V4YW1wbGUge2pzb259IEdhbWVsb2dzIGZvdW5kXG4gICAgICogW1xuICAgICAqICAgXCIyMDE4LjAzLjA3LjE1LjI4LjU3Ljg1OC1BbmFyY2h5LTIuanNvbi5nelwiLFxuICAgICAqICAgXCIyMDE4LjA0LjI1LjE0LjM1LjE4Ljc5NS1DaGVzcy0xLmpzb24uZ3pcIixcbiAgICAgKiAgIFwiMjAxOC4wNS4yNS4xMS4wNi4yMS40NjItU3BpZGVycy1Gb28uanNvbi5nelwiXG4gICAgICogXVxuICAgICAqL1xuICAgIGFwcC5nZXQoXCIvZ2FtZWxvZ3MvXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICAvLyBjcm9zcyBvcmlnaW4gc2FmZXR5XG4gICAgICAgIHJlcy5oZWFkZXIoXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIiwgXCIqXCIpO1xuICAgICAgICByZXMuaGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiLCBcIlgtUmVxdWVzdGVkLVdpdGhcIik7XG5cbiAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICByZXMuanNvbihsb2JieS5nYW1lbG9nTWFuYWdlci5nYW1lbG9nSW5mb3MubWFwKChpbmZvKSA9PiBpbmZvLmZpbGVuYW1lKSk7XG4gICAgfSk7XG59XG4iXX0=