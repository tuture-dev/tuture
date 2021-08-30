import { Node } from 'tiptap';
import { toggleWrap } from 'tiptap-commands';
import { findWrapping } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';

import SelectAllWithinBlockPlugin from '../plugins/SelectAllWithinBlock';
import { TextSelection } from 'prosemirror-state';

const STYLES = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

function getStyle(className) {
  for (const style of STYLES) {
    if (className.includes(style)) return style;
  }
  return 'default';
}

function getStyleFromRawMatch(rawMatch) {
  if (STYLES.includes(rawMatch.toLowerCase())) {
    return rawMatch.toLowerCase();
  }
  return 'default';
}

export default class Notice extends Node {
  get styleOptions() {
    return Object.entries({
      default: this.options.dictionary.default,
      primary: this.options.dictionary.primary,
      success: this.options.dictionary.success,
      info: this.options.dictionary.info,
      warning: this.options.dictionary.warning,
      danger: this.options.dictionary.danger,
    });
  }

  get name() {
    return 'notice';
  }

  get schema() {
    return {
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
          getAttrs: (dom) => ({
            style: getStyle(dom.className),
          }),
        },
      ],
      toDOM: (node) => {
        const select = document.createElement('select');
        select.addEventListener('change', this.handleStyleChange);

        this.styleOptions.forEach(([key, label]) => {
          const option = document.createElement('option');
          option.value = key;
          option.innerText = label;
          option.selected = node.attrs.style === key;
          select.appendChild(option);
        });

        return [
          'div',
          { class: `notice-block ${node.attrs.style}` },
          ['div', { contentEditable: false }, select],
          ['div', 0],
        ];
      },
    };
  }

  commands({ type }) {
    return (attrs) => toggleWrap(type, attrs);
  }

  handleStyleChange = (event) => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        style: element.value,
      });
      view.dispatch(transaction);
    }
  };

  get plugins() {
    return [
      SelectAllWithinBlockPlugin({ name: this.name }),
      keymap({
        Enter: (state, dispatch) => {
          const selection = state.selection;
          const match = selection.$head.parent.textContent.match(
            /^:::\s*(\w*)$/,
          );

          if (match) {
            const { $from, $to } = state.selection;
            const nodeType = state.schema.nodes[this.name];
            const attrs = { style: getStyleFromRawMatch(match[1]) };
            const range = $from.blockRange($to),
              wrapping = range && findWrapping(range, nodeType, attrs);
            if (!wrapping) return false;

            dispatch(
              state.tr
                .setSelection(
                  TextSelection.create(
                    state.doc,
                    selection.$head.start(),
                    selection.head,
                  ),
                )
                .wrap(range, wrapping)
                .deleteSelection()
                .scrollIntoView(),
            );
            return true;
          }
          return false;
        },
      }),
    ];
  }
}
