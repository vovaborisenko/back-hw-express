import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';
import { EMAIL_REG_EXP, LOGIN_REG_EXP } from '../../core/constants/reg-exp';

export const userCreateDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('login', { min: 3, max: 10 }).matches(
    LOGIN_REG_EXP,
  ),
  getBodyStringValidationMiddleware('password', { min: 6, max: 20 }),
  getBodyStringValidationMiddleware('email', { min: 6 }).matches(EMAIL_REG_EXP),
];
