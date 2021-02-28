import fs  from 'fs'
import koaBodyParser  from 'koa-bodyparser'
import cors  from '@koa/cors'
import path  from "path"
import https  from "https"
import config  from "./config.js"
import {jwtAuth}  from './middlewares/jwt-auth.js'
import {bunnyAPIMiddleware}  from './middlewares/bunny-api.js'
import {bunnyRouter} from './routers/bunny-api.js'
import {startListenAndPush}  from './push-notification/ws-bitcoin-push.js'
import './db-connect.js'

startListenAndPush(true).then()

import Koa  from 'koa'
// todo apicache
// todo api version
const app = new Koa();

app.use(cors());
app.use(bunnyAPIMiddleware());

app.use(koaBodyParser())

app.use(jwtAuth()
    .unless({path: ['/employees', '/auth/login', '/auth/register']}));

app.use(bunnyRouter.routes())
    .use(bunnyRouter.allowedMethods({throw: true})); // The 405 is handled in allowedMethods.

// app.on('error', (err, ctx) => {
//     console.log('app.on error',JSON.stringify(err))
// });

const {localBackEnd,remoteBackEnd, isHttps} = config;
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
        .listen(remoteBackEnd.port, () => {
            console.log(`https://localhost:${remoteBackEnd.port}/ Run API Mock Server with expo SSL(Just a Self Signed SSL,only for development)`);
        });
} else {
    app.listen(remoteBackEnd.port, () => {
        console.log(`http://localhost:${remoteBackEnd.port}/ Run API Mock Server`)
    })
}
