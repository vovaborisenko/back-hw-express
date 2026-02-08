import { Log } from '../types/log';
import { Result, ResultStatus } from '../../core/types/result-object';
import { logsRepository } from '../repositiories/logs.repository';

export const logsService = {
  async create(log: Log): Promise<Result<string>> {
    const logId = await logsRepository.create(log);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: logId,
    };
  },
};
