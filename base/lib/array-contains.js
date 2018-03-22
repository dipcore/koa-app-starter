// Check if longArray contains content of shortArray in 
module.exports = function(longArray, shortArray) {
    return shortArray.every(elem => longArray.indexOf(elem) > -1);
}