"use strict";
// Exposed various uri schemes for other applications to query data from Cerveau
// Basically http responses that are not HTML, probably JSON
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("~/core/config");
const lobby_1 = require("~/core/server/lobby");
const utils_1 = require("~/utils");
/**
 * Gets the info for some session of some game
 *
 * @param gameAlias - name of the game
 * @param id - id of the session of that gameName
 * @returns information about the session for the api
 */
function getRoomInfo(gameAlias, id) {
    const lobby = lobby_1.Lobby.getInstance();
    const room = lobby.getRoom(gameAlias, id);
    if (room instanceof Error) {
        return { error: room.message };
    }
    // If we got there, then we know the game name is valid now so there
    // has to be a namespace.
    const gameName = lobby.getGameNameForAlias(gameAlias);
    if (!gameName) {
        return { error: `${gameAlias} is no known game` };
    }
    const gameNamespace = lobby.getGameNamespace(gameName);
    if (!gameNamespace) {
        return { error: `${gameAlias} is no known game` };
    }
    const { requiredNumberOfPlayers } = gameNamespace.GameManager;
    const info = {
        status: "empty",
        gameName,
        gameSession: id,
        requiredNumberOfPlayers,
        clients: [],
    };
    if (!room) {
        // No room exists, so it is empty AND open to anyone
        return {
            status: "empty",
            gameName,
            gameSession: id,
            requiredNumberOfPlayers,
            clients: [],
        };
    }
    // if the game session was found there should be some clients...
    info.clients = room.clients.map((client) => ({
        name: client.name,
        spectating: client.isSpectating,
    }));
    if (!room.isRunning() && !room.isOver()) {
        // it has clients, but it still open more more before it starts running
        info.status = "open";
        return info;
    }
    if (room.isRunning()) {
        // on a separate thread running the game
        info.status = "running";
        return info;
    }
    // otherwise that game session should be over
    if (room.isOver()) {
        info.status = "over";
        info.gamelogFilename = room.gamelogFilename || null;
        const clientInfos = room.getOverData();
        if (clientInfos) {
            info.clients = clientInfos;
        }
        return info;
    }
    return {
        error: "Requested game name and room are in an unexpected state of running while over.",
    };
}
/**
 * Registers the status route with some express app
 *
 * @param app - The Express app instance to register the route on
 */
