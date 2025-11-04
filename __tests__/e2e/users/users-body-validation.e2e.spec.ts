import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { UserCreateDto } from '../../../src/users/dto/user.create-dto';

describe('Users API body validation', () => {
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

  const userData: UserCreateDto = {
    login: 'myPerfectLogin',
    email: 'ask@rest.com',
    password: 'some#Strict@pass',
  };

  describe(`POST ${PATH.USERS}`, () => {
    it.each`
      field         | value    | message
      ${'login'}    | ${null}  | ${'login should be string'}
      ${'login'}    | ${5}     | ${'login should be string'}
      ${'login'}    | ${''}    | ${'Length of login should be between 3 and 10'}
      ${'login'}    | ${'   '} | ${'Length of login should be between 3 and 10'}
      ${'email'}    | ${null}  | ${'email should be string'}
      ${'email'}    | ${5}     | ${'email should be string'}
      ${'email'}    | ${''}    | ${'Length of email should be between 6 and 20'}
      ${'email'}    | ${'   '} | ${'Length of email should be between 6 and 20'}
      ${'password'} | ${null}  | ${'password should be string'}
      ${'password'} | ${5}     | ${'password should be string'}
      ${'password'} | ${''}    | ${'Length of password should be between 1 and Infinity'}
      ${'password'} | ${'   '} | ${'Length of password should be between 1 and Infinity'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(PATH.USERS)
          .send({ ...userData, [field]: value });

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });
});
