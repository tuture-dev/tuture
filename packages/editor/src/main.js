import Vue from 'vue';
import { createApp, h } from 'vue-demi';

import App from './App.vue';
import router from './router';
import store from './store';

import { Button } from 'ant-design-vue';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(Button);

const app = createApp({
  router,
  store,
  render: () => h(App),
});

app.mount('#app');
