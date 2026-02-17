import mongoose, { Schema } from 'mongoose';
import { Log } from '../types/log';

const logSchema = new Schema<Log>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const LogModel = mongoose.model<Log>('logs', logSchema);
