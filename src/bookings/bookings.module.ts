import { Module, forwardRef } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingsGateway } from './bookings.gateway';
import { Booking, BookingSchema } from '../common/models/booking.schema';
import { ComputersModule } from '../computers/computers.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    AuthModule,
    forwardRef(() => ComputersModule), // Циклическая зависимость с ComputersModule
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'secret'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService, BookingsGateway],
  exports: [BookingsService, BookingsGateway], // Без изменений: Экспортируем оба для других модулей
})
export class BookingsModule {}