/*
 * File: app.js
 * Project: koa-app-starter
 * File Created: Wednesday, 14th March 2018 10:56:45 am
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:29:52 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

require('app-module-path/cwd');

const config = require('base/lib/config')();

const Bootstrap = require('base/Bootstrap');
const Koa = require('koa');
const Log = require('base/Log');

const TAG = 'App';
let app = new Koa();

new Bootstrap(app, config).run().then(() => {
    let port = process.env.PORT || config.port || 8081;
    app.listen(port, function () {
        Log.i(TAG, "Listening port: ", port);
    });
});