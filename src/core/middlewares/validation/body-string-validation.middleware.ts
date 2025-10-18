import { MinMaxOptions } from 'express-validator/lib/options';
import { body, ValidationChain } from 'express-validator';

export function getBodyStringValidationMiddleware(
  field: string,
  { min = 1, max = Infinity }: MinMaxOptions = {},
): ValidationChain {
  return body(field)
    .isString()
    .withMessage(`${field} should be string`)
    .trim()
    .isLength({ min, max })
    .withMessage(`Length of ${field} should be between ${min} and ${max}`);
}
