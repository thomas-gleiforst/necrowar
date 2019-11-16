"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_client_1 = require("./base-client");
/**
 * The end of transmission character, used to signify the string we sent is the
 * end of a transmission and to parse the json string before it, because some
 * socket APIs for clients will concat what we send
 */
const EOT_CHAR = String.fromCharCode(4);
/**
 * A client to the game server via a TCP socket
 */
class TCPClient extends base_client_1.BaseClient {
    /**
     * Creates a client connected to a server
     * @param socket the socket this client communicates through
     * @param server the server this client is connected to
     */
    constructor(socket) {
        super((() => {
            socket.setEncoding("utf8");
            return socket;
        })());
        /**
         * TCP clients may send their json in parts, delimited by the EOT_CHAR.
         * We buffer it here.
         */
        this.buffer = "";
    }
    /**
     * Invoked when the tcp socket gets data
     * @param data what the client send via the socket event listener
     */
    onSocketData(data) {
        super.onSocketData(data);
        this.buffer += data;
        // split on "end of text" character (basically end of transmission)
        const split = this.buffer.split(EOT_CHAR);
        // the last item will either be "" if the last char was an EOT_CHAR,
        // or a partial data we need to store in the buffer anyways
        this.buffer = split.pop() || "";
        for (const line of split) {
            const parsed = this.parseData(line);
            if (!parsed) {
                // Because we got some invalid data,
                // so we're going to fatally disconnect anyways
                return;
            }
            this.handleSent(parsed);
        }
    }
    /**
     * Sends a the raw string to the remote client this class represents.
     * Intended to be overridden to actually send through client...
     * @param str the raw string to send. Should be EOT_CHAR terminated.
     * @returns a promise to resolve after data is sent
     */
    sendRaw(str) {
        return new Promise((resolve, reject) => {
            super.sendRaw(str);
            if (!this.hasDisconnected() && this.socket) {
                this.socket.write(str + EOT_CHAR, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
    /**
     * Invoked when the other end of this socket disconnects
     */
    disconnected() {
        if (this.socket) {
            this.socket.destroy();
        }
        super.disconnected();
    }
}
exports.TCPClient = TCPClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGNwLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2NsaWVudHMvdGNwLWNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUE0QztBQUU1Qzs7OztHQUlHO0FBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV4Qzs7R0FFRztBQUNILE1BQWEsU0FBVSxTQUFRLHdCQUFVO0lBT3JDOzs7O09BSUc7SUFDSCxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFO1lBQ1IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUzQixPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFoQlY7OztXQUdHO1FBQ0ssV0FBTSxHQUFXLEVBQUUsQ0FBQztJQWE1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ08sWUFBWSxDQUFDLElBQWE7UUFDaEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQztRQUNwQixtRUFBbUU7UUFDbkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsb0VBQW9FO1FBQ3BFLDJEQUEyRDtRQUMzRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFaEMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDdEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNULG9DQUFvQztnQkFDcEMsK0NBQStDO2dCQUMvQyxPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sT0FBTyxDQUFDLEdBQVc7UUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRW5CLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUN0QyxJQUFJLEdBQUcsRUFBRTt3QkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2Y7eUJBQ0k7d0JBQ0QsT0FBTyxFQUFFLENBQUM7cUJBQ2I7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7YUFDTjtpQkFDSTtnQkFDRCxPQUFPLEVBQUUsQ0FBQzthQUNiO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7SUFDTyxZQUFZO1FBQ2xCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDekI7UUFDRCxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDekIsQ0FBQztDQUNKO0FBakZELDhCQWlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNvY2tldCB9IGZyb20gXCJuZXRcIjtcbmltcG9ydCB7IEJhc2VDbGllbnQgfSBmcm9tIFwiLi9iYXNlLWNsaWVudFwiIDtcblxuLyoqXG4gKiBUaGUgZW5kIG9mIHRyYW5zbWlzc2lvbiBjaGFyYWN0ZXIsIHVzZWQgdG8gc2lnbmlmeSB0aGUgc3RyaW5nIHdlIHNlbnQgaXMgdGhlXG4gKiBlbmQgb2YgYSB0cmFuc21pc3Npb24gYW5kIHRvIHBhcnNlIHRoZSBqc29uIHN0cmluZyBiZWZvcmUgaXQsIGJlY2F1c2Ugc29tZVxuICogc29ja2V0IEFQSXMgZm9yIGNsaWVudHMgd2lsbCBjb25jYXQgd2hhdCB3ZSBzZW5kXG4gKi9cbmNvbnN0IEVPVF9DSEFSID0gU3RyaW5nLmZyb21DaGFyQ29kZSg0KTtcblxuLyoqXG4gKiBBIGNsaWVudCB0byB0aGUgZ2FtZSBzZXJ2ZXIgdmlhIGEgVENQIHNvY2tldFxuICovXG5leHBvcnQgY2xhc3MgVENQQ2xpZW50IGV4dGVuZHMgQmFzZUNsaWVudCB7XG4gICAgLyoqXG4gICAgICogVENQIGNsaWVudHMgbWF5IHNlbmQgdGhlaXIganNvbiBpbiBwYXJ0cywgZGVsaW1pdGVkIGJ5IHRoZSBFT1RfQ0hBUi5cbiAgICAgKiBXZSBidWZmZXIgaXQgaGVyZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGJ1ZmZlcjogc3RyaW5nID0gXCJcIjtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBjbGllbnQgY29ubmVjdGVkIHRvIGEgc2VydmVyXG4gICAgICogQHBhcmFtIHNvY2tldCB0aGUgc29ja2V0IHRoaXMgY2xpZW50IGNvbW11bmljYXRlcyB0aHJvdWdoXG4gICAgICogQHBhcmFtIHNlcnZlciB0aGUgc2VydmVyIHRoaXMgY2xpZW50IGlzIGNvbm5lY3RlZCB0b1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHNvY2tldDogU29ja2V0KSB7XG4gICAgICAgIHN1cGVyKCgoKSA9PiB7XG4gICAgICAgICAgICBzb2NrZXQuc2V0RW5jb2RpbmcoXCJ1dGY4XCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gc29ja2V0O1xuICAgICAgICB9KSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gdGhlIHRjcCBzb2NrZXQgZ2V0cyBkYXRhXG4gICAgICogQHBhcmFtIGRhdGEgd2hhdCB0aGUgY2xpZW50IHNlbmQgdmlhIHRoZSBzb2NrZXQgZXZlbnQgbGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgb25Tb2NrZXREYXRhKGRhdGE6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25Tb2NrZXREYXRhKGRhdGEpO1xuXG4gICAgICAgIHRoaXMuYnVmZmVyICs9IGRhdGE7XG4gICAgICAgIC8vIHNwbGl0IG9uIFwiZW5kIG9mIHRleHRcIiBjaGFyYWN0ZXIgKGJhc2ljYWxseSBlbmQgb2YgdHJhbnNtaXNzaW9uKVxuICAgICAgICBjb25zdCBzcGxpdCA9IHRoaXMuYnVmZmVyLnNwbGl0KEVPVF9DSEFSKTtcbiAgICAgICAgLy8gdGhlIGxhc3QgaXRlbSB3aWxsIGVpdGhlciBiZSBcIlwiIGlmIHRoZSBsYXN0IGNoYXIgd2FzIGFuIEVPVF9DSEFSLFxuICAgICAgICAvLyBvciBhIHBhcnRpYWwgZGF0YSB3ZSBuZWVkIHRvIHN0b3JlIGluIHRoZSBidWZmZXIgYW55d2F5c1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IHNwbGl0LnBvcCgpIHx8IFwiXCI7XG5cbiAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIHNwbGl0KSB7XG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSB0aGlzLnBhcnNlRGF0YShsaW5lKTtcbiAgICAgICAgICAgIGlmICghcGFyc2VkKSB7XG4gICAgICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSBnb3Qgc29tZSBpbnZhbGlkIGRhdGEsXG4gICAgICAgICAgICAgICAgLy8gc28gd2UncmUgZ29pbmcgdG8gZmF0YWxseSBkaXNjb25uZWN0IGFueXdheXNcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VudChwYXJzZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSB0aGUgcmF3IHN0cmluZyB0byB0aGUgcmVtb3RlIGNsaWVudCB0aGlzIGNsYXNzIHJlcHJlc2VudHMuXG4gICAgICogSW50ZW5kZWQgdG8gYmUgb3ZlcnJpZGRlbiB0byBhY3R1YWxseSBzZW5kIHRocm91Z2ggY2xpZW50Li4uXG4gICAgICogQHBhcmFtIHN0ciB0aGUgcmF3IHN0cmluZyB0byBzZW5kLiBTaG91bGQgYmUgRU9UX0NIQVIgdGVybWluYXRlZC5cbiAgICAgKiBAcmV0dXJucyBhIHByb21pc2UgdG8gcmVzb2x2ZSBhZnRlciBkYXRhIGlzIHNlbnRcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgc2VuZFJhdyhzdHI6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc3VwZXIuc2VuZFJhdyhzdHIpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzRGlzY29ubmVjdGVkKCkgJiYgdGhpcy5zb2NrZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNvY2tldC53cml0ZShzdHIgKyBFT1RfQ0hBUiwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VkIHdoZW4gdGhlIG90aGVyIGVuZCBvZiB0aGlzIHNvY2tldCBkaXNjb25uZWN0c1xuICAgICAqL1xuICAgIHByb3RlY3RlZCBkaXNjb25uZWN0ZWQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNvY2tldCkge1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZGVzdHJveSgpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmRpc2Nvbm5lY3RlZCgpO1xuICAgIH1cbn1cbiJdfQ==