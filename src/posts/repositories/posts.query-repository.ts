import { ObjectId, WithId } from 'mongodb';
import { AggregatedPost } from '../types/post';
import { BLOG_COLLECTION_NAME, postCollection } from '../../db/mongo.db';
import { QueryPostList } from '../input/query-post-list';
import { SortDirection } from '../../core/types/sort-direction';

export class PostsQueryRepository {
  async findMany(
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
  }

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
  }
}

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
      },
    },
    {
      $project: {
        blog: 0,
      },
    },
  ];
}
