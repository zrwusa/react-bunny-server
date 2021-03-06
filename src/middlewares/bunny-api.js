import {HttpStatus} from "../helpers/restful-api.js";

const bunnyAPIConfig = {
    successData: "`${data}`",
    httpExtra: {
        code: "`${(status}`' : ''",
        message: "HttpStatus[`${(status}`.toString()].phrase || '' : ''",
        description: "HttpStatus[`${(status}`.toString()].description || '' : ''",
        errorCode: '',
        errorMessage: '',
        errorDescription: '',
        errorStack: '',
    },
    businessLogic: {
        code: "'B' + `${(status}`",
        message: "`${(message}` || ''",
        description: "`${(message}` || ''",
        errorCode: '',
        errorMessage: '',
        errorDescription: '',
        errorStack: '',
    }
}

export const bunnyAPI = {
    constructSuccessBody: (ctx, status, data, timeSpent) => {
        return {
            timeSpent,
            successData: data,
            httpExtra: {
                code: status || '',
                message: HttpStatus[status.toString()].phrase || '',
                description: HttpStatus[status.toString()].description || '',
                errorCode: '',
                errorMessage: '',
                errorDescription: '',
                errorStack: '',
            },
            businessLogic: {
                code: 'BL_BUNNY_DEFAULT_AS_HTTP_' + status || '',
                message: '',
                description: '',
                errorCode: '',
                errorMessage: '',
                errorDescription: '',
                errorStack: '',
            }
        };
    },
    constructErrorBody: (ctx, status, error, timeSpent) => {
        const {message, code, errorDes, errorStack} = error;
        return {
            timeSpent,
            successData: null,
            httpExtra: {
                code: '',
                message: '',
                description: '',
                errorCode: status || '',
                errorMessage: HttpStatus[status.toString()].phrase || '',
                errorDescription: HttpStatus[status.toString()].description || '',
                errorStack: '',
            },
            businessLogic: {
                code: '',
                message: '',
                description: '',
                errorCode: code || 'B' + status || '',
                errorMessage: message || '',
                errorDescription: errorDes || '',
                errorStack: errorStack || '',
            }
        }
    }
}
export const bunnyAPIMiddleware = () => {
    return async (ctx, next) => {
        const startTime = new Date().getTime();
        try {
            await next();
            // todo 204,205 koa does not allow to modify the ctx.body
            if (ctx.status === 204 && ctx.body === undefined) {
                console.log('---ctx.status === 204 && ctx.body === undefined')
            }
            // catch 404 and forward to error handler
            if (ctx.status === 404) {
                ctx.throw(404)
            } else {
                ctx.body = bunnyAPI.constructSuccessBody(ctx, ctx.status, ctx.body, new Date().getTime() - startTime);
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = bunnyAPI.constructErrorBody(ctx, ctx.status, err, new Date().getTime() - startTime);
            // emit error to koa
            ctx.app.emit('error', err, ctx);
        }
    }
}
