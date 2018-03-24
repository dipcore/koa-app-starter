/*
 * File: srequire.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


module.exports = function (path, def) {
    try {
        return require(path);
    } catch (e) { }
    return def || undefined;
}