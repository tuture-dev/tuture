<template>
  <div :class="codeBlockViewClass">
    <div>
      <a-select
        class="w-32"
        :showSearch="true"
        v-model="lang"
        :options="options"
      >
        <a-select-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </a-select-option>
      </a-select>
    </div>
    <pre spellcheck="false"><code ref="content"></code></pre>
  </div>
</template>

<script>
import { languages } from '../utils/languages';

export default {
  props: ['node', 'updateAttrs', 'view', 'editor'],
  data() {
    console.log('this.node.attrs', this.node.attrs.language);
    return {
      lang: this.node.attrs.language,
    };
  },
  computed: {
    options() {
      return Object.keys(languages).map((lang) => ({
        value: lang,
        label: languages[lang].name,
      }));
    },
    codeBlockViewClass() {
      return ['code-block-view'];
    },
  },
  watch: {
    lang(val) {
      this.updateAttrs({ language: val });
    },
  },
};
</script>

<style lang="scss"></style>
