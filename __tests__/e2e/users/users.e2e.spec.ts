import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import {
  invalidAuth,
  validAuth,
  validMongoId,
} from '../../../src/testing/constants/common';
import { UserCreateDto } from '../../../src/users/dto/user.create-dto';

describe('Users API', () => {
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
    login: 'myPerfectLogin',
    email: 'ask@rest.com',
    password: 'some#Strict@pass',
  };

  it.each`
    path                  | method
    ${PATH.USERS}         | ${'get'}
    ${PATH.USERS}         | ${'post'}
    ${PATH.USERS + '/12'} | ${'delete'}
  `(
    'should return 401 when invalid header Authorization: [$method] $path',
    async ({
      path,
      method,
    }: {
      path: string;
      method: 'post' | 'get' | 'delete';
    }) => {
      await request(app)[method](path).expect(HttpStatus.Unauthorized);
      await request(app)
        [method](path)
        .set('Authorization', invalidAuth)
        .expect(HttpStatus.Unauthorized);
    },
  );

  describe(`POST ${PATH.USERS}`, () => {
    it('should create', async () => {
      const response = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        login: newUser.login,
        email: newUser.email,
        createdAt: expect.any(String),
      });
    });
  });

  describe(`DELETE ${PATH.USERS}/:id`, () => {
    it('should return 400 when invalid id', async () => {
      await request(app)
        .delete(`${PATH.USERS}/someinvaliduserid`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.BadRequest);
    });

    it('should return 404 when no user', async () => {
      await request(app)
        .delete(`${PATH.USERS}/${validMongoId}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);
      const { body: user2 } = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);

      await request(app)
        .delete(`${PATH.USERS}/${user2.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
    });
  });
});
