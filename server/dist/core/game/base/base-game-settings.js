"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("~/core");
const utils_1 = require("~/utils");
/**
 * The base game settings manager that validates game settings and holds their
 * values.
 */
class BaseGameSettingsManager {
    /**
     * Creates a game settings manager with optional initial values
     * @param values Optional initial values for the settings
     */
    constructor(values) {
        /**
         * The current settings' values
         */
        this.values = this.initialValues(this.schema, true);
        if (values) {
            Object.assign(this.values, values);
        }
    }
    /**
     * The schema used to build and validate settings' values.
     */
    get schema() {
        return this.makeSchema({
            playerStartingTime: {
                default: 6e10,
                min: 0,
                description: "The starting time (in ns) for each player.",
            },
            playerNames: {
                default: [],
                description: "The names of the players (overrides strings they send).",
            },
            randomSeed: {
                default: "",
                description: "The random seed, or empty for a random seed.",
            },
        });
    }
    /**
     * Attempts to validates settings for this instance, or returns an Error.
     *
     * @param invalidatedSettings key values pairs to attempt to validate, and
     * then if valid to be added to our settings
     * @returns An error if the settings were invalid, otherwise the validated
     * game settings as an object.
     */
    addSettings(invalidatedSettings) {
        const validated = this.invalidateSettings(invalidatedSettings);
        if (validated instanceof Error) {
            return validated;
        }
        else {
            Object.assign(this.values, validated);
        }
    }
    /**
     * Attempts to validates settings for this instance, or returns an Error.
     *
     * @param invalidatedSettings key values pairs to attempt to validate, and
     * then if valid to be added to our settings
     * @returns An error if the settings were invalid, otherwise the validated
     * game settings as an object.
     */
    invalidateSettings(invalidatedSettings) {
        const sanitized = {};
        for (const [key, value] of Object.entries(invalidatedSettings)) {
            if (!utils_1.objectHasProperty(this.schema, key)) {
                return new Error(`Unknown setting '${key}'.`);
            }
            const str = utils_1.quoteIfString(value);
            const schema = this.schema[key];
            let sanitizedValue = "";
            switch (typeof schema.default) {
                case "number":
                    sanitizedValue = Number(value) || 0;
                    if (schema.min !== undefined && sanitizedValue < schema.min) {
                        return new Error(`${key} setting is invalid (${str}). Must be >= ${schema.min}`);
                    }
                    if (schema.max !== undefined && sanitizedValue > schema.max) {
                        return new Error(`${key} setting is invalid (${str}). Must be <= ${schema.max}`);
                    }
                    break;
                case "string":
                    sanitizedValue = String(value);
                    break;
                case "boolean":
                    sanitizedValue = value === "" // special case from url parm, means key was present with no value
                        ? true
                        : core_1.sanitizeBoolean(value, false);
                    break;
                case "object": // string array is this case
                    sanitizedValue = Array.isArray(value)
                        ? value.map(String) // convert all values to a string
                        : [];
            }
            sanitized[key] = sanitizedValue;
        }
        // now we've sanitized all the inputs, so see if they all are valid types.
        return this.invalidate(sanitized);
    }
    /**
     * Gets the help string to send to clients that do not know what valid
     * settings are
     * @returns a string formatted in a human readable fashion
     */
    getHelp() {
        const lines = [];
        for (const [key, schema] of Object.entries(this.schema)) {
            let type = Array.isArray(schema.default)
                ? "string[]"
                : typeof schema.default;
            if (schema.default !== "" &&
                (!Array.isArray(schema.default) || schema.default.length > 0)) {
                type += ` = ${schema.default}`;
            }
            lines.push(`- ${key} (${type}): ${schema.description}`);
        }
        return lines.join("\n");
    }
    /** Resets the values to their initial (default) values. */
    reset() {
        this.values = this.initialValues(this.schema, true);
    }
    /**
     * Gets the hypothetical max amount of time (in ns) that a player can use
     * doing client side logic.
     *
     * @returns The number representing how much time they can use, in ns.
     */
    getMaxPlayerTime() {
        return this.values.playerStartingTime;
    }
    /**
     * Makes a schema object from an interface.
     *
     * @param schema - The schema to make it from.
     * @returns the schema, now frozen
     */
    makeSchema(schema) {
        return Object.freeze(schema);
    }
    /**
     * Generates initial values from defaults in a settings schema.
     *
     * @param schema - The schema to build defaults from.
     * @param pure - If this should be pure and not consider current values
     * @returns The defaults from that schema.
     */
    initialValues(schema, pure) {
        const values = {};
        for (const [key, value] of Object.entries(schema)) {
            values[key] = (pure || !utils_1.objectHasProperty(this.values, key))
                ? value.default
                : this.values[key];
        }
        // lol, try accurately casting to that monstrosity of a type
        // tslint:disable-next-line:no-any
        return values;
    }
    /**
     * Attempts to invalidate some settings sent to us.
     *
     * @param someSettings - A subset of the valid settings to attempt to
     * validate.
     * @returns an Error if invalid, otherwise the validated settings.
     */
    invalidate(someSettings) {
        // Use our current values and the new ones to form a settings
        // object to try to validate against
        const settings = { ...this.values, ...someSettings };
        if (settings.playerStartingTime <= 0) {
            return new Error(`player starting time is invalid: ${settings.playerStartingTime}. Must be > 0.`);
        }
        return settings;
    }
}
exports.BaseGameSettingsManager = BaseGameSettingsManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1nYW1lLXNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvZ2FtZS9iYXNlL2Jhc2UtZ2FtZS1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUF5QztBQUN6QyxtQ0FDd0I7QUFnQ3hCOzs7R0FHRztBQUNILE1BQWEsdUJBQXVCO0lBMkJoQzs7O09BR0c7SUFDSCxZQUFtQixNQUFzQjtRQVR6Qzs7V0FFRztRQUNJLFdBQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFPbEQsSUFBSSxNQUFNLEVBQUU7WUFDUixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDdEM7SUFDTCxDQUFDO0lBbENEOztPQUVHO0lBQ0gsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ25CLGtCQUFrQixFQUFFO2dCQUNoQixPQUFPLEVBQUUsSUFBSTtnQkFDYixHQUFHLEVBQUUsQ0FBQztnQkFDTixXQUFXLEVBQUUsNENBQTRDO2FBQzVEO1lBQ0QsV0FBVyxFQUFFO2dCQUNULE9BQU8sRUFBRSxFQUFFO2dCQUNYLFdBQVcsRUFBRSx5REFBeUQ7YUFDekU7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsV0FBVyxFQUFFLDhDQUE4QzthQUM5RDtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFpQkQ7Ozs7Ozs7T0FPRztJQUNJLFdBQVcsQ0FBQyxtQkFBNkM7UUFDNUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFL0QsSUFBSSxTQUFTLFlBQVksS0FBSyxFQUFFO1lBQzVCLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO2FBQ0k7WUFDRCxNQUFNLENBQUMsTUFB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LENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDTyxVQUFVLENBQ2hCLFlBQXNDO1FBRXRDLDZEQUE2RDtRQUM3RCxvQ0FBb0M7UUFDcEMsTUFBTSxRQUFRLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUVyRCxJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLEVBQUU7WUFDbEMsT0FBTyxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsUUFBUSxDQUFDLGtCQUFrQixnQkFBZ0IsQ0FBQyxDQUFDO1NBQ3JHO1FBRUQsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztDQUNKO0FBMU1ELDBEQTBNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNhbml0aXplQm9vbGVhbiB9IGZyb20gXCJ+L2NvcmVcIjtcbmltcG9ydCB7IEltbXV0YWJsZSwgb2JqZWN0SGFzUHJvcGVydHksIHF1b3RlSWZTdHJpbmcsIFVua25vd25PYmplY3QsXG4gICAgICAgfSBmcm9tIFwifi91dGlsc1wiO1xuXG4vKiogVGhlIG9ubHkgYWxsb3dlZCB2YWx1ZSB0eXBlcyBzZXR0aW5ncyBjYW4gYmUgb2YuICovXG5leHBvcnQgdHlwZSBQb3NzaWJsZVNldHRpbmdWYWx1ZSA9IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBzdHJpbmdbXTtcblxuLyoqIEFuIGluZGl2aWR1YWwgc2V0dGluZyBpbiBhIHNjaGVtYS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNldHRpbmdzU2NoZW1hPFQgZXh0ZW5kcyBQb3NzaWJsZVNldHRpbmdWYWx1ZSA9IFBvc3NpYmxlU2V0dGluZ1ZhbHVlPiB7XG4gICAgLyoqIFRoZSBkZWZhdWx0IHZhbHVlIGZvciB0aGlzIHNldHRpbmcuICovXG4gICAgcmVhZG9ubHkgZGVmYXVsdDogVDtcbiAgICAvKiogVGhlIGh1bWFuIHJlYWRhYmxlIGRlc2NyaXB0aW9uIGFib3V0IHdoYXQgdGhpcyBzZXR0aW5nIGNvbnRyb2xzLiAqL1xuICAgIHJlYWRvbmx5IGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gICAgLyoqIElmIGEgbnVtYmVyIHR5cGUsIHRoaXMgaXMgdGhlIG1pbmltdW0gdmFsdWUuICovXG4gICAgcmVhZG9ubHkgbWluPzogVCBleHRlbmRzIG51bWJlciA/IG51bWJlciA6IG5ldmVyO1xuICAgIC8qKiBJZiBhIG51bWJlciB0eXBlLCB0aGlzIGlzIHRoZSBtYXhpbXVtIHZhbHVlLiAqL1xuICAgIHJlYWRvbmx5IG1heD86IFQgZXh0ZW5kcyBudW1iZXIgPyBudW1iZXIgOiBuZXZlcjtcbn1cblxuLyoqIFRoZSBiYXNlIHNldHRpbmdzIHNjaGVtYXMgYWxsIGltcGxlbWVudC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVNldHRpbmdzU2NoZW1hcyB7XG4gICAgW2tleTogc3RyaW5nXTogSVNldHRpbmdzU2NoZW1hO1xufVxuXG4vKiogR2l2ZW4gc2V0dGluZ3Mgc2NoZW1hIHRoZSB0eXBlIG9iamVjdCB3ZSdkIGV4cGVjdCBmb3IgdGhhdCBzY2hlbWEuICovXG5leHBvcnQgdHlwZSBTZXR0aW5nc0Zyb21TY2hlbWE8VCBleHRlbmRzIElTZXR0aW5nc1NjaGVtYXM+ID0ge1xuICAgIFtLIGluIGtleW9mIFRdIDogVFtLXSBleHRlbmRzIElTZXR0aW5nc1NjaGVtYTxpbmZlciBXPlxuICAgICAgICA/IChXIGV4dGVuZHMgbmV2ZXJbXVxuICAgICAgICAgICAgPyBzdHJpbmdbXVxuICAgICAgICAgICAgOiBXXG4gICAgICAgIClcbiAgICAgICAgOiBuZXZlclxufTtcblxuLyoqXG4gKiBUaGUgYmFzZSBnYW1lIHNldHRpbmdzIG1hbmFnZXIgdGhhdCB2YWxpZGF0ZXMgZ2FtZSBzZXR0aW5ncyBhbmQgaG9sZHMgdGhlaXJcbiAqIHZhbHVlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VHYW1lU2V0dGluZ3NNYW5hZ2VyIHtcbiAgICAvKipcbiAgICAgKiBUaGUgc2NoZW1hIHVzZWQgdG8gYnVpbGQgYW5kIHZhbGlkYXRlIHNldHRpbmdzJyB2YWx1ZXMuXG4gICAgICovXG4gICAgcHVibGljIGdldCBzY2hlbWEoKSB7IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6dHlwZWRlZlxuICAgICAgICByZXR1cm4gdGhpcy5tYWtlU2NoZW1hKHtcbiAgICAgICAgICAgIHBsYXllclN0YXJ0aW5nVGltZToge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IDZlMTAsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBzdGFydGluZyB0aW1lIChpbiBucykgZm9yIGVhY2ggcGxheWVyLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsYXllck5hbWVzOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiVGhlIG5hbWVzIG9mIHRoZSBwbGF5ZXJzIChvdmVycmlkZXMgc3RyaW5ncyB0aGV5IHNlbmQpLlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmRvbVNlZWQ6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIlwiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSByYW5kb20gc2VlZCwgb3IgZW1wdHkgZm9yIGEgcmFuZG9tIHNlZWQuXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCBzZXR0aW5ncycgdmFsdWVzXG4gICAgICovXG4gICAgcHVibGljIHZhbHVlcyA9IHRoaXMuaW5pdGlhbFZhbHVlcyh0aGlzLnNjaGVtYSwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZ2FtZSBzZXR0aW5ncyBtYW5hZ2VyIHdpdGggb3B0aW9uYWwgaW5pdGlhbCB2YWx1ZXNcbiAgICAgKiBAcGFyYW0gdmFsdWVzIE9wdGlvbmFsIGluaXRpYWwgdmFsdWVzIGZvciB0aGUgc2V0dGluZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgY29uc3RydWN0b3IodmFsdWVzPzogVW5rbm93bk9iamVjdCkge1xuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMudmFsdWVzLCB2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gdmFsaWRhdGVzIHNldHRpbmdzIGZvciB0aGlzIGluc3RhbmNlLCBvciByZXR1cm5zIGFuIEVycm9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIGludmFsaWRhdGVkU2V0dGluZ3Mga2V5IHZhbHVlcyBwYWlycyB0byBhdHRlbXB0IHRvIHZhbGlkYXRlLCBhbmRcbiAgICAgKiB0aGVuIGlmIHZhbGlkIHRvIGJlIGFkZGVkIHRvIG91ciBzZXR0aW5nc1xuICAgICAqIEByZXR1cm5zIEFuIGVycm9yIGlmIHRoZSBzZXR0aW5ncyB3ZXJlIGludmFsaWQsIG90aGVyd2lzZSB0aGUgdmFsaWRhdGVkXG4gICAgICogZ2FtZSBzZXR0aW5ncyBhcyBhbiBvYmplY3QuXG4gICAgICovXG4gICAgcHVibGljIGFkZFNldHRpbmdzKGludmFsaWRhdGVkU2V0dGluZ3M6IEltbXV0YWJsZTxVbmtub3duT2JqZWN0Pik6IHZvaWQgfCBFcnJvciB7XG4gICAgICAgIGNvbnN0IHZhbGlkYXRlZCA9IHRoaXMuaW52YWxpZGF0ZVNldHRpbmdzKGludmFsaWRhdGVkU2V0dGluZ3MpO1xuXG4gICAgICAgIGlmICh2YWxpZGF0ZWQgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52YWx1ZXMsIHZhbGlkYXRlZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byB2YWxpZGF0ZXMgc2V0dGluZ3MgZm9yIHRoaXMgaW5zdGFuY2UsIG9yIHJldHVybnMgYW4gRXJyb3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaW52YWxpZGF0ZWRTZXR0aW5ncyBrZXkgdmFsdWVzIHBhaXJzIHRvIGF0dGVtcHQgdG8gdmFsaWRhdGUsIGFuZFxuICAgICAqIHRoZW4gaWYgdmFsaWQgdG8gYmUgYWRkZWQgdG8gb3VyIHNldHRpbmdzXG4gICAgICogQHJldHVybnMgQW4gZXJyb3IgaWYgdGhlIHNldHRpbmdzIHdlcmUgaW52YWxpZCwgb3RoZXJ3aXNlIHRoZSB2YWxpZGF0ZWRcbiAgICAgKiBnYW1lIHNldHRpbmdzIGFzIGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgaW52YWxpZGF0ZVNldHRpbmdzKFxuICAgICAgICBpbnZhbGlkYXRlZFNldHRpbmdzOiBJbW11dGFibGU8VW5rbm93bk9iamVjdD4sXG4gICAgKTogUmVhZG9ubHk8VW5rbm93bk9iamVjdD4gfCBFcnJvciB7XG4gICAgICAgIGNvbnN0IHNhbml0aXplZDogVW5rbm93bk9iamVjdCA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGludmFsaWRhdGVkU2V0dGluZ3MpKSB7XG4gICAgICAgICAgICBpZiAoIW9iamVjdEhhc1Byb3BlcnR5KHRoaXMuc2NoZW1hLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgVW5rbm93biBzZXR0aW5nICcke2tleX0nLmApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzdHIgPSBxdW90ZUlmU3RyaW5nKHZhbHVlKTtcblxuICAgICAgICAgICAgY29uc3Qgc2NoZW1hID0gKHRoaXMuc2NoZW1hIGFzIElTZXR0aW5nc1NjaGVtYXMpW2tleV07XG4gICAgICAgICAgICBsZXQgc2FuaXRpemVkVmFsdWU6IFBvc3NpYmxlU2V0dGluZ1ZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIHNjaGVtYS5kZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgICAgICAgICBzYW5pdGl6ZWRWYWx1ZSA9IE51bWJlcih2YWx1ZSkgfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjaGVtYS5taW4gIT09IHVuZGVmaW5lZCAmJiBzYW5pdGl6ZWRWYWx1ZSA8IHNjaGVtYS5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoYCR7a2V5fSBzZXR0aW5nIGlzIGludmFsaWQgKCR7c3RyfSkuIE11c3QgYmUgPj0gJHtzY2hlbWEubWlufWApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY2hlbWEubWF4ICE9PSB1bmRlZmluZWQgJiYgc2FuaXRpemVkVmFsdWUgPiBzY2hlbWEubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKGAke2tleX0gc2V0dGluZyBpcyBpbnZhbGlkICgke3N0cn0pLiBNdXN0IGJlIDw9ICR7c2NoZW1hLm1heH1gKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICAgICAgICAgIHNhbml0aXplZFZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICAgICAgc2FuaXRpemVkVmFsdWUgPSB2YWx1ZSA9PT0gXCJcIiAvLyBzcGVjaWFsIGNhc2UgZnJvbSB1cmwgcGFybSwgbWVhbnMga2V5IHdhcyBwcmVzZW50IHdpdGggbm8gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBzYW5pdGl6ZUJvb2xlYW4odmFsdWUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOiAvLyBzdHJpbmcgYXJyYXkgaXMgdGhpcyBjYXNlXG4gICAgICAgICAgICAgICAgICAgIHNhbml0aXplZFZhbHVlID0gQXJyYXkuaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdmFsdWUubWFwKFN0cmluZykgLy8gY29udmVydCBhbGwgdmFsdWVzIHRvIGEgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzYW5pdGl6ZWRba2V5XSA9IHNhbml0aXplZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbm93IHdlJ3ZlIHNhbml0aXplZCBhbGwgdGhlIGlucHV0cywgc28gc2VlIGlmIHRoZXkgYWxsIGFyZSB2YWxpZCB0eXBlcy5cbiAgICAgICAgcmV0dXJuIHRoaXMuaW52YWxpZGF0ZShzYW5pdGl6ZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGhlbHAgc3RyaW5nIHRvIHNlbmQgdG8gY2xpZW50cyB0aGF0IGRvIG5vdCBrbm93IHdoYXQgdmFsaWRcbiAgICAgKiBzZXR0aW5ncyBhcmVcbiAgICAgKiBAcmV0dXJucyBhIHN0cmluZyBmb3JtYXR0ZWQgaW4gYSBodW1hbiByZWFkYWJsZSBmYXNoaW9uXG4gICAgICovXG4gICAgcHVibGljIGdldEhlbHAoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBzY2hlbWFdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuc2NoZW1hKSkge1xuICAgICAgICAgICAgbGV0IHR5cGUgPSBBcnJheS5pc0FycmF5KHNjaGVtYS5kZWZhdWx0KVxuICAgICAgICAgICAgICAgID8gXCJzdHJpbmdbXVwiXG4gICAgICAgICAgICAgICAgOiB0eXBlb2Ygc2NoZW1hLmRlZmF1bHQ7XG5cbiAgICAgICAgICAgIGlmIChzY2hlbWEuZGVmYXVsdCAhPT0gXCJcIiAmJlxuICAgICAgICAgICAgICAgKCFBcnJheS5pc0FycmF5KHNjaGVtYS5kZWZhdWx0KSB8fCBzY2hlbWEuZGVmYXVsdC5sZW5ndGggPiAwKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdHlwZSArPSBgID0gJHtzY2hlbWEuZGVmYXVsdH1gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAtICR7a2V5fSAoJHt0eXBlfSk6ICR7c2NoZW1hLmRlc2NyaXB0aW9ufWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmVzLmpvaW4oXCJcXG5cIik7XG4gICAgfVxuXG4gICAgLyoqIFJlc2V0cyB0aGUgdmFsdWVzIHRvIHRoZWlyIGluaXRpYWwgKGRlZmF1bHQpIHZhbHVlcy4gKi9cbiAgICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdGhpcy5pbml0aWFsVmFsdWVzKHRoaXMuc2NoZW1hLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBoeXBvdGhldGljYWwgbWF4IGFtb3VudCBvZiB0aW1lIChpbiBucykgdGhhdCBhIHBsYXllciBjYW4gdXNlXG4gICAgICogZG9pbmcgY2xpZW50IHNpZGUgbG9naWMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgbnVtYmVyIHJlcHJlc2VudGluZyBob3cgbXVjaCB0aW1lIHRoZXkgY2FuIHVzZSwgaW4gbnMuXG4gICAgICovXG4gICAgcHVibGljIGdldE1heFBsYXllclRpbWUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLnBsYXllclN0YXJ0aW5nVGltZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNYWtlcyBhIHNjaGVtYSBvYmplY3QgZnJvbSBhbiBpbnRlcmZhY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NoZW1hIC0gVGhlIHNjaGVtYSB0byBtYWtlIGl0IGZyb20uXG4gICAgICogQHJldHVybnMgdGhlIHNjaGVtYSwgbm93IGZyb3plblxuICAgICAqL1xuICAgIHByb3RlY3RlZCBtYWtlU2NoZW1hPFQgZXh0ZW5kcyBJU2V0dGluZ3NTY2hlbWFzPihzY2hlbWE6IFQpOiBSZWFkb25seTxUPiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZnJlZXplKHNjaGVtYSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2VuZXJhdGVzIGluaXRpYWwgdmFsdWVzIGZyb20gZGVmYXVsdHMgaW4gYSBzZXR0aW5ncyBzY2hlbWEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NoZW1hIC0gVGhlIHNjaGVtYSB0byBidWlsZCBkZWZhdWx0cyBmcm9tLlxuICAgICAqIEBwYXJhbSBwdXJlIC0gSWYgdGhpcyBzaG91bGQgYmUgcHVyZSBhbmQgbm90IGNvbnNpZGVyIGN1cnJlbnQgdmFsdWVzXG4gICAgICogQHJldHVybnMgVGhlIGRlZmF1bHRzIGZyb20gdGhhdCBzY2hlbWEuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGluaXRpYWxWYWx1ZXM8VCBleHRlbmRzIElTZXR0aW5nc1NjaGVtYXM+KFxuICAgICAgICBzY2hlbWE6IFQsXG4gICAgICAgIHB1cmU/OiBib29sZWFuLFxuICAgICk6IFNldHRpbmdzRnJvbVNjaGVtYTxUPiB7XG4gICAgICAgIGNvbnN0IHZhbHVlczogVW5rbm93bk9iamVjdCA9IHt9O1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhzY2hlbWEpKSB7XG4gICAgICAgICAgICB2YWx1ZXNba2V5XSA9IChwdXJlIHx8ICFvYmplY3RIYXNQcm9wZXJ0eSh0aGlzLnZhbHVlcywga2V5KSlcbiAgICAgICAgICAgICAgICA/IHZhbHVlLmRlZmF1bHRcbiAgICAgICAgICAgICAgICA6IHRoaXMudmFsdWVzW2tleV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsb2wsIHRyeSBhY2N1cmF0ZWx5IGNhc3RpbmcgdG8gdGhhdCBtb25zdHJvc2l0eSBvZiBhIHR5cGVcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgICAgICByZXR1cm4gdmFsdWVzIGFzIGFueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBpbnZhbGlkYXRlIHNvbWUgc2V0dGluZ3Mgc2VudCB0byB1cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzb21lU2V0dGluZ3MgLSBBIHN1YnNldCBvZiB0aGUgdmFsaWQgc2V0dGluZ3MgdG8gYXR0ZW1wdCB0b1xuICAgICAqIHZhbGlkYXRlLlxuICAgICAqIEByZXR1cm5zIGFuIEVycm9yIGlmIGludmFsaWQsIG90aGVyd2lzZSB0aGUgdmFsaWRhdGVkIHNldHRpbmdzLlxuICAgICAqL1xuICAgIHByb3RlY3RlZCBpbnZhbGlkYXRlKFxuICAgICAgICBzb21lU2V0dGluZ3M6IEltbXV0YWJsZTxVbmtub3duT2JqZWN0PixcbiAgICApOiBSZWFkb25seTxVbmtub3duT2JqZWN0PiB8IEVycm9yIHtcbiAgICAgICAgLy8gVXNlIG91ciBjdXJyZW50IHZhbHVlcyBhbmQgdGhlIG5ldyBvbmVzIHRvIGZvcm0gYSBzZXR0aW5nc1xuICAgICAgICAvLyBvYmplY3QgdG8gdHJ5IHRvIHZhbGlkYXRlIGFnYWluc3RcbiAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSB7IC4uLnRoaXMudmFsdWVzLCAuLi5zb21lU2V0dGluZ3MgfTtcblxuICAgICAgICBpZiAoc2V0dGluZ3MucGxheWVyU3RhcnRpbmdUaW1lIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoYHBsYXllciBzdGFydGluZyB0aW1lIGlzIGludmFsaWQ6ICR7c2V0dGluZ3MucGxheWVyU3RhcnRpbmdUaW1lfS4gTXVzdCBiZSA+IDAuYCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufVxuIl19