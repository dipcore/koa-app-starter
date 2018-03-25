/*
 * File: TemplateAnnotation.js
 * Project: koa-app-starter
 * File Created: Saturday, 24th March 2018 1:04:08 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const Annotation = require('base/Annotation');
const RouteAnnotation = require('base/annotations/RouteAnnotation');
const Throw = require('base/Throw');

const Log = require('base/Log');
const TAG = 'TemplateAnnotation';

const _ = require('lodash');
const path = require('path');
const srequire = require('base/lib/srequire');

let engines = new Map();

class TemplateAnnotation extends Annotation {

    static get weight() { return 10000; }

    static get annotation() { return 'Template'; }

    static get targets() { return [Annotation.METHOD]; }

    apply(app, config, instance) {
        super.apply(app, config, instance);

        const className = instance.constructor.name;
        const route = RouteAnnotation.storage.get(className, this.target, 'route');

        if (!route) {
            Log.e(TAG, '@Route annotation is required');
            return;
        }

        let value = this.value;
        if (!this.value) {
            Log.e(TAG, 'view name is required');
            return;
        }

        let name = this.engine || config.defaultEngine;
        if (!name) {
            Log.e(TAG, 'engine attribute or config.defaultEngine is required');
            return;
        }

        name = _.capitalize(name) + 'Engine';

        let engine = engines[name];
        if (!engine) {
            const Engine = srequire(path.resolve(config.path.engines, name))
                || srequire(path.resolve('base/engines', name));

            if (!Engine) {
                Log.e(TAG, name, ' is not found');
                return;
            }
            engine = new Engine(app, config);
            engines[name] = engine;
        }

        route.set(this.constructor.weight, async (ctx, next) => {
            ctx.body = await engine.render(this.value, ctx.templateContext);
        });
    }

}
module.exports = TemplateAnnotation;