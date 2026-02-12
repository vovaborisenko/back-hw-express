import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { createCreateUserHandler } from './handlers/create-user.handler';
import { createDeleteUserHandler } from './handlers/delete-user.handler';
import { createGetUserListHandler } from './handlers/get-user-list.handler';

export class UsersController {
  readonly getItems;
  readonly createItem;
  readonly deleteItem;

  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    this.getItems = createGetUserListHandler(this.usersQueryRepository);
    this.createItem = createCreateUserHandler(
      this.usersService,
      this.usersQueryRepository,
    );
    this.deleteItem = createDeleteUserHandler(this.usersService);
  }
}
