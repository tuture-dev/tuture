<template>
  <div class="p-10 bg-gray-100 h-screen">
    <a-anchor wrapperClass="bg-gray-100">
      <a-anchor-link href="#components-anchor-demo-basic" title="Basic demo" />
      <a-anchor-link
        href="#components-anchor-demo-static"
        title="Static demo"
      />
      <a-anchor-link href="#API" title="API">
        <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
        <a-anchor-link href="#Link-Props" title="Link Props" />
      </a-anchor-link>
    </a-anchor>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';

export default defineComponent({
  name: 'ArticleCatalogue',
});
</script>

<style scoped></style>
