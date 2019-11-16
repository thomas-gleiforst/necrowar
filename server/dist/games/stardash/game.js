"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// <<-- Creer-Merge: imports -->>
// any additional imports you want can be placed here safely between creer runs
// <<-- /Creer-Merge: imports -->>
/**
 * Collect of the most of the rarest mineral orbiting aroung the sun and
 * outcompete your competetor.
 */
class StardashGame extends _1.BaseClasses.Game {
    // Any additional member attributes can go here
    // NOTE: They will not be sent to the AIs, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: attributes -->>
    /**
     * Called when a Game is created.
     *
     * @param settingsManager - The manager that holds initial settings.
     * @param required - Data required to initialize this (ignore it).
     */
    constructor(settingsManager, required) {
        super(settingsManager, required);
        this.settingsManager = settingsManager;
        /** The settings used to initialize the game, as set by players */
        this.settings = Object.freeze(this.settingsManager.values);
        // <<-- Creer-Merge: constructor -->>
        this.createJobs();
        this.createMap();
        this.lostMythicite = 0;
        // setup any thing you need here
        // <<-- /Creer-Merge: constructor -->>
    }
    // <<-- Creer-Merge: public-functions -->>
    /**
     * Updates the protector for a unit.
     *
     * @param unit: the unit that needs it's protector updated.
     */
    updateProtector(unit) {
        // if it has no owner, cancel the function.
        if (unit.owner === undefined) {
            return;
        }
        // reset the units protector
        unit.protector = undefined;
        // all martyr ships owned by the player that can protect.
        const martyrs = unit.owner.units.filter((u) => u.shield > 0 && u.job.title === "martyr");
        // iterate over martyr that can protect.
        for (const martyr of martyrs) {
            // if the unit isn't protected and is in range.
            if (Math.sqrt(((unit.x - martyr.x) ** 2) +
                ((unit.y - martyr.y) ** 2)) < martyr.job.range) {
                // protected.
                unit.protector = martyr;
                // escape the function.
                return;
            }
        }
    }
    // Any public functions can go here for other things in the game to use.
    // NOTE: Client AIs cannot call these functions, those must be defined
    // in the creer file.
    // <<-- /Creer-Merge: public-functions -->>
    // <<-- Creer-Merge: protected-private-functions -->>
    /** Creates all the Jobs in the game */
    createJobs() {
        // push all three jobs.
        this.jobs.push(
        // adds the corvette job for ships.
        this.manager.create.job({
            title: "corvette",
            carryLimit: 0,
            damage: 20,
            energy: 100,
            moves: this.sizeX / 50,
            range: 100,
            unitCost: 100,
        }), 
        // adds the missleboat ship job.
        this.manager.create.job({
            title: "missileboat",
            carryLimit: 0,
            damage: 100,
            energy: 100,
            moves: this.sizeX / 50,
            range: 500,
            unitCost: 100,
        }), 
        // adds the martyr ship job.
        this.manager.create.job({
            title: "martyr",
            carryLimit: 0,
            damage: 0,
            energy: 100,
            moves: this.sizeX / 50,
            range: 105,
            unitCost: 150,
            shield: 100,
        }), 
        // adds the transport ship job.
        this.manager.create.job({
            title: "transport",
            carryLimit: 100,
            damage: 0,
            energy: 50,
            moves: this.sizeX / 50,
            range: 100,
            unitCost: 75,
        }), 
        // adds the miner ship job.
        this.manager.create.job({
            title: "miner",
            carryLimit: 20,
            damage: 0,
            energy: 100,
            moves: this.sizeX / 50,
            range: 100,
            unitCost: 150,
        }));
    }
    /** Generates the map for testing */
    createMap() {
        // push all the bodies that are made in the generator.
        this.bodies.push(
        // adds the first players starting planet.
        this.manager.create.body({
            bodyType: "planet",
            owner: this.players[0],
            materialType: "none",
            radius: this.sizeY / 12,
            x: this.sizeX / 16,
            y: this.sizeY / 2,
            amount: this.planetEnergyCap,
            angle: -1,
            distance: -1,
        }), 
        // adds the second players starting planet on the opposite side.
        this.manager.create.body({
            bodyType: "planet",
            owner: this.players[1],
            materialType: "none",
            radius: this.sizeY / 12,
            x: this.sizeX - (this.sizeX / 16),
            y: this.sizeY / 2,
            amount: this.planetEnergyCap,
            angle: -1,
            distance: -1,
        }), 
        // places a sun in the center of the map
        this.manager.create.body({
            bodyType: "sun",
            materialType: "none",
            radius: this.sizeY / 4,
            x: this.sizeX / 2,
            y: this.sizeY / 2,
            angle: -1,
            distance: -1,
        }), 
        // places the victory point asteroid above the sun.
        this.manager.create.body({
            bodyType: "asteroid",
            materialType: "mythicite",
            amount: this.mythiciteAmount,
            radius: this.sizeY / 20,
            x: this.sizeX / 2,
            y: ((this.sizeY * 3) / 4) + (this.sizeY / 12),
            angle: 0,
            distance: (this.sizeY / 4) + (this.sizeY / 12),
        }));
        // sets the home bases of the players.
        this.players[0].homeBase = this.bodies[0];
        this.players[1].homeBase = this.bodies[1];
        // genereates the asteroids with scaled sizes.
        this.generateAsteroids(100, this.sizeX / 100, this.sizeX / 50);
        // adds base units, 3 miners for each player.
        // add each players starting units.
        this.players[0].units.push(this.manager.create.unit({
            owner: this.players[0],
            job: this.jobs[4],
            radius: this.shipRadius,
            energy: 100,
            x: this.players[0].homeBase.x,
            y: this.players[0].homeBase.y,
        }), this.manager.create.unit({
            owner: this.players[0],
            job: this.jobs[4],
            radius: this.shipRadius,
            energy: 100,
            x: this.players[0].homeBase.x,
            y: this.players[0].homeBase.y,
        }), this.manager.create.unit({
            owner: this.players[0],
            job: this.jobs[4],
            radius: this.shipRadius,
            energy: 100,
            x: this.players[0].homeBase.x,
            y: this.players[0].homeBase.y,
        }));
        this.players[1].units.push(this.manager.create.unit({
            owner: this.players[1],
            job: this.jobs[4],
            radius: this.shipRadius,
            energy: 100,
            x: this.players[1].homeBase.x,
            y: this.players[1].homeBase.y,
        }), this.manager.create.unit({
            owner: this.players[1],
            job: this.jobs[4],
            radius: this.shipRadius,
            energy: 100,
            x: this.players[1].homeBase.x,
            y: this.players[1].homeBase.y,
        }), this.manager.create.unit({
            owner: this.players[1],
            job: this.jobs[4],
            radius: this.shipRadius,
            energy: 100,
            x: this.players[1].homeBase.x,
            y: this.players[1].homeBase.y,
        }));
        // add the untis to each player.
        for (const unit of this.players[0].units) {
            this.units.push(unit);
        }
        for (const unit of this.players[1].units) {
            this.units.push(unit);
        }
    }
    /**
     * Creates the asteroids on the map.
     * This function creates asteroids around the sun, and mirrors them
     * so there is a copy on the other side.
     * @param amount: the number of asteroids to be generated.
     * @param minSize: the minimum size of a asteroid.
     * @param maxSize: the maximum size of a asteroid.
     */
    generateAsteroids(amount, minSize, maxSize) {
        // create lists to handle asteroid collision tracking and tracking the asteroids.
        let upper = [];
        let lower = [];
        // creates all of the asteroids.
        for (let i = 0; i < amount; i++) {
            // randomly generates the material based on rarity.
            const matNum = this.manager.random.int(0, 8);
            let material;
            if (matNum < this.oreRarityGenarium) {
                material = "genarium";
            }
            else if (matNum < this.oreRarityGenarium + this.oreRarityRarium) {
                material = "rarium";
            }
            else {
                material = "legendarium";
            }
            // places the asteroid in one of the sectors based on num for even distribution.
            if (i < amount / 2) {
                // generate the radius and distance
                const dist = Math.abs(this.manager.random.float((this.sizeY / 4) + (this.sizeY / 18), (this.sizeY / 2.4)));
                const ang = Math.abs(this.manager.random.float(0, 22.5));
                // make the new asteroid
                const ast = this.manager.create.body({
                    bodyType: "asteroid",
                    materialType: material,
                    amount: this.manager.random.int(this.minAsteroid, this.maxAsteroid + 1),
                    radius: minSize,
                    angle: ang,
                    distance: dist,
                });
                // adds the asteroid.
                lower.push(ast);
            }
            else {
                // generate the radius and distance
                const dist = Math.abs(this.manager.random.float((this.sizeY / 4) + (this.sizeY / 18), (this.sizeY / 2.4)));
                const ang = Math.abs(this.manager.random.float(22.5, 45));
                // make the new asteroid
                const ast = this.manager.create.body({
                    bodyType: "asteroid",
                    materialType: material,
                    amount: this.manager.random.int(this.minAsteroid, this.maxAsteroid + 1),
                    radius: minSize,
                    angle: ang,
                    distance: dist,
                });
                // adds the asteroid.
                upper.push(ast);
            }
        }
        // gets the x and y values for each asteroid.
        for (const asteroid of upper) {
            asteroid.x = asteroid.getX();
            asteroid.y = asteroid.getY();
        }
        // gets the x and y values for each asteroid.
        for (const asteroid of lower) {
            asteroid.x = asteroid.getX();
            asteroid.y = asteroid.getY();
        }
        // collides asteroids to get rid of overlap.
        upper = this.collideAsteroids(upper);
        // grows the asteroids as large as possible.
        this.growAsteroids(upper, minSize, maxSize);
        // collides the sectors together for proper mapping.
        lower = this.collideSectors(lower, upper, 0);
        lower = this.collideSectors(lower, upper, 45);
        // now collide lower in order to get a good fill.
        lower = this.collideAsteroids(lower);
        // now grow the asteroid after colliding them
        this.growAsteroids(lower, minSize, maxSize);
        // now shrink lower so it isn't colliding with the other sector.
        lower = this.collideSize(lower, upper, minSize, 0);
        lower = this.collideSize(lower, upper, minSize, 45);
        // taster tracker of all asteroids.
        const master = [];
        // clones out the sectors to surround the sun.
        this.cloneAsteroids(master, lower);
        this.cloneAsteroids(master, upper);
        // grabs the victory point asteroid.
        const vAst = this.bodies[3];
        // removes any asteroids colliding into it by not adding them.
        for (const ast of master) {
            const dist = Math.sqrt(((ast.x - vAst.x) ** 2) + ((ast.y - vAst.y) ** 2));
            if (dist >= ast.radius + vAst.radius) {
                this.bodies.push(ast);
            }
            else if (dist >= vAst.radius + minSize) {
                ast.radius = minSize;
                this.bodies.push(ast);
            }
        }
        // exits the generator function.
        return;
    }
    /**
     * Function the tries to grow the asteroids to the set max size.
     *
     * @param asteroids: a list of the asteroids to be grown.
     * @param minSize: the minimum size that a asteroid will grow from.
     * @param maxSize: the maximum size that a asteroid will grow to.
     * @param preGrown: tracks if some pregrowing has been done.
     *
     * @returns: nothing, it edits the asteroids, and will remove collisions.
     */
    growAsteroids(asteroids, minSize, maxSize, preGrown = false) {
        // tracks which asteroids have grown.
        const grown = [];
        // tracks how many asteroids are done growing.
        let amtGrown = 0;
        // grows each asteroid and sets up the grown tracker.
        if (preGrown) {
            // tslint:disable-next-line: prefer-for-of
            for (let x = 0; x < asteroids.length; x++) {
                // if the asteroid hasn't already been grown.
                if (asteroids[x].radius === minSize) {
                    // make it isn't grown.
                    grown.push(false);
                }
                else {
                    // otherwise mark it as grown.
                    grown.push(true);
                }
            }
        }
        else {
            // tslint:disable-next-line: prefer-for-of
            for (let x = 0; x < asteroids.length; x++) {
                // mark it isn't grown.
                grown.push(false);
            }
        }
        // as long as asteroids can still be grown, keep growing them.
        while (amtGrown < asteroids.length) {
            // grow each asteroid if it is valid to do so.
            for (let x = 0; x < asteroids.length; x++) {
                if (!grown[x] && asteroids[x].radius < maxSize) {
                    asteroids[x].radius += (maxSize - minSize) / 16;
                }
                else if (!grown[x]) {
                    grown[x] = true;
                    amtGrown++;
                }
            }
            // iterate over all of the asteroids.
            for (let x = 0; x < asteroids.length; x++) {
                // if it is already grown and thus didn't grown, move on.
                if (grown[x]) {
                    continue;
                }
                // grab the asteroid for ease of reference and readability.
                const sAst = asteroids[x];
                // iterate over the remaining asteroids.
                for (let y = 0; y < asteroids.length; y++) {
                    // make sure we don't try to collide a asteroid with it's self.
                    if (y === x) {
                        continue;
                    }
                    // grab the asteroid for ease of reference and readability.
                    const cAst = asteroids[y];
                    // if they collide, shrink them and end their growth.
                    if (Math.sqrt(((sAst.x - cAst.x) ** 2) + ((sAst.y - cAst.y) ** 2)) <= sAst.radius + cAst.radius) {
                        if (!grown[x]) {
                            grown.splice(x, 1, true);
                            // ungrow the asteroid.
                            asteroids[x].radius -= (maxSize - minSize) / 16;
                            // note the asteroid is done growing.
                            amtGrown++;
                        }
                        if (!grown[y]) {
                            grown.splice(y, 1, true);
                            // ungrow the asteroid.
                            asteroids[y].radius -= (maxSize - minSize) / 16;
                            // note the asteroid is done growing.
                            amtGrown++;
                        }
                    }
                }
            }
        }
    }
    /**
     * Function that handles collisions between asteroids. Removes asteroids
     * with the highest collision count.
     *
     * @param asteroids: a list of the asteroids to be grown.
     *
     * @returns: a list of the asteroids after the pruning.
     */
    collideAsteroids(asteroids) {
        // track the largest number of collisions.
        let largest = 0;
        // tracks valid asteroids.
        const valid = [];
        // tracks collisions.
        const collide = [];
        // initialize valid.
        // tslint:disable-next-line: prefer-for-of
        for (let x = 0; x < asteroids.length; x++) {
            collide.push([]);
        }
        // iterate over each asteroid.
        for (let x = 0; x < asteroids.length; x++) {
            const sAst = asteroids[x];
            // iterate over the remaining asteroids.
            for (let y = x + 1; y < asteroids.length; y++) {
                const cAst = asteroids[y];
                // if they collide, note the collision.
                if (Math.sqrt(((sAst.x - cAst.x) ** 2) + ((sAst.y - cAst.y) ** 2)) <= sAst.radius + cAst.radius) {
                    collide[x].push(y);
                    // update the largest number.
                    if (collide[x].length > largest) {
                        largest = collide[x].length;
                    }
                    collide[y].push(x);
                    // update the largest number.
                    if (collide[y].length > largest) {
                        largest = collide[y].length;
                    }
                }
            }
        }
        // remove the first asteroid with the largest number of collisions.
        for (let length = largest; length > 0; length--) {
            for (let x = 0; x < asteroids.length; x++) {
                if (collide[x].length === length) {
                    for (const col of collide[x]) {
                        if (collide[col] && collide[col].indexOf(x) !== -1) {
                            collide[col].splice(collide[col].indexOf(x), 1);
                        }
                        else if (collide[col].indexOf(x) !== -1) {
                            collide.splice(x, 1);
                            break;
                        }
                    }
                }
            }
        }
        for (let x = 0; x < asteroids.length; x++) {
            if (collide[x].length === 0) {
                valid.push(asteroids[x]);
            }
        }
        // return the final list.
        return valid;
    }
    /**
     * This function takes in two lists of asteroids and the first list by the
     * designated amount and checks to see if they collide.
     * It removes the asteroids from the first list.
     *
     * @param s1: this is the list of asteroids to be shifted and edited.
     * @param s2: this is the list of asteroids to be compared to.
     * @param shift: this is the amount the copy of the first list will be shifted
     *
     * @returns: it edits s2.
     */
    collideSectors(s1, s2, shift = 0) {
        // tracks the valid asteroids to be returned
        const valid = [];
        // track any asteroids that collided
        const collide = [];
        // shift the asteroid and update it's location.
        for (const asteroid of s1) {
            collide.push(false);
            asteroid.angle += shift;
            asteroid.x = asteroid.getX();
            asteroid.y = asteroid.getY();
        }
        // iterate over all of the asteroids.
        for (const sAst of s2) {
            // iterate over the remaining asteroids.
            for (let y = 0; y < s1.length; y++) {
                // grab the asteroid for ease of reference and readability.
                const cAst = s1[y];
                // grab the distance for ease of use
                const dist = Math.sqrt(((sAst.x - cAst.x) ** 2) + ((sAst.y - cAst.y) ** 2));
                // if they collide, shrink them and end their growth.
                if (dist <= sAst.radius + cAst.radius) {
                    // count the collision.
                    collide[y] = true;
                }
            }
        }
        // iterate over the shifted asteroids and un shift them.
        for (let x = 0; x < s1.length; x++) {
            // unshift the asteroid.
            s1[x].angle -= shift;
            s1[x].x = s1[x].getX();
            s1[x].y = s1[x].getY();
            // if the asteroid didn't collide, add it to the return.
            if (!collide[x]) {
                // add the asteroid to the output.
                valid.push(s1[x]);
            }
        }
        // return the final list
        return valid;
    }
    /**
     * This function takes in two lists of asteroids and the first list by the
     * designated amount and checks to see if they collide.
     * It removes the asteroids from the first list.
     *
     * @param s1: this is the list of asteroids to be shifted and edited.
     * @param s2: this is the list of asteroids to be compared to.
     * @param minSize: the minimum size of a asteroid.
     * @param shift: this is the amount the copy of the first list will be shifted
     *
     * @returns: it edits s2.
     */
    collideSize(s1, s2, minSize, shift = 0) {
        // tracks the valid asteroids to be returned
        const valid = [];
        // shift the asteroid and update it's location.
        for (const asteroid of s1) {
            asteroid.angle += shift;
            asteroid.x = asteroid.getX();
            asteroid.y = asteroid.getY();
        }
        // iterate over all of the asteroids.
        for (const sAst of s2) {
            // iterate over the remaining asteroids.
            for (const cAst of s1) {
                // grab the distance for ease of use
                const dist = Math.sqrt(((sAst.x - cAst.x) ** 2) + ((sAst.y - cAst.y) ** 2));
                // if they collide, shrink them and end their growth.
                while (dist <= sAst.radius + cAst.radius) {
                    // count the collision.
                    cAst.radius -= 2;
                }
            }
        }
        // iterate over the shifted asteroids and un shift them.
        for (const cAst of s1) {
            // unshift the asteroid.
            cAst.angle -= shift;
            cAst.x = cAst.getX();
            cAst.y = cAst.getY();
            // add it to the return.
            valid.push(cAst);
        }
        // return the final list
        return valid;
    }
    /**
     * this function clones the asteroids in the second list into the first list
     * with it's 8 rotations around the sun.
     *
     * @param master: The list to be added to.
     * @param clone: the list that is being cloned from.
     *
     * @returns: it adds the rotations of list two into list one.
     */
    cloneAsteroids(master, clone) {
        // iterate over each of the asteroids to be clones.
        for (const ast of clone) {
            master.push(
            // add the base asteroid.
            ast, 
            // add the base asteroid shifted by 45 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 45,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 45),
                y: this.getY(ast.distance, ast.angle + 45),
            }), 
            // add the base asteroid shifted by 90 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 90,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 90),
                y: this.getY(ast.distance, ast.angle + 90),
            }), 
            // add the base asteroid shifted by 135 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 135,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 135),
                y: this.getY(ast.distance, ast.angle + 135),
            }), 
            // add the base asteroid shifted by 180 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 180,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 180),
                y: this.getY(ast.distance, ast.angle + 180),
            }), 
            // add the base asteroid shifted by 225 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 225,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 225),
                y: this.getY(ast.distance, ast.angle + 225),
            }), 
            // add the base asteroid shifted by 270 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 270,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 270),
                y: this.getY(ast.distance, ast.angle + 270),
            }), 
            // add the base asteroid shifted by 315 degrees.
            this.manager.create.body({
                bodyType: "asteroid",
                materialType: ast.materialType,
                amount: ast.amount,
                radius: ast.radius,
                angle: ast.angle + 315,
                distance: ast.distance,
                x: this.getX(ast.distance, ast.angle + 315),
                y: this.getY(ast.distance, ast.angle + 315),
            }));
        }
    }
    /**
     * Gets the x value of the angle and distance.
     *
     * @param distance: the distance from the center.
     * @param angle: the angle from a top, like a rotated 90 degree to the right
     * unit circle.
     *
     * @returns the x value at it's distance and angle
     */
    getX(distance, angle) {
        // gets the x location if there is a passed distance.
        if (distance >= 0 && angle >= 0) {
            return distance * Math.cos(((angle + 90) / 180) * Math.PI) + this.bodies[2].x;
        }
        else {
            return -1;
        }
    }
    /**
     * Gets the y value of the angle and distance.
     *
     * @param distance: the distance from the center.
     * @param angle: the angle from a top, like a rotated 90 degree to the right
     * unit circle.
     *
     * @returns the y value at it's distance and angle
     */
    getY(distance, angle) {
        // gets the y location if there is a passed distance.
        if (distance >= 0 && angle >= 0) {
            return distance * Math.sin(((angle + 90) / 180) * Math.PI) + this.bodies[2].y;
        }
        else {
            return -1;
        }
    }
}
exports.StardashGame = StardashGame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9nYW1lcy9zdGFyZGFzaC9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUJBQWlDO0FBVWpDLGlDQUFpQztBQUNqQywrRUFBK0U7QUFDL0Usa0NBQWtDO0FBRWxDOzs7R0FHRztBQUNILE1BQWEsWUFBYSxTQUFRLGNBQVcsQ0FBQyxJQUFJO0lBNkw5QywrQ0FBK0M7SUFDL0MsZ0VBQWdFO0lBQ2hFLHFCQUFxQjtJQUVyQixxQ0FBcUM7SUFFckM7Ozs7O09BS0c7SUFDSCxZQUNjLGVBQTRDLEVBQ3RELFFBQXlDO1FBRXpDLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFIdkIsb0JBQWUsR0FBZixlQUFlLENBQTZCO1FBdE0xRCxrRUFBa0U7UUFDbEQsYUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQTBNbEUscUNBQXFDO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsZ0NBQWdDO1FBQ2hDLHNDQUFzQztJQUMxQyxDQUFDO0lBRUQsMENBQTBDO0lBRTFDOzs7O09BSUc7SUFDSSxlQUFlLENBQUMsSUFBVTtRQUM3QiwyQ0FBMkM7UUFDM0MsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPO1NBQ1Y7UUFDRCw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IseURBQXlEO1FBQ3pELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQ2hDLENBQUMsQ0FBQyxNQUFNLEdB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QUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQzthQUM5QyxDQUFDLENBQ0wsQ0FBQztTQUNMO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssSUFBSSxDQUFDLFFBQWdCLEVBQUUsS0FBYTtRQUN4QyxxREFBcUQ7UUFDckQsSUFBSSxRQUFRLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDN0IsT0FBTyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqRjthQUNJO1lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNiO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0ssSUFBSSxDQUFDLFFBQWdCLEVBQUUsS0FBYTtRQUN4QyxxREFBcUQ7UUFDckQsSUFBSSxRQUFRLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7WUFDN0IsT0FBTyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqRjthQUNJO1lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNiO0lBQ0wsQ0FBQztDQUlKO0FBajlCRCxvQ0FpOUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJhc2VHYW1lUmVxdWlyZWREYXRhIH0gZnJvbSBcIn4vY29yZS9nYW1lXCI7XG5pbXBvcnQgeyBCYXNlQ2xhc3NlcyB9IGZyb20gXCIuL1wiO1xuaW1wb3J0IHsgQm9keSB9IGZyb20gXCIuL2JvZHlcIjtcbmltcG9ydCB7IFN0YXJkYXNoR2FtZU1hbmFnZXIgfSBmcm9tIFwiLi9nYW1lLW1hbmFnZXJcIjtcbmltcG9ydCB7IEdhbWVPYmplY3QgfSBmcm9tIFwiLi9nYW1lLW9iamVjdFwiO1xuaW1wb3J0IHsgU3RhcmRhc2hHYW1lU2V0dGluZ3NNYW5hZ2VyIH0gZnJvbSBcIi4vZ2FtZS1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSBcIi4vam9iXCI7XG5pbXBvcnQgeyBQbGF5ZXIgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCB7IFByb2plY3RpbGUgfSBmcm9tIFwiLi9wcm9qZWN0aWxlXCI7XG5pbXBvcnQgeyBVbml0IH0gZnJvbSBcIi4vdW5pdFwiO1xuXG4vLyA8PC0tIENyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cbi8vIGFueSBhZGRpdGlvbmFsIGltcG9ydHMgeW91IHdhbnQgY2FuIGJlIHBsYWNlZCBoZXJlIHNhZmVseSBiZXR3ZWVuIGNyZWVyIHJ1bnNcbi8vIDw8LS0gL0NyZWVyLU1lcmdlOiBpbXBvcnRzIC0tPj5cblxuLyoqXG4gKiBDb2xsZWN0IG9mIHRoZSBtb3N0IG9mIHRoZSByYXJlc3QgbWluZXJhbCBvcmJpdGluZyBhcm91bmcgdGhlIHN1biBhbmRcbiAqIG91dGNvbXBldGUgeW91ciBjb21wZXRldG9yLlxuICovXG5leHBvcnQgY2xhc3MgU3RhcmRhc2hHYW1lIGV4dGVuZHMgQmFzZUNsYXNzZXMuR2FtZSB7XG4gICAgLyoqIFRoZSBtYW5hZ2VyIG9mIHRoaXMgZ2FtZSwgdGhhdCBjb250cm9scyBldmVyeXRoaW5nIGFyb3VuZCBpdCAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYW5hZ2VyITogU3RhcmRhc2hHYW1lTWFuYWdlcjtcblxuICAgIC8qKiBUaGUgc2V0dGluZ3MgdXNlZCB0byBpbml0aWFsaXplIHRoZSBnYW1lLCBhcyBzZXQgYnkgcGxheWVycyAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzZXR0aW5ncyA9IE9iamVjdC5mcmVlemUodGhpcy5zZXR0aW5nc01hbmFnZXIudmFsdWVzKTtcblxuICAgIC8qKlxuICAgICAqIEFsbCB0aGUgY2VsZXN0aWFsIGJvZGllcyBpbiB0aGUgZ2FtZS4gVGhlIGZpcnN0IHR3byBhcmUgcGxhbmV0cyBhbmQgdGhlXG4gICAgICogdGhpcmQgaXMgdGhlIHN1bi4gVGhlIGZvdXJ0aCBpcyB0aGUgVlAgYXN0ZXJvaWQuIEV2ZXJ5dGhpbmcgZWxzZSBpc1xuICAgICAqIG5vcm1hbCBhc3Rlcm9pZHMuXG4gICAgICovXG4gICAgcHVibGljIGJvZGllcyE6IEJvZHlbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgd2hvc2UgdHVybiBpdCBpcyBjdXJyZW50bHkuIFRoYXQgcGxheWVyIGNhbiBzZW5kIGNvbW1hbmRzLlxuICAgICAqIE90aGVyIHBsYXllcnMgY2Fubm90LlxuICAgICAqL1xuICAgIHB1YmxpYyBjdXJyZW50UGxheWVyITogUGxheWVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGN1cnJlbnQgdHVybiBudW1iZXIsIHN0YXJ0aW5nIGF0IDAgZm9yIHRoZSBmaXJzdCBwbGF5ZXIncyB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyBjdXJyZW50VHVybiE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjb3N0IG9mIGRhc2hpbmcuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IGRhc2hDb3N0ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRpc3RhbmNlIHRyYXZlbGVkIGVhY2ggdHVybiBieSBkYXNoaW5nLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBkYXNoRGlzdGFuY2UhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIG1hcHBpbmcgb2YgZXZlcnkgZ2FtZSBvYmplY3QncyBJRCB0byB0aGUgYWN0dWFsIGdhbWUgb2JqZWN0LiBQcmltYXJpbHlcbiAgICAgKiB1c2VkIGJ5IHRoZSBzZXJ2ZXIgYW5kIGNsaWVudCB0byBlYXNpbHkgcmVmZXIgdG8gdGhlIGdhbWUgb2JqZWN0cyB2aWFcbiAgICAgKiBJRC5cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2FtZU9iamVjdHMhOiB7W2lkOiBzdHJpbmddOiBHYW1lT2JqZWN0fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBvZiBldmVyeSB1bml0IG9mIGdlbmFyaXVtLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBnZW5hcml1bVZhbHVlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogQSBsaXN0IG9mIGFsbCBqb2JzLiBmaXJzdCBpdGVtIGlzIGNvcnZldHRlLCBzZWNvbmQgaXMgbWlzc2lsZWJvYXQsIHRoaXJkXG4gICAgICogaXMgbWFydHlyLCBmb3VydGggaXMgdHJhbnNwb3J0LCBhbmQgZmlmdGggaXMgbWluZXIuXG4gICAgICovXG4gICAgcHVibGljIGpvYnMhOiBKb2JbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB2YWx1ZSBvZiBldmVyeSB1bml0IG9mIGxlZ2VuZGFyaXVtLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBsZWdlbmRhcml1bVZhbHVlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGhpZ2hlc3QgYW1vdW50IG9mIG1hdGVyaWFsLCB0aGF0IGNhbiBiZSBpbiBhIGFzdGVyb2lkLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtYXhBc3Rlcm9pZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXhpbXVtIG51bWJlciBvZiB0dXJucyBiZWZvcmUgdGhlIGdhbWUgd2lsbCBhdXRvbWF0aWNhbGx5IGVuZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbWF4VHVybnMhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgc21hbGxlc3QgYW1vdW50IG9mIG1hdGVyaWFsLCB0aGF0IGNhbiBiZSBpbiBhIGFzdGVyb2lkLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtaW5Bc3Rlcm9pZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSByYXRlIGF0IHdoaWNoIG1pbmVycyBncmFiIG1pbmVyYWxzIGZyb20gYXN0ZXJvaWRzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBtaW5pbmdTcGVlZCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgbXl0aGljaXRlIHRoYXQgc3Bhd25zIGF0IHRoZSBzdGFydCBvZiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgbXl0aGljaXRlQW1vdW50ITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiBvcmJpdCB1cGRhdGVzIHlvdSBjYW5ub3QgbWluZSB0aGUgbWl0aGljaXRlIGFzdGVyb2lkLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBvcmJpdHNQcm90ZWN0ZWQhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgcmFyaXR5IG1vZGlmaWVyIG9mIHRoZSBtb3N0IGNvbW1vbiBvcmUuIFRoaXMgY29udHJvbHMgaG93IG11Y2hcbiAgICAgKiBzcGF3bnMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG9yZVJhcml0eUdlbmFyaXVtITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJhcml0eSBtb2RpZmllciBvZiB0aGUgcmFyZXN0IG9yZS4gVGhpcyBjb250cm9scyBob3cgbXVjaCBzcGF3bnMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG9yZVJhcml0eUxlZ2VuZGFyaXVtITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJhcml0eSBtb2RpZmllciBvZiB0aGUgc2Vjb25kIHJhcmVzdCBvcmUuIFRoaXMgY29udHJvbHMgaG93IG11Y2hcbiAgICAgKiBzcGF3bnMuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IG9yZVJhcml0eVJhcml1bSE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZW5lcmd5IGEgcGxhbmV0IGNhbiBob2xkIGF0IG9uY2UuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHBsYW5ldEVuZXJneUNhcCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhbW91bnQgb2YgZW5lcmd5IHRoZSBwbGFuZXRzIHJlc3RvcmUgZWFjaCByb3VuZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgcGxhbmV0UmVjaGFyZ2VSYXRlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBhbGwgdGhlIHBsYXllcnMgaW4gdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIHBsYXllcnMhOiBQbGF5ZXJbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGFuZGFyZCBzaXplIG9mIHNoaXBzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBwcm9qZWN0aWxlUmFkaXVzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiBkaXN0YW5jZSBtaXNzaWxlcyB0cmF2ZWwgdGhyb3VnaCBzcGFjZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgcHJvamVjdGlsZVNwZWVkITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogRXZlcnkgcHJvamVjdGlsZSBpbiB0aGUgZ2FtZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgcHJvamVjdGlsZXMhOiBQcm9qZWN0aWxlW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgdmFsdWUgb2YgZXZlcnkgdW5pdCBvZiByYXJpdW0uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHJhcml1bVZhbHVlITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHJlZ2VuZXJhdGlvbiByYXRlIG9mIGFzdGVyb2lkcy5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgcmVnZW5lcmF0ZVJhdGUhOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgZ2FtZSBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIHBsYXllZC5cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc2Vzc2lvbiE6IHN0cmluZztcblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGFuZGFyZCBzaXplIG9mIHNoaXBzLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSBzaGlwUmFkaXVzITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNpemUgb2YgdGhlIG1hcCBpbiB0aGUgWCBkaXJlY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNpemVYITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHNpemUgb2YgdGhlIG1hcCBpbiB0aGUgWSBkaXJlY3Rpb24uXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHNpemVZITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFtb3VudCBvZiB0aW1lIChpbiBuYW5vLXNlY29uZHMpIGFkZGVkIGFmdGVyIGVhY2ggcGxheWVyIHBlcmZvcm1zIGFcbiAgICAgKiB0dXJuLlxuICAgICAqL1xuICAgIHB1YmxpYyByZWFkb25seSB0aW1lQWRkZWRQZXJUdXJuITogbnVtYmVyO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG51bWJlciBvZiB0dXJucyBpdCB0YWtlcyBmb3IgYSBhc3Rlcm9pZCB0byBvcmJpdCB0aGUgc3VuLiAoQXN0ZXJvaWRzXG4gICAgICogbW92ZSBhZnRlciBlYWNoIHBsYXllcnMgdHVybikuXG4gICAgICovXG4gICAgcHVibGljIHJlYWRvbmx5IHR1cm5zVG9PcmJpdCE6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIEV2ZXJ5IFVuaXQgaW4gdGhlIGdhbWUuXG4gICAgICovXG4gICAgcHVibGljIHVuaXRzITogVW5pdFtdO1xuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogYXR0cmlidXRlcyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBzdG9yZXMgbXl0aGljaXRlIHRoYXQgd2FzIGxvc3QgdmlhIHVuaXQgZGVhdGguXG4gICAgICovXG4gICAgcHVibGljIGxvc3RNeXRoaWNpdGUhOiBudW1iZXI7XG5cbiAgICAvLyBBbnkgYWRkaXRpb25hbCBtZW1iZXIgYXR0cmlidXRlcyBjYW4gZ28gaGVyZVxuICAgIC8vIE5PVEU6IFRoZXkgd2lsbCBub3QgYmUgc2VudCB0byB0aGUgQUlzLCB0aG9zZSBtdXN0IGJlIGRlZmluZWRcbiAgICAvLyBpbiB0aGUgY3JlZXIgZmlsZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBhdHRyaWJ1dGVzIC0tPj5cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIGEgR2FtZSBpcyBjcmVhdGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNldHRpbmdzTWFuYWdlciAtIFRoZSBtYW5hZ2VyIHRoYXQgaG9sZHMgaW5pdGlhbCBzZXR0aW5ncy5cbiAgICAgKiBAcGFyYW0gcmVxdWlyZWQgLSBEYXRhIHJlcXVpcmVkIHRvIGluaXRpYWxpemUgdGhpcyAoaWdub3JlIGl0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHNldHRpbmdzTWFuYWdlcjogU3RhcmRhc2hHYW1lU2V0dGluZ3NNYW5hZ2VyLFxuICAgICAgICByZXF1aXJlZDogUmVhZG9ubHk8SUJhc2VHYW1lUmVxdWlyZWREYXRhPixcbiAgICApIHtcbiAgICAgICAgc3VwZXIoc2V0dGluZ3NNYW5hZ2VyLCByZXF1aXJlZCk7XG5cbiAgICAgICAgLy8gPDwtLSBDcmVlci1NZXJnZTogY29uc3RydWN0b3IgLS0+PlxuICAgICAgICB0aGlzLmNyZWF0ZUpvYnMoKTtcblxuICAgICAgICB0aGlzLmNyZWF0ZU1hcCgpO1xuXG4gICAgICAgIHRoaXMubG9zdE15dGhpY2l0ZSA9IDA7XG4gICAgICAgIC8vIHNldHVwIGFueSB0aGluZyB5b3UgbmVlZCBoZXJlXG4gICAgICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBjb25zdHJ1Y3RvciAtLT4+XG4gICAgfVxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHVibGljLWZ1bmN0aW9ucyAtLT4+XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBwcm90ZWN0b3IgZm9yIGEgdW5pdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB1bml0OiB0aGUgdW5pdCB0aGF0IG5lZWRzIGl0J3MgcHJvdGVjdG9yIHVwZGF0ZWQuXG4gICAgICovXG4gICAgcHVibGljIHVwZGF0ZVByb3RlY3Rvcih1bml0OiBVbml0KTogdm9pZCB7XG4gICAgICAgIC8vIGlmIGl0IGhhcyBubyBvd25lciwgY2FuY2VsIHRoZSBmdW5jdGlvbi5cbiAgICAgICAgaWYgKHVuaXQub3duZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlc2V0IHRoZSB1bml0cyBwcm90ZWN0b3JcbiAgICAgICAgdW5pdC5wcm90ZWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIGFsbCBtYXJ0eXIgc2hpcHMgb3duZWQgYnkgdGhlIHBsYXllciB0aGF0IGNhbiBwcm90ZWN0LlxuICAgICAgICBjb25zdCBtYXJ0eXJzID0gdW5pdC5vd25lci51bml0cy5maWx0ZXIoKHUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgdS5zaGllbGQgPiAwICYmIHUuam9iLnRpdGxlID09PSBcIm1hcnR5clwiKTtcbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIG1hcnR5ciB0aGF0IGNhbiBwcm90ZWN0LlxuICAgICAgICBmb3IgKGNvbnN0IG1hcnR5ciBvZiBtYXJ0eXJzKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgdW5pdCBpc24ndCBwcm90ZWN0ZWQgYW5kIGlzIGluIHJhbmdlLlxuICAgICAgICAgICAgaWYgKE1hdGguc3FydCgoKHVuaXQueCAtIG1hcnR5ci54KSAqKiAyKSArXG4gICAgICAgICAgICAgICAgKCh1bml0LnkgLSBtYXJ0eXIueSkgKiogMikpIDwgbWFydHlyLmpvYi5yYW5nZSkge1xuICAgICAgICAgICAgICAgIC8vIHByb3RlY3RlZC5cbiAgICAgICAgICAgICAgICB1bml0LnByb3RlY3RvciA9IG1hcnR5cjtcblxuICAgICAgICAgICAgICAgIC8vIGVzY2FwZSB0aGUgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQW55IHB1YmxpYyBmdW5jdGlvbnMgY2FuIGdvIGhlcmUgZm9yIG90aGVyIHRoaW5ncyBpbiB0aGUgZ2FtZSB0byB1c2UuXG4gICAgLy8gTk9URTogQ2xpZW50IEFJcyBjYW5ub3QgY2FsbCB0aGVzZSBmdW5jdGlvbnMsIHRob3NlIG11c3QgYmUgZGVmaW5lZFxuICAgIC8vIGluIHRoZSBjcmVlciBmaWxlLlxuXG4gICAgLy8gPDwtLSAvQ3JlZXItTWVyZ2U6IHB1YmxpYy1mdW5jdGlvbnMgLS0+PlxuXG4gICAgLy8gPDwtLSBDcmVlci1NZXJnZTogcHJvdGVjdGVkLXByaXZhdGUtZnVuY3Rpb25zIC0tPj5cbiAgICAvKiogQ3JlYXRlcyBhbGwgdGhlIEpvYnMgaW4gdGhlIGdhbWUgKi9cbiAgICBwcml2YXRlIGNyZWF0ZUpvYnMoKTogdm9pZCB7XG4gICAgICAgIC8vIHB1c2ggYWxsIHRocmVlIGpvYnMuXG4gICAgICAgIHRoaXMuam9icy5wdXNoKFxuICAgICAgICAgICAgLy8gYWRkcyB0aGUgY29ydmV0dGUgam9iIGZvciBzaGlwcy5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUuam9iKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJjb3J2ZXR0ZVwiLFxuICAgICAgICAgICAgICAgIGNhcnJ5TGltaXQ6IDAsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAyMCxcbiAgICAgICAgICAgICAgICBlbmVyZ3k6IDEwMCxcbiAgICAgICAgICAgICAgICBtb3ZlczogdGhpcy5zaXplWCAvIDUwLFxuICAgICAgICAgICAgICAgIHJhbmdlOiAxMDAsXG4gICAgICAgICAgICAgICAgdW5pdENvc3Q6IDEwMCxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAvLyBhZGRzIHRoZSBtaXNzbGVib2F0IHNoaXAgam9iLlxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5qb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm1pc3NpbGVib2F0XCIsXG4gICAgICAgICAgICAgICAgY2FycnlMaW1pdDogMCxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDEwMCxcbiAgICAgICAgICAgICAgICBlbmVyZ3k6IDEwMCxcbiAgICAgICAgICAgICAgICBtb3ZlczogdGhpcy5zaXplWCAvIDUwLFxuICAgICAgICAgICAgICAgIHJhbmdlOiA1MDAsXG4gICAgICAgICAgICAgICAgdW5pdENvc3Q6IDEwMCxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAvLyBhZGRzIHRoZSBtYXJ0eXIgc2hpcCBqb2IuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmpvYih7XG4gICAgICAgICAgICAgICAgdGl0bGU6IFwibWFydHlyXCIsXG4gICAgICAgICAgICAgICAgY2FycnlMaW1pdDogMCxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDAsXG4gICAgICAgICAgICAgICAgZW5lcmd5OiAxMDAsXG4gICAgICAgICAgICAgICAgbW92ZXM6IHRoaXMuc2l6ZVggLyA1MCxcbiAgICAgICAgICAgICAgICByYW5nZTogMTA1LFxuICAgICAgICAgICAgICAgIHVuaXRDb3N0OiAxNTAsXG4gICAgICAgICAgICAgICAgc2hpZWxkOiAxMDAsXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgLy8gYWRkcyB0aGUgdHJhbnNwb3J0IHNoaXAgam9iLlxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5qb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcInRyYW5zcG9ydFwiLFxuICAgICAgICAgICAgICAgIGNhcnJ5TGltaXQ6IDEwMCxcbiAgICAgICAgICAgICAgICBkYW1hZ2U6IDAsXG4gICAgICAgICAgICAgICAgZW5lcmd5OiA1MCxcbiAgICAgICAgICAgICAgICBtb3ZlczogdGhpcy5zaXplWCAvIDUwLFxuICAgICAgICAgICAgICAgIHJhbmdlOiAxMDAsXG4gICAgICAgICAgICAgICAgdW5pdENvc3Q6IDc1LFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIC8vIGFkZHMgdGhlIG1pbmVyIHNoaXAgam9iLlxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5qb2Ioe1xuICAgICAgICAgICAgICAgIHRpdGxlOiBcIm1pbmVyXCIsXG4gICAgICAgICAgICAgICAgY2FycnlMaW1pdDogMjAsXG4gICAgICAgICAgICAgICAgZGFtYWdlOiAwLFxuICAgICAgICAgICAgICAgIGVuZXJneTogMTAwLFxuICAgICAgICAgICAgICAgIG1vdmVzOiB0aGlzLnNpemVYIC8gNTAsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IDEwMCxcbiAgICAgICAgICAgICAgICB1bml0Q29zdDogMTUwLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIEdlbmVyYXRlcyB0aGUgbWFwIGZvciB0ZXN0aW5nICovXG4gICAgcHJpdmF0ZSBjcmVhdGVNYXAoKTogdm9pZCB7XG4gICAgICAgIC8vIHB1c2ggYWxsIHRoZSBib2RpZXMgdGhhdCBhcmUgbWFkZSBpbiB0aGUgZ2VuZXJhdG9yLlxuICAgICAgICB0aGlzLmJvZGllcy5wdXNoKFxuICAgICAgICAgICAgLy8gYWRkcyB0aGUgZmlyc3QgcGxheWVycyBzdGFydGluZyBwbGFuZXQuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmJvZHkoe1xuICAgICAgICAgICAgICAgIGJvZHlUeXBlOiBcInBsYW5ldFwiLFxuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLnBsYXllcnNbMF0sXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxUeXBlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICByYWRpdXM6IHRoaXMuc2l6ZVkgLyAxMixcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnNpemVYIC8gMTYsXG4gICAgICAgICAgICAgICAgeTogdGhpcy5zaXplWSAvIDIsXG4gICAgICAgICAgICAgICAgYW1vdW50OiB0aGlzLnBsYW5ldEVuZXJneUNhcCxcbiAgICAgICAgICAgICAgICBhbmdsZTogLTEsXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IC0xLFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIC8vIGFkZHMgdGhlIHNlY29uZCBwbGF5ZXJzIHN0YXJ0aW5nIHBsYW5ldCBvbiB0aGUgb3Bwb3NpdGUgc2lkZS5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUuYm9keSh7XG4gICAgICAgICAgICAgICAgYm9keVR5cGU6IFwicGxhbmV0XCIsXG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMucGxheWVyc1sxXSxcbiAgICAgICAgICAgICAgICBtYXRlcmlhbFR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIHJhZGl1czogdGhpcy5zaXplWSAvIDEyLFxuICAgICAgICAgICAgICAgIHg6IHRoaXMuc2l6ZVggLSAodGhpcy5zaXplWCAvIDE2KSxcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnNpemVZIC8gMixcbiAgICAgICAgICAgICAgICBhbW91bnQ6IHRoaXMucGxhbmV0RW5lcmd5Q2FwLFxuICAgICAgICAgICAgICAgIGFuZ2xlOiAtMSxcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogLTEsXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgLy8gcGxhY2VzIGEgc3VuIGluIHRoZSBjZW50ZXIgb2YgdGhlIG1hcFxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5ib2R5KHtcbiAgICAgICAgICAgICAgICBib2R5VHlwZTogXCJzdW5cIixcbiAgICAgICAgICAgICAgICBtYXRlcmlhbFR5cGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIHJhZGl1czogdGhpcy5zaXplWSAvIDQsXG4gICAgICAgICAgICAgICAgeDogdGhpcy5zaXplWCAvIDIsXG4gICAgICAgICAgICAgICAgeTogdGhpcy5zaXplWSAvIDIsXG4gICAgICAgICAgICAgICAgYW5nbGU6IC0xLFxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAtMSxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICAvLyBwbGFjZXMgdGhlIHZpY3RvcnkgcG9pbnQgYXN0ZXJvaWQgYWJvdmUgdGhlIHN1bi5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUuYm9keSh7XG4gICAgICAgICAgICAgICAgYm9keVR5cGU6IFwiYXN0ZXJvaWRcIixcbiAgICAgICAgICAgICAgICBtYXRlcmlhbFR5cGU6IFwibXl0aGljaXRlXCIsXG4gICAgICAgICAgICAgICAgYW1vdW50OiB0aGlzLm15dGhpY2l0ZUFtb3VudCxcbiAgICAgICAgICAgICAgICByYWRpdXM6IHRoaXMuc2l6ZVkgLyAyMCxcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnNpemVYIC8gMixcbiAgICAgICAgICAgICAgICB5OiAoKHRoaXMuc2l6ZVkgKiAzKSAvIDQpICsgKHRoaXMuc2l6ZVkgLyAxMiksXG4gICAgICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6ICh0aGlzLnNpemVZIC8gNCkgKyAodGhpcy5zaXplWSAvIDEyKSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIHNldHMgdGhlIGhvbWUgYmFzZXMgb2YgdGhlIHBsYXllcnMuXG4gICAgICAgIHRoaXMucGxheWVyc1swXS5ob21lQmFzZSA9IHRoaXMuYm9kaWVzWzBdO1xuICAgICAgICB0aGlzLnBsYXllcnNbMV0uaG9tZUJhc2UgPSB0aGlzLmJvZGllc1sxXTtcblxuICAgICAgICAvLyBnZW5lcmVhdGVzIHRoZSBhc3Rlcm9pZHMgd2l0aCBzY2FsZWQgc2l6ZXMuXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVBc3Rlcm9pZHMoMTAwLCB0aGlzLnNpemVYIC8gMTAwLCB0aGlzLnNpemVYIC8gNTApO1xuXG4gICAgICAgIC8vIGFkZHMgYmFzZSB1bml0cywgMyBtaW5lcnMgZm9yIGVhY2ggcGxheWVyLlxuICAgICAgICAvLyBhZGQgZWFjaCBwbGF5ZXJzIHN0YXJ0aW5nIHVuaXRzLlxuICAgICAgICB0aGlzLnBsYXllcnNbMF0udW5pdHMucHVzaChcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudW5pdCh7XG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMucGxheWVyc1swXSxcbiAgICAgICAgICAgICAgICBqb2I6IHRoaXMuam9ic1s0XSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IHRoaXMuc2hpcFJhZGl1cyxcbiAgICAgICAgICAgICAgICBlbmVyZ3k6IDEwMCxcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnBsYXllcnNbMF0uaG9tZUJhc2UueCxcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnBsYXllcnNbMF0uaG9tZUJhc2UueSxcbiAgICAgICAgICAgIH0pLFxuXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLnBsYXllcnNbMF0sXG4gICAgICAgICAgICAgICAgam9iOiB0aGlzLmpvYnNbNF0sXG4gICAgICAgICAgICAgICAgcmFkaXVzOiB0aGlzLnNoaXBSYWRpdXMsXG4gICAgICAgICAgICAgICAgZW5lcmd5OiAxMDAsXG4gICAgICAgICAgICAgICAgeDogdGhpcy5wbGF5ZXJzWzBdLmhvbWVCYXNlLngsXG4gICAgICAgICAgICAgICAgeTogdGhpcy5wbGF5ZXJzWzBdLmhvbWVCYXNlLnksXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICBvd25lcjogdGhpcy5wbGF5ZXJzWzBdLFxuICAgICAgICAgICAgICAgIGpvYjogdGhpcy5qb2JzWzRdLFxuICAgICAgICAgICAgICAgIHJhZGl1czogdGhpcy5zaGlwUmFkaXVzLFxuICAgICAgICAgICAgICAgIGVuZXJneTogMTAwLFxuICAgICAgICAgICAgICAgIHg6IHRoaXMucGxheWVyc1swXS5ob21lQmFzZS54LFxuICAgICAgICAgICAgICAgIHk6IHRoaXMucGxheWVyc1swXS5ob21lQmFzZS55LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzWzFdLnVuaXRzLnB1c2goXG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLnVuaXQoe1xuICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLnBsYXllcnNbMV0sXG4gICAgICAgICAgICAgICAgam9iOiB0aGlzLmpvYnNbNF0sXG4gICAgICAgICAgICAgICAgcmFkaXVzOiB0aGlzLnNoaXBSYWRpdXMsXG4gICAgICAgICAgICAgICAgZW5lcmd5OiAxMDAsXG4gICAgICAgICAgICAgICAgeDogdGhpcy5wbGF5ZXJzWzFdLmhvbWVCYXNlLngsXG4gICAgICAgICAgICAgICAgeTogdGhpcy5wbGF5ZXJzWzFdLmhvbWVCYXNlLnksXG4gICAgICAgICAgICB9KSxcblxuICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS51bml0KHtcbiAgICAgICAgICAgICAgICBvd25lcjogdGhpcy5wbGF5ZXJzWzFdLFxuICAgICAgICAgICAgICAgIGpvYjogdGhpcy5qb2JzWzRdLFxuICAgICAgICAgICAgICAgIHJhZGl1czogdGhpcy5zaGlwUmFkaXVzLFxuICAgICAgICAgICAgICAgIGVuZXJneTogMTAwLFxuICAgICAgICAgICAgICAgIHg6IHRoaXMucGxheWVyc1sxXS5ob21lQmFzZS54LFxuICAgICAgICAgICAgICAgIHk6IHRoaXMucGxheWVyc1sxXS5ob21lQmFzZS55LFxuICAgICAgICAgICAgfSksXG5cbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUudW5pdCh7XG4gICAgICAgICAgICAgICAgb3duZXI6IHRoaXMucGxheWVyc1sxXSxcbiAgICAgICAgICAgICAgICBqb2I6IHRoaXMuam9ic1s0XSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IHRoaXMuc2hpcFJhZGl1cyxcbiAgICAgICAgICAgICAgICBlbmVyZ3k6IDEwMCxcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnBsYXllcnNbMV0uaG9tZUJhc2UueCxcbiAgICAgICAgICAgICAgICB5OiB0aGlzLnBsYXllcnNbMV0uaG9tZUJhc2UueSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGFkZCB0aGUgdW50aXMgdG8gZWFjaCBwbGF5ZXIuXG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiB0aGlzLnBsYXllcnNbMF0udW5pdHMpIHtcbiAgICAgICAgICAgIHRoaXMudW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgdW5pdCBvZiB0aGlzLnBsYXllcnNbMV0udW5pdHMpIHtcbiAgICAgICAgICAgIHRoaXMudW5pdHMucHVzaCh1bml0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgdGhlIGFzdGVyb2lkcyBvbiB0aGUgbWFwLlxuICAgICAqIFRoaXMgZnVuY3Rpb24gY3JlYXRlcyBhc3Rlcm9pZHMgYXJvdW5kIHRoZSBzdW4sIGFuZCBtaXJyb3JzIHRoZW1cbiAgICAgKiBzbyB0aGVyZSBpcyBhIGNvcHkgb24gdGhlIG90aGVyIHNpZGUuXG4gICAgICogQHBhcmFtIGFtb3VudDogdGhlIG51bWJlciBvZiBhc3Rlcm9pZHMgdG8gYmUgZ2VuZXJhdGVkLlxuICAgICAqIEBwYXJhbSBtaW5TaXplOiB0aGUgbWluaW11bSBzaXplIG9mIGEgYXN0ZXJvaWQuXG4gICAgICogQHBhcmFtIG1heFNpemU6IHRoZSBtYXhpbXVtIHNpemUgb2YgYSBhc3Rlcm9pZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGdlbmVyYXRlQXN0ZXJvaWRzKGFtb3VudDogbnVtYmVyLCBtaW5TaXplOiBudW1iZXIsIG1heFNpemU6IG51bWJlcik6IHZvaWQge1xuICAgICAgICAvLyBjcmVhdGUgbGlzdHMgdG8gaGFuZGxlIGFzdGVyb2lkIGNvbGxpc2lvbiB0cmFja2luZyBhbmQgdHJhY2tpbmcgdGhlIGFzdGVyb2lkcy5cbiAgICAgICAgbGV0IHVwcGVyOiBCb2R5W10gPSBbXTtcbiAgICAgICAgbGV0IGxvd2VyOiBCb2R5W10gPSBbXTtcblxuICAgICAgICAvLyBjcmVhdGVzIGFsbCBvZiB0aGUgYXN0ZXJvaWRzLlxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFtb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAvLyByYW5kb21seSBnZW5lcmF0ZXMgdGhlIG1hdGVyaWFsIGJhc2VkIG9uIHJhcml0eS5cbiAgICAgICAgICAgIGNvbnN0IG1hdE51bSA9IHRoaXMubWFuYWdlci5yYW5kb20uaW50KDAsIDgpO1xuICAgICAgICAgICAgbGV0IG1hdGVyaWFsOiBcImdlbmFyaXVtXCIgfCBcInJhcml1bVwiIHwgXCJsZWdlbmRhcml1bVwiIHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKG1hdE51bSA8IHRoaXMub3JlUmFyaXR5R2VuYXJpdW0pIHtcbiAgICAgICAgICAgICAgICBtYXRlcmlhbCA9IFwiZ2VuYXJpdW1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1hdE51bSA8IHRoaXMub3JlUmFyaXR5R2VuYXJpdW0gKyB0aGlzLm9yZVJhcml0eVJhcml1bSkge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gXCJyYXJpdW1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gXCJsZWdlbmRhcml1bVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcGxhY2VzIHRoZSBhc3Rlcm9pZCBpbiBvbmUgb2YgdGhlIHNlY3RvcnMgYmFzZWQgb24gbnVtIGZvciBldmVuIGRpc3RyaWJ1dGlvbi5cbiAgICAgICAgICAgIGlmIChpIDwgYW1vdW50IC8gMikge1xuICAgICAgICAgICAgICAgIC8vIGdlbmVyYXRlIHRoZSByYWRpdXMgYW5kIGRpc3RhbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdDogbnVtYmVyID0gTWF0aC5hYnModGhpcy5tYW5hZ2VyLnJhbmRvbS5mbG9hdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc2l6ZVkgLyA0KSArICh0aGlzLnNpemVZIC8gMTgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5zaXplWSAvIDIuNCkpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmc6IG51bWJlciA9IE1hdGguYWJzKHRoaXMubWFuYWdlci5yYW5kb20uZmxvYXQoMCwgMjIuNSkpO1xuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIG5ldyBhc3Rlcm9pZFxuICAgICAgICAgICAgICAgIGNvbnN0IGFzdDogQm9keSA9IHRoaXMubWFuYWdlci5jcmVhdGUuYm9keSh7XG4gICAgICAgICAgICAgICAgICAgIGJvZHlUeXBlOiBcImFzdGVyb2lkXCIsXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsVHlwZTogbWF0ZXJpYWwsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogdGhpcy5tYW5hZ2VyLnJhbmRvbS5pbnQodGhpcy5taW5Bc3Rlcm9pZCwgdGhpcy5tYXhBc3Rlcm9pZCArIDEpLFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IG1pblNpemUsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhbmcsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBkaXN0LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIGFzdGVyb2lkLlxuICAgICAgICAgICAgICAgIGxvd2VyLnB1c2goYXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGdlbmVyYXRlIHRoZSByYWRpdXMgYW5kIGRpc3RhbmNlXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdDogbnVtYmVyID0gTWF0aC5hYnModGhpcy5tYW5hZ2VyLnJhbmRvbS5mbG9hdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuc2l6ZVkgLyA0KSArICh0aGlzLnNpemVZIC8gMTgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5zaXplWSAvIDIuNCkpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhbmc6IG51bWJlciA9IE1hdGguYWJzKHRoaXMubWFuYWdlci5yYW5kb20uZmxvYXQoMjIuNSwgNDUpKTtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSBuZXcgYXN0ZXJvaWRcbiAgICAgICAgICAgICAgICBjb25zdCBhc3Q6IEJvZHkgPSB0aGlzLm1hbmFnZXIuY3JlYXRlLmJvZHkoe1xuICAgICAgICAgICAgICAgICAgICBib2R5VHlwZTogXCJhc3Rlcm9pZFwiLFxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFR5cGU6IG1hdGVyaWFsLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IHRoaXMubWFuYWdlci5yYW5kb20uaW50KHRoaXMubWluQXN0ZXJvaWQsIHRoaXMubWF4QXN0ZXJvaWQgKyAxKSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiBtaW5TaXplLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogYW5nLFxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogZGlzdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBhZGRzIHRoZSBhc3Rlcm9pZC5cbiAgICAgICAgICAgICAgICB1cHBlci5wdXNoKGFzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXRzIHRoZSB4IGFuZCB5IHZhbHVlcyBmb3IgZWFjaCBhc3Rlcm9pZC5cbiAgICAgICAgZm9yIChjb25zdCBhc3Rlcm9pZCBvZiB1cHBlcikge1xuICAgICAgICAgICAgYXN0ZXJvaWQueCA9IGFzdGVyb2lkLmdldFgoKTtcbiAgICAgICAgICAgIGFzdGVyb2lkLnkgPSBhc3Rlcm9pZC5nZXRZKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXRzIHRoZSB4IGFuZCB5IHZhbHVlcyBmb3IgZWFjaCBhc3Rlcm9pZC5cbiAgICAgICAgZm9yIChjb25zdCBhc3Rlcm9pZCBvZiBsb3dlcikge1xuICAgICAgICAgICAgYXN0ZXJvaWQueCA9IGFzdGVyb2lkLmdldFgoKTtcbiAgICAgICAgICAgIGFzdGVyb2lkLnkgPSBhc3Rlcm9pZC5nZXRZKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb2xsaWRlcyBhc3Rlcm9pZHMgdG8gZ2V0IHJpZCBvZiBvdmVybGFwLlxuICAgICAgICB1cHBlciA9IHRoaXMuY29sbGlkZUFzdGVyb2lkcyh1cHBlcik7XG5cbiAgICAgICAgLy8gZ3Jvd3MgdGhlIGFzdGVyb2lkcyBhcyBsYXJnZSBhcyBwb3NzaWJsZS5cbiAgICAgICAgdGhpcy5ncm93QXN0ZXJvaWRzKHVwcGVyLCBtaW5TaXplLCBtYXhTaXplKTtcblxuICAgICAgICAvLyBjb2xsaWRlcyB0aGUgc2VjdG9ycyB0b2dldGhlciBmb3IgcHJvcGVyIG1hcHBpbmcuXG4gICAgICAgIGxvd2VyID0gdGhpcy5jb2xsaWRlU2VjdG9ycyhsb3dlciwgdXBwZXIsIDApO1xuICAgICAgICBsb3dlciA9IHRoaXMuY29sbGlkZVNlY3RvcnMobG93ZXIsIHVwcGVyLCA0NSk7XG5cbiAgICAgICAgLy8gbm93IGNvbGxpZGUgbG93ZXIgaW4gb3JkZXIgdG8gZ2V0IGEgZ29vZCBmaWxsLlxuICAgICAgICBsb3dlciA9IHRoaXMuY29sbGlkZUFzdGVyb2lkcyhsb3dlcik7XG5cbiAgICAgICAgLy8gbm93IGdyb3cgdGhlIGFzdGVyb2lkIGFmdGVyIGNvbGxpZGluZyB0aGVtXG4gICAgICAgIHRoaXMuZ3Jvd0FzdGVyb2lkcyhsb3dlciwgbWluU2l6ZSwgbWF4U2l6ZSk7XG5cbiAgICAgICAgLy8gbm93IHNocmluayBsb3dlciBzbyBpdCBpc24ndCBjb2xsaWRpbmcgd2l0aCB0aGUgb3RoZXIgc2VjdG9yLlxuICAgICAgICBsb3dlciA9IHRoaXMuY29sbGlkZVNpemUobG93ZXIsIHVwcGVyLCBtaW5TaXplLCAwKTtcbiAgICAgICAgbG93ZXIgPSB0aGlzLmNvbGxpZGVTaXplKGxvd2VyLCB1cHBlciwgbWluU2l6ZSwgNDUpO1xuXG4gICAgICAgIC8vIHRhc3RlciB0cmFja2VyIG9mIGFsbCBhc3Rlcm9pZHMuXG4gICAgICAgIGNvbnN0IG1hc3RlcjogQm9keVtdID0gW107XG5cbiAgICAgICAgLy8gY2xvbmVzIG91dCB0aGUgc2VjdG9ycyB0byBzdXJyb3VuZCB0aGUgc3VuLlxuICAgICAgICB0aGlzLmNsb25lQXN0ZXJvaWRzKG1hc3RlciwgbG93ZXIpO1xuICAgICAgICB0aGlzLmNsb25lQXN0ZXJvaWRzKG1hc3RlciwgdXBwZXIpO1xuXG4gICAgICAgIC8vIGdyYWJzIHRoZSB2aWN0b3J5IHBvaW50IGFzdGVyb2lkLlxuICAgICAgICBjb25zdCB2QXN0ID0gdGhpcy5ib2RpZXNbM107XG4gICAgICAgIC8vIHJlbW92ZXMgYW55IGFzdGVyb2lkcyBjb2xsaWRpbmcgaW50byBpdCBieSBub3QgYWRkaW5nIHRoZW0uXG4gICAgICAgIGZvciAoY29uc3QgYXN0IG9mIG1hc3Rlcikge1xuICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydCgoKGFzdC54IC0gdkFzdC54KSAqKiAyKSArICgoYXN0LnkgLSB2QXN0LnkpICoqIDIpKTtcbiAgICAgICAgICAgIGlmIChkaXN0ID49IGFzdC5yYWRpdXMgKyB2QXN0LnJhZGl1cykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9kaWVzLnB1c2goYXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPj0gdkFzdC5yYWRpdXMgKyBtaW5TaXplKSB7XG4gICAgICAgICAgICAgICAgYXN0LnJhZGl1cyA9IG1pblNpemU7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2RpZXMucHVzaChhc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXhpdHMgdGhlIGdlbmVyYXRvciBmdW5jdGlvbi5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIHRoZSB0cmllcyB0byBncm93IHRoZSBhc3Rlcm9pZHMgdG8gdGhlIHNldCBtYXggc2l6ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhc3Rlcm9pZHM6IGEgbGlzdCBvZiB0aGUgYXN0ZXJvaWRzIHRvIGJlIGdyb3duLlxuICAgICAqIEBwYXJhbSBtaW5TaXplOiB0aGUgbWluaW11bSBzaXplIHRoYXQgYSBhc3Rlcm9pZCB3aWxsIGdyb3cgZnJvbS5cbiAgICAgKiBAcGFyYW0gbWF4U2l6ZTogdGhlIG1heGltdW0gc2l6ZSB0aGF0IGEgYXN0ZXJvaWQgd2lsbCBncm93IHRvLlxuICAgICAqIEBwYXJhbSBwcmVHcm93bjogdHJhY2tzIGlmIHNvbWUgcHJlZ3Jvd2luZyBoYXMgYmVlbiBkb25lLlxuICAgICAqXG4gICAgICogQHJldHVybnM6IG5vdGhpbmcsIGl0IGVkaXRzIHRoZSBhc3Rlcm9pZHMsIGFuZCB3aWxsIHJlbW92ZSBjb2xsaXNpb25zLlxuICAgICAqL1xuICAgIHByaXZhdGUgZ3Jvd0FzdGVyb2lkcyhhc3Rlcm9pZHM6IEJvZHlbXSwgbWluU2l6ZTogbnVtYmVyLCBtYXhTaXplOiBudW1iZXIsIHByZUdyb3duOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICAgICAgLy8gdHJhY2tzIHdoaWNoIGFzdGVyb2lkcyBoYXZlIGdyb3duLlxuICAgICAgICBjb25zdCBncm93bjogYm9vbGVhbltdID0gW107XG4gICAgICAgIC8vIHRyYWNrcyBob3cgbWFueSBhc3Rlcm9pZHMgYXJlIGRvbmUgZ3Jvd2luZy5cbiAgICAgICAgbGV0IGFtdEdyb3duOiBudW1iZXIgPSAwO1xuXG4gICAgICAgIC8vIGdyb3dzIGVhY2ggYXN0ZXJvaWQgYW5kIHNldHMgdXAgdGhlIGdyb3duIHRyYWNrZXIuXG4gICAgICAgIGlmIChwcmVHcm93bikge1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBwcmVmZXItZm9yLW9mXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGFzdGVyb2lkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBhc3Rlcm9pZCBoYXNuJ3QgYWxyZWFkeSBiZWVuIGdyb3duLlxuICAgICAgICAgICAgICAgIGlmIChhc3Rlcm9pZHNbeF0ucmFkaXVzID09PSBtaW5TaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgaXQgaXNuJ3QgZ3Jvd24uXG4gICAgICAgICAgICAgICAgICAgIGdyb3duLnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIG1hcmsgaXQgYXMgZ3Jvd24uXG4gICAgICAgICAgICAgICAgICAgIGdyb3duLnB1c2godHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBwcmVmZXItZm9yLW9mXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGFzdGVyb2lkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIC8vIG1hcmsgaXQgaXNuJ3QgZ3Jvd24uXG4gICAgICAgICAgICAgICAgZ3Jvd24ucHVzaChmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhcyBsb25nIGFzIGFzdGVyb2lkcyBjYW4gc3RpbGwgYmUgZ3Jvd24sIGtlZXAgZ3Jvd2luZyB0aGVtLlxuICAgICAgICB3aGlsZSAoYW10R3Jvd24gPCBhc3Rlcm9pZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBncm93IGVhY2ggYXN0ZXJvaWQgaWYgaXQgaXMgdmFsaWQgdG8gZG8gc28uXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGFzdGVyb2lkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIGlmICghZ3Jvd25beF0gJiYgYXN0ZXJvaWRzW3hdLnJhZGl1cyA8IG1heFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgYXN0ZXJvaWRzW3hdLnJhZGl1cyArPSAobWF4U2l6ZSAtIG1pblNpemUpIC8gMTY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFncm93blt4XSkge1xuICAgICAgICAgICAgICAgICAgICBncm93blt4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGFtdEdyb3duKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIG9mIHRoZSBhc3Rlcm9pZHMuXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGFzdGVyb2lkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIC8vIGlmIGl0IGlzIGFscmVhZHkgZ3Jvd24gYW5kIHRodXMgZGlkbid0IGdyb3duLCBtb3ZlIG9uLlxuICAgICAgICAgICAgICAgIGlmIChncm93blt4XSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgYXN0ZXJvaWQgZm9yIGVhc2Ugb2YgcmVmZXJlbmNlIGFuZCByZWFkYWJpbGl0eS5cbiAgICAgICAgICAgICAgICBjb25zdCBzQXN0ID0gYXN0ZXJvaWRzW3hdO1xuICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciB0aGUgcmVtYWluaW5nIGFzdGVyb2lkcy5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IGFzdGVyb2lkcy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgdHJ5IHRvIGNvbGxpZGUgYSBhc3Rlcm9pZCB3aXRoIGl0J3Mgc2VsZi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHkgPT09IHgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGdyYWIgdGhlIGFzdGVyb2lkIGZvciBlYXNlIG9mIHJlZmVyZW5jZSBhbmQgcmVhZGFiaWxpdHkuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNBc3QgPSBhc3Rlcm9pZHNbeV07XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXkgY29sbGlkZSwgc2hyaW5rIHRoZW0gYW5kIGVuZCB0aGVpciBncm93dGguXG4gICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoKChzQXN0LnggLSBjQXN0LngpICoqIDIpICsgKChzQXN0LnkgLSBjQXN0LnkpICoqIDIpKSA8PSBzQXN0LnJhZGl1cyArIGNBc3QucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdyb3duW3hdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Jvd24uc3BsaWNlKHgsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVuZ3JvdyB0aGUgYXN0ZXJvaWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0ZXJvaWRzW3hdLnJhZGl1cyAtPSAobWF4U2l6ZSAtIG1pblNpemUpIC8gMTY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90ZSB0aGUgYXN0ZXJvaWQgaXMgZG9uZSBncm93aW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFtdEdyb3duKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdyb3duW3ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Jvd24uc3BsaWNlKHksIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVuZ3JvdyB0aGUgYXN0ZXJvaWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN0ZXJvaWRzW3ldLnJhZGl1cyAtPSAobWF4U2l6ZSAtIG1pblNpemUpIC8gMTY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90ZSB0aGUgYXN0ZXJvaWQgaXMgZG9uZSBncm93aW5nLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFtdEdyb3duKys7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiB0aGF0IGhhbmRsZXMgY29sbGlzaW9ucyBiZXR3ZWVuIGFzdGVyb2lkcy4gUmVtb3ZlcyBhc3Rlcm9pZHNcbiAgICAgKiB3aXRoIHRoZSBoaWdoZXN0IGNvbGxpc2lvbiBjb3VudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhc3Rlcm9pZHM6IGEgbGlzdCBvZiB0aGUgYXN0ZXJvaWRzIHRvIGJlIGdyb3duLlxuICAgICAqXG4gICAgICogQHJldHVybnM6IGEgbGlzdCBvZiB0aGUgYXN0ZXJvaWRzIGFmdGVyIHRoZSBwcnVuaW5nLlxuICAgICAqL1xuICAgIHByaXZhdGUgY29sbGlkZUFzdGVyb2lkcyhhc3Rlcm9pZHM6IEJvZHlbXSk6IEJvZHlbXSB7XG4gICAgICAgIC8vIHRyYWNrIHRoZSBsYXJnZXN0IG51bWJlciBvZiBjb2xsaXNpb25zLlxuICAgICAgICBsZXQgbGFyZ2VzdCA9IDA7XG4gICAgICAgIC8vIHRyYWNrcyB2YWxpZCBhc3Rlcm9pZHMuXG4gICAgICAgIGNvbnN0IHZhbGlkOiBCb2R5W10gPSBbXTtcbiAgICAgICAgLy8gdHJhY2tzIGNvbGxpc2lvbnMuXG4gICAgICAgIGNvbnN0IGNvbGxpZGU6IG51bWJlcltdW10gPSBbXTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIHZhbGlkLlxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBhc3Rlcm9pZHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGNvbGxpZGUucHVzaChbXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgZWFjaCBhc3Rlcm9pZC5cbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBhc3Rlcm9pZHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IHNBc3QgPSBhc3Rlcm9pZHNbeF07XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHJlbWFpbmluZyBhc3Rlcm9pZHMuXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0geCArIDE7IHkgPCBhc3Rlcm9pZHMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjQXN0ID0gYXN0ZXJvaWRzW3ldO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZXkgY29sbGlkZSwgbm90ZSB0aGUgY29sbGlzaW9uLlxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnNxcnQoKChzQXN0LnggLSBjQXN0LngpICoqIDIpICsgKChzQXN0LnkgLSBjQXN0LnkpICoqIDIpKSA8PSBzQXN0LnJhZGl1cyArIGNBc3QucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbGxpZGVbeF0ucHVzaCh5KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBsYXJnZXN0IG51bWJlci5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxpZGVbeF0ubGVuZ3RoID4gbGFyZ2VzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFyZ2VzdCA9IGNvbGxpZGVbeF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbGxpZGVbeV0ucHVzaCh4KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBsYXJnZXN0IG51bWJlci5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbGxpZGVbeV0ubGVuZ3RoID4gbGFyZ2VzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFyZ2VzdCA9IGNvbGxpZGVbeV0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIHRoZSBmaXJzdCBhc3Rlcm9pZCB3aXRoIHRoZSBsYXJnZXN0IG51bWJlciBvZiBjb2xsaXNpb25zLlxuICAgICAgICBmb3IgKGxldCBsZW5ndGggPSBsYXJnZXN0OyBsZW5ndGggPiAwOyBsZW5ndGgtLSkge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBhc3Rlcm9pZHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoY29sbGlkZVt4XS5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xsaWRlW3hdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29sbGlkZVtjb2xdICYmIGNvbGxpZGVbY29sXS5pbmRleE9mKHgpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpZGVbY29sXS5zcGxpY2UoY29sbGlkZVtjb2xdLmluZGV4T2YoeCksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY29sbGlkZVtjb2xdLmluZGV4T2YoeCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlkZS5zcGxpY2UoeCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGFzdGVyb2lkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKGNvbGxpZGVbeF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsaWQucHVzaChhc3Rlcm9pZHNbeF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBmaW5hbCBsaXN0LlxuICAgICAgICByZXR1cm4gdmFsaWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBmdW5jdGlvbiB0YWtlcyBpbiB0d28gbGlzdHMgb2YgYXN0ZXJvaWRzIGFuZCB0aGUgZmlyc3QgbGlzdCBieSB0aGVcbiAgICAgKiBkZXNpZ25hdGVkIGFtb3VudCBhbmQgY2hlY2tzIHRvIHNlZSBpZiB0aGV5IGNvbGxpZGUuXG4gICAgICogSXQgcmVtb3ZlcyB0aGUgYXN0ZXJvaWRzIGZyb20gdGhlIGZpcnN0IGxpc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gczE6IHRoaXMgaXMgdGhlIGxpc3Qgb2YgYXN0ZXJvaWRzIHRvIGJlIHNoaWZ0ZWQgYW5kIGVkaXRlZC5cbiAgICAgKiBAcGFyYW0gczI6IHRoaXMgaXMgdGhlIGxpc3Qgb2YgYXN0ZXJvaWRzIHRvIGJlIGNvbXBhcmVkIHRvLlxuICAgICAqIEBwYXJhbSBzaGlmdDogdGhpcyBpcyB0aGUgYW1vdW50IHRoZSBjb3B5IG9mIHRoZSBmaXJzdCBsaXN0IHdpbGwgYmUgc2hpZnRlZFxuICAgICAqXG4gICAgICogQHJldHVybnM6IGl0IGVkaXRzIHMyLlxuICAgICAqL1xuICAgIHByaXZhdGUgY29sbGlkZVNlY3RvcnMoczE6IEJvZHlbXSwgczI6IEJvZHlbXSwgc2hpZnQ6IG51bWJlciA9IDApOiBCb2R5W10ge1xuICAgICAgICAvLyB0cmFja3MgdGhlIHZhbGlkIGFzdGVyb2lkcyB0byBiZSByZXR1cm5lZFxuICAgICAgICBjb25zdCB2YWxpZDogQm9keVtdID0gW107XG4gICAgICAgIC8vIHRyYWNrIGFueSBhc3Rlcm9pZHMgdGhhdCBjb2xsaWRlZFxuICAgICAgICBjb25zdCBjb2xsaWRlOiBib29sZWFuW10gPSBbXTtcblxuICAgICAgICAvLyBzaGlmdCB0aGUgYXN0ZXJvaWQgYW5kIHVwZGF0ZSBpdCdzIGxvY2F0aW9uLlxuICAgICAgICBmb3IgKGNvbnN0IGFzdGVyb2lkIG9mIHMxKSB7XG4gICAgICAgICAgICBjb2xsaWRlLnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgYXN0ZXJvaWQuYW5nbGUgKz0gc2hpZnQ7XG4gICAgICAgICAgICBhc3Rlcm9pZC54ID0gYXN0ZXJvaWQuZ2V0WCgpO1xuICAgICAgICAgICAgYXN0ZXJvaWQueSA9IGFzdGVyb2lkLmdldFkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgb2YgdGhlIGFzdGVyb2lkcy5cbiAgICAgICAgZm9yIChjb25zdCBzQXN0IG9mIHMyKSB7XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHJlbWFpbmluZyBhc3Rlcm9pZHMuXG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHMxLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgYXN0ZXJvaWQgZm9yIGVhc2Ugb2YgcmVmZXJlbmNlIGFuZCByZWFkYWJpbGl0eS5cbiAgICAgICAgICAgICAgICBjb25zdCBjQXN0ID0gczFbeV07XG4gICAgICAgICAgICAgICAgLy8gZ3JhYiB0aGUgZGlzdGFuY2UgZm9yIGVhc2Ugb2YgdXNlXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydCgoKHNBc3QueCAtIGNBc3QueCkgKiogMikgKyAoKHNBc3QueSAtIGNBc3QueSkgKiogMikpO1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZXkgY29sbGlkZSwgc2hyaW5rIHRoZW0gYW5kIGVuZCB0aGVpciBncm93dGguXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPD0gc0FzdC5yYWRpdXMgKyBjQXN0LnJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb3VudCB0aGUgY29sbGlzaW9uLlxuICAgICAgICAgICAgICAgICAgICBjb2xsaWRlW3ldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHNoaWZ0ZWQgYXN0ZXJvaWRzIGFuZCB1biBzaGlmdCB0aGVtLlxuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHMxLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAvLyB1bnNoaWZ0IHRoZSBhc3Rlcm9pZC5cbiAgICAgICAgICAgIHMxW3hdLmFuZ2xlIC09IHNoaWZ0O1xuICAgICAgICAgICAgczFbeF0ueCA9IHMxW3hdLmdldFgoKTtcbiAgICAgICAgICAgIHMxW3hdLnkgPSBzMVt4XS5nZXRZKCk7XG4gICAgICAgICAgICAvLyBpZiB0aGUgYXN0ZXJvaWQgZGlkbid0IGNvbGxpZGUsIGFkZCBpdCB0byB0aGUgcmV0dXJuLlxuICAgICAgICAgICAgaWYgKCFjb2xsaWRlW3hdKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBhc3Rlcm9pZCB0byB0aGUgb3V0cHV0LlxuICAgICAgICAgICAgICAgIHZhbGlkLnB1c2goczFbeF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBmaW5hbCBsaXN0XG4gICAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGluIHR3byBsaXN0cyBvZiBhc3Rlcm9pZHMgYW5kIHRoZSBmaXJzdCBsaXN0IGJ5IHRoZVxuICAgICAqIGRlc2lnbmF0ZWQgYW1vdW50IGFuZCBjaGVja3MgdG8gc2VlIGlmIHRoZXkgY29sbGlkZS5cbiAgICAgKiBJdCByZW1vdmVzIHRoZSBhc3Rlcm9pZHMgZnJvbSB0aGUgZmlyc3QgbGlzdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzMTogdGhpcyBpcyB0aGUgbGlzdCBvZiBhc3Rlcm9pZHMgdG8gYmUgc2hpZnRlZCBhbmQgZWRpdGVkLlxuICAgICAqIEBwYXJhbSBzMjogdGhpcyBpcyB0aGUgbGlzdCBvZiBhc3Rlcm9pZHMgdG8gYmUgY29tcGFyZWQgdG8uXG4gICAgICogQHBhcmFtIG1pblNpemU6IHRoZSBtaW5pbXVtIHNpemUgb2YgYSBhc3Rlcm9pZC5cbiAgICAgKiBAcGFyYW0gc2hpZnQ6IHRoaXMgaXMgdGhlIGFtb3VudCB0aGUgY29weSBvZiB0aGUgZmlyc3QgbGlzdCB3aWxsIGJlIHNoaWZ0ZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zOiBpdCBlZGl0cyBzMi5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNvbGxpZGVTaXplKHMxOiBCb2R5W10sIHMyOiBCb2R5W10sIG1pblNpemU6IG51bWJlciwgc2hpZnQ6IG51bWJlciA9IDApOiBCb2R5W10ge1xuICAgICAgICAvLyB0cmFja3MgdGhlIHZhbGlkIGFzdGVyb2lkcyB0byBiZSByZXR1cm5lZFxuICAgICAgICBjb25zdCB2YWxpZDogQm9keVtdID0gW107XG5cbiAgICAgICAgLy8gc2hpZnQgdGhlIGFzdGVyb2lkIGFuZCB1cGRhdGUgaXQncyBsb2NhdGlvbi5cbiAgICAgICAgZm9yIChjb25zdCBhc3Rlcm9pZCBvZiBzMSkge1xuICAgICAgICAgICAgYXN0ZXJvaWQuYW5nbGUgKz0gc2hpZnQ7XG4gICAgICAgICAgICBhc3Rlcm9pZC54ID0gYXN0ZXJvaWQuZ2V0WCgpO1xuICAgICAgICAgICAgYXN0ZXJvaWQueSA9IGFzdGVyb2lkLmdldFkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgb2YgdGhlIGFzdGVyb2lkcy5cbiAgICAgICAgZm9yIChjb25zdCBzQXN0IG9mIHMyKSB7XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIHJlbWFpbmluZyBhc3Rlcm9pZHMuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNBc3Qgb2YgczEpIHtcbiAgICAgICAgICAgICAgICAvLyBncmFiIHRoZSBkaXN0YW5jZSBmb3IgZWFzZSBvZiB1c2VcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KCgoc0FzdC54IC0gY0FzdC54KSAqKiAyKSArICgoc0FzdC55IC0gY0FzdC55KSAqKiAyKSk7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhleSBjb2xsaWRlLCBzaHJpbmsgdGhlbSBhbmQgZW5kIHRoZWlyIGdyb3d0aC5cbiAgICAgICAgICAgICAgICB3aGlsZSAoZGlzdCA8PSBzQXN0LnJhZGl1cyArIGNBc3QucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvdW50IHRoZSBjb2xsaXNpb24uXG4gICAgICAgICAgICAgICAgICAgIGNBc3QucmFkaXVzIC09IDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSBzaGlmdGVkIGFzdGVyb2lkcyBhbmQgdW4gc2hpZnQgdGhlbS5cbiAgICAgICAgZm9yIChjb25zdCBjQXN0IG9mIHMxKSB7XG4gICAgICAgICAgICAvLyB1bnNoaWZ0IHRoZSBhc3Rlcm9pZC5cbiAgICAgICAgICAgIGNBc3QuYW5nbGUgLT0gc2hpZnQ7XG4gICAgICAgICAgICBjQXN0LnggPSBjQXN0LmdldFgoKTtcbiAgICAgICAgICAgIGNBc3QueSA9IGNBc3QuZ2V0WSgpO1xuICAgICAgICAgICAgLy8gYWRkIGl0IHRvIHRoZSByZXR1cm4uXG4gICAgICAgICAgICB2YWxpZC5wdXNoKGNBc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJuIHRoZSBmaW5hbCBsaXN0XG4gICAgICAgIHJldHVybiB2YWxpZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGlzIGZ1bmN0aW9uIGNsb25lcyB0aGUgYXN0ZXJvaWRzIGluIHRoZSBzZWNvbmQgbGlzdCBpbnRvIHRoZSBmaXJzdCBsaXN0XG4gICAgICogd2l0aCBpdCdzIDggcm90YXRpb25zIGFyb3VuZCB0aGUgc3VuLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1hc3RlcjogVGhlIGxpc3QgdG8gYmUgYWRkZWQgdG8uXG4gICAgICogQHBhcmFtIGNsb25lOiB0aGUgbGlzdCB0aGF0IGlzIGJlaW5nIGNsb25lZCBmcm9tLlxuICAgICAqXG4gICAgICogQHJldHVybnM6IGl0IGFkZHMgdGhlIHJvdGF0aW9ucyBvZiBsaXN0IHR3byBpbnRvIGxpc3Qgb25lLlxuICAgICAqL1xuICAgIHByaXZhdGUgY2xvbmVBc3Rlcm9pZHMobWFzdGVyOiBCb2R5W10sIGNsb25lOiBCb2R5W10pOiB2b2lkIHtcbiAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGVhY2ggb2YgdGhlIGFzdGVyb2lkcyB0byBiZSBjbG9uZXMuXG4gICAgICAgIGZvciAoY29uc3QgYXN0IG9mIGNsb25lKSB7XG4gICAgICAgICAgICBtYXN0ZXIucHVzaChcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGJhc2UgYXN0ZXJvaWQuXG4gICAgICAgICAgICAgICAgYXN0LFxuICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgYmFzZSBhc3Rlcm9pZCBzaGlmdGVkIGJ5IDQ1IGRlZ3JlZXMuXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5ib2R5KHtcbiAgICAgICAgICAgICAgICAgICAgYm9keVR5cGU6IFwiYXN0ZXJvaWRcIixcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUeXBlOiBhc3QubWF0ZXJpYWxUeXBlLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IGFzdC5hbW91bnQsXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogYXN0LnJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGFzdC5hbmdsZSArIDQ1LFxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogYXN0LmRpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLmdldFgoYXN0LmRpc3RhbmNlLCBhc3QuYW5nbGUgKyA0NSksXG4gICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuZ2V0WShhc3QuZGlzdGFuY2UsIGFzdC5hbmdsZSArIDQ1KSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGJhc2UgYXN0ZXJvaWQgc2hpZnRlZCBieSA5MCBkZWdyZWVzLlxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUuYm9keSh7XG4gICAgICAgICAgICAgICAgICAgIGJvZHlUeXBlOiBcImFzdGVyb2lkXCIsXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsVHlwZTogYXN0Lm1hdGVyaWFsVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBhc3QuYW1vdW50LFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IGFzdC5yYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhc3QuYW5nbGUgKyA5MCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IGFzdC5kaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy5nZXRYKGFzdC5kaXN0YW5jZSwgYXN0LmFuZ2xlICsgOTApLFxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLmdldFkoYXN0LmRpc3RhbmNlLCBhc3QuYW5nbGUgKyA5MCksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBiYXNlIGFzdGVyb2lkIHNoaWZ0ZWQgYnkgMTM1IGRlZ3JlZXMuXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5ib2R5KHtcbiAgICAgICAgICAgICAgICAgICAgYm9keVR5cGU6IFwiYXN0ZXJvaWRcIixcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUeXBlOiBhc3QubWF0ZXJpYWxUeXBlLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IGFzdC5hbW91bnQsXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogYXN0LnJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGFzdC5hbmdsZSArIDEzNSxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IGFzdC5kaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy5nZXRYKGFzdC5kaXN0YW5jZSwgYXN0LmFuZ2xlICsgMTM1KSxcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy5nZXRZKGFzdC5kaXN0YW5jZSwgYXN0LmFuZ2xlICsgMTM1KSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGJhc2UgYXN0ZXJvaWQgc2hpZnRlZCBieSAxODAgZGVncmVlcy5cbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmJvZHkoe1xuICAgICAgICAgICAgICAgICAgICBib2R5VHlwZTogXCJhc3Rlcm9pZFwiLFxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFR5cGU6IGFzdC5tYXRlcmlhbFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogYXN0LmFtb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiBhc3QucmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogYXN0LmFuZ2xlICsgMTgwLFxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogYXN0LmRpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLmdldFgoYXN0LmRpc3RhbmNlLCBhc3QuYW5nbGUgKyAxODApLFxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLmdldFkoYXN0LmRpc3RhbmNlLCBhc3QuYW5nbGUgKyAxODApLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIC8vIGFkZCB0aGUgYmFzZSBhc3Rlcm9pZCBzaGlmdGVkIGJ5IDIyNSBkZWdyZWVzLlxuICAgICAgICAgICAgICAgIHRoaXMubWFuYWdlci5jcmVhdGUuYm9keSh7XG4gICAgICAgICAgICAgICAgICAgIGJvZHlUeXBlOiBcImFzdGVyb2lkXCIsXG4gICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsVHlwZTogYXN0Lm1hdGVyaWFsVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgYW1vdW50OiBhc3QuYW1vdW50LFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IGFzdC5yYWRpdXMsXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBhc3QuYW5nbGUgKyAyMjUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBhc3QuZGlzdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgIHg6IHRoaXMuZ2V0WChhc3QuZGlzdGFuY2UsIGFzdC5hbmdsZSArIDIyNSksXG4gICAgICAgICAgICAgICAgICAgIHk6IHRoaXMuZ2V0WShhc3QuZGlzdGFuY2UsIGFzdC5hbmdsZSArIDIyNSksXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBiYXNlIGFzdGVyb2lkIHNoaWZ0ZWQgYnkgMjcwIGRlZ3JlZXMuXG4gICAgICAgICAgICAgICAgdGhpcy5tYW5hZ2VyLmNyZWF0ZS5ib2R5KHtcbiAgICAgICAgICAgICAgICAgICAgYm9keVR5cGU6IFwiYXN0ZXJvaWRcIixcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWxUeXBlOiBhc3QubWF0ZXJpYWxUeXBlLFxuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IGFzdC5hbW91bnQsXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogYXN0LnJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IGFzdC5hbmdsZSArIDI3MCxcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IGFzdC5kaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy5nZXRYKGFzdC5kaXN0YW5jZSwgYXN0LmFuZ2xlICsgMjcwKSxcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy5nZXRZKGFzdC5kaXN0YW5jZSwgYXN0LmFuZ2xlICsgMjcwKSxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGJhc2UgYXN0ZXJvaWQgc2hpZnRlZCBieSAzMTUgZGVncmVlcy5cbiAgICAgICAgICAgICAgICB0aGlzLm1hbmFnZXIuY3JlYXRlLmJvZHkoe1xuICAgICAgICAgICAgICAgICAgICBib2R5VHlwZTogXCJhc3Rlcm9pZFwiLFxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbFR5cGU6IGFzdC5tYXRlcmlhbFR5cGUsXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudDogYXN0LmFtb3VudCxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiBhc3QucmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogYXN0LmFuZ2xlICsgMzE1LFxuICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZTogYXN0LmRpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICB4OiB0aGlzLmdldFgoYXN0LmRpc3RhbmNlLCBhc3QuYW5nbGUgKyAzMTUpLFxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLmdldFkoYXN0LmRpc3RhbmNlLCBhc3QuYW5nbGUgKyAzMTUpLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIHggdmFsdWUgb2YgdGhlIGFuZ2xlIGFuZCBkaXN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBkaXN0YW5jZTogdGhlIGRpc3RhbmNlIGZyb20gdGhlIGNlbnRlci5cbiAgICAgKiBAcGFyYW0gYW5nbGU6IHRoZSBhbmdsZSBmcm9tIGEgdG9wLCBsaWtlIGEgcm90YXRlZCA5MCBkZWdyZWUgdG8gdGhlIHJpZ2h0XG4gICAgICogdW5pdCBjaXJjbGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgeCB2YWx1ZSBhdCBpdCdzIGRpc3RhbmNlIGFuZCBhbmdsZVxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0WChkaXN0YW5jZTogbnVtYmVyLCBhbmdsZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgLy8gZ2V0cyB0aGUgeCBsb2NhdGlvbiBpZiB0aGVyZSBpcyBhIHBhc3NlZCBkaXN0YW5jZS5cbiAgICAgICAgaWYgKGRpc3RhbmNlID49IDAgJiYgYW5nbGUgPj0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlICogTWF0aC5jb3MoKChhbmdsZSArIDkwKSAvIDE4MCkgKiBNYXRoLlBJKSArIHRoaXMuYm9kaWVzWzJdLng7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSB5IHZhbHVlIG9mIHRoZSBhbmdsZSBhbmQgZGlzdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGlzdGFuY2U6IHRoZSBkaXN0YW5jZSBmcm9tIHRoZSBjZW50ZXIuXG4gICAgICogQHBhcmFtIGFuZ2xlOiB0aGUgYW5nbGUgZnJvbSBhIHRvcCwgbGlrZSBhIHJvdGF0ZWQgOTAgZGVncmVlIHRvIHRoZSByaWdodFxuICAgICAqIHVuaXQgY2lyY2xlLlxuICAgICAqXG4gICAgICogQHJldHVybnMgdGhlIHkgdmFsdWUgYXQgaXQncyBkaXN0YW5jZSBhbmQgYW5nbGVcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFkoZGlzdGFuY2U6IG51bWJlciwgYW5nbGU6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIC8vIGdldHMgdGhlIHkgbG9jYXRpb24gaWYgdGhlcmUgaXMgYSBwYXNzZWQgZGlzdGFuY2UuXG4gICAgICAgIGlmIChkaXN0YW5jZSA+PSAwICYmIGFuZ2xlID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiBkaXN0YW5jZSAqIE1hdGguc2luKCgoYW5nbGUgKyA5MCkgLyAxODApICogTWF0aC5QSSkgKyB0aGlzLmJvZGllc1syXS55O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFueSBhZGRpdGlvbmFsIHByb3RlY3RlZCBvciBwaXJhdGUgbWV0aG9kcyBjYW4gZ28gaGVyZS5cblxuICAgIC8vIDw8LS0gL0NyZWVyLU1lcmdlOiBwcm90ZWN0ZWQtcHJpdmF0ZS1mdW5jdGlvbnMgLS0+PlxufVxuIl19