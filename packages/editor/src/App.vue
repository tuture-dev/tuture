<template>
  <a-spin :spinning="isFetching">
    <div id="app">
      <router-view />
    </div>
  </a-spin>
</template>

<script setup>
import useFetchMeta from '@/use/useFetchMeta';
import useFetchArticles from '@/use/useFetchArticles';

export default {
  name: 'App',
  setup() {
    const { isFetching: metaFetching, error: metaError } = useFetchMeta();
    const {
      isFetching: articlesFetching,
      error: articlesError,
    } = useFetchArticles();

    return {
      isFetching: metaFetching && articlesFetching,
      error: metaError + articlesError,
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.ProseMirror {
  outline: none;
}
</style>
