//import * as mongoose from 'mongoose';
import {Schema, Types, model, Document} from 'mongoose';

export interface Booking extends Document{
  userId:Types.ObjectId,
  computerId:Types.ObjectId,
  startTime:Date,
  endTime:Date,
  status:String,
}

export const BookingSchema = new Schema({
  userId:{
    type:Types.ObjectId,
    required:true,
    ref:'User',
  },
  computerId:{
    type:Types.ObjectId,
    required:true,
    ref:'Computer',
  },
  startTime:{
    type:Date,
    required:true,
  },
  endTime:{
    type:Date,
    required:true,
  },
  status:{
    type:String,
    enum:['active', 'cancelled'],
    required:true,
  }
})