import { Filter, ObjectId, WithId } from 'mongodb';
import { AggregatedComment, Comment } from '../types/comment';
import { commentCollection, USER_COLLECTION_NAME } from '../../db/mongo.db';
import { QueryCommentList } from '../input/query-comment-list';
import { SortDirection } from '../../core/types/sort-direction';
import { injectable } from 'inversify';

@injectable()
export class CommentsQueryRepository {
  async findMany(
    { pageSize, pageNumber, sortDirection, sortBy }: QueryCommentList,
    postId?: string,
  ): Promise<{
    items: WithId<AggregatedComment>[];
    totalCount: number;
  }> {
    const skip = pageSize * (pageNumber - 1);
    const sortOrder = sortDirection === SortDirection.Desc ? -1 : 1;
    const sort = {
      [sortBy]: sortOrder,
      _id: sortOrder,
    };

    const filter: Filter<Comment> = {};

    if (postId) {
      filter.postId = new ObjectId(postId);
    }

    const [items, totalCount] = await Promise.all([
      commentCollection
        .aggregate<WithId<AggregatedComment>>([
          { $match: filter },
          ...getBaseAggregation(),
          { $sort: sort },
        ])
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      commentCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<AggregatedComment> | null> {
    const [result] = await commentCollection
      .aggregate<WithId<AggregatedComment>>([
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
        from: USER_COLLECTION_NAME,
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        userLogin: '$user.login',
      },
    },
    {
      $project: {
        user: 0,
      },
    },
  ];
}
