<template>
  <a-drawer
    placement="left"
    :zIndex="11"
    :width="300"
    :title="title"
    :visible="visible"
    @close="setVisible(false)"
  >
    <component :is="drawerType"></component>
  </a-drawer>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapMutations, mapState } from 'vuex';

import CollectionCatalogue from '@/components/CollectionCatalogue.vue';
import CollectionSetting from '@/components/CollectionSetting.vue';

const mapTypeToTitle = {
  CollectionSetting: '文集设置',
  Toc: '步骤编排',
};

export default defineComponent({
  name: 'Drawer',
  components: {
    CollectionCatalogue,
    CollectionSetting,
  },
  computed: {
    title() {
      return mapTypeToTitle[this.drawerType];
    },
    ...mapState('drawer', ['visible', 'drawerType']),
  },
  methods: {
    ...mapMutations('drawer', ['setVisible']),
  },
});
</script>

<style scoped></style>
