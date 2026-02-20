import { Log } from '../types/log';
import { injectable } from 'inversify';
import { LogModel } from '../models/log.model';

@injectable()
export class LogsRepository {
  async create(log: Log): Promise<string> {
    const logModel = new LogModel(log);
    await logModel.save();

    return logModel._id.toString();
  }
}
