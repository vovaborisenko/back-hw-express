import { Request, Response } from 'express';
import { ErrorMessages } from '../../../core/types/validation';
import { HttpStatus } from '../../../core/types/http-status';
import { authService } from '../../application/auth.service';
import { ResultStatus } from '../../../core/types/result-object';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { RegistrationEmailResendingDto } from '../../dto/registration-email-resending.dto';

export async function registrationEmailResendingHandler(
  req: Request<{}, {}, RegistrationEmailResendingDto>,
  res: Response<ErrorMessages | undefined>,
): Promise<void> {
  const result = await authService.resendConfirmationCode(req.body);

  if (result.status !== ResultStatus.Success) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages(result.extensions));

    return;
  }

  res.sendStatus(HttpStatus.NoContent);
}
