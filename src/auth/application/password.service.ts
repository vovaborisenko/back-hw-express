import { UsersService } from '../../users/application/users.service';
import { EmailService } from './email.service';
import { EmailManager } from './email.manager';
import { Result, ResultStatus } from '../../core/types/result-object';
import { BcryptService } from './bcrypt.service';
import { PasswordUpdateDto } from '../dto/password-update.dto';
import { inject, injectable } from 'inversify';

@injectable()
export class PasswordService {
  constructor(
    @inject(UsersService) private readonly usersService: UsersService,
    @inject(BcryptService) private readonly bcryptService: BcryptService,
    @inject(EmailService) private readonly emailService: EmailService,
    @inject(EmailManager) private readonly emailManager: EmailManager,
  ) {}

  async changePasswordByRecoveryCode({
    newPassword,
    recoveryCode,
  }: PasswordUpdateDto): Promise<
    Result | Result<null, ResultStatus.BadRequest>
  > {
    const passwordHash = await this.bcryptService.createHash(newPassword);

    return this.usersService.updateByRecoveryCode(recoveryCode, passwordHash);
  }

  async sendRecoveryCode(
    email: string,
  ): Promise<Result | Result<null, ResultStatus.NotFound>> {
    const recovery = this.usersService.generateRecovery();

    const resultUpdate = await this.usersService.updateBy(
      { email },
      { recovery },
    );

    if (resultUpdate.status !== ResultStatus.Success) {
      return {
        status: ResultStatus.NotFound,
        extensions: [],
        data: null,
      };
    }

    this.emailService
      .sendEmail(
        email,
        this.emailManager.passwordRecovery(recovery.code),
        'Password recovery',
      )
      .catch((error) => console.warn(error));

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
}
