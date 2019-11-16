"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Pirates game.
 */
class PiratesGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Pirates game specific settings
            buryInterestRate: {
                description: "The rate buried gold increases each turn.",
                // <<-- Creer-Merge: buryInterestRate -->>
                default: 0,
            },
            crewCost: {
                description: "How much gold it costs to construct a single "
                    + "crew.",
                // <<-- Creer-Merge: crewCost -->>
                default: 0,
            },
            crewDamage: {
                description: "How much damage crew deal to each other.",
                // <<-- Creer-Merge: crewDamage -->>
                default: 0,
            },
            crewHealth: {
                description: "The maximum amount of health a crew member can "
                    + "have.",
                // <<-- Creer-Merge: crewHealth -->>
                default: 0,
            },
            crewMoves: {
                description: "The number of moves Units with only crew are "
                    + "given each turn.",
                // <<-- Creer-Merge: crewMoves -->>
                default: 0,
            },
            crewRange: {
                description: "A crew's attack range. Range is circular.",
                // <<-- Creer-Merge: crewRange -->>
                default: 0,
            },
            healFactor: {
                description: "How much health a Unit recovers when they rest.",
                // <<-- Creer-Merge: healFactor -->>
                default: 0,
            },
            merchantGoldRate: {
                description: "How much gold merchant Ports get each turn.",
                // <<-- Creer-Merge: merchantGoldRate -->>
                default: 0,
            },
            merchantInterestRate: {
                description: "When a merchant ship spawns, the amount of "
                    + "additional gold it has relative to the Port's "
                    + "investment.",
                // <<-- Creer-Merge: merchantInterestRate -->>
                default: 0,
            },
            minInterestDistance: {
                description: "The Euclidean distance buried gold must be from "
                    + "the Player's Port to accumulate interest.",
                // <<-- Creer-Merge: minInterestDistance -->>
                default: 0,
            },
            restRange: {
                description: "How far a Unit can be from a Port to rest. Range "
                    + "is circular.",
                // <<-- Creer-Merge: restRange -->>
                default: 0,
            },
            shipCost: {
                description: "How much gold it costs to construct a ship.",
                // <<-- Creer-Merge: shipCost -->>
                default: 0,
            },
            shipDamage: {
                description: "How much damage ships deal to ships and ports.",
                // <<-- Creer-Merge: shipDamage -->>
                default: 0,
            },
            shipHealth: {
                description: "The maximum amount of health a ship can have.",
                // <<-- Creer-Merge: shipHealth -->>
                default: 0,
            },
            shipMoves: {
                description: "The number of moves Units with ships are given "
                    + "each turn.",
                // <<-- Creer-Merge: shipMoves -->>
                default: 0,
            },
            shipRange: {
                description: "A ship's attack range. Range is circular.",
                // <<-- Creer-Merge: shipRange -->>
                default: 0,
            },
            // <<-- Creer-Merge: schema -->>
            startingGold: {
                description: "The amount of gold to start with per player. "
                    + "Values < 0 will default to shipCost * 3 + crewCost",
                default: -1,
            },
            maxTileGold: {
                description: "The maximum amount of gold a Tile can have on it.",
                default: 10000,
                min: 1,
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
                default: 720,
                // <<-- /Creer-Merge: max-turns -->>
                min: 1,
                description: "The maximum number of turns before the game is force ended and a winner is determined.",
            },
            // Tiled settings
            mapWidth: {
                // <<-- Creer-Merge: map-width -->>
                default: 40,
                // <<-- /Creer-Merge: map-width -->>
                min: 2,
                description: "The width (in Tiles) for the game map to be initialized to.",
            },
            mapHeight: {
                // <<-- Creer-Merge: map-height -->>
                default: 20,
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
exports.PiratesGameSettingsManager = PiratesGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9waXJhdGVzL2dhbWUtc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5QkFBaUM7QUFFakMsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLDBCQUEyQixTQUFRLGNBQVcsQ0FBQyxZQUFZO0lBQ3BFOzs7T0FHRztJQUNILElBQVcsTUFBTTtRQUNiLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNuQix3RUFBd0U7WUFDeEUsa0NBQWtDO1lBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFLLElBQVksQ0FBQyxNQUFNLENBQUM7WUFFekMsaUNBQWlDO1lBQ2pDLGdCQUFnQixFQUFFO2dCQUNkLFdBQVcsRUFBRSwyQ0FBMkM7Z0JBQ3hELDBDQUEwQztnQkFDMUMsT0FBTyxFQUFFLENBQUM7YUFFYjtZQUNELFFBQVEsRUFBRTtnQkFDTixXQUFXLEVBQUUsK0NBQStDO3NCQUMvQyxPQUFPO2dCQUNwQixrQ0FBa0M7Z0JBQ2xDLE9BQU8sRUFBRSxDQUFDO2FBRWI7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLDBDQUEwQztnQkFDdkQsb0NBQW9DO2dCQUNwQyxPQUFPLEVBQUUsQ0FBQzthQUViO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxpREFBaUQ7c0JBQ2pELE9BQU87Z0JBQ3BCLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLENBQUM7YUFFYjtZQUNELFNBQVMsRUFBRTtnQkFDUCxXQUFXLEVBQUUsK0NBQStDO3NCQUMvQyxrQkFBa0I7Z0JBQy9CLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLENBQUM7YUFFYjtZQUNELFNBQVMsRUFBRTtnQkFDUCxXQUFXLEVBQUUsMkNBQTJDO2dCQUN4RCxtQ0FBbUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFD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SUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsb0VBQW9FO1FBQ3BFLHVFQUF1RTtRQUN2RSwwQ0FBMEM7UUFFMUMscUNBQXFDO1FBRXJDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQTdNRCxnRUE2TUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXR0aW5nc0Zyb21TY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIG1hbmFnZXIgZm9yIHRoZSBQaXJhdGVzIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaXJhdGVzR2FtZVNldHRpbmdzTWFuYWdlciBleHRlbmRzIEJhc2VDbGFzc2VzLkdhbWVTZXR0aW5ncyB7XG4gICAgLyoqXG4gICAgICogVGhpcyBkZXNjcmliZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ2FtZSBzZXR0aW5ncywgYW5kIGlzIHVzZWQgdG9cbiAgICAgKiBnZW5lcmF0ZSB0aGUgdmFsdWVzLCBhcyB3ZWxsIGFzIGJhc2ljIHR5cGUgYW5kIHJhbmdlIGNoZWNraW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQgc2NoZW1hKCkgeyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOnR5cGVkZWZcbiAgICAgICAgcmV0dXJuIHRoaXMubWFrZVNjaGVtYSh7XG4gICAgICAgICAgICAvLyBIQUNLOiBgc3VwZXJgIHNob3VsZCB3b3JrLiBidXQgc2NoZW1hIGlzIHVuZGVmaW5lZCBvbiBpdCBhdCBydW4gdGltZS5cbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICAgIC4uLihzdXBlci5zY2hlbWEgfHwgKHRoaXMgYXMgYW55KS5zY2hlbWEpLFxuXG4gICAgICAgICAgICAvLyBQaXJhdGVzIGdhbWUgc3BlY2lmaWMgc2V0dGluZ3NcbiAgICAgICAgICAgIGJ1cnlJbnRlcmVzdFJhdGU6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgcmF0ZSBidXJpZWQgZ29sZCBpbmNyZWFzZXMgZWFjaCB0dXJuLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGJ1cnlJbnRlcmVzdFJhdGUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGJ1cnlJbnRlcmVzdFJhdGUgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZXdDb3N0OiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSG93IG11Y2ggZ29sZCBpdCBjb3N0cyB0byBjb25zdHJ1Y3QgYSBzaW5nbGUgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJjcmV3LlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGNyZXdDb3N0IC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjcmV3Q29zdCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3Jld0RhbWFnZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkhvdyBtdWNoIGRhbWFnZSBjcmV3IGRlYWwgdG8gZWFjaCBvdGhlci5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjcmV3RGFtYWdlIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjcmV3RGFtYWdlIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjcmV3SGVhbHRoOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gYW1vdW50IG9mIGhlYWx0aCBhIGNyZXcgbWVtYmVyIGNhbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImhhdmUuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY3Jld0hlYWx0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY3Jld0hlYWx0aCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3Jld01vdmVzOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG51bWJlciBvZiBtb3ZlcyBVbml0cyB3aXRoIG9ubHkgY3JldyBhcmUgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJnaXZlbiBlYWNoIHR1cm4uXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY3Jld01vdmVzIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjcmV3TW92ZXMgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZXdSYW5nZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkEgY3JldydzIGF0dGFjayByYW5nZS4gUmFuZ2UgaXMgY2lyY3VsYXIuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY3Jld1JhbmdlIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjcmV3UmFuZ2UgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWxGYWN0b3I6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbXVjaCBoZWFsdGggYSBVbml0IHJlY292ZXJzIHdoZW4gdGhleSByZXN0LlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGhlYWxGYWN0b3IgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGhlYWxGYWN0b3IgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lcmNoYW50R29sZFJhdGU6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbXVjaCBnb2xkIG1lcmNoYW50IFBvcnRzIGdldCBlYWNoIHR1cm4uXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWVyY2hhbnRHb2xkUmF0ZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWVyY2hhbnRHb2xkUmF0ZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVyY2hhbnRJbnRlcmVzdFJhdGU6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJXaGVuIGEgbWVyY2hhbnQgc2hpcCBzcGF3bnMsIHRoZSBhbW91bnQgb2YgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJhZGRpdGlvbmFsIGdvbGQgaXQgaGFzIHJlbGF0aXZlIHRvIHRoZSBQb3J0J3MgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJpbnZlc3RtZW50LlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1lcmNoYW50SW50ZXJlc3RSYXRlIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtZXJjaGFudEludGVyZXN0UmF0ZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWluSW50ZXJlc3REaXN0YW5jZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBFdWNsaWRlYW4gZGlzdGFuY2UgYnVyaWVkIGdvbGQgbXVzdCBiZSBmcm9tIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwidGhlIFBsYXllcidzIFBvcnQgdG8gYWNjdW11bGF0ZSBpbnRlcmVzdC5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtaW5JbnRlcmVzdERpc3RhbmNlIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtaW5JbnRlcmVzdERpc3RhbmNlIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZXN0UmFuZ2U6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgZmFyIGEgVW5pdCBjYW4gYmUgZnJvbSBhIFBvcnQgdG8gcmVzdC4gUmFuZ2UgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJpcyBjaXJjdWxhci5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiByZXN0UmFuZ2UgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJlc3RSYW5nZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hpcENvc3Q6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbXVjaCBnb2xkIGl0IGNvc3RzIHRvIGNvbnN0cnVjdCBhIHNoaXAuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2hpcENvc3QgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNoaXBDb3N0IC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaGlwRGFtYWdlOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSG93IG11Y2ggZGFtYWdlIHNoaXBzIGRlYWwgdG8gc2hpcHMgYW5kIHBvcnRzLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNoaXBEYW1hZ2UgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNoaXBEYW1hZ2UgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNoaXBIZWFsdGg6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSBhbW91bnQgb2YgaGVhbHRoIGEgc2hpcCBjYW4gaGF2ZS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzaGlwSGVhbHRoIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzaGlwSGVhbHRoIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaGlwTW92ZXM6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIG1vdmVzIFVuaXRzIHdpdGggc2hpcHMgYXJlIGdpdmVuIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiZWFjaCB0dXJuLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNoaXBNb3ZlcyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2hpcE1vdmVzIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaGlwUmFuZ2U6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBIHNoaXAncyBhdHRhY2sgcmFuZ2UuIFJhbmdlIGlzIGNpcmN1bGFyLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNoaXBSYW5nZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2hpcFJhbmdlIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgICAgICBzdGFydGluZ0dvbGQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIGdvbGQgdG8gc3RhcnQgd2l0aCBwZXIgcGxheWVyLiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKyBcIlZhbHVlcyA8IDAgd2lsbCBkZWZhdWx0IHRvIHNoaXBDb3N0ICogMyArIGNyZXdDb3N0XCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogLTEsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBtYXhUaWxlR29sZCA6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSBhbW91bnQgb2YgZ29sZCBhIFRpbGUgY2FuIGhhdmUgb24gaXQuXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTAwMDAsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIC8vIEJhc2Ugc2V0dGluZ3NcbiAgICAgICAgICAgIHBsYXllclN0YXJ0aW5nVGltZToge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHBsYXllci1zdGFydGluZy10aW1lIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA2ZTEwLCAvLyAxIG1pbiBpbiBuc1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBzdGFydGluZyB0aW1lIChpbiBucykgZm9yIGVhY2ggcGxheWVyLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gVHVybiBiYXNlZCBzZXR0aW5nc1xuICAgICAgICAgICAgdGltZUFkZGVkUGVyVHVybjoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHRpbWUtYWRkZWQtcGVyLXR1cm4gLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDFlOSwgLy8gMSBzZWMgaW4gbnMsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHRpbWUtYWRkZWQtcGVyLXR1cm4gLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIHRpbWUgKGluIG5hbm8tc2Vjb25kcykgdG8gYWRkIGFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGEgdHVybi5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXhUdXJuczoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1heC10dXJucyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNzIwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYmVmb3JlIHRoZSBnYW1lIGlzIGZvcmNlIGVuZGVkIGFuZCBhIHdpbm5lciBpcyBkZXRlcm1pbmVkLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gVGlsZWQgc2V0dGluZ3NcbiAgICAgICAgICAgIG1hcFdpZHRoOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWFwLXdpZHRoIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA0MCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWFwLXdpZHRoIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDIsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHdpZHRoIChpbiBUaWxlcykgZm9yIHRoZSBnYW1lIG1hcCB0byBiZSBpbml0aWFsaXplZCB0by5cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYXBIZWlnaHQ6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXAtaGVpZ2h0IC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWFwLWhlaWdodCAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBoZWlnaHQgKGluIFRpbGVzKSBmb3IgdGhlIGdhbWUgbWFwIHRvIGJlIGluaXRpYWxpemVkIHRvLlwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCB2YWx1ZXMgZm9yIHRoZSBnYW1lJ3Mgc2V0dGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgdmFsdWVzITogU2V0dGluZ3NGcm9tU2NoZW1hPFBpcmF0ZXNHYW1lU2V0dGluZ3NNYW5hZ2VyW1wic2NoZW1hXCJdPjtcblxuICAgIC8qKlxuICAgICAqIFRyeSB0byBpbnZhbGlkYXRlIGFsbCB0aGUgZ2FtZSBzZXR0aW5ncyBoZXJlLCBzbyBpbnZhbGlkIHZhbHVlcyBkbyBub3RcbiAgICAgKiByZWFjaCB0aGUgZ2FtZS5cbiAgICAgKiBAcGFyYW0gc29tZVNldHRpbmdzIEEgc3Vic2V0IG9mIHNldHRpbmdzIHRoYXQgd2lsbCBiZSB0ZXN0ZWRcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBpZiB0aGUgc2V0dGluZ3MgZmFpbCB0byB2YWxpZGF0ZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZShzb21lU2V0dGluZ3M6IFVua25vd25PYmplY3QpOiBVbmtub3duT2JqZWN0IHwgRXJyb3Ige1xuICAgICAgICBjb25zdCBpbnZhbGlkYXRlZCA9IHN1cGVyLmludmFsaWRhdGUoc29tZVNldHRpbmdzKTtcbiAgICAgICAgaWYgKGludmFsaWRhdGVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkYXRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0geyAuLi50aGlzLnZhbHVlcywgLi4uc29tZVNldHRpbmdzLCAuLi5pbnZhbGlkYXRlZCB9O1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIC8vIFdyaXRlIGxvZ2ljIGhlcmUgdG8gY2hlY2sgdGhlIHZhbHVlcyBpbiBgc2V0dGluZ3NgLiBJZiB0aGVyZSBpcyBhXG4gICAgICAgIC8vIHByb2JsZW0gd2l0aCB0aGUgdmFsdWVzIGEgcGxheWVyIHNlbnQsIHJldHVybiBhbiBlcnJvciB3aXRoIGEgc3RyaW5nXG4gICAgICAgIC8vIGRlc2NyaWJpbmcgd2h5IHRoZWlyIHZhbHVlKHMpIGFyZSB3cm9uZ1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufVxuIl19