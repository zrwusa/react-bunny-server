import {restFulAPI} from '../restful-api.js'
import unless from 'koa-unless';
import jwt from 'jsonwebtoken'

const SECRET_KEY = '123456789'
const expiresIn = '1h'

// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

const jwtAuth = () => {
    const auth = async (ctx, next) => {
        const {request} = ctx
        if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            restFulAPI.Unauthorized(ctx, 'Access token not provided');
        }
        try {
            let verifyTokenResult;
            verifyTokenResult = verifyToken(request.headers.authorization.split(' ')[1]);
            if (verifyTokenResult instanceof Error) {
                restFulAPI.Unauthorized(ctx, 'Authorization format error,may access token expired');
            }
        } catch (err) {
            restFulAPI.Unauthorized(ctx, 'Inappropriate access token is revoked', {originalError: err.toString()});
        }
        await next()
    }
    auth.unless = unless
    return auth;
}

export {jwtAuth, createToken, verifyToken}
