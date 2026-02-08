import { SecurityDevicesRepository } from './security-devices/repositories/security-devices.repository';
import { SecurityDevicesQueryRepository } from './security-devices/repositories/security-devices.query-repository';
import { SecurityDevicesService } from './security-devices/application/security-devices.service';
import { SecurityDevicesController } from './security-devices/routers/security-devices.controller';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query-repository';
import { UsersService } from './users/application/users.service';
import { UsersController } from './users/routers/users.controller';

export const securityDevicesRepository = new SecurityDevicesRepository();
export const securityDevicesQueryRepository =
  new SecurityDevicesQueryRepository();
export const securityDevicesService = new SecurityDevicesService(
  securityDevicesRepository,
);
export const securityDevicesController = new SecurityDevicesController(
  securityDevicesService,
  securityDevicesQueryRepository,
);
export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const usersService = new UsersService(usersRepository);
export const usersController = new UsersController(
  usersService,
  usersQueryRepository,
);
