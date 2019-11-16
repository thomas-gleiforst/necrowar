"use strict";
// tslint:disable:no-any no-non-null-assertion
// ^ as DeltaMergeables are black magic anyways
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("~/core/constants");
const create_delta_mergeable_1 = require("./create-delta-mergeable");
const delta_mergeable_1 = require("./delta-mergeable");
/**
 * Overrides of build-in array methods to be type safe at run time.
 */
class DeltaArray extends Array {
    /**
     * Inserts new elements at the start of an array.
     *
     * NOTE: This is overrides because the Node.js implementation clears
     * out the array while unshifting. However our arrays can never have
     * undefined set (which they are temporarily here), so it produces errors.
     *
     * This implementation below is less efficient, however it ensures an index
     * is never undefined, to maintain type safety at all times.
     * @param items  Elements to insert at the start of the Array.
     * @returns The new length of the array.
     */
    unshift(...items) {
        const newThis = [...items, ...this];
        const newLength = newThis.length;
        for (let i = 0; i < newLength; i++) {
            if (i < this.length) {
                this[i] = newThis[i];
            }
            else {
                this.push(newThis[i]);
            }
        }
        return newLength;
    }
}
/**
 * Creates a DeltaMergeable for an Array with a Proxy wrapper.
 * @param args - The creation args
 * @returns A new DeltaMergeable wrapping an Array.
 */
