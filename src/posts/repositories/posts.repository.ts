import { ObjectId, WithId } from 'mongodb';
import { AggregatedPost, Post } from '../types/post';
import { PostUpdateDto } from '../dto/post.update-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { BLOG_COLLECTION_NAME, postCollection } from '../../db/mongo.db';
import { QueryPostList } from '../input/query-post-list';
import { SortDirection } from '../../core/types/sort-direction';

export const postsRepository = {
  async findAll(
    { pageSize, pageNumber, sortDirection, sortBy }: QueryPostList,
    blogId?: string,
  ): Promise<{ items: WithId<AggregatedPost>[]; totalCount: number }> {
    const skip = pageSize * (pageNumber - 1);
    const sortOrder = sortDirection === SortDirection.Desc ? -1 : 1;
    let sort = {
      [sortBy]: sortOrder,
      _id: sortOrder,
    };
    const filter: any = {};

    if (blogId) {
      filter.blogId = new ObjectId(blogId);
    }

    const [items, totalCount] = await Promise.all([
      postCollection
        .aggregate<WithId<AggregatedPost>>([
          { $match: filter },
          ...getBaseAggregation(),
          { $sort: sort },
        ])
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<AggregatedPost> | null> {
    const [result] = await postCollection
      .aggregate<WithId<AggregatedPost>>([
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        ...getBaseAggregation(),
        { $limit: 1 },
      ])
      .toArray();

    return result || null;
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
          blogId: new ObjectId(dto.blogId),
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

function getBaseAggregation() {
  return [
    {
      $lookup: {
        from: BLOG_COLLECTION_NAME,
        localField: 'blogId',
        foreignField: '_id',
        as: 'blog',
      },
    },
    {
      $unwind: {
        path: '$blog',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        blogName: '$blog.name',
        createdAt: { $toDate: '$_id' },
      },
    },
    {
      $project: {
        blog: 0,
      },
    },
  ];
}
