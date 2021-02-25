const {Employee} = require('./schema')
const {storeEmployee, findEmployees} = require('./control')
module.exports = {
    Employee,
    storeEmployee,
    findEmployees
}
