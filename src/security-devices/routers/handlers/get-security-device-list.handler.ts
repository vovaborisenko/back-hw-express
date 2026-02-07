import { Request, Response } from 'express';
import { securityDevicesQueryRepository } from '../../repositories/security-devices.query-repository';
import { HttpStatus } from '../../../core/types/http-status';
import { mapToSecurityDeviceViewModel } from '../mappers/map-to-security-device-view-model';

export async function getSecurityDeviceListHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const items = await securityDevicesQueryRepository.findActiveByUserId(userId);

  res.json(items.map(mapToSecurityDeviceViewModel));
}
