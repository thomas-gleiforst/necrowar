"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Stardash game.
 */
class StardashGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Stardash game specific settings
            dashCost: {
                description: "The cost of dashing.",
                // <<-- Creer-Merge: dashCost -->>
                default: 1,
            },
            dashDistance: {
                description: "The distance traveled each turn by dashing.",
                // <<-- Creer-Merge: dashDistance -->>
                default: 50,
            },
            genariumValue: {
                description: "The value of every unit of genarium.",
                // <<-- Creer-Merge: genariumValue -->>
                default: 2,
            },
            legendariumValue: {
                description: "The value of every unit of legendarium.",
                // <<-- Creer-Merge: legendariumValue -->>
                default: 10,
            },
            maxAsteroid: {
                description: "The highest amount of material, that can be in a "
                    + "asteroid.",
                // <<-- Creer-Merge: maxAsteroid -->>
                default: 250,
            },
            minAsteroid: {
                description: "The smallest amount of material, that can be in "
                    + "a asteroid.",
                // <<-- Creer-Merge: minAsteroid -->>
                default: 100,
            },
            miningSpeed: {
                description: "The rate at which miners grab minerals from "
                    + "asteroids.",
                // <<-- Creer-Merge: miningSpeed -->>
                default: 10,
            },
            mythiciteAmount: {
                description: "The amount of mythicite that spawns at the start "
                    + "of the game.",
                // <<-- Creer-Merge: mythiciteAmount -->>
                default: 2000,
            },
            orbitsProtected: {
                description: "The number of orbit updates you cannot mine the "
                    + "mithicite asteroid.",
                // <<-- Creer-Merge: orbitsProtected -->>
                default: 20,
            },
            oreRarityGenarium: {
                description: "The rarity modifier of the most common ore. This "
                    + "controls how much spawns.",
                // <<-- Creer-Merge: oreRarityGenarium -->>
                default: 5,
            },
            oreRarityLegendarium: {
                description: "The rarity modifier of the rarest ore. This "
                    + "controls how much spawns.",
                // <<-- Creer-Merge: oreRarityLegendarium -->>
                default: 1,
            },
            oreRarityRarium: {
                description: "The rarity modifier of the second rarest ore. "
                    + "This controls how much spawns.",
                // <<-- Creer-Merge: oreRarityRarium -->>
                default: 2,
            },
            planetEnergyCap: {
                description: "The amount of energy a planet can hold at once.",
                // <<-- Creer-Merge: planetEnergyCap -->>
                default: 5000,
            },
            planetRechargeRate: {
                description: "The amount of energy the planets restore each "
                    + "round.",
                // <<-- Creer-Merge: planetRechargeRate -->>
                default: 50,
            },
            projectileRadius: {
                description: "The standard size of ships.",
                // <<-- Creer-Merge: projectileRadius -->>
                default: 5,
            },
            projectileSpeed: {
                description: "The amount of distance missiles travel through "
                    + "space.",
                // <<-- Creer-Merge: projectileSpeed -->>
                default: 100,
            },
            rariumValue: {
                description: "The value of every unit of rarium.",
                // <<-- Creer-Merge: rariumValue -->>
                default: 5,
            },
            regenerateRate: {
                description: "The regeneration rate of asteroids.",
                // <<-- Creer-Merge: regenerateRate -->>
                default: 0,
            },
            shipRadius: {
                description: "The standard size of ships.",
                // <<-- Creer-Merge: shipRadius -->>
                default: 20,
            },
            sizeX: {
                description: "The size of the map in the X direction.",
                // <<-- Creer-Merge: sizeX -->>
                default: 3200,
            },
            sizeY: {
                description: "The size of the map in the Y direction.",
                // <<-- Creer-Merge: sizeY -->>
                default: 1800,
            },
            turnsToOrbit: {
                description: "The number of turns it takes for a asteroid to "
                    + "orbit the sun. (Asteroids move after each "
                    + "players turn).",
                // <<-- Creer-Merge: turnsToOrbit -->>
                default: 40,
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
                default: 220,
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
exports.StardashGameSettingsManager = StardashGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zdGFyZGFzaC9nYW1lLXNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEseUJBQWlDO0FBRWpDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSwyQkFBNEIsU0FBUSxjQUFXLENBQUMsWUFBWTtJQUNyRTs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsd0VBQXdFO1lBQ3hFLGtDQUFrQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSyxJQUFZLENBQUMsTUFBTSxDQUFDO1lBRXpDLGtDQUFrQztZQUNsQyxRQUFRLEVBQUU7Z0JBQ04sV0FBVyxFQUFFLHNCQUFzQjtnQkFDbkMsa0NBQWtDO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQzthQUViO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLFdBQVcsRUFBRSw2Q0FBNkM7Z0JBQzFELHNDQUFzQztnQkFDdEMsT0FBTyxFQUFFLEVBQUU7YUFFZDtZQUNELGFBQWEsRUFBRTtnQkFDWCxXQUFXLEVBQUUsc0NBQXNDO2dCQUNuRCx1Q0FBdUM7Z0JBQ3ZDLE9BQU8sRUFBRSxDQUFDO2FBRWI7WUFDRCxnQkFBZ0IsRUFBRTtnQkFDZCxXQUFXLEVBQUUseUNBQXlDO2dCQUN0RCwwQ0FBMEM7Z0JBQzFDLE9BQU8sRUFBRSxFQUFFO2FBRWQ7WUFDRCxXQUFXLEVBQUU7Z0JBQ1QsV0FBVyxFQUFFLG1EQUFtRDtzQkFDbkQsV0FBVztnQkFDeEIscUNBQXFDO2dCQUNyQyxPQUFPLEVBQUUsR0FBRzthQUVmO1lBQ0QsV0FBVyxFQUFFO2dCQUNULFdBQVcsRUFBRSxrREFBa0Q7c0JBQ2xELGFBQWE7Z0JBQzFCLHFDQUFxQztnQkFDckMsT0FBTyxFQUFFLEdBQUc7YUFFZjtZQUNELFdB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O2dCQUNOLFdBQVcsRUFBRSx3RkFBd0Y7YUFDeEc7U0FFSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBT0Q7Ozs7O09BS0c7SUFDTyxVQUFVLENBQUMsWUFBMkI7UUFDNUMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRCxJQUFJLFdBQVcsWUFBWSxLQUFLLEVBQUU7WUFDOUIsT0FBTyxXQUFXLENBQUM7U0FDdEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRXJFLG9DQUFvQztRQUVwQyxvRUFBb0U7UUFDcEUsdUVBQXVFO1FBQ3ZFLDBDQUEwQztRQUUxQyxxQ0FBcUM7UUFFckMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBbE9ELGtFQWtPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzRnJvbVNjaGVtYSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgc2V0dGluZ3MgbWFuYWdlciBmb3IgdGhlIFN0YXJkYXNoIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGFyZGFzaEdhbWVTZXR0aW5nc01hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lU2V0dGluZ3Mge1xuICAgIC8qKlxuICAgICAqIFRoaXMgZGVzY3JpYmVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdhbWUgc2V0dGluZ3MsIGFuZCBpcyB1c2VkIHRvXG4gICAgICogZ2VuZXJhdGUgdGhlIHZhbHVlcywgYXMgd2VsbCBhcyBiYXNpYyB0eXBlIGFuZCByYW5nZSBjaGVja2luZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNjaGVtYSgpIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTp0eXBlZGVmXG4gICAgICAgIHJldHVybiB0aGlzLm1ha2VTY2hlbWEoe1xuICAgICAgICAgICAgLy8gSEFDSzogYHN1cGVyYCBzaG91bGQgd29yay4gYnV0IHNjaGVtYSBpcyB1bmRlZmluZWQgb24gaXQgYXQgcnVuIHRpbWUuXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAuLi4oc3VwZXIuc2NoZW1hIHx8ICh0aGlzIGFzIGFueSkuc2NoZW1hKSxcblxuICAgICAgICAgICAgLy8gU3RhcmRhc2ggZ2FtZSBzcGVjaWZpYyBzZXR0aW5nc1xuICAgICAgICAgICAgZGFzaENvc3Q6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgY29zdCBvZiBkYXNoaW5nLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGRhc2hDb3N0IC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBkYXNoQ29zdCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGFzaERpc3RhbmNlOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGRpc3RhbmNlIHRyYXZlbGVkIGVhY2ggdHVybiBieSBkYXNoaW5nLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGRhc2hEaXN0YW5jZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNTAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGRhc2hEaXN0YW5jZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2VuYXJpdW1WYWx1ZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB2YWx1ZSBvZiBldmVyeSB1bml0IG9mIGdlbmFyaXVtLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGdlbmFyaXVtVmFsdWUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGdlbmFyaXVtVmFsdWUgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlZ2VuZGFyaXVtVmFsdWU6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgdmFsdWUgb2YgZXZlcnkgdW5pdCBvZiBsZWdlbmRhcml1bS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBsZWdlbmRhcml1bVZhbHVlIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbGVnZW5kYXJpdW1WYWx1ZSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWF4QXN0ZXJvaWQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgaGlnaGVzdCBhbW91bnQgb2YgbWF0ZXJpYWwsIHRoYXQgY2FuIGJlIGluIGEgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJhc3Rlcm9pZC5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtYXhBc3Rlcm9pZCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjUwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBtYXhBc3Rlcm9pZCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWluQXN0ZXJvaWQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc21hbGxlc3QgYW1vdW50IG9mIG1hdGVyaWFsLCB0aGF0IGNhbiBiZSBpbiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImEgYXN0ZXJvaWQuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWluQXN0ZXJvaWQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDEwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogbWluQXN0ZXJvaWQgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1pbmluZ1NwZWVkOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHJhdGUgYXQgd2hpY2ggbWluZXJzIGdyYWIgbWluZXJhbHMgZnJvbSBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImFzdGVyb2lkcy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBtaW5pbmdTcGVlZCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1pbmluZ1NwZWVkIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBteXRoaWNpdGVBbW91bnQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIG15dGhpY2l0ZSB0aGF0IHNwYXducyBhdCB0aGUgc3RhcnQgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJvZiB0aGUgZ2FtZS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBteXRoaWNpdGVBbW91bnQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwMDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG15dGhpY2l0ZUFtb3VudCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3JiaXRzUHJvdGVjdGVkOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG51bWJlciBvZiBvcmJpdCB1cGRhdGVzIHlvdSBjYW5ub3QgbWluZSB0aGUgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJtaXRoaWNpdGUgYXN0ZXJvaWQuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogb3JiaXRzUHJvdGVjdGVkIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogb3JiaXRzUHJvdGVjdGVkIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvcmVSYXJpdHlHZW5hcml1bToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByYXJpdHkgbW9kaWZpZXIgb2YgdGhlIG1vc3QgY29tbW9uIG9yZS4gVGhpcyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImNvbnRyb2xzIGhvdyBtdWNoIHNwYXducy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBvcmVSYXJpdHlHZW5hcml1bSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogb3JlUmFyaXR5R2VuYXJpdW0gLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yZVJhcml0eUxlZ2VuZGFyaXVtOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHJhcml0eSBtb2RpZmllciBvZiB0aGUgcmFyZXN0IG9yZS4gVGhpcyBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImNvbnRyb2xzIGhvdyBtdWNoIHNwYXducy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBvcmVSYXJpdHlMZWdlbmRhcml1bSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMSxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogb3JlUmFyaXR5TGVnZW5kYXJpdW0gLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9yZVJhcml0eVJhcml1bToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByYXJpdHkgbW9kaWZpZXIgb2YgdGhlIHNlY29uZCByYXJlc3Qgb3JlLiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIlRoaXMgY29udHJvbHMgaG93IG11Y2ggc3Bhd25zLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IG9yZVJhcml0eVJhcml1bSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogb3JlUmFyaXR5UmFyaXVtIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwbGFuZXRFbmVyZ3lDYXA6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIGVuZXJneSBhIHBsYW5ldCBjYW4gaG9sZCBhdCBvbmNlLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHBsYW5ldEVuZXJneUNhcCAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogNTAwMCxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxhbmV0RW5lcmd5Q2FwIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwbGFuZXRSZWNoYXJnZVJhdGU6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIGVuZXJneSB0aGUgcGxhbmV0cyByZXN0b3JlIGVhY2ggXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJyb3VuZC5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwbGFuZXRSZWNoYXJnZVJhdGUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwbGFuZXRSZWNoYXJnZVJhdGUgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb2plY3RpbGVSYWRpdXM6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhbmRhcmQgc2l6ZSBvZiBzaGlwcy5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm9qZWN0aWxlUmFkaXVzIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiA1LFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm9qZWN0aWxlUmFkaXVzIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwcm9qZWN0aWxlU3BlZWQ6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIGRpc3RhbmNlIG1pc3NpbGVzIHRyYXZlbCB0aHJvdWdoIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwic3BhY2UuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvamVjdGlsZVNwZWVkIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxMDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHByb2plY3RpbGVTcGVlZCAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFyaXVtVmFsdWU6IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgdmFsdWUgb2YgZXZlcnkgdW5pdCBvZiByYXJpdW0uXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcmFyaXVtVmFsdWUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDUsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJhcml1bVZhbHVlIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWdlbmVyYXRlUmF0ZToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByZWdlbmVyYXRpb24gcmF0ZSBvZiBhc3Rlcm9pZHMuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcmVnZW5lcmF0ZVJhdGUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHJlZ2VuZXJhdGVSYXRlIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaGlwUmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHN0YW5kYXJkIHNpemUgb2Ygc2hpcHMuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2hpcFJhZGl1cyAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMjAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNoaXBSYWRpdXMgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNpemVYOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHNpemUgb2YgdGhlIG1hcCBpbiB0aGUgWCBkaXJlY3Rpb24uXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogc2l6ZVggLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDMyMDAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHNpemVYIC0tPj5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzaXplWToge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBzaXplIG9mIHRoZSBtYXAgaW4gdGhlIFkgZGlyZWN0aW9uLlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNpemVZIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAxODAwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzaXplWSAtLT4+XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHVybnNUb09yYml0OiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG51bWJlciBvZiB0dXJucyBpdCB0YWtlcyBmb3IgYSBhc3Rlcm9pZCB0byBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcIm9yYml0IHRoZSBzdW4uIChBc3Rlcm9pZHMgbW92ZSBhZnRlciBlYWNoIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICArIFwicGxheWVycyB0dXJuKS5cIixcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiB0dXJuc1RvT3JiaXQgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDQwLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiB0dXJuc1RvT3JiaXQgLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgLy8geW91IGNhbiBhZGQgbW9yZSBzZXR0aW5ncyBoZXJlLCBlLmcuOlxuICAgICAgICAvKlxuICAgICAgICBzb21lVmFyaWFibGVMaWtlVW5pdEhlYWx0aDoge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRGVzY3JpYmUgd2hhdCB0aGlzIHNldHRpbmcgZG9lcyBmb3IgdGhlIHBsYXllcnMuXCIsXG4gICAgICAgICAgICBkZWZhdWx0OiAxMzM3LFxuICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICB9LFxuICAgICAgICAqL1xuXG4gICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogc2NoZW1hIC0tPj5cblxuICAgICAgICAgICAgLy8gQmFzZSBzZXR0aW5nc1xuICAgICAgICAgICAgcGxheWVyU3RhcnRpbmdUaW1lOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDZlMTAsIC8vIDEgbWluIGluIG5zXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHBsYXllci1zdGFydGluZy10aW1lIC0tPj5cbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIHN0YXJ0aW5nIHRpbWUgKGluIG5zKSBmb3IgZWFjaCBwbGF5ZXIuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBUdXJuIGJhc2VkIHNldHRpbmdzXG4gICAgICAgICAgICB0aW1lQWRkZWRQZXJUdXJuOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogdGltZS1hZGRlZC1wZXItdHVybiAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMWU5LCAvLyAxIHNlYyBpbiBucyxcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogdGltZS1hZGRlZC1wZXItdHVybiAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBhbW91bnQgb2YgdGltZSAoaW4gbmFuby1zZWNvbmRzKSB0byBhZGQgYWZ0ZXIgZWFjaCBwbGF5ZXIgcGVyZm9ybXMgYSB0dXJuLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1heFR1cm5zOiB7XG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogbWF4LXR1cm5zIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiAyMjAsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IG1heC10dXJucyAtLT4+XG4gICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBtYXhpbXVtIG51bWJlciBvZiB0dXJucyBiZWZvcmUgdGhlIGdhbWUgaXMgZm9yY2UgZW5kZWQgYW5kIGEgd2lubmVyIGlzIGRldGVybWluZWQuXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHZhbHVlcyBmb3IgdGhlIGdhbWUncyBzZXR0aW5nc1xuICAgICAqL1xuICAgIHB1YmxpYyB2YWx1ZXMhOiBTZXR0aW5nc0Zyb21TY2hlbWE8U3RhcmRhc2hHYW1lU2V0dGluZ3NNYW5hZ2VyW1wic2NoZW1hXCJdPjtcblxuICAgIC8qKlxuICAgICAqIFRyeSB0byBpbnZhbGlkYXRlIGFsbCB0aGUgZ2FtZSBzZXR0aW5ncyBoZXJlLCBzbyBpbnZhbGlkIHZhbHVlcyBkbyBub3RcbiAgICAgKiByZWFjaCB0aGUgZ2FtZS5cbiAgICAgKiBAcGFyYW0gc29tZVNldHRpbmdzIEEgc3Vic2V0IG9mIHNldHRpbmdzIHRoYXQgd2lsbCBiZSB0ZXN0ZWRcbiAgICAgKiBAcmV0dXJucyBBbiBlcnJvciBpZiB0aGUgc2V0dGluZ3MgZmFpbCB0byB2YWxpZGF0ZS5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZShzb21lU2V0dGluZ3M6IFVua25vd25PYmplY3QpOiBVbmtub3duT2JqZWN0IHwgRXJyb3Ige1xuICAgICAgICBjb25zdCBpbnZhbGlkYXRlZCA9IHN1cGVyLmludmFsaWRhdGUoc29tZVNldHRpbmdzKTtcbiAgICAgICAgaWYgKGludmFsaWRhdGVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkYXRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0geyAuLi50aGlzLnZhbHVlcywgLi4uc29tZVNldHRpbmdzLCAuLi5pbnZhbGlkYXRlZCB9O1xuXG4gICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIC8vIFdyaXRlIGxvZ2ljIGhlcmUgdG8gY2hlY2sgdGhlIHZhbHVlcyBpbiBgc2V0dGluZ3NgLiBJZiB0aGVyZSBpcyBhXG4gICAgICAgIC8vIHByb2JsZW0gd2l0aCB0aGUgdmFsdWVzIGEgcGxheWVyIHNlbnQsIHJldHVybiBhbiBlcnJvciB3aXRoIGEgc3RyaW5nXG4gICAgICAgIC8vIGRlc2NyaWJpbmcgd2h5IHRoZWlyIHZhbHVlKHMpIGFyZSB3cm9uZ1xuXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbnZhbGlkYXRlIC0tPj5cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufVxuIl19