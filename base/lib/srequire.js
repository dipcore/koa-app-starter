/*
 * File: srequire.js
 * Project: koa-app-starter
 * File Created: Wednesday, 14th March 2018 2:39:28 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:27:14 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

module.exports = function (path, def) {
    try {
        return require(path);
    } catch (e) { }
    return def || undefined;
}