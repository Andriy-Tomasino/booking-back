import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PendingUserDocument = HydratedDocument<PendingUser>;

@Schema({ timestamps: true })
export class PendingUser {

  @Prop({ required: true, unique: true })
  uid!: string; // уникальный идентификатор

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true })
  nickname!: string;

  @Prop({ required: true, unique: true })
  phoneNumber!: string;

  @Prop({ required: true })
  password!: string;
}

export const PendingUserSchema = SchemaFactory.createForClass(PendingUser);
