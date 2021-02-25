const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EmployeeSchema = new Schema({
    _id: ObjectId,
    "first_name": String,
    "last_name": String,
    "email": String
});

const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = {
     Employee:Employee
}
