import Vue from 'vue';
import { createApp, h } from 'vue-demi';
import { Affix, Button, Drawer, Layout, Menu } from 'ant-design-vue';

import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';

Vue.config.productionTip = false;

Vue.use(Affix);
Vue.use(Button);
Vue.use(Drawer);
Vue.use(Layout);
Vue.use(Menu);

const app = createApp({
  router,
  store,
  render: () => h(App),
});

app.mount('#app');
