import { Resolution } from '../types/videos';

const availableResolutions = new Set(Object.values(Resolution));

export function validateResolutions(value: unknown): string | undefined {
  if (!Array.isArray(value)) {
    return 'Invalid value';
  }

  if (value.length === 0) {
    return 'Required value';
  }

  const impossibleResolution = value.find(
    (resolution) => !availableResolutions.has(resolution),
  );

  if (impossibleResolution) {
    return `Impossible resolution: ${impossibleResolution}`;
  }
}
