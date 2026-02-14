import { UserCreateDto } from '../dto/user.create-dto';
import { UsersRepository } from '../repositories/users.repository';
import { BcryptService } from '../../auth/application/bcrypt.service';
import { UserEntity } from './user.entity';
import { Result, ResultStatus } from '../../core/types/result-object';
import { Recovery, User } from '../types/user';
import { inject, injectable } from 'inversify';

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(BcryptService) private readonly bcryptService: BcryptService,
  ) {}

  async create(
    dto: UserCreateDto,
  ): Promise<
    | Result<{ id: string; user: UserEntity }>
    | Result<null, ResultStatus.BadRequest>
  > {
    const userByLogin = await this.usersRepository.findByLogin(dto.login);

    if (userByLogin) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'login', message: 'login should be unique' }],
        data: null,
      };
    }

    const userByEmail = await this.usersRepository.findByEmail(dto.email);

    if (userByEmail) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email should be unique' }],
        data: null,
      };
    }

    const passwordHash = await this.bcryptService.createHash(dto.password);

    const newUser = new UserEntity(dto.login, dto.email, passwordHash);
    const createdId = await this.usersRepository.create(newUser);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { id: createdId, user: newUser },
    };
  }

  async updateBy(
    filter: Partial<User>,
    user: Partial<User>,
  ): Promise<Result | Result<null, ResultStatus.BadRequest>> {
    const isUpdated = await this.usersRepository.updateBy(filter, user);

    return {
      status: isUpdated ? ResultStatus.Success : ResultStatus.BadRequest,
      extensions: [],
      data: null,
    };
  }

  async updateByRecoveryCode(
    code: string,
    passwordHash: string,
  ): Promise<Result | Result<null, ResultStatus.BadRequest>> {
    const isUpdated = await this.usersRepository.updateByRecoveryCode(code, {
      passwordHash,
      recovery: null,
    });

    return {
      status: isUpdated ? ResultStatus.Success : ResultStatus.BadRequest,
      extensions: [],
      data: null,
    };
  }

  delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }

  generateRecovery(): Recovery {
    return {
      expirationDate: new Date(Date.now() + 3.6e6),
      code: crypto.randomUUID(),
    };
  }
}
