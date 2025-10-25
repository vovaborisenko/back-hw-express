import { ObjectId, WithId } from 'mongodb';
import { Post } from '../types/post';
import { PostUpdateDto } from '../dto/post.update-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { postCollection } from '../../db/mongo.db';

export const postsRepository = {
  findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(post: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(post);

    return { ...post, _id: insertResult.insertedId };
  },

  async update(id: string, dto: PostUpdateDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new NotExistError('Post');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotExistError('Post');
    }
  },
};
