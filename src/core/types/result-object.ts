export enum ResultStatus {
  Success = 1,
  NotFound,
  Forbidden,
  Unauthorised,
  BadRequest,
}

interface Extension {
  field: string;
  message: string;
}

export interface Result<
  TData = null,
  Status extends ResultStatus = ResultStatus.Success,
> {
  status: Status;
  errorMessage?: string;
  extensions: Extension[];
  data: TData;
}
