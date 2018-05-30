/*
 * File: Session.js
 * Project: ota.dstudio.ca
 * File Created: Tuesday, 29th May 2018 8:24:12 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

const Storage = require('base/Storage');

class Session {
    constructor(app, config) {
        this.app = app;
        this.config = config;
        
        this.opts = config.session;
        this.storage = config.session.storage || new Storage();

        this.apply();
    }

    get name() {
        return 'sid';
    }

    get expName() {
        return this.name + ':exp';
    }

    get extValue() {
        return Date.now() + this.opts.maxAge;
    }

    get id() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 30; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    get cookieOpts() {
        return { 
            signed: this.opts.signed, 
            httpOnly: this.opts.httpOnly,
            overwrite: this.opts.overwrite
        }
    }

    apply() {
        let self = this;
        this.app.use(async (ctx, next) => {

            let sid = ctx.cookies.get(self.name);
            let expDate = ctx.cookies.get(self.expName) || 0;
            let nowDate = Date.now();

            if (!sid || expDate < nowDate) {
                sid && self.storage.remove(sid); // Remove old session data from storage  
                sid = self.id; // Generate new sid
                ctx.cookies.set(self.name, sid, this.cookieOpts);
                ctx.cookies.set(self.expName, this.extValue, this.cookieOpts);
            }

            if (self.opts.renew) {
                // Update session exp. date
                ctx.cookies.set(self.expName, this.extValue, this.cookieOpts);
            }

            ctx.session = self.storage.get(sid) || {};

            await next();

            if (ctx.session === null)
                return self.storage.remove(sid);

            self.storage.set(sid, ctx.session);
        });
    }
}
module.exports = Session;