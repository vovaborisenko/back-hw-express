import { RequestHandler } from 'express';
import { LoginDto } from '../../dto/login.dto';
import { HttpStatus } from '../../../core/types/http-status';
import { AuthService } from '../../application/auth.service';
import { ResultStatus } from '../../../core/types/result-object';
import { resultStatusToHttpStatus } from '../../../core/utils/result-status-to-http-status';
import { createErrorMessages } from '../../../core/utils/create-error-message';
import { ErrorMessages } from '../../../core/types/validation';
import { Cookies } from '../../../core/cookies/cookies';

export function createLoginHandler(
  authService: AuthService,
): RequestHandler<{}, ErrorMessages | { accessToken: string }, LoginDto> {
  return async function (req, res) {
    const result = await authService.login(
      req.body.loginOrEmail,
      req.body.password,
      {
        ip: req.ip,
        useragent: req.useragent,
      },
    );

    if (result.status !== ResultStatus.Success) {
      res
        .status(resultStatusToHttpStatus(result.status))
        .send(createErrorMessages(result.extensions));

      return;
    }

    res.cookie(Cookies.RefreshToken, result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.status(HttpStatus.Ok).send({ accessToken: result.data.accessToken });
  };
}
