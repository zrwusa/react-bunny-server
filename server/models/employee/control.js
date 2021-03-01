import mongoose  from 'mongoose'
import {EmployeeModel}  from './schema.js'

const storeEmployee = async function (pEmployee) {
    const exist = await EmployeeModel.find(pEmployee)
    if (exist.length < 1) {
        const employee = new EmployeeModel();
        employee._id = mongoose.Types.ObjectId()
        employee.email = pEmployee.email;
        return  await employee.save();
    } else {
        return exist;
    }
}

const findEmployees = async function (pEmployee) {
    return EmployeeModel.find(pEmployee);
}
export {
    storeEmployee,
    findEmployees
}
