import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { Command } from 'commander';
import { Element } from 'tuture-slate';
import { toMarkdown } from 'editure';
import { comment, getIdFromFilename, getHighlightFromId } from 'yutang';
import {
  IRawDiff,
  DiffFile,
  ChangeType,
  Collection,
  IMeta,
  isCommitEqual,
  tutureSchema,
  markdownSerializer,
} from '@tuture/core';

import logger from '../utils/logger';
import { generateUserProfile } from '../utils/internals';
import { readArticleMeta } from '../utils/node';

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

const noteLevels: { [level: string]: { name: string } } = {
  primary: { name: '主要' },
  success: { name: '成功' },
  info: { name: '提示' },
  warning: { name: '注意' },
  danger: { name: '危险' },
};

function concatCodeStr(diffItem: DiffFile) {
  let codeStr = '';
  const DIFF_ADD: number[] = [];
  const DIFF_DEL: number[] = [];

  diffItem.chunks.map((chunk, chunkIndex) => {
    chunk.changes.map((change, index) => {
      const { content, type } = change;

      if (type === 'add') {
        DIFF_ADD.push(index);
      } else if (type === 'del') {
        DIFF_DEL.push(index);
      }

      // handle render code content
      let code = content;

      if (content !== 'normal' && content.length === 1) {
        code = content.replace(/[+-]/, ' ');
      } else if (content !== 'normal' && content.length > 1) {
        code = content.slice(1);
      }

      if (
        chunkIndex === diffItem.chunks.length - 1 &&
        index === chunk.changes.length - 1
      ) {
        codeStr += code;
      } else {
        codeStr += `${code}\n`;
      }

      return change;
    });

    return chunk;
  });

  return { codeStr, DIFF_ADD, DIFF_DEL };
}

// Sanitize explanation string for hexo compatibility
function sanitize(text: string | undefined) {
  if (text && this.userConfig.hexo) {
    return text.replace(/`([^`\n]+)`/g, (_, code: string) =>
      code.match(/[\{\}]/) ? `\`{% raw %}${code}{% endraw %}\`` : `\`${code}\``,
    );
  }
  return text || '';
}

// Template for metadata of hexo posts.
function hexoFrontMatterTmpl(meta: IMeta) {
  const { name, description, topics, categories, created, cover } = meta;
  const elements = ['---', `title: "${name.replace('"', '')}"`];
  if (description) {
    elements.push(`description: "${sanitize(description).replace('"', '')}"`);
  }
  if (topics) {
    const tags = topics.map((topic) => `"${sanitize(topic)}"`).join(', ');
    elements.push(`tags: [${tags}]`);
  }
  if (categories) {
    const cats = categories
      .map((category) => `"${sanitize(category)}"`)
      .join(', ');
    elements.push(`categories: [${cats}]`);
  }
  if (created) {
    elements.push(`date: ${new Date(created).toISOString()}`);
  }
  if (cover) {
    elements.push(`photos:\n  - ${cover}`);
  }
  elements.push('---');

  return elements.join('\n');
}

// Template for single line of change.
function changeTmpl(
  content: string,
  type: ChangeType,
  newFile = false,
  hideDiff: boolean,
) {
  let prefix = '';
  const mode = this.userConfig.hexo ? 'hexo' : 'plain';

  if (mode === 'plain' && type === 'del') {
    return null;
  }

  if (!newFile) {
    if (hideDiff && type === 'add') {
      type = 'normal';
    } else {
      prefix = diffRenderHints[mode][type];
    }
  }

  return prefix + content;
}

// Template for code blocks.
function diffBlockTmpl(
  diff: DiffFile,
  hideDiff: boolean,
  hiddenLines?: number[],
  link?: string,
) {
  const filename = path.basename(diff.to || '');
  const langId = getIdFromFilename(filename);
  const highlight = getHighlightFromId(langId);
  const mode = this.userConfig.hexo ? 'hexo' : 'plain';

  const { codeStr, DIFF_ADD, DIFF_DEL } = concatCodeStr(diff);
  let code = codeStr
    .split('\n')
    .map((line, index) => {
      if (hiddenLines && hiddenLines.includes(index)) {
        if (hiddenLines.includes(index - 1)) {
          // If previous line is already hidden, don't show this line.
          return null;
        }
        const spaces = line.length - line.trimLeft().length;
        return `${' '.repeat(spaces)}${comment('...', highlight)}`;
      } else if (DIFF_ADD.includes(index)) {
        return changeTmpl(line, 'add', diff.new, hideDiff);
      } else if (DIFF_DEL.includes(index)) {
        return hideDiff ? null : changeTmpl(line, 'del', diff.new, hideDiff);
      } else {
        return line;
      }
    })
    .filter((line) => line !== null)
    .map((line) => (line && line.match(/^\s+$/) ? '' : line))
    .join('\n');

  const head = [langId];

  if (mode === 'hexo') {
    if (diff.to) {
      head.push(diff.to);
      if (link) {
        head.push(link);
        head.push('查看完整代码');
      }
    }
  } else if (diff.to && highlight !== 'text') {
    // Add commented filename to the front.
    code = comment(diff.to, highlight) + '\n' + code;
  }

  return `\`\`\`${head.join(' ')}\n${code}\n\`\`\``;
}

