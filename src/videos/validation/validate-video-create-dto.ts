import { VideoCreateDto } from '../dto/video.create-dto';
import {
  ValidationEntries,
  ValidationError,
} from '../../core/types/validation';
import { validateTitle } from './validate-title';
import { validateAuthor } from './validate-author';
import { validateResolutions } from './validate-resolutions';
import { validateDto } from '../../core/utils/validate-dto';

const validationEntries = [
  ['title', validateTitle],
  ['author', validateAuthor],
  ['availableResolutions', validateResolutions],
] satisfies ValidationEntries;

export function validateVideoCreateDto(
  data: VideoCreateDto & Record<string, unknown>,
): ValidationError[] {
  return validateDto(data, validationEntries);
}
