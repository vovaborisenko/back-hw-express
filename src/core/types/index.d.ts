import { ReqDevice, ReqUser } from '../../auth/types/auth';

declare global {
  namespace Express {
    interface Request {
      user?: ReqUser;
      device?: ReqDevice;
    }
  }
}

export {};
