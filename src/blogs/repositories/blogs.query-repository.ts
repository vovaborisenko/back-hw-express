import { ObjectId, WithId } from 'mongodb';
import { Blog } from '../types/blog';
import { blogCollection } from '../../db/mongo.db';
import { QueryBlogList } from '../input/query-blog-list';
import { injectable } from 'inversify';

@injectable()
export class BlogsQueryRepository {
  async findMany({
    pageSize,
    pageNumber,
    searchNameTerm,
    sortDirection,
    sortBy,
  }: QueryBlogList): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const skip = pageSize * (pageNumber - 1);
    const sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const [items, totalCount] = await Promise.all([
      blogCollection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      blogCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  }
}
