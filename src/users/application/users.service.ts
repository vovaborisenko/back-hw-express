import { UserCreateDto } from '../dto/user.create-dto';
import { usersRepository } from '../repositories/users.repository';
import { usersQueryRepository } from '../repositories/users.query-repository';
import { ValidationError } from '../../core/types/validation';
import { bcryptService } from '../../auth/application/bcrypt.service';

export const usersService = {
  async create(dto: UserCreateDto): Promise<string | ValidationError> {
    const userByLogin = await usersQueryRepository.findByLogin(dto.login);

    if (userByLogin) {
      return { field: 'login', message: 'login should be unique' };
    }

    const userByEmail = await usersQueryRepository.findByEmail(dto.email);

    if (userByEmail) {
      return { field: 'email', message: 'email should be unique' };
    }

    const passwordHash = await bcryptService.createHash(dto.password);

    const newUser = {
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
      createdAt: new Date(),
    };

    return usersRepository.create(newUser);
  },

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await usersQueryRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.passwordHash);
  },

  delete(id: string): Promise<void> {
    return usersRepository.delete(id);
  },
};
