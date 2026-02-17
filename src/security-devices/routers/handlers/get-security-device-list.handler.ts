import { RequestHandler } from 'express';
import { SecurityDevicesQueryRepository } from '../../repositories/security-devices.query-repository';
import { HttpStatus } from '../../../core/types/http-status';
import { SecurityDeviceViewModel } from '../../types/security-device.view-model';
import { mapToSecurityDeviceViewModel } from '../mappers/map-to-security-device-view-model';

export function createGetSecurityDeviceListHandler(
  securityDevicesQueryRepository: SecurityDevicesQueryRepository,
): RequestHandler<{}, SecurityDeviceViewModel[]> {
  return async function (req, res) {
    const userId = req.user?.id;

    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);

      return;
    }

    const items =
      await securityDevicesQueryRepository.findActiveByUserId(userId);

    res.json(items);
  };
}
