import { Request, Response } from 'express';
import { securityDevicesService } from '../../application/security-devices.service';
import { HttpStatus } from '../../../core/types/http-status';

export async function deleteSecurityDeviceListHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const deviceId = req.device!.id;
  const userId = req.user!.id;

  await securityDevicesService.deleteAllByUser({ deviceId, userId });

  res.sendStatus(HttpStatus.NoContent);
}
