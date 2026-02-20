import { injectable } from 'inversify';
import { LikeDocument } from '../models/like.model';

@injectable()
export class LikeRepository {
  async save(doc: LikeDocument): Promise<void> {
    await doc.save();
  }
}
