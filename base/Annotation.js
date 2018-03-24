/*
 * File: Annotation.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


const { Annotation } = require('base/lib/annotations');
const Log = require('base/Log');
const TAG = 'Annotation';

class BaseAnnotation extends Annotation {
    
    static get instantiate() { return true; }

    static get storageKey() {
        return '$' + this.annotation;
    }

    get storage() {
        let key = this.constructor.storageKey;
        return this.instance[key] = this.instance[key] || new Map();
    }

    apply(app, config, obj) {
        if (this.constructor.instantiate) {
            this.instance = obj;
        }
    }
}
module.exports = BaseAnnotation;