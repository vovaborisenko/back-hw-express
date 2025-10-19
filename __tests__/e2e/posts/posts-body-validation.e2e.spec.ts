import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { PostCreateDto } from '../../../src/posts/dto/post.create-dto';
import { PostUpdateDto } from '../../../src/posts/dto/post.update-dto';
import { PATH } from '../../../src/core/paths/paths';

describe('Posts API body validation', () => {
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

  const validAuth = 'Basic ' + Buffer.from('admin:qwerty').toString('base64');

  beforeEach(async () => {
    await request(app)
      .delete(`${PATH.TESTING}/all-data`)
      .expect(HttpStatus.NoContent);

    const { body: createdBlog1 } = await request(app)
      .post(PATH.BLOGS)
      .set('Authorization', validAuth)
      .send(blog1)
      .expect(HttpStatus.Created);

    newPost.blogId = createdBlog1.id;

    const { body: createdBlog2 } = await request(app)
      .post(PATH.BLOGS)
      .set('Authorization', validAuth)
      .send(blog2)
      .expect(HttpStatus.Created);

    updatedPost.blogId = createdBlog2.id;
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
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(PATH.POSTS)
          .set('Authorization', validAuth)
          .send({ ...newPost, [field]: value })
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
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const { body: post } = await request(app)
          .post(PATH.POSTS)
          .set('Authorization', validAuth)
          .send(newPost)
          .expect(HttpStatus.Created);

        const response = await request(app)
          .put(`${PATH.POSTS}/${post.id}`)
          .set('Authorization', validAuth)
          .send({ ...updatedPost, [field]: value })
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
