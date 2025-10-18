import { Router } from 'express';
import { getPostListHandler } from './handlers/get-post-list.handler';
import { getPostHandler } from './handlers/get-post.handler';
import { createPostHandler } from './handlers/create-post.handler';
import { updatePostHandler } from './handlers/update-post.handler';
import { deletePostHandler } from './handlers/delete-post.handler';

export const postsRouter = Router({});

postsRouter
  .get('/', getPostListHandler)

  .post('/', createPostHandler)

  .get('/:id', getPostHandler)

  .put('/:id', updatePostHandler)

  .delete('/:id', deletePostHandler);
