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
    .unless({
        path: [
            '/test',
            '/auth/login',
            '/auth/register',
            '/auth/refresh',
            '/employees',
            '/v1/currencies/sparkline',
            '/push-service/alert-settings',
            '/push-service/alert-quick-settings',
            '/push-service/devices',
            '//push-service/sendings',
            '/push-service/alert-settings',
            '/crypto-currency-prices',
            '/nearby-films'
        ]
    }));

app.use(bunnyRouter.routes())
    .use(bunnyRouter.allowedMethods({throw: true})); // The 405 is handled in allowedMethods.

app.use(nomicsRouter.routes())
    .use(bunnyRouter.allowedMethods({throw: true}));

// app.on('error', (err, ctx) => {
//     console.log('app.on error',JSON.stringify(err))
// });

let envConfig
console.log('---ENV',process.env.NODE_ENV)
if(process.env.NODE_ENV==='production'){
    envConfig = config.prod;
}else {
    envConfig = config.dev;
}
const {protocol} = envConfig;
let serverCallback = app.callback();
if (protocol === 'HTTPS' || protocol === 'BOTH') {
    const certFile = path.resolve('certs-dev', 'bunny.dev.crt');
    const keyFile = path.resolve('certs-dev', 'bunny.dev.key');
    try {
        const key = fs.readFileSync(keyFile);
        const cert = fs.readFileSync(certFile);
        let httpsServer = https.createServer({key: key, cert: cert,}, serverCallback);
        httpsServer
            .listen(envConfig.https.port, function (err) {
                if (!!err) {
                    console.error('HTTPS server FAIL: ', err, (err && err.stack));
                } else {
                    console.log(`HTTPS server OK: https://${envConfig.domain}:${envConfig.https.port}`);
                }
            });
    } catch (err) {
        console.error('Failed to start HTTPS server\n', err, (err && err.stack));
    }
}
if (protocol === 'HTTP' || protocol === 'BOTH') {
    try {
        let httpServer = http.createServer(serverCallback);
        httpServer
            .listen(envConfig.http.port, function (err) {
                if (!!err) {
                    console.error('HTTP server FAIL: ', err, (err && err.stack));
                } else {
                    console.log(`HTTP  server OK: http://${envConfig.domain}:${envConfig.http.port}`);
                }
            });

    } catch (err) {
        console.error('Failed to start HTTP server\n', err, (err && err.stack));
    }
}
startListenAndPush(true).then()

