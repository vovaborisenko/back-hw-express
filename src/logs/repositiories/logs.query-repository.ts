import { injectable } from 'inversify';
import { LogModel } from '../models/log.model';

@injectable()
export class LogsQueryRepository {
  async countByIpUrlPeriod(
    ip: string,
    url: string,
    period: number,
  ): Promise<number> {
    const dateLimit = new Date(Date.now() - period);

    const count = await LogModel.countDocuments({
      ip,
      url,
      createdAt: { $gte: dateLimit },
    }).exec();

    return count;
  }
}
