<template>
  <floating-toolbar ref="menuRef" :view="view" :active="active">
    <link-editor
      v-if="active"
      :from="view.state.selection.from"
      :to="view.state.selection.to"
      :on-create-link="onCreateLink"
      :on-select-link="onSelectLink"
      :on-remove-link="onClose"
    ></link-editor>
  </floating-toolbar>
</template>

<script>
import LinkEditor from "@/components/LinkEditor.vue";
import FloatingToolbar from "@/components/FloatingToolbar.vue";
import createAndInsertLink from "../commands/createAndInsertLink";

function isActive(props) {
  const { view } = props;
  const { selection } = view.state;

  try {
    const paragraph = view.domAtPos(selection.from);
    return props.isActive && !!paragraph.node;
  } catch (err) {
    return false;
  }
}

export default {
  props: {
    isActive: Boolean,
    view: Object,
    tooltip: Object,
    dictionary: Object,
    onCreateLink: Function,
    onClose: Function,
  },
  components: {
    LinkEditor,
    FloatingToolbar,
  },
  data() {
    return {
      left: -1000,
      top: undefined,
    };
  },
  computed: {
    active() {
      return isActive({
        view: this.view,
      });
    },
  },
  methods: {
    handleClickOutSide(event) {
      if (
        event.target &&
        this.$refs.menuRef &&
        this.$refs.menuRef.$el.contains(event.target)
      ) {
        return;
      }

      this.onClose();
    },
    async handleOnCreateLink(title) {
      this.onClose();

      this.view.focus();

      if (!this.onCreateLink) return;

      const { dispatch, state } = this.view;
      const { from, to } = state.selection;

      const href = `creating#${title}...`;

      // Insert a placeholder link
      dispatch(
        this.view.state.tr
          .insertText(title, from, to)
          .addMark(
            from,
            to + title.length,
            state.schema.marks.link.create({ href })
          )
      );

      createAndInsertLink(this.view, title, href, {
        onCreateLink: this.onCreateLink,
        onShowToast: this.onShowToast,
        dictionary: this.dictionary,
      });
    },
    handleOnSelectLink({ href, title }) {
      this.onClose();
      this.view.focus();

      const { dispatch, state } = this.view;
      const { from, to } = state.selection;

      dispatch(
        this.view.state.tr
          .insertText(title, from, to)
          .addMark(
            from,
            to + title.length,
            state.schema.marks.link.create({ href })
          )
      );
    },
  },
  mounted() {
    window.addEventListener("mousedown", this.handleClickOutSide);
  },
  beforeDestroy() {
    window.removeEventListener("mousedown", this.handleClickOutSide);
  },
};
</script>

<style></style>
