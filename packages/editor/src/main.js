import Vue from 'vue';
import { createApp, h } from 'vue-demi';
import VueCompositionAPI from '@vue/composition-api';
import hooks from '@u3u/vue-hooks';
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
  Select,
  Spin,
  FormModel,
  Input,
  Icon,
  Transfer,
  Tag,
  Switch,
} from 'ant-design-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faLink,
  faUnderline,
  faChevronLeft,
  faChevronRight,
  faTrashAlt,
  faChevronDown,
  faChevronUp,
  faAlignCenter,
  faAlignRight,
  faAlignLeft,
  faHeading,
  faListOl,
  faListUl,
  faCheck,
  faTable,
  faQuoteLeft,
  faFileCode,
  faGripHorizontal,
  faImage,
  faTint,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';
import store from './store';
import './index.scss';

library.add(
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
  faCode,
  faLink,
  faChevronLeft,
  faChevronRight,
  faTrashAlt,
  faChevronDown,
  faChevronUp,
  faAlignCenter,
  faAlignRight,
  faAlignLeft,
  faListOl,
  faListUl,
  faHeading,
  faCheck,
  faTable,
  faQuoteLeft,
  faFileCode,
  faGripHorizontal,
  faImage,
  faTint,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(hooks);
Vue.use(VueCompositionAPI);

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
Vue.use(Select);
Vue.use(Spin);
Vue.use(FormModel);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Transfer);
Vue.use(Tag);
Vue.use(Select);
Vue.use(Switch);

// 捕获 monaco 的 unhandledrejection
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.name === 'Canceled') {
    // monaco editor promise cancelation
    event.preventDefault();
  }
});

const app = createApp({
  router,
  store,
  render: () => h(App),
});

app.mount('#app');
