import { param, ValidationChain } from 'express-validator';

export function paramIdValidationMiddleware(): ValidationChain {
  return param('id')
    .exists()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('ID is invalid');
}
