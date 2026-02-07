import { ObjectId } from 'mongodb';

export interface SecurityDevice {
  deviceId: string;
  deviceName: string;
  expiredAt: Date;
  ip: string;
  issuedAt: Date;
  userId: ObjectId;
}
