import mongoose from "mongoose"
import {EmployeeModel} from '../../models/employee/schema.js'

const storeEmployee = async (pEmployee) => {
    const exist = await EmployeeModel.find(pEmployee)
    if (exist.length < 1) {
        const employee = new EmployeeModel();
        employee._id = mongoose.Types.ObjectId()
        employee.email = pEmployee.email;
        return await employee.save();
    } else {
        return exist;
    }
}

const findEmployees = async (pEmployee) => {
    return EmployeeModel.find(pEmployee);
}

export const find = async (ctx) => {
    ctx.body = await findEmployees({})
}
