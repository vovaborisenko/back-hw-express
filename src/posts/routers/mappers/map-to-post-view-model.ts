import { WithId } from 'mongodb';
import { PostViewModel } from '../../types/post.view-model';
import { Post } from '../../types/post';
import { Blog } from '../../../blogs/types/blog';

export function mapToPostViewModel(
  post: WithId<Post>,
  blog: Pick<Blog, 'name'> | null,
): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: blog?.name ?? null,
    createdAt: post._id.getTimestamp().toISOString(),
  };
}
