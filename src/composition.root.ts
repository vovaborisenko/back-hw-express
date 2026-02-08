import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query-repository';
import { UsersService } from './users/application/users.service';
import { UsersController } from './users/routers/users.controller';

export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const usersService = new UsersService(usersRepository);
export const usersController = new UsersController(
  usersService,
  usersQueryRepository,
);
