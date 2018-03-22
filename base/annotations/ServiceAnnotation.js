/*
 * File: ServiceAnnotation.js
 * Project: koa-app-starter
 * File Created: Monday, 19th March 2018 3:21:44 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:29:41 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const _ = require('lodash');
const path = require('path');

const Annotation = require('base/Annotation');
const Log = require('base/Log');
const TAG = 'ServiceAnnotation';

class ServiceAnnotation extends Annotation {

    static get annotation() { return 'Service'; }

    static get targets() { return [Annotation.DEFINITION]; }

    static get instantiate() { return false; }

    apply(app, config, o) {
        let service = path.resolve(config.services, this.value);
        let name = _.camelCase(this.value);
        o.prototype[name] = require(service);
    }
}
module.exports = ServiceAnnotation;