import { Log } from '../types/log';
import { logCollection } from '../../db/mongo.db';

export const logsRepository = {
  async create(log: Log): Promise<string> {
    const insertResult = await logCollection.insertOne(log);

    return insertResult.insertedId.toString();
  },
};
