"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("~/core/constants");
const game_1 = require("~/core/game");
const utils_1 = require("~/utils");
const delta_mergeable_1 = require("./delta-mergeable/");
/** Manages delta states on behalf of a game */
class DeltaManager {
    /** Manages delta states on behalf of a game */
    constructor() {
        /** The current delta state we are building. */
        this.delta = {};
        this.rootDeltaMergeable = new delta_mergeable_1.DeltaMergeable({
            key: "__root__",
        });
        this.rootDeltaMergeable.events.changed.on((changed) => {
            this.handleDelta(changed);
        });
        this.rootDeltaMergeable.events.deleted.on((deleted) => {
            this.handleDelta(deleted, true);
        });
    }
    /**
     * Gets the true delta state of the game, with nothing hidden, then resets
     * the state that was dumped.
     *
     * @returns - The delta formatted object representing the true delta
     * state of the game, with nothing hidden.
     */
    dump() {
        const state = this.delta;
        this.delta = {};
        return state;
    }
    /**
     * Handles a change in game state by updating our delta.
     *
     * @param changed - The delta mergeable that mutated.
     * @param wasDeleted - A boolean indicating if the mutation was a deletion.
     */
    handleDelta(changed, wasDeleted = false) {
        let changedValue = changed.get();
        if (changedValue instanceof game_1.BaseGame) {
            return; // we only care about the game's children, not itself
        }
        let pathDeltaMergeable = changed;
        const path = [];
        while (pathDeltaMergeable && pathDeltaMergeable.getParent() !== this.rootDeltaMergeable) {
            path.unshift(pathDeltaMergeable);
            pathDeltaMergeable = pathDeltaMergeable.getParent();
        }
        let current = this.delta;
        // Now go up the path to the deltaMergeable that changed to build up
        // our delta.
        for (let i = 0; i < path.length; i++) {
            const dm = path[i];
            const value = dm.get();
            if (!utils_1.objectHasProperty(current, dm.key)) {
                current[dm.key] = {};
            }
            if (Array.isArray(value)) {
                const len = value.length;
                current[dm.key][constants_1.SHARED_CONSTANTS.DELTA_LIST_LENGTH] = len;
            }
            if (i !== (path.length - 1)) {
                current = current[dm.key];
            }
        }
        // current should now be at the end of the path
        if (changedValue === undefined && !wasDeleted) {
            // Do not use `undefined` in this case.
            // When JSON serializing, keys with the value `undefined` will be
            // dropped, however we want to tell clients/gamelogs that this key
            // still exists, but with no value.
            // `null` is the correct value in this case.
            changedValue = null;
        }
        if (wasDeleted) {
            // Change the value to the special constant to tell clients
            // to delete this key from the object.
            changedValue = constants_1.SHARED_CONSTANTS.DELTA_REMOVED;
        }
        // tslint:disable-next-line:no-unsafe-any
        else if (utils_1.isObject(changedValue)) {
            const originalValue = changedValue;
            changedValue = {};
            if (originalValue instanceof game_1.BaseGameObject
                && !(path.length === 2 && path[0].key === "gameObjects")) {
                // Then it should be a game object reference.
                changedValue.id = originalValue.id;
            }
            else if (Array.isArray(originalValue)) {
                changedValue[constants_1.SHARED_CONSTANTS.DELTA_LIST_LENGTH] = originalValue.length;
            }
        }
        // else changed value is a primitive and is safe to copy
        current[changed.key] = changedValue;
    }
}
exports.DeltaManager = DeltaManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsdGEtbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvZGVsdGEtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGdEQUFvRDtBQUNwRCxzQ0FBdUQ7QUFDdkQsbUNBQXFFO0FBQ3JFLHdEQUFvRDtBQUVwRCwrQ0FBK0M7QUFDL0MsTUFBYSxZQUFZO0lBT3JCLCtDQUErQztJQUMvQztRQUpBLCtDQUErQztRQUN2QyxVQUFLLEdBQWtCLEVBQUUsQ0FBQztRQUk5QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxnQ0FBYyxDQUFDO1lBQ3pDLEdBQUcsRUFBRSxVQUFVO1NBQ2xCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2xELElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxJQUFJO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUVoQixPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDTyxXQUFXLENBQ2pCLE9BQXVCLEVBQ3ZCLGFBQXNCLEtBQUs7UUFFM0IsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLElBQUksWUFBWSxZQUFZLGVBQVEsRUFBRTtZQUNsQyxPQUFPLENBQUMscURBQXFEO1NBQ2hFO1FBRUQsSUFBSSxrQkFBa0IsR0FBK0IsT0FBTyxDQUFDO1FBQzdELE1BQU0sSUFBSSxHQUFHLEVBQXNCLENBQUM7UUFDcEMsT0FBTyxrQkFBa0IsSUFBSSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDckYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2pDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3ZEO1FBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixvRUFBb0U7UUFDcEUsYUFBYTtRQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLHlCQUFpQixDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3BDLE9BQXlCLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUMzQztZQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDdEIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDeEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQW1CLENBQUMsNEJBQWdCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxHQUFHLENBQUM7YUFDaEY7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pCLE9BQU8sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBa0IsQ0FBQzthQUM5QztTQUNKO1FBRUQsK0NBQStDO1FBQy9DLElBQUksWUFBWSxLQUFLLFNBQVMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUMzQyx1Q0FBdUM7WUFDdkMsaUVBQWlFO1lBQ2pFLGtFQUFrRTtZQUNsRSxtQ0FBbUM7WUFDbkMsNENBQTRDO1lBQzVDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDdkI7UUFFRCxJQUFJLFVBQVUsRUFBRTtZQUNaLDJEQUEyRDtZQUMzRCxzQ0FBc0M7WUFDdEMsWUFBWSxHQUFHLDRCQUFnQixDQUFDLGFBQWEsQ0FBQztTQUNqRDtRQUNELHlDQUF5QzthQUNwQyxJQUFJLGdCQUFRLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDN0IsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDO1lBQ25DLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxhQUFhLFlBQVkscUJBQWM7bUJBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLGFBQWEsQ0FBQyxFQUMxRDtnQkFDRSw2Q0FBNkM7Z0JBQzVDLFlBQThCLENBQUMsRUFBRSxHQUFHLGFBQWEsQ0FBQyxFQUFFLENBQUM7YUFDekQ7aUJBQ0ksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNsQyxZQUE4QixDQUFDLDRCQUFnQixDQUFDLGlCQUFpQixDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQzthQUM5RjtTQUNKO1FBQ0Qsd0RBQXdEO1FBRXhELE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBdUIsQ0FBQztJQUNuRCxDQUFDO0NBQ0o7QUFoSEQsb0NBZ0hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGVsdGEgfSBmcm9tIFwiQGNhZHJlL3RzLXV0aWxzL2NhZHJlXCI7XG5pbXBvcnQgeyBTSEFSRURfQ09OU1RBTlRTIH0gZnJvbSBcIn4vY29yZS9jb25zdGFudHNcIjtcbmltcG9ydCB7IEJhc2VHYW1lLCBCYXNlR2FtZU9iamVjdCB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgaXNPYmplY3QsIG9iamVjdEhhc1Byb3BlcnR5LCBVbmtub3duT2JqZWN0IH0gZnJvbSBcIn4vdXRpbHNcIjtcbmltcG9ydCB7IERlbHRhTWVyZ2VhYmxlIH0gZnJvbSBcIi4vZGVsdGEtbWVyZ2VhYmxlL1wiO1xuXG4vKiogTWFuYWdlcyBkZWx0YSBzdGF0ZXMgb24gYmVoYWxmIG9mIGEgZ2FtZSAqL1xuZXhwb3J0IGNsYXNzIERlbHRhTWFuYWdlciB7XG4gICAgLyoqIFRoZSByb290IGRlbHRhIG1lcmdlYWJsZSB3ZSB1c2UgZm9yIHRoZSBnYW1lIHRvIGJyYW5jaCBvZmYuICovXG4gICAgcHVibGljIHJlYWRvbmx5IHJvb3REZWx0YU1lcmdlYWJsZTogRGVsdGFNZXJnZWFibGU7XG5cbiAgICAvKiogVGhlIGN1cnJlbnQgZGVsdGEgc3RhdGUgd2UgYXJlIGJ1aWxkaW5nLiAqL1xuICAgIHByaXZhdGUgZGVsdGE6IERlbHRhW1wiZ2FtZVwiXSA9IHt9O1xuXG4gICAgLyoqIE1hbmFnZXMgZGVsdGEgc3RhdGVzIG9uIGJlaGFsZiBvZiBhIGdhbWUgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5yb290RGVsdGFNZXJnZWFibGUgPSBuZXcgRGVsdGFNZXJnZWFibGUoe1xuICAgICAgICAgICAga2V5OiBcIl9fcm9vdF9fXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucm9vdERlbHRhTWVyZ2VhYmxlLmV2ZW50cy5jaGFuZ2VkLm9uKChjaGFuZ2VkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZURlbHRhKGNoYW5nZWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJvb3REZWx0YU1lcmdlYWJsZS5ldmVudHMuZGVsZXRlZC5vbigoZGVsZXRlZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVEZWx0YShkZWxldGVkLCB0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdHJ1ZSBkZWx0YSBzdGF0ZSBvZiB0aGUgZ2FtZSwgd2l0aCBub3RoaW5nIGhpZGRlbiwgdGhlbiByZXNldHNcbiAgICAgKiB0aGUgc3RhdGUgdGhhdCB3YXMgZHVtcGVkLlxuICAgICAqXG4gICAgICogQHJldHVybnMgLSBUaGUgZGVsdGEgZm9ybWF0dGVkIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHRydWUgZGVsdGFcbiAgICAgKiBzdGF0ZSBvZiB0aGUgZ2FtZSwgd2l0aCBub3RoaW5nIGhpZGRlbi5cbiAgICAgKi9cbiAgICBwdWJsaWMgZHVtcCgpOiBEZWx0YVtcImdhbWVcIl0ge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZGVsdGE7XG4gICAgICAgIHRoaXMuZGVsdGEgPSB7fTtcblxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBhIGNoYW5nZSBpbiBnYW1lIHN0YXRlIGJ5IHVwZGF0aW5nIG91ciBkZWx0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGFuZ2VkIC0gVGhlIGRlbHRhIG1lcmdlYWJsZSB0aGF0IG11dGF0ZWQuXG4gICAgICogQHBhcmFtIHdhc0RlbGV0ZWQgLSBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiB0aGUgbXV0YXRpb24gd2FzIGEgZGVsZXRpb24uXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGhhbmRsZURlbHRhKFxuICAgICAgICBjaGFuZ2VkOiBEZWx0YU1lcmdlYWJsZSxcbiAgICAgICAgd2FzRGVsZXRlZDogYm9vbGVhbiA9IGZhbHNlLFxuICAgICk6IHZvaWQge1xuICAgICAgICBsZXQgY2hhbmdlZFZhbHVlID0gY2hhbmdlZC5nZXQoKTtcbiAgICAgICAgaWYgKGNoYW5nZWRWYWx1ZSBpbnN0YW5jZW9mIEJhc2VHYW1lKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIHdlIG9ubHkgY2FyZSBhYm91dCB0aGUgZ2FtZSdzIGNoaWxkcmVuLCBub3QgaXRzZWxmXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGF0aERlbHRhTWVyZ2VhYmxlOiBEZWx0YU1lcmdlYWJsZSB8IHVuZGVmaW5lZCA9IGNoYW5nZWQ7XG4gICAgICAgIGNvbnN0IHBhdGggPSBbXSBhcyBEZWx0YU1lcmdlYWJsZVtdO1xuICAgICAgICB3aGlsZSAocGF0aERlbHRhTWVyZ2VhYmxlICYmIHBhdGhEZWx0YU1lcmdlYWJsZS5nZXRQYXJlbnQoKSAhPT0gdGhpcy5yb290RGVsdGFNZXJnZWFibGUpIHtcbiAgICAgICAgICAgIHBhdGgudW5zaGlmdChwYXRoRGVsdGFNZXJnZWFibGUpO1xuICAgICAgICAgICAgcGF0aERlbHRhTWVyZ2VhYmxlID0gcGF0aERlbHRhTWVyZ2VhYmxlLmdldFBhcmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLmRlbHRhO1xuICAgICAgICAvLyBOb3cgZ28gdXAgdGhlIHBhdGggdG8gdGhlIGRlbHRhTWVyZ2VhYmxlIHRoYXQgY2hhbmdlZCB0byBidWlsZCB1cFxuICAgICAgICAvLyBvdXIgZGVsdGEuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZG0gPSBwYXRoW2ldO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkbS5nZXQoKTtcblxuICAgICAgICAgICAgaWYgKCFvYmplY3RIYXNQcm9wZXJ0eShjdXJyZW50LCBkbS5rZXkpKSB7XG4gICAgICAgICAgICAgICAgKGN1cnJlbnQgYXMgVW5rbm93bk9iamVjdClbZG0ua2V5XSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgKGN1cnJlbnRbZG0ua2V5XSBhcyBVbmtub3duT2JqZWN0KVtTSEFSRURfQ09OU1RBTlRTLkRFTFRBX0xJU1RfTEVOR1RIXSA9IGxlbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGkgIT09IChwYXRoLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnRbZG0ua2V5XSBhcyBVbmtub3duT2JqZWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gY3VycmVudCBzaG91bGQgbm93IGJlIGF0IHRoZSBlbmQgb2YgdGhlIHBhdGhcbiAgICAgICAgaWYgKGNoYW5nZWRWYWx1ZSA9PT0gdW5kZWZpbmVkICYmICF3YXNEZWxldGVkKSB7XG4gICAgICAgICAgICAvLyBEbyBub3QgdXNlIGB1bmRlZmluZWRgIGluIHRoaXMgY2FzZS5cbiAgICAgICAgICAgIC8vIFdoZW4gSlNPTiBzZXJpYWxpemluZywga2V5cyB3aXRoIHRoZSB2YWx1ZSBgdW5kZWZpbmVkYCB3aWxsIGJlXG4gICAgICAgICAgICAvLyBkcm9wcGVkLCBob3dldmVyIHdlIHdhbnQgdG8gdGVsbCBjbGllbnRzL2dhbWVsb2dzIHRoYXQgdGhpcyBrZXlcbiAgICAgICAgICAgIC8vIHN0aWxsIGV4aXN0cywgYnV0IHdpdGggbm8gdmFsdWUuXG4gICAgICAgICAgICAvLyBgbnVsbGAgaXMgdGhlIGNvcnJlY3QgdmFsdWUgaW4gdGhpcyBjYXNlLlxuICAgICAgICAgICAgY2hhbmdlZFZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3YXNEZWxldGVkKSB7XG4gICAgICAgICAgICAvLyBDaGFuZ2UgdGhlIHZhbHVlIHRvIHRoZSBzcGVjaWFsIGNvbnN0YW50IHRvIHRlbGwgY2xpZW50c1xuICAgICAgICAgICAgLy8gdG8gZGVsZXRlIHRoaXMga2V5IGZyb20gdGhlIG9iamVjdC5cbiAgICAgICAgICAgIGNoYW5nZWRWYWx1ZSA9IFNIQVJFRF9DT05TVEFOVFMuREVMVEFfUkVNT1ZFRDtcbiAgICAgICAgfVxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICBlbHNlIGlmIChpc09iamVjdChjaGFuZ2VkVmFsdWUpKSB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbFZhbHVlID0gY2hhbmdlZFZhbHVlO1xuICAgICAgICAgICAgY2hhbmdlZFZhbHVlID0ge307XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxWYWx1ZSBpbnN0YW5jZW9mIEJhc2VHYW1lT2JqZWN0XG4gICAgICAgICAgICAgICAgJiYgIShwYXRoLmxlbmd0aCA9PT0gMiAmJiBwYXRoWzBdLmtleSA9PT0gXCJnYW1lT2JqZWN0c1wiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlbiBpdCBzaG91bGQgYmUgYSBnYW1lIG9iamVjdCByZWZlcmVuY2UuXG4gICAgICAgICAgICAgICAgKGNoYW5nZWRWYWx1ZSBhcyBVbmtub3duT2JqZWN0KS5pZCA9IG9yaWdpbmFsVmFsdWUuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9yaWdpbmFsVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgKGNoYW5nZWRWYWx1ZSBhcyBVbmtub3duT2JqZWN0KVtTSEFSRURfQ09OU1RBTlRTLkRFTFRBX0xJU1RfTEVOR1RIXSA9IG9yaWdpbmFsVmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGVsc2UgY2hhbmdlZCB2YWx1ZSBpcyBhIHByaW1pdGl2ZSBhbmQgaXMgc2FmZSB0byBjb3B5XG5cbiAgICAgICAgY3VycmVudFtjaGFuZ2VkLmtleV0gPSBjaGFuZ2VkVmFsdWUgYXMgdW5rbm93bjtcbiAgICB9XG59XG4iXX0=