import { param, ValidationChain } from 'express-validator';

export function paramIdValidationMiddleware(): ValidationChain {
  return param('id')
    .exists()
    .withMessage('ID is required')
    .isString()
    .withMessage('ID must be a string')
    .isLength({ min: 1 })
    .withMessage('ID must not be empty');
}
