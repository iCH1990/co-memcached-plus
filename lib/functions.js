const Bluebird = require('bluebird');
const MemCached = require('memcached');
const promiseRetry = require('promise-retry');

Bluebird.promisifyAll(MemCached.prototype);

const defaultLogger = {
    log(level) {
        switch (level) {
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
     *
     * @return {object}
     */
    constructor(serverLocation, options = null, logger = defaultLogger) {
        if (options) {
            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    MemCached.config[key] = options[key];
                }
            }
        }

        this.memcached = new MemCached(serverLocation);

        this.memcached.on('failure', function (details) {
            logger.log('error', `Server ${details.server} went down due to: ${details.messages.join('')}`);
        });

        this.memcached.on('reconnecting', function (details) {
            logger.log('debug', `Total downtime caused by server ${details.server} : ${details.totalDownTime} ms`);
        });

        logger.log('debug', `connect to memcached server: ${serverLocation}`);
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
     * @return {Promise<*, Error>}
     */
    touch(key, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.touch() try ${number} times`, key, lifetime, timeout);

            return this.memcached.touchAsync(key, lifetime)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.get() try ${number} times`, key, timeout);

            return self.memcached.getAsync(key)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout * (retry + 1)
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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
     * @return {Promise<*, Error>}
     */
    gets(key, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.gets() try ${number} times`, key, timeout, retries);

            return self.memcached.getsAsync(key)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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
     * @return {Promise<*, Error>}
     */
    getMulti(keys, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.getMulti() try ${number} times`, keys, timeout, retries);

            return self.memcached.getMultiAsync(keys)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }

    /**
     * @description set
     *
     * @param key {string}
     * @param value {*, Error}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    set(key, value, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        return new Promise(function (resolve, reject) {
            let self = this;

            promiseRetry(function (retry, number) {
                logger.log('debug', `memcached.set() try ${number} times`, key, value, lifetime, timeout, retries);

                return self.memcached.setAsync(key, value, lifetime)
                    .timeout(timeout)
                    .catch(retry);
            }, {
                retries,
                minTimeout: timeout
            }).then(function (value) {
                return resolve(value);
            }, function (err) {
                return reject(err);
            });
        });
    }

    /**
     * @description replace
     *
     * @param key {string}
     * @param value {*, Error}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    replace(key, value, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.replace() try ${number} times`, key, value, lifetime, timeout, retries);

            return self.memcached.replaceAsync(key, value, lifetime)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }

    /**
     * @description add
     *
     * @param key {string}
     * @param value {*, Error}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    add(key, value, lifetime, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.add() try ${number} times`, key, value, lifetime, timeout, retries);

            return self.memcached.addAsync(key, value, lifetime)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }

    /**
     * @description cas
     *
     * @param key {string}
     * @param value {*, Error}
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.cas() try ${number} times`, key, value, lifetime, cas, timeout, retries);

            return self.memcached.casAsync(key, value, lifetime, cas)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }

    /**
     * @description append
     *
     * @param key {string}
     * @param value {*, Error}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    append(key, value, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.append() try ${number} times`, key, value, timeout, retries);

            return self.memcached.appendAsync(key, value)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }

    /**
     * @description prepend
     *
     * @param key {string}
     * @param value {*, Error}
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    prepend(key, value, timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.prepend() try ${number} times`, key, value, timeout, retries);

            return self.memcached.prependAsync(key, value)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.incr() try ${number} times`, key, amount, timeout, retries);

            return self.memcached.incrAsync(key, amount)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.decr() try ${number} times`, key, amount, timeout, retries);

            return self.memcached.decrAsync(key, amount)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.del() try ${number} times`, key, timeout, retries);

            return self.memcached.delAsync(key)
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.version() try ${number} times`, timeout, retries);

            return self.memcached.versionAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.flush() try ${number} times`, timeout, retries);

            return self.memcached.flushAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.stats() try ${number} times`, timeout, retries);

            return self.memcached.statsAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.settings() try ${number} times`, timeout, retries);

            return self.memcached.settingsAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.slabs() try ${number} times`, timeout, retries);

            return self.memcached.slabsAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.items() try ${number} times`, timeout, retries);

            return self.memcached.itemsAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }

    /**
     * @description cachedump
     *
     * @param timeout {number} default 1000
     * @param retries {number} default 0
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    cachedump(timeout = 1000, retries = 0, logger = defaultLogger) {
        let self = this;

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.cachedump() try ${number} times`, timeout, retries);

            return self.memcached.cachedumpAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
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

        promiseRetry(function (retry, number) {
            logger.log('debug', `memcached.end() try ${number} times`, timeout, retries);

            return self.memcached.endAsync()
                .timeout(timeout)
                .catch(retry);
        }, {
            retries,
            minTimeout: timeout
        }).then(function (value) {
            return Promise.resolve(value);
        }, function (err) {
            return Promise.reject(err);
        });
    }
}

module.exports = CoMemCachedPlus;