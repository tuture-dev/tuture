import debug from 'debug';
import fs from 'fs-extra';
import path from 'path';
import pick from 'lodash.pick';
import { isBinaryFile } from 'isbinaryfile';
import { Element, Node } from 'editure';
import { Collection, IText, INode, IMark } from '@tuture/core';
import {
  Collection as CollectionV1,
  Step,
  File,
  Explain,
  StepTitle,
} from '@tuture/core/dist/legacy';
import {
  readDiff,
  readFileAtCommit,
  saveDoc,
  saveCollection,
  saveToInventory,
  getInventoryItemByPath,
} from '@tuture/local-server';

const d = debug('tuture:migrator');

function convertInline(node: Node): IText | INode | null {
  if (node.type === 'image') {
    return {
      type: 'image',
      attrs: {
        src: node.url,
        alt: '',
        title: '',
      },
    };
  }
  if (typeof node.text !== 'string') {
    throw new Error(`invalid text node: ${JSON.stringify(node)}`);
  }

  // do not generate empty text node!
  if (!node.text) {
    return null;
  }

  const text: IText = {
    type: 'text',
    text: node.text,
  };
  const marks: IMark[] = Object.keys(node)
    .filter((key) => key !== 'text')
    .map((key) => {
      switch (key) {
        case 'bold':
          return { type: 'bold' };
        case 'italic':
          return { type: 'italic' };
        case 'code':
          return { type: 'code' };
        case 'link':
          return { type: 'link', attrs: { href: node.url, title: '' } };
        case 'strikethrough':
          return { type: 'strike' };
        case 'underline':
          return { type: 'underline' };
        default:
          return { type: 'invalid' };
      }
    })
    .filter((mark) => mark.type !== 'invalid');

  if (marks.length > 0) {
    text.marks = marks;
  }

  return text;
}

function convertInlineNodes(nodes: Node[]): INode[] {
  return nodes.map((n) => convertInline(n)).filter((n) => n) as INode[];
}

function convertBlock(node: Element): INode {
  switch (node.type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        content: convertInlineNodes(node.children),
      };
    case 'block-quote':
      return {
        type: 'blockquote',
        content: node.children.map((n) => convertBlock(n as Element)),
      };
    case 'code-block':
      return {
        type: 'code_block',
        attrs: { language: node.lang },
        content: [
          {
            type: 'text',
            text: node.children.map((line) => line.children[0].text).join('\n'),
          },
        ],
      };
    case 'image':
      return {
        type: 'paragraph',
        content: [
          {
            type: 'image',
            attrs: { src: node.url },
          },
        ],
      };
    case 'note':
      return {
        type: 'notice',
        attrs: { style: node.level },
        content: node.children.map((n) => convertBlock(n as Element)),
      };
    case 'hr':
      return {
        type: 'horizontal_rule',
      };
    case 'bulleted-list':
      return {
        type: 'bullet_list',
        content: node.children.map((n) => convertBlock(n as Element)),
      };
    case 'numbered-list':
      return {
        type: 'ordered_list',
        attrs: { order: 1 },
        content: node.children.map((n) => convertBlock(n as Element)),
      };
    case 'list-item':
      return {
        type: 'list_item',
        content: [
          {
            type: 'paragraph',
            content: convertInlineNodes(node.children),
          },
        ],
      };
    case 'heading-one':
      return {
        type: 'heading',
        attrs: { level: 1, id: node.id },
        content: convertInlineNodes(node.children),
      };
    case 'heading-two':
      return {
        type: 'heading',
        attrs: { level: 2, id: node.id },
        content: convertInlineNodes(node.children),
      };
    case 'heading-three':
      return {
        type: 'heading',
        attrs: { level: 3, id: node.id },
        content: convertInlineNodes(node.children),
      };
    case 'heading-four':
      return {
        type: 'heading',
        attrs: { level: 4, id: node.id },
        content: convertInlineNodes(node.children),
      };
    case 'heading-five':
      return {
        type: 'heading',
        attrs: { level: 5, id: node.id },
        content: convertInlineNodes(node.children),
      };
    case 'heading-six':
      return {
        type: 'heading',
        attrs: { level: 6, id: node.id },
        content: convertInlineNodes(node.children),
      };
    default:
      return {
        type: 'paragraph',
        content: convertInlineNodes(node.children),
      };
  }
}

