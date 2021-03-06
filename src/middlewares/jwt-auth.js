import unless from "koa-unless";
import {BLStatuses} from "../helpers/business-logic.js";
import {verifyAccessToken} from "../controllers/auth/controller.js";

export const jwtAuth = () => {
    const auth = async (ctx, next) => {
        const {request} = ctx
        if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            ctx.throw(401, BLStatuses.ACCESS_TOKEN_NOT_PROVIDED);
        }
        const {success, code} = verifyAccessToken(request.headers.authorization.split(' ')[1]);
        if (!success) {
            switch (code) {
                case 'TokenExpiredError':
                    ctx.throw(401, BLStatuses.ACCESS_TOKEN_EXPIRED);
                    break;
                case 'JsonWebTokenError':
                    ctx.throw(401, BLStatuses.ACCESS_TOKEN_MALFORMED)
                    break;
                case 'NotBeforeError':
                    ctx.throw(401, BLStatuses.ACCESS_TOKEN_NOT_BEFORE)
                    break;
                default:
                    ctx.throw(401, BLStatuses.ACCESS_TOKEN_VERIFY_UNKNOWN)
                    break;
            }
        }
        await next()
    }
    auth.unless = unless
    return auth;
}
