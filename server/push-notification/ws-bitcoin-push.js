import {sendMessageThenGetReceiptIds}  from "./expo-push-notification.js"
import WebSocket  from 'ws'
import {AlertSetting}  from './alert-setting.js'
import {judgePrice}  from '../helpers.js'
import {toMilliSeconds}  from '../utils.js'

let curPrice = 0;
async function startListenAndPush(shouldSend = false) {
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


    const onWSOpen = (e) => {
        console.log('---onWSOpen');
        ws.send(JSON.stringify(subscribeMsg));
    }
    ws.addEventListener('open', onWSOpen)

    const sendOrStop = async function (alertSetting, data, times,alertMsg, intervalHandle) {
        const {price} = data;
        let deleted = {}, result = {};
        if (alertSetting.notificationTimes < 0) {
            deleted = await AlertSetting.deleteOne({_id: alertSetting._id})
            if (intervalHandle) {
                clearInterval(intervalHandle)
            }
        } else {
            const message = {
                title: `Price is ${price} 📬`,
                body: `Price is ${price.toFixed(0)},Alert: ${alertMsg} ,Re Try Times: ${times}`,
                data: data
            }
            result = await sendMessageThenGetReceiptIds(message, [alertSetting.token]);
        }
        return {deleted, result}
    }
    const onWSMessage = async (e) => {
        const startTime = new Date().getMilliseconds()
        // console.log('---onWSMessage');
        const data = JSON.parse(e.data).data;
        const nowPrice = data.price;
        curPrice = nowPrice;
        if (nowPrice) {
            const alertSettings = await AlertSetting.find()
            // console.log('---find diff',new Date().getMilliseconds()-startTime)
            if (alertSettings instanceof Array) {
                for (let i in alertSettings) {
                    const alertSetting = alertSettings[i];
                    const judgedResult = judgePrice(nowPrice, alertSetting);
                    // console.log('---judgedResult',judgedResult)

                    if (judgedResult.comparingResult && !alertSetting.isBegin) {
                        if(shouldSend){
                            alertSetting.isBegin = true
                            const modified = await alertSetting.save()

                            let times = 1;
                            alertSetting.notificationTimes--

                            await sendOrStop(alertSetting, data, times,judgedResult.alertMsg)

                            const intervalHandle = setInterval(async () => {
                                if (alertSetting.isBegin) {
                                    times++
                                    alertSetting.notificationTimes--
                                    await sendOrStop(alertSetting, data, times,judgedResult.alertMsg, intervalHandle)
                                }
                            }, toMilliSeconds(alertSetting.notificationInterval))
                        }
                    }
                }
            } else {
                console.error('---alertSettings is not an array')
            }
        }
        // console.log('---func diff',new Date().getMilliseconds()-startTime)
    };

    ws.addEventListener('message', onWSMessage)

    const onWSError = (e) => {
        if (reconnectTimes < reconnectTimesConfig) {
            ws.send(JSON.stringify(reconnectMsg))
        }
    };

    ws.addEventListener('error', onWSError)

    const onWSClose = (e) => {
        console.log('---onWSClose', e);
    };

    ws.addEventListener('close', onWSClose)
}

const getCurPrice = function(){
    return curPrice;
}

export {startListenAndPush,getCurPrice}
