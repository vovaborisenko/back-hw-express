import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { express as useragent } from 'express-useragent';
import { testingRouter } from './testing/routers/testing.router';
import { authRouter } from './auth/routers/auth.router';
import { blogsRouter } from './blogs/routers/blogs.router';
import { commentsRouter } from './comments/routers/comments.router';
import { postsRouter } from './posts/routers/posts.router';
import { securityDevicesRouter } from './security-devices/routers/security-devices.router';
import { usersRouter } from './users/routers/users.router';
import { PATH } from './core/paths/paths';
import { errorHandler } from './core/handlers/error.handler';

export function setupApp(app: Express): Express {
  app.set('trust proxy', true);
  app.use(cookieParser());
  app.use(express.json());
  app.use(useragent());

  app.get('/', (_req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use(PATH.TESTING, testingRouter);
  app.use(PATH.AUTH, authRouter);
  app.use(PATH.BLOGS, blogsRouter);
  app.use(PATH.COMMENTS, commentsRouter);
  app.use(PATH.POSTS, postsRouter);
  app.use(PATH.SECURITY_DEVICES, securityDevicesRouter);
  app.use(PATH.USERS, usersRouter);

  app.use(errorHandler);

  return app;
}
