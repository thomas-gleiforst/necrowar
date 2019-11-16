"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const config_1 = require("~/core/config");
const utils_1 = require("~/utils");
// Typings bug. No default export exist for this library, yet TS thinks there should be.
// This side steps the bug by reverting to old school requires.
// tslint:disable-next-line:no-var-requires no-require-imports
const sanitizeFilename = require("sanitize-filename");
/** The extension for gamelog files */
exports.GAMELOG_EXTENSION = ".json.gz";
/**
 * Formats a filename.
 *
 * @param gameName - The name of the game.
 * @param gameSession - The game session id.
 * @param moment - The moment string.
 * @returns A string that would be the filename.
 */
function filenameFormat(gameName, gameSession, moment) {
    if (config_1.Config.ARENA_MODE) {
        // TODO: upgrade arena so it can get the "real" filename with
        //       the moment string in it via REST API
        return `${gameName}-${gameSession}`;
    }
    return `${gameName}-${gameSession}-${moment}`;
}
exports.filenameFormat = filenameFormat;
/**
 * Returns a url string to the gamelog.
 *
 * @param filename - The filename of the url.
 * @param includeHostname - True if the hostname should be part of the URL,
 * false otherwise for just he uri.
 * @returns The url to the gamelog.
 */
function getURL(filename, includeHostname = true) {
    let hostname = "";
    if (includeHostname) {
        // Note: __HOSTNAME__ is expected to be overwritten by clients,
        // as we can't know for certain what hostname they used to connect
        // to us via.
        // tslint:disable-next-line:no-http-string
        hostname = `http://__HOSTNAME__:${config_1.Config.HTTP_PORT}`;
    }
    const baseFilename = path_1.basename(filename, exports.GAMELOG_EXTENSION);
    return `${hostname}/gamelog/${baseFilename}`;
}
exports.getURL = getURL;
/**
 * Returns a url to the visualizer for said gamelog
 * @param gamelogOrFilename the gamelog to format a visualizer url for
 * @param visualizerURL url to visualizer, if calling statically
 * @returns - Undefined if no visualizer set, url to the gamelog in visualizer otherwise
 */
function getVisualizerURL(gamelogOrFilename, visualizerURL) {
    const vis = config_1.Config.VISUALIZER_URL;
    if (vis) {
        const filename = typeof gamelogOrFilename === "string"
            ? gamelogOrFilename
            : filenameFor(gamelogOrFilename);
        const url = getURL(filename);
        return `${vis}?log=${encodeURIComponent(url)}`;
    }
}
exports.getVisualizerURL = getVisualizerURL;
/**
 * Returns the expected filename for a gamelog.
 *
 * @param gamelogData - A partial interface of the gamelog data to get the
 * filename from.
 * @returns the string filename (just name, no path), expected for the data.
 */
