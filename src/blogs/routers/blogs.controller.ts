import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/repositories/posts.query-repository';
import { BlogsQueryRepository } from '../repositories/blogs.query-repository';
import { BlogsService } from '../application/blogs.service';
import { createCreateBlogHandler } from './handlers/create-blog.handler';
import { createCreateBlogPostHandler } from './handlers/create-blog-post.handler';
import { createDeleteBlogHandler } from './handlers/delete-blog.handler';
import { createGetBlogHandler } from './handlers/get-blog.handler';
import { createGetBlogPostListHandler } from './handlers/get-blog-post-list.handler';
import { createGetBlogListHandler } from './handlers/get-blog-list.handler';
import { createUpdateBlogHandler } from './handlers/update-blog.handler';
import { inject, injectable } from 'inversify';

@injectable()
export class BlogsController {
  readonly createItem;
  readonly createItemPost;
  readonly deleteItem;
  readonly getItem;
  readonly getItemPosts;
  readonly getItems;
  readonly updateItem;

  constructor(
    @inject(BlogsService) private readonly blogsService: BlogsService,
    @inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
    @inject(PostsService) private readonly postsService: PostsService,
    @inject(PostsQueryRepository)
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {
    this.createItem = createCreateBlogHandler(
      this.blogsService,
      this.blogsQueryRepository,
    );
    this.createItemPost = createCreateBlogPostHandler(
      this.postsService,
      this.postsQueryRepository,
    );
    this.deleteItem = createDeleteBlogHandler(this.blogsService);
    this.getItem = createGetBlogHandler(this.blogsQueryRepository);
    this.getItemPosts = createGetBlogPostListHandler(
      this.blogsQueryRepository,
      this.postsQueryRepository,
    );
    this.getItems = createGetBlogListHandler(this.blogsQueryRepository);
    this.updateItem = createUpdateBlogHandler(this.blogsService);
  }
}
