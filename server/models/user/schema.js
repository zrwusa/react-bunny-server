import mongoose  from 'mongoose'

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    _id: ObjectId,
    token: String,
    email: String,
    refresh_token:String,
    password: String,
    nickname: String
});

const User = mongoose.model('user', UserSchema);

export {
    User
}
