const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const NotificationTokenSchema = new Schema({
    _id: ObjectId,
    token: String
});

const NotificationToken = mongoose.model('notification_token', NotificationTokenSchema);

module.exports = {
    NotificationToken
}