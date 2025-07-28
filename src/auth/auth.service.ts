import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { User, UserDocument } from '../common/models/user.schema';
import { AuthResponseDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {
    // Инициализация Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(require('../../../firebase-admin-config.json')),
      });
    }
  }

  async validateGoogleIdToken(idToken: string): Promise<AuthResponseDto> {
    console.log('[AuthService] Verifying Firebase idToken');
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('[AuthService] Decoded token:', decodedToken);

      const { uid: googleId, email, name } = decodedToken;

      let user = await this.userModel.findOne({ googleId }).exec();
      if (!user) {
        user = await this.userModel.findOne({ email }).exec();
        if (user) {
          if (user.googleId && user.googleId !== googleId) {
            throw new UnauthorizedException('Email already linked to another Google account');
          }
          user.googleId = googleId;
          await user.save();
        } else {
          user = new this.userModel({ googleId, email, name, role: 'user' });
          await user.save();
        }
      }

      const jwtPayload = { sub: user._id };
      const accessToken = this.jwtService.sign(jwtPayload);
      console.log('[AuthService] Generated accessToken for user:', user._id);
      return {
        accessToken,
        email: user.email,
        name: user.name,
        role: user.role,
        _id: user._id.toString(),
      };
    } catch (error) {
      console.error('[AuthService] Firebase idToken verification error:', error);
      throw new UnauthorizedException('Invalid idToken');
    }
  }

  async validateGoogleUser(profile: { id: string; emails: { value: string }[]; displayName: string }): Promise<UserDocument> {
    console.log('[AuthService] Validating Google user:', profile);
    const googleId = profile.id;
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await this.userModel.findOne({ googleId }).exec();
    if (!user) {
      user = await this.userModel.findOne({ email }).exec();
      if (user) {
        if (user.googleId && user.googleId !== googleId) {
          throw new UnauthorizedException('Email already linked to another Google account');
        }
        user.googleId = googleId;
        await user.save();
      } else {
        user = new this.userModel({ googleId, email, name, role: 'user' });
        await user.save();
      }
    }
    return user;
  }

  async getProfile(userId: string): Promise<AuthResponseDto> {
    console.log('[AuthService] Fetching profile for userId:', userId);
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const jwtPayload = { sub: user._id };
    const accessToken = this.jwtService.sign(jwtPayload);
    return {
      accessToken,
      email: user.email,
      name: user.name,
      role: user.role,
      _id: user._id.toString(),
    };
  }
}