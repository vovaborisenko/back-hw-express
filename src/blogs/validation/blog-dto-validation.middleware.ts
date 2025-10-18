import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const blogDtoValidationMiddleware = [
  getBodyStringValidationMiddleware('name', { max: 15 }),
  getBodyStringValidationMiddleware('description', { max: 500 }),
  getBodyStringValidationMiddleware('websiteUrl', { max: 100 }).matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  ),
];
