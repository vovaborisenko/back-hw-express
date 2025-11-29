import { Request, Response } from 'express';
import { ErrorMessages } from '../../../core/types/validation';
import { HttpStatus } from '../../../core/types/http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ResultStatus } from '../../../core/types/result-object';
import { RegistrationDto } from '../../dto/registration.dto';
import { authService } from '../../application/auth.service';

export async function registrationHandler(
  req: Request<{}, {}, RegistrationDto>,
  res: Response<ErrorMessages | undefined>,
): Promise<void> {
  const result = await authService.registration(req.body);

  if (result.status !== ResultStatus.Success) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages(result.extensions));

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
