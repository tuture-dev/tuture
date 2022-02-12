import './installCompositionApi.js';

import Vue from 'vue';
import { createApp, h } from 'vue-demi';
import hooks from '@u3u/vue-hooks';
import {
  Affix,
  Anchor,
  Button,
  Divider,
  Drawer,
  Layout,
  Menu,
  Modal,
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
  Popover,
  Popconfirm,
  message,
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
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import CodeDiff from 'v-code-diff';

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
  faArrowRight,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(hooks);

Vue.use(Affix);
Vue.use(Anchor);
Vue.use(Button);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Modal);
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
Vue.use(Popover);
Vue.use(Popconfirm);

Vue.use(CodeDiff);

Vue.prototype.$message = message;

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

// app.use(CodeDiff);

app.mount('#app');
