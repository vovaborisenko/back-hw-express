import express, { Express } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { blogsRouter } from './blogs/routers/blogs.router';
import { PATH } from './core/paths/paths';

export function setupApp(app: Express): Express {
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use(PATH.TESTING, testingRouter);
  app.use(PATH.BLOGS, blogsRouter);

  return app;
}
