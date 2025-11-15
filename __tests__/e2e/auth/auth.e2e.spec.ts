import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { UserCreateDto } from '../../../src/users/dto/user.create-dto';
import { validAuth } from '../../../src/testing/constants/common';

describe('Auth API', () => {
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

  const newUser: UserCreateDto = {
    login: 'Login2',
    email: 'seek@opt.de',
    password: 'pass)(ssap',
  };

  describe(`POST ${PATH.AUTH}/login`, () => {
    it('should return 401 if login or password is wrong', async () => {
      await request(app)
        .post(`${PATH.AUTH}/login`)
        .send({
          loginOrEmail: 'loginOrEmail',
          password: 'password',
        })
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200 and accessToken when credentials is right', async () => {
      const { body: user } = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);

      const responses = await Promise.all([
        request(app)
          .post(`${PATH.AUTH}/login`)
          .send({
            loginOrEmail: newUser.login,
            password: newUser.password,
          })
          .expect(HttpStatus.Ok),
        request(app)
          .post(`${PATH.AUTH}/login`)
          .send({
            loginOrEmail: newUser.email,
            password: newUser.password,
          })
          .expect(HttpStatus.Ok),
      ]);

      responses.forEach(({ body: { accessToken } }) =>
        // @ts-ignore
        expect(jws.decode(accessToken)?.userId).toBe(user.id),
      );
    });
  });
});
