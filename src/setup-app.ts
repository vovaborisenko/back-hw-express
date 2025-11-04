import express, { Express } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { authRouter } from './auth/routers/auth.router';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';
import { usersRouter } from './users/routers/users.router';
import { PATH } from './core/paths/paths';
import { errorHandler } from './core/handlers/error.handler';

export function setupApp(app: Express): Express {
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use(PATH.TESTING, testingRouter);
  app.use(PATH.AUTH, authRouter);
  app.use(PATH.BLOGS, blogsRouter);
  app.use(PATH.POSTS, postsRouter);
  app.use(PATH.USERS, usersRouter);

  app.use(errorHandler);

  return app;
}
