import{Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import{HydratedDocument} from 'mongoose';

export type ComputerDocument = HydratedDocument<Computer>;

@Schema({ timestamps: true })
export class Computer{

  @Prop({required:true, unique:true})
  name !: string;

  @Prop({required:true, unique:true})
  location !: string;

  @Prop({required:true, default:false})
  isAvailable !: boolean;

  @Prop({required:true})
  outletId !: string;

}

export const ComputerSchema = SchemaFactory.createForClass(Computer);

