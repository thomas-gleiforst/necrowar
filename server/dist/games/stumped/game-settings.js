"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Stumped game.
 */
class StumpedGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Stumped game specific settings
            // <<-- Creer-Merge: schema -->>
            /** The maximum health a spawner can increase to. */
            maxSpawnerHealth: {
                default: 5,
                min: 1,
                description: "The maximum health a spawner can increase to.",
            },
            minBranchSpawners: {
                default: 3,
                min: 1,
                description: "The minimum number of branch spawners to create.",
            },
            maxBranchSpawners: {
                default: 12,
                min: 1,
                description: "The maximum number of branch spawners to create.",
            },
            minFoodSpawners: {
                default: 1,
                min: 1,
                description: "The minimum number of food spawners to create.",
            },
            maxFoodSpawners: {
                default: 4,
                min: 1,
                description: "The maximum number of food spawners to create.",
            },
            lodgesToWin: {
                default: 10,
                min: 2,
                description: "How many branches are required to win.",
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
            // Tiled settings
            mapWidth: {
                // <<-- Creer-Merge: map-width -->>
                default: 32,
                // <<-- /Creer-Merge: map-width -->>
                min: 2,
                description: "The width (in Tiles) for the game map to be initialized to.",
            },
            mapHeight: {
                // <<-- Creer-Merge: map-height -->>
                default: 16,
                // <<-- /Creer-Merge: map-height -->>
                min: 2,
                description: "The height (in Tiles) for the game map to be initialized to.",
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
exports.StumpedGameSettingsManager = StumpedGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zdHVtcGVkL2dhbWUtc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5QkFBaUM7QUFFakMsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGNBQVcsQ0FBQyxZQUFZO0lBQ3BFOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNiLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQix3RUFBd0U7WUFDeEUsa0NBQWtDO1lBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFLLElBQVksQ0FBQyxNQUFNLENBQUM7WUFFekMsaUNBQWlDO1lBQ2pDLGdDQUFnQztZQUVoQyxvREFBb0Q7WUFDcEQsZ0JBQWdCLEVBQUU7Z0JBQ2QsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFLCtDQUErQzthQUMvRDtZQUVELGlCQUFpQixFQUFFO2dCQUNmLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxrREFBa0Q7YUFDbEU7WUFDRCxpQkFBaUIsRUFBRTtnQkFDZixPQUFPLEVBQUUsRUFBRTtnQkFDWCxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsa0RBQWtEO2FBQ2xFO1lBRUQsZUFBZSxFQUFFO2dCQUNiLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnREFBZ0Q7YUFDaEU7WUFDRCxlQUFlLEVBQUU7Z0JBQ2IsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFLGdEQUFnRDthQUNoRTtZQUVELFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsd0NBQXdDO2FBQ3hEO1lBRUQsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7WUFFRCxpQkFBaUI7WUFDakIsUUFBUSxFQUFFO2dCQUNOLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsb0NBQW9DO2dCQUNwQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNkRBQTZEO2FBQzdFO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gscUNBQXFDO2dCQUNyQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsOERBQThEO2FBQzlFO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQU9EOzs7OztPQUtHO0lBQ08sVUFBVSxDQUFDLFlBQTJCO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsb0VBQW9FO1FBQ3BFLHVFQUF1RTtRQUN2RSwwQ0FBMEM7UUFFMUMscUNBQXFDO1FBRXJDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQTVIRCxnRUE0SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXR0aW5nc0Zyb21TY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIG1hbmFnZXIgZm9yIHRoZSBTdHVtcGVkIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHVtcGVkR2FtZVNldHRpbmdzTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVTZXR0aW5ncyB7XG4gICAgLyoqXG4gICAgICogVGhpcyBkZXNjcmliZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ2FtZSBzZXR0aW5ncywgYW5kIGlzIHVzZWQgdG9cbiAgICAgKiBnZW5lcmF0ZSB0aGUgdmFsdWVzLCBhcyB3ZWxsIGFzIGJhc2ljIHR5cGUgYW5kIHJhbmdlIGNoZWNraW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2NoZW1hKCkgeyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOnR5cGVkZWZcbiAgICAgICAgcmV0dXJuIHRoaXMubWFrZVNjaGVtYSh7XG4gICAgICAgICAgICAvLyBIQUNLOiBgc3VwZXJgIHNob3VsZCB3b3JrLiBidXQgc2NoZW1hIGlzIHVuZGVmaW5lZCBvbiBpdCBhdCBydW4gdGltZS5cbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICAgIC4uLihzdXBlci5zY2hlbWEgfHwgKHRoaXMgYXMgYW55KS5zY2hlbWEpLFxuXG4gICAgICAgICAgICAvLyBTdHVtcGVkIGdhbWUgc3BlY2lmaWMgc2V0dGluZ3NcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIC8qKiBUaGUgbWF4aW11bSBoZWFsdGggYSBzcGF3bmVyIGNhbiBpbmNyZWFzZSB0by4gKi9cbiAgICAgICAgICAgIG1heFNwYXduZXJIZWFsdGg6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA1LFxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSBoZWFsdGggYSBzcGF3bmVyIGNhbiBpbmNyZWFzZSB0by5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIG1pbkJyYW5jaFNwYXduZXJzOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMyxcbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1pbmltdW0gbnVtYmVyIG9mIGJyYW5jaCBzcGF3bmVycyB0byBjcmVhdGUuXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4QnJhbmNoU3Bhd25lcnM6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMixcbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIGJyYW5jaCBzcGF3bmVycyB0byBjcmVhdGUuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBtaW5Gb29kU3Bhd25lcnM6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWluaW11bSBudW1iZXIgb2YgZm9vZCBzcGF3bmVycyB0byBjcmVhdGUuXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4Rm9vZFNwYXduZXJzOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNCxcbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIGZvb2Qgc3Bhd25lcnMgdG8gY3JlYXRlLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgbG9kZ2VzVG9XaW46IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICAgICAgICBtaW46IDIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSG93IG1hbnkgYnJhbmNoZXMgYXJlIHJlcXVpcmVkIHRvIHdpbi5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgICAgICAvLyBCYXNlIHNldHRpbmdzXG4gICAgICAgICAgICBwbGF5ZXJTdGFydGluZ1RpbWU6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNmUxMCwgLy8gMSBtaW4gaW4gbnNcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhcnRpbmcgdGltZSAoaW4gbnMpIGZvciBlYWNoIHBsYXllci5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFR1cm4gYmFzZWQgc2V0dGluZ3NcbiAgICAgICAgICAgIHRpbWVBZGRlZFBlclR1cm46IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxZTksIC8vIDEgc2VjIGluIG5zLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIHRvIGFkZCBhZnRlciBlYWNoIHBsYXllciBwZXJmb3JtcyBhIHR1cm4uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4VHVybnM6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgZ2FtZSBpcyBmb3JjZSBlbmRlZCBhbmQgYSB3aW5uZXIgaXMgZGV0ZXJtaW5lZC5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFRpbGVkIHNldHRpbmdzXG4gICAgICAgICAgICBtYXBXaWR0aDoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMzIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB3aWR0aCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFwSGVpZ2h0OiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWFwLWhlaWdodCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTYsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC1oZWlnaHQgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgaGVpZ2h0IChpbiBUaWxlcykgZm9yIHRoZSBnYW1lIG1hcCB0byBiZSBpbml0aWFsaXplZCB0by5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWVzIGZvciB0aGUgZ2FtZSdzIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyE6IFNldHRpbmdzRnJvbVNjaGVtYTxTdHVtcGVkR2FtZVNldHRpbmdzTWFuYWdlcltcInNjaGVtYVwiXT47XG5cbiAgICAvKipcbiAgICAgKiBUcnkgdG8gaW52YWxpZGF0ZSBhbGwgdGhlIGdhbWUgc2V0dGluZ3MgaGVyZSwgc28gaW52YWxpZCB2YWx1ZXMgZG8gbm90XG4gICAgICogcmVhY2ggdGhlIGdhbWUuXG4gICAgICogQHBhcmFtIHNvbWVTZXR0aW5ncyBBIHN1YnNldCBvZiBzZXR0aW5ncyB0aGF0IHdpbGwgYmUgdGVzdGVkXG4gICAgICogQHJldHVybnMgQW4gZXJyb3IgaWYgdGhlIHNldHRpbmdzIGZhaWwgdG8gdmFsaWRhdGUuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGludmFsaWRhdGUoc29tZVNldHRpbmdzOiBVbmtub3duT2JqZWN0KTogVW5rbm93bk9iamVjdCB8IEVycm9yIHtcbiAgICAgICAgY29uc3QgaW52YWxpZGF0ZWQgPSBzdXBlci5pbnZhbGlkYXRlKHNvbWVTZXR0aW5ncyk7XG4gICAgICAgIGlmIChpbnZhbGlkYXRlZCBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gaW52YWxpZGF0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXR0aW5ncyA9IHsgLi4udGhpcy52YWx1ZXMsIC4uLnNvbWVTZXR0aW5ncywgLi4uaW52YWxpZGF0ZWQgfTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICAvLyBXcml0ZSBsb2dpYyBoZXJlIHRvIGNoZWNrIHRoZSB2YWx1ZXMgaW4gYHNldHRpbmdzYC4gSWYgdGhlcmUgaXMgYVxuICAgICAgICAvLyBwcm9ibGVtIHdpdGggdGhlIHZhbHVlcyBhIHBsYXllciBzZW50LCByZXR1cm4gYW4gZXJyb3Igd2l0aCBhIHN0cmluZ1xuICAgICAgICAvLyBkZXNjcmliaW5nIHdoeSB0aGVpciB2YWx1ZShzKSBhcmUgd3JvbmdcblxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogaW52YWxpZGF0ZSAtLT4+XG5cbiAgICAgICAgcmV0dXJuIHNldHRpbmdzO1xuICAgIH1cbn1cbiJdfQ==