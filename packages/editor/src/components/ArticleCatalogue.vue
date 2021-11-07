<template>
  <div class="p-10 bg-gray-100 h-screen">
    <a-anchor wrapperClass="bg-gray-100">
      <a-anchor-link
        v-for="heading in headings"
        :key="heading.target"
        :href="`#${heading.target}`"
        :title="heading.title"
        :style="{ 'padding-left': `${heading.level - 1}rem` }"
      />
    </a-anchor>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
import { mapState } from 'vuex';
import { getNodeText } from '@tuture/core';

export default defineComponent({
  name: 'ArticleCatalogue',
  computed: {
    ...mapState('editor', ['doc']),
    headings() {
      const convertNodeToHeading = (node) => ({
        target: node.attrs.id,
        title: getNodeText(node),
        level: node.attrs.level,
      });

      const headings = this.doc.content
        .filter((node) => node.type === 'heading' || node.type === 'explain')
        .flatMap((node) => {
          switch (node.type) {
            case 'heading':
              return convertNodeToHeading(node);
            case 'explain':
              return node.content
                .filter((node) => node.type === 'heading')
                .map(convertNodeToHeading);
            default:
              return [];
          }
        });

      return headings;
    },
  },
});
</script>

<style scoped></style>
