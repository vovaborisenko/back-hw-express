import { CommentsService } from '../../comments/application/comments.service';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../repositories/posts.query-repository';
import { createCreatePostHandler } from './handlers/create-post.handler';
import { createCreatePostCommentHandler } from './handlers/create-post-comment.handler';
import { CommentsQueryRepository } from '../../comments/repositories/comments.query-repository';
import { createDeletePostHandler } from './handlers/delete-post.handler';
import { createGetPostHandler } from './handlers/get-post.handler';
import { createGetPostCommentListHandler } from './handlers/get-post-comment-list.handler';
import { createGetPostListHandler } from './handlers/get-post-list.handler';
import { createUpdatePostHandler } from './handlers/update-post.handler';
import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query-repository';

export class PostsController {
  readonly createItem;
  readonly createItemComment;
  readonly deleteItem;
  readonly getItem;
  readonly getItemComments;
  readonly getItems;
  readonly updateItem;

  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {
    this.createItem = createCreatePostHandler(
      this.postsService,
      this.postsQueryRepository,
    );
    this.createItemComment = createCreatePostCommentHandler(
      this.commentsService,
      this.commentsQueryRepository,
    );
    this.deleteItem = createDeletePostHandler(this.postsService);
    this.getItem = createGetPostHandler(this.postsQueryRepository);
    this.getItemComments = createGetPostCommentListHandler(
      this.postsQueryRepository,
      this.commentsQueryRepository,
    );
    this.getItems = createGetPostListHandler(this.postsQueryRepository);
    this.updateItem = createUpdatePostHandler(
      this.postsService,
      this.blogsQueryRepository,
    );
  }
}