function noteBlockTmpl(content: string, level: string) {
  if (this.userConfig.hexo) {
    const title = noteLevels[level] ? `**${noteLevels[level].name}**\n\n` : '';
    return `{% note ${level} %}\n${title}${content}\n{% endnote %}`;
  }
  const lines = [`**${noteLevels[level].name}**`, '', ...content.split('\n')];
  return lines.map((line) => (line ? `> ${line}` : '>')).join('\n');
}

function getDiffFile(rawDiffs: IRawDiff[], commit: string, file: string) {
  const diffItem = rawDiffs.filter((rawDiff) =>
    isCommitEqual(rawDiff.commit, commit),
  )[0];

  if (!diffItem) {
    logger.log('warning', `Commit ${commit} is not found.`);
    return null;
  }

  return diffItem.diff.filter((diffFile) => diffFile.to === file)[0];
}

// Markdown template for the whole tutorial.
function articleTmpl(meta: IMeta, steps: any[]) {
  const { name, description, cover, github } = meta;

  const stepConverter = (node: Element) => {
    return node.children.map((n) => toMarkdown(n)).join('\n\n');
  };

  const fileConverter = (node: Element) => {
    return node.display
      ? node.children.map((n) => toMarkdown(n)).join('\n\n')
      : '';
  };

  const explainConverter = (node: Element) => {
    return sanitize(node.children.map((n) => toMarkdown(n)).join('\n\n'));
  };

  // const diffBlockConverter = (node: Element) => {
  //   const { commit, file, hiddenLines = [], hideDiff } = node as any;
  //   const diff = getDiffFile(rawDiffs, commit, file);
  //   const link = github ? `${github}/blob/${commit}/${file}` : undefined;
  //   const flatHiddenLines = hiddenLines.flatMap((range: any) => {
  //     const [start, end] = range;
  //     return [...Array(end - start + 1).keys()].map((elem) => elem + start);
  //   });

  //   return diff
  //     ? diffBlockTmpl(diff, hideDiff, flatHiddenLines, link)
  //     : '';
  // };

  const noteBlockConverter = (node: Element) => {
    const { level = 'default', children } = node;
    const content = children.map((n) => toMarkdown(n)).join('\n\n');

    return noteBlockTmpl(content, level);
  };

  const customBlockConverters = {
    step: stepConverter,
    file: fileConverter,
    explain: explainConverter,
    // ['diff-block']: diffBlockConverter,
    note: noteBlockConverter,
  };

  const elements = steps.map((step) =>
    toMarkdown(step, undefined, customBlockConverters),
  );

  // Add cover to the front.
  if (this.userConfig.hexo) {
    elements.unshift(
      hexoFrontMatterTmpl(meta),
      github ? generateUserProfile(github) : '',
    );
  } else {
    elements.unshift(
      cover ? `![](${cover})` : '',
      sanitize(`# ${name}`) || '',
      sanitize(description) || '',
    );
  }

  return elements
    .filter((elem) => elem)
    .join('\n\n')
    .trim()
    .replace(/\n{3,}/g, '\n\n');
}

function generateTutorials(collection: Collection) {
  const {
    name,
    articles,
    description,
    topics,
    categories,
    github,
    created,
    cover,
  } = collection;

  const meta = {
    topics,
    categories,
    github,
    created,
    name,
    description,
    cover,
  };

  const titles = articles.map(
    (split, index) => split.name || `${name} (${index + 1})`,
  );

  // Iterate over each split of tutorial.
  const tutorials = articles.map((article) => {
    // const articleSteps = steps.filter(
    //   (step) => step.articleId === article.id,
    // );
    const articleSteps: any[] = [];

    // Override outmost metadata with article metadata.
    const articleMeta = { ...meta, ...article };

    return articleTmpl(articleMeta, articleSteps);
  });

  return [tutorials, titles];
}

function saveTutorials(tutorials: string[], titles: string[]) {
  const { buildPath } = this.userConfig;
  if (!this.userConfig.out && !fs.existsSync(buildPath)) {
    fs.mkdirSync(buildPath);
  }

  tutorials.forEach((tutorial, index) => {
    // Path to target tutorial.
    const dest =
      this.userConfig.out || path.join(buildPath, `${titles[index]}.md`);

    logger.log('success', `Tutorial has been written to ${chalk.bold(dest)}.`);
  });
}

function doBuild() {
  // const collection = loadCollection();
  // if (flags.hexo && !collection.github) {
  //   logger.log('warning', 'No github field provided when hexo mode is on.');
  // }
  // const { buildPath } = this.userConfig;
  // if (!this.userConfig.out && !fs.existsSync(buildPath)) {
  //   fs.mkdirSync(buildPath);
  // }
  // collection.articles.forEach((article) => {
  //   const out = article.steps
  //     .map((step) => {
  //       const nodes = tutureSchema.nodeFromJSON(loadStepSync(step.id));
  //       return markdownSerializer.serialize(nodes as any);
  //     })
  //     .join('\n\n');
  //   const dest =
  //     this.userConfig.out ||
  //     path.join(buildPath, `${article.name || article.id}.md`);
  //   fs.writeFileSync(dest, out);
  //   logger.log(
  //     'success',
  //     `Tutorial has been written to ${chalk.bold(dest)}.`,
  //   );
  // });
}

export function makeBuildCommand() {
  const build = new Command('build');

  build
    .description('generate markdown documents')
    .option('-o, --out', 'name of output directory')
    .option('--hexo', 'hexo compatibility mode')
    .action(doBuild);

  return build;
}
