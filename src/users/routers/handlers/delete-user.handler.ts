import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { usersService } from '../../application/users.service';

export async function deleteUserHandler(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  await usersService.delete(req.params.id);

  res.sendStatus(HttpStatus.NoContent);
}
