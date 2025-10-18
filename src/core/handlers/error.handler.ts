import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../types/http-status';
import { NotExistError } from '../errors/not-exist.error';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof NotExistError) {
    return res.sendStatus(HttpStatus.NotFound);
  }

  next(err);
}
