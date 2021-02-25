const mongoose = require('mongoose')
const {Employee} = require('./schema')

const storeEmployee = async function (pEmployee) {
    const exist = await Employee.find(pEmployee)
    if (exist.length < 1) {
        const employee = new Employee();
        employee._id = mongoose.Types.ObjectId()
        employee.email = pEmployee.email;
        employee.password = pEmployee.password;
        employee.nickname = pEmployee.nickname;
        const saved = await employee.save();
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
