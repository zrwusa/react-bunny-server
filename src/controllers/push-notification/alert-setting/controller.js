import {assignToModelInstance} from "../../../utils/utils.js";
import mongoose from "mongoose";
import {AlertSettingModel} from "../../../models/push-notification/alert-setting/schema.js";
import {getCurPrice} from "../ws-bitcoin-push.js";
import {restFulAPI} from "../../../helpers/restful-api.js";
import {BLStatuses} from "../../../helpers/business-logic.js";

export const storeUniqueAlertSetting = async (alertSetting) => {
    const exist = await AlertSettingModel.find(alertSetting)
    if (exist.length < 1) {
        const alertSettingInstance = new AlertSettingModel();
        assignToModelInstance(alertSettingInstance, alertSetting)
        alertSettingInstance._id = mongoose.Types.ObjectId()
        return await alertSettingInstance.save();
    } else {
        return exist;
    }
}

export const storeUniqueAlertQuickSettings = async (basePrice, token, granularity = 5) => {
    const quickSettings = [];
    let bigger = 0;
    let smaller = 0;
    await AlertSettingModel.deleteMany({token})
    for (let i = 0; i < 10; i++) {
        let quickSetting = new AlertSettingModel;
        let diff;
        let comparator;
        if (i < 5) {
            diff = i - 5;
            comparator = 'lt';
        } else {
            diff = i - 4;
            comparator = 'gt';
        }
        quickSetting.price = (basePrice * (100 + diff * granularity * 100 / 5) / 100).toFixed(2);
        quickSetting.comparator = comparator;
        quickSetting.notificationTimes = 3;
        quickSetting.notificationInterval = '1s';
        quickSetting.isBegin = false;
        quickSetting.token = token;
        const start = new Date();
        quickSetting._id = mongoose.Types.ObjectId();
        const timeDiff = (new Date()).getMilliseconds() - start.getMilliseconds()
        timeDiff > 0 ? bigger++ : smaller++
        quickSettings.push(quickSetting);
    }
    return await AlertSettingModel.create(quickSettings)
}

export const cancelAllAlertSettings = async (token) => {
    return AlertSettingModel.deleteMany({token})
}

export const addAlertQuickSettings = async (ctx, next) => {
    const {request} = ctx;
    const {token, granularity} = request.body;
    const curPrice = getCurPrice()
    if (curPrice) {
        const stored = await storeUniqueAlertQuickSettings(curPrice, token, granularity)
        restFulAPI.Success(ctx, stored)
    } else {
        restFulAPI.businessError(ctx, BLStatuses.NO_CUR_PRICE)
    }
}

export const addAlertSettings = async (ctx) => {
    const {request} = ctx;
    const {alertSetting} = request.body;
    const stored = await storeUniqueAlertSetting(alertSetting);
    restFulAPI.Success(ctx, stored)
}

export const deleteAlertSettings = async (ctx) => {
    const {request} = ctx;
    const {token} = request.params;
    const canceled = await cancelAllAlertSettings(token)
    restFulAPI.Success(ctx, canceled)
}

