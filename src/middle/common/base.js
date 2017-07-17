"use strict";
const service = require("../../service");
const bodyParser = require("koa-bodyparser");
module.exports = {
    bodyparser: bodyParser,
    njk: service.njk(service.CONFIG.viewPath, {
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
};
