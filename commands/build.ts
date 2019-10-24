import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import chalk from 'chalk';
import zip from 'lodash.zip';
import { flags } from '@oclif/command';
import { File, Change } from 'parse-diff';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { TUTURE_YML_PATH, DIFF_PATH } from '../config';
import { Diff, Step, Tuture, TutureMeta } from '../types';

type RawDiff = {
  commit: string;
  diff: File[];
};

// Global variable for storing parsed flags.
let parsedFlags: any;

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
  if (text && parsedFlags.hexo) {
    return text.replace(/`([^`\n]+)`/g, (_, code: string) =>
      code.match(/[\{\}]/) ? `\`{% raw %}${code}{% endraw %}\`` : `\`${code}\``,
    );
  }
  return text || '';
};

// Template for metadata of hexo posts.
const hexoFrontMatterTmpl = (meta: TutureMeta) => {
  const { name, description, topics, created, updated } = meta;
  const elements = ['---', `title: "${name.replace('"', '')}"`];
  if (description) {
    elements.push(`description: "${sanitize(description).replace('"', '')}"`);
  }
  if (topics) {
    const tags = topics.map((topic) => `"${sanitize(topic)}"`).join(', ');
    elements.push(`tags: [${tags}]`);
  }
  if (created) {
    elements.push(`date: ${created.toISOString()}`);
  }
  if (updated) {
    elements.push(`updated: ${updated.toISOString()}`);
  }
  elements.push('---');

  return elements.join('\n');
};

// Template for single line of change.
const changeTmpl = (change: Change, newFile = false) => {
  let prefix = '';
  const mode = parsedFlags.hexo ? 'hexo' : 'plain';

  if (!newFile) {
    prefix = diffRenderHints[mode][change.type];
  }

  return prefix + change.content.slice(1);
};

// Template for code blocks.
const codeBlockTmpl = (file: File) => {
  const lang = file.to ? file.to.split('.').slice(-1)[0] : '';
  const mode = parsedFlags.hexo ? 'hexo' : 'plain';

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
const tutorialTmpl = (meta: TutureMeta, steps: Step[], rawDiffs: RawDiff[]) => {
  const { name, description } = meta;
  const elements = [
    zip(steps, rawDiffs)
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

  if (parsedFlags.hexo) {
    elements.unshift(hexoFrontMatterTmpl(meta));
  } else {
    elements.unshift(sanitize(`# ${name}`) || '', sanitize(description) || '');
  }

  return elements
    .filter((elem) => elem)
    .join('\n\n')
    .trim();
};

// Replace assets URL with github links if present.
const replaceAssetsURL = (tutorial: string, github?: string) => {
  if (!github) return tutorial;

  const match = github.match(/^https:\/\/github.com\/(.+)\/(.+)$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid github URL: ${github}`);
  }

  return tutorial.replace(/!\[.*\]\((.+)\)/g, (_, assetPath) => {
    return `![](https://raw.githubusercontent.com/${match[1]}/${match[2]}/master/${assetPath})`;
  });
};

export default class Build extends BaseCommand {
  static description = 'Build tutorial into a markdown document';

  static flags = {
    help: flags.help({ char: 'h' }),
    out: flags.string({
      char: 'o',
      description: 'name of output file',
    }),
    hexo: flags.boolean({
      description: 'hexo compatibility mode',
      default: false,
    }),
  };

  async run() {
    parsedFlags = this.parse(Build).flags;

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
    const rawDiffs: RawDiff[] = JSON.parse(
      fs.readFileSync(DIFF_PATH).toString(),
    );

    if (rawDiffs.length === 0) {
      logger.log(
        'warning',
        'No commits yet. Target tutorial will have empty content.',
      );
    }

    const {
      name,
      splits,
      description,
      topics,
      steps,
      github,
      created,
      updated,
    } = tuture;

    let tutorials: string[] = [];
    let titles: string[] = [];

    if (splits) {
      const commits = rawDiffs.map((diff) => diff.commit);
      titles = splits.map(
        (split, index) => split.name || `${name} (${index + 1})`,
      );

      // Iterate over each split of tutorial.
      tutorials = splits.map((split, index) => {
        const start = commits.indexOf(split.start);
        const end = commits.indexOf(split.end) + 1;

        const meta: TutureMeta = {
          topics,
          created,
          updated,
          name: split.name || name,
          description: split.description || description,
        };

        return tutorialTmpl(
          meta,
          steps.slice(start, end),
          rawDiffs.slice(start, end),
        );
      });
    } else {
      const meta: TutureMeta = {
        topics,
        created,
        updated,
        name,
        description,
      };
      tutorials = [tutorialTmpl(meta, steps, rawDiffs)];
      titles = [name];
    }

    if (!parsedFlags.out && !fs.existsSync('tuture-build')) {
      fs.mkdirSync('tuture-build');
    }

    tutorials.forEach((tutorial, index) => {
      const dest =
        parsedFlags.out || path.join('tuture-build', `${titles[index]}.md`);

      fs.writeFileSync(dest, replaceAssetsURL(tutorial, github));
      logger.log('success', `Tutorial has been written to ${chalk.bold(dest)}`);
    });
  }
}
