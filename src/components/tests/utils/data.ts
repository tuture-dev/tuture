import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

import { handleSteps, handleStepsInfo } from '../../../utils/handleTuture';
import { Tuture } from '../../../types/index';

const yamlPath = path.join(__dirname, 'tuture.yml');
const tutureYaml = fs.readFileSync(yamlPath, {
  encoding: 'utf8',
});
const tuture = yaml.safeLoad(tutureYaml);

const catalogs = handleSteps(tuture as Tuture);
const catalogsInfo = handleStepsInfo(tuture as Tuture);

export {
  catalogs,
  catalogsInfo,
}

