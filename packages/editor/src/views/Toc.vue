<template>
  <div>
    <div class="groups">
      <div class="group" v-for="(article, index) in articles" :key="article.id">
        <Container
          group-name="1"
          class="bg-gray-300 p-6"
          :get-child-payload="getChildPayload(index)"
          @drop="onDrop(index, $event)"
        >
          <Draggable v-for="step in article.steps" :key="step.id">
            <div
              class="draggable-item"
              @click="handleOpenFileArrangeModal(step.id)"
            >
              {{ step.name }}
            </div>
          </Draggable>
        </Container>
      </div>
    </div>

    <div class="ml-12 mt-8"><button @click="addNewPage">添加新页</button></div>
    <a-modal v-model:visible="visible" :footer="null">
      <Container @drop="onFileDrop">
        <Draggable v-for="file in nowStepFiles" :key="file.id">
          <div class="draggable-item">
            {{ file.file }}
          </div>
        </Draggable>
      </Container>
    </a-modal>
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
    nowStepFiles() {
      if (this.nowStepId && this.steps[this.nowStepId]) {
        return this.steps[this.nowStepId].files || [];
      }

      return [];
    },
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
      visible: false,
      nowStepId: null,
      // 在实现上还是文集拆分成多篇文章，每篇文章有多个 steps
      // 至于每个 step 里面的文件顺序调整，这里考虑是打开一个 modal，然后跳转 file 的位置
      // 那么 API 的设计要调整，每次进入到文章编排时
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
      steps: {
        '10': {
          name: 'step 1',
          files: generateItems(20, (i) => ({
            id: '1' + i,
            file: 'file 1 ' + i,
            type: 'draggable',
          })),
        },
      },
    };
  },
  methods: {
    ...mapActions('toc', ['fetchToc']),
    // 这里设置一个缓冲，在 N 秒内收到的 Drop 请求合并成一次请求
    // 相当于是前端做一次变更，服务端做一次变更
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
    addNewPage() {
      const index = this.articles.length;
      this.articles.push({
        id: `article ${index + 1}`,
        name: `article ${index + 1}`,
        type: 'container',
        steps: [],
      });
    },
    handleOpenFileArrangeModal(stepId) {
      debugger;
      this.nowStepId = stepId;
      this.visible = true;
    },
    onFileDrop(dropResult) {
      const step = this.steps[this.nowStepId];

      step.files = applyDrag(step.files, dropResult);
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
