import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {axiosGet,axiosPost,axiosDelete} from "@/serverApi/request";
import axios from 'axios';
import "@/assets/global.css";

Vue.config.productionTip = false

Vue.use(ElementUI);

//请求方法

Vue.prototype.$axiosGet = axiosGet;
Vue.prototype.$axiosPost = axiosPost;
Vue.prototype.$axiosDelete = axiosDelete;
axios.defaults.baseURL = '/api'

// const token = localStorage.getItem('token');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 将令牌添加到默认请求头部
// } else {
//   router.push('/login'); // 没有令牌则直接跳转到登录页面
// }
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
