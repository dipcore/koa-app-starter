/*
 * File: required-input.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


const contains = require('base/lib/array-contains');
const sarray = require('base/lib/sarray');
const Throw = require('base/Throw');

// Usage: @RoutePreFilter(filter='required-input', parameters=['a', 'b'])
module.exports = (app, config, parameters) => (ctx, next) => {
    let requiredFields = parameters;
    let receivedFields = Object.keys(ctx.input);
    if (!requiredFields)
        return true;
    if (!contains(receivedFields, requiredFields)) {
        Throw.error(500, 'No value given for one or more required parameters', ctx.type);
    }
}