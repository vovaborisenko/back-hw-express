import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { jwtService } from '../../application/jwt.service';
import { Cookies } from '../../../core/cookies/cookies';

export async function refreshTokenHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const { refreshToken } = req.cookies;

  const { data } = await jwtService.regenerateToken(userId, refreshToken);

  res.cookie(Cookies.RefreshToken, data.refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.status(HttpStatus.Ok).send({
    accessToken: data.accessToken,
  });
}
