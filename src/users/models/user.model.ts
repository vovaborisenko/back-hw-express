import { HydratedDocument, model, Schema } from 'mongoose';
import { EmailConfirmation, Recovery, User } from '../types/user';

const recoverySchema = new Schema<Recovery>(
  {
    expirationDate: { type: Date, required: true },
    code: { type: String, required: true },
  },
  { _id: false },
);

const emailConfirmationSchema = new Schema<EmailConfirmation>(
  {
    expirationDate: { type: Date, default: Date.now() + 3.6e6 },
    confirmationCode: { type: String, default: crypto.randomUUID() },
    isConfirmed: { type: Boolean, required: true, default: false },
  },
  { _id: false },
);

const userSchema = new Schema<User>(
  {
    login: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    emailConfirmation: { type: emailConfirmationSchema },
    recovery: { type: recoverySchema, default: null },
  },
  {},
);

export const UserModel = model<User>('User', userSchema);
export type UserDocument = HydratedDocument<User>;
