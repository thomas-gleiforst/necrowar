"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws = require("lark-websocket");
const net = require("net");
const base_client_1 = require("./base-client");
/** A client to the game server via a WS connection. */
class WSClient extends base_client_1.BaseClient {
    /**
     * Creates a client connected to a server.
     *
     * @param socket The socket this client communicates through.
     */
    constructor(socket) {
        super(socket instanceof net.Socket
            // hackish, we need to re - set socket before super is called,
            // but the super method wants to be called first
            // tslint:disable-next-line:no-unsafe-any
            ? ws.createClient(socket) // then we need to create a websocket interface wrapped around this net.Socket
            : socket);
    }
    /**
     * Gets the net module member of this socket for passing between threads.
     *
     * @returns The net socket used for WS communications.
     */
    popNetSocket() {
        // NOTE: do not call super, our actual socket is hack-y
        if (!this.socket) {
            return;
        }
        const socket = this.socket._socket;
        this.socket = undefined;
        return socket;
    }
    /**
     * Stops listening to the current socket, for passing to another thread.
     *
     * @returns A boolean indicating if it stopped listening.
     */
    stopListeningToSocket() {
        if (!this.socket) {
            return false;
        }
        const returned = super.stopListeningToSocket();
        this.socket.pause();
        return returned;
    }
    /** The on data event name in our socket to listen for. */
    get onDataEventName() {
        return "message";
    }
    /**
     * Invoked when the tcp socket gets data.
     *
     * @param data What the client send via the socket event listener.
     */
    onSocketData(data) {
        super.onSocketData(data);
        const parsed = this.parseData(data);
        if (!parsed) {
            // Because we got some invalid data,
            // so we're going to fatally disconnect anyways
            return;
        }
        this.handleSent(parsed);
    }
    /**
     * Sends a the raw string to the remote client this class represents.
     *
     * @param str - The raw string to send. Should be EOT_CHAR terminated.
     * @returns A promise that resolves after it sends the data.
     */
    async sendRaw(str) {
        if (this.socket && !this.socket.closed) {
            this.socket.send(str);
        }
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
exports.WSClient = WSClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvcmUvY2xpZW50cy93cy1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsMkJBQTJCO0FBQzNCLCtDQUE0QztBQUU1Qyx1REFBdUQ7QUFDdkQsTUFBYSxRQUFTLFNBQVEsd0JBQVU7SUFrQnBDOzs7O09BSUc7SUFDSCxZQUFZLE1BQWtCO1FBQzFCLEtBQUssQ0FBQyxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQU07WUFDOUIsOERBQThEO1lBQzlELGdEQUFnRDtZQUNoRCx5Q0FBeUM7WUFDekMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsOEVBQThFO1lBQ3hHLENBQUMsQ0FBQyxNQUFNLENBQ1gsQ0FBQztJQUNOLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksWUFBWTtRQUNmLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNkLE9BQU87U0FDVjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO1FBRXhCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0kscUJBQXFCO1FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2QsT0FBTyxLQUFLLENBQUM7U0FDaEI7UUFFRCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXBCLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCwwREFBMEQ7SUFDMUQsSUFBYyxlQUFlO1FBQ3pCLE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sWUFBWSxDQUFDLElBQWE7UUFDaEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxvQ0FBb0M7WUFDcEMsK0NBQStDO1lBQy9DLE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ08sWUFBWTtRQUNsQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pCLENBQUM7Q0FDSjtBQTlHRCw0QkE4R0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3cyBmcm9tIFwibGFyay13ZWJzb2NrZXRcIjtcbmltcG9ydCAqIGFzIG5ldCBmcm9tIFwibmV0XCI7XG5pbXBvcnQgeyBCYXNlQ2xpZW50IH0gZnJvbSBcIi4vYmFzZS1jbGllbnRcIiA7XG5cbi8qKiBBIGNsaWVudCB0byB0aGUgZ2FtZSBzZXJ2ZXIgdmlhIGEgV1MgY29ubmVjdGlvbi4gKi9cbmV4cG9ydCBjbGFzcyBXU0NsaWVudCBleHRlbmRzIEJhc2VDbGllbnQge1xuICAgIC8qKiBUaGUgbGFyay13ZWJzb2NrZXQgc29ja2V0IHRoYXQgc2VtaS1pbWl0YXRlcyBuZXQuU29ja2V0ICovXG4gICAgLy8gVE9ETzogZG9jdW1lbnQgbGFyay13ZWJzb2NrZXRcbiAgICBwcm90ZWN0ZWQgc29ja2V0PzogbmV0LlNvY2tldCAmIHtcbiAgICAgICAgLyoqIFRoZSBBQ1RVQUwgbmV0LlNvY2tldCAqL1xuICAgICAgICBfc29ja2V0OiBuZXQuU29ja2V0O1xuXG4gICAgICAgIC8qKiBpbmRpY2F0ZXMgaWYgdGhlIGNvbm5lY3Rpb24gaXMgY2xvc2VkICovXG4gICAgICAgIHJlYWRvbmx5IGNsb3NlZDogYm9vbGVhbjtcblxuICAgICAgICAvKiogcmVtb3ZlIGZyb20gbmV0LlNvY2tldCAqL1xuICAgICAgICB3cml0ZTogbmV2ZXI7XG5cbiAgICAgICAgLyoqIHNlbmRzIGEgc3RyaW5nLCB1c2UgaW5zdGVhZCBvZiB3cml0ZSAqL1xuICAgICAgICBzZW5kKHN0cjogc3RyaW5nKTogdm9pZDtcblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgY2xpZW50IGNvbm5lY3RlZCB0byBhIHNlcnZlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzb2NrZXQgVGhlIHNvY2tldCB0aGlzIGNsaWVudCBjb21tdW5pY2F0ZXMgdGhyb3VnaC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihzb2NrZXQ6IG5ldC5Tb2NrZXQpIHtcbiAgICAgICAgc3VwZXIoc29ja2V0IGluc3RhbmNlb2YgbmV0LlNvY2tldFxuICAgICAgICAgICAgLy8gaGFja2lzaCwgd2UgbmVlZCB0byByZSAtIHNldCBzb2NrZXQgYmVmb3JlIHN1cGVyIGlzIGNhbGxlZCxcbiAgICAgICAgICAgIC8vIGJ1dCB0aGUgc3VwZXIgbWV0aG9kIHdhbnRzIHRvIGJlIGNhbGxlZCBmaXJzdFxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgICAgICAgID8gd3MuY3JlYXRlQ2xpZW50KHNvY2tldCkgLy8gdGhlbiB3ZSBuZWVkIHRvIGNyZWF0ZSBhIHdlYnNvY2tldCBpbnRlcmZhY2Ugd3JhcHBlZCBhcm91bmQgdGhpcyBuZXQuU29ja2V0XG4gICAgICAgICAgICA6IHNvY2tldCwgLy8gbm9ybWFsIHNvY2tldCBmYWlsIHRocm91Z2hcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBuZXQgbW9kdWxlIG1lbWJlciBvZiB0aGlzIHNvY2tldCBmb3IgcGFzc2luZyBiZXR3ZWVuIHRocmVhZHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBUaGUgbmV0IHNvY2tldCB1c2VkIGZvciBXUyBjb21tdW5pY2F0aW9ucy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcG9wTmV0U29ja2V0KCk6IG5ldC5Tb2NrZXQgfCB1bmRlZmluZWQge1xuICAgICAgICAvLyBOT1RFOiBkbyBub3QgY2FsbCBzdXBlciwgb3VyIGFjdHVhbCBzb2NrZXQgaXMgaGFjay15XG4gICAgICAgIGlmICghdGhpcy5zb2NrZXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IHRoaXMuc29ja2V0Ll9zb2NrZXQ7XG4gICAgICAgIHRoaXMuc29ja2V0ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybiBzb2NrZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RvcHMgbGlzdGVuaW5nIHRvIHRoZSBjdXJyZW50IHNvY2tldCwgZm9yIHBhc3NpbmcgdG8gYW5vdGhlciB0aHJlYWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIGJvb2xlYW4gaW5kaWNhdGluZyBpZiBpdCBzdG9wcGVkIGxpc3RlbmluZy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RvcExpc3RlbmluZ1RvU29ja2V0KCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuc29ja2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXR1cm5lZCA9IHN1cGVyLnN0b3BMaXN0ZW5pbmdUb1NvY2tldCgpO1xuICAgICAgICB0aGlzLnNvY2tldC5wYXVzZSgpO1xuXG4gICAgICAgIHJldHVybiByZXR1cm5lZDtcbiAgICB9XG5cbiAgICAvKiogVGhlIG9uIGRhdGEgZXZlbnQgbmFtZSBpbiBvdXIgc29ja2V0IHRvIGxpc3RlbiBmb3IuICovXG4gICAgcHJvdGVjdGVkIGdldCBvbkRhdGFFdmVudE5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwibWVzc2FnZVwiO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiB0aGUgdGNwIHNvY2tldCBnZXRzIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSBXaGF0IHRoZSBjbGllbnQgc2VuZCB2aWEgdGhlIHNvY2tldCBldmVudCBsaXN0ZW5lci5cbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgb25Tb2NrZXREYXRhKGRhdGE6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25Tb2NrZXREYXRhKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMucGFyc2VEYXRhKGRhdGEpO1xuICAgICAgICBpZiAoIXBhcnNlZCkge1xuICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSBnb3Qgc29tZSBpbnZhbGlkIGRhdGEsXG4gICAgICAgICAgICAvLyBzbyB3ZSdyZSBnb2luZyB0byBmYXRhbGx5IGRpc2Nvbm5lY3QgYW55d2F5c1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oYW5kbGVTZW50KHBhcnNlZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSB0aGUgcmF3IHN0cmluZyB0byB0aGUgcmVtb3RlIGNsaWVudCB0aGlzIGNsYXNzIHJlcHJlc2VudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RyIC0gVGhlIHJhdyBzdHJpbmcgdG8gc2VuZC4gU2hvdWxkIGJlIEVPVF9DSEFSIHRlcm1pbmF0ZWQuXG4gICAgICogQHJldHVybnMgQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgaXQgc2VuZHMgdGhlIGRhdGEuXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFzeW5jIHNlbmRSYXcoc3RyOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0ICYmICF0aGlzLnNvY2tldC5jbG9zZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoc3RyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludm9rZWQgd2hlbiB0aGUgb3RoZXIgZW5kIG9mIHRoaXMgc29ja2V0IGRpc2Nvbm5lY3RzXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGRpc2Nvbm5lY3RlZCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICAgICAgICB0aGlzLnNvY2tldC5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIuZGlzY29ubmVjdGVkKCk7XG4gICAgfVxufVxuIl19