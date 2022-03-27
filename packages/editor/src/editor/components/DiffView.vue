<template>
  <div>
    <div class="flex justify-between mb-2">
      <b class="diff-filename">{{ filename }}</b>
      <a-switch
        class="diff-mode-switch"
        v-model="splitDiff"
        checked-children="Split"
        un-checked-children="Inline"
      >
      </a-switch>
    </div>
    <code-diff
      class="whitespace-normal"
      :old-string="originalCode"
      :new-string="code"
      :file-name="filename"
      :output-format="outputFormat"
    />
    <a-modal :visible="false">
      <MonacoEditor
        class="w-full h-48"
        ref="editor"
        :diffEditor="diffEditor"
        :options="monacoDiffOptions"
        :language="language"
        :value="code"
        :original="originalCode"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
// import { CodeDiff } from 'v-code-diff';
import MonacoEditor from './MonacoEditor.vue';

export default defineComponent({
  props: ['node', 'updateAttrs', 'view', 'editor'],
  components: {
    // CodeDiff,
    MonacoEditor,
  },
  data() {
    return {
      diffEditor: true,
      splitDiff: false,
      language: '',
      link: '',
    };
  },
  computed: {
    code: function() {
      return this.node.attrs.code;
    },
    originalCode: function() {
      return this.node.attrs.originalCode;
    },
    filename: function() {
      return this.node.attrs.file;
    },
    outputFormat: function() {
      return this.splitDiff ? 'side-by-side' : 'line-by-line';
    },
    monacoDiffOptions: function() {
      return {
        renderSideBySide: false,
      };
    },
  },
  watch: {
    splitDiff: function(newVal) {
      // this.$refs.editor.getEditor().updateOptions({ renderSideBySide: newVal });
    },
  },
});
</script>

<style scoped></style>
