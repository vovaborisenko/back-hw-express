import { Router } from 'express';
import { paramIdDeviceValidationMiddleware } from '../../core/middlewares/validation/param-id-device-validation.middleware';
import { refreshTokenGuard } from '../../core/middlewares/guard/refresh-token.guard';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { securityDevicesController } from '../../composition.root';

export const securityDevicesRouter = Router({});
securityDevicesRouter.use(refreshTokenGuard);

securityDevicesRouter
  .get('/', securityDevicesController.getItems)
  .delete('/', securityDevicesController.deleteItems)
  .delete(
    '/:id',
    paramIdDeviceValidationMiddleware(),
    reqValidationResultMiddleware,
    securityDevicesController.deleteItem,
  );
