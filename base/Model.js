/*
 * File: Model.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
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