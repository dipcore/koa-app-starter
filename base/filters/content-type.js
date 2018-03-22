/*
 * File: content-type.js
 * Project: koa-app-starter
 * File Created: Wednesday, 21st March 2018 9:27:39 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:28:58 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

// @RoutePreFilter(filter='content-type', parameters={type: 'json'})
// parameters = json|html|text
module.exports = (app, config, parameters) => (ctx, next) => {
    ctx.type = parameters.type || 'json';
};