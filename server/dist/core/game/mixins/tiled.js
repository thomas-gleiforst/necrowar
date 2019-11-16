"use strict";
// tslint:disable:max-classes-per-file
// ^ because the mixin define multiple classes while maintaining scope to each
// tslint:disable:no-empty-interface
// ^ because the some mixins have nothing to add
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("~/core/game");
/** The valid direction strings tile based games use. */
const TILE_DIRECTIONS = ["North", "South", "East", "West"];
/** A base tile for super tiles to extend */
class BaseTile extends game_1.BaseGameObject {
    /**
     * Gets the adjacent direction between this tile and an adjacent tile
     * (if one exists).
     *
     * @param adjacentTile - A tile that should be adjacent to this tile
     * @returns - The string direction, or undefined if the
     * tile is invalid, or there is no adjacent direction between this tile
     * and that tile
     * ("North", "East", "South", or "West") if found in that direction,
     * undefined otherwise.
     */
    getAdjacentDirection(adjacentTile) {
        if (adjacentTile) {
            for (const direction of TILE_DIRECTIONS) {
                if (this.getNeighbor(direction) === adjacentTile) {
                    return direction;
                }
            }
        }
    }
    /**
     * Gets a list of all the neighbors of this tile.
     *
     * @returns - An array of all adjacent tiles.
     * Should be between 2 to 4 tiles.
     */
    getNeighbors() {
        const neighbors = new Array();
        for (const direction of TILE_DIRECTIONS) {
            const neighbor = this.getNeighbor(direction);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }
        return neighbors;
    }
    /**
     * Gets a neighbor in a particular direction.
     *
     * @param direction - The direction you want,
     * must be "North", "East", "South", or "West".
     * @returns The Tile in that direction, null if none.
     */
    getNeighbor(direction) {
        switch (direction) {
            case "North":
                return this.tileNorth;
            case "South":
                return this.tileSouth;
            case "East":
                return this.tileEast;
            case "West":
                return this.tileWest;
        }
    }
    /**
     * Checks if a Tile has another tile as its neighbor
     *
     * @param tile - tile to check
     * @returns true if neighbor, false otherwise
     */
    hasNeighbor(tile) {
        return Boolean(this.getAdjacentDirection(tile));
    }
    /**
     * toString override
     *
     * @returns a string representation of the Tile
     */
    toString() {
        return `${this.gameObjectName} #${this.id} at (${this.x}, ${this.y})`;
    }
}
exports.BaseTile = BaseTile;
/**
 * A game that has a grid based map of tiles. This handles creating that
 * initial map and hooking it up. That's it.
 *
 * @param base - The BaseGame (or sub BaseGame) to mix in tiled logic.
 * @returns A new BaseGame class with Tiled logic mixed in.
 */
