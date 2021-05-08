<template>
  <div>
    <ul>
      <li
        v-for="article in articles"
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
      </ul>
    </ul>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
import { mapState, mapMutations } from 'vuex';

import Icon from '@/components/common/Icon.vue';

export default defineComponent({
  name: 'CollectionCatalogue',
  components: {
    Icon,
  },
  computed: {
    ...mapState('collection', ['articles']),
    ...mapState('drawer', ['childVisible', 'childDrawerType']),
  },
  methods: {
    ...mapMutations('collection', ['setEditArticleId']),
    ...mapMutations('drawer', [
      'setVisible',
      'setChildVisible',
      'setChildDrawerType',
    ]),
    onClickCatalogueItem(articleId) {
      this.setVisible(false);
      this.$router.push({ name: 'Article', params: { id: articleId } });
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
  },
});
</script>

<style scoped>
ul {
  @apply p-0 m-0 w-full list-none;
}

li {
  @apply h-9 leading-9 flex flex-row justify-between pl-6 pr-6 mb-2 hover:bg-gray-50 hover:cursor-pointer;
}
</style>
