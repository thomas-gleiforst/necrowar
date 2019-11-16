"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
const jobs_stats_1 = require("./jobs-stats");
// <<-- /Creer-Merge: imports -->>
/**
 * Convert as many humans to as you can to survive in this post-apocalyptic
 * wasteland.
 */
class CatastropheGame extends _1.BaseClasses.Game {
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Game is created.
     *
     * @param settingsManager - The manager that holds initial settings.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(settingsManager, required) {
        super(settingsManager, required);
        this.settingsManager = settingsManager;
        /** The settings used to initialize the game, as set by players */
        this.settings = Object.freeze(this.settingsManager.values);
        // <<-- Creer-Merge: attributes -->>
        /** New structures created but not yet inserted into the structures array */
        this.newStructures = [];
        // <<-- Creer-Merge: constructor -->>
        for (const title of Object.keys(jobs_stats_1.jobStats).sort()) {
            const stats = jobs_stats_1.jobStats[title];
            this.jobs.push(this.manager.create.job({
                title: title,
                ...stats,
            }));
        }
        // Generate the map and units
        this.generateMap();
        // Properly add all new structures
        for (const structure of this.newStructures) {
            this.structures.push(structure);
            if (structure.owner) {
                structure.owner.structures.push(structure);
            }
        }
        this.newStructures.length = 0;
        // Calculate player upkeeps
        for (const player of this.players) {
            player.upkeep = 0;
            for (const unit of player.units) {
                player.upkeep += unit.job.upkeep;
            }
            player.food = 50; // starting food
        }
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Gets the cost of a given structure type.
     *
     * @param structureType - The type of the structure
     * @returns A number of its cost.
     */
    getStructureCost(structureType) {
        switch (structureType) {
            case "neutral":
                return this.neutralMaterials;
            case "road":
                return 0;
            case "wall":
                return this.wallMaterials;
            case "shelter":
                return this.shelterMaterials;
            case "monument":
                return this.monumentMaterials;
        }
    }
    /**
     * Gets the range of a Structure by its type.
     *
     * @param structureType The type of the structure to get for
     * @returns A number representing its range.
     */
    getStructureRange(structureType) {
        switch (structureType) {
            case "neutral":
            case "road":
            case "wall":
                return 0;
            case "shelter":
                return 1;
            case "monument":
                return 3;
        }
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Gets the tile at (x, y), or undefined if the co-ordinates are off-map.
     *
     * @param x - The x position of the desired tile.
     * @param y - The y position of the desired tile.
     * @returns The Tile at (x, y) if valid, undefined otherwise.
     */
    getTile(x, y) {
        // tslint:disable-next-line:no-unsafe-any
        return super.getTile(x, y);
    }
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Generates the map and places the resources, players, and starting units
     */
    generateMap() {
        const structureChance = 0.025;
        const minFoodChance = 0.01;
        const maxFoodChance = 0.1;
        const minHarvestRate = 30;
        const maxHarvestRate = 150;
        const halfWidth = Math.floor(this.mapWidth / 2);
        const halfHeight = Math.floor(this.mapHeight / 2);
        // Place structures and food spawners
        for (let x = 0; x < halfWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const tile = this.getTile(x, y);
                if (!tile) {
                    throw new Error(`No tile at (${x}, ${y})`);
                }
                // Generate structures and spawners
                if (y === halfHeight - 1 || y === halfHeight) {
                    // Generate road
                    tile.structure = this.manager.create.structure({
                        tile,
                        type: "road",
                    });
                }
                else {
                    const cx = this.mapWidth / 2;
                    const cy = this.mapHeight / 2;
                    const exp = 2;
                    // Calculate max distances from center of map, raised to exp
                    const maxD = cx ** exp + cy ** exp;
                    // This is a fancy function based on some easing functions
                    const factor = Math.abs(Math.pow(Math.abs(x - cx) - cx, exp)
                        +
                            Math.pow(Math.abs(y - cy) - cy, exp)) / maxD;
                    // Food chance increases toward center of map
                    const foodChanceRange = maxFoodChance - minFoodChance;
                    const foodChance = factor * foodChanceRange + minFoodChance;
                    // Try to place food or structure
                    if (this.manager.random.float() < foodChance) {
                        // Calculate the multiplier for the harvest rate, increasing food toward center
                        const maxDistFromCenter = Math.sqrt(cx * cx + cy * cy);
                        const dx = cx - x;
                        const dy = cy - y;
                        const distFromCenter = Math.sqrt(dx * dx + dy * dy);
                        const harvestRateMult = 1 - distFromCenter / maxDistFromCenter;
                        const harvestRateRange = maxHarvestRate - minHarvestRate;
                        // Generate food spawner
                        tile.harvestRate = minHarvestRate + Math.ceil(harvestRateRange * harvestRateMult);
                    }
                    else if (this.manager.random.float() < structureChance) {
                        // Generate neutral structures
                        tile.structure = this.manager.create.structure({
                            tile,
                            type: "neutral",
                        });
                    }
                }
            }
        }
        // Place cat and starting shelter
        let possibleTiles = this.tiles.filter((t) => {
            // Check if tile is empty
            if (t.structure || t.unit || t.harvestRate > 0) {
                return false;
            }
            // Make sure tile is close enough to a corner of the map
            return t.x < halfWidth / 2 && (t.y < halfWidth / 2 || this.mapHeight - t.y < halfWidth / 2);
        });
        if (!utils_1.arrayHasElements(possibleTiles)) {
            throw new Error("No possible tiles to generate map from.");
        }
        const selected = this.manager.random.element(possibleTiles);
        // Shelter
        selected.structure = this.manager.create.structure({
            owner: this.players[0],
            tile: selected,
            type: "shelter",
        });
        // Cat
        this.players[0].cat = selected.unit = this.manager.create.unit({
            owner: this.players[0],
            tile: selected,
            job: this.jobs.find((j) => j.title === "cat overlord"),
        });
        // Place starting units
        const cat = this.players[0].cat;
        const increment = 2;
        let maxDist = 1 - increment;
        possibleTiles.length = 0;
        for (let i = 0; i < 3; i++) {
            // Make sure there's valid tiles in range
            while (possibleTiles.length === 0) {
                // Expand the range a bit
                maxDist += increment;
                possibleTiles = this.tiles.filter((t) => {
                    // Check if tile is empty
                    if (t.structure || t.unit || t.harvestRate > 0) {
                        return false;
                    }
                    // Make sure it's on the correct side of the map
                    if (t.x >= halfWidth) {
                        return false;
                    }
                    if (!cat.tile) {
                        throw new Error("Cat is not on a tile!");
                    }
                    // Check if the tile is close enough to the cat
                    return Math.abs(cat.tile.x - t.x) <= maxDist && Math.abs(cat.tile.y - t.y) <= maxDist;
                });
            }
            if (!utils_1.arrayHasElements(possibleTiles)) {
                throw new Error("No possible tiles to generate map from again.");
            }
            // Choose a tile
            const tile = this.manager.random.element(possibleTiles);
            tile.unit = this.manager.create.unit({
                owner: this.players[0],
                tile,
                job: this.jobs.find((j) => j.title === "fresh human"),
            });
            utils_1.removeElements(possibleTiles, tile);
        }
        // Mirror map
        for (let x = 0; x < halfWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const orig = this.getTile(x, y);
                const target = this.getTile(this.mapWidth - x - 1, this.mapHeight - y - 1);
                if (!orig || !target) {
                    throw new Error("No origin or target tile to mirror the map with");
                }
                // Copy data
                target.harvestRate = orig.harvestRate;
                // Clone structure
                if (orig.structure) {
                    target.structure = this.manager.create.structure({
                        tile: target,
                        type: orig.structure.type,
                        owner: orig.structure.owner && orig.structure.owner.opponent,
                    });
                }
                // Clone unit
                if (orig.unit) {
                    target.unit = this.manager.create.unit({
                        tile: target,
                        owner: orig.unit.owner && orig.unit.owner.opponent,
                        job: orig.unit.job,
                    });
                    if (target.unit.job.title === "cat overlord") {
                        target.unit.owner.cat = target.unit;
                    }
                }
            }
        }
    }
}
exports.CatastropheGame = CatastropheGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jYXRhc3Ryb3BoZS9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUJBQWlDO0FBVWpDLGlDQUFpQztBQUNqQyxtQ0FBb0U7QUFDcEUsNkNBQXdDO0FBS3hDLGtDQUFrQztBQUVsQzs7O0dBR0c7QUFDSCxNQUFhLGVBQWdCLFNBQVEsY0FBVyxDQUFDLElBQUk7SUF5SmpELHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ2MsZUFBK0MsRUFDekQsUUFBeUM7UUFFekMsS0FBSyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUh2QixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0M7UUE5SjdELGtFQUFrRTtRQUNsRCxhQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBK0l0RSxvQ0FBb0M7UUFFcEMsNEVBQTRFO1FBQzVELGtCQUFhLEdBQWdCLEVBQUUsQ0FBQztRQWdCNUMscUNBQXFDO1FBRXJDLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBUSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDOUMsTUFBTSxLQUFLLEdBQUcscUJBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FDVixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ3BCLEtBQUssRUFBRSxLQUFxQjtnQkFDNUIsR0FBRyxLQUFLO2FBQ1gsQ0FBQyxDQUNMLENBQUM7U0FDTDtRQUVELDZCQUE2QjtRQUM3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbkIsa0NBQWtDO1FBQ2xDLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN4QyxJQUFJLENBQUMs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Q0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFFdEMsa0JBQWtCO2dCQUNsQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ2hCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO3dCQUM3QyxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJO3dCQUN6QixLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUTtxQkFDL0QsQ0FBQyxDQUFDO2lCQUNOO2dCQUVELGFBQWE7Z0JBQ2IsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNYLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO3dCQUNuQyxJQUFJLEVBQUUsTUFBTTt3QkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTt3QkFDbEQsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRztxQkFDckIsQ0FBQyxDQUFDO29CQUVILElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxLQUFLLGNBQWMsRUFBRTt3QkFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUF1QixDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO3FCQUMxRDtpQkFDSjthQUNKO1NBQ0o7SUFDTCxDQUFDO0NBR0o7QUFqY0QsMENBaWNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lUmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgQ2F0YXN0cm9waGVHYW1lTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtbWFuYWdlclwiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBDYXRhc3Ryb3BoZUdhbWVTZXR0aW5nc01hbmFnZXIgfSBmcm9tIFwiLi9nYW1lLXNldHRpbmdzXCI7XG5pbXBvcnQgeyBKb2IgfSBmcm9tIFwiLi9qb2JcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgU3RydWN0dXJlIH0gZnJvbSBcIi4vc3RydWN0dXJlXCI7XG5pbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4vdGlsZVwiO1xuaW1wb3J0IHsgVW5pdCB9IGZyb20gXCIuL3VuaXRcIjtcblxuLy8gPDwtLSBDcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5pbXBvcnQgeyBhcnJheUhhc0VsZW1lbnRzLCBNdXRhYmxlLCByZW1vdmVFbGVtZW50cyB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBqb2JTdGF0cyB9IGZyb20gXCIuL2pvYnMtc3RhdHNcIjtcbmltcG9ydCB7IFN0cnVjdHVyZVR5cGUgfSBmcm9tIFwiLi9zdHJ1Y3R1cmVcIjtcblxuLyoqIEEgcGxheWVyIHRoYXQgd2UgY2FuIG11dGF0ZSBiZWZvcmUgdGhlIGdhbWUgYmVnaW5zICovXG50eXBlIE11dGFibGVQbGF5ZXIgPSBNdXRhYmxlPFBsYXllcj47XG4vLyA8PC0tIC9DcmVlci1NZXJnZTogaW1wb3J0cyAtLT4+XG5cbi8qKlxuICogQ29udmVydCBhcyBtYW55IGh1bWFucyB0byBhcyB5b3UgY2FuIHRvIHN1cnZpdmUgaW4gdGhpcyBwb3N0LWFwb2NhbHlwdGljXG4gKiB3YXN0ZWxhbmQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDYXRhc3Ryb3BoZUdhbWUgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lIHtcbiAgICAvKiogVGhlIG1hbmFnZXIgb2YgdGhpcyBnYW1lLCB0aGF0IGNvbnRyb2xzIGV2ZXJ5dGhpbmcgYXJvdW5kIGl0ICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hbmFnZXIhOiBDYXRhc3Ryb3BoZUdhbWVNYW5hZ2VyO1xuXG4gICAgLyoqIFRoZSBzZXR0aW5ncyB1c2VkIHRvIGluaXRpYWxpemUgdGhlIGdhbWUsIGFzIHNldCBieSBwbGF5ZXJzICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNldHRpbmdzID0gT2JqZWN0LmZyZWV6ZSh0aGlzLnNldHRpbmdzTWFuYWdlci52YWx1ZXMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG11bHRpcGxpZXIgZm9yIHRoZSBhbW91bnQgb2YgZW5lcmd5IHJlZ2VuZXJhdGVkIHdoZW4gcmVzdGluZyBpbiBhXG4gICAgICogc2hlbHRlciB3aXRoIHRoZSBjYXQgb3ZlcmxvcmQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNhdEVuZXJneU11bHQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIHdob3NlIHR1cm4gaXQgaXMgY3VycmVudGx5LiBUaGF0IHBsYXllciBjYW4gc2VuZCBjb21tYW5kcy5cbiAgICAgKiBPdGhlciBwbGF5ZXJzIGNhbm5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFBsYXllciE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHR1cm4gbnVtYmVyLCBzdGFydGluZyBhdCAwIGZvciB0aGUgZmlyc3QgcGxheWVyJ3MgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFR1cm4hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcHBpbmcgb2YgZXZlcnkgZ2FtZSBvYmplY3QncyBJRCB0byB0aGUgYWN0dWFsIGdhbWUgb2JqZWN0LiBQcmltYXJpbHlcbiAgICAgKiB1c2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNsaWVudCB0byBlYXNpbHkgcmVmZXIgdG8gdGhlIGdhbWUgb2JqZWN0cyB2aWFcbiAgICAgKiBJRC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZU9iamVjdHMhOiB7W2lkOiBzdHJpbmddOiBHYW1lT2JqZWN0fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdHVybnMgaXQgdGFrZXMgZm9yIGEgVGlsZSB0aGF0IHdhcyBqdXN0IGhhcnZlc3RlZCB0byBncm93XG4gICAgICogZm9vZCBhZ2Fpbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgaGFydmVzdENvb2xkb3duITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSBKb2JzIHRoYXQgVW5pdHMgY2FuIGhhdmUgaW4gdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIGpvYnMhOiBKb2JbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgdGhhdCB0aGUgaGFydmVzdCByYXRlIGlzIGxvd2VyZWQgZWFjaCBzZWFzb24uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGxvd2VySGFydmVzdEFtb3VudCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgVGlsZXMgaW4gdGhlIG1hcCBhbG9uZyB0aGUgeSAodmVydGljYWwpIGF4aXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hcEhlaWdodCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgVGlsZXMgaW4gdGhlIG1hcCBhbG9uZyB0aGUgeCAoaG9yaXpvbnRhbCkgYXhpcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWFwV2lkdGghOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYmVmb3JlIHRoZSBnYW1lIHdpbGwgYXV0b21hdGljYWxseSBlbmQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1heFR1cm5zITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG11bHRpcGxpZXIgZm9yIHRoZSBjb3N0IG9mIGFjdGlvbnMgd2hlbiBwZXJmb3JtaW5nIHRoZW0gaW4gcmFuZ2Ugb2ZcbiAgICAgKiBhIG1vbnVtZW50LiBEb2VzIG5vdCBlZmZlY3QgcGlja3VwIGNvc3QuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1vbnVtZW50Q29zdE11bHQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyBpbiBhIG1vbnVtZW50LlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtb251bWVudE1hdGVyaWFscyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgbWF0ZXJpYWxzIGluIGEgbmV1dHJhbCBTdHJ1Y3R1cmUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG5ldXRyYWxNYXRlcmlhbHMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGFsbCB0aGUgcGxheWVycyBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcGxheWVycyE6IFBsYXllcltdO1xuXG4gICAgLyoqXG4gICAgICogQSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGdhbWUgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBwbGF5ZWQuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNlc3Npb24hOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyBpbiBhIHNoZWx0ZXIuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNoZWx0ZXJNYXRlcmlhbHMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGZvb2QgUGxheWVycyBzdGFydCB3aXRoLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzdGFydGluZ0Zvb2QhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbXVsdGlwbGllciBmb3IgdGhlIGFtb3VudCBvZiBlbmVyZ3kgcmVnZW5lcmF0ZWQgd2hlbiByZXN0aW5nIHdoaWxlXG4gICAgICogc3RhcnZpbmcuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHN0YXJ2aW5nRW5lcmd5TXVsdCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEV2ZXJ5IFN0cnVjdHVyZSBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RydWN0dXJlcyE6IFN0cnVjdHVyZVtdO1xuXG4gICAgLyoqXG4gICAgICogQWxsIHRoZSB0aWxlcyBpbiB0aGUgbWFwLCBzdG9yZWQgaW4gUm93LW1ham9yIG9yZGVyLiBVc2UgYHggKyB5ICpcbiAgICAgKiBtYXBXaWR0aGAgdG8gYWNjZXNzIHRoZSBjb3JyZWN0IGluZGV4LlxuICAgICAqL1xuICAgIHB1YmxpYyB0aWxlcyE6IFRpbGVbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdGltZSAoaW4gbmFuby1zZWNvbmRzKSBhZGRlZCBhZnRlciBlYWNoIHBsYXllciBwZXJmb3JtcyBhXG4gICAgICogdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGltZUFkZGVkUGVyVHVybiE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEFmdGVyIGEgZm9vZCB0aWxlIGlzIGhhcnZlc3RlZCwgdGhlIG51bWJlciBvZiB0dXJucyBiZWZvcmUgaXQgY2FuIGJlXG4gICAgICogaGFydmVzdGVkIGFnYWluLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0dXJuc0JldHdlZW5IYXJ2ZXN0cyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgdHVybnMgYmV0d2VlbiBmcmVzaCBodW1hbnMgYmVpbmcgc3Bhd25lZCBvbiB0aGUgcm9hZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdHVybnNUb0NyZWF0ZUh1bWFuITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiB0dXJucyBiZWZvcmUgdGhlIGhhcnZlc3QgcmF0ZSBpcyBsb3dlcmVkIChsZW5ndGggb2YgZWFjaFxuICAgICAqIHNlYXNvbiBiYXNpY2FsbHkpLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0dXJuc1RvTG93ZXJIYXJ2ZXN0ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgVW5pdCBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5pdHMhOiBVbml0W107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIG1hdGVyaWFscyBpbiBhIHdhbGwuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHdhbGxNYXRlcmlhbHMhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKiBOZXcgc3RydWN0dXJlcyBjcmVhdGVkIGJ1dCBub3QgeWV0IGluc2VydGVkIGludG8gdGhlIHN0cnVjdHVyZXMgYXJyYXkgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbmV3U3RydWN0dXJlczogU3RydWN0dXJlW10gPSBbXTtcblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgR2FtZSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNldHRpbmdzTWFuYWdlciAtIFRoZSBtYW5hZ2VyIHRoYXQgaG9sZHMgaW5pdGlhbCBzZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHNldHRpbmdzTWFuYWdlcjogQ2F0YXN0cm9waGVHYW1lU2V0dGluZ3NNYW5hZ2VyLFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lUmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3NNYW5hZ2VyLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuXG4gICAgICAgIGZvciAoY29uc3QgdGl0bGUgb2YgT2JqZWN0LmtleXMoam9iU3RhdHMpLnNvcnQoKSkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdHMgPSBqb2JTdGF0c1t0aXRsZV07XG4gICAgICAgICAgICB0aGlzLmpvYnMucHVzaChcbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmpvYih7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSBhcyBKb2JbXCJ0aXRsZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgLi4uc3RhdHMsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgdGhlIG1hcCBhbmQgdW5pdHNcbiAgICAgICAgdGhpcy5nZW5lcmF0ZU1hcCgpO1xuXG4gICAgICAgIC8vIFByb3Blcmx5IGFkZCBhbGwgbmV3IHN0cnVjdHVyZXNcbiAgICAgICAgZm9yIChjb25zdCBzdHJ1Y3R1cmUgb2YgdGhpcy5uZXdTdHJ1Y3R1cmVzKSB7XG4gICAgICAgICAgICB0aGlzLnN0cnVjdHVyZXMucHVzaChzdHJ1Y3R1cmUpO1xuICAgICAgICAgICAgaWYgKHN0cnVjdHVyZS5vd25lcikge1xuICAgICAgICAgICAgICAgIHN0cnVjdHVyZS5vd25lci5zdHJ1Y3R1cmVzLnB1c2goc3RydWN0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5ld1N0cnVjdHVyZXMubGVuZ3RoID0gMDtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgcGxheWVyIHVwa2VlcHNcbiAgICAgICAgZm9yIChjb25zdCBwbGF5ZXIgb2YgdGhpcy5wbGF5ZXJzKSB7XG4gICAgICAgICAgICBwbGF5ZXIudXBrZWVwID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiBwbGF5ZXIudW5pdHMpIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBrZWVwICs9IHVuaXQuam9iLnVwa2VlcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxheWVyLmZvb2QgPSA1MDsgLy8gc3RhcnRpbmcgZm9vZFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvc3Qgb2YgYSBnaXZlbiBzdHJ1Y3R1cmUgdHlwZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdHJ1Y3R1cmVUeXBlIC0gVGhlIHR5cGUgb2YgdGhlIHN0cnVjdHVyZVxuICAgICAqIEByZXR1cm5zIEEgbnVtYmVyIG9mIGl0cyBjb3N0LlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTdHJ1Y3R1cmVDb3N0KHN0cnVjdHVyZVR5cGU6IFN0cnVjdHVyZVR5cGUpOiBudW1iZXIge1xuICAgICAgICBzd2l0Y2ggKHN0cnVjdHVyZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJuZXV0cmFsXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV1dHJhbE1hdGVyaWFscztcbiAgICAgICAgICAgIGNhc2UgXCJyb2FkXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICBjYXNlIFwid2FsbFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndhbGxNYXRlcmlhbHM7XG4gICAgICAgICAgICBjYXNlIFwic2hlbHRlclwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNoZWx0ZXJNYXRlcmlhbHM7XG4gICAgICAgICAgICBjYXNlIFwibW9udW1lbnRcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tb251bWVudE1hdGVyaWFscztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHJhbmdlIG9mIGEgU3RydWN0dXJlIGJ5IGl0cyB0eXBlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0cnVjdHVyZVR5cGUgVGhlIHR5cGUgb2YgdGhlIHN0cnVjdHVyZSB0byBnZXQgZm9yXG4gICAgICogQHJldHVybnMgQSBudW1iZXIgcmVwcmVzZW50aW5nIGl0cyByYW5nZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U3RydWN0dXJlUmFuZ2Uoc3RydWN0dXJlVHlwZTogU3RydWN0dXJlVHlwZSk6IG51bWJlciB7XG4gICAgICAgIHN3aXRjaCAoc3RydWN0dXJlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSBcIm5ldXRyYWxcIjpcbiAgICAgICAgICAgIGNhc2UgXCJyb2FkXCI6XG4gICAgICAgICAgICBjYXNlIFwid2FsbFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgY2FzZSBcInNoZWx0ZXJcIjpcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIGNhc2UgXCJtb251bWVudFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiAzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdGlsZSBhdCAoeCwgeSksIG9yIHVuZGVmaW5lZCBpZiB0aGUgY28tb3JkaW5hdGVzIGFyZSBvZmYtbWFwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHggLSBUaGUgeCBwb3NpdGlvbiBvZiB0aGUgZGVzaXJlZCB0aWxlLlxuICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgcG9zaXRpb24gb2YgdGhlIGRlc2lyZWQgdGlsZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgVGlsZSBhdCAoeCwgeSkgaWYgdmFsaWQsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGdldFRpbGUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIHN1cGVyLmdldFRpbGUoeCwgeSkgYXMgVGlsZSB8IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGVzIHRoZSBtYXAgYW5kIHBsYWNlcyB0aGUgcmVzb3VyY2VzLCBwbGF5ZXJzLCBhbmQgc3RhcnRpbmcgdW5pdHNcbiAgICAgKi9cbiAgICBwcml2YXRlIGdlbmVyYXRlTWFwKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBzdHJ1Y3R1cmVDaGFuY2UgPSAwLjAyNTtcbiAgICAgICAgY29uc3QgbWluRm9vZENoYW5jZSA9IDAuMDE7XG4gICAgICAgIGNvbnN0IG1heEZvb2RDaGFuY2UgPSAwLjE7XG4gICAgICAgIGNvbnN0IG1pbkhhcnZlc3RSYXRlID0gMzA7XG4gICAgICAgIGNvbnN0IG1heEhhcnZlc3RSYXRlID0gMTUwO1xuXG4gICAgICAgIGNvbnN0IGhhbGZXaWR0aCA9IE1hdGguZmxvb3IodGhpcy5tYXBXaWR0aCAvIDIpO1xuICAgICAgICBjb25zdCBoYWxmSGVpZ2h0ID0gTWF0aC5mbG9vcih0aGlzLm1hcEhlaWdodCAvIDIpO1xuXG4gICAgICAgIC8vIFBsYWNlIHN0cnVjdHVyZXMgYW5kIGZvb2Qgc3Bhd25lcnNcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBoYWxmV2lkdGg7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcEhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuZ2V0VGlsZSh4LCB5KTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyB0aWxlIGF0ICgke3h9LCAke3l9KWApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIHN0cnVjdHVyZXMgYW5kIHNwYXduZXJzXG4gICAgICAgICAgICAgICAgaWYgKHkgPT09IGhhbGZIZWlnaHQgLSAxIHx8IHkgPT09IGhhbGZIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgcm9hZFxuICAgICAgICAgICAgICAgICAgICB0aWxlLnN0cnVjdHVyZSA9IHRoaXMubWFuYWdlci5jcmVhdGUuc3RydWN0dXJlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInJvYWRcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjeCA9IHRoaXMubWFwV2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjeSA9IHRoaXMubWFwSGVpZ2h0IC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwID0gMjtcblxuICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgbWF4IGRpc3RhbmNlcyBmcm9tIGNlbnRlciBvZiBtYXAsIHJhaXNlZCB0byBleHBcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF4RCA9IGN4ICoqIGV4cCArIGN5ICoqIGV4cDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgZmFuY3kgZnVuY3Rpb24gYmFzZWQgb24gc29tZSBlYXNpbmcgZnVuY3Rpb25zXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZhY3RvciA9IE1hdGguYWJzKFxuICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coTWF0aC5hYnMoeCAtIGN4KSAtIGN4LCBleHApXG4gICAgICAgICAgICAgICAgICAgICAgICArXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhNYXRoLmFicyh5IC0gY3kpIC0gY3ksIGV4cCksXG4gICAgICAgICAgICAgICAgICAgICkgLyBtYXhEO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvb2QgY2hhbmNlIGluY3JlYXNlcyB0b3dhcmQgY2VudGVyIG9mIG1hcFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb29kQ2hhbmNlUmFuZ2UgPSBtYXhGb29kQ2hhbmNlIC0gbWluRm9vZENoYW5jZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm9vZENoYW5jZSA9IGZhY3RvciAqIGZvb2RDaGFuY2VSYW5nZSArIG1pbkZvb2RDaGFuY2U7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRvIHBsYWNlIGZvb2Qgb3Igc3RydWN0dXJlXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1hbmFnZXIucmFuZG9tLmZsb2F0KCkgPCBmb29kQ2hhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIG11bHRpcGxpZXIgZm9yIHRoZSBoYXJ2ZXN0IHJhdGUsIGluY3JlYXNpbmcgZm9vZCB0b3dhcmQgY2VudGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXhEaXN0RnJvbUNlbnRlciA9IE1hdGguc3FydChjeCAqIGN4ICsgY3kgKiBjeSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkeCA9IGN4IC0geDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGR5ID0gY3kgLSB5O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdEZyb21DZW50ZXIgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFydmVzdFJhdGVNdWx0ID0gMSAtIGRpc3RGcm9tQ2VudGVyIC8gbWF4RGlzdEZyb21DZW50ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoYXJ2ZXN0UmF0ZVJhbmdlID0gbWF4SGFydmVzdFJhdGUgLSBtaW5IYXJ2ZXN0UmF0ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2VuZXJhdGUgZm9vZCBzcGF3bmVyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlLmhhcnZlc3RSYXRlID0gbWluSGFydmVzdFJhdGUgKyBNYXRoLmNlaWwoaGFydmVzdFJhdGVSYW5nZSAqIGhhcnZlc3RSYXRlTXVsdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5tYW5hZ2VyLnJhbmRvbS5mbG9hdCgpIDwgc3RydWN0dXJlQ2hhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBuZXV0cmFsIHN0cnVjdHVyZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUuc3RydWN0dXJlID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS5zdHJ1Y3R1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJuZXV0cmFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBsYWNlIGNhdCBhbmQgc3RhcnRpbmcgc2hlbHRlclxuICAgICAgICBsZXQgcG9zc2libGVUaWxlcyA9IHRoaXMudGlsZXMuZmlsdGVyKCh0KSA9PiB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aWxlIGlzIGVtcHR5XG4gICAgICAgICAgICBpZiAodC5zdHJ1Y3R1cmUgfHwgdC51bml0IHx8IHQuaGFydmVzdFJhdGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGlsZSBpcyBjbG9zZSBlbm91Z2ggdG8gYSBjb3JuZXIgb2YgdGhlIG1hcFxuICAgICAgICAgICAgcmV0dXJuIHQueCA8IGhhbGZXaWR0aCAvIDIgJiYgKHQueSA8IGhhbGZXaWR0aCAvIDIgfHwgdGhpcy5tYXBIZWlnaHQgLSB0LnkgPCBoYWxmV2lkdGggLyAyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFhcnJheUhhc0VsZW1lbnRzKHBvc3NpYmxlVGlsZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBwb3NzaWJsZSB0aWxlcyB0byBnZW5lcmF0ZSBtYXAgZnJvbS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMubWFuYWdlci5yYW5kb20uZWxlbWVudChwb3NzaWJsZVRpbGVzKTtcblxuICAgICAgICAvLyBTaGVsdGVyXG4gICAgICAgIHNlbGVjdGVkLnN0cnVjdHVyZSA9IHRoaXMubWFuYWdlci5jcmVhdGUuc3RydWN0dXJlKHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLnBsYXllcnNbMF0sXG4gICAgICAgICAgICB0aWxlOiBzZWxlY3RlZCxcbiAgICAgICAgICAgIHR5cGU6IFwic2hlbHRlclwiLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBDYXRcbiAgICAgICAgKHRoaXMucGxheWVyc1swXSBhcyBNdXRhYmxlUGxheWVyKS5jYXQgPSBzZWxlY3RlZC51bml0ID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgIG93bmVyOiB0aGlzLnBsYXllcnNbMF0sXG4gICAgICAgICAgICB0aWxlOiBzZWxlY3RlZCxcbiAgICAgICAgICAgIGpvYjogdGhpcy5qb2JzLmZpbmQoKGopID0+IGoudGl0bGUgPT09IFwiY2F0IG92ZXJsb3JkXCIpLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBQbGFjZSBzdGFydGluZyB1bml0c1xuICAgICAgICBjb25zdCBjYXQgPSB0aGlzLnBsYXllcnNbMF0uY2F0O1xuICAgICAgICBjb25zdCBpbmNyZW1lbnQgPSAyO1xuICAgICAgICBsZXQgbWF4RGlzdCA9IDEgLSBpbmNyZW1lbnQ7XG4gICAgICAgIHBvc3NpYmxlVGlsZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlJ3MgdmFsaWQgdGlsZXMgaW4gcmFuZ2VcbiAgICAgICAgICAgIHdoaWxlIChwb3NzaWJsZVRpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIEV4cGFuZCB0aGUgcmFuZ2UgYSBiaXRcbiAgICAgICAgICAgICAgICBtYXhEaXN0ICs9IGluY3JlbWVudDtcbiAgICAgICAgICAgICAgICBwb3NzaWJsZVRpbGVzID0gdGhpcy50aWxlcy5maWx0ZXIoKHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGlsZSBpcyBlbXB0eVxuICAgICAgICAgICAgICAgICAgICBpZiAodC5zdHJ1Y3R1cmUgfHwgdC51bml0IHx8IHQuaGFydmVzdFJhdGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgaXQncyBvbiB0aGUgY29ycmVjdCBzaWRlIG9mIHRoZSBtYXBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQueCA+PSBoYWxmV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2F0LnRpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhdCBpcyBub3Qgb24gYSB0aWxlIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB0aWxlIGlzIGNsb3NlIGVub3VnaCB0byB0aGUgY2F0XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhjYXQudGlsZS54IC0gdC54KSA8PSBtYXhEaXN0ICYmIE1hdGguYWJzKGNhdC50aWxlLnkgLSB0LnkpIDw9IG1heERpc3Q7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXJyYXlIYXNFbGVtZW50cyhwb3NzaWJsZVRpbGVzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHBvc3NpYmxlIHRpbGVzIHRvIGdlbmVyYXRlIG1hcCBmcm9tIGFnYWluLlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hvb3NlIGEgdGlsZVxuICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMubWFuYWdlci5yYW5kb20uZWxlbWVudChwb3NzaWJsZVRpbGVzKTtcbiAgICAgICAgICAgIHRpbGUudW5pdCA9IHRoaXMubWFuYWdlci5jcmVhdGUudW5pdCh7XG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMucGxheWVyc1swXSxcbiAgICAgICAgICAgICAgICB0aWxlLFxuICAgICAgICAgICAgICAgIGpvYjogdGhpcy5qb2JzLmZpbmQoKGopID0+IGoudGl0bGUgPT09IFwiZnJlc2ggaHVtYW5cIiksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlbW92ZUVsZW1lbnRzKHBvc3NpYmxlVGlsZXMsIHRpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWlycm9yIG1hcFxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGhhbGZXaWR0aDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwSGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnID0gdGhpcy5nZXRUaWxlKHgsIHkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2V0VGlsZSh0aGlzLm1hcFdpZHRoIC0geCAtIDEsIHRoaXMubWFwSGVpZ2h0IC0geSAtIDEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFvcmlnIHx8ICF0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gb3JpZ2luIG9yIHRhcmdldCB0aWxlIHRvIG1pcnJvciB0aGUgbWFwIHdpdGhcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ29weSBkYXRhXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmhhcnZlc3RSYXRlID0gb3JpZy5oYXJ2ZXN0UmF0ZTtcblxuICAgICAgICAgICAgICAgIC8vIENsb25lIHN0cnVjdHVyZVxuICAgICAgICAgICAgICAgIGlmIChvcmlnLnN0cnVjdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQuc3RydWN0dXJlID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS5zdHJ1Y3R1cmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZTogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogb3JpZy5zdHJ1Y3R1cmUudHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBvcmlnLnN0cnVjdHVyZS5vd25lciAmJiBvcmlnLnN0cnVjdHVyZS5vd25lci5vcHBvbmVudCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2xvbmUgdW5pdFxuICAgICAgICAgICAgICAgIGlmIChvcmlnLnVuaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnVuaXQgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZTogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IG9yaWcudW5pdC5vd25lciAmJiBvcmlnLnVuaXQub3duZXIub3Bwb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBqb2I6IG9yaWcudW5pdC5qb2IsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXQudW5pdC5qb2IudGl0bGUgPT09IFwiY2F0IG92ZXJsb3JkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICh0YXJnZXQudW5pdC5vd25lciBhcyBNdXRhYmxlUGxheWVyKS5jYXQgPSB0YXJnZXQudW5pdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19