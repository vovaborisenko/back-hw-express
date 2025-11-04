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
    login: 'myLogin',
    email: 'ask@rest.com',
    password: 'some#Strict@pass',
  };
  const newUser2: UserCreateDto = {
    login: 'Login2',
    email: 'seek@opt.de',
    password: 'pass)(ssap',
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

    it.each`
      field
      ${'login'}
      ${'email'}
    `('should throw 400 for the same $field', async ({ field }) => {
      await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send(newUser)
        .expect(HttpStatus.Created);
      const response = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send({
          ...newUser2,
          // @ts-ignore
          [field]: newUser[field],
        })
        .expect(HttpStatus.BadRequest);

      expect(
        response.body.errorsMessages.find(
          (error: { field: string }) => error.field === field,
        ),
      ).toBeTruthy();
      expect(response.body.errorsMessages.length).toBe(1);
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
        .send(newUser2)
        .expect(HttpStatus.Created);

      await request(app)
        .delete(`${PATH.USERS}/${user2.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
    });
  });
});
