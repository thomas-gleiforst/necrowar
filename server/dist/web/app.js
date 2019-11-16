"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const path_1 = require("path");
const config_1 = require("~/core/config");
const logger_1 = require("~/core/logger");
const routes = require("./routes");
const helpers = require("./view-helpers");
/**
 * Sets up an Express web server and all routes for it.
 */
function setupWebServer() {
    if (config_1.Config.WEB_ENABLED || config_1.Config.API_ENABLED) {
        const app = express();
        // tslint:disable-next-line:no-unsafe-any
        app.locals.site = {
            title: config_1.Config.MAIN_TITLE,
        };
        if (config_1.Config.WEB_ENABLED) {
            // setup handlebars as the views
            app.engine("hbs", expressHandlebars({
                extname: "hbs",
                defaultLayout: "main.hbs",
                partialsDir: path_1.join(__dirname, "views/partials"),
                layoutsDir: path_1.join(__dirname, "views/layouts"),
                helpers,
            })); // tslint:disable-line:no-any - express-hbs definitions are borked
            app.set("view engine", "hbs");
            app.set("views", path_1.join(__dirname, "views"));
            app.use("/styles", express.static(path_1.join(__dirname, "styles")));
        }
        // expect POSTs to be JSON formatted
        app.use(bodyParser.json());
        app.listen(config_1.Config.HTTP_PORT, () => {
            logger_1.logger.info(`🌐 Web server live on port ${config_1.Config.HTTP_PORT} 🌐`);
            for (const registerRoute of Object.values(routes)) {
                registerRoute(app);
            }
        });
    }
}
exports.setupWebServer = setupWebServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dlYi9hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwQ0FBMEM7QUFDMUMsbUNBQW1DO0FBQ25DLHdEQUF3RDtBQUN4RCwrQkFBNEI7QUFDNUIsMENBQXVDO0FBQ3ZDLDBDQUF1QztBQUN2QyxtQ0FBbUM7QUFDbkMsMENBQTBDO0FBRTFDOztHQUVHO0FBQ0gsU0FBZ0IsY0FBYztJQUMxQixJQUFJLGVBQU0sQ0FBQyxXQUFXLElBQUksZUFBTSxDQUFDLFdBQVcsRUFBRTtRQUMxQyxNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUV0Qix5Q0FBeUM7UUFDekMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUc7WUFDZCxLQUFLLEVBQUUsZUFBTSxDQUFDLFVBQVU7U0FDM0IsQ0FBQztRQUVGLElBQUksZUFBTSxDQUFDLFdBQVcsRUFBRTtZQUNwQixnQ0FBZ0M7WUFDaEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUM7Z0JBQ2hDLE9BQU8sRUFBRSxLQUFLO2dCQUNkLGFBQWEsRUFBRSxVQUFVO2dCQUN6QixXQUFXLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDOUMsVUFBVSxFQUFFLFdBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO2dCQUM1QyxPQUFPO2FBQ1YsQ0FBUSxDQUFDLENBQUMsQ0FBQyxrRUFBa0U7WUFFOUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsV0FBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRTNDLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakU7UUFFRCxvQ0FBb0M7UUFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUUzQixHQUFHLENBQUMsTUFBTSxDQUFDLGVBQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFO1lBQzlCLGVBQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLGVBQU0sQ0FBQyxTQUFTLEtBQUssQ0FBQyxDQUFDO1lBRWpFLEtBQUssTUFBTSxhQUFhLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDL0MsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDTjtBQUNMLENBQUM7QUFwQ0Qsd0NBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYm9keVBhcnNlciBmcm9tIFwiYm9keS1wYXJzZXJcIjtcbmltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcbmltcG9ydCAqIGFzIGV4cHJlc3NIYW5kbGViYXJzIGZyb20gXCJleHByZXNzLWhhbmRsZWJhcnNcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIn4vY29yZS9jb25maWdcIjtcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCJ+L2NvcmUvbG9nZ2VyXCI7XG5pbXBvcnQgKiBhcyByb3V0ZXMgZnJvbSBcIi4vcm91dGVzXCI7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gXCIuL3ZpZXctaGVscGVyc1wiO1xuXG4vKipcbiAqIFNldHMgdXAgYW4gRXhwcmVzcyB3ZWIgc2VydmVyIGFuZCBhbGwgcm91dGVzIGZvciBpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldHVwV2ViU2VydmVyKCk6IHZvaWQge1xuICAgIGlmIChDb25maWcuV0VCX0VOQUJMRUQgfHwgQ29uZmlnLkFQSV9FTkFCTEVEKSB7XG4gICAgICAgIGNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tdW5zYWZlLWFueVxuICAgICAgICBhcHAubG9jYWxzLnNpdGUgPSB7XG4gICAgICAgICAgICB0aXRsZTogQ29uZmlnLk1BSU5fVElUTEUsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKENvbmZpZy5XRUJfRU5BQkxFRCkge1xuICAgICAgICAgICAgLy8gc2V0dXAgaGFuZGxlYmFycyBhcyB0aGUgdmlld3NcbiAgICAgICAgICAgIGFwcC5lbmdpbmUoXCJoYnNcIiwgZXhwcmVzc0hhbmRsZWJhcnMoe1xuICAgICAgICAgICAgICAgIGV4dG5hbWU6IFwiaGJzXCIsXG4gICAgICAgICAgICAgICAgZGVmYXVsdExheW91dDogXCJtYWluLmhic1wiLFxuICAgICAgICAgICAgICAgIHBhcnRpYWxzRGlyOiBqb2luKF9fZGlybmFtZSwgXCJ2aWV3cy9wYXJ0aWFsc1wiKSxcbiAgICAgICAgICAgICAgICBsYXlvdXRzRGlyOiBqb2luKF9fZGlybmFtZSwgXCJ2aWV3cy9sYXlvdXRzXCIpLFxuICAgICAgICAgICAgICAgIGhlbHBlcnMsXG4gICAgICAgICAgICB9KSBhcyBhbnkpOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueSAtIGV4cHJlc3MtaGJzIGRlZmluaXRpb25zIGFyZSBib3JrZWRcblxuICAgICAgICAgICAgYXBwLnNldChcInZpZXcgZW5naW5lXCIsIFwiaGJzXCIpO1xuICAgICAgICAgICAgYXBwLnNldChcInZpZXdzXCIsIGpvaW4oX19kaXJuYW1lLCBcInZpZXdzXCIpKTtcblxuICAgICAgICAgICAgYXBwLnVzZShcIi9zdHlsZXNcIiwgZXhwcmVzcy5zdGF0aWMoam9pbihfX2Rpcm5hbWUsIFwic3R5bGVzXCIpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBleHBlY3QgUE9TVHMgdG8gYmUgSlNPTiBmb3JtYXR0ZWRcbiAgICAgICAgYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG5cbiAgICAgICAgYXBwLmxpc3RlbihDb25maWcuSFRUUF9QT1JULCAoKSA9PiB7XG4gICAgICAgICAgICBsb2dnZXIuaW5mbyhg8J+MkCBXZWIgc2VydmVyIGxpdmUgb24gcG9ydCAke0NvbmZpZy5IVFRQX1BPUlR9IPCfjJBgKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCByZWdpc3RlclJvdXRlIG9mIE9iamVjdC52YWx1ZXMocm91dGVzKSkge1xuICAgICAgICAgICAgICAgIHJlZ2lzdGVyUm91dGUoYXBwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIl19