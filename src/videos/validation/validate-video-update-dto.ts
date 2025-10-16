import {
  ValidationEntries,
  ValidationError,
} from '../../core/types/validation';
import { validateTitle } from './validate-title';
import { validateAuthor } from './validate-author';
import { validateResolutions } from './validate-resolutions';
import { validateDto } from '../../core/utils/validate-dto';
import { VideoUpdateDto } from '../dto/video.update-dto';
import { validateAge } from './validate-age';
import { validateDate } from './validate-date';
import { validateBoolean } from './validate-boolean';

const validationEntries = [
  ['title', validateTitle],
  ['author', validateAuthor],
  ['availableResolutions', validateResolutions],
  ['canBeDownloaded', validateBoolean],
  ['minAgeRestriction', validateAge],
  ['publicationDate', validateDate],
] satisfies ValidationEntries;

export function validateVideoUpdateDto(
  data: VideoUpdateDto & Record<string, unknown>,
): ValidationError[] {
  return validateDto(data, validationEntries);
}
