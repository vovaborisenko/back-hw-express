import { ObjectId } from 'mongodb';
import { Blog } from '../types/blog';
import { BlogUpdateDto } from '../dto/blog.update-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { blogCollection } from '../../db/mongo.db';

export const blogsRepository = {
  async create(blog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(blog);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: BlogUpdateDto): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new NotExistError('Blog');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotExistError('Blog');
    }
  },
};
