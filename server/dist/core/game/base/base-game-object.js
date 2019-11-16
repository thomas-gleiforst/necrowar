"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_game_delta_mergeables_1 = require("./base-game-delta-mergeables");
/** 16kb should be enough for any log, and may still be too large. */
const MAX_LOG_LENGTH = 16 * 1024;
/**
 * The base object for any object in the game that will need to be tracked via
 * an ID, e.g. players, units, etc.
 */
class BaseGameObject extends base_game_delta_mergeables_1.BaseGameDeltaMergeables {
    /**
     * Creates a base game object with some initialization data.
     *
     * @param data - The initialization data use by the super class.
     * @param requiredData - The data required to hook up this game object
     * the game, and set default values for the sub class.
     */
    constructor(data, requiredData) {
        super({
            key: requiredData.id,
            parent: requiredData.gameObjectsDeltaMergeable,
            attributesSchema: requiredData.schema.attributes,
            initialValues: {
                ...data,
                id: requiredData.id,
                gameObjectName: requiredData.gameObjectName,
            },
        });
        this.game = requiredData.game;
        this.manager = this.game.manager;
        this.game.gameObjects[this.id] = this;
    }
    /**
     * String coercion override, handles players by default as every game has
     * them.
     *
     * @returns formatted string for this name
     */
    toString() {
        if (this.gameObjectName === "Player") {
            // every game has a Player game object, but it is just an interface,
            // so we have to hack run time logic in here
            // tslint:disable-next-line:no-any
            return `Player "${this.name}" #${this.id}`;
        }
        return `${this.gameObjectName} #${this.id}`;
    }
    /**
     * Logs a string to this BaseGameObject's log array, for debugging purposes.
     * This is called from a 'run' event.
     *
     * @param player - The player requesting to log the string to this game
     * object.
     * @param message - The string to log.
     * @returns The arguments, as all input is valid.
     */
    invalidateLog(player, message) {
        if (message.length > MAX_LOG_LENGTH) {
            return `Message is too long! Max ${MAX_LOG_LENGTH} per message.`;
        }
    }
    /**
     * Logs a string to this BaseGameObject's log array, for debugging purposes.
     * This is called from a 'run' event.
     *
     * @param player - The player requesting to log the string to this game
     * object.
     * @param message - The string to log.
     */
    async log(player, message) {
        this.logs.push(message);
    }
}
exports.BaseGameObject = BaseGameObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1nYW1lLW9iamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvYmFzZS9iYXNlLWdhbWUtb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsNkVBQXVFO0FBR3ZFLHFFQUFxRTtBQUNyRSxNQUFNLGNBQWMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBcUJqQzs7O0dBR0c7QUFDSCxNQUFhLGNBQWUsU0FBUSxvREFBdUI7SUFtQnZEOzs7Ozs7T0FNRztJQUNILFlBQ0ksSUFBb0MsRUFDcEMsWUFBbUQ7UUFFbkQsS0FBSyxDQUFDO1lBQ0YsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUFFO1lBQ3BCLE1BQU0sRUFBRSxZQUFZLENBQUMseUJBQXlCO1lBQzlDLGdCQUFnQixFQUFFLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBVTtZQUNoRCxhQUFhLEVBQUU7Z0JBQ1gsR0FBRyxJQUFJO2dCQUNQLEVBQUUsRUFBRSxZQUFZLENBQUMsRUFBRTtnQkFDbkIsY0FBYyxFQUFFLFlBQVksQ0FBQyxjQUFjO2FBQzlDO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxRQUFRO1FBQ1gsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFFBQVEsRUFBRTtZQUNsQyxvRUFBb0U7WUFDcEUsNENBQTRDO1lBQzVDLGtDQUFrQztZQUNsQyxPQUFPLFdBQVksSUFBMEIsQ0FBQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQ3JFO1FBRUQsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNPLGFBQWEsQ0FDbkIsTUFBa0IsRUFDbEIsT0FBZTtRQUtmLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxjQUFjLEVBQUU7WUFDakMsT0FBTyw0QkFBNEIsY0FBYyxlQUFlLENBQUM7U0FDcEU7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBa0IsRUFBRSxPQUFlO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDSjtBQS9GRCx3Q0ErRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlUGxheWVyLCBJQmFzZUdhbWVPYmplY3RTY2hlbWEgfSBmcm9tIFwifi9jb3JlL2dhbWVcIjtcbmltcG9ydCB7IERlbHRhTWVyZ2VhYmxlIH0gZnJvbSBcIn4vY29yZS9nYW1lL2RlbHRhLW1lcmdlYWJsZVwiO1xuaW1wb3J0IHsgSW1tdXRhYmxlIH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IEJhc2VHYW1lIH0gZnJvbSBcIi4vYmFzZS1nYW1lXCI7XG5pbXBvcnQgeyBCYXNlR2FtZURlbHRhTWVyZ2VhYmxlcyB9IGZyb20gXCIuL2Jhc2UtZ2FtZS1kZWx0YS1tZXJnZWFibGVzXCI7XG5pbXBvcnQgeyBCYXNlR2FtZU1hbmFnZXIgfSBmcm9tIFwiLi9iYXNlLWdhbWUtbWFuYWdlclwiO1xuXG4vKiogMTZrYiBzaG91bGQgYmUgZW5vdWdoIGZvciBhbnkgbG9nLCBhbmQgbWF5IHN0aWxsIGJlIHRvbyBsYXJnZS4gKi9cbmNvbnN0IE1BWF9MT0dfTEVOR1RIID0gMTYgKiAxMDI0O1xuXG4vKiogVGhlIGJhc2UgZ2FtZSBvYmplY3QgZGF0YSAoZW1wdHkpLiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQmFzZUdhbWVPYmplY3REYXRhIHtcbiAgICAvLyBwYXNzXG59XG5cbi8qKiBWYWx1ZXMgcmVxdWlyZWQgYnkgYWxsIGdhbWUgb2JqZWN0cyB0byBiZSBpbml0aWFsaXplZCBjb3JyZWN0bHkuICovXG5leHBvcnQgaW50ZXJmYWNlIElCYXNlR2FtZU9iamVjdFJlcXVpcmVkRGF0YSB7XG4gICAgLyoqIFRoZSBpZCBvZiB0aGUgZ2FtZSBvYmplY3QuICovXG4gICAgaWQ6IHN0cmluZztcbiAgICAvKiogVGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRoaXMgR2FtZU9iamVjdCBpcyAqL1xuICAgIGdhbWVPYmplY3ROYW1lOiBzdHJpbmc7XG4gICAgLyoqIFRoZSBkZWx0YSBtZXJnZWFibGUgdXNlZCB0byB0cmFjayB0aGlzIGdhbWUgb2JqZWN0J3Mgc3RhdGUuICovXG4gICAgZ2FtZU9iamVjdHNEZWx0YU1lcmdlYWJsZTogRGVsdGFNZXJnZWFibGU7XG4gICAgLyoqIFRoZSBnYW1lIHRoaXMgZ2FtZSBvYmplY3QgaXMgaW4uICovXG4gICAgZ2FtZTogQmFzZUdhbWU7XG4gICAgLyoqIFRoZSBzY2hlbWEgdXNlZCB0byB2YWxpZGF0ZSBldmVyeXRoaW5nIGluc2lkZSB0aGUgZ2FtZSBvYmplY3QuICovXG4gICAgc2NoZW1hOiBJbW11dGFibGU8SUJhc2VHYW1lT2JqZWN0U2NoZW1hPjtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBvYmplY3QgZm9yIGFueSBvYmplY3QgaW4gdGhlIGdhbWUgdGhhdCB3aWxsIG5lZWQgdG8gYmUgdHJhY2tlZCB2aWFcbiAqIGFuIElELCBlLmcuIHBsYXllcnMsIHVuaXRzLCBldGMuXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlR2FtZU9iamVjdCBleHRlbmRzIEJhc2VHYW1lRGVsdGFNZXJnZWFibGVzIHtcbiAgICAvKiogVGhlIElEIG9mIHRoZSBnYW1lIG9iamVjdC4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgaWQhOiBzdHJpbmc7XG4gICAgLyoqIFRoZSB0b3AgY2xhc3MgbmFtZSBvZiB0aGUgZ2FtZSBvYmplY3QuICovXG4gICAgcHVibGljIHJlYWRvbmx5IGdhbWVPYmplY3ROYW1lITogc3RyaW5nO1xuICAgIC8qKiBUaGUgbG9ncyBsb2dnZWQgdG8gdGhpcyBnYW1lIG9iamVjdC4gKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbG9ncyE6IHN0cmluZ1tdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGdhbWUgdGhpcyBnYW1lIG9iamVjdCBpcyBpbi5cbiAgICAgKiBJbmhlcml0aW5nIGNsYXNzZXMgc2hvdWxkIHNwZWNpZnkgdGhlIHN1YiBnYW1lIHR5cGVcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ2FtZTogQmFzZUdhbWU7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWFuYWdlciB0aGF0IG1hbmFnZXMgYWN0aW9ucyBhcm91bmQgdGhlIGdhbWUgdGhpcyBnYW1lIG9iamVjdCBpcyBpbi5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbWFuYWdlcjogQmFzZUdhbWVNYW5hZ2VyO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGJhc2UgZ2FtZSBvYmplY3Qgd2l0aCBzb21lIGluaXRpYWxpemF0aW9uIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSAtIFRoZSBpbml0aWFsaXphdGlvbiBkYXRhIHVzZSBieSB0aGUgc3VwZXIgY2xhc3MuXG4gICAgICogQHBhcmFtIHJlcXVpcmVkRGF0YSAtIFRoZSBkYXRhIHJlcXVpcmVkIHRvIGhvb2sgdXAgdGhpcyBnYW1lIG9iamVjdFxuICAgICAqIHRoZSBnYW1lLCBhbmQgc2V0IGRlZmF1bHQgdmFsdWVzIGZvciB0aGUgc3ViIGNsYXNzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBkYXRhOiBJbW11dGFibGU8SUJhc2VHYW1lT2JqZWN0RGF0YT4sXG4gICAgICAgIHJlcXVpcmVkRGF0YTogUmVhZG9ubHk8SUJhc2VHYW1lT2JqZWN0UmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAga2V5OiByZXF1aXJlZERhdGEuaWQsXG4gICAgICAgICAgICBwYXJlbnQ6IHJlcXVpcmVkRGF0YS5nYW1lT2JqZWN0c0RlbHRhTWVyZ2VhYmxlLFxuICAgICAgICAgICAgYXR0cmlidXRlc1NjaGVtYTogcmVxdWlyZWREYXRhLnNjaGVtYS5hdHRyaWJ1dGVzLFxuICAgICAgICAgICAgaW5pdGlhbFZhbHVlczoge1xuICAgICAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICAgICAgaWQ6IHJlcXVpcmVkRGF0YS5pZCxcbiAgICAgICAgICAgICAgICBnYW1lT2JqZWN0TmFtZTogcmVxdWlyZWREYXRhLmdhbWVPYmplY3ROYW1lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gcmVxdWlyZWREYXRhLmdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IHRoaXMuZ2FtZS5tYW5hZ2VyO1xuICAgICAgICB0aGlzLmdhbWUuZ2FtZU9iamVjdHNbdGhpcy5pZF0gPSB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0cmluZyBjb2VyY2lvbiBvdmVycmlkZSwgaGFuZGxlcyBwbGF5ZXJzIGJ5IGRlZmF1bHQgYXMgZXZlcnkgZ2FtZSBoYXNcbiAgICAgKiB0aGVtLlxuICAgICAqXG4gICAgICogQHJldHVybnMgZm9ybWF0dGVkIHN0cmluZyBmb3IgdGhpcyBuYW1lXG4gICAgICovXG4gICAgcHVibGljIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgICAgIGlmICh0aGlzLmdhbWVPYmplY3ROYW1lID09PSBcIlBsYXllclwiKSB7XG4gICAgICAgICAgICAvLyBldmVyeSBnYW1lIGhhcyBhIFBsYXllciBnYW1lIG9iamVjdCwgYnV0IGl0IGlzIGp1c3QgYW4gaW50ZXJmYWNlLFxuICAgICAgICAgICAgLy8gc28gd2UgaGF2ZSB0byBoYWNrIHJ1biB0aW1lIGxvZ2ljIGluIGhlcmVcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICAgICAgICAgIHJldHVybiBgUGxheWVyIFwiJHsodGhpcyBhcyBhbnkgYXMgQmFzZVBsYXllcikubmFtZX1cIiAjJHt0aGlzLmlkfWA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYCR7dGhpcy5nYW1lT2JqZWN0TmFtZX0gIyR7dGhpcy5pZH1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvZ3MgYSBzdHJpbmcgdG8gdGhpcyBCYXNlR2FtZU9iamVjdCdzIGxvZyBhcnJheSwgZm9yIGRlYnVnZ2luZyBwdXJwb3Nlcy5cbiAgICAgKiBUaGlzIGlzIGNhbGxlZCBmcm9tIGEgJ3J1bicgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGxheWVyIC0gVGhlIHBsYXllciByZXF1ZXN0aW5nIHRvIGxvZyB0aGUgc3RyaW5nIHRvIHRoaXMgZ2FtZVxuICAgICAqIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gbWVzc2FnZSAtIFRoZSBzdHJpbmcgdG8gbG9nLlxuICAgICAqIEByZXR1cm5zIFRoZSBhcmd1bWVudHMsIGFzIGFsbCBpbnB1dCBpcyB2YWxpZC5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgaW52YWxpZGF0ZUxvZyhcbiAgICAgICAgcGxheWVyOiBCYXNlUGxheWVyLFxuICAgICAgICBtZXNzYWdlOiBzdHJpbmcsXG4gICAgKTogdW5kZWZpbmVkIHwgc3RyaW5nIHwge1xuICAgICAgICAvKiogVGhlIG5ldyB2YWx1ZSBvZiB0aGUgdmFsaWRhdGVkIG1lc3NhZ2UgdG8gdXNlICovXG4gICAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7XG4gICAgfSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmxlbmd0aCA+IE1BWF9MT0dfTEVOR1RIKSB7XG4gICAgICAgICAgICByZXR1cm4gYE1lc3NhZ2UgaXMgdG9vIGxvbmchIE1heCAke01BWF9MT0dfTEVOR1RIfSBwZXIgbWVzc2FnZS5gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9ncyBhIHN0cmluZyB0byB0aGlzIEJhc2VHYW1lT2JqZWN0J3MgbG9nIGFycmF5LCBmb3IgZGVidWdnaW5nIHB1cnBvc2VzLlxuICAgICAqIFRoaXMgaXMgY2FsbGVkIGZyb20gYSAncnVuJyBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwbGF5ZXIgLSBUaGUgcGxheWVyIHJlcXVlc3RpbmcgdG8gbG9nIHRoZSBzdHJpbmcgdG8gdGhpcyBnYW1lXG4gICAgICogb2JqZWN0LlxuICAgICAqIEBwYXJhbSBtZXNzYWdlIC0gVGhlIHN0cmluZyB0byBsb2cuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIGxvZyhwbGF5ZXI6IEJhc2VQbGF5ZXIsIG1lc3NhZ2U6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLmxvZ3MucHVzaChtZXNzYWdlKTtcbiAgICB9XG59XG4iXX0=