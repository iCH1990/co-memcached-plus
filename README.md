# CO Memcached Plus

> Memcached library with additions.

```javascript
const MemCached = require('co-memcached-plus');

let memcached = new MemCached('127.0.0.1:11211');

memcached.set('testKey', 'testValue', 0, 100)
    .then(function (ret) {
        console.log('ret: ', ret);
    });
```

## Installation

```shell
$ npm install co-memcached-plus
```

## Instance

- serverLocation `string` the ip and port of the remote server
- opts `object` {max: 10, min: 1}; the pool size of the connection pool
- options `object` {idle: 0}; the same with memcached's options
- logger `object` the logger object
- debug `bool` false; whether record the debug log if you use the default logger

## Usage

The same parameters with [memcached](https://www.npmjs.com/package/memcached).
The extended field behind: timeout and logger (default is below);

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