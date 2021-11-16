<template>
  <a-tooltip title="点击查看什么是过时步骤">
    <a-tag class="text-yellow-500 bg-gray-200 hover:cursor-pointer">
      <a
        href="https://docs.tuture.co/reference/tuture-yml-spec.html#outdated"
        target="_blank"
        rel="noopener noreferrer"
        class="text-yellow-500 no-underline"
        >过时</a
      >
    </a-tag>
  </a-tooltip>
</template>

<script>
import { defineComponent } from 'vue-demi';

export default defineComponent({
  name: 'OutdatedTag',
});
</script>
