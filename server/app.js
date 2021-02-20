const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require("path");
const https = require("https");
const config = require("./config.json")
const {body, validationResult} = require('express-validator');
const {storePushToken, sendMessageThenGetReceiptIds} = require('./push-notification/expo-push-notification')
const {storeUniqueAlertSetting, storeUniqueAlertQuickSettings, cancelAllAlertSettings} = require('./push-notification/alert-setting')
const {startListenAndPush, getCurPrice} = require('./push-notification/ws-bitcoin-push')
require('./db-connect')

const {findUsers,storeUser} = require('./users/control')
const app = jsonServer.create()
const router = jsonServer.router(`${__dirname}/database.json`)
const userdb = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'UTF-8'))


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(jsonServer.defaults());


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

// Check if the user exists in database
async function isAuthenticated({email, password}) {
    const exist = await findUsers({email, password});
    return exist[0];
    // return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Get user info
function getUser({email, password}) {
    return userdb.users.find(user => user.email === email && user.password === password)
}

// Register New User
app.post('/auth/register',async (req, res) => {
    const {email, password} = req.body;

    const exist = await findUsers({email, password});
    console.log('---exist',exist)
    const saved = await storeUser({email, password});
    console.log('---saved',saved)

    if (await isAuthenticated({email, password}) === true) {
        const status = 401;
        const message = 'Email and Password already exist';
        res.status(status).json({status, message});
        return
    }


    fs.readFile(`${__dirname}/users.json`, (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
        }

        // Get current users data
        let curData = JSON.parse(data.toString());

        // Get the id of last user
        let last_item_id = curData.users[curData.users.length - 1].id;

        //Add new user
        curData.users.push({id: last_item_id + 1, email: email, password: password}); //add some curData
        let writeData = fs.writeFile(`${__dirname}/users.json`, JSON.stringify(curData), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({status, message})
                return
            }
        });
    });

// Create token for new user
    const access_token = createToken({email, password})
    console.log("Access Token:" + access_token);
    const {nickname} = user;
    res.status(200).json({"access_token": access_token, "user": {email, nickname}})
})

// Login to one of the users from ./users.json
app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;
    if (await isAuthenticated({email, password}) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({status, message})
        return
    }

    const user = getUser({email, password})
    const access_token = createToken({email, password})
    const {nickname} = user;
    return res.status(200).json({"access_token": access_token, "user": {email, nickname}})
})

app.post('/push-notification/register-device', async (req, res) => {
    const {token} = req.body;
    try {
        const storedToken = await storePushToken(token);
        res.status(200).json({"success": true, storedToken})
    } catch (err) {
        res.status(500).json({"success": false})
    }
})

app.post('/push-notification/alert-setting', async (req, res) => {
    const {alertSetting} = req.body;
    const alertSettingNeedToStore = alertSetting || {
        token: 'ExponentPushToken[oT1TDBCO7jtDytecDBmKWW]',
        price: 50000,
        comparator: 'lt',
        notificationTimes: 3,
        notificationInterval: '1s',
        isBegin: false
    }
    const stored = await storeUniqueAlertSetting(alertSettingNeedToStore)
    res.status(200).json({"success": true, stored})
})

startListenAndPush(false).then()

app.post('/push-notification/alert-quick-setting', body('granularity').isEmail(), async (req, res) => {
    const {token, granularity} = req.body;
    const curPrice = getCurPrice()
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('---errors', errors)
        return res.status(422).json({businessLogicError: errors.array()});
        // return res.status(200+Math.floor(100*Math.random())).json({errors: errors.array()});
    }
    console.log('---curPrice', curPrice)
    let stored;
    const startTime = new Date().getMilliseconds();
    try {
        if (curPrice) {
            stored = await storeUniqueAlertQuickSettings(curPrice, token, granularity)
            return res.status(200).json({"success": true, stored})
        } else {
            return res.status(500).json({"success": false})
        }
    } catch (e) {
        throw e
    } finally {
        const diff = new Date().getMilliseconds() - startTime;
    }

})

app.put('/push-notification/cancel-all-alert-settings', async (req, res) => {
    const {token} = req.body;
    const canceled = await cancelAllAlertSettings(token)
    res.status(200).json({"success": true, canceled})
})

app.post('/push-notification/send-test-to-all', async (req, res) => {
    const {message} = req.body;
    const messageNeedToSend = message || {
        title: `title`,
        body: `body`,
        data: {a: 1, b: 'b'}
    }
    await sendMessageThenGetReceiptIds(messageNeedToSend)
    res.status(200).json({"success": true})
})

app.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Error in authorization format'
        res.status(status).json({status, message})
        return
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

        if (verifyTokenResult instanceof Error) {
            const status = 401
            const message = 'Access token not provided'
            res.status(status).json({status, message})
            return
        }
        next()
    } catch (err) {
        const status = 401;
        const message = 'Error access_token is revoked'
        res.status(status).json({status, message});
    }
})

app.use(router)

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
