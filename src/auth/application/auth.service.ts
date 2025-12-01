import { Result, ResultStatus } from '../../core/types/result-object';
import { WithId } from 'mongodb';
import { User } from '../../users/types/user';
import { usersService } from '../../users/application/users.service';
import { usersRepository } from '../../users/repositories/users.repository';
import { bcryptService } from './bcrypt.service';
import { jwtService } from './jwt.service';
import { emailService } from './email.service';
import { emailManager } from './email.manager';
import { RegistrationDto } from '../dto/registration.dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { UserEntity } from '../../users/application/user.entity';

export const authService = {
  async login(
    loginOrEmail: string,
    password: string,
  ): Promise<
    | Result<{ accessToken: string; refreshToken: string }>
    | Result<null, ResultStatus.Unauthorised>
  > {
    const result = await this.checkCredentials(loginOrEmail, password);

    if (result.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.Unauthorised,
        extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
        data: null,
      };
    }

    const { data } = await jwtService.generateTokens(
      result.data._id.toString(),
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data,
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

  async registration(
    dto: RegistrationDto,
  ): Promise<Result<null, ResultStatus.Success | ResultStatus.BadRequest>> {
    const result = await usersService.create(dto);

    if (result.status !== ResultStatus.Success) {
      return result;
    }

    emailService
      .sendEmail(
        dto.email,
        emailManager.emailConfirmation(
          result.data.user.emailConfirmation.confirmationCode,
        ),
        'Confirm email',
      )
      .catch((error) => console.warn(error));

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },

  async resendConfirmationCode(
    dto: RegistrationEmailResendingDto,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.BadRequest | ResultStatus.ServerError
    >
  > {
    const user = await usersRepository.findByEmail(dto.email);

    if (!user || user?.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email is already confirmed' }],
        data: null,
      };
    }

    if (user) {
      const newEmailConfirmation = UserEntity.generateEmailConfirmationData();
      const isUpdated = await usersRepository.update(user._id.toString(), {
        emailConfirmation: newEmailConfirmation,
      });

      if (!isUpdated) {
        return {
          status: ResultStatus.ServerError,
          errorMessage: "Can't update user",
          extensions: [],
          data: null,
        };
      }

      emailService
        .sendEmail(
          dto.email,
          emailManager.emailConfirmation(newEmailConfirmation.confirmationCode),
          'Confirm email',
        )
        .catch((error) => console.warn(error));
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },

  async confirmCode(
    dto: RegistrationConfirmationDto,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.BadRequest | ResultStatus.ServerError
    >
  > {
    const user = await usersRepository.findByEmailConfirmationCode(dto.code);

    if (
      !user ||
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.expirationDate.valueOf() < Date.now()
    ) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'code is invalid' }],
        data: null,
      };
    }

    const isUpdated = await usersRepository.update(user._id.toString(), {
      emailConfirmation: {
        ...user.emailConfirmation,
        isConfirmed: true,
      },
    });

    if (!isUpdated) {
      return {
        status: ResultStatus.ServerError,
        errorMessage: "Can't update user",
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },
};
