import { NodeType, Schema } from 'prosemirror-model';

const STYLES = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

function getStyle(className: string[]) {
  for (const style of STYLES) {
    if (className.includes(style)) return style;
  }
  return 'default';
}

export const tutureSchema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0];
      },
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM(node: any) {
        return ['blockquote', 0];
      },
    },
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM() {
        return ['hr'];
      },
    },
    heading: {
      group: 'block',
      content: 'text*',
      attrs: {
        // 每个 heading 都需要确保有 id，使得可以通过 anchor 进行组织和定位
        id: { default: '' },
        level: { default: 1 },
        // 严格模式不可删除此框
        fixed: { default: false },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
        // 有这个字段代表此为一个 step 的 stepTitle 也是 step 的开始
        step: { default: { commit: '' } },
      },
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } },
      ],
      toDOM(node: any) {
        return ['h' + node.attrs.level, 0];
      },
    },

    explain: {
      content: 'block+',
      group: 'block',
      defining: true,
      attrs: {
        // 严格模式不可删除此框
        fixed: { default: false },
        // 解释所处级别，'step' | 'file'
        level: { default: '' },
        // pos = 'pre' | 'post'，标志是前置解释还是后置解释
        pos: { default: '' },
        // 所处提交 hash
        commit: { default: '' },
        // 所处 file 名称
        file: { default: '' },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
      },
      toDOM() {
        return ['div', 0];
      },
    },

    // :: NodeSpec The text node.
    text: {
      group: 'inline',
    },

    image: {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: function getAttrs(dom) {
            return {
              // @ts-ignore
              src: dom.getAttribute('src'),
              // @ts-ignore
              title: dom.getAttribute('title'),
              // @ts-ignore
              alt: dom.getAttribute('alt'),
            };
          },
        },
      ],
      toDOM: function toDOM(node) {
        var ref = node.attrs;
        var src = ref.src;
        var alt = ref.alt;
        var title = ref.title;
        return ['img', { src: src, alt: alt, title: title }];
      },
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM: function toDOM() {
        return ['br'];
      },
    },

    code_block: {
      attrs: {
        language: {
          default: 'Auto',
        },
      },
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: 'pre', preserveWhitespace: 'full' },
        {
          tag: '.code-block',
          preserveWhitespace: 'full',
          contentElement: 'code',
          getAttrs: (node: any) => {
            return {
              language: node.dataset.language,
            };
          },
        },
      ],
      // @ts-ignore
      toDOM(node: any) {
        return [
          'div',
          { class: 'code-block', 'data-language': node.attrs.language },
          ['div', { contentEditable: false }, 'select', 'button'],
          ['pre', ['code', { spellCheck: false }, 0]],
        ];
      },
    },

    diff_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      draggable: false,
      editable: false,
      attrs: {
        // 对应着 fileId，标志某个 file 级别的解释
        id: { default: '' },
        // 原 diff_block 相关的信息
        file: { default: '' },
        commit: { default: '' },
        code: { default: '' },
        originalCode: { default: '' },
        hiddenLines: { default: [] },
      },
    },

    notice: {
      attrs: {
        style: {
          default: 'default,',
        },
      },
      content: 'block+',
      group: 'block',
      defining: true,
      draggable: true,
      parseDOM: [
        {
          tag: 'div.notice-block',
          preserveWhitespace: 'full',
          contentElement: 'div:last-child',
          getAttrs: (dom: any) => ({
            style: getStyle(dom.className),
          }),
        },
      ],
      toDOM: (node: any) => {
        return ['div', { class: `notice-block ${node.attrs.style}` }, 0];
      },
    },

    step_start: {
      content: '',
      group: 'block',
      defining: true,
      selectable: false,
      draggable: false,
      editable: false,
      attrs: {
        commit: { default: '' },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
      },
    },

    step_end: {
      content: '',
      group: 'block',
      defining: true,
      selectable: false,
      draggable: false,
      editable: false,
      attrs: {
        commit: { default: '' },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
      },
    },

    file_start: {
      content: '',
      group: 'block',
      defining: true,
      selectable: false,
      draggable: false,
      editable: false,
      attrs: {
        commit: { default: '' },
        file: { default: '' },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
      },
    },

    file_end: {
      content: '',
      group: 'block',
      defining: true,
      selectable: false,
      draggable: false,
      editable: false,
      attrs: {
        commit: { default: '' },
        file: { default: '' },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
      },
    },
  },

  marks: {
    bold: {
      parseDOM: [
        {
          tag: 'strong',
        },
        {
          tag: 'b',
          getAttrs: (node: any) => node.style.fontWeight !== 'normal' && null,
        },
        {
          style: 'font-weight',
          getAttrs: (value: any) =>
            /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        },
      ],
      toDOM: () => ['strong', 0],
    },

    italic: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM: () => ['em', 0],
    },

    code: {
      excludes: '_',
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0],
    },

    link: {
      attrs: {
        href: {
          default: null,
        },
        target: {
          default: null,
        },
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom: any) => ({
            href: dom.getAttribute('href'),
            target: dom.getAttribute('target'),
          }),
        },
      ],
      toDOM: (node) => [
        'a',
        {
          ...node.attrs,
          rel: 'noopener noreferrer nofollow',
          target: node.attrs.target,
        },
        0,
      ],
    },

    strike: {
      parseDOM: [
        {
          tag: 's',
        },
        {
          tag: 'del',
        },
        {
          tag: 'strike',
        },
        {
          style: 'text-decoration',
          getAttrs: (value: any) => (value === 'line-through' ? null : false),
        },
      ],
      toDOM: () => ['s', 0],
    },

    underline: {
      parseDOM: [
        {
          tag: 'u',
        },
        {
          style: 'text-decoration',
          getAttrs: (value: any) => (value === 'underline' ? null : false),
        },
      ],
      toDOM: () => ['u', 0],
    },
  },
});
