import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { UserCreateDto } from '../../../src/users/dto/user.create-dto';
import { validAuth } from '../../../src/testing/constants/common';

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
    login: 'myLogin',
    email: 'ask@rest.com',
    password: 'some#Strict@pass',
  };
  const longPassword = 'asff-awf+asws@ASDf$f#';

  describe(`POST ${PATH.USERS}`, () => {
    it.each`
      field         | value             | message
      ${'login'}    | ${null}           | ${'login should be string'}
      ${'login'}    | ${5}              | ${'login should be string'}
      ${'login'}    | ${''}             | ${'Length of login should be between 3 and 10'}
      ${'login'}    | ${'   '}          | ${'Length of login should be between 3 and 10'}
      ${'login'}    | ${'ar '}          | ${'Length of login should be between 3 and 10'}
      ${'login'}    | ${'ar-23_ZvtV45'} | ${'Length of login should be between 3 and 10'}
      ${'login'}    | ${'ar-23+vtV'}    | ${'Invalid value'}
      ${'email'}    | ${null}           | ${'email should be string'}
      ${'email'}    | ${5}              | ${'email should be string'}
      ${'email'}    | ${''}             | ${'Length of email should be between 6 and Infinity'}
      ${'email'}    | ${'   '}          | ${'Length of email should be between 6 and Infinity'}
      ${'email'}    | ${'w@w.s'}        | ${'Length of email should be between 6 and Infinity'}
      ${'email'}    | ${'w+@w.s_u'}     | ${'Invalid value'}
      ${'email'}    | ${'ar-23_ZvfrtV'} | ${'Invalid value'}
      ${'password'} | ${null}           | ${'password should be string'}
      ${'password'} | ${5}              | ${'password should be string'}
      ${'password'} | ${''}             | ${'Length of password should be between 6 and 20'}
      ${'password'} | ${'   '}          | ${'Length of password should be between 6 and 20'}
      ${'password'} | ${' dfe@#  '}     | ${'Length of password should be between 6 and 20'}
      ${'password'} | ${longPassword}   | ${'Length of password should be between 6 and 20'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(PATH.USERS)
          .set('Authorization', validAuth)
          .send({ ...userData, [field]: value })
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
