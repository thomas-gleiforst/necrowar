"use strict";
// tslint:disable:no-any no-non-null-assertion
// ^ as DeltaMergeables are black magic anyways
Object.defineProperty(exports, "__esModule", { value: true });
const sanitize_1 = require("~/core/sanitize/");
const delta_mergeable_1 = require("./delta-mergeable");
const delta_mergeable_array_1 = require("./delta-mergeable-array");
const delta_mergeable_object_1 = require("./delta-mergeable-object");
/**
 * Creates a sanitization transform function for delta mergeables.
 *
 * @param type They type to sanitize.
 * @returns a function that will accept a value and try to sanitize it.
 */
function sanitize(type) {
    return function transformSanitize(val, current, forceSet) {
        const sanitized = sanitize_1.sanitizeType(type, val, !forceSet); // if we are force settings, don't allow errors
        if (sanitized instanceof Error) {
            /*
             * If an error is thrown here you broke the type system.
             *
             * Whenever you set a variable in a game Cerveau type checks it,
             * and if it can't figure out how to convert it (e.g. "0" -> 0),
             * then it blows up here. We must do this as statically typed
             * programming languages like C++ MUST have the right types or we
             * will blow them up accidentally.
             *
             * To debug this read the stack trace and find where in the game
             * code you set a variable to the wrong type. The best candidate is
             * looking for code where you use the dangerous `any` type.
             */
            throw sanitized;
        }
        return sanitized;
    };
}
/**
 * Creates a delta mergeable given a type.
 * @param args - The data about the delta mergeable to create
 * @returns A newly created DeltaMergeable instance of the given type.
 */
