"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
global.Promise = Promise;
const service = require("./service");
const middle = require("./middle");
const session = require("koa-session");
const koa = require("koa");
const path = require("path");
const staticServer = require("koa-static");
const Router = require("koa-router");
// 应用的路由
var router = new Router();
router.get('/', middle.controller.home.index);
// freely flowing 行云流水
var app = new koa();
app.use(staticServer(path.resolve(__dirname, '../public')))
    .use(session(app))
    .use(middle.common.base.bodyparser())
    .use(middle.common.base.njk)
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(service.CONFIG.port, () => {
    console.log(`server is running on   ${service.CONFIG.port}`);
});
