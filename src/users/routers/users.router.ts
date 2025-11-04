import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { getUserListHandler } from './handlers/get-user-list.handler';
import { createUserHandler } from './handlers/create-user.handler';
import { deleteUserHandler } from './handlers/delete-user.handler';
import { userCreateDtoValidationMiddleware } from '../validation/user-create-dto-validation.middleware';

export const usersRouter = Router({});

usersRouter
  .use(superAdminGuardMiddleware)

  .get('/', getUserListHandler)

  .post(
    '/',
    userCreateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    createUserHandler,
  )

  .delete(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    deleteUserHandler,
  );
