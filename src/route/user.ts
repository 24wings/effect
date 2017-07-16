import koa = require('koa');


module.exports = {
    home: async (ctx: koa.Context, next) => {
        await ctx.render('user/index', { title: '个人空间', name: 'swog' });
    }
}