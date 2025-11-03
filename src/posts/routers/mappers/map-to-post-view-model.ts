import { WithId } from 'mongodb';
import { PostViewModel } from '../../types/post.view-model';
import { AggregatedPost } from '../../types/post';

export function mapToPostViewModel(
  post: WithId<AggregatedPost>,
): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId.toString(),
    blogName: post.blogName ?? null,
    createdAt: post.createdAt.toISOString(),
  };
}
