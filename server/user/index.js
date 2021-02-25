const {User} = require('./schema')
const {storeUser,findUsers} = require('./control')
module.exports = {
    User,
    storeUser,
    findUsers
}
