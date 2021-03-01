import {restFulAPI} from '../restful-api.js'
import unless from 'koa-unless';
import jwt from 'jsonwebtoken'
import {findOneUser} from "../models/user/index.js";

const SECRET_KEY = '123456789'
const expiresIn = '10s'
const REFRESH_TOKEN_SECRET_KEY = '987654321'
const refreshTokenExpiresIn = '30s'

// Create a token from a payload
function createToken(payload) {
    return {
        access_token: jwt.sign(payload, SECRET_KEY, {expiresIn: expiresIn}),
        refresh_token: jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {expiresIn: refreshTokenExpiresIn})
    }
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

function verifyRefreshToken(ctx) {
    const {request} = ctx
    if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
        return {isValid: false, message: 'Refresh token not provided'};
    }
    try {
        let verifyTokenResult;
        const refresh_token = request.headers.authorization.split(' ')[1];
        verifyTokenResult = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
        const user = findOneUser({refresh_token: refresh_token});
        console.log('---verifyRefreshToken result', verifyTokenResult)
        if (verifyTokenResult instanceof Error) {
            return {isValid: false, message: 'Authorization format error,may refresh token expired'};
        }
        return {isValid: true, user}
    } catch (err) {
        return {isValid: false, message: 'Inappropriate refresh token is revoked'};
    }
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
            console.log('---jwtAuth result', JSON.stringify(verifyTokenResult))
            console.log('---verifyTokenResult.name', verifyTokenResult.name)
            if (verifyTokenResult instanceof Error) {
                restFulAPI.kick403(ctx, 'Authorization format error');
            }else{
                await next()
            }
        } catch (err) {
            console.log('---err', JSON.stringify(err))
            if(err.message === 'Authorization expired'){
                restFulAPI.kick403(ctx, 'Authorization expired');
            }else{
                restFulAPI.kick403(ctx, 'Inappropriate access token is revoked', {originalError: err.toString()});
            }
        }
    }
    auth.unless = unless
    return auth;
}

export {jwtAuth, createToken, verifyToken, verifyRefreshToken}
