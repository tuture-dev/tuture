<template>
  <span :title="tooltip">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: "",
    },
  },
};
</script>
