"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Anarchy game.
 */
class AnarchyGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Anarchy game specific settings
            // <<-- Creer-Merge: schema -->>
            mapWidth: {
                default: 40,
                min: 2,
                description: "The width (in Buildings) for the game map to be initialized to.",
            },
            mapHeight: {
                default: 20,
                min: 2,
                description: "The height (in Buildings) for the game map to be initialized to.",
            },
            maxFire: {
                default: 20,
                min: 1,
                description: "The maximum amount of fire value for any Building.",
            },
            baseBribesPerTurn: {
                default: 10,
                min: 1,
                description: "How many bribes players get at the beginning of "
                    + "their turn, not counting their burned down Buildings.",
            },
            buildingStartingHealth: {
                default: 100,
                min: 1,
                description: "The amount of health buildings start the game with.",
            },
            headquartersHealthScalar: {
                default: 3,
                min: 1,
                description: "How much health to scale (multiply a Headquarters health by",
            },
            maxForecastIntensity: {
                default: 10,
                min: 1,
                description: "The maximum intensity to allow Forecasts to have.",
            },
            firePerTurnReduction: {
                default: 1,
                min: 0,
                description: "How much fire to remove per turn.",
            },
            exposurePerTurnReduction: {
                default: 10,
                min: 0,
                description: "How much exposure to remove per turn.",
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
exports.AnarchyGameSettingsManager = AnarchyGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9hbmFyY2h5L2dhbWUtc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5QkFBaUM7QUFFakMsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGNBQVcsQ0FBQyxZQUFZO0lBQ3BFOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNiLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQix3RUFBd0U7WUFDeEUsa0NBQWtDO1lBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFLLElBQVksQ0FBQyxNQUFNLENBQUM7WUFFekMsaUNBQWlDO1lBQ2pDLGdDQUFnQztZQUVoQyxRQUFRLEVBQUU7Z0JBQ04sT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsR0FBRyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFLGlFQUFpRTthQUNqRjtZQUNELFNBQVMsRUFBRTtnQkFDUCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsa0VBQWtFO2FBQ2xGO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLE9BQU8sRUFBRSxFQUFFO2dCQUNYLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxvREFBb0Q7YUFDcEU7WUFDRCxpQkFBaUIsRUFBRTtnQkFDZixPQUFPLEVBQUUsRUFBRTtnQkFDWCxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsa0RBQWtEO3NCQUM3RCx1REFBdUQ7YUFDNUQ7WUFDRCxzQkFBc0IsRUFBRTtnQkFDcEIsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osR0FBRyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFLHFEQUFxRDthQUNyRTtZQUNELHdCQUF3QixFQUFFO2dCQUN0QixPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNkRBQTZEO2FBQzdFO1lBQ0Qsb0JBQW9CLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBRSxFQUFFO2dCQUNYLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxtREFBbUQ7YUFDbkU7WUFDRCxvQkFBb0IsRUFBRTtnQkFDbEIsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFLG1DQUFtQzthQUNuRDtZQUNELHdCQUF3QixFQUFFO2dCQUN0QixPQUFPLEVBQUUsRUFBRTtnQkFDWCxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsdUNBQXVDO2FBQ3ZEO1lBRUQsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7U0FFSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBT0Q7Ozs7O09BS0c7SUFDTyxVQUFVLENBQUMsWUFBMkI7UUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsWUFBWSxLQUFLLEVBQUU7WUFDOUIsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRXJFLG9DQUFvQztRQUVwQyxvRUFBb0U7UUFDcEUsdUVBQXVFO1FBQ3ZFLDBDQUEwQztRQUUxQyxxQ0FBcUM7UUFFckMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBeEhELGdFQXdIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzRnJvbVNjaGVtYSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgc2V0dGluZ3MgbWFuYWdlciBmb3IgdGhlIEFuYXJjaHkgZ2FtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFuYXJjaHlHYW1lU2V0dGluZ3NNYW5hZ2VyIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZVNldHRpbmdzIHtcbiAgICAvKipcbiAgICAgKiBUaGlzIGRlc2NyaWJlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBnYW1lIHNldHRpbmdzLCBhbmQgaXMgdXNlZCB0b1xuICAgICAqIGdlbmVyYXRlIHRoZSB2YWx1ZXMsIGFzIHdlbGwgYXMgYmFzaWMgdHlwZSBhbmQgcmFuZ2UgY2hlY2tpbmcuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICByZXR1cm4gdGhpcy5tYWtlU2NoZW1hKHtcbiAgICAgICAgICAgIC8vIEhBQ0s6IGBzdXBlcmAgc2hvdWxkIHdvcmsuIGJ1dCBzY2hlbWEgaXMgdW5kZWZpbmVkIG9uIGl0IGF0IHJ1biB0aW1lLlxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgLi4uKHN1cGVyLnNjaGVtYSB8fCAodGhpcyBhcyBhbnkpLnNjaGVtYSksXG5cbiAgICAgICAgICAgIC8vIEFuYXJjaHkgZ2FtZSBzcGVjaWZpYyBzZXR0aW5nc1xuICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2NoZW1hIC0tPj5cblxuICAgICAgICAgICAgbWFwV2lkdGg6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA0MCxcbiAgICAgICAgICAgICAgICBtaW46IDIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHdpZHRoIChpbiBCdWlsZGluZ3MpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFwSGVpZ2h0OiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjAsXG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBoZWlnaHQgKGluIEJ1aWxkaW5ncykgZm9yIHRoZSBnYW1lIG1hcCB0byBiZSBpbml0aWFsaXplZCB0by5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXhGaXJlOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjAsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIGFtb3VudCBvZiBmaXJlIHZhbHVlIGZvciBhbnkgQnVpbGRpbmcuXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmFzZUJyaWJlc1BlclR1cm46IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSG93IG1hbnkgYnJpYmVzIHBsYXllcnMgZ2V0IGF0IHRoZSBiZWdpbm5pbmcgb2YgXCJcbiAgICAgICAgICAgICAgICArIFwidGhlaXIgdHVybiwgbm90IGNvdW50aW5nIHRoZWlyIGJ1cm5lZCBkb3duIEJ1aWxkaW5ncy5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBidWlsZGluZ1N0YXJ0aW5nSGVhbHRoOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTAwLFxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIGhlYWx0aCBidWlsZGluZ3Mgc3RhcnQgdGhlIGdhbWUgd2l0aC5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkcXVhcnRlcnNIZWFsdGhTY2FsYXI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAzLFxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbXVjaCBoZWFsdGggdG8gc2NhbGUgKG11bHRpcGx5IGEgSGVhZHF1YXJ0ZXJzIGhlYWx0aCBieVwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1heEZvcmVjYXN0SW50ZW5zaXR5OiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTAsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIGludGVuc2l0eSB0byBhbGxvdyBGb3JlY2FzdHMgdG8gaGF2ZS5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmaXJlUGVyVHVyblJlZHVjdGlvbjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkhvdyBtdWNoIGZpcmUgdG8gcmVtb3ZlIHBlciB0dXJuLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV4cG9zdXJlUGVyVHVyblJlZHVjdGlvbjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbXVjaCBleHBvc3VyZSB0byByZW1vdmUgcGVyIHR1cm4uXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2NoZW1hIC0tPj5cblxuICAgICAgICAgICAgLy8gQmFzZSBzZXR0aW5nc1xuICAgICAgICAgICAgcGxheWVyU3RhcnRpbmdUaW1lOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDZlMTAsIC8vIDEgbWluIGluIG5zXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHBsYXllci1zdGFydGluZy10aW1lIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHN0YXJ0aW5nIHRpbWUgKGluIG5zKSBmb3IgZWFjaCBwbGF5ZXIuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBUdXJuIGJhc2VkIHNldHRpbmdzXG4gICAgICAgICAgICB0aW1lQWRkZWRQZXJUdXJuOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogdGltZS1hZGRlZC1wZXItdHVybiAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMWU5LCAvLyAxIHNlYyBpbiBucyxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogdGltZS1hZGRlZC1wZXItdHVybiAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdGltZSAoaW4gbmFuby1zZWNvbmRzKSB0byBhZGQgYWZ0ZXIgZWFjaCBwbGF5ZXIgcGVyZm9ybXMgYSB0dXJuLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1heFR1cm5zOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1heC10dXJucyAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIG51bWJlciBvZiB0dXJucyBiZWZvcmUgdGhlIGdhbWUgaXMgZm9yY2UgZW5kZWQgYW5kIGEgd2lubmVyIGlzIGRldGVybWluZWQuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHZhbHVlcyBmb3IgdGhlIGdhbWUncyBzZXR0aW5nc1xuICAgICAqL1xuICAgIHB1YmxpYyB2YWx1ZXMhOiBTZXR0aW5nc0Zyb21TY2hlbWE8QW5hcmNoeUdhbWVTZXR0aW5nc01hbmFnZXJbXCJzY2hlbWFcIl0+O1xuXG4gICAgLyoqXG4gICAgICogVHJ5IHRvIGludmFsaWRhdGUgYWxsIHRoZSBnYW1lIHNldHRpbmdzIGhlcmUsIHNvIGludmFsaWQgdmFsdWVzIGRvIG5vdFxuICAgICAqIHJlYWNoIHRoZSBnYW1lLlxuICAgICAqIEBwYXJhbSBzb21lU2V0dGluZ3MgQSBzdWJzZXQgb2Ygc2V0dGluZ3MgdGhhdCB3aWxsIGJlIHRlc3RlZFxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIGlmIHRoZSBzZXR0aW5ncyBmYWlsIHRvIHZhbGlkYXRlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlKHNvbWVTZXR0aW5nczogVW5rbm93bk9iamVjdCk6IFVua25vd25PYmplY3QgfCBFcnJvciB7XG4gICAgICAgIGNvbnN0IGludmFsaWRhdGVkID0gc3VwZXIuaW52YWxpZGF0ZShzb21lU2V0dGluZ3MpO1xuICAgICAgICBpZiAoaW52YWxpZGF0ZWQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWRhdGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7IC4uLnRoaXMudmFsdWVzLCAuLi5zb21lU2V0dGluZ3MsIC4uLmludmFsaWRhdGVkIH07XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZSAtLT4+XG5cbiAgICAgICAgLy8gV3JpdGUgbG9naWMgaGVyZSB0byBjaGVjayB0aGUgdmFsdWVzIGluIGBzZXR0aW5nc2AuIElmIHRoZXJlIGlzIGFcbiAgICAgICAgLy8gcHJvYmxlbSB3aXRoIHRoZSB2YWx1ZXMgYSBwbGF5ZXIgc2VudCwgcmV0dXJuIGFuIGVycm9yIHdpdGggYSBzdHJpbmdcbiAgICAgICAgLy8gZGVzY3JpYmluZyB3aHkgdGhlaXIgdmFsdWUocykgYXJlIHdyb25nXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgICB9XG59XG4iXX0=