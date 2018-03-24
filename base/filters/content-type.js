/*
 * File: content-type.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


// Usage: @RoutePreFilter(filter='content-type', parameters={type: 'json'})
// parameters = json|html|text
module.exports = (app, config, parameters) => (ctx, next) => {
    ctx.type = parameters.type || 'json';
};