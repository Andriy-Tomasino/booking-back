// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(nickname: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByNickname(nickname);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.uid, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { uid: user.uid, nickname: user.nickname, role: user.role },
    };
  }
}
