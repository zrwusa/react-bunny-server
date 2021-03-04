import mongoose  from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const DOCUMENT_NAME = 'Employee';
export const COLLECTION_NAME = 'employees';

const EmployeeSchema = new Schema({
    _id: {
        type: ObjectId,
        // select: false
    },
    first_name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    last_name: {
        type: Schema.Types.String,
        required: true,
        trim: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        trim: true,
        select: true
    }
});

export const EmployeeModel = mongoose.model(DOCUMENT_NAME, EmployeeSchema, COLLECTION_NAME);
