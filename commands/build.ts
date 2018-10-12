import fs from 'fs-extra';
import yaml from 'js-yaml';
import zip from 'lodash.zip';
import { flags } from '@oclif/command';
import { File } from 'parse-diff';

import BaseCommand from '../base';
import { TUTURE_YML_PATH, DIFF_PATH } from '../config';
import { Diff, Step, Tuture } from '../types';

type RawDiff = {
  commit: string;
  diff: File[];
};

// Markdown template for code blocks.
const codeBlock = (file: File) => {
  const lang = file.to ? file.to.split('.').slice(-1)[0] : '';
  const code = file.chunks[0].changes
    .map((change) => change.content.slice(1))
    .join('\n');
  return `
\`\`\`${lang}
${code}
\`\`\``;
};

// Markdown template for a Diff object.
const diffTmpl = (diff: Diff, file: File) => `
${diff.explain ? diff.explain.pre || '' : ''}
${codeBlock(file)}
${diff.explain ? diff.explain.post || '' : ''}`;

// Markdown template for a single Step.
const stepTmpl = (step: Step, files: File[]) => `
## ${step.name}

${step.explain ? step.explain.pre || '' : ''}
${zip(step.diff, files)
  .map((zipObj) => {
    const [diff, file] = zipObj;
    return diff && file ? diffTmpl(diff, file) : '';
  })
  .join('')}
${step.explain ? step.explain.post || '' : ''}`;

// Markdown template for the whole tutorial.
const tutorialTmpl = (tuture: Tuture, rawDiffs: RawDiff[]) => `# ${tuture.name}

${tuture.description || ''}
${zip(tuture.steps, rawDiffs)
  .map((zipObj) => {
    const [step, rawDiff] = zipObj;
    return step && rawDiff ? stepTmpl(step, rawDiff.diff) : '';
  })
  .join('\n')}`;

export default class Build extends BaseCommand {
  static description = 'Build tutorial into a markdown document';

  static flags = {
    help: flags.help({ char: 'h' }),
    out: flags.string({
      char: 'o',
      description: 'name of output file',
    }),
  };

  async run() {
    const { flags } = this.parse(Build);

    if (!fs.existsSync(TUTURE_YML_PATH)) {
      this.error('Cannot build without tuture.yml!');
      this.exit(1);
    }

    if (!fs.existsSync(DIFF_PATH)) {
      this.error('Cannot build without diff.json!');
      this.exit(1);
    }

    const tuture: Tuture = yaml.safeLoad(
      fs.readFileSync(TUTURE_YML_PATH).toString(),
    );
    const rawDiff: RawDiff[] = JSON.parse(
      fs.readFileSync(DIFF_PATH).toString(),
    );

    const tutorial = tutorialTmpl(tuture, rawDiff);
    const dest = flags.out || 'tutorial.md';
    fs.writeFileSync(dest, tutorial);

    this.success('Tutorial has been built!');
  }
}
