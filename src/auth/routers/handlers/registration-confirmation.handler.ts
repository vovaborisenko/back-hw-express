import { Request, Response } from 'express';
import { ErrorMessages } from '../../../core/types/validation';
import { HttpStatus } from '../../../core/types/http-status';
import { ResultStatus } from '../../../core/types/result-object';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { RegistrationConfirmationDto } from '../../dto/registration-confirmation.dto';
import { authService } from '../../application/auth.service';

export async function registrationConfirmationHandler(
  req: Request<{}, {}, RegistrationConfirmationDto>,
  res: Response<ErrorMessages | undefined>,
): Promise<void> {
  const result = await authService.confirmCode(req.body);

  if (result.status !== ResultStatus.Success) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages(result.extensions));

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
