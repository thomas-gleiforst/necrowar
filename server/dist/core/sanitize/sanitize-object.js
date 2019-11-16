"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/utils");
/**
 * Takes a variable and tries to cast it to an object. If the passed in value is
 * not object-like at all, returns an Error.
 *
 * @param o Any variable, if it is an object passes it back, otherwise returns
 * a new empty object.
 * @param allowError - If errors should be allowed to be returned if they
 * cannot be reasonable sanitized.
 * @returns Always returns an object, if the passed in variable was not an
 * object, constructs and returns a new object.
 */
function sanitizeObject(o, allowError = true) {
    return utils_1.isObject(o)
        ? o
        : (allowError
            ? new Error(`'${o}' cannot be reasonable case to an Object`)
            : {});
}
exports.sanitizeObject = sanitizeObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUtb2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvc2FuaXRpemUvc2FuaXRpemUtb2JqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtEO0FBa0NsRDs7Ozs7Ozs7OztHQVVHO0FBQ0gsU0FBZ0IsY0FBYyxDQUMxQixDQUFVLEVBQ1YsYUFBc0IsSUFBSTtJQUUxQixPQUFPLGdCQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQyxVQUFVO1lBQ1QsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQztZQUM1RCxDQUFDLENBQUMsRUFBRSxDQUNQLENBQUM7QUFDVixDQUFDO0FBVkQsd0NBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc09iamVjdCwgVW5rbm93bk9iamVjdCB9IGZyb20gXCJ+L3V0aWxzXCI7XG5cbi8qKlxuICogVGFrZXMgYSB2YXJpYWJsZSBhbmQgdHJpZXMgdG8gY2FzdCBpdCB0byBhbiBvYmplY3QuIElmIHRoZSBwYXNzZWQgaW4gdmFsdWUgaXNcbiAqIG5vdCBvYmplY3QtbGlrZSBhdCBhbGwsIHJldHVybnMgYW4gRXJyb3IuXG4gKlxuICogQHBhcmFtIG8gQW55IHZhcmlhYmxlLCBpZiBpdCBpcyBhbiBvYmplY3QgcGFzc2VzIGl0IGJhY2ssIG90aGVyd2lzZSByZXR1cm5zXG4gKiBhIG5ldyBlbXB0eSBvYmplY3QuXG4gKiBAcGFyYW0gYWxsb3dFcnJvciAtIElmIGVycm9ycyBzaG91bGQgYmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCBpZiB0aGV5XG4gKiBjYW5ub3QgYmUgcmVhc29uYWJsZSBzYW5pdGl6ZWQuXG4gKiBAcmV0dXJucyBBbHdheXMgcmV0dXJucyBhbiBvYmplY3QsIGlmIHRoZSBwYXNzZWQgaW4gdmFyaWFibGUgd2FzIG5vdCBhblxuICogb2JqZWN0LCBjb25zdHJ1Y3RzIGFuZCByZXR1cm5zIGEgbmV3IG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplT2JqZWN0KFxuICAgIG86IHVua25vd24sXG4gICAgYWxsb3dFcnJvcjogYm9vbGVhbixcbik6IFVua25vd25PYmplY3QgfCBFcnJvcjtcblxuLyoqXG4gKiBUYWtlcyBhIHZhcmlhYmxlIGFuZCB0cmllcyB0byBjYXN0IGl0IHRvIGFuIG9iamVjdC5cbiAqIEFsd2F5cyByZXR1cm5zIGFuIG9iamVjdCwgZW1wdHkgYnkgZGVmYXVsdC5cbiAqXG4gKiBAcGFyYW0gbyBBbnkgdmFyaWFibGUsIGlmIGl0IGlzIGFuIG9iamVjdCBwYXNzZXMgaXQgYmFjaywgb3RoZXJ3aXNlIHJldHVybnNcbiAqIGEgbmV3IGVtcHR5IG9iamVjdC5cbiAqIEBwYXJhbSBhbGxvd0Vycm9yIC0gSWYgZXJyb3JzIHNob3VsZCBiZSBhbGxvd2VkIHRvIGJlIHJldHVybmVkIGlmIHRoZXlcbiAqIGNhbm5vdCBiZSByZWFzb25hYmxlIHNhbml0aXplZC5cbiAqIEByZXR1cm5zIEFsd2F5cyByZXR1cm5zIGFuIG9iamVjdCwgaWYgdGhlIHBhc3NlZCBpbiB2YXJpYWJsZSB3YXMgbm90IGFuXG4gKiBvYmplY3QsIGNvbnN0cnVjdHMgYW5kIHJldHVybnMgYSBuZXcgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVPYmplY3QoXG4gICAgbzogdW5rbm93bixcbiAgICBhbGxvd0Vycm9yOiBmYWxzZSxcbik6IFVua25vd25PYmplY3Q7XG5cbi8qKlxuICogVGFrZXMgYSB2YXJpYWJsZSBhbmQgdHJpZXMgdG8gY2FzdCBpdCB0byBhbiBvYmplY3QuIElmIHRoZSBwYXNzZWQgaW4gdmFsdWUgaXNcbiAqIG5vdCBvYmplY3QtbGlrZSBhdCBhbGwsIHJldHVybnMgYW4gRXJyb3IuXG4gKlxuICogQHBhcmFtIG8gQW55IHZhcmlhYmxlLCBpZiBpdCBpcyBhbiBvYmplY3QgcGFzc2VzIGl0IGJhY2ssIG90aGVyd2lzZSByZXR1cm5zXG4gKiBhIG5ldyBlbXB0eSBvYmplY3QuXG4gKiBAcGFyYW0gYWxsb3dFcnJvciAtIElmIGVycm9ycyBzaG91bGQgYmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCBpZiB0aGV5XG4gKiBjYW5ub3QgYmUgcmVhc29uYWJsZSBzYW5pdGl6ZWQuXG4gKiBAcmV0dXJucyBBbHdheXMgcmV0dXJucyBhbiBvYmplY3QsIGlmIHRoZSBwYXNzZWQgaW4gdmFyaWFibGUgd2FzIG5vdCBhblxuICogb2JqZWN0LCBjb25zdHJ1Y3RzIGFuZCByZXR1cm5zIGEgbmV3IG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplT2JqZWN0KFxuICAgIG86IHVua25vd24sXG4gICAgYWxsb3dFcnJvcjogYm9vbGVhbiA9IHRydWUsXG4pOiBVbmtub3duT2JqZWN0IHwgRXJyb3Ige1xuICAgIHJldHVybiBpc09iamVjdChvKVxuICAgICAgICA/IG9cbiAgICAgICAgOiAoYWxsb3dFcnJvclxuICAgICAgICAgICAgPyBuZXcgRXJyb3IoYCcke299JyBjYW5ub3QgYmUgcmVhc29uYWJsZSBjYXNlIHRvIGFuIE9iamVjdGApXG4gICAgICAgICAgICA6IHt9XG4gICAgICAgICk7XG59XG4iXX0=