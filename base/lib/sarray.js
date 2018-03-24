/*
 * File: sarray.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


module.exports = function (val) {
    if (!val)
        return [];
    return Array.isArray(val) ? val : [val]
}