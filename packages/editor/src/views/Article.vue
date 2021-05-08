<template>
  <div class="p-10 text-center">
    <h1>这里是文章详情页</h1>
    <p>标题: {{ article.name }}</p>
    <p>ID: {{ article.id }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapState } from 'vuex';

export default defineComponent({
  computed: {
    ...mapState('collection', ['articles']),
    article() {
      return (
        this.articles.filter(
          (article) => article.id === this.$route.params.id,
        )[0] || {}
      );
    },
  },
});
</script>
