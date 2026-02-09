import { UserCreateDto } from '../dto/user.create-dto';
import { UsersRepository } from '../repositories/users.repository';
import { BcryptService } from '../../auth/application/bcrypt.service';
import { UserEntity } from './user.entity';
import { Result, ResultStatus } from '../../core/types/result-object';

export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptService: BcryptService,
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

  delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
  }
}
