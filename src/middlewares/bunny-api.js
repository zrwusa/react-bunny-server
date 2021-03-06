import {restFulAPI} from "../helpers/restful-api.js"
import {bunnyAPI} from "../helpers/api-protocol.js"

export const bunnyAPIMiddleware = () => {
    return async (ctx, next) => {
        const created_at = new Date().getTime();
        try {
            await next();
            // todo 204,205 koa does not allow to modify the ctx.body
            if (ctx.status === 204 && ctx.body === undefined) {
                console.log('---ctx.status === 204 && ctx.body === undefined')
            }
            // catch 404 and forward to error handler
            if (ctx.status === 404) {
                restFulAPI.kick404(ctx)
            } else {
                let body = bunnyAPI.constructSuccessBody(ctx, ctx.status, ctx.body);
                body.time_spend = new Date().getTime() - created_at;
                ctx.body = body;
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            console.log('---err',err)
            let body = bunnyAPI.constructErrorBody(ctx, ctx.status, err.message, err.des, err.stack);
            body.time_spend = new Date().getTime() - created_at;
            ctx.body = body;
            // emit error to koa
            ctx.app.emit('error', err, ctx);
        }
    }
}