function createArray(args) {
    let oldLength = 0;
    const array = new DeltaArray();
    const values = new Array();
    const container = new delta_mergeable_1.DeltaMergeable({
        key: args.key,
        parent: args.parent,
        initialValue: array,
        transform: (newArray, currentValue) => {
            const copyFrom = newArray || [];
            // We won't allow people to re-set this array,
            // instead we will mutate the current array to match `newArray`
            for (let i = 0; i < copyFrom.length; i++) {
                currentValue[i] = copyFrom[i];
            }
            currentValue.length = copyFrom.length;
            return currentValue;
        },
    });
    const lengthDeltaMergeable = new delta_mergeable_1.DeltaMergeable({
        key: constants_1.SHARED_CONSTANTS.DELTA_LIST_LENGTH,
        parent: container,
        initialValue: 0,
    });
    function checkIfUpdated(index, value) {
        let newLength = array.length;
        if (index !== undefined
            && (index >= oldLength || index >= array.length)) {
            newLength = index + 1;
        }
        if (newLength !== oldLength) {
            if (newLength > oldLength) {
                // The array grew in size, so we need some new delta mergeables
                for (let i = oldLength; i < newLength; i++) {
                    const currentValue = i === index ? value : undefined;
                    if (values[i]) {
                        container.adopt(values[i]);
                        values[i].set(currentValue, true);
                    }
                    else {
                        values[i] = create_delta_mergeable_1.createDeltaMergeable({
                            key: String(i),
                            parent: container,
                            type: args.childType,
                            initialValue: currentValue,
                        });
                    }
                    array[i] = values[i].get();
                }
            }
            else { // newLength < oldLength
                for (let i = newLength; i < oldLength; i++) {
                    values[i].delete();
                }
            }
        }
        oldLength = array.length;
        lengthDeltaMergeable.set(oldLength);
    }
    const proxyArray = new Proxy(array, {
        set(target, property, value) {
            const index = Number(property);
            if (isNaN(index)) {
                if (property === "length") {
                    Reflect.set(target, property, value);
                    checkIfUpdated();
                    return true;
                }
                // All other strings are not able to be set on arrays
                return false;
            }
            // If we got here, we know that the property being set is an index
            checkIfUpdated(index, value);
            values[index].set(value);
            Reflect.set(target, property, values[index].get());
            return true;
        },
        deleteProperty(target, property) {
            const index = Number(property);
            if (isNaN(index)) {
                return false; // arrays can only delete numbers, not strings
            }
            values[index].delete();
            Reflect.deleteProperty(target, property);
            return true;
        },
    });
    container.wrapper = proxyArray;
    return container;
}
exports.createArray = createArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsdGEtbWVyZ2VhYmxlLWFycmF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvcmUvZ2FtZS9kZWx0YS1tZXJnZWFibGUvZGVsdGEtbWVyZ2VhYmxlLWFycmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4Q0FBOEM7QUFDOUMsK0NBQStDOztBQUUvQyxnREFBb0Q7QUFHcEQscUVBQWdFO0FBQ2hFLHVEQUFtRDtBQUVuRDs7R0FFRztBQUNILE1BQU0sVUFBYyxTQUFRLEtBQVE7SUFDaEM7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxPQUFPLENBQUMsR0FBRyxLQUFVO1FBQ3hCLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNwQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBRWpDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDakIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QjtpQkFDSTtnQkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pCO1NBQ0o7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0o7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFVLElBT3BDO0lBQ0csSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sS0FBSyxHQUFRLElBQUksVUFBVSxFQUFFLENBQUM7SUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQXFCLENBQUM7SUFDOUMsTUFBTSxTQUFTLEdBQUcsSUFBSSxnQ0FBYyxDQUFNO1FBQ3RDLEdB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QUFDO1lBRS9CLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNkLElBQUksUUFBUSxLQUFLLFFBQVEsRUFBRTtvQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUNyQyxjQUFjLEVBQUUsQ0FBQztvQkFFakIsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7Z0JBRUQscURBQXFEO2dCQUNyRCxPQUFPLEtBQUssQ0FBQzthQUNoQjtZQUVELGtFQUFrRTtZQUNsRSxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRW5ELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDRCxjQUFjLENBQUMsTUFBVyxFQUFFLFFBQXlCO1lBQ2pELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUvQixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDZCxPQUFPLEtBQUssQ0FBQyxDQUFDLDhDQUE4QzthQUMvRDtZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV6QyxPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO0tBQ0osQ0FBQyxDQUFDO0lBRUgsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7SUFFL0IsT0FBTyxTQUFTLENBQUM7QUFDckIsQ0FBQztBQXBIRCxrQ0FvSEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnkgbm8tbm9uLW51bGwtYXNzZXJ0aW9uXG4vLyBeIGFzIERlbHRhTWVyZ2VhYmxlcyBhcmUgYmxhY2sgbWFnaWMgYW55d2F5c1xuXG5pbXBvcnQgeyBTSEFSRURfQ09OU1RBTlRTIH0gZnJvbSBcIn4vY29yZS9jb25zdGFudHNcIjtcbmltcG9ydCB7IElTYW5pdGl6YWJsZVR5cGUgfSBmcm9tIFwifi9jb3JlL3Nhbml0aXplL3Nhbml0aXphYmxlLWludGVyZmFjZXNcIjtcbmltcG9ydCB7IEltbXV0YWJsZSB9IGZyb20gXCJ+L3V0aWxzXCI7XG5pbXBvcnQgeyBjcmVhdGVEZWx0YU1lcmdlYWJsZSB9IGZyb20gXCIuL2NyZWF0ZS1kZWx0YS1tZXJnZWFibGVcIjtcbmltcG9ydCB7IERlbHRhTWVyZ2VhYmxlIH0gZnJvbSBcIi4vZGVsdGEtbWVyZ2VhYmxlXCI7XG5cbi8qKlxuICogT3ZlcnJpZGVzIG9mIGJ1aWxkLWluIGFycmF5IG1ldGhvZHMgdG8gYmUgdHlwZSBzYWZlIGF0IHJ1biB0aW1lLlxuICovXG5jbGFzcyBEZWx0YUFycmF5PFQ+IGV4dGVuZHMgQXJyYXk8VD4ge1xuICAgIC8qKlxuICAgICAqIEluc2VydHMgbmV3IGVsZW1lbnRzIGF0IHRoZSBzdGFydCBvZiBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIE5PVEU6IFRoaXMgaXMgb3ZlcnJpZGVzIGJlY2F1c2UgdGhlIE5vZGUuanMgaW1wbGVtZW50YXRpb24gY2xlYXJzXG4gICAgICogb3V0IHRoZSBhcnJheSB3aGlsZSB1bnNoaWZ0aW5nLiBIb3dldmVyIG91ciBhcnJheXMgY2FuIG5ldmVyIGhhdmVcbiAgICAgKiB1bmRlZmluZWQgc2V0ICh3aGljaCB0aGV5IGFyZSB0ZW1wb3JhcmlseSBoZXJlKSwgc28gaXQgcHJvZHVjZXMgZXJyb3JzLlxuICAgICAqXG4gICAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBiZWxvdyBpcyBsZXNzIGVmZmljaWVudCwgaG93ZXZlciBpdCBlbnN1cmVzIGFuIGluZGV4XG4gICAgICogaXMgbmV2ZXIgdW5kZWZpbmVkLCB0byBtYWludGFpbiB0eXBlIHNhZmV0eSBhdCBhbGwgdGltZXMuXG4gICAgICogQHBhcmFtIGl0ZW1zICBFbGVtZW50cyB0byBpbnNlcnQgYXQgdGhlIHN0YXJ0IG9mIHRoZSBBcnJheS5cbiAgICAgKiBAcmV0dXJucyBUaGUgbmV3IGxlbmd0aCBvZiB0aGUgYXJyYXkuXG4gICAgICovXG4gICAgcHVibGljIHVuc2hpZnQoLi4uaXRlbXM6IFRbXSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG5ld1RoaXMgPSBbLi4uaXRlbXMsIC4uLnRoaXNdO1xuICAgICAgICBjb25zdCBuZXdMZW5ndGggPSBuZXdUaGlzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpc1tpXSA9IG5ld1RoaXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnB1c2gobmV3VGhpc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3TGVuZ3RoO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgRGVsdGFNZXJnZWFibGUgZm9yIGFuIEFycmF5IHdpdGggYSBQcm94eSB3cmFwcGVyLlxuICogQHBhcmFtIGFyZ3MgLSBUaGUgY3JlYXRpb24gYXJnc1xuICogQHJldHVybnMgQSBuZXcgRGVsdGFNZXJnZWFibGUgd3JhcHBpbmcgYW4gQXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcnJheTxUID0gYW55PihhcmdzOiB7XG4gICAgLyoqIFRoZSBrZXkgb2YgdGhpcyBhcnJheSBpbiBpdHMgcGFyZW50IGRlbHRhIG1lcmdhYmxlLiAqL1xuICAgIGtleTogc3RyaW5nO1xuICAgIC8qKiBUaGUgdHlwZSBvZiBhbGwgY2hpbGRyZW4gaW4gdGhpcyBBcnJheS4gKi9cbiAgICBjaGlsZFR5cGU6IEltbXV0YWJsZTxJU2FuaXRpemFibGVUeXBlPjtcbiAgICAvKiogVGhlIHBhcmVudCBvZiB0aGlzIG5vZGUuICovXG4gICAgcGFyZW50PzogRGVsdGFNZXJnZWFibGU7XG59KTogRGVsdGFNZXJnZWFibGU8VFtdPiB7XG4gICAgbGV0IG9sZExlbmd0aCA9IDA7XG4gICAgY29uc3QgYXJyYXk6IFRbXSA9IG5ldyBEZWx0YUFycmF5KCk7XG4gICAgY29uc3QgdmFsdWVzID0gbmV3IEFycmF5PERlbHRhTWVyZ2VhYmxlPFQ+PigpO1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IG5ldyBEZWx0YU1lcmdlYWJsZTxUW10+KHtcbiAgICAgICAga2V5OiBhcmdzLmtleSxcbiAgICAgICAgcGFyZW50OiBhcmdzLnBhcmVudCxcbiAgICAgICAgaW5pdGlhbFZhbHVlOiBhcnJheSxcbiAgICAgICAgdHJhbnNmb3JtOiAobmV3QXJyYXk6IFRbXSB8IHVuZGVmaW5lZCwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3B5RnJvbSA9IG5ld0FycmF5IHx8IFtdO1xuICAgICAgICAgICAgLy8gV2Ugd29uJ3QgYWxsb3cgcGVvcGxlIHRvIHJlLXNldCB0aGlzIGFycmF5LFxuICAgICAgICAgICAgLy8gaW5zdGVhZCB3ZSB3aWxsIG11dGF0ZSB0aGUgY3VycmVudCBhcnJheSB0byBtYXRjaCBgbmV3QXJyYXlgXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcHlGcm9tLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFZhbHVlIVtpXSA9IGNvcHlGcm9tW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudFZhbHVlIS5sZW5ndGggPSBjb3B5RnJvbS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50VmFsdWU7XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBsZW5ndGhEZWx0YU1lcmdlYWJsZSA9IG5ldyBEZWx0YU1lcmdlYWJsZTxudW1iZXI+KHtcbiAgICAgICAga2V5OiBTSEFSRURfQ09OU1RBTlRTLkRFTFRBX0xJU1RfTEVOR1RILFxuICAgICAgICBwYXJlbnQ6IGNvbnRhaW5lcixcbiAgICAgICAgaW5pdGlhbFZhbHVlOiAwLFxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tJZlVwZGF0ZWQoaW5kZXg/OiBudW1iZXIsIHZhbHVlPzogVCk6IHZvaWQge1xuICAgICAgICBsZXQgbmV3TGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gICAgICAgIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAmJiAoaW5kZXggPj0gb2xkTGVuZ3RoIHx8IGluZGV4ID49IGFycmF5Lmxlbmd0aClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBuZXdMZW5ndGggPSBpbmRleCArIDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3TGVuZ3RoICE9PSBvbGRMZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChuZXdMZW5ndGggPiBvbGRMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgYXJyYXkgZ3JldyBpbiBzaXplLCBzbyB3ZSBuZWVkIHNvbWUgbmV3IGRlbHRhIG1lcmdlYWJsZXNcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBvbGRMZW5ndGg7IGkgPCBuZXdMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBpID09PSBpbmRleCA/IHZhbHVlIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZG9wdCh2YWx1ZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2ldLnNldChjdXJyZW50VmFsdWUsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW2ldID0gY3JlYXRlRGVsdGFNZXJnZWFibGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogU3RyaW5nKGkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudDogY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGFyZ3MuY2hpbGRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxWYWx1ZTogY3VycmVudFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHZhbHVlc1tpXS5nZXQoKSE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IC8vIG5ld0xlbmd0aCA8IG9sZExlbmd0aFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBuZXdMZW5ndGg7IGkgPCBvbGRMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbaV0uZGVsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIG9sZExlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgbGVuZ3RoRGVsdGFNZXJnZWFibGUuc2V0KG9sZExlbmd0aCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJveHlBcnJheSA9IG5ldyBQcm94eShhcnJheSwge1xuICAgICAgICBzZXQodGFyZ2V0OiBUW10sIHByb3BlcnR5OiBzdHJpbmcgfCBudW1iZXIsIHZhbHVlOiBUKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibGVuZ3RoXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBjaGVja0lmVXBkYXRlZCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFsbCBvdGhlciBzdHJpbmdzIGFyZSBub3QgYWJsZSB0byBiZSBzZXQgb24gYXJyYXlzXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB3ZSBnb3QgaGVyZSwgd2Uga25vdyB0aGF0IHRoZSBwcm9wZXJ0eSBiZWluZyBzZXQgaXMgYW4gaW5kZXhcbiAgICAgICAgICAgIGNoZWNrSWZVcGRhdGVkKGluZGV4LCB2YWx1ZSk7XG4gICAgICAgICAgICB2YWx1ZXNbaW5kZXhdLnNldCh2YWx1ZSk7XG4gICAgICAgICAgICBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZXNbaW5kZXhdLmdldCgpKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZVByb3BlcnR5KHRhcmdldDogVFtdLCBwcm9wZXJ0eTogc3RyaW5nIHwgbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IE51bWJlcihwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgIGlmIChpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIGFycmF5cyBjYW4gb25seSBkZWxldGUgbnVtYmVycywgbm90IHN0cmluZ3NcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWVzW2luZGV4XS5kZWxldGUoKTtcbiAgICAgICAgICAgIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29udGFpbmVyLndyYXBwZXIgPSBwcm94eUFycmF5O1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbn1cbiJdfQ==