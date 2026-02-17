import { RequestHandler } from 'express';
import { ErrorMessages } from '../../../core/types/validation';
import { MeViewModel } from '../../types/me.view-model';
import { HttpStatus } from '../../../core/types/http-status';
import { UsersQueryRepository } from '../../../users/repositories/users.query-repository';

export function createMeHandler(
  usersQueryRepository: UsersQueryRepository,
): RequestHandler<{}, ErrorMessages | MeViewModel> {
  return async function (req, res) {
    const userId = req.user?.id;

    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);

      return;
    }

    const user = await usersQueryRepository.findMeById(userId);

    if (!user) {
      res.sendStatus(HttpStatus.Unauthorized);

      return;
    }

    res.status(HttpStatus.Ok).send(user);
  };
}
