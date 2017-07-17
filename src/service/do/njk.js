"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
function njk(path, opts) {
    const env = nunjucks.configure(path, opts);
    const extname = opts.extname || '';
    const filters = opts.filters || {};
    //console.time('benchmark');
    const f = Object.keys(filters).length;
    let i = 0;
    while (i < f) {
        console.log('addFileter:', Object.keys(filters)[i]);
        env.addFilter(Object.keys(filters)[i], Object.values(filters)[i]);
        i += 1;
    }
    //console.timeEnd('benchmark');
    const globals = opts.globals || {};
    const g = Object.keys(globals).length;
    let j = 0;
    while (j < g) {
        env.addFilter(Object.keys(globals)[j], Object.values(globals)[j]);
        j += 1;
    }
    return (ctx, next) => {
        ctx.render = (view, context = {}) => {
            context = Object.assign({}, ctx.state, context);
            return new Promise((resolve, reject) => {
                env.render(`${view}${extname}`, context, (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    ctx.set('Content-Type', 'text/html; charset=utf-8');
                    ctx.body = res;
                    return resolve();
                });
            });
        };
        return next();
    };
}
exports.njk = njk;
