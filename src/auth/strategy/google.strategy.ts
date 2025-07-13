import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import googleOauthConfig from 'src/config/google.oauth.config';
import { UserService } from 'src/user/service/user/user.service';

@Injectable()
export class GoogleStraregy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
  ) {
    super({
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackUrl,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, emails, name } = profile;
    const email = emails[0].value;
    const firstname = name.givenName;
    const lastname = name.familyName;

    // Check if user already exists
    let user = await this.userService.findUserByGoogleId(id);
    return await this.userService.registerUserWithGoogle({
      googleId: id,
      email,
      firstname,
      lastname,
      profilePicture: profile.photos[0].value,
      ...profile,
    });
  }
}
