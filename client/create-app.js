// 类似于 ./index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import App from './app.vue'
import createStore from './store/store'
import createRouter from './config/router'

import './assets/styles/global.styl'
import Notification from './components/notification'
import Tabs from './components/tabs'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta)
Vue.use(Tabs)

// 下面这样，我们的组件就定义再全局了
Vue.use(Notification)
    // 每一次都要重新创建一个，否则会出现内存溢出
export default () => {
    const router = createRouter()
    const store = createStore()
    const app = new Vue({
        router,
        store,
        render: (h) => h(App)
    })
    return { app, router, store }
}
