import type { App } from 'supertest/types';
import request from 'supertest';
import { PATH } from '../../../../src/core/paths/paths';
import { validAuth } from '../../constants/common';
import { HttpStatus } from '../../../../src/core/types/http-status';
import { BlogCreateDto } from '../../../../src/blogs/dto/blog.create-dto';
import { BlogViewModel } from '../../../../src/blogs/types/blog.view-model';
import { BlogUpdateDto } from '../../../../src/blogs/dto/blog.update-dto';

export const blogDto: { create: BlogCreateDto; update: BlogUpdateDto } = {
  create: {
    name: 'Tech Insights',
    description: 'Latest news and trends in technology world',
    websiteUrl: 'https://tech-insights.blog.com',
  },
  update: {
    name: 'Web Guide',
    description: 'Helpful articles and tutorials on web development',
    websiteUrl: 'https://webdev-guide.dev',
  },
};

export async function createBlog(
  app: App,
  dto: BlogCreateDto = blogDto.create,
): Promise<BlogViewModel> {
  const { body: blog } = await request(app)
    .post(PATH.BLOGS)
    .set('Authorization', validAuth)
    .send(dto)
    .expect(HttpStatus.Created);

  return blog;
}

export async function createBlogs(
  count: number,
  app: App,
  dto: BlogCreateDto = blogDto.create,
): Promise<BlogViewModel[]> {
  const requests = Array.from({ length: count }).map((_, index) =>
    createBlog(app, {
      name: `${dto.name}${index}`,
      description: `${dto.description}${index}`,
      websiteUrl: `${dto.websiteUrl}${index}`,
    }),
  );

  return Promise.all(requests);
}
