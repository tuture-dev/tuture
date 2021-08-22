import { watch } from 'vue-demi';
import { useStorage } from '@vueuse/core';
import { useGetters, useRouter } from '@u3u/vue-hooks';

export default function useNowArticleId() {
  const { route } = useRouter();
  const firstArticle = useGetters('collection', ['getFirstArticle'])
    .getFirstArticle;
  const nowArticleId = useStorage(
    'now-article-id',
    firstArticle ? firstArticle.id : '',
  );
  if (route.value.params.id) {
    nowArticleId.value = route.value.params.id;
  }

  watch(route, (updated) => {
    nowArticleId.value = updated.params.id;
  });

  return { nowArticleId };
}
