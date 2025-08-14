import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user/user.service';
import { GoogleStraregy } from '../../strategy/google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly googleStrategy: GoogleStraregy,
  ) {}

  async verifyGoogleIdToken(idToken: string) {
    if (!idToken) {
      throw new HttpException('idToken is required', HttpStatus.BAD_REQUEST);
    }

    const verified = await this.googleStrategy.verifyIdToken(idToken);

    // Optionally create or find user here. Keeping minimal per request.
    return verified;
  }
}
