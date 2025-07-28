import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['profile', 'email'],
      passReqToCallback: false, // Явно указываем, что req не нужен
    } as StrategyOptions);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    console.log('[GoogleStrategy] Validating profile:', profile);
    if (!profile.emails || profile.emails.length === 0) {
      throw new Error('No email provided by Google profile');
    }
    const user = await this.authService.validateGoogleUser({
      id: profile.id,
      emails: profile.emails.map((email) => ({ value: email.value })),
      displayName: profile.displayName || '',
    });
    return user;
  }
}