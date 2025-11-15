import { Router } from 'express';
import { loginDtoValidationMiddleware } from '../validation/login-dto-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { accessTokenGuard } from '../../core/middlewares/guard/access-token.guard';
import { loginHandler } from './handlers/login.handler';
import { meHandler } from './handlers/me.handler';

export const authRouter = Router({});

authRouter
  .post(
    '/login',
    loginDtoValidationMiddleware,
    reqValidationResultMiddleware,
    loginHandler,
  )
  .get('/me', accessTokenGuard, meHandler);
