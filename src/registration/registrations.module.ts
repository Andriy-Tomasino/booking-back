// src/registration/registrations.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { PendingUser, PendingUserSchema } from './pending-user.schema';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: PendingUser.name, schema: PendingUserSchema }]),
    UsersModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}