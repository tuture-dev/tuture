<template>
  <div>
    <div class="diff-header">
      <b class="diff-filename">{{ filename }}</b>
      <el-switch
        class="diff-mode-switch"
        v-model="splitDiff"
        active-text="Split"
        inactive-text="Inline"
      >
      </el-switch>
    </div>
    <MonacoEditor
      class="monaco-editor"
      ref="editor"
      :diffEditor="diffEditor"
      :options="monacoDiffOptions"
      :language="language"
      :value="code"
      :original="originalCode"
    />
  </div>
</template>

<script>
import MonacoEditor from "./MonacoEditor.vue";
import { Switch } from "element-ui";

export default {
  components: {
    MonacoEditor,
    [Switch.name]: Switch,
  },
  data() {
    return {
      diffEditor: true,
      splitDiff: false,
      filename: "hello.js",
      language: "javascript",
      link: "",
      code: "console.log('hello world');",
      originalCode: "console.log('hello');",
    };
  },
  computed: {
    monacoDiffOptions: function() {
      return {
        renderSideBySide: false,
      };
    },
  },
  watch: {
    splitDiff: function(newVal) {
      this.$refs.editor.getEditor().updateOptions({ renderSideBySide: newVal });
    },
  },
};
</script>

<style>
.monaco-editor {
  width: 100%;
  height: 200px;
}

.diff-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
</style>
