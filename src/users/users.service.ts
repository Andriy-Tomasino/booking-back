// users/users.service.ts
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/models/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PendingUserDocument } from '../registration/pending-user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  // src/users/users.service.ts (добавить в createFromPending и create)
  async createFromPending(pending: PendingUserDocument): Promise<UserDocument> {
    const dto: CreateUserDto = {
      uid: pending.uid,
      firstName: pending.firstName,
      lastName: pending.lastName,
      nickname: pending.nickname,
      phoneNumber: pending.phoneNumber,
      email: pending.email, // Добавь email, если есть в pending
    };
    const user = new this.userModel(dto);
    return user.save();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = new this.userModel({
        uid: createUserDto.uid,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        nickname: createUserDto.nickname,
        phoneNumber: createUserDto.phoneNumber,
        email: createUserDto.email, // Добавь email
        role: createUserDto.role || 'user',
      });
      await user.save();
      return user;
    } catch (error: any) {
      throw new HttpException(error.message || 'Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  async updateProfile(uid: string, updateUserDto: CreateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findOne({ uid }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
    if (updateUserDto.nickname) user.nickname = updateUserDto.nickname;
    if (updateUserDto.phoneNumber) user.phoneNumber = updateUserDto.phoneNumber;
    await user.save();
    return user;
  }

  async findOne(uid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ uid }).exec();
    if (!user) {
      throw new HttpException(`User with UID ${uid} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByUid(uid: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ uid }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async deleteUser(uid: string): Promise<void> {
    const result = await this.userModel.deleteOne({ uid }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with UID ${uid} not found`);
    }
  }
}