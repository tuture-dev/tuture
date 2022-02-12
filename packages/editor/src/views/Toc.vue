<template>
  <a-spin :spinning="tocLoading">
    <div class="bg-gray-200 h-screen">
      <step-allocation></step-allocation>
    </div>
  </a-spin>
</template>

<script>
import { defineComponent } from 'vue-demi';
import { mapActions, mapState } from 'vuex';

import StepAllocation from '@/components/toc/StepAllocation.vue';

export default defineComponent({
  components: {
    StepAllocation,
  },
  computed: {
    ...mapState('toc', [
      'tocVisible',
      'tocLoading',
      'tocSaving',
      'releasedSteps',
      'articleSteps',
    ]),
  },
  methods: {
    ...mapActions('toc', ['fetchToc']),
  },
  mounted() {
    this.fetchToc();
  },
});
</script>

<style></style>
