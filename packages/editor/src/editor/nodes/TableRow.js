import { Node } from "tiptap";

export default class TableRow extends Node {
  get name() {
    return "tr";
  }

  get schema() {
    return {
      content: "(th | td)*",
      tableRole: "row",
      parseDOM: [{ tag: "tr" }],
      toDOM() {
        return ["tr", 0];
      },
    };
  }
}
