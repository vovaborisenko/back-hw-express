import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';
import { URL_REG_EXP } from '../../core/constants/reg-exp';

export const blogDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('name', { max: 15 }),
  getBodyStringValidationMiddleware('description', { max: 500 }),
  getBodyStringValidationMiddleware('websiteUrl', { max: 100 }).matches(
    URL_REG_EXP,
  ),
];
