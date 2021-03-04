import mongoose  from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const DOCUMENT_NAME = 'AlertSetting';
export const COLLECTION_NAME = 'alert_settings';

const AlertSettingSchema = new Schema({
    _id: ObjectId,
    token: String,
    price: Number,
    comparator: String,
    notificationTimes: Number,
    notificationInterval: String,
    isBegin: Boolean
});

export const AlertSettingModel = mongoose.model(DOCUMENT_NAME, AlertSettingSchema, COLLECTION_NAME);
