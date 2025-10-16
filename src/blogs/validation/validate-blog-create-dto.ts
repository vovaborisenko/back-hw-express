import { BlogCreateDto } from '../dto/blog.create-dto';
import {
  ValidationEntries,
  ValidationError,
} from '../../core/types/validation';
import { validateStringFactory } from './validate-string-factory';
import { validateDto } from '../../core/utils/validate-dto';

const validationEntries = [
  ['name', validateStringFactory(15)],
  ['description', validateStringFactory(500)],
  ['websiteUrl', validateStringFactory(100)],
] satisfies ValidationEntries;

export function validateBlogCreateDto(
  data: BlogCreateDto & Record<string, unknown>,
): ValidationError[] {
  return validateDto(data, validationEntries);
}