// Because it will be a weird mixin type inferred from the return statement
// tslint:disable-next-line:typedef
function mixTiled(base) {
    /** The settings for a Tiled game */
    class TiledGameSettings extends base.GameSettings {
        constructor() {
            super(...arguments);
            /** The current settings values. */
            this.values = this.initialValues(this.schema);
        }
        /** The schema for a Tiled game, adding in configurable map sizes. */
        get schema() {
            return this.makeSchema({
                // HACK: super should work. but schema is undefined on it
                // tslint:disable-next-line:no-any
                ...(super.schema || this.schema),
                mapWidth: {
                    default: 32,
                    min: 2,
                    description: "The width (in Tiles) for the game map to be "
                        + "initialized to.",
                },
                mapHeight: {
                    default: 16,
                    min: 2,
                    description: "The height (in Tiles) for the game map to be "
                        + "initialized to.",
                },
            });
        }
    }
    /** A game that has a map made of tiles in it. */
    class TiledGame extends base.Game {
        constructor(...args) {
            // any[] is required for mixin
            // constructor signature
            super(...args);
            // server-side only
            /** The valid directions tiles can be in from one another. */
            this.tileDirections = TILE_DIRECTIONS;
            this.tiles.length = this.mapWidth * this.mapHeight;
            // Create each tile.
            for (let x = 0; x < this.mapWidth; x++) {
                for (let y = 0; y < this.mapHeight; y++) {
                    const i = x + y * this.mapWidth;
                    this.tiles[i] = this.manager.create.tile({ x, y });
                }
            }
            // now hook up their neighbors
            for (let x = 0; x < this.mapWidth; x++) {
                for (let y = 0; y < this.mapHeight; y++) {
                    const tile = this.getTile(x, y);
                    tile.tileNorth = this.getTile(x, y - 1);
                    tile.tileEast = this.getTile(x + 1, y);
                    tile.tileSouth = this.getTile(x, y + 1);
                    tile.tileWest = this.getTile(x - 1, y);
                }
            }
        }
        /**
         * Gets the tile at (x, y), or undefined if the co-ordinates are
         * off-map.
         *
         * @param x - The x position of the desired tile.
         * @param y - The y position of the desired tile.
         * @returns The Tile at (x, y) if valid, null otherwise.
         */
        getTile(x, y) {
            if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
                return undefined;
            }
            return this.tiles[x + y * this.mapWidth];
        }
        /**
         * Given the index in the tiles array, gets the (x, y) of that tile.
         *
         * @param index - The index to get.
         * @returns A point with the { x, y } value at that index's point.
         */
        getIndex(index) {
            const y = index / this.mapWidth;
            const x = index - (y * this.mapWidth);
            return { x, y };
        }
        /**
         * Inverts a direction string, e.g. "North" -> "South"
         *
         * @param direction - the direction string to invert
         * @returns the direction inverted,
         * e.g. "East" -> "West", undefined if the direction was not a valid
         * direction string.
         */
        invertTileDirection(direction) {
            switch (direction) {
                case "North": return "South";
                case "East": return "West";
                case "South": return "North";
                case "West": return "East";
            }
        }
    }
    return {
        ...base,
        Game: TiledGame,
        GameSettings: TiledGameSettings,
    };
}
exports.mixTiled = mixTiled;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9nYW1lL21peGlucy90aWxlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsc0NBQXNDO0FBQ3RDLDhFQUE4RTtBQUM5RSxvQ0FBb0M7QUFDcEMsZ0RBQWdEOztBQUVoRCxzQ0FDNEI7QUFPNUIsd0RBQXdEO0FBQ3hELE1BQU0sZUFBZSxHQUNFLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFFLENBQUM7QUFLNUQsNENBQTRDO0FBQzVDLE1BQXNCLFFBQVMsU0FBUSxxQkFBYztJQW1CakQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLG9CQUFvQixDQUN2QixZQUFrQztRQUVsQyxJQUFJLFlBQVksRUFBRTtZQUNkLEtBQUssTUFBTSxTQUFTLElBQUksZUFBZSxFQUFFO2dCQUNyQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssWUFBWSxFQUFFO29CQUM5QyxPQUFPLFNBQVMsQ0FBQztpQkFDcEI7YUFDSjtTQUNKO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksWUFBWTtRQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxFQUFZLENBQUM7UUFFeEMsS0FBSyxNQUFNLFNBQVMsSUFBSSxlQUFlLEVBQUU7WUFDckMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxJQUFJLFFBQVEsRUFBRTtnQkFDVixTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzVCO1NBQ0o7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksV0FBVyxDQUNkLFNBQThDO1FBRTlDLFFBQVEsU0FBUyxFQUFFO1lBQ2YsS0FBSyxPQUFPO2dCQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUMxQixLQUFLLE9B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Ozs7OztXQU9HO1FBQ0ksbUJBQW1CLENBQ3RCLFNBQThDO1lBRTlDLFFBQVEsU0FBUyxFQUFFO2dCQUNmLEtBQUssT0FBTyxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUM7Z0JBQzdCLEtBQUssTUFBTSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUM7Z0JBQzNCLEtBQUssT0FBTyxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUM7Z0JBQzdCLEtBQUssTUFBTSxDQUFDLENBQUMsT0FBTyxNQUFNLENBQUM7YUFDOUI7UUFDTCxDQUFDO0tBQ0o7SUFFRCxPQUFPO1FBQ0gsR0FBRyxJQUFJO1FBQ1AsSUFBSSxFQUFFLFNBQVM7UUFDZixZQUFZLEVBQUUsaUJBQWlCO0tBQ2xDLENBQUM7QUFDTixDQUFDO0FBaE5ELDRCQWdOQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOm1heC1jbGFzc2VzLXBlci1maWxlXG4vLyBeIGJlY2F1c2UgdGhlIG1peGluIGRlZmluZSBtdWx0aXBsZSBjbGFzc2VzIHdoaWxlIG1haW50YWluaW5nIHNjb3BlIHRvIGVhY2hcbi8vIHRzbGludDpkaXNhYmxlOm5vLWVtcHR5LWludGVyZmFjZVxuLy8gXiBiZWNhdXNlIHRoZSBzb21lIG1peGlucyBoYXZlIG5vdGhpbmcgdG8gYWRkXG5cbmltcG9ydCB7IEJhc2VHYW1lT2JqZWN0LCBCYXNlR2FtZU9iamVjdEZhY3RvcnksIEJhc2VQbGF5ZXIsXG4gICAgICAgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IElQb2ludCwgTXV0YWJsZSB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgKiBhcyBCYXNlIGZyb20gXCIuL2Jhc2VcIjtcblxuLyoqIFRoZSBwb3NzaWJsZSBkaXJlY3Rpb25zIGEgdGlsZSBjYW4gYmUgaW4gKi9cbmV4cG9ydCB0eXBlIFRpbGVEaXJlY3Rpb24gPSBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiO1xuXG4vKiogVGhlIHZhbGlkIGRpcmVjdGlvbiBzdHJpbmdzIHRpbGUgYmFzZWQgZ2FtZXMgdXNlLiAqL1xuY29uc3QgVElMRV9ESVJFQ1RJT05TOiBbIFwiTm9ydGhcIiwgXCJTb3V0aFwiLCBcIkVhc3RcIiwgXCJXZXN0XCIgXSA9XG4gICAgICAgICAgICAgICAgICAgICAgIFsgXCJOb3J0aFwiLCBcIlNvdXRoXCIsIFwiRWFzdFwiLCBcIldlc3RcIiBdO1xuXG4vKiogQSBwbGF5ZXIgaW4gYSB0aWxlIGJhc2VkIGdhbWUuICovXG5leHBvcnQgaW50ZXJmYWNlIElUaWxlZFBsYXllciBleHRlbmRzIEJhc2VQbGF5ZXIge31cblxuLyoqIEEgYmFzZSB0aWxlIGZvciBzdXBlciB0aWxlcyB0byBleHRlbmQgKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlVGlsZSBleHRlbmRzIEJhc2VHYW1lT2JqZWN0IHtcbiAgICAvKiogVGhlIFggY29vcmRpbmF0ZSBvZiB0aGUgdGlsZS4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgeCE6IG51bWJlcjtcblxuICAgIC8qKiBUaGUgWSBjb29yZGluYXRlIG9mIHRoZSB0aWxlLiAqL1xuICAgIHB1YmxpYyByZWFkb25seSB5ITogbnVtYmVyO1xuXG4gICAgLyoqIFRoZSBuZWlnaGJvcmluZyB0aWxlIHRvIHRoZSBOb3J0aCwgaWYgcHJlc2VudC4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZU5vcnRoPzogQmFzZVRpbGU7XG5cbiAgICAvKiogVGhlIG5laWdoYm9yaW5nIHRpbGUgdG8gdGhlIEVhc3QsIGlmIHByZXNlbnQuICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbGVFYXN0PzogQmFzZVRpbGU7XG5cbiAgICAvKiogVGhlIG5laWdoYm9yaW5nIHRpbGUgdG8gdGhlIFNvdXRoLCBpZiBwcmVzZW50LiAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlU291dGg/OiBCYXNlVGlsZTtcblxuICAgIC8qKiBUaGUgbmVpZ2hib3JpbmcgdGlsZSB0byB0aGUgV2VzdCwgaWYgcHJlc2VudC4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVdlc3Q/OiBCYXNlVGlsZTtcblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGFkamFjZW50IGRpcmVjdGlvbiBiZXR3ZWVuIHRoaXMgdGlsZSBhbmQgYW4gYWRqYWNlbnQgdGlsZVxuICAgICAqIChpZiBvbmUgZXhpc3RzKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhZGphY2VudFRpbGUgLSBBIHRpbGUgdGhhdCBzaG91bGQgYmUgYWRqYWNlbnQgdG8gdGhpcyB0aWxlXG4gICAgICogQHJldHVybnMgLSBUaGUgc3RyaW5nIGRpcmVjdGlvbiwgb3IgdW5kZWZpbmVkIGlmIHRoZVxuICAgICAqIHRpbGUgaXMgaW52YWxpZCwgb3IgdGhlcmUgaXMgbm8gYWRqYWNlbnQgZGlyZWN0aW9uIGJldHdlZW4gdGhpcyB0aWxlXG4gICAgICogYW5kIHRoYXQgdGlsZVxuICAgICAqIChcIk5vcnRoXCIsIFwiRWFzdFwiLCBcIlNvdXRoXCIsIG9yIFwiV2VzdFwiKSBpZiBmb3VuZCBpbiB0aGF0IGRpcmVjdGlvbixcbiAgICAgKiB1bmRlZmluZWQgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBZGphY2VudERpcmVjdGlvbihcbiAgICAgICAgYWRqYWNlbnRUaWxlOiBCYXNlVGlsZSB8IHVuZGVmaW5lZCxcbiAgICApOiBcIk5vcnRoXCIgfCBcIlNvdXRoXCIgfCBcIkVhc3RcIiB8IFwiV2VzdFwiIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgaWYgKGFkamFjZW50VGlsZSkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBkaXJlY3Rpb24gb2YgVElMRV9ESVJFQ1RJT05TKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TmVpZ2hib3IoZGlyZWN0aW9uKSA9PT0gYWRqYWNlbnRUaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIHRoZSBuZWlnaGJvcnMgb2YgdGhpcyB0aWxlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgLSBBbiBhcnJheSBvZiBhbGwgYWRqYWNlbnQgdGlsZXMuXG4gICAgICogU2hvdWxkIGJlIGJldHdlZW4gMiB0byA0IHRpbGVzLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXROZWlnaGJvcnMoKTogQmFzZVRpbGVbXSB7XG4gICAgICAgIGNvbnN0IG5laWdoYm9ycyA9IG5ldyBBcnJheTxCYXNlVGlsZT4oKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGRpcmVjdGlvbiBvZiBUSUxFX0RJUkVDVElPTlMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yID0gdGhpcy5nZXROZWlnaGJvcihkaXJlY3Rpb24pO1xuICAgICAgICAgICAgaWYgKG5laWdoYm9yKSB7XG4gICAgICAgICAgICAgICAgbmVpZ2hib3JzLnB1c2gobmVpZ2hib3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5laWdoYm9ycztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbmVpZ2hib3IgaW4gYSBwYXJ0aWN1bGFyIGRpcmVjdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb24gLSBUaGUgZGlyZWN0aW9uIHlvdSB3YW50LFxuICAgICAqIG11c3QgYmUgXCJOb3J0aFwiLCBcIkVhc3RcIiwgXCJTb3V0aFwiLCBvciBcIldlc3RcIi5cbiAgICAgKiBAcmV0dXJucyBUaGUgVGlsZSBpbiB0aGF0IGRpcmVjdGlvbiwgbnVsbCBpZiBub25lLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXROZWlnaGJvcihcbiAgICAgICAgZGlyZWN0aW9uOiBcIk5vcnRoXCIgfCBcIlNvdXRoXCIgfCBcIkVhc3RcIiB8IFwiV2VzdFwiLFxuICAgICk6IEJhc2VUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJOb3J0aFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRpbGVOb3J0aDtcbiAgICAgICAgICAgIGNhc2UgXCJTb3V0aFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRpbGVTb3V0aDtcbiAgICAgICAgICAgIGNhc2UgXCJFYXN0XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGlsZUVhc3Q7XG4gICAgICAgICAgICBjYXNlIFwiV2VzdFwiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRpbGVXZXN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgVGlsZSBoYXMgYW5vdGhlciB0aWxlIGFzIGl0cyBuZWlnaGJvclxuICAgICAqXG4gICAgICogQHBhcmFtIHRpbGUgLSB0aWxlIHRvIGNoZWNrXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiBuZWlnaGJvciwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGhhc05laWdoYm9yKHRpbGU6IEJhc2VUaWxlIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHRoaXMuZ2V0QWRqYWNlbnREaXJlY3Rpb24odGlsZSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvU3RyaW5nIG92ZXJyaWRlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgVGlsZVxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5nYW1lT2JqZWN0TmFtZX0gIyR7dGhpcy5pZH0gYXQgKCR7dGhpcy54fSwgJHt0aGlzLnl9KWA7XG4gICAgfVxufVxuXG4vKiogQSB0aWxlIHRoYXQgaXMgbXV0YWJsZSAqL1xudHlwZSBNdXRhYmxlQmFzZVRpbGUgPSBNdXRhYmxlPEJhc2VUaWxlPjtcblxuLyoqXG4gKiBBIGdhbWUgdGhhdCBoYXMgYSBncmlkIGJhc2VkIG1hcCBvZiB0aWxlcy4gVGhpcyBoYW5kbGVzIGNyZWF0aW5nIHRoYXRcbiAqIGluaXRpYWwgbWFwIGFuZCBob29raW5nIGl0IHVwLiBUaGF0J3MgaXQuXG4gKlxuICogQHBhcmFtIGJhc2UgLSBUaGUgQmFzZUdhbWUgKG9yIHN1YiBCYXNlR2FtZSkgdG8gbWl4IGluIHRpbGVkIGxvZ2ljLlxuICogQHJldHVybnMgQSBuZXcgQmFzZUdhbWUgY2xhc3Mgd2l0aCBUaWxlZCBsb2dpYyBtaXhlZCBpbi5cbiAqL1xuLy8gQmVjYXVzZSBpdCB3aWxsIGJlIGEgd2VpcmQgbWl4aW4gdHlwZSBpbmZlcnJlZCBmcm9tIHRoZSByZXR1cm4gc3RhdGVtZW50XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dHlwZWRlZlxuZXhwb3J0IGZ1bmN0aW9uIG1peFRpbGVkPFxuICAgIFRCYXNlQUkgZXh0ZW5kcyBCYXNlLkJhc2VBSUNvbnN0cnVjdG9yLFxuICAgIFRCYXNlR2FtZSBleHRlbmRzIEJhc2UuQmFzZUdhbWVDb25zdHJ1Y3RvcixcbiAgICBUQmFzZUdhbWVNYW5hZ2VyIGV4dGVuZHMgQmFzZS5CYXNlR2FtZU1hbmFnZXJDb25zdHJ1Y3RvcixcbiAgICBUQmFzZUdhbWVPYmplY3QgZXh0ZW5kcyBCYXNlLkJhc2VHYW1lT2JqZWN0Q29uc3RydWN0b3IsXG4gICAgVEJhc2VHYW1lU2V0dGluZ3MgZXh0ZW5kcyBCYXNlLkJhc2VHYW1lU2V0dGluZ3NNYW5hZ2VyQ29uc3RydWN0b3Jcbj4oYmFzZToge1xuICAgIC8qKiBUaGUgQUkgdG8gZXh0ZW5kLiAqL1xuICAgIEFJOiBUQmFzZUFJO1xuICAgIC8qKiBUaGUgR2FtZSB0byBleHRlbmQuICovXG4gICAgR2FtZTogVEJhc2VHYW1lO1xuICAgIC8qKiBUaGUgR2FtZU1hbmFnZXIgdG8gZXh0ZW5kLiAqL1xuICAgIEdhbWVNYW5hZ2VyOiBUQmFzZUdhbWVNYW5hZ2VyO1xuICAgIC8qKiBUaGUgR2FtZU9iamVjdCB0byBleHRlbmQuICovXG4gICAgR2FtZU9iamVjdDogVEJhc2VHYW1lT2JqZWN0O1xuICAgIC8qKiBUaGUgR2FtZVNldHRpbmdzIHRvIGV4dGVuZC4gKi9cbiAgICBHYW1lU2V0dGluZ3M6IFRCYXNlR2FtZVNldHRpbmdzO1xufSkge1xuICAgIC8qKiBUaGUgc2V0dGluZ3MgZm9yIGEgVGlsZWQgZ2FtZSAqL1xuICAgIGNsYXNzIFRpbGVkR2FtZVNldHRpbmdzIGV4dGVuZHMgYmFzZS5HYW1lU2V0dGluZ3Mge1xuICAgICAgICAvKiogVGhlIHNjaGVtYSBmb3IgYSBUaWxlZCBnYW1lLCBhZGRpbmcgaW4gY29uZmlndXJhYmxlIG1hcCBzaXplcy4gKi9cbiAgICAgICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZVNjaGVtYSh7XG4gICAgICAgICAgICAgICAgLy8gSEFDSzogc3VwZXIgc2hvdWxkIHdvcmsuIGJ1dCBzY2hlbWEgaXMgdW5kZWZpbmVkIG9uIGl0XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgICAgIC4uLihzdXBlci5zY2hlbWEgfHwgKHRoaXMgYXMgYW55KS5zY2hlbWEpLFxuICAgICAgICAgICAgICAgIG1hcFdpZHRoOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDMyLFxuICAgICAgICAgICAgICAgICAgICBtaW46IDIsXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSB3aWR0aCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBtYXBIZWlnaHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMTYsXG4gICAgICAgICAgICAgICAgICAgIG1pbjogMixcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIGhlaWdodCAoaW4gVGlsZXMpIGZvciB0aGUgZ2FtZSBtYXAgdG8gYmUgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIFwiaW5pdGlhbGl6ZWQgdG8uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqIFRoZSBjdXJyZW50IHNldHRpbmdzIHZhbHVlcy4gKi9cbiAgICAgICAgcHVibGljIHZhbHVlcyA9IHRoaXMuaW5pdGlhbFZhbHVlcyh0aGlzLnNjaGVtYSk7XG4gICAgfVxuXG4gICAgLyoqIEEgZ2FtZSB0aGF0IGhhcyBhIG1hcCBtYWRlIG9mIHRpbGVzIGluIGl0LiAqL1xuICAgIGNsYXNzIFRpbGVkR2FtZSBleHRlbmRzIGJhc2UuR2FtZSB7XG4gICAgICAgIC8vIGNsaWVudCA8LS0+IHNlcnZlciBwcm9wZXJ0aWVzXG4gICAgICAgIC8qKiBUaGUgdGlsZXMgaW4gdGhlIGdhbWUsIGluIHJvd01ham9yIG9yZGVyLiAqL1xuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZXMhOiBCYXNlVGlsZVtdO1xuXG4gICAgICAgIC8qKiBUaGUgd2lkdGggb2YgdGhlIG1hcCBhbG9uZyB0aGUgWC1BeGlzLiAqL1xuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgbWFwV2lkdGghOiBudW1iZXI7XG5cbiAgICAgICAgLyoqIFRoZSBoZWlnaHQgb2YgdGhlIG1hcCBhbG9uZyB0aGUgWS1BeGlzLiAqL1xuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgbWFwSGVpZ2h0ITogbnVtYmVyO1xuXG4gICAgICAgIC8vIHNlcnZlci1zaWRlIG9ubHlcbiAgICAgICAgLyoqIFRoZSB2YWxpZCBkaXJlY3Rpb25zIHRpbGVzIGNhbiBiZSBpbiBmcm9tIG9uZSBhbm90aGVyLiAqL1xuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZURpcmVjdGlvbnMgPSBUSUxFX0RJUkVDVElPTlM7XG5cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1hbnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW55W10gaXMgcmVxdWlyZWQgZm9yIG1peGluXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdG9yIHNpZ25hdHVyZVxuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgICAgICAgIHRoaXMudGlsZXMubGVuZ3RoID0gdGhpcy5tYXBXaWR0aCAqIHRoaXMubWFwSGVpZ2h0O1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgZWFjaCB0aWxlLlxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLm1hcFdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwSGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaSA9IHggKyB5ICogdGhpcy5tYXBXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aWxlc1tpXSA9ICh0aGlzLm1hbmFnZXIuY3JlYXRlIGFzIChCYXNlR2FtZU9iamVjdEZhY3RvcnkgJiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBbGwgVGlsZWQgZ2FtZXMgc2hvdWxkIGhhdmUgdGhpcyBtZXRob2QsIGNhbid0IHJlZmVyZW5jZSBpbiB0aGlzIG1peGluLlxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICAgICAgICAgKiBDcmVhdGVzIGEgVGlsZSBhdCB0aGUgZ2l2ZW4geyB4LCB5IH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAqIEBwYXJhbSBhcmdzIC0gTXVzdCBjb250YWluIG5vcm1hbCBCYXNlR2FtZU9iamVjdCBkYXRhIGFuZCBhbiB7IHgsIHkgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICogQFJldHVybnMgQSB0aWxlIG9mIHRoYXQgaW5zdGFuY2UgZnJvbSB0aGF0IEdhbWVPYmplY3RGYWN0b3J5XG4gICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbGUoYXJnczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKiBUaGUgWCBwb3NpdGlvbiBvZiB0aGUgVGlsZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqIFRoZSBZIHBvc2l0aW9uIG9mIHRoZSBUaWxlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IG51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pOiBCYXNlVGlsZTtcbiAgICAgICAgICAgICAgICAgICAgfSkpLnRpbGUoe3gsIHl9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG5vdyBob29rIHVwIHRoZWlyIG5laWdoYm9yc1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLm1hcFdpZHRoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMubWFwSGVpZ2h0OyB5KyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGlsZSA9IHRoaXMuZ2V0VGlsZSh4LCB5KSBhcyBNdXRhYmxlQmFzZVRpbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgdGlsZS50aWxlTm9ydGggPSB0aGlzLmdldFRpbGUoeCwgeSAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aWxlLnRpbGVFYXN0ID0gdGhpcy5nZXRUaWxlKHggKyAxLCB5KTtcbiAgICAgICAgICAgICAgICAgICAgdGlsZS50aWxlU291dGggPSB0aGlzLmdldFRpbGUoeCwgeSArIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aWxlLnRpbGVXZXN0ID0gdGhpcy5nZXRUaWxlKHggLSAxLCB5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0cyB0aGUgdGlsZSBhdCAoeCwgeSksIG9yIHVuZGVmaW5lZCBpZiB0aGUgY28tb3JkaW5hdGVzIGFyZVxuICAgICAgICAgKiBvZmYtbWFwLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0geCAtIFRoZSB4IHBvc2l0aW9uIG9mIHRoZSBkZXNpcmVkIHRpbGUuXG4gICAgICAgICAqIEBwYXJhbSB5IC0gVGhlIHkgcG9zaXRpb24gb2YgdGhlIGRlc2lyZWQgdGlsZS5cbiAgICAgICAgICogQHJldHVybnMgVGhlIFRpbGUgYXQgKHgsIHkpIGlmIHZhbGlkLCBudWxsIG90aGVyd2lzZS5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRUaWxlKHg6IG51bWJlciwgeTogbnVtYmVyKTogQmFzZVRpbGUgfCB1bmRlZmluZWQge1xuICAgICAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gdGhpcy5tYXBXaWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMubWFwSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGlsZXNbeCArIHkgKiB0aGlzLm1hcFdpZHRoXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHaXZlbiB0aGUgaW5kZXggaW4gdGhlIHRpbGVzIGFycmF5LCBnZXRzIHRoZSAoeCwgeSkgb2YgdGhhdCB0aWxlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gaW5kZXggLSBUaGUgaW5kZXggdG8gZ2V0LlxuICAgICAgICAgKiBAcmV0dXJucyBBIHBvaW50IHdpdGggdGhlIHsgeCwgeSB9IHZhbHVlIGF0IHRoYXQgaW5kZXgncyBwb2ludC5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBnZXRJbmRleChpbmRleDogbnVtYmVyKTogSVBvaW50IHtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBpbmRleCAvIHRoaXMubWFwV2lkdGg7XG4gICAgICAgICAgICBjb25zdCB4ID0gaW5kZXggLSAoeSAqIHRoaXMubWFwV2lkdGgpO1xuXG4gICAgICAgICAgICByZXR1cm4geyB4LCB5IH07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW52ZXJ0cyBhIGRpcmVjdGlvbiBzdHJpbmcsIGUuZy4gXCJOb3J0aFwiIC0+IFwiU291dGhcIlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIC0gdGhlIGRpcmVjdGlvbiBzdHJpbmcgdG8gaW52ZXJ0XG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBkaXJlY3Rpb24gaW52ZXJ0ZWQsXG4gICAgICAgICAqIGUuZy4gXCJFYXN0XCIgLT4gXCJXZXN0XCIsIHVuZGVmaW5lZCBpZiB0aGUgZGlyZWN0aW9uIHdhcyBub3QgYSB2YWxpZFxuICAgICAgICAgKiBkaXJlY3Rpb24gc3RyaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGludmVydFRpbGVEaXJlY3Rpb24oZGlyZWN0aW9uOiBcIk5vcnRoXCIpOiBcIlNvdXRoXCI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludmVydHMgYSBkaXJlY3Rpb24gc3RyaW5nLCBlLmcuIFwiTm9ydGhcIiAtPiBcIlNvdXRoXCJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIHRoZSBkaXJlY3Rpb24gc3RyaW5nIHRvIGludmVydFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZGlyZWN0aW9uIGludmVydGVkLFxuICAgICAgICAgKiBlLmcuIFwiRWFzdFwiIC0+IFwiV2VzdFwiLCB1bmRlZmluZWQgaWYgdGhlIGRpcmVjdGlvbiB3YXMgbm90IGEgdmFsaWRcbiAgICAgICAgICogZGlyZWN0aW9uIHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpbnZlcnRUaWxlRGlyZWN0aW9uKGRpcmVjdGlvbjogXCJTb3V0aFwiKTogXCJOb3J0aFwiO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnZlcnRzIGEgZGlyZWN0aW9uIHN0cmluZywgZS5nLiBcIk5vcnRoXCIgLT4gXCJTb3V0aFwiXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBkaXJlY3Rpb24gLSB0aGUgZGlyZWN0aW9uIHN0cmluZyB0byBpbnZlcnRcbiAgICAgICAgICogQHJldHVybnMgdGhlIGRpcmVjdGlvbiBpbnZlcnRlZCxcbiAgICAgICAgICogZS5nLiBcIkVhc3RcIiAtPiBcIldlc3RcIiwgdW5kZWZpbmVkIGlmIHRoZSBkaXJlY3Rpb24gd2FzIG5vdCBhIHZhbGlkXG4gICAgICAgICAqIGRpcmVjdGlvbiBzdHJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgaW52ZXJ0VGlsZURpcmVjdGlvbihkaXJlY3Rpb246IFwiRWFzdFwiKTogXCJXZXN0XCI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludmVydHMgYSBkaXJlY3Rpb24gc3RyaW5nLCBlLmcuIFwiTm9ydGhcIiAtPiBcIlNvdXRoXCJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIHRoZSBkaXJlY3Rpb24gc3RyaW5nIHRvIGludmVydFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZGlyZWN0aW9uIGludmVydGVkLFxuICAgICAgICAgKiBlLmcuIFwiRWFzdFwiIC0+IFwiV2VzdFwiLCB1bmRlZmluZWQgaWYgdGhlIGRpcmVjdGlvbiB3YXMgbm90IGEgdmFsaWRcbiAgICAgICAgICogZGlyZWN0aW9uIHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpbnZlcnRUaWxlRGlyZWN0aW9uKGRpcmVjdGlvbjogXCJXZXN0XCIpOiBcIkVhc3RcIjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW52ZXJ0cyBhIGRpcmVjdGlvbiBzdHJpbmcsIGUuZy4gXCJOb3J0aFwiIC0+IFwiU291dGhcIlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIC0gdGhlIGRpcmVjdGlvbiBzdHJpbmcgdG8gaW52ZXJ0XG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBkaXJlY3Rpb24gaW52ZXJ0ZWQsXG4gICAgICAgICAqIGUuZy4gXCJFYXN0XCIgLT4gXCJXZXN0XCIsIHVuZGVmaW5lZCBpZiB0aGUgZGlyZWN0aW9uIHdhcyBub3QgYSB2YWxpZFxuICAgICAgICAgKiBkaXJlY3Rpb24gc3RyaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGludmVydFRpbGVEaXJlY3Rpb24oXG4gICAgICAgICAgICBkaXJlY3Rpb246IFwiTm9ydGhcIiB8IFwiRWFzdFwiIHwgXCJTb3V0aFwiIHwgXCJXZXN0XCIsXG4gICAgICAgICk6IFwiTm9ydGhcIiB8IFwiRWFzdFwiIHwgXCJTb3V0aFwiIHwgXCJXZXN0XCI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludmVydHMgYSBkaXJlY3Rpb24gc3RyaW5nLCBlLmcuIFwiTm9ydGhcIiAtPiBcIlNvdXRoXCJcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIHRoZSBkaXJlY3Rpb24gc3RyaW5nIHRvIGludmVydFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgZGlyZWN0aW9uIGludmVydGVkLFxuICAgICAgICAgKiBlLmcuIFwiRWFzdFwiIC0+IFwiV2VzdFwiLCB1bmRlZmluZWQgaWYgdGhlIGRpcmVjdGlvbiB3YXMgbm90IGEgdmFsaWRcbiAgICAgICAgICogZGlyZWN0aW9uIHN0cmluZy5cbiAgICAgICAgICovXG4gICAgICAgIHB1YmxpYyBpbnZlcnRUaWxlRGlyZWN0aW9uKFxuICAgICAgICAgICAgZGlyZWN0aW9uOiBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiLFxuICAgICAgICApOiBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIk5vcnRoXCI6IHJldHVybiBcIlNvdXRoXCI7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkVhc3RcIjogcmV0dXJuIFwiV2VzdFwiO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJTb3V0aFwiOiByZXR1cm4gXCJOb3J0aFwiO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJXZXN0XCI6IHJldHVybiBcIkVhc3RcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIC4uLmJhc2UsXG4gICAgICAgIEdhbWU6IFRpbGVkR2FtZSxcbiAgICAgICAgR2FtZVNldHRpbmdzOiBUaWxlZEdhbWVTZXR0aW5ncyxcbiAgICB9O1xufVxuIl19