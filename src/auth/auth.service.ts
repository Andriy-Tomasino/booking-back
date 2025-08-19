// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { auth as adminAuth } from 'firebase-admin';
import { User, UserDocument } from '../common/models/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Приходит Firebase idToken (с фронта после phone auth).
   * Мы валидируем его через firebase-admin, достаём uid,
   * находим пользователя в своей БД и выдаём наш JWT.
   */
  async login(idToken: string) {
    try {
      const decoded = await adminAuth().verifyIdToken(idToken);
      const firebaseUid = decoded.uid;
      console.log('[AuthService] Firebase UID:', firebaseUid);

      let user = await this.userModel.findOne({ uid: firebaseUid }).exec();

      if (!user) {
        // ⚡ Можно автоматом создавать юзера
        user = new this.userModel({
          uid: firebaseUid,
          email: decoded.email ?? null,
          role: 'pending', // или сразу 'user', если не нужна модерация
        });
        await user.save();
        console.log('[AuthService] Created new user in DB:', user.uid);
      }

      if (user.role === 'pending') {
        throw new UnauthorizedException('Awaiting admin approval');
      }

      const payload = {
        sub: user.uid,
        email: user.email ?? decoded.email ?? 'no-email',
        role: user.role,
      };

      const jwtToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: '7d',
      });

      return { jwtToken, user };
    } catch (e) {
      console.error('[AuthService] login error:', e);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
