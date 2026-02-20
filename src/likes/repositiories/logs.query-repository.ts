import { injectable } from 'inversify';
import { LogModel } from '../models/log.model';

@injectable()
export class LogsQueryRepository {
  async countByIpUrlPeriod(
    ip: string,
    url: string,
    period: number,
  ): Promise<number> {
    const dateLimit = Date.now() - period;

    return LogModel.countDocuments({
      ip,
      url,
      createdAt: { $gte: dateLimit },
    });
  }
}
