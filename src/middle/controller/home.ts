import koa = require('koa');

export ={
    index: async (ctx: koa.Context, next) => {
        await ctx.render('user/index', {
            title: 'title',
            name: 'Jay'
        });
    }
}