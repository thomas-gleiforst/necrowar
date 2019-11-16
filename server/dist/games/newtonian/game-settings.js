"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Newtonian game.
 */
class NewtonianGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Newtonian game specific settings
            internCap: {
                description: "The maximum number of interns a player can have.",
                // <<-- Creer-Merge: internCap -->>
                default: 4,
                min: 0,
            },
            managerCap: {
                description: "The maximum number of managers a player can "
                    + "have.",
                // <<-- Creer-Merge: managerCap -->>
                default: 4,
                min: 0,
            },
            materialSpawn: {
                description: "The number of materials that spawn per spawn "
                    + "cycle.",
                // <<-- Creer-Merge: materialSpawn -->>
                default: 2,
                min: 0,
            },
            physicistCap: {
                description: "The maximum number of physicists a player can "
                    + "have.",
                // <<-- Creer-Merge: physicistCap -->>
                default: 4,
                min: 0,
            },
            refinedValue: {
                description: "The amount of victory points added when a "
                    + "refined ore is consumed by the generator.",
                // <<-- Creer-Merge: refinedValue -->>
                default: 5,
                min: 1,
            },
            regenerateRate: {
                description: "The percent of max HP regained when a unit end "
                    + "their turn on a tile owned by their player.",
                // <<-- Creer-Merge: regenerateRate -->>
                default: 0.5,
            },
            spawnTime: {
                description: "The amount of turns it takes a unit to spawn.",
                // <<-- Creer-Merge: spawnTime -->>
                default: 5,
                min: 1,
            },
            stunTime: {
                description: "The amount of turns a unit cannot do anything "
                    + "when stunned.",
                // <<-- Creer-Merge: stunTime -->>
                default: 2,
                min: 1,
            },
            timeImmune: {
                description: "The number turns a unit is immune to being "
                    + "stunned.",
                // <<-- Creer-Merge: timeImmune -->>
                default: 4,
                min: 1,
            },
            victoryAmount: {
                description: "The amount of combined heat and pressure that "
                    + "you need to win.",
                // <<-- Creer-Merge: victoryAmount -->>
                default: 800,
                min: 1,
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
                default: 18e10,
                // <<-- /Creer-Merge: player-starting-time -->>
                min: 0,
                description: "The starting time (in ns) for each player.",
            },
            // Turn based settings
            timeAddedPerTurn: {
                // <<-- Creer-Merge: time-added-per-turn -->>
                default: 2e9,
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
                default: 51,
                // <<-- /Creer-Merge: map-width -->>
                min: 2,
                description: "The width (in Tiles) for the game map to be initialized to.",
            },
            mapHeight: {
                // <<-- Creer-Merge: map-height -->>
                default: 29,
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
exports.NewtonianGameSettingsManager = NewtonianGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZXd0b25pYW4vZ2FtZS1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlCQUFpQztBQUVqQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsNEJBQTZCLFNBQVEsY0FBVyxDQUFDLFlBQVk7SUFDdEU7OztPQUdHO0lBQ0gsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25CLHdFQUF3RTtZQUN4RSxrQ0FBa0M7WUFDbEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUssSUFBWSxDQUFDLE1BQU0sQ0FBQztZQUV6QyxtQ0FBbUM7WUFDbkMsU0FBUyxFQUFFO2dCQUNQLFdBQVcsRUFBRSxrREFBa0Q7Z0JBQy9ELG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFFVDtZQUNELFVBQVUsRUFBRTtnQkFDUixXQUFXLEVBQUUsOENBQThDO3NCQUM5QyxPQUFPO2dCQUNwQixvQ0FBb0M7Z0JBQ3BDLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDO2FBRVQ7WUFDRCxhQUFhLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLCtDQUErQztzQkFDL0MsUUFBUTtnQkFDckIsdUNBQXVDO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQzthQUVUO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLFdBQVcsRUFBRSxnREFBZ0Q7c0JBQ2hELE9BQU87Z0JBQ3BCLHNDQUFzQztnQkFDdEMsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFFVDtZQUNELFlBQVksRUFBRTtnQkFDVixXQUFXLEVBQUUsNENBQTRDO3NCQUM1QywyQ0FBMkM7Z0JBQ3hELHNDQUFzQztnQkFDdEMsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFFVDtZQUNELGNBQWMsRUFBRTtnQkFDWixXQUFXLEVBQUUsaURBQWlEO3NCQUNqRCw2Q0FBNkM7Z0JBQzFELHdDQUF3QztnQkFDeEMsT0FBTyxFQUFFLEdBQUc7YUFFZjtZQUNELFNBQVMsRUFBRTtnQkFDUCxXQUFXLEVBQUUsK0NBQStDO2dCQUM1RCxtQ0FBbUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDO2FBRVQ7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLGdEQUFnRDtzQkFDaEQsZUFBZTtnQkFDNUIsa0NBQWtDO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQzthQUVUO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLFdBQVcsRUFBRSw2Q0FBNkM7c0JBQzdDLFVBQVU7Z0JBQ3ZCLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFFVDtZQUNELGFBQWEsRUFBRTtnQkFDWCxXQUFXLEVBQUUsZ0RBQWdEO3NCQUNoRCxrQkFBa0I7Z0JBQy9CLHVDQUF1QztnQkFDdkMsT0FBTyxFQUFFLEdBQUc7Z0JBQ1osR0FBRyxFQUFFLENBQUM7YUFFVDtZQUNELGdDQUFnQztZQUVwQyx3Q0FBd0M7WUFDeEM7Ozs7OztjQU1FO1lBRUUsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsS0FBSztnQkFDZCwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7WUFFRCxpQkFBaUI7WUFDakIsUUFBUSxFQUFFO2dCQUNOLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsb0NBQW9DO2dCQUNwQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNkRBQTZEO2FBQzdFO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gscUNBQXFDO2dCQUNyQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsOERBQThEO2FBQzlFO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQU9EOzs7OztPQUtHO0lBQ08sVUFBVSxDQUFDLFlBQTJCO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsb0VBQW9FO1FBQ3BFLHVFQUF1RTtRQUN2RSwwQ0FBMEM7UUFFMUMscUNBQXFDO1FBRXJDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQS9LRCxvRUErS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXR0aW5nc0Zyb21TY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIG1hbmFnZXIgZm9yIHRoZSBOZXd0b25pYW4gZ2FtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIE5ld3RvbmlhbkdhbWVTZXR0aW5nc01hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lU2V0dGluZ3Mge1xuICAgIC8qKlxuICAgICAqIFRoaXMgZGVzY3JpYmVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdhbWUgc2V0dGluZ3MsIGFuZCBpcyB1c2VkIHRvXG4gICAgICogZ2VuZXJhdGUgdGhlIHZhbHVlcywgYXMgd2VsbCBhcyBiYXNpYyB0eXBlIGFuZCByYW5nZSBjaGVja2luZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNjaGVtYSgpIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTp0eXBlZGVmXG4gICAgICAgIHJldHVybiB0aGlzLm1ha2VTY2hlbWEoe1xuICAgICAgICAgICAgLy8gSEFDSzogYHN1cGVyYCBzaG91bGQgd29yay4gYnV0IHNjaGVtYSBpcyB1bmRlZmluZWQgb24gaXQgYXQgcnVuIHRpbWUuXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAuLi4oc3VwZXIuc2NoZW1hIHx8ICh0aGlzIGFzIGFueSkuc2NoZW1hKSxcblxuICAgICAgICAgICAgLy8gTmV3dG9uaWFuIGdhbWUgc3BlY2lmaWMgc2V0dGluZ3NcbiAgICAgICAgICAgIGludGVybkNhcDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIG51bWJlciBvZiBpbnRlcm5zIGEgcGxheWVyIGNhbiBoYXZlLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludGVybkNhcCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNCxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludGVybkNhcCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFuYWdlckNhcDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIG51bWJlciBvZiBtYW5hZ2VycyBhIHBsYXllciBjYW4gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJoYXZlLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hbmFnZXJDYXAgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDQsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYW5hZ2VyQ2FwIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXRlcmlhbFNwYXduOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG51bWJlciBvZiBtYXRlcmlhbHMgdGhhdCBzcGF3biBwZXIgc3Bhd24gXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJjeWNsZS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXRlcmlhbFNwYXduIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWF0ZXJpYWxTcGF3biAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGh5c2ljaXN0Q2FwOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHBoeXNpY2lzdHMgYSBwbGF5ZXIgY2FuIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiaGF2ZS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwaHlzaWNpc3RDYXAgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDQsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwaHlzaWNpc3RDYXAgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZmluZWRWYWx1ZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdmljdG9yeSBwb2ludHMgYWRkZWQgd2hlbiBhIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwicmVmaW5lZCBvcmUgaXMgY29uc3VtZWQgYnkgdGhlIGdlbmVyYXRvci5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiByZWZpbmVkVmFsdWUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiByZWZpbmVkVmFsdWUgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZ2VuZXJhdGVSYXRlOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHBlcmNlbnQgb2YgbWF4IEhQIHJlZ2FpbmVkIHdoZW4gYSB1bml0IGVuZCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcInRoZWlyIHR1cm4gb24gYSB0aWxlIG93bmVkIGJ5IHRoZWlyIHBsYXllci5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiByZWdlbmVyYXRlUmF0ZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMC41LFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiByZWdlbmVyYXRlUmF0ZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3Bhd25UaW1lOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiB0dXJucyBpdCB0YWtlcyBhIHVuaXQgdG8gc3Bhd24uXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc3Bhd25UaW1lIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA1LFxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc3Bhd25UaW1lIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdHVuVGltZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdHVybnMgYSB1bml0IGNhbm5vdCBkbyBhbnl0aGluZyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIndoZW4gc3R1bm5lZC5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzdHVuVGltZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMixcbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHN0dW5UaW1lIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aW1lSW1tdW5lOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG51bWJlciB0dXJucyBhIHVuaXQgaXMgaW1tdW5lIHRvIGJlaW5nIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwic3R1bm5lZC5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0aW1lSW1tdW5lIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA0LFxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogdGltZUltbXVuZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmljdG9yeUFtb3VudDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgY29tYmluZWQgaGVhdCBhbmQgcHJlc3N1cmUgdGhhdCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcInlvdSBuZWVkIHRvIHdpbi5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB2aWN0b3J5QW1vdW50IC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA4MDAsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB2aWN0b3J5QW1vdW50IC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgIC8vIHlvdSBjYW4gYWRkIG1vcmUgc2V0dGluZ3MgaGVyZSwgZS5nLjpcbiAgICAgICAgLypcbiAgICAgICAgc29tZVZhcmlhYmxlTGlrZVVuaXRIZWFsdGg6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkRlc2NyaWJlIHdoYXQgdGhpcyBzZXR0aW5nIGRvZXMgZm9yIHRoZSBwbGF5ZXJzLlwiLFxuICAgICAgICAgICAgZGVmYXVsdDogMTMzNyxcbiAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgfSxcbiAgICAgICAgKi9cblxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIC8vIEJhc2Ugc2V0dGluZ3NcbiAgICAgICAgICAgIHBsYXllclN0YXJ0aW5nVGltZToge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHBsYXllci1zdGFydGluZy10aW1lIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxOGUxMCwgLy8gMSBtaW4gaW4gbnNcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhcnRpbmcgdGltZSAoaW4gbnMpIGZvciBlYWNoIHBsYXllci5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFR1cm4gYmFzZWQgc2V0dGluZ3NcbiAgICAgICAgICAgIHRpbWVBZGRlZFBlclR1cm46IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyZTksIC8vIDIgc2VjIGluIG5zLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIHRvIGFkZCBhZnRlciBlYWNoIHBsYXllciBwZXJmb3JtcyBhIHR1cm4uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4VHVybnM6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgZ2FtZSBpcyBmb3JjZSBlbmRlZCBhbmQgYSB3aW5uZXIgaXMgZGV0ZXJtaW5lZC5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFRpbGVkIHNldHRpbmdzXG4gICAgICAgICAgICBtYXBXaWR0aDoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNTEsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB3aWR0aCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFwSGVpZ2h0OiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWFwLWhlaWdodCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjksXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC1oZWlnaHQgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgaGVpZ2h0IChpbiBUaWxlcykgZm9yIHRoZSBnYW1lIG1hcCB0byBiZSBpbml0aWFsaXplZCB0by5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWVzIGZvciB0aGUgZ2FtZSdzIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyE6IFNldHRpbmdzRnJvbVNjaGVtYTxOZXd0b25pYW5HYW1lU2V0dGluZ3NNYW5hZ2VyW1wic2NoZW1hXCJdPjtcblxuICAgIC8qKlxuICAgICAqIFRyeSB0byBpbnZhbGlkYXRlIGFsbCB0aGUgZ2FtZSBzZXR0aW5ncyBoZXJlLCBzbyBpbnZhbGlkIHZhbHVlcyBkbyBub3RcbiAgICAgKiByZWFjaCB0aGUgZ2FtZS5cbiAgICAgKiBAcGFyYW0gc29tZVNldHRpbmdzIEEgc3Vic2V0IG9mIHNldHRpbmdzIHRoYXQgd2lsbCBiZSB0ZXN0ZWRcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBpZiB0aGUgc2V0dGluZ3MgZmFpbCB0byB2YWxpZGF0ZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZShzb21lU2V0dGluZ3M6IFVua25vd25PYmplY3QpOiBVbmtub3duT2JqZWN0IHwgRXJyb3Ige1xuICAgICAgICBjb25zdCBpbnZhbGlkYXRlZCA9IHN1cGVyLmludmFsaWRhdGUoc29tZVNldHRpbmdzKTtcbiAgICAgICAgaWYgKGludmFsaWRhdGVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkYXRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0geyAuLi50aGlzLnZhbHVlcywgLi4uc29tZVNldHRpbmdzLCAuLi5pbnZhbGlkYXRlZCB9O1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIC8vIFdyaXRlIGxvZ2ljIGhlcmUgdG8gY2hlY2sgdGhlIHZhbHVlcyBpbiBgc2V0dGluZ3NgLiBJZiB0aGVyZSBpcyBhXG4gICAgICAgIC8vIHByb2JsZW0gd2l0aCB0aGUgdmFsdWVzIGEgcGxheWVyIHNlbnQsIHJldHVybiBhbiBlcnJvciB3aXRoIGEgc3RyaW5nXG4gICAgICAgIC8vIGRlc2NyaWJpbmcgd2h5IHRoZWlyIHZhbHVlKHMpIGFyZSB3cm9uZ1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufVxuIl19