import {getCurPrice} from "../push-notification/ws-bitcoin-push.js";

export const find = async (ctx) => {
    ctx.body = await getCurPrice()
}
