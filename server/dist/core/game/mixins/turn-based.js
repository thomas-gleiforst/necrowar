"use strict";
// tslint:disable:max-classes-per-file
// ^ because the mixin define multiple classes while maintaining scope to each
// tslint:disable:no-empty-interface
// ^ because the some mixins have nothing to add
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/utils");
/**
 * A base game that is turn based, with helper functions that should be common
 * between turn based games. defined in Creer data and implemented here so we
 * don't have to re-code it all the time.
 *
 * @param base the base classes to mixin turn based logic into
 * @returns a new BaseGame class with TwoPlayerGame logic mixed in
 */
// Because it will be a weird mixin type inferred from the return statement.
// tslint:disable-next-line:typedef
function mixTurnBased(base) {
    /** An AI in the game that has turns to execute. */
    class TurnBasedAI extends base.AI {
        /**
         * Instructs the AI to run their turn.
         *
         * @returns A promise that resolves to if they want to end their turn.
         */
        async runTurn() {
            return this.executeOrder("runTurn");
        }
    }
    /** Game settings to control turn timing. */
    class TurnBaseGameSettings extends base.GameSettings {
        constructor() {
            super(...arguments);
            /** The values for turn based settings. */
            this.values = this.initialValues(this.schema);
        }
        /** The schema for turn based settings. */
        get schema() {
            return this.makeSchema({
                // HACK: super should work. but schema is undefined on it
                // tslint:disable-next-line:no-any
                ...(super.schema || this.schema),
                timeAddedPerTurn: {
                    default: 1e9,
                    min: 0,
                    description: "The amount of time (in nano-seconds) to add "
                        + "after each player performs a turn.",
                },
                maxTurns: {
                    default: 200,
                    min: 1,
                    description: "The maximum number of turns before the game is "
                        + "force ended and a winner is determined.",
                },
            });
        }
        /**
         * Adds in the maximum number of turns and time added per turn into
         * the calculations.
         *
         * @returns A number of how long in MS it wold take max.
         */
        getMaxPlayerTime() {
            const { maxTurns, timeAddedPerTurn } = this.values;
            return super.getMaxPlayerTime() + (maxTurns * timeAddedPerTurn);
        }
    }
    /** A turn based game. */
    class TurnBasedGame extends base.Game {
    }
    /** The manager for turn based games. */
    class TurnBasedGameManager extends base.GameManager {
        /**
         * Begins the turn based game to the first player,
         *
         * @param args - All the args to pipe to our super.
         */
        constructor(...args) {
            // any[] is required for mixin
            // constructor signature
            super(...args);
            this.game.currentPlayer = this.game.players[0];
        }
        /**
         * Base logic to invalidate any run command, ensuring players only
         * run logic on their turns.
         *
         * @param player - The player running code.
         * @param gameObject - The game object running.
         * @param functionName - The name of the function being run.
         * @param args - The key.value map (in positional arg order) args.
         * @returns A string explaining why it is invalid, or undefined if
         * valid.
         */
        invalidateRun(player, gameObject, functionName, args) {
            const invalid = super.invalidateRun(player, gameObject, functionName, args);
            if (invalid) {
                return invalid;
            }
            if (player !== this.game.currentPlayer) {
                return "It is not your turn.";
            }
        }
        /** Starts the game */
        start() {
            this.runCurrentTurn();
        }
        /**
         * Called before a players turn, including the first turn.
         */
        async beforeTurn() {
            // intended to be over-ridden
        }
        /**
         * Transitions to the next turn, increasing turn and setting the
         * currentPlayer to the next one.
         */
        async afterTurn() {
            // intended to be over-ridden
        }
        /**
         * Intended to be inherited and then max turn victory conditions
         * checked to find the winner/looser.
         */
        maxTurnsReached() {
            this.secondaryWinConditions(`Max turns reached (${this.game.maxTurns})`);
            this.endGame();
        }
        /**
         * Checks if the game is over in between turns.
         * This is invoked AFTER afterTurn() is called, but BEFORE beforeTurn()
         * is called.
         *
         * @returns True if the game is indeed over, otherwise if the game
         * should continue return false.
         */
        primaryWinConditionsCheck() {
            return false;
        }
        /**
         * Intended to be inherited with secondary win condition checking.
         *
         * @param reason The reason why a secondary victory condition is being
         * checked.
         */
        secondaryWinConditions(reason) {
            this.makePlayerWinViaCoinFlip(`${reason}, Identical AIs played the game`);
        }
        /** Runs a turn, invoking all protected methods around it */
        async runCurrentTurn() {
            await this.beforeTurn();
            const turnBasedAI = this.game.currentPlayer.ai;
            const done = await turnBasedAI.runTurn();
            if (done) {
                await this.afterTurn();
                // now check if the game is over before advancing the turn
                if (this.game.currentTurn + 1 >= this.game.maxTurns) {
                    this.maxTurnsReached();
                    return;
                }
                else if (this.primaryWinConditionsCheck()) {
                    this.endGame();
                    return;
                }
                // If we got here all after turn logic is done, so let's
                // advance the turn.
                this.game.currentTurn++;
                const nextPlayer = utils_1.getNextWrapAround(this.game.players, this.game.currentPlayer);
                if (!nextPlayer) {
                    throw new Error("Cannot find the next player for their turn!");
                }
                this.game.currentPlayer = nextPlayer;
                this.game.currentPlayer.timeRemaining += this.game.timeAddedPerTurn;
            }
            this.runCurrentTurn();
        }
    }
    return {
        ...base,
        AI: TurnBasedAI,
        Game: TurnBasedGame,
        GameManager: TurnBasedGameManager,
        GameSettings: TurnBaseGameSettings,
    };
}
exports.mixTurnBased = mixTurnBased;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHVybi1iYXNlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvbWl4aW5zL3R1cm4tYmFzZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFzQztBQUN0Qyw4RUFBOEU7QUFDOUUsb0NBQW9DO0FBQ3BDLGdEQUFnRDs7QUFHaEQsbUNBQTRDO0FBTTVDOzs7Ozs7O0dBT0c7QUFDSCw0RUFBNEU7QUFDNUUsbUNBQW1DO0FBQ25DLFNBQWdCLFlBQVksQ0FNMUIsSUFXRDtJQUNHLG1EQUFtRDtJQUNuRCxNQUFNLFdBQVksU0FBUSxJQUFJLENBQUMsRUFBRTtRQUM3Qjs7OztXQUlHO1FBQ0ksS0FBSyxDQUFDLE9BQU87WUFDaEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FDSjtJQUVELDRDQUE0QztJQUM1QyxNQUFNLG9CQUFxQixTQUFRLElBQUksQ0FBQyxZQUFZO1FBQXBEOztZQXNCSSwwQ0FBMEM7WUFDbkMsV0FBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBYXBELENBQUM7UUFuQ0csMENBQTBDO1FBQzFDLElBQVcsTUFBTTtZQUNiLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDbkIseURBQXlEO2dCQUN6RCxrQ0FBa0M7Z0JBQ2xDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFLLElBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ3pDLGdCQUFnQixFQUFFO29CQUNkLE9BQU8sRUFBRSxHQUFHO29CQUNaLEdBQUcsRUFBRSxDQUFDO29CQUNOLFdBQVcsRUFBRSw4Q0FBOEM7MEJBQ2pELG9DQUFvQztpQkFDakQ7Z0JBQ0QsUUFBUSxFQUFFO29CQUNOLE9BQU8sRUFBRSxHQUFHO29CQUNaLEdBQUcsRUFBRSxDQUFDO29CQUNOLFdBQVcsRUFBRSxpREFBaUQ7MEJBQ3BELHlDQUF5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QUMsV0FBVyxFQUFFLENBQUM7Z0JBRXhCLE1BQU0sVUFBVSxHQUFHLHlCQUFpQixDQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQzFCLENBQUM7Z0JBRUYsSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7aUJBQ2xFO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQztnQkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7YUFFdkU7WUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQztLQUNKO0lBRUQsT0FBTztRQUNILEdBQUcsSUFBSTtRQUNQLEVBQUUsRUFBRSxXQUFXO1FBQ2YsSUFBSSxFQUFFLGFBQWE7UUFDbkIsV0FBVyxFQUFFLG9CQUFvQjtRQUNqQyxZQUFZLEVBQUUsb0JBQW9CO0tBQ3JDLENBQUM7QUFDTixDQUFDO0FBdFBELG9DQXNQQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOm1heC1jbGFzc2VzLXBlci1maWxlXG4vLyBeIGJlY2F1c2UgdGhlIG1peGluIGRlZmluZSBtdWx0aXBsZSBjbGFzc2VzIHdoaWxlIG1haW50YWluaW5nIHNjb3BlIHRvIGVhY2hcbi8vIHRzbGludDpkaXNhYmxlOm5vLWVtcHR5LWludGVyZmFjZVxuLy8gXiBiZWNhdXNlIHRoZSBzb21lIG1peGlucyBoYXZlIG5vdGhpbmcgdG8gYWRkXG5cbmltcG9ydCB7IEJhc2VHYW1lT2JqZWN0LCBCYXNlUGxheWVyIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBnZXROZXh0V3JhcEFyb3VuZCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgKiBhcyBCYXNlIGZyb20gXCIuL2Jhc2VcIjtcblxuLyoqIEEgcGxheWVyIGluIGEgdHVybiBiYXNlZCBnYW1lICovXG5leHBvcnQgaW50ZXJmYWNlIElUdXJuQmFzZWRQbGF5ZXIgZXh0ZW5kcyBCYXNlUGxheWVyIHt9XG5cbi8qKlxuICogQSBiYXNlIGdhbWUgdGhhdCBpcyB0dXJuIGJhc2VkLCB3aXRoIGhlbHBlciBmdW5jdGlvbnMgdGhhdCBzaG91bGQgYmUgY29tbW9uXG4gKiBiZXR3ZWVuIHR1cm4gYmFzZWQgZ2FtZXMuIGRlZmluZWQgaW4gQ3JlZXIgZGF0YSBhbmQgaW1wbGVtZW50ZWQgaGVyZSBzbyB3ZVxuICogZG9uJ3QgaGF2ZSB0byByZS1jb2RlIGl0IGFsbCB0aGUgdGltZS5cbiAqXG4gKiBAcGFyYW0gYmFzZSB0aGUgYmFzZSBjbGFzc2VzIHRvIG1peGluIHR1cm4gYmFzZWQgbG9naWMgaW50b1xuICogQHJldHVybnMgYSBuZXcgQmFzZUdhbWUgY2xhc3Mgd2l0aCBUd29QbGF5ZXJHYW1lIGxvZ2ljIG1peGVkIGluXG4gKi9cbi8vIEJlY2F1c2UgaXQgd2lsbCBiZSBhIHdlaXJkIG1peGluIHR5cGUgaW5mZXJyZWQgZnJvbSB0aGUgcmV0dXJuIHN0YXRlbWVudC5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp0eXBlZGVmXG5leHBvcnQgZnVuY3Rpb24gbWl4VHVybkJhc2VkPFxuICAgIFRCYXNlQUkgZXh0ZW5kcyBCYXNlLkJhc2VBSUNvbnN0cnVjdG9yLFxuICAgIFRCYXNlR2FtZSBleHRlbmRzIEJhc2UuQmFzZUdhbWVDb25zdHJ1Y3RvcixcbiAgICBUQmFzZUdhbWVNYW5hZ2VyIGV4dGVuZHMgQmFzZS5CYXNlR2FtZU1hbmFnZXJDb25zdHJ1Y3RvcixcbiAgICBUQmFzZUdhbWVPYmplY3QgZXh0ZW5kcyBCYXNlLkJhc2VHYW1lT2JqZWN0Q29uc3RydWN0b3IsXG4gICAgVEJhc2VHYW1lU2V0dGluZ3MgZXh0ZW5kcyBCYXNlLkJhc2VHYW1lU2V0dGluZ3NNYW5hZ2VyQ29uc3RydWN0b3Jcbj4oYmFzZToge1xuICAgIC8qKiBUaGUgQUkgdG8gZXh0ZW5kLiAqL1xuICAgIEFJOiBUQmFzZUFJO1xuICAgIC8qKiBUaGUgR2FtZSB0byBleHRlbmQuICovXG4gICAgR2FtZTogVEJhc2VHYW1lO1xuICAgIC8qKiBUaGUgR2FtZU1hbmFnZXIgdG8gZXh0ZW5kLiAqL1xuICAgIEdhbWVNYW5hZ2VyOiBUQmFzZUdhbWVNYW5hZ2VyO1xuICAgIC8qKiBUaGUgR2FtZU9iamVjdCB0byBleHRlbmQuICovXG4gICAgR2FtZU9iamVjdDogVEJhc2VHYW1lT2JqZWN0O1xuICAgIC8qKiBUaGUgR2FtZVNldHRpbmdzIHRvIGV4dGVuZC4gKi9cbiAgICBHYW1lU2V0dGluZ3M6IFRCYXNlR2FtZVNldHRpbmdzO1xufSkge1xuICAgIC8qKiBBbiBBSSBpbiB0aGUgZ2FtZSB0aGF0IGhhcyB0dXJucyB0byBleGVjdXRlLiAqL1xuICAgIGNsYXNzIFR1cm5CYXNlZEFJIGV4dGVuZHMgYmFzZS5BSSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnN0cnVjdHMgdGhlIEFJIHRvIHJ1biB0aGVpciB0dXJuLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byBpZiB0aGV5IHdhbnQgdG8gZW5kIHRoZWlyIHR1cm4uXG4gICAgICAgICAqL1xuICAgICAgICBwdWJsaWMgYXN5bmMgcnVuVHVybigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGVPcmRlcihcInJ1blR1cm5cIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogR2FtZSBzZXR0aW5ncyB0byBjb250cm9sIHR1cm4gdGltaW5nLiAqL1xuICAgIGNsYXNzIFR1cm5CYXNlR2FtZVNldHRpbmdzIGV4dGVuZHMgYmFzZS5HYW1lU2V0dGluZ3Mge1xuICAgICAgICAvKiogVGhlIHNjaGVtYSBmb3IgdHVybiBiYXNlZCBzZXR0aW5ncy4gKi9cbiAgICAgICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZVNjaGVtYSh7XG4gICAgICAgICAgICAgICAgLy8gSEFDSzogc3VwZXIgc2hvdWxkIHdvcmsuIGJ1dCBzY2hlbWEgaXMgdW5kZWZpbmVkIG9uIGl0XG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICAgICAgICAgIC4uLihzdXBlci5zY2hlbWEgfHwgKHRoaXMgYXMgYW55KS5zY2hlbWEpLFxuICAgICAgICAgICAgICAgIHRpbWVBZGRlZFBlclR1cm46IHtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogMWU5LCAvLyAxIHNlYyBpbiBucyxcbiAgICAgICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgYW1vdW50IG9mIHRpbWUgKGluIG5hbm8tc2Vjb25kcykgdG8gYWRkIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGEgdHVybi5cIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1heFR1cm5zOiB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgbWluOiAxLFxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYmVmb3JlIHRoZSBnYW1lIGlzIFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBcImZvcmNlIGVuZGVkIGFuZCBhIHdpbm5lciBpcyBkZXRlcm1pbmVkLlwiLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBUaGUgdmFsdWVzIGZvciB0dXJuIGJhc2VkIHNldHRpbmdzLiAqL1xuICAgICAgICBwdWJsaWMgdmFsdWVzID0gdGhpcy5pbml0aWFsVmFsdWVzKHRoaXMuc2NoZW1hKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkcyBpbiB0aGUgbWF4aW11bSBudW1iZXIgb2YgdHVybnMgYW5kIHRpbWUgYWRkZWQgcGVyIHR1cm4gaW50b1xuICAgICAgICAgKiB0aGUgY2FsY3VsYXRpb25zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyBBIG51bWJlciBvZiBob3cgbG9uZyBpbiBNUyBpdCB3b2xkIHRha2UgbWF4LlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIGdldE1heFBsYXllclRpbWUoKTogbnVtYmVyIHtcbiAgICAgICAgICAgIGNvbnN0IHsgbWF4VHVybnMsIHRpbWVBZGRlZFBlclR1cm4gfSA9IHRoaXMudmFsdWVzO1xuXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuZ2V0TWF4UGxheWVyVGltZSgpICsgKG1heFR1cm5zICogdGltZUFkZGVkUGVyVHVybik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogQSB0dXJuIGJhc2VkIGdhbWUuICovXG4gICAgY2xhc3MgVHVybkJhc2VkR2FtZSBleHRlbmRzIGJhc2UuR2FtZSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgYW1vdW50IG9mIHRpbWUgYWRkZWQgdG8gYSBwbGF5ZXIncyB0aW1lUmVtYWluaW5nIGF0IHRoZSBlbmQgb2ZcbiAgICAgICAgICogZWFjaCBvZiB0aGVpciB0dXJuc1xuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHRpbWVBZGRlZFBlclR1cm4hOiBudW1iZXI7IC8vIDEgc2VjIGluIG5zXG5cbiAgICAgICAgLyoqIFRoZSBjdXJyZW50IHBsYXllciAocGxheWVyIHdob3NlIHR1cm4gaXQgaXMpLiAqL1xuICAgICAgICBwdWJsaWMgY3VycmVudFBsYXllciE6IEJhc2VQbGF5ZXI7XG5cbiAgICAgICAgLyoqIFRoZSBjdXJyZW50IHR1cm4gbnVtYmVyLCBzdGFydGluZyBhdCAwLiAqL1xuICAgICAgICBwdWJsaWMgY3VycmVudFR1cm4hOiBudW1iZXI7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiB0dXJucy4gV2hlbiBjdXJyZW50VHVybiBoaXRzIHRoaXMgdGhlIGdhbWVcbiAgICAgICAgICogZW5kcywgYW5kIHNlY29uZGFyeSBnYW1lIG92ZXIgY29uZGl0aW9ucyBhcmUgZXZhbHVhdGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgcHVibGljIHJlYWRvbmx5IG1heFR1cm5zITogbnVtYmVyO1xuICAgIH1cblxuICAgIC8qKiBUaGUgbWFuYWdlciBmb3IgdHVybiBiYXNlZCBnYW1lcy4gKi9cbiAgICBjbGFzcyBUdXJuQmFzZWRHYW1lTWFuYWdlciBleHRlbmRzIGJhc2UuR2FtZU1hbmFnZXIge1xuICAgICAgICAvKiogVGhlIGdhbWUgd2UgYXJlIG1hbmFnaW5nLiAqL1xuICAgICAgICBwdWJsaWMgcmVhZG9ubHkgZ2FtZSE6IFR1cm5CYXNlZEdhbWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJlZ2lucyB0aGUgdHVybiBiYXNlZCBnYW1lIHRvIHRoZSBmaXJzdCBwbGF5ZXIsXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBhcmdzIC0gQWxsIHRoZSBhcmdzIHRvIHBpcGUgdG8gb3VyIHN1cGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RydWN0b3IoLi4uYXJnczogYW55W10pIHsgLy8gdHNsaW50OmRpc2FibGUtbGluZTpuby1hbnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW55W10gaXMgcmVxdWlyZWQgZm9yIG1peGluXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0cnVjdG9yIHNpZ25hdHVyZVxuICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnNbMF07XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQmFzZSBsb2dpYyB0byBpbnZhbGlkYXRlIGFueSBydW4gY29tbWFuZCwgZW5zdXJpbmcgcGxheWVycyBvbmx5XG4gICAgICAgICAqIHJ1biBsb2dpYyBvbiB0aGVpciB0dXJucy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHBsYXllciAtIFRoZSBwbGF5ZXIgcnVubmluZyBjb2RlLlxuICAgICAgICAgKiBAcGFyYW0gZ2FtZU9iamVjdCAtIFRoZSBnYW1lIG9iamVjdCBydW5uaW5nLlxuICAgICAgICAgKiBAcGFyYW0gZnVuY3Rpb25OYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIGJlaW5nIHJ1bi5cbiAgICAgICAgICogQHBhcmFtIGFyZ3MgLSBUaGUga2V5LnZhbHVlIG1hcCAoaW4gcG9zaXRpb25hbCBhcmcgb3JkZXIpIGFyZ3MuXG4gICAgICAgICAqIEByZXR1cm5zIEEgc3RyaW5nIGV4cGxhaW5pbmcgd2h5IGl0IGlzIGludmFsaWQsIG9yIHVuZGVmaW5lZCBpZlxuICAgICAgICAgKiB2YWxpZC5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlUnVuKFxuICAgICAgICAgICAgcGxheWVyOiBCYXNlUGxheWVyLFxuICAgICAgICAgICAgZ2FtZU9iamVjdDogQmFzZUdhbWVPYmplY3QsXG4gICAgICAgICAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgIGFyZ3M6IE1hcDxzdHJpbmcsIHVua25vd24+LFxuICAgICAgICApOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgICAgICAgY29uc3QgaW52YWxpZCA9IHN1cGVyLmludmFsaWRhdGVSdW4oXG4gICAgICAgICAgICAgICAgcGxheWVyLFxuICAgICAgICAgICAgICAgIGdhbWVPYmplY3QsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoaW52YWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnZhbGlkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGxheWVyICE9PSB0aGlzLmdhbWUuY3VycmVudFBsYXllcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIkl0IGlzIG5vdCB5b3VyIHR1cm4uXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiogU3RhcnRzIHRoZSBnYW1lICovXG4gICAgICAgIHByb3RlY3RlZCBzdGFydCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMucnVuQ3VycmVudFR1cm4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWxsZWQgYmVmb3JlIGEgcGxheWVycyB0dXJuLCBpbmNsdWRpbmcgdGhlIGZpcnN0IHR1cm4uXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgYXN5bmMgYmVmb3JlVHVybigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgICAgIC8vIGludGVuZGVkIHRvIGJlIG92ZXItcmlkZGVuXG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogVHJhbnNpdGlvbnMgdG8gdGhlIG5leHQgdHVybiwgaW5jcmVhc2luZyB0dXJuIGFuZCBzZXR0aW5nIHRoZVxuICAgICAgICAgKiBjdXJyZW50UGxheWVyIHRvIHRoZSBuZXh0IG9uZS5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBhc3luYyBhZnRlclR1cm4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgICAgICAvLyBpbnRlbmRlZCB0byBiZSBvdmVyLXJpZGRlblxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludGVuZGVkIHRvIGJlIGluaGVyaXRlZCBhbmQgdGhlbiBtYXggdHVybiB2aWN0b3J5IGNvbmRpdGlvbnNcbiAgICAgICAgICogY2hlY2tlZCB0byBmaW5kIHRoZSB3aW5uZXIvbG9vc2VyLlxuICAgICAgICAgKi9cbiAgICAgICAgcHJvdGVjdGVkIG1heFR1cm5zUmVhY2hlZCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhgTWF4IHR1cm5zIHJlYWNoZWQgKCR7dGhpcy5nYW1lLm1heFR1cm5zfSlgKTtcblxuICAgICAgICAgICAgdGhpcy5lbmRHYW1lKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2hlY2tzIGlmIHRoZSBnYW1lIGlzIG92ZXIgaW4gYmV0d2VlbiB0dXJucy5cbiAgICAgICAgICogVGhpcyBpcyBpbnZva2VkIEFGVEVSIGFmdGVyVHVybigpIGlzIGNhbGxlZCwgYnV0IEJFRk9SRSBiZWZvcmVUdXJuKClcbiAgICAgICAgICogaXMgY2FsbGVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBnYW1lIGlzIGluZGVlZCBvdmVyLCBvdGhlcndpc2UgaWYgdGhlIGdhbWVcbiAgICAgICAgICogc2hvdWxkIGNvbnRpbnVlIHJldHVybiBmYWxzZS5cbiAgICAgICAgICovXG4gICAgICAgIHByb3RlY3RlZCBwcmltYXJ5V2luQ29uZGl0aW9uc0NoZWNrKCk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEludGVuZGVkIHRvIGJlIGluaGVyaXRlZCB3aXRoIHNlY29uZGFyeSB3aW4gY29uZGl0aW9uIGNoZWNraW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gcmVhc29uIFRoZSByZWFzb24gd2h5IGEgc2Vjb25kYXJ5IHZpY3RvcnkgY29uZGl0aW9uIGlzIGJlaW5nXG4gICAgICAgICAqIGNoZWNrZWQuXG4gICAgICAgICAqL1xuICAgICAgICBwcm90ZWN0ZWQgc2Vjb25kYXJ5V2luQ29uZGl0aW9ucyhyZWFzb246IHN0cmluZyk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5tYWtlUGxheWVyV2luVmlhQ29pbkZsaXAoXG4gICAgICAgICAgICAgICAgYCR7cmVhc29ufSwgSWRlbnRpY2FsIEFJcyBwbGF5ZWQgdGhlIGdhbWVgLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKiBSdW5zIGEgdHVybiwgaW52b2tpbmcgYWxsIHByb3RlY3RlZCBtZXRob2RzIGFyb3VuZCBpdCAqL1xuICAgICAgICBwcml2YXRlIGFzeW5jIHJ1bkN1cnJlbnRUdXJuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5iZWZvcmVUdXJuKCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHR1cm5CYXNlZEFJID0gKHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLmFpIGFzIFR1cm5CYXNlZEFJKTtcbiAgICAgICAgICAgIGNvbnN0IGRvbmUgPSBhd2FpdCB0dXJuQmFzZWRBSS5ydW5UdXJuKCk7XG5cbiAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hZnRlclR1cm4oKTtcblxuICAgICAgICAgICAgICAgIC8vIG5vdyBjaGVjayBpZiB0aGUgZ2FtZSBpcyBvdmVyIGJlZm9yZSBhZHZhbmNpbmcgdGhlIHR1cm5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLmN1cnJlbnRUdXJuICsgMSA+PSB0aGlzLmdhbWUubWF4VHVybnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXhUdXJuc1JlYWNoZWQoKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucHJpbWFyeVdpbkNvbmRpdGlvbnNDaGVjaygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kR2FtZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnb3QgaGVyZSBhbGwgYWZ0ZXIgdHVybiBsb2dpYyBpcyBkb25lLCBzbyBsZXQnc1xuICAgICAgICAgICAgICAgIC8vIGFkdmFuY2UgdGhlIHR1cm4uXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRUdXJuKys7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGxheWVyID0gZ2V0TmV4dFdyYXBBcm91bmQoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY3VycmVudFBsYXllcixcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFuZXh0UGxheWVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIHRoZSBuZXh0IHBsYXllciBmb3IgdGhlaXIgdHVybiFcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmN1cnJlbnRQbGF5ZXIgPSBuZXh0UGxheWVyO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jdXJyZW50UGxheWVyLnRpbWVSZW1haW5pbmcgKz0gdGhpcy5nYW1lLnRpbWVBZGRlZFBlclR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ydW5DdXJyZW50VHVybigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYmFzZSxcbiAgICAgICAgQUk6IFR1cm5CYXNlZEFJLFxuICAgICAgICBHYW1lOiBUdXJuQmFzZWRHYW1lLFxuICAgICAgICBHYW1lTWFuYWdlcjogVHVybkJhc2VkR2FtZU1hbmFnZXIsXG4gICAgICAgIEdhbWVTZXR0aW5nczogVHVybkJhc2VHYW1lU2V0dGluZ3MsXG4gICAgfTtcbn1cbiJdfQ==