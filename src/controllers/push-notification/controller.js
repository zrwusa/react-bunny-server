import {restFulAPI} from "../../helpers/restful-api.js";
import {sendMessageThenGetReceiptIds, storePushToken} from "../../helpers/expo-push-notification.js";


export const addSendings =  async (ctx) => {
    const {request} = ctx;
    const {message} = request.body;
    const sent = await sendMessageThenGetReceiptIds(message)
    restFulAPI.Success(ctx, sent)
}

export const addDevices = async (ctx) => {
    const {request} = ctx;
    const {token} = request.body;
    const storedToken = await storePushToken(token);
    restFulAPI.Success(ctx, storedToken)
}
