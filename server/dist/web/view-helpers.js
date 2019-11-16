"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
/**
 * Formats a variety of dates using moment in views.
 *
 * @param date - The date to format.
 * @param format - The moment format string.
 * @returns The date now formatted via moment in the format.
 */
function formatDate(date, format) {
    return moment(date).format(format);
}
exports.formatDate = formatDate;
/**
 * exec passthrough for handlebars... scary
 *
 * @param args - The arguments to be evaluated, spaces are auto inserted in between in arg
 * @returns whatever resolves from this sketch code.
 */
function exec(...args) {
    args.pop(); // last element is Handlebars stuff we don't care about
    if (args.length === 0) {
        return undefined;
    }
    return global.eval(args.join(" ")); // tslint:disable-line:no-banned-terms
}
exports.exec = exec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlldy1oZWxwZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dlYi92aWV3LWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLElBQTRDLEVBQUUsTUFBYztJQUNuRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUZELGdDQUVDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixJQUFJLENBQUMsR0FBRyxJQUFlO0lBQ25DLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLHVEQUF1RDtJQUVuRSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ25CLE9BQU8sU0FBUyxDQUFDO0tBQ3BCO0lBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQVksQ0FBQyxDQUFDLHNDQUFzQztBQUN6RixDQUFDO0FBUkQsb0JBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBtb21lbnQgZnJvbSBcIm1vbWVudFwiO1xuXG4vKipcbiAqIEZvcm1hdHMgYSB2YXJpZXR5IG9mIGRhdGVzIHVzaW5nIG1vbWVudCBpbiB2aWV3cy5cbiAqXG4gKiBAcGFyYW0gZGF0ZSAtIFRoZSBkYXRlIHRvIGZvcm1hdC5cbiAqIEBwYXJhbSBmb3JtYXQgLSBUaGUgbW9tZW50IGZvcm1hdCBzdHJpbmcuXG4gKiBAcmV0dXJucyBUaGUgZGF0ZSBub3cgZm9ybWF0dGVkIHZpYSBtb21lbnQgaW4gdGhlIGZvcm1hdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERhdGUoZGF0ZTogRGF0ZSB8IHN0cmluZyB8IG51bWJlciB8IG1vbWVudC5Nb21lbnQsIGZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbW9tZW50KGRhdGUpLmZvcm1hdChmb3JtYXQpO1xufVxuXG4vKipcbiAqIGV4ZWMgcGFzc3Rocm91Z2ggZm9yIGhhbmRsZWJhcnMuLi4gc2NhcnlcbiAqXG4gKiBAcGFyYW0gYXJncyAtIFRoZSBhcmd1bWVudHMgdG8gYmUgZXZhbHVhdGVkLCBzcGFjZXMgYXJlIGF1dG8gaW5zZXJ0ZWQgaW4gYmV0d2VlbiBpbiBhcmdcbiAqIEByZXR1cm5zIHdoYXRldmVyIHJlc29sdmVzIGZyb20gdGhpcyBza2V0Y2ggY29kZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4ZWMoLi4uYXJnczogdW5rbm93bltdKTogdW5rbm93biB7XG4gICAgYXJncy5wb3AoKTsgLy8gbGFzdCBlbGVtZW50IGlzIEhhbmRsZWJhcnMgc3R1ZmYgd2UgZG9uJ3QgY2FyZSBhYm91dFxuXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdsb2JhbC5ldmFsKGFyZ3Muam9pbihcIiBcIikpIGFzIHVua25vd247IC8vIHRzbGludDpkaXNhYmxlLWxpbmU6bm8tYmFubmVkLXRlcm1zXG59XG4iXX0=