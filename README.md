# CO Memcached Plus

> Memcached library with additions.

```javascript
const MemCached = require('co-memcached-plus');

let memcached = new MemCached('127.0.0.1:11211', {idle: 0});

memcached.set('testKey', 'testValue', 0, 100)
    .then(function (ret) {
        console.log('ret: ', ret);
    });
```

## Installation

```shell
$ npm install co-memcached-plus
```

## Usage

The same parameters with [memcached](https://www.npmjs.com/package/memcached).
The extended field behind: timeout and logger (default is console);

## Logger

The default logger is:

```
const defaultLogger = {
    log: function (level) {
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
```