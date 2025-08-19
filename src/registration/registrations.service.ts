import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingUser, PendingUserDocument } from './pending-user.schema';
import { CreatePendingUserDto } from './dtos/create-pending-user.dto';
import { UsersService } from '../users/users.service';
import * as admin from 'firebase-admin';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(PendingUser.name) private readonly pendingUserModel: Model<PendingUserDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createPending({ idToken, firstName, lastName, nickname }: CreatePendingUserDto): Promise<PendingUserDocument> {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number } = decodedToken;
    if (!phone_number) throw new BadRequestException('Phone number required');

    const existingUser = await this.usersService.findByUid(uid);
    if (existingUser) throw new BadRequestException('User already exists');

    const existingPending = await this.pendingUserModel.findOne({ uid }).exec();
    if (existingPending) throw new BadRequestException('Pending registration exists');

    const pending = new this.pendingUserModel({ uid, phoneNumber: phone_number, firstName, lastName, nickname });
    return pending.save();
  }

  async getAllPending(): Promise<PendingUserDocument[]> {
    return this.pendingUserModel.find().exec();
  }

  async approve(id: string): Promise<void> {
    const pending = await this.pendingUserModel.findById(id).exec();
    if (!pending) throw new NotFoundException('Pending not found');

    await this.usersService.createFromPending(pending);
    await this.pendingUserModel.findByIdAndDelete(id).exec();
  }

  async reject(id: string): Promise<void> {
    await this.pendingUserModel.findByIdAndDelete(id).exec();
  }

  async checkPending(uid: string): Promise<PendingUserDocument | null> {
    return this.pendingUserModel.findOne({ uid }).exec();
  }
}