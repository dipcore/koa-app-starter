/*
 * File: Renderer.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


const _ = require('lodash');

class Renderer {
    constructor(app, settings) {
        this.app = app;
        this.settings = _.extend({}, this.defaultSettings, settings);
    }

    get defaultSettings() {
        return {};
    }

    async render(ctx, route, models) {
        throw('render method should be implemented');
    }

}

module.exports = Renderer;