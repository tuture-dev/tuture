import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import chalk from 'chalk';
import zip from 'lodash.zip';
import { flags } from '@oclif/command';
import { File, Change } from 'parse-diff';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { TUTURE_YML_PATH, DIFF_PATH } from '../constants';
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
    assetsPath: flags.string({
      description: 'path to assets root directory',
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
    const { name, description, topics, categories, created, updated } = meta;
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
    if (categories) {
      const cats = categories
        .map((category) => `"${this.sanitize(category)}"`)
        .join(', ');
      elements.push(`categories: [${cats}]`);
    }
    if (created) {
      elements.push(`date: ${new Date(created).toISOString()}`);
    }
    if (updated) {
      elements.push(`updated: ${new Date(updated).toISOString()}`);
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

    return `${elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim()}\n`;
  }

  replaceAssetPaths(tutorial: string, newPrefix: string) {
    const { assetsRoot } = this.userConfig;
    return tutorial.replace(/!\[(.*)\]\((.+)\)/g, (_, caption, assetPath) => {
      return `![${caption}](${assetPath.replace(assetsRoot, newPrefix)})`;
    });
  }

  generateTutorials(tuture: Tuture, rawDiffs: RawDiff[]) {
    const {
      name,
      splits,
      description,
      topics,
      categories,
      steps,
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
      tutorials = splits.map((split) => {
        const start = commits.indexOf(split.start);
        const end = commits.indexOf(split.end) + 1;

        const meta: TutureMeta = {
          topics,
          categories,
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

    return [tutorials, titles];
  }

  saveTutorials(tutorials: string[], titles: string[]) {
    const { assetsRoot, assetsPath, buildPath, hexo } = this.userConfig;
    if (!this.userConfig.out && !fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath);
    }

    tutorials.forEach((tutorial, index) => {
      // Path to target tutorial.
      const dest =
        this.userConfig.out || path.join(buildPath, `${titles[index]}.md`);

      // Path to assets directory of target tutorial.
      const assetsDir = hexo
        ? path.join(path.dirname(dest), titles[index])
        : path.join(path.dirname(dest), assetsPath || assetsRoot);

      // Copy all assets.
      if (fs.existsSync(assetsRoot)) {
        fs.copySync(assetsRoot, assetsDir, { overwrite: true });
      }

      // Replace asset paths if needed.
      const newTutorial = hexo
        ? this.replaceAssetPaths(tutorial, '.')
        : assetsPath
        ? this.replaceAssetPaths(tutorial, assetsPath)
        : tutorial;
      fs.writeFileSync(dest, newTutorial);

      logger.log('success', `Tutorial has been written to ${chalk.bold(dest)}`);
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

    const [tutorials, titles] = this.generateTutorials(tuture, rawDiffs);
    this.saveTutorials(tutorials, titles);
  }
}
