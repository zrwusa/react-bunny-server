import KoaRouter from "@koa/router"
import koaPagination from "koa-pagination"
import * as employeeCtrl from "../controllers/employee/controller.js";
import * as nearbyFilmCtrl from "../controllers/nearby-film/controller.js";
import * as pushNotificationCtrl from "../controllers/push-notification/controller.js"
import * as alertSettingCtrl from "../controllers/push-notification/alert-setting/controller.js"
import * as authCtrl from "../controllers/auth/controller.js";
import * as bitcoinPriceCtrl from "../controllers/bitcoin-price/controller.js";

export const bunnyRouter = new KoaRouter();

bunnyRouter.post('/auth/register', authCtrl.register)

bunnyRouter.put('/auth/login', authCtrl.login)

bunnyRouter.put('/auth/refresh', authCtrl.refresh)

bunnyRouter.post('/push-service/devices', pushNotificationCtrl.addDevices)

bunnyRouter.post('/push-service/sendings', pushNotificationCtrl.addSendings)

bunnyRouter.post('/push-service/alert-settings', alertSettingCtrl.addAlertSettings)

bunnyRouter.post('/push-service/alert-quick-settings', alertSettingCtrl.addAlertQuickSettings)

bunnyRouter.delete('/push-service/alert-settings', alertSettingCtrl.deleteAlertSettings)

bunnyRouter.get('/employees', employeeCtrl.find)

bunnyRouter.get('/nearby-films', nearbyFilmCtrl.find)

bunnyRouter.get('/bitcoin-prices', bitcoinPriceCtrl.find)

// todo filtering, sorting, and pagination
// todo employees?sort=+author,-datepublished
bunnyRouter.get('/demo-sagas', koaPagination.middleware(), async (ctx) => {
    ctx.body = [{id: 1, text: 'saga1'}, {id: 2, text: 'saga2'}]
})
