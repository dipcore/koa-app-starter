/*
 * File: required-input.js
 * Project: koa-app-starter
 * File Created: Wednesday, 21st March 2018 4:06:36 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:29:05 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const contains = require('base/lib/array-contains');
const sarray = require('base/lib/sarray');
const Throw = require('base/Throw');

// @RoutePreFilter(filter='required-input', parameters=['a', 'b'])
module.exports = (app, config, parameters) => (ctx, next) => {
    let requiredFields = parameters;
    let receivedFields = Object.keys(ctx.input);
    if (!requiredFields)
        return true;
    if (!contains(receivedFields, requiredFields)) {
        Throw.error(500, 'No value given for one or more required parameters', ctx.contentType);
    }
}