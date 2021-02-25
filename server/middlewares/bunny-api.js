const {restFulAPI} = require("../restful-api");
const {bunnyAPI} = require('../api-protocol');
const bunnyAPIMiddleware = () => {
    return async (ctx, next) => {
        const created_at = new Date().getTime();
        try {
            console.log('---try before')
            await next();
            console.log('---try after')
            if (ctx.status === 404) {
                restFulAPI.kick404(ctx)
            } else {
                let body = bunnyAPI.constructSuccessBody(ctx, ctx.status, ctx.body);
                body.time_spend = new Date().getTime() - created_at;
                ctx.body = body;
            }
        } catch (err) {
            console.log('---catch err', JSON.stringify(err));
            console.log('---catch err err.statusCode, err.status', err.statusCode, err.status)
            ctx.status = err.statusCode || err.status || 500;
            let body = bunnyAPI.constructErrorBody(ctx, ctx.status, err.message, err.des, err.stack);
            body.time_spend = new Date().getTime() - created_at;
            ctx.body = body;
            // emit error to koa
            ctx.app.emit('error', err, ctx);
        }
    }
}
module.exports = {
    bunnyAPIMiddleware
}
