import fs from "fs"
import Koa from "koa"
import koaBodyParser from "koa-bodyparser"
import cors from "@koa/cors"
import path from "path"
import https from "https"
import http from "http"
import config from "./config.js"
import {jwtAuth} from "./middlewares/jwt-auth.js"
import {bunnyAPIMiddleware} from "./middlewares/bunny-api.js"
import {bunnyRouter} from "./routers/bunny-api.js"
import {nomicsRouter} from "./routers/v1/nomics-api.js"
import {startListenAndPush} from "./controllers/push-notification/ws-bitcoin-push.js"
import "./helpers/db-connect.js"

// todo apicache
// todo api version
const app = new Koa();

app.use(cors());

app.use(bunnyAPIMiddleware());

app.use(koaBodyParser())

app.use(jwtAuth()
    .unless({path: ['/auth/login', '/auth/register', '/auth/refresh','/v1/currencies/sparkline','/crypto-currency-prices','/test']}));

app.use(bunnyRouter.routes())
    .use(bunnyRouter.allowedMethods({throw: true})); // The 405 is handled in allowedMethods.

app.use(nomicsRouter.routes())
    .use(bunnyRouter.allowedMethods({throw: true}));

// app.on('error', (err, ctx) => {
//     console.log('app.on error',JSON.stringify(err))
// });


const {protocol} = config;

let serverCallback = app.callback();
if (protocol==='HTTPS'||protocol==='BOTH') {
    const certFile = path.resolve('certs-dev', 'bunny.dev.crt');
    const keyFile = path.resolve('certs-dev', 'bunny.dev.key');
    try {
        const key = fs.readFileSync(keyFile);
        const cert = fs.readFileSync(certFile);
        let httpsServer = https.createServer({key: key,cert: cert,}, serverCallback);
        httpsServer
            .listen(config.https.port, function(err) {
                if (!!err) {
                    console.error('HTTPS server FAIL: ', err, (err && err.stack));
                }
                else {
                    console.log(`HTTPS server OK: https://${config.domain}:${config.https.port}`);
                }
            });
    } catch (err) {
        console.error('Failed to start HTTPS server\n', err, (err && err.stack));
    }
}
if(protocol==='HTTP'||protocol==='BOTH'){
    try {
        let httpServer = http.createServer(serverCallback);
        httpServer
            .listen(config.http.port, function (err) {
                if (!!err) {
                    console.error('HTTP server FAIL: ', err, (err && err.stack));
                } else {
                    console.log(`HTTP  server OK: http://${config.domain}:${config.http.port}`);
                }
            });

    } catch (err) {
        console.error('Failed to start HTTP server\n', err, (err && err.stack));
    }
}
startListenAndPush(true).then()

