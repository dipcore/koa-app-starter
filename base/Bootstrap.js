/*
 * File: Bootstrap.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */



const path = require('path');
const glob = require('glob');

const { Registry, Reader } = require('base/lib/annotations');
const Errors = require('base/Errors');
const Log = require('./Log');
const TAG = 'Bootstrap';

class Bootstrap {

    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.instances = new Map();
    }

    getFileList(base) {
        return glob.sync(path.resolve(base, '**', '*.js'), { cwd: this.config.root })
    }

    registerAnnotations() {
        let baseAnnotations = this.getFileList('base/annotations');
        let applicationAnnotations = this.getFileList(this.config.path.annotations);
        this.annotations = [].concat(baseAnnotations).concat(applicationAnnotations);
        this.registry = new Registry();
        for (let i = 0; i < this.annotations.length; i++) {
            this.registry.registerAnnotation(this.annotations[i]);
            Log.i(TAG, `Register annotation: ${this.annotations[i]}`);
        }
    }

    parseAnnotations(folder) {
        let files = this.getFileList(folder);
        for (let i = 0; i < files.length; i++) {
            Log.i(TAG, `Parse annotations: ${files[i]}`);
            let reader = this.parseFileAnnotations(files[i]);
            let instance = this.applyFileAnnotations(reader, files[i]);
        }

    }

    parseFileAnnotations(filePath) {
        let reader = new Reader(this.registry);
        reader.parse(filePath);
        return reader;
    }

    applyFileAnnotations(reader, filePath) {

        let definitionAnnotations = reader.definitionAnnotations;
        let constructorAnnotations = reader.constructorAnnotations;
        let methodAnnotations = reader.methodAnnotations;
        let propertyAnnotations = reader.propertyAnnotations;

        try {
            Log.i(TAG, `Apply annotations: ${filePath}`);
            this.applyAnnotations(definitionAnnotations, filePath);
            this.applyAnnotations(constructorAnnotations, filePath);
            this.applyAnnotations(methodAnnotations, filePath);
            this.applyAnnotations(propertyAnnotations, filePath);
        } catch (e) {
            Log.e(TAG, 'Error applying annotations');
            Log.e(TAG, e.message);
            Log.e(TAG, e.stack);
        }

    }

    applyAnnotations(annotations, filePath) {
        let cl = require(filePath);
        for (let i = 0; i < annotations.length; i++) {
            let annotation = annotations[i];
            if (annotation.apply) {
                if (annotation.constructor.instantiate) {
                    let existingInstance = this.instances.get(filePath);
                    cl = existingInstance ? existingInstance : new cl(this.app, this.config);
                    (!existingInstance) && this.instances.set(filePath, cl);
                }
                annotation.apply(this.app, this.config, cl);
            }
        }
    }

    async run() {

        // Errors
        new Errors(this.app, this.config);

        // Annotations
        this.registerAnnotations();
        this.parseAnnotations(this.config.path.services);
        this.parseAnnotations(this.config.path.models);        
        this.parseAnnotations(this.config.path.controllers);
    }

}
module.exports = Bootstrap;