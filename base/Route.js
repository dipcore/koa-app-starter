/*
 * File: Route.js
 * Project: koa-app-starter
 * File Created: Wednesday, 21st March 2018 11:23:14 am
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:26:48 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const _ = require('lodash');
const pathToRegexp = require('path-to-regexp');
const Log = require('base/Log');
const TAG = 'Route';

/**
 * **Simple Koa router which supports multiple ordered by weight middlewares
 * 
 * ***Usage:
 * ```
 * let app = new Koa();
 * ...
 * let route1 = new Route();
 * route1.set(weight11, middleware11);
 * route1.set(weight12, middleware12);
 * app.use(route1(mehod, path));
 * ...
 * let route2 = new Route();
 * route2.set(weight21, middleware21);
 * route2.set(weight22, middleware22);
 * app.use(route2(mehod, path));
 * ```
 * 
 * ***Where:
 * weight - [integer] Weight of current middleware
 * middleware - [function] (ctx, next) => { ... }
 * 
 * Middleware stack is sorted according weight value before applying to the actual route
 * You can add or remove middlewares in runtime by updating Route instances:
 * ```
 * ...
 * app.use(route1(mehod, path));
 * ... somewhere later in your code ...
 * route1.set(new-weight, new-middleware);
 * route1.remove(weight);
 * ```
 * 
 */
class Route extends Map {

    constructor(opts) {
        super();
        this.opts = opts;
    }

    log(...messages) {
        false && Log.i(TAG, messages);
    }

    /**
     * Set route middleware
     * Meddleware stack is sorted by weight
     * 
     * @param {number} key Route weight
     * @param {function} value Middleware (ctx, next) => { ... }
     * @returns 
     * @memberof Route
     */
    set(key, value) {

        // increment weight, if it already exists
        key = super.get(key) ? ++key : key;
        super.set(key, value);

        // Sort by key
        for (const [key, value] of [...this.entries()].sort()) {
            this.delete(key);
            super.set(key, value);
        }

        return key;
    }

    use(method, path) {
        const re = pathToRegexp(path, this.opts);
        method = method.toUpperCase();

        this.log(`${method} ${path} -> ${re}`);

        return async (ctx, next) => {

            // method
            if (!this.matches(ctx, method)) return next();

            // path
            const m = re.exec(ctx.path);
            if (m) {
                const args = m.slice(1).map(this.decode);
                this.log(`${ctx.method} ${path} matches ${ctx.path} ${args}`);

                ctx.routePath = path;
                ctx.input = _.assign({}, ctx.query, ctx.request.body, args);

                for (let [key, value] of this) {
                    await value.call(null, ctx, next);
                }
            }

            // miss
            return next();
        }
    }

    matches(ctx, method) {
        if (!method || method === 'ALL') return true;
        if (ctx.method === method) return true;
        if (method === 'GET' && ctx.method === 'HEAD') return true;
        return false;
    }

    decode(val) {
        if (val) return decodeURIComponent(val);
    }

}
module.exports = Route;