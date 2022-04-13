<template>
  <div class="grid grid-cols-4 gap-4 px-4 pt-6 h-full">
    <div class=" box-border px-6 py-8 bg-white rounded-sm">
      <div>
        <div class="pb-4 border-b">
          <h5 class="text-base">待分配步骤</h5>
          <p class="text-sm font-normal mt-2">
            把步骤分配给目录中对应的文章
          </p>
        </div>
      </div>
      <div class="">
        <div class="w-full my-4">
          <a-input-search placeholder="搜索步骤的标题" style="height: 40px" />
        </div>
        <ul class="list-none">
          <li
            v-for="step in releasedSteps"
            :key="step.id"
            class="step-list-item px-4 h-12"
          >
            <span>
              <OutdatedTag v-if="step.outdated"></OutdatedTag>
              <span class="step-title">{{ step.name }}</span>
            </span>
            <span>
              <a-popconfirm
                class="mr-1"
                v-if="step.outdated"
                title="确定删除此过时步骤吗？"
                @confirm="deleteReleasedStep(step.id)"
              >
                <a-icon type="delete"></a-icon>
              </a-popconfirm>
              <span class="list-item-action hidden" @click="assignStep(step)">
                <span class="mr-1">添加</span>
                <a-icon type="double-right"></a-icon>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="col-span-2 box-border bg-white border border-gray-50 px-8 py-8 rounded-sm"
    >
      <div class="border-b border-gray-100 pb-4">
        <h1 class="text-2xl">文集目录</h1>
        <p class="text-sm mt-2 font-normal text-gray-400">
          选择文章，点击添加或拖拽左边的步骤进行分配
        </p>
      </div>
      <div>
        <ul class="list-none pl-0">
          <li
            v-for="item in articleSteps"
            v-show="item.type === 'article' || item.articleId === activeArticle"
            :key="item.id"
            class="step-list-item h-10 px-4"
            :class="{
              'ml-6': item.type === 'step',
              'border-green-600': item.id === activeArticle,
            }"
            @click="toggleActiveArticle(item)"
          >
            <span>
              <a-icon
                v-if="item.type === 'article'"
                :type="activeArticle == item.id ? 'caret-down' : 'caret-right'"
              ></a-icon>
              <OutdatedTag
                v-if="item.type === 'step' && item.outdated"
              ></OutdatedTag>
              <span
                class="step-title"
                :style="{ width: item.outdated ? '390px' : '430px' }"
              >
                {{ item.name }}
              </span>
            </span>
            <span
              v-if="item.type === 'step'"
              class="list-item-action list-item-tail"
              >步骤</span
            >
            <span class="list-item-action hidden">
              <a-popconfirm
                title="确认要删除文章吗？"
                v-if="item.type === 'article'"
                @confirm="deleteArticle(item)"
              >
                <a-icon type="delete"></a-icon>
              </a-popconfirm>
              <span v-else @click="releaseStep(item)">
                <a-icon type="delete"></a-icon>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="px-6 py-8 bg-white h-full rounded-sm">
      <div>
        <div class="pb-4 border-b">
          <h5 class="text-base">移动文件</h5>
          <p class="text-sm font-normal mt-2">
            对选中步骤中的文件位置进行调整
          </p>
        </div>
      </div>
      <div class="">
        <div class="w-full my-4">
          <a-input-search placeholder="搜索步骤的标题" style="height: 40px" />
        </div>
        <ul class="list-none">
          <li
            v-for="step in releasedSteps"
            :key="step.id"
            class="step-list-item px-4 h-12"
          >
            <span>
              <OutdatedTag v-if="step.outdated"></OutdatedTag>
              <span class="step-title">{{ step.name }}</span>
            </span>
            <span>
              <a-popconfirm
                class="mr-1"
                v-if="step.outdated"
                title="确定删除此过时步骤吗？"
                @confirm="deleteReleasedStep(step.id)"
              >
                <a-icon type="delete"></a-icon>
              </a-popconfirm>
              <span class="list-item-action hidden" @click="assignStep(step)">
                <span class="mr-1">添加</span>
                <a-icon type="double-right"></a-icon>
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapState, mapMutations, mapActions } from 'vuex';
import omit from 'lodash.omit';

import OutdatedTag from './widgets/OutdatedTag.vue';

