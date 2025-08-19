import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComputerDocument = HydratedDocument<Computer>;

@Schema()
export class Computer {
  @Prop({ required: true, unique: true })
  id!: number;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  location!: string;

  @Prop({ default: true })
  isAvailable!: boolean;

  @Prop({ default: Date.now })
  updatedAt!: Date;

  @Prop()
  outletId!: string; // Опционально

  @Prop()
  status!: string; // Опционально
}

export const ComputerSchema = SchemaFactory.createForClass(Computer);