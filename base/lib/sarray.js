/*
 * File: sarray.js
 * Project: koa-app-starter
 * File Created: Wednesday, 14th March 2018 4:48:34 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:27:21 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

module.exports = function (val) {
    if (!val)
        return [];
    return Array.isArray(val) ? val : [val]
}