import ExpoSDK from "expo-server-sdk"
import mongoose from "mongoose"
import {NotificationTokenModel} from "../models/push-notification/token/schema.js"

const expo = new ExpoSDK.Expo();

const getPushTokens = async () => {
    const notificationTokens = await NotificationTokenModel.find({})
    return notificationTokens.map((row) => {
        return row.token;
    })
}

export const storePushToken = async (token) => {
    const exist = await NotificationTokenModel.find({token: token})
    if (exist.length < 1) {
        const notificationTokenInstance = new NotificationTokenModel();
        notificationTokenInstance._id = mongoose.Types.ObjectId()
        notificationTokenInstance.token = token;
        return await notificationTokenInstance.save();
    } else {
        return exist;
    }
}

const createMessages = (body, data, pushTokens) => {
    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of pushTokens) {
        // Each push token looks like ExponentPushToken[xxx]
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!ExpoSDK.Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
        messages.push({
            to: pushToken,
            sound: 'default',
            body,
            data,
        })
    }
    return messages;
}

const sendMessages = async (messages) => {
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
    }
    return tickets;
}

const getReceiptIds = (tickets) => {
    let receiptIds = [];
    for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
            receiptIds.push(ticket.id);
        }
    }
    return receiptIds;
}

const obtainReceipts = async (receiptIds) => {
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        // receipts may only be one object
        if (!Array.isArray(receipts)) {
            let receipt = receipts;
            if (receipt.status === 'ok') {
                continue;
            } else if (receipt.status === 'error') {
                console.error(`There was an error sending a notification: ${receipt.message}`);
                if (receipt.details && receipt.details.error) {
                    // The error codes are listed in the Expo documentation:
                    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                    // You must handle the errors appropriately.
                    console.error(`The error code is ${receipt.details.error}`);
                }
            }
            return;
        }
        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receipt of receipts) {
            if (receipt.status === 'ok') {
                continue;
            } else if (receipt.status === 'error') {
                console.error(`There was an error sending a notification: ${receipt.message}`);
                if (receipt.details && receipt.details.error) {
                    // The error codes are listed in the Expo documentation:
                    // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                    // You must handle the errors appropriately.
                    console.error(`The error code is ${receipt.details.error}`);
                }
            }
        }
    }
}

export const sendMessageThenGetReceiptIds = async (message, tokens) => {
    let push_tokens;
    if (tokens) {
        push_tokens = tokens;
    } else {
        // get all push_tokens
        push_tokens = await getPushTokens();
    }

    // send a notification to all clients
    let messages = createMessages(message.body,
        message.data,
        push_tokens);
    let tickets = await sendMessages(messages);
    let receiptIds = getReceiptIds(tickets);
    await obtainReceipts(receiptIds);

    return {
        tickets,
        receiptIds
    }
}
