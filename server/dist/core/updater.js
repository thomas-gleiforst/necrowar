"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const ts_typed_events_1 = require("ts-typed-events");
const utils_1 = require("~/utils");
const logger_1 = require("./logger");
const UPDATE_INTERVAL = 1000; // 1 sec in ms
const GITHUB_URL = "https://api.github.com/repos/siggame/cerveau/commits";
// tslint:disable:no-multiline-string - we use them here
/** Manages and automatically updates this repository */
class Updater {
    /** Creates a new Updater to check for updates */
    constructor() {
        /** The events that this Updater emits */
        this.events = ts_typed_events_1.events({
            updateFound: new ts_typed_events_1.Signal(),
        });
        /** If an update was found. */
        this.updateFound = false;
        // Thanks to: https://stackoverflow.com/questions/34518389/get-hash-of-most-recent-git-commit-in-node
        child_process_1.exec("git rev-parse HEAD", async (err, stdout) => {
            if (err) {
                logger_1.logger.error(`Updater cannot determine the current version of this Cerveau instance.
Is this a git repo with git installed on your system?`);
                return;
            }
            this.sha = stdout.toLowerCase().trim();
            this.interval = setInterval(async () => {
                await this.intervalCheck();
            }, UPDATE_INTERVAL);
            // do it immediately too
            this.intervalCheck();
        });
    }
    /**
     * Invoked by the interval to check for updates, and if found stops
     * checking.
     *
     * @returns A promise that resolves after the check is done.
     */
    async intervalCheck() {
        const warning = await this.doCheck();
        if (warning) {
            logger_1.logger.warn(warning);
            if (this.interval) {
                clearInterval(this.interval);
            }
        }
        if (this.updateFound) {
            this.events.updateFound.emit();
        }
    }
    /**
     * Does the actual check for updates via request to GitHub. If an actual
     * update is found the `updateFound` parameter on this instance will be set
     * to true.
     *
     * @returns A promise that resolves with a string warning to log,
     * otherwise undefined if no warnings are we should continue checking for
     * updates.
     */
    async doCheck() {
        let githubResponse = "";
        try {
            githubResponse = await utils_1.httpRequest(GITHUB_URL);
        }
        catch (err) {
            return `Error with GitHub API. Request failed: ${err}
Updater shuting down.`;
        }
        const githubData = utils_1.safelyParseJSON(githubResponse);
        if (githubData instanceof Error) {
            return `Error parsing GitHub data: ${githubData}
Updater shuting down.`;
        }
        // If we got here, we got the data from GitHub, and it parsed correctly
        if (!githubData || !Array.isArray(githubData)) {
            return `GitHub data appears malformed.
Updater shuting down.`;
        }
        const first = githubData && Array.isArray(githubData) && githubData[0];
        if (!first) {
            return `GitHub data appears malformed.
Updater shuting down.`;
        }
        if (!utils_1.isObject(first) || Array.isArray(first) || !first.sha) {
            return `GitHub data appears malformed.
Updater shuting down.`;
        }
        const headSHA = String(first.sha).toLowerCase().trim(); // tslint:disable-line:no-unsafe-any
        if (this.sha !== headSHA) {
            this.updateFound = true;
            return `🆕 Update Found! 🆕
Your current Cerveau commit:           ${this.sha}
GitHub's most recent Cerveau commit:   ${headSHA}

Please run 'git pull' to update.
Then start it back up to finalize the update.`;
        }
        // If we got here it appears to be up to date.
    }
}
exports.Updater = Updater;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb3JlL3VwZGF0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBcUM7QUFDckMscURBQWlEO0FBQ2pELG1DQUFpRTtBQUNqRSxxQ0FBa0M7QUFFbEMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsY0FBYztBQUM1QyxNQUFNLFVBQVUsR0FBRyxzREFBc0QsQ0FBQztBQUUxRSx3REFBd0Q7QUFFeEQsd0RBQXdEO0FBQ3hELE1BQWEsT0FBTztJQWVoQixpREFBaUQ7SUFDakQ7UUFmQSx5Q0FBeUM7UUFDekIsV0FBTSxHQUFHLHdCQUFNLENBQUM7WUFDNUIsV0FBVyxFQUFFLElBQUksd0JBQU0sRUFBRTtTQUM1QixDQUFDLENBQUM7UUFRSCw4QkFBOEI7UUFDdEIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFJakMscUdBQXFHO1FBQ3JHLG9CQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM3QyxJQUFJLEdBQUcsRUFBRTtnQkFDTCxlQUFNLENBQUMsS0FBSyxDQUM1QjtzREFDc0QsQ0FDckMsQ0FBQztnQkFFRixPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUV2QyxJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDbkMsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDL0IsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBRXBCLHdCQUF3QjtZQUN4QixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxLQUFLLENBQUMsYUFBYTtRQUN2QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVyQyxJQUFJLE9BQU8sRUFBRTtZQUNULGVBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNmLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDaEM7U0FDSjtRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNsQztJQUNMLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNLLEtBQUssQ0FBQyxPQUFPO1FBQ2pCLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztRQUN4QixJQUFJO1lBQ0EsY0FBYyxHQUFHLE1BQU0sbUJBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNsRDtRQUNELE9BQU8sR0FBRyxFQUFFO1lBQ1IsT0FBTywwQ0FBMEMsR0FBRztzQkFDMUMsQ0FBQztTQUNkO1FBRUQsTUFBTSxVQUFVLEdBQUcsdUJBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuRCxJQUFJLFVBQVUsWUFBWSxLQUFLLEVBQUU7WUFDN0IsT0FBTyw4QkFBOEIsVUFBVTtzQkFDckMsQ0FBQztTQUNkO1FBRUQsdUVBQXVFO1FBQ3ZFLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzNDLE9BQU87c0JBQ0csQ0FBQztTQUNkO1FBRUQsTUFBTSxLQUFLLEdBQUcsVUFBVSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDUixPQUFPO3NCQUNHLENBQUM7U0FDZDtRQUVELElBQUksQ0FBQyxnQkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ3hELE9BQU87c0JBQ0csQ0FBQztTQUNkO1FBRUQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLG9DQUFvQztRQUU1RixJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssT0FBTyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBRXhCLE9BQU87eUNBQ3NCLElBQUksQ0FBQyxHQUFHO3lDQUNSLE9BQU87Ozs4Q0FHRixDQUFDO1NBQ3RDO1FBQ0QsOENBQThDO0lBQ2xELENBQUM7Q0FDSjtBQXJIRCwwQkFxSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleGVjIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcbmltcG9ydCB7IGV2ZW50cywgU2lnbmFsIH0gZnJvbSBcInRzLXR5cGVkLWV2ZW50c1wiO1xuaW1wb3J0IHsgaHR0cFJlcXVlc3QsIGlzT2JqZWN0LCBzYWZlbHlQYXJzZUpTT04gfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4vbG9nZ2VyXCI7XG5cbmNvbnN0IFVQREFURV9JTlRFUlZBTCA9IDEwMDA7IC8vIDEgc2VjIGluIG1zXG5jb25zdCBHSVRIVUJfVVJMID0gXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3NpZ2dhbWUvY2VydmVhdS9jb21taXRzXCI7XG5cbi8vIHRzbGludDpkaXNhYmxlOm5vLW11bHRpbGluZS1zdHJpbmcgLSB3ZSB1c2UgdGhlbSBoZXJlXG5cbi8qKiBNYW5hZ2VzIGFuZCBhdXRvbWF0aWNhbGx5IHVwZGF0ZXMgdGhpcyByZXBvc2l0b3J5ICovXG5leHBvcnQgY2xhc3MgVXBkYXRlciB7XG4gICAgLyoqIFRoZSBldmVudHMgdGhhdCB0aGlzIFVwZGF0ZXIgZW1pdHMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRzID0gZXZlbnRzKHtcbiAgICAgICAgdXBkYXRlRm91bmQ6IG5ldyBTaWduYWwoKSxcbiAgICB9KTtcblxuICAgIC8qKiBPdXIgY3VycmVudCBzaGEgaGFzaCBvZiB0aGUgZ2l0IHJlcG8gd2UgYXJlIHJ1bm5pbmcgaW5zaWRlIG9mLiAqL1xuICAgIHByaXZhdGUgc2hhOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvKiogVGhlIGludGVydmFsIGNoZWNraW5nIGZvciB1cGRhdGVzIChzbyB3ZSBjYW4gY2xlYXIgaXQgaWYgbmVlZCBiZSkuICovXG4gICAgcHJpdmF0ZSBpbnRlcnZhbDogTm9kZUpTLlRpbWVyIHwgdW5kZWZpbmVkO1xuXG4gICAgLyoqIElmIGFuIHVwZGF0ZSB3YXMgZm91bmQuICovXG4gICAgcHJpdmF0ZSB1cGRhdGVGb3VuZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIENyZWF0ZXMgYSBuZXcgVXBkYXRlciB0byBjaGVjayBmb3IgdXBkYXRlcyAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gVGhhbmtzIHRvOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDUxODM4OS9nZXQtaGFzaC1vZi1tb3N0LXJlY2VudC1naXQtY29tbWl0LWluLW5vZGVcbiAgICAgICAgZXhlYyhcImdpdCByZXYtcGFyc2UgSEVBRFwiLCBhc3luYyAoZXJyLCBzdGRvdXQpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG5gVXBkYXRlciBjYW5ub3QgZGV0ZXJtaW5lIHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhpcyBDZXJ2ZWF1IGluc3RhbmNlLlxuSXMgdGhpcyBhIGdpdCByZXBvIHdpdGggZ2l0IGluc3RhbGxlZCBvbiB5b3VyIHN5c3RlbT9gLFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc2hhID0gc3Rkb3V0LnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuXG4gICAgICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJ2YWxDaGVjaygpO1xuICAgICAgICAgICAgfSwgVVBEQVRFX0lOVEVSVkFMKTtcblxuICAgICAgICAgICAgLy8gZG8gaXQgaW1tZWRpYXRlbHkgdG9vXG4gICAgICAgICAgICB0aGlzLmludGVydmFsQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW52b2tlZCBieSB0aGUgaW50ZXJ2YWwgdG8gY2hlY2sgZm9yIHVwZGF0ZXMsIGFuZCBpZiBmb3VuZCBzdG9wc1xuICAgICAqIGNoZWNraW5nLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgdGhlIGNoZWNrIGlzIGRvbmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBpbnRlcnZhbENoZWNrKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCB3YXJuaW5nID0gYXdhaXQgdGhpcy5kb0NoZWNrKCk7XG5cbiAgICAgICAgaWYgKHdhcm5pbmcpIHtcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy51cGRhdGVGb3VuZCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHMudXBkYXRlRm91bmQuZW1pdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyB0aGUgYWN0dWFsIGNoZWNrIGZvciB1cGRhdGVzIHZpYSByZXF1ZXN0IHRvIEdpdEh1Yi4gSWYgYW4gYWN0dWFsXG4gICAgICogdXBkYXRlIGlzIGZvdW5kIHRoZSBgdXBkYXRlRm91bmRgIHBhcmFtZXRlciBvbiB0aGlzIGluc3RhbmNlIHdpbGwgYmUgc2V0XG4gICAgICogdG8gdHJ1ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdpdGggYSBzdHJpbmcgd2FybmluZyB0byBsb2csXG4gICAgICogb3RoZXJ3aXNlIHVuZGVmaW5lZCBpZiBubyB3YXJuaW5ncyBhcmUgd2Ugc2hvdWxkIGNvbnRpbnVlIGNoZWNraW5nIGZvclxuICAgICAqIHVwZGF0ZXMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBkb0NoZWNrKCk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIGxldCBnaXRodWJSZXNwb25zZSA9IFwiXCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBnaXRodWJSZXNwb25zZSA9IGF3YWl0IGh0dHBSZXF1ZXN0KEdJVEhVQl9VUkwpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBgRXJyb3Igd2l0aCBHaXRIdWIgQVBJLiBSZXF1ZXN0IGZhaWxlZDogJHtlcnJ9XG5VcGRhdGVyIHNodXRpbmcgZG93bi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2l0aHViRGF0YSA9IHNhZmVseVBhcnNlSlNPTihnaXRodWJSZXNwb25zZSk7XG4gICAgICAgIGlmIChnaXRodWJEYXRhIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBgRXJyb3IgcGFyc2luZyBHaXRIdWIgZGF0YTogJHtnaXRodWJEYXRhfVxuVXBkYXRlciBzaHV0aW5nIGRvd24uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGdvdCBoZXJlLCB3ZSBnb3QgdGhlIGRhdGEgZnJvbSBHaXRIdWIsIGFuZCBpdCBwYXJzZWQgY29ycmVjdGx5XG4gICAgICAgIGlmICghZ2l0aHViRGF0YSB8fCAhQXJyYXkuaXNBcnJheShnaXRodWJEYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIGBHaXRIdWIgZGF0YSBhcHBlYXJzIG1hbGZvcm1lZC5cblVwZGF0ZXIgc2h1dGluZyBkb3duLmA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBmaXJzdCA9IGdpdGh1YkRhdGEgJiYgQXJyYXkuaXNBcnJheShnaXRodWJEYXRhKSAmJiBnaXRodWJEYXRhWzBdO1xuICAgICAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAgICAgICByZXR1cm4gYEdpdEh1YiBkYXRhIGFwcGVhcnMgbWFsZm9ybWVkLlxuVXBkYXRlciBzaHV0aW5nIGRvd24uYDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNPYmplY3QoZmlyc3QpIHx8IEFycmF5LmlzQXJyYXkoZmlyc3QpIHx8ICFmaXJzdC5zaGEpIHtcbiAgICAgICAgICAgIHJldHVybiBgR2l0SHViIGRhdGEgYXBwZWFycyBtYWxmb3JtZWQuXG5VcGRhdGVyIHNodXRpbmcgZG93bi5gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaGVhZFNIQSA9IFN0cmluZyhmaXJzdC5zaGEpLnRvTG93ZXJDYXNlKCkudHJpbSgpOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLXVuc2FmZS1hbnlcblxuICAgICAgICBpZiAodGhpcy5zaGEgIT09IGhlYWRTSEEpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRm91bmQgPSB0cnVlO1xuXG4gICAgICAgICAgICByZXR1cm4gYPCfhpUgVXBkYXRlIEZvdW5kISDwn4aVXG5Zb3VyIGN1cnJlbnQgQ2VydmVhdSBjb21taXQ6ICAgICAgICAgICAke3RoaXMuc2hhfVxuR2l0SHViJ3MgbW9zdCByZWNlbnQgQ2VydmVhdSBjb21taXQ6ICAgJHtoZWFkU0hBfVxuXG5QbGVhc2UgcnVuICdnaXQgcHVsbCcgdG8gdXBkYXRlLlxuVGhlbiBzdGFydCBpdCBiYWNrIHVwIHRvIGZpbmFsaXplIHRoZSB1cGRhdGUuYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBnb3QgaGVyZSBpdCBhcHBlYXJzIHRvIGJlIHVwIHRvIGRhdGUuXG4gICAgfVxufVxuIl19