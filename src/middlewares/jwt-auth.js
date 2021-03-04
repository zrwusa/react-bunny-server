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
        try {
            let verifyTokenResult;
            verifyTokenResult = verifyAccessToken(request.headers.authorization.split(' ')[1]);
            if (verifyTokenResult instanceof Error) {
                restFulAPI.kick403(ctx, BLStatuses.AUTH_FORMAT_ERROR_ACCESS_TOKEN);
            } else {
                await next()
            }
        } catch (err) {
            if (err.message === 'Authorization expired') {
                restFulAPI.kick403(ctx, BLStatuses.AUTH_EXPIRED);
            } else {
                restFulAPI.kick403(ctx, BLStatuses.INAPPROPRIATE_ACCESS_TOKEN, {originalError: err.toString()});
            }
        }
    }
    auth.unless = unless
    return auth;
}
