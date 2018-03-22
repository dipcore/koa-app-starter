/*
 * File: RoutePreFilterAnnotaion.js
 * Project: koa-app-starter
 * File Created: Wednesday, 21st March 2018 3:48:08 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:29:34 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const Annotation = require('base/Annotation');
const RouteAnnotation = require('base/annotations/RouteAnnotation');
const Throw = require('base/Throw');

const Log = require('base/Log');
const TAG = 'RoutePreFilterAnnotaion';

const path = require('path');
const srequire = require('base/lib/srequire');

class RoutePreFilterAnnotaion extends Annotation {

    // PreFilter goes first
    static get weight() { return 1000; }

    static get annotation() { return 'RoutePreFilter'; }

    static get targets() { return [Annotation.METHOD]; }

    apply(app, config, instance) {
        super.apply(app, config, instance);

        let storage = instance[RouteAnnotation.storageKey];
        let routeParams = storage.get(this.target);
        let route = routeParams.route; // Route instance

        if (!route) {
            Log.e(TAG, '@Route annotation is required');
            return;
        }

        if (!this.filter) {
            Log.e(TAG, 'filter name is required');
            return;
        }

        Log.i(TAG, `Filter: ${this.filter} Parameters: ${this.parameters} Method: ${this.className}.${this.target}`);

        // Load application filter first
        const filter = srequire(path.resolve(config.filters, this.filter))
            || srequire(path.resolve('base/filters', this.filter));

        route.set(this.constructor.weight, filter(app, config, this.parameters));

    }
}

module.exports = RoutePreFilterAnnotaion;