import { Node, Plugin, NodeSelection } from 'tiptap';

import { InputRule } from 'prosemirror-inputrules';
import uploadPlaceholderPlugin from '../lib/uploadPlaceholder';
import ImageView from '../components/ImageView.vue';
import insertFiles from '../commands/insertFiles';
import getDataTransferFiles from '../lib/getDataTransferFiles';
import { DEFAULT_IMAGE_WIDTH } from '../utils/constants';

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX = /!\[(?<alt>.*?)]\((?<filename>.*?)(?=“|\))“?(?<layoutclass>[^”]+)?”?\)/;

const IMAGE_CLASSES = ['right-50', 'left-50'];
const getLayoutAndTitle = (tokenTitle) => {
  if (!tokenTitle) return {};
  if (IMAGE_CLASSES.includes(tokenTitle)) {
    return {
      layoutClass: tokenTitle,
    };
  } else {
    return {
      title: tokenTitle,
    };
  }
};

const uploadPlugin = (options) =>
  new Plugin({
    props: {
      handleDOMEvents: {
        paste(view, event) {
          if (
            (view.props.editable && !view.props.editable(view.state)) ||
            !options.uploadImage
          ) {
            return false;
          }

          if (!event.clipboardData) return false;

          // check if we actually pasted any files
          const files = Array.prototype.slice
            .call(event.clipboardData.items)
            .map((dt) => dt.getAsFile())
            .filter((file) => file);

          if (files.length === 0) return false;

          const { tr } = view.state;
          if (!tr.selection.empty) {
            tr.deleteSelection();
          }
          const pos = tr.selection.from;

          insertFiles(view, event, pos, files, options);
          return true;
        },
        drop(view, event) {
          if (
            (view.props.editable && !view.props.editable(view.state)) ||
            !options.uploadImage
          ) {
            return false;
          }

          // filter to only include image files
          const files = getDataTransferFiles(event).filter((file) =>
            /image/i.test(file.type),
          );
          if (files.length === 0) {
            return false;
          }

          // grab the position in the document for the cursor
          const result = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });

          if (result) {
            insertFiles(view, event, result.pos, files, options);
            return true;
          }

          return false;
        },
      },
    },
  });

export default class Image extends Node {
  get defaultOptions() {
    return {
      defaultWidth: DEFAULT_IMAGE_WIDTH,
    };
  }

  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: {
          default: null,
        },
        layoutClass: {
          default: null,
        },
        title: {
          default: null,
        },
        width: {
          default: null,
        },
        height: {
          default: null,
        },
      },
      content: 'text*',
      marks: '',
      group: 'inline',
      draggable: true,
      selectable: true,
      parseDOM: [
        {
          tag: 'div[class~=image]',
          getAttrs: (dom) => {
            const img = dom.getElementsByTagName('img')[0];

            const className = dom.className;
            const layoutClassMatched =
              className && className.match(/image-(.*)$/);
            const layoutClass = layoutClassMatched
              ? layoutClassMatched[1]
              : null;

            let { width, height } = img.style;
            width = width || img.getAttribute('width') || null;
            height = height || img.getAttribute('height') || null;

            return {
              src: img.getAttribute('src'),
              title: img.getAttribute('title'),
              alt: img.getAttribute('alt'),
              width: width == null ? null : parseInt(width, 10),
              height: height == null ? null : parseInt(height, 10),
              layoutClass,
            };
          },
        },
      ],
      toDOM: (node) => {
        const className = node.attrs.layoutClass
          ? `image image-${node.attrs.layoutClass}`
          : 'image';

        return [
          'div',
          {
            class: className,
          },
          ['img', { ...node.attrs, contentEditable: false }],
          ['p', { class: 'caption' }, 0],
        ];
      },
    };
  }

  commands({ type }) {
    return {
      deleteImage: () => (state, dispatch) => {
        dispatch(state.tr.deleteSelection());
        return true;
      },
      alignRight: () => (state, dispatch) => {
        const attrs = {
          ...state.selection.node.attrs,
          title: null,
          layoutClass: 'right-50',
        };
        const { selection } = state;
        dispatch(state.tr.setNodeMarkup(selection.$from.pos, undefined, attrs));
        return true;
      },
      alignLeft: () => (state, dispatch) => {
        const attrs = {
          ...state.selection.node.attrs,
          title: null,
          layoutClass: 'left-50',
        };
        const { selection } = state;
        dispatch(state.tr.setNodeMarkup(selection.$from.pos, undefined, attrs));
        return true;
      },
      alignCenter: () => (state, dispatch) => {
        const attrs = { ...state.selection.node.attrs, layoutClass: null };
        const { selection } = state;
        dispatch(state.tr.setNodeMarkup(selection.$from.pos, undefined, attrs));
        return true;
      },
      createImage: (attrs) => (state, dispatch) => {
        const { selection } = state;
        const position = selection.$cursor
          ? selection.$cursor.pos
          : selection.$to.pos;
        const node = type.create(attrs);
        const transaction = state.tr.insert(position, node);
        dispatch(transaction);

        return true;
      },
    };
  }

  handleSelect = ({ getPos }) => (event) => {
    event.preventDefault();

    const { view } = this.editor;
    const $pos = view.state.doc.resolve(getPos());
    const transaction = view.state.tr.setSelection(new NodeSelection($pos));
    view.dispatch(transaction);
  };

  inputRules({ type }) {
    return [
      new InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
        const [okay, alt, src, matchedTitle] = match;
        const { tr } = state;
        if (okay) {
          tr.replaceWith(
            start - 1,
            end,
            type.create({
              src,
              alt,
              ...getLayoutAndTitle(matchedTitle),
            }),
          );
        }

        return tr;
      }),
    ];
  }

  get view() {
    return ImageView;
  }

  get plugins() {
    return [uploadPlaceholderPlugin, uploadPlugin(this.options)];
  }
}
