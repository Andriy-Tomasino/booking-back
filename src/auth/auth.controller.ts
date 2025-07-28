import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dtos/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string): Promise<AuthResponseDto> {
    return this.authService.validateGoogleIdToken(idToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req): Promise<AuthResponseDto> {
    return this.authService.getProfile(req.user.sub);
  }
}