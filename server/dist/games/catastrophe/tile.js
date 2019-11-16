"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tiled_1 = require("~/core/game/mixins/tiled");
const game_object_1 = require("./game-object");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jYXRhc3Ryb3BoZS90aWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esb0RBQW9EO0FBRXBELCtDQUEyQztBQUkzQyxpQ0FBaUM7QUFDakMsK0VBQStFO0FBQy9FLGtDQUFrQztBQUVsQzs7R0FFRztBQUNILE1BQWEsSUFBSyxTQUFRLHdCQUFVO0lBaUVoQyxvQ0FBb0M7SUFFcEMsK0NBQStDO0lBQy9DLGdFQUFnRTtJQUNoRSxxQkFBcUI7SUFFckIscUNBQXFDO0lBRXJDOzs7OztPQUtHO0lBQ0g7SUFDSSw0Q0FBNEM7SUFDNUMsSUFBK0IsRUFDL0IsUUFBK0M7UUFFL0MsS0FBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV0QixxQ0FBcUM7UUFDckMsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDLHdFQUF3RTtJQUN4RSxzRUFBc0U7SUFDdEUscUJBQXFCO0lBRXJCLDJDQUEyQztJQUUzQzs7Ozs7OztPQU9HO0lBQ0ksb0JBQW9CLENBQ3ZCLFlBQThCO1FBRTlCLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxZQUFZO1FBQ2YseUNBQXlDO1FBQ3pDLE9BQU8sZ0JBQVEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQVcsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksV0FBVyxDQUFDLFNBQThDO1FBQzdELHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBcUIsQ0FBQztJQUNwRixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxXQUFXLENBQUMsSUFBc0I7UUFDckMseUNBQXlDO1FBQ3pDLE9BQU8sZ0JBQVEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxRQUFRO1FBQ1gseUNBQXlDO1FBQ3pDLE9BQU8sZ0JBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0NBT0o7QUFsS0Qsb0JBa0tDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBCYXNlVGlsZSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9taXhpbnMvdGlsZWRcIjtcbmltcG9ydCB7IElUaWxlUHJvcGVydGllcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBTdHJ1Y3R1cmUgfSBmcm9tIFwiLi9zdHJ1Y3R1cmVcIjtcbmltcG9ydCB7IFVuaXQgfSBmcm9tIFwiLi91bml0XCI7XG5cbi8vIDw8LS0gQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuLy8gYW55IGFkZGl0aW9uYWwgaW1wb3J0cyB5b3Ugd2FudCBjYW4gYmUgcGxhY2VkIGhlcmUgc2FmZWx5IGJldHdlZW4gY3JlZXIgcnVuc1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIEEgVGlsZSBpbiB0aGUgZ2FtZSB0aGF0IG1ha2VzIHVwIHRoZSAyRCBtYXAgZ3JpZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFRpbGUgZXh0ZW5kcyBHYW1lT2JqZWN0IGltcGxlbWVudHMgQmFzZVRpbGUge1xuICAgIC8qKlxuICAgICAqIFRoZSBudW1iZXIgb2YgZm9vZCBkcm9wcGVkIG9uIHRoaXMgVGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZm9vZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZm9vZCB0aGF0IGNhbiBiZSBoYXJ2ZXN0ZWQgZnJvbSB0aGlzIFRpbGUgcGVyIHR1cm4uXG4gICAgICovXG4gICAgcHVibGljIGhhcnZlc3RSYXRlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBtYXRlcmlhbHMgZHJvcHBlZCBvbiB0aGlzIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIG1hdGVyaWFscyE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBTdHJ1Y3R1cmUgb24gdGhpcyBUaWxlIGlmIHByZXNlbnQsIG90aGVyd2lzZSB1bmRlZmluZWQuXG4gICAgICovXG4gICAgcHVibGljIHN0cnVjdHVyZT86IFN0cnVjdHVyZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnRWFzdCcgb2YgdGhpcyBvbmUgKHgrMSwgeSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZUVhc3Q/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdOb3J0aCcgb2YgdGhpcyBvbmUgKHgsIHktMSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZU5vcnRoPzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnU291dGgnIG9mIHRoaXMgb25lICh4LCB5KzEpLiBVbmRlZmluZWQgaWYgb3V0IG9mIGJvdW5kc1xuICAgICAqIG9mIHRoZSBtYXAuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbGVTb3V0aD86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0byB0aGUgJ1dlc3QnIG9mIHRoaXMgb25lICh4LTEsIHkpLiBVbmRlZmluZWQgaWYgb3V0IG9mIGJvdW5kc1xuICAgICAqIG9mIHRoZSBtYXAuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHRpbGVXZXN0PzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgdHVybnMgYmVmb3JlIHRoaXMgcmVzb3VyY2UgY2FuIGJlIGhhcnZlc3RlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgdHVybnNUb0hhcnZlc3QhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVW5pdCBvbiB0aGlzIFRpbGUgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgdW5pdD86IFVuaXQ7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgeCAoaG9yaXpvbnRhbCkgcG9zaXRpb24gb2YgdGhpcyBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB4ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHkgKHZlcnRpY2FsKSBwb3NpdGlvbiBvZiB0aGlzIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHkhOiBudW1iZXI7XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIG1lbWJlciBhdHRyaWJ1dGVzIGNhbiBnbyBoZXJlXG4gICAgLy8gTk9URTogVGhleSB3aWxsIG5vdCBiZSBzZW50IHRvIHRoZSBBSXMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBUaWxlIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJncyAtIEluaXRpYWwgdmFsdWUocykgdG8gc2V0IG1lbWJlciB2YXJpYWJsZXMgdG8uXG4gICAgICogQHBhcmFtIHJlcXVpcmVkIC0gRGF0YSByZXF1aXJlZCB0byBpbml0aWFsaXplIHRoaXMgKGlnbm9yZSBpdCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8vIG5ldmVyIGRpcmVjdGx5IGNyZWF0ZWQgYnkgZ2FtZSBkZXZlbG9wZXJzXG4gICAgICAgIGFyZ3M6IFJlYWRvbmx5PElUaWxlUHJvcGVydGllcz4sXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVPYmplY3RSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihhcmdzLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICAvLyBzZXR1cCBhbnkgdGhpbmcgeW91IG5lZWQgaGVyZVxuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgYWRqYWNlbnQgZGlyZWN0aW9uIGJldHdlZW4gdGhpcyBUaWxlIGFuZCBhbiBhZGphY2VudCBUaWxlXG4gICAgICogKGlmIG9uZSBleGlzdHMpLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFkamFjZW50VGlsZSAtIEEgdGlsZSB0aGF0IHNob3VsZCBiZSBhZGphY2VudCB0byB0aGlzIFRpbGUuXG4gICAgICogQHJldHVybnMgXCJOb3J0aFwiLCBcIkVhc3RcIiwgXCJTb3V0aFwiLCBvciBcIldlc3RcIiBpZiB0aGUgdGlsZSBpcyBhZGphY2VudCB0b1xuICAgICAqIHRoaXMgVGlsZSBpbiB0aGF0IGRpcmVjdGlvbi4gT3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0QWRqYWNlbnREaXJlY3Rpb24oXG4gICAgICAgIGFkamFjZW50VGlsZTogVGlsZSB8IHVuZGVmaW5lZCxcbiAgICApOiBcIk5vcnRoXCIgfCBcIlNvdXRoXCIgfCBcIkVhc3RcIiB8IFwiV2VzdFwiIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5nZXRBZGphY2VudERpcmVjdGlvbi5jYWxsKHRoaXMsIGFkamFjZW50VGlsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIHRoZSBuZWlnaGJvcnMgb2YgdGhpcyBUaWxlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgYWxsIGFkamFjZW50IHRpbGVzLiBTaG91bGQgYmUgYmV0d2VlbiAyIHRvIDQgdGlsZXMuXG4gICAgICovXG4gICAgcHVibGljIGdldE5laWdoYm9ycygpOiBUaWxlW10ge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLmdldE5laWdoYm9ycy5jYWxsKHRoaXMpIGFzIFRpbGVbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbmVpZ2hib3IgaW4gYSBwYXJ0aWN1bGFyIGRpcmVjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIGRpcmVjdGlvbiAtIFRoZSBkaXJlY3Rpb24geW91IHdhbnQsIG11c3QgYmVcbiAgICAgKiBcIk5vcnRoXCIsIFwiRWFzdFwiLCBcIlNvdXRoXCIsIG9yIFwiV2VzdFwiLlxuICAgICAqIEByZXR1cm5zIFRoZSBUaWxlIGluIHRoYXQgZGlyZWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgaXMgbm9uZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TmVpZ2hib3IoZGlyZWN0aW9uOiBcIk5vcnRoXCIgfCBcIkVhc3RcIiB8IFwiU291dGhcIiB8IFwiV2VzdFwiKTogVGlsZSB8IHVuZGVmaW5lZCB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3IuY2FsbCh0aGlzLCBkaXJlY3Rpb24pIGFzIFRpbGUgfCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIGEgVGlsZSBoYXMgYW5vdGhlciBUaWxlIGFzIGl0cyBuZWlnaGJvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0aWxlIC0gVGhlIFRpbGUgdG8gY2hlY2suXG4gICAgICogQHJldHVybnMgVHJ1ZSBpZiBuZWlnaGJvciwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIHB1YmxpYyBoYXNOZWlnaGJvcih0aWxlOiBUaWxlIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuaGFzTmVpZ2hib3IuY2FsbCh0aGlzLCB0aWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0b1N0cmluZyBvdmVycmlkZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19