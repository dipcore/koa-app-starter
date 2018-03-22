/*
 * File: Model.js
 * Project: koa-app-starter
 * File Created: Wednesday, 14th March 2018 9:20:25 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * Last Modified: Thursday, 22nd March 2018 12:26:21 pm
 * Modified By: Denys Petrovnin (dipcore@gmail.com>)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

 class Model {

    constructor(app, config) {
        this.app = app;
        this.config = config;
    }

    get id() {
        throw("model.id should be implemented");
    }
}

module.exports = Model;