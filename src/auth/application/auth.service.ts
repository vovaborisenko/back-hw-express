import { Result, ResultStatus } from '../../core/types/result-object';
import { WithId } from 'mongodb';
import { User } from '../../users/types/user';
import { usersRepository } from '../../users/repositories/users.repository';
import { bcryptService } from './bcrypt.service';
import { jwtService } from './jwt.service';

export const authService = {
  async login(
    loginOrEmail: string,
    password: string,
  ): Promise<
    Result<{ accessToken: string }> | Result<null, ResultStatus.Unauthorised>
  > {
    const result = await this.checkCredentials(loginOrEmail, password);

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorised,
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };
    }

    const accessToken = jwtService.createToken(result.data._id.toString());

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { accessToken },
    };
  },

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<
    | Result<WithId<User>>
    | Result<null, ResultStatus.NotFound | ResultStatus.BadRequest>
  > {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
        data: null,
      };
    }

    const isPasswordCorrect = await bcryptService.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordCorrect) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'password', message: 'Wrong password' }],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: user,
    };
  },
};
