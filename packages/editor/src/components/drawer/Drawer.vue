<template>
  <a-drawer
    class="ml-20"
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

import CollectionCatalogue from './CollectionCatalogue.vue';
import CollectionSetting from './CollectionSetting.vue';
import ContactUs from './ContactUs.vue';

const mapTypeToTitle = {
  CollectionCatalogue: '文集目录',
  CollectionSetting: '文集设置',
  ContactUs: '联系我们',
};

export default defineComponent({
  name: 'Drawer',
  components: {
    CollectionCatalogue,
    CollectionSetting,
    ContactUs,
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
