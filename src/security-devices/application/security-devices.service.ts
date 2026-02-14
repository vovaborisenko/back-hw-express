import { Result, ResultStatus } from '../../core/types/result-object';
import { SecurityDevicesRepository } from '../repositories/security-devices.repository';
import { SecurityDeviceCreateDto } from '../dto/security-device.create-dto';
import { SecurityDeviceCheckDto } from '../dto/security-device.check-dto';
import { ObjectId } from 'mongodb';
import { parseJwtTime } from '../../core/utils/parseJwtTime';
import { SecurityDeviceLogoutDto } from '../dto/security-device.logout-dto';
import { SecurityDeviceDeleteAllDto } from '../dto/security-device.delete-all-dto';
import { SecurityDeviceUpdateDto } from '../dto/security-device.update-dto';
import { inject, injectable } from 'inversify';

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(SecurityDevicesRepository)
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async create({
    ip = '',
    refreshToken,
    useragent,
  }: SecurityDeviceCreateDto): Promise<
    Result<string> | Result<null, ResultStatus.BadRequest>
  > {
    const deviceName = useragent
      ? `${useragent.browser} ${useragent.version}`
      : 'unknown';

    const securityDevice = {
      deviceId: refreshToken.deviceId,
      deviceName,
      expiredAt: parseJwtTime(refreshToken.exp),
      ip,
      issuedAt: parseJwtTime(refreshToken.iat),
      userId: new ObjectId(refreshToken.userId),
    };

    const id = await this.securityDevicesRepository.create(securityDevice);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: id,
    };
  }
  async update(
    filter: { deviceId: string; issuedAt: Date },
    { refreshToken }: SecurityDeviceUpdateDto,
  ): Promise<
    Result<string | undefined> | Result<null, ResultStatus.BadRequest>
  > {
    const securityDevice = {
      expiredAt: parseJwtTime(refreshToken.exp),
      issuedAt: parseJwtTime(refreshToken.iat),
    };

    const id = await this.securityDevicesRepository.update(
      filter,
      securityDevice,
    );

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: id,
    };
  }
  async check({
    deviceId,
    iat,
  }: SecurityDeviceCheckDto): Promise<
    Result | Result<null, ResultStatus.Unauthorised>
  > {
    const securityDevice = await this.securityDevicesRepository.findBy({
      issuedAt: parseJwtTime(iat),
      deviceId,
    });

    if (!securityDevice) {
      return {
        status: ResultStatus.Unauthorised,
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
  async deleteOnLogout(dto: SecurityDeviceLogoutDto): Promise<Result> {
    await this.securityDevicesRepository.deleteBy(dto);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
  async deleteAllByUser(dto: SecurityDeviceDeleteAllDto): Promise<Result> {
    await this.securityDevicesRepository.deleteOthersByUser(dto);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
  async delete(
    deviceId: string,
    userId: string,
  ): Promise<
    Result<
      null,
      ResultStatus.Success | ResultStatus.NotFound | ResultStatus.Forbidden
    >
  > {
    const securityDevice = await this.securityDevicesRepository.findBy({
      deviceId,
    });

    if (!securityDevice) {
      return {
        status: ResultStatus.NotFound,
        extensions: [],
        data: null,
      };
    }

    if (securityDevice.userId.toString() !== userId) {
      return {
        status: ResultStatus.Forbidden,
        extensions: [],
        data: null,
      };
    }

    const isDeviceDeleted = await this.securityDevicesRepository.deleteBy({
      deviceId,
    });

    if (!isDeviceDeleted) {
      return {
        status: ResultStatus.NotFound,
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
}
