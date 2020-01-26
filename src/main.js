import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";

import TreeTable from "vue-table-with-tree-grid";

//导入字体图标
import "./assets/fonts/iconfont.css";

//导入全局样式表
import "./assets/css/base.css";

//导入axios包
import axios from "axios";
Vue.prototype.$http = axios;
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`;

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

Vue.component("tree-table", TreeTable);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
