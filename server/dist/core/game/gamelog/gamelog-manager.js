"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path_1 = require("path");
const zlib_1 = require("zlib");
const config_1 = require("~/core/config");
const utils_1 = require("~/utils");
const gamelog_utils_1 = require("./gamelog-utils");
/** The default gamelogs directory */
const DEFAULT_LOGS_DIR = path_1.join(config_1.Config.LOGS_DIR, "gamelogs/");
/**
 * A simple manager that attaches to a directory and manages creating and
 * reading game logs in that directory.
 */
class GamelogManager {
    /**
     * Initializes a single source to manage game logs on this thread.
     *
     * @param gamelogDirectory - An optional override on where to output
     * gamelogs to.
     */
    constructor(
    /** The directory where this will save gamelog files to */
    gamelogDirectory = DEFAULT_LOGS_DIR) {
        this.gamelogDirectory = gamelogDirectory;
        // state-full part of the class
        /** Cached info about all the gamelogs sitting on disk. */
        this.gamelogInfos = [];
        /** The set of filenames we are currently writing to the disk. */
        this.filenamesWriting = new Set();
        if (config_1.Config.LOAD_EXISTING_GAMELOGS) {
            this.initializeGamelogInfos();
        }
    }
    /**
     * Creates a gamelog for the game in the directory set during init.
     *
     * @param gamelog - The gamelog which should be serialize-able to json
     * representation of the gamelog.
     * @returns A promise that resolves to the filename written.
     */
    log(gamelog) {
        const serialized = JSON.stringify(gamelog);
        const filename = gamelog_utils_1.filenameFor(gamelog);
        // cache gamelog info
        this.gamelogInfos.push({
            epoch: gamelog.epoch,
            filename,
            gameName: gamelog.gameName,
            session: gamelog.gameSession,
            uri: gamelog_utils_1.getURL(filename),
            visualizerUrl: gamelog_utils_1.getVisualizerURL(filename),
        });
        const writeSteam = fs.createWriteStream(this.gamelogDirectory + filename + gamelog_utils_1.GAMELOG_EXTENSION, "utf8");
        const gzip = zlib_1.createGzip();
        return new Promise((resolve, reject) => {
            gzip.on("error", (err) => {
                reject(err);
            });
            this.filenamesWriting.add(filename);
            gzip.on("finish", () => {
                this.filenamesWriting.delete(filename);
                resolve(filename);
            });
            gzip.pipe(writeSteam);
            gzip.write(serialized);
            gzip.end();
        });
    }
    /**
     * Gets the first gamelog matching the filename, without the extension.
     *
     * @param filename - The base filename (without gamelog extension) you want
     * in LOGS_DIR/gamelogs/
     * @returns - A promise to a gamelog matching passed in parameters, or
     * undefined if no gamelog. second arg is error.
     */
    async getGamelog(filename) {
        const gamelogPath = await this.checkGamelog(filename);
        if (!gamelogPath) {
            // gamelog doesn't exist, so we have nothing to return
            return undefined;
        }
        return utils_1.gunzipFile(gamelogPath);
    }
    /**
     * Deletes the first gamelog matching the filename, without the extension
     * @param filename the base filename (without gamelog extension) you want
     * in LOGS_DIR/gamelogs.
     * @returns the a boolean if it was successfully deleted
     */
    async deleteGamelog(filename) {
        const gamelogPath = await this.checkGamelog(filename);
        if (!gamelogPath) {
            return false;
        }
        const infosIndex = this.gamelogInfos.findIndex((e) => e.filename === filename);
        if (infosIndex !== -1) {
            // Remove that gamelog from our infos.
            this.gamelogInfos.splice(infosIndex, 1);
        }
        // else it does exist, so delete it
        await fs.unlink(gamelogPath);
        return true;
    }
    /**
     * Attempts to get the read stream for the gamelog's filename.
     *
     * @param filename - The filename of the gamelog to get
     * @returns A promise that resolves to the gamelog's read stream if found,
     * otherwise resolves to undefined.
     */
    async getGamelogFileStream(filename) {
        const lastGameInfo = this.gamelogInfos[this.gamelogInfos.length - 1];
        const filenameToCheck = (filename === "latest" && lastGameInfo)
            ? lastGameInfo.filename
            : filename;
        const path = await this.checkGamelog(filenameToCheck);
        if (!path) {
            return;
        }
        return fs.createReadStream(path);
    }
    /**
     * Gets ALL the gamelogs in LOGS_DIR/gamelogs.
     * The gamelogs are not complete, but rather a "shallow" gamelog.
     *
     * @returns A promise for the list of gamelogs information.
     */
    async initializeGamelogInfos() {
        const files = await fs.readdir(this.gamelogDirectory);
        for (const filename of files) {
            if (!this.filenamesWriting.has(filename) &&
                filename.endsWith(gamelog_utils_1.GAMELOG_EXTENSION)) {
                // then it is a gamelog
                const baseFilename = path_1.basename(filename, gamelog_utils_1.GAMELOG_EXTENSION);
                const split = baseFilename.split("-");
                if (split.length === 3) {
                    // Then we can figure out what the game is based on just
                    // the filename.
                    const [gameName, session, epochString] = split;
                    const epoch = Number(utils_1.stringToMoment(epochString));
                    this.gamelogInfos.push({
                        epoch,
                        filename,
                        gameName,
                        session,
                        uri: gamelog_utils_1.getURL(baseFilename, false),
                        visualizerUrl: gamelog_utils_1.getVisualizerURL(filename),
                    });
                }
            }
        }
        this.gamelogInfos.sort((a, b) => a.epoch - b.epoch);
    }
    /**
     * Checks to see if the filename maps to a gamelog on disk.
     *
     * @param filename - The base filename (without gamelog extension) you want
     * in LOGS_DIR/gamelogs/.
     * @returns A promise of the path to the game log if it exists, undefined
     * otherwise.
     */
    async checkGamelog(filename) {
        const filenameWithExtension = filename.endsWith(gamelog_utils_1.GAMELOG_EXTENSION)
            ? filename
            : (filename + gamelog_utils_1.GAMELOG_EXTENSION);
        const gamelogPath = path_1.join(this.gamelogDirectory, filenameWithExtension);
        if (this.filenamesWriting.has(filename)) {
            // it is on disk, but not being written yet, so it's not ready
            return undefined;
        }
        try {
            const stats = await fs.stat(gamelogPath);
            return stats.isFile()
                ? gamelogPath
                : undefined;
        }
        catch (err) {
            // The file doesn't exist, or may have permission issues;
            // either way that doesn't count so this path has nothing for us.
            return;
        }
    }
}
exports.GamelogManager = GamelogManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZWxvZy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvZ2FtZS9nYW1lbG9nL2dhbWVsb2ctbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtCQUErQjtBQUMvQiwrQkFBc0M7QUFDdEMsK0JBQWtDO0FBQ2xDLDBDQUF1QztBQUN2QyxtQ0FBZ0U7QUFDaEUsbURBQTJGO0FBRTNGLHFDQUFxQztBQUNyQyxNQUFNLGdCQUFnQixHQUFHLFdBQUksQ0FBQyxlQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBNkI1RDs7O0dBR0c7QUFDSCxNQUFhLGNBQWM7SUFTdkI7Ozs7O09BS0c7SUFDSDtJQUNJLDBEQUEwRDtJQUMxQyxtQkFBMkIsZ0JBQWdCO1FBQTNDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMkI7UUFoQi9ELCtCQUErQjtRQUUvQiwwREFBMEQ7UUFDMUMsaUJBQVksR0FBbUIsRUFBRSxDQUFDO1FBRWxELGlFQUFpRTtRQUN6RCxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBWXpDLElBQUksZUFBTSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEdBQUcsQ0FBQyxPQUE0QjtRQUNuQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLDJCQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdEMscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ25CLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixRQUFRO1lBQ1IsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVztZ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LEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ssS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFnQjtRQUN2QyxNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsaUNBQWlCLENBQUM7WUFDOUQsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsaUNBQWlCLENBQUMsQ0FBQztRQUVyQyxNQUFNLFdBQVcsR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFFdkUsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLDhEQUE4RDtZQUM5RCxPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUVELElBQUk7WUFDQSxNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFekMsT0FBTyxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNqQixDQUFDLENBQUMsV0FBVztnQkFDYixDQUFDLENBQUMsU0FBUyxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxHQUFHLEVBQUU7WUFDUix5REFBeUQ7WUFDekQsaUVBQWlFO1lBQ2pFLE9BQU87U0FDVjtJQUNMLENBQUM7Q0FDSjtBQWpORCx3Q0FpTkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJR2FtZWxvZyB9IGZyb20gXCJAY2FkcmUvdHMtdXRpbHMvY2FkcmVcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmcy1leHRyYVwiO1xuaW1wb3J0IHsgYmFzZW5hbWUsIGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY3JlYXRlR3ppcCB9IGZyb20gXCJ6bGliXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwifi9jb3JlL2NvbmZpZ1wiO1xuaW1wb3J0IHsgZ3VuemlwRmlsZSwgSW1tdXRhYmxlLCBzdHJpbmdUb01vbWVudCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBmaWxlbmFtZUZvciwgR0FNRUxPR19FWFRFTlNJT04sIGdldFVSTCwgZ2V0VmlzdWFsaXplclVSTCB9IGZyb20gXCIuL2dhbWVsb2ctdXRpbHNcIjtcblxuLyoqIFRoZSBkZWZhdWx0IGdhbWVsb2dzIGRpcmVjdG9yeSAqL1xuY29uc3QgREVGQVVMVF9MT0dTX0RJUiA9IGpvaW4oQ29uZmlnLkxPR1NfRElSLCBcImdhbWVsb2dzL1wiKTtcblxuLyoqIFJlcHJlc2VudHMgaW5mb3JtYXRpb24gYWJvdXQgYW4gdW5sb2FkZWQgZ2FtZWxvZyAqL1xuZXhwb3J0IGludGVyZmFjZSBJR2FtZWxvZ0luZm8ge1xuICAgIC8qKlxuICAgICAqIFRoZSBmaWxlbmFtZSBvZiB0aGUgZ2FtZWxvZyB0aGlzIGluZm8gaXMgYWJvdXQsIHVzZSBpdCB0byBsb2FkIHRoZVxuICAgICAqIGVudGlyZSBnYW1lbG9nLlxuICAgICAqL1xuICAgIGZpbGVuYW1lOiBzdHJpbmc7XG5cbiAgICAvKiogVGhlIGVwb2NoIHRpbWUgdGhlIGdhbWVsb2cgd2FzIHdyaXR0ZW4gKi9cbiAgICBlcG9jaDogbnVtYmVyO1xuXG4gICAgLyoqIFRoZSBnYW1lIHNlc3Npb24gaWQgdGhpcyBnYW1lbG9nIGxvZ2dlZCAqL1xuICAgIHNlc3Npb246IHN0cmluZztcblxuICAgIC8qKiBUaGUgbmFtZSBvZiB0aGUgZ2FtZSB0aGlzIGdhbWVsb2cgaXMgZm9yICovXG4gICAgZ2FtZU5hbWU6IHN0cmluZztcblxuICAgIC8qKiBUaGUgdXJpIHRvIHRoaXMgZ2FtZWxvZyBvbiB0aGlzIGluc3RhbmNlICovXG4gICAgdXJpOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdXJsIHRvIHRoZSB2aXN1YWxpemVyIHRoYXQgY2FuIHBsYXkgdGhpcyBnYW1lbG9nLCBpZiB3ZSBrbm93IHRoZVxuICAgICAqIHZpc3VhbGl6ZXIuXG4gICAgICovXG4gICAgdmlzdWFsaXplclVybD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSBtYW5hZ2VyIHRoYXQgYXR0YWNoZXMgdG8gYSBkaXJlY3RvcnkgYW5kIG1hbmFnZXMgY3JlYXRpbmcgYW5kXG4gKiByZWFkaW5nIGdhbWUgbG9ncyBpbiB0aGF0IGRpcmVjdG9yeS5cbiAqL1xuZXhwb3J0IGNsYXNzIEdhbWVsb2dNYW5hZ2VyIHtcbiAgICAvLyBzdGF0ZS1mdWxsIHBhcnQgb2YgdGhlIGNsYXNzXG5cbiAgICAvKiogQ2FjaGVkIGluZm8gYWJvdXQgYWxsIHRoZSBnYW1lbG9ncyBzaXR0aW5nIG9uIGRpc2suICovXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVsb2dJbmZvczogSUdhbWVsb2dJbmZvW10gPSBbXTtcblxuICAgIC8qKiBUaGUgc2V0IG9mIGZpbGVuYW1lcyB3ZSBhcmUgY3VycmVudGx5IHdyaXRpbmcgdG8gdGhlIGRpc2suICovXG4gICAgcHJpdmF0ZSBmaWxlbmFtZXNXcml0aW5nID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBhIHNpbmdsZSBzb3VyY2UgdG8gbWFuYWdlIGdhbWUgbG9ncyBvbiB0aGlzIHRocmVhZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBnYW1lbG9nRGlyZWN0b3J5IC0gQW4gb3B0aW9uYWwgb3ZlcnJpZGUgb24gd2hlcmUgdG8gb3V0cHV0XG4gICAgICogZ2FtZWxvZ3MgdG8uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8qKiBUaGUgZGlyZWN0b3J5IHdoZXJlIHRoaXMgd2lsbCBzYXZlIGdhbWVsb2cgZmlsZXMgdG8gKi9cbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGdhbWVsb2dEaXJlY3Rvcnk6IHN0cmluZyA9IERFRkFVTFRfTE9HU19ESVIsXG4gICAgKSB7XG4gICAgICAgIGlmIChDb25maWcuTE9BRF9FWElTVElOR19HQU1FTE9HUykge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplR2FtZWxvZ0luZm9zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZ2FtZWxvZyBmb3IgdGhlIGdhbWUgaW4gdGhlIGRpcmVjdG9yeSBzZXQgZHVyaW5nIGluaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZ2FtZWxvZyAtIFRoZSBnYW1lbG9nIHdoaWNoIHNob3VsZCBiZSBzZXJpYWxpemUtYWJsZSB0byBqc29uXG4gICAgICogcmVwcmVzZW50YXRpb24gb2YgdGhlIGdhbWVsb2cuXG4gICAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGZpbGVuYW1lIHdyaXR0ZW4uXG4gICAgICovXG4gICAgcHVibGljIGxvZyhnYW1lbG9nOiBJbW11dGFibGU8SUdhbWVsb2c+KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgICAgY29uc3Qgc2VyaWFsaXplZCA9IEpTT04uc3RyaW5naWZ5KGdhbWVsb2cpO1xuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGZpbGVuYW1lRm9yKGdhbWVsb2cpO1xuXG4gICAgICAgIC8vIGNhY2hlIGdhbWVsb2cgaW5mb1xuICAgICAgICB0aGlzLmdhbWVsb2dJbmZvcy5wdXNoKHtcbiAgICAgICAgICAgIGVwb2NoOiBnYW1lbG9nLmVwb2NoLFxuICAgICAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgICAgICBnYW1lTmFtZTogZ2FtZWxvZy5nYW1lTmFtZSxcbiAgICAgICAgICAgIHNlc3Npb246IGdhbWVsb2cuZ2FtZVNlc3Npb24sXG4gICAgICAgICAgICB1cmk6IGdldFVSTChmaWxlbmFtZSksXG4gICAgICAgICAgICB2aXN1YWxpemVyVXJsOiBnZXRWaXN1YWxpemVyVVJMKGZpbGVuYW1lKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgd3JpdGVTdGVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKFxuICAgICAgICAgICAgdGhpcy5nYW1lbG9nRGlyZWN0b3J5ICsgZmlsZW5hbWUgKyBHQU1FTE9HX0VYVEVOU0lPTixcbiAgICAgICAgICAgIFwidXRmOFwiLFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBnemlwID0gY3JlYXRlR3ppcCgpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBnemlwLm9uKFwiZXJyb3JcIiwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsZW5hbWVzV3JpdGluZy5hZGQoZmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBnemlwLm9uKFwiZmluaXNoXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGVuYW1lc1dyaXRpbmcuZGVsZXRlKGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGZpbGVuYW1lKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBnemlwLnBpcGUod3JpdGVTdGVhbSk7XG4gICAgICAgICAgICBnemlwLndyaXRlKHNlcmlhbGl6ZWQpO1xuICAgICAgICAgICAgZ3ppcC5lbmQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgZmlyc3QgZ2FtZWxvZyBtYXRjaGluZyB0aGUgZmlsZW5hbWUsIHdpdGhvdXQgdGhlIGV4dGVuc2lvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWxlbmFtZSAtIFRoZSBiYXNlIGZpbGVuYW1lICh3aXRob3V0IGdhbWVsb2cgZXh0ZW5zaW9uKSB5b3Ugd2FudFxuICAgICAqIGluIExPR1NfRElSL2dhbWVsb2dzL1xuICAgICAqIEByZXR1cm5zIC0gQSBwcm9taXNlIHRvIGEgZ2FtZWxvZyBtYXRjaGluZyBwYXNzZWQgaW4gcGFyYW1ldGVycywgb3JcbiAgICAgKiB1bmRlZmluZWQgaWYgbm8gZ2FtZWxvZy4gc2Vjb25kIGFyZyBpcyBlcnJvci5cbiAgICAgKi9cbiAgICBwdWJsaWMgYXN5bmMgZ2V0R2FtZWxvZyhmaWxlbmFtZTogc3RyaW5nKTogUHJvbWlzZTxCdWZmZXIgfCB1bmRlZmluZWQ+IHtcbiAgICAgICAgY29uc3QgZ2FtZWxvZ1BhdGggPSBhd2FpdCB0aGlzLmNoZWNrR2FtZWxvZyhmaWxlbmFtZSk7XG4gICAgICAgIGlmICghZ2FtZWxvZ1BhdGgpIHtcbiAgICAgICAgICAgIC8vIGdhbWVsb2cgZG9lc24ndCBleGlzdCwgc28gd2UgaGF2ZSBub3RoaW5nIHRvIHJldHVyblxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBndW56aXBGaWxlKGdhbWVsb2dQYXRoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVzIHRoZSBmaXJzdCBnYW1lbG9nIG1hdGNoaW5nIHRoZSBmaWxlbmFtZSwgd2l0aG91dCB0aGUgZXh0ZW5zaW9uXG4gICAgICogQHBhcmFtIGZpbGVuYW1lIHRoZSBiYXNlIGZpbGVuYW1lICh3aXRob3V0IGdhbWVsb2cgZXh0ZW5zaW9uKSB5b3Ugd2FudFxuICAgICAqIGluIExPR1NfRElSL2dhbWVsb2dzLlxuICAgICAqIEByZXR1cm5zIHRoZSBhIGJvb2xlYW4gaWYgaXQgd2FzIHN1Y2Nlc3NmdWxseSBkZWxldGVkXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIGRlbGV0ZUdhbWVsb2coZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBjb25zdCBnYW1lbG9nUGF0aCA9IGF3YWl0IHRoaXMuY2hlY2tHYW1lbG9nKGZpbGVuYW1lKTtcblxuICAgICAgICBpZiAoIWdhbWVsb2dQYXRoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmZvc0luZGV4ID0gdGhpcy5nYW1lbG9nSW5mb3MuZmluZEluZGV4KFxuICAgICAgICAgICAgKGUpID0+IGUuZmlsZW5hbWUgPT09IGZpbGVuYW1lLFxuICAgICAgICApO1xuICAgICAgICBpZiAoaW5mb3NJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGF0IGdhbWVsb2cgZnJvbSBvdXIgaW5mb3MuXG4gICAgICAgICAgICB0aGlzLmdhbWVsb2dJbmZvcy5zcGxpY2UoaW5mb3NJbmRleCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbHNlIGl0IGRvZXMgZXhpc3QsIHNvIGRlbGV0ZSBpdFxuICAgICAgICBhd2FpdCBmcy51bmxpbmsoZ2FtZWxvZ1BhdGgpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEF0dGVtcHRzIHRvIGdldCB0aGUgcmVhZCBzdHJlYW0gZm9yIHRoZSBnYW1lbG9nJ3MgZmlsZW5hbWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmlsZW5hbWUgLSBUaGUgZmlsZW5hbWUgb2YgdGhlIGdhbWVsb2cgdG8gZ2V0XG4gICAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIGdhbWVsb2cncyByZWFkIHN0cmVhbSBpZiBmb3VuZCxcbiAgICAgKiBvdGhlcndpc2UgcmVzb2x2ZXMgdG8gdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBhc3luYyBnZXRHYW1lbG9nRmlsZVN0cmVhbShcbiAgICAgICAgZmlsZW5hbWU6IHN0cmluZyxcbiAgICApOiBQcm9taXNlPHVuZGVmaW5lZCB8IGZzLlJlYWRTdHJlYW0+IHtcbiAgICAgICAgY29uc3QgbGFzdEdhbWVJbmZvID0gdGhpcy5nYW1lbG9nSW5mb3NbdGhpcy5nYW1lbG9nSW5mb3MubGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lVG9DaGVjayA9IChmaWxlbmFtZSA9PT0gXCJsYXRlc3RcIiAmJiBsYXN0R2FtZUluZm8pXG4gICAgICAgICAgICA/IGxhc3RHYW1lSW5mby5maWxlbmFtZVxuICAgICAgICAgICAgOiBmaWxlbmFtZTtcblxuICAgICAgICBjb25zdCBwYXRoID0gYXdhaXQgdGhpcy5jaGVja0dhbWVsb2coZmlsZW5hbWVUb0NoZWNrKTtcblxuICAgICAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmcy5jcmVhdGVSZWFkU3RyZWFtKHBhdGgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgQUxMIHRoZSBnYW1lbG9ncyBpbiBMT0dTX0RJUi9nYW1lbG9ncy5cbiAgICAgKiBUaGUgZ2FtZWxvZ3MgYXJlIG5vdCBjb21wbGV0ZSwgYnV0IHJhdGhlciBhIFwic2hhbGxvd1wiIGdhbWVsb2cuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgZm9yIHRoZSBsaXN0IG9mIGdhbWVsb2dzIGluZm9ybWF0aW9uLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgaW5pdGlhbGl6ZUdhbWVsb2dJbmZvcygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmcy5yZWFkZGlyKHRoaXMuZ2FtZWxvZ0RpcmVjdG9yeSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBmaWxlbmFtZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZpbGVuYW1lc1dyaXRpbmcuaGFzKGZpbGVuYW1lKSAmJlxuICAgICAgICAgICAgICAgIGZpbGVuYW1lLmVuZHNXaXRoKEdBTUVMT0dfRVhURU5TSU9OKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlbiBpdCBpcyBhIGdhbWVsb2dcbiAgICAgICAgICAgICAgICBjb25zdCBiYXNlRmlsZW5hbWUgPSBiYXNlbmFtZShmaWxlbmFtZSwgR0FNRUxPR19FWFRFTlNJT04pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHNwbGl0ID0gYmFzZUZpbGVuYW1lLnNwbGl0KFwiLVwiKTtcblxuICAgICAgICAgICAgICAgIGlmIChzcGxpdC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlbiB3ZSBjYW4gZmlndXJlIG91dCB3aGF0IHRoZSBnYW1lIGlzIGJhc2VkIG9uIGp1c3RcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGZpbGVuYW1lLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbZ2FtZU5hbWUsIHNlc3Npb24sIGVwb2NoU3RyaW5nXSA9IHNwbGl0O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcG9jaCA9IE51bWJlcihzdHJpbmdUb01vbWVudChlcG9jaFN0cmluZykpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZWxvZ0luZm9zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXBvY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWVOYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHVyaTogZ2V0VVJMKGJhc2VGaWxlbmFtZSwgZmFsc2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzdWFsaXplclVybDogZ2V0VmlzdWFsaXplclVSTChmaWxlbmFtZSksXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2FtZWxvZ0luZm9zLnNvcnQoKGEsIGIpID0+IGEuZXBvY2ggLSBiLmVwb2NoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdG8gc2VlIGlmIHRoZSBmaWxlbmFtZSBtYXBzIHRvIGEgZ2FtZWxvZyBvbiBkaXNrLlxuICAgICAqXG4gICAgICogQHBhcmFtIGZpbGVuYW1lIC0gVGhlIGJhc2UgZmlsZW5hbWUgKHdpdGhvdXQgZ2FtZWxvZyBleHRlbnNpb24pIHlvdSB3YW50XG4gICAgICogaW4gTE9HU19ESVIvZ2FtZWxvZ3MvLlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSBvZiB0aGUgcGF0aCB0byB0aGUgZ2FtZSBsb2cgaWYgaXQgZXhpc3RzLCB1bmRlZmluZWRcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBjaGVja0dhbWVsb2coZmlsZW5hbWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIGNvbnN0IGZpbGVuYW1lV2l0aEV4dGVuc2lvbiA9IGZpbGVuYW1lLmVuZHNXaXRoKEdBTUVMT0dfRVhURU5TSU9OKVxuICAgICAgICAgICAgPyBmaWxlbmFtZVxuICAgICAgICAgICAgOiAoZmlsZW5hbWUgKyBHQU1FTE9HX0VYVEVOU0lPTik7XG5cbiAgICAgICAgY29uc3QgZ2FtZWxvZ1BhdGggPSBqb2luKHRoaXMuZ2FtZWxvZ0RpcmVjdG9yeSwgZmlsZW5hbWVXaXRoRXh0ZW5zaW9uKTtcblxuICAgICAgICBpZiAodGhpcy5maWxlbmFtZXNXcml0aW5nLmhhcyhmaWxlbmFtZSkpIHtcbiAgICAgICAgICAgIC8vIGl0IGlzIG9uIGRpc2ssIGJ1dCBub3QgYmVpbmcgd3JpdHRlbiB5ZXQsIHNvIGl0J3Mgbm90IHJlYWR5XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgZnMuc3RhdChnYW1lbG9nUGF0aCk7XG5cbiAgICAgICAgICAgIHJldHVybiBzdGF0cy5pc0ZpbGUoKVxuICAgICAgICAgICAgICAgID8gZ2FtZWxvZ1BhdGhcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBUaGUgZmlsZSBkb2Vzbid0IGV4aXN0LCBvciBtYXkgaGF2ZSBwZXJtaXNzaW9uIGlzc3VlcztcbiAgICAgICAgICAgIC8vIGVpdGhlciB3YXkgdGhhdCBkb2Vzbid0IGNvdW50IHNvIHRoaXMgcGF0aCBoYXMgbm90aGluZyBmb3IgdXMuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=