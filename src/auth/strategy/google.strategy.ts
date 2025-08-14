import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import googleOauthConfig from 'src/config/google.oauth.config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleStraregy {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
  ) {
    this.oauthClient = new OAuth2Client(this.googleConfig.clientId);
  }

  async verifyIdToken(idToken: string): Promise<{
    googleId: string;
    email: string;
    emailVerified: boolean | undefined;
    firstname: string | undefined;
    lastname: string | undefined;
    picture: string | undefined;
    rawPayload: TokenPayload | undefined;
  }> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_WEB_CLIENT_ID,
        process.env.GOOGLE_ANDROID_CLIENT_ID,
        process.env.GOOGLE_IOS_CLIENT_ID,
      ].filter((id): id is string => Boolean(id)),
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Invalid Google ID token payload');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      firstname: payload.given_name,
      lastname: payload.family_name,
      picture: payload.picture,
      rawPayload: payload,
    };
  }
}
