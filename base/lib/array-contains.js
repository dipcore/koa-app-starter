/*
 * File: array-contains.js
 * Project: koa-app-starter
 * File Created: Thursday, 22nd March 2018 2:15:30 pm
 * Author: Denys Petrovnin (dipcore@gmail.com)
 * -----
 * MIT License http://www.opensource.org/licenses/MIT
 */

// Check if longArray contains content of shortArray in 
module.exports = function(longArray, shortArray) {
    return shortArray.every(elem => longArray.indexOf(elem) > -1);
}