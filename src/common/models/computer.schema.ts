import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Booking } from './booking.schema';

export type ComputerDocument = HydratedDocument<Computer>;

@Schema()
export class Computer {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  location!: string;

  @Prop({ default: true })
  isAvailable!: boolean;

  @Prop({ default: Date.now })
  updatedAt!: Date;

  @Prop()
  outletId?: string;

  @Prop()
  status!: string;
}

export const ComputerSchema = SchemaFactory.createForClass(Computer);

// --- виртуал для бронирований
ComputerSchema.virtual('bookings', {
  ref: Booking.name,
  localField: '_id',
  foreignField: 'computer',
});

// --- вместо _id отдаём id
ComputerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_: any, ret: any) => {
    ret.id = ret._id.toString();   // руками добавляем id
    delete (ret as any)._id;       // TS больше не ругается
  },
});

