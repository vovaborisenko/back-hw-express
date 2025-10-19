import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { BlogCreateDto } from '../../../src/blogs/dto/blog.create-dto';
import { BlogUpdateDto } from '../../../src/blogs/dto/blog.update-dto';
import { PATH } from '../../../src/core/paths/paths';

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await request(app)
      .delete(`${PATH.TESTING}/all-data`)
      .expect(HttpStatus.NoContent);
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

  const validAuth = 'Basic ' + Buffer.from('admin:qwerty').toString('base64');
  const invalidAuth = 'Basic ' + Buffer.from('wrong:wrong').toString('base64');

  it.each`
    path                  | method
    ${PATH.BLOGS}         | ${'post'}
    ${PATH.BLOGS + '/12'} | ${'put'}
    ${PATH.BLOGS + '/12'} | ${'delete'}
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

      expect(response.body).toEqual([]);
    });

    it('should return list of blogs', async () => {
      await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);
      await request(app)
        .post(PATH.BLOGS)
        .set('Authorization', validAuth)
        .send(newBlog)
        .expect(HttpStatus.Created);

      const response = await request(app).get(PATH.BLOGS).expect(HttpStatus.Ok);

      expect(response.body.length).toBe(2);
    });
  });

  describe(`GET ${PATH.BLOGS}/:id`, () => {
    it('should return 404 when no blog', async () => {
      await request(app).get(`${PATH.BLOGS}/987`).expect(HttpStatus.NotFound);
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
        .put(`${PATH.BLOGS}/987`)
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
        .delete(`${PATH.BLOGS}/987`)
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
});
