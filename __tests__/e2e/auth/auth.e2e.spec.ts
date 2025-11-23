import express from 'express';
import jws from 'jsonwebtoken';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { validAuth } from '../constants/common';
import { createUserAndLogin } from '../utils/user/user.util';

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
      const { user, token } = await createUserAndLogin(app);

      // @ts-ignore
      expect(jws.decode(token)?.userId).toBe(user.id);
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
      const { user, token } = await createUserAndLogin(app);

      await request(app)
        .delete(`${PATH.USERS}/${user.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);

      await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 200 and me view model if accessToken is correct', async () => {
      const { user, token } = await createUserAndLogin(app);

      const { body: me } = await request(app)
        .get(`${PATH.AUTH}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Ok);

      expect(me).toEqual({
        userId: user.id,
        login: user.login,
        email: user.email,
      });
    });
  });

  describe(`POST ${PATH.AUTH}/registration-confirmation`, () => {
    it('should return 400 if code not exist', async () => {
      await request(app)
        .post(`${PATH.AUTH}/registration-confirmation`)
        .send({
          code: 'loginOrEmail',
        })
        .expect(HttpStatus.BadRequest);
    });

    it('should return 200 and accessToken when credentials is right', async () => {
      const { user, token } = await createUserAndLogin(app);

      // @ts-ignore
      expect(jws.decode(token)?.userId).toBe(user.id);
    });
  });
});
