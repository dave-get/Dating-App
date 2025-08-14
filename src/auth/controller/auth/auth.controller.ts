import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  googleLogin(@Body() body: { idToken: string }) {
    const { idToken } = body;
    return this.authService.verifyGoogleIdToken(idToken);
  }
}
