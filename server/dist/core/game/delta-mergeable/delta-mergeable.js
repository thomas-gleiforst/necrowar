"use strict";
// tslint:disable:no-any no-unsafe-any no-non-null-assertion
// ^ as DeltaMergeables are black magic anyways
Object.defineProperty(exports, "__esModule", { value: true });
const ts_typed_events_1 = require("ts-typed-events");
/**
 * Wraps a property in the game to observe for changes (deltas).
 * Each DeltaMergeable can have child values, such as an array with child index
 * DeltaMergeables. This builds up a tree representing the game, used to build
 * delta states.
 */
class DeltaMergeable {
    /**
     * Creates a new delta mergeable. it's creation will trigger a change in
     * parent(s).
     * @param data - Initialization data about the parent and value of this DM.
     */
    constructor(data) {
        /** The events this delta mergeable emits when it mutates */
        this.events = ts_typed_events_1.events({
            changed: new ts_typed_events_1.Event(),
            deleted: new ts_typed_events_1.Event(),
        });
        /** The child nodes. If empty this is a leaf node. */
        this.children = new Map();
        this.key = data.key;
        if (data.parent) {
            data.parent.adopt(this);
        }
        // So the setter has a current value to work with if transforms happen
        this.value = data.initialValue;
        this.transform = data.transform;
        this.set(data.initialValue, true);
    }
    /**
     * Gets our parent, if we have one.
     * @returns Our parent, if we have one.
     */
    getParent() {
        return this.parent;
    }
    /**
     * Gets our current value.
     * @returns Our current value.
     */
    get() {
        return this.value;
    }
    /**
     * Sets the current value. It may mutate or not, if it does it will
     * emit an event.
     *
     * @param newValue - The new value to try to set.
     * @param forceSet - Force the set to occur, even if the current value is
     * the same.
     */
    set(newValue, forceSet = false) {
        const value = this.transform
            ? this.transform(newValue, this.get(), forceSet)
            : newValue;
        if (value !== this.value || forceSet) {
            this.value = value;
            this.events.changed.emit(this);
        }
    }
    /** Deletes this leaf and notifies upstream that it was deleted. */
    delete() {
        this.value = undefined;
        this.events.deleted.emit(this);
        this.parent = undefined;
    }
    // Children operations \\
    /**
     * Adds a child node.
     *
     * **NOTE**: You cannot adopt nodes that already have a parent.
     *
     * @param child - The child node to adopt
     */
    adopt(child) {
        if (child.parent === this) {
            return; // nothing to do
        }
        if (child.parent) {
            throw new Error("Cannot adopt a child who already has a parent");
        }
        child.parent = this;
        this.children.set(child.key, child);
        const onChanged = (changed) => {
            this.events.changed.emit(changed);
        };
        child.events.changed.on(onChanged);
        child.events.deleted.on((deleted) => {
            if (deleted === child) {
                // our child has been deleted :(
                deleted.events.changed.off(onChanged);
                this.children.delete(deleted.key);
            }
            // notify upstream
            this.events.deleted.emit(deleted);
        });
    }
    /**
     * Gets our child with the given key, if we have it.
     * @param key - They key of the child to check for.
     * @returns The child, if it exists, otherwise undefined.
     */
    child(key) {
        return this.children.get(key);
    }
}
exports.DeltaMergeable = DeltaMergeable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsdGEtbWVyZ2VhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvZ2FtZS9kZWx0YS1tZXJnZWFibGUvZGVsdGEtbWVyZ2VhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0REFBNEQ7QUFDNUQsK0NBQStDOztBQUUvQyxxREFBZ0Q7QUFTaEQ7Ozs7O0dBS0c7QUFDSCxNQUFhLGNBQWM7SUEyQnZCOzs7O09BSUc7SUFDSCxZQUFZLElBU1g7UUFoQ0QsNERBQTREO1FBQzVDLFdBQU0sR0FBRyx3QkFBTSxDQUFDO1lBQzVCLE9BQU8sRUFBRSxJQUFJLHVCQUFLLEVBQWtCO1lBQ3BDLE9BQU8sRUFBRSxJQUFJLHVCQUFLLEVBQWtCO1NBQ3ZDLENBQUMsQ0FBQztRQUtILHFEQUFxRDtRQUNwQyxhQUFRLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUF1QjFELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUVwQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQjtRQUVELHNFQUFzRTtRQUN0RSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFFL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksU0FBUztRQUNaLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksR0FBRztRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEdBQUcsQ0FBQyxRQUFhLEVBQUUsV0FBb0IsS0FBSztRQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUztZQUN4QixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsQ0FBQztZQUNoRCxDQUFDLENBQUMsUUFBUSxDQUFDO1FBRWYsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssSUFBSSxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFFbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDO0lBQ0wsQ0FBQztJQUVELG1FQUFtRTtJQUM1RCxNQUFNO1FBQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQzVCLENBQUM7SUFFRCx5QkFBeUI7SUFFekI7Ozs7OztPQU1HO0lBQ0ksS0FBSyxDQUFDLEtBQXFCO1FBQzlCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDdkIsT0FBTyxDQUFDLGdCQUFnQjtTQUMzQjtRQUVELElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUNwRTtRQUVELEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxPQUF1QixFQUFFLEVBQUU7WUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQztRQUNGLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVuQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNoQyxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7Z0JBQ25CLGdDQUFnQztnQkFDaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDckM7WUFFRCxrQkFBa0I7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsR0FBVztRQUNwQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FDSjtBQWhKRCx3Q0FnSkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgbm8tdW5zYWZlLWFueSBuby1ub24tbnVsbC1hc3NlcnRpb25cbi8vIF4gYXMgRGVsdGFNZXJnZWFibGVzIGFyZSBibGFjayBtYWdpYyBhbnl3YXlzXG5cbmltcG9ydCB7IEV2ZW50LCBldmVudHMgfSBmcm9tIFwidHMtdHlwZWQtZXZlbnRzXCI7XG5cbi8qKiBBbiBvcHRpb25hbCB0cmFuc2Zvcm0gZnVuY3Rpb24gZm9yIGRlbHRhIG1lcmdlYWJsZXMgKi9cbmV4cG9ydCB0eXBlIERlbHRhVHJhbnNmb3JtPFQ+ID0gKFxuICAgIHZhbHVlOiBhbnksXG4gICAgY3VycmVudFZhbHVlOiBUIHwgdW5kZWZpbmVkLFxuICAgIGZvcmNlU2V0OiBib29sZWFuLFxuKSA9PiBUIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIFdyYXBzIGEgcHJvcGVydHkgaW4gdGhlIGdhbWUgdG8gb2JzZXJ2ZSBmb3IgY2hhbmdlcyAoZGVsdGFzKS5cbiAqIEVhY2ggRGVsdGFNZXJnZWFibGUgY2FuIGhhdmUgY2hpbGQgdmFsdWVzLCBzdWNoIGFzIGFuIGFycmF5IHdpdGggY2hpbGQgaW5kZXhcbiAqIERlbHRhTWVyZ2VhYmxlcy4gVGhpcyBidWlsZHMgdXAgYSB0cmVlIHJlcHJlc2VudGluZyB0aGUgZ2FtZSwgdXNlZCB0byBidWlsZFxuICogZGVsdGEgc3RhdGVzLlxuICovXG5leHBvcnQgY2xhc3MgRGVsdGFNZXJnZWFibGU8VCA9IGFueT4ge1xuICAgIC8qKiBUaGUga2V5IHBhcmVudCB0aGlzIGlzICovXG4gICAgcHVibGljIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgdGhpcyBkZWx0YSBtZXJnZWFibGUgaW4gc29tZSBvYmplY3QgbGlrZSBhbiBhcnJheSBvciBqcyBvYmplY3QuXG4gICAgICovXG4gICAgcHVibGljIHdyYXBwZXI/OiBvYmplY3Q7XG5cbiAgICAvKiogVGhlIGV2ZW50cyB0aGlzIGRlbHRhIG1lcmdlYWJsZSBlbWl0cyB3aGVuIGl0IG11dGF0ZXMgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRzID0gZXZlbnRzKHtcbiAgICAgICAgY2hhbmdlZDogbmV3IEV2ZW50PERlbHRhTWVyZ2VhYmxlPigpLFxuICAgICAgICBkZWxldGVkOiBuZXcgRXZlbnQ8RGVsdGFNZXJnZWFibGU+KCksXG4gICAgfSk7XG5cbiAgICAvKiogVGhlIHBhcmVudCBkZWx0YSBtZXJnZWFibGUsIGlmIHVuZGVmaW5lZCB0aGVuIGl0IGlzIHRoZSByb290LiAqL1xuICAgIHByaXZhdGUgcGFyZW50OiBEZWx0YU1lcmdlYWJsZSB8IHVuZGVmaW5lZDtcblxuICAgIC8qKiBUaGUgY2hpbGQgbm9kZXMuIElmIGVtcHR5IHRoaXMgaXMgYSBsZWFmIG5vZGUuICovXG4gICAgcHJpdmF0ZSByZWFkb25seSBjaGlsZHJlbiA9IG5ldyBNYXA8c3RyaW5nLCBEZWx0YU1lcmdlYWJsZT4oKTtcblxuICAgIC8qKiBBbiBvcHRpb25hbCB0cmFuc2Zvcm0gZnVuY3Rpb24gdG8gdXNlIG9uIGFsbCBzZXRzLiAqL1xuICAgIHByaXZhdGUgdHJhbnNmb3JtPzogRGVsdGFUcmFuc2Zvcm08VD47XG5cbiAgICAvKiogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIG5vZGUuICovXG4gICAgcHJpdmF0ZSB2YWx1ZTogVCB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgZGVsdGEgbWVyZ2VhYmxlLiBpdCdzIGNyZWF0aW9uIHdpbGwgdHJpZ2dlciBhIGNoYW5nZSBpblxuICAgICAqIHBhcmVudChzKS5cbiAgICAgKiBAcGFyYW0gZGF0YSAtIEluaXRpYWxpemF0aW9uIGRhdGEgYWJvdXQgdGhlIHBhcmVudCBhbmQgdmFsdWUgb2YgdGhpcyBETS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihkYXRhOiB7XG4gICAgICAgIC8qKiBUaGUga2V5IG9mIHRoaXMgZGVsdGEgbWVyZ2FibGUgaW4gaXRzIHBhcmVudC4gKi9cbiAgICAgICAga2V5OiBzdHJpbmc7XG4gICAgICAgIC8qKiBUaGUgcGFyZW50IERlbHRhTWVyZ2VhYmxlLCBpZiBudWxsIGFzc3VtZWQgdG8gYmUgcm9vdCBub2RlLiAqL1xuICAgICAgICBwYXJlbnQ/OiBEZWx0YU1lcmdlYWJsZTtcbiAgICAgICAgLyoqIFRoZSBpbml0aWFsIHZhbHVlIG9mIHRoaXMgbm9kZS4gKi9cbiAgICAgICAgaW5pdGlhbFZhbHVlPzogVDtcbiAgICAgICAgLyoqIEFuIG9wdGlvbmFsIHRyYW5zZm9ybSBmdW5jdGlvbiB0byBlbnN1cmUgYW55IHNldCB2YWx1ZXMgYXJlIHRoZSBjb3JyZWN0IHR5cGUuICovXG4gICAgICAgIHRyYW5zZm9ybT86IERlbHRhVHJhbnNmb3JtPFQ+O1xuICAgIH0pIHtcbiAgICAgICAgdGhpcy5rZXkgPSBkYXRhLmtleTtcblxuICAgICAgICBpZiAoZGF0YS5wYXJlbnQpIHtcbiAgICAgICAgICAgIGRhdGEucGFyZW50LmFkb3B0KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU28gdGhlIHNldHRlciBoYXMgYSBjdXJyZW50IHZhbHVlIHRvIHdvcmsgd2l0aCBpZiB0cmFuc2Zvcm1zIGhhcHBlblxuICAgICAgICB0aGlzLnZhbHVlID0gZGF0YS5pbml0aWFsVmFsdWU7XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0gPSBkYXRhLnRyYW5zZm9ybTtcbiAgICAgICAgdGhpcy5zZXQoZGF0YS5pbml0aWFsVmFsdWUsIHRydWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgb3VyIHBhcmVudCwgaWYgd2UgaGF2ZSBvbmUuXG4gICAgICogQHJldHVybnMgT3VyIHBhcmVudCwgaWYgd2UgaGF2ZSBvbmUuXG4gICAgICovXG4gICAgcHVibGljIGdldFBhcmVudCgpOiBEZWx0YU1lcmdlYWJsZTxUPiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcmVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIG91ciBjdXJyZW50IHZhbHVlLlxuICAgICAqIEByZXR1cm5zIE91ciBjdXJyZW50IHZhbHVlLlxuICAgICAqL1xuICAgIHB1YmxpYyBnZXQoKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIGN1cnJlbnQgdmFsdWUuIEl0IG1heSBtdXRhdGUgb3Igbm90LCBpZiBpdCBkb2VzIGl0IHdpbGxcbiAgICAgKiBlbWl0IGFuIGV2ZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIG5ld1ZhbHVlIC0gVGhlIG5ldyB2YWx1ZSB0byB0cnkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSBmb3JjZVNldCAtIEZvcmNlIHRoZSBzZXQgdG8gb2NjdXIsIGV2ZW4gaWYgdGhlIGN1cnJlbnQgdmFsdWUgaXNcbiAgICAgKiB0aGUgc2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0KG5ld1ZhbHVlOiBhbnksIGZvcmNlU2V0OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnRyYW5zZm9ybVxuICAgICAgICAgICAgPyB0aGlzLnRyYW5zZm9ybShuZXdWYWx1ZSwgdGhpcy5nZXQoKSwgZm9yY2VTZXQpXG4gICAgICAgICAgICA6IG5ld1ZhbHVlO1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdGhpcy52YWx1ZSB8fCBmb3JjZVNldCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5jaGFuZ2VkLmVtaXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKiogRGVsZXRlcyB0aGlzIGxlYWYgYW5kIG5vdGlmaWVzIHVwc3RyZWFtIHRoYXQgaXQgd2FzIGRlbGV0ZWQuICovXG4gICAgcHVibGljIGRlbGV0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5ldmVudHMuZGVsZXRlZC5lbWl0KHRoaXMpO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBDaGlsZHJlbiBvcGVyYXRpb25zIFxcXFxcblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBjaGlsZCBub2RlLlxuICAgICAqXG4gICAgICogKipOT1RFKio6IFlvdSBjYW5ub3QgYWRvcHQgbm9kZXMgdGhhdCBhbHJlYWR5IGhhdmUgYSBwYXJlbnQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2hpbGQgLSBUaGUgY2hpbGQgbm9kZSB0byBhZG9wdFxuICAgICAqL1xuICAgIHB1YmxpYyBhZG9wdChjaGlsZDogRGVsdGFNZXJnZWFibGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNoaWxkLnBhcmVudCA9PT0gdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBub3RoaW5nIHRvIGRvXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGQucGFyZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgYWRvcHQgYSBjaGlsZCB3aG8gYWxyZWFkeSBoYXMgYSBwYXJlbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnNldChjaGlsZC5rZXksIGNoaWxkKTtcblxuICAgICAgICBjb25zdCBvbkNoYW5nZWQgPSAoY2hhbmdlZDogRGVsdGFNZXJnZWFibGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmNoYW5nZWQuZW1pdChjaGFuZ2VkKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hpbGQuZXZlbnRzLmNoYW5nZWQub24ob25DaGFuZ2VkKTtcblxuICAgICAgICBjaGlsZC5ldmVudHMuZGVsZXRlZC5vbigoZGVsZXRlZCkgPT4ge1xuICAgICAgICAgICAgaWYgKGRlbGV0ZWQgPT09IGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgLy8gb3VyIGNoaWxkIGhhcyBiZWVuIGRlbGV0ZWQgOihcbiAgICAgICAgICAgICAgICBkZWxldGVkLmV2ZW50cy5jaGFuZ2VkLm9mZihvbkNoYW5nZWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZGVsZXRlKGRlbGV0ZWQua2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm90aWZ5IHVwc3RyZWFtXG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGVkLmVtaXQoZGVsZXRlZCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgb3VyIGNoaWxkIHdpdGggdGhlIGdpdmVuIGtleSwgaWYgd2UgaGF2ZSBpdC5cbiAgICAgKiBAcGFyYW0ga2V5IC0gVGhleSBrZXkgb2YgdGhlIGNoaWxkIHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcmV0dXJucyBUaGUgY2hpbGQsIGlmIGl0IGV4aXN0cywgb3RoZXJ3aXNlIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgY2hpbGQoa2V5OiBzdHJpbmcpOiBEZWx0YU1lcmdlYWJsZTxUPiB8IHVuZGVmaW5lZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmdldChrZXkpO1xuICAgIH1cbn1cbiJdfQ==