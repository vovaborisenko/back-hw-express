import { PopulateOptions, QueryFilter, Types } from 'mongoose';
import { PopulatedPost, PopulatingBlog, Post } from '../types/post';
import { QueryPostList } from '../input/query-post-list';
import { injectable } from 'inversify';
import { PostViewModel } from '../types/post.view-model';
import { PostModel } from '../models/post.model';
import { Paginated } from '../../core/types/paginated';
import { LikeStatus } from '../../likes/types/like';
import { PopulatingLike } from '../../comments/types/comment';

@injectable()
export class PostsQueryRepository {
  private readonly populateOptions: PopulateOptions = {
    path: 'blog',
    select: 'name',
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
    { pageSize, pageNumber, sortDirection, sortBy }: QueryPostList,
    { userId, blogId }: { userId?: string; blogId?: string } = {},
  ): Promise<Paginated<PostViewModel[]>> {
    const skip = pageSize * (pageNumber - 1);
    const sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };
    const filter: QueryFilter<Post> = {};

    if (blogId) {
      filter.blog = blogId;
    }

    const [items, totalCount] = await Promise.all([
      PostModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .populate<{ blog: PopulatingBlog }>(this.populateOptions)
        .populate<{ likesCount: number }>('likesCount')
        .populate<{ dislikesCount: number }>('dislikesCount')
        .populate<{
          myStatus: PopulatingLike;
        }>(this.getPopulatedMyStatusOptions(userId))
        .populate<{ newestLikes: any[] }>({
          path: 'newestLikes',
          populate: { path: 'author' },
        })
        .lean(),
      PostModel.countDocuments(filter),
    ]);

    return {
      page: pageNumber,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: items.map((item) => this.toViewModel(item)),
    };
  }

  async findById(
    id: string | Types.ObjectId,
    authorId?: string | Types.ObjectId,
  ): Promise<PostViewModel | null> {
    const populatedPost = await PostModel.findById(id)
      .populate<{ blog: PopulatingBlog }>(this.populateOptions)
      .populate<{ likesCount: number }>('likesCount')
      .populate<{ dislikesCount: number }>('dislikesCount')
      .populate<{ newestLikes: any[] }>({
        path: 'newestLikes',
        populate: { path: 'author' },
      })
      .populate<{
        myStatus: PopulatingLike;
      }>(this.getPopulatedMyStatusOptions(authorId))
      .lean();

    return populatedPost ? this.toViewModel(populatedPost) : null;
  }

  private toViewModel(post: PopulatedPost): PostViewModel {
    const newestLikes = post.newestLikes.map((like) => ({
      addedAt: like.createdAt?.toISOString(),
      userId: like.author?._id.toString(),
      login: like.author?.login,
    }));

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blog._id.toString(),
      blogName: post.blog.name ?? null,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        dislikesCount: post.dislikesCount,
        likesCount: post.likesCount,
        myStatus: post.myStatus?.status || LikeStatus.None,
        newestLikes,
      },
    };
  }
}
