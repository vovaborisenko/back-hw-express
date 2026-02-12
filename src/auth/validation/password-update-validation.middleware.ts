import { getBodyStringValidationMiddleware } from '../../core/middlewares/validation/body-string-validation.middleware';

export const passwordUpdateValidationMiddleware = [
  getBodyStringValidationMiddleware('newPassword', { min: 6, max: 20 }),
  getBodyStringValidationMiddleware('recoveryCode').isUUID(),
];
