import { watch } from 'vue-demi';
import { useStorage } from '@vueuse/core';
import { useGetters, useRouter } from '@u3u/vue-hooks';

export default function useNowArticleId() {
  const { route } = useRouter();
  const firstArticle = useGetters('collection', ['getFirstArticle'])
    .getFirstArticle;
  const nowArticleId = useStorage(
    'now-article-id',
    route.value.params.id || firstArticle ? firstArticle.id : '',
  );

  watch(route, (updated) => {
    nowArticleId.value = updated.params.id;
  });

  watch(firstArticle, (updated) => {
    console.log('updated', updated);
    nowArticleId.value = updated.id;
  });

  return { nowArticleId };
}
