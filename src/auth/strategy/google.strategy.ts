import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import googleOauthConfig from 'src/config/google.oauth.config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { PrismaService } from 'src/prisma/services/prisma/prisma.service';

@Injectable()
export class GoogleStraregy {
  private oauthClient: OAuth2Client;

  constructor(
    @Inject(googleOauthConfig.KEY)
    private readonly googleConfig: ConfigType<typeof googleOauthConfig>,
    private readonly prisma: PrismaService,
  ) {
    this.oauthClient = new OAuth2Client(this.googleConfig.clientId);
  }

  async verifyIdToken(idToken: string) {
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
    console.log('verified email: ', {
      email: payload.email,
      emailVerified: payload.email_verified,
    });

    // Check for existing user by email or phone
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: payload.email,
      },
    });
    if (existingUser) {
      return {verified: payload.email_verified, message: 'User already exists', user: existingUser };
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
