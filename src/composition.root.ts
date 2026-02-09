import { SecurityDevicesRepository } from './security-devices/repositories/security-devices.repository';
import { SecurityDevicesQueryRepository } from './security-devices/repositories/security-devices.query-repository';
import { SecurityDevicesService } from './security-devices/application/security-devices.service';
import { SecurityDevicesController } from './security-devices/routers/security-devices.controller';
import { UsersRepository } from './users/repositories/users.repository';
import { UsersQueryRepository } from './users/repositories/users.query-repository';
import { UsersService } from './users/application/users.service';
import { UsersController } from './users/routers/users.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsQueryRepository } from './posts/repositories/posts.query-repository';
import { PostsRepository } from './posts/repositories/posts.repository';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { CommentsQueryRepository } from './comments/repositories/comments.query-repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { CommentsService } from './comments/application/comments.service';
import { BlogsQueryRepository } from './blogs/repositories/blogs.query-repository';
import { PostsController } from './posts/routers/posts.controller';
import { CommentsController } from './comments/routers/comments.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/routers/blogs.controller';

export const blogsRepository = new BlogsRepository();
export const commentsRepository = new CommentsRepository();
export const postsRepository = new PostsRepository();
export const securityDevicesRepository = new SecurityDevicesRepository();
export const usersRepository = new UsersRepository();

export const blogsQueryRepository = new BlogsQueryRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const securityDevicesQueryRepository =
  new SecurityDevicesQueryRepository();
export const usersQueryRepository = new UsersQueryRepository();

export const blogsService = new BlogsService(blogsRepository);
export const commentsService = new CommentsService(
  commentsRepository,
  postsRepository,
  usersRepository,
);
export const postsService = new PostsService(postsRepository, blogsRepository);
export const securityDevicesService = new SecurityDevicesService(
  securityDevicesRepository,
);
export const usersService = new UsersService(usersRepository);

export const blogController = new BlogsController(
  blogsService,
  blogsQueryRepository,
  postsService,
  postsQueryRepository,
);
export const commentsController = new CommentsController(
  commentsService,
  commentsQueryRepository,
);
export const postsController = new PostsController(
  postsService,
  postsQueryRepository,
  commentsService,
  commentsQueryRepository,
  blogsQueryRepository,
);
export const securityDevicesController = new SecurityDevicesController(
  securityDevicesService,
  securityDevicesQueryRepository,
);
export const usersController = new UsersController(
  usersService,
  usersQueryRepository,
);
