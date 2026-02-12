import { RequestHandler } from 'express';
import {
  Cookies,
  RefreshTokenCookiesOptions,
} from '../../../core/cookies/cookies';
import { HttpStatus } from '../../../core/types/http-status';
import { ResultStatus } from '../../../core/types/result-object';
import { SecurityDevicesService } from '../../../security-devices/application/security-devices.service';

export function createLogoutHandler(
  securityDevicesService: SecurityDevicesService,
): RequestHandler<{}, undefined> {
  return async function (req, res) {
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
  };
}
