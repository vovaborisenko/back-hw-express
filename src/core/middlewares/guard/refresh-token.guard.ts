import type { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../types/http-status';
import { container } from '../../../composition.root';
import { ResultStatus } from '../../types/result-object';
import { parseJwtTime } from '../../utils/parseJwtTime';
import { JwtService } from '../../../auth/application/jwt.service';
import { SecurityDevicesService } from '../../../security-devices/application/security-devices.service';

const jwtService = container.get(JwtService);
const securityDevicesService = container.get(SecurityDevicesService);

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
