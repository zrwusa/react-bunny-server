import {findUsers, storeUser} from "../user/index.js";
import {restFulAPI} from "../restful-api.js";
import {createToken} from "../middlewares/jwt-auth.js";
import {sendMessageThenGetReceiptIds, storePushToken} from "../push-notification/expo-push-notification.js";
import {cancelAllAlertSettings, storeUniqueAlertQuickSettings, storeUniqueAlertSetting} from "../push-notification/alert-setting.js";
import {getCurPrice} from "../push-notification/ws-bitcoin-push.js";
import {findEmployees} from "../employee/index.js";
import {findNearbyFilms} from "../nearby-film/index.js";

import KoaRouter from '@koa/router'

const bunnyRouter = new KoaRouter();

// Register New User
// todo a normal user shouldn’t be able to access information of another user. They also shouldn’t be able to access data of admins.
// todo To enforce the principle of least privilege, we need to add role checks either for a single role, or have more granular roles for each user.
// todo    If we choose to group users into a few roles, then the roles should have the permissions that cover all they need and no more. If we have more granular permissions for each feature that users have access to, then we have to make sure that admins can add and remove those features from each user accordingly. Also, we need to add some preset roles that can be applied to a group users so that we don’t have to do that for every user manually.
bunnyRouter.post('/auth/register', async (ctx, next) => {
    const {request} = ctx;
    const {email, password} = request.body;
    const exist = await findUsers({email, password});
    if (exist.length > 0) {
        // 409 or 201 or 200 with indicating own status
        // (Gmail (Google) returns a 200 OK and a JSON object containing a code which is indicating that the email is already registered.
        // Facebook is also returning a 200 OK but re-renders the content to a recovery page to give the user the option to recover his/her existing account.
        // Twitter is validating the existing email by an AJAX call To another resource. The response of the email validation resource is always a 200 OK. The response contains a JSON object containing a flag to indicate if the email is already registered or not.
        // Amazon is doing it the same way as Facebook. Returning a 200 OK and re-rendering the content to a notification page to inform the user that the account already exists and provide him/her possibilities to take further actions like login or password change.)
        restFulAPI.kick409(ctx, 'User info all ready exists')
    } else {
        const saved = await storeUser({email, password});
        const access_token = createToken({email, password})
        const {nickname} = saved[0];
        restFulAPI.Success(ctx, {"access_token": access_token, "user": {email, nickname}})
    }

})

bunnyRouter.post('/push-service/devices', async (ctx, next) => {
    const {request} = ctx;
    const {token} = request.body;
    const storedToken = await storePushToken(token);
    restFulAPI.Success(ctx, storedToken)
})

bunnyRouter.post('/push-service/alert-settings', async (ctx, next) => {
    const {request} = ctx;
    const {alertSetting} = request.body;
    const stored = await storeUniqueAlertSetting(alertSetting);
    restFulAPI.Success(ctx, stored)
})

bunnyRouter.post('/push-service/alert-quick-settings', async (ctx, next) => {
    const {request} = ctx;
    const {token, granularity} = request.body;
    const curPrice = getCurPrice()
    let stored;
    if (curPrice) {
        stored = await storeUniqueAlertQuickSettings(curPrice, token, granularity)
        restFulAPI.Success(ctx, stored)
    } else {
        restFulAPI.businessError(ctx, 'No cur price')
    }
})

bunnyRouter.delete('/push-service/alert-settings', async (ctx, next) => {
    const {request} = ctx;
    const {token, cancel_all} = request.params;
    const canceled = await cancelAllAlertSettings(token)
    restFulAPI.Success(ctx, canceled)
})

bunnyRouter.post('/push-service/sendings', async (ctx, next) => {
    const {request} = ctx;
    const {message} = request.body;
    const sent = await sendMessageThenGetReceiptIds(message)
    restFulAPI.Success(ctx, sent)
})
// todo filtering, sorting, and pagination
// todo employees?sort=+author,-datepublished
bunnyRouter.get('/employees', async (ctx, next) => {
    const employees = await findEmployees({})
    // throw('xxx1')
    // restFulAPI.businessError(ctx, employees);
    // ctx.throw(422,'llll')
    restFulAPI.Success(ctx)
})

bunnyRouter.get('/nearby-films', async (ctx, next) => {
    const nearbyFilms = await findNearbyFilms({})
    restFulAPI.Success(ctx, nearbyFilms)
})

bunnyRouter.post('/auth/login', async (ctx, next) => {
    const {request} = ctx;
    const {email, password} = request.body;
    const exist = await findUsers({email, password});
    if (exist.length < 1) {
        restFulAPI.Unauthorized(ctx, 'Incorrect email or password')
    } else {
        const user = exist[0]
        const access_token = createToken({email, password})
        const {nickname} = user;
        restFulAPI.Success(ctx, {"access_token": access_token, "user": {email, nickname}})
    }
})

export {bunnyRouter}
