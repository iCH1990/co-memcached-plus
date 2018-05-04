const Bluebird = require('bluebird');
const genericPool = require('generic-pool');
const MemCached = require('memcached');

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
     * @param opts {object}
     * @param options {object}
     * @param logger {object}
     * @param debug {boolean}
     *
     * @return {object}
     */
    constructor(serverLocation, opts = {max: 10, min: 1}, options = {idle: 0}, logger = defaultLogger, debug = false) {
        logDebug = debug;

        const factory = {
            create: function () {
                return new Promise(function (resolve) {
                    let memcached = new MemCached(serverLocation, options);

                    memcached.on('failure', function (details) {
                        logger.log('error', `Server ${details.server} went down due to:${details.messages.join('')}`);
                    });

                    memcached.on('reconnecting', function (details) {
                        logger.log('debug', `Total downtime caused by server ${details.server} :${details.totalDownTime} ms`);
                    });

                    logger.log('debug', 'connect to memcached server:', serverLocation);

                    return resolve(memcached);
                })
            },
            destroy: function (client) {
                return new Promise(function (resolve) {
                    client.end();

                    return resolve();
                })
            }
        };

        this.pool = genericPool.createPool(factory, opts);
    }

    /**
     * @description touch
     *
     * @param key {string}
     * @param lifetime {number}
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<boolean, Error>}
     */
    touch(key, lifetime, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.touch()', key, lifetime, timeout);

            this.pool.acquire().then((client) => {
                client.touchAsync(key, lifetime)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.touch() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.touch() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description get
     *
     * @param key {string}
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    get(key, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.get()', key, timeout);

            this.pool.acquire().then((client) => {
                client.getAsync(key)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.get() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.get() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description gets
     *
     * @param key {string}
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<object, Error>}
     */
    gets(key, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.gets()', key, timeout);

            this.pool.acquire().then((client) => {
                client.getsAsync(key)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.gets() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.gets() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description getMulti
     *
     * @param keys {array}
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<Array.<*>, Error>}
     */
    getMulti(keys, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.getMulti()', keys, timeout);

            this.pool.acquire().then((client) => {
                client.getMultiAsync(keys)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.getMulti() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.getMulti() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<boolean, Error>}
     */
    set(key, value, lifetime, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.set()', key, value, lifetime, timeout);

            this.pool.acquire().then((client) => {
                client.setAsync(key, value, lifetime)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.set() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.set() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    replace(key, value, lifetime, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.replace()', key, value, lifetime, timeout);

            this.pool.acquire().then((client) => {
                client.replaceAsync(key, value, lifetime)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.replace() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.replace() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    add(key, value, lifetime, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.add()', key, value, lifetime, timeout);

            this.pool.acquire().then((client) => {
                client.addAsync(key, value, lifetime)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.add() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.add() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    cas(key, value, lifetime, cas, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.cas()', key, value, lifetime, cas, timeout);

            this.pool.acquire().then((client) => {
                client.casAsync(key, value, lifetime, cas)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.cas() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.cas() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    append(key, value, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.append()', key, value, timeout);

            this.pool.acquire().then((client) => {
                client.appendAsync(key, value)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.append() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.append() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    prepend(key, value, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.prepend()', key, value, timeout);

            this.pool.acquire().then((client) => {
                client.prependAsync(key, value)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.prepend() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.prepend() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    incr(key, amount, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.incr()', key, amount, timeout);

            this.pool.acquire().then((client) => {
                client.incrAsync(key, amount)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.incr() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.incr() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    decr(key, amount, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.decr()', key, amount, timeout);

            this.pool.acquire().then((client) => {
                client.decrAsync(key, amount)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.decr() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.decr() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description del
     *
     * @param key {string}
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    del(key, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.del()', key, timeout);

            this.pool.acquire().then((client) => {
                client.delAsync(key)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.del() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.del() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description version
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    version(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.version()', timeout);

            this.pool.acquire().then((client) => {
                client.versionAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.version() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.version() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description flush
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    flush(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.flush()', timeout);

            this.pool.acquire().then((client) => {
                client.flushAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.flush() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.flush() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description stats
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    stats(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.stats()', timeout);

            this.pool.acquire().then((client) => {
                client.statsAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.stats() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.stats() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description settings
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    settings(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.settings()', timeout);

            this.pool.acquire().then((client) => {
                client.settingsAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.settings() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.settings() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description slabs
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    slabs(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.slabs()', timeout);

            this.pool.acquire().then((client) => {
                client.slabsAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.slabs() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.slabs() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description items
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    items(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.items()', timeout);

            this.pool.acquire().then((client) => {
                client.itemsAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.items() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.items() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

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
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    cachedump(server, slabId, number, timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.cachedump()', timeout);

            this.pool.acquire().then((client) => {
                client.cachedumpAsync(server, slabId, number)
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.cachedump() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.cachedump() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }

    /**
     * @description end
     *
     * @param timeout {number} default 1000
     * @param logger {object}
     *
     * @return {Promise<*, Error>}
     */
    end(timeout = 1000, logger = defaultLogger) {
        return new Promise((resolve, reject) => {
            logger.log('debug', 'memcached.end()', timeout);

            this.pool.acquire().then((client) => {
                client.endAsync()
                    .timeout(timeout)
                    .then((ret) => {
                        logger.log('debug', 'memcached.end() return:', ret);

                        return resolve(ret);
                    })
                    .catch((err) => {
                        logger.log('error', 'memcached.end() error:', err);

                        return reject(err);
                    })
                    .finally(() => {
                        this.pool.release(client);
                    });
            }).catch((err) => {
                logger.log('error', 'get instance error:', err);

                return reject(err);
            });
        });
    }
}

module.exports = CoMemCachedPlus;