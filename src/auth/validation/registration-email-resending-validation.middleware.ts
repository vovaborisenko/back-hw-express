import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';
import { EMAIL_REG_EXP } from '../../core/constants/reg-exp';

export const registrationEmailResendingValidationMiddleware = [
  getBodyStringValidationMiddleware('email').matches(EMAIL_REG_EXP),
];
