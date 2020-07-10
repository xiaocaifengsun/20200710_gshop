import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import '@/static/js/reset.js'
import '@/static/css/style.css'
import '@/utils/request'
import 'lodash'
import './filters'
import './components'
import './directives'
import store from './store'
import router from './router'
import mixins from './mixins'
Vue.mixin(mixins);
import vueExt from '@/utils/vue-exts';
Vue.use(vueExt);
/** 其它组件请在各自的页面添加 */
import { Button, Image, Dialog, Toast } from 'vant';
Vue.use(Button).use(Image).use(Dialog).use(Toast);

import axios from "axios";
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')