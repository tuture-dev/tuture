import { onMounted, ref } from 'vue-demi';
import { debouncedWatch } from '@vueuse/core';

export default function useArticleDoc(articleId) {
  const doc = ref({ type: 'doc', content: [] });

  onMounted(async () => {
    const resp = await fetch(`/api/articles/${articleId}`);
    doc.value = await resp.json();
  });

  debouncedWatch(
    doc,
    () => {
      fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doc.value),
      });
    },
    { debounce: 1000 },
  );

  return { doc };
}
