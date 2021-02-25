const mongoose = require('mongoose')
const {assignToModelInstance} = require('../utils')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AlertSettingSchema = new Schema({
    _id: ObjectId,
    token: String,
    price: Number,
    comparator: String,
    notificationTimes: Number,
    notificationInterval: String,
    isBegin: Boolean
});

const AlertSetting = mongoose.model('alert_setting', AlertSettingSchema);

const storeUniqueAlertSetting = async function (alertSetting) {
    const exist = await AlertSetting.find(alertSetting)
    console.log('---exist', exist)
    if (exist.length < 1) {
        const alertSettingInstance = new AlertSetting();
        assignToModelInstance(alertSettingInstance, alertSetting)
        alertSettingInstance._id = mongoose.Types.ObjectId()
        const saved = await alertSettingInstance.save();
        console.log('---saved', saved)
        return saved;
    } else {
        console.log('---exist saveUniqueAlertSetting', exist)
        return exist;
    }
}

const storeUniqueAlertQuickSettings = async function (basePrice, token, granularity = 5) {
    const quickSettings = [];
    let bigger = 0;
    let smaller = 0;
    const startF = new Date()
    await AlertSetting.deleteMany({token})
    for (let i = 0; i < 10; i++) {
        let quickSetting = new AlertSetting;
        let diff;
        let comparator;
        if (i < 5) {
            diff = i - 5;
            comparator = 'lt';
        } else {
            diff = i - 4;
            comparator = 'gt';
        }
        quickSetting.price = (basePrice * (100 + diff * granularity*100/5) / 100).toFixed(2);
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
    return await AlertSetting.create(quickSettings)
    // const endF = new Date()
    // console.log('---FDiff,bigger,smaller', endF.getMilliseconds() - startF.getMilliseconds(), bigger, smaller)
}

const cancelAllAlertSettings = async function (token) {
    const canceled = await AlertSetting.deleteMany({token})
    return canceled;
}


module.exports = {
    AlertSetting,
    storeUniqueAlertSetting,
    storeUniqueAlertQuickSettings,
    cancelAllAlertSettings
}
