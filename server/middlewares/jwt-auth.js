const {restFulAPI} = require('../restful-api');
const jwt = require('jsonwebtoken')

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
        console.log('---authMiddleware')
        const {request} = ctx
        if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            restFulAPI.Unauthorized(ctx, 'Access token not provided');
        }
        try {
            let verifyTokenResult;
            verifyTokenResult = verifyToken(request.headers.authorization.split(' ')[1]);

            if (verifyTokenResult instanceof Error) {
                restFulAPI.Unauthorized(ctx, 'Error in authorization format,may access token expired');
            }
            console.log('---auth await next')
            await next()
        } catch (err) {
            // ctx.throw(401, 'Error access_token is revoked', {originalError: err});
            restFulAPI.Unauthorized(ctx, 'Error access_token is revoked', {originalError: err.toString()});
        }
    }
    auth.unless = require('koa-unless');
    return auth;
}
module.exports = {jwtAuth,createToken,verifyToken}
