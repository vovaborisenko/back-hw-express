import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { PostCreateDto } from '../../../src/posts/dto/post.create-dto';
import { PostUpdateDto } from '../../../src/posts/dto/post.update-dto';
import { PATH } from '../../../src/core/paths/paths';

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  const newPost: PostCreateDto = {
    title: 'Новые возможности TypeScript',
    shortDescription: 'Обзор новых фич и улучшений в TypeScript',
    content:
      'TypeScript 5.0 представляет множество улучшений производительности и новые возможности...',
    blogId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  };

  const updatedPost: PostUpdateDto = {
    title: 'React 18: Что нового?',
    shortDescription: 'Знакомство с новыми возможностями React 18',
    content:
      'React 18 приносит революционные изменения в рендеринг приложений...',
    blogId: 'b2c3d4e5-f6a7-890b-cdef-234567890123',
  };

  const blog1 = {
    name: 'Tech Insights',
    description: 'Latest news and trends in technology world',
    websiteUrl: 'https://tech-insights.blog.com',
  };

  const blog2 = {
    name: 'Web Development',
    description: 'Learning JavaScript and modern frameworks',
    websiteUrl: 'https://js-mastery.org',
  };

  beforeEach(async () => {
    await request(app)
      .delete(`${PATH.TESTING}/all-data`)
      .expect(HttpStatus.NoContent);

    const { body: createdBlog1 } = await request(app)
      .post(PATH.BLOGS)
      .send(blog1)
      .expect(HttpStatus.Created);

    newPost.blogId = createdBlog1.id;

    const { body: createdBlog2 } = await request(app)
      .post(PATH.BLOGS)
      .send(blog2)
      .expect(HttpStatus.Created);

    updatedPost.blogId = createdBlog2.id;
  });

  describe(`POST ${PATH.POSTS}`, () => {
    it('should create', async () => {
      const response = await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);

      expect(response.body).toMatchObject(newPost);
    });
  });

  describe(`GET ${PATH.POSTS}`, () => {
    it('should return [] when no posts', async () => {
      const response = await request(app).get(PATH.POSTS).expect(HttpStatus.Ok);

      expect(response.body).toEqual([]);
    });

    it('should return list of posts', async () => {
      await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);
      await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);

      const response = await request(app).get(PATH.POSTS).expect(HttpStatus.Ok);

      expect(response.body.length).toBe(2);
    });
  });

  describe(`GET ${PATH.POSTS}/:id`, () => {
    it('should return 404 when no post', async () => {
      await request(app).get(`${PATH.POSTS}/987`).expect(HttpStatus.NotFound);
    });

    it('should return post with requested id', async () => {
      await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);
      const { body: post2 } = await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);

      const response = await request(app)
        .get(`${PATH.POSTS}/${post2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual(post2);
    });
  });

  describe(`PUT ${PATH.POSTS}/:id`, () => {
    it('should return 404 when no post', async () => {
      await request(app)
        .put(`${PATH.POSTS}/987`)
        .send(updatedPost)
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const { body: post1 } = await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);
      const { body: post2 } = await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);

      await request(app)
        .put(`${PATH.POSTS}/${post1.id}`)
        .send({ ...updatedPost, minAgeRestriction: null })
        .expect(HttpStatus.NoContent);
      await request(app)
        .put(`${PATH.POSTS}/${post2.id}`)
        .send(updatedPost)
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${PATH.POSTS}/${post2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toMatchObject(updatedPost);
    });
  });

  describe(`DELETE ${PATH.POSTS}/:id`, () => {
    it('should return 404 when no post', async () => {
      await request(app)
        .delete(`${PATH.POSTS}/987`)
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);
      const { body: post2 } = await request(app)
        .post(PATH.POSTS)
        .send(newPost)
        .expect(HttpStatus.Created);

      await request(app)
        .delete(`${PATH.POSTS}/${post2.id}`)
        .expect(HttpStatus.NoContent);
    });
  });
});
