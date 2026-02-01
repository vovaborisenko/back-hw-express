import type { NextFunction, Request, Response } from 'express';
import { logsService } from '../../logs/application/logs.service';
import { logsQueryRepository } from '../../logs/repositiories/logs.query-repository';
import { SETTINGS } from '../settings/settings';
import { HttpStatus } from '../types/http-status';

export function getRateLimitMiddleware(
  maxAttempts = SETTINGS.RATE_LIMIT_MAX_ATTEMPTS,
  period = SETTINGS.RATE_LIMIT_PERIOD,
) {
  return async function rateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { ip = '', originalUrl: url } = req;

    await logsService.create({
      ip,
      url,
      date: new Date(),
    });

    const count = await logsQueryRepository.countByIpUrlPeriod(ip, url, period);

    if (count > maxAttempts) {
      res.sendStatus(HttpStatus.TooManyRequests);
      return;
    }

    next();
  };
}
