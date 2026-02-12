import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { UsersService } from '../../application/users.service';

export function createDeleteUserHandler(
  usersService: UsersService,
): RequestHandler<{ id: string }, undefined> {
  return async function (req, res) {
    await usersService.delete(req.params.id);

    res.sendStatus(HttpStatus.NoContent);
  };
}
