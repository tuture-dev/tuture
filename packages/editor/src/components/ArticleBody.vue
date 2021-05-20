<template>
  <div class="p-8">
    <h1 class="text-xl">{{ article.name }}</h1>
    <a-divider />
    <div class="editure">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
import { mapGetters, mapState } from 'vuex';
import { EditorContent } from 'tiptap';
import { Editor } from 'tiptap';
import {
  Bold,
  Italic,
  Underline,
  Strike,
  HardBreak,
  Code,
  Heading,
  History,
  Blockquote,
  ListItem,
  OrderedList,
  BulletList,
  TodoList,
  HorizontalRule,
  Placeholder,
  TrailingNode,
} from 'tiptap-extensions';
import {
  selectColumn,
  selectRow,
  selectTable,
  findParentNode,
} from 'prosemirror-utils';

import {
  TodoItem,
  Image,
  Notice,
  CodeBlock,
  // DiffBlock,
  Table,
  TableHeaderCell,
  TableRow,
  TableCell,
} from '@/editor/nodes';
import { Link } from '@/editor/marks';
import { dictionary } from '@/editor/utils';
import getDataTransferFiles from '@/editor/lib/getDataTransferFiles';
import insertFiles from '@/editor/commands/insertFiles';
import useNowArticleId from '@/use/useNowArticleId';

export default defineComponent({
  name: 'ArticleBody',
  data() {
    return {
      editor: new Editor({
        autoFocus: true,
        extensions: [
          new History(),
          new Heading({
            levels: [1, 2, 3, 4],
          }),
          new Image({
            dictionary,
            uploadImage: this.uploadImage,
            onImageUploadStart: this.onImageUploadStart,
            onImageUploadStop: this.onImageUploadStop,
            onShowToast: this.onShowToast,
          }),
          new Blockquote(),
          new CodeBlock(),
          // new DiffBlock(),
          new Notice({
            dictionary: this.dictionary,
          }),
          new ListItem(),
          new OrderedList(),
          new BulletList(),
          new TodoItem({
            nested: true,
          }),
          new TodoList(),
          new HorizontalRule(),
          new TrailingNode(),
          new Bold(),
          new Italic(),
          new Underline(),
          new Strike(),
          new Link({
            onKeyboardShortcut: this.onKeyboardShortcut,
            onClick: this.handleClickLink,
            onClickHashtag: this.onClickHashtag,
            onHoverLink: this.onHoverLink,
          }),
          new HardBreak(),
          new Table({
            resizable: true,
          }),
          new TableCell({
            onSelectTable: this.handleSelectTable,
            onSelectRow: this.handleSelectRow,
          }),
          new TableHeaderCell({
            onSelectColumn: this.handleSelectColumn,
          }),
          new TableRow(),
          new Code(),
          new Placeholder({
            showOnlyCurrent: false,
            emptyNodeText: (node) => {
              if (node.type.name === 'title') {
                return '请输入标题';
              }
            },
          }),
        ],
        onUpdate: ({ getJSON }) => {
          localStorage.setItem('editure-doc', JSON.stringify(getJSON()));
        },
      }),
      linkUrl: null,
      linkMenuIsActive: false,
      selectionMenuOpen: false,
      dictionary: dictionary,
    };
  },
  components: {
    EditorContent,
  },
  methods: {
    handleToggleLink() {
      if (this.editor.isActive.link()) {
        this.editor.commands.link({});
      } else if (!this.editor.isActive.image()) {
        this.handleOpenLinkMenu();
      }
    },
    handleOpenLink() {
      const { href = '', target = '' } = this.editor.getMarkAttrs('link');
      window.open(href, target);
    },
    handleClickLink() {
      this.handleOpenLinkMenu();
    },
    onKeyboardShortcut() {
      this.editor.commands.link({
        href: '',
      });
      this.handleOpenLinkMenu();
    },
    handleOpenLinkMenu() {
      this.showLinkMenu(this.editor.getMarkAttrs('link'));
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },
    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },
    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
    },
    clickImageButton(e) {
      e.preventDefault();

      this.$refs.image.click();
    },
    uploadImage(file) {
      if (!file) return;

      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (readerEvent) => {
          const src = readerEvent.target.result;

          resolve(src);
        };

        reader.readAsDataURL(file);
      });
    },
    handleImagePicked(event) {
      const files = getDataTransferFiles(event);

      const { view } = this.editor;
      const { state, dispatch } = view;
      const parent = findParentNode((node) => !!node)(state.selection);

      if (parent) {
        dispatch(
          state.tr.insertText(
            '',
            parent.pos,
            parent.pos + parent.node.textContent.length + 1,
          ),
        );

        insertFiles(view, event, parent.pos, files, {
          uploadImage: this.uploadImage,
          onImageUploadStart: this.onImageUploadStart,
          onImageUploadStop: this.onImageUploadStop,
          onShowToast: this.onShowToast,
          dictionary: dictionary,
        });
      }

      if (this.$refs.image.$el) {
        this.$refs.image.$el.value = '';
      }

      // 后续引入类似 gitbook 那样子的菜单栏才使用这里
      // this.handleCloseBlockMenu();
    },
    onImageUploadStart() {},
    onImageUploadStop() {},
    handleSelectRow(index, state) {
      this.editor.view.dispatch(selectRow(index)(state.tr));
    },
    handleSelectColumn(index, state) {
      this.editor.view.dispatch(selectColumn(index)(state.tr));
    },
    handleSelectTable(state) {
      this.editor.view.dispatch(selectTable(state.tr));
    },
    handleOpenSelectionMenu() {
      this.selectionMenuOpen = true;
    },
    handleCloseSelectionMenu() {
      this.selectionMenuOpen = false;
    },
    onClickHashtag() {},
    onHoverLink() {},
    handleCloseLinkMenu() {
      this.linkMenuOpen = false;
    },
    onClickLink(href) {
      window.open(href, '_blank');
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  computed: {
    ...mapState('collection', ['articles']),
    ...mapGetters('collection', ['getArticleById']),
    article() {
      return this.getArticleById(this.nowArticleId) || {};
    },
  },
  mounted() {
    const doc = localStorage.getItem('editure-doc');
    if (doc) {
      this.editor.setContent(JSON.parse(doc));
    }
  },
  setup() {
    const { nowArticleId } = useNowArticleId();
    return { nowArticleId };
  },
});
</script>

<style lang="scss" scoped>
.editure p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

.editure *.is-empty:nth-child(1)::before,
.editure *.is-empty:nth-child(2)::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

ul[data-type='todo_list'] {
  padding-left: 0;
}
li[data-type='todo_item'] {
  display: flex;
  flex-direction: row;
}

.todo-checkbox {
  border: 2px solid #000;
  height: 0.9em;
  width: 0.9em;
  box-sizing: border-box;
  margin-right: 10px;
  margin-top: 0.3rem;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  border-radius: 0.2em;
  background-color: transparent;
  transition: 0.4s background;
}

.todo-content {
  flex: 1;
  > p:last-of-type {
    margin-bottom: 0;
    margin: 0;
  }
  > ul[data-type='todo_list'] {
    margin: 0.5rem 0;
  }
}

li[data-done='true'] {
  > .todo-content {
    > p {
      text-decoration: line-through;
    }
  }
  > .todo-checkbox {
    background-color: #000;
  }
}
li[data-done='false'] {
  text-decoration: none;
}
</style>
