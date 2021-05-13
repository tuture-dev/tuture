import { useStorage } from '@vueuse/core';
import { useStore } from '@u3u/vue-hooks';

export default function useNowArticleId() {
  const store = useStore();
  const firstArticle = store.value.state.collection.articles[0];
  const nowArticleId = useStorage(
    'now-article-id',
    firstArticle ? firstArticle.id : 0,
  );
  return { nowArticleId };
}
