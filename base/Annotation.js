/*
 * File: Annotation.js
 * Project: koa-app-starter
 * File Created: Monday, 19th March 2018 11:52:37 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:25:20 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
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