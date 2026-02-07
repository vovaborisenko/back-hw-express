import { logCollection } from '../../db/mongo.db';

export const logsQueryRepository = {
  countByIpUrlPeriod(ip: string, url: string, period: number): Promise<number> {
    const dateLimit = new Date(Date.now() - period);

    return logCollection.countDocuments({
      ip,
      url,
      date: { $gte: dateLimit },
    });
  },
};