function convertFile(file: File): INode[] {
  if (file.children.length !== 3) {
    throw new Error(`number of children err, file: ${JSON.stringify(file)}`);
  }
  const [prex, diff, postex] = file.children;
  const commitFile = {
    commit: diff.commit,
    file: file.file,
    display: file.display,
  };
  return [
    {
      type: 'file_start',
      attrs: commitFile,
    },
    {
      type: 'explain',
      attrs: {
        level: 'file',
        pos: 'pre',
        ...commitFile,
      },
      content: prex.children.map((block) => convertBlock(block as Element)),
    },
    {
      type: 'diff_block',
      attrs: {
        hiddenLines: diff.hiddenLines,
        ...commitFile,
      },
    },
    {
      type: 'explain',
      attrs: {
        level: 'file',
        pos: 'post',
        ...commitFile,
      },
      content: postex.children.map((block) => convertBlock(block as Element)),
    },
    {
      type: 'file_end',
      attrs: commitFile,
    },
  ];
}

function convertStep(step: Step): INode[] {
  return [
    { type: 'step_start', attrs: { commit: step.commit } },
    ...step.children.flatMap((node, index) => {
      if (index === 0) {
        const title = node as StepTitle;
        return {
          type: 'heading',
          content: convertInlineNodes(title.children),
          attrs: {
            id: title.id,
            level: 2,
            fixed: true,
            commit: title.commit,
          },
        };
      } else if (index === 1 || index === step.children.length - 1) {
        return {
          type: 'explain',
          attrs: {
            fixed: true,
            level: 'step',
            pos: index === 1 ? 'pre' : 'post',
            commit: step.commit,
          },
          content: (node as Explain).children.map((block) =>
            convertBlock(block as Element),
          ),
        };
      } else {
        return convertFile(node as File);
      }
    }),
    { type: 'step_end', attrs: { commit: step.commit } },
  ];
}

export type MigrateOptions = {
  dryRun: boolean;
};

export async function migrate(tutorialPath: string, options: MigrateOptions) {
  process.chdir(tutorialPath);
  d('cwd: %s', process.cwd());

  const item = getInventoryItemByPath(process.cwd());
  d('inventory item: %o', item);
  if (item) {
    console.log('Tutorial has already been migrated!');
    return;
  }

  const oldCollectionPath = path.join('.tuture', 'collection.json');
  const oldCollection: CollectionV1 = fs.readJSONSync(oldCollectionPath);
  console.log(`legacy collection read from ${oldCollectionPath}`);

  const articleProms = oldCollection.articles.map(async (article) => {
    const steps = oldCollection.steps.filter(
      (step) => step.articleId === article.id,
    );
    if (steps.length === 0) {
      return;
    }
    let nodes = steps.flatMap((step) => convertStep(step));
    nodes = await Promise.all(
      nodes.map(async (node) => {
        if (node.type !== 'diff_block') {
          return node;
        }
        const { commit, file } = node.attrs!;
        if (await isBinaryFile(file)) {
          return node;
        }

        const diffFile = (await readDiff(commit)).filter(
          (df) => df.to! === file,
        )[0];
        const code = diffFile.deleted
          ? ''
          : (await readFileAtCommit(commit, file)) || '';
        const originalCode = diffFile.new
          ? ''
          : (await readFileAtCommit(`${commit}~1`, file)) || '';

        // Skip files with too lengthy diff
        if (code.length > 10000 || originalCode.length > 10000) {
          return node;
        }

        return {
          type: 'diff_block',
          attrs: { ...node.attrs, code, originalCode },
        };
      }),
    );
    const doc = {
      type: 'doc',
      content: nodes,
      attrs: { id: article.id },
    };
    if (options.dryRun) {
      console.log('saving doc:', JSON.stringify(doc, null, 2));
    } else {
      await saveDoc(doc);
    }
  });
  await Promise.all(articleProms);

  const newCollection: Collection = pick(oldCollection, [
    'name',
    'id',
    'created',
    'articles',
    'version',
  ]);
  newCollection.version = 'v2';

  if (options.dryRun) {
    console.log('new collection:', JSON.stringify(newCollection, null, 2));
  } else {
    saveToInventory(process.cwd(), newCollection);
    saveCollection(newCollection);
    console.log('saved collection to inventory.');
  }
}
