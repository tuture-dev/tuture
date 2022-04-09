<template>
  <div class="bg-gray-100 h-screen">
    <p class="py-6 text-xl text-center">{{ meta.name }}</p>
    <ul>
      <li
        v-for="article in articles"
        :class="{ 'bg-white': article.id === nowArticleId }"
        :key="article.id"
        :id="article.id"
        @click="onClickCatalogueItem(article.id)"
      >
        <span>
          <a-tooltip
            placement="right"
            :mouseEnterDelay="0.5"
            :title="article.name"
          >
            <span>{{ article.name }}</span>
          </a-tooltip>
        </span>
        <span @click.stop="onToggleChildDrawer('edit', article.id)">
          <Icon type="icon-moreread"></Icon>
        </span>
      </li>
      <a-divider class="w-64 ml-6"></a-divider>
      <ul>
        <li @click="onToggleChildDrawer('create')">
          <span>添加新页</span>
          <span>
            <Icon type="icon-plus"></Icon>
          </span>
        </li>
        <li @click="onToggleDrawer('CollectionSetting')">
          <span>文集设置</span>
          <span>
            <Icon type="icon-setting"></Icon>
          </span>
        </li>
        <li @click="onToggleToc">
          <span>步骤编排</span>
          <span>
            <Icon type="icon-profile"></Icon>
          </span>
        </li>
      </ul>
    </ul>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
import { mapState, mapMutations, mapActions } from 'vuex';

import Icon from '@/components/common/Icon.vue';

export default defineComponent({
  name: 'CollectionCatalogue',
  components: {
    Icon,
  },
  computed: {
    ...mapState('editor', ['nowArticleId']),
    ...mapState('collection', ['meta', 'articles']),
    ...mapState('drawer', ['childVisible', 'childDrawerType']),
  },
  methods: {
    ...mapMutations('collection', ['setEditArticleId']),
    ...mapMutations('editor', ['setNowArticleId']),
    ...mapMutations('toc', ['setTocVisible']),
    ...mapMutations('drawer', [
      'setVisible',
      'setChildVisible',
      'setDrawerType',
      'setChildDrawerType',
    ]),
    onClickCatalogueItem(articleId) {
      this.setNowArticleId(articleId);
      this.$router
        .push({ name: 'Article', params: { id: articleId } })
        .catch(() => {});
    },
    onToggleDrawer(drawerType) {
      this.setVisible(!this.visible);
      this.setDrawerType(drawerType);
    },
    onToggleChildDrawer(drawerType, articleId) {
      if (drawerType === this.drawerType && this.childVisible) {
        this.setChildVisible(false);
      } else {
        this.setChildVisible(true);
      }

      if (drawerType === 'edit' && articleId) {
        this.setEditArticleId(articleId);
      }

      this.setChildDrawerType(drawerType);
    },
    onToggleToc() {
      const { id } = this.$route.params;
      this.$router.push({ path: `/toc?collectionId=${id}` });
    },
  },
});
</script>

<style scoped>
ul {
  @apply p-0 m-0 w-full list-none;
}

li {
  @apply h-9 leading-9 flex flex-row justify-between pl-6 pr-6 mb-2 hover:bg-white hover:cursor-pointer;
}
</style>
