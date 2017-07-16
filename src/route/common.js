"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    /**
     * 用户认证登录
     */
    checkUserLogin: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.state.user) {
            yield next();
        }
        else {
            ctx.body = 'wellcome';
            yield next();
        }
    }),
    log: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        let start = new Date().getTime();
        yield next();
        ctx.set('x-response-time', new Date().getTime() - start + 'ms');
    })
};
