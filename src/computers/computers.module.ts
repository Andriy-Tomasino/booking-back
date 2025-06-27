import { Module } from '@nestjs/common';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SmartOutletModule } from '../smart-outlet/smart-outlet.module';
import { Computer, ComputerSchema } from '../common/models/computer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Computer.name, schema: ComputerSchema }]),
    SmartOutletModule,
  ],
  controllers: [ComputersController],
  providers: [ComputersService],
  exports: [ComputersService],
})
export class ComputersModule {}
