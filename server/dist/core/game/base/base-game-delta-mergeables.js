"use strict";
// tslint:disable:no-any no-unsafe-any no-non-null-assertion
// ^ as DeltaMergeables are black magic anyways
Object.defineProperty(exports, "__esModule", { value: true });
const delta_mergeable_1 = require("~/core/game/delta-mergeable");
const utils_1 = require("~/utils");
/**
 * The base class all delta mergeable instances in (and of) the game inherit
 * from.
 */
class BaseGameDeltaMergeables {
    /**
     * Initializes our delta mergeable, and sets any initial values.
     * @param args - The data needed to hookup our DeltaMergeable.
     */
    constructor(args) {
        this.deltaMergeable = delta_mergeable_1.createDeltaMergeable({
            key: args.key,
            initialValue: this,
            parent: args.parent,
            childTypes: args.attributesSchema,
            type: {
                typeName: "gameObject",
                gameObjectClass: Object.getPrototypeOf(this).constructor,
                nullable: false,
            },
        });
        // setup initial values
        for (const [key, schema] of Object.entries(args.attributesSchema)) {
            if (!schema) {
                throw new Error(`Schema must exist for property ${key}`);
            }
            let initialValue = utils_1.objectHasProperty(schema, "defaultValue")
                ? schema.defaultValue
                : undefined;
            if (utils_1.objectHasProperty(args.initialValues, key)) {
                initialValue = args.initialValues[key];
            }
            const dm = this.deltaMergeable.child(key);
            if (dm) {
                dm.set(initialValue, true);
            }
            else {
                this.deltaMergeable.wrapper[key] = initialValue;
            }
        }
        for (const [property, schema] of Object.entries(args.attributesSchema)) {
            const dm = this.deltaMergeable.child(property);
            if (!dm || !schema) {
                throw new Error(`Delta mergeable attribute expected for ${property}!`);
            }
            Object.defineProperty(this, property, {
                enumerable: true,
                configurable: false,
                get: schema.typeName === "list" // Lists are behind Proxies
                    ? () => dm.wrapper
                    : () => dm.get(),
                set: (val) => dm.set(val),
            });
        }
    }
}
exports.BaseGameDeltaMergeables = BaseGameDeltaMergeables;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1nYW1lLWRlbHRhLW1lcmdlYWJsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29yZS9nYW1lL2Jhc2UvYmFzZS1nYW1lLWRlbHRhLW1lcmdlYWJsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDREQUE0RDtBQUM1RCwrQ0FBK0M7O0FBRS9DLGlFQUFtRjtBQUVuRixtQ0FBbUY7QUFFbkY7OztHQUdHO0FBQ0gsTUFBYSx1QkFBdUI7SUFJaEM7OztPQUdHO0lBQ0gsWUFBWSxJQVdYO1FBQ0csSUFBSSxDQUFDLGNBQWMsR0FBRyxzQ0FBb0IsQ0FBQztZQUN2QyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixZQUFZLEVBQUUsSUFBSTtZQUNsQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7WUFDakMsSUFBSSxFQUFFO2dCQUNGLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixlQUFlLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXO2dCQUN4RCxRQUFRLEVBQUUsS0FBSzthQUNsQjtTQUNKLENBQUMsQ0FBQztRQUVILHVCQUF1QjtRQUN2QixLQUFLLE1BQU0sQ0FBRSxHQUFHLEVBQUUsTUFBTSxDQUFFLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtZQUNqRSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNULE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDNUQ7WUFFRCxJQUFJLFlBQVksR0FBRyx5QkFBaUIsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDO2dCQUN4RCxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVk7Z0JBQ3JCLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFFaEIsSUFBSSx5QkFBaUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMxQztZQUVELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLElBQUksRUFBRSxFQUFFO2dCQUNKLEVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzlCO2lCQUNJO2dCQUNBLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBeUIsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUM7YUFDdEU7U0FDSjtRQUVELEtBQUssTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3BFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsMENBQTBDLFFBQVEsR0FBRyxDQUFDLENBQUM7YUFDMUU7WUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7Z0JBQ2xDLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsR0FBRyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLDJCQUEyQjtvQkFDdkQsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPO29CQUNsQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsR0FBRyxFQUFFLENBQUMsR0FBWSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQzthQUNyQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7Q0FDSjtBQXhFRCwwREF3RUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgbm8tdW5zYWZlLWFueSBuby1ub24tbnVsbC1hc3NlcnRpb25cbi8vIF4gYXMgRGVsdGFNZXJnZWFibGVzIGFyZSBibGFjayBtYWdpYyBhbnl3YXlzXG5cbmltcG9ydCB7IGNyZWF0ZURlbHRhTWVyZ2VhYmxlLCBEZWx0YU1lcmdlYWJsZSB9IGZyb20gXCJ+L2NvcmUvZ2FtZS9kZWx0YS1tZXJnZWFibGVcIjtcbmltcG9ydCB7IElTYW5pdGl6YWJsZVR5cGUgfSBmcm9tIFwifi9jb3JlL3Nhbml0aXplL3Nhbml0aXphYmxlLWludGVyZmFjZXNcIjtcbmltcG9ydCB7IEltbXV0YWJsZSwgb2JqZWN0SGFzUHJvcGVydHksIFR5cGVkT2JqZWN0LCBVbmtub3duT2JqZWN0IH0gZnJvbSBcIn4vdXRpbHNcIjtcblxuLyoqXG4gKiBUaGUgYmFzZSBjbGFzcyBhbGwgZGVsdGEgbWVyZ2VhYmxlIGluc3RhbmNlcyBpbiAoYW5kIG9mKSB0aGUgZ2FtZSBpbmhlcml0XG4gKiBmcm9tLlxuICovXG5leHBvcnQgY2xhc3MgQmFzZUdhbWVEZWx0YU1lcmdlYWJsZXMge1xuICAgIC8qKiBPdXIgYWN0dWFsIERlbHRhTWVyZ2VhYmxlIGluc3RhbmNlICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBkZWx0YU1lcmdlYWJsZTogRGVsdGFNZXJnZWFibGU7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBvdXIgZGVsdGEgbWVyZ2VhYmxlLCBhbmQgc2V0cyBhbnkgaW5pdGlhbCB2YWx1ZXMuXG4gICAgICogQHBhcmFtIGFyZ3MgLSBUaGUgZGF0YSBuZWVkZWQgdG8gaG9va3VwIG91ciBEZWx0YU1lcmdlYWJsZS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihhcmdzOiB7XG4gICAgICAgIC8qKiBUaGUga2V5IHJlcHJlc2VudGluZyB0aGlzIG5vZGUuICovXG4gICAgICAgIGtleTogc3RyaW5nO1xuICAgICAgICAvKiogVGhlIHBhcmVudCBkZWx0YSBtZXJnYWJsZSwgaWYgbnVsbCB0aGVuIHRoaXMgaXMgdGhlIHJvb3QuICovXG4gICAgICAgIHBhcmVudD86IERlbHRhTWVyZ2VhYmxlOyAvLyB3aWxsIG11dGF0ZSBhcyBpdCBnZXRzIGEgbmV3IGNoaWxkXG5cbiAgICAgICAgLyoqIFNjaGVtYSBhYm91dCB0aGUgYXR0cmlidXRlcyB0byBmb2xsb3cgZm9yIHRoaXMgZW50cnkgKi9cbiAgICAgICAgYXR0cmlidXRlc1NjaGVtYTogSW1tdXRhYmxlPFR5cGVkT2JqZWN0PElTYW5pdGl6YWJsZVR5cGU+PjtcblxuICAgICAgICAvKiogSW5pdGlhbCB2YWx1ZShzKSB0byBzZXQgdG8gdXBvbiBjcmVhdGlvbi4gKi9cbiAgICAgICAgaW5pdGlhbFZhbHVlczogSW1tdXRhYmxlPHtba2V5OiBzdHJpbmddOiB1bmtub3dufT47XG4gICAgfSkge1xuICAgICAgICB0aGlzLmRlbHRhTWVyZ2VhYmxlID0gY3JlYXRlRGVsdGFNZXJnZWFibGUoe1xuICAgICAgICAgICAga2V5OiBhcmdzLmtleSxcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogdGhpcyxcbiAgICAgICAgICAgIHBhcmVudDogYXJncy5wYXJlbnQsXG4gICAgICAgICAgICBjaGlsZFR5cGVzOiBhcmdzLmF0dHJpYnV0ZXNTY2hlbWEsXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgICAgdHlwZU5hbWU6IFwiZ2FtZU9iamVjdFwiLFxuICAgICAgICAgICAgICAgIGdhbWVPYmplY3RDbGFzczogT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLmNvbnN0cnVjdG9yLCAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueSBuby11bnNhZmUtYW55XG4gICAgICAgICAgICAgICAgbnVsbGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gc2V0dXAgaW5pdGlhbCB2YWx1ZXNcbiAgICAgICAgZm9yIChjb25zdCBbIGtleSwgc2NoZW1hIF0gb2YgT2JqZWN0LmVudHJpZXMoYXJncy5hdHRyaWJ1dGVzU2NoZW1hKSkge1xuICAgICAgICAgICAgaWYgKCFzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNjaGVtYSBtdXN0IGV4aXN0IGZvciBwcm9wZXJ0eSAke2tleX1gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluaXRpYWxWYWx1ZSA9IG9iamVjdEhhc1Byb3BlcnR5KHNjaGVtYSwgXCJkZWZhdWx0VmFsdWVcIilcbiAgICAgICAgICAgICAgICA/IHNjaGVtYS5kZWZhdWx0VmFsdWVcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgaWYgKG9iamVjdEhhc1Byb3BlcnR5KGFyZ3MuaW5pdGlhbFZhbHVlcywga2V5KSkge1xuICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZSA9IGFyZ3MuaW5pdGlhbFZhbHVlc1trZXldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkbSA9IHRoaXMuZGVsdGFNZXJnZWFibGUuY2hpbGQoa2V5KTtcbiAgICAgICAgICAgIGlmIChkbSkge1xuICAgICAgICAgICAgICAgIGRtLnNldChpbml0aWFsVmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgKHRoaXMuZGVsdGFNZXJnZWFibGUud3JhcHBlciBhcyBVbmtub3duT2JqZWN0KVtrZXldID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChjb25zdCBbcHJvcGVydHksIHNjaGVtYV0gb2YgT2JqZWN0LmVudHJpZXMoYXJncy5hdHRyaWJ1dGVzU2NoZW1hKSkge1xuICAgICAgICAgICAgY29uc3QgZG0gPSB0aGlzLmRlbHRhTWVyZ2VhYmxlLmNoaWxkKHByb3BlcnR5KTtcblxuICAgICAgICAgICAgaWYgKCFkbSB8fCAhc2NoZW1hKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEZWx0YSBtZXJnZWFibGUgYXR0cmlidXRlIGV4cGVjdGVkIGZvciAke3Byb3BlcnR5fSFgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHByb3BlcnR5LCB7XG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSwgLy8gU2hvdyB1cCBpbiBmb3Igb2YgbG9vcHNcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLCAvLyBDYW4ndCBiZSBkZWxldGVkXG4gICAgICAgICAgICAgICAgZ2V0OiBzY2hlbWEudHlwZU5hbWUgPT09IFwibGlzdFwiIC8vIExpc3RzIGFyZSBiZWhpbmQgUHJveGllc1xuICAgICAgICAgICAgICAgICAgICA/ICgpID0+IGRtLndyYXBwZXJcbiAgICAgICAgICAgICAgICAgICAgOiAoKSA9PiBkbS5nZXQoKSxcbiAgICAgICAgICAgICAgICBzZXQ6ICh2YWw6IHVua25vd24pID0+IGRtLnNldCh2YWwpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=