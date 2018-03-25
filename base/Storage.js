const HashMap = require('hashmap');

class Storage {

    constructor() {
        this.map = new HashMap();
    }

    set(...args) {
        let value = args.pop();
        let key = args;
        return this.map.set(key, value);
    }

    get(...args) {
        return this.map.get(args);
    }

}
module.exports = Storage;