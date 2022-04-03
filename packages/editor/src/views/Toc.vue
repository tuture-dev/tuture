<template>
  <a-spin :spinning="tocLoading">
    <div class="bg-gray-200 h-screen">
      <div></div>
      <div><button>新增文章</button></div>
    </div>
  </a-spin>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapActions, mapState } from 'vuex';
import { Container, Draggable } from "vue-smooth-dnd";

import StepAllocation from '@/components/toc/StepAllocation.vue';

export default defineComponent({
  components: {
    // StepAllocation,
    Container,
    Draggable,
  },
  computed: {
    ...mapState('toc', [
      'tocVisible',
      'tocLoading',
      'tocSaving',
      'tocData'
    ]),
  },
  computed: {
    items() {
      if (Object.keys(tocData).length === 0) return [];

      let resItems = tocData.articles;
      tocData.articles.map(article => {
        article.items = tocData.articleCommitMap[article.id]

        article.items = article.items.map(step => {
          step.items = tocData.commitFileMap[step.commit];

          return {
            ...step,
            type: 'container',
          }
        })

        return {
          ...article,
          type: 'container'
        }
      })
    }
  },
  methods: {
    ...mapActions('toc', ['fetchToc']),
  },
  mounted() {
    const { id } = this.$route.params;
    this.fetchToc({
      collectionId: id,
    });
  },
});
</script>

<style></style>
