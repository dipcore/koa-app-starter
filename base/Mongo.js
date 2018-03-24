/*
 * File: Mongo.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const Log = require('base/Log');
const Errors = require('base/Errors');

const TAG = 'Mongo';

const defaultOptions = {
    host: 'localhost',
    port: 27017,
    db: 'test',
    max: 100,
    min: 1
};

class Mongo {

    constructor(options) {
        this.options = options = Object.assign({}, defaultOptions, options);
        this.mongoUrl = options.uri || options.url;
        if (!this.mongoUrl) {
            if (options.user && options.pass) {
                this.mongoUrl = `mongodb://${options.user}:${options.pass}@${options.host}:${options.port}/${options.db}`;
            } else {
                this.mongoUrl = `mongodb://${options.host}:${options.port}/${options.db}`;
            }
        }
    }

    async connect() {
        try {
            Log.i(TAG, 'Acquire db connection');
            return this.client = await MongoClient.connect(this.mongoUrl);            
        } catch (e) {
			Log.e(TAG, "Error connecting to db: ", this.mongoUrl);
			Log.e(TAG, e.message);
            Log.e(TAG, e.stack);
            Errors.throwGenericJsonError();
        }
    }

    async close() {
        await this.client.close();
        Log.i(TAG, 'Relese db connection');
    }

}
module.exports = Mongo;