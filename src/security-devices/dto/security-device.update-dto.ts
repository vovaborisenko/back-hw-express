import { RefreshTokenPayload } from '../../auth/types/auth';

export interface SecurityDeviceUpdateDto {
  refreshToken: RefreshTokenPayload;
}
