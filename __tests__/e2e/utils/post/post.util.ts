import { PostCreateDto } from '../../../../src/posts/dto/post.create-dto';
import { PostUpdateDto } from '../../../../src/posts/dto/post.update-dto';
import type { App } from 'supertest/types';
import { BlogCreateDto } from '../../../../src/blogs/dto/blog.create-dto';
import { BlogViewModel } from '../../../../src/blogs/types/blog.view-model';
import request from 'supertest';
import { PATH } from '../../../../src/core/paths/paths';
import { validAuth } from '../../constants/common';
import { HttpStatus } from '../../../../src/core/types/http-status';
import { blogDto, createBlog } from '../blog/blog.util';
import { PostViewModel } from '../../../../src/posts/types/post.view-model';

export const postDto: { create: PostCreateDto; update: PostUpdateDto } = {
  create: {
    title: 'Новые возможности TypeScript',
    shortDescription: 'Обзор новых фич и улучшений в TypeScript',
    content:
      'TypeScript 5.0 представляет множество улучшений производительности и новые возможности...',
    blogId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  },
  update: {
    title: 'React 18: Что нового?',
    shortDescription: 'Знакомство с новыми возможностями React 18',
    content:
      'React 18 приносит революционные изменения в рендеринг приложений...',
    blogId: 'b2c3d4e5-f6a7-890b-cdef-234567890123',
  },
};

export async function createPost(
  app: App,
  dto: PostCreateDto = postDto.create,
): Promise<PostViewModel> {
  const { body: post } = await request(app)
    .post(PATH.POSTS)
    .set('Authorization', validAuth)
    .send({ ...dto })
    .expect(HttpStatus.Created);

  return post;
}

export async function createPosts(
  count: number,
  app: App,
  dto: PostCreateDto = postDto.create,
): Promise<PostViewModel[]> {
  const requests = Array.from({ length: count }).map((_, index) =>
    createPost(app, {
      title: `${dto.title}${index}`,
      shortDescription: `${dto.shortDescription}${index}`,
      content: `${dto.content}${index}`,
      blogId: dto.blogId,
    }),
  );

  return Promise.all(requests);
}

export async function createBlogAndHisPost(
  app: App,
  dtoBlog: BlogCreateDto = blogDto.create,
  dtoPost: Omit<PostCreateDto, 'blogId'> = postDto.create,
): Promise<[BlogViewModel, PostViewModel]> {
  const blog = await createBlog(app, dtoBlog);
  const post = await createPost(app, { ...dtoPost, blogId: blog.id });

  return [blog, post];
}

export async function createBlogAndHisPosts(
  count: number,
  app: App,
  dtoBlog: BlogCreateDto = blogDto.create,
  dtoPost: Omit<PostCreateDto, 'blogId'> = postDto.create,
): Promise<[BlogViewModel, PostViewModel[]]> {
  const blog = await createBlog(app, dtoBlog);
  const posts = await createPosts(count, app, { ...dtoPost, blogId: blog.id });

  return [blog, posts];
}
