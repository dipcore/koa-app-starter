/*
 * File: Config.js
 * Project: koa-app-starter
 * File Created: Saturday, 24th March 2018 1:16:16 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const _ = require('lodash');
const path = require('path');
const srequire = require('base/lib/srequire');
let configs = {};

class Config {
    constructor(options) {
        options = options || {};
        var env = options.env || process.env.ENVIRONMENT || 'local';
        var baseConfig = srequire('config');
        
        var basePath = options.path || baseConfig.path.config;

        var allConfigPath = path.join(basePath, 'all.json');
        var envConfigPath = path.join(basePath, env + '.json');

        if (configs[envConfigPath]) return configs[envConfigPath];

        configs[envConfigPath] = { root: process.cwd(), env };
        _.merge(configs[envConfigPath], baseConfig);
        _.merge(configs[envConfigPath], srequire(allConfigPath, {}));
        _.merge(configs[envConfigPath], srequire(envConfigPath, {}));
        return configs[envConfigPath];
    }
}
module.exports = Config;