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
    <MonacoEditor
      class="w-full h-48"
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
import MonacoEditor from './MonacoEditor.vue';

export default {
  props: ['node', 'updateAttrs', 'view', 'editor'],
  components: {
    MonacoEditor,
  },
  data() {
    return {
      diffEditor: true,
      splitDiff: false,
      filename: 'hello.js',
      language: 'javascript',
      link: '',
      code: '',
      originalCode: '',
    };
  },
  mounted() {
    const { commit, file } = this.node.attrs;
    fetch(`/api/diff?commit=${commit}&file=${file}`)
      .then((res) => res.json())
      .then((data) => {
        this.code = data.code;
        this.originalCode = data.originalCode;
        7;
      });
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

<style scoped></style>
