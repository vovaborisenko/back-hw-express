import express, { Express } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { videosRouter } from './videos/routers/videos.router';

export function setupApp(app: Express): Express {
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use('/testing', testingRouter);
  app.use('/videos', videosRouter);

  return app;
}
