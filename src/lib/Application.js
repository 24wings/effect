"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa = require("koa");
const staticServer = require("koa-static");
const path = require("path");
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
    njk() {
        //路由
        this.app.use(index_1.njk(path.resolve(__dirname, '../view'), {
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
        }));
        return this;
    }
}
exports.Application = Application;
