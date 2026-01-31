import jsonwebtoken from 'jsonwebtoken';
import { SETTINGS } from '../../core/settings/settings';
import { TokenPayload } from '../types/auth';
import { Result, ResultStatus } from '../../core/types/result-object';
import { tokenRepository } from '../repositories/token-repository';

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
  createRefreshToken(userId: string): string {
    return jsonwebtoken.sign({ userId }, SETTINGS.REFRESH_SECRET, {
      expiresIn: Number(SETTINGS.REFRESH_TIME),
    });
  },
  async generateTokens(
    userId: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const accessToken = this.createToken(userId);
    const refreshToken = this.createRefreshToken(userId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        accessToken,
        refreshToken,
      },
    };
  },
  async regenerateToken(
    userId: string,
    token: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    await this.saveRefreshToken(userId, token);

    return this.generateTokens(userId);
  },
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<Result<null, ResultStatus.Success | ResultStatus.BadRequest>> {
    const payload = jsonwebtoken.decode(refreshToken, { json: true });
    const insertedId = await tokenRepository.insertToken(
      refreshToken,
      userId,
      new Date((payload?.exp || 0) * 1e3),
    );

    if (insertedId) {
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.BadRequest,
      extensions: [],
      data: null,
    };
  },
  async isTokenUsed(token: string): Promise<boolean> {
    const refreshToken = await tokenRepository.findToken(token);

    return Boolean(refreshToken);
  },
  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jsonwebtoken.verify(
        token,
        SETTINGS.REFRESH_SECRET,
      ) as TokenPayload;
    } catch {
      return null;
    }
  },
};
