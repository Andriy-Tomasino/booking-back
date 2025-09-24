import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SmartOutletModule } from './smart-outlet/smart-outlet.module';
import { ComputersModule } from './computers/computers.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import * as admin from 'firebase-admin';
import * as path from 'path';
import { UsersModule } from './users/users.module';
import { RegistrationsModule } from './registration/registrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // локально підтягує .env
    }),

    // Асинхронне підключення до Mongo
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        console.log('🚀 Mongo URI from ConfigService:', uri);

        if (!uri) {
          throw new Error(
            '❌ MONGO_URI is not defined! Перевір .env локально або Variables у Railway.',
          );
        }

        return { uri };
      },
    }),

    ComputersModule,
    RegistrationsModule,
    AuthModule,
    BookingsModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor() {
    const serviceAccountPath = path.resolve(__dirname, '../../serviceAccount.json');
    console.log('Loading serviceAccount from:', serviceAccountPath);
    const serviceAccount = require(serviceAccountPath);
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert('./firebase-admin-config.json'),
      });
      console.log('Firebase Admin initialized');
    }
  }
}
