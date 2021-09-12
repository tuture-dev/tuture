<template>
  <a-row class="h-full">
    <a-modal title="步骤编排" width="70%" :visible="true">
      <StepAllocation></StepAllocation>
    </a-modal>
    <a-affix>
      <Drawer></Drawer>
    </a-affix>
    <a-affix>
      <ChildDrawer></ChildDrawer>
    </a-affix>
    <a-col :span="5">
      <a-affix>
        <CollectionCatalogue></CollectionCatalogue>
      </a-affix>
    </a-col>
    <a-col class="bg-white h-full" :span="14">
      <ArticleBody></ArticleBody>
    </a-col>
    <a-col :span="5">
      <a-affix>
        <ArticleCatalogue></ArticleCatalogue>
      </a-affix>
    </a-col>
  </a-row>
</template>

<script setup>
import { defineComponent } from 'vue-demi';

import Drawer from '@/components/drawer/Drawer.vue';
import ChildDrawer from '@/components/drawer/ChildDrawer.vue';
import ArticleBody from '@/components/ArticleBody.vue';
import ArticleCatalogue from '@/components/ArticleCatalogue.vue';
import CollectionCatalogue from '@/components/CollectionCatalogue.vue';
import StepAllocation from '@/components/StepAllocation.vue';

export default defineComponent({
  components: {
    ArticleBody,
    ArticleCatalogue,
    CollectionCatalogue,
    Drawer,
    ChildDrawer,
    StepAllocation,
  },
});
</script>
