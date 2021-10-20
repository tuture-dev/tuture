import { onMounted, ref, watch } from 'vue-demi';
import { debouncedWatch } from '@vueuse/core';

export default function useArticleDoc(articleId) {
  const doc = ref({ type: 'doc', content: [] });
  const refresh = async () => {
    const resp = await fetch(`/api/articles/${articleId.value}`);
    doc.value = await resp.json();
  };

  onMounted(() => {
    if (articleId) refresh();
  });

  watch(articleId, async () => {
    if (articleId) refresh();
  });

  debouncedWatch(
    doc,
    () => {
      console.log('doc changed!');
      // fetch(`/api/articles/${articleId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(doc.value),
      // });
    },
    { debounce: 1000 },
  );

  return { doc, refresh };
}
