import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required:true, unique:true})
  name !: string;

  @Prop({required:true, unique:true, minlength:10, maxlength:10, immutable:true})
  phoneNumber !: string;

  @Prop({required:true, minlength:6})
  password !: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function(next){
  if(!this.name) {
    this.name = this.phoneNumber;
  }
  next();
});