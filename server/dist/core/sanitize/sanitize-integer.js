"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Max/Min true int32 values for most programming languages.
const INT_MAX = 2147483647;
const INT_MIN = -2147483648;
/**
 * Takes a variable and tries to cast it to a integer, checking 32 bit integer
 * bounds. If the passed in value is not int-like at all, returns an Error.
 *
 * @param i Any number like variable to try to transform.
 * @param allowError - If errors should be allowed to be returned if they
 * cannot be reasonable sanitized.
 * @returns Always returns an integer, 0 is the default.
 */
function sanitizeInteger(i, allowError = true) {
    const asNumber = parseInt(String(i), 10) || 0;
    if (allowError) {
        if (isNaN(asNumber)) {
            return new Error(`'${i}' cannot be reasonably cast to an integer.`);
        }
        if (asNumber > INT_MAX) {
            return new Error(`Integer ${i} exceeds INT_MAX`);
        }
        else if (asNumber < INT_MIN) {
            return new Error(`Integer ${i} exceeds INT_MIN`);
        }
    }
    return asNumber || 0;
}
exports.sanitizeInteger = sanitizeInteger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemUtaW50ZWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3Nhbml0aXplL3Nhbml0aXplLWludGVnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFBNEQ7QUFDNUQsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDO0FBQzNCLE1BQU0sT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDO0FBOEI1Qjs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLGVBQWUsQ0FDM0IsQ0FBVSxFQUNWLGFBQXNCLElBQUk7SUFFMUIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFOUMsSUFBSSxVQUFVLEVBQUU7UUFDWixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqQixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQ3ZFO1FBRUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDcEQ7YUFDSSxJQUFJLFFBQVEsR0FBRyxPQUFPLEVBQUU7WUFDekIsT0FBTyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNwRDtLQUNKO0lBRUQsT0FBTyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFwQkQsMENBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTWF4L01pbiB0cnVlIGludDMyIHZhbHVlcyBmb3IgbW9zdCBwcm9ncmFtbWluZyBsYW5ndWFnZXMuXG5jb25zdCBJTlRfTUFYID0gMjE0NzQ4MzY0NztcbmNvbnN0IElOVF9NSU4gPSAtMjE0NzQ4MzY0ODtcblxuLyoqXG4gKiBUYWtlcyBhIHZhcmlhYmxlIGFuZCB0cmllcyB0byBjYXN0IGl0IHRvIGEgaW50ZWdlciwgY2hlY2tpbmcgMzIgYml0IGludGVnZXJcbiAqIGJvdW5kcy4gSWYgdGhlIHBhc3NlZCBpbiB2YWx1ZSBpcyBub3QgaW50LWxpa2UgYXQgYWxsLCByZXR1cm5zIGFuIEVycm9yLlxuICpcbiAqIEBwYXJhbSBpIEFueSBudW1iZXIgbGlrZSB2YXJpYWJsZSB0byB0cnkgdG8gdHJhbnNmb3JtLlxuICogQHBhcmFtIGFsbG93RXJyb3IgLSBJZiBlcnJvcnMgc2hvdWxkIGJlIGFsbG93ZWQgdG8gYmUgcmV0dXJuZWQgaWYgdGhleVxuICogY2Fubm90IGJlIHJlYXNvbmFibGUgc2FuaXRpemVkLlxuICogQHJldHVybnMgQWx3YXlzIHJldHVybnMgYW4gaW50ZWdlciwgMCBpcyB0aGUgZGVmYXVsdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplSW50ZWdlcihcbiAgICBpOiB1bmtub3duLFxuICAgIGFsbG93RXJyb3I6IGJvb2xlYW4sXG4pOiBudW1iZXIgfCBFcnJvcjtcblxuLyoqXG4gKiBUYWtlcyBhIHZhcmlhYmxlIGFuZCB0cmllcyB0byBjYXN0IGl0IHRvIGEgaW50ZWdlciwgY2hlY2tpbmcgMzIgYml0IGludGVnZXJcbiAqIGJvdW5kcy4gQWx3YXlzIHJldHVybnMgYW4gaW50ZWdlciBudW1iZXIuXG4gKlxuICogQHBhcmFtIGkgQW55IG51bWJlciBsaWtlIHZhcmlhYmxlIHRvIHRyeSB0byB0cmFuc2Zvcm0uXG4gKiBAcGFyYW0gYWxsb3dFcnJvciAtIElmIGVycm9ycyBzaG91bGQgYmUgYWxsb3dlZCB0byBiZSByZXR1cm5lZCBpZiB0aGV5XG4gKiBjYW5ub3QgYmUgcmVhc29uYWJsZSBzYW5pdGl6ZWQuXG4gKiBAcmV0dXJucyBBbHdheXMgcmV0dXJucyBhbiBpbnRlZ2VyLCAwIGlzIHRoZSBkZWZhdWx0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVJbnRlZ2VyKFxuICAgIGk6IHVua25vd24sXG4gICAgYWxsb3dFcnJvcjogZmFsc2UsXG4pOiBudW1iZXI7XG5cbi8qKlxuICogVGFrZXMgYSB2YXJpYWJsZSBhbmQgdHJpZXMgdG8gY2FzdCBpdCB0byBhIGludGVnZXIsIGNoZWNraW5nIDMyIGJpdCBpbnRlZ2VyXG4gKiBib3VuZHMuIElmIHRoZSBwYXNzZWQgaW4gdmFsdWUgaXMgbm90IGludC1saWtlIGF0IGFsbCwgcmV0dXJucyBhbiBFcnJvci5cbiAqXG4gKiBAcGFyYW0gaSBBbnkgbnVtYmVyIGxpa2UgdmFyaWFibGUgdG8gdHJ5IHRvIHRyYW5zZm9ybS5cbiAqIEBwYXJhbSBhbGxvd0Vycm9yIC0gSWYgZXJyb3JzIHNob3VsZCBiZSBhbGxvd2VkIHRvIGJlIHJldHVybmVkIGlmIHRoZXlcbiAqIGNhbm5vdCBiZSByZWFzb25hYmxlIHNhbml0aXplZC5cbiAqIEByZXR1cm5zIEFsd2F5cyByZXR1cm5zIGFuIGludGVnZXIsIDAgaXMgdGhlIGRlZmF1bHQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUludGVnZXIoXG4gICAgaTogdW5rbm93bixcbiAgICBhbGxvd0Vycm9yOiBib29sZWFuID0gdHJ1ZSxcbik6IG51bWJlciB8IEVycm9yIHtcbiAgICBjb25zdCBhc051bWJlciA9IHBhcnNlSW50KFN0cmluZyhpKSwgMTApIHx8IDA7XG5cbiAgICBpZiAoYWxsb3dFcnJvcikge1xuICAgICAgICBpZiAoaXNOYU4oYXNOdW1iZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKGAnJHtpfScgY2Fubm90IGJlIHJlYXNvbmFibHkgY2FzdCB0byBhbiBpbnRlZ2VyLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFzTnVtYmVyID4gSU5UX01BWCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgSW50ZWdlciAke2l9IGV4Y2VlZHMgSU5UX01BWGApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFzTnVtYmVyIDwgSU5UX01JTikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgSW50ZWdlciAke2l9IGV4Y2VlZHMgSU5UX01JTmApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGFzTnVtYmVyIHx8IDA7XG59XG4iXX0=