import {blInfo, BLStatuses, blSuccess} from "../../helpers/business-logic.js";
import {findOneUser, findUsers, storeUser} from "../user/controller.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = '60409fbbfb8fa21b381cf3a3'
const ACCESS_TOKEN_EXPIRES_IN = '24h'
const REFRESH_TOKEN_SECRET_KEY = 'oT1TDBCO7jtDytecDBmKWW'
const REFRESH_TOKEN_EXPIRES_IN = '30d'

export const createAccessToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES_IN})
}
export const createRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRES_IN})
}

// Verify the token
export const verifyAccessToken = (token) => {
    return jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (decode !== undefined) {
            return blSuccess(decode)
        }
        const {name, message} = err;
        return blInfo(message, name)
    })
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, (err, decode) => {
        if (decode !== undefined) {
            return blSuccess(decode)
        }
        const {name, message} = err;
        return blInfo(message, name)
    })
}

// Register New User
// todo a normal user shouldn’t be able to access information of another user. They also shouldn’t be able to access data of admins.
// todo To enforce the principle of least privilege, we need to add role checks either for a single role, or have more granular roles for each user.
// todo    If we choose to group users into a few roles, then the roles should have the permissions that cover all they need and no more.
//  If we have more granular permissions for each feature that users have access to, then we have to make sure that admins can add and remove those features from each user accordingly.
//  Also, we need to add some preset roles that can be applied to a group users so that we don’t have to do that for every user manually.
export const register = async (ctx) => {
    const {request} = ctx;
    const {email, password} = request.body;
    const exist = await findUsers({email, password});
    if (exist.length > 0) {
        // 409 or 201 or 200 with indicating own status
        // (Gmail (Google) returns a 200 OK and a JSON object containing a code which is indicating that the email is already registered.
        // Facebook is also returning a 200 OK but re-renders the content to a recovery page to give the user the option to recover his/her existing account.
        // Twitter is validating the existing email by an AJAX call To another resource. The response of the email validation resource is always a 200 OK. The response contains a JSON object containing a flag to indicate if the email is already registered or not.
        // Amazon is doing it the same way as Facebook. Returning a 200 OK and re-rendering the content to a notification page to inform the user that the account already exists and provide him/her possibilities to take further actions like login or password change.)
        ctx.throw(409, BLStatuses.USER_EXISTS)
    }
    await storeUser({email, password});
    const tokenInfo = generateTokenInfo(email, password)
    ctx.body = {...tokenInfo, "user": {email}}

}

const generateTokenInfo = (email, password, isOnlyAccessToken) => {
    const accessToken = createAccessToken({email, password})
    const decodedAccessToken = jwt.decode(accessToken)
    const accessTokenIat = decodedAccessToken.iat;
    const accessTokenExp = decodedAccessToken.exp;
    if (isOnlyAccessToken) {
        return {accessToken, accessTokenIat, accessTokenExp}
    }
    const refreshToken = createRefreshToken({email, password})
    const decodedRefreshToken = jwt.decode(refreshToken)
    const refreshTokenIat = decodedRefreshToken.iat;
    const refreshTokenExp = decodedRefreshToken.exp;
    return {accessToken, accessTokenIat, accessTokenExp, refreshToken, refreshTokenIat, refreshTokenExp}
}

export const login = async (ctx) => {
    const {request} = ctx;
    const {email, password} = request.body;
    const exist = await findOneUser({email, password});
    if (!exist) {
        ctx.throw(401, BLStatuses.INCORRECT_EMAIL_OR_PASSWORD)
    }
    const tokenInfo = generateTokenInfo(email, password)
    ctx.body = {...tokenInfo, user: {email}}
}

export const refresh = async (ctx) => {
    const {request} = ctx
    if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
        return blInfo(BLStatuses.REFRESH_TOKEN_NOT_PROVIDED)
    }
    const refreshToken = request.headers.authorization.split(' ')[1];
    const {success, code, data} = verifyRefreshToken(refreshToken)
    if (!success) {
        switch (code) {
            case 'TokenExpiredError':
                ctx.throw(401, BLStatuses.REFRESH_TOKEN_EXPIRED);
                break;
            case 'JsonWebTokenError':
                ctx.throw(401, BLStatuses.REFRESH_TOKEN_MALFORMED)
                break;
            case 'NotBeforeError':
                ctx.throw(401, BLStatuses.REFRESH_TOKEN_NOT_BEFORE)
                break;
            default:
                ctx.throw(401, BLStatuses.REFRESH_TOKEN_VERIFY_UNKNOWN)
                break;
        }
    }
    const {email, password} = data;
    const tokenInfo = generateTokenInfo(email, password, true)

    // const accessToken = createAccessToken({email, password})
    ctx.body = {...tokenInfo, user: {email}}
}
