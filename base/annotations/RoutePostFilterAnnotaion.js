/*
 * File: RoutePostFilterAnnotaion.js
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
const TAG = 'RoutePostFilterAnnotaion';

class RoutePostFilterAnnotaion extends Annotation {

    // PreFilter goes last
    static get weight() { return 9000; }

    static get annotation() { return 'RoutePostFilter'; }

    static get targets() { return [Annotation.METHOD]; }

    apply(app, config, instance) {
        super.apply(app, config, instance);

        let storage = instance[RouteAnnotation.storageKey];
        let routeParams = storage.get(this.target);
        let route = routeParams.route;

        if (!route) {
            Log.e(TAG, '@Route annotation is required');
        }

        // route.set(this.constructor.weight, async (ctx, next) => {
            
        // });
    }
}

module.exports = RoutePostFilterAnnotaion;