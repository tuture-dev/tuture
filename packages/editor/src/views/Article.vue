<template>
  <a-row class="h-full">
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

<script>
import { defineComponent } from 'vue-demi';

import ArticleBody from '@/components/ArticleBody.vue';
import ArticleCatalogue from '@/components/ArticleCatalogue.vue';
import CollectionCatalogue from '@/components/CollectionCatalogue.vue';

export default defineComponent({
  components: {
    ArticleBody,
    ArticleCatalogue,
    CollectionCatalogue,
  },
});
</script>
