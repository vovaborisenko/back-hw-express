import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import request from 'supertest';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { LoginDto } from '../../../src/auth/dto/login.dto';
import { PasswordUpdateDto } from '../../../src/auth/dto/password-update.dto';
import { PasswordRecoveryDto } from '../../../src/auth/dto/password-recovery.dto';

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
          .send({ ...loginData, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe(`POST ${PATH.AUTH}/new-password`, () => {
    const newPassword: PasswordUpdateDto = {
      recoveryCode: 'ask-rest-com',
      newPassword: 'some#Strict@pass',
    };

    it.each`
      field             | value                      | message
      ${'recoveryCode'} | ${null}                    | ${'recoveryCode should be string'}
      ${'recoveryCode'} | ${5}                       | ${'recoveryCode should be string'}
      ${'recoveryCode'} | ${''}                      | ${'Length of recoveryCode should be between 1 and Infinity'}
      ${'recoveryCode'} | ${'   '}                   | ${'Length of recoveryCode should be between 1 and Infinity'}
      ${'newPassword'}  | ${null}                    | ${'newPassword should be string'}
      ${'newPassword'}  | ${5}                       | ${'newPassword should be string'}
      ${'newPassword'}  | ${''}                      | ${'Length of newPassword should be between 6 and 20'}
      ${'newPassword'}  | ${'   '}                   | ${'Length of newPassword should be between 6 and 20'}
      ${'newPassword'}  | ${'somew'}                 | ${'Length of newPassword should be between 6 and 20'}
      ${'newPassword'}  | ${'someVeryLongPassworda'} | ${'Length of newPassword should be between 6 and 20'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(`${PATH.AUTH}/new-password`)
          .send({ ...newPassword, [field]: value })
          .expect(HttpStatus.BadRequest);

        expect(
          response.body.errorsMessages.find(
            (error: { field: string }) => error.field === field,
          )?.message,
        ).toBe(message);
      },
    );
  });

  describe(`POST ${PATH.AUTH}/password-recovery`, () => {
    const dto: PasswordRecoveryDto = {
      email: 'ask@rest.com',
    };

    it.each`
      field      | value             | message
      ${'email'} | ${5}              | ${'email should be string'}
      ${'email'} | ${''}             | ${'Length of email should be between 1 and Infinity'}
      ${'email'} | ${'   '}          | ${'Length of email should be between 1 and Infinity'}
      ${'email'} | ${'w$@w.s_u'}     | ${'Invalid value'}
      ${'email'} | ${'ar-23_ZvfrtV'} | ${'Invalid value'}
    `(
      'should throw 400: field = $field, value = $value, message = $message',
      async ({ field, value, message }) => {
        const response = await request(app)
          .post(`${PATH.AUTH}/password-recovery`)
          .send({ ...dto, [field]: value })
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
