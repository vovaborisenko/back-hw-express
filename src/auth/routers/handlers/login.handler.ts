import { Request, Response } from 'express';
import { LoginDto } from '../../dto/login.dto';
import { HttpStatus } from '../../../core/types/http-status';

export function loginHandler(
  req: Request<{}, {}, LoginDto>,
  res: Response,
): void {
  res.sendStatus(HttpStatus.Unauthorized);
}
