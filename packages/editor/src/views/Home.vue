<template>
  <div class="bg-gray-100"></div>
</template>

<script setup>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapState('editor', ['nowArticleId']),
  },
  watch: {
    nowArticleId: function(articleId) {
      if (articleId) {
        this.$router.push({
          name: 'Article',
          params: { id: articleId },
        });
      }
    },
  },
};
</script>
