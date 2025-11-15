import { ReqUser } from '../../auth/types/auth';

declare global {
  namespace Express {
    export interface Request {
      user?: ReqUser;
    }
  }
}

export {};
