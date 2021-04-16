<template>
  <div class="hello world">
    <a-button type="primary" @click="switchColor">Hail Tuture!</a-button>
    <span>{{ x }}</span> 和 <span>{{ y }}</span>
    <div ref="el" style="--color: #7fa998; color: var(--color)">
      Sample text, {{ color }}
    </div>
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue-demi';
import { useMouse, useCssVar } from '@vueuse/core';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup(props) {
    const el = ref(null);
    const { x, y } = useMouse();
    const color = useCssVar('--color', el);

    console.log('props', props);

    const switchColor = () => {
      if (color.value === '#df8543') color.value = '#7fa998';
      else color.value = '#df8543';
    };

    return { x, y, switchColor, color };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
