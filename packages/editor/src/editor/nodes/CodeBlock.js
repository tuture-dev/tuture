import { Node } from "tiptap";
import low from "lowlight/lib/core";
import { keymap } from "prosemirror-keymap";
import { toggleBlockType, setBlockType } from "tiptap-commands";

import CodeBlockView from "../components/CodeBlockView.vue";
import HighlightPlugin from "../plugins/Highlight";
import SelectAllWithinBlockPlugin from "../plugins/SelectAllWithinBlock";
import { languages } from "../utils/languages";

function getLanguageFromRawMatch(rawMatch) {
  const raw = rawMatch.toLowerCase();
  for (const [lang, langObj] of Object.entries(languages)) {
    if (lang === raw || langObj.aliases?.includes(raw)) {
      return lang;
    }
  }
  return "auto";
}

export default class CodeBlockHighlight extends Node {
  constructor() {
    super();
    try {
      Object.entries(this.defaultOptions.languages).forEach(
        ([name, mapping]) => {
          low.registerLanguage(name, mapping);
        }
      );
    } catch (err) {
      throw new Error(
        "Invalid syntax highlight definitions: define at least one highlight.js language mapping"
      );
    }
  }

  get name() {
    return "code_block";
  }

  get view() {
    return CodeBlockView;
  }

  get defaultOptions() {
    return {
      languages: Object.keys(languages).reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: languages[cur].mapping,
        }),
        {}
      ),
    };
  }

  get schema() {
    return {
      attrs: {
        language: {
          default: "auto",
        },
      },
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      defining: true,
      draggable: false,
      parseDOM: [
        { tag: "pre", preserveWhitespace: "full" },
        {
          tag: ".code-block",
          preserveWhitespace: "full",
          contentElement: "code",
          getAttrs: (node) => {
            return {
              language: node.dataset.language,
            };
          },
        },
      ],
      toDOM: (node) => [
        "div",
        { class: "code-block", "data-language": node.attrs.language },
        ["div", { contentEditable: false }, "select", "button"],
        ["pre", ["code", { spellCheck: false }, 0]],
      ],
    };
  }

  commands({ type, schema }) {
    return () => toggleBlockType(type, schema.nodes.paragraph);
  }

  keys({ type }) {
    return {
      "Shift-Ctrl-\\": setBlockType(type),
    };
  }

  get plugins() {
    return [
      HighlightPlugin({ name: this.name }),
      SelectAllWithinBlockPlugin({ name: this.name }),
      keymap({
        Enter: (state, dispatch) => {
          const selection = state.selection;
          const match = selection.$head.parent.textContent.match(
            /^```\s*(\w*)$/
          );
          if (match) {
            dispatch(
              state.tr
                .setBlockType(
                  selection.from,
                  selection.to,
                  state.schema.nodes[this.name],
                  { language: getLanguageFromRawMatch(match[1]) }
                )
                .delete(selection.$head.start(), selection.head)
            );
            return true;
          }
          return false;
        },
      }),
    ];
  }
}
