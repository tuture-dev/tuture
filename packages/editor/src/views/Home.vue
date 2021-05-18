<template>
  <div class="bg-gray-100"></div>
</template>

<script setup>
import { watch } from 'vue-demi';
import { useRouter } from '@u3u/vue-hooks';

import useNowArticleId from '@/use/useNowArticleId';

export default {
  name: 'Home',
  setup() {
    const { nowArticleId } = useNowArticleId();
    const { router } = useRouter();

    watch(
      nowArticleId,
      () => {
        console.log('nowArticleId', nowArticleId);
        if (nowArticleId.value) {
          router.push({
            name: 'Article',
            params: { id: nowArticleId.value },
          });
        }
      },
      { immediate: true },
    );

    return {
      nowArticleId,
    };
  },
};
</script>
