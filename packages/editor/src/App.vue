<template>
  <a-spin :spinning="metaLoading || articlesLoading">
    <div id="app">
      <router-view />
    </div>
  </a-spin>
</template>

<script setup>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState('collection', ['metaLoading', 'articlesLoading']),
  },
  methods: {
    ...mapActions('collection', ['fetchMeta', 'fetchArticles']),
  },
  mounted() {
    this.fetchMeta();
    this.fetchArticles();
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
