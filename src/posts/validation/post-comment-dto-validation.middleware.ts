import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const postCommentDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('content', { min: 20, max: 300 }),
];
