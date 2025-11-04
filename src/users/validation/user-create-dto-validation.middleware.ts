import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const userCreateDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('login', { min: 3, max: 10 }).matches(
    /^[a-z0-9_-]*$/i,
  ),
  getBodyStringValidationMiddleware('password', { min: 6, max: 20 }),
  getBodyStringValidationMiddleware('email', { min: 6 }).matches(
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  ),
];
