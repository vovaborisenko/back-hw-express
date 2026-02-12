import { Result, ResultStatus } from '../../core/types/result-object';
import { AgentDetails } from 'express-useragent';
import { WithId } from 'mongodb';
import { User } from '../../users/types/user';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { EmailService } from './email.service';
import { EmailManager } from './email.manager';
import { UserEntity } from '../../users/application/user.entity';
import { SecurityDevicesService } from '../../security-devices/application/security-devices.service';
import { UsersRepository } from '../../users/repositories/users.repository';
import { UsersService } from '../../users/application/users.service';
import { RegistrationDto } from '../dto/registration.dto';
import { RefreshTokenUpdateDto } from '../dto/refresh-token.update-dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly emailService: EmailService,
    private readonly emailManager: EmailManager,
    private readonly securityDevicesService: SecurityDevicesService,
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async login(
    loginOrEmail: string,
    password: string,
    reqData: {
      ip?: string;
      useragent?: AgentDetails;
    },
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

    const { data } = await this.jwtService.generateTokens(
      result.data._id.toString(),
    );
    const refreshTokenPayload = this.jwtService.decodeRefreshToken(
      data.refreshToken,
    );
    await this.securityDevicesService.create({
      ip: reqData.ip,
      refreshToken: refreshTokenPayload,
      useragent: reqData.useragent,
    });

    return {
      status: ResultStatus.Success,
      extensions: [],
      data,
    };
  }

  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<
    | Result<WithId<User>>
    | Result<null, ResultStatus.NotFound | ResultStatus.BadRequest>
  > {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
        data: null,
      };
    }

    const isPasswordCorrect = await this.bcryptService.compare(
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
  }

  async registration(
    dto: RegistrationDto,
  ): Promise<Result<null, ResultStatus.Success | ResultStatus.BadRequest>> {
    const result = await this.usersService.create(dto);

    if (result.status !== ResultStatus.Success) {
      return result;
    }

    this.emailService
      .sendEmail(
        dto.email,
        this.emailManager.emailConfirmation(
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
  }

  async resendConfirmationCode(
    dto: RegistrationEmailResendingDto,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.BadRequest | ResultStatus.ServerError
    >
  > {
    const user = await this.usersRepository.findByEmail(dto.email);

    if (!user || user?.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email is already confirmed' }],
        data: null,
      };
    }

    if (user) {
      const newEmailConfirmation = UserEntity.generateEmailConfirmationData();
      const isUpdated = await this.usersRepository.update(user._id.toString(), {
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

      this.emailService
        .sendEmail(
          dto.email,
          this.emailManager.emailConfirmation(
            newEmailConfirmation.confirmationCode,
          ),
          'Confirm email',
        )
        .catch((error) => console.warn(error));
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async confirmCode(
    dto: RegistrationConfirmationDto,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.BadRequest | ResultStatus.ServerError
    >
  > {
    const user = await this.usersRepository.findByEmailConfirmationCode(
      dto.code,
    );

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

    const isUpdated = await this.usersRepository.update(user._id.toString(), {
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
  }
  async regenerateTokens({
    deviceId,
    userId,
    issuedAt,
  }: RefreshTokenUpdateDto): Promise<
    Result<{ accessToken: string; refreshToken: string }>
  > {
    const { data } = await this.jwtService.generateTokens(userId, deviceId);
    const refreshTokenPayload = this.jwtService.decodeRefreshToken(
      data.refreshToken,
    );

    await this.securityDevicesService.update(
      { deviceId, issuedAt },
      {
        refreshToken: refreshTokenPayload,
      },
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data,
    };
  }
}
