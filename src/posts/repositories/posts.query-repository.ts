import { PopulateOptions, QueryFilter, Types } from 'mongoose';
import { PopulatedPost, PopulatingBlog, Post } from '../types/post';
import { QueryPostList } from '../input/query-post-list';
import { injectable } from 'inversify';
import { PostViewModel } from '../types/post.view-model';
import { PostModel } from '../models/post.model';
import { Paginated } from '../../core/types/paginated';

@injectable()
export class PostsQueryRepository {
  private readonly populateOptions: PopulateOptions = {
    path: 'blog',
    select: 'name',
    options: { preserveNullAndError: true },
    transform: (doc, _id) => doc ?? { _id },
  };

  async findMany(
    { pageSize, pageNumber, sortDirection, sortBy }: QueryPostList,
    blogId?: string,
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
        .lean(),
      PostModel.countDocuments(filter),
    ]);

    return {
      page: pageNumber,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: items.map(this.toViewModel),
    };
  }

  async findById(id: string | Types.ObjectId): Promise<PostViewModel | null> {
    const populatedPost = await PostModel.findById(id)
      .populate<{ blog: PopulatingBlog }>(this.populateOptions)
      .lean();

    return populatedPost ? this.toViewModel(populatedPost) : null;
  }

  private toViewModel(post: PopulatedPost): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blog._id.toString(),
      blogName: post.blog.name ?? null,
      createdAt: post.createdAt.toISOString(),
    };
  }
}