function registerRouteStatus(app) {
    if (!config_1.Config.API_ENABLED) {
        return;
    }
    /**
     * @apiGroup API
     */
    /**
     * @api {get} /status/:gameName/:gameSession Status
     * @apiName Status
     * @apiGroup API
     * @apiDescription When given a gameName and session id, responds with json
     * data about what is going on in that game session, including what clients
     * are connected.
     * @apiParam {string} gameName The name of the game (or an alias),
     * must be a valid game on the server.
     * @apiParam {string} gameSession The session id of the game you want to
     * check the status of.
     *
     * @apiSuccess {string} gameName  The actual name of the game,
     * e.g. "chess" -> "Chess".
     * @apiSuccess {string} gameSession The id of the session in that game.
     * @apiSuccess {string} gamelogFilename The filename (id) of the gamelog.
     * To get the actual gamelog use the /gamelog/:id part of the API. null
     * means the gamelog does not exist yet because it is still being written
     * to the filesystem.
     * @apiSuccess {string} status What the status of this game session is:
     *  * "empty" if the game session is valid, but does not exist because no
     *    clients have ever connected to it.
     *  * "open" if the game session has had a least 1 client connect, but the
     *    game has not started.
     *  * "running" if all players have connected, and the game is actively in
     *    progress, but not over.
     *  * "over" if the game session has ran to completion and clients have
     *    disconnected.
     *  * "error" otherwise, such as if the gameName was invalid.
     * @apiSuccess {number} numberOfPlayers The number of clients that are
     * playing needed to connect to make the game session start running.
     * @apiSuccess {Client[]} clients An array of clients currently in that
     * game session.
     *
     * @apiSuccess (Client) {number} [index] If the player requested, or was
     * assigned, a player index. When a game session reaches "running" this
     * will be set.
     * @apiSuccess (Client) {string} name The name of the client.
     * @apiSuccess (Client) {boolean} spectating If the client is a spectator
     * (not a playing client). Spectators will not have indexes.
     * @apiSuccess (Client) {boolean} [disconnected] If the client disconnected
     * unexpectedly during the game.
     * @apiSuccess (Client) {boolean} [timedOut] If the client timedOut and we
     * were forced to disconnect them during the game.
     * @apiSuccess (Client) {boolean} [won] If the player won this will be set,
     * and be true.
     * @apiSuccess (Client) {boolean} [lost] If the player lost this will be
     * set, and be true.
     * @apiSuccess (Client) {string} [reason] If the player won or lost this
     * will be the human readable reason why they did so.
     *
     * @apiSuccessExample {json} Empty
     *  {
     *      status: "empty",
     *      gameName: "Chess",
     *      gameSession: "1",
     *      requiredNumberOfPlayers: 2
     *  }
     *
     * @apiSuccessExample {json} Open
     *  {
     *      status: "open",
     *      gameName: "Chess",
     *      gameSession: "1",
     *      requiredNumberOfPlayers: 2,
     *      clients: [
     *          {
     *              name: "Chess Lua Player",
     *              spectating: false
     *          }
     *      ]
     *   }
     *
     * @apiSuccessExample {json} Running
     *  {
     *      status: "running",
     *      gameName: "Chess",
     *      gameSession: "1",
     *      requiredNumberOfPlayers: 2,
     *      clients: [
     *          {
     *              name: "Chess Lua Player",
     *              spectating: false
     *          },
     *          {
     *              name: "Chess Python Player",
     *              spectating: false
     *          }
     *      ]
     *  }
     *
     * @apiSuccessExample {json} Over
     *  {
     *      status: "over",
     *      gameName: "Chess",
     *      gameSession: "1",
     *      gamelogFilename: "2016.03.01.11.54.30.868-Chess-1",
     *      requiredNumberOfPlayers: 2,
     *      clients: [
     *          {
     *              name: "Chess Lua Player",
     *              index: 0,
     *              spectating: false,
     *              won: true,
     *              lost: false,
     *              reason: "Checkmate!"
     *          },
     *          {
     *              name: "Chess Python Player",
     *              index: 1,
     *              spectating: false,
     *              won: false,
     *              lost: true,
     *              reason: "Checkmated."
     *          }
     *      ]
     *  }
     *
     * @apiSuccessExample {json} Almost Over
     *  In this example the game is over, but the gamelog is still being
     *  handled internally and is not available via the `gamelog/` API yet.
     *  {
     *      status: "over",
     *      gameName: "Chess",
     *      gameSession: "1",
     *      gamelogFilename: null,
     *      requiredNumberOfPlayers: 2,
     *      clients: [
     *          {
     *              name: "Chess Lua Player",
     *              spectating: false,
     *              won: true,
     *              lost: false,
     *              reason: "Checkmate!"
     *          },
     *          {
     *              name: "Chess Python Player",
     *              spectating: false,
     *              won: false,
     *              lost: true,
     *              reason: "Checkmated."
     *          }
     *      ]
     *  }
     *
     *
     *
     * @apiError {string} error A human readable string about what the error
     * was.
     * @apiError {string} [gameName] If the request was valid, but the gameName
     * was not a valid alias for a game, this is the gameName you sent us.
     *
     * @apiErrorExample {json} Unknown GameName
     *  HTTP/1.1 400 Bad Request
     *  {
     *      error: "Game name not valid",
     *      gameName: "unknownGameName"
     *  }
     */
    app.get("/status/:gameName/:gameSession", async (req, res) => {
        const params = req.params;
        const gameName = String(params.gameName);
        const gameSession = String(params.gameSession);
        const info = (!gameName || !gameSession)
            ? { error: "gameName and gameSession are required" }
            : getRoomInfo(gameName, gameSession);
        if (utils_1.objectHasProperty(info, "error")) {
            res.status(400);
        }
        res.json(info);
    });
}
exports.registerRouteStatus = registerRouteStatus;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3dlYi9yb3V0ZXMvc3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnRkFBZ0Y7QUFDaEYsNERBQTREOztBQUk1RCwwQ0FBdUM7QUFDdkMsK0NBQTRDO0FBQzVDLG1DQUE0QztBQXdCNUM7Ozs7OztHQU1HO0FBQ0gsU0FBUyxXQUFXLENBQUMsU0FBaUIsRUFBRSxFQUFVO0lBQzlDLE1BQU0sS0FBSyxHQUFHLGFBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUxQyxJQUFJLElBQUksWUFBWSxLQUFLLEVBQUU7UUFDdkIsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDbEM7SUFFRCxvRUFBb0U7SUFDcEUseUJBQXlCO0lBQ3pCLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV0RCxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ1gsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLFNBQVMsbUJBQW1CLEVBQUUsQ0FBQztLQUNyRDtJQUVELE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV2RCxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ2hCLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxTQUFTLG1CQUFtQixFQUFFLENBQUM7S0FDckQ7SUFFRCxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBRTlELE1BQU0sSUFBSSxHQUFjO1FBQ3BCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsUUFBUTtRQUNSLFdBQVcsRUFBRSxFQUFFO1FBQ2YsdUJBQXVCO1FBQ3ZCLE9BQU8sRUFBRSxF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ciBvdGhlciBhcHBsaWNhdGlvbnMgdG8gcXVlcnkgZGF0YSBmcm9tIENlcnZlYXVcbi8vIEJhc2ljYWxseSBodHRwIHJlc3BvbnNlcyB0aGF0IGFyZSBub3QgSFRNTCwgcHJvYmFibHkgSlNPTlxuXG5pbXBvcnQgeyBFeHByZXNzIH0gZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCB7IElDbGllbnRJbmZvIH0gZnJvbSBcIn4vY29yZS9jbGllbnRzL2NsaWVudC1pbmZvXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwifi9jb3JlL2NvbmZpZ1wiO1xuaW1wb3J0IHsgTG9iYnkgfSBmcm9tIFwifi9jb3JlL3NlcnZlci9sb2JieVwiO1xuaW1wb3J0IHsgb2JqZWN0SGFzUHJvcGVydHkgfSBmcm9tIFwifi91dGlsc1wiO1xuXG4vKiogSW5mb3JtYXRpb24gYWJvdXQgdGhlIHJvb20gdG8gYmUgcmV0dXJuZWQgdmlhIHRoZSBzdGF0dXMgQVBJLiAqL1xuaW50ZXJmYWNlIElSb29tSW5mbyB7XG4gICAgLyoqIFRoZSByb29tJ3MgY3VycmVudCBzdGF0dXMuICovXG4gICAgc3RhdHVzOiBcImVtcHR5XCIgfCBcIm9wZW5cIiB8IFwicnVubmluZ1wiIHwgXCJvdmVyXCI7XG4gICAgLyoqIFRoZSB1bmlxdWUgbmFtZSBvZiB0aGUgZ2FtZSBiZWluZyBwbGF5ZWQuICovXG4gICAgZ2FtZU5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGlkIG9mIHRoZSBnYW1lIHNlc3Npb24gKi9cbiAgICBnYW1lU2Vzc2lvbjogc3RyaW5nO1xuICAgIC8qKiBOdW1iZXIgb2YgcGxheWVycyByZXF1aXJlZCB0byBzdGFydCB0aGlzIHJvb20ncyBnYW1lICovXG4gICAgcmVxdWlyZWROdW1iZXJPZlBsYXllcnM6IG51bWJlcjtcbiAgICAvKiogZmlsZW5hbWUgb2YgdGhlIGdhbWVsb2cuIFdoZW4gdW5kZWZpbmVkIG5vdCBmaW5pc2hlZCwgd2hlbiBudWxsIHN0aWxsIHdyaXRpbmcgdG8gZmlsZXN5c3RlbS4gKi9cbiAgICBnYW1lbG9nRmlsZW5hbWU/OiBzdHJpbmcgfCBudWxsO1xuICAgIC8qKiBUaGUgYXJyYXkgb2YgY2xpZW50IGluZm8gaW4gdGhlIHJvb20uICovXG4gICAgY2xpZW50czogSUNsaWVudEluZm9bXTtcbn1cblxuLyoqIEluZm9ybWF0aW9uIGFib3V0IGFuIGVycm9yIGdldHRpbmcgcm9vbSBpbmZvLiAqL1xuaW50ZXJmYWNlIElFcnJvckluZm8ge1xuICAgIC8qKiBIdW1hbiByZWFkYWJsZSBlcnJvciBtZXNzYWdlICovXG4gICAgZXJyb3I6IHN0cmluZztcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBpbmZvIGZvciBzb21lIHNlc3Npb24gb2Ygc29tZSBnYW1lXG4gKlxuICogQHBhcmFtIGdhbWVBbGlhcyAtIG5hbWUgb2YgdGhlIGdhbWVcbiAqIEBwYXJhbSBpZCAtIGlkIG9mIHRoZSBzZXNzaW9uIG9mIHRoYXQgZ2FtZU5hbWVcbiAqIEByZXR1cm5zIGluZm9ybWF0aW9uIGFib3V0IHRoZSBzZXNzaW9uIGZvciB0aGUgYXBpXG4gKi9cbmZ1bmN0aW9uIGdldFJvb21JbmZvKGdhbWVBbGlhczogc3RyaW5nLCBpZDogc3RyaW5nKTogSUVycm9ySW5mbyB8IElSb29tSW5mbyB7XG4gICAgY29uc3QgbG9iYnkgPSBMb2JieS5nZXRJbnN0YW5jZSgpO1xuICAgIGNvbnN0IHJvb20gPSBsb2JieS5nZXRSb29tKGdhbWVBbGlhcywgaWQpO1xuXG4gICAgaWYgKHJvb20gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICByZXR1cm4geyBlcnJvcjogcm9vbS5tZXNzYWdlIH07XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZ290IHRoZXJlLCB0aGVuIHdlIGtub3cgdGhlIGdhbWUgbmFtZSBpcyB2YWxpZCBub3cgc28gdGhlcmVcbiAgICAvLyBoYXMgdG8gYmUgYSBuYW1lc3BhY2UuXG4gICAgY29uc3QgZ2FtZU5hbWUgPSBsb2JieS5nZXRHYW1lTmFtZUZvckFsaWFzKGdhbWVBbGlhcyk7XG5cbiAgICBpZiAoIWdhbWVOYW1lKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBgJHtnYW1lQWxpYXN9IGlzIG5vIGtub3duIGdhbWVgIH07XG4gICAgfVxuXG4gICAgY29uc3QgZ2FtZU5hbWVzcGFjZSA9IGxvYmJ5LmdldEdhbWVOYW1lc3BhY2UoZ2FtZU5hbWUpO1xuXG4gICAgaWYgKCFnYW1lTmFtZXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7IGVycm9yOiBgJHtnYW1lQWxpYXN9IGlzIG5vIGtub3duIGdhbWVgIH07XG4gICAgfVxuXG4gICAgY29uc3QgeyByZXF1aXJlZE51bWJlck9mUGxheWVycyB9ID0gZ2FtZU5hbWVzcGFjZS5HYW1lTWFuYWdlcjtcblxuICAgIGNvbnN0IGluZm86IElSb29tSW5mbyA9IHtcbiAgICAgICAgc3RhdHVzOiBcImVtcHR5XCIsXG4gICAgICAgIGdhbWVOYW1lLFxuICAgICAgICBnYW1lU2Vzc2lvbjogaWQsXG4gICAgICAgIHJlcXVpcmVkTnVtYmVyT2ZQbGF5ZXJzLFxuICAgICAgICBjbGllbnRzOiBbXSxcbiAgICB9O1xuXG4gICAgaWYgKCFyb29tKSB7XG4gICAgICAgIC8vIE5vIHJvb20gZXhpc3RzLCBzbyBpdCBpcyBlbXB0eSBBTkQgb3BlbiB0byBhbnlvbmVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogXCJlbXB0eVwiLFxuICAgICAgICAgICAgZ2FtZU5hbWUsXG4gICAgICAgICAgICBnYW1lU2Vzc2lvbjogaWQsXG4gICAgICAgICAgICByZXF1aXJlZE51bWJlck9mUGxheWVycyxcbiAgICAgICAgICAgIGNsaWVudHM6IFtdLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSBnYW1lIHNlc3Npb24gd2FzIGZvdW5kIHRoZXJlIHNob3VsZCBiZSBzb21lIGNsaWVudHMuLi5cbiAgICBpbmZvLmNsaWVudHMgPSByb29tLmNsaWVudHMubWFwKChjbGllbnQpID0+ICh7XG4gICAgICAgIG5hbWU6IGNsaWVudC5uYW1lLFxuICAgICAgICBzcGVjdGF0aW5nOiBjbGllbnQuaXNTcGVjdGF0aW5nLFxuICAgIH0pKTtcblxuICAgIGlmICghcm9vbS5pc1J1bm5pbmcoKSAmJiAhcm9vbS5pc092ZXIoKSkge1xuICAgICAgICAvLyBpdCBoYXMgY2xpZW50cywgYnV0IGl0IHN0aWxsIG9wZW4gbW9yZSBtb3JlIGJlZm9yZSBpdCBzdGFydHMgcnVubmluZ1xuICAgICAgICBpbmZvLnN0YXR1cyA9IFwib3BlblwiO1xuXG4gICAgICAgIHJldHVybiBpbmZvO1xuICAgIH1cblxuICAgIGlmIChyb29tLmlzUnVubmluZygpKSB7XG4gICAgICAgIC8vIG9uIGEgc2VwYXJhdGUgdGhyZWFkIHJ1bm5pbmcgdGhlIGdhbWVcbiAgICAgICAgaW5mby5zdGF0dXMgPSBcInJ1bm5pbmdcIjtcblxuICAgICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2UgdGhhdCBnYW1lIHNlc3Npb24gc2hvdWxkIGJlIG92ZXJcbiAgICBpZiAocm9vbS5pc092ZXIoKSkge1xuICAgICAgICBpbmZvLnN0YXR1cyA9IFwib3ZlclwiO1xuICAgICAgICBpbmZvLmdhbWVsb2dGaWxlbmFtZSA9IHJvb20uZ2FtZWxvZ0ZpbGVuYW1lIHx8IG51bGw7XG5cbiAgICAgICAgY29uc3QgY2xpZW50SW5mb3MgPSByb29tLmdldE92ZXJEYXRhKCk7XG4gICAgICAgIGlmIChjbGllbnRJbmZvcykge1xuICAgICAgICAgICAgaW5mby5jbGllbnRzID0gY2xpZW50SW5mb3M7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBlcnJvcjogXCJSZXF1ZXN0ZWQgZ2FtZSBuYW1lIGFuZCByb29tIGFyZSBpbiBhbiB1bmV4cGVjdGVkIHN0YXRlIG9mIHJ1bm5pbmcgd2hpbGUgb3Zlci5cIixcbiAgICB9O1xufVxuXG4vKipcbiAqIFJlZ2lzdGVycyB0aGUgc3RhdHVzIHJvdXRlIHdpdGggc29tZSBleHByZXNzIGFwcFxuICpcbiAqIEBwYXJhbSBhcHAgLSBUaGUgRXhwcmVzcyBhcHAgaW5zdGFuY2UgdG8gcmVnaXN0ZXIgdGhlIHJvdXRlIG9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlclJvdXRlU3RhdHVzKGFwcDogRXhwcmVzcyk6IHZvaWQge1xuICAgIGlmICghQ29uZmlnLkFQSV9FTkFCTEVEKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAYXBpR3JvdXAgQVBJXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAYXBpIHtnZXR9IC9zdGF0dXMvOmdhbWVOYW1lLzpnYW1lU2Vzc2lvbiBTdGF0dXNcbiAgICAgKiBAYXBpTmFtZSBTdGF0dXNcbiAgICAgKiBAYXBpR3JvdXAgQVBJXG4gICAgICogQGFwaURlc2NyaXB0aW9uIFdoZW4gZ2l2ZW4gYSBnYW1lTmFtZSBhbmQgc2Vzc2lvbiBpZCwgcmVzcG9uZHMgd2l0aCBqc29uXG4gICAgICogZGF0YSBhYm91dCB3aGF0IGlzIGdvaW5nIG9uIGluIHRoYXQgZ2FtZSBzZXNzaW9uLCBpbmNsdWRpbmcgd2hhdCBjbGllbnRzXG4gICAgICogYXJlIGNvbm5lY3RlZC5cbiAgICAgKiBAYXBpUGFyYW0ge3N0cmluZ30gZ2FtZU5hbWUgVGhlIG5hbWUgb2YgdGhlIGdhbWUgKG9yIGFuIGFsaWFzKSxcbiAgICAgKiBtdXN0IGJlIGEgdmFsaWQgZ2FtZSBvbiB0aGUgc2VydmVyLlxuICAgICAqIEBhcGlQYXJhbSB7c3RyaW5nfSBnYW1lU2Vzc2lvbiBUaGUgc2Vzc2lvbiBpZCBvZiB0aGUgZ2FtZSB5b3Ugd2FudCB0b1xuICAgICAqIGNoZWNrIHRoZSBzdGF0dXMgb2YuXG4gICAgICpcbiAgICAgKiBAYXBpU3VjY2VzcyB7c3RyaW5nfSBnYW1lTmFtZSAgVGhlIGFjdHVhbCBuYW1lIG9mIHRoZSBnYW1lLFxuICAgICAqIGUuZy4gXCJjaGVzc1wiIC0+IFwiQ2hlc3NcIi5cbiAgICAgKiBAYXBpU3VjY2VzcyB7c3RyaW5nfSBnYW1lU2Vzc2lvbiBUaGUgaWQgb2YgdGhlIHNlc3Npb24gaW4gdGhhdCBnYW1lLlxuICAgICAqIEBhcGlTdWNjZXNzIHtzdHJpbmd9IGdhbWVsb2dGaWxlbmFtZSBUaGUgZmlsZW5hbWUgKGlkKSBvZiB0aGUgZ2FtZWxvZy5cbiAgICAgKiBUbyBnZXQgdGhlIGFjdHVhbCBnYW1lbG9nIHVzZSB0aGUgL2dhbWVsb2cvOmlkIHBhcnQgb2YgdGhlIEFQSS4gbnVsbFxuICAgICAqIG1lYW5zIHRoZSBnYW1lbG9nIGRvZXMgbm90IGV4aXN0IHlldCBiZWNhdXNlIGl0IGlzIHN0aWxsIGJlaW5nIHdyaXR0ZW5cbiAgICAgKiB0byB0aGUgZmlsZXN5c3RlbS5cbiAgICAgKiBAYXBpU3VjY2VzcyB7c3RyaW5nfSBzdGF0dXMgV2hhdCB0aGUgc3RhdHVzIG9mIHRoaXMgZ2FtZSBzZXNzaW9uIGlzOlxuICAgICAqICAqIFwiZW1wdHlcIiBpZiB0aGUgZ2FtZSBzZXNzaW9uIGlzIHZhbGlkLCBidXQgZG9lcyBub3QgZXhpc3QgYmVjYXVzZSBub1xuICAgICAqICAgIGNsaWVudHMgaGF2ZSBldmVyIGNvbm5lY3RlZCB0byBpdC5cbiAgICAgKiAgKiBcIm9wZW5cIiBpZiB0aGUgZ2FtZSBzZXNzaW9uIGhhcyBoYWQgYSBsZWFzdCAxIGNsaWVudCBjb25uZWN0LCBidXQgdGhlXG4gICAgICogICAgZ2FtZSBoYXMgbm90IHN0YXJ0ZWQuXG4gICAgICogICogXCJydW5uaW5nXCIgaWYgYWxsIHBsYXllcnMgaGF2ZSBjb25uZWN0ZWQsIGFuZCB0aGUgZ2FtZSBpcyBhY3RpdmVseSBpblxuICAgICAqICAgIHByb2dyZXNzLCBidXQgbm90IG92ZXIuXG4gICAgICogICogXCJvdmVyXCIgaWYgdGhlIGdhbWUgc2Vzc2lvbiBoYXMgcmFuIHRvIGNvbXBsZXRpb24gYW5kIGNsaWVudHMgaGF2ZVxuICAgICAqICAgIGRpc2Nvbm5lY3RlZC5cbiAgICAgKiAgKiBcImVycm9yXCIgb3RoZXJ3aXNlLCBzdWNoIGFzIGlmIHRoZSBnYW1lTmFtZSB3YXMgaW52YWxpZC5cbiAgICAgKiBAYXBpU3VjY2VzcyB7bnVtYmVyfSBudW1iZXJPZlBsYXllcnMgVGhlIG51bWJlciBvZiBjbGllbnRzIHRoYXQgYXJlXG4gICAgICogcGxheWluZyBuZWVkZWQgdG8gY29ubmVjdCB0byBtYWtlIHRoZSBnYW1lIHNlc3Npb24gc3RhcnQgcnVubmluZy5cbiAgICAgKiBAYXBpU3VjY2VzcyB7Q2xpZW50W119IGNsaWVudHMgQW4gYXJyYXkgb2YgY2xpZW50cyBjdXJyZW50bHkgaW4gdGhhdFxuICAgICAqIGdhbWUgc2Vzc2lvbi5cbiAgICAgKlxuICAgICAqIEBhcGlTdWNjZXNzIChDbGllbnQpIHtudW1iZXJ9IFtpbmRleF0gSWYgdGhlIHBsYXllciByZXF1ZXN0ZWQsIG9yIHdhc1xuICAgICAqIGFzc2lnbmVkLCBhIHBsYXllciBpbmRleC4gV2hlbiBhIGdhbWUgc2Vzc2lvbiByZWFjaGVzIFwicnVubmluZ1wiIHRoaXNcbiAgICAgKiB3aWxsIGJlIHNldC5cbiAgICAgKiBAYXBpU3VjY2VzcyAoQ2xpZW50KSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBjbGllbnQuXG4gICAgICogQGFwaVN1Y2Nlc3MgKENsaWVudCkge2Jvb2xlYW59IHNwZWN0YXRpbmcgSWYgdGhlIGNsaWVudCBpcyBhIHNwZWN0YXRvclxuICAgICAqIChub3QgYSBwbGF5aW5nIGNsaWVudCkuIFNwZWN0YXRvcnMgd2lsbCBub3QgaGF2ZSBpbmRleGVzLlxuICAgICAqIEBhcGlTdWNjZXNzIChDbGllbnQpIHtib29sZWFufSBbZGlzY29ubmVjdGVkXSBJZiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RlZFxuICAgICAqIHVuZXhwZWN0ZWRseSBkdXJpbmcgdGhlIGdhbWUuXG4gICAgICogQGFwaVN1Y2Nlc3MgKENsaWVudCkge2Jvb2xlYW59IFt0aW1lZE91dF0gSWYgdGhlIGNsaWVudCB0aW1lZE91dCBhbmQgd2VcbiAgICAgKiB3ZXJlIGZvcmNlZCB0byBkaXNjb25uZWN0IHRoZW0gZHVyaW5nIHRoZSBnYW1lLlxuICAgICAqIEBhcGlTdWNjZXNzIChDbGllbnQpIHtib29sZWFufSBbd29uXSBJZiB0aGUgcGxheWVyIHdvbiB0aGlzIHdpbGwgYmUgc2V0LFxuICAgICAqIGFuZCBiZSB0cnVlLlxuICAgICAqIEBhcGlTdWNjZXNzIChDbGllbnQpIHtib29sZWFufSBbbG9zdF0gSWYgdGhlIHBsYXllciBsb3N0IHRoaXMgd2lsbCBiZVxuICAgICAqIHNldCwgYW5kIGJlIHRydWUuXG4gICAgICogQGFwaVN1Y2Nlc3MgKENsaWVudCkge3N0cmluZ30gW3JlYXNvbl0gSWYgdGhlIHBsYXllciB3b24gb3IgbG9zdCB0aGlzXG4gICAgICogd2lsbCBiZSB0aGUgaHVtYW4gcmVhZGFibGUgcmVhc29uIHdoeSB0aGV5IGRpZCBzby5cbiAgICAgKlxuICAgICAqIEBhcGlTdWNjZXNzRXhhbXBsZSB7anNvbn0gRW1wdHlcbiAgICAgKiAge1xuICAgICAqICAgICAgc3RhdHVzOiBcImVtcHR5XCIsXG4gICAgICogICAgICBnYW1lTmFtZTogXCJDaGVzc1wiLFxuICAgICAqICAgICAgZ2FtZVNlc3Npb246IFwiMVwiLFxuICAgICAqICAgICAgcmVxdWlyZWROdW1iZXJPZlBsYXllcnM6IDJcbiAgICAgKiAgfVxuICAgICAqXG4gICAgICogQGFwaVN1Y2Nlc3NFeGFtcGxlIHtqc29ufSBPcGVuXG4gICAgICogIHtcbiAgICAgKiAgICAgIHN0YXR1czogXCJvcGVuXCIsXG4gICAgICogICAgICBnYW1lTmFtZTogXCJDaGVzc1wiLFxuICAgICAqICAgICAgZ2FtZVNlc3Npb246IFwiMVwiLFxuICAgICAqICAgICAgcmVxdWlyZWROdW1iZXJPZlBsYXllcnM6IDIsXG4gICAgICogICAgICBjbGllbnRzOiBbXG4gICAgICogICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICBuYW1lOiBcIkNoZXNzIEx1YSBQbGF5ZXJcIixcbiAgICAgKiAgICAgICAgICAgICAgc3BlY3RhdGluZzogZmFsc2VcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICBdXG4gICAgICogICB9XG4gICAgICpcbiAgICAgKiBAYXBpU3VjY2Vzc0V4YW1wbGUge2pzb259IFJ1bm5pbmdcbiAgICAgKiAge1xuICAgICAqICAgICAgc3RhdHVzOiBcInJ1bm5pbmdcIixcbiAgICAgKiAgICAgIGdhbWVOYW1lOiBcIkNoZXNzXCIsXG4gICAgICogICAgICBnYW1lU2Vzc2lvbjogXCIxXCIsXG4gICAgICogICAgICByZXF1aXJlZE51bWJlck9mUGxheWVyczogMixcbiAgICAgKiAgICAgIGNsaWVudHM6IFtcbiAgICAgKiAgICAgICAgICB7XG4gICAgICogICAgICAgICAgICAgIG5hbWU6IFwiQ2hlc3MgTHVhIFBsYXllclwiLFxuICAgICAqICAgICAgICAgICAgICBzcGVjdGF0aW5nOiBmYWxzZVxuICAgICAqICAgICAgICAgIH0sXG4gICAgICogICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICBuYW1lOiBcIkNoZXNzIFB5dGhvbiBQbGF5ZXJcIixcbiAgICAgKiAgICAgICAgICAgICAgc3BlY3RhdGluZzogZmFsc2VcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICBdXG4gICAgICogIH1cbiAgICAgKlxuICAgICAqIEBhcGlTdWNjZXNzRXhhbXBsZSB7anNvbn0gT3ZlclxuICAgICAqICB7XG4gICAgICogICAgICBzdGF0dXM6IFwib3ZlclwiLFxuICAgICAqICAgICAgZ2FtZU5hbWU6IFwiQ2hlc3NcIixcbiAgICAgKiAgICAgIGdhbWVTZXNzaW9uOiBcIjFcIixcbiAgICAgKiAgICAgIGdhbWVsb2dGaWxlbmFtZTogXCIyMDE2LjAzLjAxLjExLjU0LjMwLjg2OC1DaGVzcy0xXCIsXG4gICAgICogICAgICByZXF1aXJlZE51bWJlck9mUGxheWVyczogMixcbiAgICAgKiAgICAgIGNsaWVudHM6IFtcbiAgICAgKiAgICAgICAgICB7XG4gICAgICogICAgICAgICAgICAgIG5hbWU6IFwiQ2hlc3MgTHVhIFBsYXllclwiLFxuICAgICAqICAgICAgICAgICAgICBpbmRleDogMCxcbiAgICAgKiAgICAgICAgICAgICAgc3BlY3RhdGluZzogZmFsc2UsXG4gICAgICogICAgICAgICAgICAgIHdvbjogdHJ1ZSxcbiAgICAgKiAgICAgICAgICAgICAgbG9zdDogZmFsc2UsXG4gICAgICogICAgICAgICAgICAgIHJlYXNvbjogXCJDaGVja21hdGUhXCJcbiAgICAgKiAgICAgICAgICB9LFxuICAgICAqICAgICAgICAgIHtcbiAgICAgKiAgICAgICAgICAgICAgbmFtZTogXCJDaGVzcyBQeXRob24gUGxheWVyXCIsXG4gICAgICogICAgICAgICAgICAgIGluZGV4OiAxLFxuICAgICAqICAgICAgICAgICAgICBzcGVjdGF0aW5nOiBmYWxzZSxcbiAgICAgKiAgICAgICAgICAgICAgd29uOiBmYWxzZSxcbiAgICAgKiAgICAgICAgICAgICAgbG9zdDogdHJ1ZSxcbiAgICAgKiAgICAgICAgICAgICAgcmVhc29uOiBcIkNoZWNrbWF0ZWQuXCJcbiAgICAgKiAgICAgICAgICB9XG4gICAgICogICAgICBdXG4gICAgICogIH1cbiAgICAgKlxuICAgICAqIEBhcGlTdWNjZXNzRXhhbXBsZSB7anNvbn0gQWxtb3N0IE92ZXJcbiAgICAgKiAgSW4gdGhpcyBleGFtcGxlIHRoZSBnYW1lIGlzIG92ZXIsIGJ1dCB0aGUgZ2FtZWxvZyBpcyBzdGlsbCBiZWluZ1xuICAgICAqICBoYW5kbGVkIGludGVybmFsbHkgYW5kIGlzIG5vdCBhdmFpbGFibGUgdmlhIHRoZSBgZ2FtZWxvZy9gIEFQSSB5ZXQuXG4gICAgICogIHtcbiAgICAgKiAgICAgIHN0YXR1czogXCJvdmVyXCIsXG4gICAgICogICAgICBnYW1lTmFtZTogXCJDaGVzc1wiLFxuICAgICAqICAgICAgZ2FtZVNlc3Npb246IFwiMVwiLFxuICAgICAqICAgICAgZ2FtZWxvZ0ZpbGVuYW1lOiBudWxsLFxuICAgICAqICAgICAgcmVxdWlyZWROdW1iZXJPZlBsYXllcnM6IDIsXG4gICAgICogICAgICBjbGllbnRzOiBbXG4gICAgICogICAgICAgICAge1xuICAgICAqICAgICAgICAgICAgICBuYW1lOiBcIkNoZXNzIEx1YSBQbGF5ZXJcIixcbiAgICAgKiAgICAgICAgICAgICAgc3BlY3RhdGluZzogZmFsc2UsXG4gICAgICogICAgICAgICAgICAgIHdvbjogdHJ1ZSxcbiAgICAgKiAgICAgICAgICAgICAgbG9zdDogZmFsc2UsXG4gICAgICogICAgICAgICAgICAgIHJlYXNvbjogXCJDaGVja21hdGUhXCJcbiAgICAgKiAgICAgICAgICB9LFxuICAgICAqICAgICAgICAgIHtcbiAgICAgKiAgICAgICAgICAgICAgbmFtZTogXCJDaGVzcyBQeXRob24gUGxheWVyXCIsXG4gICAgICogICAgICAgICAgICAgIHNwZWN0YXRpbmc6IGZhbHNlLFxuICAgICAqICAgICAgICAgICAgICB3b246IGZhbHNlLFxuICAgICAqICAgICAgICAgICAgICBsb3N0OiB0cnVlLFxuICAgICAqICAgICAgICAgICAgICByZWFzb246IFwiQ2hlY2ttYXRlZC5cIlxuICAgICAqICAgICAgICAgIH1cbiAgICAgKiAgICAgIF1cbiAgICAgKiAgfVxuICAgICAqXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBhcGlFcnJvciB7c3RyaW5nfSBlcnJvciBBIGh1bWFuIHJlYWRhYmxlIHN0cmluZyBhYm91dCB3aGF0IHRoZSBlcnJvclxuICAgICAqIHdhcy5cbiAgICAgKiBAYXBpRXJyb3Ige3N0cmluZ30gW2dhbWVOYW1lXSBJZiB0aGUgcmVxdWVzdCB3YXMgdmFsaWQsIGJ1dCB0aGUgZ2FtZU5hbWVcbiAgICAgKiB3YXMgbm90IGEgdmFsaWQgYWxpYXMgZm9yIGEgZ2FtZSwgdGhpcyBpcyB0aGUgZ2FtZU5hbWUgeW91IHNlbnQgdXMuXG4gICAgICpcbiAgICAgKiBAYXBpRXJyb3JFeGFtcGxlIHtqc29ufSBVbmtub3duIEdhbWVOYW1lXG4gICAgICogIEhUVFAvMS4xIDQwMCBCYWQgUmVxdWVzdFxuICAgICAqICB7XG4gICAgICogICAgICBlcnJvcjogXCJHYW1lIG5hbWUgbm90IHZhbGlkXCIsXG4gICAgICogICAgICBnYW1lTmFtZTogXCJ1bmtub3duR2FtZU5hbWVcIlxuICAgICAqICB9XG4gICAgICovXG4gICAgYXBwLmdldChcIi9zdGF0dXMvOmdhbWVOYW1lLzpnYW1lU2Vzc2lvblwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcmVxLnBhcmFtcyBhcyB7XG4gICAgICAgICAgICAvKiogVGhlIGdhbWUgbmFtZSBiZWluZyByZXF1ZXN0ZWQgKi9cbiAgICAgICAgICAgIGdhbWVOYW1lOiB1bmtub3duO1xuXG4gICAgICAgICAgICAvKiogdGhlIGdhbWUgc2Vzc2lvbiBiZWluZyByZXF1ZXN0ZWQgKi9cbiAgICAgICAgICAgIGdhbWVTZXNzaW9uOiB1bmtub3duO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGdhbWVOYW1lID0gU3RyaW5nKHBhcmFtcy5nYW1lTmFtZSk7XG4gICAgICAgIGNvbnN0IGdhbWVTZXNzaW9uID0gU3RyaW5nKHBhcmFtcy5nYW1lU2Vzc2lvbik7XG5cbiAgICAgICAgY29uc3QgaW5mbyA9ICghZ2FtZU5hbWUgfHwgIWdhbWVTZXNzaW9uKVxuICAgICAgICAgICAgPyB7IGVycm9yOiBcImdhbWVOYW1lIGFuZCBnYW1lU2Vzc2lvbiBhcmUgcmVxdWlyZWRcIiB9XG4gICAgICAgICAgICA6IGdldFJvb21JbmZvKGdhbWVOYW1lLCBnYW1lU2Vzc2lvbik7XG5cbiAgICAgICAgaWYgKG9iamVjdEhhc1Byb3BlcnR5KGluZm8sIFwiZXJyb3JcIikpIHtcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5qc29uKGluZm8pO1xuICAgIH0pO1xufVxuIl19