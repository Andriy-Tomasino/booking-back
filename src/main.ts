// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../firebase-admin-config.json'; // Path is correct for file in booking-back/

async function bootstrap() {
  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  console.log('Firebase Admin SDK initialized');

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://www.islab.space',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(3000);
  console.log('NestJS application is running on: http://localhost:3000');
}
bootstrap();