import { Blog } from '../types/blog';
import { QueryBlogList } from '../input/query-blog-list';
import { injectable } from 'inversify';
import { BlogViewModel } from '../types/blog.view-model';
import { QueryFilter, Types } from 'mongoose';
import { BlogModel } from '../models/blog.model';
import { Paginated } from '../../core/types/paginated';

@injectable()
export class BlogsQueryRepository {
  async findMany({
    pageSize,
    pageNumber,
    searchNameTerm,
    sortDirection,
    sortBy,
  }: QueryBlogList): Promise<Paginated<BlogViewModel[]>> {
    const skip = pageSize * (pageNumber - 1);
    const sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };
    const filter: QueryFilter<Blog> = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const [items, totalCount] = await Promise.all([
      BlogModel.find(filter).sort(sort).skip(skip).limit(pageSize).lean(),
      BlogModel.countDocuments(filter),
    ]);

    return {
      page: pageNumber,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
      items: items.map(this.toViewModel),
    };
  }

  async findById(id: string | Types.ObjectId): Promise<BlogViewModel | null> {
    const blogDocument = await BlogModel.findById(id);

    return blogDocument ? this.toViewModel(blogDocument) : null;
  }

  private toViewModel(blog: Blog & { _id: Types.ObjectId }): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      isMembership: blog.isMembership,
      createdAt: blog.createdAt.toISOString(),
    };
  }
}
