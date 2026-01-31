import { ReqUser } from '../../auth/types/auth';

declare module 'express' {
  // Inject additional properties on express.Request
  interface Request {
    user?: ReqUser;
  }
}

export {};
