import { WithId } from 'mongodb';
import { BlogViewModel } from '../../types/blog.view-model';
import { Blog } from '../../types/blog';

export function mapToBlogViewModel(blog: WithId<Blog>): BlogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog._id.getTimestamp().toISOString(),
  };
}
