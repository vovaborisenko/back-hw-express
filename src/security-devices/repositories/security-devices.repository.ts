import { WithId } from 'mongodb';
import { SecurityDevice } from '../types/security-device';
import { injectable } from 'inversify';
import {
  SecurityDeviceDocument,
  SecurityDeviceModel,
} from '../models/security-device.model';
import { QueryFilter, Types } from 'mongoose';

@injectable()
export class SecurityDevicesRepository {
  async save(document: SecurityDeviceDocument): Promise<void> {
    await document.save();
  }

  async create(securityDevice: SecurityDevice): Promise<string> {
    const deviceModel = new SecurityDeviceModel(securityDevice);
    const result = await deviceModel.save();

    return result.id;
  }

  async update(
    filter: Partial<SecurityDevice>,
    securityDevice: Partial<SecurityDevice>,
  ): Promise<string | undefined> {
    const result = await SecurityDeviceModel.updateOne(filter, {
      $set: securityDevice,
    });

    return result.upsertedId?.toString();
  }

  async deleteBy(
    device: Partial<Omit<SecurityDevice, 'userId'> & { userId: string }>,
  ): Promise<boolean> {
    const { userId, ...rest } = device;

    const filter: QueryFilter<SecurityDevice> = rest;

    if (userId !== undefined) {
      filter.userId = new Types.ObjectId(userId);
    }

    const deletedResult = await SecurityDeviceModel.deleteOne(filter);

    return deletedResult.deletedCount > 0;
  }

  async deleteOthersByUser({
    deviceId,
    userId,
  }: {
    deviceId: string;
    userId: string;
  }): Promise<boolean> {
    const deletedResult = await SecurityDeviceModel.deleteMany({
      userId: new Types.ObjectId(userId),
      deviceId: { $ne: deviceId },
    });

    return deletedResult.deletedCount > 0;
  }

  findById(id: string): Promise<SecurityDeviceDocument | null> {
    return SecurityDeviceModel.findById(id);
  }

  findBy(
    device: Partial<Omit<SecurityDevice, 'userId'> & { userId: string }>,
  ): Promise<SecurityDeviceDocument | null> {
    const { userId, ...rest } = device;

    const filter: QueryFilter<SecurityDevice> = rest;

    if (userId !== undefined) {
      filter.userId = new Types.ObjectId(userId);
    }

    return SecurityDeviceModel.findOne(filter);
  }
}
