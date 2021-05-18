import { watch } from 'vue-demi';
import { useFetch } from '@vueuse/core';
import { useStore } from '@u3u/vue-hooks';

export default function useFetchMeta() {
  const store = useStore();
  const { isFetching, error, data } = useFetch('/api/meta').json();

  watch(data, () => {
    store.value.commit('collection/setMeta', data.value);
  });

  return { isFetching, error };
}
