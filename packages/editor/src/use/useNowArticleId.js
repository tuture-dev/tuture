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

  // When the route changes, nowArticleId must change accordingly.
  watch(route, (updated) => {
    nowArticleId.value = updated.params.id;
  });

  // Prevent the case where firstArticle is not ready at first.
  watch(firstArticle, (updated) => {
    if (!nowArticleId.value) {
      nowArticleId.value = updated.id;
    }
  });

  return { nowArticleId };
}
