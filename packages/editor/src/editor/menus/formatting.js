import { isInTable } from "prosemirror-tables";
import { isInList, isNodeActive, isMarkActive } from "../queries";

export default function formattingMenuItems(state, dictionary) {
  const { schema } = state;
  const isTable = isInTable(state);
  const isList = isInList(state);

  return [
    {
      name: "bold",
      tooltip: dictionary.bold,
      icon: "bold",
      active: isMarkActive(schema.marks.bold),
    },
    {
      name: "italic",
      tooltip: dictionary.italic,
      icon: "italic",
      active: isMarkActive(schema.marks.italic),
    },
    {
      name: "strike",
      tooltip: dictionary.strike,
      icon: "strikethrough",
      active: isMarkActive(schema.marks.strike),
    },
    {
      name: "underline",
      tooltip: dictionary.underline,
      icon: "underline",
      active: isMarkActive(schema.marks.underline),
    },
    {
      name: "code",
      tooltip: dictionary.code,
      icon: "code",
      active: isMarkActive(schema.marks.code),
    },
    {
      name: "separator",
    },
    {
      name: "link",
      tooltip: dictionary.createLink,
      icon: "link",
      active: isMarkActive(schema.marks.link),
      attrs: {},
    },
  ];
}
