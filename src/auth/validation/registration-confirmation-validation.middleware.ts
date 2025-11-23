import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const registrationConfirmationValidationMiddleware = [
  getBodyStringValidationMiddleware('code'),
];
