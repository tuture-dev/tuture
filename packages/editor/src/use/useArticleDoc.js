import { onMounted, ref, watch } from 'vue-demi';
import { debouncedWatch } from '@vueuse/core';

export default function useArticleDoc(articleId) {
  const doc = ref({ type: 'doc', content: [] });

  onMounted(async () => {
    if (articleId) {
      const resp = await fetch(`/api/articles/${articleId.value}`);
      doc.value = await resp.json();
    }
  });

  watch(articleId, async () => {
    if (articleId) {
      const resp = await fetch(`/api/articles/${articleId.value}`);
      doc.value = await resp.json();
    }
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

  return { doc };
}
