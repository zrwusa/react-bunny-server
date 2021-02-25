const mongoose = require('mongoose')
const {Employee} = require('./employee')

const storeEmployee = async function (pEmployee) {
    const exist = await Employee.find(pEmployee)
    if (exist.length < 1) {
        const user = new Employee();
        user._id = mongoose.Types.ObjectId()
        user.email = pEmployee.email;
        user.password = pEmployee.password;
        user.nickname = pEmployee.nickname;
        const saved = await user.save();
        console.log('---saved employee', saved);
        return saved;
    } else {
        console.log('---exist save employee already exists', exist);
        return exist;
    }
}

const findEmployees = async function (pEmployee) {
    return Employee.find(pEmployee);
}
module.exports = {
    storeEmployee,
    findEmployees
}
