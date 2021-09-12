import { watch } from 'vue-demi';
import { useFetch } from '@vueuse/core';
import { useStore } from '@u3u/vue-hooks';

export default function useFetchArticles() {
  const store = useStore();
  const { isFetching, error, data } = useFetch('/api/articles').json();

  watch(data, () => {
    store.value.commit('collection/setArticles', data.value);
  });

  return { isFetching, error };
}
