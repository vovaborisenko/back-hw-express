import { AuthService } from '../application/auth.service';
import { PasswordService } from '../application/password.service';
import { SecurityDevicesService } from '../../security-devices/application/security-devices.service';
import { UsersQueryRepository } from '../../users/repositories/users.query-repository';
import { createLoginHandler } from './handlers/login.handler';
import { createLogoutHandler } from './handlers/logout.handler';
import { createMeHandler } from './handlers/me.handler';
import { createRefreshTokenHandler } from './handlers/refresh-token.handler';
import { createRegistrationHandler } from './handlers/registration.handler';
import { createRegistrationConfirmationHandler } from './handlers/registration-confirmation.handler';
import { createRegistrationEmailResendingHandler } from './handlers/registration-email-resending.handler';
import { createPasswordRecoveryHandler } from './handlers/password-recovery.handler';
import { createPasswordUpdateHandler } from './handlers/password-update.handler';
import { inject, injectable } from 'inversify';

@injectable()
export class AuthController {
  readonly login;
  readonly logout;
  readonly me;
  readonly passwordRecovery;
  readonly passwordUpdate;
  readonly refreshToken;
  readonly registration;
  readonly registrationConfirmation;
  readonly registrationEmailResending;

  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(PasswordService) private readonly passwordService: PasswordService,
    @inject(SecurityDevicesService)
    private readonly securityDevicesService: SecurityDevicesService,
    @inject(UsersQueryRepository)
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    this.login = createLoginHandler(this.authService);
    this.logout = createLogoutHandler(this.securityDevicesService);
    this.me = createMeHandler(this.usersQueryRepository);
    this.passwordRecovery = createPasswordRecoveryHandler(this.passwordService);
    this.passwordUpdate = createPasswordUpdateHandler(this.passwordService);
    this.refreshToken = createRefreshTokenHandler(this.authService);
    this.registration = createRegistrationHandler(this.authService);
    this.registrationConfirmation = createRegistrationConfirmationHandler(
      this.authService,
    );
    this.registrationEmailResending = createRegistrationEmailResendingHandler(
      this.authService,
    );
  }
}
