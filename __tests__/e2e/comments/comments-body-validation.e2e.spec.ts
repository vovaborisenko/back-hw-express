import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { commentDto, createComment } from '../utils/comment/comment.util';

describe('Comments API body validation', () => {
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

  describe(`PUT ${PATH.COMMENTS}/:id`, () => {
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
        const [comment, , token] = await createComment(app);
        const response = await request(app)
          .put(`${PATH.COMMENTS}/${comment.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({ ...commentDto.update, [field]: value })
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
