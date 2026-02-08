import { WithId } from 'mongodb';
import { SecurityDeviceViewModel } from '../../types/security-device.view-model';
import { SecurityDevice } from '../../types/security-device';

export function mapToSecurityDeviceViewModel(
  device: WithId<SecurityDevice>,
): SecurityDeviceViewModel {
  return {
    deviceId: device.deviceId,
    ip: device.ip,
    lastActiveDate: device.issuedAt.toISOString(),
    title: device.deviceName,
  };
}
