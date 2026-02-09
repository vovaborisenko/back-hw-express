import { RequestHandler } from 'express';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { BlogsQueryRepository } from '../../repositories/blogs.query-repository';

export function createGetBlogHandler(
  blogsQueryRepository: BlogsQueryRepository,
): RequestHandler<{ id: string }, BlogViewModel> {
  return async function (req, res) {
    const blog = await blogsQueryRepository.findById(req.params.id);

    if (!blog) {
      throw new NotExistError('Blog');
    }

    res.json(mapToBlogViewModel(blog));
  };
}
