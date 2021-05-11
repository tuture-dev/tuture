<template>
  <div class="bg-gray-100"></div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    this.$router.push({ name: 'Article', params: { id: 1 } });
  },
};
</script>
