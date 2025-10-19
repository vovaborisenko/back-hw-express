import type { NextFunction, Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import { HttpStatus } from '../../types/http-status';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

const headerAuthValidationChain = header('authorization')
  .matches(/^Basic\s[a-zA-Z0-9]+$/)
  .bail({ level: 'request' })
  .custom((value: string) => {
    const [, token] = value.split(' ');
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  });

function validationRequest(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  res.sendStatus(HttpStatus.Unauthorized);
}

export const superAdminGuardMiddleware = [
  headerAuthValidationChain,
  validationRequest,
];
