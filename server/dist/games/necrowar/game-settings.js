"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Necrowar game.
 */
class NecrowarGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Necrowar game specific settings
            goldIncomePerUnit: {
                description: "The amount of gold income per turn per unit in a "
                    + "mine.",
                // <<-- Creer-Merge: goldIncomePerUnit -->>
                default: 5,
            },
            islandIncomePerUnit: {
                description: "The amount of gold income per turn per unit in "
                    + "the island mine.",
                // <<-- Creer-Merge: islandIncomePerUnit -->>
                default: 10,
            },
            manaIncomePerUnit: {
                description: "The Amount of gold income per turn per unit "
                    + "fishing on the river side.",
                // <<-- Creer-Merge: manaIncomePerUnit -->>
                default: 5,
            },
            riverPhase: {
                description: "The amount of turns it takes between the river "
                    + "changing phases.",
                // <<-- Creer-Merge: riverPhase -->>
                default: 25,
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
                default: 200,
                // <<-- /Creer-Merge: max-turns -->>
                min: 1,
                description: "The maximum number of turns before the game is force ended and a winner is determined.",
            },
            // Tiled settings
            mapWidth: {
                // <<-- Creer-Merge: map-width -->>
                default: 63,
                // <<-- /Creer-Merge: map-width -->>
                min: 2,
                description: "The width (in Tiles) for the game map to be initialized to.",
            },
            mapHeight: {
                // <<-- Creer-Merge: map-height -->>
                default: 32,
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
exports.NecrowarGameSettingsManager = NecrowarGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9uZWNyb3dhci9nYW1lLXNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEseUJBQWlDO0FBRWpDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSwyQkFBNEIsU0FBUSxjQUFXLENBQUMsWUFBWTtJQUNyRTs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsd0VBQXdFO1lBQ3hFLGtDQUFrQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSyxJQUFZLENBQUMsTUFBTSxDQUFDO1lBRXpDLGtDQUFrQztZQUNsQyxpQkFBaUIsRUFBRTtnQkFDZixXQUFXLEVBQUUsbURBQW1EO3NCQUNuRCxPQUFPO2dCQUNwQiwyQ0FBMkM7Z0JBQzNDLE9BQU8sRUFBRSxDQUFDO2FBRWI7WUFDRCxtQkFBbUIsRUFBRTtnQkFDakIsV0FBVyxFQUFFLGlEQUFpRDtzQkFDakQsa0JBQWtCO2dCQUMvQiw2Q0FBNkM7Z0JBQzdDLE9BQU8sRUFBRSxFQUFFO2FBRWQ7WUFDRCxpQkFBaUIsRUFBRTtnQkFDZixXQUFXLEVBQUUsOENBQThDO3NCQUM5Qyw0QkFBNEI7Z0JBQ3pDLDJDQUEyQztnQkFDM0MsT0FBTyxFQUFFLENBQUM7YUFFYjtZQUNELFVBQVUsRUFBRTtnQkFDUixXQUFXLEVBQUUsaURBQWlEO3NCQUNqRCxrQkFBa0I7Z0JBQy9CLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7YUFFZDtZQUNELGdDQUFnQztZQUVoQyx3Q0FBd0M7WUFDeEM7Ozs7OztjQU1FO1lBRUYsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7WUFFRCxpQkFBaUI7WUFDakIsUUFBUSxFQUFFO2dCQUNOLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsb0NBQW9DO2dCQUNwQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNkRBQTZEO2FBQzdFO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gscUNBQXFDO2dCQUNyQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsOERBQThEO2FBQzlFO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQU9EOzs7OztPQUtHO0lBQ08sVUFBVSxDQUFDLFlBQTJCO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsb0VBQW9FO1FBQ3BFLHVFQUF1RTtRQUN2RSwwQ0FBMEM7UUFFMUMscUNBQXFDO1FBRXJDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQTlIRCxrRUE4SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXR0aW5nc0Zyb21TY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIG1hbmFnZXIgZm9yIHRoZSBOZWNyb3dhciBnYW1lLlxuICovXG5leHBvcnQgY2xhc3MgTmVjcm93YXJHYW1lU2V0dGluZ3NNYW5hZ2VyIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZVNldHRpbmdzIHtcbiAgICAvKipcbiAgICAgKiBUaGlzIGRlc2NyaWJlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBnYW1lIHNldHRpbmdzLCBhbmQgaXMgdXNlZCB0b1xuICAgICAqIGdlbmVyYXRlIHRoZSB2YWx1ZXMsIGFzIHdlbGwgYXMgYmFzaWMgdHlwZSBhbmQgcmFuZ2UgY2hlY2tpbmcuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICByZXR1cm4gdGhpcy5tYWtlU2NoZW1hKHtcbiAgICAgICAgICAgIC8vIEhBQ0s6IGBzdXBlcmAgc2hvdWxkIHdvcmsuIGJ1dCBzY2hlbWEgaXMgdW5kZWZpbmVkIG9uIGl0IGF0IHJ1biB0aW1lLlxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgLi4uKHN1cGVyLnNjaGVtYSB8fCAodGhpcyBhcyBhbnkpLnNjaGVtYSksXG5cbiAgICAgICAgICAgIC8vIE5lY3Jvd2FyIGdhbWUgc3BlY2lmaWMgc2V0dGluZ3NcbiAgICAgICAgICAgIGdvbGRJbmNvbWVQZXJVbml0OiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiBnb2xkIGluY29tZSBwZXIgdHVybiBwZXIgdW5pdCBpbiBhIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwibWluZS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBnb2xkSW5jb21lUGVyVW5pdCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogZ29sZEluY29tZVBlclVuaXQgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzbGFuZEluY29tZVBlclVuaXQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIGdvbGQgaW5jb21lIHBlciB0dXJuIHBlciB1bml0IGluIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwidGhlIGlzbGFuZCBtaW5lLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGlzbGFuZEluY29tZVBlclVuaXQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpc2xhbmRJbmNvbWVQZXJVbml0IC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtYW5hSW5jb21lUGVyVW5pdDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBBbW91bnQgb2YgZ29sZCBpbmNvbWUgcGVyIHR1cm4gcGVyIHVuaXQgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJmaXNoaW5nIG9uIHRoZSByaXZlciBzaWRlLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hbmFJbmNvbWVQZXJVbml0IC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA1LFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYW5hSW5jb21lUGVyVW5pdCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcml2ZXJQaGFzZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdHVybnMgaXQgdGFrZXMgYmV0d2VlbiB0aGUgcml2ZXIgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJjaGFuZ2luZyBwaGFzZXMuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcml2ZXJQaGFzZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjUsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJpdmVyUGhhc2UgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIC8vIHlvdSBjYW4gYWRkIG1vcmUgc2V0dGluZ3MgaGVyZSwgZS5nLjpcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBzb21lVmFyaWFibGVMaWtlVW5pdEhlYWx0aDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkRlc2NyaWJlIHdoYXQgdGhpcyBzZXR0aW5nIGRvZXMgZm9yIHRoZSBwbGF5ZXJzLlwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEzMzcsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgICAgICAvLyBCYXNlIHNldHRpbmdzXG4gICAgICAgICAgICBwbGF5ZXJTdGFydGluZ1RpbWU6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNmUxMCwgLy8gMSBtaW4gaW4gbnNcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhcnRpbmcgdGltZSAoaW4gbnMpIGZvciBlYWNoIHBsYXllci5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFR1cm4gYmFzZWQgc2V0dGluZ3NcbiAgICAgICAgICAgIHRpbWVBZGRlZFBlclR1cm46IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxZTksIC8vIDEgc2VjIGluIG5zLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIHRvIGFkZCBhZnRlciBlYWNoIHBsYXllciBwZXJmb3JtcyBhIHR1cm4uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4VHVybnM6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgZ2FtZSBpcyBmb3JjZSBlbmRlZCBhbmQgYSB3aW5uZXIgaXMgZGV0ZXJtaW5lZC5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFRpbGVkIHNldHRpbmdzXG4gICAgICAgICAgICBtYXBXaWR0aDoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNjMsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB3aWR0aCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFwSGVpZ2h0OiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWFwLWhlaWdodCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMzIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC1oZWlnaHQgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgaGVpZ2h0IChpbiBUaWxlcykgZm9yIHRoZSBnYW1lIG1hcCB0byBiZSBpbml0aWFsaXplZCB0by5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWVzIGZvciB0aGUgZ2FtZSdzIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyE6IFNldHRpbmdzRnJvbVNjaGVtYTxOZWNyb3dhckdhbWVTZXR0aW5nc01hbmFnZXJbXCJzY2hlbWFcIl0+O1xuXG4gICAgLyoqXG4gICAgICogVHJ5IHRvIGludmFsaWRhdGUgYWxsIHRoZSBnYW1lIHNldHRpbmdzIGhlcmUsIHNvIGludmFsaWQgdmFsdWVzIGRvIG5vdFxuICAgICAqIHJlYWNoIHRoZSBnYW1lLlxuICAgICAqIEBwYXJhbSBzb21lU2V0dGluZ3MgQSBzdWJzZXQgb2Ygc2V0dGluZ3MgdGhhdCB3aWxsIGJlIHRlc3RlZFxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIGlmIHRoZSBzZXR0aW5ncyBmYWlsIHRvIHZhbGlkYXRlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlKHNvbWVTZXR0aW5nczogVW5rbm93bk9iamVjdCk6IFVua25vd25PYmplY3QgfCBFcnJvciB7XG4gICAgICAgIGNvbnN0IGludmFsaWRhdGVkID0gc3VwZXIuaW52YWxpZGF0ZShzb21lU2V0dGluZ3MpO1xuICAgICAgICBpZiAoaW52YWxpZGF0ZWQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWRhdGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7IC4uLnRoaXMudmFsdWVzLCAuLi5zb21lU2V0dGluZ3MsIC4uLmludmFsaWRhdGVkIH07XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZSAtLT4+XG5cbiAgICAgICAgLy8gV3JpdGUgbG9naWMgaGVyZSB0byBjaGVjayB0aGUgdmFsdWVzIGluIGBzZXR0aW5nc2AuIElmIHRoZXJlIGlzIGFcbiAgICAgICAgLy8gcHJvYmxlbSB3aXRoIHRoZSB2YWx1ZXMgYSBwbGF5ZXIgc2VudCwgcmV0dXJuIGFuIGVycm9yIHdpdGggYSBzdHJpbmdcbiAgICAgICAgLy8gZGVzY3JpYmluZyB3aHkgdGhlaXIgdmFsdWUocykgYXJlIHdyb25nXG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgICB9XG59XG4iXX0=