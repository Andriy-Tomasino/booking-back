import {Types} from 'mongoose';

export interface User {
    _id: Types.ObjectId | string;
    phoneNumber: Types.ObjectId | number;
    name ?: Types.ObjectId | string;
}
