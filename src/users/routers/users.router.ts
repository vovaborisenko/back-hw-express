import { Router } from 'express';
import { superAdminGuardMiddleware } from '../../core/middlewares/guard/super-admin-guard.middleware';
import { paramIdValidationMiddleware } from '../../core/middlewares/validation/param-id-validation.middleware';
import { reqValidationResultMiddleware } from '../../core/middlewares/validation/req-validation-result.middleware';
import { usersController } from '../../composition.root';
import { userCreateDtoValidationMiddleware } from '../validation/user-create-dto-validation.middleware';
import { queryUserListValidationMiddleware } from '../validation/query-user-list-validation.middleware';

export const usersRouter = Router({});

usersRouter
  .use(superAdminGuardMiddleware)

  .get(
    '/',
    queryUserListValidationMiddleware,
    reqValidationResultMiddleware,
    usersController.getItems,
  )

  .post(
    '/',
    userCreateDtoValidationMiddleware,
    reqValidationResultMiddleware,
    usersController.createItem,
  )

  .delete(
    '/:id',
    paramIdValidationMiddleware(),
    reqValidationResultMiddleware,
    usersController.deleteItem,
  );
