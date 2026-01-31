import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../types/http-status';
import { jwtService } from '../../../auth/application/jwt.service';

export async function refreshTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = jwtService.verifyRefreshToken(refreshToken);

  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const isTokenUsed = await jwtService.isTokenUsed(refreshToken);

  if (isTokenUsed) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.user = {
    id: payload.userId,
  };

  next();
}
