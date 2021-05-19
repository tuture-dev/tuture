<template>
  <div
    class="toolbar-button"
    :style="{
      opacity: active ? 1 : 0.7,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["active"],
};
</script>

<style lang="scss">
.toolbar-button {
  display: inline-block;
  flex: 0;
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-left: 10px;
  border: none;
  background: none;
  transition: opacity 100ms ease-in-out;
  padding: 0;
  opacity: 0.7;
  outline: none;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    opacity: 1 !important;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}
</style>
