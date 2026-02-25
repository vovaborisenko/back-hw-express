import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { validAuth } from '../constants/common';
import { createBlogAndHisPost, postDto } from '../utils/post/post.util';
import { createBlog } from '../utils/blog/blog.util';
import { createUserAndLogin } from '../utils/user/user.util';
import { commentDto } from '../utils/comment/comment.util';

describe('Posts API body validation', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
  });

  afterAll(async () => {
    await stopDb();
  });

  beforeEach(async () => {
    await request(app)
      .delete(PATH.TESTING_ALL_DATA)
      .expect(HttpStatus.NoContent);
  });

  describe(`POST ${PATH.POSTS}`, () => {
    it.each`
      field                 | value               | message
      ${'title'}            | ${null}             | ${'title should be string'}
      ${'title'}            | ${5}                | ${'title should be string'}
      ${'title'}            | ${''}               | ${'Length of title should be between 1 and 30'}
      ${'title'}            | ${'    '}           | ${'Length of title should be between 1 and 30'}
      ${'title'}            | ${'4'.repeat(31)}   | ${'Length of title should be between 1 and 30'}
      ${'shortDescription'} | ${null}             | ${'shortDescription should be string'}
      ${'shortDescription'} | ${5}                | ${'shortDescription should be string'}
      ${'shortDescription'} | ${''}               | ${'Length of shortDescription should be between 1 and 100'}
      ${'shortDescription'} | ${'    '}           | ${'Length of shortDescription should be between 1 and 100'}
      ${'shortDescription'} | ${'4'.repeat(101)}  | ${'Length of shortDescription should be between 1 and 100'}
      ${'content'}          | ${null}             | ${'content should be string'}
      ${'content'}          | ${5}                | ${'content should be string'}
      ${'content'}          | ${''}               | ${'Length of content should be between 1 and 1000'}
      ${'content'}          | ${'    '}           | ${'Length of content should be between 1 and 1000'}
      ${'content'}          | ${'4'.repeat(1001)} | ${'Length of content should be between 1 and 1000'}
      ${'blogId'}           | ${null}             | ${'blogId should be string'}
      ${'blogId'}           | ${5}                | ${'blogId should be string'}
      ${'blogId'}           | ${''}               | ${'Length of blogId should be between 1 and Infinity'}
      ${'blogId'}           | ${'    '}           | ${'Length of blogId should be between 1 and Infinity'}
      ${'blogId'}           | ${'dsfr'}           | ${'ID is invalid'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const blog = await createBlog(app);
        const response = await request(app)
          .post(PATH.POSTS)
          .set('Authorization', validAuth)
          .send({ ...postDto.create, blogId: blog.id, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe(`PUT ${PATH.POSTS}/:id`, () => {
    it.each`
      field                 | value               | message
      ${'title'}            | ${null}             | ${'title should be string'}
      ${'title'}            | ${5}                | ${'title should be string'}
      ${'title'}            | ${''}               | ${'Length of title should be between 1 and 30'}
      ${'title'}            | ${'    '}           | ${'Length of title should be between 1 and 30'}
      ${'title'}            | ${'4'.repeat(31)}   | ${'Length of title should be between 1 and 30'}
      ${'shortDescription'} | ${null}             | ${'shortDescription should be string'}
      ${'shortDescription'} | ${5}                | ${'shortDescription should be string'}
      ${'shortDescription'} | ${''}               | ${'Length of shortDescription should be between 1 and 100'}
      ${'shortDescription'} | ${'    '}           | ${'Length of shortDescription should be between 1 and 100'}
      ${'shortDescription'} | ${'4'.repeat(101)}  | ${'Length of shortDescription should be between 1 and 100'}
      ${'content'}          | ${null}             | ${'content should be string'}
      ${'content'}          | ${5}                | ${'content should be string'}
      ${'content'}          | ${''}               | ${'Length of content should be between 1 and 1000'}
      ${'content'}          | ${'    '}           | ${'Length of content should be between 1 and 1000'}
      ${'content'}          | ${'4'.repeat(1001)} | ${'Length of content should be between 1 and 1000'}
      ${'blogId'}           | ${null}             | ${'blogId should be string'}
      ${'blogId'}           | ${5}                | ${'blogId should be string'}
      ${'blogId'}           | ${''}               | ${'Length of blogId should be between 1 and Infinity'}
      ${'blogId'}           | ${'    '}           | ${'Length of blogId should be between 1 and Infinity'}
      ${'blogId'}           | ${'dsfr'}           | ${'ID is invalid'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const [blog, post] = await createBlogAndHisPost(app);

        const response = await request(app)
          .put(`${PATH.POSTS}/${post.id}`)
          .set('Authorization', validAuth)
          .send({ ...postDto.update, blogId: blog.id, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe(`PUT ${PATH.POSTS}/:id/like-status`, () => {
    it.each`
      field           | value        | message
      ${'likeStatus'} | ${null}      | ${'likeStatus should be string'}
      ${'likeStatus'} | ${5}         | ${'likeStatus should be string'}
      ${'likeStatus'} | ${''}        | ${'Should be on of None, Like, Dislike'}
      ${'likeStatus'} | ${'    '}    | ${'Should be on of None, Like, Dislike'}
      ${'likeStatus'} | ${'unknown'} | ${'Should be on of None, Like, Dislike'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const [, post] = await createBlogAndHisPost(app);
        const { token } = await createUserAndLogin(app);

        const response = await request(app)
          .put(`${PATH.POSTS}/${post.id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send({ [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe(`POST ${PATH.POSTS}/:id/comments`, () => {
    it.each`
      field        | value              | message
      ${'content'} | ${null}            | ${'content should be string'}
      ${'content'} | ${5}               | ${'content should be string'}
      ${'content'} | ${''}              | ${'Length of content should be between 20 and 300'}
      ${'content'} | ${'    '}          | ${'Length of content should be between 20 and 300'}
      ${'content'} | ${'4'.repeat(19)}  | ${'Length of content should be between 20 and 300'}
      ${'content'} | ${'l'.repeat(301)} | ${'Length of content should be between 20 and 300'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const { token } = await createUserAndLogin(app);
        const [, post] = await createBlogAndHisPost(app);
        const response = await request(app)
          .post(`${PATH.POSTS}/${post.id}/comments`)
          .set('Authorization', `Bearer ${token}`)
          .send({ ...commentDto.create, [field]: value })
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
