<template>
  <div class="w-auto m-auto">
    <a-row>
      <a-col :span="8" class="box-border">
        <div class="pl-6 pr-6">
          <div class="pb-4 border-b">
            <h5 class="text-base">待分配步骤</h5>
            <p class="text-sm font-normal mt-2">把步骤分配给目录中对应的文章</p>
          </div>
        </div>
        <div class="menu-body">
          <div class="w-full my-4">
            <a-input-search placeholder="搜索步骤的标题" style="height: 40px" />
          </div>
          <ul class="list-none">
            <li
              v-for="step in releasedSteps"
              :key="step.id"
              class="step-list-item px-4 h-12"
            >
              <OutdatedTag v-if="step.oudated"></OutdatedTag>
              <span>{{ step.title }}</span>
            </li>
          </ul>
        </div>
      </a-col>
      <a-col
        :span="16"
        class="box-border bg-white border border-gray-50 px-12 py-8"
      >
        <div class="border-b border-gray-100 pb-4">
          <h1 class="text-2xl">文集目录</h1>
          <p class="text-sm mt-2 font-normal text-gray-400">
            选择文章，点击添加或拖拽左边的步骤进行分配
          </p>
        </div>
        <div>
          <ul class="list-none mt-4">
            <li
              v-for="item in articleSteps"
              class="step-list-item h-10 px-4"
              :key="item.id"
              :style="{ marginLeft: item.type == 'article' ? '0px' : '24px' }"
            >
              <span class="">
                <a-icon
                  v-if="item.type === 'article'"
                  class="icon"
                  type="caret-right"
                ></a-icon>
                <OutdatedTag
                  v-if="item.type === 'step' && item.outdated"
                ></OutdatedTag>
                <span
                  class="whitespace-nowrap overflow-ellipsis overflow-hidden"
                  :style="{ width: item.outdated ? '390px' : '430px' }"
                >
                  {{ item.title }}
                </span>
              </span>
              <span
                v-if="item.type === 'step'"
                class="list-item-action list-item-tail"
                >步骤</span
              >
              <span class="list-item-action hidden">
                <a-icon type="delete"></a-icon>
              </span>
            </li>
          </ul>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue-demi';
import OutdatedTag from './widgets/OutdatedTag.vue';

export default defineComponent({
  components: {
    OutdatedTag,
  },
  data() {
    return {
      releasedSteps: [
        {
          id: '1',
          commit: '60a60d7',
          title: '从服务器获取数据',
          articleId: '',
          outdated: false,
        },
        {
          id: '2',
          commit: '5f1edd9',
          title: '实现食谱的编辑和创建页面',
          articleId: '',
          outdated: true,
        },
      ],
      articleSteps: [
        {
          type: 'article',
          id: '1',
          title: '第一篇教程',
        },
        {
          type: 'step',
          id: '2',
          commit: '60a60d7',
          title: '从服务器获取数据',
          articleId: '',
          outdated: false,
        },
        {
          type: 'step',
          id: '3',
          commit: '5f1edd9',
          title: '实现食谱的编辑和创建页面',
          articleId: '',
          outdated: true,
        },
        {
          type: 'article',
          id: '4',
          title: '第二篇教程',
        },
        {
          type: 'step',
          id: '5',
          commit: '60a60d7',
          title: '从服务器获取数据',
          articleId: '',
          outdated: false,
        },
        {
          type: 'step',
          id: '6',
          commit: '5f1edd9',
          title: '实现食谱的编辑和创建页面',
          articleId: '',
          outdated: true,
        },
      ],
    };
  },
  setup() {},
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

.icon > svg {
  width: 10px;
  height: 10px;
}
</style>
