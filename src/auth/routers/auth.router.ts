import { Router } from 'express';
import { loginDtoValidationMiddleware } from '../validation/login-dto-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { loginHandler } from './handlers/login.handler';

export const authRouter = Router({});

authRouter.post(
  '/login',
  loginDtoValidationMiddleware,
  reqValidationResultMiddleware,
  loginHandler,
);
