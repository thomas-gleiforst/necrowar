"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Spiders game.
 */
class SpidersGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Spiders game specific settings
            cutSpeed: {
                description: "The speed at which Cutters work to do cut Webs.",
                // <<-- Creer-Merge: cutSpeed -->>
                default: 2,
            },
            eggsScalar: {
                description: "Constant used to calculate how many eggs "
                    + "BroodMothers get on their owner's turns.",
                // <<-- Creer-Merge: eggsScalar -->>
                default: 0.10,
            },
            initialWebStrength: {
                description: "The starting strength for Webs.",
                // <<-- Creer-Merge: initialWebStrength -->>
                default: 5,
            },
            maxWebStrength: {
                description: "The maximum strength a web can be strengthened "
                    + "to.",
                // <<-- Creer-Merge: maxWebStrength -->>
                default: 15,
            },
            movementSpeed: {
                description: "The speed at which Spiderlings move on Webs.",
                // <<-- Creer-Merge: movementSpeed -->>
                default: 10,
            },
            spitSpeed: {
                description: "The speed at which Spitters work to spit new "
                    + "Webs.",
                // <<-- Creer-Merge: spitSpeed -->>
                default: 24,
            },
            weavePower: {
                description: "How much web strength is added or removed from "
                    + "Webs when they are weaved.",
                // <<-- Creer-Merge: weavePower -->>
                default: 1,
            },
            weaveSpeed: {
                description: "The speed at which Weavers work to do "
                    + "strengthens and weakens on Webs.",
                // <<-- Creer-Merge: weaveSpeed -->>
                default: 16,
            },
            // <<-- Creer-Merge: schema -->>
            // you can add more settings here, e.g.:
            /*
            someVariableLikeUnitHealth: {
                description: "Describe what this setting does for the players.",
                default: 1337,
                min: 1,
            },
            */
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
                default: 300,
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
exports.SpidersGameSettingsManager = SpidersGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zcGlkZXJzL2dhbWUtc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5QkFBaUM7QUFFakMsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGNBQVcsQ0FBQyxZQUFZO0lBQ3BFOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNiLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQix3RUFBd0U7WUFDeEUsa0NBQWtDO1lBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFLLElBQVksQ0FBQyxNQUFNLENBQUM7WUFFekMsaUNBQWlDO1lBQ2pDLFFBQVEsRUFBRTtnQkFDTixXQUFXLEVBQUUsaURBQWlEO2dCQUM5RCxrQ0FBa0M7Z0JBQ2xDLE9BQU8sRUFBRSxDQUFDO2FBRWI7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLDJDQUEyQztzQkFDM0MsMENBQTBDO2dCQUN2RCxvQ0FBb0M7Z0JBQ3BDLE9BQU8sRUFBRSxJQUFJO2FBRWhCO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLFdBQVcsRUFBRSxpQ0FBaUM7Z0JBQzlDLDRDQUE0QztnQkFDNUMsT0FBTyxFQUFFLENBQUM7YUFFYjtZQUNELGNBQWMsRUFBRTtnQkFDWixXQUFXLEVBQUUsaURBQWlEO3NCQUNqRCxLQUFLO2dCQUNsQix3Q0FBd0M7Z0JBQ3hDLE9BQU8sRUFBRSxFQUFFO2FBRWQ7WUFDRCxhQUFhLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLDhDQUE4QztnQkFDM0QsdUNBQXVDO2dCQUN2QyxPQUFPLEVBQUUsRUFBRTthQUVkO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLFdBQVcsRUFBRSwrQ0FBK0M7c0JBQy9DLE9BQU87Z0JBQ3BCLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7YUFFZDtZQUNELFVBQVUsRUFBRTtnQkFDUixXQUFXLEVBQUUsaURBQWlEO3NCQUNqRCw0QkFBNEI7Z0JBQ3pDLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLENBQUM7YUFFYjtZQUNELFVBQVUsRUFBRTtnQkFDUixXQUFXLEVBQUUsd0NBQXdDO3NCQUN4QyxrQ0FBa0M7Z0JBQy9DLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7YUFFZDtZQUNELGdDQUFnQztZQUVwQyx3Q0FBd0M7WUFDeEM7Ozs7OztjQU1FO1lBRUUsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7U0FFSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBT0Q7Ozs7O09BS0c7SUFDTyxVQUFVLENBQUMsWUFBMkI7UUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsWUFBWSxLQUFLLEVBQUU7WUFDOUIsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRXJFLG9DQUFvQztRQUVwQyxvRUFBb0U7UUFDcEUsdUVBQXVFO1FBQ3ZFLDBDQUEwQztRQUUxQyxxQ0FBcUM7UUFFckMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBdklELGdFQXVJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzRnJvbVNjaGVtYSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgc2V0dGluZ3MgbWFuYWdlciBmb3IgdGhlIFNwaWRlcnMgZ2FtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNwaWRlcnNHYW1lU2V0dGluZ3NNYW5hZ2VyIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZVNldHRpbmdzIHtcbiAgICAvKipcbiAgICAgKiBUaGlzIGRlc2NyaWJlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBnYW1lIHNldHRpbmdzLCBhbmQgaXMgdXNlZCB0b1xuICAgICAqIGdlbmVyYXRlIHRoZSB2YWx1ZXMsIGFzIHdlbGwgYXMgYmFzaWMgdHlwZSBhbmQgcmFuZ2UgY2hlY2tpbmcuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICByZXR1cm4gdGhpcy5tYWtlU2NoZW1hKHtcbiAgICAgICAgICAgIC8vIEhBQ0s6IGBzdXBlcmAgc2hvdWxkIHdvcmsuIGJ1dCBzY2hlbWEgaXMgdW5kZWZpbmVkIG9uIGl0IGF0IHJ1biB0aW1lLlxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgLi4uKHN1cGVyLnNjaGVtYSB8fCAodGhpcyBhcyBhbnkpLnNjaGVtYSksXG5cbiAgICAgICAgICAgIC8vIFNwaWRlcnMgZ2FtZSBzcGVjaWZpYyBzZXR0aW5nc1xuICAgICAgICAgICAgY3V0U3BlZWQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3BlZWQgYXQgd2hpY2ggQ3V0dGVycyB3b3JrIHRvIGRvIGN1dCBXZWJzLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGN1dFNwZWVkIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjdXRTcGVlZCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZWdnc1NjYWxhcjoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkNvbnN0YW50IHVzZWQgdG8gY2FsY3VsYXRlIGhvdyBtYW55IGVnZ3MgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJCcm9vZE1vdGhlcnMgZ2V0IG9uIHRoZWlyIG93bmVyJ3MgdHVybnMuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogZWdnc1NjYWxhciAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMC4xMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogZWdnc1NjYWxhciAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5pdGlhbFdlYlN0cmVuZ3RoOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHN0YXJ0aW5nIHN0cmVuZ3RoIGZvciBXZWJzLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGluaXRpYWxXZWJTdHJlbmd0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW5pdGlhbFdlYlN0cmVuZ3RoIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXhXZWJTdHJlbmd0aDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIHN0cmVuZ3RoIGEgd2ViIGNhbiBiZSBzdHJlbmd0aGVuZWQgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJ0by5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXhXZWJTdHJlbmd0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTUsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1heFdlYlN0cmVuZ3RoIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3ZlbWVudFNwZWVkOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHNwZWVkIGF0IHdoaWNoIFNwaWRlcmxpbmdzIG1vdmUgb24gV2Vicy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtb3ZlbWVudFNwZWVkIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbW92ZW1lbnRTcGVlZCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3BpdFNwZWVkOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHNwZWVkIGF0IHdoaWNoIFNwaXR0ZXJzIHdvcmsgdG8gc3BpdCBuZXcgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJXZWJzLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNwaXRTcGVlZCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjQsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNwaXRTcGVlZCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2VhdmVQb3dlcjoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkhvdyBtdWNoIHdlYiBzdHJlbmd0aCBpcyBhZGRlZCBvciByZW1vdmVkIGZyb20gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJXZWJzIHdoZW4gdGhleSBhcmUgd2VhdmVkLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHdlYXZlUG93ZXIgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHdlYXZlUG93ZXIgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdlYXZlU3BlZWQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3BlZWQgYXQgd2hpY2ggV2VhdmVycyB3b3JrIHRvIGRvIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwic3RyZW5ndGhlbnMgYW5kIHdlYWtlbnMgb24gV2Vicy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB3ZWF2ZVNwZWVkIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxNixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogd2VhdmVTcGVlZCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2NoZW1hIC0tPj5cblxuICAgICAgICAvLyB5b3UgY2FuIGFkZCBtb3JlIHNldHRpbmdzIGhlcmUsIGUuZy46XG4gICAgICAgIC8qXG4gICAgICAgIHNvbWVWYXJpYWJsZUxpa2VVbml0SGVhbHRoOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJEZXNjcmliZSB3aGF0IHRoaXMgc2V0dGluZyBkb2VzIGZvciB0aGUgcGxheWVycy5cIixcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEzMzcsXG4gICAgICAgICAgICBtaW46IDEsXG4gICAgICAgIH0sXG4gICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgICAgICAvLyBCYXNlIHNldHRpbmdzXG4gICAgICAgICAgICBwbGF5ZXJTdGFydGluZ1RpbWU6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNmUxMCwgLy8gMSBtaW4gaW4gbnNcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhcnRpbmcgdGltZSAoaW4gbnMpIGZvciBlYWNoIHBsYXllci5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFR1cm4gYmFzZWQgc2V0dGluZ3NcbiAgICAgICAgICAgIHRpbWVBZGRlZFBlclR1cm46IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxZTksIC8vIDEgc2VjIGluIG5zLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIHRvIGFkZCBhZnRlciBlYWNoIHBsYXllciBwZXJmb3JtcyBhIHR1cm4uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4VHVybnM6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDMwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgZ2FtZSBpcyBmb3JjZSBlbmRlZCBhbmQgYSB3aW5uZXIgaXMgZGV0ZXJtaW5lZC5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWVzIGZvciB0aGUgZ2FtZSdzIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyE6IFNldHRpbmdzRnJvbVNjaGVtYTxTcGlkZXJzR2FtZVNldHRpbmdzTWFuYWdlcltcInNjaGVtYVwiXT47XG5cbiAgICAvKipcbiAgICAgKiBUcnkgdG8gaW52YWxpZGF0ZSBhbGwgdGhlIGdhbWUgc2V0dGluZ3MgaGVyZSwgc28gaW52YWxpZCB2YWx1ZXMgZG8gbm90XG4gICAgICogcmVhY2ggdGhlIGdhbWUuXG4gICAgICogQHBhcmFtIHNvbWVTZXR0aW5ncyBBIHN1YnNldCBvZiBzZXR0aW5ncyB0aGF0IHdpbGwgYmUgdGVzdGVkXG4gICAgICogQHJldHVybnMgQW4gZXJyb3IgaWYgdGhlIHNldHRpbmdzIGZhaWwgdG8gdmFsaWRhdGUuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGUoc29tZVNldHRpbmdzOiBVbmtub3duT2JqZWN0KTogVW5rbm93bk9iamVjdCB8IEVycm9yIHtcbiAgICAgICAgY29uc3QgaW52YWxpZGF0ZWQgPSBzdXBlci5pbnZhbGlkYXRlKHNvbWVTZXR0aW5ncyk7XG4gICAgICAgIGlmIChpbnZhbGlkYXRlZCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZGF0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHsgLi4udGhpcy52YWx1ZXMsIC4uLnNvbWVTZXR0aW5ncywgLi4uaW52YWxpZGF0ZWQgfTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICAvLyBXcml0ZSBsb2dpYyBoZXJlIHRvIGNoZWNrIHRoZSB2YWx1ZXMgaW4gYHNldHRpbmdzYC4gSWYgdGhlcmUgaXMgYVxuICAgICAgICAvLyBwcm9ibGVtIHdpdGggdGhlIHZhbHVlcyBhIHBsYXllciBzZW50LCByZXR1cm4gYW4gZXJyb3Igd2l0aCBhIHN0cmluZ1xuICAgICAgICAvLyBkZXNjcmliaW5nIHdoeSB0aGVpciB2YWx1ZShzKSBhcmUgd3JvbmdcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZSAtLT4+XG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzO1xuICAgIH1cbn1cbiJdfQ==