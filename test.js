const should = require('should');
const MemCached = require('./index');

const memcached = new MemCached('127.0.0.1:11211', null, console, true);

describe('memcached', () => {
    describe('.touch()', () => {
        it('should touch success', (done) => {
            memcached.touch('co-memcached-plus:test:key', 60)
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });
    describe('.get()', () => {
        it('should get success', (done) => {
            memcached.get('co-memcached-plus:test:key')
                .then((ret) => {
                    should(ret).be.exactly(undefined);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.gets()', () => {
        it('should gets success', (done) => {
            memcached.gets('co-memcached-plus:test:key')
                .then((ret) => {
                    should(ret).be.an.Object();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.getMulti()', () => {
        it('should getMulti success', (done) => {
            memcached.getMulti(['co-memcached-plus:test:key'])
                .then((ret) => {
                    should(ret).be.an.Object();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.set()', () => {
        it('should set success', (done) => {
            memcached.set('co-memcached-plus:test:key', 'co-memcached-plus:test:value', 60)
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.replace()', () => {
        it('should replace success', (done) => {
            memcached.replace('co-memcached-plus:test:key', 'co-memcached-plus:test:value', 60)
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.add()', () => {
        it('should add success', (done) => {
            memcached.add('co-memcached-plus:test:key:num', 0, 60)
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.cas()', () => {
        it('should cas success', (done) => {
            memcached.cas('co-memcached-plus:test:key', 'co-memcached-plus:test:value', 60, 'co-memcached-plus:test:cas')
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.append()', () => {
        it('should append success', (done) => {
            memcached.append('co-memcached-plus:test:key', 'co-memcached-plus:test:value')
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.prepend()', () => {
        it('should prepend success', (done) => {
            memcached.prepend('co-memcached-plus:test:key', 'co-memcached-plus:test:value')
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.incr()', () => {
        it('should incr success', (done) => {
            memcached.incr('co-memcached-plus:test:key:num', 1)
                .then((ret) => {
                    should(ret).be.exactly(1);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.decr()', () => {
        it('should decr success', (done) => {
            memcached.decr('co-memcached-plus:test:key:num', 1)
                .then((ret) => {
                    should(ret).be.exactly(0);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.del()', () => {
        it('should del success', (done) => {
            memcached.del('co-memcached-plus:test:key')
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.version()', () => {
        it('should version success', (done) => {
            memcached.version()
                .then((ret) => {
                    should(ret).be.a.String();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.flush()', () => {
        it('should flush success', (done) => {
            memcached.flush()
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.stats()', () => {
        it('should stats success', (done) => {
            memcached.stats()
                .then((ret) => {
                    should(ret).be.an.Object();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.settings()', () => {
        it('should settings success', (done) => {
            memcached.settings()
                .then((ret) => {
                    should(ret).be.an.Object();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.slabs()', () => {
        it('should slabs success', (done) => {
            memcached.slabs()
                .then((ret) => {
                    should(ret).be.an.Object();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.items()', () => {
        it('should items success', (done) => {
            memcached.items()
                .then((ret) => {
                    should(ret).be.an.Object();

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.cachedump()', () => {
        it('should cachedump success', (done) => {
            memcached.cachedump(memcached, 'test', 1)
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });

    describe('.end()', () => {
        it('should end success', (done) => {
            memcached.end()
                .then((ret) => {
                    should(ret).be.exactly(true);

                    return done();
                })
                .catch((err) => {
                    return done(err);
                });
        });
    });
});