import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { PasswordService } from '../../application/password.service';
import { PasswordUpdateDto } from '../../dto/password-update.dto';
import { ResultStatus } from '../../../core/types/result-object';

export function createPasswordUpdateHandler(
  passwordService: PasswordService,
): RequestHandler<{}, undefined, PasswordUpdateDto> {
  return async function (req, res) {
    const result = await passwordService.changePasswordByRecoveryCode(req.body);

    if (result.status !== ResultStatus.Success) {
      res.sendStatus(HttpStatus.BadRequest);

      return;
    }

    res.sendStatus(HttpStatus.NoContent);
  };
}
