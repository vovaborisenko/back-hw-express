import {
  ValidationEntries,
  ValidationError,
} from '../../core/types/validation';
import { validateStringFactory } from './validate-string-factory';
import { validateDto } from '../../core/utils/validate-dto';
import { BlogUpdateDto } from '../dto/blog.update-dto';

const validationEntries = [
  ['name', validateStringFactory(15)],
  ['description', validateStringFactory(500)],
  ['websiteUrl', validateStringFactory(100)],
] satisfies ValidationEntries;

export function validateBlogUpdateDto(
  data: BlogUpdateDto & Record<string, unknown>,
): ValidationError[] {
  return validateDto(data, validationEntries);
}