function filenameFor(gamelogData) {
    return sanitizeFilename(filenameFormat(gamelogData.gameName, gamelogData.gameSession, gamelogData.epoch === undefined
        ? "unknown"
        : utils_1.momentString(gamelogData.epoch)));
}
exports.filenameFor = filenameFor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZWxvZy11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvZ2FtZWxvZy9nYW1lbG9nLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsK0JBQWdDO0FBQ2hDLDBDQUF1QztBQUN2QyxtQ0FBa0Q7QUFFbEQsd0ZBQXdGO0FBQ3hGLCtEQUErRDtBQUMvRCw4REFBOEQ7QUFDOUQsTUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQXVDLENBQUM7QUFFNUYsc0NBQXNDO0FBQ3pCLFFBQUEsaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBRTVDOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixjQUFjLENBQzFCLFFBQWlCLEVBQ2pCLFdBQW9CLEVBQ3BCLE1BQWU7SUFFZixJQUFJLGVBQU0sQ0FBQyxVQUFVLEVBQUU7UUFDbkIsNkRBQTZEO1FBQzdELDZDQUE2QztRQUM3QyxPQUFPLEdBQUcsUUFBUSxJQUFJLFdBQVcsRUFBRSxDQUFDO0tBQ3ZDO0lBRUQsT0FBTyxHQUFHLFFBQVEsSUFBSSxXQUFXLElBQUksTUFBTSxFQUFFLENBQUM7QUFDbEQsQ0FBQztBQVpELHdDQVlDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLE1BQU0sQ0FDbEIsUUFBZ0IsRUFDaEIsa0JBQTJCLElBQUk7SUFFL0IsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLElBQUksZUFBZSxFQUFFO1FBQ2pCLCtEQUErRDtRQUMvRCxrRUFBa0U7UUFDbEUsYUFBYTtRQUNiLDBDQUEwQztRQUMxQyxRQUFRLEdBQUcsdUJBQXVCLGVBQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUN4RDtJQUVELE1BQU0sWUFBWSxHQUFHLGVBQVEsQ0FBQyxRQUFRLEVBQUUseUJBQWlCLENBQUMsQ0FBQztJQUUzRCxPQUFPLEdBQUcsUUFBUSxZQUFZLFlBQVksRUFBRSxDQUFDO0FBQ2pELENBQUM7QUFoQkQsd0JBZ0JDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FDNUIsaUJBQStDLEVBQy9DLGFBQXNCO0lBRXRCLE1BQU0sR0FBRyxHQUFHLGVBQU0sQ0FBQyxjQUFjLENBQUM7SUFDbEMsSUFBSSxHQUFHLEVBQUU7UUFDTCxNQUFNLFFBQVEsR0FBRyxPQUFPLGlCQUFpQixLQUFLLFFBQVE7WUFDbEQsQ0FBQyxDQUFDLGlCQUFpQjtZQUNuQixDQUFDLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDckMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdCLE9BQU8sR0FBRyxHQUFHLFFBQVEsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztLQUNsRDtBQUNMLENBQUM7QUFiRCw0Q0FhQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQWdCLFdBQVcsQ0FBQyxXQU8zQjtJQUNHLE9BQU8sZ0JBQWdCLENBQUMsY0FBYyxDQUNsQyxXQUFXLENBQUMsUUFBUSxFQUNwQixXQUFXLENBQUMsV0FBVyxFQUN2QixXQUFXLENBQUMsS0FBSyxLQUFLLFNBQVM7UUFDM0IsQ0FBQyxDQUFDLFNBQVM7UUFDWCxDQUFDLENBQUMsb0JBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQ3hDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFmRCxrQ0FlQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElHYW1lbG9nIH0gZnJvbSBcIkBjYWRyZS90cy11dGlscy9jYWRyZVwiO1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIn4vY29yZS9jb25maWdcIjtcbmltcG9ydCB7IEltbXV0YWJsZSwgbW9tZW50U3RyaW5nIH0gZnJvbSBcIn4vdXRpbHNcIjtcblxuLy8gVHlwaW5ncyBidWcuIE5vIGRlZmF1bHQgZXhwb3J0IGV4aXN0IGZvciB0aGlzIGxpYnJhcnksIHlldCBUUyB0aGlua3MgdGhlcmUgc2hvdWxkIGJlLlxuLy8gVGhpcyBzaWRlIHN0ZXBzIHRoZSBidWcgYnkgcmV2ZXJ0aW5nIHRvIG9sZCBzY2hvb2wgcmVxdWlyZXMuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdmFyLXJlcXVpcmVzIG5vLXJlcXVpcmUtaW1wb3J0c1xuY29uc3Qgc2FuaXRpemVGaWxlbmFtZSA9IHJlcXVpcmUoXCJzYW5pdGl6ZS1maWxlbmFtZVwiKSBhcyB0eXBlb2YgaW1wb3J0KFwic2FuaXRpemUtZmlsZW5hbWVcIik7XG5cbi8qKiBUaGUgZXh0ZW5zaW9uIGZvciBnYW1lbG9nIGZpbGVzICovXG5leHBvcnQgY29uc3QgR0FNRUxPR19FWFRFTlNJT04gPSBcIi5qc29uLmd6XCI7XG5cbi8qKlxuICogRm9ybWF0cyBhIGZpbGVuYW1lLlxuICpcbiAqIEBwYXJhbSBnYW1lTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBnYW1lLlxuICogQHBhcmFtIGdhbWVTZXNzaW9uIC0gVGhlIGdhbWUgc2Vzc2lvbiBpZC5cbiAqIEBwYXJhbSBtb21lbnQgLSBUaGUgbW9tZW50IHN0cmluZy5cbiAqIEByZXR1cm5zIEEgc3RyaW5nIHRoYXQgd291bGQgYmUgdGhlIGZpbGVuYW1lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsZW5hbWVGb3JtYXQoXG4gICAgZ2FtZU5hbWU/OiBzdHJpbmcsXG4gICAgZ2FtZVNlc3Npb24/OiBzdHJpbmcsXG4gICAgbW9tZW50Pzogc3RyaW5nLFxuKTogc3RyaW5nIHtcbiAgICBpZiAoQ29uZmlnLkFSRU5BX01PREUpIHtcbiAgICAgICAgLy8gVE9ETzogdXBncmFkZSBhcmVuYSBzbyBpdCBjYW4gZ2V0IHRoZSBcInJlYWxcIiBmaWxlbmFtZSB3aXRoXG4gICAgICAgIC8vICAgICAgIHRoZSBtb21lbnQgc3RyaW5nIGluIGl0IHZpYSBSRVNUIEFQSVxuICAgICAgICByZXR1cm4gYCR7Z2FtZU5hbWV9LSR7Z2FtZVNlc3Npb259YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYCR7Z2FtZU5hbWV9LSR7Z2FtZVNlc3Npb259LSR7bW9tZW50fWA7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHVybCBzdHJpbmcgdG8gdGhlIGdhbWVsb2cuXG4gKlxuICogQHBhcmFtIGZpbGVuYW1lIC0gVGhlIGZpbGVuYW1lIG9mIHRoZSB1cmwuXG4gKiBAcGFyYW0gaW5jbHVkZUhvc3RuYW1lIC0gVHJ1ZSBpZiB0aGUgaG9zdG5hbWUgc2hvdWxkIGJlIHBhcnQgb2YgdGhlIFVSTCxcbiAqIGZhbHNlIG90aGVyd2lzZSBmb3IganVzdCBoZSB1cmkuXG4gKiBAcmV0dXJucyBUaGUgdXJsIHRvIHRoZSBnYW1lbG9nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VVJMKFxuICAgIGZpbGVuYW1lOiBzdHJpbmcsXG4gICAgaW5jbHVkZUhvc3RuYW1lOiBib29sZWFuID0gdHJ1ZSxcbik6IHN0cmluZyB7XG4gICAgbGV0IGhvc3RuYW1lID0gXCJcIjtcbiAgICBpZiAoaW5jbHVkZUhvc3RuYW1lKSB7XG4gICAgICAgIC8vIE5vdGU6IF9fSE9TVE5BTUVfXyBpcyBleHBlY3RlZCB0byBiZSBvdmVyd3JpdHRlbiBieSBjbGllbnRzLFxuICAgICAgICAvLyBhcyB3ZSBjYW4ndCBrbm93IGZvciBjZXJ0YWluIHdoYXQgaG9zdG5hbWUgdGhleSB1c2VkIHRvIGNvbm5lY3RcbiAgICAgICAgLy8gdG8gdXMgdmlhLlxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taHR0cC1zdHJpbmdcbiAgICAgICAgaG9zdG5hbWUgPSBgaHR0cDovL19fSE9TVE5BTUVfXzoke0NvbmZpZy5IVFRQX1BPUlR9YDtcbiAgICB9XG5cbiAgICBjb25zdCBiYXNlRmlsZW5hbWUgPSBiYXNlbmFtZShmaWxlbmFtZSwgR0FNRUxPR19FWFRFTlNJT04pO1xuXG4gICAgcmV0dXJuIGAke2hvc3RuYW1lfS9nYW1lbG9nLyR7YmFzZUZpbGVuYW1lfWA7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHVybCB0byB0aGUgdmlzdWFsaXplciBmb3Igc2FpZCBnYW1lbG9nXG4gKiBAcGFyYW0gZ2FtZWxvZ09yRmlsZW5hbWUgdGhlIGdhbWVsb2cgdG8gZm9ybWF0IGEgdmlzdWFsaXplciB1cmwgZm9yXG4gKiBAcGFyYW0gdmlzdWFsaXplclVSTCB1cmwgdG8gdmlzdWFsaXplciwgaWYgY2FsbGluZyBzdGF0aWNhbGx5XG4gKiBAcmV0dXJucyAtIFVuZGVmaW5lZCBpZiBubyB2aXN1YWxpemVyIHNldCwgdXJsIHRvIHRoZSBnYW1lbG9nIGluIHZpc3VhbGl6ZXIgb3RoZXJ3aXNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRWaXN1YWxpemVyVVJMKFxuICAgIGdhbWVsb2dPckZpbGVuYW1lOiBJbW11dGFibGU8SUdhbWVsb2c+IHwgc3RyaW5nLFxuICAgIHZpc3VhbGl6ZXJVUkw/OiBzdHJpbmcsXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHZpcyA9IENvbmZpZy5WSVNVQUxJWkVSX1VSTDtcbiAgICBpZiAodmlzKSB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lID0gdHlwZW9mIGdhbWVsb2dPckZpbGVuYW1lID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICA/IGdhbWVsb2dPckZpbGVuYW1lXG4gICAgICAgICAgICA6IGZpbGVuYW1lRm9yKGdhbWVsb2dPckZpbGVuYW1lKTtcbiAgICAgICAgY29uc3QgdXJsID0gZ2V0VVJMKGZpbGVuYW1lKTtcblxuICAgICAgICByZXR1cm4gYCR7dmlzfT9sb2c9JHtlbmNvZGVVUklDb21wb25lbnQodXJsKX1gO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBleHBlY3RlZCBmaWxlbmFtZSBmb3IgYSBnYW1lbG9nLlxuICpcbiAqIEBwYXJhbSBnYW1lbG9nRGF0YSAtIEEgcGFydGlhbCBpbnRlcmZhY2Ugb2YgdGhlIGdhbWVsb2cgZGF0YSB0byBnZXQgdGhlXG4gKiBmaWxlbmFtZSBmcm9tLlxuICogQHJldHVybnMgdGhlIHN0cmluZyBmaWxlbmFtZSAoanVzdCBuYW1lLCBubyBwYXRoKSwgZXhwZWN0ZWQgZm9yIHRoZSBkYXRhLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsZW5hbWVGb3IoZ2FtZWxvZ0RhdGE6IHtcbiAgICAvKiogVGhlIG5hbWUgb2YgdGhlIGdhbWUgdG8gZm9ybWF0IHRoZSBmaWxlbmFtZSBmb3IuICovXG4gICAgZ2FtZU5hbWU6IHN0cmluZztcbiAgICAvKiogVGhlIGdhbWUgc2Vzc2lvbiBpZC4gKi9cbiAgICBnYW1lU2Vzc2lvbjogc3RyaW5nO1xuICAgIC8qKiBPcHRpb25hbCBlcG9jaC4gKi9cbiAgICBlcG9jaD86IG51bWJlcjtcbn0pOiBzdHJpbmcge1xuICAgIHJldHVybiBzYW5pdGl6ZUZpbGVuYW1lKGZpbGVuYW1lRm9ybWF0KFxuICAgICAgICBnYW1lbG9nRGF0YS5nYW1lTmFtZSxcbiAgICAgICAgZ2FtZWxvZ0RhdGEuZ2FtZVNlc3Npb24sXG4gICAgICAgIGdhbWVsb2dEYXRhLmVwb2NoID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gXCJ1bmtub3duXCJcbiAgICAgICAgICAgIDogbW9tZW50U3RyaW5nKGdhbWVsb2dEYXRhLmVwb2NoKSxcbiAgICApKTtcbn1cbiJdfQ==