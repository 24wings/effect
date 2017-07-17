"use strict";
const path = require("path");
module.exports = {
    port: 3000,
    viewPath: path.resolve(__dirname, '../../view'),
    session: {
        key: 'koa:sess',
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        // overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true,
        signed: true,
        rolling: false,
        valid: true
    }
};