export default defineComponent({
  components: {
    OutdatedTag,
  },
  data() {
    return {
      activeArticle: '1',
    };
  },
  computed: {
    ...mapState('toc', [
      'tocVisible',
      'tocLoading',
      'tocSaving',
      'releasedSteps',
      'articleSteps',
    ]),
  },
  methods: {
    ...mapMutations('toc', [
      'setTocVisible',
      'setReleasedSteps',
      'deleteReleasedStep',
      'setArticleSteps',
      'insertArticleStep',
    ]),
    ...mapActions('toc', ['fetchToc', 'saveToc']),
    ...mapActions('editor', ['fetchDoc']),
    toggleActiveArticle(item) {
      if (item.type === 'article') {
        this.activeArticle = item.id;
      }
    },
    handleInsertStep(step, stepList) {
      const insertIndex = stepList.findIndex(
        (stepItem) => stepItem.order > step.order,
      );

      if (insertIndex > -1) {
        return [
          ...stepList.slice(0, insertIndex),
          omit(step, ['articleId']),
          ...stepList.slice(insertIndex),
        ];
      } else {
        return stepList.concat(omit(step, ['articleId']));
      }
    },
    assignStep(item) {
      if (!this.releasedSteps) return;
      if (!this.activeArticle) {
        return this.$message.warning('请选中文章，再添加步骤');
      }

      console.log('this.articleSteps', this.articleSteps);
      const targetArticleStepIndex = this.articleSteps.findIndex(
        (step) =>
          step.type === 'step' &&
          step.articleId === this.activeArticle &&
          step.order > item.order,
      );

      // The index to insert this item.
      let insertIndex;

      if (targetArticleStepIndex < 0) {
        const articleIndex = this.articleSteps.findIndex(
          (articleStep) => articleStep.id === this.activeArticle,
        );
        const articleStepsLen = this.articleSteps.filter(
          (articleStep) =>
            articleStep.type === 'step' &&
            articleStep.articleId === this.activeArticle,
        ).length;

        if (articleStepsLen > 0) {
          insertIndex = articleIndex + articleStepsLen + 1;
        } else {
          insertIndex = articleIndex + 1;
        }
      } else {
        insertIndex = targetArticleStepIndex;
      }

      this.insertArticleStep({
        start: insertIndex,
        item: { ...item, articleId: this.activeArticle },
      });
      this.deleteReleasedStep(item.id);
    },
    releaseStep(item) {
      if (item.type === 'article') {
        return this.deleteArticle(item);
      }
      const newArticleSteps = this.articleSteps.filter(
        (articleStep) => articleStep.id !== item.id,
      );
      this.setArticleSteps(newArticleSteps);

      const newUnassignedStepList = this.handleInsertStep(
        item,
        this.releasedSteps,
      );
      this.setReleasedSteps(newUnassignedStepList);
    },
    deleteArticle(item) {
      const stepList = this.articleSteps.filter(
        (step) => step.type === 'step' && step.articleId === item.id,
      );
      const newUnassignedStepList = stepList.reduce(
        (unassignedStepList, currentStep) =>
          this.handleInsertStep(currentStep, unassignedStepList),
        this.releasedSteps,
      );
      const newArticleStepList = this.articleSteps.filter(
        (step) =>
          (step.type === 'step' && step.articleId !== item.id) ||
          (step.type === 'article' && step.id !== item.id),
      );

      this.setReleaseSteps(newUnassignedStepList);
      this.setArticleSteps(newArticleStepList);
      this.activeArticle = '';
    },
    handleOk() {
      this.saveToc()
        .then(() => {
          this.$message.success('保存成功');
          this.fetchDoc();
        })
        .catch((err) => this.$message.error(err));
    },
    handleCancel() {
      this.setTocVisible(false);
    },
  },
  mounted() {
    this.fetchToc()
      .then(() => {
        const firstArticle = this.articleSteps.filter(
          (articleStep) => articleStep.type === 'article',
        )[0];
        if (firstArticle) {
          this.activeArticle = firstArticle.id;
        }
      })
      .catch((err) => {
        this.$message.error(err);
      });
  },
});
</script>

<style scoped>
.step-list-item {
  @apply relative flex flex-row justify-between items-center bg-gray-50 rounded border border-solid border-gray-300 my-4;
}

.step-list-item:hover {
  @apply cursor-pointer;
}

.step-list-item:hover .list-item-action {
  display: inline-block;
}

.step-list-item:hover .list-item-tail {
  display: none;
}

.list-item-action {
  @apply text-xs font-normal text-gray-400;
}

.step-title {
  @apply whitespace-nowrap overflow-ellipsis overflow-hidden;
}
</style>
