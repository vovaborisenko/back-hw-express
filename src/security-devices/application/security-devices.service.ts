import { Result, ResultStatus } from '../../core/types/result-object';
import { SecurityDevicesRepository } from '../repositories/security-devices.repository';
import { SecurityDeviceCreateDto } from '../dto/security-device.create-dto';
import { SecurityDeviceCheckDto } from '../dto/security-device.check-dto';
import { parseJwtTime } from '../../core/utils/parseJwtTime';
import { SecurityDeviceLogoutDto } from '../dto/security-device.logout-dto';
import { SecurityDeviceDeleteAllDto } from '../dto/security-device.delete-all-dto';
import { SecurityDeviceUpdateDto } from '../dto/security-device.update-dto';
import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { SecurityDeviceModel } from '../models/security-device.model';

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
    Result<Types.ObjectId> | Result<null, ResultStatus.BadRequest>
  > {
    const deviceName = useragent
      ? `${useragent.browser} ${useragent.version}`
      : 'unknown';

    const securityDeviceDocument = new SecurityDeviceModel();

    securityDeviceDocument.deviceId = refreshToken.deviceId;
    securityDeviceDocument.deviceName = deviceName;
    securityDeviceDocument.expiredAt = parseJwtTime(refreshToken.exp);
    securityDeviceDocument.ip = ip;
    securityDeviceDocument.issuedAt = parseJwtTime(refreshToken.iat);
    securityDeviceDocument.userId = new Types.ObjectId(refreshToken.userId);

    await this.securityDevicesRepository.save(securityDeviceDocument);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: securityDeviceDocument._id,
    };
  }
  async update(
    filter: { deviceId: string; issuedAt: Date },
    { refreshToken }: SecurityDeviceUpdateDto,
  ): Promise<Result<Types.ObjectId> | Result<null, ResultStatus.NotFound>> {
    const securityDeviceDocument = await SecurityDeviceModel.findOne(filter);

    if (!securityDeviceDocument) {
      return {
        status: ResultStatus.NotFound,
        extensions: [],
        data: null,
      };
    }

    securityDeviceDocument.expiredAt = parseJwtTime(refreshToken.exp);
    securityDeviceDocument.issuedAt = parseJwtTime(refreshToken.iat);

    await this.securityDevicesRepository.save(securityDeviceDocument);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: securityDeviceDocument._id,
    };
  }
  async check({
    deviceId,
    iat,
  }: SecurityDeviceCheckDto): Promise<
    Result | Result<null, ResultStatus.Unauthorised>
  > {
    const securityDeviceDocument = await this.securityDevicesRepository.findBy({
      issuedAt: parseJwtTime(iat),
      deviceId,
    });

    if (!securityDeviceDocument) {
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
