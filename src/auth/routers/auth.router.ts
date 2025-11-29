import { Router } from 'express';
import { loginDtoValidationMiddleware } from '../validation/login-dto-validation.middleware';
import { registrationConfirmationValidationMiddleware } from '../validation/registration-confirmation-validation.middleware';
import { registrationEmailResendingValidationMiddleware } from '../validation/registration-email-resending-validation.middleware';
import { userCreateDtoValidationMiddleware } from '../../users/validation/user-create-dto-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';
import { loginHandler } from './handlers/login.handler';
import { meHandler } from './handlers/me.handler';
import { registrationHandler } from './handlers/registration.handler';
import { registrationConfirmationHandler } from './handlers/registration-confirmation.handler';
import { registrationEmailResendingHandler } from './handlers/registration-email-resending.handler';

export const authRouter = Router({});

authRouter
  .post(
    '/login',
    loginDtoValidationMiddleware,
    reqValidationResultMiddleware,
    loginHandler,
  )
  .get('/me', accessTokenGuard, meHandler)
  .post(
    '/registration',
    userCreateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    registrationHandler,
  )
  .post(
    '/registration-confirmation',
    registrationConfirmationValidationMiddleware,
    reqValidationResultMiddleware,
    registrationConfirmationHandler,
  )
  .post(
    '/registration-email-resending',
    registrationEmailResendingValidationMiddleware,
    reqValidationResultMiddleware,
    registrationEmailResendingHandler,
  );
