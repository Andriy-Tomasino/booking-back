import { Module } from '@nestjs/common';
//import { AuthModule } from './auth/auth.module';
//import { BookingsModule } from './bookings/bookings.module';
//import { ComputersModule } from './computers/computers.module';
import { SmartOutletModule } from './smart-outlet/smart-outlet.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), SmartOutletModule],
})
export class AppModule {}
