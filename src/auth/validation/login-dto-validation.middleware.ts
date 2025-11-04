import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const loginDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('loginOrEmail'),
  getBodyStringValidationMiddleware('password'),
];
