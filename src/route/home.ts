import koa = require('koa');
var action = {

    index: async (ctx: koa.Context, next) => {
        await ctx.redirect('/user');
    }
}

module.exports = action;
