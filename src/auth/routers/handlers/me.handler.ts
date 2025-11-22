import { Request, Response } from 'express';
import { ErrorMessages } from '../../../core/types/validation';
import { MeViewModel } from '../../types/me.view-model';
import { HttpStatus } from '../../../core/types/http-status';
import { usersQueryRepository } from '../../../users/repositories/users.query-repository';
import { mapToMeViewModel } from '../mappers/map-to-me-view-model';

export async function meHandler(
  req: Request,
  res: Response<ErrorMessages | MeViewModel>,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  const user = await usersQueryRepository.findById(userId);

  if (!user) {
    res.sendStatus(HttpStatus.Unauthorized);

    return;
  }

  res.status(HttpStatus.Ok).send(mapToMeViewModel(user));
}
