import { logCollection } from '../../db/mongo.db';
import { injectable } from 'inversify';

@injectable()
export class LogsQueryRepository {
  countByIpUrlPeriod(ip: string, url: string, period: number): Promise<number> {
    const dateLimit = new Date(Date.now() - period);

    return logCollection.countDocuments({
      ip,
      url,
      date: { $gte: dateLimit },
    });
  }
}
