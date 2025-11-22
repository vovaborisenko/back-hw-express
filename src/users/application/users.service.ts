import { UserCreateDto } from '../dto/user.create-dto';
import { usersRepository } from '../repositories/users.repository';
import { ValidationError } from '../../core/types/validation';
import { bcryptService } from '../../auth/application/bcrypt.service';

export const usersService = {
  async create(dto: UserCreateDto): Promise<string | ValidationError> {
    const userByLogin = await usersRepository.findByLogin(dto.login);

    if (userByLogin) {
      return { field: 'login', message: 'login should be unique' };
    }

    const userByEmail = await usersRepository.findByEmail(dto.email);

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

  delete(id: string): Promise<void> {
    return usersRepository.delete(id);
  },
};
