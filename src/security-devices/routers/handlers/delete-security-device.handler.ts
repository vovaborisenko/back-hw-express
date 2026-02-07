import { Request, Response } from 'express';
import { securityDevicesService } from '../../application/security-devices.service';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';
import { ResultStatus } from '../../../core/types/result-object';
import { HttpStatus } from '../../../core/types/http-status';

export async function deleteSecurityDeviceHandler(
  req: Request,
  res: Response,
): Promise<void> {
  const deviceId = req.params.id;
  const userId = req.user!.id;

  const result = await securityDevicesService.delete(deviceId, userId);

  if (result.status !== ResultStatus.Success) {
    res.sendStatus(resultStatusToHttpStatus(result.status));
    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
