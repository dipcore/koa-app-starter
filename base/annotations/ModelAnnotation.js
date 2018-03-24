/*
 * File: ModelAnnotation.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const _ = require('lodash');
const path = require('path');

const Annotation = require('base/Annotation');
const Log = require('base/Log');
const TAG = 'ModelAnnotation';

class ModelAnnotation extends Annotation {

    static get annotation() { return 'Model'; }

    static get targets() { return [Annotation.CONSTRUCTOR]; }

    apply(app, config, instance) {
        let modelFilePath = path.resolve(config.path.models, this.value);
        let Model = require(modelFilePath);
        let model = new Model(app, config);
        instance.models = instance.models || {};
        instance.models[model.id] = model;
    }
}
module.exports = ModelAnnotation;