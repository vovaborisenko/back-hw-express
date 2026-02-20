import type { NextFunction, Request, Response } from 'express';
import { container } from '../../composition.root';
import { JwtService } from '../../auth/application/jwt.service';

const jwtService = container.get(JwtService);

export function optionalUserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [authType, token] = req.headers.authorization?.split(' ') || [];

  if (authType !== 'Bearer') {
    next();

    return;
  }

  const payload = jwtService.verifyToken(token);

  if (payload) {
    req.user = {
      id: payload.userId,
    };
  }

  next();
}
