import { SecurityDevice } from '../types/security-device';
import { injectable } from 'inversify';
import { SecurityDeviceModel } from '../models/security-device.model';
import { Types } from 'mongoose';
import { SecurityDeviceViewModel } from '../types/security-device.view-model';

@injectable()
export class SecurityDevicesQueryRepository {
  async findActiveByUserId(userId: string): Promise<SecurityDeviceViewModel[]> {
    const items = await SecurityDeviceModel.find({
      userId: new Types.ObjectId(userId),
      expiredAt: { $gte: new Date() },
    }).lean();

    return items.map(this.mapToSecurityDeviceViewModel);
  }

  mapToSecurityDeviceViewModel(
    device: SecurityDevice,
  ): SecurityDeviceViewModel {
    return {
      deviceId: device.deviceId,
      ip: device.ip,
      lastActiveDate: device.issuedAt.toISOString(),
      title: device.deviceName,
    };
  }
}
