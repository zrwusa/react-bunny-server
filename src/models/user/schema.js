import mongoose from "mongoose"

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

const UserSchema = new Schema({
    _id: ObjectId,
    token: String,
    email: String,
    refreshToken: String,
    password: String,
    nickname: String
});

export const UserModel = mongoose.model(DOCUMENT_NAME, UserSchema, COLLECTION_NAME);
