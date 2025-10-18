import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import type { ErrorFormatter } from 'express-validator';
import { HttpStatus } from '../../types/http-status';
import { createErrorMessages } from '../../utils/create-error-message';
import { ValidationError } from '../../types/validation';

const formatter: ErrorFormatter<ValidationError> = (error) => ({
  field: error.type === 'field' ? error.path : 'unknown',
  message: error.msg.toString(),
});

export function reqValidationResultMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.formatWith(formatter).array({ onlyFirstError: true });

  res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
}
