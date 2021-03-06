import mongoose from "mongoose"
import {UserModel} from "../../models/user/schema.js"

export const storeUser = async (pUser) => {
    const exist = await UserModel.find(pUser)
    if (exist.length < 1) {
        const user = new UserModel();
        user._id = mongoose.Types.ObjectId()
        user.email = pUser.email;
        user.password = pUser.password;
        user.nickname = pUser.nickname;
        user.refreshToken = pUser.refreshToken;
        return await user.save();
    } else {
        return exist;
    }
}

export const storeUserRefreshToken = async (pUser, refreshToken) => {
    const {_id} = pUser
    let filter = {_id};
    const exist = await UserModel.findOne(filter);
    if (exist) {
        exist.refreshToken = refreshToken;
        return await exist.save();
    } else {
        return null
    }
}

export const findUsers = async (pUser) => {
    return UserModel.find(pUser);
}

export const findOneUser = async (pUser) => {
    return UserModel.findOne(pUser);
}
