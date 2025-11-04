import { UserCreateDto } from '../dto/user.create-dto';
import { usersRepository } from '../repositories/users.repository';

export const usersService = {
  create(dto: UserCreateDto): Promise<string> {
    const newUser = {
      login: dto.login,
      email: dto.email,
      password: dto.password,
    };

    return usersRepository.create(newUser);
  },

  delete(id: string): Promise<void> {
    return usersRepository.delete(id);
  },
};
