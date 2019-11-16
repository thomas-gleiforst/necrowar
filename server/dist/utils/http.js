"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const url_1 = require("url");
/**
 * A simple async http request handler.
 *
 * @param url - The URL to request data from via GET.
 * @returns A promise that resolves to the data found at that URL, or rejects
 * with an Error if the request fails.
 */
function httpRequest(url) {
    let data = "";
    const asURL = new url_1.URL(url);
    return new Promise((resolve, reject) => {
        https_1.get({
            hostname: asURL.hostname,
            path: asURL.pathname,
            agent: https_1.globalAgent,
            headers: {
                "User-Agent": "Node.js",
            },
        }, (response) => {
            // A chunk of data has been received.
            response.on("data", (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            response.on("end", () => {
                resolve(data);
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
}
exports.httpRequest = httpRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9odHRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXlDO0FBQ3pDLDZCQUEwQjtBQUUxQjs7Ozs7O0dBTUc7QUFDSCxTQUFnQixXQUFXLENBQUMsR0FBVztJQUNuQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDZCxNQUFNLEtBQUssR0FBRyxJQUFJLFNBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUzQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ25DLFdBQUcsQ0FBQztZQUNBLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDcEIsS0FBSyxFQUFFLG1CQUFXO1lBQ2xCLE9BQU8sRUFBRTtnQkFDTCxZQUFZLEVBQUUsU0FBUzthQUMxQjtTQUNKLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNaLHFDQUFxQztZQUNyQyxRQUFRLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUMxQixJQUFJLElBQUksS0FBSyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1lBRUgsOERBQThEO1lBQzlELFFBQVEsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTFCRCxrQ0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXQsIGdsb2JhbEFnZW50IH0gZnJvbSBcImh0dHBzXCI7XG5pbXBvcnQgeyBVUkwgfSBmcm9tIFwidXJsXCI7XG5cbi8qKlxuICogQSBzaW1wbGUgYXN5bmMgaHR0cCByZXF1ZXN0IGhhbmRsZXIuXG4gKlxuICogQHBhcmFtIHVybCAtIFRoZSBVUkwgdG8gcmVxdWVzdCBkYXRhIGZyb20gdmlhIEdFVC5cbiAqIEByZXR1cm5zIEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRoZSBkYXRhIGZvdW5kIGF0IHRoYXQgVVJMLCBvciByZWplY3RzXG4gKiB3aXRoIGFuIEVycm9yIGlmIHRoZSByZXF1ZXN0IGZhaWxzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaHR0cFJlcXVlc3QodXJsOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGxldCBkYXRhID0gXCJcIjtcbiAgICBjb25zdCBhc1VSTCA9IG5ldyBVUkwodXJsKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGdldCh7XG4gICAgICAgICAgICBob3N0bmFtZTogYXNVUkwuaG9zdG5hbWUsXG4gICAgICAgICAgICBwYXRoOiBhc1VSTC5wYXRobmFtZSxcbiAgICAgICAgICAgIGFnZW50OiBnbG9iYWxBZ2VudCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIlVzZXItQWdlbnRcIjogXCJOb2RlLmpzXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIC8vIEEgY2h1bmsgb2YgZGF0YSBoYXMgYmVlbiByZWNlaXZlZC5cbiAgICAgICAgICAgIHJlc3BvbnNlLm9uKFwiZGF0YVwiLCAoY2h1bmspID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhICs9IGNodW5rO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRoZSB3aG9sZSByZXNwb25zZSBoYXMgYmVlbiByZWNlaXZlZC4gUHJpbnQgb3V0IHRoZSByZXN1bHQuXG4gICAgICAgICAgICByZXNwb25zZS5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KS5vbihcImVycm9yXCIsIChlcnIpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiJdfQ==