"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const random = require("seedrandom");
const utils_1 = require("~/utils");
/** A simple class wrapper for generating random numbers */
class RandomNumberGenerator {
    /**
     * Creates a random number generator that can be seeded with useful
     * methods for games to leverage.
     * @param seed - The optional rng seed to use.
     */
    constructor(seed) {
        this.random = random(seed);
    }
    /**
     * Returns a random integer within the range of upper to lower (inclusive).
     *
     * @param upper - The upper range, this number is NOT valid as a random
     * return value.
     * @param lower - The lower range, defaults to 0.
     * @returns A random integer within the range lower to upper.
     */
    int(upper = 1, lower = 0) {
        const max = Math.round(Math.max(upper, lower));
        const min = Math.round(Math.min(upper, lower));
        return Math.abs(this.random.int32() % (max - min)) + min;
    }
    /**
     * Returns a random floating point number within the range of upper to
     * lower (inclusive).
     *
     * @param upper - The upper range, this number is NOT valid as a random
     * return value.
     * @param lower - The lower range, defaults to 0.
     * @returns A random integer within the range lower to upper.
     */
    float(upper = 1, lower = 0) {
        const max = Math.max(upper, lower);
        const min = Math.min(upper, lower);
        return this.random.double() * (max - min) + min;
    }
    /**
     * Shuffles an array IN PLACE using the PRNG.
     *
     * @param array - The array to shuffle in place.
     * @returns The same array, now shuffled.
     */
    shuffle(array) {
        utils_1.shuffle(array, () => this.float());
    }
    /**
     * Selects a random element from an array using the PRNG.
     *
     * @param array - The array to select from.
     * @returns An element from the array, or undefined if the array was empty.
     */
    element(array) {
        return array[Math.floor(this.float() * array.length)];
    }
    /**
     * Selects a random element from an array using the PRNG, and pops it
     * (removes it from the array and returns it)
     *
     * @param array - The array to select from.
     * @returns An element from the array, or undefined if the array was empty.
     * The array is mutated if it contained elements, as the return value is
     * removed.
     */
    pop(array) {
        const index = Math.floor(this.float() * array.length);
        const popped = array[index];
        // remove that element, mutating the array
        array.splice(index, 1);
        return popped;
    }
    /**
     * Selects a random element from a map of weights.
     *
     * @param map - The map. Where keys are the elements you want to choose
     * from, and their values are their weights.
     *
     * Weights do not need to be uniform, or sum up to 1.00. Any values will
     * work and will all be relative to the rest.
     * @returns An element (key) from the map.
     * @example
     * const map = new Map<string, number>();
     * map.add("half", 0.5);
     * map.add("quarter", 0.25);
     * map.add("rarely", 0.01);
     * map.add("never", 0.00);
     *
     * const chosen: string = rng.fromWeights(map);
     */
    fromWeights(map) {
        let sum = 0;
        for (const num of map.values()) {
            sum += num;
        }
        const choice = this.float(sum);
        let upTo = 0;
        for (const [item, weight] of map) {
            upTo += weight;
            if (upTo >= choice) {
                return item; // They can mutate the item, we don't care.
            }
        }
        throw new Error(`Could not chose item for fromWeights.
Ensure your Map has entries`);
    }
}
exports.RandomNumberGenerator = RandomNumberGenerator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLW51bWJlci1nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29yZS9nYW1lL3JhbmRvbS1udW1iZXItZ2VuZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLG1DQUE0RDtBQUU1RCwyREFBMkQ7QUFDM0QsTUFBYSxxQkFBcUI7SUFJOUI7Ozs7T0FJRztJQUNILFlBQVksSUFBYTtRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLEdBQUcsQ0FBQyxRQUFnQixDQUFDLEVBQUUsUUFBZ0IsQ0FBQztRQUMzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRS9DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzdELENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLEtBQUssQ0FBQyxRQUFnQixDQUFDLEVBQUUsUUFBZ0IsQ0FBQztRQUM3QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE9BQU8sQ0FBSSxLQUFVO1FBQ3hCLGVBQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQWtCRDs7Ozs7T0FLRztJQUNJLE9BQU8sQ0FBSSxLQUF1QjtRQUNyQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBd0JEOzs7Ozs7OztPQVFHO0lBQ0ksR0FBRyxDQUFJLEtBQVU7UUFDcEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU1QiwwQ0FBMEM7UUFDMUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFdkIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztPQWlCRztJQUNJLFdBQVcsQ0FBSSxHQUE4QjtRQUNoRCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDWixLQUFLLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM1QixHQUFHLElBQUksR0FBRyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNiLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUU7WUFDOUIsSUFBSSxJQUFJLE1BQU0sQ0FBQztZQUNmLElBQUksSUFBSSxJQUFJLE1BQU0sRUFBRTtnQkFDaEIsT0FBTyxJQUFJLENBQUMsQ0FBQywyQ0FBMkM7YUFDM0Q7U0FDSjtRQUVELE1BQU0sSUFBSSxLQUFLLENBQUM7NEJBQ0ksQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FDSjtBQTdKRCxzREE2SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyByYW5kb20gZnJvbSBcInNlZWRyYW5kb21cIjtcbmltcG9ydCB7IEltbXV0YWJsZSwgTm9uRW1wdHlBcnJheSwgc2h1ZmZsZSB9IGZyb20gXCJ+L3V0aWxzXCI7XG5cbi8qKiBBIHNpbXBsZSBjbGFzcyB3cmFwcGVyIGZvciBnZW5lcmF0aW5nIHJhbmRvbSBudW1iZXJzICovXG5leHBvcnQgY2xhc3MgUmFuZG9tTnVtYmVyR2VuZXJhdG9yIHtcbiAgICAvKiogVGhlIHJhbmRvbSBsaWJyYXJ5IGludGVyZmFjZSB3ZSBhcmUgd3JhcHBpbmcgYXJvdW5kLiAqL1xuICAgIHByaXZhdGUgcmVhZG9ubHkgcmFuZG9tOiByYW5kb20ucHJuZztcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSByYW5kb20gbnVtYmVyIGdlbmVyYXRvciB0aGF0IGNhbiBiZSBzZWVkZWQgd2l0aCB1c2VmdWxcbiAgICAgKiBtZXRob2RzIGZvciBnYW1lcyB0byBsZXZlcmFnZS5cbiAgICAgKiBAcGFyYW0gc2VlZCAtIFRoZSBvcHRpb25hbCBybmcgc2VlZCB0byB1c2UuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc2VlZD86IHN0cmluZykge1xuICAgICAgICB0aGlzLnJhbmRvbSA9IHJhbmRvbShzZWVkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcmFuZG9tIGludGVnZXIgd2l0aGluIHRoZSByYW5nZSBvZiB1cHBlciB0byBsb3dlciAoaW5jbHVzaXZlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB1cHBlciAtIFRoZSB1cHBlciByYW5nZSwgdGhpcyBudW1iZXIgaXMgTk9UIHZhbGlkIGFzIGEgcmFuZG9tXG4gICAgICogcmV0dXJuIHZhbHVlLlxuICAgICAqIEBwYXJhbSBsb3dlciAtIFRoZSBsb3dlciByYW5nZSwgZGVmYXVsdHMgdG8gMC5cbiAgICAgKiBAcmV0dXJucyBBIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiB0aGUgcmFuZ2UgbG93ZXIgdG8gdXBwZXIuXG4gICAgICovXG4gICAgcHVibGljIGludCh1cHBlcjogbnVtYmVyID0gMSwgbG93ZXI6IG51bWJlciA9IDApOiBudW1iZXIge1xuICAgICAgICBjb25zdCBtYXggPSBNYXRoLnJvdW5kKE1hdGgubWF4KHVwcGVyLCBsb3dlcikpO1xuICAgICAgICBjb25zdCBtaW4gPSBNYXRoLnJvdW5kKE1hdGgubWluKHVwcGVyLCBsb3dlcikpO1xuXG4gICAgICAgIHJldHVybiBNYXRoLmFicyh0aGlzLnJhbmRvbS5pbnQzMigpICUgKG1heCAtIG1pbikpICsgbWluO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSByYW5kb20gZmxvYXRpbmcgcG9pbnQgbnVtYmVyIHdpdGhpbiB0aGUgcmFuZ2Ugb2YgdXBwZXIgdG9cbiAgICAgKiBsb3dlciAoaW5jbHVzaXZlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB1cHBlciAtIFRoZSB1cHBlciByYW5nZSwgdGhpcyBudW1iZXIgaXMgTk9UIHZhbGlkIGFzIGEgcmFuZG9tXG4gICAgICogcmV0dXJuIHZhbHVlLlxuICAgICAqIEBwYXJhbSBsb3dlciAtIFRoZSBsb3dlciByYW5nZSwgZGVmYXVsdHMgdG8gMC5cbiAgICAgKiBAcmV0dXJucyBBIHJhbmRvbSBpbnRlZ2VyIHdpdGhpbiB0aGUgcmFuZ2UgbG93ZXIgdG8gdXBwZXIuXG4gICAgICovXG4gICAgcHVibGljIGZsb2F0KHVwcGVyOiBudW1iZXIgPSAxLCBsb3dlcjogbnVtYmVyID0gMCk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG1heCA9IE1hdGgubWF4KHVwcGVyLCBsb3dlcik7XG4gICAgICAgIGNvbnN0IG1pbiA9IE1hdGgubWluKHVwcGVyLCBsb3dlcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucmFuZG9tLmRvdWJsZSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2h1ZmZsZXMgYW4gYXJyYXkgSU4gUExBQ0UgdXNpbmcgdGhlIFBSTkcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgLSBUaGUgYXJyYXkgdG8gc2h1ZmZsZSBpbiBwbGFjZS5cbiAgICAgKiBAcmV0dXJucyBUaGUgc2FtZSBhcnJheSwgbm93IHNodWZmbGVkLlxuICAgICAqL1xuICAgIHB1YmxpYyBzaHVmZmxlPFQ+KGFycmF5OiBUW10pOiB2b2lkIHtcbiAgICAgICAgc2h1ZmZsZShhcnJheSwgKCkgPT4gdGhpcy5mbG9hdCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhbiBhcnJheSB1c2luZyB0aGUgUFJORy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSB0byBzZWxlY3QgZnJvbS5cbiAgICAgKiBAcmV0dXJucyBBbiBlbGVtZW50IGZyb20gdGhlIGFycmF5LCBvciB1bmRlZmluZWQgaWYgdGhlIGFycmF5IHdhcyBlbXB0eS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDxUPihhcnJheTogTm9uRW1wdHlBcnJheTxUPik6IFQ7XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhbiBhcnJheSB1c2luZyB0aGUgUFJORy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSAtIFRoZSBhcnJheSB0byBzZWxlY3QgZnJvbS5cbiAgICAgKiBAcmV0dXJucyBBbiBlbGVtZW50IGZyb20gdGhlIGFycmF5LCBvciB1bmRlZmluZWQgaWYgdGhlIGFycmF5IHdhcyBlbXB0eS5cbiAgICAgKi9cbiAgICBwdWJsaWMgZWxlbWVudDxUPihhcnJheTogVFtdKTogVCB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFNlbGVjdHMgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5IHVzaW5nIHRoZSBQUk5HLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IHRvIHNlbGVjdCBmcm9tLlxuICAgICAqIEByZXR1cm5zIEFuIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXksIG9yIHVuZGVmaW5lZCBpZiB0aGUgYXJyYXkgd2FzIGVtcHR5LlxuICAgICAqL1xuICAgIHB1YmxpYyBlbGVtZW50PFQ+KGFycmF5OiBOb25FbXB0eUFycmF5PFQ+KTogVCB7XG4gICAgICAgIHJldHVybiBhcnJheVtNYXRoLmZsb29yKHRoaXMuZmxvYXQoKSAqIGFycmF5Lmxlbmd0aCldO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbGVjdHMgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5IHVzaW5nIHRoZSBQUk5HLCBhbmQgcG9wcyBpdFxuICAgICAqIChyZW1vdmVzIGl0IGZyb20gdGhlIGFycmF5IGFuZCByZXR1cm5zIGl0KVxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IHRvIHNlbGVjdCBmcm9tLlxuICAgICAqIEByZXR1cm5zIEFuIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXkuXG4gICAgICogVGhlIGFycmF5IGlzIG11dGF0ZWQgaWYgaXQgY29udGFpbmVkIGVsZW1lbnRzLCBhcyB0aGUgcmV0dXJuIHZhbHVlIGlzXG4gICAgICogcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcG9wPFQ+KGFycmF5OiBOb25FbXB0eUFycmF5PFQ+KTogVDtcblxuICAgIC8qKlxuICAgICAqIFNlbGVjdHMgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5IHVzaW5nIHRoZSBQUk5HLCBhbmQgcG9wcyBpdFxuICAgICAqIChyZW1vdmVzIGl0IGZyb20gdGhlIGFycmF5IGFuZCByZXR1cm5zIGl0KVxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IHRvIHNlbGVjdCBmcm9tLlxuICAgICAqIEByZXR1cm5zIEFuIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXksIG9yIHVuZGVmaW5lZCBpZiB0aGUgYXJyYXkgd2FzIGVtcHR5LlxuICAgICAqIFRoZSBhcnJheSBpcyBtdXRhdGVkIGlmIGl0IGNvbnRhaW5lZCBlbGVtZW50cywgYXMgdGhlIHJldHVybiB2YWx1ZSBpc1xuICAgICAqIHJlbW92ZWQuXG4gICAgICovXG4gICAgcHVibGljIHBvcDxUPihhcnJheTogVFtdKTogVCB8IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFNlbGVjdHMgYSByYW5kb20gZWxlbWVudCBmcm9tIGFuIGFycmF5IHVzaW5nIHRoZSBQUk5HLCBhbmQgcG9wcyBpdFxuICAgICAqIChyZW1vdmVzIGl0IGZyb20gdGhlIGFycmF5IGFuZCByZXR1cm5zIGl0KVxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IC0gVGhlIGFycmF5IHRvIHNlbGVjdCBmcm9tLlxuICAgICAqIEByZXR1cm5zIEFuIGVsZW1lbnQgZnJvbSB0aGUgYXJyYXksIG9yIHVuZGVmaW5lZCBpZiB0aGUgYXJyYXkgd2FzIGVtcHR5LlxuICAgICAqIFRoZSBhcnJheSBpcyBtdXRhdGVkIGlmIGl0IGNvbnRhaW5lZCBlbGVtZW50cywgYXMgdGhlIHJldHVybiB2YWx1ZSBpc1xuICAgICAqIHJlbW92ZWQuXG4gICAgICovXG4gICAgcHVibGljIHBvcDxUPihhcnJheTogVFtdKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcih0aGlzLmZsb2F0KCkgKiBhcnJheS5sZW5ndGgpO1xuICAgICAgICBjb25zdCBwb3BwZWQgPSBhcnJheVtpbmRleF07XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoYXQgZWxlbWVudCwgbXV0YXRpbmcgdGhlIGFycmF5XG4gICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgcmV0dXJuIHBvcHBlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZWxlY3RzIGEgcmFuZG9tIGVsZW1lbnQgZnJvbSBhIG1hcCBvZiB3ZWlnaHRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1hcCAtIFRoZSBtYXAuIFdoZXJlIGtleXMgYXJlIHRoZSBlbGVtZW50cyB5b3Ugd2FudCB0byBjaG9vc2VcbiAgICAgKiBmcm9tLCBhbmQgdGhlaXIgdmFsdWVzIGFyZSB0aGVpciB3ZWlnaHRzLlxuICAgICAqXG4gICAgICogV2VpZ2h0cyBkbyBub3QgbmVlZCB0byBiZSB1bmlmb3JtLCBvciBzdW0gdXAgdG8gMS4wMC4gQW55IHZhbHVlcyB3aWxsXG4gICAgICogd29yayBhbmQgd2lsbCBhbGwgYmUgcmVsYXRpdmUgdG8gdGhlIHJlc3QuXG4gICAgICogQHJldHVybnMgQW4gZWxlbWVudCAoa2V5KSBmcm9tIHRoZSBtYXAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjb25zdCBtYXAgPSBuZXcgTWFwPHN0cmluZywgbnVtYmVyPigpO1xuICAgICAqIG1hcC5hZGQoXCJoYWxmXCIsIDAuNSk7XG4gICAgICogbWFwLmFkZChcInF1YXJ0ZXJcIiwgMC4yNSk7XG4gICAgICogbWFwLmFkZChcInJhcmVseVwiLCAwLjAxKTtcbiAgICAgKiBtYXAuYWRkKFwibmV2ZXJcIiwgMC4wMCk7XG4gICAgICpcbiAgICAgKiBjb25zdCBjaG9zZW46IHN0cmluZyA9IHJuZy5mcm9tV2VpZ2h0cyhtYXApO1xuICAgICAqL1xuICAgIHB1YmxpYyBmcm9tV2VpZ2h0czxUPihtYXA6IEltbXV0YWJsZTxNYXA8VCwgbnVtYmVyPj4pOiBUIHtcbiAgICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgbnVtIG9mIG1hcC52YWx1ZXMoKSkge1xuICAgICAgICAgICAgc3VtICs9IG51bTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNob2ljZSA9IHRoaXMuZmxvYXQoc3VtKTtcbiAgICAgICAgbGV0IHVwVG8gPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IFtpdGVtLCB3ZWlnaHRdIG9mIG1hcCkge1xuICAgICAgICAgICAgdXBUbyArPSB3ZWlnaHQ7XG4gICAgICAgICAgICBpZiAodXBUbyA+PSBjaG9pY2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTsgLy8gVGhleSBjYW4gbXV0YXRlIHRoZSBpdGVtLCB3ZSBkb24ndCBjYXJlLlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgY2hvc2UgaXRlbSBmb3IgZnJvbVdlaWdodHMuXG5FbnN1cmUgeW91ciBNYXAgaGFzIGVudHJpZXNgKTtcbiAgICB9XG59XG4iXX0=