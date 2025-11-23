import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const registrationEmailResendingValidationMiddleware = [
  getBodyStringValidationMiddleware('email').matches(
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  ),
];
