import Vue from 'vue';
import { createApp, h } from 'vue-demi';
import {
  Affix,
  Anchor,
  Button,
  Divider,
  Drawer,
  Layout,
  Menu,
  Tooltip,
  Row,
  Col,
} from 'ant-design-vue';

import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';

Vue.config.productionTip = false;

Vue.use(Affix);
Vue.use(Anchor);
Vue.use(Button);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Tooltip);
Vue.use(Row);
Vue.use(Col);

const app = createApp({
  router,
  store,
  render: () => h(App),
});

app.mount('#app');
