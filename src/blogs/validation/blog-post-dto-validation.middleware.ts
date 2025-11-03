import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const blogPostDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('title', { max: 30 }),
  getBodyStringValidationMiddleware('shortDescription', { max: 100 }),
  getBodyStringValidationMiddleware('content', { max: 1000 }),
];
