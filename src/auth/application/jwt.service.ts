import jsonwebtoken from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings/settings';
import { RefreshTokenPayload, TokenPayload } from '../types/auth';
import { Result, ResultStatus } from '../../core/types/result-object';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export const jwtService = {
  createToken(userId: string): string {
    return jsonwebtoken.sign({ userId }, SETTINGS.AC_SECRET, {
      expiresIn: Number(SETTINGS.AC_TIME),
    });
  },
  verifyToken(token: string): TokenPayload | null {
    try {
      return jsonwebtoken.verify(token, SETTINGS.AC_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  },
  createRefreshToken(dto: RefreshTokenDto): string {
    return jsonwebtoken.sign(dto, SETTINGS.REFRESH_SECRET, {
      expiresIn: Number(SETTINGS.REFRESH_TIME),
    });
  },
  async generateTokens(
    userId: string,
    deviceId: string = crypto.randomUUID(),
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const accessToken = this.createToken(userId);
    const refreshToken = this.createRefreshToken({
      userId,
      deviceId,
    });

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        accessToken,
        refreshToken,
      },
    };
  },
  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jsonwebtoken.verify(
        token,
        SETTINGS.REFRESH_SECRET,
      ) as RefreshTokenPayload;
    } catch {
      return null;
    }
  },
  decodeRefreshToken(token: string): RefreshTokenPayload {
    return jsonwebtoken.decode(token) as RefreshTokenPayload;
  },
};
