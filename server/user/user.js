const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    _id: ObjectId,
    token: String,
    email: String,
    password: String,
    nickname: String
});

const User = mongoose.model('user', UserSchema);

module.exports = {
    User
}
