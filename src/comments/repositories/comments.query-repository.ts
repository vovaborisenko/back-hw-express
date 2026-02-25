import { injectable } from 'inversify';
import { PopulateOptions, QueryFilter, Types } from 'mongoose';
import {
  Comment,
  PopulatedComment,
  PopulatingLike,
  PopulatingUser,
} from '../types/comment';
import { QueryCommentList } from '../input/query-comment-list';
import { CommentViewModel } from '../types/comment.view-model';
import { CommentModel } from '../models/comment.model';
import { Paginated } from '../../core/types/paginated';
import { LikeStatus } from '../../likes/types/like';

@injectable()
export class CommentsQueryRepository {
  private readonly populateUserOptions: PopulateOptions = {
    path: 'user',
    select: 'login',
    options: { preserveNullAndError: true },
    transform: (doc, _id) => doc ?? { _id },
  };

  private getPopulatedMyStatusOptions(
    authorId?: string | Types.ObjectId,
  ): PopulateOptions {
    return {
      path: 'myStatus',
      select: 'status',
      match: { author: authorId },
    };
  }

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
        .populate<{ user: PopulatingUser }>(this.populateUserOptions)
        .populate<{ likesCount: number }>('likesCount')
        .populate<{ dislikesCount: number }>('dislikesCount')
        .populate<{
          myStatus: PopulatingLike;
        }>(this.getPopulatedMyStatusOptions(authorId))
        .lean(),
      CommentModel.countDocuments(filter),
    ]);

    return {
      page: pageNumber,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: items.map(this.toViewModel),
    };
  }

  async findById(
    id: string | Types.ObjectId,
    authorId?: string | Types.ObjectId,
  ): Promise<CommentViewModel | null> {
    const populatedComment = await CommentModel.findById(id)
      .populate<{ user: PopulatingUser }>(this.populateUserOptions)
      .populate<{ likesCount: number }>('likesCount')
      .populate<{ dislikesCount: number }>('dislikesCount')
      .populate<{
        myStatus: PopulatingLike;
      }>(this.getPopulatedMyStatusOptions(authorId))
      .lean();

    return populatedComment ? this.toViewModel(populatedComment) : null;
  }

  toViewModel(comment: PopulatedComment): CommentViewModel {
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
        myStatus: comment.myStatus?.status || LikeStatus.None,
      },
      createdAt: comment.createdAt.toISOString(),
    };
  }
}
