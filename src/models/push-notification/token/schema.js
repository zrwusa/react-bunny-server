import mongoose  from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
export const DOCUMENT_NAME = 'NotificationToken';
export const COLLECTION_NAME = 'notification_tokens';

const NotificationTokenSchema = new Schema({
    _id: ObjectId,
    token: String
});

export const NotificationTokenModel = mongoose.model(DOCUMENT_NAME, NotificationTokenSchema, COLLECTION_NAME);
