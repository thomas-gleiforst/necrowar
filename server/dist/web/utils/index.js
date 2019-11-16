"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const defaultHostname = os_1.hostname();
function formatHostname(url, host) {
    return url
        ? url.replace("__HOSTNAME__", host || defaultHostname)
        : "";
}
/**
 * Formats gamelog infos from the a game logger into the expected web format, filling in host names in the info.
 *
 * @param gamelogInfos - The array of infos to format. It will not be mutated.
 * @param host - An optional hostname to use. Otherwise the os hostname is used.
 * @returns A new array of new gamelog infos with host names filled in.
 */
function formatGamelogInfos(gamelogInfos, host) {
    return gamelogInfos.map((info) => ({
        ...info,
        // replace __HOSTNAME__ with the request's host for them, or a default hostname
        visualizerUrl: formatHostname(info.visualizerUrl, host),
        uri: formatHostname(info.uri, host),
    }));
}
exports.formatGamelogInfos = formatGamelogInfos;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvd2ViL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQThCO0FBSTlCLE1BQU0sZUFBZSxHQUFHLGFBQVEsRUFBRSxDQUFDO0FBRW5DLFNBQVMsY0FBYyxDQUFDLEdBQXVCLEVBQUUsSUFBd0I7SUFDckUsT0FBTyxHQUFHO1FBQ04sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksSUFBSSxlQUFlLENBQUM7UUFDdEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNiLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUFnQixrQkFBa0IsQ0FDOUIsWUFBdUMsRUFDdkMsSUFBYTtJQUViLE9BQU8sWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvQixHQUFHLElBQUk7UUFDUCwrRUFBK0U7UUFDL0UsYUFBYSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQztRQUN2RCxHQUFHLEVBQUUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDO0tBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQztBQVZELGdEQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaG9zdG5hbWUgfSBmcm9tIFwib3NcIjtcbmltcG9ydCB7IElHYW1lbG9nSW5mbyB9IGZyb20gXCJ+L2NvcmUvZ2FtZVwiO1xuaW1wb3J0IHsgSW1tdXRhYmxlIH0gZnJvbSBcIn4vdXRpbHNcIjtcblxuY29uc3QgZGVmYXVsdEhvc3RuYW1lID0gaG9zdG5hbWUoKTtcblxuZnVuY3Rpb24gZm9ybWF0SG9zdG5hbWUodXJsOiBzdHJpbmcgfCB1bmRlZmluZWQsIGhvc3Q6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHVybFxuICAgICAgICA/IHVybC5yZXBsYWNlKFwiX19IT1NUTkFNRV9fXCIsIGhvc3QgfHwgZGVmYXVsdEhvc3RuYW1lKVxuICAgICAgICA6IFwiXCI7XG59XG5cbi8qKlxuICogRm9ybWF0cyBnYW1lbG9nIGluZm9zIGZyb20gdGhlIGEgZ2FtZSBsb2dnZXIgaW50byB0aGUgZXhwZWN0ZWQgd2ViIGZvcm1hdCwgZmlsbGluZyBpbiBob3N0IG5hbWVzIGluIHRoZSBpbmZvLlxuICpcbiAqIEBwYXJhbSBnYW1lbG9nSW5mb3MgLSBUaGUgYXJyYXkgb2YgaW5mb3MgdG8gZm9ybWF0LiBJdCB3aWxsIG5vdCBiZSBtdXRhdGVkLlxuICogQHBhcmFtIGhvc3QgLSBBbiBvcHRpb25hbCBob3N0bmFtZSB0byB1c2UuIE90aGVyd2lzZSB0aGUgb3MgaG9zdG5hbWUgaXMgdXNlZC5cbiAqIEByZXR1cm5zIEEgbmV3IGFycmF5IG9mIG5ldyBnYW1lbG9nIGluZm9zIHdpdGggaG9zdCBuYW1lcyBmaWxsZWQgaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRHYW1lbG9nSW5mb3MoXG4gICAgZ2FtZWxvZ0luZm9zOiBJbW11dGFibGU8SUdhbWVsb2dJbmZvW10+LFxuICAgIGhvc3Q/OiBzdHJpbmcsXG4pOiBJR2FtZWxvZ0luZm9bXSB7XG4gICAgcmV0dXJuIGdhbWVsb2dJbmZvcy5tYXAoKGluZm8pID0+ICh7XG4gICAgICAgIC4uLmluZm8sXG4gICAgICAgIC8vIHJlcGxhY2UgX19IT1NUTkFNRV9fIHdpdGggdGhlIHJlcXVlc3QncyBob3N0IGZvciB0aGVtLCBvciBhIGRlZmF1bHQgaG9zdG5hbWVcbiAgICAgICAgdmlzdWFsaXplclVybDogZm9ybWF0SG9zdG5hbWUoaW5mby52aXN1YWxpemVyVXJsLCBob3N0KSxcbiAgICAgICAgdXJpOiBmb3JtYXRIb3N0bmFtZShpbmZvLnVyaSwgaG9zdCksXG4gICAgfSkpO1xufVxuIl19