"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const utils_1 = require("~/utils");
const BallGens = require("./game-ball-gen");
// Generate some meta-balls for the islands
const ballGens = Object.values(BallGens);
// <<-- /Creer-Merge: imports -->>
/**
 * Steal from merchants and become the most infamous pirate.
 */
class PiratesGame extends _1.BaseClasses.Game {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
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
        // <<-- Creer-Merge: constructor -->>
        this.generateMap();
        // Give players their starting gold
        const startingGoldFromSettings = Math.max(this.settings.startingGold, 0);
        const startingGold = startingGoldFromSettings || (this.crewCost + this.shipCost * 3);
        for (const player of this.players) {
            player.gold = startingGold;
        }
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
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
    /** Generates the map at the start of the game. */
    generateMap() {
        let failed = true;
        // Make sure there's enough tiles for all the ports to spawn on
        while (failed) {
            failed = false;
            // Remove any current ports
            for (const p of this.ports) {
                p.tile.port = undefined;
            }
            this.ports.length = 0;
            // Fill the map
            for (const tile of this.tiles) {
                tile.type = "water";
            }
            // Pick a meta-ball generator
            if (!utils_1.arrayHasElements(ballGens)) {
                throw new Error("Error loading ballGens for Piracy, appears to be empty.");
            }
            const ballGen = this.manager.random.element(ballGens);
            const ballInfo = ballGen(this.mapWidth, this.mapHeight, () => this.manager.random.float());
            // Generate the islands from the meta-balls
            for (let x = 0; x < this.mapWidth / 2; x++) {
                for (let y = 0; y < this.mapHeight; y++) {
                    const tile = this.getTile(x, y);
                    let energy = 0;
                    for (const ball of ballInfo.balls) {
                        const r = ball.r;
                        const dist = Math.sqrt(Math.pow(ball.x - x, 2) + Math.pow(ball.y - y, 2));
                        const d = Math.max(0.0001, Math.pow(dist, ballInfo.gooeyness)); // Can't be 0
                        energy += r / d;
                    }
                    if (energy >= ballInfo.threshold) {
                        tile.type = "land";
                        if (energy >= ballInfo.grassThreshold) {
                            tile.decoration = true;
                        }
                    }
                    else {
                        tile.type = "water";
                        if (energy <= ballInfo.seaThreshold) {
                            tile.decoration = true;
                        }
                    }
                }
            }
            // Make sure there's only one main body of water, no extra smaller ones
            this.fillLakes();
            // Find all possible port locations
            const portTiles = this.tiles.filter((t) => {
                // Check type
                if (t.type !== "water") {
                    return false;
                }
                // Make sure it's not too close to the center
                if (t.x > this.mapWidth / 4) {
                    return false;
                }
                // Check neighbors - make sure there's land and enough water
                let land = false;
                let water = 0;
                if (t.tileNorth && t.tileNorth.type === "land") {
                    land = true;
                }
                else if (t.tileNorth) {
                    water += 1;
                    if (t.tileNorth.tileEast && t.tileNorth.tileEast.type === "water") {
                        water += 1;
                    }
                    if (t.tileNorth.tileWest && t.tileNorth.tileWest.type === "water") {
                        water += 1;
                    }
                }
                if (t.tileEast && t.tileEast.type === "land") {
                    land = true;
                }
                else if (t.tileEast) {
                    water += 1;
                }
                if (t.tileSouth && t.tileSouth.type === "land") {
                    land = true;
                }
                else if (t.tileSouth) {
                    water += 1;
                    if (t.tileSouth.tileEast && t.tileSouth.tileEast.type === "water") {
                        water += 1;
                    }
                    if (t.tileSouth.tileWest && t.tileSouth.tileWest.type === "water") {
                        water += 1;
                    }
                }
                if (t.tileWest && t.tileWest.type === "land") {
                    land = true;
                }
                else if (t.tileWest) {
                    water += 1;
                }
                return land && water > 5;
            });
            if (portTiles.length === 0) {
                failed = true;
                continue;
            }
            if (!utils_1.arrayHasElements(portTiles)) {
                throw new Error("no port tiles to select from!");
            }
            // Place the starting port
            const selected = this.manager.random.pop(portTiles);
            const port = this.manager.create.port({
                owner: this.players[0],
                tile: selected,
                gold: this.shipCost,
            });
            port.tile.port = port;
            port.owner.port = port;
            this.ports.push(port);
            // Find merchant port locations
            const merchantTiles = portTiles.filter((t) => Math.pow(t.x - port.tile.x, 2) + Math.pow(t.y - port.tile.y, 2) > 9);
            if (!utils_1.arrayHasElements(merchantTiles)) {
                failed = true;
                continue;
            }
            // Place merchant port
            const merchantTile = this.manager.random.pop(merchantTiles);
            const merchantPort = this.manager.create.port({
                tile: merchantTile,
            });
            // Add the port to the game
            merchantTile.port = merchantPort;
            this.ports.push(merchantPort);
        }
        // Mirror the map
        for (let x = 0; x < this.mapWidth / 2; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                const orig = this.getTile(x, y);
                const target = this.getTile(this.mapWidth - x - 1, this.mapHeight - y - 1);
                if (!orig || !target) {
                    throw new Error("Could not mirror the map!");
                }
                // Copy tile data
                target.type = orig.type;
                target.decoration = orig.decoration;
                // Clone ports
                if (orig.port) {
                    const port = this.manager.create.port({
                        tile: target,
                        owner: orig.port.owner && orig.port.owner.opponent,
                        gold: orig.port.gold,
                    });
                    target.port = port;
                    this.ports.push(port);
                    if (port.owner) {
                        port.owner.port = port;
                    }
                    else {
                        // Stagger merchant ship spawning
                        port.gold += this.merchantGoldRate;
                    }
                }
            }
        }
    }
    /**
     * Fills in lakes around the map.
     * This is part of the game's map generation.
     */
    fillLakes() {
        // Find the largest body of water and fill the rest
        const checked = new Set();
        const bodies = [];
        for (const tile of this.tiles) {
            // Only looking for bodies of water
            if (tile.type !== "water") {
                continue;
            }
            // Don't check the same body twice
            if (checked.has(tile)) {
                continue;
            }
            // Use BFS(ish) to find all the connected water
            const body = [];
            const open = [tile];
            while (open.length > 0) {
                const cur = open.shift();
                // Only add water to the body
                if (cur.type !== "water") {
                    continue;
                }
                // Only check for bodies on half of the map
                if (cur.x >= this.mapWidth / 2) {
                    continue;
                }
                // Make sure this tile only gets checked once
                if (checked.has(cur)) {
                    continue;
                }
                checked.add(cur);
                // Add it to the current body of water
                body.push(cur);
                // Add its neighbors to get checked
                open.push(...cur.getNeighbors());
            }
            // Add the current body to the list of bodies
            bodies.push(body);
        }
        // Sort bodies by size (largest first), then remove the first element
        bodies.sort((a, b) => b.length - a.length);
        bodies.shift();
        // Fill the rest of the bodies
        for (const body of bodies) {
            for (const tile of body) {
                tile.type = "land";
                tile.decoration = false;
            }
        }
    }
}
exports.PiratesGame = PiratesGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9waXJhdGVzL2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5QkFBaUM7QUFTakMsaUNBQWlDO0FBRWpDLG1DQUFvRDtBQUNwRCw0Q0FBNEM7QUFDNUMsMkNBQTJDO0FBQzNDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFjekMsa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsY0FBVyxDQUFDLElBQUk7SUEwSjdDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNjLGVBQTJDLEVBQ3JELFFBQXlDO1FBRXpDLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIdkIsb0JBQWUsR0FBZixlQUFlLENBQTRCO1FBckt6RCxrRUFBa0U7UUFDbEQsYUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQXlLbEUscUNBQXFDO1FBRXJDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixtQ0FBbUM7UUFDbkMsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sWUFBWSxHQUFHLHdCQUF3QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMvQixNQUFNLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztTQUM5QjtRQUVELHNDQUFz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QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZVJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZUNsYXNzZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IFBpcmF0ZXNHYW1lTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtbWFuYWdlclwiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQaXJhdGVzR2FtZVNldHRpbmdzTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IHsgUG9ydCB9IGZyb20gXCIuL3BvcnRcIjtcbmltcG9ydCB7IFRpbGUgfSBmcm9tIFwiLi90aWxlXCI7XG5pbXBvcnQgeyBVbml0IH0gZnJvbSBcIi4vdW5pdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuaW1wb3J0IHsgYXJyYXlIYXNFbGVtZW50cywgTXV0YWJsZSB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgKiBhcyBCYWxsR2VucyBmcm9tIFwiLi9nYW1lLWJhbGwtZ2VuXCI7XG4vLyBHZW5lcmF0ZSBzb21lIG1ldGEtYmFsbHMgZm9yIHRoZSBpc2xhbmRzXG5jb25zdCBiYWxsR2VucyA9IE9iamVjdC52YWx1ZXMoQmFsbEdlbnMpO1xuXG4vLyBwbGF5ZXJzIGFuZCB0aWxlcyBhcmUgcHJlLWdlbmVyYXRlZCBpbiB0aGUgYmFzZSBjb25zdHJ1Y3RvciwgYnV0IHdlJ2xsXG4vLyBuZWVkIHRvIG11dGF0ZSBzb21lIG9mIHRoZWlyIHByb3BlcnRpZXMgaW4gb3VyIGNvbnN0cnVjdG9yLlxuLy8gSG93ZXZlciB0aGlzIHdpbGwgb2NjdXIgYmVmb3JlIGNsaWVudHMgZ2V0IGl0IHNvIGl0IHdpbGwgX2FwcGVhcl8gY29uc3RhbnRcbi8vIHRvIHRoZW0sIHNvIGl0J3MgYWxsIGdvb2QuXG4vLyBUaGlzIGlzIGJhc2ljYWxseSB0aGUgb25seSBwbGFjZSBmb3JjaW5nIG11dGF0aW9ucyBpcyBzYWZlIGhvd2V2ZXIuXG5cbi8qKiBBIFBsYXllciB0aGF0IGNhbiBiZSBjaGFuZ2VkIGJlZm9yZSB0aGUgZ2FtZSBzdGFydHMuICovXG50eXBlIE11dGFibGVQbGF5ZXIgPSBNdXRhYmxlPFBsYXllcj47XG5cbi8qKiBBIFRpbGUgdGhhdCBjYW4gYmUgY2hhbmdlZCBiZWZvcmUgdGhlIGdhbWUgc3RhcnRzLiAqL1xudHlwZSBNdXRhYmxlVGlsZSA9IE11dGFibGU8VGlsZT47XG5cbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBTdGVhbCBmcm9tIG1lcmNoYW50cyBhbmQgYmVjb21lIHRoZSBtb3N0IGluZmFtb3VzIHBpcmF0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBpcmF0ZXNHYW1lIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZSB7XG4gICAgLyoqIFRoZSBtYW5hZ2VyIG9mIHRoaXMgZ2FtZSwgdGhhdCBjb250cm9scyBldmVyeXRoaW5nIGFyb3VuZCBpdCAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VyITogUGlyYXRlc0dhbWVNYW5hZ2VyO1xuXG4gICAgLyoqIFRoZSBzZXR0aW5ncyB1c2VkIHRvIGluaXRpYWxpemUgdGhlIGdhbWUsIGFzIHNldCBieSBwbGF5ZXJzICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNldHRpbmdzID0gT2JqZWN0LmZyZWV6ZSh0aGlzLnNldHRpbmdzTWFuYWdlci52YWx1ZXMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJhdGUgYnVyaWVkIGdvbGQgaW5jcmVhc2VzIGVhY2ggdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgYnVyeUludGVyZXN0UmF0ZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGdvbGQgaXQgY29zdHMgdG8gY29uc3RydWN0IGEgc2luZ2xlIGNyZXcuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGNyZXdDb3N0ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogSG93IG11Y2ggZGFtYWdlIGNyZXcgZGVhbCB0byBlYWNoIG90aGVyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmV3RGFtYWdlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1heGltdW0gYW1vdW50IG9mIGhlYWx0aCBhIGNyZXcgbWVtYmVyIGNhbiBoYXZlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmV3SGVhbHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBtb3ZlcyBVbml0cyB3aXRoIG9ubHkgY3JldyBhcmUgZ2l2ZW4gZWFjaCB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmV3TW92ZXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIGNyZXcncyBhdHRhY2sgcmFuZ2UuIFJhbmdlIGlzIGNpcmN1bGFyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmV3UmFuZ2UhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIHdob3NlIHR1cm4gaXQgaXMgY3VycmVudGx5LiBUaGF0IHBsYXllciBjYW4gc2VuZCBjb21tYW5kcy5cbiAgICAgKiBPdGhlciBwbGF5ZXJzIGNhbm5vdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFBsYXllciE6IFBsYXllcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHR1cm4gbnVtYmVyLCBzdGFydGluZyBhdCAwIGZvciB0aGUgZmlyc3QgcGxheWVyJ3MgdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgY3VycmVudFR1cm4hOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcHBpbmcgb2YgZXZlcnkgZ2FtZSBvYmplY3QncyBJRCB0byB0aGUgYWN0dWFsIGdhbWUgb2JqZWN0LiBQcmltYXJpbHlcbiAgICAgKiB1c2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNsaWVudCB0byBlYXNpbHkgcmVmZXIgdG8gdGhlIGdhbWUgb2JqZWN0cyB2aWFcbiAgICAgKiBJRC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZU9iamVjdHMhOiB7W2lkOiBzdHJpbmddOiBHYW1lT2JqZWN0fTtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGhlYWx0aCBhIFVuaXQgcmVjb3ZlcnMgd2hlbiB0aGV5IHJlc3QuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGhlYWxGYWN0b3IhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIFRpbGVzIGluIHRoZSBtYXAgYWxvbmcgdGhlIHkgKHZlcnRpY2FsKSBheGlzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYXBIZWlnaHQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbnVtYmVyIG9mIFRpbGVzIGluIHRoZSBtYXAgYWxvbmcgdGhlIHggKGhvcml6b250YWwpIGF4aXMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hcFdpZHRoITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1heGltdW0gbnVtYmVyIG9mIHR1cm5zIGJlZm9yZSB0aGUgZ2FtZSB3aWxsIGF1dG9tYXRpY2FsbHkgZW5kLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYXhUdXJucyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGdvbGQgbWVyY2hhbnQgUG9ydHMgZ2V0IGVhY2ggdHVybi5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWVyY2hhbnRHb2xkUmF0ZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFdoZW4gYSBtZXJjaGFudCBzaGlwIHNwYXducywgdGhlIGFtb3VudCBvZiBhZGRpdGlvbmFsIGdvbGQgaXQgaGFzXG4gICAgICogcmVsYXRpdmUgdG8gdGhlIFBvcnQncyBpbnZlc3RtZW50LlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtZXJjaGFudEludGVyZXN0UmF0ZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBFdWNsaWRlYW4gZGlzdGFuY2UgYnVyaWVkIGdvbGQgbXVzdCBiZSBmcm9tIHRoZSBQbGF5ZXIncyBQb3J0IHRvXG4gICAgICogYWNjdW11bGF0ZSBpbnRlcmVzdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWluSW50ZXJlc3REaXN0YW5jZSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBwbGF5ZXJzITogUGxheWVyW107XG5cbiAgICAvKipcbiAgICAgKiBFdmVyeSBQb3J0IGluIHRoZSBnYW1lLiBNZXJjaGFudCBwb3J0cyBoYXZlIG93bmVyIHNldCB0byB1bmRlZmluZWQuXG4gICAgICovXG4gICAgcHVibGljIHBvcnRzITogUG9ydFtdO1xuXG4gICAgLyoqXG4gICAgICogSG93IGZhciBhIFVuaXQgY2FuIGJlIGZyb20gYSBQb3J0IHRvIHJlc3QuIFJhbmdlIGlzIGNpcmN1bGFyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSByZXN0UmFuZ2UhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgZ2FtZSBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIHBsYXllZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2Vzc2lvbiE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEhvdyBtdWNoIGdvbGQgaXQgY29zdHMgdG8gY29uc3RydWN0IGEgc2hpcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2hpcENvc3QhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBIb3cgbXVjaCBkYW1hZ2Ugc2hpcHMgZGVhbCB0byBzaGlwcyBhbmQgcG9ydHMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNoaXBEYW1hZ2UhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWF4aW11bSBhbW91bnQgb2YgaGVhbHRoIGEgc2hpcCBjYW4gaGF2ZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2hpcEhlYWx0aCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgbW92ZXMgVW5pdHMgd2l0aCBzaGlwcyBhcmUgZ2l2ZW4gZWFjaCB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzaGlwTW92ZXMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIHNoaXAncyBhdHRhY2sgcmFuZ2UuIFJhbmdlIGlzIGNpcmN1bGFyLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzaGlwUmFuZ2UhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBbGwgdGhlIHRpbGVzIGluIHRoZSBtYXAsIHN0b3JlZCBpbiBSb3ctbWFqb3Igb3JkZXIuIFVzZSBgeCArIHkgKlxuICAgICAqIG1hcFdpZHRoYCB0byBhY2Nlc3MgdGhlIGNvcnJlY3QgaW5kZXguXG4gICAgICovXG4gICAgcHVibGljIHRpbGVzITogVGlsZVtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIGFkZGVkIGFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGFcbiAgICAgKiB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aW1lQWRkZWRQZXJUdXJuITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgVW5pdCBpbiB0aGUgZ2FtZS4gTWVyY2hhbnQgdW5pdHMgaGF2ZSB0YXJnZXRQb3J0IHNldCB0byBhIHBvcnQuXG4gICAgICovXG4gICAgcHVibGljIHVuaXRzITogVW5pdFtdO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgR2FtZSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNldHRpbmdzTWFuYWdlciAtIFRoZSBtYW5hZ2VyIHRoYXQgaG9sZHMgaW5pdGlhbCBzZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHNldHRpbmdzTWFuYWdlcjogUGlyYXRlc0dhbWVTZXR0aW5nc01hbmFnZXIsXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihzZXR0aW5nc01hbmFnZXIsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG5cbiAgICAgICAgdGhpcy5nZW5lcmF0ZU1hcCgpO1xuXG4gICAgICAgIC8vIEdpdmUgcGxheWVycyB0aGVpciBzdGFydGluZyBnb2xkXG4gICAgICAgIGNvbnN0IHN0YXJ0aW5nR29sZEZyb21TZXR0aW5ncyA9IE1hdGgubWF4KHRoaXMuc2V0dGluZ3Muc3RhcnRpbmdHb2xkLCAwKTtcbiAgICAgICAgY29uc3Qgc3RhcnRpbmdHb2xkID0gc3RhcnRpbmdHb2xkRnJvbVNldHRpbmdzIHx8ICh0aGlzLmNyZXdDb3N0ICsgdGhpcy5zaGlwQ29zdCAqIDMpO1xuICAgICAgICBmb3IgKGNvbnN0IHBsYXllciBvZiB0aGlzLnBsYXllcnMpIHtcbiAgICAgICAgICAgIHBsYXllci5nb2xkID0gc3RhcnRpbmdHb2xkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGNvbnN0cnVjdG9yIC0tPj5cbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBwdWJsaWMgZnVuY3Rpb25zIGNhbiBnbyBoZXJlIGZvciBvdGhlciB0aGluZ3MgaW4gdGhlIGdhbWUgdG8gdXNlLlxuICAgIC8vIE5PVEU6IENsaWVudCBBSXMgY2Fubm90IGNhbGwgdGhlc2UgZnVuY3Rpb25zLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHRpbGUgYXQgKHgsIHkpLCBvciB1bmRlZmluZWQgaWYgdGhlIGNvLW9yZGluYXRlcyBhcmUgb2ZmLW1hcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB4IC0gVGhlIHggcG9zaXRpb24gb2YgdGhlIGRlc2lyZWQgdGlsZS5cbiAgICAgKiBAcGFyYW0geSAtIFRoZSB5IHBvc2l0aW9uIG9mIHRoZSBkZXNpcmVkIHRpbGUuXG4gICAgICogQHJldHVybnMgVGhlIFRpbGUgYXQgKHgsIHkpIGlmIHZhbGlkLCB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUaWxlKHg6IG51bWJlciwgeTogbnVtYmVyKTogVGlsZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBzdXBlci5nZXRUaWxlKHgsIHkpIGFzIFRpbGUgfCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8qKiBHZW5lcmF0ZXMgdGhlIG1hcCBhdCB0aGUgc3RhcnQgb2YgdGhlIGdhbWUuICovXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZU1hcCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IGZhaWxlZCA9IHRydWU7XG5cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlJ3MgZW5vdWdoIHRpbGVzIGZvciBhbGwgdGhlIHBvcnRzIHRvIHNwYXduIG9uXG4gICAgICAgIHdoaWxlIChmYWlsZWQpIHtcbiAgICAgICAgICAgIGZhaWxlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgYW55IGN1cnJlbnQgcG9ydHNcbiAgICAgICAgICAgIGZvciAoY29uc3QgcCBvZiB0aGlzLnBvcnRzKSB7XG4gICAgICAgICAgICAgICAgKHAudGlsZSBhcyBNdXRhYmxlVGlsZSkucG9ydCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wb3J0cy5sZW5ndGggPSAwO1xuXG4gICAgICAgICAgICAvLyBGaWxsIHRoZSBtYXBcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiB0aGlzLnRpbGVzKSB7XG4gICAgICAgICAgICAgICAgKHRpbGUgYXMgTXV0YWJsZVRpbGUpLnR5cGUgPSBcIndhdGVyXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBpY2sgYSBtZXRhLWJhbGwgZ2VuZXJhdG9yXG4gICAgICAgICAgICBpZiAoIWFycmF5SGFzRWxlbWVudHMoYmFsbEdlbnMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXJyb3IgbG9hZGluZyBiYWxsR2VucyBmb3IgUGlyYWN5LCBhcHBlYXJzIHRvIGJlIGVtcHR5LlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYmFsbEdlbiA9IHRoaXMubWFuYWdlci5yYW5kb20uZWxlbWVudChiYWxsR2Vucyk7XG4gICAgICAgICAgICBjb25zdCBiYWxsSW5mbyA9IGJhbGxHZW4odGhpcy5tYXBXaWR0aCwgdGhpcy5tYXBIZWlnaHQsICgpID0+IHRoaXMubWFuYWdlci5yYW5kb20uZmxvYXQoKSk7XG5cbiAgICAgICAgICAgIC8vIEdlbmVyYXRlIHRoZSBpc2xhbmRzIGZyb20gdGhlIG1ldGEtYmFsbHNcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5tYXBXaWR0aCAvIDI7IHgrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5tYXBIZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gdGhpcy5nZXRUaWxlKHgsIHkpIGFzIE11dGFibGVUaWxlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZW5lcmd5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBiYWxsIG9mIGJhbGxJbmZvLmJhbGxzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByID0gYmFsbC5yO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChNYXRoLnBvdyhiYWxsLnggLSB4LCAyKSArIE1hdGgucG93KGJhbGwueSAtIHksIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLm1heCgwLjAwMDEsIE1hdGgucG93KGRpc3QsIGJhbGxJbmZvLmdvb2V5bmVzcykpOyAvLyBDYW4ndCBiZSAwXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmVyZ3kgKz0gciAvIGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZW5lcmd5ID49IGJhbGxJbmZvLnRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS50eXBlID0gXCJsYW5kXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5lcmd5ID49IGJhbGxJbmZvLmdyYXNzVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5kZWNvcmF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUudHlwZSA9IFwid2F0ZXJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmVyZ3kgPD0gYmFsbEluZm8uc2VhVGhyZXNob2xkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlsZS5kZWNvcmF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRoZXJlJ3Mgb25seSBvbmUgbWFpbiBib2R5IG9mIHdhdGVyLCBubyBleHRyYSBzbWFsbGVyIG9uZXNcbiAgICAgICAgICAgIHRoaXMuZmlsbExha2VzKCk7XG5cbiAgICAgICAgICAgIC8vIEZpbmQgYWxsIHBvc3NpYmxlIHBvcnQgbG9jYXRpb25zXG4gICAgICAgICAgICBjb25zdCBwb3J0VGlsZXMgPSB0aGlzLnRpbGVzLmZpbHRlcigodCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIHR5cGVcbiAgICAgICAgICAgICAgICBpZiAodC50eXBlICE9PSBcIndhdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBpdCdzIG5vdCB0b28gY2xvc2UgdG8gdGhlIGNlbnRlclxuICAgICAgICAgICAgICAgIGlmICh0LnggPiB0aGlzLm1hcFdpZHRoIC8gNCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgbmVpZ2hib3JzIC0gbWFrZSBzdXJlIHRoZXJlJ3MgbGFuZCBhbmQgZW5vdWdoIHdhdGVyXG4gICAgICAgICAgICAgICAgbGV0IGxhbmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgd2F0ZXIgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0LnRpbGVOb3J0aCAmJiB0LnRpbGVOb3J0aC50eXBlID09PSBcImxhbmRcIikge1xuICAgICAgICAgICAgICAgICAgICBsYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodC50aWxlTm9ydGgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQudGlsZU5vcnRoLnRpbGVFYXN0ICYmIHQudGlsZU5vcnRoLnRpbGVFYXN0LnR5cGUgPT09IFwid2F0ZXJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2F0ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodC50aWxlTm9ydGgudGlsZVdlc3QgJiYgdC50aWxlTm9ydGgudGlsZVdlc3QudHlwZSA9PT0gXCJ3YXRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXRlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0LnRpbGVFYXN0ICYmIHQudGlsZUVhc3QudHlwZSA9PT0gXCJsYW5kXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHQudGlsZUVhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgd2F0ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHQudGlsZVNvdXRoICYmIHQudGlsZVNvdXRoLnR5cGUgPT09IFwibGFuZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0LnRpbGVTb3V0aCkge1xuICAgICAgICAgICAgICAgICAgICB3YXRlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAodC50aWxlU291dGgudGlsZUVhc3QgJiYgdC50aWxlU291dGgudGlsZUVhc3QudHlwZSA9PT0gXCJ3YXRlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YXRlciArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0LnRpbGVTb3V0aC50aWxlV2VzdCAmJiB0LnRpbGVTb3V0aC50aWxlV2VzdC50eXBlID09PSBcIndhdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhdGVyICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHQudGlsZVdlc3QgJiYgdC50aWxlV2VzdC50eXBlID09PSBcImxhbmRcIikge1xuICAgICAgICAgICAgICAgICAgICBsYW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodC50aWxlV2VzdCkge1xuICAgICAgICAgICAgICAgICAgICB3YXRlciArPSAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBsYW5kICYmIHdhdGVyID4gNTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAocG9ydFRpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXJyYXlIYXNFbGVtZW50cyhwb3J0VGlsZXMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gcG9ydCB0aWxlcyB0byBzZWxlY3QgZnJvbSFcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFBsYWNlIHRoZSBzdGFydGluZyBwb3J0XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMubWFuYWdlci5yYW5kb20ucG9wKHBvcnRUaWxlcyk7XG4gICAgICAgICAgICBjb25zdCBwb3J0ID0gdGhpcy5tYW5hZ2VyLmNyZWF0ZS5wb3J0KHtcbiAgICAgICAgICAgICAgICBvd25lcjogdGhpcy5wbGF5ZXJzWzBdLFxuICAgICAgICAgICAgICAgIHRpbGU6IHNlbGVjdGVkLFxuICAgICAgICAgICAgICAgIGdvbGQ6IHRoaXMuc2hpcENvc3QsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgKHBvcnQudGlsZSBhcyBNdXRhYmxlVGlsZSkucG9ydCA9IHBvcnQ7XG4gICAgICAgICAgICAocG9ydC5vd25lciBhcyBNdXRhYmxlUGxheWVyKS5wb3J0ID0gcG9ydDtcbiAgICAgICAgICAgIHRoaXMucG9ydHMucHVzaChwb3J0KTtcblxuICAgICAgICAgICAgLy8gRmluZCBtZXJjaGFudCBwb3J0IGxvY2F0aW9uc1xuICAgICAgICAgICAgY29uc3QgbWVyY2hhbnRUaWxlcyA9IHBvcnRUaWxlcy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgKHQpID0+IE1hdGgucG93KHQueCAtIHBvcnQudGlsZS54LCAyKSArIE1hdGgucG93KHQueSAtIHBvcnQudGlsZS55LCAyKSA+IDksXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCFhcnJheUhhc0VsZW1lbnRzKG1lcmNoYW50VGlsZXMpKSB7XG4gICAgICAgICAgICAgICAgZmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUGxhY2UgbWVyY2hhbnQgcG9ydFxuICAgICAgICAgICAgY29uc3QgbWVyY2hhbnRUaWxlID0gdGhpcy5tYW5hZ2VyLnJhbmRvbS5wb3AobWVyY2hhbnRUaWxlcyk7XG4gICAgICAgICAgICBjb25zdCBtZXJjaGFudFBvcnQgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLnBvcnQoe1xuICAgICAgICAgICAgICAgIHRpbGU6IG1lcmNoYW50VGlsZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIHBvcnQgdG8gdGhlIGdhbWVcbiAgICAgICAgICAgIChtZXJjaGFudFRpbGUgYXMgTXV0YWJsZVRpbGUpLnBvcnQgPSBtZXJjaGFudFBvcnQ7XG4gICAgICAgICAgICB0aGlzLnBvcnRzLnB1c2gobWVyY2hhbnRQb3J0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1pcnJvciB0aGUgbWFwXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5tYXBXaWR0aCAvIDI7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLm1hcEhlaWdodDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZyA9IHRoaXMuZ2V0VGlsZSh4LCB5KTtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmdldFRpbGUodGhpcy5tYXBXaWR0aCAtIHggLSAxLCB0aGlzLm1hcEhlaWdodCAtIHkgLSAxKTtcblxuICAgICAgICAgICAgICAgIGlmICghb3JpZyB8fCAhdGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBtaXJyb3IgdGhlIG1hcCFcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ29weSB0aWxlIGRhdGFcbiAgICAgICAgICAgICAgICAodGFyZ2V0IGFzIE11dGFibGVUaWxlKS50eXBlID0gb3JpZy50eXBlO1xuICAgICAgICAgICAgICAgIHRhcmdldC5kZWNvcmF0aW9uID0gb3JpZy5kZWNvcmF0aW9uO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2xvbmUgcG9ydHNcbiAgICAgICAgICAgICAgICBpZiAob3JpZy5wb3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcnQgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLnBvcnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZTogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IG9yaWcucG9ydC5vd25lciAmJiBvcmlnLnBvcnQub3duZXIub3Bwb25lbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBnb2xkOiBvcmlnLnBvcnQuZ29sZCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICh0YXJnZXQgYXMgTXV0YWJsZVRpbGUpLnBvcnQgPSBwb3J0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvcnRzLnB1c2gocG9ydCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcnQub3duZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIChwb3J0Lm93bmVyIGFzIE11dGFibGVQbGF5ZXIpLnBvcnQgPSBwb3J0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RhZ2dlciBtZXJjaGFudCBzaGlwIHNwYXduaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3J0LmdvbGQgKz0gdGhpcy5tZXJjaGFudEdvbGRSYXRlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlsbHMgaW4gbGFrZXMgYXJvdW5kIHRoZSBtYXAuXG4gICAgICogVGhpcyBpcyBwYXJ0IG9mIHRoZSBnYW1lJ3MgbWFwIGdlbmVyYXRpb24uXG4gICAgICovXG4gICAgcHJpdmF0ZSBmaWxsTGFrZXMoKTogdm9pZCB7XG4gICAgICAgIC8vIEZpbmQgdGhlIGxhcmdlc3QgYm9keSBvZiB3YXRlciBhbmQgZmlsbCB0aGUgcmVzdFxuICAgICAgICBjb25zdCBjaGVja2VkID0gbmV3IFNldDxUaWxlPigpO1xuICAgICAgICBjb25zdCBib2RpZXM6IFRpbGVbXVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiB0aGlzLnRpbGVzKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGxvb2tpbmcgZm9yIGJvZGllcyBvZiB3YXRlclxuICAgICAgICAgICAgaWYgKHRpbGUudHlwZSAhPT0gXCJ3YXRlclwiKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERvbid0IGNoZWNrIHRoZSBzYW1lIGJvZHkgdHdpY2VcbiAgICAgICAgICAgIGlmIChjaGVja2VkLmhhcyh0aWxlKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVc2UgQkZTKGlzaCkgdG8gZmluZCBhbGwgdGhlIGNvbm5lY3RlZCB3YXRlclxuICAgICAgICAgICAgY29uc3QgYm9keTogVGlsZVtdID0gW107XG4gICAgICAgICAgICBjb25zdCBvcGVuOiBUaWxlW10gPSBbIHRpbGUgXTtcbiAgICAgICAgICAgIHdoaWxlIChvcGVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXIgPSBvcGVuLnNoaWZ0KCkgYXMgVGlsZTtcblxuICAgICAgICAgICAgICAgIC8vIE9ubHkgYWRkIHdhdGVyIHRvIHRoZSBib2R5XG4gICAgICAgICAgICAgICAgaWYgKGN1ci50eXBlICE9PSBcIndhdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gT25seSBjaGVjayBmb3IgYm9kaWVzIG9uIGhhbGYgb2YgdGhlIG1hcFxuICAgICAgICAgICAgICAgIGlmIChjdXIueCA+PSB0aGlzLm1hcFdpZHRoIC8gMikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhpcyB0aWxlIG9ubHkgZ2V0cyBjaGVja2VkIG9uY2VcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tlZC5oYXMoY3VyKSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2hlY2tlZC5hZGQoY3VyKTtcblxuICAgICAgICAgICAgICAgIC8vIEFkZCBpdCB0byB0aGUgY3VycmVudCBib2R5IG9mIHdhdGVyXG4gICAgICAgICAgICAgICAgYm9keS5wdXNoKGN1cik7XG5cbiAgICAgICAgICAgICAgICAvLyBBZGQgaXRzIG5laWdoYm9ycyB0byBnZXQgY2hlY2tlZFxuICAgICAgICAgICAgICAgIG9wZW4ucHVzaCguLi5jdXIuZ2V0TmVpZ2hib3JzKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIGN1cnJlbnQgYm9keSB0byB0aGUgbGlzdCBvZiBib2RpZXNcbiAgICAgICAgICAgIGJvZGllcy5wdXNoKGJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU29ydCBib2RpZXMgYnkgc2l6ZSAobGFyZ2VzdCBmaXJzdCksIHRoZW4gcmVtb3ZlIHRoZSBmaXJzdCBlbGVtZW50XG4gICAgICAgIGJvZGllcy5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKTtcbiAgICAgICAgYm9kaWVzLnNoaWZ0KCk7XG5cbiAgICAgICAgLy8gRmlsbCB0aGUgcmVzdCBvZiB0aGUgYm9kaWVzXG4gICAgICAgIGZvciAoY29uc3QgYm9keSBvZiBib2RpZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgdGlsZSBvZiBib2R5KSB7XG4gICAgICAgICAgICAgICAgKHRpbGUgYXMgTXV0YWJsZVRpbGUpLnR5cGUgPSBcImxhbmRcIjtcbiAgICAgICAgICAgICAgICB0aWxlLmRlY29yYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19