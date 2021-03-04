import {restFulAPI} from "../../helpers/restful-api.js";
import {blInfo, BLStatuses, blSuccess} from "../../helpers/business-logic.js";
import {findOneUser, findUsers, storeUser, storeUserRefreshToken} from "../user/controller.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = '60409fbbfb8fa21b381cf3a3'
const ACCESS_TOKEN_EXPIRES_IN = '1s'
const REFRESH_TOKEN_SECRET_KEY = 'oT1TDBCO7jtDytecDBmKWW'
const REFRESH_TOKEN_EXPIRES_IN = '1h'

export const createAccessToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, {expiresIn: ACCESS_TOKEN_EXPIRES_IN})
}
export const createRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {expiresIn: REFRESH_TOKEN_EXPIRES_IN})
}

// Verify the token
export const verifyAccessToken = (token) => {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

const verifyRefreshToken = async (ctx) => {
    const {request} = ctx
    if (request.headers.authorization === undefined || request.headers.authorization.split(' ')[0] !== 'Bearer') {
        return blInfo(BLStatuses.REFRESH_TOKEN_NOT_PROVIDED)
    }
    try {
        let verifyTokenResult;
        const refresh_token = request.headers.authorization.split(' ')[1];
        verifyTokenResult = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
        const user = await findOneUser({refresh_token: refresh_token});
        if (verifyTokenResult instanceof Error) {
            return blInfo(BLStatuses.AUTH_FORMAT_ERROR_REFRESH_TOKEN)
        }
        return blSuccess(user)

    } catch (err) {
        return blInfo(BLStatuses.INAPPROPRIATE_REFRESH_TOKEN)
    }
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
        restFulAPI.kick409(ctx, BLStatuses.USER_EXISTS)
    } else {
        const access_token = createAccessToken({email, password})
        const refresh_token = createRefreshToken({email, password})
        await storeUser({email, password, refresh_token});
        restFulAPI.Success(ctx, {access_token, refresh_token, "user": {email}})
    }
}

export const login = async (ctx) => {
    const {request} = ctx;
    const {email, password} = request.body;
    const exist = await findOneUser({email, password});
    if (!exist) {
        restFulAPI.Unauthorized(ctx, BLStatuses.INCORRECT_EMAIL_OR_PASSWORD)
    }
    const user = exist
    const access_token = createAccessToken({email, password})
    const refresh_token = createRefreshToken({email, password})
    const savedUserRefreshToken = await storeUserRefreshToken(user, refresh_token)
    if (savedUserRefreshToken) {
        restFulAPI.Success(ctx, {access_token, refresh_token, user: {email}})
    } else {
        restFulAPI.businessError(ctx, BLStatuses.CAN_NOT_UPDATE_REFRESH_TOKEN)
    }
}

export const refresh = async (ctx) => {
    const verifyRefreshTokenResult = await verifyRefreshToken(ctx);
    if (!verifyRefreshTokenResult.success) {
        restFulAPI.Unauthorized(ctx, verifyRefreshTokenResult.message)
    }
    const user = verifyRefreshTokenResult.data
    const {email, password} = user;
    const access_token = createAccessToken({email, password})
    restFulAPI.Success(ctx, {access_token, user: {email}})
}
