import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SmartOutletModule } from './smart-outlet/smart-outlet.module';
import { ComputersModule } from './computers/computers.module';
import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';
import { BookingsModule } from './bookings/bookings.module';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as console from 'node:console';
import { UsersModule } from './users/users.module';
import { RegistrationsModule } from './registration/registrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      envFilePath: '.env',
    }),

    // Лог перед конектом до MongoDB
    MongooseModule.forRootAsync({
      useFactory: async () => {
        console.log('Mongo URI from .env:', process.env.MONGO_URI);
        return {
          uri: process.env.MONGO_URI!,
        };
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
