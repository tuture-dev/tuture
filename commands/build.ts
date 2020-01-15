import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import zip from 'lodash.zip';
import { flags } from '@oclif/command';
import { File, Change } from 'parse-diff';

import BaseCommand from '../base';
import logger from '../utils/logger';
import { loadTuture } from '../utils/tuture';
import { Asset, loadAssetsTable, checkAssets } from '../utils/assets';
import { generateUserProfile } from '../utils/internals';
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
    add: '',
    del: '',
    omit: '...',
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
    const {
      name,
      description,
      topics,
      categories,
      created,
      updated,
      cover,
    } = meta;
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
    if (cover) {
      elements.push(`photos:\n  - ${cover}`);
    }
    elements.push('---');

    return elements.join('\n');
  }

  // Template for single line of change.
  changeTmpl(change: Change, newFile = false) {
    let prefix = '';
    const mode = this.userConfig.hexo ? 'hexo' : 'plain';

    if (mode === 'plain' && change.type === 'del') {
      return null;
    }

    if (!newFile) {
      prefix = diffRenderHints[mode][change.type];
    }

    return prefix + change.content.slice(1);
  }

  // Template for explanation string.
  explainTmpl(explain: string | undefined) {
    let text = this.sanitize(explain);

    if (this.userConfig.hexo) {
      text = text.replace(/::: (\w+)([^]+?):::/g, (_, type, content) => {
        return `{% note ${type} %}${content}{% endnote %}`;
      });
    } else {
      text = text.replace(/::: (\w+)([^]+?):::/g, (_, __, content: string) =>
        content
          .trim()
          .split(/\r?\n/)
          .map((elem) => `> ${elem}`)
          .join('\n'),
      );
    }

    return text;
  }

  // Template for code blocks.
  codeBlockTmpl(file: File, link?: string) {
    const filename = path.basename(file.to || '');
    const lang = filename ? filename.split('.').slice(-1)[0] : '';
    const mode = this.userConfig.hexo ? 'hexo' : 'plain';

    const code = file.chunks
      .map((chunk) => {
        const { changes } = chunk;
        return changes
          ? changes
              .map((change) => this.changeTmpl(change, file.new))
              .filter((elem) => elem !== null)
              .join('\n')
          : null;
      })
      .filter((elem) => elem)
      .join(diffRenderHints[mode]['omit']);

    const head = [lang];

    if (mode === 'hexo') {
      if (file.to) {
        head.push(file.to);
        if (link) {
          head.push(link);
          head.push('查看完整代码');
        }
      }
    }

    return `\`\`\`${head.join(' ')}\n${code}\n\`\`\``;
  }

  // Markdown template for a Diff object.
  diffTmpl(diff: Diff, file: File, link?: string) {
    const elements = [
      diff.explain ? this.explainTmpl(diff.explain.pre) : '',
      this.codeBlockTmpl(file, link),
      diff.explain ? this.explainTmpl(diff.explain.post) : '',
    ];

    return elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim();
  }

  // Markdown template for a single Step.
  stepTmpl(step: Step, files: File[], github?: string) {
    const { name, explain, diff, commit } = step;
    const elements = [
      this.sanitize(`## ${name}`),
      explain ? this.explainTmpl(explain.pre) : '',
      zip(diff, files)
        .map((zipObj) => {
          const [diff, file] = zipObj;
          const link =
            github && file ? `${github}/blob/${commit}/${file.to}` : undefined;
          return diff && file && diff.display
            ? this.diffTmpl(diff, file, link)
            : '';
        })
        .filter((elem) => elem)
        .join('\n\n'),
      explain ? this.explainTmpl(explain.post) : '',
    ];

    return elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim();
  }

  // Markdown template for the whole tutorial.
  tutorialTmpl(meta: TutureMeta, steps: Step[], rawDiffs: RawDiff[]) {
    const { name, description, github, cover } = meta;
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

          return this.stepTmpl(step, files, github);
        })
        .filter((elem) => elem)
        .join('\n\n'),
    ];

    // Add cover to the front.
    if (this.userConfig.hexo) {
      elements.unshift(
        this.hexoFrontMatterTmpl(meta),
        github ? generateUserProfile(github) : '',
      );
    } else {
      elements.unshift(
        cover ? `![](${cover})` : '',
        this.sanitize(`# ${name}`) || '',
        this.sanitize(description) || '',
      );
    }

    return `${elements
      .filter((elem) => elem)
      .join('\n\n')
      .trim()}\n`;
  }

  replaceAssetPaths(tutorial: string, assets: Asset[]) {
    let updated = tutorial;

    // Replace all local paths.
    // If not uploaded, replace it with absolute local path.
    assets.forEach(({ localPath, hostingUri }) => {
      updated = updated.replace(
        localPath,
        hostingUri || path.resolve(localPath),
      );
    });

    return updated;
  }

  generateTutorials(tuture: Tuture, rawDiffs: RawDiff[]) {
    const {
      name,
      splits,
      description,
      topics,
      categories,
      github,
      steps,
      created,
      updated,
      cover,
    } = tuture;

    const meta: TutureMeta = {
      topics,
      categories,
      github,
      created,
      updated,
      name,
      description,
      cover,
    };

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

        // Override outmost metadata with split metadata.
        const splitMeta = { ...meta, ...split };

        // Ensure the order for created timestamp.
        if (created) {
          splitMeta.created = new Date(Date.parse(created.toString()) + index);
        }

        return this.tutorialTmpl(
          splitMeta,
          steps.slice(start, end),
          rawDiffs.slice(start, end),
        );
      });
    } else {
      tutorials = [this.tutorialTmpl(meta, steps, rawDiffs)];
      titles = [name];
    }

    return [tutorials, titles];
  }

  saveTutorials(tutorials: string[], titles: string[], assets: Asset[]) {
    const { buildPath } = this.userConfig;
    if (!this.userConfig.out && !fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath);
    }

    tutorials.forEach((tutorial, index) => {
      // Path to target tutorial.
      const dest =
        this.userConfig.out || path.join(buildPath, `${titles[index]}.md`);

      // Replace local asset paths.
      fs.writeFileSync(dest, this.replaceAssetPaths(tutorial, assets));

      logger.log(
        'success',
        `Tutorial has been written to ${chalk.bold(dest)}.`,
      );
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

    const tuture = await loadTuture();
    const rawDiffs: RawDiff[] = JSON.parse(
      fs.readFileSync(DIFF_PATH).toString(),
    );

    const assets = loadAssetsTable();
    checkAssets(assets);

    if (rawDiffs.length === 0) {
      logger.log(
        'warning',
        'No commits yet. Target tutorial will have empty content.',
      );
    }

    if (flags.out && tuture.splits) {
      logger.log(
        'error',
        'Cannot specify output target when tutorial splitting is enabled.',
      );
      this.exit(1);
    }

    if (flags.hexo && !tuture.github) {
      logger.log('warning', 'No github field provided.');
    }

    const [tutorials, titles] = this.generateTutorials(tuture, rawDiffs);
    this.saveTutorials(tutorials, titles, assets);
  }
}
