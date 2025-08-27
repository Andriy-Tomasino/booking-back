import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  uid!: string;

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

  @Prop({ default: 'user' })
  role!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
