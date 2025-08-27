import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PendingUser, PendingUserDocument } from './pending-user.schema';
import { CreatePendingUserDto } from './dtos/create-pending-user.dto';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

type PendingUserWithoutPassword = Omit<PendingUser, 'password'> & { _id: string };

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectModel(PendingUser.name) private readonly pendingUserModel: Model<PendingUserDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createPending(dto: CreatePendingUserDto): Promise<PendingUserWithoutPassword> {
    const { firstName, lastName, nickname, phoneNumber, password } = dto;

    if (!phoneNumber) throw new BadRequestException('Phone number required');

    const existingUserByNickname = await this.usersService.findOneByNickname(nickname).catch(() => null);
    if (existingUserByNickname) throw new BadRequestException('Nickname already exists');

    const existingUserByPhone = await this.usersService.findOneByPhoneNumber(phoneNumber);
    if (existingUserByPhone) throw new BadRequestException('Phone number already exists');

    const existingPendingByNickname = await this.pendingUserModel.findOne({ nickname }).exec();
    if (existingPendingByNickname) throw new BadRequestException('Pending registration with this nickname exists');

    const existingPendingByPhone = await this.pendingUserModel.findOne({ phoneNumber }).exec();
    if (existingPendingByPhone) throw new BadRequestException('Pending registration with this phone exists');

    const uid = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const pending = new this.pendingUserModel({
      uid,
      firstName,
      lastName,
      nickname,
      phoneNumber,
      password: hashedPassword,
    });

    const saved = await pending.save();
    const { password: _password, _id, ...rest } = saved.toObject();
    return { _id: _id.toString(), ...rest } as PendingUserWithoutPassword;
  }

  async getAllPending(): Promise<PendingUserWithoutPassword[]> {
    const list = await this.pendingUserModel.find().lean().exec();
    return list.map(({ password, _id, ...rest }) => ({
      _id: _id.toString(),
      ...rest,
    })) as PendingUserWithoutPassword[];
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
