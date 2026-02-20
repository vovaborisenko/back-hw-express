import { Log } from '../types/log';
import { Result, ResultStatus } from '../../core/types/result-object';
import { LogsRepository } from '../repositiories/logs.repository';
import { inject, injectable } from 'inversify';

@injectable()
export class LogsService {
  constructor(
    @inject(LogsRepository) private readonly logsRepository: LogsRepository,
  ) {}

  async create(log: Log): Promise<Result<string>> {
    const logId = await this.logsRepository.create(log);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: logId,
    };
  }
}
