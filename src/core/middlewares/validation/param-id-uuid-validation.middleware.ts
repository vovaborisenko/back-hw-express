import { param, ValidationChain } from 'express-validator';

export function paramIdUuidValidationMiddleware(): ValidationChain {
  return param('id')
    .exists()
    .withMessage('ID is required')
    .isUUID()
    .withMessage('ID is invalid');
}
