import { Router } from 'express';
import { getBlogListHandler } from './handlers/get-blog-list.handler';
import { getBlogHandler } from './handlers/get-blog.handler';
import { createBlogHandler } from './handlers/create-blog.handler';
import { updateBlogHandler } from './handlers/update-blog.handler';
import { deleteBlogHandler } from './handlers/delete-blog.handler';

export const blogsRouter = Router({});

blogsRouter
  .get('/', getBlogListHandler)

  .post('/', createBlogHandler)

  .get('/:id', getBlogHandler)

  .put('/:id', updateBlogHandler)

  .delete('/:id', deleteBlogHandler);
