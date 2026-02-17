import { Result, ResultStatus } from '../../core/types/result-object';
import { AgentDetails } from 'express-useragent';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { EmailService } from './email.service';
import { EmailManager } from './email.manager';
import { UserDocument } from '../../users/models/user.model';
import { SecurityDevicesService } from '../../security-devices/application/security-devices.service';
import { UsersRepository } from '../../users/repositories/users.repository';
import { UsersService } from '../../users/application/users.service';
import { RegistrationDto } from '../dto/registration.dto';
import { RefreshTokenUpdateDto } from '../dto/refresh-token.update-dto';
import { RegistrationEmailResendingDto } from '../dto/registration-email-resending.dto';
import { RegistrationConfirmationDto } from '../dto/registration-confirmation.dto';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthService {
  constructor(
    @inject(JwtService) private readonly jwtService: JwtService,
    @inject(BcryptService) private readonly bcryptService: BcryptService,
    @inject(EmailService) private readonly emailService: EmailService,
    @inject(EmailManager) private readonly emailManager: EmailManager,
    @inject(SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(UsersService) private readonly usersService: UsersService,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
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
    | Result<UserDocument>
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
    const userDocument = await this.usersRepository.findByEmail(dto.email);

    if (!userDocument || userDocument.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email is already confirmed' }],
        data: null,
      };
    }

    userDocument.emailConfirmation =
      this.usersService.generateEmailConfirmationData();

    this.emailService
      .sendEmail(
        dto.email,
        this.emailManager.emailConfirmation(
          userDocument.emailConfirmation.confirmationCode,
        ),
        'Confirm email',
      )
      .catch((error) => console.warn(error));

    await this.usersRepository.save(userDocument);

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
    const userDocument = await this.usersRepository.findByEmailConfirmationCode(
      dto.code,
    );

    if (
      !userDocument ||
      userDocument.emailConfirmation.isConfirmed ||
      userDocument.emailConfirmation.expirationDate.valueOf() < Date.now()
    ) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'code is invalid' }],
        data: null,
      };
    }

    userDocument.emailConfirmation.isConfirmed = true;

    await this.usersRepository.save(userDocument);

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
