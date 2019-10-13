import fs from 'fs-extra';
import yaml from 'js-yaml';
import chalk from 'chalk';
import zip from 'lodash.zip';
import { flags } from '@oclif/command';
import { File, Change } from 'parse-diff';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { TUTURE_YML_PATH, DIFF_PATH } from '../config';
import { Diff, Step, Tuture } from '../types';

type RawDiff = {
  commit: string;
  diff: File[];
};

// Internal hints for rendering code lines.
const diffRenderHints: { [mode: string]: { [diffType: string]: string } } = {
  hexo: {
    normal: '',
    add: '[tuture-add]',
    del: '[tuture-del]',
    omit: '\n[tuture-omit]\n',
  },
  plain: {
    normal: '',
    add: '+ ',
    del: '- ',
    omit: `

============================================
=============== Omitted Code ===============
============================================

    `,
  },
};

// Sanitize explanation string for hexo compatibility
const sanitize = (text: string | undefined) => {
  if (text && Build.flags.hexo) {
    return text.replace(/`([^`\n]+)`/g, (_, code: string) =>
      code.match(/[\{\}]/) ? `\`{% raw %}${code}{% endraw %}\`` : `\`${code}\``,
    );
  }
  return text;
};

// Template for metadata of hexo posts.
const hexoMetaDataTmpl = (tuture: Tuture) => {
  const { name, description, topics } = tuture;
  const elements = ['---', `title: "${name}"`, 'comments: true'];
  if (description) {
    elements.push(`description: "${sanitize(description)}"`);
  }
  if (topics) {
    const tags = topics.map((topic) => `"${sanitize(topic)}"`).join(', ');
    elements.push(`tags: [${tags}]`);
  }
  elements.push('---');

  return elements.join('\n');
};

// Template for single line of change.
const changeTmpl = (change: Change, newFile = false) => {
  let prefix = '';
  const mode = Build.flags.hexo ? 'hexo' : 'plain';

  if (!newFile) {
    prefix = diffRenderHints[mode][change.type];
  }

  return prefix + change.content.slice(1);
};

// Template for code blocks.
const codeBlockTmpl = (file: File) => {
  const lang = file.to ? file.to.split('.').slice(-1)[0] : '';
  const mode = Build.flags.hexo ? 'hexo' : 'plain';

  const code = file.chunks
    .map((chunk) => {
      const { changes } = chunk;
      return changes
        ? changes.map((change) => changeTmpl(change, file.new)).join('\n')
        : null;
    })
    .filter((elem) => elem)
    .join(diffRenderHints[mode]['omit']);

  const tmpl = `\`\`\`${file.new || mode === 'hexo' ? lang : 'diff'} ${
    file.to
  }\n${code}\n\`\`\``;

  return tmpl;
};

// Markdown template for a Diff object.
const diffTmpl = (diff: Diff, file: File) => {
  const elements = [
    diff.explain ? sanitize(diff.explain.pre) : '',
    codeBlockTmpl(file),
    diff.explain ? sanitize(diff.explain.post) : '',
  ];

  return elements
    .filter((elem) => elem)
    .join('\n\n')
    .trim();
};

// Markdown template for a single Step.
const stepTmpl = (step: Step, files: File[]) => {
  const elements = [
    sanitize(`## ${step.name}`),
    step.explain ? sanitize(step.explain.pre) : '',
    zip(step.diff, files)
      .map((zipObj) => {
        const [diff, file] = zipObj;
        return diff && file && diff.display ? diffTmpl(diff, file) : '';
      })
      .filter((elem) => elem)
      .join('\n\n'),
    step.explain ? sanitize(step.explain.post) : '',
  ];

  return elements
    .filter((elem) => elem)
    .join('\n\n')
    .trim();
};

// Markdown template for the whole tutorial.
const tutorialTmpl = (tuture: Tuture, rawDiffs: RawDiff[]) => {
  const elements = [
    zip(tuture.steps, rawDiffs)
      .map((zipObj) => {
        const [step, rawDiff] = zipObj;
        if (!step || !rawDiff) return '';

        // Sort raw diffs according to tuture.yml
        const filenames = step.diff.map((diff) => diff.file);
        const files = filenames.map((filename) =>
          rawDiff.diff.find((elem) => elem.to === filename),
        ) as File[];

        return stepTmpl(step, files);
      })
      .filter((elem) => elem)
      .join('\n\n'),
  ];

  if (Build.flags.hexo) {
    elements.unshift(hexoMetaDataTmpl(tuture));
  } else {
    elements.unshift(
      sanitize(`# ${tuture.name}`) || '',
      sanitize(tuture.description) || '',
    );
  }

  return elements
    .filter((elem) => elem)
    .join('\n\n')
    .trim();
};

export default class Build extends BaseCommand {
  static description = 'Build tutorial into a markdown document';

  static flags = {
    help: flags.help({ char: 'h' }),
    out: flags.string({
      char: 'o',
      description: 'name of output file',
    }),
    assetsPath: flags.string({
      description: 'path to assets directory',
    }),
    hexo: flags.boolean({
      description: 'hexo compatibility mode',
      default: false,
    }),
  };

  async run() {
    const { flags } = this.parse(Build);

    if (!fs.existsSync(TUTURE_YML_PATH) || !fs.existsSync(DIFF_PATH)) {
      logger.log(
        'error',
        `You are not in a Tuture tutorial. Run ${chalk.bold(
          'tuture init',
        )} to initialize one.`,
      );
      this.exit(1);
    }

    const tuture: Tuture = yaml.safeLoad(
      fs.readFileSync(TUTURE_YML_PATH).toString(),
    );
    const rawDiff: RawDiff[] = JSON.parse(
      fs.readFileSync(DIFF_PATH).toString(),
    );

    if (rawDiff.length === 0) {
      logger.log(
        'warning',
        'No commits yet. Target tutorial will have empty content.',
      );
    }

    let tutorial = tutorialTmpl(tuture, rawDiff);
    if (flags.assetsPath) {
      tutorial = tutorial.replace(/.\/tuture-assets\//g, flags.assetsPath);
    }

    const dest = flags.out || 'tutorial.md';
    fs.writeFileSync(dest, tutorial);

    logger.log('success', `Tutorial has been written to ${chalk.bold(dest)}`);
  }
}
