import { NotExistError } from '../../core/errors/not-exist.error';
import { injectable } from 'inversify';
import { PostDocument, PostModel } from '../models/post.model';

@injectable()
export class PostsRepository {
  findById(id: string): Promise<PostDocument | null> {
    return PostModel.findById(id);
  }

  async save(postDocument: PostDocument): Promise<void> {
    await postDocument.save();
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await PostModel.findByIdAndDelete(id);

    if (!deleteResult) {
      throw new NotExistError('Post');
    }
  }
}
