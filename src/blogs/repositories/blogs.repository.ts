import { NotExistError } from '../../core/errors/not-exist.error';
import { injectable } from 'inversify';
import { BlogDocument, BlogModel } from '../models/blog.model';

@injectable()
export class BlogsRepository {
  findById(id: string): Promise<BlogDocument | null> {
    return BlogModel.findById(id);
  }

  async save(blogDocument: BlogDocument): Promise<void> {
    await blogDocument.save();
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await BlogModel.findByIdAndDelete(id);

    if (!deleteResult) {
      throw new NotExistError('Blog');
    }
  }
}
