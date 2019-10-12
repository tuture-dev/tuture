import fs from 'fs-extra';
import yaml from 'js-yaml';
import hljs from 'highlight.js';
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

// TODO: remove this temporary hint when better diff display
// strategy is available.
const hint = `

============================================
============= 此处省略 n 行代码 ==============
============================================

`;

const htmlHint = `<tr>
  <td class="tuture-diff-code tuture-diff-code-omit">
    Omitted code ...
  </td>
</tr>`;

const styleCode = `<style>
.tuture-code-block {
  display: block;
  background-color: #f7f7f7;
}

.tuture-code-block figcaption {
  color: #fff;
  padding-left: 15px;
  background-color: #33a674;
}

.tuture-code-table {
  width: 100% !important;
  margin: 10px 0 !important;
  overflow: auto;
}

.tuture-code-table tbody {
  vertical-align: middle;
}

.tuture-code-table tbody > tr {
  line-height: 31px;
  display: table-row;
}

.tuture-diff-code {
  height: 2em;
  background-color: #f7f7f7;
  /* padding: 0; */
}

.tuture-diff-code pre {
  margin: 0px;
  padding: 4px 15px;
}

.tuture-diff-code pre code {
  font-size: 1em;
}

.tuture-diff-code-add pre {
  font-weight: 700;
  background-color: #e3e3e3 !important;
}

.tuture-diff-code-del pre {
  opacity: 0.3;
}

.tuture-diff-code-omit {
  text-align: center;
  padding: 10px 0px !important;
  background-color: #fefefe !important;
}
</style>`;

// Sanitize explanation string for hexo compatibility
const sanitize = (text: string | undefined) => {
  if (text && Build.flags.hexo) {
    return text.replace(
      /`([^`\n]+)`/g,
      (_, code) => `\`{% raw %}${code}{% endraw %}\``,
    );
  }
  return text;
};

// Code highlighting using highlight.js in place.
const highlighChanges = (changes: Change[], lang: string) => {
  const codeBlock = changes.map((change) => change.content.slice(1)).join('\n');
  const { value } = hljs.highlight(lang, codeBlock);
  const highlighted = value.split('\n');

  changes.forEach((change, index) => {
    change.content = highlighted[index].replace(/hljs-/g, '');
  });
};

// Template for single line of change.
const changeTmpl = (change: Change, newFile = false) => {
  let tmpl = '';

  if (Build.flags.hexo) {
    let className = 'tuture-diff-code';
    if (!newFile && change.type === 'add') {
      className += ' tuture-diff-code-add';
    } else if (!newFile && change.type === 'del') {
      className += ' tuture-diff-code-del';
    }
    tmpl = `<tr><td class="${className}"><pre><code>${
      change.content
    }</code></pre></td></tr>`;
  } else {
    let prefix = '';
    if (!newFile && change.type === 'add') {
      prefix = '+ ';
    } else if (!newFile && change.type === 'del') {
      prefix = '- ';
    }
    tmpl = prefix + change.content.slice(1);
  }

  return tmpl;
};

// Template for code blocks.
const codeBlockTmpl = (file: File) => {
  const lang = file.to ? file.to.split('.').slice(-1)[0] : '';
  const html = Build.flags.hexo;

  const code = file.chunks
    .map((chunk) => {
      const { changes } = chunk;
      if (html) {
        highlighChanges(changes, lang);
      }
      return changes
        ? changes.map((change) => changeTmpl(change, file.new)).join('\n')
        : null;
    })
    .filter((elem) => elem)
    .join(html ? htmlHint : hint);

  let tmpl = '';
  if (html) {
    tmpl = `<figure class="highlight ${lang} tuture-code-block">
  <figcaption><span>${file.to}</span></figcaption>
  <table class="tuture-code-table"><tbody>${code}</tbody></table>
</figure>`;
  } else {
    tmpl = `\`\`\`${file.new ? lang : 'diff'} ${file.to}\n${code}\n\`\`\``;
  }

  return `{% raw %}\n${tmpl}\n{% endraw %}`;
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
    sanitize(`# ${tuture.name}`),
    sanitize(tuture.description),
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

  // Add css styles in hexo mode.
  if (Build.flags.hexo) {
    elements.push(styleCode);
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
