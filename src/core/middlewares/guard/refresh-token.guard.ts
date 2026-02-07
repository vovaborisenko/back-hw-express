import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../types/http-status';
import { jwtService } from '../../../auth/application/jwt.service';
import { securityDevicesService } from '../../../security-devices/application/security-devices.service';
import { ResultStatus } from '../../types/result-object';
import { parseJwtTime } from '../../utils/parseJwtTime';

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

  const resultSessionCheck = await securityDevicesService.check(payload);

  if (resultSessionCheck.status !== ResultStatus.Success) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.user = {
    id: payload.userId,
  };
  req.device = {
    id: payload.deviceId,
    issuedAt: parseJwtTime(payload.iat),
  };

  next();
}
