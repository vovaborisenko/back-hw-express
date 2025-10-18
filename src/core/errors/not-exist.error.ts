export class NotExistError extends Error {
  constructor(entityName = 'Entity') {
    super(`${entityName} not exist`);
    this.name = 'NotExistError';

    Error.captureStackTrace(this, this.constructor);
  }
}
