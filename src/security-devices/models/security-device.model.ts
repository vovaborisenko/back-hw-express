import { HydratedDocument, model, Schema } from 'mongoose';
import { SecurityDevice } from '../types/security-device';

const securityDeviceSchema = new Schema<SecurityDevice>({
  deviceId: { type: String, required: true, unique: true },
  deviceName: { type: String, required: true },
  expiredAt: { type: Date, default: Date.now },
  ip: { type: String, required: true },
  issuedAt: { type: Date, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

export const SecurityDeviceModel = model<SecurityDevice>(
  'SecurityDevice',
  securityDeviceSchema,
);
export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;
