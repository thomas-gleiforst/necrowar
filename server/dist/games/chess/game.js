"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const chessjs = require("chess.js");
// <<-- /Creer-Merge: imports -->>
/**
 * The traditional 8x8 chess board with pieces.
 */
class ChessGame extends _1.BaseClasses.Game {
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
        /** The chess.js instance used to do all logic. */
        this.chess = new chessjs.Chess();
        // <<-- Creer-Merge: constructor -->>
        if (this.settings.fen) {
            this.chess.load(this.settings.fen);
        }
        else if (this.settings.pgn) {
            this.chess.load_pgn(this.settings.pgn);
        }
        this.players[0].color = "white";
        this.players[1].color = "black";
        this.fen = this.chess.fen();
        this.history.push(...this.chess.history());
        // <<-- /Creer-Merge: constructor -->>
    }
}
exports.ChessGame = ChessGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jaGVzcy9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUJBQWlDO0FBTWpDLGlDQUFpQztBQUNqQyxvQ0FBb0M7QUFLcEMsa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsY0FBVyxDQUFDLElBQUk7SUEwQzNDLHFDQUFxQztJQUVyQzs7Ozs7T0FLRztJQUNILFlBQ2MsZUFBeUMsRUFDbkQsUUFBeUM7UUFFekMsS0FBSyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUh2QixvQkFBZSxHQUFmLGVBQWUsQ0FBMEI7UUEvQ3ZELGtFQUFrRTtRQUNsRCxhQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBZ0N0RSxvQ0FBb0M7UUFFcEMsa0RBQWtEO1FBQ2xDLFVBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQWdCeEMscUNBQXFDO1FBQ3JDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QzthQUNJLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMxQztRQUVBLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFtQixDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQW1CLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUVuRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDM0Msc0NBQXNDO0lBQzFDLENBQUM7Q0FlSjtBQXJGRCw4QkFxRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQmFzZUdhbWVSZXF1aXJlZERhdGEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IEJhc2VDbGFzc2VzIH0gZnJvbSBcIi4vXCI7XG5pbXBvcnQgeyBDaGVzc0dhbWVNYW5hZ2VyIH0gZnJvbSBcIi4vZ2FtZS1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBHYW1lT2JqZWN0IH0gZnJvbSBcIi4vZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IENoZXNzR2FtZVNldHRpbmdzTWFuYWdlciB9IGZyb20gXCIuL2dhbWUtc2V0dGluZ3NcIjtcbmltcG9ydCB7IFBsYXllciB9IGZyb20gXCIuL3BsYXllclwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCAqIGFzIGNoZXNzanMgZnJvbSBcImNoZXNzLmpzXCI7XG5pbXBvcnQgeyBNdXRhYmxlIH0gZnJvbSBcIn4vdXRpbHNcIjtcblxuLyoqIEEgcGxheWVyIHRoYXQgY2FuIGJlIG11dGF0ZWQgQkVGT1JFIHRoZSBnYW1lIHN0YXJ0cyAqL1xudHlwZSBNdXRhYmxlUGxheWVyID0gTXV0YWJsZTxQbGF5ZXI+O1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIFRoZSB0cmFkaXRpb25hbCA4eDggY2hlc3MgYm9hcmQgd2l0aCBwaWVjZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGVzc0dhbWUgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lIHtcbiAgICAvKiogVGhlIG1hbmFnZXIgb2YgdGhpcyBnYW1lLCB0aGF0IGNvbnRyb2xzIGV2ZXJ5dGhpbmcgYXJvdW5kIGl0ICovXG4gICAgcHVibGljIHJlYWRvbmx5IG1hbmFnZXIhOiBDaGVzc0dhbWVNYW5hZ2VyO1xuXG4gICAgLyoqIFRoZSBzZXR0aW5ncyB1c2VkIHRvIGluaXRpYWxpemUgdGhlIGdhbWUsIGFzIHNldCBieSBwbGF5ZXJzICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNldHRpbmdzID0gT2JqZWN0LmZyZWV6ZSh0aGlzLnNldHRpbmdzTWFuYWdlci52YWx1ZXMpO1xuXG4gICAgLyoqXG4gICAgICogRm9yc3l0aC1FZHdhcmRzIE5vdGF0aW9uIChmZW4pLCBhIG5vdGF0aW9uIHRoYXQgZGVzY3JpYmVzIHRoZSBnYW1lIGJvYXJkXG4gICAgICogc3RhdGUuXG4gICAgICovXG4gICAgcHVibGljIGZlbiE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIEEgbWFwcGluZyBvZiBldmVyeSBnYW1lIG9iamVjdCdzIElEIHRvIHRoZSBhY3R1YWwgZ2FtZSBvYmplY3QuIFByaW1hcmlseVxuICAgICAqIHVzZWQgYnkgdGhlIHNlcnZlciBhbmQgY2xpZW50IHRvIGVhc2lseSByZWZlciB0byB0aGUgZ2FtZSBvYmplY3RzIHZpYVxuICAgICAqIElELlxuICAgICAqL1xuICAgIHB1YmxpYyBnYW1lT2JqZWN0cyE6IHtbaWQ6IHN0cmluZ106IEdhbWVPYmplY3R9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGxpc3Qgb2YgW2tub3duXSBtb3ZlcyB0aGF0IGhhdmUgb2NjdXJyZWQgaW4gdGhlIGdhbWUsIGluIFN0YW5kYXJkXG4gICAgICogQWxnZWJyYWljIE5vdGF0aW9uIChTQU4pIGZvcm1hdC4gVGhlIGZpcnN0IGVsZW1lbnQgaXMgdGhlIGZpcnN0IG1vdmUsXG4gICAgICogd2l0aCB0aGUgbGFzdCBiZWluZyB0aGUgbW9zdCByZWNlbnQuXG4gICAgICovXG4gICAgcHVibGljIGhpc3RvcnkhOiBzdHJpbmdbXTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgYWxsIHRoZSBwbGF5ZXJzIGluIHRoZSBnYW1lLlxuICAgICAqL1xuICAgIHB1YmxpYyBwbGF5ZXJzITogUGxheWVyW107XG5cbiAgICAvKipcbiAgICAgKiBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgZ2FtZSBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIHBsYXllZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2Vzc2lvbiE6IHN0cmluZztcblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqIFRoZSBjaGVzcy5qcyBpbnN0YW5jZSB1c2VkIHRvIGRvIGFsbCBsb2dpYy4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgY2hlc3MgPSBuZXcgY2hlc3Nqcy5DaGVzcygpO1xuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGF0dHJpYnV0ZXMgLS0+PlxuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW4gYSBHYW1lIGlzIGNyZWF0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2V0dGluZ3NNYW5hZ2VyIC0gVGhlIG1hbmFnZXIgdGhhdCBob2xkcyBpbml0aWFsIHNldHRpbmdzLlxuICAgICAqIEBwYXJhbSByZXF1aXJlZCAtIERhdGEgcmVxdWlyZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIChpZ25vcmUgaXQpLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcm90ZWN0ZWQgc2V0dGluZ3NNYW5hZ2VyOiBDaGVzc0dhbWVTZXR0aW5nc01hbmFnZXIsXG4gICAgICAgIHJlcXVpcmVkOiBSZWFkb25seTxJQmFzZUdhbWVSZXF1aXJlZERhdGE+LFxuICAgICkge1xuICAgICAgICBzdXBlcihzZXR0aW5nc01hbmFnZXIsIHJlcXVpcmVkKTtcblxuICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmZlbikge1xuICAgICAgICAgICAgdGhpcy5jaGVzcy5sb2FkKHRoaXMuc2V0dGluZ3MuZmVuKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnNldHRpbmdzLnBnbikge1xuICAgICAgICAgICAgdGhpcy5jaGVzcy5sb2FkX3Bnbih0aGlzLnNldHRpbmdzLnBnbik7XG4gICAgICAgIH1cblxuICAgICAgICAodGhpcy5wbGF5ZXJzWzBdIGFzIE11dGFibGVQbGF5ZXIpLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAodGhpcy5wbGF5ZXJzWzFdIGFzIE11dGFibGVQbGF5ZXIpLmNvbG9yID0gXCJibGFja1wiO1xuXG4gICAgICAgIHRoaXMuZmVuID0gdGhpcy5jaGVzcy5mZW4oKTtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2goLi4udGhpcy5jaGVzcy5oaXN0b3J5KCkpO1xuICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgIH1cblxuICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cblxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19