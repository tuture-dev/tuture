<template>
  <div class="link-editor">
    <input
      ref="linkInput"
      type="text"
      class="input"
      :value="value"
      :placeholder="placeholder"
      @keydown="handleKeyDown"
      @change="handleChange"
    />

    <toolbar-button @click.native="handleOpenLink" :disabled="!value">
      <custom-tooltip :tooltip="dictionary.openLink" placement="top">
        打开
      </custom-tooltip>
    </toolbar-button>

    <toolbar-button @click.native="handleRemoveLink">
      <custom-tooltip :tooltip="dictionary.removeLink" placement="top">
        {{ initialValue ? "删除" : "关闭" }}
      </custom-tooltip>
    </toolbar-button>

    <div class="show-results" id="link-search-results" v-if="showResults">
      link search result
    </div>
  </div>
</template>

<script>
import isUrl from "@/utils/isUrl";
import ToolbarButton from "@/components/ToolbarButton.vue";
import CustomTooltip from "./Tooltip.vue";
import dictionary from "@/utils/dictionary";
import { setTextSelection } from "prosemirror-utils";

export default {
  props: [
    "from",
    "to",
    "view",
    "mark",
    "onSelectLink",
    "onCreateLink",
    "onSearchLink",
    "onClickLink",
    "onRemoveLink",
  ],
  components: {
    CustomTooltip,
    ToolbarButton,
  },
  data() {
    return {
      selectedIndex: -1,
      previousValue: "",
      results: {},
      value: this.mark ? this.mark.attrs.href : "",
      initialValue: this.mark ? this.mark.attrs.href : "",
      initialSelectionLength: this.to - this.from,
      discardInputValue: false,
      dictionary,
    };
  },
  computed: {
    suggestedLinkTitle() {
      const { state } = this.view;
      const selectionText = state.doc.cut(
        state.selection.from,
        state.selection.to
      ).textContent;

      return this.value.trim() || selectionText.trim();
    },
    placeholder() {
      return this.showCreateLink
        ? dictionary.findOrCreateDoc
        : dictionary.searchOrPasteLink;
    },
    showCreateLink() {
      const value = this.value;
      const results =
        this.results[value.trim()] || this.results[this.previousValue] || [];

      const looksLikeUrl = value.match(/^https?:\/\//i);

      const suggestedLinkTitle = this.suggestedLinkTitle;

      const showCreateLink =
        !!this.$props.onCreateLink &&
        !(suggestedLinkTitle === this.initialValue) &&
        suggestedLinkTitle.length > 0 &&
        !looksLikeUrl;

      return showCreateLink;
    },
    showResults() {
      const value = this.value;
      const results =
        this.results[value.trim()] || this.results[this.previousValue] || [];

      const showResults =
        !!this.suggestedLinkTitle &&
        (this.showCreateLink || results.length > 0);

      return showResults;
    },
    href() {
      return this.$props?.mark ? this.$props?.mark.attrs.href : "";
    },
  },
  beforeDestroy() {
    // If we discarded the changes then nothing to do
    if (this.discardInputValue) {
      return;
    }

    // If the link is the same as it was when the editor opened, nothing to do
    if (this.value === this.initialValue) {
      return;
    }

    // If the link is totally empty or only spaces then remove the mark
    const href = (this.value || "").trim();
    if (!href) {
      return this.handleRemoveLink();
    }

    this.save(href, href);
  },
  methods: {
    save(href, title) {
      href = href.trim();

      if (href.length === 0) return;

      this.discardInputValue = true;
      const { from, to } = this.$props;

      // If the input doesn't start with a protocol or relative slash, make sure
      // a protocol is added to the beginning
      if (!isUrl(href) && !href.startsWith("/")) {
        href = `https://${href}`;
      }

      this.onSelectLink({ href, title, from, to });
    },
    handleKeyDown(event) {
      switch (event.key) {
        case "Enter": {
          event.preventDefault();
          const selectedIndex = this.selectedIndex;
          const value = this.value;
          const results = this.results[value] || [];

          if (selectedIndex >= 0) {
            const result = results[selectedIndex];
            if (result) {
              this.save(result.url, result.title);
            } else if (this.onCreateLink && selectedIndex === results.length) {
              this.handleCreateLink(this.suggestedLinkTitle);
            }
          } else {
            // saves the raw input as href
            this.save(value, value);
          }

          if (this.initialSelectionLength) {
            this.moveSelectionToEnd();
          }

          return;
        }

        case "Escape": {
          event.preventDefault();

          if (this.initialValue) {
            this.value = this.initialValue;
            this.moveSelectionToEnd();
          } else {
            this.handleRemoveLink();
          }

          return;
        }

        case "ArrowUp": {
          if (event.shiftKey) return;
          event.preventDefault();
          event.stopPropagation();
          const prevIndex = this.selectedIndex - 1;

          this.selectedIndex = Math.max(-1, prevIndex);
          return;
        }

        case "ArrowDown":
          if (event.shiftKey) return;
        case "Tab": {
          event.preventDefault();
          event.stopPropagation();
          const selectedIndex = this.selectedIndex;
          const value = this.value;

          const results = this.results[value] || [];
          const total = results.length;
          const nextIndex = selectedIndex + 1;

          this.selectedIndex = Math.min(nextIndex, total);
          return;
        }
      }
    },
    handleFocusLink(selectedIndex) {
      this.selectedIndex = selectedIndex;
    },
    async handleChange(event) {
      const value = event.target.value;

      this.value = value;
      this.selectedIndex = -1;

      const trimmedValue = value.trim();

      if (trimmedValue && this.onSearchLink) {
        try {
          const results = await this.onSearchLink(trimmedValue);
          this.results = {
            ...this.results,
            [trimmedValue]: results,
          };
          this.previousValue = trimmedValue;
        } catch (error) {
          console.error(error);
        }
      }
    },

    handleOpenLink(event) {
      event.preventDefault();
      this.onClickLink(this.href, event);
    },

    handleCreateLink(value) {
      this.discardInputValue = true;

      value = value.trim();
      if (value.length === 0) return;

      if (this.onCreateLink) return this.onCreateLink(value);
    },

    handleRemoveLink() {
      this.discardInputValue = true;

      const { state, dispatch } = this.view;

      console.log("remove", this.mark);
      if (this.mark) {
        dispatch(state.tr.removeMark(this.from, this.to, this.mark));
      }

      if (this.onRemoveLink) {
        this.onRemoveLink();
      }

      this.view.focus();
    },

    handleSelectLink(url, title) {
      return (event) => {
        event.preventDefault();
        this.save(url, title);

        if (this.initialSelectionLength) {
          this.moveSelectionToEnd();
        }
      };
    },

    moveSelectionToEnd() {
      const { state, dispatch } = this.view;
      dispatch(setTextSelection(this.to)(state.tr));
      this.view.focus();
    },
  },
  mounted() {
    if (this.$refs.linkInput) {
      this.$refs.linkInput.focus();
    }
  },
};
</script>

<style scoped>
.link-editor {
  margin-left: -8px;
  margin-right: -8px;
  min-width: 336px;
}

.input {
  font-size: 15px;
  background: rgba(255, 255, 255, 0.1);
  color: #181a1b;
  border-radius: 2px;
  padding: 3px 8px;
  border: 0;
  margin: 0;
  outline: none;
  flex-grow: 1;
}
</style>
