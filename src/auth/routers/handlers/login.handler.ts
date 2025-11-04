import { Request, Response } from 'express';
import { LoginDto } from '../../dto/login.dto';
import { HttpStatus } from '../../../core/types/http-status';
import { usersService } from '../../../users/application/users.service';

export async function loginHandler(
  req: Request<{}, {}, LoginDto>,
  res: Response,
): Promise<void> {
  const isValid = await usersService.checkCredentials(
    req.body.loginOrEmail,
    req.body.password,
  );

  if (isValid) {
    res.sendStatus(HttpStatus.NoContent);

    return;
  }

  res.sendStatus(HttpStatus.Unauthorized);
}
