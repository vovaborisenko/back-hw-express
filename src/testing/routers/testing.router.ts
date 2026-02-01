import { Router, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-status';
import {
  blogCollection,
  commentCollection,
  logCollection,
  postCollection,
  refreshTokenCollection,
  userCollection,
} from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all(
    [
      blogCollection,
      commentCollection,
      logCollection,
      postCollection,
      refreshTokenCollection,
      userCollection,
    ].map((collection) => collection.deleteMany()),
  );
  res.sendStatus(HttpStatus.NoContent);
});
