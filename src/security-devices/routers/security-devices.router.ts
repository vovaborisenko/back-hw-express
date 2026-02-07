import { Router } from 'express';
import { paramIdDeviceValidationMiddleware } from '../../core/middlewares/validation/param-id-device-validation.middleware';
import { refreshTokenGuard } from '../../core/middlewares/guard/refresh-token.guard';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { getSecurityDeviceListHandler } from './handlers/get-security-device-list.handler';
import { deleteSecurityDeviceListHandler } from './handlers/delete-security-device-list.handler';
import { deleteSecurityDeviceHandler } from './handlers/delete-security-device.handler';

export const securityDevicesRouter = Router({});
securityDevicesRouter.use(refreshTokenGuard);

securityDevicesRouter
  .get('/', getSecurityDeviceListHandler)
  .delete('/', deleteSecurityDeviceListHandler)
  .delete(
    '/:id',
    paramIdDeviceValidationMiddleware(),
    reqValidationResultMiddleware,
    deleteSecurityDeviceHandler,
  );
