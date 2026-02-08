import { ObjectId, WithId } from 'mongodb';
import { SecurityDevice } from '../types/security-device';
import { securityDeviceCollection } from '../../db/mongo.db';

export const securityDevicesQueryRepository = {
  findActiveByUserId(userId: string): Promise<WithId<SecurityDevice>[]> {
    return securityDeviceCollection
      .find({
        userId: new ObjectId(userId),
        expiredAt: { $gte: new Date() },
      })
      .toArray();
  },
};
