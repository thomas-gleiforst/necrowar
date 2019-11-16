"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Takes a variable and tries to cast it to a boolean. If the passed in value
 * is not boolean-like at all, returns an Error
 *
 * @param b - Any variable to try to cast to a boolean,
 * for example "TruE" will be `true`.
 * @param allowError - If errors should be allowed to be returned if they
 * cannot be reasonable sanitized.
 * @returns A boolean that represents what was sent, or an error if no default could be found
 */
function sanitizeBoolean(b, allowError = true) {
    switch (typeof b) {
        case "string":
            // we know this cast is safe, ts does not know how to follow
            // switch statements for type inferring ATM
            const lowered = b.toLowerCase();
            if (lowered === "true") {
                // They sent some form of "true" as a string,
                // so make it the boolean true
                return true;
            }
            else if (lowered === "false") {
                // They sent some form of "false" as a string,
                // so make it the boolean false
                return false;
            }
            return Boolean(b);
        case "number":
            return b !== 0;
        case "object":
            return allowError
                ? new Error(`'${b}' is an Object and cannot be reasonably cast to a boolean`)
                : true; // true because objects are truth-y in JS
        default:
            return Boolean(b);
    }
}
exports.sanitizeBoolean = sanitizeBoolean;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUtYm9vbGVhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3Nhbml0aXplL3Nhbml0aXplLWJvb2xlYW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUErQkE7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBZ0IsZUFBZSxDQUMzQixDQUFVLEVBQ1YsYUFBc0IsSUFBSTtJQUUxQixRQUFRLE9BQU8sQ0FBQyxFQUFFO1FBQ2QsS0FBSyxRQUFRO1lBQ1QsNERBQTREO1lBQzVELDJDQUEyQztZQUMzQyxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDaEMsSUFBSSxPQUFPLEtBQUssTUFBTSxFQUFFO2dCQUNwQiw2Q0FBNkM7Z0JBQzdDLDhCQUE4QjtnQkFDOUIsT0FBTyxJQUFJLENBQUM7YUFDZjtpQkFDSSxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7Z0JBQzFCLDhDQUE4QztnQkFDOUMsK0JBQStCO2dCQUMvQixPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUVELE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssUUFBUTtZQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixLQUFLLFFBQVE7WUFDVCxPQUFPLFVBQVU7Z0JBQ2IsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQztnQkFDN0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLHlDQUF5QztRQUN6RDtZQUNJLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3pCO0FBQ0wsQ0FBQztBQTlCRCwwQ0E4QkMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qKlxuICogVGFrZXMgYSB2YXJpYWJsZSBhbmQgdHJpZXMgdG8gY2FzdCBpdCB0byBhIGJvb2xlYW4uIElmIHRoZSBwYXNzZWQgaW4gdmFsdWVcbiAqIGlzIG5vdCBib29sZWFuLWxpa2UgYXQgYWxsLCByZXR1cm5zIGFuIEVycm9yXG4gKlxuICogQHBhcmFtIGIgLSBBbnkgdmFyaWFibGUgdG8gdHJ5IHRvIGNhc3QgdG8gYSBib29sZWFuLFxuICogZm9yIGV4YW1wbGUgXCJUcnVFXCIgd2lsbCBiZSBgdHJ1ZWAuXG4gKiBAcGFyYW0gYWxsb3dFcnJvciAtIElmIGVycm9ycyBzaG91bGQgYmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCBpZiB0aGV5XG4gKiBjYW5ub3QgYmUgcmVhc29uYWJsZSBzYW5pdGl6ZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdGhhdCByZXByZXNlbnRzIHdoYXQgd2FzIHNlbnQsIG9yIGFuIGVycm9yIGlmIG5vIGRlZmF1bHQgY291bGQgYmUgZm91bmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQm9vbGVhbihcbiAgICBiOiB1bmtub3duLFxuICAgIGFsbG93RXJyb3I6IGJvb2xlYW4sXG4pOiBib29sZWFuIHwgRXJyb3I7XG5cbi8qKlxuICogVGFrZXMgYSB2YXJpYWJsZSBhbmQgdHJpZXMgdG8gY2FzdCBpdCB0byBhIGJvb2xlYW4uXG4gKiBBbHdheXMgcmV0dXJucyBhIGJvb2xlYW4uXG4gKlxuICogQHBhcmFtIGIgLSBBbnkgdmFyaWFibGUgdG8gdHJ5IHRvIGNhc3QgdG8gYSBib29sZWFuLFxuICogZm9yIGV4YW1wbGUgXCJUcnVFXCIgd2lsbCBiZSBgdHJ1ZWAuXG4gKiBAcGFyYW0gYWxsb3dFcnJvciAtIElmIGVycm9ycyBzaG91bGQgYmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCBpZiB0aGV5XG4gKiBjYW5ub3QgYmUgcmVhc29uYWJsZSBzYW5pdGl6ZWQuXG4gKiBAcmV0dXJucyBBIGJvb2xlYW4gdGhhdCByZXByZXNlbnRzIHdoYXQgd2FzIHNlbnQsIG9yIGFuIGVycm9yIGlmIG5vIGRlZmF1bHQgY291bGQgYmUgZm91bmRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQm9vbGVhbihcbiAgICBiOiB1bmtub3duLFxuICAgIGFsbG93RXJyb3I6IGZhbHNlLFxuKTogYm9vbGVhbjtcblxuLyoqXG4gKiBUYWtlcyBhIHZhcmlhYmxlIGFuZCB0cmllcyB0byBjYXN0IGl0IHRvIGEgYm9vbGVhbi4gSWYgdGhlIHBhc3NlZCBpbiB2YWx1ZVxuICogaXMgbm90IGJvb2xlYW4tbGlrZSBhdCBhbGwsIHJldHVybnMgYW4gRXJyb3JcbiAqXG4gKiBAcGFyYW0gYiAtIEFueSB2YXJpYWJsZSB0byB0cnkgdG8gY2FzdCB0byBhIGJvb2xlYW4sXG4gKiBmb3IgZXhhbXBsZSBcIlRydUVcIiB3aWxsIGJlIGB0cnVlYC5cbiAqIEBwYXJhbSBhbGxvd0Vycm9yIC0gSWYgZXJyb3JzIHNob3VsZCBiZSBhbGxvd2VkIHRvIGJlIHJldHVybmVkIGlmIHRoZXlcbiAqIGNhbm5vdCBiZSByZWFzb25hYmxlIHNhbml0aXplZC5cbiAqIEByZXR1cm5zIEEgYm9vbGVhbiB0aGF0IHJlcHJlc2VudHMgd2hhdCB3YXMgc2VudCwgb3IgYW4gZXJyb3IgaWYgbm8gZGVmYXVsdCBjb3VsZCBiZSBmb3VuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVCb29sZWFuKFxuICAgIGI6IHVua25vd24sXG4gICAgYWxsb3dFcnJvcjogYm9vbGVhbiA9IHRydWUsXG4pOiBib29sZWFuIHwgRXJyb3Ige1xuICAgIHN3aXRjaCAodHlwZW9mIGIpIHtcbiAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgLy8gd2Uga25vdyB0aGlzIGNhc3QgaXMgc2FmZSwgdHMgZG9lcyBub3Qga25vdyBob3cgdG8gZm9sbG93XG4gICAgICAgICAgICAvLyBzd2l0Y2ggc3RhdGVtZW50cyBmb3IgdHlwZSBpbmZlcnJpbmcgQVRNXG4gICAgICAgICAgICBjb25zdCBsb3dlcmVkID0gYi50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKGxvd2VyZWQgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhleSBzZW50IHNvbWUgZm9ybSBvZiBcInRydWVcIiBhcyBhIHN0cmluZyxcbiAgICAgICAgICAgICAgICAvLyBzbyBtYWtlIGl0IHRoZSBib29sZWFuIHRydWVcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGxvd2VyZWQgPT09IFwiZmFsc2VcIikge1xuICAgICAgICAgICAgICAgIC8vIFRoZXkgc2VudCBzb21lIGZvcm0gb2YgXCJmYWxzZVwiIGFzIGEgc3RyaW5nLFxuICAgICAgICAgICAgICAgIC8vIHNvIG1ha2UgaXQgdGhlIGJvb2xlYW4gZmFsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBCb29sZWFuKGIpO1xuICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICByZXR1cm4gYiAhPT0gMDtcbiAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICAgICAgcmV0dXJuIGFsbG93RXJyb3JcbiAgICAgICAgICAgICAgICA/IG5ldyBFcnJvcihgJyR7Yn0nIGlzIGFuIE9iamVjdCBhbmQgY2Fubm90IGJlIHJlYXNvbmFibHkgY2FzdCB0byBhIGJvb2xlYW5gKVxuICAgICAgICAgICAgICAgIDogdHJ1ZTsgLy8gdHJ1ZSBiZWNhdXNlIG9iamVjdHMgYXJlIHRydXRoLXkgaW4gSlNcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBCb29sZWFuKGIpO1xuICAgIH1cbn1cbiJdfQ==