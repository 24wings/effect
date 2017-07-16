"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const staticServer = require("koa-static");
const Router = require("koa-router");
const fs = require("fs");
const index_1 = require("./nunjucks/index");
class Application {
    constructor(initConfig) {
        this.initConfig = initConfig;
        this.config = { port: 3000, routesDir: '' };
        this.app = new koa();
        this.routes = {};
        //　合并配置
        Object.assign(this.config, initConfig);
    }
    /**
     *
     * 启动应用程序
     */
    start(config) {
        var config = Object.assign(this.config, config);
        return this.app.listen(config.port, () => {
            console.log(`yet running on ${config.port}`);
        });
    }
    staticDirs(dirs) {
        for (var dir of dirs) {
            this.app.use(staticServer(dir));
        }
        return this;
    }
    loadRoute(routeDir) {
        var files = fs.readdirSync(routeDir);
        let routes = [];
        files.forEach(file => {
            let aboPath = routeDir + '/' + file;
            let state = fs.lstatSync(aboPath);
            if (state.isFile()) {
                var pureFilename = file.split('.')[0];
                var routePath = '../route/' + pureFilename;
                // console.log(routePath);
                this.routes[pureFilename] = require(routePath);
            }
        });
        ;
        return this;
    }
    do(routes) {
        // console.log(this.routes);
        var router = new Router();
        // 
        for (var action of routes) {
            let middlewares = action.middlewares;
            let manyDo = [];
            for (var i = 0; i < middlewares.length; i++) {
                let [filename, middleware] = middlewares[i].split('.');
                manyDo.push(this.routes[filename][middleware]);
            }
            // console.log(manyDo)
            router[action.method](action.path, ...manyDo);
        }
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
        // Templating - Must be used before any router
        return this;
    }
    njk(viewPath, viewOption) {
        //路由
        this.app.use(index_1.njk(viewPath, viewOption));
        return this;
    }
}
exports.Application = Application;
