import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { UserViewModel } from '../../types/user.view-model';
import { mapToUserViewModel } from '../mappers/map-to-user-view-model';
import { UserCreateDto } from '../../dto/user.create-dto';
import { usersService } from '../../application/users.service';
import { usersQueryRepository } from '../../repositories/users.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ErrorMessages } from '../../../core/types/validation';

export async function createUserHandler(
  req: Request<{}, {}, UserCreateDto>,
  res: Response<UserViewModel | ErrorMessages>,
): Promise<void> {
  const createdUserIdOrError = await usersService.create(req.body);

  if (typeof createdUserIdOrError !== 'string') {
    res
      .status(HttpStatus.BadRequest)
      .json(createErrorMessages([createdUserIdOrError]));

    return;
  }

  const createdUser = await usersQueryRepository.findById(createdUserIdOrError);

  if (!createdUser) {
    throw new NotExistError('User');
  }

  res.status(HttpStatus.Created).json(mapToUserViewModel(createdUser));
}
