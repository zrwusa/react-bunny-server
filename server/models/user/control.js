import mongoose from 'mongoose'
import {User} from './schema.js'

const storeUser = async function (pUser) {
    const exist = await User.find(pUser)
    if (exist.length < 1) {
        const user = new User();
        user._id = mongoose.Types.ObjectId()
        user.email = pUser.email;
        user.password = pUser.password;
        user.nickname = pUser.nickname;
        user.refresh_token = pUser.refresh_token;
        return await user.save();
    } else {
        return exist;
    }
}

const storeUserRefreshToken = async function (pUser,refresh_token) {
    const {_id} = pUser
    let filter = {_id};
    const exist = await User.findOne(filter);
    console.log('---storeUserRefreshToken',pUser,_id,exist)
    if (exist) {
        exist.refresh_token = refresh_token;
        return await exist.save();
    }else{
        return null
    }
}

const findUsers = async function (pUser) {
    return User.find(pUser);
}
const findOneUser = async function (pUser){
    return User.findOne(pUser);
}
export {
    storeUser,
    findUsers,
    findOneUser,
    storeUserRefreshToken
}
