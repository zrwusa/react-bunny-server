import mongoose  from 'mongoose'
import {User}  from './schema.js'

const storeUser = async function (pUser) {
    const exist = await User.find(pUser)
    if (exist.length < 1) {
        const user = new User();
        user._id = mongoose.Types.ObjectId()
        user.email = pUser.email;
        user.password = pUser.password;
        user.nickname = pUser.nickname;
        const saved = await user.save();
        return saved;
    } else {
        return exist;
    }
}

const findUsers = async function (pUser) {
    return User.find(pUser);
}
export {
    storeUser,
    findUsers
}
