const fs = require('fs')
const koaBodyParser = require('koa-bodyparser')
const KoaRouter = require('@koa/router')
const cors = require('@koa/cors');
const path = require("path");
const https = require("https");
const config = require("./config.json");
const {jwtAuth,createToken} = require('./middlewares/jwt-auth');
const {bunnyAPIMiddleware} = require('./middlewares/bunny-api')
const {findEmployees,storeEmployee} = require('./employee')

const {
    storePushToken,
    sendMessageThenGetReceiptIds
} = require('./push-notification/expo-push-notification')
const {
    storeUniqueAlertSetting,
    storeUniqueAlertQuickSettings, cancelAllAlertSettings
} = require('./push-notification/alert-setting')
const {startListenAndPush, getCurPrice} = require('./push-notification/ws-bitcoin-push')
require('./db-connect');

const {findUsers, storeUser} = require('./user/control')

const {restFulAPI} = require('./restful-api');

startListenAndPush(false).then()

const Koa = require('koa');
const app = new Koa();

const router = new KoaRouter();

app.use(cors());
app.use(bunnyAPIMiddleware());

app.use(koaBodyParser())
// Register New User
router.post('/auth/register', async (ctx, next) => {
    const {request} = ctx;
    const {email, password} = request.body;
    const exist = await findUsers({email, password});
    console.log('---exist', exist)
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

router.post('/push-notification/register-device', async (ctx, next) => {
    const {request} = ctx;
    const {token} = request.body;
    const storedToken = await storePushToken(token);
    restFulAPI.Success(ctx, storedToken)
})

router.post('/push-notification/alert-setting', async (ctx, next) => {
    const {request} = ctx;
    const {alertSetting} = request.body;
    const stored = await storeUniqueAlertSetting(alertSetting);
    restFulAPI.Success(ctx, stored)
})

router.post('/push-notification/alert-quick-setting', async (ctx, next) => {
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

router.put('/push-notification/cancel-all-alert-settings', async (ctx, next) => {
    const {request} = ctx;
    const {token} = request.body;
    const canceled = await cancelAllAlertSettings(token)
    restFulAPI.Success(ctx, canceled)
})

router.post('/push-notification/send-test-to-all', async (ctx, next) => {
    const {request} = ctx;
    const {message} = request.body;
    const sent = await sendMessageThenGetReceiptIds(message)
    restFulAPI.Success(ctx, sent)
})

router.get('/employee', async (ctx, next) => {
    console.log('---employee')
    const employees = await findEmployees({})
    // throw('xxx1')
    // restFulAPI.businessError(ctx, employees);
    // ctx.throw(422,'llll')
    restFulAPI.Success(ctx,employees)
})

router.post('/auth/login', async (ctx, next) => {
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

app.use(jwtAuth()
    .unless({path: ['/employee', '/auth/login', '/auth/register']}));


app.use(router.routes())
    .use(router.allowedMethods());

// app.on('error', (err, ctx) => {
//     console.log('app.on error',JSON.stringify(err))
// });

const {localBackEnd, isHttps} = config;
const keyFile = path.resolve('.expo/web/development/ssl', 'key-localhost.pem');
const certFile = path.resolve('.expo/web/development/ssl', 'cert-localhost.pem');
let key, cert;
let isExpoSSLFileExist = true;

try {
    key = fs.readFileSync(keyFile);
    cert = fs.readFileSync(certFile);
} catch (err) {
    isExpoSSLFileExist = false;
}

if (isHttps && isExpoSSLFileExist) {
    https
        .createServer(
            {
                key: key,
                cert: cert,
            },
            app
        )
        .listen(localBackEnd.port, () => {
            console.log(`https://localhost:${localBackEnd.port}/ Run API Mock Server with expo SSL(Just a Self Signed SSL,only for development)`);
        });
} else {
    app.listen(localBackEnd.port, () => {
        console.log(`http://localhost:${localBackEnd.port}/ Run API Mock Server`)
    })
}
