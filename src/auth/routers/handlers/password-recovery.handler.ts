import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { PasswordService } from '../../application/password.service';
import { PasswordRecoveryDto } from '../../dto/password-recovery.dto';

export function createPasswordRecoveryHandler(
  passwordService: PasswordService,
): RequestHandler<{}, undefined, PasswordRecoveryDto> {
  return async function (req, res) {
    await passwordService.sendRecoveryCode(req.body.email);

    res.sendStatus(HttpStatus.NoContent);
  };
}
