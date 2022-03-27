import { Element, Node } from 'editure';
import {
  Collection as CollectionV2,
  IText,
  INode,
  IMark,
  Article,
} from './interfaces';
import { Collection, File, Explain, StepTitle, getStepTitle } from './legacy';

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
  const commitFile = { commit: diff.commit, file: file.file };
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

// export function convertV1ToV2(
//   collection: Collection,
// ): [CollectionV2, StepDocs] {
//   const stepDocs: StepDocs = {};
//   const collectionV2 = collection as any;
//   collectionV2.unassignedSteps = [];
//   // collectionV2.articles.forEach((article: Article) => {
//   //   article.steps = [];
//   // });

//   for (let i = 0; i < collection.steps.length; i++) {
//     const stepV1 = collection.steps[i];
//     const stepMeta = {
//       id: stepV1.id,
//       commit: stepV1.commit,
//     };
//     if (stepV1.articleId) {
//       for (let article of collectionV2.articles) {
//         if (article.id === stepV1.articleId) {
//           article.steps.push(stepMeta);
//         }
//       }
//     } else {
//       collectionV2.unassignedSteps.push(stepMeta);
//     }

//     const stepAttrs = {
//       id: stepV1.id,
//       name: getStepTitle(stepV1),
//       articleId: stepV1.articleId || '',
//       commit: stepV1.commit,
//       order: i,
//     };
//     stepDocs[stepV1.id] = {
//       type: 'doc',
//       attrs: stepAttrs,
//       content: [
//         { type: 'step_start', attrs: { commit: stepV1.commit } },
//         ...stepV1.children.flatMap((node, index) => {
//           if (index === 0) {
//             const title = node as StepTitle;
//             return newStepTitle(convertInlineNodes(title.children), stepAttrs);
//           } else if (index === 1 || index === stepV1.children.length - 1) {
//             return {
//               type: 'explain',
//               attrs: {
//                 fixed: true,
//                 level: 'step',
//                 pos: index === 1 ? 'pre' : 'post',
//                 commit: stepV1.commit,
//               },
//               content: (node as Explain).children.map((block) =>
//                 convertBlock(block as Element),
//               ),
//             };
//           } else {
//             return convertFile(node as File);
//           }
//         }),
//         { type: 'step_end', attrs: { commit: stepV1.commit } },
//       ],
//     };
//   }

//   delete collectionV2.steps;

//   return [collectionV2 as CollectionV2, stepDocs];
// }
