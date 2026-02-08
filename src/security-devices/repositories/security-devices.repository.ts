import { Filter, ObjectId, WithId } from 'mongodb';
import { SecurityDevice } from '../types/security-device';
import { securityDeviceCollection } from '../../db/mongo.db';

export const securityDevicesRepository = {
  async create(securityDevice: SecurityDevice): Promise<string> {
    const insertedResult =
      await securityDeviceCollection.insertOne(securityDevice);

    return insertedResult.insertedId.toString();
  },
  async update(
    filter: Partial<SecurityDevice>,
    securityDevice: Partial<SecurityDevice>,
  ): Promise<string | undefined> {
    const result = await securityDeviceCollection.updateOne(filter, {
      $set: securityDevice,
    });

    return result.upsertedId?.toString();
  },

  async deleteBy(
    device: Partial<Omit<SecurityDevice, 'userId'> & { userId: string }>,
  ): Promise<boolean> {
    const { userId, ...rest } = device;

    const filter: Filter<SecurityDevice> = rest;

    if (userId !== undefined) {
      filter.userId = new ObjectId(userId);
    }

    const deletedResult = await securityDeviceCollection.deleteOne(filter);

    return deletedResult.deletedCount > 0;
  },

  async deleteOthersByUser({
    deviceId,
    userId,
  }: {
    deviceId: string;
    userId: string;
  }): Promise<boolean> {
    const deletedResult = await securityDeviceCollection.deleteMany({
      userId: new ObjectId(userId),
      deviceId: { $ne: deviceId },
    });

    return deletedResult.deletedCount > 0;
  },

  findById(id: string): Promise<WithId<SecurityDevice> | null> {
    return securityDeviceCollection.findOne({
      _id: new ObjectId(id),
    });
  },

  findBy(
    device: Partial<Omit<SecurityDevice, 'userId'> & { userId: string }>,
  ): Promise<WithId<SecurityDevice> | null> {
    const { userId, ...rest } = device;

    const filter: Filter<SecurityDevice> = rest;

    if (userId !== undefined) {
      filter.userId = new ObjectId(userId);
    }

    return securityDeviceCollection.findOne(filter);
  },
};
