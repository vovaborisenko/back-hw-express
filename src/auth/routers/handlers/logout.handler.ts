import { Request, Response } from 'express';
import {
  Cookies,
  RefreshTokenCookiesOptions,
} from '../../../core/cookies/cookies';
import { HttpStatus } from '../../../core/types/http-status';
import { ResultStatus } from '../../../core/types/result-object';
import { securityDevicesService } from '../../../composition.root';

export async function logoutHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user!.id;
  const deviceId = req.device!.id;

  const result = await securityDevicesService.deleteOnLogout({
    userId,
    deviceId,
  });

  if (result.status !== ResultStatus.Success) {
    res.sendStatus(HttpStatus.BadRequest);

    return;
  }

  res.clearCookie(Cookies.RefreshToken, RefreshTokenCookiesOptions);
  res.sendStatus(HttpStatus.NoContent);
}
