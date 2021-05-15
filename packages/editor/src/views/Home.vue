<template>
  <div class="bg-gray-100"></div>
</template>

<script setup>
import useNowArticleId from '@/use/useNowArticleId';

export default {
  name: 'Home',
  mounted() {
    this.$router.push({
      name: 'Article',
      params: { id: this.nowArticleId },
    });
  },
  setup() {
    const { nowArticleId } = useNowArticleId();
    return { nowArticleId };
  },
};
</script>
