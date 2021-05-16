<template>
  <div :class="codeBlockViewClass">
    <div>
      <el-select v-model="lang" filterable>
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <pre><code ref="content"></code></pre>
  </div>
</template>

<script>
import { Select, Option } from "element-ui";

import { languages } from "../utils/languages";

export default {
  props: ["node", "updateAttrs", "view", "editor"],
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
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
      return ["code-block-view"];
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
