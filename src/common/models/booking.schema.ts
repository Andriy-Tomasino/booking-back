import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Computer } from './computer.schema';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Computer.name, required: true })
  computerId!: Types.ObjectId;

  @Prop({ required: true })
  startTime!: Date;

  @Prop({ required: true })
  endTime!: Date;

  @Prop({ default: 'active', enum: ['active', 'completed', 'cancelled'] })
  status!: 'active' | 'completed' | 'cancelled';
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
// Индексы для оптимизации запросов на пересечение времени
BookingSchema.index({ computerId: 1, startTime: 1, endTime: 1 });