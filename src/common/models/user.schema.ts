import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email !: string;

  @Prop({required:true, unique:true})
  name !: string;

  @Prop({ unique: true, sparse: true })
  googleId?: string;

  @Prop({ default: 'user' })
  role !: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
