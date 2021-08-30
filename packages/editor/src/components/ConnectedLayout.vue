<template>
  <a-layout>
    <a-affix>
      <Drawer></Drawer>
    </a-affix>
    <a-affix>
      <ChildDrawer></ChildDrawer>
    </a-affix>
    <a-layout>
      <slot></slot>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { defineComponent } from 'vue-demi';

import Drawer from './drawer/Drawer.vue';
import ChildDrawer from './drawer/ChildDrawer.vue';
import MainMenu from './MainMenu.vue';

export default defineComponent({
  name: 'ConnectedLayout',
  components: {
    Drawer,
    ChildDrawer,
    MainMenu,
  },
});
</script>

<style scoped></style>
