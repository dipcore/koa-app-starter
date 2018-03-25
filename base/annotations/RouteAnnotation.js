/*
 * File: RouteAnnotation.js
 * Project: koa-app-starter
 * File Created: Saturday, 24th March 2018 12:56:02 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


const _ = require('lodash');
const path = require('path');
const sarray = require('base/lib/sarray');

const Annotation = require('base/Annotation');
const Route = require('base/Route');

const Log = require('base/Log');
const TAG = 'RouteAnnotation';

class RouteAnnotation extends Annotation {

    // Call route method the last
    static get weight() { return 8000; }

    static get annotation() { return 'Route'; }

    static get targets() { return [Annotation.METHOD, Annotation.DEFINITION]; }

    apply(app, config, instance) {
        super.apply(app, config, instance);

        const className = instance.constructor.name;
        const storage = this.constructor.storage;

        if (!this.value) {
            Log.e(TAG, `Error applying route: ${this.filePath}`);
            Log.e(TAG, `path argument is required for ${className}.${this.target} method`);
            return;
        }

        // Store basePath for later use, if it's definition
        if (this.type === Annotation.DEFINITION) {
            storage.set(className, 'basePath', this.value);
            return;
        }

        let methods = sarray(this.methods || ['all']);
        let basePath = storage.get(className, 'basePath') || '/';
        let route = storage.get(className, this.target, 'route') || new Route();

        for (let i = 0; i < methods.length; i++) {

            let method = methods[i];
            let url = path.join(basePath, this.value);

            Log.i(TAG, `Path: ${url} for ${this.className}.${this.target}`);

            route.set(this.constructor.weight, async (ctx, next) => {
                let result = instance[this.target](ctx, next);
                result instanceof Promise && await result;
            });

            // Use route
            app.use(route.use(method, url));

            // Store data to be able to re-use it in other route-based annotations
            storage.set(className, this.target, 'route', route);
        }
    }
}
module.exports = RouteAnnotation;