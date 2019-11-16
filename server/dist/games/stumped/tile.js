"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiled_1 = require("~/core/game/mixins/tiled");
const game_object_1 = require("./game-object");
/**
 * A Tile in the game that makes up the 2D map grid.
 */
class Tile extends game_object_1.GameObject {
    // <<-- Creer-Merge: attributes -->>
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Tile is created.
     *
     * @param args - Initial value(s) to set member variables to.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(
    // never directly created by game developers
    args, required) {
        super(args, required);
        // <<-- Creer-Merge: constructor -->>
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Checks if a tile is in flow with another tile
     *
     * @param tile - the tile to check in flow with
     * @returns boolean if this tile is in flow with the provided tile
     */
    isInFlowDirection(tile) {
        return Boolean(tile &&
            this.flowDirection !== "" &&
            this.getNeighbor(this.flowDirection) === tile);
    }
    /**
     * Checks if a tile is in flow with another tile
     *
     * @param tile - the tile to check in flow with
     * @returns boolean if this tile is in flow with the provided tile
     */
    isAgainstFlowDirection(tile) {
        if (!tile.flowDirection) {
            return false;
        }
        return Boolean(tile &&
            this.getNeighbor(this.game.invertTileDirection(tile.flowDirection) || "") === tile);
    }
    /**
     * Gets the cost to move from this tile to another tile
     *
     * @param tile - other tile to check against
     * @returns  NaN if this Tile and the passed in ones are not neighbors and
     * thus can never have a bonus. 2 if flow direction does not matter, 1 if
     * same direction bonus, 3 if against direction bonus.
     */
    getMovementCost(tile) {
        if (this.hasNeighbor(tile)) {
            if (this.isInFlowDirection(tile)) {
                return 1; // same direction, bonus -1
            }
            else if (this.isAgainstFlowDirection(tile)) {
                return 3; // against direction, bonus +1
            }
            else {
                return 2; // neighbor with no flow, so no bonus +0
            }
        }
        return NaN;
    }
    // <<-- /Creer-Merge: public-functions -->>
    /**
     * Gets the adjacent direction between this Tile and an adjacent Tile
     * (if one exists).
     *
     * @param adjacentTile - A tile that should be adjacent to this Tile.
     * @returns "North", "East", "South", or "West" if the tile is adjacent to
     * this Tile in that direction. Otherwise undefined.
     */
    getAdjacentDirection(adjacentTile) {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.getAdjacentDirection.call(this, adjacentTile);
    }
    /**
     * Gets a list of all the neighbors of this Tile.
     *
     * @returns An array of all adjacent tiles. Should be between 2 to 4 tiles.
     */
    getNeighbors() {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.getNeighbors.call(this);
    }
    /**
     * Gets a neighbor in a particular direction
     *
     * @param direction - The direction you want, must be
     * "North", "East", "South", or "West".
     * @returns The Tile in that direction, or undefined if there is none.
     */
    getNeighbor(direction) {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.getNeighbor.call(this, direction);
    }
    /**
     * Checks if a Tile has another Tile as its neighbor.
     *
     * @param tile - The Tile to check.
     * @returns True if neighbor, false otherwise.
     */
    hasNeighbor(tile) {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.hasNeighbor.call(this, tile);
    }
    /**
     * toString override.
     *
     * @returns A string representation of the Tile.
     */
    toString() {
        // tslint:disable-next-line:no-unsafe-any
        return tiled_1.BaseTile.prototype.toString.call(this);
    }
}
exports.Tile = Tile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zdHVtcGVkL3RpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxvREFBb0Q7QUFHcEQsK0NBQTJDO0FBbUIzQzs7R0FFRztBQUNILE1BQWEsSUFBSyxTQUFRLHdCQUFVO0lBd0VoQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0g7SUFDSSw0Q0FBNEM7SUFDNUMsSUFBK0IsRUFDL0IsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDOzs7OztPQUtHO0lBQ0ksaUJBQWlCLENBQUMsSUFBVTtRQUMvQixPQUFPLE9BQU8sQ0FDVixJQUFJO1lBQ0osSUFBSSxDQUFDLGFBQWEsS0FBSyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksQ0FDaEQsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLHNCQUFzQixDQUFDLElBQVU7UUFDcEMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDckIsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxPQUFPLE9BQU8sQ0FDVixJQUFJO1lBQ0osSUFBSSxDQUFDLFdBQVcsQ0FDWixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQzFELEtBQUssSUFBSSxDQUNiLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLGVBQWUsQ0FBQyxJQUFVO1FBQzdCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDOUIsT0FBTyxDQUFDLENBQUMsQ0FBQywyQkFBMkI7YUFDeEM7aUJBQ0ksSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hDLE9BQU8sQ0FBQyxDQUFDLENBQUMsOEJBQThCO2FBQzNDO2lCQUNJO2dCQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsd0NBQXdDO2FBQ3JEO1NBQ0o7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCwyQ0FBMkM7SUFFM0M7Ozs7Ozs7T0FPRztJQUNJLG9CQUFvQixDQUN2QixZQUE4QjtRQUU5Qix5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksWUFBWTtRQUNmLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFXLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLFdBQVcsQ0FBQyxTQUE4QztRQUM3RCx5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQXFCLENBQUM7SUFDcEYsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLElBQXNCO1FBQ3JDLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksUUFBUTtRQUNYLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQU9KO0FBOU5ELG9CQThOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZVRpbGUgfSBmcm9tIFwifi9jb3JlL2dhbWUvbWl4aW5zL3RpbGVkXCI7XG5pbXBvcnQgeyBJVGlsZVByb3BlcnRpZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEJlYXZlciB9IGZyb20gXCIuL2JlYXZlclwiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFNwYXduZXIgfSBmcm9tIFwiLi9zcGF3bmVyXCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIFRoZSBjYXJkaW5hbCBkaXJlY3Rpb24gd2F0ZXIgaXMgZmxvd2luZyBvbiB0aGlzIFRpbGUgKCdOb3J0aCcsICdFYXN0JyxcbiAqICdTb3V0aCcsICdXZXN0JykuXG4gKi9cbmV4cG9ydCB0eXBlIFRpbGVGbG93RGlyZWN0aW9uID0gXCJOb3J0aFwiIHwgXCJFYXN0XCIgfCBcIlNvdXRoXCIgfCBcIldlc3RcIiB8IFwiXCI7XG5cbi8qKlxuICogV2hhdCB0eXBlIG9mIFRpbGUgdGhpcyBpcywgZWl0aGVyICd3YXRlcicgb3IgJ2xhbmQnLlxuICovXG5leHBvcnQgdHlwZSBUaWxlVHlwZSA9IFwibGFuZFwiIHwgXCJ3YXRlclwiO1xuXG4vKipcbiAqIEEgVGlsZSBpbiB0aGUgZ2FtZSB0aGF0IG1ha2VzIHVwIHRoZSAyRCBtYXAgZ3JpZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbGUgZXh0ZW5kcyBHYW1lT2JqZWN0IGltcGxlbWVudHMgQmFzZVRpbGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBCZWF2ZXIgb24gdGhpcyBUaWxlIGlmIHByZXNlbnQsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gICAgICovXG4gICAgcHVibGljIGJlYXZlcj86IEJlYXZlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgYnJhbmNoZXMgZHJvcHBlZCBvbiB0aGlzIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIGJyYW5jaGVzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNhcmRpbmFsIGRpcmVjdGlvbiB3YXRlciBpcyBmbG93aW5nIG9uIHRoaXMgVGlsZSAoJ05vcnRoJywgJ0Vhc3QnLFxuICAgICAqICdTb3V0aCcsICdXZXN0JykuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGZsb3dEaXJlY3Rpb24hOiBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiIHwgXCJcIjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgZm9vZCBkcm9wcGVkIG9uIHRoaXMgVGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9vZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBvd25lciBvZiB0aGUgQmVhdmVyIGxvZGdlIG9uIHRoaXMgVGlsZSwgaWYgcHJlc2VudCwgb3RoZXJ3aXNlXG4gICAgICogdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBsb2RnZU93bmVyPzogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlc291cmNlIFNwYXduZXIgb24gdGhpcyBUaWxlIGlmIHByZXNlbnQsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gICAgICovXG4gICAgcHVibGljIHNwYXduZXI/OiBTcGF3bmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdFYXN0JyBvZiB0aGlzIG9uZSAoeCsxLCB5KS4gVW5kZWZpbmVkIGlmIG91dCBvZiBib3VuZHNcbiAgICAgKiBvZiB0aGUgbWFwLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlRWFzdD86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0byB0aGUgJ05vcnRoJyBvZiB0aGlzIG9uZSAoeCwgeS0xKS4gVW5kZWZpbmVkIGlmIG91dCBvZiBib3VuZHNcbiAgICAgKiBvZiB0aGUgbWFwLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlTm9ydGg/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdTb3V0aCcgb2YgdGhpcyBvbmUgKHgsIHkrMSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVNvdXRoPzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnV2VzdCcgb2YgdGhpcyBvbmUgKHgtMSwgeSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVdlc3Q/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogV2hhdCB0eXBlIG9mIFRpbGUgdGhpcyBpcywgZWl0aGVyICd3YXRlcicgb3IgJ2xhbmQnLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0eXBlITogXCJsYW5kXCIgfCBcIndhdGVyXCI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCAoaG9yaXpvbnRhbCkgcG9zaXRpb24gb2YgdGhpcyBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB4ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHkgKHZlcnRpY2FsKSBwb3NpdGlvbiBvZiB0aGlzIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHkhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBUaWxlIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8vIG5ldmVyIGRpcmVjdGx5IGNyZWF0ZWQgYnkgZ2FtZSBkZXZlbG9wZXJzXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElUaWxlUHJvcGVydGllcz4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgdGlsZSBpcyBpbiBmbG93IHdpdGggYW5vdGhlciB0aWxlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGlsZSAtIHRoZSB0aWxlIHRvIGNoZWNrIGluIGZsb3cgd2l0aFxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gaWYgdGhpcyB0aWxlIGlzIGluIGZsb3cgd2l0aCB0aGUgcHJvdmlkZWQgdGlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc0luRmxvd0RpcmVjdGlvbih0aWxlOiBUaWxlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICAgICAgdGlsZSAmJlxuICAgICAgICAgICAgdGhpcy5mbG93RGlyZWN0aW9uICE9PSBcIlwiICYmXG4gICAgICAgICAgICB0aGlzLmdldE5laWdoYm9yKHRoaXMuZmxvd0RpcmVjdGlvbikgPT09IHRpbGUsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgdGlsZSBpcyBpbiBmbG93IHdpdGggYW5vdGhlciB0aWxlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGlsZSAtIHRoZSB0aWxlIHRvIGNoZWNrIGluIGZsb3cgd2l0aFxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gaWYgdGhpcyB0aWxlIGlzIGluIGZsb3cgd2l0aCB0aGUgcHJvdmlkZWQgdGlsZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc0FnYWluc3RGbG93RGlyZWN0aW9uKHRpbGU6IFRpbGUpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aWxlLmZsb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBCb29sZWFuKFxuICAgICAgICAgICAgdGlsZSAmJlxuICAgICAgICAgICAgdGhpcy5nZXROZWlnaGJvcihcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuaW52ZXJ0VGlsZURpcmVjdGlvbih0aWxlLmZsb3dEaXJlY3Rpb24pIHx8IFwiXCIsXG4gICAgICAgICAgICApID09PSB0aWxlLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvc3QgdG8gbW92ZSBmcm9tIHRoaXMgdGlsZSB0byBhbm90aGVyIHRpbGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWxlIC0gb3RoZXIgdGlsZSB0byBjaGVjayBhZ2FpbnN0XG4gICAgICogQHJldHVybnMgIE5hTiBpZiB0aGlzIFRpbGUgYW5kIHRoZSBwYXNzZWQgaW4gb25lcyBhcmUgbm90IG5laWdoYm9ycyBhbmRcbiAgICAgKiB0aHVzIGNhbiBuZXZlciBoYXZlIGEgYm9udXMuIDIgaWYgZmxvdyBkaXJlY3Rpb24gZG9lcyBub3QgbWF0dGVyLCAxIGlmXG4gICAgICogc2FtZSBkaXJlY3Rpb24gYm9udXMsIDMgaWYgYWdhaW5zdCBkaXJlY3Rpb24gYm9udXMuXG4gICAgICovXG4gICAgcHVibGljIGdldE1vdmVtZW50Q29zdCh0aWxlOiBUaWxlKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzTmVpZ2hib3IodGlsZSkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5GbG93RGlyZWN0aW9uKHRpbGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7IC8vIHNhbWUgZGlyZWN0aW9uLCBib251cyAtMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pc0FnYWluc3RGbG93RGlyZWN0aW9uKHRpbGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDM7IC8vIGFnYWluc3QgZGlyZWN0aW9uLCBib251cyArMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7IC8vIG5laWdoYm9yIHdpdGggbm8gZmxvdywgc28gbm8gYm9udXMgKzBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBOYU47XG4gICAgfVxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYWRqYWNlbnQgZGlyZWN0aW9uIGJldHdlZW4gdGhpcyBUaWxlIGFuZCBhbiBhZGphY2VudCBUaWxlXG4gICAgICogKGlmIG9uZSBleGlzdHMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFkamFjZW50VGlsZSAtIEEgdGlsZSB0aGF0IHNob3VsZCBiZSBhZGphY2VudCB0byB0aGlzIFRpbGUuXG4gICAgICogQHJldHVybnMgXCJOb3J0aFwiLCBcIkVhc3RcIiwgXCJTb3V0aFwiLCBvciBcIldlc3RcIiBpZiB0aGUgdGlsZSBpcyBhZGphY2VudCB0b1xuICAgICAqIHRoaXMgVGlsZSBpbiB0aGF0IGRpcmVjdGlvbi4gT3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QWRqYWNlbnREaXJlY3Rpb24oXG4gICAgICAgIGFkamFjZW50VGlsZTogVGlsZSB8IHVuZGVmaW5lZCxcbiAgICApOiBcIk5vcnRoXCIgfCBcIlNvdXRoXCIgfCBcIkVhc3RcIiB8IFwiV2VzdFwiIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5nZXRBZGphY2VudERpcmVjdGlvbi5jYWxsKHRoaXMsIGFkamFjZW50VGlsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIHRoZSBuZWlnaGJvcnMgb2YgdGhpcyBUaWxlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgYWxsIGFkamFjZW50IHRpbGVzLiBTaG91bGQgYmUgYmV0d2VlbiAyIHRvIDQgdGlsZXMuXG4gICAgICovXG4gICAgcHVibGljIGdldE5laWdoYm9ycygpOiBUaWxlW10ge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLmdldE5laWdoYm9ycy5jYWxsKHRoaXMpIGFzIFRpbGVbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbmVpZ2hib3IgaW4gYSBwYXJ0aWN1bGFyIGRpcmVjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIFRoZSBkaXJlY3Rpb24geW91IHdhbnQsIG11c3QgYmVcbiAgICAgKiBcIk5vcnRoXCIsIFwiRWFzdFwiLCBcIlNvdXRoXCIsIG9yIFwiV2VzdFwiLlxuICAgICAqIEByZXR1cm5zIFRoZSBUaWxlIGluIHRoYXQgZGlyZWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm9uZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TmVpZ2hib3IoZGlyZWN0aW9uOiBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiKTogVGlsZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3IuY2FsbCh0aGlzLCBkaXJlY3Rpb24pIGFzIFRpbGUgfCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgVGlsZSBoYXMgYW5vdGhlciBUaWxlIGFzIGl0cyBuZWlnaGJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBuZWlnaGJvciwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNOZWlnaGJvcih0aWxlOiBUaWxlIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuaGFzTmVpZ2hib3IuY2FsbCh0aGlzLCB0aWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b1N0cmluZyBvdmVycmlkZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19