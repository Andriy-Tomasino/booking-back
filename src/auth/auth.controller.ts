import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthResponseDto } from './dtos/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserDocument } from '../common/models/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    //Initiates Google flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req): Promise<AuthResponseDto> {
    return req.user; //return AuthResponseDto from GoogleStrategy
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<UserDocument> {
    return this.authService.getProfile(req.user._id);
  }
}
