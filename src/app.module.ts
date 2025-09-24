import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SmartOutletModule } from './smart-outlet/smart-outlet.module';
import { ComputersModule } from './computers/computers.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as console from 'node:console';
import { UsersModule } from './users/users.module';
import { RegistrationsModule } from './registration/registrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // локально підтягує .env
    }),

    // Перевірка змінної
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGO_URI;
        if (!uri) {
          throw new Error(
            '❌ MONGO_URI is not defined! Перевір .env локально або Variables у Railway.',
          );
        }
        console.log('✅ Using Mongo URI:', uri);
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
