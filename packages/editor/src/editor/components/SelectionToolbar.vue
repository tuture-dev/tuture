<template>
  <floating-toolbar :view="view" :active="visible">
    <link-editor
      v-if="isLinkEditorActive"
      :view="view"
      :mark="range.mark"
      :from="range.from"
      :to="range.to"
      :onCreateLink="onCreateLink ? handleOnCreateLink : undefined"
      :onSelectLink="handleOnSelectLink"
      :onClickLink="onClickLink"
    ></link-editor>
    <Menu v-else :items="items" :view="view" :commands="commands"></Menu>
  </floating-toolbar>
</template>

<script>
import {
  getColumnIndex,
  getMarkRange,
  getRowIndex,
  isMarkActive,
  isNodeActive,
} from "../queries";
import getTableMenuItems from "../menus/table";
import getTableColMenuItems from "../menus/tableCol";
import getTableRowMenuItems from "../menus/tableRow";
import getFormattingMenuItems from "../menus/formatting";
import getImageMenuItems from "../menus/image";
import { dictionary } from "../utils";

// 组件
import FloatingToolbar from "./FloatingToolbar";
import LinkEditor from "@/components/LinkEditor.vue";
import createAndInsertLink from "../commands/createAndInsertLink";
import Menu from "./Menu";

import some from "lodash.some";

function isVisible(props) {
  const { view } = props;
  const { selection } = view.state;

  if (!selection) return false;
  if (selection.empty) return false;
  if (selection.node && selection.node.type.name === "image") {
    return true;
  }
  if (selection.node) return false;

  const slice = selection.content();
  const fragment = slice.content;
  const nodes = fragment.content;

  return some(nodes, (n) => n.content.size);
}

export default {
  props: [
    "view",
    "commands",
    "onClose",
    "onOpen",
    "onCreateLink",
    "onClickLink",
  ],
  data() {
    return {
      isActive: false,
    };
  },
  components: {
    FloatingToolbar,
    Menu,
    LinkEditor,
  },
  computed: {
    items() {
      const { state } = this.view;
      const { selection } = state;

      const isCodeSelection = isNodeActive(state.schema.nodes.code_block)(
        state
      );

      // toolbar
      if (isCodeSelection) {
        return null;
      }

      const colIndex = getColumnIndex(state.selection);
      const rowIndex = getRowIndex(state.selection);

      const isTableSelection = colIndex !== undefined && rowIndex !== undefined;
      const isImageSelection =
        selection.node && selection.node.type.name === "image";

      let items = [];
      // TODO: formatting/link/image 相关的选中弹窗
      if (isTableSelection) {
        items = getTableMenuItems(dictionary);
      } else if (colIndex !== undefined) {
        items = getTableColMenuItems(state, colIndex, dictionary);
      } else if (rowIndex !== undefined) {
        items = getTableRowMenuItems(state, rowIndex, dictionary);
      } else if (isImageSelection) {
        items = getImageMenuItems(state, dictionary);
      } else {
        items = getFormattingMenuItems(state, dictionary);
      }

      return items;
    },
    range() {
      const { state } = this.view;
      const { selection } = state;

      const range = getMarkRange(selection.$from, state.schema.marks.link);

      return range;
    },
    isLinkEditorActive() {
      const { state } = this.view;

      const link = isMarkActive(state.schema.marks.link)(state);

      return link && this.range;
    },
    // linkMenuVisible() {
    //   const link = isMarkActive(state.schema.marks.link)(state);
    //   const range = getMarkRange(selection.$from, state.schema.marks.link);

    //   return link && range;
    // },
    visible() {
      return isVisible({ view: this.view });
    },
  },
  methods: {
    handleOnCreateLink(title) {
      const { dictionary, onCreateLink, view, onShowToast } = this.$props;

      if (!onCreateLink) {
        return;
      }

      const { dispatch, state } = view;
      const { from, to } = state.selection;

      const href = `creating#${title}…`;
      const markType = state.schema.marks.link;

      // Insert a placeholder link
      dispatch(
        view.state.tr
          .removeMark(from, to, markType)
          .addMark(from, to, markType.create({ href }))
      );

      createAndInsertLink(view, title, href, {
        onCreateLink,
        onShowToast,
        dictionary,
      });
    },

    handleOnSelectLink({ href, from, to }) {
      const { view } = this.$props;
      const { state, dispatch } = view;

      const markType = state.schema.marks.link;

      dispatch(
        state.tr
          .removeMark(from, to, markType)
          .addMark(from, to, markType.create({ href }))
      );
    },
  },
  updated() {
    const visible = isVisible({
      view: this.view,
    });

    if (this.isActive && !visible) {
      this.isActive = false;

      this.onClose();
    }

    if (!this.isActive && visible) {
      this.isActive = true;

      this.onOpen;
    }
  },
};
</script>
