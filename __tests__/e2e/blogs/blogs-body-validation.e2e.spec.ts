import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { BlogCreateDto } from '../../../src/blogs/dto/blog.create-dto';
import { BlogUpdateDto } from '../../../src/blogs/dto/blog.update-dto';
import { PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { validAuth } from '../../../src/testing/constants/common';

describe('Blogs API body validation', () => {
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

  describe(`POST ${PATH.BLOGS}`, () => {
    it.each`
      field            | value              | message
      ${'name'}        | ${null}            | ${'name should be string'}
      ${'name'}        | ${5}               | ${'name should be string'}
      ${'name'}        | ${''}              | ${'Length of name should be between 1 and 15'}
      ${'name'}        | ${'    '}          | ${'Length of name should be between 1 and 15'}
      ${'name'}        | ${'4'.repeat(16)}  | ${'Length of name should be between 1 and 15'}
      ${'description'} | ${null}            | ${'description should be string'}
      ${'description'} | ${5}               | ${'description should be string'}
      ${'description'} | ${''}              | ${'Length of description should be between 1 and 500'}
      ${'description'} | ${'    '}          | ${'Length of description should be between 1 and 500'}
      ${'description'} | ${'4'.repeat(501)} | ${'Length of description should be between 1 and 500'}
      ${'websiteUrl'}  | ${null}            | ${'websiteUrl should be string'}
      ${'websiteUrl'}  | ${5}               | ${'websiteUrl should be string'}
      ${'websiteUrl'}  | ${''}              | ${'Length of websiteUrl should be between 1 and 100'}
      ${'websiteUrl'}  | ${'    '}          | ${'Length of websiteUrl should be between 1 and 100'}
      ${'websiteUrl'}  | ${'4'.repeat(101)} | ${'Length of websiteUrl should be between 1 and 100'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(PATH.BLOGS)
          .set('Authorization', validAuth)
          .send({ ...newBlog, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe(`PUT ${PATH.BLOGS}/:id`, () => {
    it.each`
      field            | value              | message
      ${'name'}        | ${null}            | ${'name should be string'}
      ${'name'}        | ${5}               | ${'name should be string'}
      ${'name'}        | ${''}              | ${'Length of name should be between 1 and 15'}
      ${'name'}        | ${'    '}          | ${'Length of name should be between 1 and 15'}
      ${'name'}        | ${'4'.repeat(16)}  | ${'Length of name should be between 1 and 15'}
      ${'description'} | ${null}            | ${'description should be string'}
      ${'description'} | ${5}               | ${'description should be string'}
      ${'description'} | ${''}              | ${'Length of description should be between 1 and 500'}
      ${'description'} | ${'    '}          | ${'Length of description should be between 1 and 500'}
      ${'description'} | ${'4'.repeat(501)} | ${'Length of description should be between 1 and 500'}
      ${'websiteUrl'}  | ${null}            | ${'websiteUrl should be string'}
      ${'websiteUrl'}  | ${5}               | ${'websiteUrl should be string'}
      ${'websiteUrl'}  | ${''}              | ${'Length of websiteUrl should be between 1 and 100'}
      ${'websiteUrl'}  | ${'    '}          | ${'Length of websiteUrl should be between 1 and 100'}
      ${'websiteUrl'}  | ${'4'.repeat(101)} | ${'Length of websiteUrl should be between 1 and 100'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const { body: blog } = await request(app)
          .post(PATH.BLOGS)
          .set('Authorization', validAuth)
          .send(newBlog)
          .expect(HttpStatus.Created);

        const response = await request(app)
          .put(`${PATH.BLOGS}/${blog.id}`)
          .set('Authorization', validAuth)
          .send({ ...updatedBlog, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });
});
