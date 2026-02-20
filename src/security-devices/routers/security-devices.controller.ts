import { SecurityDevicesService } from '../application/security-devices.service';
import { SecurityDevicesQueryRepository } from '../repositories/security-devices.query-repository';
import { createGetSecurityDeviceListHandler } from './handlers/get-security-device-list.handler';
import { createDeleteSecurityDeviceListHandler } from './handlers/delete-security-device-list.handler';
import { createDeleteSecurityDeviceHandler } from './handlers/delete-security-device.handler';
import { inject, injectable } from 'inversify';

@injectable()
export class SecurityDevicesController {
  readonly getItems;
  readonly deleteItem;
  readonly deleteItems;

  constructor(
    @inject(SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(SecurityDevicesQueryRepository)
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
