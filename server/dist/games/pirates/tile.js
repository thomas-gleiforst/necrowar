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
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9waXJhdGVzL3RpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxvREFBb0Q7QUFFcEQsK0NBQTJDO0FBYTNDOztHQUVHO0FBQ0gsTUFBYSxJQUFLLFNBQVEsd0JBQVU7SUE2RGhDLG9DQUFvQztJQUVwQywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSDtJQUNJLDRDQUE0QztJQUM1QyxJQUErQixFQUMvQixRQUErQztRQUUvQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRCLHFDQUFxQztRQUNyQyxnQ0FBZ0M7UUFDaEMsc0NBQXNDO0lBQzFDLENBQUM7SUFFRCwwQ0FBMEM7SUFFMUMsd0VBQXdFO0lBQ3hFLHNFQUFzRTtJQUN0RSxxQkFBcUI7SUFFckIsMkNBQTJDO0lBRTNDOzs7Ozs7O09BT0c7SUFDSSxvQkFBb0IsQ0FDdkIsWUFBOEI7UUFFOUIseUNBQXlDO1FBQ3pDLE9BQU8sZ0JBQVEsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFlBQVk7UUFDZix5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBVyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxXQUFXLENBQUMsU0FBOEM7UUFDN0QseUNBQXlDO1FBQ3pDLE9BQU8sZ0JBQVEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFxQixDQUFDO0lBQ3BGLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLFdBQVcsQ0FBQyxJQUFzQjtRQUNyQyx5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFFBQVE7UUFDWCx5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7Q0FPSjtBQTlKRCxvQkE4SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJhc2VUaWxlIH0gZnJvbSBcIn4vY29yZS9nYW1lL21peGlucy90aWxlZFwiO1xuaW1wb3J0IHsgSVRpbGVQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IFBvcnQgfSBmcm9tIFwiLi9wb3J0XCI7XG5pbXBvcnQgeyBVbml0IH0gZnJvbSBcIi4vdW5pdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBUaWxlIHRoaXMgaXMgKCd3YXRlcicgb3IgJ2xhbmQnKS5cbiAqL1xuZXhwb3J0IHR5cGUgVGlsZVR5cGUgPSBcIndhdGVyXCIgfCBcImxhbmRcIjtcblxuLyoqXG4gKiBBIFRpbGUgaW4gdGhlIGdhbWUgdGhhdCBtYWtlcyB1cCB0aGUgMkQgbWFwIGdyaWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlIGV4dGVuZHMgR2FtZU9iamVjdCBpbXBsZW1lbnRzIEJhc2VUaWxlIHtcbiAgICAvKipcbiAgICAgKiAoVmlzdWFsaXplciBvbmx5KSBXaGV0aGVyIHRoaXMgdGlsZSBpcyBkZWVwIHNlYSBvciBncmFzc3kuIFRoaXMgaGFzIG5vXG4gICAgICogZWZmZWN0IG9uIGdhbWVwbGF5LCBidXQgZmVlbCBmcmVlIHRvIHVzZSBpdCBpZiB5b3Ugd2FudC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZGVjb3JhdGlvbiE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYW1vdW50IG9mIGdvbGQgYnVyaWVkIG9uIHRoaXMgdGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ29sZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBQb3J0IG9uIHRoaXMgVGlsZSBpZiBwcmVzZW50LCBvdGhlcndpc2UgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBwb3J0PzogUG9ydDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnRWFzdCcgb2YgdGhpcyBvbmUgKHgrMSwgeSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZUVhc3Q/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdOb3J0aCcgb2YgdGhpcyBvbmUgKHgsIHktMSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZU5vcnRoPzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnU291dGgnIG9mIHRoaXMgb25lICh4LCB5KzEpLiBVbmRlZmluZWQgaWYgb3V0IG9mIGJvdW5kc1xuICAgICAqIG9mIHRoZSBtYXAuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbGVTb3V0aD86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0byB0aGUgJ1dlc3QnIG9mIHRoaXMgb25lICh4LTEsIHkpLiBVbmRlZmluZWQgaWYgb3V0IG9mIGJvdW5kc1xuICAgICAqIG9mIHRoZSBtYXAuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbGVXZXN0PzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB0eXBlIG9mIFRpbGUgdGhpcyBpcyAoJ3dhdGVyJyBvciAnbGFuZCcpLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0eXBlITogXCJ3YXRlclwiIHwgXCJsYW5kXCI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVW5pdCBvbiB0aGlzIFRpbGUgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5pdD86IFVuaXQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCAoaG9yaXpvbnRhbCkgcG9zaXRpb24gb2YgdGhpcyBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB4ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHkgKHZlcnRpY2FsKSBwb3NpdGlvbiBvZiB0aGlzIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHkhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBUaWxlIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8vIG5ldmVyIGRpcmVjdGx5IGNyZWF0ZWQgYnkgZ2FtZSBkZXZlbG9wZXJzXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElUaWxlUHJvcGVydGllcz4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYWRqYWNlbnQgZGlyZWN0aW9uIGJldHdlZW4gdGhpcyBUaWxlIGFuZCBhbiBhZGphY2VudCBUaWxlXG4gICAgICogKGlmIG9uZSBleGlzdHMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFkamFjZW50VGlsZSAtIEEgdGlsZSB0aGF0IHNob3VsZCBiZSBhZGphY2VudCB0byB0aGlzIFRpbGUuXG4gICAgICogQHJldHVybnMgXCJOb3J0aFwiLCBcIkVhc3RcIiwgXCJTb3V0aFwiLCBvciBcIldlc3RcIiBpZiB0aGUgdGlsZSBpcyBhZGphY2VudCB0b1xuICAgICAqIHRoaXMgVGlsZSBpbiB0aGF0IGRpcmVjdGlvbi4gT3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QWRqYWNlbnREaXJlY3Rpb24oXG4gICAgICAgIGFkamFjZW50VGlsZTogVGlsZSB8IHVuZGVmaW5lZCxcbiAgICApOiBcIk5vcnRoXCIgfCBcIlNvdXRoXCIgfCBcIkVhc3RcIiB8IFwiV2VzdFwiIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5nZXRBZGphY2VudERpcmVjdGlvbi5jYWxsKHRoaXMsIGFkamFjZW50VGlsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIHRoZSBuZWlnaGJvcnMgb2YgdGhpcyBUaWxlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgYWxsIGFkamFjZW50IHRpbGVzLiBTaG91bGQgYmUgYmV0d2VlbiAyIHRvIDQgdGlsZXMuXG4gICAgICovXG4gICAgcHVibGljIGdldE5laWdoYm9ycygpOiBUaWxlW10ge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLmdldE5laWdoYm9ycy5jYWxsKHRoaXMpIGFzIFRpbGVbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbmVpZ2hib3IgaW4gYSBwYXJ0aWN1bGFyIGRpcmVjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIFRoZSBkaXJlY3Rpb24geW91IHdhbnQsIG11c3QgYmVcbiAgICAgKiBcIk5vcnRoXCIsIFwiRWFzdFwiLCBcIlNvdXRoXCIsIG9yIFwiV2VzdFwiLlxuICAgICAqIEByZXR1cm5zIFRoZSBUaWxlIGluIHRoYXQgZGlyZWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm9uZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TmVpZ2hib3IoZGlyZWN0aW9uOiBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiKTogVGlsZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3IuY2FsbCh0aGlzLCBkaXJlY3Rpb24pIGFzIFRpbGUgfCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgVGlsZSBoYXMgYW5vdGhlciBUaWxlIGFzIGl0cyBuZWlnaGJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBuZWlnaGJvciwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNOZWlnaGJvcih0aWxlOiBUaWxlIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuaGFzTmVpZ2hib3IuY2FsbCh0aGlzLCB0aWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b1N0cmluZyBvdmVycmlkZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19