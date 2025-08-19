// src/common/models/booking.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Computer } from './computer.schema';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ required: true })
  userId!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user!: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Computer', required: true })
  computer!: Computer;

  @Prop({ required: true })
  startTime!: Date;

  @Prop({ required: true })
  endTime!: Date;

  @Prop({ default: 'active' })
  status!: 'active' | 'completed' | 'cancelled';

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  computerName!: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);