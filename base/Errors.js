/*
 * File: Errors.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


 const http = require('http');
const Log = require('./Log');
const TAG = 'Errors';

class Errors {

    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.app.context.onerror = this.onerror();
    }

    onerror() {
        let self = this;
        return function (err) {
            // don't do anything if there is no error.
            // this allows you to pass `this.onerror`
            // to node-style callbacks.
            if (err == null) return;

            // wrap non-error object
            if (!(err instanceof Error)) {
                const newError = new Error('non-error thrown: ' + err);
                // err maybe an object, try to copy the name, message and stack to the new error instance
                if (err) {
                    if (err.type) newError.type = err.type;
                    if (err.name) newError.name = err.name;
                    if (err.message) newError.message = err.message;
                    if (err.stack) newError.stack = err.stack;
                    if (err.status) newError.status = err.status;
                    if (err.headers) newError.headers = err.headers;
                }
                err = newError;
            }

            const headerSent = this.headerSent || !this.writable;
            if (headerSent) err.headerSent = true;

            // delegate
            this.app.emit('error', err, this);

            // nothing we can do here other
            // than delegate to the app-level
            // handler and log.
            if (headerSent) return;

            // ENOENT support
            if (err.code === 'ENOENT') err.status = 404;

            if (typeof err.status !== 'number' || !http.STATUS_CODES[err.status]) {
                err.status = 500;
            }
            this.status = err.status;

            this.set(err.headers);
            err.type = err.type || self.config.defaultErrorType || 'text';

            self[err.type].call(self, err, this);

            if (err.type === 'json') {
                this.body = JSON.stringify(this.body);
            }

            this.res.end(this.body);
        }
    }

    get isDev() {
        return this.config.env !== 'prod';
    }

    text(err, ctx) {
        // unset all headers, and set those specified
        ctx.res._headers = {};
        ctx.set(err.headers);

        ctx.body = (this.isDev || err.expose) && err.message
            ? err.message
            : http.STATUS_CODES[this.status];
    }

    json(err, ctx) {
        const message = (this.isDev || err.expose) && err.message
            ? err.message
            : http.STATUS_CODES[this.status];

        ctx.body = { error: message, status: err.status };
    }

    html(err, ctx) {
        ctx.body = defaultTemplate
            .replace('{{status}}', err.status)
            .replace('{{stack}}', err.stack);
        ctx.type = 'html';
    }
}

module.exports = Errors;