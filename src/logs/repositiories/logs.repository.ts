import { Log } from '../types/log';
import { logCollection } from '../../db/mongo.db';
import { injectable } from 'inversify';

@injectable()
export class LogsRepository {
  async create(log: Log): Promise<string> {
    const insertResult = await logCollection.insertOne(log);

    return insertResult.insertedId.toString();
  }
}
