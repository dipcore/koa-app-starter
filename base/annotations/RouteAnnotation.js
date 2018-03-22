/*
 * File: RouteAnnotation.js
 * Project: koa-app-starter
 * File Created: Monday, 19th March 2018 10:07:07 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 3:42:44 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
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

        if (!this.path) {
            Log.e(TAG, `Error applying route: ${this.filePath}`);
            Log.e(TAG, `path argument is required for ${this.className}.${this.target} method`);
            return;
        }

        // Store basePath for later use, if it's definition
        if (this.type === Annotation.DEFINITION) {
            this.storage.set('basePath', this.path);
            return;
        }


        let methods = sarray(this.methods || ['all']);
        let basePath = this.storage.get('basePath') || '/';
        let targetData = this.storage.get(this.target) || {};

        let route = targetData.route || new Route();

        for (let i = 0; i < methods.length; i++) {

            let method = methods[i];
            let url = path.join(basePath, this.path);

            Log.i(TAG, `Path: ${url} Method: ${this.className}.${this.target}`);

            route.set(this.constructor.weight, async (ctx, next) => {
                let result = instance[this.target](ctx, next);
                result instanceof Promise && await result;
            });

            // Use route
            app.use(route.use(method, url));

            // Store data to be able to re-use it in other route-based annotations
            targetData.route = route;
            this.storage.set(this.target, targetData);
        }
    }
}
module.exports = RouteAnnotation;