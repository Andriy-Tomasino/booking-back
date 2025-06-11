import{Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import{HydratedDocument} from 'mongoose';

export type ComputerDocument = HydratedDocument<Computer>;

@Schema()
export class Computer{

  @Prop({required:true, unique:true})
  name !: string;

  @Prop({required:true, unique:true})
  location !: string;

  @Prop({required:true, unique:true, default:false})
  isAvailable !: boolean;
}

export const ComputerSchema = SchemaFactory.createForClass(Computer);

