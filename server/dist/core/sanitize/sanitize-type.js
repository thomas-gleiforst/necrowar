"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/utils");
const sanitize_array_1 = require("./sanitize-array");
const sanitize_boolean_1 = require("./sanitize-boolean");
const sanitize_game_object_1 = require("./sanitize-game-object");
const sanitize_integer_1 = require("./sanitize-integer");
const sanitize_number_1 = require("./sanitize-number");
const sanitize_object_1 = require("./sanitize-object");
const sanitize_string_1 = require("./sanitize-string");
/**
 * Sanitizes a value to a specified type. If it does not match at all, then the
 * default value for that type is returned.
 *
 * @param type - The type to coerce to.
 * @param obj - The value to coerce from.
 * @param allowError - If errors should be allowed to be returned if they
 * cannot be reasonable sanitized.
 * @returns A value now sanitized and guaranteed to be of that type.
 */
function sanitizeType(type, obj, allowError = true) {
    let value;
    if (type.nullable && utils_1.isNil(obj)) {
        return undefined;
    }
    switch (type.typeName) {
        case "void":
            return undefined;
        case "boolean":
            value = sanitize_boolean_1.sanitizeBoolean(obj, allowError);
            break;
        case "float":
            value = sanitize_number_1.sanitizeNumber(obj, allowError);
            break;
        case "int":
            value = sanitize_integer_1.sanitizeInteger(obj, allowError);
            break;
        case "string":
            value = sanitize_string_1.sanitizeString(obj, allowError);
            break;
        case "dictionary":
            const asObj = sanitize_object_1.sanitizeObject(obj, allowError);
            if (asObj instanceof Error) {
                return asObj;
            }
            for (const key of Object.keys(asObj)) {
                asObj[key] = sanitizeType(type.valueType, asObj[key], allowError);
            }
            value = asObj;
            break;
        case "list":
            const asArray = sanitize_array_1.sanitizeArray(obj, allowError);
            if (asArray instanceof Error) {
                return asArray;
            }
            // Re-use the array because it may be one of our Proxy wrapped
            // arrays, otherwise map() would be prefered
            for (let i = 0; i < asArray.length; i++) {
                asArray[i] = sanitizeType(type.valueType, asArray[i], allowError);
            }
            break;
        case "gameObject": // assume game object
            value = sanitize_game_object_1.sanitizeGameObject(obj, type.gameObjectClass, allowError);
            break;
        default:
            throw new Error(`Sanitizing unknown type ${type}.`);
    }
    if ((type.typeName === "string" ||
        type.typeName === "float" ||
        type.typeName === "int" ||
        type.typeName === "boolean") && type.literals) {
        const literals = type.literals;
        let found = literals.includes(value);
        if (!found && type.typeName === "string") {
            // Try to see if the string is found via a case-insensitive
            // search.
            const lowered = value.toLowerCase();
            const matchingLiteral = literals.find((literal) => literal.toLowerCase() === lowered);
            if (matchingLiteral !== undefined) { // we found it!
                found = true;
                value = matchingLiteral;
            }
        }
        if (!found) {
            if (allowError) {
                // the value they sent was not one of the literals
                return new Error(`${value} is not an expected value from literals [${literals.join(", ")}]`);
            }
            else {
                // Couldn't be found at all, default to first literal value.
                return literals[0];
            }
        }
    }
    if (allowError && !type.nullable && value === undefined) {
        return new Error("Value cannot be undefined.");
    }
    return value;
}
exports.sanitizeType = sanitizeType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUtdHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3Nhbml0aXplL3Nhbml0aXplLXR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBMkM7QUFFM0MscURBQWlEO0FBQ2pELHlEQUFxRDtBQUNyRCxpRUFBNEQ7QUFDNUQseURBQXFEO0FBQ3JELHVEQUFtRDtBQUNuRCx1REFBbUQ7QUFDbkQsdURBQW1EO0FBRW5EOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLFlBQVksQ0FDeEIsSUFBaUMsRUFDakMsR0FBWSxFQUNaLGFBQXNCLElBQUk7SUFFMUIsSUFBSSxLQUFjLENBQUM7SUFFbkIsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLGFBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM3QixPQUFPLFNBQVMsQ0FBQztLQUNwQjtJQUVELFFBQVEsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNuQixLQUFLLE1BQU07WUFDUCxPQUFPLFNBQVMsQ0FBQztRQUNyQixLQUFLLFNBQVM7WUFDVixLQUFLLEdBQUcsa0NBQWUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDekMsTUFBTTtRQUNWLEtBQUssT0FBTztZQUNSLEtBQUssR0FBRyxnQ0FBYyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN4QyxNQUFNO1FBQ1YsS0FBSyxLQUFLO1lBQ04sS0FBSyxHQUFHLGtDQUFlLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3pDLE1BQU07UUFDVixLQUFLLFFBQVE7WUFDVCxLQUFLLEdBQUcsZ0NBQWMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDeEMsTUFBTTtRQUNWLEtBQUssWUFBWTtZQUNiLE1BQU0sS0FBSyxHQUFHLGdDQUFjLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtnQkFD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c1wiO1xuaW1wb3J0IHsgSVNhbml0aXphYmxlVHlwZSB9IGZyb20gXCIuL3Nhbml0aXphYmxlLWludGVyZmFjZXNcIjtcbmltcG9ydCB7IHNhbml0aXplQXJyYXkgfSBmcm9tIFwiLi9zYW5pdGl6ZS1hcnJheVwiO1xuaW1wb3J0IHsgc2FuaXRpemVCb29sZWFuIH0gZnJvbSBcIi4vc2FuaXRpemUtYm9vbGVhblwiO1xuaW1wb3J0IHsgc2FuaXRpemVHYW1lT2JqZWN0IH0gZnJvbSBcIi4vc2FuaXRpemUtZ2FtZS1vYmplY3RcIjtcbmltcG9ydCB7IHNhbml0aXplSW50ZWdlciB9IGZyb20gXCIuL3Nhbml0aXplLWludGVnZXJcIjtcbmltcG9ydCB7IHNhbml0aXplTnVtYmVyIH0gZnJvbSBcIi4vc2FuaXRpemUtbnVtYmVyXCI7XG5pbXBvcnQgeyBzYW5pdGl6ZU9iamVjdCB9IGZyb20gXCIuL3Nhbml0aXplLW9iamVjdFwiO1xuaW1wb3J0IHsgc2FuaXRpemVTdHJpbmcgfSBmcm9tIFwiLi9zYW5pdGl6ZS1zdHJpbmdcIjtcblxuLyoqXG4gKiBTYW5pdGl6ZXMgYSB2YWx1ZSB0byBhIHNwZWNpZmllZCB0eXBlLiBJZiBpdCBkb2VzIG5vdCBtYXRjaCBhdCBhbGwsIHRoZW4gdGhlXG4gKiBkZWZhdWx0IHZhbHVlIGZvciB0aGF0IHR5cGUgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSB0byBjb2VyY2UgdG8uXG4gKiBAcGFyYW0gb2JqIC0gVGhlIHZhbHVlIHRvIGNvZXJjZSBmcm9tLlxuICogQHBhcmFtIGFsbG93RXJyb3IgLSBJZiBlcnJvcnMgc2hvdWxkIGJlIGFsbG93ZWQgdG8gYmUgcmV0dXJuZWQgaWYgdGhleVxuICogY2Fubm90IGJlIHJlYXNvbmFibGUgc2FuaXRpemVkLlxuICogQHJldHVybnMgQSB2YWx1ZSBub3cgc2FuaXRpemVkIGFuZCBndWFyYW50ZWVkIHRvIGJlIG9mIHRoYXQgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplVHlwZShcbiAgICB0eXBlOiBJbW11dGFibGU8SVNhbml0aXphYmxlVHlwZT4sXG4gICAgb2JqOiB1bmtub3duLFxuICAgIGFsbG93RXJyb3I6IGJvb2xlYW4gPSB0cnVlLFxuKTogdW5rbm93biB7XG4gICAgbGV0IHZhbHVlOiB1bmtub3duO1xuXG4gICAgaWYgKHR5cGUubnVsbGFibGUgJiYgaXNOaWwob2JqKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHN3aXRjaCAodHlwZS50eXBlTmFtZSkge1xuICAgICAgICBjYXNlIFwidm9pZFwiOlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgIHZhbHVlID0gc2FuaXRpemVCb29sZWFuKG9iaiwgYWxsb3dFcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZsb2F0XCI6XG4gICAgICAgICAgICB2YWx1ZSA9IHNhbml0aXplTnVtYmVyKG9iaiwgYWxsb3dFcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImludFwiOlxuICAgICAgICAgICAgdmFsdWUgPSBzYW5pdGl6ZUludGVnZXIob2JqLCBhbGxvd0Vycm9yKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICB2YWx1ZSA9IHNhbml0aXplU3RyaW5nKG9iaiwgYWxsb3dFcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRpY3Rpb25hcnlcIjpcbiAgICAgICAgICAgIGNvbnN0IGFzT2JqID0gc2FuaXRpemVPYmplY3Qob2JqLCBhbGxvd0Vycm9yKTtcbiAgICAgICAgICAgIGlmIChhc09iaiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzT2JqO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhc09iaikpIHtcbiAgICAgICAgICAgICAgICBhc09ialtrZXldID0gc2FuaXRpemVUeXBlKFxuICAgICAgICAgICAgICAgICAgICB0eXBlLnZhbHVlVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgYXNPYmpba2V5XSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dFcnJvcixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBhc09iajtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibGlzdFwiOlxuICAgICAgICAgICAgY29uc3QgYXNBcnJheSA9IHNhbml0aXplQXJyYXkob2JqLCBhbGxvd0Vycm9yKTtcbiAgICAgICAgICAgIGlmIChhc0FycmF5IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXNBcnJheTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmUtdXNlIHRoZSBhcnJheSBiZWNhdXNlIGl0IG1heSBiZSBvbmUgb2Ygb3VyIFByb3h5IHdyYXBwZWRcbiAgICAgICAgICAgIC8vIGFycmF5cywgb3RoZXJ3aXNlIG1hcCgpIHdvdWxkIGJlIHByZWZlcmVkXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFzQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhc0FycmF5W2ldID0gc2FuaXRpemVUeXBlKFxuICAgICAgICAgICAgICAgICAgICB0eXBlLnZhbHVlVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgYXNBcnJheVtpXSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dFcnJvcixcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJnYW1lT2JqZWN0XCI6IC8vIGFzc3VtZSBnYW1lIG9iamVjdFxuICAgICAgICAgICAgdmFsdWUgPSBzYW5pdGl6ZUdhbWVPYmplY3Qob2JqLCB0eXBlLmdhbWVPYmplY3RDbGFzcywgYWxsb3dFcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU2FuaXRpemluZyB1bmtub3duIHR5cGUgJHt0eXBlfS5gKTtcbiAgICB9XG5cbiAgICBpZiAoKFxuICAgICAgICB0eXBlLnR5cGVOYW1lID09PSBcInN0cmluZ1wiIHx8XG4gICAgICAgIHR5cGUudHlwZU5hbWUgPT09IFwiZmxvYXRcIiB8fFxuICAgICAgICB0eXBlLnR5cGVOYW1lID09PSBcImludFwiIHx8XG4gICAgICAgIHR5cGUudHlwZU5hbWUgPT09IFwiYm9vbGVhblwiXG4gICAgKSAmJiB0eXBlLmxpdGVyYWxzKSB7XG4gICAgICAgIGNvbnN0IGxpdGVyYWxzID0gdHlwZS5saXRlcmFscztcbiAgICAgICAgbGV0IGZvdW5kID0gbGl0ZXJhbHMuaW5jbHVkZXModmFsdWUgYXMgKGJvb2xlYW4gfCBudW1iZXIgfCBzdHJpbmcpKTtcblxuICAgICAgICBpZiAoIWZvdW5kICYmIHR5cGUudHlwZU5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBzZWUgaWYgdGhlIHN0cmluZyBpcyBmb3VuZCB2aWEgYSBjYXNlLWluc2Vuc2l0aXZlXG4gICAgICAgICAgICAvLyBzZWFyY2guXG4gICAgICAgICAgICBjb25zdCBsb3dlcmVkID0gKHZhbHVlIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoaW5nTGl0ZXJhbCA9IGxpdGVyYWxzLmZpbmQoKGxpdGVyYWwpID0+XG4gICAgICAgICAgICAgICAgKGxpdGVyYWwgYXMgc3RyaW5nKS50b0xvd2VyQ2FzZSgpID09PSBsb3dlcmVkLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ0xpdGVyYWwgIT09IHVuZGVmaW5lZCkgeyAvLyB3ZSBmb3VuZCBpdCFcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGluZ0xpdGVyYWw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZvdW5kKSB7XG4gICAgICAgICAgICBpZiAoYWxsb3dFcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIHRoZSB2YWx1ZSB0aGV5IHNlbnQgd2FzIG5vdCBvbmUgb2YgdGhlIGxpdGVyYWxzXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgJHt2YWx1ZX0gaXMgbm90IGFuIGV4cGVjdGVkIHZhbHVlIGZyb20gbGl0ZXJhbHMgWyR7bGl0ZXJhbHMuam9pbihcIiwgXCIpfV1gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBDb3VsZG4ndCBiZSBmb3VuZCBhdCBhbGwsIGRlZmF1bHQgdG8gZmlyc3QgbGl0ZXJhbCB2YWx1ZS5cbiAgICAgICAgICAgICAgICByZXR1cm4gbGl0ZXJhbHNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWxsb3dFcnJvciAmJiAhdHlwZS5udWxsYWJsZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJWYWx1ZSBjYW5ub3QgYmUgdW5kZWZpbmVkLlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG59XG4iXX0=