import { ObjectId, WithId } from 'mongodb';
import { Post } from '../types/post';
import { PostUpdateDto } from '../dto/post.update-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { postCollection } from '../../db/mongo.db';
import { QueryPostList } from '../input/query-post-list';

export const postsRepository = {
  async findAll(
    { pageSize, pageNumber, sortDirection, sortBy }: QueryPostList,
    blogId?: string,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const skip = pageSize * (pageNumber - 1);
    let sort = { [sortBy]: sortDirection };
    const filter: any = {};

    if (blogId) {
      filter.blogId = blogId;
    }

    if (sortBy === 'createdAt') {
      sort = { _id: sortDirection };
    }
    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(post: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(post);

    return insertResult.insertedId.toString();
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
