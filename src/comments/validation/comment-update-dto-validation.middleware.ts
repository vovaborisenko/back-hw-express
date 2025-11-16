import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const commentUpdateDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('content', { min: 20, max: 300 }),
];
