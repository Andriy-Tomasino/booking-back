import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SmartOutletModule } from './smart-outlet/smart-outlet.module';
import { ComputersModule } from './computers/computers.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    SmartOutletModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/computer-booking'),
    ComputersModule,
    AuthModule,
    BookingsModule,
  ],
})
export class AppModule {}
