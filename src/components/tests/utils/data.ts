import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

import { extractCommits, extractMetaData } from '../../../utils/extractors';
import { Tuture } from '../../../types';

const yamlPath = path.join(__dirname, 'tuture.yml');
const tutureYaml = fs.readFileSync(yamlPath, {
  encoding: 'utf8',
});
const tuture = yaml.safeLoad(tutureYaml);

const commits = extractCommits(tuture as Tuture);
const metadata = extractMetaData(tuture as Tuture);

export { commits, metadata };
