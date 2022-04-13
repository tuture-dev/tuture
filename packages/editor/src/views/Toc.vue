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
          <Draggable v-for="step in article.steps" :key="step.commit">
            <div
              class="draggable-item"
              @click="handleOpenFileArrangeModal(article.id, step.commit)"
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
import { mapActions, mapState, mapMutations } from 'vuex';
import { Container, Draggable, smoothDnD } from 'vue-smooth-dnd';
import { debounce } from 'lodash';

import { applyDrag, generateItems } from '../utils/helpers';

const REARRANGE_STATUS = {
  STEP_REARRANGE: '步骤编排',
  FILE_REARRANGE: '文件编排',
};

export default defineComponent({
  name: 'Groups',
  components: {
    Container,
    Draggable,
  },
  computed: {
    // TODO: 后续在处理这些状态的更新
    ...mapState('toc', [
      'tocVisible',
      'tocLoading',
      'tocSucceed',
      'tocError',
      'tocData',
      'tocArticleSteps',
      'tocStepFiles',
    ]),
    nowStepFiles() {
      if (this.nowStepId && this.steps[this.nowStepId]) {
        return this.steps[this.nowStepId].files || [];
      }

      return [];
    },
    articles() {
      return this.tocArticleSteps;
    },
    steps() {
      return this.tocStepFiles;
    },
  },
  watch: {
    articleModifySteps: debounce(function(newVal) {
      const { collectionId } = this.$route.query;

      // 更新服务端关于步骤编排
      this.fetchStepRearrange({
        collectionId,
        articleModifySteps: newVal,
      });

      this.nowFetchStatus = REARRANGE_STATUS.STEP_REARRANGE;
    }, 1000),
    fileModifySteps: debounce(function(newVal) {
      // 更新服务端关于文件的编排
      this.fetchFileRearrange({
        articleId: this.nowArticleId,
        stepId: this.nowStepId,
        fileModifySteps: newVal,
      });

      this.nowFetchStatus = REARRANGE_STATUS.FILE_REARRANGE;
    }, 1000),
    tocSucceed(newVal) {
      if (newVal) this.$message.success(`${this.nowFetchStatus} 保存成功！`);
    },
    tocError(newVal) {
      if (newVal) this.$message.error(`${this.nowFetchStatus} 保存失败！`);
    },
  },
  mounted() {
    const { collectionId } = this.$route.query;

    // 只获取此 collectionId 下所有的文章，及其 steps
    this.fetchTocArticleSteps({
      collectionId,
    });
  },
  data() {
    return {
      visible: false,
      nowStepId: null,
      nowArticleId: null,
      nowFetchStatus: null,
      articleModifySteps: [],
      fileModifySteps: [],
      // 在实现上还是文集拆分成多篇文章，每篇文章有多个 steps
      // 至于每个 step 里面的文件顺序调整，这里考虑是打开一个 modal，然后跳转 file 的位置
      // 那么 API 的设计要调整，每次进入到文章编排时
      // articles: [
      //   {
      //     id: 'article 1',
      //     name: 'article 1',
      //     type: 'container',
      //     steps: generateItems(10, (i) => ({
      //       id: '1' + i,
      //       name: 'Draggable 1 ' + i,
      //       type: 'draggable',
      //     })),
      //   },
      //   {
      //     id: 'article 2',
      //     name: 'article 2',
      //     type: 'container',
      //     steps: generateItems(10, (i) => ({
      //       id: '2' + i,
      //       name: `Draggable 2 - ${i}`,
      //       type: 'draggable',
      //     })),
      //   },
      //   {
      //     id: 'article 3',
      //     name: 'article 3',
      //     type: 'container',
      //     steps: generateItems(10, (i) => ({
      //       id: '3' + i,
      //       name: `Draggable 3 - ${i}`,
      //       type: 'draggable',
      //     })),
      //   },
      // ],
      // steps: {
      //   '10': {
      //     name: 'step 1',
      //     files: generateItems(20, (i) => ({
      //       id: '1' + i,
      //       file: 'file 1 ' + i,
      //       type: 'draggable',
      //     })),
      //   },
      // },
    };
  },
  methods: {
    ...mapActions('toc', [
      'fetchTocArticleSteps',
      'fetchTocStepFiles',
      'fetchStepRearrange',
      'fetchFileRearrange',
    ]),
    ...mapMutations('toc', ['setTocArticleSteps']),
    // 这里设置一个缓冲，在 N 秒内收到的 Drop 请求合并成一次请求
    // 相当于是前端做一次变更，服务端做一次变更
    onDrop(index, dropResult) {
      console.log('dropResult', dropResult, index);

      // 首先前端更新
      this.articles[index].steps = applyDrag(
        this.articles[index].steps,
        dropResult,
      );

      // 然后服务端更新，这里走一个 debounce 做 batch update，具体体现在 watch.articleModifySteps
      this.articleModifySteps.push(dropResult);
    },
    getChildPayload(index) {
      console.log('index', index);
      return (stepIndex) => {
        console.log('this.articles[index]', this.articles, stepIndex);
        return this.articles[index].steps[stepIndex];
      };
    },
    addNewPage() {
      const index = this.tocArticleSteps.length;
      const newTocArticleSteps = [
        ...this.tocArticleSteps,
        {
          id: `article ${index + 1}`,
          name: `article ${index + 1}`,
          type: 'container',
          steps: [],
        },
      ];

      this.setTocArticleSteps(newTocArticleSteps);
    },
    handleOpenFileArrangeModal(articleId, stepId) {
      this.nowArticleId = articleId;
      this.nowStepId = stepId;
      const { collectionId } = this.$route.query;

      // 获取此 step 下的所有 file
      // TODO: 这里后续有个 loading 的过程
      this.fetchTocStepFiles({
        collectionId,
        articleId,
        stepId,
      });
      this.visible = true;
    },
    onFileDrop(dropResult) {
      const step = this.steps[this.nowStepId];

      // 首先前端更新
      step.files = applyDrag(step.files, dropResult);

      // 然后服务端更新，这里走一个 debounce 做 batch update，具体体现在 watch.fileModifySteps
      this.fileModifySteps.push(dropResult);
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
