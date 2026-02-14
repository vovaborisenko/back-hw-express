import { UsersService } from '../application/users.service';
import { UsersQueryRepository } from '../repositories/users.query-repository';
import { createCreateUserHandler } from './handlers/create-user.handler';
import { createDeleteUserHandler } from './handlers/delete-user.handler';
import { createGetUserListHandler } from './handlers/get-user-list.handler';
import { inject, injectable } from 'inversify';

@injectable()
export class UsersController {
  readonly getItems;
  readonly createItem;
  readonly deleteItem;

  constructor(
    @inject(UsersService) private readonly usersService: UsersService,
    @inject(UsersQueryRepository)
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
