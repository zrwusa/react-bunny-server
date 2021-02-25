const mongoose = require('mongoose')
const {User} = require('./user')

const storeUser = async function (pUser) {
    const exist = await User.find(pUser)
    if (exist.length < 1) {
        const user = new User();
        user._id = mongoose.Types.ObjectId()
        user.email = pUser.email;
        user.password = pUser.password;
        user.nickname = pUser.nickname;
        const saved = await user.save();
        console.log('---saved user', saved);
        return saved;
    } else {
        console.log('---exist save user already exists', exist);
        return exist;
    }
}

const findUsers = async function (pUser) {
    return User.find(pUser);
}
module.exports = {
    storeUser,
    findUsers
}
