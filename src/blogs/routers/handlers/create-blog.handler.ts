import { RequestHandler } from 'express';
import { HttpStatus } from '../../../core/types/http-status';
import { BlogCreateDto } from '../../dto/blog.create-dto';
import { BlogViewModel } from '../../types/blog.view-model';
import { mapToBlogViewModel } from '../mappers/map-to-blog-view-model';
import { BlogsService } from '../../application/blogs.service';
import { NotExistError } from '../../../core/errors/not-exist.error';
import { BlogsQueryRepository } from '../../repositories/blogs.query-repository';

export function createCreateBlogHandler(
  blogsService: BlogsService,
  blogsQueryRepository: BlogsQueryRepository,
): RequestHandler<{}, BlogViewModel, BlogCreateDto> {
  return async function (req, res) {
    const createdBlogId = await blogsService.create(req.body);
    const createdBlog = await blogsQueryRepository.findById(createdBlogId);

    if (!createdBlog) {
      throw new NotExistError('Blog');
    }

    res.status(HttpStatus.Created).json(mapToBlogViewModel(createdBlog));
  };
}
