import { injectable } from 'inversify';
import { PopulateOptions, QueryFilter, Types } from 'mongoose';
import { Comment, PopulatedComment, PopulatingUser } from '../types/comment';
import { QueryCommentList } from '../input/query-comment-list';
import { CommentViewModel } from '../types/comment.view-model';
import { CommentModel } from '../models/comment.model';
import { Paginated } from '../../core/types/paginated';
import { Like, LikeStatus } from '../../likes/types/like';
import { LikeModel } from '../../likes/models/like.model';

@injectable()
export class CommentsQueryRepository {
  private readonly populateOptions: PopulateOptions = {
    path: 'user',
    select: 'login',
    options: { preserveNullAndError: true },
    transform: (doc, _id) => doc ?? { _id },
  };

  async findMany(
    { pageSize, pageNumber, sortDirection, sortBy }: QueryCommentList,
    postId?: string,
    authorId?: string,
  ): Promise<Paginated<CommentViewModel[]>> {
    const skip = pageSize * (pageNumber - 1);
    const sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };

    const filter: QueryFilter<Comment> = {};

    if (postId) {
      filter.post = postId;
    }

    const [items, totalCount] = await Promise.all([
      CommentModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .populate<{ user: PopulatingUser }>(this.populateOptions)
        .populate<{ likesCount: number }>('likesCount')
        .populate<{ dislikesCount: number }>('dislikesCount')
        .lean(),
      CommentModel.countDocuments(filter),
    ]);
    const userLikes = await LikeModel.find({
      author: authorId,
      parent: { $in: items.map(({ _id }) => _id) },
    }).lean();
    const userLikesMap = new Map(userLikes.map((like) => [like._id, like]));

    return {
      page: pageNumber,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: items.map((comment) =>
        this.toViewModel({ comment, userLike: userLikesMap.get(comment._id) }),
      ),
    };
  }

  async findById(
    id: string | Types.ObjectId,
    authorId?: string | Types.ObjectId,
  ): Promise<CommentViewModel | null> {
    const [populatedComment, userLike] = await Promise.all([
      CommentModel.findById(id)
        .populate<{ user: PopulatingUser }>(this.populateOptions)
        .populate<{ likesCount: number }>('likesCount')
        .populate<{ dislikesCount: number }>('dislikesCount')
        .lean(),
      LikeModel.findOne({ author: authorId, parent: id }).lean(),
    ]);

    return populatedComment
      ? this.toViewModel({ comment: populatedComment, userLike })
      : null;
  }

  toViewModel({
    comment,
    userLike,
  }: {
    comment: PopulatedComment;
    userLike?: Like | null;
  }): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.user._id.toString(),
        userLogin: comment.user.login,
      },
      likesInfo: {
        dislikesCount: comment.dislikesCount,
        likesCount: comment.likesCount,
        myStatus: userLike?.status || LikeStatus.None,
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
