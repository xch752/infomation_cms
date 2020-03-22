// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import echarts from 'echarts' // echarts
import router from './router'
import 'bootstrap3/dist/css/bootstrap.css' // 引入bootstrap css样式
import 'bootstrap3/dist/js/bootstrap.js' // 引入bootstrap js
import '../src/assets/theme/index.css' // 使用自定义element ui 主题样式
import '../src/assets/common/common.css' // 自定义样式
import Bmob from "hydrogen-js-sdk" //云数据库

Bmob.initialize("065590be294853c1", "752752", "d1b2bbf90fdd31300d53eda95e19106d"); // Bmob SDK初始化
Vue.prototype.$echarts = echarts
Vue.prototype.Bmob = Bmob // Bomb 挂载
Vue.use(ElementUI);
Vue.config.productionTip = false

// 路由 全局前置守卫
router.beforeEach((to, from, next) => {
  let bomb = sessionStorage.getItem('bmob')
  if (bomb) {
    next()
  } else {
    if (to.path !== '/login') {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
