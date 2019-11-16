"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_typed_events_1 = require("ts-typed-events");
const logger_1 = require("~/core/logger");
const lobby_room_1 = require("./lobby-room");
const session_1 = require("./session");
/**
 * A Room that in intended to be ran in serial
 * (on one thread with the master lobby)
 */
class SerialRoom extends lobby_room_1.Room {
    /** Starts the session in this room (as we are not threaded) */
    start() {
        super.start();
        this.session = new session_1.Session({
            id: this.id,
            clients: this.clients,
            gameSettingsManager: this.gameSettingsManager,
            gameNamespace: this.gameNamespace,
        });
        this.session.events.ended.once(async (data) => {
            if (data instanceof Error) {
                logger_1.logger.error("Session had a fatal error", data);
            }
            else {
                // we got the gamelog!
                await this.cleanUp(data.gamelog);
            }
            for (const client of this.clients) {
                ts_typed_events_1.events.offAll(client.events);
            }
            this.handleOver(data instanceof Error
                ? undefined
                : data.clientInfos);
        });
    }
    /**
     * If this session has a game instance running on a worker thread.
     * @returns true if it is running, false otherwise
     */
    isRunning() {
        return Boolean(this.session);
    }
}
exports.SerialRoom = SerialRoom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9iYnktcm9vbS1zZXJpYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9zZXJ2ZXIvbG9iYnktcm9vbS1zZXJpYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBeUM7QUFDekMsMENBQXVDO0FBQ3ZDLDZDQUFvQztBQUNwQyx1Q0FBb0M7QUFFcEM7OztHQUdHO0FBQ0gsTUFBYSxVQUFXLFNBQVEsaUJBQUk7SUFJaEMsK0RBQStEO0lBQ3hELEtBQUs7UUFDUixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFZCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQztZQUN2QixFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDWCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLG1CQUFtQjtZQUM3QyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWE7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDMUMsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO2dCQUN2QixlQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ25EO2lCQUNJO2dCQUNELHNCQUFzQjtnQkFDdEIsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNwQztZQUVELEtBQUssTUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDL0Isd0JBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2hDO1lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFlBQVksS0FBSztnQkFDakMsQ0FBQyxDQUFDLFNBQVM7Z0JBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQ3JCLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7O09BR0c7SUFDSSxTQUFTO1FBQ1osT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQTFDRCxnQ0EwQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBldmVudHMgfSBmcm9tIFwidHMtdHlwZWQtZXZlbnRzXCI7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwifi9jb3JlL2xvZ2dlclwiO1xuaW1wb3J0IHsgUm9vbSB9IGZyb20gXCIuL2xvYmJ5LXJvb21cIjtcbmltcG9ydCB7IFNlc3Npb24gfSBmcm9tIFwiLi9zZXNzaW9uXCI7XG5cbi8qKlxuICogQSBSb29tIHRoYXQgaW4gaW50ZW5kZWQgdG8gYmUgcmFuIGluIHNlcmlhbFxuICogKG9uIG9uZSB0aHJlYWQgd2l0aCB0aGUgbWFzdGVyIGxvYmJ5KVxuICovXG5leHBvcnQgY2xhc3MgU2VyaWFsUm9vbSBleHRlbmRzIFJvb20ge1xuICAgIC8qKiBUaGUgU2Vzc2lvbiB0aGlzIFJvb20gaXMgcnVubmluZyAqL1xuICAgIHByaXZhdGUgc2Vzc2lvbj86IFNlc3Npb247XG5cbiAgICAvKiogU3RhcnRzIHRoZSBzZXNzaW9uIGluIHRoaXMgcm9vbSAoYXMgd2UgYXJlIG5vdCB0aHJlYWRlZCkgKi9cbiAgICBwdWJsaWMgc3RhcnQoKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAgICAgdGhpcy5zZXNzaW9uID0gbmV3IFNlc3Npb24oe1xuICAgICAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgICAgICBjbGllbnRzOiB0aGlzLmNsaWVudHMsXG4gICAgICAgICAgICBnYW1lU2V0dGluZ3NNYW5hZ2VyOiB0aGlzLmdhbWVTZXR0aW5nc01hbmFnZXIsXG4gICAgICAgICAgICBnYW1lTmFtZXNwYWNlOiB0aGlzLmdhbWVOYW1lc3BhY2UsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2Vzc2lvbi5ldmVudHMuZW5kZWQub25jZShhc3luYyAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcIlNlc3Npb24gaGFkIGEgZmF0YWwgZXJyb3JcIiwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyB3ZSBnb3QgdGhlIGdhbWVsb2chXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jbGVhblVwKGRhdGEuZ2FtZWxvZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2xpZW50IG9mIHRoaXMuY2xpZW50cykge1xuICAgICAgICAgICAgICAgIGV2ZW50cy5vZmZBbGwoY2xpZW50LmV2ZW50cyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlT3ZlcihkYXRhIGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIDogZGF0YS5jbGllbnRJbmZvcyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoaXMgc2Vzc2lvbiBoYXMgYSBnYW1lIGluc3RhbmNlIHJ1bm5pbmcgb24gYSB3b3JrZXIgdGhyZWFkLlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgaXQgaXMgcnVubmluZywgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGlzUnVubmluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4odGhpcy5zZXNzaW9uKTtcbiAgICB9XG59XG4iXX0=