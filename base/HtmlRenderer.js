/*
 * File: HtmlRenderer.js
 * Project: koa-app-starter
 * File Created: Thursday, 15th March 2018 11:21:07 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:25:58 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

 const _ = require('lodash');
const swig = require('swig-templates');
const path = require('path');

const Renderer = require('./Renderer');
const Errors = require('./Errors');
const Log = require('./Log');

const TAG = 'HtmlRenderer';

const defaultConfig = {
    autoescape: true,
    root: 'views',
    cache: 'memory',
    ext: 'html',
    writeBody: true
    /*
    locals: {},
    filters: {}.
    tags: {},
    extensions: {}
    */
};


class HtmlRenderer extends Renderer {

    get defaultSettings() {
        return defaultConfig;
    }

    async render(ctx, route, models) {
        if (!route.view) return;

        let view = path.resolve(this.settings.root, view);
        Log.i(TAG, 'Rendering view: ', view);
        return await swig.renderFile(view, models);
    }

    set filters(filters) {
        for (let name in filters) {
            swig.setFilter(name, filters[name]);
        }
    }

    set tags(tags) {
        for (let name in tags) {
            let tag = tags[name];
            swig.setTag(name, tag.parse, tag.compile, tag.ends, tag.blockLevel);
        }
    }

    set extensions(extensions) {
        for (let name in extensions) {
            swig.setExtension(name, extensions[name]);
        }
    }

}
module.exports = HtmlRenderer;