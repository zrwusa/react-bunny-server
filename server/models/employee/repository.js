import{EmployeeModel} from './schema'
import { Types } from 'mongoose';

// export default class UserRepo {
//     public static findById(id: Types.ObjectId): Promise<Employee> {
//         return EmployeeModel.findOne({ _id: id, status: true })
//             .select('+email +password +roles')
//             .populate({
//                 path: 'roles',
//                 match: { status: true }
//             })
//             .lean<Employee>()
//             .exec();
//     }
// }
