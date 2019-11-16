"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
const chessjs = require("chess.js");
const chess = new chessjs.Chess();
// <<-- /Creer-Merge: imports -->>
/**
 * The settings manager for the Chess game.
 */
class ChessGameSettingsManager extends _1.BaseClasses.GameSettings {
    /**
     * This describes the structure of the game settings, and is used to
     * generate the values, as well as basic type and range checking.
     */
    get schema() {
        return this.makeSchema({
            // HACK: `super` should work. but schema is undefined on it at run time.
            // tslint:disable-next-line:no-any
            ...(super.schema || this.schema),
            // Chess game specific settings
            fen: {
                description: "Forsyth-Edwards Notation (fen), a notation that "
                    + "describes the game board state.",
                // <<-- Creer-Merge: fen -->>
                default: "",
            },
            // <<-- Creer-Merge: schema -->>
            pgn: {
                description: "The starting board state in Portable Game Notation (PGN).",
                default: "",
            },
            enableSTFR: {
                description: "Enable non standard chess rule Simplified Three-Fold Repetition rule.",
                default: true,
            },
            enableTFR: {
                description: "Enable the standard chess rule Three-Fold Repetition rule.",
                default: false,
            },
            // <<-- /Creer-Merge: schema -->>
            // Base settings
            playerStartingTime: {
                // <<-- Creer-Merge: player-starting-time -->>
                default: 15 * 6e10,
                // <<-- /Creer-Merge: player-starting-time -->>
                min: 0,
                description: "The starting time (in ns) for each player.",
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
        if (settings.fen && settings.pgn) {
            return new Error("Cannot set FEN and PGN at the same time. Use only one for an initial board state.");
        }
        if (settings.fen) {
            // try to validate the FEN string
            const validated = chess.validate_fen(settings.fen);
            if (!validated.valid) {
                return new Error(`FEN invalid: ${validated.error}`);
            }
        }
        if (settings.pgn) {
            const valid = chess.load_pgn(settings.pgn, { sloppy: true });
            chess.reset(); // we just wanted to validate, not actually load.
            if (!valid) {
                return new Error("Could not load PGN.");
            }
        }
        // <<-- /Creer-Merge: invalidate -->>
        return settings;
    }
}
exports.ChessGameSettingsManager = ChessGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9jaGVzcy9nYW1lLXNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEseUJBQWlDO0FBRWpDLGlDQUFpQztBQUNqQyxvQ0FBb0M7QUFFcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDbEMsa0NBQWtDO0FBRWxDOztHQUVHO0FBQ0gsTUFBYSx3QkFBeUIsU0FBUSxjQUFXLENBQUMsWUFBWTtJQUNsRTs7O09BR0c7SUFDSCxJQUFXLE1BQU07UUFDYixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkIsd0VBQXdFO1lBQ3hFLGtDQUFrQztZQUNsQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSyxJQUFZLENBQUMsTUFBTSxDQUFDO1lBRXpDLCtCQUErQjtZQUMvQixHQUFHLEVBQUU7Z0JBQ0QsV0FBVyxFQUFFLGtEQUFrRDtzQkFDbEQsaUNBQWlDO2dCQUM5Qyw2QkFBNkI7Z0JBQzdCLE9BQU8sRUFBRSxFQUFFO2FBRWQ7WUFDRCxnQ0FBZ0M7WUFFaEMsR0FBRyxFQUFFO2dCQUNELFdBQVcsRUFBRSwyREFBMkQ7Z0JBQ3hFLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7WUFFRCxVQUFVLEVBQUU7Z0JBQ1IsV0FBVyxFQUFFLHVFQUF1RTtnQkFDcEYsT0FBTyxFQUFFLElBQUk7YUFDaEI7WUFFRCxTQUFTLEVBQUU7Z0JBQ1AsV0FBVyxFQUFFLDREQUE0RDtnQkFDekUsT0FBTyxFQUFFLEtBQUs7YUFDakI7WUFFRCxpQ0FBaUM7WUFFakMsZ0JBQWdCO1lBQ2hCLGtCQUFrQixFQUFFO2dCQUNoQiw4Q0FBOEM7Z0JBQzlDLE9BQU8sRUFBRSxFQUFFLEdBQUcsSUFBSTtnQkFDbEIsK0NBQStDO2dCQUMvQyxHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNENBQTRDO2FBQzVEO1NBRUosQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQU9EOzs7OztPQUtHO0lBQ08sVUFBVSxDQUFDLFlBQTJCO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkQsSUFBSSxXQUFXLFlBQVksS0FBSyxFQUFFO1lBQzlCLE9BQU8sV0FBVyxDQUFDO1NBQ3RCO1FBRUQsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyRSxvQ0FBb0M7UUFFcEMsSUFBSSxRQUFRLENBQUMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDOUIsT0FBTyxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO1NBQ3pHO1FBRUQsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ2QsaUNBQWlDO1lBQ2pDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5ELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNsQixPQUFPLElBQUksS0FBSyxDQUFDLGdCQUFnQixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzthQUN2RDtTQUNKO1FBRUQsSUFBSSxRQUFRLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsaURBQWlEO1lBRWhFLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1IsT0FBTyxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2FBQzNDO1NBQ0o7UUFFRCxxQ0FBcUM7UUFFckMsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBakdELDREQWlHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNldHRpbmdzRnJvbVNjaGVtYSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCAqIGFzIGNoZXNzanMgZnJvbSBcImNoZXNzLmpzXCI7XG5cbmNvbnN0IGNoZXNzID0gbmV3IGNoZXNzanMuQ2hlc3MoKTtcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBUaGUgc2V0dGluZ3MgbWFuYWdlciBmb3IgdGhlIENoZXNzIGdhbWUuXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGVzc0dhbWVTZXR0aW5nc01hbmFnZXIgZXh0ZW5kcyBCYXNlQ2xhc3Nlcy5HYW1lU2V0dGluZ3Mge1xuICAgIC8qKlxuICAgICAqIFRoaXMgZGVzY3JpYmVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdhbWUgc2V0dGluZ3MsIGFuZCBpcyB1c2VkIHRvXG4gICAgICogZ2VuZXJhdGUgdGhlIHZhbHVlcywgYXMgd2VsbCBhcyBiYXNpYyB0eXBlIGFuZCByYW5nZSBjaGVja2luZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0IHNjaGVtYSgpIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTp0eXBlZGVmXG4gICAgICAgIHJldHVybiB0aGlzLm1ha2VTY2hlbWEoe1xuICAgICAgICAgICAgLy8gSEFDSzogYHN1cGVyYCBzaG91bGQgd29yay4gYnV0IHNjaGVtYSBpcyB1bmRlZmluZWQgb24gaXQgYXQgcnVuIHRpbWUuXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgICAgICAgICAuLi4oc3VwZXIuc2NoZW1hIHx8ICh0aGlzIGFzIGFueSkuc2NoZW1hKSxcblxuICAgICAgICAgICAgLy8gQ2hlc3MgZ2FtZSBzcGVjaWZpYyBzZXR0aW5nc1xuICAgICAgICAgICAgZmVuOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRm9yc3l0aC1FZHdhcmRzIE5vdGF0aW9uIChmZW4pLCBhIG5vdGF0aW9uIHRoYXQgXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgXCJkZXNjcmliZXMgdGhlIGdhbWUgYm9hcmQgc3RhdGUuXCIsXG4gICAgICAgICAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogZmVuIC0tPj5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIlwiLFxuICAgICAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBmZW4gLS0+PlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIDw8LS0gQ3JlZXItTWVyZ2U6IHNjaGVtYSAtLT4+XG5cbiAgICAgICAgICAgIHBnbjoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBzdGFydGluZyBib2FyZCBzdGF0ZSBpbiBQb3J0YWJsZSBHYW1lIE5vdGF0aW9uIChQR04pLlwiLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBlbmFibGVTVEZSOiB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiRW5hYmxlIG5vbiBzdGFuZGFyZCBjaGVzcyBydWxlIFNpbXBsaWZpZWQgVGhyZWUtRm9sZCBSZXBldGl0aW9uIHJ1bGUuXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGVuYWJsZVRGUjoge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIkVuYWJsZSB0aGUgc3RhbmRhcmQgY2hlc3MgcnVsZSBUaHJlZS1Gb2xkIFJlcGV0aXRpb24gcnVsZS5cIixcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBzY2hlbWEgLS0+PlxuXG4gICAgICAgICAgICAvLyBCYXNlIHNldHRpbmdzXG4gICAgICAgICAgICBwbGF5ZXJTdGFydGluZ1RpbWU6IHtcbiAgICAgICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwbGF5ZXItc3RhcnRpbmctdGltZSAtLT4+XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogMTUgKiA2ZTEwLCAvLyAxNSBtaW4gaW4gbnNcbiAgICAgICAgICAgICAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcGxheWVyLXN0YXJ0aW5nLXRpbWUgLS0+PlxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgc3RhcnRpbmcgdGltZSAoaW4gbnMpIGZvciBlYWNoIHBsYXllci5cIixcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdmFsdWVzIGZvciB0aGUgZ2FtZSdzIHNldHRpbmdzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyE6IFNldHRpbmdzRnJvbVNjaGVtYTxDaGVzc0dhbWVTZXR0aW5nc01hbmFnZXJbXCJzY2hlbWFcIl0+O1xuXG4gICAgLyoqXG4gICAgICogVHJ5IHRvIGludmFsaWRhdGUgYWxsIHRoZSBnYW1lIHNldHRpbmdzIGhlcmUsIHNvIGludmFsaWQgdmFsdWVzIGRvIG5vdFxuICAgICAqIHJlYWNoIHRoZSBnYW1lLlxuICAgICAqIEBwYXJhbSBzb21lU2V0dGluZ3MgQSBzdWJzZXQgb2Ygc2V0dGluZ3MgdGhhdCB3aWxsIGJlIHRlc3RlZFxuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIGlmIHRoZSBzZXR0aW5ncyBmYWlsIHRvIHZhbGlkYXRlLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlKHNvbWVTZXR0aW5nczogVW5rbm93bk9iamVjdCk6IFVua25vd25PYmplY3QgfCBFcnJvciB7XG4gICAgICAgIGNvbnN0IGludmFsaWRhdGVkID0gc3VwZXIuaW52YWxpZGF0ZShzb21lU2V0dGluZ3MpO1xuICAgICAgICBpZiAoaW52YWxpZGF0ZWQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGludmFsaWRhdGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7IC4uLnRoaXMudmFsdWVzLCAuLi5zb21lU2V0dGluZ3MsIC4uLmludmFsaWRhdGVkIH07XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogaW52YWxpZGF0ZSAtLT4+XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmZlbiAmJiBzZXR0aW5ncy5wZ24pIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJDYW5ub3Qgc2V0IEZFTiBhbmQgUEdOIGF0IHRoZSBzYW1lIHRpbWUuIFVzZSBvbmx5IG9uZSBmb3IgYW4gaW5pdGlhbCBib2FyZCBzdGF0ZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2V0dGluZ3MuZmVuKSB7XG4gICAgICAgICAgICAvLyB0cnkgdG8gdmFsaWRhdGUgdGhlIEZFTiBzdHJpbmdcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkYXRlZCA9IGNoZXNzLnZhbGlkYXRlX2ZlbihzZXR0aW5ncy5mZW4pO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRlZC52YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoYEZFTiBpbnZhbGlkOiAke3ZhbGlkYXRlZC5lcnJvcn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZXR0aW5ncy5wZ24pIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gY2hlc3MubG9hZF9wZ24oc2V0dGluZ3MucGduLCB7IHNsb3BweTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGNoZXNzLnJlc2V0KCk7IC8vIHdlIGp1c3Qgd2FudGVkIHRvIHZhbGlkYXRlLCBub3QgYWN0dWFsbHkgbG9hZC5cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJDb3VsZCBub3QgbG9hZCBQR04uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGludmFsaWRhdGUgLS0+PlxuXG4gICAgICAgIHJldHVybiBzZXR0aW5ncztcbiAgICB9XG59XG4iXX0=