/*
 * File: RoutePreFilterAnnotaion.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
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
        const filter = srequire(path.resolve(config.path.filters, this.filter))
            || srequire(path.resolve('base/filters', this.filter));

        route.set(this.constructor.weight, filter(app, config, this.parameters));

    }
}

module.exports = RoutePreFilterAnnotaion;