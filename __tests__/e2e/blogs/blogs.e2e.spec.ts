import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { BlogCreateDto } from '../../../src/blogs/dto/blog.create-dto';
import { BlogUpdateDto } from '../../../src/blogs/dto/blog.update-dto';
import { PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import {
  invalidAuth,
  validAuth,
  validMongoId,
} from '../../../src/testing/constants/common';

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
  });

  afterAll(async () => {
    await stopDb();
  });

  beforeEach(async () => {
    await request(app).delete(PATH.TESTING_CLEAR).expect(HttpStatus.NoContent);
  });

  const newBlog: BlogCreateDto = {
    name: 'Tech Insights',
    description: 'Latest news and trends in technology world',
    websiteUrl: 'https://tech-insights.blog.com',
  };

  const updatedBlog: BlogUpdateDto = {
    name: 'Web Guide',
    description: 'Helpful articles and tutorials on web development',
    websiteUrl: 'https://webdev-guide.dev',
  };

  it.each`
    path                        | method
    ${PATH.BLOGS}               | ${'post'}
    ${PATH.BLOGS + '/12'}       | ${'put'}
    ${PATH.BLOGS + '/12'}       | ${'delete'}
    ${PATH.BLOGS + '/12/posts'} | ${'post'}
  `(
    'should return 401 when invalid header Authorization: [$method] $path',
    async ({
      path,
      method,
    }: {
      path: string;
      method: 'post' | 'put' | 'delete';
    }) => {
      await request(app)[method](path).expect(HttpStatus.Unauthorized);
      await request(app)
        [method](path)
        .set('Authorization', invalidAuth)
        .expect(HttpStatus.Unauthorized);
    },
  );

  describe(`POST ${PATH.BLOGS}`, () => {
    it('should create', async () => {
      const response = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);

      expect(response.body).toMatchObject(newBlog);
    });
  });

  describe(`GET ${PATH.BLOGS}`, () => {
    it('should return [] when no blogs', async () => {
      const response = await request(app).get(PATH.BLOGS).expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        pagesCount: 0,
        totalCount: 0,
      });
    });

    it('should return list of blogs', async () => {
      const { body: blog1 } = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);
      const { body: blog2 } = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(updatedBlog)
        .expect(HttpStatus.Created);

      const response = await request(app).get(PATH.BLOGS).expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        items: [blog2, blog1],
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 2,
      });
    });
  });

  describe(`GET ${PATH.BLOGS}/:id`, () => {
    it('should return 404 when no blog', async () => {
      await request(app)
        .get(`${PATH.BLOGS}/${validMongoId}`)
        .expect(HttpStatus.NotFound);
    });

    it('should return blog with requested id', async () => {
      await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);
      const { body: blog2 } = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);

      const response = await request(app)
        .get(`${PATH.BLOGS}/${blog2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual(blog2);
    });
  });

  describe(`PUT ${PATH.BLOGS}/:id`, () => {
    it('should return 404 when no blog', async () => {
      await request(app)
        .put(`${PATH.BLOGS}/${validMongoId}`)
        .set('Authorization', validAuth)
        .send(updatedBlog)
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const { body: blog1 } = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);
      const { body: blog2 } = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);

      await request(app)
        .put(`${PATH.BLOGS}/${blog1.id}`)
        .set('Authorization', validAuth)
        .send({ ...updatedBlog, minAgeRestriction: null })
        .expect(HttpStatus.NoContent);
      await request(app)
        .put(`${PATH.BLOGS}/${blog2.id}`)
        .set('Authorization', validAuth)
        .send(updatedBlog)
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${PATH.BLOGS}/${blog2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toMatchObject(updatedBlog);
    });
  });

  describe(`DELETE ${PATH.BLOGS}/:id`, () => {
    it('should return 404 when no blog', async () => {
      await request(app)
        .delete(`${PATH.BLOGS}/${validMongoId}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);
      const { body: blog2 } = await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);

      await request(app)
        .delete(`${PATH.BLOGS}/${blog2.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
    });
  });

  describe('Test blog-posts', () => {
    const newPost = {
      title: 'Новые возможности TypeScript',
      shortDescription: 'Обзор новых фич и улучшений в TypeScript',
      content:
        'TypeScript 5.0 представляет множество улучшений производительности и новые возможности...',
    };

    describe(`POST ${PATH.BLOGS}/:id/posts`, () => {
      it('should return 400 if not exist blog', async () => {
        await request(app)
          .post(`${PATH.BLOGS}/${validMongoId}/posts`)
          .set('Authorization', validAuth)
          .send(newPost)
          .expect(HttpStatus.NotFound);
      });

      it('should create', async () => {
        const { body: blog } = await request(app)
          .post(PATH.BLOGS)
          .set('Authorization', validAuth)
          .send(newBlog)
          .expect(HttpStatus.Created);
        const response = await request(app)
          .post(`${PATH.BLOGS}/${blog.id}/posts`)
          .set('Authorization', validAuth)
          .send(newPost)
          .expect(HttpStatus.Created);

        expect(response.body).toMatchObject({
          ...newPost,
          blogId: blog.id,
          blogName: blog.name,
        });
      });
    });

    describe(`GET ${PATH.BLOGS}/:id/posts`, () => {
      it('should return 404 if not exist blog', async () => {
        await request(app)
          .get(`${PATH.BLOGS}/${validMongoId}/posts`)
          .set('Authorization', validAuth)
          .expect(HttpStatus.NotFound);
      });

      it('should return Paginated<[]> when no posts', async () => {
        const { body: blog } = await request(app)
          .post(PATH.BLOGS)
          .set('Authorization', validAuth)
          .send(newBlog)
          .expect(HttpStatus.Created);
        const response = await request(app)
          .get(`${PATH.BLOGS}/${blog.id}/posts`)
          .expect(HttpStatus.Ok);

        expect(response.body).toEqual({
          items: [],
          page: 1,
          pageSize: 10,
          pagesCount: 0,
          totalCount: 0,
        });
      });

      it('should return list of posts', async () => {
        const { body: blog } = await request(app)
          .post(PATH.BLOGS)
          .set('Authorization', validAuth)
          .send(newBlog)
          .expect(HttpStatus.Created);
        const { body: blog2 } = await request(app)
          .post(PATH.BLOGS)
          .set('Authorization', validAuth)
          .send({ ...newBlog, name: 'Blog2' })
          .expect(HttpStatus.Created);
        await request(app)
          .post(`${PATH.BLOGS}/${blog.id}/posts`)
          .set('Authorization', validAuth)
          .send(newPost)
          .expect(HttpStatus.Created);
        await request(app)
          .post(`${PATH.BLOGS}/${blog2.id}/posts`)
          .set('Authorization', validAuth)
          .send(newPost)
          .expect(HttpStatus.Created);
        await request(app)
          .post(`${PATH.BLOGS}/${blog.id}/posts`)
          .set('Authorization', validAuth)
          .send(newPost)
          .expect(HttpStatus.Created);

        const response = await request(app)
          .get(`${PATH.BLOGS}/${blog.id}/posts`)
          .expect(HttpStatus.Ok);

        expect(response.body.items.length).toBe(2);

        const response2 = await request(app)
          .get(`${PATH.BLOGS}/${blog2.id}/posts`)
          .expect(HttpStatus.Ok);

        expect(response2.body.items.length).toBe(1);
      });
    });
  });
});
