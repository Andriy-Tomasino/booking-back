// src/users/users.service.ts
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/models/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PendingUserDocument } from '../registration/pending-user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByUid(uid: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ uid }).exec();
    if (!user) {
      throw new NotFoundException(`User with UID ${uid} not found`);
    }
    return user;
  }

  async findOneByNickname(nickname: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ nickname }).exec();
    if (!user) {
      throw new NotFoundException(`User with nickname ${nickname} not found`);
    }
    return user;
  }

  async createFromPending(pending: PendingUserDocument): Promise<UserDocument> {
    try {
      const dto: CreateUserDto = {
        uid: pending.uid,
        firstName: pending.firstName,
        lastName: pending.lastName,
        nickname: pending.nickname,
        phoneNumber: pending.phoneNumber,
        password: pending.password,
      };
      const user = new this.userModel(dto);
      user.role = 'user';
      return await user.save();
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new HttpException(`User with this ${field} already exists`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message || 'Failed to create user from pending', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = new this.userModel({
        uid: createUserDto.uid,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        nickname: createUserDto.nickname,
        phoneNumber: createUserDto.phoneNumber,
        password: createUserDto.password,
        role: createUserDto.role || 'user',
      });
      await user.save();
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new HttpException(`User with this ${field} already exists`, HttpStatus.BAD_REQUEST);
      }
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

  async findOneByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phoneNumber }).exec();
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