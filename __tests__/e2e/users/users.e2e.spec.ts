import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { PATH } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-status';
import { invalidAuth, validAuth, validMongoId } from '../constants/common';
import { createUser, createUsers, userDto } from '../utils/user/user.util';

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
      const user = await createUser(app, userDto.create[0]);

      expect(user).toMatchObject({
        id: expect.any(String),
        login: userDto.create[0].login,
        email: userDto.create[0].email,
        createdAt: expect.any(String),
      });
    });

    it.each`
      field
      ${'login'}
      ${'email'}
    `('should throw 400 for the same $field', async ({ field }) => {
      await createUser(app, userDto.create[0]);

      const response = await request(app)
        .post(PATH.USERS)
        .set('Authorization', validAuth)
        .send({
          ...userDto.create[1],
          // @ts-ignore
          [field]: userDto.create[0][field],
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

  describe(`GET ${PATH.USERS}`, () => {
    it('should return items: [] when no users', async () => {
      const response = await request(app)
        .get(PATH.USERS)
        .set('Authorization', validAuth)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        pagesCount: 0,
        totalCount: 0,
      });
    });

    describe('test query params', () => {
      beforeEach(async () => {
        await createUsers(2, app);
      });

      describe('pagination', () => {
        it('default', async () => {
          const response = await request(app)
            .get(PATH.USERS)
            .set('Authorization', validAuth)
            .expect(HttpStatus.Ok);

          expect(response.body).toMatchObject({
            page: 1,
            pageSize: 10,
            pagesCount: 1,
            totalCount: 2,
          });
        });

        it('pageSize', async () => {
          const response = await request(app)
            .get(`${PATH.USERS}?pageSize=1`)
            .set('Authorization', validAuth)
            .expect(HttpStatus.Ok);

          expect(response.body).toMatchObject({
            page: 1,
            pageSize: 1,
            pagesCount: 2,
            totalCount: 2,
          });
        });

        it('pageSize = 99', async () => {
          const response = await request(app)
            .get(`${PATH.USERS}?pageSize=99`)
            .set('Authorization', validAuth)
            .expect(HttpStatus.Ok);

          expect(response.body).toMatchObject({
            page: 1,
            pageSize: 99,
            pagesCount: 1,
            totalCount: 2,
          });
        });
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
      const [, user2] = await createUsers(2, app);

      await request(app)
        .delete(`${PATH.USERS}/${user2.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
    });
  });
});
