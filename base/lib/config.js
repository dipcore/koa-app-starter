/*
 * File: config.js
 * Project: koa-app-starter
 * File Created: Wednesday, 14th March 2018 2:18:07 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:28:28 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const _ = require('lodash');
const path = require('path');
const srequire = require('./srequire');
var configs = {};

module.exports = function (options) {
    options = options || {};
    var env = options.env || process.env.ENVIRONMENT || 'local';
    var basePath = options.path || path.join(process.cwd(), 'config');
    var allConfigPath = path.join(basePath, 'all.json');
    var envConfigPath = path.join(basePath, env + '.json');

    if (configs[envConfigPath]) return configs[envConfigPath];

    configs[envConfigPath] = { root: process.cwd(), env };
    _.assign(configs[envConfigPath], srequire(allConfigPath, {}));
    _.assign(configs[envConfigPath], srequire(envConfigPath, {}));
    return configs[envConfigPath];
}
