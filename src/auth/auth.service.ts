import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../common/models/user.schema';
import { AuthResponseDto } from './dtos/auth.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser({
                             googleId,
                             email,
                             name,
                           }: {
    googleId: string;
    email: string;
    name?: string;
  }): Promise<AuthResponseDto> {
    let user = await this.userModel.findOne({ googleId }).exec();
    if (!user) {
      user = await this.userModel.findOne({ email }).exec();
      if (user) {
        user.googleId = googleId;
        await user.save();
      } else {
        user = new this.userModel({ googleId, email, name, role: 'user' });
        await user.save();
      }
    }

    const payload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async getProfile(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}