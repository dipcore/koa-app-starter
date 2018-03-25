/*
 * File: Annotation.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


const { Annotation } = require('base/lib/annotations');
const Storage = require('base/Storage');
const Log = require('base/Log');
const TAG = 'Annotation';

const container = new Storage();

class BaseAnnotation extends Annotation {

    static get instantiate() { return true; }

    static get storage() {
        return container;
    }

    apply(app, config, obj) {
        if (this.constructor.instantiate) {
            this.instance = obj;
        }
    }
}
module.exports = BaseAnnotation;