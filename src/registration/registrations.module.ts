import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegistrationsService } from './registrations.service';
import { RegistrationsController } from './registrations.controller';
import { PendingUser, PendingUserSchema } from './pending-user.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: PendingUser.name, schema: PendingUserSchema }]),
    UsersModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
  exports: [RegistrationsService],
})
export class RegistrationsModule {}