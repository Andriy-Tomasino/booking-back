// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('idToken') idToken: string) {
    if (!idToken) {
      throw new BadRequestException('idToken is required');
    }
    console.log('[AuthController] Login request with idToken');
    return this.authService.login(idToken);
  }

}