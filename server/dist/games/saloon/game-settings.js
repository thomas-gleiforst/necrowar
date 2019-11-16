"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Saloon game.
 */
class SaloonGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Saloon game specific settings
            // <<-- Creer-Merge: schema -->>
            turnsDrunk: {
                description: "The number of turns a cowboy is busy being drunk, after it first gets drunk.",
                default: 5,
                min: 0,
            },
            bartenderCooldown: {
                description: "How many turns a Bartender is busy after throwing a bottle.",
                default: 5,
                min: 0,
            },
            rowdinessToSiesta: {
                description: "How much rowdiness a player must get to force a siesta.",
                default: 8,
                min: 1,
            },
            siestaLength: {
                description: "How many turns a siesta lasts",
                default: 8,
                min: 0,
            },
            maxCowboysPerJob: {
                description: "Maximum number of cowboys that can be called in per job.",
                default: 2,
                min: 1,
            },
            sharpshooterDamage: {
                description: "How much damage a Sharpshooter does to everything it hits.",
                default: 2,
                min: 0,
            },
            brawlerDamage: {
                description: "How much damage a Brawler does to its surroundings.",
                default: 1,
                min: 0,
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
exports.SaloonGameSettingsManager = SaloonGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zYWxvb24vZ2FtZS1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHlCQUFpQztBQUVqQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEseUJBQTBCLFNBQVEsY0FBVyxDQUFDLFlBQVk7SUFDbkU7OztPQUdHO0lBQ0gsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25CLHdFQUF3RTtZQUN4RSxrQ0FBa0M7WUFDbEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUssSUFBWSxDQUFDLE1BQU0sQ0FBQztZQUV6QyxnQ0FBZ0M7WUFDaEMsZ0NBQWdDO1lBRWhDLFVBQVUsRUFBRTtnQkFDUixXQUFXLEVBQUUsOEVBQThFO2dCQUMzRixPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQzthQUNUO1lBQ0QsaUJBQWlCLEVBQUU7Z0JBQ2YsV0FBVyxFQUFFLDZEQUE2RDtnQkFDMUUsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFDVDtZQUNELGlCQUFpQixFQUFFO2dCQUNmLFdBQVcsRUFBRSx5REFBeUQ7Z0JBQ3RFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDO2FBQ1Q7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsV0FBVyxFQUFFLCtCQUErQjtnQkFDNUMsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFDVDtZQUNELGdCQUFnQixFQUFFO2dCQUNkLFdBQVcsRUFBRSwwREFBMEQ7Z0JBQ3ZFLE9BQU8sRUFBRSxDQUFDO2dCQUNWLEdBQUcsRUFBRSxDQUFDO2FBQ1Q7WUFDRCxrQkFBa0IsRUFBRTtnQkFDaEIsV0FBVyxFQUFFLDREQUE0RDtnQkFDekUsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsR0FBRyxFQUFFLENBQUM7YUFDVDtZQUNELGFBQWEsRUFBRTtnQkFDWCxXQUFXLEVBQUUscURBQXFEO2dCQUNsRSxPQUFPLEVBQUUsQ0FBQztnQkFDVixHQUFHLEVBQUUsQ0FBQzthQUNUO1lBRUQsaUNBQWlDO1lBRWpDLGdCQUFnQjtZQUNoQixrQkFBa0IsRUFBRTtnQkFDaEIsOENBQThDO2dCQUM5QyxPQUFPLEVBQUUsSUFBSTtnQkFDYiwrQ0FBK0M7Z0JBQy9DLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSw0Q0FBNEM7YUFDNUQ7WUFFRCxzQkFBc0I7WUFDdEIsZ0JBQWdCLEVBQUU7Z0JBQ2QsNkNBQTZDO2dCQUM3QyxPQUFPLEVBQUUsR0FBRztnQkFDWiw4Q0FBOEM7Z0JBQzlDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSxnRkFBZ0Y7YUFDaEc7WUFDRCxRQUFRLEVBQUU7Z0JBQ04sbUNBQW1DO2dCQUNuQyxPQUFPLEVBQUUsR0FBRztnQkFDWixvQ0FBb0M7Z0JBQ3BDLEdBQUcsRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7WUFFRCxpQkFBaUI7WUFDakIsUUFBUSxFQUFFO2dCQUNOLG1DQUFtQztnQkFDbkMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsb0NBQW9DO2dCQUNwQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNkRBQTZEO2FBQzdFO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLG9DQUFvQztnQkFDcEMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gscUNBQXFDO2dCQUNyQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsOERBQThEO2FBQzlFO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQU9EOzs7OztPQUtHO0lBQ08sVUFBVSxDQUFDLFlBQTJCO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsb0VBQW9FO1FBQ3BFLHVFQUF1RTtRQUN2RSwwQ0FBMEM7UUFFMUMscUNBQXFDO1FBRXJDLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FDSjtBQTdIRCw4REE2SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXR0aW5nc0Zyb21TY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFVua25vd25PYmplY3QgfSBmcm9tIFwifi91dGlsc1wiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG4vLyBhbnkgYWRkaXRpb25hbCBpbXBvcnRzIHlvdSB3YW50IGNhbiBiZSBwbGFjZWQgaGVyZSBzYWZlbHkgYmV0d2VlbiBjcmVlciBydW5zXG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogVGhlIHNldHRpbmdzIG1hbmFnZXIgZm9yIHRoZSBTYWxvb24gZ2FtZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFNhbG9vbkdhbWVTZXR0aW5nc01hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lU2V0dGluZ3Mge1xuICAgIC8qKlxuICAgICAqIFRoaXMgZGVzY3JpYmVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdhbWUgc2V0dGluZ3MsIGFuZCBpcyB1c2VkIHRvXG4gICAgICogZ2VuZXJhdGUgdGhlIHZhbHVlcywgYXMgd2VsbCBhcyBiYXNpYyB0eXBlIGFuZCByYW5nZSBjaGVja2luZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNjaGVtYSgpIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTp0eXBlZGVmXG4gICAgICAgIHJldHVybiB0aGlzLm1ha2VTY2hlbWEoe1xuICAgICAgICAgICAgLy8gSEFDSzogYHN1cGVyYCBzaG91bGQgd29yay4gYnV0IHNjaGVtYSBpcyB1bmRlZmluZWQgb24gaXQgYXQgcnVuIHRpbWUuXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAuLi4oc3VwZXIuc2NoZW1hIHx8ICh0aGlzIGFzIGFueSkuc2NoZW1hKSxcblxuICAgICAgICAgICAgLy8gU2Fsb29uIGdhbWUgc3BlY2lmaWMgc2V0dGluZ3NcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIHR1cm5zRHJ1bms6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbnVtYmVyIG9mIHR1cm5zIGEgY293Ym95IGlzIGJ1c3kgYmVpbmcgZHJ1bmssIGFmdGVyIGl0IGZpcnN0IGdldHMgZHJ1bmsuXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmFydGVuZGVyQ29vbGRvd246IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbWFueSB0dXJucyBhIEJhcnRlbmRlciBpcyBidXN5IGFmdGVyIHRocm93aW5nIGEgYm90dGxlLlwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvd2RpbmVzc1RvU2llc3RhOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSG93IG11Y2ggcm93ZGluZXNzIGEgcGxheWVyIG11c3QgZ2V0IHRvIGZvcmNlIGEgc2llc3RhLlwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDgsXG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpZXN0YUxlbmd0aDoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkhvdyBtYW55IHR1cm5zIGEgc2llc3RhIGxhc3RzXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogOCxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4Q293Ym95c1BlckpvYjoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIk1heGltdW0gbnVtYmVyIG9mIGNvd2JveXMgdGhhdCBjYW4gYmUgY2FsbGVkIGluIHBlciBqb2IuXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMixcbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hhcnBzaG9vdGVyRGFtYWdlOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiSG93IG11Y2ggZGFtYWdlIGEgU2hhcnBzaG9vdGVyIGRvZXMgdG8gZXZlcnl0aGluZyBpdCBoaXRzLlwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJyYXdsZXJEYW1hZ2U6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJIb3cgbXVjaCBkYW1hZ2UgYSBCcmF3bGVyIGRvZXMgdG8gaXRzIHN1cnJvdW5kaW5ncy5cIixcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgICAgICAvLyBCYXNlIHNldHRpbmdzXG4gICAgICAgICAgICBwbGF5ZXJTdGFydGluZ1RpbWU6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNmUxMCwgLy8gMSBtaW4gaW4gbnNcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhcnRpbmcgdGltZSAoaW4gbnMpIGZvciBlYWNoIHBsYXllci5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFR1cm4gYmFzZWQgc2V0dGluZ3NcbiAgICAgICAgICAgIHRpbWVBZGRlZFBlclR1cm46IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxZTksIC8vIDEgc2VjIGluIG5zLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0aW1lLWFkZGVkLXBlci10dXJuIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIHRvIGFkZCBhZnRlciBlYWNoIHBsYXllciBwZXJmb3JtcyBhIHR1cm4uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4VHVybnM6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXgtdHVybnMgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDEsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG1heGltdW0gbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgZ2FtZSBpcyBmb3JjZSBlbmRlZCBhbmQgYSB3aW5uZXIgaXMgZGV0ZXJtaW5lZC5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIFRpbGVkIHNldHRpbmdzXG4gICAgICAgICAgICBtYXBXaWR0aDoge1xuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMzIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC13aWR0aCAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAyLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB3aWR0aCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWFwSGVpZ2h0OiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWFwLWhlaWdodCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTYsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1hcC1oZWlnaHQgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgaGVpZ2h0IChpbiBUaWxlcykgZm9yIHRoZSBnYW1lIG1hcCB0byBiZSBpbml0aWFsaXplZCB0by5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWVzIGZvciB0aGUgZ2FtZSdzIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyE6IFNldHRpbmdzRnJvbVNjaGVtYTxTYWxvb25HYW1lU2V0dGluZ3NNYW5hZ2VyW1wic2NoZW1hXCJdPjtcblxuICAgIC8qKlxuICAgICAqIFRyeSB0byBpbnZhbGlkYXRlIGFsbCB0aGUgZ2FtZSBzZXR0aW5ncyBoZXJlLCBzbyBpbnZhbGlkIHZhbHVlcyBkbyBub3RcbiAgICAgKiByZWFjaCB0aGUgZ2FtZS5cbiAgICAgKiBAcGFyYW0gc29tZVNldHRpbmdzIEEgc3Vic2V0IG9mIHNldHRpbmdzIHRoYXQgd2lsbCBiZSB0ZXN0ZWRcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBpZiB0aGUgc2V0dGluZ3MgZmFpbCB0byB2YWxpZGF0ZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZShzb21lU2V0dGluZ3M6IFVua25vd25PYmplY3QpOiBVbmtub3duT2JqZWN0IHwgRXJyb3Ige1xuICAgICAgICBjb25zdCBpbnZhbGlkYXRlZCA9IHN1cGVyLmludmFsaWRhdGUoc29tZVNldHRpbmdzKTtcbiAgICAgICAgaWYgKGludmFsaWRhdGVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkYXRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0geyAuLi50aGlzLnZhbHVlcywgLi4uc29tZVNldHRpbmdzLCAuLi5pbnZhbGlkYXRlZCB9O1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIC8vIFdyaXRlIGxvZ2ljIGhlcmUgdG8gY2hlY2sgdGhlIHZhbHVlcyBpbiBgc2V0dGluZ3NgLiBJZiB0aGVyZSBpcyBhXG4gICAgICAgIC8vIHByb2JsZW0gd2l0aCB0aGUgdmFsdWVzIGEgcGxheWVyIHNlbnQsIHJldHVybiBhbiBlcnJvciB3aXRoIGEgc3RyaW5nXG4gICAgICAgIC8vIGRlc2NyaWJpbmcgd2h5IHRoZWlyIHZhbHVlKHMpIGFyZSB3cm9uZ1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufVxuIl19