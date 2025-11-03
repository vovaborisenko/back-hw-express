import { ObjectId, WithId } from 'mongodb';
import { Blog } from '../types/blog';
import { BlogUpdateDto } from '../dto/blog.update-dto';
import { NotExistError } from '../../core/errors/not-exist.error';
import { blogCollection } from '../../db/mongo.db';
import { QueryBlogList } from '../input/query-blog-list';

export const blogsRepository = {
  async findAll({
    pageSize,
    pageNumber,
    searchNameTerm,
    sortDirection,
    sortBy,
  }: QueryBlogList): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const skip = pageSize * (pageNumber - 1);
    let sort = {
      [sortBy]: sortDirection,
      _id: sortDirection,
    };
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    if (sortBy === 'createdAt') {
      sort = { _id: sortDirection };
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
  },

  async findNamesByIds(
    ids: string[],
  ): Promise<Record<string, WithId<Pick<Blog, 'name'>>>> {
    const entries = await blogCollection
      .find<WithId<Pick<Blog, 'name'>>>(
        {
          _id: {
            $in: ids.map((id) => new ObjectId(id)),
          },
        },
        {
          projection: { name: 1 },
        },
      )
      .map((blog) => [blog._id.toString(), blog] as const)
      .toArray();

    return Object.fromEntries(entries);
  },

  findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(blog: Blog): Promise<string> {
    const insertResult = await blogCollection.insertOne(blog);

    return insertResult.insertedId.toString();
  },

  async update(id: string, dto: BlogUpdateDto): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new NotExistError('Blog');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new NotExistError('Blog');
    }
  },
};
