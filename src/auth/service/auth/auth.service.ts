import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/service/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
  ) {}

}
