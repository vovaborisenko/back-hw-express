import { param, ValidationChain } from 'express-validator';

export function paramIdDeviceValidationMiddleware(): ValidationChain {
  return param('id').exists().withMessage('ID is required');
}
