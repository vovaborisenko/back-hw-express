import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { jwtService } from '../../application/jwt.service';
import { ResultStatus } from '../../../core/types/result-object';

export async function logoutHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const result = await jwtService.saveRefreshToken(
    userId,
    req.cookies.refreshToken,
  );

  if (result.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.BadRequest);

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
