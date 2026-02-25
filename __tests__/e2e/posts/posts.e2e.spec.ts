import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-status';
import { PATH } from '../../../src/core/paths/paths';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { invalidAuth, validAuth, validMongoId } from '../constants/common';
import {
  createBlogAndHisPost,
  createBlogAndHisPosts,
  postDto,
} from '../utils/post/post.util';
import { createBlog } from '../utils/blog/blog.util';
import {
  commentDto,
  createComment,
  createComments,
} from '../utils/comment/comment.util';
import {
  createUserAndLogin,
  createUsersAndLogin,
} from '../utils/user/user.util';
import { LikeStatus } from '../../../src/likes/types/like';

describe('Posts API', () => {
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
    ${PATH.POSTS}         | ${'post'}
    ${PATH.POSTS + '/12'} | ${'put'}
    ${PATH.POSTS + '/12'} | ${'delete'}
  `(
    `should return 401 when invalid header Authorization: [$method] $path`,
    async ({
      path,
      method,
    }: {
      path: string;
      method: 'post' | 'put' | 'delete';
    }) => {
      await request(app)[method](path).expect(HttpStatus.Unauthorized);
      await request(app)
        [method](path)
        .set('Authorization', invalidAuth)
        .expect(HttpStatus.Unauthorized);
    },
  );

  describe(`POST ${PATH.POSTS}`, () => {
    it('should return 400 if not exist blog', async () => {
      await request(app)
        .post(PATH.POSTS)
        .set('Authorization', validAuth)
        .send({ ...postDto.create, blogId: validMongoId })
        .expect(HttpStatus.NotFound);
    });

    it('should create', async () => {
      const [blog, post] = await createBlogAndHisPost(app);

      expect(post).toEqual({
        ...postDto.create,
        blogId: blog.id,
        blogName: blog.name,
        id: expect.any(String),
        createdAt: expect.any(String),
        extendedLikesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatus.None,
          newestLikes: [],
        },
      });
    });
  });

  describe(`GET ${PATH.POSTS}`, () => {
    it('should return Paginated<[]> when no posts', async () => {
      const response = await request(app).get(PATH.POSTS).expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        pagesCount: 0,
        totalCount: 0,
      });
    });

    it('should return list of posts', async () => {
      await createBlogAndHisPosts(2, app);

      const response = await request(app).get(PATH.POSTS).expect(HttpStatus.Ok);

      expect(response.body.items.length).toBe(2);
    });
  });

  describe(`GET ${PATH.POSTS}/:id`, () => {
    it('should return 404 when no post', async () => {
      await request(app)
        .get(`${PATH.POSTS}/${validMongoId}`)
        .expect(HttpStatus.NotFound);
    });

    it('should return post with requested id', async () => {
      const [, posts] = await createBlogAndHisPosts(2, app);

      const response = await request(app)
        .get(`${PATH.POSTS}/${posts[1].id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual(posts[1]);
    });
  });

  describe(`PUT ${PATH.POSTS}/:id`, () => {
    it('should return 404 when no post', async () => {
      const blog = await createBlog(app);
      await request(app)
        .put(`${PATH.POSTS}/${validMongoId}`)
        .set('Authorization', validAuth)
        .send({ ...postDto.update, blogId: blog.id })
        .expect(HttpStatus.NotFound);
    });

    it('should return 400 if not exist blog', async () => {
      const [, post] = await createBlogAndHisPost(app);

      await request(app)
        .put(`${PATH.POSTS}/${post.id}`)
        .set('Authorization', validAuth)
        .send({ ...postDto.create, blogId: validMongoId })
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const [blog, [post1, post2]] = await createBlogAndHisPosts(2, app);
      const editedPost = { ...postDto.update, blogId: blog.id };

      await request(app)
        .put(`${PATH.POSTS}/${post1.id}`)
        .set('Authorization', validAuth)
        .send({ ...editedPost, title: 'updated title' })
        .expect(HttpStatus.NoContent);
      await request(app)
        .put(`${PATH.POSTS}/${post2.id}`)
        .set('Authorization', validAuth)
        .send(editedPost)
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${PATH.POSTS}/${post2.id}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toMatchObject(editedPost);
    });
  });

  describe(`PUT ${PATH.POSTS}/:id/like-status`, () => {
    it('should return 404 when no post', async () => {
      const { token } = await createUserAndLogin(app);
      await request(app)
        .put(`${PATH.POSTS}/${validMongoId}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.updateLikeStatus[0])
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const [, post] = await createBlogAndHisPost(app);
      const { token, user } = await createUserAndLogin(app);

      await request(app)
        .put(`${PATH.POSTS}/${post.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.updateLikeStatus[0])
        .expect(HttpStatus.NoContent);

      const response = await request(app)
        .get(`${PATH.POSTS}/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        ...post,
        extendedLikesInfo: {
          ...post.extendedLikesInfo,
          likesCount: post.extendedLikesInfo.likesCount + 1,
          myStatus: LikeStatus.Like,
          newestLikes: [
            {
              addedAt: expect.any(String),
              login: user.login,
              userId: user.id,
            },
          ],
        },
      });

      await request(app)
        .put(`${PATH.POSTS}/${post.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.updateLikeStatus[1])
        .expect(HttpStatus.NoContent);

      const responseAfterDislike = await request(app)
        .get(`${PATH.POSTS}/${post.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.Ok);

      expect(responseAfterDislike.body).toEqual({
        ...post,
        extendedLikesInfo: {
          ...post.extendedLikesInfo,
          dislikesCount: post.extendedLikesInfo.dislikesCount + 1,
          myStatus: LikeStatus.Dislike,
        },
      });
    });

    it('should update likes', async () => {
      const [, post] = await createBlogAndHisPost(app);
      const createdUsers = await createUsersAndLogin(4, app);

      // set likes
      for (let i = 0; i < createdUsers.length; i++) {
        const { user, token } = createdUsers[i];
        await request(app)
          .put(`${PATH.POSTS}/${post.id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentDto.updateLikeStatus[0])
          .expect(HttpStatus.NoContent);

        const response = await request(app)
          .get(`${PATH.POSTS}/${post.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.Ok);

        post.extendedLikesInfo.newestLikes = [
          {
            addedAt: expect.any(String),
            login: user.login,
            userId: user.id,
          },
          ...post.extendedLikesInfo.newestLikes,
        ].slice(0, 3);
        post.extendedLikesInfo.likesCount += 1;
        const expectedLikeInfo = {
          ...post.extendedLikesInfo,
          myStatus: LikeStatus.Like,
        };

        expect(response.body.extendedLikesInfo).toEqual(expectedLikeInfo);

        const responseUnauth = await request(app)
          .get(`${PATH.POSTS}/${post.id}`)
          .expect(HttpStatus.Ok);

        expect(responseUnauth.body.extendedLikesInfo).toEqual({
          ...post.extendedLikesInfo,
          myStatus: LikeStatus.None,
        });
      }
      // set dislikes
      for (let i = 0; i < createdUsers.length; i++) {
        const { user, token } = createdUsers[i];
        await request(app)
          .put(`${PATH.POSTS}/${post.id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentDto.updateLikeStatus[1])
          .expect(HttpStatus.NoContent);

        const response = await request(app)
          .get(`${PATH.POSTS}/${post.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.Ok);

        post.extendedLikesInfo.newestLikes =
          post.extendedLikesInfo.newestLikes.filter(
            ({ userId }) => userId !== user.id,
          );
        post.extendedLikesInfo.likesCount -= 1;
        post.extendedLikesInfo.dislikesCount += 1;
        expect(response.body.extendedLikesInfo).toEqual({
          ...post.extendedLikesInfo,
          myStatus: LikeStatus.Dislike,
        });

        const responseUnauth = await request(app)
          .get(`${PATH.POSTS}/${post.id}`)
          .expect(HttpStatus.Ok);

        expect(responseUnauth.body.extendedLikesInfo).toEqual({
          ...post.extendedLikesInfo,
          myStatus: LikeStatus.None,
        });
      }
      // set none
      for (let i = 3; i < createdUsers.length; i++) {
        const { token } = createdUsers[i];
        await request(app)
          .put(`${PATH.POSTS}/${post.id}/like-status`)
          .set('Authorization', `Bearer ${token}`)
          .send(commentDto.updateLikeStatus[2])
          .expect(HttpStatus.NoContent);

        const response = await request(app)
          .get(`${PATH.POSTS}/${post.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.Ok);

        post.extendedLikesInfo.dislikesCount -= 1;
        expect(response.body.extendedLikesInfo).toEqual({
          ...post.extendedLikesInfo,
          myStatus: LikeStatus.None,
        });

        const responseUnauth = await request(app)
          .get(`${PATH.POSTS}/${post.id}`)
          .expect(HttpStatus.Ok);

        expect(responseUnauth.body.extendedLikesInfo).toEqual({
          ...post.extendedLikesInfo,
          myStatus: LikeStatus.None,
        });
      }
    });
  });

  describe(`DELETE ${PATH.POSTS}/:id`, () => {
    it('should return 404 when no post', async () => {
      await request(app)
        .delete(`${PATH.POSTS}/${validMongoId}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NotFound);
    });

    it('should return 204 when requested id exist', async () => {
      const [, [, post2]] = await createBlogAndHisPosts(2, app);

      await request(app)
        .delete(`${PATH.POSTS}/${post2.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
    });
  });

  describe(`POST ${PATH.POSTS}/:id/comments`, () => {
    it('should return 401 when no accessToken', async () => {
      const [, post] = await createBlogAndHisPost(app);
      await request(app)
        .post(`${PATH.POSTS}/${post.id}/comments`)
        .expect(HttpStatus.Unauthorized);
    });

    it('should return 404 when no post whit that id', async () => {
      const { token } = await createUserAndLogin(app);
      const [, post] = await createBlogAndHisPost(app);
      await request(app)
        .delete(`${PATH.POSTS}/${post.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
      await request(app)
        .post(`${PATH.POSTS}/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentDto.create)
        .expect(HttpStatus.NotFound);
    });

    it('should create comment', async () => {
      const [comment, , , user] = await createComment(app, commentDto.create);

      expect(comment).toEqual({
        ...commentDto.create,
        commentatorInfo: {
          userId: user.id,
          userLogin: user.login,
        },
        id: expect.any(String),
        createdAt: expect.any(String),
        likesInfo: {
          dislikesCount: 0,
          likesCount: 0,
          myStatus: LikeStatus.None,
        },
      });
    });
  });

  describe(`GET ${PATH.POSTS}/:id/comments`, () => {
    it('should return 404 when no post whit that id', async () => {
      const [, post] = await createBlogAndHisPost(app);
      await request(app)
        .delete(`${PATH.POSTS}/${post.id}`)
        .set('Authorization', validAuth)
        .expect(HttpStatus.NoContent);
      await request(app)
        .get(`${PATH.POSTS}/${post.id}/comments`)
        .expect(HttpStatus.NotFound);
    });

    it('should return Paginated<[]> when no comments', async () => {
      const [, post] = await createBlogAndHisPost(app);
      const response = await request(app)
        .get(`${PATH.POSTS}/${post.id}/comments`)
        .expect(HttpStatus.Ok);

      expect(response.body).toEqual({
        items: [],
        page: 1,
        pageSize: 10,
        pagesCount: 0,
        totalCount: 0,
      });
    });

    it('should return list of comments', async () => {
      const [, post] = await createComments(2, app);

      const response = await request(app)
        .get(`${PATH.POSTS}/${post.id}/comments`)
        .expect(HttpStatus.Ok);

      expect(response.body.items.length).toBe(2);
      expect(response.body).toMatchObject({
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 2,
      });
    });
  });
});
