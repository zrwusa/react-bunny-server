import {restFulAPI} from "../helpers/restful-api.js"
import unless from "koa-unless";
import {BLStatuses} from "../helpers/business-logic.js";
import {verifyAccessToken} from "../controllers/auth/controller.js";

export const jwtAuth = () => {
    const auth = async (ctx, next) => {
        const {request} = ctx
        if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            restFulAPI.Unauthorized(ctx, BLStatuses.ACCESS_TOKEN_NOT_PROVIDED);
        }
        const verifyTokenResult = verifyAccessToken(request.headers.authorization.split(' ')[1]);
        const {success, code, message} = verifyTokenResult;
        if (!success) {
            // switch (code) {
            //     case 'TokenExpiredError':
            //         restFulAPI.kick403(ctx, BLStatuses.ACCESS_TOKEN_EXPIRED);
            //         break;
            //     case 'JsonWebTokenError':
            //         restFulAPI.kick403(ctx, message)
            //         break;
            //     case 'NotBeforeError':
            //         restFulAPI.kick403(ctx, message)
            //         break;
            //     default:
            //         restFulAPI.kick403(ctx, message)
            //         break;
            // }
            restFulAPI.kick403(ctx, message)
        }
        await next()
    }
    auth.unless = unless
    return auth;
}
