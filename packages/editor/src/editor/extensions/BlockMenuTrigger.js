import { InputRule } from 'prosemirror-inputrules';
import { Plugin } from 'prosemirror-state';
import { isInTable } from 'prosemirror-tables';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Extension } from 'tiptap';
import { findParentNode } from 'prosemirror-utils';

const MAX_MATCH = 500;
const OPEN_REGEX = /^\/(\w+)?$/;
const CLOSE_REGEX = /(^(?!\/(\w+)?)(.*)$|^\/((\w+)\s.*|\s)$)/;

// based on the input rules code in Prosemirror, here:
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js
function run(view, from, to, regex, handler) {
  if (view.composing) {
    return false;
  }
  const state = view.state;
  const $from = state.doc.resolve(from);
  if ($from.parent.type.spec.code) {
    return false;
  }

  const textBefore = $from.parent.textBetween(
    Math.max(0, $from.parentOffset - MAX_MATCH),
    $from.parentOffset,
    null,
    '\ufffc',
  );

  const match = regex.exec(textBefore);
  const tr = handler(state, match, match ? from - match[0].length : from, to);
  if (!tr) return false;
  return true;
}

export default class BlockMenuTrigger extends Extension {
  get name() {
    return 'blockmenu';
  }

  get plugins() {
    const button = document.createElement('button');
    button.className = 'block-menu-trigger';
    const icon = document.createElement('span');
    icon.innerHTML = '+';
    button.appendChild(icon);

    return [
      new Plugin({
        props: {
          handleClick: () => {
            this.options.onClose();
            return false;
          },
          handleKeyDown: (view, event) => {
            // Prosemirror input rules are not triggered on backspace, however
            // we need them to be evaluted for the filter trigger to work
            // correctly. This additional handler adds inputrules-like handling.
            if (event.key === 'Backspace') {
              // timeout ensures that the delete has been handled by prosemirror
              // and any characters removed, before we evaluate the rule.
              setTimeout(() => {
                const { pos } = view.state.selection.$from;
                return run(view, pos, pos, OPEN_REGEX, (state, match) => {
                  if (match) {
                    this.options.onOpen(match[1]);
                  } else {
                    this.options.onClose();
                  }
                  return null;
                });
              });
            }

            // If the query is active and we're navigating the block menu then
            // just ignore the key events in the editor itself until we're done
            if (
              event.key === 'Enter' ||
              event.key === 'ArrowUp' ||
              event.key === 'ArrowDown' ||
              event.key === 'Tab'
            ) {
              const { pos } = view.state.selection.$from;

              return run(view, pos, pos, OPEN_REGEX, (state, match) => {
                // just tell Prosemirror we handled it and not to do anything
                return match ? true : null;
              });
            }

            return false;
          },
          decorations: (state) => {
            const parent = findParentNode(
              (node) => node.type.name === 'paragraph',
            )(state.selection);

            if (!parent) {
              return;
            }

            const decorations = [];
            const isEmpty = parent && parent.node.content.size === 0;
            const isSlash = parent && parent.node.textContent === '/';
            const isTopLevel = state.selection.$from.depth === 1;

            if (isTopLevel) {
              if (isEmpty) {
                decorations.push(
                  Decoration.widget(parent.pos, () => {
                    button.addEventListener('click', () => {
                      this.options.onOpen('');
                    });
                    return button;
                  }),
                );

                decorations.push(
                  Decoration.node(
                    parent.pos,
                    parent.pos + parent.node.nodeSize,
                    {
                      class: 'placeholder',
                      'data-empty-text': this.options.dictionary.newLineEmpty,
                    },
                  ),
                );
              }

              if (isSlash) {
                decorations.push(
                  Decoration.node(
                    parent.pos,
                    parent.pos + parent.node.nodeSize,
                    {
                      class: 'placeholder',
                      'data-empty-text': `  ${this.options.dictionary.newLineWithSlash}`,
                    },
                  ),
                );
              }

              return DecorationSet.create(state.doc, decorations);
            }

            return;
          },
        },
      }),
    ];
  }

  inputRules() {
    return [
      // main regex should match only:
      // /word
      new InputRule(OPEN_REGEX, (state, match) => {
        if (
          match &&
          state.selection.$from.parent.type.name === 'paragraph' &&
          !isInTable(state)
        ) {
          this.options.onOpen(match[1]);
        }
        return null;
      }),
      // invert regex should match some of these scenarios:
      // /<space>word
      // /<space>
      // /word<space>
      new InputRule(CLOSE_REGEX, (state, match) => {
        if (match) {
          this.options.onClose();
        }
        return null;
      }),
    ];
  }
}
