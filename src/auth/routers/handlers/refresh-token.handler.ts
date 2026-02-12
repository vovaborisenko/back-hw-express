import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { AuthService } from '../../application/auth.service';
import {
  Cookies,
  RefreshTokenCookiesOptions,
} from '../../../core/cookies/cookies';

export function createRefreshTokenHandler(
  authService: AuthService,
): RequestHandler<{}, { accessToken: string }> {
  return async function (req, res) {
    const deviceId = req.device!.id;
    const issuedAt = req.device!.issuedAt;
    const userId = req.user!.id;

    const { data } = await authService.regenerateTokens({
      deviceId,
      issuedAt,
      userId,
    });

    res.cookie(
      Cookies.RefreshToken,
      data.refreshToken,
      RefreshTokenCookiesOptions,
    );
    res.status(HttpStatus.Ok).send({
      accessToken: data.accessToken,
    });
  };
}
