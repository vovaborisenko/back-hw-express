import type { NextFunction, Request, Response } from 'express';
import { header, validationResult } from 'express-validator';
import { HttpStatus } from '../../types/http-status';
import { SETTINGS } from '../../settings/settings';

const headerAuthValidationChain = header('authorization')
  .matches(/^Basic\s[a-zA-Z0-9]+$/)
  .bail({ level: 'request' })
  .custom((value: string) => {
    const [, token] = value.split(' ');
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    return (
      username === SETTINGS.ADMIN_USERNAME &&
      password === SETTINGS.ADMIN_PASSWORD
    );
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
