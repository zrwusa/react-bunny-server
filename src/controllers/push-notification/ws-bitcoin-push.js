import {sendMessageThenGetReceiptIds} from "../../helpers/expo-push-notification.js"
import WebSocket from "ws"
import {AlertSettingModel} from "../../models/push-notification/alert-setting/schema.js"
import {judgePrice} from "../../helpers/helpers.js"
import {toMilliSeconds} from "../../utils/utils.js"
import _ from "lodash"

let curPrice = 0;
let needToBeSent = []

export const startListenAndPush = async (shouldSend = false) => {
    const ws = new WebSocket('wss://ws.bitstamp.net');

    // Currency pairs: btcusd, btceur, btcgbp, btcpax, btcusdc, gbpusd, gbpeur, eurusd, xrpusd, xrpeur, xrpbtc, xrpgbp, xrppax, ltcusd, ltceur, ltcbtc, ltcgbp, ethusd, etheur, ethbtc, ethgbp, ethpax, ethusdc, bchusd, bcheur, bchbtc, bchgbp, paxusd, paxeur, paxgbp, xlmbtc, xlmusd, xlmeur, xlmgbp, linkusd, linkeur, linkgbp, linkbtc, linketh, omgusd, omgeur, omggbp, omgbtc, usdcusd, usdceur
    const subscribeMsg = {
        "event": "bts:subscribe",
        "data": {
            "channel": "live_trades_btcusd"
        }
    };

    const unSubscribeMsg = {
        "event": "bts:unsubscribe",
        "data": {
            "channel": "live_trades_btcusd"
        }
    };

    const reconnectMsg = {
        "event": "bts:request_reconnect",
        "channel": "",
        "data": ""
    }

    const reconnectTimesConfig = 3;
    const reconnectTimes = 0;


    const onWSOpen = () => {
        console.log('---onWSOpen');
        ws.send(JSON.stringify(subscribeMsg));
    }
    ws.addEventListener('open', onWSOpen)

    const sendOrStop = async function (alertSetting, data, times, alertMsg, intervalHandle) {
        const {price} = data;
        let deleted = {}, result = {};
        if (alertSetting.notificationTimes < 0) {
            deleted = await AlertSettingModel.deleteOne({_id: alertSetting._id})
            console.log('---needToBeSent.length before', needToBeSent.length)
            _.remove(needToBeSent, item => item.id === alertSetting.id)
            console.log('---needToBeSent.length after', needToBeSent.length)
            if (intervalHandle) {
                clearInterval(intervalHandle)
            }
        } else {
            const timesUnit = times===1?'st':times===2?'nd':'th';
            const message = {
                title: `Current price is ${price} 📬`,
                body: `Current price ${price.toFixed(0)}${alertMsg} , ${times}${timesUnit} reminder 📬 `,
                data: data
            }
            result = await sendMessageThenGetReceiptIds(message, [alertSetting.token]);
        }
        return {deleted, result}
    }

    const synchronizeAlertSettings = async () => {
        const alertSettings = await AlertSettingModel.find()
        const needToAddTo = _.differenceBy(alertSettings, needToBeSent, 'id')
        const needToBeRemoved = _.differenceBy(needToBeSent, alertSettings, 'id')
        needToBeSent = needToBeSent.filter(item => !needToBeRemoved.includes(item))
        console.log('---alertSettings,needToBeSent,needToBeRemoved,needToAddTo', alertSettings.length, needToBeSent.length, needToBeRemoved.length, needToAddTo.length)
        needToBeSent = [...needToBeSent, ...needToAddTo]
    }

    // setInterval(async () => {
    //     await synchronizeAlertSettings()
    // }, 1000)

    const onWSMessage = async (message) => {
        await synchronizeAlertSettings()
        console.log('---onWSMessage');
        const data = JSON.parse(message.data).data;
        const nowPrice = data.price;
        curPrice = nowPrice;
        if (!shouldSend || !nowPrice || !(needToBeSent instanceof Array)) {
            return
        }
        for (let i in needToBeSent) {
            const alertSetting = needToBeSent[i];
            if (!alertSetting) {
                continue;
            }
            const judgedResult = judgePrice(nowPrice, alertSetting);
            if (judgedResult.comparingResult && !alertSetting.isBegin) {
                alertSetting.isBegin = true
                let times = 1;
                alertSetting.notificationTimes--
                await sendOrStop(alertSetting, data, times, judgedResult.alertMsg)
                const intervalHandle = setInterval(async () => {
                    if (alertSetting.isBegin) {
                        times++
                        alertSetting.notificationTimes--
                        await sendOrStop(alertSetting, data, times, judgedResult.alertMsg, intervalHandle)
                    }
                }, toMilliSeconds(alertSetting.notificationInterval))
            }

        }
    };

    ws.addEventListener('message', onWSMessage)

    const onWSError = (error) => {
        console.log('---onWSError',JSON.stringify(error))
        if (reconnectTimes < reconnectTimesConfig) {
            ws.send(JSON.stringify(reconnectMsg))
        }
    };

    ws.addEventListener('error', onWSError)

    const onWSClose = (code, message) => {
        console.log('---onWSClose',code, JSON.stringify(message));
        ws.send(JSON.stringify(subscribeMsg));
    };

    ws.addEventListener('close', onWSClose)
}

export const getCurPrice = () => {
    return curPrice;
}
