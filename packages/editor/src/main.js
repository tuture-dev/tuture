import Vue from 'vue';
import { createApp, h } from 'vue-demi';
import { Button } from 'ant-design-vue';

import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';

Vue.config.productionTip = false;

Vue.use(Button);

const app = createApp({
  router,
  store,
  render: () => h(App),
});

app.mount('#app');
