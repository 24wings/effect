import * as yet from './lib';


// freely flowing 行云流水
import path = require('path');


var app = new yet.Application()
    .staticDirs([path.resolve(__dirname, '../public')])
    .loadRoute(__dirname + '/route')
    .njk(path.resolve(__dirname, '../view'), {
        extname: '.html',
        noCache: process.env.NODE_ENV !== 'production',
        throwOnUndefined: true,
        filters: {
            json: function (str) {
                return JSON.stringify(str, null, 2);
            },
            upperCase: str => str.toUpperCase(),
        },
        globals: {
            version: 'v3.0.0',
        },
    })
    .do([
        { method: 'use', path: '/', middlewares: ['common.log'] },
        { method: 'get', path: '/', middlewares: ['home.index'] },
        { method: 'get', path: '/user', middlewares: ['common.checkUserLogin', 'user.home'] }
    ])
    .start({
        port: 4000,
    })


