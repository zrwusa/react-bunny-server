import mongoose  from 'mongoose'
import {Employee}  from './schema.js'

const storeEmployee = async function (pEmployee) {
    const exist = await Employee.find(pEmployee)
    if (exist.length < 1) {
        const employee = new Employee();
        employee._id = mongoose.Types.ObjectId()
        employee.email = pEmployee.email;
        employee.password = pEmployee.password;
        employee.nickname = pEmployee.nickname;
        const saved = await employee.save();
        return saved;
    } else {
        return exist;
    }
}

const findEmployees = async function (pEmployee) {
    return Employee.find(pEmployee);
}
export {
    storeEmployee,
    findEmployees
}
