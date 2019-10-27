import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import chalk from 'chalk';
import zip from 'lodash.zip';
import { flags } from '@oclif/command';
import { File, Change } from 'parse-diff';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { TUTURE_YML_PATH, DIFF_PATH, GITHUB_RAW_PATH } from '../constants';
import { Diff, Step, Tuture, TutureMeta } from '../types';

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

  // Sanitize explanation string for hexo compatibility
  sanitize(text: string | undefined) {
    if (text && this.userConfig.hexo) {
      return text.replace(/`([^`\n]+)`/g, (_, code: string) =>
        code.match(/[\{\}]/)
          ? `\`{% raw %}${code}{% endraw %}\``
          : `\`${code}\``,
      );
    }
    return text || '';
  }

  // Template for metadata of hexo posts.
  hexoFrontMatterTmpl(meta: TutureMeta) {
    const { name, description, topics, created, updated } = meta;
    const elements = ['---', `title: "${name.replace('"', '')}"`];
    if (description) {
      elements.push(
        `description: "${this.sanitize(description).replace('"', '')}"`,
      );
    }
    if (topics) {
      const tags = topics
        .map((topic) => `"${this.sanitize(topic)}"`)
        .join(', ');
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
  }

  // Template for single line of change.
  changeTmpl(change: Change, newFile = false) {
    let prefix = '';
    const mode = this.userConfig.hexo ? 'hexo' : 'plain';

    if (!newFile) {
      prefix = diffRenderHints[mode][change.type];
    }

    return prefix + change.content.slice(1);
  }

  // Template for code blocks.
  codeBlockTmpl(file: File) {
    const lang = file.to ? file.to.split('.').slice(-1)[0] : '';
    const mode = this.userConfig.hexo ? 'hexo' : 'plain';

    const code = file.chunks
      .map((chunk) => {
        const { changes } = chunk;
        return changes
          ? changes
              .map((change) => this.changeTmpl(change, file.new))
              .join('\n')
          : null;
      })
      .filter((elem) => elem)
      .join(diffRenderHints[mode]['omit']);

    const tmpl = `\`\`\`${file.new || mode === 'hexo' ? lang : 'diff'} ${
      file.to
    }\n${code}\n\`\`\``;

    return tmpl;
  }

  // Markdown template for a Diff object.
  diffTmpl(diff: Diff, file: File) {
    const elements = [
      diff.explain ? this.sanitize(diff.explain.pre) : '',
      this.codeBlockTmpl(file),
      diff.explain ? this.sanitize(diff.explain.post) : '',
    ];

    return elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim();
  }

  // Markdown template for a single Step.
  stepTmpl(step: Step, files: File[]) {
    const elements = [
      this.sanitize(`## ${step.name}`),
      step.explain ? this.sanitize(step.explain.pre) : '',
      zip(step.diff, files)
        .map((zipObj) => {
          const [diff, file] = zipObj;
          return diff && file && diff.display ? this.diffTmpl(diff, file) : '';
        })
        .filter((elem) => elem)
        .join('\n\n'),
      step.explain ? this.sanitize(step.explain.post) : '',
    ];

    return elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim();
  }

  // Markdown template for the whole tutorial.
  tutorialTmpl(meta: TutureMeta, steps: Step[], rawDiffs: RawDiff[]) {
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

          return this.stepTmpl(step, files);
        })
        .filter((elem) => elem)
        .join('\n\n'),
    ];

    if (this.userConfig.hexo) {
      elements.unshift(this.hexoFrontMatterTmpl(meta));
    } else {
      elements.unshift(
        this.sanitize(`# ${name}`) || '',
        this.sanitize(description) || '',
      );
    }

    return elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim();
  }

  // Replace assets URL with github links if present.
  replaceAssetsURL(tutorial: string, github?: string) {
    if (!github) return tutorial;

    const match = github.match(/^https:\/\/github.com\/(.+)\/(.+)$/);
    if (!match || !match[1] || !match[2]) {
      logger.warn(`Invalid github URL: ${github}`);
      return tutorial;
    }

    return tutorial.replace(/!\[.*\]\((.+)\)/g, (_, assetPath) => {
      return `![](${GITHUB_RAW_PATH}/${match[1]}/${match[2]}/master/${assetPath})`;
    });
  }

  async run() {
    const { flags } = this.parse(Build);
    this.userConfig = Object.assign(this.userConfig, flags);

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

        return this.tutorialTmpl(
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
      tutorials = [this.tutorialTmpl(meta, steps, rawDiffs)];
      titles = [name];
    }

    const { buildPath } = this.userConfig;
    if (!this.userConfig.out && !fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath);
    }

    tutorials.forEach((tutorial, index) => {
      const dest =
        this.userConfig.out || path.join(buildPath, `${titles[index]}.md`);

      fs.writeFileSync(dest, this.replaceAssetsURL(tutorial, github));
      logger.log('success', `Tutorial has been written to ${chalk.bold(dest)}`);
    });
  }
}
