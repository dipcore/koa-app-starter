/*
 * File: Engine.js
 * Project: koa-app-starter
 * File Created: Sunday, 25th March 2018 12:12:46 am
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const _ = require('lodash');

class Engine {

    constructor(app, config) {
        this.app = app;
        let engineConfig = config.engines && config.engines[this.constructor.id] || {};
        this.config = _.extend({}, this.constructor.defaultConfig, engineConfig);
    }

    static get defaultConfig() {
        return {};
    }

    get id() {
        throw("engine.id should be implemented");
    }

    async render(ctx, route, models) {
        throw('render method should be implemented');
    }
}
module.exports = Engine;