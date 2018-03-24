/*
 * File: Throw.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */


class Throw {

    static genericJson() {
        this.json(500, 'Unknown error');
    }

    /**
     * Throw custom type error
     * 
     * @static
     * @param {number} status 
     * @param {string} message 
     * @param {string} type 
     * @memberof Throw
     */
    static error(status, message, type) {
        let error = new Error(message);
        error.type = type;
        error.status = status;
        throw error;
    }

    /**
     * Throw json error
     * 
     * @static
     * @param {number} status 
     * @param {string} message 
     * @memberof Throw
     */
    static json(status, message) {
        this.error(status, message, 'json');
    }

    /**
     * Throw text error
     * 
     * @static
     * @param {number} status 
     * @param {string} message 
     * @memberof Throw
     */
    static text(status, message) {
        this.error(status, message, 'text');
    }

    /**
     * Throw html error
     * 
     * @static
     * @param {number} status 
     * @param {string} message 
     * @memberof Throw
     */
    static html(status, message) {
        this.error(status, message, 'html');
    }

    static html404() {
        let error = new Error();
        error.type = 'html';
        error.status = 404;
        throw error;
    }

    static html500() {
        let error = new Error();
        error.type = 'html';
        error.status = 500;
        throw error;
    }

}

module.exports = Throw;