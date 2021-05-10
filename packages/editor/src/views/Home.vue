<template>
  <div class="p-10 text-center">
    <h1>这里是主页</h1>
    <img class="inline" alt="Tuture logo" src="../assets/logo.svg" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
