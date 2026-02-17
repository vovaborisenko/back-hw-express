import { Types } from 'mongoose';

export interface SecurityDevice {
  deviceId: string;
  deviceName: string;
  expiredAt: Date;
  ip: string;
  issuedAt: Date;
  userId: Types.ObjectId;
}
