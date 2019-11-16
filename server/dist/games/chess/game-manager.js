"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is where you should put logic to control the game and everything
// around it.
const _1 = require("./");
/**
 * Checks if the move a capture, promotion, or pawn movement
 *
 * @param move - The move to check against
 * @returns True is so, false otherwise
 */
function checkMoveForSTFR(move) {
    return Boolean(move.captured || move.promotion || move.piece === "p");
}
const gameOver50TurnMessage = "Draw - 50-move rule: 50 moves completed with no pawn moved or piece captured.";
// <<-- /Creer-Merge: imports -->>
/**
 * Manages the game logic around the Chess Game.
 * This is where you could do logic for checking if the game is over, update
 * the game between turns, and anything that ties all the "stuff" in the game
 * together.
 */
class ChessGameManager extends _1.BaseClasses.GameManager {
    constructor() {
        super(...arguments);
        // <<-- Creer-Merge: public-methods -->>
        // any additional public methods you need can be added here
        // <<-- /Creer-Merge: public-methods -->>
        // <<-- Creer-Merge: protected-private-methods -->>
        /** How many turns till 50 move draw during simplified three fold repetition */
        this.halfMoveCountSTFR = 0; // 50 move rule, 50 moves are two complete turns, so 100 turns in total.
        // <<-- /Creer-Merge: protected-private-methods -->>
    }
    /** Other strings (case insensitive) that can be used as an ID */
    static get aliases() {
        return [
            // <<-- Creer-Merge: aliases -->>
            "MegaMinerAI-Chess",
        ];
    }
    /** Starts the game play */
    start() {
        super.start();
        this.runSideToMove();
    }
    /**
     * Runs the current turn of the player whose turn it is
     *
     * @returns A promise that resolves once this specific turn is ended.
     */
    async runSideToMove() {
        const playerIndex = this.game.chess.turn() === "w" ? 0 : 1;
        const player = this.game.players[playerIndex];
        const move = await player.ai.makeMove();
        const cleanedMove = this.cleanMove(move, this.game.chess);
        const valid = this.game.chess.move(cleanedMove, { sloppy: true });
        if (!valid) {
            this.declareLoser(`Made an invalid move ('${move}').
Valid moves: ${this.game.chess.moves() // Take all valid moves,
                .map((validMove) => `'${validMove}'`) // Wrap them in '' quotes,
                .join(", ") // Then finally add commas between each for readability
            }`, player);
            this.declareWinner("Opponent made an invalid move.", player.opponent);
            this.endGame();
            return;
        }
        // else their move was accepted, update our state proxies
        this.game.fen = this.game.chess.fen();
        this.game.history.push(valid.san);
        if (this.game.settings.enableSTFR) {
            // if
            this.halfMoveCountSTFR = checkMoveForSTFR(valid)
                ? 0 // reset turns, pawn was moved or piece captured
                : this.halfMoveCountSTFR + 1; // else increase by 1
        }
        const [loserReason, winnerReason] = this.checkForGameOverReasons();
        if (loserReason) {
            if (winnerReason) {
                // first won, second lost
                this.declareWinner(winnerReason, player);
                this.declareLoser(loserReason, player.opponent);
            }
            else {
                // they all lost because the game is a draw
                this.declareLosers(loserReason, ...this.game.players);
            }
            this.endGame();
            return;
        }
        // now it is a new side's move
        this.runSideToMove();
    }
    /**
     * Checks the game for a reason to end the game.
     *
     * @returns An empty array if the game is not over. Otherwise an array with
     * one or two strings in it. One means a draw for that reason, two means
     * the first won for that reason, and the second lost for that reason.
     */
    checkForGameOverReasons() {
        const chess = this.game.chess;
        if (chess.in_checkmate()) {
            return ["Checkmated", "Checkmate!"];
        }
        if (chess.insufficient_material()) {
            return ["Draw - Insufficient material (K vs. K, K vs. KB, or K vs. KN) for checkmate."];
        }
        if (chess.in_stalemate()) {
            return [
                "Stalemate - The side to move has been stalemated "
                    + "because they are not in check, but have no valid moves.",
            ];
        }
        if (this.game.settings.enableTFR) {
            if (chess.in_threefold_repetition()) {
                return ["Stalemate - Board position has occurred three or more times."];
            }
            // chess.js checks for draws by checking:
            // - 50-move rule
            // - stalemate
            // - insufficient material
            // - three fold repetition
            // Keeping this check last, guarantees everything but the 50-move rule have been checked
            if (chess.in_draw()) {
                return [gameOver50TurnMessage];
            }
        }
        if (this.game.settings.enableSTFR) {
            if (this.isInSimplifiedThreefoldRepetition()) {
                return ["Draw - Simplified threefold repetition occurred."];
            }
            // chess.js.in_draw() should be true at the same time, but we are tracking the turns anyways,
            // and chess.js.in_draw() checks for more than the 50-turn rule so the checks following this one would
            // never be reached, so we must do this check because simplified TFR is different
            if (this.halfMoveCountSTFR >= 100) {
                return [gameOver50TurnMessage];
            }
        }
        return [];
    }
    /**
     * If for the last eight moves no capture, promotions, or pawn movement
     * has happened and moves 0,1,2, and 3 are identical to moves 4, 5, 6, and
     * 7 respectively, then a draw has occurred.
     *
     * @returns True if the last moves are indeed in simplified threefold
     * repetition (STFR), false otherwise.
     */
    isInSimplifiedThreefoldRepetition() {
        const numberOfMoves = this.game.history.length;
        const history = this.game.chess.history({ verbose: true });
        if (numberOfMoves < 8) {
            return false; // not enough moves have even occurred to be in STFR
        }
        // for the last 4 "rounds" (two turns for each player)
        for (let i = 0; i < 4; i++) {
            const move = history[numberOfMoves + i - 8];
            const nextMove = history[numberOfMoves + i - 4];
            // if for the last eight moves a capture, promotion, or pawn
            // movement has happened, then simplified threefold repetition has
            // NOT occurred
            if (checkMoveForSTFR(move) || checkMoveForSTFR(nextMove)) {
                return false; // has not occurred
            }
            // if any of the moves 0 and 4, 1 and 5, ..., 3 and 7 are NOT
            // identical, then a draw has NOT occurred
            //    Two moves are identical if the starting position (file and
            //    rank) and ending position (file and rank) of the moves are
            //    identical.
            if (move.piece !== move.piece || move.to !== nextMove.to || move.from !== nextMove.from) {
                return false; // has not occurred
            }
        }
        return true; // if we got here the last 8 moves are repeats,
        // so it is in STFR
    }
    /**
     * Cleans a move so chess.js can accept a wider range of moves.
     *
     * @param uncleanedMoved - The SAN move to clean
     * @param chess - The chess.js instance to use for move hints
     * @returns A new SAN move that more easily works with chess.js
     */
    cleanMove(uncleanedMoved, chess) {
        const move = uncleanedMoved.replace(/\s/g, ""); // remove all whitespace from move
        // First check for 0 vs O casteling
        if (move === "0-0" || move === "0-0-0") {
            return move.replace(/0/g, "O"); // replace all `0` characters with `O` as chess.js expects for castling
        }
        // Next check for UCI (Universal Chess Inferface) formatting
        const from = move[0] + move[1]; // first two chars are expected to be from square
        const to = move[2] + move[3]; // second two chars are expected to be to square
        const promotion = move[4]; // fifth char _might_ be the promotion char
        // \-> now check all moves to see if the from, to, and promotion match. If so use the SAN for it
        const moves = chess.moves({ verbose: true });
        const ourMove = moves.find((valid) => valid.from === from
            && valid.to === to
            && valid.promotion === promotion);
        if (ourMove) {
            return ourMove.san;
        }
        // nothing matching, let's hope their move was valid!
        return move;
    }
}
exports.ChessGameManager = ChessGameManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL2NoZXNzL2dhbWUtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZFQUE2RTtBQUM3RSxhQUFhO0FBQ2IseUJBQW9FO0FBS3BFOzs7OztHQUtHO0FBQ0gsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFVO0lBQ2hDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCxNQUFNLHFCQUFxQixHQUFHLCtFQUErRSxDQUFDO0FBQzlHLGtDQUFrQztBQUVsQzs7Ozs7R0FLRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEsY0FBVyxDQUFDLFdBQVc7SUFBN0Q7O1FBZ0JJLHdDQUF3QztRQUV4QywyREFBMkQ7UUFFM0QseUNBQXlDO1FBRXpDLG1EQUFtRDtRQUVuRCwrRUFBK0U7UUFDdkUsc0JBQWlCLEdBQUcsQ0FBQyxDQUFDLENBQUMsd0VBQXdFO1FBeU12RyxvREFBb0Q7SUFDeEQsQ0FBQztJQWxPRyxpRUFBaUU7SUFDMUQsTUFBTSxLQUFLLE9BQU87UUFDckIsT0FBTztZQUNILGlDQUFpQztZQUNqQyxtQkFBbUI7U0FFdEIsQ0FBQztJQUNOLENBQUM7SUFtQkQsMkJBQTJCO0lBQ2pCLEtBQUs7UUFDWCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxLQUFLLENBQUMsYUFBYTtRQUN2QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNELE1BQU0s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SSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlEQUFpRDtRQUNqRixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO1FBQzlFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDJDQUEyQztRQUV0RSxnR0FBZ0c7UUFDaEcsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSTtlQUNuQixLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUU7ZUFDZixLQUFLLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FDbEUsQ0FBQztRQUVGLElBQUksT0FBTyxFQUFFO1lBQ1QsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDO1NBQ3RCO1FBRUQscURBQXFEO1FBQ3JELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FHSjtBQW5PRCw0Q0FtT0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgd2hlcmUgeW91IHNob3VsZCBwdXQgbG9naWMgdG8gY29udHJvbCB0aGUgZ2FtZSBhbmQgZXZlcnl0aGluZ1xuLy8gYXJvdW5kIGl0LlxuaW1wb3J0IHsgQmFzZUNsYXNzZXMsIENoZXNzR2FtZSwgQ2hlc3NHYW1lT2JqZWN0RmFjdG9yeSB9IGZyb20gXCIuL1wiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbmltcG9ydCB7IENoZXNzSW5zdGFuY2UsIE1vdmUgfSBmcm9tIFwiY2hlc3MuanNcIjtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIG1vdmUgYSBjYXB0dXJlLCBwcm9tb3Rpb24sIG9yIHBhd24gbW92ZW1lbnRcbiAqXG4gKiBAcGFyYW0gbW92ZSAtIFRoZSBtb3ZlIHRvIGNoZWNrIGFnYWluc3RcbiAqIEByZXR1cm5zIFRydWUgaXMgc28sIGZhbHNlIG90aGVyd2lzZVxuICovXG5mdW5jdGlvbiBjaGVja01vdmVGb3JTVEZSKG1vdmU6IE1vdmUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gQm9vbGVhbihtb3ZlLmNhcHR1cmVkIHx8IG1vdmUucHJvbW90aW9uIHx8IG1vdmUucGllY2UgPT09IFwicFwiKTtcbn1cblxuY29uc3QgZ2FtZU92ZXI1MFR1cm5NZXNzYWdlID0gXCJEcmF3IC0gNTAtbW92ZSBydWxlOiA1MCBtb3ZlcyBjb21wbGV0ZWQgd2l0aCBubyBwYXduIG1vdmVkIG9yIHBpZWNlIGNhcHR1cmVkLlwiO1xuLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IGltcG9ydHMgLS0+PlxuXG4vKipcbiAqIE1hbmFnZXMgdGhlIGdhbWUgbG9naWMgYXJvdW5kIHRoZSBDaGVzcyBHYW1lLlxuICogVGhpcyBpcyB3aGVyZSB5b3UgY291bGQgZG8gbG9naWMgZm9yIGNoZWNraW5nIGlmIHRoZSBnYW1lIGlzIG92ZXIsIHVwZGF0ZVxuICogdGhlIGdhbWUgYmV0d2VlbiB0dXJucywgYW5kIGFueXRoaW5nIHRoYXQgdGllcyBhbGwgdGhlIFwic3R1ZmZcIiBpbiB0aGUgZ2FtZVxuICogdG9nZXRoZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBDaGVzc0dhbWVNYW5hZ2VyIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZU1hbmFnZXIge1xuICAgIC8qKiBPdGhlciBzdHJpbmdzIChjYXNlIGluc2Vuc2l0aXZlKSB0aGF0IGNhbiBiZSB1c2VkIGFzIGFuIElEICovXG4gICAgcHVibGljIHN0YXRpYyBnZXQgYWxpYXNlcygpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBhbGlhc2VzIC0tPj5cbiAgICAgICAgICAgIFwiTWVnYU1pbmVyQUktQ2hlc3NcIixcbiAgICAgICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhbGlhc2VzIC0tPj5cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvKiogVGhlIGdhbWUgdGhpcyBHYW1lTWFuYWdlciBpcyBtYW5hZ2luZyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnYW1lITogQ2hlc3NHYW1lO1xuXG4gICAgLyoqIFRoZSBmYWN0b3J5IHRoYXQgbXVzdCBiZSB1c2VkIHRvIGluaXRpYWxpemUgbmV3IGdhbWUgb2JqZWN0cyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBjcmVhdGUhOiBDaGVzc0dhbWVPYmplY3RGYWN0b3J5O1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLW1ldGhvZHMgLS0+PlxuXG4gICAgLy8gYW55IGFkZGl0aW9uYWwgcHVibGljIG1ldGhvZHMgeW91IG5lZWQgY2FuIGJlIGFkZGVkIGhlcmVcblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwdWJsaWMtbWV0aG9kcyAtLT4+XG5cbiAgICAvLyA8PC0tIENyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1tZXRob2RzIC0tPj5cblxuICAgIC8qKiBIb3cgbWFueSB0dXJucyB0aWxsIDUwIG1vdmUgZHJhdyBkdXJpbmcgc2ltcGxpZmllZCB0aHJlZSBmb2xkIHJlcGV0aXRpb24gKi9cbiAgICBwcml2YXRlIGhhbGZNb3ZlQ291bnRTVEZSID0gMDsgLy8gNTAgbW92ZSBydWxlLCA1MCBtb3ZlcyBhcmUgdHdvIGNvbXBsZXRlIHR1cm5zLCBzbyAxMDAgdHVybnMgaW4gdG90YWwuXG5cbiAgICAvKiogU3RhcnRzIHRoZSBnYW1lIHBsYXkgKi9cbiAgICBwcm90ZWN0ZWQgc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMucnVuU2lkZVRvTW92ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIGN1cnJlbnQgdHVybiBvZiB0aGUgcGxheWVyIHdob3NlIHR1cm4gaXQgaXNcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIG9uY2UgdGhpcyBzcGVjaWZpYyB0dXJuIGlzIGVuZGVkLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgcnVuU2lkZVRvTW92ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcGxheWVySW5kZXggPSB0aGlzLmdhbWUuY2hlc3MudHVybigpID09PSBcIndcIiA/IDAgOiAxO1xuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVyc1twbGF5ZXJJbmRleF07XG5cbiAgICAgICAgY29uc3QgbW92ZSA9IGF3YWl0IHBsYXllci5haS5tYWtlTW92ZSgpO1xuXG4gICAgICAgIGNvbnN0IGNsZWFuZWRNb3ZlID0gdGhpcy5jbGVhbk1vdmUobW92ZSwgdGhpcy5nYW1lLmNoZXNzKTtcblxuICAgICAgICBjb25zdCB2YWxpZCA9IHRoaXMuZ2FtZS5jaGVzcy5tb3ZlKGNsZWFuZWRNb3ZlLCB7IHNsb3BweTogdHJ1ZSB9KTtcblxuICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLmRlY2xhcmVMb3NlcihgTWFkZSBhbiBpbnZhbGlkIG1vdmUgKCcke21vdmV9JykuXG5WYWxpZCBtb3ZlczogJHt0aGlzLmdhbWUuY2hlc3MubW92ZXMoKSAgICAgIC8vIFRha2UgYWxsIHZhbGlkIG1vdmVzLFxuICAgIC5tYXAoKHZhbGlkTW92ZSkgPT4gYCcke3ZhbGlkTW92ZX0nYCkgICAvLyBXcmFwIHRoZW0gaW4gJycgcXVvdGVzLFxuICAgIC5qb2luKFwiLCBcIikgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZW4gZmluYWxseSBhZGQgY29tbWFzIGJldHdlZW4gZWFjaCBmb3IgcmVhZGFiaWxpdHlcbn1gLCBwbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5kZWNsYXJlV2lubmVyKFxuICAgICAgICAgICAgICAgIFwiT3Bwb25lbnQgbWFkZSBhbiBpbnZhbGlkIG1vdmUuXCIsXG4gICAgICAgICAgICAgICAgcGxheWVyLm9wcG9uZW50LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZW5kR2FtZSgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSB0aGVpciBtb3ZlIHdhcyBhY2NlcHRlZCwgdXBkYXRlIG91ciBzdGF0ZSBwcm94aWVzXG4gICAgICAgIHRoaXMuZ2FtZS5mZW4gPSB0aGlzLmdhbWUuY2hlc3MuZmVuKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5oaXN0b3J5LnB1c2godmFsaWQuc2FuKTtcblxuICAgICAgICBpZiAodGhpcy5nYW1lLnNldHRpbmdzLmVuYWJsZVNURlIpIHtcbiAgICAgICAgICAgIC8vIGlmXG4gICAgICAgICAgICB0aGlzLmhhbGZNb3ZlQ291bnRTVEZSID0gY2hlY2tNb3ZlRm9yU1RGUih2YWxpZClcbiAgICAgICAgICAgICAgICA/IDAgLy8gcmVzZXQgdHVybnMsIHBhd24gd2FzIG1vdmVkIG9yIHBpZWNlIGNhcHR1cmVkXG4gICAgICAgICAgICAgICAgOiB0aGlzLmhhbGZNb3ZlQ291bnRTVEZSICsgMTsgLy8gZWxzZSBpbmNyZWFzZSBieSAxXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBbIGxvc2VyUmVhc29uLCB3aW5uZXJSZWFzb24gXSA9IHRoaXMuY2hlY2tGb3JHYW1lT3ZlclJlYXNvbnMoKTtcbiAgICAgICAgaWYgKGxvc2VyUmVhc29uKSB7XG4gICAgICAgICAgICBpZiAod2lubmVyUmVhc29uKSB7XG4gICAgICAgICAgICAgICAgLy8gZmlyc3Qgd29uLCBzZWNvbmQgbG9zdFxuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGFyZVdpbm5lcih3aW5uZXJSZWFzb24sIHBsYXllcik7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXIobG9zZXJSZWFzb24sIHBsYXllci5vcHBvbmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB0aGV5IGFsbCBsb3N0IGJlY2F1c2UgdGhlIGdhbWUgaXMgYSBkcmF3XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNsYXJlTG9zZXJzKGxvc2VyUmVhc29uLCAuLi50aGlzLmdhbWUucGxheWVycyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZW5kR2FtZSgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3cgaXQgaXMgYSBuZXcgc2lkZSdzIG1vdmVcbiAgICAgICAgdGhpcy5ydW5TaWRlVG9Nb3ZlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoZSBnYW1lIGZvciBhIHJlYXNvbiB0byBlbmQgdGhlIGdhbWUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBbiBlbXB0eSBhcnJheSBpZiB0aGUgZ2FtZSBpcyBub3Qgb3Zlci4gT3RoZXJ3aXNlIGFuIGFycmF5IHdpdGhcbiAgICAgKiBvbmUgb3IgdHdvIHN0cmluZ3MgaW4gaXQuIE9uZSBtZWFucyBhIGRyYXcgZm9yIHRoYXQgcmVhc29uLCB0d28gbWVhbnNcbiAgICAgKiB0aGUgZmlyc3Qgd29uIGZvciB0aGF0IHJlYXNvbiwgYW5kIHRoZSBzZWNvbmQgbG9zdCBmb3IgdGhhdCByZWFzb24uXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGVja0ZvckdhbWVPdmVyUmVhc29ucygpOiBBcnJheTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgICAgICAgY29uc3QgY2hlc3MgPSB0aGlzLmdhbWUuY2hlc3M7XG4gICAgICAgIGlmIChjaGVzcy5pbl9jaGVja21hdGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtcIkNoZWNrbWF0ZWRcIiwgXCJDaGVja21hdGUhXCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNoZXNzLmluc3VmZmljaWVudF9tYXRlcmlhbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gWyBcIkRyYXcgLSBJbnN1ZmZpY2llbnQgbWF0ZXJpYWwgKEsgdnMuIEssIEsgdnMuIEtCLCBvciBLIHZzLiBLTikgZm9yIGNoZWNrbWF0ZS5cIiBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGVzcy5pbl9zdGFsZW1hdGUoKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBcIlN0YWxlbWF0ZSAtIFRoZSBzaWRlIHRvIG1vdmUgaGFzIGJlZW4gc3RhbGVtYXRlZCBcIlxuICAgICAgICAgICAgICArIFwiYmVjYXVzZSB0aGV5IGFyZSBub3QgaW4gY2hlY2ssIGJ1dCBoYXZlIG5vIHZhbGlkIG1vdmVzLlwiLFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuc2V0dGluZ3MuZW5hYmxlVEZSKSB7XG4gICAgICAgICAgICBpZiAoY2hlc3MuaW5fdGhyZWVmb2xkX3JlcGV0aXRpb24oKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBbIFwiU3RhbGVtYXRlIC0gQm9hcmQgcG9zaXRpb24gaGFzIG9jY3VycmVkIHRocmVlIG9yIG1vcmUgdGltZXMuXCIgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2hlc3MuanMgY2hlY2tzIGZvciBkcmF3cyBieSBjaGVja2luZzpcbiAgICAgICAgICAgIC8vIC0gNTAtbW92ZSBydWxlXG4gICAgICAgICAgICAvLyAtIHN0YWxlbWF0ZVxuICAgICAgICAgICAgLy8gLSBpbnN1ZmZpY2llbnQgbWF0ZXJpYWxcbiAgICAgICAgICAgIC8vIC0gdGhyZWUgZm9sZCByZXBldGl0aW9uXG4gICAgICAgICAgICAvLyBLZWVwaW5nIHRoaXMgY2hlY2sgbGFzdCwgZ3VhcmFudGVlcyBldmVyeXRoaW5nIGJ1dCB0aGUgNTAtbW92ZSBydWxlIGhhdmUgYmVlbiBjaGVja2VkXG4gICAgICAgICAgICBpZiAoY2hlc3MuaW5fZHJhdygpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsgZ2FtZU92ZXI1MFR1cm5NZXNzYWdlIF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5nYW1lLnNldHRpbmdzLmVuYWJsZVNURlIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5TaW1wbGlmaWVkVGhyZWVmb2xkUmVwZXRpdGlvbigpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFsgXCJEcmF3IC0gU2ltcGxpZmllZCB0aHJlZWZvbGQgcmVwZXRpdGlvbiBvY2N1cnJlZC5cIiBdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjaGVzcy5qcy5pbl9kcmF3KCkgc2hvdWxkIGJlIHRydWUgYXQgdGhlIHNhbWUgdGltZSwgYnV0IHdlIGFyZSB0cmFja2luZyB0aGUgdHVybnMgYW55d2F5cyxcbiAgICAgICAgICAgIC8vIGFuZCBjaGVzcy5qcy5pbl9kcmF3KCkgY2hlY2tzIGZvciBtb3JlIHRoYW4gdGhlIDUwLXR1cm4gcnVsZSBzbyB0aGUgY2hlY2tzIGZvbGxvd2luZyB0aGlzIG9uZSB3b3VsZFxuICAgICAgICAgICAgLy8gbmV2ZXIgYmUgcmVhY2hlZCwgc28gd2UgbXVzdCBkbyB0aGlzIGNoZWNrIGJlY2F1c2Ugc2ltcGxpZmllZCBURlIgaXMgZGlmZmVyZW50XG4gICAgICAgICAgICBpZiAodGhpcy5oYWxmTW92ZUNvdW50U1RGUiA+PSAxMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gWyBnYW1lT3ZlcjUwVHVybk1lc3NhZ2UgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBmb3IgdGhlIGxhc3QgZWlnaHQgbW92ZXMgbm8gY2FwdHVyZSwgcHJvbW90aW9ucywgb3IgcGF3biBtb3ZlbWVudFxuICAgICAqIGhhcyBoYXBwZW5lZCBhbmQgbW92ZXMgMCwxLDIsIGFuZCAzIGFyZSBpZGVudGljYWwgdG8gbW92ZXMgNCwgNSwgNiwgYW5kXG4gICAgICogNyByZXNwZWN0aXZlbHksIHRoZW4gYSBkcmF3IGhhcyBvY2N1cnJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGxhc3QgbW92ZXMgYXJlIGluZGVlZCBpbiBzaW1wbGlmaWVkIHRocmVlZm9sZFxuICAgICAqIHJlcGV0aXRpb24gKFNURlIpLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBpc0luU2ltcGxpZmllZFRocmVlZm9sZFJlcGV0aXRpb24oKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IG51bWJlck9mTW92ZXMgPSB0aGlzLmdhbWUuaGlzdG9yeS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdhbWUuY2hlc3MuaGlzdG9yeSh7IHZlcmJvc2U6IHRydWUgfSk7XG5cbiAgICAgICAgaWYgKG51bWJlck9mTW92ZXMgPCA4KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG5vdCBlbm91Z2ggbW92ZXMgaGF2ZSBldmVuIG9jY3VycmVkIHRvIGJlIGluIFNURlJcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvciB0aGUgbGFzdCA0IFwicm91bmRzXCIgKHR3byB0dXJucyBmb3IgZWFjaCBwbGF5ZXIpXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBtb3ZlID0gaGlzdG9yeVtudW1iZXJPZk1vdmVzICsgaSAtIDhdO1xuICAgICAgICAgICAgY29uc3QgbmV4dE1vdmUgPSBoaXN0b3J5W251bWJlck9mTW92ZXMgKyBpIC0gNF07XG5cbiAgICAgICAgICAgIC8vIGlmIGZvciB0aGUgbGFzdCBlaWdodCBtb3ZlcyBhIGNhcHR1cmUsIHByb21vdGlvbiwgb3IgcGF3blxuICAgICAgICAgICAgLy8gbW92ZW1lbnQgaGFzIGhhcHBlbmVkLCB0aGVuIHNpbXBsaWZpZWQgdGhyZWVmb2xkIHJlcGV0aXRpb24gaGFzXG4gICAgICAgICAgICAvLyBOT1Qgb2NjdXJyZWRcbiAgICAgICAgICAgIGlmIChjaGVja01vdmVGb3JTVEZSKG1vdmUpIHx8IGNoZWNrTW92ZUZvclNURlIobmV4dE1vdmUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBoYXMgbm90IG9jY3VycmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGFueSBvZiB0aGUgbW92ZXMgMCBhbmQgNCwgMSBhbmQgNSwgLi4uLCAzIGFuZCA3IGFyZSBOT1RcbiAgICAgICAgICAgIC8vIGlkZW50aWNhbCwgdGhlbiBhIGRyYXcgaGFzIE5PVCBvY2N1cnJlZFxuICAgICAgICAgICAgLy8gICAgVHdvIG1vdmVzIGFyZSBpZGVudGljYWwgaWYgdGhlIHN0YXJ0aW5nIHBvc2l0aW9uIChmaWxlIGFuZFxuICAgICAgICAgICAgLy8gICAgcmFuaykgYW5kIGVuZGluZyBwb3NpdGlvbiAoZmlsZSBhbmQgcmFuaykgb2YgdGhlIG1vdmVzIGFyZVxuICAgICAgICAgICAgLy8gICAgaWRlbnRpY2FsLlxuICAgICAgICAgICAgaWYgKG1vdmUucGllY2UgIT09IG1vdmUucGllY2UgfHwgbW92ZS50byAhPT0gbmV4dE1vdmUudG8gfHwgbW92ZS5mcm9tICE9PSBuZXh0TW92ZS5mcm9tKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBoYXMgbm90IG9jY3VycmVkXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gaWYgd2UgZ290IGhlcmUgdGhlIGxhc3QgOCBtb3ZlcyBhcmUgcmVwZWF0cyxcbiAgICAgICAgICAgICAgICAgICAgIC8vIHNvIGl0IGlzIGluIFNURlJcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbnMgYSBtb3ZlIHNvIGNoZXNzLmpzIGNhbiBhY2NlcHQgYSB3aWRlciByYW5nZSBvZiBtb3Zlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB1bmNsZWFuZWRNb3ZlZCAtIFRoZSBTQU4gbW92ZSB0byBjbGVhblxuICAgICAqIEBwYXJhbSBjaGVzcyAtIFRoZSBjaGVzcy5qcyBpbnN0YW5jZSB0byB1c2UgZm9yIG1vdmUgaGludHNcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBTQU4gbW92ZSB0aGF0IG1vcmUgZWFzaWx5IHdvcmtzIHdpdGggY2hlc3MuanNcbiAgICAgKi9cbiAgICBwcml2YXRlIGNsZWFuTW92ZSh1bmNsZWFuZWRNb3ZlZDogc3RyaW5nLCBjaGVzczogQ2hlc3NJbnN0YW5jZSk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IG1vdmUgPSB1bmNsZWFuZWRNb3ZlZC5yZXBsYWNlKC9cXHMvZywgXCJcIik7IC8vIHJlbW92ZSBhbGwgd2hpdGVzcGFjZSBmcm9tIG1vdmVcblxuICAgICAgICAvLyBGaXJzdCBjaGVjayBmb3IgMCB2cyBPIGNhc3RlbGluZ1xuICAgICAgICBpZiAobW92ZSA9PT0gXCIwLTBcIiB8fCBtb3ZlID09PSBcIjAtMC0wXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBtb3ZlLnJlcGxhY2UoLzAvZywgXCJPXCIpOyAvLyByZXBsYWNlIGFsbCBgMGAgY2hhcmFjdGVycyB3aXRoIGBPYCBhcyBjaGVzcy5qcyBleHBlY3RzIGZvciBjYXN0bGluZ1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTmV4dCBjaGVjayBmb3IgVUNJIChVbml2ZXJzYWwgQ2hlc3MgSW5mZXJmYWNlKSBmb3JtYXR0aW5nXG4gICAgICAgIGNvbnN0IGZyb20gPSBtb3ZlWzBdICsgbW92ZVsxXTsgLy8gZmlyc3QgdHdvIGNoYXJzIGFyZSBleHBlY3RlZCB0byBiZSBmcm9tIHNxdWFyZVxuICAgICAgICBjb25zdCB0byA9IG1vdmVbMl0gKyBtb3ZlWzNdOyAvLyBzZWNvbmQgdHdvIGNoYXJzIGFyZSBleHBlY3RlZCB0byBiZSB0byBzcXVhcmVcbiAgICAgICAgY29uc3QgcHJvbW90aW9uID0gbW92ZVs0XTsgLy8gZmlmdGggY2hhciBfbWlnaHRfIGJlIHRoZSBwcm9tb3Rpb24gY2hhclxuXG4gICAgICAgIC8vIFxcLT4gbm93IGNoZWNrIGFsbCBtb3ZlcyB0byBzZWUgaWYgdGhlIGZyb20sIHRvLCBhbmQgcHJvbW90aW9uIG1hdGNoLiBJZiBzbyB1c2UgdGhlIFNBTiBmb3IgaXRcbiAgICAgICAgY29uc3QgbW92ZXMgPSBjaGVzcy5tb3Zlcyh7IHZlcmJvc2U6IHRydWUgfSk7XG4gICAgICAgIGNvbnN0IG91ck1vdmUgPSBtb3Zlcy5maW5kKCh2YWxpZCkgPT4gdmFsaWQuZnJvbSA9PT0gZnJvbVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHZhbGlkLnRvID09PSB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICYmIHZhbGlkLnByb21vdGlvbiA9PT0gcHJvbW90aW9uLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChvdXJNb3ZlKSB7XG4gICAgICAgICAgICByZXR1cm4gb3VyTW92ZS5zYW47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBub3RoaW5nIG1hdGNoaW5nLCBsZXQncyBob3BlIHRoZWlyIG1vdmUgd2FzIHZhbGlkIVxuICAgICAgICByZXR1cm4gbW92ZTtcbiAgICB9XG5cbiAgICAvLyA8PC0tIC9DcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtbWV0aG9kcyAtLT4+XG59XG4iXX0=