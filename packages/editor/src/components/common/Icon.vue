<template>
  <icon-font :type="type"></icon-font>
</template>

<script>
import { Icon } from 'ant-design-vue';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1629955_eg8s3xjzixd.js',
});

export default {
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  components: {
    IconFont,
  },
};
</script>

<style></style>
