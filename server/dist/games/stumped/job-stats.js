"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** The default stats for each job if not overridden */
const defaultJobStats = {
    cost: 3,
    damage: 1,
    health: 3,
    moves: 3,
    actions: 1,
    chopping: 1,
    munching: 1,
    carryLimit: 3,
    distractionPower: 0,
};
/** The job stats for each Job, indexed by job name. */
exports.jobStats = {
    "Basic": {},
    "Fighter": {
        cost: 12,
        damage: 3,
        health: 4,
        moves: 2,
        carryLimit: 6,
    },
    "Bulky": {
        cost: 12,
        damage: 2,
        health: 10,
        moves: 2,
        carryLimit: 2,
    },
    "Hungry": {
        cost: 8,
        munching: 3,
        distractionPower: 1,
        carryLimit: 15,
    },
    "Swift": {
        cost: 6,
        munching: 2,
        moves: 5,
        carryLimit: 2,
    },
    "Hot Lady": {
        cost: 15,
        distractionPower: 3,
        carryLimit: 1,
    },
    "Builder": {
        cost: 6,
        chopping: 3,
        carryLimit: 15,
    },
};
// Inject the default values into each job's stats.
for (const [jobName, jobStat] of Object.entries(exports.jobStats)) {
    exports.jobStats[jobName] = {
        ...defaultJobStats,
        ...jobStat,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9iLXN0YXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2dhbWVzL3N0dW1wZWQvam9iLXN0YXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsdURBQXVEO0FBQ3ZELE1BQU0sZUFBZSxHQUFtQjtJQUNwQyxJQUFJLEVBQUUsQ0FBQztJQUNQLE1BQU0sRUFBRSxDQUFDO0lBQ1QsTUFBTSxFQUFFLENBQUM7SUFDVCxLQUFLLEVBQUUsQ0FBQztJQUNSLE9BQU8sRUFBRSxDQUFDO0lBQ1YsUUFBUSxFQUFFLENBQUM7SUFDWCxRQUFRLEVBQUUsQ0FBQztJQUNYLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZ0JBQWdCLEVBQUUsQ0FBQztDQUN0QixDQUFDO0FBRUYsdURBQXVEO0FBQzFDLFFBQUEsUUFBUSxHQUEwQztJQUMzRCxPQUFPLEVBQUUsRUFBRTtJQUNYLFNBQVMsRUFBRTtRQUNQLElBQUksRUFBRSxFQUFFO1FBQ1IsTUFBTSxFQUFFLENBQUM7UUFDVCxNQUFNLEVBQUUsQ0FBQztRQUNULEtBQUssRUFBRSxDQUFDO1FBQ1IsVUFBVSxFQUFFLENBQUM7S0FDaEI7SUFDRCxPQUFPLEVBQUU7UUFDTCxJQUFJLEVBQUUsRUFBRTtRQUNSLE1BQU0sRUFBRSxDQUFDO1FBQ1QsTUFBTSxFQUFFLEVBQUU7UUFDVixLQUFLLEVBQUUsQ0FBQztRQUNSLFVBQVUsRUFBRSxDQUFDO0tBQ2hCO0lBQ0QsUUFBUSxFQUFFO1FBQ04sSUFBSSxFQUFFLENBQUM7UUFDUCxRQUFRLEVBQUUsQ0FBQztRQUNYLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsVUFBVSxFQUFFLEVBQUU7S0FDakI7SUFDRCxPQUFPLEVBQUU7UUFDTCxJQUFJLEVBQUUsQ0FBQztRQUNQLFFBQVEsRUFBRSxDQUFDO1FBQ1gsS0FBSyxFQUFFLENBQUM7UUFDUixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELFVBQVUsRUFBRTtRQUNSLElBQUksRUFBRSxFQUFFO1FBQ1IsZ0JBQWdCLEVBQUUsQ0FBQztRQUNuQixVQUFVLEVBQUUsQ0FBQztLQUNoQjtJQUNELFNBQVMsRUFBRTtRQUNQLElBQUksRUFBRSxDQUFDO1FBQ1AsUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsRUFBRTtLQUNqQjtDQUNKLENBQUM7QUFFRixtREFBbUQ7QUFDbkQsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQVEsQ0FBQyxFQUFFO0lBQ3ZELGdCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUc7UUFDaEIsR0FBRyxlQUFlO1FBQ2xCLEdBQUcsT0FBTztLQUNiLENBQUM7Q0FDTCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElKb2JQcm9wZXJ0aWVzIH0gZnJvbSBcIi4vXCI7XG5cbi8qKiBUaGUgZGVmYXVsdCBzdGF0cyBmb3IgZWFjaCBqb2IgaWYgbm90IG92ZXJyaWRkZW4gKi9cbmNvbnN0IGRlZmF1bHRKb2JTdGF0czogSUpvYlByb3BlcnRpZXMgPSB7XG4gICAgY29zdDogMyxcbiAgICBkYW1hZ2U6IDEsXG4gICAgaGVhbHRoOiAzLFxuICAgIG1vdmVzOiAzLFxuICAgIGFjdGlvbnM6IDEsXG4gICAgY2hvcHBpbmc6IDEsXG4gICAgbXVuY2hpbmc6IDEsXG4gICAgY2FycnlMaW1pdDogMyxcbiAgICBkaXN0cmFjdGlvblBvd2VyOiAwLFxufTtcblxuLyoqIFRoZSBqb2Igc3RhdHMgZm9yIGVhY2ggSm9iLCBpbmRleGVkIGJ5IGpvYiBuYW1lLiAqL1xuZXhwb3J0IGNvbnN0IGpvYlN0YXRzOiB7IFtqb2JOYW1lOiBzdHJpbmddOiBJSm9iUHJvcGVydGllcyB9ID0ge1xuICAgIFwiQmFzaWNcIjoge30sXG4gICAgXCJGaWdodGVyXCI6IHtcbiAgICAgICAgY29zdDogMTIsXG4gICAgICAgIGRhbWFnZTogMyxcbiAgICAgICAgaGVhbHRoOiA0LFxuICAgICAgICBtb3ZlczogMixcbiAgICAgICAgY2FycnlMaW1pdDogNixcbiAgICB9LFxuICAgIFwiQnVsa3lcIjoge1xuICAgICAgICBjb3N0OiAxMixcbiAgICAgICAgZGFtYWdlOiAyLFxuICAgICAgICBoZWFsdGg6IDEwLFxuICAgICAgICBtb3ZlczogMixcbiAgICAgICAgY2FycnlMaW1pdDogMixcbiAgICB9LFxuICAgIFwiSHVuZ3J5XCI6IHtcbiAgICAgICAgY29zdDogOCxcbiAgICAgICAgbXVuY2hpbmc6IDMsXG4gICAgICAgIGRpc3RyYWN0aW9uUG93ZXI6IDEsXG4gICAgICAgIGNhcnJ5TGltaXQ6IDE1LFxuICAgIH0sXG4gICAgXCJTd2lmdFwiOiB7XG4gICAgICAgIGNvc3Q6IDYsXG4gICAgICAgIG11bmNoaW5nOiAyLFxuICAgICAgICBtb3ZlczogNSxcbiAgICAgICAgY2FycnlMaW1pdDogMixcbiAgICB9LFxuICAgIFwiSG90IExhZHlcIjoge1xuICAgICAgICBjb3N0OiAxNSxcbiAgICAgICAgZGlzdHJhY3Rpb25Qb3dlcjogMyxcbiAgICAgICAgY2FycnlMaW1pdDogMSxcbiAgICB9LFxuICAgIFwiQnVpbGRlclwiOiB7XG4gICAgICAgIGNvc3Q6IDYsXG4gICAgICAgIGNob3BwaW5nOiAzLFxuICAgICAgICBjYXJyeUxpbWl0OiAxNSxcbiAgICB9LFxufTtcblxuLy8gSW5qZWN0IHRoZSBkZWZhdWx0IHZhbHVlcyBpbnRvIGVhY2ggam9iJ3Mgc3RhdHMuXG5mb3IgKGNvbnN0IFtqb2JOYW1lLCBqb2JTdGF0XSBvZiBPYmplY3QuZW50cmllcyhqb2JTdGF0cykpIHtcbiAgICBqb2JTdGF0c1tqb2JOYW1lXSA9IHtcbiAgICAgICAgLi4uZGVmYXVsdEpvYlN0YXRzLFxuICAgICAgICAuLi5qb2JTdGF0LFxuICAgIH07XG59XG4iXX0=