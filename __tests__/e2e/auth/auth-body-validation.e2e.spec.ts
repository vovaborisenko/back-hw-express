import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { LoginDto } from '../../../src/auth/dto/login.dto';

describe('Auth API body validation', () => {
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

  const loginData: LoginDto = {
    loginOrEmail: 'ask@rest.com',
    password: 'some#Strict@pass',
  };

  describe(`POST ${PATH.AUTH}/login`, () => {
    it.each`
      field             | value    | message
      ${'loginOrEmail'} | ${null}  | ${'loginOrEmail should be string'}
      ${'loginOrEmail'} | ${5}     | ${'loginOrEmail should be string'}
      ${'loginOrEmail'} | ${''}    | ${'Length of loginOrEmail should be between 1 and Infinity'}
      ${'loginOrEmail'} | ${'   '} | ${'Length of loginOrEmail should be between 1 and Infinity'}
      ${'password'}     | ${null}  | ${'password should be string'}
      ${'password'}     | ${5}     | ${'password should be string'}
      ${'password'}     | ${''}    | ${'Length of password should be between 1 and Infinity'}
      ${'password'}     | ${'   '} | ${'Length of password should be between 1 and Infinity'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(`${PATH.AUTH}/login`)
          .send({ ...loginData, [field]: value });

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });
});
