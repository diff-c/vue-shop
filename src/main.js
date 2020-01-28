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

//导入富文本编辑器
import VueQuillEditor from "vue-quill-editor"; //调用编辑器
// require styles 引入样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

//将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor);

//定义一个全局过滤器格式化时间
Vue.filter("dateFormat", function(originVal) {
  const dt = new Date(originVal);

  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + "").padStart(2, "0");
  const d = (dt.getDate() + "").padStart(2, "0");
  const hh = (dt.getHours() + "").padStart(2, "0");
  const mm = (dt.getMinutes() + "").padStart(2, "0");
  const ss = (dt.getSeconds() + "").padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount("#app");
