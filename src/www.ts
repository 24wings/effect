import Promise = require('bluebird');
global.Promise = Promise;
import service = require('./service');
import middle = require('./middle');
import session = require('koa-session');
import koa = require('koa');
import path = require('path');
import staticServer = require('koa-static');
import Router = require('koa-router');



// 应用的路由
var router = new Router();
router.get('/', middle.controller.home.index)



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
    })



