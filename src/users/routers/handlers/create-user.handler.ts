import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { UserViewModel } from '../../types/user.view-model';
import { UserCreateDto } from '../../dto/user.create-dto';
import { UsersService } from '../../application/users.service';
import { UsersQueryRepository } from '../../repositories/users.query-repository';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ErrorMessages } from '../../../core/types/validation';
import { ResultStatus } from '../../../core/types/result-object';

export function createCreateUserHandler(
  usersService: UsersService,
  usersQueryRepository: UsersQueryRepository,
): RequestHandler<{}, UserViewModel | ErrorMessages, UserCreateDto> {
  return async function (req, res) {
    const result = await usersService.create(req.body);

    if (result.status !== ResultStatus.Success) {
      res
        .status(HttpStatus.BadRequest)
        .json(createErrorMessages(result.extensions));

      return;
    }

    const createdUser = await usersQueryRepository.findById(
      result.data.user.id,
    );

    if (!createdUser) {
      throw new NotExistError('User');
    }

    res.status(HttpStatus.Created).json(createdUser);
  };
}
