import { Router } from 'express';
import { loginDtoValidationMiddleware } from '../validation/login-dto-validation.middleware';
import { registrationConfirmationValidationMiddleware } from '../validation/registration-confirmation-validation.middleware';
import { registrationEmailResendingValidationMiddleware } from '../validation/registration-email-resending-validation.middleware';
import { userCreateDtoValidationMiddleware } from '../../users/validation/user-create-dto-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';
import { refreshTokenGuard } from '../../core/middlewares/guard/refresh-token.guard';
import { getRateLimitMiddleware } from '../../core/middlewares/rate-limit.middleware';
import { authController } from '../../composition.root';

export const authRouter = Router({});

authRouter
  .post(
    '/login',
    getRateLimitMiddleware(),
    loginDtoValidationMiddleware,
    reqValidationResultMiddleware,
    authController.login,
  )
  .post('/logout', refreshTokenGuard, authController.logout)
  .get('/me', accessTokenGuard, authController.me)
  .post('/refresh-token', refreshTokenGuard, authController.refreshToken)
  .post(
    '/registration',
    getRateLimitMiddleware(),
    userCreateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    authController.registration,
  )
  .post(
    '/registration-confirmation',
    getRateLimitMiddleware(),
    registrationConfirmationValidationMiddleware,
    reqValidationResultMiddleware,
    authController.registrationConfirmation,
  )
  .post(
    '/registration-email-resending',
    getRateLimitMiddleware(),
    registrationEmailResendingValidationMiddleware,
    reqValidationResultMiddleware,
    authController.registrationEmailResending,
  );
