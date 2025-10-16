import { Router, Request, Response } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-status';
import { Video } from '../types/videos';
import { VideoUpdateDto } from '../dto/video.update-dto';
import { validateVideoCreateDto } from '../validation/validate-video-create-dto';
import { createErrorMessages } from '../../core/utils/create-error-message';
import { ErrorMessages } from '../../core/types/validation';
import { validateVideoUpdateDto } from '../validation/validate-video-update-dto';

export const videosRouter = Router({});

videosRouter
  .get('/', (req: Request, res: Response<Video[]>) => {
    res.json(db.videos);
  })

  .post('/', (req: Request, res: Response<Video | ErrorMessages>) => {
    const errors = validateVideoCreateDto(req.body);

    if (errors.length) {
      res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));

      return;
    }

    const dateObj = new Date();
    const createdAt = dateObj.toISOString();

    dateObj.setDate(dateObj.getDate() + 1);

    const publicationDate = dateObj.toISOString();
    const video = {
      id: (db.videos.at(-1)?.id || 0) + 1,
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt,
      publicationDate,
      availableResolutions: req.body.availableResolutions,
    };

    db.videos.push(video);

    res.status(HttpStatus.Created).json(video);
  })

  .get('/:id', (req: Request<{ id: string }>, res: Response<Video>) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id));

    if (!video) {
      res.sendStatus(HttpStatus.NotFound);

      return;
    }

    res.json(video);
  })

  .put('/:id', (req: Request<{ id: string }>, res: Response) => {
    const video = db.videos.find(({ id }) => id === Number(req.params.id));

    if (!video) {
      res.sendStatus(HttpStatus.NotFound);

      return;
    }

    const errors = validateVideoUpdateDto(req.body);

    if (errors.length) {
      res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));

      return;
    }

    video.author = req.body.author;
    video.title = req.body.title;
    video.canBeDownloaded = req.body.canBeDownloaded;
    video.publicationDate = req.body.publicationDate;
    video.minAgeRestriction = req.body.minAgeRestriction;
    video.availableResolutions = req.body.availableResolutions;

    res.sendStatus(HttpStatus.NoContent);
  })

  .delete('/:id', (req: Request<{ id: string }>, res: Response) => {
    const index = db.videos.findIndex(({ id }) => id === Number(req.params.id));

    if (index === -1) {
      res.sendStatus(HttpStatus.NotFound);

      return;
    }

    db.videos.splice(index, 1);
    res.sendStatus(HttpStatus.NoContent);
  });
