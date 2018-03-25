/*
 * File: SwigEngine.js
 * Project: koa-app-starter
 * File Created: Sunday, 25th March 2018 12:09:11 am
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const Engine = require('base/Engine');
const Log = require('base/Log');

const TAG = 'SwigEngine';

const _ = require('lodash');
const swig = require('swig-templates');
const path = require('path');

class SwigEngine extends Engine {

    constructor(app, config) {
        super(app, config);
        swig.setDefaults(this.config);

        // swig custom filters
        this.setFilters(this.config.filters);

        // swig custom tags
        this.setTags(this.config.tags);

        // add extensions for custom tags
        this.setExtensions(this.config.extensions);
    }

    static get id() {
        return 'swig';
    }

    static get defaultConfig() {
        return {
            autoescape: true,
            root: 'views',
            cache: 'memory',
            ext: 'html'
        };
    }

    async render(view, context) {
        if (!view) return;

        view = this.extname(view);
        view = this.resolve(view);
        Log.i(TAG, 'Rendering view: ', view);
        return await swig.renderFile(view, context);
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

    extname(view) {
        let ext = path.extname(view);
        if (!ext)
            view = view + '.' + this.config.ext;
        return view;
    }

    resolve(view) {
        return path.resolve(this.config.root, view);
    }

    setFilters(filters) {
        for (var name in filters) {
            swig.setFilter(name, filters[name]);
        }
    }

    setTags(tags) {
        var name, tag;
        for (name in tags) {
            tag = tags[name];
            swig.setTag(name, tag.parse, tag.compile, tag.ends, tag.blockLevel);
        }
    }

    setExtensions(extensions) {
        for (var name in extensions) {
            swig.setExtension(name, extensions[name]);
        }
    }
}
module.exports = SwigEngine;