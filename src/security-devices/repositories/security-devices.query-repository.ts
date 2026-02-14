import { ObjectId, WithId } from 'mongodb';
import { SecurityDevice } from '../types/security-device';
import { securityDeviceCollection } from '../../db/mongo.db';
import { injectable } from 'inversify';

@injectable()
export class SecurityDevicesQueryRepository {
  findActiveByUserId(userId: string): Promise<WithId<SecurityDevice>[]> {
    return securityDeviceCollection
      .find({
        userId: new ObjectId(userId),
        expiredAt: { $gte: new Date() },
      })
      .toArray();
  }
}
