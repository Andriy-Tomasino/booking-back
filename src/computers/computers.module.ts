import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { Computer, ComputerSchema } from '../common/models/computer.schema';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Computer.name, schema: ComputerSchema }]),
    forwardRef(() => BookingsModule), // ⬅️ обернули
  ],
  controllers: [ComputersController],
  providers: [ComputersService],
  exports: [ComputersService], // ⬅️ обычно экспортируют сервис, а не модуль
})
export class ComputersModule {}
