import koa = require('koa');
import staticServer = require('koa-static');
import path = require('path');
import Router = require('koa-router');
import fs = require('fs');
import views = require('koa-views');
import { njk } from './nunjucks/index';
// 


export interface ApplicationConfig {
    port?: number;
    staticDirs?: string[] | { path: string, dir: string }[];
    routesDir?: string;
    route?: { method: 'use' | 'get' | 'post' | 'delete' | 'put', path: string, middlewares: string[] }[]
}

export class Application {

    config: ApplicationConfig = { port: 3000, routesDir: '' }
    app: koa = new koa();
    routes = {};
    /**
     * 
     * 启动应用程序
     */
    start(config?: ApplicationConfig) {
        var config = Object.assign(this.config, config);
        return this.app.listen(config.port, () => {
            console.log(`yet running on ${config.port}`)
        });

    }
    staticDirs(dirs: string[]) {
        for (var dir of dirs) {
            this.app.use(staticServer(dir))
        }
        return this;

    }

    loadRoute(routeDir: string) {
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
        });;
        return this;
    }

    do(routes: { method: string, path: string, middlewares: string[] }[]) {
        // console.log(this.routes);
        var router = new Router();
        // 
        for (var action of routes) {
            let middlewares = action.middlewares;
            let manyDo: Router.IMiddleware[] = [];
            for (var i = 0; i < middlewares.length; i++) {
                let [filename, middleware] = middlewares[i].split('.');
                manyDo.push(this.routes[filename][middleware])
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
        this.app.use(njk(path.resolve(__dirname, '../../view'), {
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

    constructor(public initConfig?: ApplicationConfig) {
        //　合并配置
        Object.assign(this.config, initConfig);
    }

}





export type app = Application