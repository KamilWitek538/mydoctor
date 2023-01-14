import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

let base = axios.create({
  baseURL: "http://localhost:3091/",
  timeout: 5000,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json"
  }
});

Vue.prototype.$api = base;

const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$api.defaults.headers.common["Authorization"] = token;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");