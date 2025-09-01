import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { Computer } from './computer.schema';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  userId!: string; // Stores the user's uid (UUID string)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId; // Reference to User _id

  @Prop({ type: Types.ObjectId, ref: 'Computer', required: true })
  computer!: Types.ObjectId;

  @Prop({ required: true })
  startTime!: Date;

  @Prop({ required: true })
  endTime!: Date;

  @Prop({ required: true, enum: ['active', 'completed', 'cancelled'] })
  status!: string;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  computerName!: string;

  @Prop()
  locationName!: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);