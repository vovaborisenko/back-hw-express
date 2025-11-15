import express from 'express';
import jws from 'jsonwebtoken';
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

  describe(`GET ${PATH.AUTH}/me`, () => {
    it('should return 401 if accessToken is not exist', async () => {
      await request(app).get(`${PATH.AUTH}/me`).expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if accessToken is wrong', async () => {
      await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', 'Bearer accessToken')
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 401 if accessToken is right but user is deleted', async () => {
      const {
        body: { id: userId },
      } = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);

      const {
        body: { accessToken },
      } = await request(app)
        .post(`${PATH.AUTH}/login`)
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(HttpStatus.Ok);

      await request(app)
        .delete(`${PATH.USERS}/${userId}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);

      await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200 and me view model if accessToken is correct', async () => {
      const { body: user } = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);

      const {
        body: { accessToken },
      } = await request(app)
        .post(`${PATH.AUTH}/login`)
        .send({
          loginOrEmail: newUser.login,
          password: newUser.password,
        })
        .expect(HttpStatus.Ok);

      const { body: me } = await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.Ok);

      expect(me).toEqual({
        userId: user.id,
        login: user.login,
        email: user.email,
      });
    });
  });
});
