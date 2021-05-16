import { Node } from "tiptap";
import {
  tableEditing,
  columnResizing,
  goToNextCell,
  addColumnBefore,
  addColumnAfter,
  deleteColumn,
  addRowBefore,
  deleteRow,
  deleteTable,
  mergeCells,
  splitCell,
  toggleHeaderColumn,
  toggleHeaderRow,
  toggleHeaderCell,
  setCellAttr,
  fixTables,
} from "prosemirror-tables";
import {
  addRowAt,
  createTable,
  getCellsInColumn,
  moveRow,
} from "prosemirror-utils";
import { TextSelection, Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export default class Table extends Node {
  get name() {
    return "table";
  }

  get defaultOptions() {
    return {
      resizable: false,
    };
  }

  get schema() {
    return {
      content: "tr+",
      tableRole: "table",
      isolating: true,
      group: "block",
      parseDOM: [{ tag: "table" }],
      toDOM() {
        return [
          "div",
          { class: "scrollable-wrapper" },
          [
            "div",
            { class: "scrollable" },
            ["table", { class: "rme-table" }, ["tbody", 0]],
          ],
        ];
      },
    };
  }

  commands({ schema }) {
    return {
      createTable: ({ rowsCount, colsCount, withHeaderRow }) => (
        state,
        dispatch
      ) => {
        const offset = state.tr.selection.anchor + 1;

        const nodes = createTable(schema, rowsCount, colsCount, withHeaderRow);
        const tr = state.tr.replaceSelectionWith(nodes).scrollIntoView();
        const resolvedPos = tr.doc.resolve(offset);

        tr.setSelection(TextSelection.near(resolvedPos));

        console.log("table");

        dispatch(tr);
      },
      setColumnAttr: ({ index, alignment }) => (state, dispatch) => {
        const cells = getCellsInColumn(index)(state.selection) || [];
        let transaction = state.tr;

        cells.forEach(({ pos }) => {
          transaction = transaction.setNodeMarkup(pos, null, {
            alignment,
          });
        });
        dispatch(transaction);
      },
      addColumnBefore: () => addColumnBefore,
      addColumnAfter: () => addColumnAfter,
      deleteColumn: () => deleteColumn,
      addRowBefore: () => addRowBefore,
      addRowAfter: ({ index }) => (state, dispatch) => {
        if (index === 0) {
          // A little hack to avoid cloning the heading row by cloning the row
          // beneath and then moving it to the right index.
          const tr = addRowAt(index + 2, true)(state.tr);
          dispatch(moveRow(index + 2, index + 1)(tr));
        } else {
          dispatch(addRowAt(index + 1, true)(state.tr));
        }
      },
      deleteRow: () => deleteRow,
      deleteTable: () => deleteTable,
      toggleCellMerge: () => (state, dispatch) => {
        if (mergeCells(state, dispatch)) {
          return;
        }
        splitCell(state, dispatch);
      },
      mergeCells: () => mergeCells,
      splitCell: () => splitCell,
      toggleHeaderColumn: () => toggleHeaderColumn,
      toggleHeaderRow: () => toggleHeaderRow,
      toggleHeaderCell: () => toggleHeaderCell,
      setCellAttr: ({ name, value }) => setCellAttr(name, value),
      fixTables: () => fixTables,
    };
  }

  keys() {
    return {
      Tab: goToNextCell(1),
      "Shift-Tab": goToNextCell(-1),
    };
  }

  get plugins() {
    return [
      ...(this.options.resizable ? [columnResizing()] : []),
      tableEditing(),
      new Plugin({
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations = [];
            let index = 0;

            doc.descendants((node, pos) => {
              if (node.type.name !== this.name) return;

              const elements = document.getElementsByClassName("tuture-table");
              const table = elements[index];

              if (!table) return;

              const element = table.parentElement;
              const shadowRight = !!(
                element && element.scrollWidth > element.clientWidth
              );

              if (shadowRight) {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const shadow = document.createElement("div");
                    shadow.className = "scrollable-shadow right";

                    return shadow;
                  })
                );
              }

              index++;
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  }
}
