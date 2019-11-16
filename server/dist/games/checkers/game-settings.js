"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Checkers game.
 */
class CheckersGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Checkers game specific settings
            // <<-- Creer-Merge: schema -->>
            /** The width of the board (in tiles). */
            boardWidth: {
                default: 8,
                min: 2,
                description: "The width of the board (in tiles).",
            },
            /** The height of the board (in tiles). */
            boardHeight: {
                default: 8,
                min: 2,
                description: "The height of the board (in tiles).",
            },
            // <<-- /Creer-Merge: schema -->>
            // Base settings
            playerStartingTime: {
                // <<-- Creer-Merge: player-starting-time -->>
                default: 6e10,
                // <<-- /Creer-Merge: player-starting-time -->>
                min: 0,
                description: "The starting time (in ns) for each player.",
            },
            // Turn based settings
            timeAddedPerTurn: {
                // <<-- Creer-Merge: time-added-per-turn -->>
                default: 1e9,
                // <<-- /Creer-Merge: time-added-per-turn -->>
                min: 0,
                description: "The amount of time (in nano-seconds) to add after each player performs a turn.",
            },
            maxTurns: {
                // <<-- Creer-Merge: max-turns -->>
                default: 200,
                // <<-- /Creer-Merge: max-turns -->>
                min: 1,
                description: "The maximum number of turns before the game is force ended and a winner is determined.",
            },
        });
    }
    /**
     * Try to invalidate all the game settings here, so invalid values do not
     * reach the game.
     * @param someSettings A subset of settings that will be tested
     * @returns An error if the settings fail to validate.
     */
    invalidate(someSettings) {
        const invalidated = super.invalidate(someSettings);
        if (invalidated instanceof Error) {
            return invalidated;
        }
        const settings = { ...this.values, ...someSettings, ...invalidated };
        // <<-- Creer-Merge: invalidate -->>
        // Write logic here to check the values in `settings`. If there is a
        // problem with the values a player sent, return an error with a string
        // describing why their value(s) are wrong
        // <<-- /Creer-Merge: invalidate -->>
        return settings;
    }
}
exports.CheckersGameSettingsManager = CheckersGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jaGVja2Vycy9nYW1lLXNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEseUJBQWlDO0FBRWpDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSwyQkFBNEIsU0FBUSxjQUFXLENBQUMsWUFBWTtJQUNyRTs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsd0VBQXdFO1lBQ3hFLGtDQUFrQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSyxJQUFZLENBQUMsTUFBTSxDQUFDO1lBRXpDLGtDQUFrQztZQUNsQyxnQ0FBZ0M7WUFFcEMseUNBQXlDO1lBQ3JDLFVBQVUsRUFBRTtnQkFDUixPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsb0NBQW9DO2FBQ3BEO1lBRUQsMENBQTBDO1lBQzFDLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUscUNBQXFDO2FBQ3JEO1lBRUQsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7U0FFSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBT0Q7Ozs7O09BS0c7SUFDTyxVQUFVLENBQUMsWUFBMkI7UUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsWUFBWSxLQUFLLEVBQUU7WUFDOUIsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRXJFLG9DQUFvQztRQUVwQyxvRUFBb0U7UUFDcEUsdUVBQXVFO1FBQ3ZFLDBDQUEwQztRQUUxQyxxQ0FBcUM7UUFFckMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBdkZELGtFQXVGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzRnJvbVNjaGVtYSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgc2V0dGluZ3MgbWFuYWdlciBmb3IgdGhlIENoZWNrZXJzIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGVja2Vyc0dhbWVTZXR0aW5nc01hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lU2V0dGluZ3Mge1xuICAgIC8qKlxuICAgICAqIFRoaXMgZGVzY3JpYmVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdhbWUgc2V0dGluZ3MsIGFuZCBpcyB1c2VkIHRvXG4gICAgICogZ2VuZXJhdGUgdGhlIHZhbHVlcywgYXMgd2VsbCBhcyBiYXNpYyB0eXBlIGFuZCByYW5nZSBjaGVja2luZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNjaGVtYSgpIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTp0eXBlZGVmXG4gICAgICAgIHJldHVybiB0aGlzLm1ha2VTY2hlbWEoe1xuICAgICAgICAgICAgLy8gSEFDSzogYHN1cGVyYCBzaG91bGQgd29yay4gYnV0IHNjaGVtYSBpcyB1bmRlZmluZWQgb24gaXQgYXQgcnVuIHRpbWUuXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAuLi4oc3VwZXIuc2NoZW1hIHx8ICh0aGlzIGFzIGFueSkuc2NoZW1hKSxcblxuICAgICAgICAgICAgLy8gQ2hlY2tlcnMgZ2FtZSBzcGVjaWZpYyBzZXR0aW5nc1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2NoZW1hIC0tPj5cblxuICAgICAgICAvKiogVGhlIHdpZHRoIG9mIHRoZSBib2FyZCAoaW4gdGlsZXMpLiAqL1xuICAgICAgICAgICAgYm9hcmRXaWR0aDoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDgsXG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB3aWR0aCBvZiB0aGUgYm9hcmQgKGluIHRpbGVzKS5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKiBUaGUgaGVpZ2h0IG9mIHRoZSBib2FyZCAoaW4gdGlsZXMpLiAqL1xuICAgICAgICAgICAgYm9hcmRIZWlnaHQ6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA4LFxuICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgaGVpZ2h0IG9mIHRoZSBib2FyZCAoaW4gdGlsZXMpLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIC8vIEJhc2Ugc2V0dGluZ3NcbiAgICAgICAgICAgIHBsYXllclN0YXJ0aW5nVGltZToge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHBsYXllci1zdGFydGluZy10aW1lIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA2ZTEwLCAvLyAxIG1pbiBpbiBuc1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBzdGFydGluZyB0aW1lIChpbiBucykgZm9yIGVhY2ggcGxheWVyLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gVHVybiBiYXNlZCBzZXR0aW5nc1xuICAgICAgICAgICAgdGltZUFkZGVkUGVyVHVybjoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHRpbWUtYWRkZWQtcGVyLXR1cm4gLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDFlOSwgLy8gMSBzZWMgaW4gbnMsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHRpbWUtYWRkZWQtcGVyLXR1cm4gLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIHRpbWUgKGluIG5hbm8tc2Vjb25kcykgdG8gYWRkIGFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGEgdHVybi5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXhUdXJuczoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1heC10dXJucyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYmVmb3JlIHRoZSBnYW1lIGlzIGZvcmNlIGVuZGVkIGFuZCBhIHdpbm5lciBpcyBkZXRlcm1pbmVkLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCB2YWx1ZXMgZm9yIHRoZSBnYW1lJ3Mgc2V0dGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgdmFsdWVzITogU2V0dGluZ3NGcm9tU2NoZW1hPENoZWNrZXJzR2FtZVNldHRpbmdzTWFuYWdlcltcInNjaGVtYVwiXT47XG5cbiAgICAvKipcbiAgICAgKiBUcnkgdG8gaW52YWxpZGF0ZSBhbGwgdGhlIGdhbWUgc2V0dGluZ3MgaGVyZSwgc28gaW52YWxpZCB2YWx1ZXMgZG8gbm90XG4gICAgICogcmVhY2ggdGhlIGdhbWUuXG4gICAgICogQHBhcmFtIHNvbWVTZXR0aW5ncyBBIHN1YnNldCBvZiBzZXR0aW5ncyB0aGF0IHdpbGwgYmUgdGVzdGVkXG4gICAgICogQHJldHVybnMgQW4gZXJyb3IgaWYgdGhlIHNldHRpbmdzIGZhaWwgdG8gdmFsaWRhdGUuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGUoc29tZVNldHRpbmdzOiBVbmtub3duT2JqZWN0KTogVW5rbm93bk9iamVjdCB8IEVycm9yIHtcbiAgICAgICAgY29uc3QgaW52YWxpZGF0ZWQgPSBzdXBlci5pbnZhbGlkYXRlKHNvbWVTZXR0aW5ncyk7XG4gICAgICAgIGlmIChpbnZhbGlkYXRlZCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZGF0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHsgLi4udGhpcy52YWx1ZXMsIC4uLnNvbWVTZXR0aW5ncywgLi4uaW52YWxpZGF0ZWQgfTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICAvLyBXcml0ZSBsb2dpYyBoZXJlIHRvIGNoZWNrIHRoZSB2YWx1ZXMgaW4gYHNldHRpbmdzYC4gSWYgdGhlcmUgaXMgYVxuICAgICAgICAvLyBwcm9ibGVtIHdpdGggdGhlIHZhbHVlcyBhIHBsYXllciBzZW50LCByZXR1cm4gYW4gZXJyb3Igd2l0aCBhIHN0cmluZ1xuICAgICAgICAvLyBkZXNjcmliaW5nIHdoeSB0aGVpciB2YWx1ZShzKSBhcmUgd3JvbmdcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZSAtLT4+XG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzO1xuICAgIH1cbn1cbiJdfQ==