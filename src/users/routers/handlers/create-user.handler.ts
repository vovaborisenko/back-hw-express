import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { UserViewModel } from '../../types/user.view-model';
import { mapToUserViewModel } from '../mappers/map-to-user-view-model';
import { UserCreateDto } from '../../dto/user.create-dto';
import { usersService } from '../../application/users.service';
import { usersQueryRepository } from '../../repositories/users.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';

export async function createUserHandler(
  req: Request<{}, {}, UserCreateDto>,
  res: Response<UserViewModel>,
): Promise<void> {
  const createdUserId = await usersService.create(req.body);
  const createdUser = await usersQueryRepository.findById(createdUserId);

  if (!createdUser) {
    throw new NotExistError('User');
  }

  res.status(HttpStatus.Created).json(mapToUserViewModel(createdUser));
}
