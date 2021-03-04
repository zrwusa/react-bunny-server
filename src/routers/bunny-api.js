import KoaRouter from "@koa/router"
import koaPagination from "koa-pagination"
import {restFulAPI} from "../helpers/restful-api.js";
import * as employeeController from "../controllers/employee/controller.js";
import * as nearbyFilmController from "../controllers/nearby-film/controller.js";
import * as pushNotificationController from "../controllers/push-notification/controller.js"
import * as alertSettingController from "../controllers/push-notification/alert-setting/controller.js"
import * as authController from "../controllers/auth/controller.js";

export const bunnyRouter = new KoaRouter();

bunnyRouter.post('/auth/register', authController.register)

bunnyRouter.put('/auth/login',authController.login)

bunnyRouter.put('/auth/refresh',authController.refresh)

bunnyRouter.post('/push-service/devices', pushNotificationController.addDevices)

bunnyRouter.post('/push-service/sendings',pushNotificationController.addSendings)

bunnyRouter.post('/push-service/alert-settings',alertSettingController.addAlertSettings)

bunnyRouter.post('/push-service/alert-quick-settings',alertSettingController.addAlertQuickSettings)

bunnyRouter.delete('/push-service/alert-settings',alertSettingController.deleteAlertSettings)

bunnyRouter.get('/employees',employeeController.find)

bunnyRouter.get('/nearby-films',nearbyFilmController.find)

// todo filtering, sorting, and pagination
// todo employees?sort=+author,-datepublished
bunnyRouter.get('/demo-sagas', koaPagination.middleware(), async (ctx, next) => {
    restFulAPI.Success(ctx, [{id: 1, text: 'saga1'}, {id: 2, text: 'saga2'}])
})
