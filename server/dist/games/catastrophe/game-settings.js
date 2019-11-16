"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Catastrophe game.
 */
class CatastropheGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Catastrophe game specific settings
            catEnergyMult: {
                description: "The multiplier for the amount of energy "
                    + "regenerated when resting in a shelter with the "
                    + "cat overlord.",
                // <<-- Creer-Merge: catEnergyMult -->>
                default: 2,
            },
            harvestCooldown: {
                description: "The amount of turns it takes for a Tile that was "
                    + "just harvested to grow food again.",
                // <<-- Creer-Merge: harvestCooldown -->>
                default: 10,
            },
            lowerHarvestAmount: {
                description: "The amount that the harvest rate is lowered each "
                    + "season.",
                // <<-- Creer-Merge: lowerHarvestAmount -->>
                default: 10,
            },
            monumentCostMult: {
                description: "The multiplier for the cost of actions when "
                    + "performing them in range of a monument. Does not "
                    + "effect pickup cost.",
                // <<-- Creer-Merge: monumentCostMult -->>
                default: 0.5,
            },
            monumentMaterials: {
                description: "The number of materials in a monument.",
                // <<-- Creer-Merge: monumentMaterials -->>
                default: 100,
            },
            neutralMaterials: {
                description: "The number of materials in a neutral Structure.",
                // <<-- Creer-Merge: neutralMaterials -->>
                default: 200,
            },
            shelterMaterials: {
                description: "The number of materials in a shelter.",
                // <<-- Creer-Merge: shelterMaterials -->>
                default: 50,
            },
            startingFood: {
                description: "The amount of food Players start with.",
                // <<-- Creer-Merge: startingFood -->>
                default: 0,
            },
            starvingEnergyMult: {
                description: "The multiplier for the amount of energy "
                    + "regenerated when resting while starving.",
                // <<-- Creer-Merge: starvingEnergyMult -->>
                default: 0.25,
            },
            turnsBetweenHarvests: {
                description: "After a food tile is harvested, the number of "
                    + "turns before it can be harvested again.",
                // <<-- Creer-Merge: turnsBetweenHarvests -->>
                default: 10,
            },
            turnsToCreateHuman: {
                description: "The number of turns between fresh humans being "
                    + "spawned on the road.",
                // <<-- Creer-Merge: turnsToCreateHuman -->>
                default: 30,
            },
            turnsToLowerHarvest: {
                description: "The number of turns before the harvest rate is "
                    + "lowered (length of each season basically).",
                // <<-- Creer-Merge: turnsToLowerHarvest -->>
                default: 60,
            },
            wallMaterials: {
                description: "The number of materials in a wall.",
                // <<-- Creer-Merge: wallMaterials -->>
                default: 75,
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
                default: 720,
                // <<-- /Creer-Merge: max-turns -->>
                min: 1,
                description: "The maximum number of turns before the game is force ended and a winner is determined.",
            },
            // Tiled settings
            mapWidth: {
                // <<-- Creer-Merge: map-width -->>
                default: 26,
                // <<-- /Creer-Merge: map-width -->>
                min: 2,
                description: "The width (in Tiles) for the game map to be initialized to.",
            },
            mapHeight: {
                // <<-- Creer-Merge: map-height -->>
                default: 18,
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
exports.CatastropheGameSettingsManager = CatastropheGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jYXRhc3Ryb3BoZS9nYW1lLXNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEseUJBQWlDO0FBRWpDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSw4QkFBK0IsU0FBUSxjQUFXLENBQUMsWUFBWTtJQUN4RTs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsd0VBQXdFO1lBQ3hFLGtDQUFrQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSyxJQUFZLENBQUMsTUFBTSxDQUFDO1lBRXpDLHFDQUFxQztZQUNyQyxhQUFhLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLDBDQUEwQztzQkFDMUMsaURBQWlEO3NCQUNqRCxlQUFlO2dCQUM1Qix1Q0FBdUM7Z0JBQ3ZDLE9BQU8sRUFBRSxDQUFDO2FBRWI7WUFDRCxlQUFlLEVBQUU7Z0JBQ2IsV0FBVyxFQUFFLG1EQUFtRDtzQkFDbkQsb0NBQW9DO2dCQUNqRCx5Q0FBeUM7Z0JBQ3pDLE9BQU8sRUFBRSxFQUFFO2FBRWQ7WUFDRCxrQkFBa0IsRUFBRTtnQkFDaEIsV0FBVyxFQUFFLG1EQUFtRDtzQkFDbkQsU0FBUztnQkFDdEIsNENBQTRDO2dCQUM1QyxPQUFPLEVBQUUsRUFBRTthQUVkO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2QsV0FBVyxFQUFFLDhDQUE4QztzQkFDOUMsbURBQW1EO3NCQUNuRCxxQkFBcUI7Z0JBQ2xDLDBDQUEwQztnQkFDMUMsT0FBTyxFQUFFLEdBQUc7YUFFZjtZQUNELGlCQUFpQixFQUFFO2dCQUNmLFdBQVcsRUFBRSx3Q0FBd0M7Z0JBQ3JELDJDQUEyQztnQkFDM0MsT0FBTyxFQUFFLEdBQUc7YUFFZjtZQUNELGdCQUFnQixFQUFFO2dCQUNkLFdBQVcsRUFBRSxpREFBaUQ7Z0JBQzlELDBDQUEwQztnQkFDMUMsT0FBTyxFQUFFLEdBQUc7YUFFZjtZQUNELGdCQUFnQixFQUFFO2dCQUNkLFdBQVcsRUFBRSx1Q0FBdUM7Z0JBQ3BELDBDQUEwQztnQkFDMUMsT0FBTyxFQUFFLEVBQUU7YUFFZDtZQUNELFlBQVksRUFBRTtnQkFDVixXQUFXLEVBQUUsd0NBQXdDO2dCQUNyRCxzQ0FBc0M7Z0JBQ3RDLE9BQU8sRUFBRSxDQUFDO2FBRWI7WUFDRCxrQkFBa0IsRUFBRTtnQkFDaEIsV0FBVyxFQUFFLDBDQUEwQztzQkFDMUMsMENBQTBDO2dCQUN2RCw0Q0FBNEM7Z0JBQzVDLE9BQU8sRUFBRSxJQUFJO2FBRWhCO1lBQ0Qsb0JBQW9CLEVBQUU7Z0JBQ2xCLFdBQVcsRUFBRSxnREFBZ0Q7c0JBQ2hELHlDQUF5QztnQkFDdEQsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsRUFBRTthQUVkO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLFdBQVcsRUFBRSxpREFBaUQ7c0JBQ2pELHNCQUFzQjtnQkFDbkMsNENBQTRDO2dCQUM1QyxPQUFPLEVBQUUsRUFBRTthQUVkO1lBQ0QsbUJBQW1CLEVBQUU7Z0JBQ2pCLFdBQVcsRUFBRSxpREFBaUQ7c0JBQ2pELDRDQUE0QztnQkFDekQsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsRUFBRTthQUVkO1lBQ0QsYUFBYSxFQUFFO2dCQUNYLFdBQVcsRUFBRSxvQ0FBb0M7Z0JBQ2pELHVDQUF1QztnQkFDdkMsT0FBTyxFQUFFLEVBQUU7YUFFZDtZQUNELGdDQUFnQztZQUVwQyx3Q0FBd0M7WUFDeEM7Ozs7OztjQU1FO1lBRUUsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7WUFFRCxpQkFBaUI7WUFDakIsUUFBUSxFQUFFO2dCQUNOLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsb0NBQW9DO2dCQUNwQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNkRBQTZEO2FBQzdFO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gscUNBQXFDO2dCQUNyQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsOERBQThEO2FBQzlFO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQU9EOzs7OztPQUtHO0lBQ08sVUFBVSxDQUFDLFlBQTJCO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsb0VBQW9FO1FBQ3BFLHVFQUF1RTtRQUN2RSwwQ0FBMEM7UUFFMUMscUNBQXFDO1FBRXJDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQTFMRCx3RUEwTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXR0aW5nc0Zyb21TY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIG1hbmFnZXIgZm9yIHRoZSBDYXRhc3Ryb3BoZSBnYW1lLlxuICovXG5leHBvcnQgY2xhc3MgQ2F0YXN0cm9waGVHYW1lU2V0dGluZ3NNYW5hZ2VyIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZVNldHRpbmdzIHtcbiAgICAvKipcbiAgICAgKiBUaGlzIGRlc2NyaWJlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBnYW1lIHNldHRpbmdzLCBhbmQgaXMgdXNlZCB0b1xuICAgICAqIGdlbmVyYXRlIHRoZSB2YWx1ZXMsIGFzIHdlbGwgYXMgYmFzaWMgdHlwZSBhbmQgcmFuZ2UgY2hlY2tpbmcuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICByZXR1cm4gdGhpcy5tYWtlU2NoZW1hKHtcbiAgICAgICAgICAgIC8vIEhBQ0s6IGBzdXBlcmAgc2hvdWxkIHdvcmsuIGJ1dCBzY2hlbWEgaXMgdW5kZWZpbmVkIG9uIGl0IGF0IHJ1biB0aW1lLlxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgLi4uKHN1cGVyLnNjaGVtYSB8fCAodGhpcyBhcyBhbnkpLnNjaGVtYSksXG5cbiAgICAgICAgICAgIC8vIENhdGFzdHJvcGhlIGdhbWUgc3BlY2lmaWMgc2V0dGluZ3NcbiAgICAgICAgICAgIGNhdEVuZXJneU11bHQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbXVsdGlwbGllciBmb3IgdGhlIGFtb3VudCBvZiBlbmVyZ3kgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJyZWdlbmVyYXRlZCB3aGVuIHJlc3RpbmcgaW4gYSBzaGVsdGVyIHdpdGggdGhlIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiY2F0IG92ZXJsb3JkLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNhdEVuZXJneU11bHQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNhdEVuZXJneU11bHQgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhcnZlc3RDb29sZG93bjoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdHVybnMgaXQgdGFrZXMgZm9yIGEgVGlsZSB0aGF0IHdhcyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImp1c3QgaGFydmVzdGVkIHRvIGdyb3cgZm9vZCBhZ2Fpbi5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBoYXJ2ZXN0Q29vbGRvd24gLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBoYXJ2ZXN0Q29vbGRvd24gLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvd2VySGFydmVzdEFtb3VudDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgdGhhdCB0aGUgaGFydmVzdCByYXRlIGlzIGxvd2VyZWQgZWFjaCBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcInNlYXNvbi5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBsb3dlckhhcnZlc3RBbW91bnQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBsb3dlckhhcnZlc3RBbW91bnQgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vbnVtZW50Q29zdE11bHQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbXVsdGlwbGllciBmb3IgdGhlIGNvc3Qgb2YgYWN0aW9ucyB3aGVuIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwicGVyZm9ybWluZyB0aGVtIGluIHJhbmdlIG9mIGEgbW9udW1lbnQuIERvZXMgbm90IFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiZWZmZWN0IHBpY2t1cCBjb3N0LlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vbnVtZW50Q29zdE11bHQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAuNSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbW9udW1lbnRDb3N0TXVsdCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW9udW1lbnRNYXRlcmlhbHM6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyBpbiBhIG1vbnVtZW50LlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1vbnVtZW50TWF0ZXJpYWxzIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1vbnVtZW50TWF0ZXJpYWxzIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBuZXV0cmFsTWF0ZXJpYWxzOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG51bWJlciBvZiBtYXRlcmlhbHMgaW4gYSBuZXV0cmFsIFN0cnVjdHVyZS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBuZXV0cmFsTWF0ZXJpYWxzIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyMDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG5ldXRyYWxNYXRlcmlhbHMgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNoZWx0ZXJNYXRlcmlhbHM6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyBpbiBhIHNoZWx0ZXIuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2hlbHRlck1hdGVyaWFscyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNTAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNoZWx0ZXJNYXRlcmlhbHMgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXJ0aW5nRm9vZDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgZm9vZCBQbGF5ZXJzIHN0YXJ0IHdpdGguXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc3RhcnRpbmdGb29kIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzdGFydGluZ0Zvb2QgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXJ2aW5nRW5lcmd5TXVsdDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtdWx0aXBsaWVyIGZvciB0aGUgYW1vdW50IG9mIGVuZXJneSBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcInJlZ2VuZXJhdGVkIHdoZW4gcmVzdGluZyB3aGlsZSBzdGFydmluZy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzdGFydmluZ0VuZXJneU11bHQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAuMjUsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHN0YXJ2aW5nRW5lcmd5TXVsdCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHVybnNCZXR3ZWVuSGFydmVzdHM6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBZnRlciBhIGZvb2QgdGlsZSBpcyBoYXJ2ZXN0ZWQsIHRoZSBudW1iZXIgb2YgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJ0dXJucyBiZWZvcmUgaXQgY2FuIGJlIGhhcnZlc3RlZCBhZ2Fpbi5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0dXJuc0JldHdlZW5IYXJ2ZXN0cyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHR1cm5zQmV0d2VlbkhhcnZlc3RzIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0dXJuc1RvQ3JlYXRlSHVtYW46IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIHR1cm5zIGJldHdlZW4gZnJlc2ggaHVtYW5zIGJlaW5nIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwic3Bhd25lZCBvbiB0aGUgcm9hZC5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0dXJuc1RvQ3JlYXRlSHVtYW4gLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDMwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0dXJuc1RvQ3JlYXRlSHVtYW4gLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR1cm5zVG9Mb3dlckhhcnZlc3Q6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgaGFydmVzdCByYXRlIGlzIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwibG93ZXJlZCAobGVuZ3RoIG9mIGVhY2ggc2Vhc29uIGJhc2ljYWxseSkuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogdHVybnNUb0xvd2VySGFydmVzdCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNjAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHR1cm5zVG9Mb3dlckhhcnZlc3QgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhbGxNYXRlcmlhbHM6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyBpbiBhIHdhbGwuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogd2FsbE1hdGVyaWFscyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNzUsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHdhbGxNYXRlcmlhbHMgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgLy8geW91IGNhbiBhZGQgbW9yZSBzZXR0aW5ncyBoZXJlLCBlLmcuOlxuICAgICAgICAvKlxuICAgICAgICBzb21lVmFyaWFibGVMaWtlVW5pdEhlYWx0aDoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRGVzY3JpYmUgd2hhdCB0aGlzIHNldHRpbmcgZG9lcyBmb3IgdGhlIHBsYXllcnMuXCIsXG4gICAgICAgICAgICBkZWZhdWx0OiAxMzM3LFxuICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICB9LFxuICAgICAgICAqL1xuXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2NoZW1hIC0tPj5cblxuICAgICAgICAgICAgLy8gQmFzZSBzZXR0aW5nc1xuICAgICAgICAgICAgcGxheWVyU3RhcnRpbmdUaW1lOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDZlMTAsIC8vIDEgbWluIGluIG5zXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHBsYXllci1zdGFydGluZy10aW1lIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHN0YXJ0aW5nIHRpbWUgKGluIG5zKSBmb3IgZWFjaCBwbGF5ZXIuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBUdXJuIGJhc2VkIHNldHRpbmdzXG4gICAgICAgICAgICB0aW1lQWRkZWRQZXJUdXJuOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogdGltZS1hZGRlZC1wZXItdHVybiAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMWU5LCAvLyAxIHNlYyBpbiBucyxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogdGltZS1hZGRlZC1wZXItdHVybiAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdGltZSAoaW4gbmFuby1zZWNvbmRzKSB0byBhZGQgYWZ0ZXIgZWFjaCBwbGF5ZXIgcGVyZm9ybXMgYSB0dXJuLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1heFR1cm5zOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA3MjAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1heC10dXJucyAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIG51bWJlciBvZiB0dXJucyBiZWZvcmUgdGhlIGdhbWUgaXMgZm9yY2UgZW5kZWQgYW5kIGEgd2lubmVyIGlzIGRldGVybWluZWQuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBUaWxlZCBzZXR0aW5nc1xuICAgICAgICAgICAgbWFwV2lkdGg6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXAtd2lkdGggLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDI2LFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYXAtd2lkdGggLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgd2lkdGggKGluIFRpbGVzKSBmb3IgdGhlIGdhbWUgbWFwIHRvIGJlIGluaXRpYWxpemVkIHRvLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1hcEhlaWdodDoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hcC1oZWlnaHQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDE4LFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYXAtaGVpZ2h0IC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGhlaWdodCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHZhbHVlcyBmb3IgdGhlIGdhbWUncyBzZXR0aW5nc1xuICAgICAqL1xuICAgIHB1YmxpYyB2YWx1ZXMhOiBTZXR0aW5nc0Zyb21TY2hlbWE8Q2F0YXN0cm9waGVHYW1lU2V0dGluZ3NNYW5hZ2VyW1wic2NoZW1hXCJdPjtcblxuICAgIC8qKlxuICAgICAqIFRyeSB0byBpbnZhbGlkYXRlIGFsbCB0aGUgZ2FtZSBzZXR0aW5ncyBoZXJlLCBzbyBpbnZhbGlkIHZhbHVlcyBkbyBub3RcbiAgICAgKiByZWFjaCB0aGUgZ2FtZS5cbiAgICAgKiBAcGFyYW0gc29tZVNldHRpbmdzIEEgc3Vic2V0IG9mIHNldHRpbmdzIHRoYXQgd2lsbCBiZSB0ZXN0ZWRcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBpZiB0aGUgc2V0dGluZ3MgZmFpbCB0byB2YWxpZGF0ZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZShzb21lU2V0dGluZ3M6IFVua25vd25PYmplY3QpOiBVbmtub3duT2JqZWN0IHwgRXJyb3Ige1xuICAgICAgICBjb25zdCBpbnZhbGlkYXRlZCA9IHN1cGVyLmludmFsaWRhdGUoc29tZVNldHRpbmdzKTtcbiAgICAgICAgaWYgKGludmFsaWRhdGVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkYXRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0geyAuLi50aGlzLnZhbHVlcywgLi4uc29tZVNldHRpbmdzLCAuLi5pbnZhbGlkYXRlZCB9O1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIC8vIFdyaXRlIGxvZ2ljIGhlcmUgdG8gY2hlY2sgdGhlIHZhbHVlcyBpbiBgc2V0dGluZ3NgLiBJZiB0aGVyZSBpcyBhXG4gICAgICAgIC8vIHByb2JsZW0gd2l0aCB0aGUgdmFsdWVzIGEgcGxheWVyIHNlbnQsIHJldHVybiBhbiBlcnJvciB3aXRoIGEgc3RyaW5nXG4gICAgICAgIC8vIGRlc2NyaWJpbmcgd2h5IHRoZWlyIHZhbHVlKHMpIGFyZSB3cm9uZ1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufVxuIl19