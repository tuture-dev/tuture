<template>
  <a-drawer
    class="ml-20"
    placement="left"
    :destroyOnClose="true"
    :zIndex="12"
    :width="800"
    :title="title"
    :visible="childVisible"
    @close="setChildVisible(false)"
  >
    <CreateEditArticle></CreateEditArticle>
  </a-drawer>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapMutations, mapState } from 'vuex';

import CreateEditArticle from './CreateEditArticle.vue';

const mapTypeToTitle = {
  create: '新建文章',
  edit: '编辑文章',
};

export default defineComponent({
  name: 'ChildDrawer',
  components: {
    CreateEditArticle,
  },
  computed: {
    title() {
      return mapTypeToTitle[this.childDrawerType];
    },
    ...mapState('drawer', ['childVisible', 'childDrawerType']),
  },
  methods: {
    ...mapMutations('drawer', ['setChildVisible']),
  },
});
</script>

<style scoped></style>
