<template>
  <a-drawer
    placement="left"
    :width="300"
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

export default defineComponent({
  name: 'Drawer',
  components: {
    CollectionCatalogue,
    CollectionSetting,
    ContactUs,
  },
  computed: mapState('drawer', ['visible', 'drawerType']),
  methods: {
    ...mapMutations('drawer', ['setVisible']),
  },
});
</script>

<style scoped></style>
