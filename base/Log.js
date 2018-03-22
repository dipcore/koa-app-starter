/*
 * File: Log.js
 * Project: koa-app-starter
 * File Created: Thursday, 15th March 2018 9:37:14 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:26:05 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

 const colors = require('colors/safe');

class Log {
    static stringify(o) {
        return Array.isArray(o) || (o instanceof Object && o.constructor === Object)
            ? '\n' + JSON.stringify(o, null, '\t')
            : o;
    }
    static tag(t) { return '[' + t + ']'; }
    static log(TAG, color, messages) {
        console.log(colors.green(colors.bold(this.tag(TAG))), ...messages.map(m => color(this.stringify(m))));
    }

    static i(TAG, ...args) { this.log(TAG, colors.white, args); }
    static d(TAG, ...args) { this.log(TAG, colors.green, args); }
    static w(TAG, ...args) { this.log(TAG, colors.yellow, args); }
    static e(TAG, ...args) { this.log(TAG, colors.red, args); }
}

module.exports = Log;