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
    // <<-- Creer-Merge: protected-private-functions -->>
    /**
     * Checks if this tile would cause a Bottle moving to it to break
     *
     * @return True if bottle break on this tile, false otherwise
     */
    isPathableToBottles() {
        return Boolean(!this.isBalcony && !this.furnishing && !this.cowboy);
    }
}
exports.Tile = Tile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zYWxvb24vdGlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG9EQUFvRDtBQUtwRCwrQ0FBMkM7QUFHM0MsaUNBQWlDO0FBQ2pDLCtFQUErRTtBQUMvRSxrQ0FBa0M7QUFFbEM7O0dBRUc7QUFDSCxNQUFhLElBQUssU0FBUSx3QkFBVTtJQW1FaEMsb0NBQW9DO0lBRXBDLCtDQUErQztJQUMvQyxnRUFBZ0U7SUFDaEUscUJBQXFCO0lBRXJCLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNIO0lBQ0ksNENBQTRDO0lBQzVDLElBQStCLEVBQy9CLFFBQStDO1FBRS9DLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFdEIscUNBQXFDO1FBQ3JDLGdDQUFnQztRQUNoQyxzQ0FBc0M7SUFDMUMsQ0FBQztJQUVELDBDQUEwQztJQUUxQyx3RUFBd0U7SUFDeEUsc0VBQXNFO0lBQ3RFLHFCQUFxQjtJQUVyQiwyQ0FBMkM7SUFFM0M7Ozs7Ozs7T0FPRztJQUNJLG9CQUFvQixDQUN2QixZQUE4QjtRQUU5Qix5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksWUFBWTtRQUNmLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFXLENBQUM7SUFDaEUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLFdBQVcsQ0FBQyxTQUE4QztRQUM3RCx5Q0FBeUM7UUFDekMsT0FBTyxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQXFCLENBQUM7SUFDcEYsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksV0FBVyxDQUFDLElBQXNCO1FBQ3JDLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksUUFBUTtRQUNYLHlDQUF5QztRQUN6QyxPQUFPLGdCQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHFEQUFxRDtJQUVyRDs7OztPQUlHO0lBQ0ksbUJBQW1CO1FBQ3RCLE9BQU8sT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEUsQ0FBQztDQUdKO0FBM0tELG9CQTJLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgQmFzZVRpbGUgfSBmcm9tIFwifi9jb3JlL2dhbWUvbWl4aW5zL3RpbGVkXCI7XG5pbXBvcnQgeyBJVGlsZVByb3BlcnRpZXMgfSBmcm9tIFwiLi9cIjtcbmltcG9ydCB7IEJvdHRsZSB9IGZyb20gXCIuL2JvdHRsZVwiO1xuaW1wb3J0IHsgQ293Ym95IH0gZnJvbSBcIi4vY293Ym95XCI7XG5pbXBvcnQgeyBGdXJuaXNoaW5nIH0gZnJvbSBcIi4vZnVybmlzaGluZ1wiO1xuaW1wb3J0IHsgR2FtZU9iamVjdCB9IGZyb20gXCIuL2dhbWUtb2JqZWN0XCI7XG5pbXBvcnQgeyBZb3VuZ0d1biB9IGZyb20gXCIuL3lvdW5nLWd1blwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBBIFRpbGUgaW4gdGhlIGdhbWUgdGhhdCBtYWtlcyB1cCB0aGUgMkQgbWFwIGdyaWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaWxlIGV4dGVuZHMgR2FtZU9iamVjdCBpbXBsZW1lbnRzIEJhc2VUaWxlIHtcbiAgICAvKipcbiAgICAgKiBUaGUgYmVlciBCb3R0bGUgY3VycmVudGx5IGZseWluZyBvdmVyIHRoaXMgVGlsZSwgdW5kZWZpbmVkIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgYm90dGxlPzogQm90dGxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIENvd2JveSB0aGF0IGlzIG9uIHRoaXMgVGlsZSwgdW5kZWZpbmVkIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgY293Ym95PzogQ293Ym95O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGZ1cm5pc2hpbmcgdGhhdCBpcyBvbiB0aGlzIFRpbGUsIHVuZGVmaW5lZCBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGZ1cm5pc2hpbmc/OiBGdXJuaXNoaW5nO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhpcyBUaWxlIGlzIHBhdGhhYmxlLCBidXQgaGFzIGEgaGF6YXJkIHRoYXQgZGFtYWdlcyBDb3dib3lzIHRoYXRcbiAgICAgKiBwYXRoIHRocm91Z2ggaXQuXG4gICAgICovXG4gICAgcHVibGljIGhhc0hhemFyZCE6IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGlzIFRpbGUgaXMgYSBiYWxjb255IG9mIHRoZSBTYWxvb24gdGhhdCBZb3VuZ0d1bnMgd2FsayBhcm91bmQgb24sXG4gICAgICogYW5kIGNhbiBuZXZlciBiZSBwYXRoZWQgdGhyb3VnaCBieSBDb3dib3lzLlxuICAgICAqL1xuICAgIHB1YmxpYyBpc0JhbGNvbnkhOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdFYXN0JyBvZiB0aGlzIG9uZSAoeCsxLCB5KS4gVW5kZWZpbmVkIGlmIG91dCBvZiBib3VuZHNcbiAgICAgKiBvZiB0aGUgbWFwLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlRWFzdD86IFRpbGU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgVGlsZSB0byB0aGUgJ05vcnRoJyBvZiB0aGlzIG9uZSAoeCwgeS0xKS4gVW5kZWZpbmVkIGlmIG91dCBvZiBib3VuZHNcbiAgICAgKiBvZiB0aGUgbWFwLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aWxlTm9ydGg/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFRpbGUgdG8gdGhlICdTb3V0aCcgb2YgdGhpcyBvbmUgKHgsIHkrMSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVNvdXRoPzogVGlsZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBUaWxlIHRvIHRoZSAnV2VzdCcgb2YgdGhpcyBvbmUgKHgtMSwgeSkuIFVuZGVmaW5lZCBpZiBvdXQgb2YgYm91bmRzXG4gICAgICogb2YgdGhlIG1hcC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgdGlsZVdlc3Q/OiBUaWxlO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHggKGhvcml6b250YWwpIHBvc2l0aW9uIG9mIHRoaXMgVGlsZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgeCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSB5ICh2ZXJ0aWNhbCkgcG9zaXRpb24gb2YgdGhpcyBUaWxlLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB5ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIFlvdW5nR3VuIG9uIHRoaXMgdGlsZSwgdW5kZWZpbmVkIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgeW91bmdHdW4/OiBZb3VuZ0d1bjtcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLy8gQW55IGFkZGl0aW9uYWwgbWVtYmVyIGF0dHJpYnV0ZXMgY2FuIGdvIGhlcmVcbiAgICAvLyBOT1RFOiBUaGV5IHdpbGwgbm90IGJlIHNlbnQgdG8gdGhlIEFJcywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIFRpbGUgaXMgY3JlYXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzIC0gSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgbWVtYmVyIHZhcmlhYmxlcyB0by5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgLy8gbmV2ZXIgZGlyZWN0bHkgY3JlYXRlZCBieSBnYW1lIGRldmVsb3BlcnNcbiAgICAgICAgYXJnczogUmVhZG9ubHk8SVRpbGVQcm9wZXJ0aWVzPixcbiAgICAgICAgcmVxdWlyZWQ6IFJlYWRvbmx5PElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YT4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGFyZ3MsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvLyBBbnkgcHVibGljIGZ1bmN0aW9ucyBjYW4gZ28gaGVyZSBmb3Igb3RoZXIgdGhpbmdzIGluIHRoZSBnYW1lIHRvIHVzZS5cbiAgICAvLyBOT1RFOiBDbGllbnQgQUlzIGNhbm5vdCBjYWxsIHRoZXNlIGZ1bmN0aW9ucywgdGhvc2UgbXVzdCBiZSBkZWZpbmVkXG4gICAgLy8gaW4gdGhlIGNyZWVyIGZpbGUuXG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBhZGphY2VudCBkaXJlY3Rpb24gYmV0d2VlbiB0aGlzIFRpbGUgYW5kIGFuIGFkamFjZW50IFRpbGVcbiAgICAgKiAoaWYgb25lIGV4aXN0cykuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWRqYWNlbnRUaWxlIC0gQSB0aWxlIHRoYXQgc2hvdWxkIGJlIGFkamFjZW50IHRvIHRoaXMgVGlsZS5cbiAgICAgKiBAcmV0dXJucyBcIk5vcnRoXCIsIFwiRWFzdFwiLCBcIlNvdXRoXCIsIG9yIFwiV2VzdFwiIGlmIHRoZSB0aWxlIGlzIGFkamFjZW50IHRvXG4gICAgICogdGhpcyBUaWxlIGluIHRoYXQgZGlyZWN0aW9uLiBPdGhlcndpc2UgdW5kZWZpbmVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBZGphY2VudERpcmVjdGlvbihcbiAgICAgICAgYWRqYWNlbnRUaWxlOiBUaWxlIHwgdW5kZWZpbmVkLFxuICAgICk6IFwiTm9ydGhcIiB8IFwiU291dGhcIiB8IFwiRWFzdFwiIHwgXCJXZXN0XCIgfCB1bmRlZmluZWQge1xuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICByZXR1cm4gQmFzZVRpbGUucHJvdG90eXBlLmdldEFkamFjZW50RGlyZWN0aW9uLmNhbGwodGhpcywgYWRqYWNlbnRUaWxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbGlzdCBvZiBhbGwgdGhlIG5laWdoYm9ycyBvZiB0aGlzIFRpbGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBbiBhcnJheSBvZiBhbGwgYWRqYWNlbnQgdGlsZXMuIFNob3VsZCBiZSBiZXR3ZWVuIDIgdG8gNCB0aWxlcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0TmVpZ2hib3JzKCk6IFRpbGVbXSB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUuZ2V0TmVpZ2hib3JzLmNhbGwodGhpcykgYXMgVGlsZVtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBuZWlnaGJvciBpbiBhIHBhcnRpY3VsYXIgZGlyZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlyZWN0aW9uIC0gVGhlIGRpcmVjdGlvbiB5b3Ugd2FudCwgbXVzdCBiZVxuICAgICAqIFwiTm9ydGhcIiwgXCJFYXN0XCIsIFwiU291dGhcIiwgb3IgXCJXZXN0XCIuXG4gICAgICogQHJldHVybnMgVGhlIFRpbGUgaW4gdGhhdCBkaXJlY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBpcyBub25lLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXROZWlnaGJvcihkaXJlY3Rpb246IFwiTm9ydGhcIiB8IFwiRWFzdFwiIHwgXCJTb3V0aFwiIHwgXCJXZXN0XCIpOiBUaWxlIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5nZXROZWlnaGJvci5jYWxsKHRoaXMsIGRpcmVjdGlvbikgYXMgVGlsZSB8IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgYSBUaWxlIGhhcyBhbm90aGVyIFRpbGUgYXMgaXRzIG5laWdoYm9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRpbGUgLSBUaGUgVGlsZSB0byBjaGVjay5cbiAgICAgKiBAcmV0dXJucyBUcnVlIGlmIG5laWdoYm9yLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHVibGljIGhhc05laWdoYm9yKHRpbGU6IFRpbGUgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgcmV0dXJuIEJhc2VUaWxlLnByb3RvdHlwZS5oYXNOZWlnaGJvci5jYWxsKHRoaXMsIHRpbGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRvU3RyaW5nIG92ZXJyaWRlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIFRpbGUuXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby11bnNhZmUtYW55XG4gICAgICAgIHJldHVybiBCYXNlVGlsZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoaXMgdGlsZSB3b3VsZCBjYXVzZSBhIEJvdHRsZSBtb3ZpbmcgdG8gaXQgdG8gYnJlYWtcbiAgICAgKlxuICAgICAqIEByZXR1cm4gVHJ1ZSBpZiBib3R0bGUgYnJlYWsgb24gdGhpcyB0aWxlLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNQYXRoYWJsZVRvQm90dGxlcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oIXRoaXMuaXNCYWxjb255ICYmICF0aGlzLmZ1cm5pc2hpbmcgJiYgIXRoaXMuY293Ym95KTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbn1cbiJdfQ==