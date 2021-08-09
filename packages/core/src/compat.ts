import { Text as TextV1, Element, Node } from 'editure';
import { IText, INode, IMark } from './interfaces';
import { Collection, File, Explain, StepTitle } from './legacy';

import { newStepTitle } from './nodes';

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
        attrs: { level: 1 },
        content: convertInlineNodes(node.children),
      };
    case 'heading-two':
      return {
        type: 'heading',
        attrs: { level: 2 },
        content: convertInlineNodes(node.children),
      };
    case 'heading-three':
      return {
        type: 'heading',
        attrs: { level: 3 },
        content: convertInlineNodes(node.children),
      };
    case 'heading-four':
      return {
        type: 'heading',
        attrs: { level: 4 },
        content: convertInlineNodes(node.children),
      };
    case 'heading-five':
      return {
        type: 'heading',
        attrs: { level: 5 },
        content: convertInlineNodes(node.children),
      };
    case 'heading-six':
      return {
        type: 'heading',
        attrs: { level: 6 },
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
  const commitFile = { commit: file.commit, file: file.file };
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

export type ArticleNodes = {
  articleId: string;
  nodes: INode[];
};

export function convertV1ToV2(collection: Collection): ArticleNodes[] {
  return collection.articles.map((article) => {
    const steps = collection.steps.filter(
      (step) => step.articleId === article.id,
    );
    const nodes = steps.flatMap((step) => [
      { type: 'step_start', attrs: { commit: step.commit } },
      ...step.children.flatMap((node, index) => {
        if (index === 0) {
          const title = node as StepTitle;
          return newStepTitle(title.commit, convertInlineNodes(title.children));
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
    ]) as INode[];

    return { articleId: article.id, nodes };
  });
}
