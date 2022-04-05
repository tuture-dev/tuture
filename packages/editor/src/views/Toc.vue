<template>
  <div class="groups">
    <div class="group" v-for="(article, index) in articles" :key="article.id">
      <Container
        group-name="1"
        :get-child-payload="getChildPayload(index)"
        @drop="onDrop(index, $event)"
      >
        <Draggable v-for="step in article.steps" :key="step.id">
          <div class="draggable-item">
            {{ step.name }}
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapActions, mapState } from 'vuex';
import { Container, Draggable, smoothDnD } from 'vue-smooth-dnd';
import { applyDrag, generateItems } from '../utils/helpers';

import StepAllocation from '@/components/toc/StepAllocation.vue';

export default defineComponent({
  name: 'Groups',
  components: {
    StepAllocation,
    Container,
    Draggable,
  },
  computed: {
    ...mapState('toc', ['tocVisible', 'tocLoading', 'tocSaving', 'tocData']),
  },
  // computed: {
  // items() {
  //   if (Object.keys(tocData).length === 0) return [];

  //   let resItems = tocData.articles;
  //   tocData.articles.map(article => {
  //     article.items = tocData.articleCommitMap[article.id]

  //     article.items = article.items.map(step => {
  //       step.items = tocData.commitFileMap[step.commit];

  //       return {
  //         ...step,
  //         type: 'container',
  //       }
  //     })

  //     return {
  //       ...article,
  //       type: 'container'
  //     }
  //   })
  // }
  // },
  mounted() {
    const { id } = this.$route.params;
    // this.fetchToc({
    //   collectionId: id,
    // });
  },
  data() {
    return {
      articles: [
        {
          id: 'article 1',
          name: 'article 1',
          type: 'container',
          steps: generateItems(10, (i) => ({
            id: '1' + i,
            name: 'Draggable 1 ' + i,
            type: 'draggable',
          })),
        },
        {
          id: 'article 2',
          name: 'article 2',
          type: 'container',
          steps: generateItems(10, (i) => ({
            id: '2' + i,
            name: `Draggable 2 - ${i}`,
            type: 'draggable',
          })),
        },
        {
          id: 'article 3',
          name: 'article 3',
          type: 'container',
          steps: generateItems(10, (i) => ({
            id: '3' + i,
            name: `Draggable 3 - ${i}`,
            type: 'draggable',
          })),
        },
      ],
    };
  },
  methods: {
    ...mapActions('toc', ['fetchToc']),
    onDrop(index, dropResult) {
      console.log('dropResult', dropResult, index);

      this.articles[index].steps = applyDrag(
        this.articles[index].steps,
        dropResult,
      );
    },
    getChildPayload(index) {
      console.log('index', index);
      return (stepIndex) => {
        console.log('this.articles[index]', this.articles, stepIndex);
        return this.articles[index].steps[stepIndex];
      };
    },
  },
});
</script>

<style lang="css" scoped>
.groups {
  display: flex;
  justify-content: stretch;
  margin-top: 50px;
  margin-right: 50px;
}
.group {
  margin-left: 50px;
  flex: 1;
}
</style>
