import { AgentDetails } from 'express-useragent';
import { RefreshTokenPayload } from '../../auth/types/auth';

export interface SecurityDeviceCreateDto {
  ip?: string;
  refreshToken: RefreshTokenPayload;
  useragent?: AgentDetails;
}
