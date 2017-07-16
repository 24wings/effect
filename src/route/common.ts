import koa = require('koa');
module.exports = {
    /**
     * 用户认证登录
     */
    checkUserLogin: async (ctx: koa.Context, next) => {
        if (ctx.state.user) {
            await next();
        } else {
            ctx.body = 'wellcome'
            await next();
        }
    },

    log: async (ctx: koa.Context, next) => {
        let start = new Date().getTime();
        await next();
        ctx.set('x-response-time', new Date().getTime() - start + 'ms');
    }
}