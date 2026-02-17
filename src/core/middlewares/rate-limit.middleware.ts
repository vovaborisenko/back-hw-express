import type { NextFunction, Request, Response } from 'express';
import { LogsService } from '../../logs/application/logs.service';
import { LogsQueryRepository } from '../../logs/repositiories/logs.query-repository';
import { SETTINGS } from '../settings/settings';
import { HttpStatus } from '../types/http-status';
import { container } from '../../composition.root';

const logsService = container.get(LogsService);
const logsQueryRepository = container.get(LogsQueryRepository);

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

    const count = await logsQueryRepository.countByIpUrlPeriod(ip, url, period);

    if (count >= maxAttempts) {
      res.sendStatus(HttpStatus.TooManyRequests);
      return;
    }

    await logsService.create({
      ip,
      url,
    });

    next();
  };
}
