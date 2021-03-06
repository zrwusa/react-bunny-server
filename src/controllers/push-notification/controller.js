import {sendMessageThenGetReceiptIds, storePushToken} from "../../helpers/expo-push-notification.js";


export const addSendings = async (ctx) => {
    const {request} = ctx;
    const {message} = request.body;
    ctx.body = await sendMessageThenGetReceiptIds(message)
}

export const addDevices = async (ctx) => {
    const {request} = ctx;
    const {token} = request.body;
    ctx.body = await storePushToken(token);
}
