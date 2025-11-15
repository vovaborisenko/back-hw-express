import { ResultStatus } from '../types/result-object';
import { HttpStatus } from '../types/http-status';

const mapResultStatusToHttpStatus = {
  [ResultStatus.BadRequest]: HttpStatus.BadRequest,
  [ResultStatus.Forbidden]: HttpStatus.Forbidden,
  [ResultStatus.NotFound]: HttpStatus.NotFound,
  [ResultStatus.Unauthorised]: HttpStatus.Unauthorized,
  [ResultStatus.Success]: HttpStatus.Ok,
} satisfies Partial<Record<ResultStatus, HttpStatus>>;

export function resultStatusToHttpStatus<T extends ResultStatus>(
  resultStatus: T,
) {
  return (
    mapResultStatusToHttpStatus[resultStatus] || HttpStatus.InternalServerError
  );
}
