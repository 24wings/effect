"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yet = require("./lib");
// freely flowing 行云流水
const path = require("path");
var app = new yet.Application()
    .staticDirs([path.resolve(__dirname, '../public')])
    .loadRoute(__dirname + '/route')
    .njk()
    .do([
    { method: 'use', path: '/', middlewares: ['common.log'] },
    { method: 'get', path: '/', middlewares: ['home.index'] },
    { method: 'get', path: '/user', middlewares: ['common.checkUserLogin', 'user.home'] }
])
    .start({
    port: 4000,
});
