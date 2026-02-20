import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from '../models/comment.model';

@injectable()
export class CommentsRepository {
  async save(commentDocument: CommentDocument): Promise<void> {
    await commentDocument.save();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await CommentModel.findByIdAndDelete(id);

    return !!deleteResult;
  }

  findById(id: string): Promise<CommentDocument | null> {
    return CommentModel.findById(id);
  }
}
