import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../../service/auth/auth.service';
import { GoogleAuthGuard } from 'src/auth/guards/google-auth/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}


  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback() {}
}
