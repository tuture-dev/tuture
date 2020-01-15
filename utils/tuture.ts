import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';

import { Tuture } from '../types';
import logger from '../utils/logger';
import { TUTURE_ROOT, TUTURE_YML_PATH } from '../constants';

export const tutureYMLPath = path.join(
  process.env.TUTURE_PATH || process.cwd(),
  TUTURE_ROOT,
  TUTURE_YML_PATH,
);

/**
 * Load Tuture object from tuture.yml.
 */
export function loadTuture(): Tuture {
  if (!fs.existsSync(tutureYMLPath)) {
    logger.log('error', 'Not in a valid Tuture tutorial.');
    process.exit(1);
  }

  const plainTuture = fs.readFileSync(tutureYMLPath).toString();

  // Check for tuture.yml syntax.
  try {
    yaml.safeLoad(plainTuture);
  } catch (err) {
    logger.log('error', err.message);
    process.exit(1);
  }

  return yaml.safeLoad(plainTuture);
}

/**
 * Save Tuture object back to tuture.yml.
 */
export function saveTuture(tuture: Tuture) {
  fs.writeFileSync(tutureYMLPath, yaml.safeDump(tuture));
}
