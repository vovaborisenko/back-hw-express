import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../types/http-status';
import { jwtService } from '../../../composition.root';

export function accessTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.headers.authorization) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const [authType, token] = req.headers.authorization.split(' ');

  if (authType !== 'Bearer') {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = jwtService.verifyToken(token);

  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.user = {
    id: payload.userId,
  };

  next();
}
