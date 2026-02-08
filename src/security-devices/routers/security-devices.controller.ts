import { SecurityDevicesService } from '../application/security-devices.service';
import { SecurityDevicesQueryRepository } from '../repositories/security-devices.query-repository';
import { createGetSecurityDeviceListHandler } from './handlers/get-security-device-list.handler';
import { createDeleteSecurityDeviceListHandler } from './handlers/delete-security-device-list.handler';
import { createDeleteSecurityDeviceHandler } from './handlers/delete-security-device.handler';

export class SecurityDevicesController {
  readonly getItems;
  readonly deleteItem;
  readonly deleteItems;

  constructor(
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {
    this.getItems = createGetSecurityDeviceListHandler(
      this.securityDevicesQueryRepository,
    );
    this.deleteItem = createDeleteSecurityDeviceHandler(
      this.securityDevicesService,
    );
    this.deleteItems = createDeleteSecurityDeviceListHandler(
      this.securityDevicesService,
    );
  }
}