function createDeltaMergeable(args) {
    switch (args.type.typeName) {
        case "list":
            return delta_mergeable_array_1.createArray({
                key: args.key,
                parent: args.parent,
                childType: args.type.valueType,
            });
        case "dictionary":
            return delta_mergeable_object_1.createObject({
                key: args.key,
                parent: args.parent,
                childType: args.type.valueType,
            });
        case "gameObject":
            return delta_mergeable_object_1.createObject({
                key: args.key,
                initialValue: args.initialValue,
                parent: args.parent,
                childTypes: args.childTypes,
                transform: sanitize(args.type),
            });
        default:
            return new delta_mergeable_1.DeltaMergeable({
                key: args.key,
                initialValue: args.initialValue,
                parent: args.parent,
                transform: sanitize(args.type),
            });
    }
}
exports.createDeltaMergeable = createDeltaMergeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWRlbHRhLW1lcmdlYWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2dhbWUvZGVsdGEtbWVyZ2VhYmxlL2NyZWF0ZS1kZWx0YS1tZXJnZWFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhDQUE4QztBQUM5QywrQ0FBK0M7O0FBRS9DLCtDQUFrRTtBQUVsRSx1REFBbUQ7QUFDbkQsbUVBQXNEO0FBQ3RELHFFQUF3RDtBQUV4RDs7Ozs7R0FLRztBQUNILFNBQVMsUUFBUSxDQUFDLElBQWlDO0lBSy9DLE9BQU8sU0FBUyxpQkFBaUIsQ0FDN0IsR0FBWSxFQUNaLE9BQVksRUFDWixRQUFpQjtRQUVqQixNQUFNLFNBQVMsR0FBRyx1QkFBWSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLCtDQUErQztRQUNyRyxJQUFJLFNBQVMsWUFBWSxLQUFLLEVBQUU7WUFDNUI7Ozs7Ozs7Ozs7OztlQVlHO1lBQ0gsTUFBTSxTQUFTLENBQUM7U0FDbkI7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLG9CQUFvQixDQUFDLElBV3BDO0lBQ0csUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUN4QixLQUFLLE1BQU07WUFDUCxPQUFPLG1DQUFXLENBQUM7Z0JBQ2YsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2dCQUNiLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUzthQUNqQyxDQUFDLENBQUM7UUFDUCxLQUFLLFlBQVk7WUFDYixPQUFPLHFDQUFZLENBQUM7Z0JBQ2hCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7YUFDakMsQ0FBQyxDQUFDO1FBQ1AsS0FBSyxZQUFZO1lBQ2IsT0FBTyxxQ0FBWSxDQUFDO2dCQUNoQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2IsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO2dCQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ25CLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDM0IsU0FBUyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ2pDLENBQUMsQ0FBQztRQUNQO1lBQ0ksT0FBTyxJQUFJLGdDQUFjLENBQUM7Z0JBQ3RCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztnQkFDYixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7Z0JBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtnQkFDbkIsU0FBUyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ2pDLENBQUMsQ0FBQztLQUNWO0FBQ0wsQ0FBQztBQXpDRCxvREF5Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4vLyBeIGFzIERlbHRhTWVyZ2VhYmxlcyBhcmUgYmxhY2sgbWFnaWMgYW55d2F5c1xuXG5pbXBvcnQgeyBJU2FuaXRpemFibGVUeXBlLCBzYW5pdGl6ZVR5cGUgfSBmcm9tIFwifi9jb3JlL3Nhbml0aXplL1wiO1xuaW1wb3J0IHsgSW1tdXRhYmxlLCBUeXBlZE9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBEZWx0YU1lcmdlYWJsZSB9IGZyb20gXCIuL2RlbHRhLW1lcmdlYWJsZVwiO1xuaW1wb3J0IHsgY3JlYXRlQXJyYXkgfSBmcm9tIFwiLi9kZWx0YS1tZXJnZWFibGUtYXJyYXlcIjtcbmltcG9ydCB7IGNyZWF0ZU9iamVjdCB9IGZyb20gXCIuL2RlbHRhLW1lcmdlYWJsZS1vYmplY3RcIjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2FuaXRpemF0aW9uIHRyYW5zZm9ybSBmdW5jdGlvbiBmb3IgZGVsdGEgbWVyZ2VhYmxlcy5cbiAqXG4gKiBAcGFyYW0gdHlwZSBUaGV5IHR5cGUgdG8gc2FuaXRpemUuXG4gKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBhY2NlcHQgYSB2YWx1ZSBhbmQgdHJ5IHRvIHNhbml0aXplIGl0LlxuICovXG5mdW5jdGlvbiBzYW5pdGl6ZSh0eXBlOiBJbW11dGFibGU8SVNhbml0aXphYmxlVHlwZT4pOiAoXG4gICAgdmFsOiB1bmtub3duLFxuICAgIGN1cnJlbnQ6IGFueSxcbiAgICBmb3JjZVNldDogYm9vbGVhbixcbikgPT4gYW55IHtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHJhbnNmb3JtU2FuaXRpemUoXG4gICAgICAgIHZhbDogdW5rbm93bixcbiAgICAgICAgY3VycmVudDogYW55LFxuICAgICAgICBmb3JjZVNldDogYm9vbGVhbixcbiAgICApOiBhbnkge1xuICAgICAgICBjb25zdCBzYW5pdGl6ZWQgPSBzYW5pdGl6ZVR5cGUodHlwZSwgdmFsLCAhZm9yY2VTZXQpOyAvLyBpZiB3ZSBhcmUgZm9yY2Ugc2V0dGluZ3MsIGRvbid0IGFsbG93IGVycm9yc1xuICAgICAgICBpZiAoc2FuaXRpemVkIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgKiBJZiBhbiBlcnJvciBpcyB0aHJvd24gaGVyZSB5b3UgYnJva2UgdGhlIHR5cGUgc3lzdGVtLlxuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIFdoZW5ldmVyIHlvdSBzZXQgYSB2YXJpYWJsZSBpbiBhIGdhbWUgQ2VydmVhdSB0eXBlIGNoZWNrcyBpdCxcbiAgICAgICAgICAgICAqIGFuZCBpZiBpdCBjYW4ndCBmaWd1cmUgb3V0IGhvdyB0byBjb252ZXJ0IGl0IChlLmcuIFwiMFwiIC0+IDApLFxuICAgICAgICAgICAgICogdGhlbiBpdCBibG93cyB1cCBoZXJlLiBXZSBtdXN0IGRvIHRoaXMgYXMgc3RhdGljYWxseSB0eXBlZFxuICAgICAgICAgICAgICogcHJvZ3JhbW1pbmcgbGFuZ3VhZ2VzIGxpa2UgQysrIE1VU1QgaGF2ZSB0aGUgcmlnaHQgdHlwZXMgb3Igd2VcbiAgICAgICAgICAgICAqIHdpbGwgYmxvdyB0aGVtIHVwIGFjY2lkZW50YWxseS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUbyBkZWJ1ZyB0aGlzIHJlYWQgdGhlIHN0YWNrIHRyYWNlIGFuZCBmaW5kIHdoZXJlIGluIHRoZSBnYW1lXG4gICAgICAgICAgICAgKiBjb2RlIHlvdSBzZXQgYSB2YXJpYWJsZSB0byB0aGUgd3JvbmcgdHlwZS4gVGhlIGJlc3QgY2FuZGlkYXRlIGlzXG4gICAgICAgICAgICAgKiBsb29raW5nIGZvciBjb2RlIHdoZXJlIHlvdSB1c2UgdGhlIGRhbmdlcm91cyBgYW55YCB0eXBlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB0aHJvdyBzYW5pdGl6ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2FuaXRpemVkO1xuICAgIH07XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlbHRhIG1lcmdlYWJsZSBnaXZlbiBhIHR5cGUuXG4gKiBAcGFyYW0gYXJncyAtIFRoZSBkYXRhIGFib3V0IHRoZSBkZWx0YSBtZXJnZWFibGUgdG8gY3JlYXRlXG4gKiBAcmV0dXJucyBBIG5ld2x5IGNyZWF0ZWQgRGVsdGFNZXJnZWFibGUgaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEZWx0YU1lcmdlYWJsZShhcmdzOiB7XG4gICAgLyoqIFRoZSBrZXkgb2YgdGhlIERlbHRhTWVyZ2VhYmxlIHRvIGNyZWF0ZS4gKi9cbiAgICBrZXk6IHN0cmluZztcbiAgICAvKiogVGhlIHR5cGUgb2YgdGhlIERlbHRhTWVyZ2VhYmxlIHRvIGNyZWF0ZS4gKi9cbiAgICB0eXBlOiBJbW11dGFibGU8SVNhbml0aXphYmxlVHlwZT47XG4gICAgLyoqIFRoZSBjaGlsZCB0eXBlcyBvZiB0aGlzIERlbHRhTWVyZ2VhYmxlLiAqL1xuICAgIGNoaWxkVHlwZXM/OiBJbW11dGFibGU8VHlwZWRPYmplY3Q8SVNhbml0aXphYmxlVHlwZT4+O1xuICAgIC8qKiBUaGUgcGFyZW50IERlbHRhTWVyZ2FibGUsIGlmIG5vbmUgdGhlbiBhc3N1bWVkIHRvIGJlIHJvb3Qgbm9kZS4gKi9cbiAgICBwYXJlbnQ/OiBEZWx0YU1lcmdlYWJsZTtcbiAgICAvKiogVGhlIGluaXRpYWwgdmFsdWUgb2YgdGhpcyBEZWx0YU1lcmdhYmxlLiAqL1xuICAgIGluaXRpYWxWYWx1ZT86IGFueTtcbn0pOiBEZWx0YU1lcmdlYWJsZSB7XG4gICAgc3dpdGNoIChhcmdzLnR5cGUudHlwZU5hbWUpIHtcbiAgICAgICAgY2FzZSBcImxpc3RcIjpcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVBcnJheSh7XG4gICAgICAgICAgICAgICAga2V5OiBhcmdzLmtleSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFyZ3MucGFyZW50LFxuICAgICAgICAgICAgICAgIGNoaWxkVHlwZTogYXJncy50eXBlLnZhbHVlVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIFwiZGljdGlvbmFyeVwiOlxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU9iamVjdCh7XG4gICAgICAgICAgICAgICAga2V5OiBhcmdzLmtleSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFyZ3MucGFyZW50LFxuICAgICAgICAgICAgICAgIGNoaWxkVHlwZTogYXJncy50eXBlLnZhbHVlVHlwZSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBjYXNlIFwiZ2FtZU9iamVjdFwiOlxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU9iamVjdCh7XG4gICAgICAgICAgICAgICAga2V5OiBhcmdzLmtleSxcbiAgICAgICAgICAgICAgICBpbml0aWFsVmFsdWU6IGFyZ3MuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogYXJncy5wYXJlbnQsXG4gICAgICAgICAgICAgICAgY2hpbGRUeXBlczogYXJncy5jaGlsZFR5cGVzLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2FuaXRpemUoYXJncy50eXBlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEZWx0YU1lcmdlYWJsZSh7XG4gICAgICAgICAgICAgICAga2V5OiBhcmdzLmtleSxcbiAgICAgICAgICAgICAgICBpbml0aWFsVmFsdWU6IGFyZ3MuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogYXJncy5wYXJlbnQsXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzYW5pdGl6ZShhcmdzLnR5cGUpLFxuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIl19