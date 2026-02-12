import { RequestHandler } from 'express';
import { SecurityDevicesService } from '../../application/security-devices.service';
import { HttpStatus } from '../../../core/types/http-status';

export function createDeleteSecurityDeviceListHandler(
  securityDevicesService: SecurityDevicesService,
): RequestHandler<{}, undefined> {
  return async function (req, res): Promise<void> {
    const deviceId = req.device!.id;
    const userId = req.user!.id;

    await securityDevicesService.deleteAllByUser({ deviceId, userId });

    res.sendStatus(HttpStatus.NoContent);
  };
}
