const Bluebird = require('bluebird');
const MemCached = require('memcached');
const promiseRetry = require('promise-retry');

Bluebird.promisifyAll(MemCached.prototype);

let logDebug = false;

const defaultLogger = {
    log(level) {
        switch (level) {
            case 'debug':
                if (logDebug) {
                    console.log.apply(this, arguments);
                }

                break;
            case 'info' :
                console.info.apply(this, arguments);

                break;
            case 'warn' :
                console.warn.apply(this, arguments);

                break;
            case 'error':
                console.error.apply(this, arguments);

                break;
            default:
                console.log.apply(this, arguments);
        }
    }
};

class CoMemCachedPlus {
    /**
     * @description constructor
     *
     * @param serverLocation {string}
     * @param options {object}
     * @param logger {object}
     * @param debug {boolean}
     *
     * @return {object}
     */
    constructor(serverLocation, options = null, logger = defaultLogger, debug = false) {
        logDebug = debug;

        this.memcached = new MemCached(serverLocation, options);

        this.memcached.on('failure', function (details) {
            logger.log('error', `Server ${details.server} went down due to:${details.messages.join('')}`);
        });

        this.memcached.on('reconnecting', function (details) {
            logger.log('debug', `Total downtime caused by server ${details.server} :${details.totalDownTime} ms`);
        });

        logger.log('debug', 'connect to memcached server:', serverLocation);
    }

    /**
     * @description touch
     *
     * @param key {string}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<boolean, Error>}
     */
    touch(key, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.touch() try ${number} times`, key, lifetime, timeout);

                return self.memcached.touchAsync(key, lifetime).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.touch() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.touch() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description get
     *
     * @param key {string}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    get(key, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.get() try ${number} times`, key, timeout);

                return self.memcached.getAsync(key).catch(retry);
            }, {
                retries,
                minTimeout: timeout * (retries + 1)
            }).then(function (value) {
                logger.log('debug', `memcached.get() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.get() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description gets
     *
     * @param key {string}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<object, Error>}
     */
    gets(key, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.gets() try ${number} times`, key, timeout, retries);

                return self.memcached.getsAsync(key).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.gets() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.gets() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description getMulti
     *
     * @param keys {array}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<Array.<*>, Error>}
     */
    getMulti(keys, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.getMulti() try ${number} times`, keys, timeout, retries);

                return self.memcached.getMultiAsync(keys).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.getMulti() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.getMulti() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description set
     *
     * @param key {string}
     * @param value {*}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<boolean, Error>}
     */
    set(key, value, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.set() try ${number} times`, key, value, lifetime, timeout, retries);

                return self.memcached.setAsync(key, value, lifetime).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.set() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.set() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description replace
     *
     * @param key {string}
     * @param value {*}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    replace(key, value, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.replace() try ${number} times`, key, value, lifetime, timeout, retries);

                return self.memcached.replaceAsync(key, value, lifetime).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.replace() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.replace() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description add
     *
     * @param key {string}
     * @param value {*}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    add(key, value, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.add() try ${number} times`, key, value, lifetime, timeout, retries);

                return self.memcached.addAsync(key, value, lifetime).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.add() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.add() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description cas
     *
     * @param key {string}
     * @param value {*}
     * @param lifetime {number}
     * @param cas {string}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    cas(key, value, lifetime, cas, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.cas() try ${number} times`, key, value, lifetime, cas, timeout, retries);

                return self.memcached.casAsync(key, value, lifetime, cas).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.cas() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.cas() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description append
     *
     * @param key {string}
     * @param value {*}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    append(key, value, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.append() try ${number} times`, key, value, timeout, retries);

                return self.memcached.appendAsync(key, value).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.append() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.append() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description prepend
     *
     * @param key {string}
     * @param value {*}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    prepend(key, value, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.prepend() try ${number} times`, key, value, timeout, retries);

                return self.memcached.prependAsync(key, value).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.prepend() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.prepend() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description incr
     *
     * @param key {string}
     * @param amount {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    incr(key, amount, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.incr() try ${number} times`, key, amount, timeout, retries);

                return self.memcached.incrAsync(key, amount).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.incr() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.incr() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description decr
     *
     * @param key {string}
     * @param amount {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    decr(key, amount, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.decr() try ${number} times`, key, amount, timeout, retries);

                return self.memcached.decrAsync(key, amount).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.decr() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.decr() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description del
     *
     * @param key {string}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    del(key, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.del() try ${number} times`, key, timeout, retries);

                return self.memcached.delAsync(key).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.del() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.del() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description version
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    version(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.version() try ${number} times`, timeout, retries);

                return self.memcached.versionAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.version() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.version() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description flush
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    flush(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.flush() try ${number} times`, timeout, retries);

                return self.memcached.flushAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.flush() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.flush() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description stats
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    stats(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.stats() try ${number} times`, timeout, retries);

                return self.memcached.statsAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.stats() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.stats() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description settings
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    settings(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.settings() try ${number} times`, timeout, retries);

                return self.memcached.settingsAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.settings() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.settings() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description slabs
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    slabs(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.slabs() try ${number} times`, timeout, retries);

                return self.memcached.slabsAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.slabs() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.slabs() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description items
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    items(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.items() try ${number} times`, timeout, retries);

                return self.memcached.itemsAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.items() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.items() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description cachedump
     *
     * @param server {object}
     * @param slabId {string}
     * @param number {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    cachedump(server, slabId, number, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.cachedump() try ${number} times`, timeout, retries);

                return self.memcached.cachedumpAsync(server, slabId, number).catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.cachedump() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.cachedump() error:`, err);

                return reject(err);
            });
        });
    }

    /**
     * @description end
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    end(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        return new Promise(function (resolve, reject) {
            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.end() try ${number} times`, timeout, retries);

                return self.memcached.endAsync().catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                logger.log('debug', `memcached.end() return:`, value);

                return resolve(value);
            }, function (err) {
                logger.log('error', `memcached.end() error:`, err);

                return reject(err);
            });
        });
    }
}

module.exports = CoMemCachedPlus;